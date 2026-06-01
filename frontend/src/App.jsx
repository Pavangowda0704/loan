// ============================================================
// frontend/src/App.jsx — LoanEase
// All loan modules added: Personal, Vehicle, Business, Home
// Existing routes preserved
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";

// ── Personal Loan ─────────────────────────────────────────────
import PersonalLoan from "./modules/personalLoan/pages/PersonalLoan";
import PersonalEligibility from "./modules/personalLoan/pages/PersonalEligibility";
import PersonalDocuments from "./modules/personalLoan/pages/PersonalDocuments";
import SalariedPersonalLoan from "./modules/personalLoan/pages/SalariedPersonalLoan";
import SelfEmployedPersonalLoan from "./modules/personalLoan/pages/SelfEmployedPersonalLoan";
import PersonalLoanApply from "./modules/personalLoan/pages/PersonalLoanApply";

// ── Vehicle Loan ──────────────────────────────────────────────
import VehicleLoanHome from "./modules/vehicleLoan/pages/VehicleLoanHome";
import NewCarLoan from "./modules/vehicleLoan/pages/NewCarLoan";
import UsedCarLoan from "./modules/vehicleLoan/pages/UsedCarLoan";
import TwoWheelerLoan from "./modules/vehicleLoan/pages/TwoWheelerLoan";
import CommercialVehicleLoan from "./modules/vehicleLoan/pages/CommercialVehicleLoan";
import UsedBikeLoan from "./modules/vehicleLoan/pages/UsedBikeLoan";
import AgricultureEquipmentLoan from "./modules/vehicleLoan/pages/AgricultureEquipmentLoan";
import VehicleLoanApply from "./modules/vehicleLoan/pages/VehicleLoanApply";
import VehicleEligibilityNew from "./modules/vehicleLoan/pages/VehicleEligibilityNew";
import VehicleDocumentsNew from "./modules/vehicleLoan/pages/VehicleDocumentsNew";
import VehicleLoanSuccessNew from "./modules/vehicleLoan/pages/VehicleLoanSuccessNew";
import VehicleLoanAdminNew from "./modules/vehicleLoan/pages/VehicleLoanAdminNew";

// ── Business Loan ─────────────────────────────────────────────
import BusinessLoan from "./modules/businessLoan/pages/BusinessLoan";
import BusinessLoanDetail from "./modules/businessLoan/pages/BusinessLoanDetail";
import BusinessLoanEligibility from "./modules/businessLoan/pages/BusinessLoanEligibility";
import BusinessLoanApply from "./modules/businessLoan/pages/BusinessLoanApply";
import BusinessLoanSuccess from "./modules/businessLoan/pages/BusinessLoanSuccess";
import BusinessLoanTrack from "./modules/businessLoan/pages/BusinessLoanTrack";
import BusinessLoanCompare from "./modules/businessLoan/pages/BusinessLoanCompare";

// ── Home Loan ─────────────────────────────────────────────────
import HomeLoan from "./modules/homeLoan/pages/HomeLoan";
import HomeLoanDetail from "./modules/homeLoan/pages/HomeLoanDetail";
import HomeLoanEligibility from "./modules/homeLoan/pages/HomeLoanEligibility";
import HomeLoanApply from "./modules/homeLoan/pages/HomeLoanApply";
import HomeLoanSuccess from "./modules/homeLoan/pages/HomeLoanSuccess";

// ── Shared ────────────────────────────────────────────────────
import ApplicationSuccess from "./pages/ApplicationSuccess";
import TrackApplication from "./pages/TrackApplication";

// ── Admin ─────────────────────────────────────────────────────
import AdminDashboard from "./pages/AdminDashboard";

import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Personal Loan */}
        <Route path="/personal-loan" element={<PersonalLoan />} />
        <Route path="/personal-loan/eligibility" element={<PersonalEligibility />} />
        <Route path="/personal-loan/salaried" element={<SalariedPersonalLoan />} />
        <Route path="/personal-loan/self-employed" element={<SelfEmployedPersonalLoan />} />
        <Route path="/personal-loan/apply" element={<PersonalLoanApply />} />
        <Route path="/personal-loan/salaried/apply" element={<PersonalLoanApply />} />
        <Route path="/personal-loan/self-employed/apply" element={<PersonalLoanApply />} />
        <Route path="/personal-loan/upload/:applicationId" element={<PersonalDocuments />} />
        <Route path="/personal-loan/success/:applicationId" element={<ApplicationSuccess />} />

        {/* Vehicle Loan */}
        <Route path="/vehicle-loan" element={<VehicleLoanHome />} />
        <Route path="/vehicle-loan/new-car" element={<NewCarLoan />} />
        <Route path="/vehicle-loan/used-car" element={<UsedCarLoan />} />
        <Route path="/vehicle-loan/two-wheeler" element={<TwoWheelerLoan />} />
        <Route path="/vehicle-loan/used-bike" element={<UsedBikeLoan />} />
        <Route path="/vehicle-loan/commercial" element={<CommercialVehicleLoan />} />
        <Route path="/vehicle-loan/agriculture-equipment" element={<AgricultureEquipmentLoan />} />
        <Route path="/vehicle-loan/eligibility" element={<VehicleEligibilityNew />} />
        <Route path="/vehicle-loan/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/new-car/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/used-car/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/two-wheeler/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/used-bike/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/commercial/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/agriculture-equipment/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/documents/:applicationId" element={<VehicleDocumentsNew />} />
        <Route path="/vehicle-loan/success/:applicationId" element={<VehicleLoanSuccessNew />} />

        {/* Business Loan */}
        <Route path="/business-loan" element={<BusinessLoan />} />
        <Route path="/business-loan/eligibility" element={<BusinessLoanEligibility />} />
        <Route path="/business-loan/compare" element={<BusinessLoanCompare />} />
        <Route path="/business-loan/apply" element={<BusinessLoanApply />} />
        <Route path="/business-loan/track" element={<BusinessLoanTrack />} />
        <Route path="/business-loan/track/:applicationId" element={<BusinessLoanTrack />} />
        <Route path="/business-loan/success/:applicationId" element={<BusinessLoanSuccess />} />
        <Route path="/business-loan/:loanType/apply" element={<BusinessLoanApply />} />
        <Route path="/business-loan/:loanType" element={<BusinessLoanDetail />} />

        {/* Home Loan */}
        <Route path="/home-loan" element={<HomeLoan />} />
        <Route path="/home-loan/eligibility" element={<HomeLoanEligibility />} />
        <Route path="/home-loan/apply" element={<HomeLoanApply />} />
        <Route path="/home-loan/success/:applicationId" element={<HomeLoanSuccess />} />
        <Route path="/home-loan/:loanType/apply" element={<HomeLoanApply />} />
        <Route path="/home-loan/:loanType" element={<HomeLoanDetail />} />

        {/* Shared Track */}
        <Route path="/track-application/:applicationId" element={<TrackApplication />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/vehicle-loans" element={<VehicleLoanAdminNew />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;