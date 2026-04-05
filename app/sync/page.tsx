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
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Sync JSON → Database</h1>

      {/* Status card */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${isRunning ? "bg-amber-400 animate-pulse" : state ? "bg-emerald-400" : "bg-slate-300"}`} />
          <span className="text-sm font-medium text-slate-700">
            {isRunning ? "Sync in progress…" : state ? "Idle" : "Not connected"}
          </span>
        </div>

        {state?.error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-rose-700 text-sm">
            ⚠️ {state.error}
          </div>
        )}

        {state?.last_result && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Last sync result</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(state.last_result).map(([key, val]) => (
                <div key={key} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                  <p className="text-xl font-bold text-indigo-600">{val}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{key.replace(/_/g, " ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && (
          <p className="text-sm text-indigo-600 font-medium">{message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={startSync}
          disabled={isRunning || loading}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
        >
          {isRunning ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Syncing…
            </>
          ) : (
            "🔄  Sync Now"
          )}
        </button>

        <button
          onClick={doReset}
          disabled={isRunning || resetting}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed text-rose-700 font-semibold py-3 px-6 rounded-xl transition-colors border border-rose-200"
        >
          {resetting ? "Resetting…" : "🗑  Reset Database"}
        </button>
      </div>

      {/* Info */}
      <div className="bg-indigo-50 rounded-xl p-5 text-sm text-indigo-800 space-y-1">
        <p className="font-semibold">How it works</p>
        <ul className="list-disc list-inside space-y-1 text-indigo-700">
          <li>Reads <code>connections/friends/your_friends.json</code></li>
          <li>Reads <code>connections/followers/people_who_followed_you.json</code></li>
          <li>Reads all <code>insights/post*_reactions.json</code> files</li>
          <li>Upserts everything into PostgreSQL (idempotent)</li>
        </ul>
      </div>
    </div>
  );
}

