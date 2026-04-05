interface Props {
  title: string;
  value: string | number;
  sub?: string;
  color?: "primary" | "emerald" | "amber" | "rose" | "blue";
  icon?: string;
}

const colorMap = {
  primary: { border: "#22c55e", accent: "#86efac" },
  emerald: { border: "#10b981", accent: "#6ee7b7" },
  amber: { border: "#f59e0b", accent: "#fcd34d" },
  rose: { border: "#f43f5e", accent: "#fb7185" },
  blue: { border: "#3b82f6", accent: "#93c5fd" },
};

export default function StatCard({ title, value, sub, color = "primary", icon }: Props) {
  const colors = colorMap[color];
  return (
    <div 
      className="card p-6 border-l-4 hover:shadow-lg transition-all duration-200"
      style={{ borderLeftColor: colors.border }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="mt-3 text-3xl font-bold" style={{ color: colors.accent }}>{value}</p>
      {sub && <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>{sub}</p>}
    </div>
  );
}

