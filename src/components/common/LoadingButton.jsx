export default function LoadingButton({
  isLoading,
  label,
  loadingLabel,
  className = "",
  disabled = false,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-r-transparent rounded-full animate-spin" />
          {loadingLabel || label}
        </span>
      ) : (
        label
      )}
    </button>
  );
}

