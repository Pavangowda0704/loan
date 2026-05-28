import VehicleLoanDetailPage from "../components/VehicleLoanDetailPage";

export default function TwoWheelerLoan() {
  return (
    <VehicleLoanDetailPage
      title="Two-Wheeler Loan"
      subtitle="Easy & affordable loans for your bike or scooter — new or pre-owned two-wheelers."
      heroClass="vl-sub-hero--green"
      applyRoute="/vehicle-loan/two-wheeler/apply"
      chip="TWO-WHEELER LOAN"
      chipClass=""
      accentColor="#10b981"
      highlights={[
        {val:"Up to ₹5 Lakhs",label:"Loan Amount"},
        {val:"9.5%* Onwards",label:"Interest Rate"},
        {val:"Up to 4 Years",label:"Tenure"},
        {val:"24 Hours",label:"Quick Approval"},
      ]}
      overviewItems={[
        {icon:"🏍️",title:"Up to 95% On-Road Price",desc:"Loan up to 95% of the on-road price for new two-wheelers."},
        {icon:"💸",title:"Low Interest Rates",desc:"Interest rates starting from 9.5% p.a. — one of the lowest in market."},
        {icon:"⚡",title:"Quick Approval",desc:"Get your two-wheeler loan approved within 24 hours."},
        {icon:"📄",title:"Minimal Documentation",desc:"Simple paperwork — just Aadhaar, PAN and income proof."},
      ]}
      benefits={["Up to 95% on-road funding","Rates starting 9.5% p.a.","Tenure up to 48 months","Electric vehicles eligible","No hidden charges","Instant approval for top profiles"]}
      eligibility={[
        {label:"Age",value:"18 – 65 years"},
        {label:"Employment",value:"Salaried / Self-Employed / Student (with guarantor)"},
        {label:"Min. Monthly Income",value:"₹10,000 per month"},
        {label:"CIBIL Score",value:"650 or above preferred"},
        {label:"Loan Amount",value:"₹20,000 – ₹5 Lakhs"},
        {label:"Vehicle Type",value:"New or used two-wheeler (max 5 years old)"},
      ]}
      documents={[
        {name:"Aadhaar Card",desc:"Identity & address proof"},
        {name:"PAN Card",desc:"Mandatory for all loan applications"},
        {name:"Salary Slip / ITR",desc:"Latest 1-month salary slip or latest ITR"},
        {name:"Bank Statement",desc:"3 months savings account statement"},
        {name:"Proforma Invoice",desc:"For new bike — from authorised dealer"},
        {name:"Passport Photo",desc:"Recent passport-size photograph"},
        {name:"Driving Licence",desc:"Valid driving licence (if applicable)"},
      ]}
      faqs={[
        {q:"Can I get a loan for an electric scooter?",a:"Yes! LoanEase offers special financing for electric two-wheelers with preferential rates starting from 9.5% p.a."},
        {q:"What is the minimum income needed?",a:"A minimum monthly income of ₹10,000 is required. Students can apply with a co-applicant or guarantor."},
        {q:"Can I apply for a used bike loan?",a:"Yes, used two-wheelers up to 5 years old are eligible for financing. The loan amount is based on the assessed value."},
        {q:"Is a driving licence mandatory?",a:"While a driving licence is preferred, it is not strictly mandatory for applying. However, it strengthens your application."},
      ]}
      emiConfig={{defaultRate:9.5,maxAmt:500000,minAmt:20000,minRate:9.5}}
    />
  );
}