import React, { useEffect, useState } from "react";
import useLiveHosts from "./hook/useLiveHosts";

/**
 * LiveHostsDemo - small demo component to show how to use useLiveHosts hook
 * Allows entering a userId, connecting, and displays video/audio hosts + errors
 */
const LiveHostsDemo: React.FC = () => {
  const [userIdInput, setUserIdInput] = useState<string>("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const {
    videoHosts,
    audioHosts,
    errors,
    connected,
    requestVideoHosts,
    requestAudioHosts,
  } = useLiveHosts(activeUserId);

  // when connected, automatically request latest hosts (safe to call repeatedly)
  useEffect(() => {
    if (!connected) return;
    // request current lists after connect
    requestVideoHosts();
    requestAudioHosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Roboto, Arial" }}>
      <h2>Live Hosts (Socket demo)</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Enter userId"
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
          style={{ padding: 8, width: 420, maxWidth: "100%" }}
        />
        <button
          onClick={() => setActiveUserId(userIdInput.trim() || null)}
          style={{ marginLeft: 8, padding: "8px 12px" }}
        >
          Connect
        </button>
        <button
          onClick={() => setActiveUserId(null)}
          style={{ marginLeft: 8, padding: "8px 12px" }}
        >
          Disconnect
        </button>
        <div style={{ marginTop: 8 }}>
          <strong>Status:</strong> {connected ? "connected" : "disconnected"}
          {activeUserId ? <span> — connected as {activeUserId}</span> : null}
        </div>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => requestVideoHosts()}
            style={{ padding: "6px 10px", marginRight: 8 }}
          >
            Request Video Hosts
          </button>
          <button
            onClick={() => requestAudioHosts()}
            style={{ padding: "6px 10px" }}
          >
            Request Audio Hosts
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <section style={{ flex: 1, minWidth: 280 }}>
          <h3>Video Hosts ({videoHosts.length})</h3>
          {videoHosts.length === 0 ? (
            <p>No video hosts yet.</p>
          ) : (
            <ul>
              {videoHosts.map((h) => (
                <li key={h._id} style={{ marginBottom: 8 }}>
                  <div>
                    <strong>{h.name}</strong> — level {h.level}
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    uid: {h.uid}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ flex: 1, minWidth: 280 }}>
          <h3>Audio Hosts ({audioHosts.length})</h3>
          {audioHosts.length === 0 ? (
            <p>No audio hosts yet.</p>
          ) : (
            <ul>
              {audioHosts.map((h) => (
                <li key={h._id} style={{ marginBottom: 8 }}>
                  <div>
                    <strong>{h.name}</strong> — level {h.currentLevel ?? "n/a"}
                    {h.isMuted ? " (muted)" : ""}
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    uid: {h.uid}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ width: 320, minWidth: 220 }}>
          <h3>Errors ({errors.length})</h3>
          {errors.length === 0 ? (
            <p>No errors.</p>
          ) : (
            <ol>
              {errors.map((e, i) => (
                <li key={i} style={{ color: "#8d1c1c" }}>
                  {e}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
};

export default LiveHostsDemo;
