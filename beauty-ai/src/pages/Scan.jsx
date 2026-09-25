import { useRef, useState } from "react";
import { buildSkinProfile } from "../analysis/buildProfile";

export default function Scan() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imageRef = useRef(null);

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setResult(null);
    setError("");

    const imageURL =
      URL.createObjectURL(file);

    setImage(imageURL);
  }

  async function handleAnalyze() {
    if (!imageRef.current) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const profile =
        await buildSkinProfile(
          imageRef.current
        );

      setResult(profile);

      console.log(
        "Skin profile:",
        profile
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        "Something went wrong during analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial"
    }}>

      <h1>AI Skin Analysis</h1>

      <p>
        Upload a clear selfie to analyze
        your skin profile.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {image && (
        <div style={{
          marginTop: "20px"
        }}>

          <img
            ref={imageRef}
            src={image}
            alt="Uploaded selfie"
            style={{
              width: "300px",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "20px"
            }}
          />

        </div>
      )}

      {image && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            cursor: "pointer"
          }}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Skin"}
        </button>
      )}

      {error && (
        <p style={{
          color: "red",
          marginTop: "20px"
        }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{
          marginTop: "30px"
        }}>

          <h2>Analysis Result</h2>

          {!result.faceDetected ? (
            <p>
              No face detected. Please upload
              a clearer selfie.
            </p>
          ) : (
            <>
              <p>
  <strong>Face detected:</strong>{" "}
  Yes
</p>

<p>
  <strong>Undertone:</strong>{" "}
  {result.undertone.undertone}
</p>

<p>
  <strong>Undertone detail:</strong>{" "}
  {result.undertone.undertoneDetail}
</p>

<p>
  <strong>Tone:</strong>{" "}
  {result.undertone.tone}
</p>

<p>
  <strong>Tone level:</strong>{" "}
  {result.undertone.toneLevel}
</p>

<p>
  <strong>Hue family:</strong>{" "}
  {result.undertone.hueFamily}
</p>

<p>
  <strong>Undertone strength:</strong>{" "}
  {result.undertone.undertoneStrength}
</p>

<p>
  <strong>RGB:</strong>{" "}
  {result.skinRGB.r},{" "}
  {result.skinRGB.g},{" "}
  {result.skinRGB.b}
</p>
            </>
          )}

        </div>
      )}

    </div>
  );
}