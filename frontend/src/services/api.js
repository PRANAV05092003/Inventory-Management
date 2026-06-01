import axios from 'axios';

/**
 * VITE_API_URL: explicit API host (Vercel → Render, etc.).
 * When empty, requests use same origin (Vite dev proxy or nginx in Docker).
 */
const baseURL = import.meta.env.VITE_API_URL ?? '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
