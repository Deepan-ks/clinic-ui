const BASE_URL = "http://localhost:8080/api/v1";

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