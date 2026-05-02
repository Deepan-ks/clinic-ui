import { API_BASE_URL } from "../config/env";

const BASE_URL = API_BASE_URL;

export const api = {
  get: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`);
    if (!res.ok) throw new Error("API error");
    return res.json();
  },

  post: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("API error");
    return res.json();
  },

  put: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("API error");
    return res.json();
  },
};