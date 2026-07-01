"use client";

import { useCallback, useEffect, useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { CreateBountyForm } from "@/components/CreateBountyForm";
import { LoadBountyPanel } from "@/components/LoadBountyPanel";
import { BountyView } from "@/components/BountyView";
import { PlasmaCanvas } from "@/components/PlasmaCanvas";
import { useRecentBounties } from "@/hooks/useRecentBounties";
import { isContractConfigured, contractAddress } from "@/config/contract";
import { ritualChain } from "@/config/wagmi";
import { shortenAddress } from "@/lib/format";
import { Notice } from "@/components/ui";

export default function Home() {
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const { ids, add } = useRecentBounties();

  useEffect(() => {
    if (selectedId !== null) add(selectedId);
  }, [selectedId, add]);

  const handleCreated = useCallback(
    (id: bigint) => {
      add(id);
      setSelectedId(id);
    },
    [add],
  );

  return (
    <>
      {/* ── Plasma background canvas ── */}
      <PlasmaCanvas />

      {/* ── Holographic grid overlay ── */}
      <div className="holo-grid" />

      {/* ── App shell ── */}
      <div className="app-root">

        {/* ════════════════ HEADER ════════════════ */}
        <header className="cyber-header">
          <div style={{ maxWidth: 1152, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img
                src="/lockup.svg"
                alt="Ritual Logo"
                className="nav-logo"
              />
              <div className="nav-divider" />
              <div>
                <div className="nav-app-name">AI Bounty Judge</div>
                <div className="nav-chain">on {ritualChain.name}</div>
              </div>
            </div>

            {/* Wallet */}
            <WalletConnect />
          </div>
        </header>

        {/* ════════════════ MAIN ════════════════ */}
        <main style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px 48px" }}>

          {/* ── HERO ── */}
          <section className="hero-section">
            <div className="hero-copy">
              <div className="hero-tag">
                <div className="hero-tag-dot" />
                Powered by Ritual Network
              </div>

              <h1 className="hero-title">
                Crowd-Judged Bounties,
                <br />
                <span>Settled by AI.</span>
              </h1>

              <p className="hero-subtitle">
                Submit answers to a bounty. After the deadline, Ritual AI ranks
                all submissions. The bounty owner finalizes the winner.
              </p>

              <div className="hero-pills">
                <span className="hero-pill">⬡ AI review is advisory</span>
                <span className="hero-pill">◈ Commit-reveal privacy</span>
                <span className="hero-pill">◎ One winner per bounty</span>
                <span className="hero-pill">⟁ On-chain settlement</span>
              </div>
            </div>

            <aside className="hero-panel">
              <div className="hero-panel-header">Ritual Snapshot</div>
              <div className="hero-panel-body">
                <p className="hero-panel-copy">
                  Launch bounties, submit privately, and trust AI-assisted
                  ranking with an immersive on-chain experience.
                </p>

                <div className="hero-stat-grid">
                  <div className="stat-card">
                    <div className="stat-value">Commit</div>
                    <div className="stat-label">Reveal workflow</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">Secure</div>
                    <div className="stat-label">Proof-of-concept UI</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">Fast</div>
                    <div className="stat-label">Instant preview</div>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          {/* ── CONTRACT WARNING ── */}
          {!isContractConfigured && (
            <div style={{ marginBottom: 24 }}>
              <Notice tone="amber">
                No contract address configured. Copy{" "}
                <code className="monospace">.env.example</code> to{" "}
                <code className="monospace">.env.local</code> and set{" "}
                <code className="monospace">NEXT_PUBLIC_CONTRACT_ADDRESS</code>{" "}
                to start interacting on-chain.
              </Notice>
            </div>
          )}

          {/* ── DASHBOARD GRID ── */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 20,
            }}
          >
            <CreateBountyForm onCreated={handleCreated} />
            <LoadBountyPanel
              selectedId={selectedId}
              onSelect={setSelectedId}
              recentIds={ids}
            />
          </section>

          {/* ── SELECTED BOUNTY VIEW ── */}
          {selectedId !== null && (
            <section style={{ marginTop: 24 }}>
              <BountyView bountyId={selectedId} />
            </section>
          )}

          {/* ── FOOTER ── */}
          <footer className="cyber-footer">
            {contractAddress ? (
              <>
                Contract&nbsp;
                <span className="monospace">{shortenAddress(contractAddress, 6)}</span>
                &nbsp;·&nbsp;Chain {ritualChain.id}&nbsp;·&nbsp;Ritual Network
              </>
            ) : (
              <>Workshop demo · {ritualChain.name}</>
            )}
          </footer>
        </main>
      </div>
    </>
  );
}
