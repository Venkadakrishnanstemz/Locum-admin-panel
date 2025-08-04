// import React from "react";
// import { Breadcrumb } from "antd";
// import { Link, useLocation } from "react-router-dom";

// const Breadcrumbs = () => {
//   const location = useLocation();
//   const pathSnippets = location.pathname.split("/").filter(i => i);

//   // Optionally, map route segments to display names
//   const nameMap = {
//     location: "Location",
//     form: "Form",
//     role: "Role",
//     menu: "Menu",
//     ListRole: "Role List",
//     "role-mapping": "Role Mapping",
//     listuser: "User List",
//     // Add more as needed
//   };

//   return (
//     <Breadcrumb style={{ margin: "16px 0" }}>
//       <Breadcrumb.Item>
//         <Link to="/">Masters</Link>
//       </Breadcrumb.Item>
//       {pathSnippets.map((snippet, idx) => {
//         const url = `/${pathSnippets.slice(0, idx + 1).join("/")}`;
//         const isLast = idx === pathSnippets.length - 1;
//         return (
//           <Breadcrumb.Item key={url}>
//             {isLast ? (
//               nameMap[snippet] || snippet
//             ) : (
//               <Link to={url}>{nameMap[snippet] || snippet}</Link>
//             )}
//           </Breadcrumb.Item>
//         );
//       })}
//     </Breadcrumb>
//   );
// };

// export default Breadcrumbs;
import React from "react";
import { Breadcrumb, Button, Space } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedMenus, selectedMenuRights, selectedFeatures, selectedFeatureRights } = useSelector(
    (state) => state.roleMapping || {}
  );
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  // Map route segments to display names
  const nameMap = {
    location: "Location",
    form: "Form",
    role: "Role",
    menu: "Menu",
    ListRole: "Role List",
    "role-mapping": "Role Mapping",
    listuser: "User List",
    features: "Features",
    Rights: "Rights",
    menuCreation: "Menu Creation",
    label: "Label Config",
    hrverification: "HR Verification",
    Dashboard: "Dashboard",
    "find-professionals": "Find Professionals",
    "book-profile": "Book Profile",
    BookingsPage: "Bookings",
    "login-page": "Login",
    "register-page": "Register",
    "verification-details": "Verification Details",
    Sidebars: "Sidebars",
  };

  const handleBack = () => {
    try {
      if (location.pathname.includes("/role-mapping")) {
        const hasChanges =
          selectedMenus?.length > 0 ||
          Object.keys(selectedMenuRights || {}).length > 0 ||
          selectedFeatures?.length > 0 ||
          Object.keys(selectedFeatureRights || {}).length > 0;

        if (hasChanges && !window.confirm("You have unsaved changes. Are you sure you want to go back?")) {
          return;
        }
        navigate("/ListRole");
      } else {
        navigate(-1); // Default back navigation for other routes
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Optionally, use Ant Design's message component for error feedback
      // import { message } from "antd";
      // message.error("Failed to navigate back");
    }
  };

  return (
    <Space
      style={{
        margin: "16px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Pushes breadcrumb to left, button to right
        width: "100%", // Ensures Space takes full container width
      }}
    >
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Masters</Link>
        </Breadcrumb.Item>
        {pathSnippets.map((snippet, idx) => {
          const url = `/${pathSnippets.slice(0, idx + 1).join("/")}`;
          const isLast = idx === pathSnippets.length - 1;
          return (
            <Breadcrumb.Item key={url}>
              {isLast ? (
                nameMap[snippet] || snippet
              ) : (
                <Link to={url}>{nameMap[snippet] || snippet}</Link>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <Button
        icon={<LeftOutlined />}
        size="small"
        onClick={handleBack}
      >
        Back
      </Button>
    </Space>
  );
};

export default Breadcrumbs;