import React, { useState, useEffect } from "react";
import { Space, Tooltip, Button, Table, Spin, message } from "antd";
import { EyeOutlined, EditOutlined, PlusOutlined,DownloadOutlined } from "@ant-design/icons";
import RoleMapping from "../roleMapping/roleMapping";
import { fetchRoles,fetchMenuMappingId } from "../../services/locationService";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null); // for add
  const [editRole, setEditRole] = useState(null);        // for edit
  const [viewRole, setViewRole] = useState(null);        // for view
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      console.log("Fetched roles list:", data);
      const activeRoles = (Array.isArray(data) ? data : []).filter(role => role.is_active === true);
      setRoles(activeRoles);
    } catch (error) {
      message.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (record) => {
    setSelectedRole(record);
  };

  const handleEdit = (record) => {
    setEditRole(record);
  };

  const handleView = (record) => {
    setViewRole(record);
  };
 const handleDownload = async (record) => {
  try {
    setLoading(true);
    const mappingRes = await fetchMenuMappingId(record.id);
    if (!mappingRes?.data) {
      message.error("No mapping data found for this role");
      return;
    }

    // Prepare CSV data
    let csvContent = "Role ID,Role Name,Type,Name,Rights\n";
    mappingRes.data.menu_mappings.forEach((item) => {
      const rights = item.rights.map((r) => r.display_name).join(";") || "None";
      csvContent += `${record.id},${record.name},Menu,${item.menu.menu_name},\n`;
      csvContent += `${record.id},${record.name},Submenu,${item.submenu.sub_menu_name},${rights}\n`;
    });
    mappingRes.data.feature_mappings.forEach((item) => {
      const rights = item.rights.map((r) => r.display_name).join(";") || "None";
      csvContent += `${record.id},${record.name},Feature,${item.feature.display_name},${rights}\n`;
    });

    // Create and download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `role_mapping_${record.name}_${record.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success("Role mapping downloaded successfully");
  } catch (error) {
    console.error("Failed to download role mapping:", error);
    message.error("Failed to download role mapping");
  } finally {
    setLoading(false);
  }
};

  const columns = [
    { title: "Role Name", dataIndex: "name", key: "name" },
    { title: "Status", dataIndex: "status", key: "status", render: status => status ? "Active" : "Inactive" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Role Mapping">
            <Button type="link" icon={<PlusOutlined />} onClick={() => handleAdd(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="View">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
            <Tooltip title="Download">
            <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {!selectedRole && !editRole && !viewRole && <h2>Roles</h2>}
      <Spin spinning={loading}>
        {!selectedRole && !editRole && !viewRole ? (
          <Table dataSource={roles} columns={columns} rowKey="id" />
        ) : selectedRole ? (
          <RoleMapping
            role={selectedRole}
            mode="add"
            onClose={() => setSelectedRole(null)}
          />
        ) : editRole ? (
          <RoleMapping
            role={editRole}
            mode="edit"
            onClose={() => setEditRole(null)}
          />
        ) : viewRole ? (
          <RoleMapping
            role={viewRole}
            mode="view"
            onClose={() => setViewRole(null)}
          />
        ) : null}
      </Spin>
    </div>
  );
};

export default RoleList;
