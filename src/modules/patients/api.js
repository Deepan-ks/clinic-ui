import { api } from "@/lib/api";

export const getPatients = (queryString) => api.get(`/patients?${queryString}`);
export const createPatient = (data) => api.post(`/patients`, data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const searchPatients = (query) => api.get(`/patients/search?query=${query}`);
