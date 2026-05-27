// ============================================================
//  App.jsx — LoanEase root router
// ============================================================
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Homepage
import Home from "./pages/Home";

// Personal Loan flow (module-based)
import PersonalLoan        from "./modules/personalLoan/pages/PersonalLoan";
import PersonalEligibility from "./modules/personalLoan/pages/PersonalEligibility";
import PersonalApply       from "./modules/personalLoan/pages/PersonalApply";
import PersonalDocuments   from "./modules/personalLoan/pages/PersonalDocuments";

// Vehicle Loan flow (module-based)
import VehicleLoan        from "./modules/vehicleLoan/pages/VehicleLoan";
import VehicleEligibility from "./modules/vehicleLoan/pages/VehicleEligibility";
import VehicleApply       from "./modules/vehicleLoan/pages/VehicleApply";

// Shared pages
import UploadDocuments   from "./pages/UploadDocuments";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import VehicleLoanSuccess from "./pages/VehicleLoanSuccess";
import TrackApplication  from "./pages/TrackApplication";

// Admin
import AdminDashboard  from "./pages/AdminDashboard";
import PersonalLoanAdmin from "./pages/PersonalLoanAdmin";

import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ---- Home ---- */}
        <Route path="/" element={<Home />} />

        {/* ---- Personal Loan ---- */}
        <Route path="/personal-loan"             element={<PersonalLoan />} />
        <Route path="/personal-loan/eligibility" element={<PersonalEligibility />} />
        <Route path="/personal-loan/apply"       element={<PersonalApply />} />

        {/* Legacy /loans/personal paths kept for backward compat */}
        <Route path="/loans/personal"                        element={<PersonalLoan />} />
        <Route path="/loans/personal/eligibility"            element={<PersonalEligibility />} />
        <Route path="/loans/personal/apply"                  element={<PersonalApply />} />
        <Route path="/loans/personal/upload/:applicationId"  element={<PersonalDocuments />} />
        <Route path="/loans/personal/success/:applicationId" element={<ApplicationSuccess />} />

        {/* ---- Vehicle Loan ---- */}
        <Route path="/vehicle-loan"             element={<VehicleLoan />} />
        <Route path="/vehicle-loan/eligibility" element={<VehicleEligibility />} />
        <Route path="/vehicle-loan/apply"       element={<VehicleApply />} />
        <Route path="/vehicle-loan/success/:applicationId" element={<VehicleLoanSuccess />} />

        {/* ---- Upload Documents ---- */}
        <Route path="/upload-documents/:applicationId" element={<UploadDocuments />} />

        {/* ---- Application Success ---- */}
        <Route path="/application-success/:applicationId" element={<ApplicationSuccess />} />

        {/* ---- Track Application ---- */}
        <Route path="/track-application/:applicationId" element={<TrackApplication />} />

        {/* ---- Admin ---- */}
        <Route path="/admin"                element={<AdminDashboard />} />
        <Route path="/admin/personal-loans" element={<PersonalLoanAdmin />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
