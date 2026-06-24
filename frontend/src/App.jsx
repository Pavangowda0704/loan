// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedApply from "./components/ProtectedApply.jsx";

import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";
import Home    from "./pages/Home";

// ── NEW auth pages ──
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";

import PersonalLoan             from "./modules/personalLoan/pages/PersonalLoan";
import PersonalEligibility      from "./modules/personalLoan/pages/PersonalEligibility";
import PersonalDocuments        from "./modules/personalLoan/pages/PersonalDocuments";
import SalariedPersonalLoan     from "./modules/personalLoan/pages/SalariedPersonalLoan";
import SelfEmployedPersonalLoan from "./modules/personalLoan/pages/SelfEmployedPersonalLoan";
import PersonalLoanApply        from "./modules/personalLoan/pages/PersonalLoanApply";

import VehicleLoanHome          from "./modules/vehicleLoan/pages/VehicleLoanHome";
import NewCarLoan               from "./modules/vehicleLoan/pages/NewCarLoan";
import UsedCarLoan              from "./modules/vehicleLoan/pages/UsedCarLoan";
import TwoWheelerLoan           from "./modules/vehicleLoan/pages/TwoWheelerLoan";
import CommercialVehicleLoan    from "./modules/vehicleLoan/pages/CommercialVehicleLoan";
import UsedBikeLoan             from "./modules/vehicleLoan/pages/UsedBikeLoan";
import AgricultureEquipmentLoan from "./modules/vehicleLoan/pages/AgricultureEquipmentLoan";
import VehicleLoanApply         from "./modules/vehicleLoan/pages/VehicleLoanApply";
import VehicleEligibilityNew    from "./modules/vehicleLoan/pages/VehicleEligibilityNew";
import VehicleDocumentsNew      from "./modules/vehicleLoan/pages/VehicleDocumentsNew";
import VehicleLoanSuccessNew    from "./modules/vehicleLoan/pages/VehicleLoanSuccessNew";
import VehicleLoanAdminNew      from "./modules/vehicleLoan/pages/VehicleLoanAdminNew";

import HomeLoan from "./modules/homeLoan/pages/HomeLoan";
import HomeLoanApply from "./modules/homeLoan/pages/HomeLoanApply";
import HomeLoanDetail from "./modules/homeLoan/pages/HomeLoanDetail";
import HomeLoanEligibility from "./modules/homeLoan/pages/HomeLoanEligibility";
import HomeLoanSuccess from "./modules/homeLoan/pages/HomeLoanSuccess";
import LoanAgainstPropertyPage from "./modules/homeLoan/pages/LoanAgainstPropertyPage";
import MortgageLoanPage from "./modules/homeLoan/pages/MortgageLoanPage";
import SitePurchaseLoanPage from "./modules/homeLoan/pages/SitePurchaseLoanPage";
import BalanceTransferPage from "./modules/homeLoan/pages/BalanceTransferPage";
import NewHouseRefinancePage from "./modules/homeLoan/pages/NewHouseRefinancePage";
import HousePurchaseLoanPage from "./modules/homeLoan/pages/HousePurchaseLoanPage";
import ConstructionLoanPage from "./modules/homeLoan/pages/ConstructionLoanPage";
import MixedUsagePropertyPage from "./modules/homeLoan/pages/MixedUsagePropertyPage";

import BusinessLoan            from "./modules/businessLoan/pages/BusinessLoan";
import BusinessLoanApply       from "./modules/businessLoan/pages/BusinessLoanApply";
import BusinessLoanCompare     from "./modules/businessLoan/pages/BusinessLoanCompare";
import BusinessLoanDetail      from "./modules/businessLoan/pages/BusinessLoanDetail";
import BusinessLoanEligibility from "./modules/businessLoan/pages/BusinessLoanEligibility";
import BusinessLoanSuccess     from "./modules/businessLoan/pages/BusinessLoanSuccess";
import BusinessLoanTrack       from "./modules/businessLoan/pages/BusinessLoanTrack";

import ApplicationSuccess from "./pages/ApplicationSuccess";
import TrackApplication   from "./pages/TrackApplication";
import AdminDashboard     from "./pages/AdminDashboard";

import "./styles/global.css";

// Hides Navbar + Footer on /admin, /login, /register
function Layout({ children }) {
  const { pathname } = useLocation();
  const hideShell = pathname.startsWith("/admin") ||
                    pathname === "/login"          ||
                    pathname === "/register";
  return (
    <>
      {!hideShell && <Navbar />}
      {children}
      {!hideShell && <Footer />}
    </>
  );
}

// Wraps any apply page — redirects to /login if not logged in
function Protected({ element }) {
  return <ProtectedApply>{element}</ProtectedApply>;
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* ── Auth routes (NEW) ── */}
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/dashboard" element={<UserDashboard />} />

            {/* Redirects — unchanged */}
            <Route path="/loans/personal" element={<Navigate to="/personal-loan" replace />} />
            <Route path="/loans/vehicle"  element={<Navigate to="/vehicle-loan"  replace />} />

            {/* Personal Loan — apply routes now protected */}
            <Route path="/personal-loan"                        element={<PersonalLoan />} />
            <Route path="/personal-loan/eligibility"            element={<PersonalEligibility />} />
            <Route path="/personal-loan/salaried"               element={<SalariedPersonalLoan />} />
            <Route path="/personal-loan/self-employed"          element={<SelfEmployedPersonalLoan />} />
            <Route path="/personal-loan/apply"                  element={<Protected element={<PersonalLoanApply />} />} />
            <Route path="/personal-loan/salaried/apply"         element={<Protected element={<PersonalLoanApply />} />} />
            <Route path="/personal-loan/self-employed/apply"    element={<Protected element={<PersonalLoanApply />} />} />
            <Route path="/personal-loan/upload/:applicationId"  element={<PersonalDocuments />} />
            <Route path="/personal-loan/success/:applicationId" element={<ApplicationSuccess />} />

            {/* Vehicle Loan — apply routes now protected */}
            <Route path="/vehicle-loan"                              element={<VehicleLoanHome />} />
            <Route path="/vehicle-loan/new-car"                      element={<NewCarLoan />} />
            <Route path="/vehicle-loan/used-car"                     element={<UsedCarLoan />} />
            <Route path="/vehicle-loan/two-wheeler"                  element={<TwoWheelerLoan />} />
            <Route path="/vehicle-loan/used-bike"                    element={<UsedBikeLoan />} />
            <Route path="/vehicle-loan/commercial"                   element={<CommercialVehicleLoan />} />
            <Route path="/vehicle-loan/agriculture-equipment"        element={<AgricultureEquipmentLoan />} />
            <Route path="/vehicle-loan/eligibility"                  element={<VehicleEligibilityNew />} />
            <Route path="/vehicle-loan/apply"                        element={<Protected element={<VehicleLoanApply />} />} />
            <Route path="/vehicle-loan/new-car/apply"                element={<Protected element={<VehicleLoanApply />} />} />
            <Route path="/vehicle-loan/used-car/apply"               element={<Protected element={<VehicleLoanApply />} />} />
            <Route path="/vehicle-loan/two-wheeler/apply"            element={<Protected element={<VehicleLoanApply />} />} />
            <Route path="/vehicle-loan/used-bike/apply"              element={<Protected element={<VehicleLoanApply />} />} />
            <Route path="/vehicle-loan/commercial/apply"             element={<Protected element={<VehicleLoanApply />} />} />
            <Route path="/vehicle-loan/agriculture-equipment/apply"  element={<Protected element={<VehicleLoanApply />} />} />
            <Route path="/vehicle-loan/documents/:applicationId"     element={<VehicleDocumentsNew />} />
            <Route path="/vehicle-loan/success/:applicationId"       element={<VehicleLoanSuccessNew />} />

            {/* Home Loan — apply routes now protected */}
            <Route path="/" element={<HomeLoan />} />
        <Route path="/home-loan" element={<HomeLoan />} />

        {/* Loan Against Property */}
        <Route
          path="/loan-against-property"
          element={<LoanAgainstPropertyPage />}
        />

        {/* Mortgage Loan */}
        <Route
          path="/mortgage-loan"
          element={<MortgageLoanPage />}
        /><Route
  path="/site-purchase-loan"
  element={<SitePurchaseLoanPage />}
/><Route
  path="/new-house-refinance"
  element={<NewHouseRefinancePage />}
/>
<Route
  path="/house-purchase-loan"
  element={<HousePurchaseLoanPage />}
/>
<Route

  path="/balance-transfer"
  element={<BalanceTransferPage />}
/>
<Route
  path="/construction-loan"
  element={<ConstructionLoanPage />}
/>
<Route
  path="/mixed-usage-property"
  element={<MixedUsagePropertyPage />}
/>

        <Route path="/home-loan/:loanType" element={<HomeLoanDetail />} />
        <Route path="/home-loan/apply" element={<Protected element={<HomeLoanApply />} />} />
        <Route path="/home-loan/eligibility" element={<HomeLoanEligibility />} />
        <Route
          path="/home-loan/success/:applicationId"
          element={<HomeLoanSuccess />}
        />

            {/* Business Loan — apply routes now protected */}
            <Route path="/business-loan"                          element={<BusinessLoan />} />
            <Route path="/business-loan/:loanType"                element={<BusinessLoanDetail />} />
            <Route path="/business-loan/eligibility"              element={<BusinessLoanEligibility />} />
            <Route path="/business-loan/apply"                    element={<Protected element={<BusinessLoanApply />} />} />
            <Route path="/business-loan/apply/:loanType"          element={<Protected element={<BusinessLoanApply />} />} />
            <Route path="/business-loan/compare"                  element={<BusinessLoanCompare />} />
            <Route path="/business-loan/track"                    element={<BusinessLoanTrack />} />
            <Route path="/business-loan/success"                  element={<BusinessLoanSuccess />} />
            <Route path="/business-loan/success/:applicationId"   element={<BusinessLoanSuccess />} />

            {/* Unchanged */}
            <Route path="/track-application/:applicationId" element={<TrackApplication />} />
            <Route path="/admin"               element={<AdminDashboard />} />
            <Route path="/admin/vehicle-loans" element={<VehicleLoanAdminNew />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;