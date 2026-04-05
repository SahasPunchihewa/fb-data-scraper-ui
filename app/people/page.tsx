"use client";

import { useCallback, useEffect, useState } from "react";
import RelationBadge from "@/components/RelationBadge";
import { getPeople, type PersonInsight } from "@/lib/api";

const REACTION_EMOJI: Record<string, string> = {
  heart: "❤️",
  love: "❤️",
  like: "👍",
  care: "🤗",
  wow: "😮",
  haha: "😂",
  sad: "😢",
  angry: "😡",
};

const RELATIONS = [
  { value: "", label: "All" },
  { value: "friend", label: "🧑‍🤝‍🧑 Friend" },
  { value: "friend_and_follower", label: "🌟 Friend + Follower" },
  { value: "follower_only", label: "👣 Follower Only" },
  { value: "other", label: "❔ Other" },
];

const PAGE_SIZE = 50;

export default function PeoplePage() {
  const [data, setData] = useState<PersonInsight[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [relation, setRelation] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPeople({ limit: PAGE_SIZE, offset, relation: relation || undefined, search: search || undefined });
      setData(res.data);
      setTotal(res.total);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [offset, relation, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRelationChange = (r: string) => {
    setRelation(r);
    setOffset(0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setOffset(0);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="section-title">People</h1>
          <p className="section-subtitle">View all people who have interacted with your posts</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>{total.toLocaleString()}</p>
          <p style={{ color: "var(--color-text-muted)" }} className="text-xs">Total People</p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name…"
            className="flex-1 px-4 py-2.5 text-sm rounded-md border transition-all"
            style={{
              background: "var(--color-surface-alt)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <button type="submit" className="btn-primary text-sm">
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setSearchInput(""); setOffset(0); }}
              className="btn-secondary text-sm"
            >
              Clear
            </button>
          )}
        </form>

        {/* Relation filter tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
          {RELATIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRelationChange(r.value)}
              className="px-3 py-1.5 text-xs font-medium transition-all rounded-md"
              style={{
                background: relation === r.value ? "var(--color-primary)" : "transparent",
                color: relation === r.value ? "white" : "var(--color-text-secondary)",
                border: relation === r.value ? "none" : `1px solid var(--color-border)`,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 py-8">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
              <p style={{ color: "var(--color-text-muted)" }} className="text-sm">Loading people…</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--color-danger)" }}>{error}</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No people found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="table-header border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest w-12" style={{ color: "var(--color-text-muted)" }}>ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Relation</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Reactions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Comments</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Interactions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                {data.map((person, idx) => (
                  <tr key={person.id} className="table-row border-b">
                    <td className="px-4 py-3" style={{ color: "var(--color-text-muted)" }}>{offset + idx + 1}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--color-text)" }}>{person.name}</td>
                    <td className="px-4 py-3">
                      <RelationBadge relation={person.relation} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: "var(--color-accent)" }}>{person.reactions}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: "var(--color-warning)" }}>{person.comments}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: "var(--color-text)" }}>{person.total_interactions}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(person.reaction_types).slice(0, 3).map(([type, count]) => (
                          <span
                            key={type}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded"
                            style={{ background: "var(--color-surface-alt)", color: "var(--color-text-secondary)" }}
                          >
                            {REACTION_EMOJI[type] ?? "❔"}<span>{count}</span>
                          </span>
                        ))}
                        {Object.entries(person.reaction_types).length > 3 && (
                          <span className="text-xs text-gray-500">+{Object.entries(person.reaction_types).length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card flex items-center justify-between">
          <button
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0}
            className="btn-secondary disabled:opacity-40"
          >
            ← Previous
          </button>
          <span style={{ color: "var(--color-text-secondary)" }} className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setOffset(offset + PAGE_SIZE)}
            disabled={offset + PAGE_SIZE >= total}
            className="btn-secondary disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

