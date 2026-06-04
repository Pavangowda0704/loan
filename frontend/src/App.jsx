// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";
import Home from "./pages/Home";

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

import HomeLoan            from "./modules/homeLoan/pages/HomeLoan";
import HomeLoanApply       from "./modules/homeLoan/pages/HomeLoanApply";
import HomeLoanDetail      from "./modules/homeLoan/pages/HomeLoanDetail";
import HomeLoanEligibility from "./modules/homeLoan/pages/HomeLoanEligibility";
import HomeLoanSuccess     from "./modules/homeLoan/pages/HomeLoanSuccess";

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

// Hides Navbar + Footer on /admin and /admin/* routes
function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Redirects for missing routes */}
          <Route path="/loans/personal" element={<Navigate to="/personal-loan" replace />} />
          <Route path="/loans/vehicle"  element={<Navigate to="/vehicle-loan"  replace />} />

          <Route path="/personal-loan"                        element={<PersonalLoan />} />
          <Route path="/personal-loan/eligibility"            element={<PersonalEligibility />} />
          <Route path="/personal-loan/salaried"               element={<SalariedPersonalLoan />} />
          <Route path="/personal-loan/self-employed"          element={<SelfEmployedPersonalLoan />} />
          <Route path="/personal-loan/apply"                  element={<PersonalLoanApply />} />
          <Route path="/personal-loan/salaried/apply"         element={<PersonalLoanApply />} />
          <Route path="/personal-loan/self-employed/apply"    element={<PersonalLoanApply />} />
          <Route path="/personal-loan/upload/:applicationId"  element={<PersonalDocuments />} />
          <Route path="/personal-loan/success/:applicationId" element={<ApplicationSuccess />} />

          <Route path="/vehicle-loan"                              element={<VehicleLoanHome />} />
          <Route path="/vehicle-loan/new-car"                      element={<NewCarLoan />} />
          <Route path="/vehicle-loan/used-car"                     element={<UsedCarLoan />} />
          <Route path="/vehicle-loan/two-wheeler"                  element={<TwoWheelerLoan />} />
          <Route path="/vehicle-loan/used-bike"                    element={<UsedBikeLoan />} />
          <Route path="/vehicle-loan/commercial"                   element={<CommercialVehicleLoan />} />
          <Route path="/vehicle-loan/agriculture-equipment"        element={<AgricultureEquipmentLoan />} />
          <Route path="/vehicle-loan/eligibility"                  element={<VehicleEligibilityNew />} />
          <Route path="/vehicle-loan/apply"                        element={<VehicleLoanApply />} />
          <Route path="/vehicle-loan/new-car/apply"                element={<VehicleLoanApply />} />
          <Route path="/vehicle-loan/used-car/apply"               element={<VehicleLoanApply />} />
          <Route path="/vehicle-loan/two-wheeler/apply"            element={<VehicleLoanApply />} />
          <Route path="/vehicle-loan/used-bike/apply"              element={<VehicleLoanApply />} />
          <Route path="/vehicle-loan/commercial/apply"             element={<VehicleLoanApply />} />
          <Route path="/vehicle-loan/agriculture-equipment/apply"  element={<VehicleLoanApply />} />
          <Route path="/vehicle-loan/documents/:applicationId"     element={<VehicleDocumentsNew />} />
          <Route path="/vehicle-loan/success/:applicationId"       element={<VehicleLoanSuccessNew />} />

          <Route path="/home-loan"                       element={<HomeLoan />} />
          <Route path="/home-loan/:loanType"             element={<HomeLoanDetail />} />
          <Route path="/home-loan/eligibility"           element={<HomeLoanEligibility />} />
          <Route path="/home-loan/apply"                 element={<HomeLoanApply />} />
          <Route path="/home-loan/apply/:loanType"       element={<HomeLoanApply />} />
          <Route path="/home-loan/success"               element={<HomeLoanSuccess />} />
          <Route path="/home-loan/success/:applicationId" element={<HomeLoanSuccess />} />

          <Route path="/business-loan"                        element={<BusinessLoan />} />
          <Route path="/business-loan/:loanType"              element={<BusinessLoanDetail />} />
          <Route path="/business-loan/eligibility"            element={<BusinessLoanEligibility />} />
          <Route path="/business-loan/apply"                  element={<BusinessLoanApply />} />
          <Route path="/business-loan/apply/:loanType"        element={<BusinessLoanApply />} />
          <Route path="/business-loan/compare"                element={<BusinessLoanCompare />} />
          <Route path="/business-loan/track"                  element={<BusinessLoanTrack />} />
          <Route path="/business-loan/success"                element={<BusinessLoanSuccess />} />
          <Route path="/business-loan/success/:applicationId" element={<BusinessLoanSuccess />} />

          <Route path="/track-application/:applicationId" element={<TrackApplication />} />

          <Route path="/admin"               element={<AdminDashboard />} />
          <Route path="/admin/vehicle-loans" element={<VehicleLoanAdminNew />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;