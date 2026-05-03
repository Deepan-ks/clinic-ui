/**
 * Shared normalisation helpers — map backend field names to consistent
 * camelCase shapes the UI components expect.
 *
 * Backend contract (as discovered from /api/v1/*):
 *   Specialization → { specializationId, specializationName, status }
 *   Doctor         → { doctorId, doctorName, phone, status, specializationId, specializationName }
 *   Service        → { serviceId, serviceName, description, price, status, specializationId }
 */

/** Accept any common list shape from Spring */
export function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

/** status field → boolean active flag */
function isActive(status) {
  if (typeof status === "boolean") return status;
  if (status == null) return true;
  return String(status).toUpperCase() === "ACTIVE";
}

/** Specialization → { id, name, active } */
export function normalizeSpecialization(s) {
  return {
    ...s,
    id: s.id ?? s.specializationId,
    name: s.name ?? s.specializationName ?? "",
    active: isActive(s.status ?? s.active),
  };
}

/** Doctor → { id, name, phone, specializationId, specializationName, active } */
export function normalizeDoctor(d) {
  return {
    ...d,
    id: d.id ?? d.doctorId,
    name: d.name ?? d.doctorName ?? "",
    phone: d.phone ?? d.phoneNumber ?? "",
    specializationId: d.specializationId ?? d.specialization?.id ?? "",
    specializationName:
      d.specializationName ?? d.specialization?.name ?? "",
    active: isActive(d.status ?? d.active),
  };
}

/** Service → { id, name, description, price, specializationId, specializationName, active } */
export function normalizeService(s) {
  return {
    ...s,
    id: s.id ?? s.serviceId,
    name: s.name ?? s.serviceName ?? "",
    description: s.description ?? "",
    price: s.price ?? 0,
    specializationId:
      s.specializationId ?? s.specialization?.id ?? "",
    specializationName:
      s.specializationName ?? s.specialization?.name ?? "",
    active: isActive(s.status ?? s.active),
  };
}

/** Convenience — extract + normalise a list of specializations */
export function normalizeSpecializations(payload) {
  return extractList(payload).map(normalizeSpecialization);
}

/** Convenience — extract + normalise a list of doctors */
export function normalizeDoctors(payload) {
  return extractList(payload).map(normalizeDoctor);
}

/** Convenience — extract + normalise a list of services */
export function normalizeServices(payload) {
  return extractList(payload).map(normalizeService);
}
