export default function Button({ children, variant, className = "", ...rest }) {
  const base = "px-4 py-2 rounded-full text-sm transition";
  const styles = variant === "outline" ? "border border-white text-white bg-transparent" : "bg-indigo-600 text-white";
  return (
    <button {...rest} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
