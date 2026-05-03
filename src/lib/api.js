import { API_BASE_URL } from "./config/env";

const BASE_URL = API_BASE_URL;

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  if (!res.ok) {
    // Standardize error handling to use error.message from backend
    throw new Error(data.message || "An unexpected error occurred");
  }
  return data;
};

export const api = {
  get: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`);
    return handleResponse(res);
  },

  post: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  patch: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  delete: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
    });
    return handleResponse(res);
  },
};
