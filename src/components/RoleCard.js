import React from "react";

const RoleCard = ({ role, toggleRole }) => {
  return (
    <div
      className={`role-card ${role.selected ? "selected" : ""}`}
      onClick={() => toggleRole(role.id)}
      style={{
        padding: "16px",
        borderRadius: "10px",
        border: role.selected ? "2px solid #3b82f6" : "1px solid #ccc",
        marginBottom: "12px",
        cursor: "pointer",
        backgroundColor: role.selected ? "#e0efff" : "#fff",
        boxShadow: role.selected ? "0 0 6px rgba(59, 130, 246, 0.3)" : "none",
      }}
    >
      <h4 style={{ margin: 0 }}>{role.name}</h4>
    </div>
  );
};

export default RoleCard;
