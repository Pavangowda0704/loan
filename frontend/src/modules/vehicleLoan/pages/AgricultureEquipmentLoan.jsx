import VehicleLoanDetailPage from "../components/VehicleLoanDetailPage";

export default function AgricultureEquipmentLoan() {
  return (
    <VehicleLoanDetailPage
      title="Agriculture Equipment Loan"
      subtitle="Empower your farm with easy financing for tractors, harvesters, tillers and all agri-equipment."
      heroClass="vl-sub-hero--green"
      applyRoute="/vehicle-loan/agriculture-equipment/apply"
      chip="AGRI EQUIPMENT LOAN"
      chipClass=""
      accentColor="#16a34a"
      highlights={[
        {val:"Up to ₹25 Lakhs",  label:"Loan Amount"},
        {val:"9%* Onwards",      label:"Interest Rate"},
        {val:"Up to 7 Years",    label:"Tenure"},
        {val:"72 Hours",         label:"Approval Time"},
      ]}
      overviewItems={[
        {icon:"🚜",title:"Wide Equipment Coverage",desc:"Finance tractors, harvesters, rotavators, tillers, sprayers and more."},
        {icon:"💸",title:"Low Agri-Friendly Rates",desc:"Specially structured rates from 9% p.a. tailored for farmers."},
        {icon:"📅",title:"Seasonal Repayment",desc:"Flexible repayment aligned with crop cycles and harvest seasons."},
        {icon:"🌾",title:"Subsidy Assistance",desc:"Our team will help you identify and apply for applicable government subsidies."},
      ]}
      benefits={[
        "Finance up to ₹25 Lakhs",
        "Rates from 9% p.a.",
        "Repayment up to 7 years",
        "Seasonal repayment option",
        "Government subsidy guidance",
        "Minimal land documentation",
      ]}
      eligibility={[
        {label:"Age",              value:"21 – 65 years"},
        {label:"Occupation",       value:"Farmer / Agricultural Entrepreneur / Agri-business Owner"},
        {label:"Land Holding",     value:"Minimum 1 acre of agricultural land (owned or leased)"},
        {label:"CIBIL Score",      value:"650 or above preferred"},
        {label:"Loan Amount",      value:"₹1 Lakh – ₹25 Lakhs"},
        {label:"Equipment Types",  value:"Tractors, harvesters, tillers, sprayers, threshers and related agri-machinery"},
      ]}
      documents={[
        {name:"Aadhaar Card",        desc:"Identity & address proof"},
        {name:"PAN Card",            desc:"Mandatory for all loan applications"},
        {name:"Land Documents",      desc:"7/12 extract or land ownership / lease agreement"},
        {name:"Income Proof",        desc:"Kisan Credit Card statement / agricultural income certificate"},
        {name:"Bank Statement",      desc:"6 months savings / KCC account statement"},
        {name:"Equipment Quotation", desc:"Proforma invoice from authorised dealer"},
        {name:"Passport Photo",      desc:"Recent passport-size photograph"},
      ]}
      faqs={[
        {q:"Can a tenant farmer apply for this loan?",       a:"Yes. Farmers with a valid lease agreement for agricultural land are eligible. Minimum lease period of 3 years is required."},
        {q:"Are used / second-hand tractors covered?",       a:"Yes, we finance pre-owned agricultural equipment up to 10 years old, subject to valuation."},
        {q:"Can I avail a subsidy along with this loan?",    a:"Our relationship managers will guide you through applicable PMKSY, NABARD and state government subsidy schemes that can be clubbed with the loan."},
        {q:"Is crop insurance mandatory?",                   a:"Crop insurance is not mandatory but highly recommended. It strengthens your loan application and protects your income."},
      ]}
      emiConfig={{defaultRate:9,maxAmt:2500000,minAmt:100000,minRate:9}}
    />
  );
}
