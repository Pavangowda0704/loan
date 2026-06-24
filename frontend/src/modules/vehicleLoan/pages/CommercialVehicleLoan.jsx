import VehicleLoanDetailPage from "../components/VehicleLoanDetailPage";

export default function CommercialVehicleLoan() {
  return (
    <VehicleLoanDetailPage
      title="Commercial Vehicle Loan"
      subtitle="Fuel your business with easy commercial vehicle financing for trucks, buses, vans and more."
      heroClass="vl-sub-hero--purple"
      applyRoute="/vehicle-loan/commercial/apply"
      chip="COMMERCIAL LOAN"
      chipClass=""
      accentColor="#5cf664"
      highlights={[
        {val:"Up to ₹1.5 Crore",label:"Loan Amount"},
        {val:"11%* Onwards",label:"Interest Rate"},
        {val:"Up to 7 Years",label:"Tenure"},
        {val:"48–72 Hours",label:"Approval Time"},
      ]}
      overviewItems={[
        {icon:"🚚",title:"Higher Loan Amounts",desc:"Finance trucks, buses, vans and equipment up to ₹1.5 Crore."},
        {icon:"🏢",title:"Business-Friendly",desc:"Flexible repayment structured around your business cash flows."},
        {icon:"⚡",title:"Quick Processing",desc:"Dedicated relationship manager for faster loan processing."},
        {icon:"🔓",title:"No Collateral",desc:"Vehicle itself acts as collateral — no additional security required."},
      ]}
      benefits={["Loan up to ₹1.5 Crore","Rates from 11% p.a.","Tenure up to 7 years","Trucks, buses, vans & LCVs","Fleet financing available","Dedicated relationship manager"]}
      eligibility={[
        {label:"Age",value:"21 – 65 years"},
        {label:"Employment",value:"Business Owner / Transport Operator / Company"},
        {label:"Min. Annual Turnover",value:"₹20 Lakhs per annum"},
        {label:"Business Vintage",value:"At least 2 years in transport/business"},
        {label:"CIBIL Score",value:"700 or above preferred"},
        {label:"Loan Amount",value:"₹5 Lakhs – ₹1.5 Crore"},
        {label:"Vehicle Types",value:"Trucks, Buses, LCVs, HCVs, Tankers, Tippers"},
      ]}
      documents={[
        {name:"Aadhaar Card",desc:"Proprietor/partner identity proof"},
        {name:"PAN Card",desc:"Personal & business PAN mandatory"},
        {name:"Business Registration",desc:"GST cert, trade licence, incorporation cert"},
        {name:"Bank Statement",desc:"12 months business account statement"},
        {name:"ITR with P&L",desc:"Last 2 years Income Tax Returns"},
        {name:"Vehicle Quotation",desc:"Proforma invoice from dealer"},
        {name:"Transport Licence",desc:"Commercial vehicle transport permits"},
        {name:"Passport Photo",desc:"Recent passport-size photograph"},
      ]}
      faqs={[
        {q:"Can I finance a fleet of vehicles?",a:"Yes, LoanEase offers fleet financing solutions for multiple commercial vehicles. Special rates apply for fleet loans of 3 or more vehicles."},
        {q:"What types of commercial vehicles are covered?",a:"We finance trucks (LCVs, HCVs), buses, mini-buses, taxis, auto-rickshaws, tankers, tippers, trailers, and other commercial vehicles."},
        {q:"Is transport permit mandatory for commercial loan?",a:"Yes, a valid transport/commercial vehicle permit is required. We can guide you through the permit process as well."},
        {q:"Can a private limited company apply for a commercial vehicle loan?",a:"Yes, private limited companies, partnerships, LLPs and proprietorships are all eligible to apply for commercial vehicle loans."},
      ]}
      emiConfig={{defaultRate:11,maxAmt:10000000,minAmt:500000,minRate:11}}
    />
  );
}