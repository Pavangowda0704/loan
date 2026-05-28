import VehicleLoanDetailPage from "../components/VehicleLoanDetailPage";

export default function NewCarLoan() {
  return (
    <VehicleLoanDetailPage
      title="New Car Loan"
      subtitle="Drive home your dream car with our easy New Car Loan — up to 100% on-road financing."
      heroClass=""
      applyRoute="/vehicle-loan/new-car/apply"
      chip="NEW CAR LOAN"
      chipClass="vl-chip--blue"
      accentColor="#1A56DB"
      highlights={[
        {val:"Up to ₹50 Lakhs",label:"Loan Amount"},
        {val:"8.49%* Onwards",label:"Interest Rate"},
        {val:"Up to 7 Years",label:"Tenure"},
        {val:"24 Hours",label:"Quick Approval"},
      ]}
      overviewItems={[
        {icon:"💰",title:"100% On-Road Funding",desc:"Finance the entire on-road price including registration, insurance & accessories."},
        {icon:"⚡",title:"Quick Approval",desc:"Get approval within 24 hours after document submission."},
        {icon:"📅",title:"Flexible Tenure",desc:"Choose repayment tenure from 12 to 84 months based on your convenience."},
        {icon:"🏷️",title:"Competitive Rates",desc:"Interest rates starting from 8.49% p.a. for top credit profiles."},
      ]}
      benefits={["Up to 100% on-road price funding","Rates starting from 8.49% p.a.","Tenure up to 84 months","No pre-payment charges after 6 months","Balance transfer facility available","Special rates for women applicants"]}
      eligibility={[
        {label:"Age",value:"21 – 60 years"},
        {label:"Employment",value:"Salaried / Self-Employed / Business Owner"},
        {label:"Min. Monthly Income",value:"₹20,000 per month"},
        {label:"Work Experience",value:"At least 1 year (salaried)"},
        {label:"CIBIL Score",value:"700 or above preferred"},
        {label:"Loan Amount",value:"₹1 Lakh – ₹50 Lakhs"},
        {label:"Vehicle Age",value:"New vehicle from authorised dealer"},
      ]}
      documents={[
        {name:"Aadhaar Card",desc:"Government-issued identity & address proof"},
        {name:"PAN Card",desc:"Mandatory for all loan applications"},
        {name:"Salary Slips / ITR",desc:"Latest 3 months salary slips or 2 years ITR"},
        {name:"Bank Statement",desc:"6 months savings account statement"},
        {name:"Proforma Invoice",desc:"Invoice from authorised car dealer"},
        {name:"Passport Photo",desc:"Recent passport-size photograph"},
        {name:"Vehicle Insurance Quote",desc:"Insurance quotation from insurer"},
        {name:"Form 60 (if no PAN)",desc:"Alternate identity proof document"},
      ]}
      faqs={[
        {q:"Can I get 100% financing for a new car?",a:"Yes, LoanEase offers up to 100% on-road financing for new cars, subject to your income and credit profile."},
        {q:"What is the minimum income required?",a:"A minimum monthly income of ₹20,000 is required for salaried applicants. Self-employed individuals need an annual income of ₹2.4 Lakhs."},
        {q:"Can I prepay my car loan?",a:"Yes, you can prepay after 6 months. There are no prepayment charges after the 6-month lock-in period."},
        {q:"Is insurance mandatory for the car?",a:"Yes, comprehensive car insurance is mandatory. We can help arrange insurance through our partner insurers."},
      ]}
      emiConfig={{defaultRate:8.49,maxAmt:5000000,minAmt:100000,minRate:8.49}}
    />
  );
}