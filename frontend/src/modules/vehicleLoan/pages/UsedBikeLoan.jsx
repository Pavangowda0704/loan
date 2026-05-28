import VehicleLoanDetailPage from "../components/VehicleLoanDetailPage";

export default function UsedBikeLoan() {
  return (
    <VehicleLoanDetailPage
      title="Used Bike Loan"
      subtitle="Affordable financing for pre-owned two-wheelers — bikes and scooters up to 7 years old."
      heroClass="vl-sub-hero--green"
      applyRoute="/vehicle-loan/used-bike/apply"
      chip="USED BIKE LOAN"
      chipClass=""
      accentColor="#10b981"
      highlights={[
        {val:"Up to ₹3 Lakhs",   label:"Loan Amount"},
        {val:"10.5%* Onwards",   label:"Interest Rate"},
        {val:"Up to 3 Years",    label:"Tenure"},
        {val:"48 Hours",         label:"Quick Approval"},
      ]}
      overviewItems={[
        {icon:"🏍️",title:"Up to 90% of Assessed Value",desc:"Finance up to 90% of the vehicle's assessed market value."},
        {icon:"💸",title:"Competitive Rates",desc:"Interest rates starting from 10.5% p.a. for pre-owned two-wheelers."},
        {icon:"⚡",title:"Fast Approval",desc:"Loan approval in 48 hours with minimal paperwork."},
        {icon:"📄",title:"Flexible Eligibility",desc:"Salaried, self-employed and even students with a co-applicant are eligible."},
      ]}
      benefits={[
        "Loan up to ₹3 Lakhs",
        "Rates from 10.5% p.a.",
        "Bikes up to 7 years old eligible",
        "No hidden charges",
        "Doorstep document pickup",
        "Quick disbursal to dealer",
      ]}
      eligibility={[
        {label:"Age",           value:"18 – 65 years"},
        {label:"Employment",    value:"Salaried / Self-Employed (with guarantor for students)"},
        {label:"Min. Monthly Income", value:"₹10,000 per month"},
        {label:"CIBIL Score",   value:"650 or above preferred"},
        {label:"Loan Amount",   value:"₹15,000 – ₹3 Lakhs"},
        {label:"Vehicle Age",   value:"Pre-owned two-wheeler up to 7 years old"},
      ]}
      documents={[
        {name:"Aadhaar Card",      desc:"Identity & address proof"},
        {name:"PAN Card",          desc:"Mandatory for all loan applications"},
        {name:"Income Proof",      desc:"Latest 1-month salary slip or ITR"},
        {name:"Bank Statement",    desc:"3 months savings account statement"},
        {name:"RC Copy",           desc:"Registration certificate of the bike"},
        {name:"Insurance Copy",    desc:"Current valid insurance policy"},
        {name:"Form 35 (NOC)",     desc:"No Objection Certificate from previous financier (if applicable)"},
        {name:"Valuation Report",  desc:"From approved evaluator — PDF"},
        {name:"Passport Photo",    desc:"Recent passport-size photograph"},
      ]}
      faqs={[
        {q:"How old can the bike be for a used bike loan?",  a:"Pre-owned two-wheelers up to 7 years old from the date of manufacture are eligible for financing."},
        {q:"Do I need an NOC from the previous owner?",      a:"If the vehicle was previously under a loan, Form 35 (NOC from the previous financier) is required. Otherwise it is not mandatory."},
        {q:"Can I get a loan without a salary slip?",        a:"Self-employed applicants can submit their latest ITR as income proof. Students may apply with an earning co-applicant."},
        {q:"What is the maximum loan-to-value ratio?",       a:"We finance up to 90% of the assessed market value of the pre-owned two-wheeler."},
      ]}
      emiConfig={{defaultRate:10.5,maxAmt:300000,minAmt:15000,minRate:10.5}}
    />
  );
}
