import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Switch,
  Tooltip,
  Form,
  AutoComplete,
  message,
  Checkbox
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  fetchRoles,
  postRole,
  fetchRolesByID,
  UpdateRolesByID,
  fetchScreenLabelById
} from "../services/locationService";

const RoleForm = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [roleActive, setRoleActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [labels, setLabels] = useState({});
  const [roleRights, setRoleRights] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [modalOptions, setModalOptions] = useState([]);

  // Load labels
  const loadLabels = async () => {
    try {
      const data = await fetchScreenLabelById(3);
      if (data && data.labelconfig) {
        setLabels(data.labelconfig);
      } else {
        console.error("Missing labelconfig in response");
      }
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    }
  };

  // Load roles
  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
      setFilteredRoles(data);
      setSearchOptions(data.map(role => ({ value: role.name })));
    } catch (error) {
      message.error("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  // Load rights for Role submenu
  useEffect(() => {
    loadLabels();
    loadRoles();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role_menu_mapping) {
        const mastersMenu = user.role_menu_mapping.find(menu => menu.alias_name === "masters");
        if (mastersMenu && mastersMenu.sub_menus) {
          const roleSubmenu = mastersMenu.sub_menus.find(submenu => submenu.alias_name === "role");
          if (roleSubmenu && roleSubmenu.rights) {
            const rights = roleSubmenu.rights.map(right => right.right_name);
            console.log("Role rights:", rights);
            setRoleRights(rights);
          } else {
            console.warn("No rights or roles submenu found");
            setRoleRights([]);
          }
        } else {
          console.warn("No masters menu or sub_menus found");
          setRoleRights([]);
        }
      } else {
        console.warn("No user or role_menu_mapping found in localStorage");
        setRoleRights([]);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setRoleRights([]);
    }
  }, []);

  // Add role
  const handleAddRole = async () => {
    if (!roleName.trim()) return message.warning(labels?.requiredMessage || "Role name is required");
    if (roles.some(r => r.name.toLowerCase() === roleName.trim().toLowerCase())) {
      return message.warning(labels?.duplicateMessage || "Role name already exists");
    }

    try {
      setLoading(true);
      await postRole({
        name: roleName.trim(),
        is_active: roleActive
      });
      message.success(labels?.addSuccess || "Role added successfully!");
      setModalOpen(false);
      setRoleName("");
      setRoleActive(true);
      setModalOptions([]);
      await loadRoles();
    } catch (error) {
      message.error(labels?.addFail || "Failed to add role");
    } finally {
      setLoading(false);
    }
  };

  // Open Edit modal with fresh data
  const openEditModal = async (role) => {
    try {
      setLoading(true);
      const fresh = await fetchRolesByID(role.id);
      setSelectedRole(fresh);
      setRoleName(fresh.name);
      setRoleActive(fresh.is_active);
      setEditModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch role details");
    } finally {
      setLoading(false);
    }
  };

  // Save edited role
  const handleSaveEdit = async () => {
    if (!roleName.trim()) return message.warning(labels?.requiredMessage || "Role name is required");
    if (roles.some(r => r.name.toLowerCase() === roleName.trim().toLowerCase() && r.id !== selectedRole.id)) {
      return message.warning(labels?.duplicateMessage || "Role name already exists");
    }

    try {
      setLoading(true);
      await UpdateRolesByID(selectedRole.id, {
        name: roleName.trim(),
        is_active: roleActive
      });
      message.success(labels?.updateSuccess || "Role updated successfully!");
      setRoles(prev =>
        prev.map(r =>
          r.id === selectedRole.id
            ? {
                ...r,
                name: roleName.trim(),
                is_active: roleActive
              }
            : r
        )
      );
      setFilteredRoles(prev =>
        prev.map(r =>
          r.id === selectedRole.id
            ? {
                ...r,
                name: roleName.trim(),
                is_active: roleActive
              }
            : r
        )
      );
      setEditModalOpen(false);
      setSelectedRole(null);
      setRoleName("");
      setRoleActive(true);
    } catch (error) {
      message.error(labels?.updateFail || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  // View role
  const handleViewRole = async (role) => {
    try {
      setLoading(true);
      const fresh = await fetchRolesByID(role.id);
      setSelectedRole(fresh);
      setViewModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch role details");
    } finally {
      setLoading(false);
    }
  };

  // Search roles
  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoles(filtered);
    setSearchOptions(
      filtered.map(role => ({ value: role.name }))
    );
    if (!value) {
      setFilteredRoles(roles);
      setSearchOptions(roles.map(role => ({ value: role.name })));
    }
  };

  // Handle Add modal AutoComplete
  const handleAddModalSearch = (text) => {
    setRoleName(text);
    const filtered = roles
      .filter(role => role.name.toLowerCase().includes(text.toLowerCase()))
      .map(role => ({ value: role.name }));
    setModalOptions(filtered);
  };

  // Toggle active status (for future use)
  const handleToggleActive = (id) => {
    setRoles(prev =>
      prev.map(r => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
    setFilteredRoles(prev =>
      prev.map(r => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
  };

  // Download Excel
  const handleDownloadExcel = () => {
    if (roles.length === 0) return message.warning(labels?.noDataExport || "No roles to export.");

    const data = roles.map(role => ({
      [labels?.id || "ID"]: role.id,
      [labels?.role_name]: role.name,
      [labels?.is_active]: role.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const filename = `Roles_${day}-${month}-${year}_${hours}-${minutes}_${ampm}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const columns = [
    {
      title: labels?.role_name,
      dataIndex: "name",
      key: "name"
    },
    {
      title: labels?.is_active,
      key: "active",
      render: (_, record) => (
        <Switch
          checked={record.is_active}
          checkedChildren=""
          unCheckedChildren=""
          disabled
          onChange={() => handleToggleActive(record.id)}
        />
      )
    },
    {
      title: labels?.actions || "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          {roleRights.includes("edit") && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
                style={{ padding: 0 }}
              />
            </Tooltip>
          )}
          {roleRights.includes("View") && (
            <Tooltip title="View">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewRole(record)}
                style={{ padding: 0 }}
              />
            </Tooltip>
          )}
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
        <h2 style={{ margin: 0, flex: 1 }}>{labels?.headerName}</h2>
        {roleRights.includes("search") && (
          <>
            {showSearch ? (
              <AutoComplete
                style={{ width: 200, marginRight: 8 }}
                value={searchValue}
                onChange={handleSearch}
                onSelect={(value) => {
                  setSearchValue(value);
                  const filtered = roles.filter(role => role.name === value);
                  setFilteredRoles(filtered);
                }}
                options={searchOptions}
                placeholder={labels?.searchPlaceholder || "Search role"}
                allowClear
                onBlur={() => setShowSearch(false)}
                autoFocus
              />
            ) : (
              <Tooltip title="Search">
                <Button
                  icon={<SearchOutlined />}
                  style={{ marginRight: 8 }}
                  onClick={() => setShowSearch(true)}
                />
              </Tooltip>
            )}
          </>
        )}
        {roleRights.includes("download") && (
          <Tooltip title="Export">
            <Button
              icon={<DownloadOutlined />}
              style={{ marginRight: 8 }}
              onClick={handleDownloadExcel}
            />
          </Tooltip>
        )}
        {roleRights.includes("add") && (
          <Tooltip title={labels?.addRoleButton || "Add Role"}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setRoleName("");
                setRoleActive(true);
                setModalOptions([]);
                setModalOpen(true);
              }}
            />
          </Tooltip>
        )}
      </div>

      <Table
        dataSource={filteredRoles}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} roles` }}
        loading={loading}
      />

      {/* Add Modal */}
      {roleRights.includes("add") && (
        <Modal
          open={modalOpen}
          title={labels?.add_role?.headerName}
          onCancel={() => setModalOpen(false)}
          onOk={handleAddRole}
          okText={labels?.add_role?.submitButton}
          cancelText={labels?.add_role?.cancelButton}
          okButtonProps={{ loading }}
        >
          <Form layout="vertical">
            <Form.Item label={labels?.add_role?.role_name} required>
              <AutoComplete
                value={roleName}
                onChange={handleAddModalSearch}
                onSelect={(value) => setRoleName(value)}
                options={modalOptions}
                placeholder={labels?.add_role?.roleNamePlaceholder || `Enter ${labels?.add_role?.role_name}`}
              />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={roleActive} onChange={e => setRoleActive(e.target.checked)}>
                {labels?.add_role?.is_active}
              </Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Edit Modal */}
      {roleRights.includes("edit") && (
        <Modal
          open={editModalOpen}
          title={labels?.edit_role?.headerName}
          onCancel={() => setEditModalOpen(false)}
          onOk={handleSaveEdit}
          okText={labels?.edit_role?.saveButton}
          cancelText={labels?.edit_role?.cancelButton}
          okButtonProps={{ loading }}
        >
          <Form layout="vertical">
            <Form.Item label={labels?.edit_role?.role_name} required>
              <Input
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                placeholder={labels?.edit_role?.roleNamePlaceholder || `Enter ${labels?.edit_role?.role_name}`}
              />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={roleActive} onChange={e => setRoleActive(e.target.checked)}>
                {labels?.edit_role?.is_active}
              </Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* View Modal */}
      {roleRights.includes("view") && (
        <Modal
          open={viewModalOpen}
          title={labels?.view_role?.headerName || "View Role"}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
        >
          {selectedRole && (
            <Form layout="vertical">
              <Form.Item label={labels?.view_role?.id || "ID"}>
                <Input value={selectedRole.id} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_role?.role_name || "Role Name"}>
                <Input value={selectedRole.name} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_role?.is_active || "Active Status"}>
                <Checkbox checked={selectedRole.is_active} disabled>
                  {selectedRole.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")}
                </Checkbox>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default RoleForm;