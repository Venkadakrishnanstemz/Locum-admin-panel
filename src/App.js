// App.js
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  HashRouter as Router,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import PageWrapper from "./PageWrapper";
import backgroundImage from "./assets/images/background.jpg";

import Header from "./components/header/header";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/breadcrumbs/breadcrumbs";

// Auth Pages
import Login from "./components/login/login";
import LoginPage from "./components/Hrpannel/LoginPage";
import RegisterPage from "./components/Hrpannel/RegisterPage";

// App Pages
import Feature from "./components/feature/feature";
import Label from "./components/Labelconfig/FormLabelConfigPage";
import Location from "./components/location/LocationForm";
import MenuList from "./components/menu/menuList";
import Menu from "./components/menuCreation/MenuForm";
import Rights from "./components/rights/rights";
import Role from "./components/RoleForm";
import RoleList from "./components/roleList/roleList";
import RoleMapping from "./components/roleMapping/roleMapping";
import UserMain from "./components/userCreation/userMain";
import UserList from "./components/userList/userList";

// HR Pages
import BookingsPage from "./components/Hrpannel/BookingsPage";
import BookProfile from "./components/Hrpannel/BookProfile";
import Dashboard from "./components/Hrpannel/Dashboard";
import LocumLinkInterface from "./components/Hrpannel/Findprofessionals";
import Hrverification from "./components/Hrpannel/HrVerification";
import Sidebars from "./components/Hrpannel/Sidebar";
import VerificationDetail from "./components/Hrpannel/VerificationDetails";

// Multi-step form
import Addmenu from "./components/addmenu";
import AddonsStep from "./components/AddonsStep";
import Finishing from "./components/Finishing";
import NavigationButton from "./components/NavigationButtons";
import InfoStep from "./components/personalInfo/Personalinfo";
import PlanStep from "./components/PlanStep";
import Steps from "./components/Steps";
import Summary from "./components/summary";
import ThankyouStep from "./components/ThankyouStep";

import { initAuth } from "./services/auth_utils";
import { getLocalStorageItem } from "./services/localStorageUtils";
import { logoutUI } from "./services/locationService";
import { message } from "antd";
import "./App.css";

// Step Form
function FormFlow() {
  const page = useSelector((e) => e.page.value);

  const PageDisplay = () => {
    switch (page) {
      case 0:
        return <InfoStep />;
      case 1:
        return <PlanStep />;
      case 2:
        return <AddonsStep />;
      case 3:
        return <Finishing />;
      case 4:
        return <Addmenu />;
      case 5:
        return <Summary />;
      case 6:
        return <ThankyouStep />;
      default:
        return null;
    }
  };

  return (
    <div className="Container">
      <Steps />
      <div className="content">
        {PageDisplay()}
        {page !== 4 && <NavigationButton />}
      </div>
    </div>
  );
}

// Protected Layout
const AppLayout = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const logid = getLocalStorageItem("logid");
    const access = localStorage.getItem("access_token");
    const res = await logoutUI({ logid, access });

    if (res.status === 200) {
      message.success(res.data.message || "Logout successful");
      setTimeout(() => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/login"); // Smooth redirect
      }, 500);
    }
  };

  const hideBreadcrumbs = ["/login", "/login-page", "/register-page"].includes(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header userName={user.userName} profilePic={user.profilePic} onLogout={handleLogout} />
      <main style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
          <Sidebar
            userName={user.userName}
            role={user.selectedRole || user.role}
            profilePic={user.profilePic}
          />
        </div>
        <div style={{ flex: 1, padding: "10px", overflow: "auto" }}>
          {!hideBreadcrumbs && <Breadcrumbs />}
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </div>
      </main>
    </div>
  );
};

// Route Guard
const ProtectedRoute = ({ setIsLoggedIn }) => {
  return initAuth() ? (
    <AppLayout setIsLoggedIn={setIsLoggedIn} />
  ) : (
    <main
      className="locum-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ width: "400px", maxWidth: "90%", padding: "20px", marginRight: "20px" }}>
        <Navigate to="/login" />
      </div>
    </main>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(initAuth());

  return (
    // <Router>
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <main
              className="locum-container"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div style={{ width: "400px", maxWidth: "90%", padding: "20px", marginRight: "20px" }}>
                <Login onLogin={() => setIsLoggedIn(true)} />
              </div>
            </main>
          }
        />
        <Route
          path="/login-page"
          element={
            isLoggedIn ? (
              <Navigate to="/location" />
            ) : (
              <main className="locum-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div style={{ width: "400px", maxWidth: "90%", padding: "20px", marginRight: "20px" }}>
                  <LoginPage />
                </div>
              </main>
            )
          }
        />
        <Route
          path="/register-page"
          element={
            isLoggedIn ? (
              <Navigate to="/location" />
            ) : (
              <main className="locum-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div style={{ width: "400px", maxWidth: "90%", padding: "20px", marginRight: "20px" }}>
                  <RegisterPage />
                </div>
              </main>
            )
          }
        />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute setIsLoggedIn={setIsLoggedIn} />}>
          <Route index element={<Navigate to="/location" />} />
          <Route path="location" element={<Location />} />
          <Route path="features" element={<Feature />} />
          <Route path="rights" element={<Rights />} />
          <Route path="form" element={<FormFlow />} />
          <Route path="role" element={<Role />} />
          <Route path="menu" element={<MenuList />} />
          <Route path="menuCreation" element={<Menu />} />
          <Route path="ListRole" element={<RoleList />} />
          <Route path="role-mapping/:roleId" element={<RoleMapping />} />
          <Route path="listuser" element={<UserList />} />
          <Route path="userMain" element={<UserMain />} />
          <Route path="label" element={<Label />} />
          <Route path="hrverification" element={<Hrverification />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="find-professionals" element={<LocumLinkInterface />} />
          <Route path="book-profile" element={<BookProfile />} />
          <Route path="BookingsPage" element={<BookingsPage />} />
          <Route path="verification/:docId" element={<VerificationDetail />} />
          <Route path="Sidebars" element={<Sidebars />} />
          <Route path="*" element={<Navigate to="/location" />} />
        </Route>
      </Routes>
    </AnimatePresence>
    // </Router>
  );
}

export default App;
