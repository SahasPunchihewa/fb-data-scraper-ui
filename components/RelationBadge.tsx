const BADGES: Record<string, { label: string; cls: string }> = {
  friend: { label: "🧑‍🤝‍🧑 Friend", cls: "bg-indigo-100 text-indigo-800" },
  friend_and_follower: { label: "🌟 Friend + Follower", cls: "bg-amber-100 text-amber-800" },
  follower_only: { label: "👣 Follower", cls: "bg-sky-100 text-sky-800" },
  other: { label: "❔ Other", cls: "bg-slate-100 text-slate-600" },
};

export default function RelationBadge({ relation }: { relation: string }) {
  const badge = BADGES[relation] ?? BADGES.other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
      {badge.label}
    </span>
  );
}

