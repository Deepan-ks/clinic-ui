import { api } from "@/lib/api";

// Create Bill
export const getSpecializations = () => api.get("/specializations");
export const getDoctors = (specId) => api.get(`/doctors?specializationId=${specId}`);
export const getServices = (specId) => api.get(`/services?specializationId=${specId}`);
export const createBill = (data) => api.post("/bills", data);
export const searchPatients = (query) => api.get(`/patients/search?query=${query}`);
export const searchServices = (query, specId) => 
  api.get(`/services/search?query=${query}${specId ? `&specializationId=${specId}` : ''}`);

// Bill History
export const getBills = (queryString) => api.get(`/bills?${queryString}`);
export const getBillById = (id) => api.get(`/bills/${id}`);

export const downloadInvoice = async (id) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
  const response = await fetch(`${baseUrl}/bills/${id}/invoice`);
  if (!response.ok) {
    throw new Error("Unable to download invoice PDF.");
  }
  return response.blob();
};
