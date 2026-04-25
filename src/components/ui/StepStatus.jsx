export function StepStatus({ active, completed }) {
  return (
    <div
      className={`
        w-5 h-5 rounded-full flex items-center justify-center text-xs
        ${completed ? "bg-emerald-500 text-white" : ""}
        ${active && !completed ? "border-2 border-blue-500" : ""}
        ${!active && !completed ? "bg-gray-200" : ""}
      `}
    >
      {completed && "✓"}
    </div>
  );
}
