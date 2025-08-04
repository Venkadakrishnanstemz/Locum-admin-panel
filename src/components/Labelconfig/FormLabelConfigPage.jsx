// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Form,
//   Button,
//   Modal,
//   Input,
//   Select,
//   Space,
//   Checkbox,
//   Tooltip,
//   AutoComplete,
//   message,
//   Switch,
// } from "antd";
// import {
//   EyeOutlined,
//   EditOutlined,
//   PlusOutlined,
//   DownloadOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import * as XLSX from "xlsx";
// import {
//   fetchAllScreenLabels,
//   fetchScreenLabelById,
//   createScreenLabel,
//   updateScreenLabel,
// } from "../../services/locationService";

// const { Option } = Select;

// const FormLabelConfigPage = () => {
//   const [labels, setLabels] = useState([]);
//   const [filteredLabels, setFilteredLabels] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedLabel, setSelectedLabel] = useState(null);
//   const [pageName, setPageName] = useState("");
//   const [labelName, setLabelName] = useState("");
//   const [isActive, setIsActive] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [showSearch, setShowSearch] = useState(false);

//   const loadLabels = async () => {
//     setLoading(true);
//     try {
//       const res = await fetchAllScreenLabels();
//       const labelsData = Array.isArray(res) ? res : res?.data || [];

//       const transformed = labelsData.map((item) => ({
//         id: item.id,
//         page_name: item.page,
//         label_name: Object.entries(item.labelconfig || {})
//           .map(([key, value]) => `${key}: ${value}`)
//           .join(", "),
//         is_active: item.is_active,
//       }));

//       setLabels(transformed);
//       setFilteredLabels(transformed);
//     } catch (error) {
//       message.error("Failed to load labels");
//       console.error("Error loading labels", error);
//       setLabels([]);
//       setFilteredLabels([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadLabels();
//   }, []);

//   const handleSearch = (value) => {
//     setSearchValue(value);
//     if (!value) {
//       setFilteredLabels(labels);
//     } else {
//       const filtered = labels.filter(
//         (label) =>
//           label.label_name?.toLowerCase().includes(value.toLowerCase()) ||
//           label.page_name?.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredLabels(filtered);
//     }
//   };

//   const handleDownloadExcel = () => {
//     if (labels.length === 0) {
//       message.warning("No labels to export.");
//       return;
//     }

//     const data = labels.map((label) => ({
//       ID: label.id,
//       "Page Name": label.page_name,
//       "Label Config": label.label_name,
//       Status: label.is_active ? "Active" : "Inactive",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Labels");
//     XLSX.writeFile(workbook, `Labels_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   };

//   const handleAddLabel = async () => {
//     if (!pageName.trim()) return message.warning("Page name is required");
//     if (!labelName.trim()) return message.warning("Label Config is required");

//     try {
//       setLoading(true);
//       await createScreenLabel({
//         page_name: pageName.trim(),
//         label_name: labelName.trim(),
//         is_active: isActive,
//       });
//       message.success("Label added successfully!");
//       setModalOpen(false);
//       resetFormFields();
//       await loadLabels();
//     } catch (error) {
//       message.error("Failed to add label");
//       console.error("Add label error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditLabel = (label) => {
//     setSelectedLabel(label);
//     setPageName(label.page_name || "");
//     setLabelName(label.label_name || "");
//     setIsActive(label.is_active);
//     setEditModalOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     if (!pageName.trim()) return message.warning("Page name is required");
//     if (!labelName.trim()) return message.warning("Label Config is required");

//     try {
//       setLoading(true);
//       await updateScreenLabel(selectedLabel.id, {
//         page_name: pageName.trim(),
//         label_name: labelName.trim(),
//         is_active: isActive,
//       });
//       message.success("Label updated successfully!");
//       setEditModalOpen(false);
//       resetFormFields();
//       await loadLabels();
//     } catch (error) {
//       message.error("Failed to update label");
//       console.error("Update error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewLabel = (label) => {
//     setSelectedLabel(label);
//     setViewModalOpen(true);
//   };

//   const resetFormFields = () => {
//     setPageName("");
//     setLabelName("");
//     setIsActive(true);
//     setSelectedLabel(null);
//   };

//   const columns = [
//     {
//       title: "Page Name",
//       dataIndex: "page_name",
//       key: "page_name",
//     },
//     {
//       title: "Label Config",
//       dataIndex: "label_name",
//       key: "label_name",
//     },
//     {
//       title: "Status",
//       dataIndex: "is_active",
//       key: "is_active",
//       render: (val) => (
//         <Switch checked={val} disabled checkedChildren="Active" unCheckedChildren="Inactive" />
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="Edit">
//             <Button
//               type="link"
//               icon={<EditOutlined />}
//               onClick={() => handleEditLabel(record)}
//               style={{ padding: 0 }}
//             />
//           </Tooltip>
//           <Tooltip title="View">
//             <Button
//               type="link"
//               icon={<EyeOutlined />}
//               onClick={() => handleViewLabel(record)}
//               style={{ padding: 0 }}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
//         <h2 style={{ margin: 0, flex: 1 }}>Form Label Configuration</h2>
//         {showSearch ? (
//           <AutoComplete
//             style={{ width: 200, marginRight: 8 }}
//             value={searchValue}
//             onChange={handleSearch}
//             placeholder="Search by page or label"
//             allowClear
//           />
//         ) : (
//           <Tooltip title="Search">
//             <Button
//               icon={<SearchOutlined />}
//               style={{ marginRight: 8 }}
//               onClick={() => setShowSearch(true)}
//             />
//           </Tooltip>
//         )}
//         <Tooltip title="Export">
//           <Button onClick={handleDownloadExcel} style={{ marginRight: 8 }} icon={<DownloadOutlined />} />
//         </Tooltip>
//         <Tooltip title="Add Label">
//           <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
//             Add Label
//           </Button>
//         </Tooltip>
//       </div>

//       <Table
//         dataSource={filteredLabels}
//         columns={columns}
//         rowKey="id"
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />

//       {/* Add Modal */}
//       <Modal
//         open={modalOpen}
//         title="Add Label"
//         onCancel={() => setModalOpen(false)}
//         onOk={handleAddLabel}
//         okText="Add"
//         cancelText="Cancel"
//         okButtonProps={{ loading }}
//         width={600}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Page Name" required>
//             <Input value={pageName} onChange={(e) => setPageName(e.target.value)} />
//           </Form.Item>
//           <Form.Item label="Label Config" required>
//             <Input value={labelName} onChange={(e) => setLabelName(e.target.value)} />
//           </Form.Item>
//           <Form.Item label="Status">
//             <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
//               Active
//             </Checkbox>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal
//         open={editModalOpen}
//         title="Edit Label"
//         onCancel={() => setEditModalOpen(false)}
//         onOk={handleSaveEdit}
//         okText="Update"
//         cancelText="Cancel"
//         okButtonProps={{ loading }}
//         width={600}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Page Name" required>
//             <Input value={pageName} onChange={(e) => setPageName(e.target.value)} />
//           </Form.Item>
//           <Form.Item label="Label Config" required>
//             <Input value={labelName} onChange={(e) => setLabelName(e.target.value)} />
//           </Form.Item>
//           <Form.Item label="Status">
//             <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
//               Active
//             </Checkbox>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* View Modal */}
//       <Modal
//         open={viewModalOpen}
//         title="View Label"
//         onCancel={() => setViewModalOpen(false)}
//         footer={null}
//         width={600}
//       >
//         {selectedLabel && (
//           <Form layout="vertical">
//             <Form.Item label="Page Name">
//               <Input value={selectedLabel.page_name} disabled />
//             </Form.Item>
//             <Form.Item label="Label Config">
//               <Input value={selectedLabel.label_name} disabled />
//             </Form.Item>
//             <Form.Item label="Status">
//               <Checkbox checked={selectedLabel.is_active} disabled>
//                 Active
//               </Checkbox>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default FormLabelConfigPage;
import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Modal,
  Input,
  Checkbox,
  Tooltip,
  AutoComplete,
  message,
  Switch,
  Space,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  SearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  fetchAllScreenLabels,
  fetchScreenLabelById,
  createScreenLabel,
  updateScreenLabel,
} from "../../services/locationService";

const FormLabelConfigPage = () => {
  const [labels, setLabels] = useState([]);
  const [filteredLabels, setFilteredLabels] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [pageName, setPageName] = useState("");
  const [labelName, setLabelName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const loadLabels = async () => {
    setLoading(true);
    try {
      const res = await fetchAllScreenLabels();
      const labelsData = Array.isArray(res) ? res : res?.data || [];

      const transformed = labelsData.map((item) => ({
        id: item.id,
        page_name: item.page,
        raw_labelconfig: item.labelconfig || {},
        label_name: Object.entries(item.labelconfig || {})
          .map(([key, value]) => {
            if (typeof value === "object") {
              return `${key}: ${JSON.stringify(value)}`;
            }
            return `${key}: ${value}`;
          })
          .join(", "),
        is_active: item.is_active,
      }));

      setLabels(transformed);
      setFilteredLabels(transformed);
    } catch (error) {
      message.error("Failed to load labels");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLabels();
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    if (!value) {
      setFilteredLabels(labels);
    } else {
      const filtered = labels.filter(
        (label) =>
          label.label_name?.toLowerCase().includes(value.toLowerCase()) ||
          label.page_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLabels(filtered);
    }
  };

  const handleDownloadExcel = () => {
    if (labels.length === 0) {
      message.warning("No labels to export.");
      return;
    }

    const data = labels.map((label) => ({
      ID: label.id,
      "Page Name": label.page_name,
      "Label Config": label.label_name,
      Status: label.is_active ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Labels");
    XLSX.writeFile(workbook, `Labels_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleAddLabel = async () => {
    if (!pageName.trim()) return message.warning("Page name is required");
    if (!labelName.trim()) return message.warning("Label Config is required");

    try {
      setLoading(true);
      const parsed = JSON.parse(labelName);
      await createScreenLabel({
        page_name: pageName.trim(),
        label_name: parsed,
        is_active: isActive,
      });
      message.success("Label added successfully!");
      setModalOpen(false);
      resetFormFields();
      await loadLabels();
    } catch (error) {
      message.error("Invalid Label Config JSON");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLabel = (label) => {
    setSelectedLabel(label);
    setPageName(label.page_name || "");
    setLabelName(JSON.stringify(label.raw_labelconfig, null, 2));
    setIsActive(label.is_active);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!pageName.trim()) return message.warning("Page name is required");
    if (!labelName.trim()) return message.warning("Label Config is required");

    try {
      setLoading(true);
      const parsed = JSON.parse(labelName);
      await updateScreenLabel(selectedLabel.id, {
        page_name: pageName.trim(),
        label_name: parsed,
        is_active: isActive,
      });
      message.success("Label updated successfully!");
      setEditModalOpen(false);
      resetFormFields();
      await loadLabels();
    } catch (error) {
      message.error("Invalid JSON format");
    } finally {
      setLoading(false);
    }
  };

  const handleViewLabel = (label) => {
    setSelectedLabel(label);
    setViewModalOpen(true);
  };

  const resetFormFields = () => {
    setPageName("");
    setLabelName("");
    setIsActive(true);
    setSelectedLabel(null);
  };

  const columns = [
    {
      title: "Page Name",
      dataIndex: "page_name",
      key: "page_name",
    },
    {
      title: "Label Config",
      dataIndex: "label_name",
      key: "label_name",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val) => (
        <Switch checked={val} disabled checkedChildren="Active" unCheckedChildren="Inactive" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditLabel(record)} />
          </Tooltip>
          <Tooltip title="View">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewLabel(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const sampleJson = {
   headerName: "Access Portal",
  username: "User ID",
  password: "Secret Key",
  loginButton: "Enter",
  forgotPassword: "Need Help Signing In?"
  };

  return (
    <div>
      <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
        <h2 style={{ margin: 0, flex: 1 }}>Form Label Configuration</h2>
        {showSearch ? (
          <AutoComplete
            style={{ width: 200, marginRight: 8 }}
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search by page or label"
            allowClear
          />
        ) : (
          <Tooltip title="Search">
            <Button icon={<SearchOutlined />} onClick={() => setShowSearch(true)} />
          </Tooltip>
        )}
        <Tooltip title="Sample JSON">
          <Button icon={<FileTextOutlined />} onClick={() => setJsonModalOpen(true)} />
        </Tooltip>
        <Tooltip title="Export">
          <Button icon={<DownloadOutlined />} onClick={handleDownloadExcel} />
        </Tooltip>
        <Tooltip title="Add Label">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Add Label
          </Button>
        </Tooltip>
      </div>

      <Table
        dataSource={filteredLabels}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 4 }}
      />

      {/* Add Modal */}
      <Modal
        open={modalOpen}
        title="Add Label"
        onCancel={() => setModalOpen(false)}
        onOk={handleAddLabel}
        okText="Add"
        cancelText="Cancel"
        okButtonProps={{ loading }}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Page Name" required>
            <Input value={pageName} onChange={(e) => setPageName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Label Config (JSON format)" required>
            <Input.TextArea
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              rows={6}
              placeholder='e.g., {"name": "Dashboard Name", "is_active": "Active"}'
            />
          </Form.Item>
          <Form.Item label="Status">
            <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
              Active
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        title="Edit Label"
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveEdit}
        okText="Update"
        cancelText="Cancel"
        okButtonProps={{ loading }}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Page Name" required>
            <Input value={pageName} onChange={(e) => setPageName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Label Config (JSON format)" required>
            <Input.TextArea
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              rows={6}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
              Active
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewModalOpen}
        title="View Label"
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedLabel && (
          <Form layout="vertical">
            <Form.Item label="Page Name">
              <Input value={selectedLabel.page_name} disabled />
            </Form.Item>
            <Form.Item label="Label Config">
              <pre
                style={{
                  background: "#f6f8fa",
                  padding: "12px",
                  borderRadius: 6,
                  fontSize: 13,
                  whiteSpace: "pre-wrap",
                }}
              >
                {JSON.stringify(selectedLabel.raw_labelconfig, null, 2)}
              </pre>
            </Form.Item>
            <Form.Item label="Status">
              <Checkbox checked={selectedLabel.is_active} disabled>
                Active
              </Checkbox>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* JSON Viewer Modal */}
      <Modal
        open={jsonModalOpen}
        title="Sample JSON Format"
        onCancel={() => setJsonModalOpen(false)}
        footer={null}
        width={700}
      >
        <pre
          style={{
            background: "#f6f8fa",
            padding: "20px",
            borderRadius: "8px",
            overflowX: "auto",
            fontSize: 14,
          }}
        >
          {JSON.stringify(sampleJson, null, 2)}
        </pre>
      </Modal>
    </div>
  );
};

export default FormLabelConfigPage;
