import VehicleLoanDetailPage from "../components/VehicleLoanDetailPage";

export default function UsedCarLoan() {
  return (
    <VehicleLoanDetailPage
      title="Used Car Loan"
      subtitle="Best loan solutions for your pre-owned car with quick processing and minimal paperwork."
      heroClass="vl-sub-hero--orange"
      applyRoute="/vehicle-loan/used-car/apply"
      chip="USED CAR LOAN"
      chipClass=""
      accentColor="#f97316"
      highlights={[
        {val:"Up to ₹30 Lakhs",label:"Loan Amount"},
        {val:"10.5%* Onwards",label:"Interest Rate"},
        {val:"Up to 5 Years",label:"Tenure"},
        {val:"48 Hours",label:"Quick Approval"},
      ]}
      overviewItems={[
        {icon:"🚙",title:"Up to 90% Car Value",desc:"Get financing up to 90% of the assessed value of the pre-owned vehicle."},
        {icon:"⚡",title:"Quick & Easy Processing",desc:"Streamlined process with faster approval for used vehicles."},
        {icon:"📄",title:"Minimal Documentation",desc:"Simple process with minimal paperwork required."},
        {icon:"🔄",title:"Flexible Repayment",desc:"Tenure options from 12 to 60 months to suit your cash flow."},
      ]}
      benefits={["Financing up to 90% of car value","Cars up to 10 years old eligible","Rates starting 10.5% p.a.","Tenure up to 60 months","Free vehicle valuation","Quick 48-hour approval"]}
      eligibility={[
        {label:"Age",value:"21 – 65 years"},
        {label:"Employment",value:"Salaried / Self-Employed / Business Owner"},
        {label:"Min. Monthly Income",value:"₹20,000 per month"},
        {label:"CIBIL Score",value:"700 or above preferred"},
        {label:"Loan Amount",value:"₹50,000 – ₹30 Lakhs"},
        {label:"Vehicle Age",value:"Not more than 10 years old"},
        {label:"Vehicle Valuation",value:"By LoanEase-empanelled evaluator"},
      ]}
      documents={[
        {name:"Aadhaar Card",desc:"Identity & address proof"},
        {name:"PAN Card",desc:"Mandatory for all loan applications"},
        {name:"Income Proof",desc:"Salary slips / ITR / P&L Statement"},
        {name:"Bank Statement",desc:"6 months account statement"},
        {name:"RC Copy of Vehicle",desc:"Registration certificate of the car"},
        {name:"Form 35 (NOC)",desc:"No-objection certificate from seller/bank"},
        {name:"Insurance Copy",desc:"Current insurance policy of the vehicle"},
        {name:"Vehicle Valuation Report",desc:"From LoanEase-approved evaluator"},
      ]}
      faqs={[
        {q:"What is the maximum age of car eligible for used car loan?",a:"Cars up to 10 years old are eligible. The final loan tenure will ensure the car age at end of tenure does not exceed 12 years."},
        {q:"How is the loan amount calculated for used cars?",a:"The loan amount is based on the assessed market value of the vehicle, typically up to 90% of the valuation done by our empanelled valuator."},
        {q:"Can I transfer my existing used car loan to LoanEase?",a:"Yes, we offer a balance transfer facility at attractive rates. Contact us for a quick assessment."},
        {q:"Is vehicle valuation mandatory?",a:"Yes, a professional vehicle valuation by our empanelled evaluator is mandatory to determine the loan amount."},
      ]}
      emiConfig={{defaultRate:10.5,maxAmt:3000000,minAmt:50000,minRate:10.5}}
    />
  );
}