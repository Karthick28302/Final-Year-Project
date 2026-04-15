const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

export function videoFeedUrl(query = "") {
  return query ? `${API_URL}/video_feed?${query}` : `${API_URL}/video_feed`;
}

export function cameraStatusUrl() {
  return `${API_URL}/camera/status`;
}
