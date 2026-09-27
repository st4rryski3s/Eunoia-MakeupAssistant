import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  Camera,
  Glasses,
  Sun,
  UserRound,
  Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { saveSkinAnalysis } from "../services/supabaseData";
import { buildSkinProfile } from "../analysis/buildProfile";

export default function Scan() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imageElement, setImageElement] =
    useState(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * Stop the camera when leaving the page.
   */
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }

      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  /*
   * Attach the camera stream after React has
   * rendered the video element.
   */
  useEffect(() => {
    if (
      !cameraOpen ||
      !videoRef.current ||
      !streamRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    video.play().catch((videoError) => {
      console.error(
        "Video playback error:",
        videoError
      );
    });

    return () => {
      if (video.srcObject === streamRef.current) {
        video.srcObject = null;
      }
    };
  }, [cameraOpen]);

  /*
   * Start live camera.
   */
  const startCamera = async () => {
    setError("");

    /*
     * Remove any previously selected image.
     */
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage(null);
    setImageElement(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Camera access is not supported by this browser."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

    setCameraOpen(true);

    } catch (cameraError) {
      console.error(
        "Camera access failed:",
        cameraError
      );

      if (
        cameraError.name ===
        "NotAllowedError"
      ) {
        setError(
          "Camera permission was denied. Please allow camera access and try again."
        );
      } else if (
        cameraError.name ===
        "NotFoundError"
      ) {
        setError(
          "No camera was found on this device."
        );
      } else {
        setError(
          "Could not access the camera. Please try again."
        );
      }
    }
  };

  /*
   * Stop live camera.
   */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  /*
   * Capture a frame from the live camera.
   */
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setError(
        "Camera is not ready yet."
      );

      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setError(
        "Camera is still loading. Please wait a moment and try again."
      );

      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      setError(
        "Could not capture the photo."
      );

      return;
    }

    /*
     * Mirror the image so the captured photo
     * matches the live preview.
     */
    context.save();

    context.translate(
      canvas.width,
      0
    );

    context.scale(-1, 1);

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError(
            "Could not create the captured photo."
          );

          return;
        }

        const imageUrl =
          URL.createObjectURL(blob);

        const image = new Image();

        image.onload = () => {
          setSelectedImage(imageUrl);
          setImageElement(image);

          stopCamera();
        };

        image.onerror = () => {
          URL.revokeObjectURL(imageUrl);

          setError(
            "Could not load the captured photo."
          );
        };

        image.src = imageUrl;
      },
      "image/jpeg",
      0.95
    );
  };

  /*
   * Open file picker.
   */
  const handleUploadClick = () => {
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /*
   * Handle uploaded image.
   */
  const handleImageSelected = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    /*
     * Stop camera if it happens to be running.
     */
    stopCamera();

    /*
     * Remove previous image URL.
     */
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    const imageUrl =
      URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      setSelectedImage(imageUrl);
      setImageElement(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);

      setSelectedImage(null);
      setImageElement(null);

      setError(
        "Could not load the image. Please try again."
      );
    };

    image.src = imageUrl;

    /*
     * Allow the same file to be selected again
     * later if needed.
     */
    event.target.value = "";
  };

  /*
   * Run Person 2's existing skin analysis.
   */
  const handleAnalyze = async () => {
    if (!imageElement) {
      setError(
        "Please take or upload a photo first."
      );

      return;
    }

    setError("");
    setIsAnalyzing(true);

    try {
      /*
       * Run P2 analysis.
       */
      const analysis =
        await buildSkinProfile(
          imageElement
        );

      /*
       * Make sure a face was detected.
       */
      if (!analysis.faceDetected) {
        setError(
          "No face was detected. Please try again with your face clearly visible."
        );

        return;
      }

      /*
       * Get logged-in Supabase user.
       */
      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError(
          "No logged-in user was found. Please log in again."
        );

        return;
      }

      /*
       * Save P2 analysis to Supabase.
       */
      await saveSkinAnalysis(
        user.id,
        {
          skinTone:
            analysis.undertone.tone,

          skinDepth:
            analysis.undertone.toneLevel,

          undertone:
            analysis.undertone.undertone,

          /*
           * P2 does not currently calculate
           * a product shade range.
           */
          bestShadeRange: null,

          /*
           * Store complete P2 analysis.
           */
          analysisData:
            analysis.undertone,
        }
      );

      /*
       * Keep the analysis available locally.
       */
      localStorage.setItem(
        "eunoia-skin-analysis",
        JSON.stringify(analysis)
      );

      /*
       * Continue to Preferences.
       */
      navigate("/preferences");
    } catch (analysisError) {
      console.error(
        "Skin analysis failed:",
        analysisError
      );

      setError(
        "Something went wrong while analysing your face. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  /*
   * Retake using camera.
   */
  const handleRetake = () => {
    if (selectedImage) {
      URL.revokeObjectURL(
        selectedImage
      );
    }

    setSelectedImage(null);
    setImageElement(null);
    setError("");

    startCamera();
  };

  /*
   * Existing demo mode.
   */
  const handleDemoMode = () => {
    stopCamera();

    setError("");

    navigate("/preferences");
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* Header */}

      <header className="border-b border-[#ddd8d2] bg-[#f7f5f2]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <button
            onClick={() => {
              stopCamera();
              navigate("/");
            }}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.5}
            />

            <span className="hidden md:inline">
              Back
            </span>
          </button>


          {/* Eunoia logo */}

          <button
            onClick={() => {
              stopCamera();
              navigate("/");
            }}
            className="text-xl font-light tracking-[0.35em]"
          >
            EUNOIA
          </button>


          <div className="flex items-center gap-4">

            <button>
              <UserRound
                size={19}
                strokeWidth={1.5}
              />
            </button>

          </div>

        </div>

      </header>


      {/* Progress */}

      <div className="mx-auto max-w-3xl px-6 pt-8">

        <div className="flex items-center">

          <div className="flex flex-1 items-center">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
              1
            </div>

            <div className="h-px flex-1 bg-black" />

          </div>


          <div className="flex flex-1 items-center">

            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9c3bc] bg-[#f7f5f2] text-xs text-[#77716b]">
              2
            </div>

            <div className="h-px flex-1 bg-[#d8d3cd]" />

          </div>


          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9c3bc] bg-[#f7f5f2] text-xs text-[#77716b]">
            3
          </div>

        </div>


        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-[0.15em]">

          <span>
            Scan
          </span>

          <span className="text-[#99928b]">
            Preferences
          </span>

          <span className="text-[#99928b]">
            Results
          </span>

        </div>

      </div>


      {/* Main */}

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#77716b]">
            Step 01
          </p>


          <h1 className="mt-4 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-6xl">
            Scan your face
          </h1>


          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6c6660] md:text-base">
            We'll analyse your skin tone, undertone and texture
            to help identify your best makeup shades.
          </p>

        </div>


        {/* Camera area */}

        <div className="mx-auto mt-12 max-w-md">

          <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-[#ddd6ce]">


            {/* Live camera */}

            {cameraOpen && (

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform:
                    "scaleX(-1)",
                }}
              />

            )}


            {/* Captured / uploaded image */}

            {selectedImage &&
              !cameraOpen && (

                <img
                  src={selectedImage}
                  alt="Selected face"
                  className="absolute inset-0 h-full w-full object-cover"
                />

            )}


            {/* Camera placeholder */}

            {!cameraOpen &&
              !selectedImage && (

                <div className="absolute inset-0 flex items-center justify-center">

                  <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/70">

                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80">

                      <Camera
                        size={30}
                        strokeWidth={1.4}
                      />

                    </div>

                  </div>

                </div>

            )}


            {/* Face frame */}

            <div className="absolute inset-x-10 top-10 bottom-10 rounded-[45%] border border-white/80" />


            {/* Corner markers */}

            <div className="absolute left-7 top-7 h-7 w-7 border-l-2 border-t-2 border-white" />

            <div className="absolute right-7 top-7 h-7 w-7 border-r-2 border-t-2 border-white" />

            <div className="absolute bottom-7 left-7 h-7 w-7 border-b-2 border-l-2 border-white" />

            <div className="absolute bottom-7 right-7 h-7 w-7 border-b-2 border-r-2 border-white" />


            {/* Instruction */}

            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-5 py-2 text-xs text-white">

              {isAnalyzing
                ? "Analysing your skin..."
                : cameraOpen
                  ? "Position your face in the frame"
                  : selectedImage
                    ? "Photo ready"
                    : "Position your face in the frame"}

            </div>

          </div>


          {/* Hidden upload input */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={
              handleImageSelected
            }
            className="hidden"
          />


          {/* Camera / capture button */}

          <div className="mt-7 flex justify-center">

            {cameraOpen ? (

              <button
                onClick={capturePhoto}
                disabled={isAnalyzing}
                className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-black shadow-lg ring-1 ring-[#bbb5ae] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Take photo"
              >

                <Camera
                  size={25}
                  color="white"
                  strokeWidth={1.5}
                />

              </button>

            ) : selectedImage ? (

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="rounded-full bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isAnalyzing
                  ? "Analysing..."
                  : "Analyse My Skin"}

              </button>

            ) : (

              <button
                onClick={startCamera}
                disabled={isAnalyzing}
                className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-black shadow-lg ring-1 ring-[#bbb5ae] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Take a photo"
              >

                <Camera
                  size={25}
                  color="white"
                  strokeWidth={1.5}
                />

              </button>

            )}

          </div>


          {/* BOTH PHOTO OPTIONS */}

          {!cameraOpen &&
            !selectedImage && (

              <div className="mt-6">

                <div className="flex items-center gap-4">

                  <div className="h-px flex-1 bg-[#d8d3cd]" />

                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#99928b]">
                    or
                  </span>

                  <div className="h-px flex-1 bg-[#d8d3cd]" />

                </div>


                <button
                  onClick={handleUploadClick}
                  disabled={isAnalyzing}
                  className="mt-4 flex w-full items-center justify-center gap-3 border border-[#bbb5ae] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-[#f0ede9] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Upload
                    size={17}
                    strokeWidth={1.5}
                  />

                  Upload a Photo

                </button>

              </div>

          )}


          {/* Options after photo */}

          {selectedImage &&
            !isAnalyzing && (

              <div className="mt-5 flex justify-center gap-5">

                <button
                  onClick={handleRetake}
                  className="text-xs uppercase tracking-[0.15em] text-[#77716b] underline underline-offset-4"
                >
                  Retake photo
                </button>


                <button
                  onClick={handleUploadClick}
                  className="text-xs uppercase tracking-[0.15em] text-[#77716b] underline underline-offset-4"
                >
                  Upload another
                </button>

              </div>

          )}


          {/* Error */}

          {error && (

            <div className="mt-5 border border-[#d8b8b8] bg-[#fff7f7] px-5 py-4 text-center text-xs leading-5 text-[#8a4f4f]">
              {error}
            </div>

          )}

        </div>


        {/* Tips */}

        <div className="mx-auto mt-14 max-w-3xl">

          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#77716b]">
            Tips for best results
          </p>


          <div className="mt-6 grid gap-3 md:grid-cols-3">


            <div className="border border-[#ddd8d2] bg-white p-5">

              <Sun
                size={23}
                strokeWidth={1.3}
              />

              <h3 className="mt-5 text-sm font-semibold uppercase">
                Good lighting
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#77716b]">
                Natural, even lighting works best.
              </p>

            </div>


            <div className="border border-[#ddd8d2] bg-white p-5">

              <Glasses
                size={23}
                strokeWidth={1.3}
              />

              <h3 className="mt-5 text-sm font-semibold uppercase">
                Remove glasses
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#77716b]">
                Keep your face unobstructed.
              </p>

            </div>


            <div className="border border-[#ddd8d2] bg-white p-5">

              <UserRound
                size={23}
                strokeWidth={1.3}
              />

              <h3 className="mt-5 text-sm font-semibold uppercase">
                Face the camera
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#77716b]">
                Look directly at the camera.
              </p>

            </div>

          </div>

        </div>


        {/* Demo button */}

        <div className="mt-10 text-center">

          <button
            onClick={handleDemoMode}
            disabled={isAnalyzing}
            className="text-xs uppercase tracking-[0.15em] text-[#77716b] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue without scan
          </button>

        </div>

      </main>


      {/* Hidden canvas for camera capture */}

      <canvas
        ref={canvasRef}
        className="hidden"
      />

    </div>
  );
}