// ── AVATAR ───────────────────────────────────────────────────────

import { initials, AVATAR_COLORS } from "../../utils/formatters";

export function Avatar({ name = "", size = "md" }) {
  const color = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  return (
    <div
      className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initials(name)}
    </div>
  );
}
