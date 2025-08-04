import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { getLocalStorageItem } from "../../services/localStorageUtils";
import "./header.css";

const Topbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = getLocalStorageItem("user");
  const userName = user?.name || "User";
  const userRole = user?.roles[0].name
 || "Unknown Role"; // Assuming selectedRole is stored as a string
  const profilePic = user?.profilePic;

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  // Dropdown menu
  const menu = (
    <Menu
      className="profile-dropdown"
      items={[
        {
          key: "name",
          label: (
            <div className="profile-menu-item profile-menu-item-centered">
               {userName}
            </div>
          ),
          disabled: true, // Non-clickable
        },
        {
          key: "role",
          label: (
            <div className="profile-menu-item profile-menu-item-centered">
               {userRole}
            </div>
          ),
          disabled: true, // Non-clickable
        },
        {
          type: "divider",
        },
        {
          key: "settings",
          label: (
            <div className="profile-menu-item">
              <SettingOutlined /> Settings
            </div>
          ),
          onClick: () => navigate("/settings"),
        },
        {
          key: "notifications",
          label: (
            <div className="profile-menu-item">
              <BellOutlined /> Notifications
            </div>
          ),
          onClick: () => navigate("/notifications"),
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: (
            <div className="profile-menu-item">
              <LogoutOutlined /> Logout
            </div>
          ),
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="logo">Locum Admin Panel</span>
      </div>
      <div className="topbar-center">{/* Optional center content */}</div>
      <div className="topbar-right">
        {/* <BellOutlined className="topbar-icon" onClick={() => navigate("/notifications")} />
        <SettingOutlined className="topbar-icon" onClick={() => navigate("/settings")} />
        <span className="topbar-username">{userName}</span> */}
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Avatar
            src={profilePic || "https://i.pravatar.cc/150?img=3"}
            className="topbar-avatar"
            size="large"
            style={{ cursor: "pointer" }}
          />
        </Dropdown>
      </div>
    </header>
  );
};

export default Topbar;
