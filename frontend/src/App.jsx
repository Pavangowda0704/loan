// ============================================================
//  App.jsx — LoanEase root router
// ============================================================
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Homepage
import Home from "./pages/Home";

// Personal Loan module
import PersonalLoan              from "./modules/personalLoan/pages/PersonalLoan";
import PersonalEligibility       from "./modules/personalLoan/pages/PersonalEligibility";
import PersonalApply             from "./modules/personalLoan/pages/PersonalApply";
import PersonalDocuments         from "./modules/personalLoan/pages/PersonalDocuments";
import SalariedPersonalLoan      from "./modules/personalLoan/pages/SalariedPersonalLoan";
import SelfEmployedPersonalLoan  from "./modules/personalLoan/pages/SelfEmployedPersonalLoan";
import SalariedApply             from "./modules/personalLoan/pages/SalariedApply";
import SelfEmployedApply         from "./modules/personalLoan/pages/SelfEmployedApply";
import PersonalLoanApply         from "./modules/personalLoan/pages/PersonalLoanApply";

// Vehicle Loan module — new pages
import VehicleLoanHome           from "./modules/vehicleLoan/pages/VehicleLoanHome";
import NewCarLoan                from "./modules/vehicleLoan/pages/NewCarLoan";
import UsedCarLoan               from "./modules/vehicleLoan/pages/UsedCarLoan";
import TwoWheelerLoan            from "./modules/vehicleLoan/pages/TwoWheelerLoan";
import CommercialVehicleLoan     from "./modules/vehicleLoan/pages/CommercialVehicleLoan";
import UsedBikeLoan               from "./modules/vehicleLoan/pages/UsedBikeLoan";
import AgricultureEquipmentLoan   from "./modules/vehicleLoan/pages/AgricultureEquipmentLoan";
import VehicleLoanApplyNew       from "./modules/vehicleLoan/pages/VehicleLoanApplyNew";
import VehicleLoanApply          from "./modules/vehicleLoan/pages/VehicleLoanApply";
import VehicleEligibilityNew     from "./modules/vehicleLoan/pages/VehicleEligibilityNew";
import VehicleDocumentsNew       from "./modules/vehicleLoan/pages/VehicleDocumentsNew";
import VehicleLoanSuccessNew     from "./modules/vehicleLoan/pages/VehicleLoanSuccessNew";
import VehicleLoanAdminNew       from "./modules/vehicleLoan/pages/VehicleLoanAdminNew";

// Vehicle Loan module — legacy (kept for backward compat)
import VehicleLoan               from "./modules/vehicleLoan/pages/VehicleLoan";
import VehicleEligibility        from "./modules/vehicleLoan/pages/VehicleEligibility";
import VehicleApply              from "./modules/vehicleLoan/pages/VehicleApply";

// Shared pages
import UploadDocuments           from "./pages/UploadDocuments";
import ApplicationSuccess        from "./pages/ApplicationSuccess";
import VehicleLoanSuccess        from "./pages/VehicleLoanSuccess";
import TrackApplication          from "./pages/TrackApplication";

// Admin
import AdminDashboard            from "./pages/AdminDashboard";
import PersonalLoanAdmin         from "./pages/PersonalLoanAdmin";

import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* ── Home ── */}
        <Route path="/"  element={<Home />} />

        {/* ── Personal Loan ── */}
        <Route path="/personal-loan"                     element={<PersonalLoan />} />
        <Route path="/personal-loan/eligibility"         element={<PersonalEligibility />} />
        <Route path="/personal-loan/apply"               element={<PersonalLoanApply />} />
        <Route path="/personal-loan/salaried"            element={<SalariedPersonalLoan />} />
        <Route path="/personal-loan/self-employed"       element={<SelfEmployedPersonalLoan />} />
        <Route path="/personal-loan/salaried/apply"      element={<PersonalLoanApply />} />
        <Route path="/personal-loan/self-employed/apply" element={<PersonalLoanApply />} />

        {/* Legacy personal loan paths */}
        <Route path="/loans/personal"                        element={<PersonalLoan />} />
        <Route path="/loans/personal/eligibility"            element={<PersonalEligibility />} />
        <Route path="/loans/personal/apply"                  element={<PersonalLoanApply />} />
        <Route path="/loans/personal/upload/:applicationId"  element={<PersonalDocuments />} />
        <Route path="/loans/personal/success/:applicationId" element={<ApplicationSuccess />} />

        {/* ── Vehicle Loan — new module routes ── */}
        <Route path="/vehicle-loan"                          element={<VehicleLoanHome />} />
        <Route path="/vehicle-loan/new-car"                  element={<NewCarLoan />} />
        <Route path="/vehicle-loan/used-car"                 element={<UsedCarLoan />} />
        <Route path="/vehicle-loan/two-wheeler"              element={<TwoWheelerLoan />} />
        <Route path="/vehicle-loan/used-bike"                element={<UsedBikeLoan />} />
        <Route path="/vehicle-loan/commercial"               element={<CommercialVehicleLoan />} />
        <Route path="/vehicle-loan/agriculture-equipment"    element={<AgricultureEquipmentLoan />} />
        <Route path="/vehicle-loan/eligibility"              element={<VehicleEligibilityNew />} />
        <Route path="/vehicle-loan/apply"                    element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/new-car/apply"            element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/used-car/apply"           element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/two-wheeler/apply"        element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/used-bike/apply"          element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/commercial/apply"         element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/agriculture-equipment/apply" element={<VehicleLoanApply />} />
        <Route path="/vehicle-loan/documents/:applicationId" element={<VehicleDocumentsNew />} />
        <Route path="/vehicle-loan/success/:applicationId"   element={<VehicleLoanSuccessNew />} />

        {/* Legacy vehicle loan paths (backward compat) */}
        <Route path="/vehicle-loan/legacy"            element={<VehicleLoan />} />
        <Route path="/vehicle-loan/check-eligibility" element={<VehicleEligibility />} />
        <Route path="/vehicle-loan/old-apply"         element={<VehicleApply />} />

        {/* ── Upload & Success (shared) ── */}
        <Route path="/upload-documents/:applicationId"    element={<UploadDocuments />} />
        <Route path="/application-success/:applicationId" element={<ApplicationSuccess />} />

        {/* ── Track Application ── */}
        <Route path="/track-application/:applicationId" element={<TrackApplication />} />

        {/* ── Admin ── */}
        <Route path="/admin"                  element={<AdminDashboard />} />
        <Route path="/admin/personal-loans"   element={<PersonalLoanAdmin />} />
        <Route path="/admin/vehicle-loans"    element={<VehicleLoanAdminNew />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;