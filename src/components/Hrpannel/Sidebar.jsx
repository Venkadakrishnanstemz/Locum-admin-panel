// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import './Findprofessional.css';
// import './Sidebar.css';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

//   const handleLogout = () => {
//     localStorage.removeItem('currentUser');
//     navigate('/');
//   };

//   const getRoleDisplay = (role) => {
//     switch(role) {
//       case 'hr': return 'HR Manager';
//       case 'admin': return 'Administrator';
//       default: return 'User';
//     }
//   };

//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <div className="logo">
//           <div className="logo-icon">L</div>
//           <span className="logo-text">LocumLink</span>
//         </div>
//         <p className="platform-text">Healthcare Staffing Platform</p>
//       </div>

//       <div className="nav-section">
//         <h3 className="nav-title">Main</h3>
//         {currentUser?.name ? (
//           <>
//            <Link to="/dashboard" className="nav-item">
//               <div className="nav-icon"></div>
//               <span>HR Verification</span>
//             </Link>
//             <Link to="/dashboard" className="nav-item">
//               <div className="nav-icon"></div>
//               <span>Dashboard</span>
//             </Link>
//             <Link to="/find-professionals" className="nav-item">
//               <div className="nav-icon"></div>
//               <span>Find Professionals</span>
//             </Link>
//             <Link to="/BookingsPage" className="nav-item">
//               <div className="nav-icon"></div>
//               <span>Bookings</span>
//             </Link>
//           </>
//         ) : (
//           <Link to="/" className="nav-item">
//             <div className="nav-icon"></div>
//             <span>Login</span>
//           </Link>
//         )}
//         <Link to="#" className="nav-item">
//           <div className="nav-icon"></div>
//           <span>Notifications</span>
//           <span className="notification-badge">1</span>
//         </Link>
//       </div>

//       <div className="account-section">
//         <h3 className="nav-title">Account</h3>
//         <Link to="#" className="nav-item">
//           <div className="nav-icon"></div>
//           <span>Settings</span>
//         </Link>
//         <Link to="#" className="nav-item">
//           <div className="nav-icon"></div>
//           <span>Help & Support</span>
//         </Link>

//         {currentUser?.name && (
//           <div className="user-profile">
//             <div className="user-avatar">{currentUser.name.charAt(0)}</div>
//             <div className="user-info">
//               <h4>{currentUser.name}</h4>
//               <p>{getRoleDisplay(currentUser.role)}</p>
//             </div>
//             <button 
//               onClick={handleLogout}
//               className="logout-button"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchSubMenus } from "../../services/api";
import './Findprofessional.css';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const [subMenus, setSubMenus] = useState([]);

  useEffect(() => {
    const loadSubMenus = async () => {
      try {
        const data = await fetchSubMenus(12);
        const sortedMenus = (data?.data || []).sort((a, b) => a.sequence - b.sequence);
        setSubMenus(sortedMenus);
      } catch (error) {
        console.error("Error loading submenus:", error);
      }
    };
    loadSubMenus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'hr': return 'HR Manager';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const mainSubMenus = subMenus.filter(menu => !["Settings", "Help & Support"].includes(menu.sub_menu_name));
  const accountSubMenus = subMenus.filter(menu => ["Settings", "Help & Support"].includes(menu.sub_menu_name));

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">L</div>
          <span className="logo-text">LocumLink</span>
        </div>
        <p className="platform-text">Healthcare Staffing Platform</p>
      </div>

      <div className="nav-section">
        <h3 className="nav-title">Main</h3>

        {currentUser?.name ? (
          <>
            {mainSubMenus.map((submenu) => (
              <Link key={submenu.id} to={submenu.link_menu || "#"} className="nav-item">
                <div className="nav-icon"></div>
                <span>{submenu.sub_menu_name}</span>
              </Link>
            ))}
          </>
        ) : (
          <Link to="/" className="nav-item">
            <div className="nav-icon"></div>
            <span>Login</span>
          </Link>
        )}
      </div>

      {accountSubMenus.length > 0 && (
        <div className="account-section">
          <h3 className="nav-title">Account</h3>

          {accountSubMenus.map((submenu) => (
            <Link key={submenu.id} to={submenu.link_menu || "#"} className="nav-item">
              <div className="nav-icon"></div>
              <span>{submenu.sub_menu_name}</span>
            </Link>
          ))}

          {currentUser?.name && (
            <div className="user-profile">
              <div className="user-avatar">{currentUser.name.charAt(0)}</div>
              <div className="user-info">
                <h4>{currentUser.name}</h4>
                <p>{getRoleDisplay(currentUser.role)}</p>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
