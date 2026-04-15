import React from "react";
import { videoFeedUrl } from "../services/cameraService";

const CameraFeed = () => {
  return (
    <div className="page" style={{ padding: "30px" }}>
      <div className="card" style={styles.card}>
        <h2>🎥 Live Camera Feed</h2>

        <img
          src={videoFeedUrl("view=component-live-monitoring")}
          alt="camera"
          style={styles.camera}
        />
      </div>
    </div>
  );
};

export default CameraFeed;

const styles = {
  card: {
    textAlign: "center",
  },

  camera: {
    width: "100%",
    maxWidth: "700px",
    borderRadius: "12px",
    border: "3px solid #ddd",
    marginTop: "20px",
  },
};
