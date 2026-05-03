import { useEffect, useState } from "react";
import * as billingApi from "../api";

export const useServiceSearch = (specializationId) => {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!specializationId) {
      return;
    }

    billingApi.getServices(specializationId)
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

  const visibleServices = specializationId ? services : [];

  // 🔍 filter
  const filtered = query
    ? visibleServices.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // ⭐ frequent (simple for now: first 5)
  const frequent = visibleServices.slice(0, 5);

  return {
    query,
    setQuery,
    filtered,
    frequent,
  };
};
