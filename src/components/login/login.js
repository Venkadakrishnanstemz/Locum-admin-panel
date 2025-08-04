// import { message } from "antd";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getLocalStorageItem,
//   setLocalStorageItem,
// } from "../../services/localStorageUtils";
// import { Finalizedlogin, loginUser } from "../../services/locationService";
// import "./login.css";

// const Login = ({ onLogin }) => {
//   const [labels] = useState({
//     headerName: "User Login",
//     username: "Email",
//     password: "Password",
//     loginButton: "Next", // Step 1: Login -> Next
//     forgotPassword: "Forgot Password?",
//     roleSelection: "Select Your Role",
//     availableRoles: "Available Roles",
//     availableLocations: "Available Locations",
//     roleButton: "Select Role", // Step 2: Role -> Next
//     continueButton: "Login", // Step 3: Location -> Final Login
//   });

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [availableRoles, setAvailableRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [availableLocations, setAvailableLocations] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [roleSelected, setRoleSelected] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email.trim()) {
//       setError("Please enter your email.");
//       return;
//     }
//     if (password.trim().length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       const { data1, data2 } = await loginUser(email, password);
//       console.log("data1", data1);

//       const roles = data1.user.roles || ["admin"];
//       const locations = data1.user.locations || [];
//       console.log(data1);
//       console.log(data2, "data2");
//       setLocalStorageItem("logid", data1.logid);
//       setUser(data2);
//       setAvailableRoles(roles);
//       setAvailableLocations(locations);
//       setIsAuthenticated(true);
//       setError("");
//     } catch (err) {
//       message.warning("Login failed: " + err.response.data.detail);
//       setIsAuthenticated(false);
//       setError("Invalid email or password.");
//     }
//   };

//   const handleRoleSelection = (e) => {
//     e.preventDefault();

//     if (!selectedRole) {
//       setError("Please select a role to continue.");
//       return;
//     }

//     // Move to location selection step
//     setRoleSelected(true);
//     setError("");
//   };

//   const handleLocationSelection = async (e) => {
//     e.preventDefault();
//     if (!selectedLocation) {
//       setError("Please select a location to continue.");
//       return;
//     }
//     const userWithSelections = { ...user, selectedRole, selectedLocation };
//     console.log("userWithSelections :", userWithSelections);
//     const logid = getLocalStorageItem("logid");
//     const data = {
//       logid: logid,
//       selectedLocation: selectedLocation,
//       selectedRole: selectedRole,
//     };
//     const response = await Finalizedlogin(data);
//     if (response.status == 200) {
//       message.success("Login successful!");
//       setLocalStorageItem("user", userWithSelections);
//       onLogin(userWithSelections);
//       setTimeout(() => {
//         navigate(user.landing_screen || "/location");
//       }, 500);
//     } else {
//       message.error("Login failed: " + response.data.message);
//     }

//     try {
//     } catch (err) {
//       console.error("Location selection failed", err);
//       setError("Failed to set location. Please try again.");
//     }
//   };

//   return (
//     <div className="login-card">
//       <h2 className="login-title">
//         {" "}
//         {!isAuthenticated
//           ? labels.headerName
//           : roleSelected
//           ? "Select Location"
//           : labels.roleSelection}
//       </h2>
//       <form
//         onSubmit={
//           roleSelected
//             ? handleLocationSelection
//             : isAuthenticated
//             ? handleRoleSelection
//             : handleSubmit
//         }
//       >
//         <div className="form-group">
//           <label className="form-label">
//             {labels.username}
//             <input
//               type="text"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="form-input"
//               disabled={isAuthenticated}
//               required
//             />
//           </label>
//         </div>
//         <div className="form-group">
//           <label className="form-label">
//             {labels.password}
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-input"
//               disabled={isAuthenticated}
//               required
//             />
//           </label>
//         </div>

//         {/* Role selection field - only shows after authentication */}
//         {isAuthenticated && (
//           <div className="form-group">
//             <label className="form-label">
//               {labels.availableRoles}
//               <select
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//                 className="form-input"
//                 disabled={roleSelected}
//                 required
//               >
//                 <option value="">-- Select a role --</option>
//                 {availableRoles.map((role, index) => (
//                   <option key={index} value={role.id}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>
//         )}

//         {/* Location selection field - only shows after role selection */}
//         {roleSelected && (
//           <div className="form-group">
//             <label className="form-label">
//               {labels.availableLocations}
//               <select
//                 value={selectedLocation}
//                 onChange={(e) => setSelectedLocation(e.target.value)}
//                 className="form-input"
//                 required
//               >
//                 <option value="">-- Select a location --</option>
//                 {availableLocations.map((location, index) => (
//                   <option key={index} value={location.id}>
//                     {location.name}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>
//         )}

//         {error && <div className="error-message">{error}</div>}

//         <button type="submit" className="login-button">
//           {roleSelected
//             ? labels.continueButton
//             : isAuthenticated
//             ? labels.continueButton
//             : labels.loginButton}
//         </button>

//         {!isAuthenticated && (
//           <div className="forgot-password">
//             <button type="button" className="forgot-password-link">
//               {labels.forgotPassword}
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Login;

import { message, Input, Button, Form, Select } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../services/localStorageUtils";
import { Finalizedlogin, loginUser } from "../../services/locationService";
import "./login.css";

const Login = ({ onLogin }) => {
  const [labels] = useState({
    headerName: "User Login",
    username: "Email",
    password: "Password",
    loginButton: "Next",
    forgotPassword: "Forgot Password?",
    roleSelection: "Select Your Role",
    availableRoles: "Available Roles",
    availableLocations: "Available Locations",
    roleButton: "Select Role",
    continueButton: "Login",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [roleSelected, setRoleSelected] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const { data1, data2 } = await loginUser(email, password);
      const roles = data1.user.roles || ["admin"];
      const locations = data1.user.locations || [];
      setLocalStorageItem("logid", data1.logid);
      setUser(data2);
      setAvailableRoles(roles);
      setAvailableLocations(locations);
      setIsAuthenticated(true);
      setError("");
    } catch (err) {
      message.warning("Login failed: " + (err.response?.data?.detail || "Unknown error"));
      setIsAuthenticated(false);
      setError("Invalid email or password.");
    }
  };

  const handleRoleSelection = (values) => {
    const { role } = values;

    if (!role) {
      setError("Please select a role to continue.");
      return;
    }

    setSelectedRole(role);
    setRoleSelected(true);
    setError("");
  };

  const handleLocationSelection = async (values) => {
    const { location } = values;

    if (!location) {
      setError("Please select a location to continue.");
      return;
    }

    const userWithSelections = { ...user, selectedRole, selectedLocation: location };
    const logid = getLocalStorageItem("logid");
    const data = {
      logid: logid,
      selectedLocation: location,
      selectedRole: selectedRole,
    };

    try {
      const response = await Finalizedlogin(data);
      if (response.status === 200) {
        message.success("Login successful!");
        setLocalStorageItem("user", userWithSelections);
        onLogin(userWithSelections);
        setTimeout(() => {
          navigate(user?.landing_screen || "/location");
        }, 500);
      } else {
        message.error("Login failed: " + (response.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Location selection failed", err);
      setError("Failed to set location. Please try again.");
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-title">
        {!isAuthenticated
          ? labels.headerName
          : roleSelected
          ? "Select Location"
          : labels.roleSelection}
      </h2>

      <Form
        onFinish={
          roleSelected
            ? handleLocationSelection
            : isAuthenticated
            ? handleRoleSelection
            : handleSubmit
        }
        layout="vertical"
        className="login-form"
      >
        {/* Email and Password fields always visible */}
        <Form.Item
          label={labels.username}
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="large"
            aria-label="Email input"
            disabled={isAuthenticated} // Disable after authentication
          />
        </Form.Item>

        <Form.Item
          label={labels.password}
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="large"
            aria-label="Password input"
            disabled={isAuthenticated} // Disable after authentication
          />
        </Form.Item>

        {/* Role selection field */}
        {isAuthenticated && (
          <Form.Item
            label={labels.availableRoles}
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              placeholder="Select a role"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              size="large"
              disabled={roleSelected} // Disable after role selection
            >
              {availableRoles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Location selection field */}
        {roleSelected && (
          <Form.Item
            label={labels.availableLocations}
            name="location"
            rules={[{ required: true, message: "Please select a location" }]}
          >
            <Select
              placeholder="Select a location"
              value={selectedLocation}
              onChange={(value) => setSelectedLocation(value)}
              size="large"
            >
              {availableLocations.map((location) => (
                <Select.Option key={location.id} value={location.id}>
                  {location.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {error && <div className="error-message">{error}</div>}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="login-button"
          >
            {roleSelected
              ? labels.continueButton
              : isAuthenticated
              ? labels.roleButton
              : labels.loginButton}
          </Button>
        </Form.Item>

        {!isAuthenticated && (
          <div className="forgot-password">
            <Button type="link" className="forgot-password-link">
              {labels.forgotPassword}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Login;
