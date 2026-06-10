// ============================================================
//  VehicleLoanDetailPage.jsx  —  Shared template used by
//  NewCarLoan / UsedCarLoan / TwoWheelerLoan / UsedBikeLoan /
//  CommercialVehicleLoan / AgricultureEquipmentLoan
//
//  SAFETY: All props interface unchanged. All routes preserved.
//  VehicleEmiWidget props interface unchanged.
//  All existing data (eligibility, documents, faqs) preserved.
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import VehicleEmiWidget from "./VehicleEmiWidget";
import "../vehicleLoan.css";

// ── Vehicle emoji map for hero visuals ──────────────────────
const HERO_EMOJI = {
  "New Car Loan":               { emoji: "🚗", bg: "linear-gradient(135deg,#0F1C3F 0%,#003087 100%)" },
  "Used Car Loan":              { emoji: "🚙", bg: "linear-gradient(135deg,#7c2d12 0%,#ea580c 100%)" },
  "Two-Wheeler Loan":           { emoji: "🏍️", bg: "linear-gradient(135deg,#064e3b 0%,#10b981 100%)" },
  "Used Bike Loan":             { emoji: "🛵", bg: "linear-gradient(135deg,#064e3b 0%,#059669 100%)" },
  "Commercial Vehicle Loan":    { emoji: "🚚", bg: "linear-gradient(135deg,#3b0764 0%,#7c3aed 100%)" },
  "Agriculture Equipment Loan": { emoji: "🚜", bg: "linear-gradient(135deg,#14532d 0%,#16a34a 100%)" },
};

// ── Trust indicators shown in every hero ────────────────────
const TRUST_BADGES = ["🏦 RBI Regulated", "🔒 100% Secure", "⚡ Quick Disbursal", "📞 24/7 Support"];

// ── Process steps — same for all loan types ─────────────────
const PROCESS_STEPS = [
  { icon: "📋", title: "Apply Online",       desc: "Fill the application form with your personal, employment and vehicle details." },
  { icon: "📤", title: "Upload Documents",   desc: "Upload required KYC, income and vehicle documents securely through our portal." },
  { icon: "🔍", title: "Verification",       desc: "Our team verifies your application and documents — typically within 4–8 hours." },
  { icon: "✅", title: "Loan Approval",      desc: "Receive your approval notification with final loan amount, rate and tenure." },
  { icon: "💳", title: "Disbursement",       desc: "Loan amount disbursed directly to the dealer / seller within 24–48 hours." },
];

// ── Document category grouper ────────────────────────────────
function groupDocuments(documents) {
  const groups = {
    "Identity & KYC":   [],
    "Income Proof":     [],
    "Vehicle Documents":[],
    "Other Documents":  [],
  };
  const kycKeys     = ["aadhaar","pan","photo","passport","identity","address"];
  const incomeKeys  = ["salary","itr","income","bank","p&l","statement","kcc","kisan","turnover"];
  const vehicleKeys = ["rc","noc","form 35","insurance","valuation","quotation","invoice","land","transport","registration","permit"];

  documents.forEach(d => {
    const key = (d.name + " " + d.desc).toLowerCase();
    if (vehicleKeys.some(k => key.includes(k)))     groups["Vehicle Documents"].push(d);
    else if (kycKeys.some(k => key.includes(k)))    groups["Identity & KYC"].push(d);
    else if (incomeKeys.some(k => key.includes(k))) groups["Income Proof"].push(d);
    else                                            groups["Other Documents"].push(d);
  });
  return Object.entries(groups).filter(([,items]) => items.length > 0);
}

// ── FAQ item — proper hook usage (not inside .map) ──────────
function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`vl-faq-item${open ? " open" : ""}`}>
      <button
        className="vl-faq-q"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{faq.q}</span>
        <span className="vl-faq-arrow" aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>
      <div className={`vl-faq-a-wrap${open ? " vl-faq-a-wrap--open" : ""}`}>
        <div className="vl-faq-a">{faq.a}</div>
      </div>
    </div>
  );
}

// ── Related loan products ────────────────────────────────────
const ALL_PRODUCTS = [
  { slug: "new-car",              title: "New Car Loan",             icon: "🚗",  rate: "8.49%" },
  { slug: "used-car",             title: "Used Car Loan",            icon: "🚙",  rate: "10.5%" },
  { slug: "two-wheeler",          title: "Two-Wheeler Loan",         icon: "🏍️", rate: "9.5%"  },
  { slug: "used-bike",            title: "Used Bike Loan",           icon: "🛵",  rate: "10.5%" },
  { slug: "commercial",           title: "Commercial Vehicle Loan",  icon: "🚚",  rate: "11%"   },
  { slug: "agriculture-equipment",title: "Agriculture Equipment Loan",icon: "🚜", rate: "9%"    },
];

// ── Main component ───────────────────────────────────────────
export default function VehicleLoanDetailPage({
  title, subtitle, heroClass, applyRoute,
  highlights, overviewItems, benefits,
  eligibility, documents, faqs,
  emiConfig, accentColor = "#1A56DB",
  chip, chipClass,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Eligibility", "Documents", "EMI Calculator", "FAQs"];

  const hero       = HERO_EMOJI[title] || { emoji: "🚗", bg: "linear-gradient(135deg,#0F1C3F 0%,#003087 100%)" };
  const docGroups  = groupDocuments(documents);
  const related    = ALL_PRODUCTS.filter(p => !applyRoute.includes(p.slug)).slice(0, 4);

  // Salaried vs self-employed split from eligibility rows
  const salaryRow = eligibility.find(r => r.label.toLowerCase().includes("income") || r.label.toLowerCase().includes("salary"));

  return (
    <div className="vl-page">

      {/* ── Breadcrumb ── */}
      <div className="vl-breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/vehicle-loan">Vehicle Loan</Link><span>›</span>
        <span>{title}</span>
      </div>

      {/* ── IMPROVED HERO ── */}
      <section className="vld-hero" style={{ background: hero.bg }}>
        <div className="vld-hero-inner">
          <div className="vld-hero-left">
            <div className={`vl-chip ${chipClass || ""}`} style={{ marginBottom: 14 }}>
              {chip || "VEHICLE LOAN"}
            </div>
            <h1 className="vld-hero-title">{title}</h1>
            <p className="vld-hero-sub">{subtitle}</p>

            {/* Key benefits with icons */}
            <div className="vld-hero-benefits">
              {highlights.map(h => (
                <div key={h.label} className="vld-hero-benefit">
                  <span className="vld-hero-benefit-val" style={{ color: "#fdba74" }}>{h.val}</span>
                  <span className="vld-hero-benefit-lab">{h.label}</span>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="vld-hero-trust">
              {TRUST_BADGES.map(b => (
                <span key={b} className="vld-hero-trust-badge">{b}</span>
              ))}
            </div>

            <div className="vl-actions" style={{ marginTop: 24 }}>
              <Link to={applyRoute} className="vl-btn-primary">Apply Now →</Link>
              <Link to="/vehicle-loan/eligibility" className="vl-btn-white">Check Eligibility</Link>
            </div>
          </div>

          {/* Vehicle visual */}
          <div className="vld-hero-visual">
            <div className="vld-hero-emoji-wrap" style={{ borderColor: `${accentColor}55` }}>
              <span className="vld-hero-emoji">{hero.emoji}</span>
            </div>
            <div className="vld-hero-card">
              <div className="vld-hero-card-title">Quick Snapshot</div>
              {highlights.slice(0, 4).map(h => (
                <div key={h.label} className="vld-hero-card-row">
                  <span>{h.label}</span>
                  <strong style={{ color: accentColor }}>{h.val}</strong>
                </div>
              ))}
              <Link to={applyRoute}
                className="vl-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 14, fontSize: 13, padding: "10px" }}>
                Apply Now →
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="vl-hero-blob vl-hero-blob--1" />
        <div className="vl-hero-blob vl-hero-blob--2" />
      </section>

      {/* ── Tabs ── */}
      <div className="vl-tabs-bar">
        {tabs.map(t => (
          <button
            key={t}
            className={`vl-tab${activeTab === t ? " active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="vl-tab-content">

        {/* ════════════════════ OVERVIEW ════════════════════ */}
        {activeTab === "Overview" && (
          <div className="vl-tab-layout">
            <div className="vl-tab-main">

              {/* About */}
              <div className="vld-section-block">
                <h3 className="vld-block-title">About {title}</h3>
                <div className="vl-overview-grid">
                  {overviewItems.map(o => (
                    <div key={o.title} className="vl-overview-card">
                      <span className="vl-overview-icon">{o.icon}</span>
                      <div><h5>{o.title}</h5><p>{o.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features & Benefits */}
              {benefits && (
                <div className="vld-section-block">
                  <h3 className="vld-block-title">Features &amp; Benefits</h3>
                  <div className="vld-benefits-grid">
                    {benefits.map(b => (
                      <div key={b} className="vld-benefit-chip">
                        <span className="vld-benefit-check" style={{ color: accentColor }}>✓</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loan Highlights */}
              <div className="vld-section-block">
                <h3 className="vld-block-title">Loan Highlights</h3>
                <div className="vld-highlights-grid">
                  {highlights.map(h => (
                    <div key={h.label} className="vld-highlight-card" style={{ borderTopColor: accentColor }}>
                      <div className="vld-highlight-val" style={{ color: accentColor }}>{h.val}</div>
                      <div className="vld-highlight-lab">{h.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose This Loan */}
              <div className="vld-section-block">
                <h3 className="vld-block-title">Why Choose This Loan?</h3>
                <div className="vld-why-grid">
                  {[
                    { icon: "💼", title: "Trusted Lender",    desc: "RBI-regulated NBFC with 5 lakh+ satisfied customers across India." },
                    { icon: "⚡", title: "Fast Processing",   desc: "Dedicated processing team ensures quick turnaround from application to disbursal." },
                    { icon: "🤝", title: "Doorstep Service",  desc: "Relationship manager assigned for document pickup and query resolution." },
                    { icon: "🔓", title: "No Hidden Charges", desc: "Transparent fee structure — no surprise charges at any stage." },
                  ].map(w => (
                    <div key={w.title} className="vld-why-card">
                      <div className="vld-why-icon">{w.icon}</div>
                      <h5>{w.title}</h5>
                      <p>{w.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suitable For */}
              <div className="vld-section-block">
                <h3 className="vld-block-title">Suitable For</h3>
                <div className="vld-suitable-grid">
                  {eligibility
                    .filter(r => r.label === "Employment" || r.label === "Occupation")
                    .map(r => r.value.split("/").map(s => s.trim())).flat()
                    .map(profile => (
                      <div key={profile} className="vld-suitable-chip">
                        <span style={{ color: accentColor }}>👤</span> {profile}
                      </div>
                    ))
                  }
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="vl-tab-side">
              <VehicleEmiWidget {...emiConfig} accentColor={accentColor} />
              <Link to={applyRoute} className="vl-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Apply Now →</Link>
              <Link to="/vehicle-loan/eligibility" className="vl-btn-outline" style={{ width: "100%", justifyContent: "center" }}>Check Eligibility</Link>
            </div>
          </div>
        )}

        {/* ════════════════════ ELIGIBILITY ════════════════════ */}
        {activeTab === "Eligibility" && (
          <div className="vl-tab-layout">
            <div className="vl-tab-main">

              <div className="vld-section-block">
                <h3 className="vld-block-title">Eligibility Criteria</h3>

                {/* Salaried vs Self-Employed cards */}
                <div className="vld-elig-profile-grid">
                  <div className="vld-elig-profile-card" style={{ borderTopColor: accentColor }}>
                    <div className="vld-elig-profile-icon">👔</div>
                    <h4>Salaried Applicants</h4>
                    <ul>
                      <li>Regular monthly salary income</li>
                      <li>Minimum 1 year work experience</li>
                      <li>Salary slips + Form 16 required</li>
                      <li>Strong CIBIL score preferred</li>
                    </ul>
                  </div>
                  <div className="vld-elig-profile-card" style={{ borderTopColor: accentColor }}>
                    <div className="vld-elig-profile-icon">🏢</div>
                    <h4>Self-Employed / Business</h4>
                    <ul>
                      <li>Stable business income / turnover</li>
                      <li>Min 2 years business vintage</li>
                      <li>ITR + P&amp;L statement required</li>
                      <li>Bank statement showing stability</li>
                    </ul>
                  </div>
                </div>

                {/* Eligibility table */}
                <div className="vld-elig-table-wrap">
                  <h4 className="vld-sub-heading">Detailed Criteria</h4>
                  <div className="vl-elig-table">
                    {eligibility.map(r => (
                      <div key={r.label} className="vl-elig-row">
                        <span className="vl-elig-label">{r.label}</span>
                        <span className="vl-elig-val">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="vl-note">
                <span>ℹ️</span>
                <p>Eligibility is subject to credit assessment, income verification, and LoanEase's credit policies. Final eligibility and loan amount may vary based on your profile.</p>
              </div>

              <div style={{ marginTop: 22 }}>
                <Link to="/vehicle-loan/eligibility" className="vl-btn-blue">Check My Eligibility →</Link>
              </div>
            </div>

            <div className="vl-tab-side">
              <VehicleEmiWidget {...emiConfig} accentColor={accentColor} />
              <Link to={applyRoute} className="vl-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Apply Now →</Link>
            </div>
          </div>
        )}

        {/* ════════════════════ DOCUMENTS ════════════════════ */}
        {activeTab === "Documents" && (
          <div className="vl-tab-layout">
            <div className="vl-tab-main">
              <div className="vld-section-block">
                <h3 className="vld-block-title">Required Documents</h3>
                <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
                  Keep these documents ready for a smooth and fast application process.
                  All uploads should be clear, legible scans or photographs.
                </p>

                {/* Categorized document groups */}
                {docGroups.map(([groupName, docs]) => (
                  <div key={groupName} className="vld-doc-group">
                    <div className="vld-doc-group-title">
                      {groupName === "Identity & KYC" && "🪪 "}
                      {groupName === "Income Proof"     && "💰 "}
                      {groupName === "Vehicle Documents" && "🚗 "}
                      {groupName === "Other Documents"   && "📋 "}
                      {groupName}
                    </div>
                    <div className="vl-docs-tab-grid">
                      {docs.map(d => (
                        <div key={d.name} className="vl-doc-tab-item">
                          <span className="vl-doc-check" style={{ background: accentColor }}>✓</span>
                          <div><h5>{d.name}</h5><p>{d.desc}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="vl-note" style={{ marginTop: 8 }}>
                <span>💡</span>
                <p>Documents should be in JPG, PNG or PDF format (max 5MB each). Password-protected or blurry files will delay processing.</p>
              </div>

              <div style={{ marginTop: 20 }}>
                <Link to={applyRoute} className="vl-btn-primary">Start Application &amp; Upload Documents →</Link>
              </div>
            </div>

            <div className="vl-tab-side">
              <VehicleEmiWidget {...emiConfig} accentColor={accentColor} />
              <Link to={applyRoute} className="vl-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Apply Now →</Link>
            </div>
          </div>
        )}

        {/* ════════════════════ EMI CALCULATOR ════════════════ */}
        {activeTab === "EMI Calculator" && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F1C3F", marginBottom: 20 }}>
              {title} — EMI Calculator
            </h3>
            <VehicleEmiWidget {...emiConfig} accentColor={accentColor} />
            <div style={{ textAlign: "center", marginTop: 22 }}>
              <Link to={applyRoute} className="vl-btn-primary">Apply Now →</Link>
            </div>
          </div>
        )}

        {/* ════════════════════ FAQs ════════════════════ */}
        {activeTab === "FAQs" && (
          <div style={{ maxWidth: 760 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F1C3F", marginBottom: 20 }}>
              Frequently Asked Questions
            </h3>
            <div className="vl-faq-list">
              {/* FaqItem uses useState correctly — not inside .map render */}
              {faqs.map((f, i) => <FaqItem key={i} faq={f} />)}
            </div>
          </div>
        )}

      </div>

      {/* ── Application Process Timeline ── */}
      <section className="vld-process-section">
        <div className="vld-process-inner">
          <div className="vl-section-head" style={{ marginBottom: 36 }}>
            <div className="vl-chip vl-chip--blue">HOW IT WORKS</div>
            <h2>Simple 5-Step Process</h2>
            <p>From application to disbursement — fast, transparent, fully digital</p>
          </div>
          <div className="vld-process-steps">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.title} className="vld-process-step">
                <div className="vld-process-line" aria-hidden="true" />
                <div className="vld-process-bubble" style={{ background: accentColor }}>
                  <span>{i + 1}</span>
                </div>
                <div className="vld-process-icon">{s.icon}</div>
                <h5>{s.title}</h5>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to={applyRoute} className="vl-btn-primary">Start Your Application →</Link>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      <section className="vld-related-section">
        <div className="vld-related-inner">
          <div className="vl-section-head" style={{ marginBottom: 28 }}>
            <div className="vl-chip">OTHER LOAN OPTIONS</div>
            <h2>Explore More Vehicle Loans</h2>
          </div>
          <div className="vld-related-grid">
            {related.map(p => (
              <div key={p.slug} className="vld-related-card">
                <div className="vld-related-icon">{p.icon}</div>
                <h4>{p.title}</h4>
                <div className="vld-related-rate">From {p.rate} p.a.</div>
                <div className="vld-related-actions">
                  <Link to={`/vehicle-loan/${p.slug}`} className="vl-btn-blue" style={{ fontSize: 12, padding: "8px 14px" }}>
                    Know More
                  </Link>
                  <Link to={`/vehicle-loan/${p.slug}/apply`} className="vl-btn-outline" style={{ fontSize: 12, padding: "8px 14px" }}>
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── (unchanged) */}
      <section className="vl-cta">
        <h2>Apply for {title} Today</h2>
        <p>Quick process · Competitive rates · Fast disbursal</p>
        <div className="vl-actions vl-actions--center">
          <Link to={applyRoute} className="vl-btn-primary">Apply Now →</Link>
          <Link to="/vehicle-loan/eligibility" className="vl-btn-white">Check Eligibility</Link>
        </div>
      </section>

    </div>
  );
}
