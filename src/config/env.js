/**
 * Centralized Environment Configuration
 * 
 * This file handles environment variable resolution with sensible fallbacks
 * for local development. In production, these should be provided by the 
 * build environment (Vite).
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// Add other env vars here as needed
