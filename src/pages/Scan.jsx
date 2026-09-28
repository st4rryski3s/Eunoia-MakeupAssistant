import { useEffect, useRef, useState } from "react";

import {
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


  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imageElement, setImageElement] =
    useState(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
   * ============================================================
   * STOP CAMERA WHEN LEAVING PAGE
   * ============================================================
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

        URL.revokeObjectURL(
          selectedImage
        );

      }

    };

  }, [selectedImage]);


  /*
   * ============================================================
   * ATTACH CAMERA STREAM AFTER VIDEO RENDERS
   * ============================================================
   */

  useEffect(() => {

    if (
      !cameraOpen ||
      !videoRef.current ||
      !streamRef.current
    ) {
      return;
    }


    const video =
      videoRef.current;


    video.srcObject =
      streamRef.current;


    video.play().catch(
      (videoError) => {

        console.error(
          "Video playback error:",
          videoError
        );

      }
    );


    return () => {

      if (
        video.srcObject ===
        streamRef.current
      ) {

        video.srcObject = null;

      }

    };

  }, [cameraOpen]);


  /*
   * ============================================================
   * START LIVE CAMERA
   * ============================================================
   */

  const startCamera = async () => {

    setError("");


    /*
     * Remove previously selected image.
     */

    if (selectedImage) {

      URL.revokeObjectURL(
        selectedImage
      );

    }


    setSelectedImage(null);
    setImageElement(null);


    try {

      if (
        !navigator.mediaDevices?.getUserMedia
      ) {

        setError(
          "Camera access is not supported by this browser."
        );

        return;
      }


      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
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
          }
        );


      streamRef.current =
        stream;


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
   * ============================================================
   * STOP LIVE CAMERA
   * ============================================================
   */

  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      streamRef.current = null;

    }


    if (videoRef.current) {

      videoRef.current.srcObject =
        null;

    }


    setCameraOpen(false);

  };


  /*
   * ============================================================
   * CAPTURE PHOTO FROM CAMERA
   * ============================================================
   */

  const capturePhoto = () => {

    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;


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


    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;


    const context =
      canvas.getContext("2d");


    if (!context) {

      setError(
        "Could not capture the photo."
      );

      return;

    }


    /*
     * Mirror the captured image so it
     * matches the live preview.
     */

    context.save();


    context.translate(
      canvas.width,
      0
    );


    context.scale(
      -1,
      1
    );


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
          URL.createObjectURL(
            blob
          );


        const image =
          new Image();


        image.onload = () => {

          setSelectedImage(
            imageUrl
          );

          setImageElement(
            image
          );


          stopCamera();

        };


        image.onerror = () => {

          URL.revokeObjectURL(
            imageUrl
          );


          setError(
            "Could not load the captured photo."
          );

        };


        image.src =
          imageUrl;

      },
      "image/jpeg",
      0.95
    );

  };


  /*
   * ============================================================
   * OPEN FILE PICKER
   * ============================================================
   */

  const handleUploadClick = () => {

    setError("");


    if (fileInputRef.current) {

      fileInputRef.current.click();

    }

  };


  /*
   * ============================================================
   * HANDLE UPLOADED IMAGE
   * ============================================================
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
     * Stop camera if running.
     */

    stopCamera();


    /*
     * Remove previous image URL.
     */

    if (selectedImage) {

      URL.revokeObjectURL(
        selectedImage
      );

    }


    const imageUrl =
      URL.createObjectURL(
        file
      );


    const image =
      new Image();


    image.onload = () => {

      setSelectedImage(
        imageUrl
      );

      setImageElement(
        image
      );

    };


    image.onerror = () => {

      URL.revokeObjectURL(
        imageUrl
      );


      setSelectedImage(null);
      setImageElement(null);


      setError(
        "Could not load the image. Please try again."
      );

    };


    image.src =
      imageUrl;


    /*
     * Allow same file to be
     * selected again later.
     */

    event.target.value =
      "";

  };


  /*
   * ============================================================
   * RUN PERSON 2 SKIN ANALYSIS
   * ============================================================
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
       * --------------------------------------------------------
       * RUN PERSON 2 ANALYSIS
       * --------------------------------------------------------
       *
       * buildSkinProfile performs:
       *
       * 1. Lighting check
       * 2. Face detection
       * 3. Face framing check
       * 4. Skin RGB extraction
       * 5. Undertone analysis
       */

      const analysis =
        await buildSkinProfile(
          imageElement
        );


      /*
       * --------------------------------------------------------
       * STEP 1 — CHECK LIGHTING
       * --------------------------------------------------------
       */

      if (
        analysis.lightingAcceptable ===
        false
      ) {

        const reason =
          analysis.lighting?.reason;


        if (
          analysis.lighting?.message
        ) {

          setError(
            analysis.lighting.message
          );

        } else if (
          reason === "too-dark"
        ) {

          setError(
            "The lighting is too dark. Please move to a brighter, well-lit area and try again."
          );

        } else if (
          reason === "too-bright"
        ) {

          setError(
            "The lighting is too bright. Avoid direct or harsh light and try again."
          );

        } else if (
          reason === "overexposed"
        ) {

          setError(
            "The image is overexposed. Please move away from very bright or direct light and try again."
          );

        } else if (
          reason === "uneven-lighting"
        ) {

          setError(
            "The lighting is uneven. Please face a light source directly and try again."
          );

        } else {

          setError(
            "The lighting is not suitable for accurate skin analysis. Please try again with soft, even lighting."
          );

        }


        return;

      }


      /*
       * --------------------------------------------------------
       * STEP 2 — CHECK FACE DETECTION
       * --------------------------------------------------------
       */

      if (!analysis.faceDetected) {

        setError(
          "No face was detected. Please position your entire face inside the guide and try again."
        );

        return;

      }


      /*
       * --------------------------------------------------------
       * STEP 3 — CHECK FACE FRAMING
       * --------------------------------------------------------
       */

      if (
        analysis.framingAcceptable ===
        false
      ) {

        const reason =
          analysis.framing?.reason;


        if (
          reason ===
          "face-cut-off-left"
        ) {

          setError(
            "Part of your face is outside the left side of the frame. Please move slightly to the right and keep your entire face visible."
          );

        } else if (
          reason ===
          "face-cut-off-right"
        ) {

          setError(
            "Part of your face is outside the right side of the frame. Please move slightly to the left and keep your entire face visible."
          );

        } else if (
          reason ===
          "face-cut-off-top"
        ) {

          setError(
            "Part of your face is outside the top of the frame. Please move slightly lower and keep your entire face visible."
          );

        } else if (
          reason ===
          "face-cut-off-bottom"
        ) {

          setError(
            "Part of your face is outside the bottom of the frame. Please move slightly higher and keep your entire face visible."
          );

        } else if (
          reason ===
          "face-too-far-left"
        ) {

          setError(
            "Your face is too close to the left edge. Please move toward the centre of the frame."
          );

        } else if (
          reason ===
          "face-too-far-right"
        ) {

          setError(
            "Your face is too close to the right edge. Please move toward the centre of the frame."
          );

        } else if (
          reason ===
          "face-too-far-top"
        ) {

          setError(
            "Your face is too close to the top edge. Please move toward the centre of the frame."
          );

        } else if (
          reason ===
          "face-too-far-bottom"
        ) {

          setError(
            "Your face is too close to the bottom edge. Please move toward the centre of the frame."
          );

        } else if (
          reason ===
          "face-too-small"
        ) {

          setError(
            "Your face is too far away. Please move closer to the camera while keeping your entire face visible."
          );

        } else if (
          reason ===
          "face-too-close"
        ) {

          setError(
            "Your face is too close to the camera. Please move back slightly and keep your entire face inside the frame."
          );

        } else {

          setError(
            "Please position your entire face inside the frame and try again."
          );

        }


        return;

      }


      /*
       * --------------------------------------------------------
       * STEP 4 — MAKE SURE SKIN ANALYSIS EXISTS
       * --------------------------------------------------------
       */

      if (!analysis.undertone) {

        setError(
          "We could not analyse your skin. Please try another photo."
        );

        return;

      }


      /*
       * --------------------------------------------------------
       * STEP 5 — GET LOGGED-IN SUPABASE USER
       * --------------------------------------------------------
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
       * --------------------------------------------------------
       * STEP 6 — SAVE ANALYSIS TO SUPABASE
       * --------------------------------------------------------
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

          bestShadeRange:
            null,

          /*
           * Store complete P2 analysis.
           */

          analysisData:
            analysis.undertone,
        }
      );


      /*
       * --------------------------------------------------------
       * STEP 7 — SAVE LOCALLY
       * --------------------------------------------------------
       */

      localStorage.setItem(
        "eunoia-skin-analysis",
        JSON.stringify(analysis)
      );


      /*
       * --------------------------------------------------------
       * STEP 8 — CONTINUE
       * --------------------------------------------------------
       */

      navigate(
        "/preferences"
      );

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
   * ============================================================
   * RETAKE USING CAMERA
   * ============================================================
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
   * ============================================================
   * DEMO MODE
   * ============================================================
   */

  const handleDemoMode = () => {

    stopCamera();

    setError("");

    navigate(
      "/preferences"
    );

  };


  return (

    <div
      className="
        min-h-screen
        bg-[#f7f5f2]
        text-[#111111]
      "
    >

      {/*
       * IMPORTANT:
       *
       * There is intentionally NO header here.
       *
       * EunoiaLayout.jsx provides the ONE
       * global Eunoia header and ONE global
       * footer for this page.
       */}


      {/* ======================================================
          PROGRESS
      ====================================================== */}

      <div
        className="
          mx-auto
          max-w-3xl
          px-6
          pt-8
        "
      >

        <div className="flex items-center">

          <div
            className="
              flex
              flex-1
              items-center
            "
          >

            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-black
                text-xs
                text-white
              "
            >
              1
            </div>


            <div
              className="
                h-px
                flex-1
                bg-black
              "
            />

          </div>


          <div
            className="
              flex
              flex-1
              items-center
            "
          >

            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                border
                border-[#c9c3bc]
                bg-[#f7f5f2]
                text-xs
                text-[#77716b]
              "
            >
              2
            </div>


            <div
              className="
                h-px
                flex-1
                bg-[#d8d3cd]
              "
            />

          </div>


          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              border
              border-[#c9c3bc]
              bg-[#f7f5f2]
              text-xs
              text-[#77716b]
            "
          >
            3
          </div>

        </div>


        <div
          className="
            mt-2
            flex
            justify-between
            text-[10px]
            font-medium
            uppercase
            tracking-[0.15em]
          "
        >

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


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main
        className="
          mx-auto
          max-w-5xl
          px-6
          py-12
          md:py-16
        "
      >

        <div className="text-center">

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#77716b]
            "
          >
            Step 01
          </p>


          <h1
            className="
              mt-4
              text-4xl
              font-semibold
              uppercase
              tracking-[-0.03em]
              md:text-6xl
            "
          >
            Scan your face
          </h1>


          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-sm
              leading-6
              text-[#6c6660]
              md:text-base
            "
          >
            We'll analyse your skin tone,
            undertone and texture to help
            identify your best makeup shades.
          </p>

        </div>


        {/* ====================================================
            CAMERA AREA
        ==================================================== */}

        <div
          className="
            mx-auto
            mt-12
            max-w-md
          "
        >

          <div
            className="
              relative
              aspect-[3/4]
              overflow-hidden
              rounded-[2rem]
              bg-[#ddd6ce]
            "
          >

            {/* LIVE CAMERA */}

            {cameraOpen && (

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
                style={{
                  transform:
                    "scaleX(-1)",
                }}
              />

            )}


            {/* CAPTURED / UPLOADED IMAGE */}

            {selectedImage &&
              !cameraOpen && (

                <img
                  src={selectedImage}
                  alt="Selected face"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                />

            )}


            {/* CAMERA PLACEHOLDER */}

            {!cameraOpen &&
              !selectedImage && (

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  "
                >

                  <div
                    className="
                      flex
                      h-32
                      w-32
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/70
                    "
                  >

                    <div
                      className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-white/80
                      "
                    >

                      <Camera
                        size={30}
                        strokeWidth={1.4}
                      />

                    </div>

                  </div>

                </div>

            )}


            {/* FACE FRAME */}

            <div
              className="
                absolute
                inset-x-10
                bottom-10
                top-10
                rounded-[45%]
                border
                border-white/80
              "
            />


            {/* CORNER MARKERS */}

            <div
              className="
                absolute
                left-7
                top-7
                h-7
                w-7
                border-l-2
                border-t-2
                border-white
              "
            />


            <div
              className="
                absolute
                right-7
                top-7
                h-7
                w-7
                border-r-2
                border-t-2
                border-white
              "
            />


            <div
              className="
                absolute
                bottom-7
                left-7
                h-7
                w-7
                border-b-2
                border-l-2
                border-white
              "
            />


            <div
              className="
                absolute
                bottom-7
                right-7
                h-7
                w-7
                border-b-2
                border-r-2
                border-white
              "
            />


            {/* INSTRUCTION */}

            <div
              className="
                absolute
                bottom-7
                left-1/2
                -translate-x-1/2
                whitespace-nowrap
                rounded-full
                bg-black/70
                px-5
                py-2
                text-xs
                text-white
              "
            >

              {isAnalyzing
                ? "Analysing your skin..."
                : cameraOpen
                  ? "Position your face in the frame"
                  : selectedImage
                    ? "Photo ready"
                    : "Position your face in the frame"}

            </div>

          </div>


          {/* ==================================================
              HIDDEN UPLOAD INPUT
          ================================================== */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={
              handleImageSelected
            }
            className="hidden"
          />


          {/* ==================================================
              CAMERA / CAPTURE BUTTON
          ================================================== */}

          <div
            className="
              mt-7
              flex
              justify-center
            "
          >

            {cameraOpen ? (

              <button
                type="button"
                onClick={capturePhoto}
                disabled={isAnalyzing}
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-white
                  bg-black
                  shadow-lg
                  ring-1
                  ring-[#bbb5ae]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
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
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="
                  rounded-full
                  bg-black
                  px-8
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                  shadow-lg
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {isAnalyzing
                  ? "Analysing..."
                  : "Analyse My Skin"}

              </button>

            ) : (

              <button
                type="button"
                onClick={startCamera}
                disabled={isAnalyzing}
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-white
                  bg-black
                  shadow-lg
                  ring-1
                  ring-[#bbb5ae]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
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


          {/* ==================================================
              UPLOAD OPTION
          ================================================== */}

          {!cameraOpen &&
            !selectedImage && (

              <div className="mt-6">

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      h-px
                      flex-1
                      bg-[#d8d3cd]
                    "
                  />


                  <span
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-[#99928b]
                    "
                  >
                    or
                  </span>


                  <div
                    className="
                      h-px
                      flex-1
                      bg-[#d8d3cd]
                    "
                  />

                </div>


                <button
                  type="button"
                  onClick={
                    handleUploadClick
                  }
                  disabled={isAnalyzing}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    border
                    border-[#bbb5ae]
                    bg-white
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    transition
                    hover:bg-[#f0ede9]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  <Upload
                    size={17}
                    strokeWidth={1.5}
                  />

                  Upload a Photo

                </button>

              </div>

          )}


          {/* ==================================================
              OPTIONS AFTER PHOTO
          ================================================== */}

          {selectedImage &&
            !isAnalyzing && (

              <div
                className="
                  mt-5
                  flex
                  justify-center
                  gap-5
                "
              >

                <button
                  type="button"
                  onClick={
                    handleRetake
                  }
                  className="
                    text-xs
                    uppercase
                    tracking-[0.15em]
                    text-[#77716b]
                    underline
                    underline-offset-4
                  "
                >
                  Retake photo
                </button>


                <button
                  type="button"
                  onClick={
                    handleUploadClick
                  }
                  className="
                    text-xs
                    uppercase
                    tracking-[0.15em]
                    text-[#77716b]
                    underline
                    underline-offset-4
                  "
                >
                  Upload another
                </button>

              </div>

          )}


          {/* ==================================================
              ERROR / ANALYSIS FEEDBACK
          ================================================== */}

          {error && (

            <div
              className="
                mt-5
                border
                border-[#d8b8b8]
                bg-[#fff7f7]
                px-5
                py-4
                text-center
                text-xs
                leading-5
                text-[#8a4f4f]
              "
            >
              {error}
            </div>

          )}

        </div>


        {/* ====================================================
            TIPS
        ==================================================== */}

        <div
          className="
            mx-auto
            mt-14
            max-w-3xl
          "
        >

          <p
            className="
              text-center
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#77716b]
            "
          >
            Tips for best results
          </p>


          <div
            className="
              mt-6
              grid
              gap-3
              md:grid-cols-3
            "
          >

            {/* GOOD LIGHTING */}

            <div
              className="
                border
                border-[#ddd8d2]
                bg-white
                p-5
              "
            >

              <Sun
                size={23}
                strokeWidth={1.3}
              />


              <h3
                className="
                  mt-5
                  text-sm
                  font-semibold
                  uppercase
                "
              >
                Good lighting
              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-[#77716b]
                "
              >
                Natural, even lighting
                works best.
              </p>

            </div>


            {/* REMOVE GLASSES */}

            <div
              className="
                border
                border-[#ddd8d2]
                bg-white
                p-5
              "
            >

              <Glasses
                size={23}
                strokeWidth={1.3}
              />


              <h3
                className="
                  mt-5
                  text-sm
                  font-semibold
                  uppercase
                "
              >
                Remove glasses
              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-[#77716b]
                "
              >
                Keep your face
                unobstructed.
              </p>

            </div>


            {/* FACE THE CAMERA */}

            <div
              className="
                border
                border-[#ddd8d2]
                bg-white
                p-5
              "
            >

              <UserRound
                size={23}
                strokeWidth={1.3}
              />


              <h3
                className="
                  mt-5
                  text-sm
                  font-semibold
                  uppercase
                "
              >
                Face the camera
              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-[#77716b]
                "
              >
                Look directly at
                the camera.
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            DEMO BUTTON
        ==================================================== */}

        <div
          className="
            mt-10
            text-center
          "
        >

          <button
            type="button"
            onClick={
              handleDemoMode
            }
            disabled={isAnalyzing}
            className="
              text-xs
              uppercase
              tracking-[0.15em]
              text-[#77716b]
              underline
              underline-offset-4
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Continue without scan
          </button>

        </div>

      </main>


      {/* ======================================================
          HIDDEN CANVAS
      ====================================================== */}

      <canvas
        ref={canvasRef}
        className="hidden"
      />

    </div>

  );

}