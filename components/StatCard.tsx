interface Props {
  title: string;
  value: string | number;
  sub?: string;
  color?: "primary" | "accent" | "danger" | "warning" | "success";
  icon?: string;
}

const colorMap = {
  primary: "#238636",
  accent: "#58a6ff",
  danger: "#f85149",
  warning: "#d29922",
  success: "#3fb950",
};

export default function StatCard({ title, value, sub, color = "primary", icon }: Props) {
  const accentColor = colorMap[color];
  return (
    <div 
      className="stat-box"
      style={{
        borderLeft: `3px solid ${accentColor}`
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wide" style={{ color: "var(--color-text-muted)" }}>
            {title.toUpperCase()}
          </p>
          <p className="mt-2 text-4xl font-bold" style={{ color: "var(--color-text)" }}>
            {value}
          </p>
          {sub && (
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {sub}
            </p>
          )}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  );
}

