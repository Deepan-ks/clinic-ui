// ── STEP INDICATOR ───────────────────────────────────────────────

import { CheckIcon } from "../icons";
import { BILL_STEPS } from "../../utils/formatters";

export function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-1">
      {BILL_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                done
                  ? "bg-emerald-100 text-emerald-700"
                  : active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {done ? (
                <CheckIcon className="w-3 h-3 text-emerald-600" />
              ) : (
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    active ? "bg-white/30" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i + 1}
                </span>
              )}
              {step}
            </div>
            {i < BILL_STEPS.length - 1 && (
              <div
                className={`w-5 h-px mx-0.5 ${
                  i < current ? "bg-emerald-300" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
