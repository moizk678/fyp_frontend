import { Routes, Route } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import DashboardContent from "./components/dashboard/DashboardContent";
import CompaniesPage from "./pages/CompaniesPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import OTPVerification from "./components/auth/OTPVerification";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Layout from "./components/utils/Layout";
import RiderMap from "./components/gps/RiderMap";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./contexts/AuthContext";
import OrderCard from "./components/utils/OrderCard";
import AvailableNavigationBuses from "./components/gps/AvailableNavigationBuses";
import RealTimeNavigationMap from "./components/gps/RealTimeMapNavigation";
import UserMapNavigation from "./components/gps/UserMapNavigation";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardContent />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/bookings" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/payments/:busId" element={<PaymentPage />} />
            <Route path="/seat-selection/:id" element={<SeatSelectionPage />} />
            <Route path="/map2" element={<RiderMap />} />
            <Route path="/map" element={<AvailableNavigationBuses />} />
            <Route path="/map/:busId" element={<RealTimeNavigationMap />} />
            <Route path="/map/user/:busId" element={<UserMapNavigation />} />
            <Route path="/buses" element={<DashboardContent />} />
            <Route path="/rfid-card" element={<OrderCard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
