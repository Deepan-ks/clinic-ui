/**
 * Shared field validators and input-filter helpers.
 * Import what you need — no React dependencies here.
 */

// ── Regex constants ────────────────────────────────────────────────
export const PHONE_RE     = /^\d{10}$/;              // exactly 10 digits — matches backend @Pattern(\\d{10})
export const EMAIL_RE     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_RE      = /^[a-zA-Z\s'.,-]{2,100}$/; // letters, spaces, common punctuation
export const DIGITS_ONLY  = /\D/g;                  // strip non-digits

// ── Validators (return string error | "") ─────────────────────────

export function validateRequiredName(value, label = "Name") {
  const v = (value ?? "").trim();
  if (!v) return `${label} is required`;
  if (v.length < 2) return `${label} must be at least 2 characters`;
  if (v.length > 100) return `${label} must be 100 characters or fewer`;
  if (!NAME_RE.test(v))
    return `${label} can only contain letters, spaces, and basic punctuation`;
  return "";
}

export function validatePhone(value, required = true) {
  const v = (value ?? "").trim();
  if (!v) return required ? "Phone number is required" : "";
  if (!PHONE_RE.test(v)) return "Phone must be exactly 10 digits";
  return "";
}

/**
 * Validate age.
 * @param {string|number} value
 * @param {boolean} required – if false, empty value is allowed
 */
export function validateAge(value, required = true) {
  const v = (value ?? "").toString().trim();
  if (!v) return required ? "Age is required" : "";
  const n = Number(v);
  if (isNaN(n) || !Number.isInteger(n)) return "Age must be a whole number";
  if (n < 0 || n > 150) return "Age must be between 0 and 150";
  return "";
}

export function validateEmail(value) {
  const v = (value ?? "").trim();
  if (!v) return ""; // optional field
  if (!EMAIL_RE.test(v)) return "Enter a valid email address";
  return "";
}

export function validatePrice(value) {
  const v = (value ?? "").toString().trim();
  if (!v) return "Price is required";
  const n = Number(v);
  if (isNaN(n)) return "Price must be a number";
  if (n <= 0) return "Price must be greater than 0";
  return "";
}

export function validateRequired(value, label = "This field") {
  if (!(value ?? "").toString().trim()) return `${label} is required`;
  return "";
}

// ── Input filter helpers ───────────────────────────────────────────

/**
 * Strip all non-digit characters from a string.
 * Use in onChange to prevent alphabets in phone/age inputs.
 */
export function digitsOnly(value) {
  return (value ?? "").replace(DIGITS_ONLY, "");
}

/**
 * Allow only digits and one decimal point (for price inputs).
 */
export function numericOnly(value) {
  // Remove anything that's not a digit or a dot
  const cleaned = (value ?? "").replace(/[^\d.]/g, "");
  // Prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  return cleaned;
}

/**
 * Run a map of { field: validatorFn } and return { field: errorMsg }.
 * Only includes entries where the validator returned a non-empty string.
 */
export function runValidations(rules) {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([field, fn]) => [field, fn()])
      .filter(([, err]) => err),
  );
}
