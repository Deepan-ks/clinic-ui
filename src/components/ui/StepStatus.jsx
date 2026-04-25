export function StepStatus({ completed }) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs
        ${completed ? "bg-emerald-500" : "bg-gray-300"}
      `}
    >
      {completed ? "✓" : ""}
    </div>
  );
}
