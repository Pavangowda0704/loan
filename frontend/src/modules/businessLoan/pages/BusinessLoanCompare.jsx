// ============================================================
//  BusinessLoanCompare.jsx — Loan Comparison Page
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../businessLoan.css";

const LOANS = [
  {
    id: "secured-business-loan",  icon: "🏛️", name: "Secured",
    fullName: "Secured Business Loan",
    amount: "₹10L – ₹5 Cr", rate: "10–16%", tenure: "1–7 Yrs",
    collateral: "Required", approval: "3–5 days", minScore: "650+",
    minTurnover: "₹50 L", minYears: "3 years", fee: "1–2%",
    pros: ["Lowest interest rates", "Highest loan amount", "Longest tenure", "Relaxed CIBIL requirement"],
    cons: ["Collateral mandatory", "Longer process", "More documentation"],
    bestFor: "Large established businesses needing substantial long-term capital.",
    color: "#003087",
  },
  {
    id: "unsecured-business-loan", icon: "⚡", name: "Unsecured",
    fullName: "Unsecured Business Loan",
    amount: "₹1L – ₹75L", rate: "12–22%", tenure: "1–5 Yrs",
    collateral: "Not Required", approval: "24–48 hrs", minScore: "700+",
    minTurnover: "₹30 L", minYears: "2 years", fee: "1.5–2.5%",
    pros: ["No collateral", "Fastest approval", "Minimal documents", "Quick disbursal"],
    cons: ["Higher interest rate", "Lower max amount", "Stricter CIBIL"],
    bestFor: "SMEs needing quick funds without pledging assets.",
    color: "#7c3aed",
  },
  {
    id: "working-capital-loan",    icon: "🔄", name: "Working Capital",
    fullName: "Working Capital Loan",
    amount: "₹1L – ₹1 Cr", rate: "11–18%", tenure: "3M – 3 Yrs",
    collateral: "Not Required", approval: "24–72 hrs", minScore: "650+",
    minTurnover: "₹25 L", minYears: "2 years", fee: "1–2%",
    pros: ["Revolving credit option", "Short tenure", "Seasonal flexibility", "No usage restriction"],
    cons: ["Lower max amount", "Short repayment window", "Higher rate than secured"],
    bestFor: "Businesses with seasonal demand or cash flow gaps.",
    color: "#0891b2",
  },
  {
    id: "business-expansion-loan", icon: "📈", name: "Expansion",
    fullName: "Business Expansion Loan",
    amount: "₹10L – ₹5 Cr", rate: "10.5–18%", tenure: "1–7 Yrs",
    collateral: "Optional", approval: "3–7 days", minScore: "680+",
    minTurnover: "₹50 L", minYears: "3 years", fee: "1–2%",
    pros: ["High capital access", "Phased disbursal", "Long tenure", "Equipment + infra funded"],
    cons: ["Needs expansion plan", "Longer processing", "Higher eligibility bar"],
    bestFor: "Established businesses ready to scale or open new branches.",
    color: "#16a34a",
  },
];

const ROWS = [
  { label: "Loan Amount",       key: "amount"      },
  { label: "Interest Rate",     key: "rate"        },
  { label: "Tenure",            key: "tenure"      },
  { label: "Collateral",        key: "collateral"  },
  { label: "Approval Time",     key: "approval"    },
  { label: "Min. CIBIL Score",  key: "minScore"    },
  { label: "Min. Turnover",     key: "minTurnover" },
  { label: "Min. Biz Age",      key: "minYears"    },
  { label: "Processing Fee",    key: "fee"         },
];

export default function BusinessLoanCompare() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(["secured-business-loan", "unsecured-business-loan"]);
  const [tab, setTab] = useState("overview");

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.length > 2 ? prev.filter(x => x !== id) : prev
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const display = LOANS.filter(l => selected.includes(l.id));

  return (
    <div>

      {/* ── Hero ── */}
      <section className="bl-hero">
        <div className="container">
          <span className="section-label">Compare Loans</span>
          <h1>Compare Business <span>Loan Types</span></h1>
          <p>Select up to 4 loan types to compare side-by-side across rates, features, and eligibility.</p>
        </div>
      </section>

      <section className="bl-section">
        <div className="container">

          {/* ── Selector ── */}
          <div className="card" style={{ padding: "22px 24px", marginBottom: 28 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#00C853", marginBottom: 12 }}>
              Select Loan Types to Compare (2–4)
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {LOANS.map(loan => {
                const on = selected.includes(loan.id);
                return (
                  <button key={loan.id} onClick={() => toggle(loan.id)}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 8, border: `2px solid ${on ? loan.color : "var(--color-border)"}`, background: on ? `${loan.color}12` : "var(--color-bg)", color: on ? loan.color : "var(--color-muted)", fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", transition: "all 0.18s", fontFamily: "var(--font-body)" }}>
                    {loan.icon} {loan.fullName} {on && "✓"}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: "0.74rem", color: "var(--color-muted)", marginTop: 8 }}>
              {selected.length} of 4 selected. Min. 2 required.
            </p>
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--color-bg)", padding: 4, borderRadius: 10, width: "fit-content", border: "1px solid var(--color-border)" }}>
            {[
              { id: "overview",   label: "📊 Overview"    },
              { id: "pros-cons",  label: "⚖️ Pros & Cons" },
              { id: "eligibility",label: "✅ Eligibility"  },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.84rem", transition: "all 0.18s", background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "var(--color-navy)" : "var(--color-muted)", boxShadow: tab === t.id ? "var(--shadow-card)" : "none" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Table ── */}
          <div className="card" style={{ overflow: "hidden" }}>

            {/* Header row */}
            <div style={{ display: "flex", borderBottom: "2px solid var(--color-border)" }}>
              <div style={{ width: 180, flexShrink: 0, padding: "18px 20px", background: "var(--color-bg)", borderRight: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)" }}>Feature</span>
              </div>
              {display.map(loan => (
                <div key={loan.id} style={{ flex: 1, padding: "18px 16px 14px", textAlign: "center", borderRight: "1px solid var(--color-border)", borderTop: `4px solid ${loan.color}` }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 5 }}>{loan.icon}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-navy)", lineHeight: 1.3, marginBottom: 3 }}>{loan.fullName}</div>
                </div>
              ))}
            </div>

            {/* Overview tab */}
            {tab === "overview" && ROWS.map((row, ri) => (
              <div key={row.label} style={{ display: "flex", borderBottom: "1px solid #f1f5f9", background: ri % 2 === 0 ? "#fff" : "var(--color-bg)" }}>
                <div style={{ width: 180, flexShrink: 0, padding: "12px 20px", borderRight: "1px solid var(--color-border)", display: "flex", alignItems: "center", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-muted)" }}>
                  {row.label}
                </div>
                {display.map(loan => (
                  <div key={loan.id} style={{ flex: 1, padding: "12px 14px", textAlign: "center", borderRight: "1px solid #f1f5f9", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {loan[row.key]}
                  </div>
                ))}
              </div>
            ))}

            {/* Pros & Cons tab */}
            {tab === "pros-cons" && (
              <div style={{ display: "flex" }}>
                <div style={{ width: 180, flexShrink: 0, borderRight: "1px solid var(--color-border)" }} />
                {display.map(loan => (
                  <div key={loan.id} style={{ flex: 1, padding: "22px 16px", borderRight: "1px solid var(--color-border)" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#065f46", marginBottom: 10 }}>✅ Pros</div>
                    <ul style={{ listStyle: "none", marginBottom: 18, display: "flex", flexDirection: "column", gap: 7 }}>
                      {loan.pros.map((p, i) => (
                        <li key={i} style={{ fontSize: "0.8rem", color: "#166534", display: "flex", gap: 5 }}><span style={{ color: "#00C853", fontWeight: 700 }}>+</span>{p}</li>
                      ))}
                    </ul>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#991b1b", marginBottom: 10 }}>⚠ Cons</div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                      {loan.cons.map((c, i) => (
                        <li key={i} style={{ fontSize: "0.8rem", color: "#991b1b", display: "flex", gap: 5 }}><span style={{ color: "#dc2626", fontWeight: 700 }}>–</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Eligibility tab */}
            {tab === "eligibility" && (
              <div style={{ display: "flex" }}>
                <div style={{ width: 180, flexShrink: 0, borderRight: "1px solid var(--color-border)" }} />
                {display.map(loan => (
                  <div key={loan.id} style={{ flex: 1, padding: "22px 16px", borderRight: "1px solid var(--color-border)" }}>
                    {[
                      ["Min. CIBIL",     loan.minScore     ],
                      ["Min. Turnover",  loan.minTurnover  ],
                      ["Min. Biz Age",   loan.minYears     ],
                      ["Collateral",     loan.collateral   ],
                      ["Best For",       loan.bestFor      ],
                    ].map(([l, v]) => (
                      <div key={l} style={{ marginBottom: 12, padding: "11px 13px", background: "var(--color-bg)", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)", marginBottom: 3 }}>{l}</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-navy)", lineHeight: 1.5 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Action row */}
            <div style={{ display: "flex", borderTop: "2px solid var(--color-border)", background: "var(--color-bg)" }}>
              <div style={{ width: 180, flexShrink: 0, padding: "16px 20px", borderRight: "1px solid var(--color-border)", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)" }}>Quick Actions</span>
              </div>
              {display.map(loan => (
                <div key={loan.id} style={{ flex: 1, padding: "14px 12px", textAlign: "center", borderRight: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="bla-btn-primary" style={{ width: "100%", fontSize: "0.8rem", padding: "8px" }} onClick={() => navigate(`/business-loan/apply?type=${loan.id}`)}>Apply Now</button>
                  <button className="bla-btn-outline"  style={{ width: "100%", fontSize: "0.8rem", padding: "8px" }} onClick={() => navigate(`/business-loan/${loan.id}`)}>Learn More</button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recommendation banner ── */}
          <div style={{ marginTop: 28, background: "linear-gradient(135deg, var(--color-navy) 0%, #1a2a5e 100%)", borderRadius: 14, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Not sure which one fits you?</div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>Check Your Eligibility First</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.84rem" }}>Our free checker recommends the right loan type based on your financials.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/business-loan/eligibility")}>
              Check Eligibility →
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
