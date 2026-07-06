export default function ProgressBar({ value, max, className = "", showLabel = true, color = "violet" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">{value}/{max} lessons</span>
          <span className="font-semibold text-foreground">{pct}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }}
        />
      </div>
    </div>
  );
}