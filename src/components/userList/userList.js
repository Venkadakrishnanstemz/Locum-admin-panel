import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Descriptions,
  message,
  Tooltip,
  Switch,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  RedoOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getuser,
} from "../../services/locationService";
import "./userList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getuser();
        console.log("Fetched users:", response);
        const formatted = response.map((user, index) => ({
          key: user.id || index,
          name: user.name,
          role: user.roles?.map((r) => r.name).join(", ") || "N/A",
          gender: user.gender || "N/A",
          phoneNumber: user.phone || "N/A",
          mailid: user.email || "N/A",
          isActive: user.is_active ?? true,
        }));
        setUsers(formatted);
      } catch (err) {
        message.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAdd = () => {
    navigate("/userMain", { state: { isCreating: true } });
  };

  const handleEdit = (record) => {
    navigate("/userMain", { state: { user: record, isCreating: false } });
  };

  const handleView = (record) => {
    setViewUser(record);
  };

  const handleResetPassword = (record) => {
    Modal.confirm({
      title: `Send password reset email to ${record.name}?`,
      content: `A password reset email will be sent to ${record.mailid}.`,
      onOk: () => {
        message.success(`Password reset email sent to ${record.mailid}`);
      },
      onCancel: () => {
        message.info("Password reset cancelled");
      },
    });
  };

  const handleDownload = (record) => {
    const csvContent = `Key,Name,Role,Gender,Phone Number,Mail ID,isActive\n${record.key},${record.name},${record.role},${record.gender},${record.phoneNumber},${record.mailid},${record.isActive}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${record.name}_user_data.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    message.success("User data downloaded");
  };

  const handleDownloadList = () => {
    const csvContent = [
      "Key,Name,Role,Gender,Phone Number,Mail ID,isActive",
      ...users.map(
        (u) =>
          `${u.key},${u.name},${u.role},${u.gender},${u.phoneNumber},${u.mailid},${u.isActive}`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user_list.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    message.success("User list downloaded");
  };

  const handleToggleActive = (checked, record) => {
    setUsers((prev) =>
      prev.map((u) => (u.key === record.key ? { ...u, isActive: checked } : u))
    );
    message.success(`User ${record.name} is now ${checked ? "active" : "inactive"}`);
  };

  const columns = [
    { title: "User Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Mail ID", dataIndex: "mailid", key: "mailid" },
    {
      title: "isActive",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(checked, record)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Reset Password">
            <Button type="text" icon={<RedoOutlined />} onClick={() => handleResetPassword(record)} />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<DownloadOutlined />} onClick={() => handleDownload(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-list-container">
      <div className="user-list-header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <div className="button-group flex gap-2">
          <Tooltip title="Download User List">
            <Button icon={<DownloadOutlined />} onClick={handleDownloadList} />
          </Tooltip>
          <Tooltip title="Add New User">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}></Button>
          </Tooltip>
        </div>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="key"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* View Modal */}
      <Modal
        open={!!viewUser}
        title="User Details"
        onCancel={() => setViewUser(null)}
        footer={null}
      >
        {viewUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{viewUser.name}</Descriptions.Item>
            <Descriptions.Item label="Role">{viewUser.role}</Descriptions.Item>
            <Descriptions.Item label="Gender">{viewUser.gender}</Descriptions.Item>
            <Descriptions.Item label="Phone Number">{viewUser.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Mail ID">{viewUser.mailid}</Descriptions.Item>
            <Descriptions.Item label="Active">{viewUser.isActive ? "Yes" : "No"}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
