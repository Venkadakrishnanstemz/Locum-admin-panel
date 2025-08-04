// src/components/layout/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import "../style/layout.css"; // Add styles here

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
