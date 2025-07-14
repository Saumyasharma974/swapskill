import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from '../src/component/Login'
import Home from "./component/Home";
import Profile from "./component/Profile";
import Register from "./component/Register";
import Login from "./component/Navbar";
import PrivateRoute from "./component/ProtectedRoutes";
import SwapPage from "./component/SwapPage";
import DashBoard from "./component/DashBoard";
import Footer from "./component/Footer";
import UsersPage from "./component/UserPage";

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar/>}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />

        <Route path="/users" element={<UsersPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/swaps"
          element={
            <PrivateRoute>
              <SwapPage />
            </PrivateRoute>
          }
        />
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
