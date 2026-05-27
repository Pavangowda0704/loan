import { Link } from "react-router-dom";
import "../styles/personalLoan.css";
import "../styles/vehicleLoan.css";

const PRODUCTS = [
  {
    label: "New Car Purchase",
    sub: "For purchasing a brand-new car from authorised dealers.",
    icon: "🚗",
    type: "new-car",
  },
  {
    label: "Used Car Loan",
    sub: "Finance a pre-owned car with flexible tenure options.",
    icon: "🚙",
    type: "used-car",
  },
  {
    label: "Used Bike Loan",
    sub: "Get funds for a second-hand two-wheeler quickly.",
    icon: "🏍️",
    type: "used-bike",
  },
  {
    label: "Commercial Vehicle",
    sub: "Trucks, buses, and vans for business purposes.",
    icon: "🚛",
    type: "commercial",
  },
  {
    label: "Agriculture Equipment",
    sub: "Tractors and farm machinery financing solutions.",
    icon: "🚜",
    type: "agriculture",
  },
];

function VehicleLoan() {
  return (
    <section className="pl-page">
      <div className="pl-hero">
        <div>
          <span className="pl-tag">Vehicle Loan</span>
          <h1>Drive your dream vehicle today</h1>
          <p>
            Fast approvals, competitive interest rates, and flexible repayment
            for new and used vehicles — two-wheelers to commercial fleets.
          </p>

          <div className="pl-actions">
            <Link to="/vehicle-loan/eligibility" className="pl-primary-btn">
              Check Eligibility
            </Link>
            <Link to="/vehicle-loan/apply" className="pl-secondary-btn">
              Apply Now
            </Link>
          </div>
        </div>

        <div className="pl-highlight-card">
          <h3>Loan Highlights</h3>
          <ul>
            <li>Up to 100% on-road funding</li>
            <li>Quick 24-hour approval</li>
            <li>Tenure up to 84 months</li>
            <li>Minimal documentation</li>
            <li>No foreclosure charges</li>
          </ul>
        </div>
      </div>

      {/* Product grid */}
      <div className="vl-products-section">
        <h2>Vehicle Loan Products</h2>
        <div className="vl-product-grid">
          {PRODUCTS.map((p) => (
            <div className="vl-product-card" key={p.type}>
              <div className="vl-product-icon">{p.icon}</div>
              <h3>{p.label}</h3>
              <p>{p.sub}</p>
              <Link
                to={`/vehicle-loan/eligibility?type=${p.type}`}
                className="pl-primary-btn"
              >
                Check Eligibility
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="pl-section">
        <h2>Why Choose LoanEase Vehicle Loan?</h2>
        <div className="pl-benefits">
          {[
            "Competitive interest rates",
            "Up to 100% on-road funding",
            "Quick 24-hr approval",
            "Flexible repayment tenure",
            "Minimal documentation",
            "Dedicated loan manager",
          ].map((item) => (
            <div className="pl-benefit" key={item}>
              ✓ {item}
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="pl-section">
        <h2>Required Documents</h2>
        <div className="pl-doc-grid">
          <div>
            <h3>All Vehicle Loans</h3>
            <p>
              Aadhaar Card, PAN Card, Income Proof, 6-Month Bank Statement,
              Vehicle Quotation, Passport Photo.
            </p>
          </div>
          <div>
            <h3>For Used Vehicles</h3>
            <p>
              All of the above + RC Copy of vehicle, Form 35 (NOC), Insurance
              copy, Vehicle valuation report.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VehicleLoan;
