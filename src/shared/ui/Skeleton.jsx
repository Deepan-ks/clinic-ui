export default function Skeleton({ className = "", width, height, rounded = "rounded-md" }) {
  const style = {
    width: width || "100%",
    height: height || "1rem",
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded} ${className}`}
      style={style}
    />
  );
}
