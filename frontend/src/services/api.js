import axios from "axios";

/**
 * Central Axios instance.
 * Base URL is read from .env so you never hardcode 127.0.0.1:5000 in components.
 *
 * Add REACT_APP_API_URL=http://127.0.0.1:5000 to frontend/.env
 */
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:5000",
});

export default API;