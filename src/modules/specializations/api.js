import { api } from "@/lib/api";

export const getSpecializations = () => api.get("/specializations");
export const createSpecialization = (data) => api.post("/specializations", data);
export const updateSpecialization = (id, data) => api.put(`/specializations/${id}`, data);
export const deleteSpecialization = (id) => api.delete(`/specializations/${id}`);
