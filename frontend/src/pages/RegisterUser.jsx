import React, { useRef, useState } from "react";
import { registerFace } from "../services/userService";
import { videoFeedUrl } from "../services/cameraService";

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [streamError, setStreamError] = useState(false);
  const [streamKey, setStreamKey] = useState(0);

  const imgRef = useRef(null);

  const retryCamera = () => {
    setStreamError(false);
    setStreamKey((value) => value + 1);
  };

  const captureAndRegister = async () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    if (!imgRef.current) {
      setError("Camera stream is not ready yet. Please retry.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const canvas = document.createElement("canvas");
    const img = imgRef.current;

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg");

    try {
      const data = await registerFace(name.trim().toLowerCase(), image);
      setMessage(data.message || "User registered successfully.");
      setName("");
    } catch (err) {
      setError(err?.response?.data?.error || "Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ padding: "30px" }}>
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Register New User</h2>

        <div style={styles.cameraWrap}>
          {streamError ? (
            <div style={styles.cameraError}>
              <p style={styles.errorText}>
                Camera stream unavailable. Open the dashboard/camera page only one at a time and retry.
              </p>
              <button type="button" onClick={retryCamera} style={styles.retryButton}>
                Retry Camera
              </button>
            </div>
          ) : (
            <img
              key={streamKey}
              ref={imgRef}
              src={videoFeedUrl(`view=register&v=${streamKey}`)}
              alt="camera"
              style={styles.camera}
              onError={() => setStreamError(true)}
            />
          )}
        </div>

        <input
          type="text"
          placeholder="Enter employee name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={captureAndRegister}
          style={styles.button}
          disabled={loading || streamError}
        >
          {loading ? "Registering..." : "Capture & Register"}
        </button>
      </div>
    </div>
  );
};

export default RegisterUser;

const styles = {
  card: {
    maxWidth: "480px",
    margin: "auto",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
  },
  cameraWrap: {
    marginBottom: "16px",
  },
  camera: {
    width: "100%",
    minHeight: "220px",
    borderRadius: "10px",
    background: "#000",
    objectFit: "cover",
  },
  cameraError: {
    minHeight: "220px",
    borderRadius: "10px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: "12px",
  },
  retryButton: {
    padding: "10px 16px",
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "12px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
  },
  success: {
    color: "#16a34a",
    fontWeight: 500,
    marginBottom: "10px",
  },
  error: {
    color: "#dc2626",
    fontWeight: 500,
    marginBottom: "10px",
  },
};
