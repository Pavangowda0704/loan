// frontend/src/modules/homeLoan/components/HomeLoanCard.jsx
import { useNavigate } from 'react-router-dom';

const HomeLoanCard = ({ loan }) => {
  const navigate = useNavigate();

  return (
    <div
      className="hl-loan-card"
      onClick={() => {
  switch (loan.slug) {
    case "lap":
      navigate("/loan-against-property");
      break;

    case "mortgage-loan":
      navigate("/mortgage-loan");
      break;

    case "site-purchase":
      navigate("/site-purchase-loan");
      break;

    case "balance-transfer":
      navigate("/balance-transfer");
      break;

    case "refinance":
      navigate("/new-house-refinance");
      break;

    case "house-purchase":
      navigate("/house-purchase-loan");
      break;

    case "construction":
      navigate("/construction-loan");
      break;

    case "mixed-usage":
      navigate("/mixed-usage-property");
      break;

    default:
      navigate(`/home-loan/${loan.slug}`);
  }
}}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/home-loan/${loan.slug}`); }}
    >
      <div className="hl-loan-card__icon">{loan.icon}</div>
      <div className="hl-loan-card__name">{loan.name}</div>
      <div className="hl-loan-card__desc">{loan.description}</div>
      <div className="hl-loan-card__footer">
        <span className="hl-loan-card__rate">From {loan.rate}% p.a.</span>
        <button
          className="hl-btn hl-btn--primary hl-btn--sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/home-loan/apply?type=${loan.slug}`);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default HomeLoanCard;
