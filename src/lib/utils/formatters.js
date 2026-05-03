// ── HELPERS ──────────────────────────────────────────────────────

export const fmt = (n) => "₹" + Number(n || 0).toFixed(2);

export const initials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export const BILL_STEPS = ["Patient", "Doctor", "Services", "Invoice"];

export const PAYMENT_MODES = ["CASH", "UPI"];
