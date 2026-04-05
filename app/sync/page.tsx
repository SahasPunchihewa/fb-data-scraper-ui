"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSyncStatus,
  resetDatabase,
  triggerSync,
  type SyncState,
} from "@/lib/api";

export default function SyncPage() {
  const [state, setState] = useState<SyncState | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const s = await getSyncStatus();
      setState(s);
      if (!s.running && pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchStatus]);

  const startSync = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await triggerSync();
      setMessage("Sync started! Polling for updates…");
      pollRef.current = setInterval(fetchStatus, 1500);
    } catch (e: unknown) {
      setMessage(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const doReset = async () => {
    if (!confirm("This will delete ALL synced data. Continue?")) return;
    setResetting(true);
    try {
      const res = await resetDatabase();
      setMessage(res.message);
      await fetchStatus();
    } catch (e: unknown) {
      setMessage(`Error: ${(e as Error).message}`);
    } finally {
      setResetting(false);
    }
  };

  const isRunning = state?.running ?? false;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="section-title">Data Synchronization</h1>
        <p className="section-subtitle">Manage your Facebook data sync and database operations</p>
      </div>

      {/* Status card */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-amber-400 animate-pulse" : state ? "bg-green-500" : "bg-gray-600"}`} />
          <span className="font-medium" style={{ color: "var(--color-text)" }}>
            {isRunning ? "Sync in progress…" : state ? "Ready" : "Not connected"}
          </span>
        </div>

        {state?.error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(244, 63, 94, 0.1)", borderLeft: "3px solid #f43f5e", color: "#fb7185" }}>
            ⚠️ {state.error}
          </div>
        )}

        {state?.last_result && (
          <div className="rounded-lg p-4 space-y-3" style={{ background: "var(--color-surface-light)", borderColor: "var(--color-border)" }} className="border">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Last sync result</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(state.last_result).map(([key, val]) => (
                <div key={key} className="rounded-lg p-3 text-center card">
                  <p className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{val}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{key.replace(/_/g, " ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && (
          <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>{message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={startSync}
          disabled={isRunning || loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
        >
          {isRunning ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Syncing…
            </>
          ) : (
            "🔄 Sync Now"
          )}
        </button>

        <button
          onClick={doReset}
          disabled={isRunning || resetting}
          className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-all"
          style={{ background: "rgba(244, 63, 94, 0.15)", color: "#fb7185", border: "1px solid rgba(244, 63, 94, 0.3)" }}
        >
          {resetting ? "Resetting…" : "🗑 Reset Database"}
        </button>
      </div>

      {/* Info */}
      <div className="card p-6 space-y-3">
        <p className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>How it works</p>
        <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <li>Reads <code style={{ color: "var(--color-accent)" }}>connections/friends/your_friends.json</code></li>
          <li>Reads <code style={{ color: "var(--color-accent)" }}>connections/followers/people_who_followed_you.json</code></li>
          <li>Reads all <code style={{ color: "var(--color-accent)" }}>insights/post*_reactions.json</code> files</li>
          <li>Upserts everything into PostgreSQL (idempotent)</li>
        </ul>
      </div>
    </div>
  );
}

