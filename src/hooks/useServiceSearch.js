import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useServiceSearch = (specializationId) => {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!specializationId) {
      setServices([]);
      return;
    }

    api
      .get(`/services?specializationId=${specializationId}`)
      .then((data) => {
        const normalized = data.map((s) => ({
          id: s.serviceId,
          name: s.serviceName,
          price: s.price,
        }));

        setServices(normalized);
      })
      .catch(console.error);
  }, [specializationId]);

  // 🔍 filter
  const filtered = query
    ? services.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // ⭐ frequent (simple for now: first 5)
  const frequent = services.slice(0, 5);

  return {
    query,
    setQuery,
    filtered,
    frequent,
  };
};