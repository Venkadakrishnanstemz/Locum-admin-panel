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
//   InputNumber,
//   Switch,
// } from "antd";
// import {
//   EyeOutlined,
//   EditOutlined,
//   PlusOutlined,
//   DownloadOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import { fetchRights, createRight, fetchRightById, updateRightById, fetchScreenLabelById } from "../../services/locationService";
// import * as XLSX from "xlsx";

// const { Option } = Select;

// const Rights = () => {
//   const [rights, setRights] = useState([]);
//   const [filteredRights, setFilteredRights] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedRight, setSelectedRight] = useState(null);
//   const [rightName, setRightName] = useState("");
//   const [rightDisplayName, setRightDisplayName] = useState("");
//   const [rightDescription, setRightDescription] = useState("");
//   const [rightSequence, setRightSequence] = useState(null);
//   const [rightUrl, setRightUrl] = useState("");
//   const [rightMethod, setRightMethod] = useState("");
//   const [rightGroupName, setRightGroupName] = useState("");
//   const [rightIcon, setRightIcon] = useState("");
//   const [rightParentId, setRightParentId] = useState(null);
//   const [rightOrderIndex, setRightOrderIndex] = useState(0);
//   const [rightActive, setRightActive] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [labels, setLabels] = useState(null);

//   // Load labels from API
//   const loadLabels = async () => {
//     try {
//       const data = await fetchScreenLabelById(4);
//       setLabels(data.labelconfig);
//     } catch (err) {
//       console.error("Failed to load labels:", err);
//     }
//   };

//   // Load rights from API
//   const loadRights = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchRights();
//       const rightsData = Array.isArray(data) ? data : data?.data || [];
//       console.log(rightsData, "data from rights");
//       setRights(rightsData);
//       setFilteredRights(rightsData);
//     } catch (err) {
//       message.error("Failed to load rights.");
//       setRights([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadLabels();
//     loadRights();
//   }, []);

//   // Search
//   const handleSearch = (value) => {
//     setSearchValue(value);
//     if (!value) {
//       setFilteredRights(rights);
//     } else {
//       const filtered = rights.filter(
//         (right) =>
//           right.display_name.toLowerCase().includes(value.toLowerCase()) ||
//           right.name.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredRights(filtered);
//     }
//   };

//   // Download Excel
//   const handleDownloadExcel = () => {
//     if (rights.length === 0) {
//       message.warning("No rights to export.");
//       return;
//     }

//     const data = rights.map((right) => ({
//       ID: right.id,
//       [labels?.display_name]: right.display_name,
//       [labels?.name]: right.name,
//       [labels?.url]: right.url,
//       [labels?.method]: right.method,
//       [labels?.group]: right.group_name || "None",
//       [labels?.add_right?.icon]: right.icon || "None",
//       [labels?.add_right?.parent_right]: right.parent_id
//         ? rights.find((r) => r.id === right.parent_id)?.display_name || "Unknown"
//         : "None",
//       [labels?.add_right?.order_index]: right.order_index || 0,
//       [labels?.add_right?.sequence || "Sequence"]: right.sequence || "None",
//       Status: right.is_active ? "Active" : "Inactive",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Rights");

//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, "0");
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const year = now.getFullYear();
//     let hours = now.getHours();
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
//     const formattedDateTime = `${day}-${month}-${year} ${formattedTime}`;
//     const filename = `Rights_${formattedDateTime}.xlsx`;

//     XLSX.writeFile(workbook, filename);
//   };

//   // Validate sequence for add/edit
//   const validateSequence = (sequence, isActive, currentRightId = null) => {
//     if (sequence === null) return true; // Allow null sequence
//     if (!isActive) return true; // Allow any sequence for inactive rights
//     return !rights.some(
//       (right) =>
//         right.sequence === sequence &&
//         right.is_active &&
//         (currentRightId === null || right.id !== currentRightId)
//     );
//   };

//   // Handle add right
//   const handleAddRight = async () => {
//     if (!rightName.trim()) {
//       message.warning(`${labels?.add_right?.name} is required`);
//       return;
//     }
//     if (!rightDisplayName.trim()) {
//       message.warning(`${labels?.add_right?.display_name} is required`);
//       return;
//     }
//     if (rights.some((r) => r.name.toLowerCase() === rightName.trim().toLowerCase())) {
//       message.warning(`${labels?.add_right?.name} already exists`);
//       return;
//     }
//     if (!validateSequence(rightSequence, rightActive)) {
//       message.error("Sequence number is already used by an active right");
//       return;
//     }

//     try {
//       setLoading(true);
//       await createRight({
//         name: rightName.trim(),
//         display_name: rightDisplayName.trim(),
//         description: rightDescription.trim(),
//         sequence: rightSequence !== null ? Number(rightSequence) : null,
//         is_active: rightActive,
//       });
//       message.success("Right added successfully!");
//       setModalOpen(false);
//       setRightName("");
//       setRightDisplayName("");
//       setRightDescription("");
//       setRightSequence(null);
//       setRightActive(true);
//       await loadRights();
//     } catch (error) {
//       message.error("Failed to add right");
//       console.error("Add right error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle edit right
//   const handleEditRight = (right) => {
//     setSelectedRight(right);
//     setRightName(right.name);
//     setRightDisplayName(right.display_name);
//     setRightDescription(right.description || "");
//     setRightUrl(right.url || "");
//     setRightMethod(right.method || "");
//     setRightGroupName(right.group_name || "");
//     setRightIcon(right.icon || "");
//     setRightParentId(right.parent_id || null);
//     setRightOrderIndex(right.order_index || 0);
//     setRightSequence(right.sequence !== undefined ? right.sequence : null);
//     setRightActive(right.is_active);
//     setEditModalOpen(true);
//   };

//   // Handle save edit
//   const handleSaveEdit = async () => {
//     if (!rightName.trim()) {
//       message.warning(`${labels?.edit_right?.name} is required`);
//       return;
//     }
//     if (!rightDisplayName.trim()) {
//       message.warning(`${labels?.edit_right?.display_name} is required`);
//       return;
//     }
//     if (
//       rights.some(
//         (r) =>
//           r.name.toLowerCase() === rightName.trim().toLowerCase() &&
//           r.id !== selectedRight.id
//       )
//     ) {
//       message.warning(`${labels?.edit_right?.name} already exists`);
//       return;
//     }
//     if (!validateSequence(rightSequence, rightActive, selectedRight.id)) {
//       message.error("Sequence number is already used by another active right");
//       return;
//     }

//     try {
//       setLoading(true);
//       await updateRightById(selectedRight.id, {
//         name: rightName.trim(),
//         display_name: rightDisplayName.trim(),
//         description: rightDescription.trim(),
//         sequence: rightSequence !== null ? Number(rightSequence) : null,
//         icon: rightIcon.trim() || null,
//         is_active: rightActive,
//       });
//       message.success("Right updated successfully!");
//       setEditModalOpen(false);
//       setSelectedRight(null);
//       setRightName("");
//       setRightDisplayName("");
//       setRightDescription("");
//       setRightSequence(null);
//       setRightUrl("");
//       setRightMethod("");
//       setRightGroupName("");
//       setRightIcon("");
//       setRightParentId(null);
//       setRightOrderIndex(0);
//       setRightActive(true);
//       await loadRights();
//     } catch (error) {
//       message.error("Failed to update right");
//       console.error("Update error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle view right
//   const handleViewRight = async (right) => {
//     try {
//       setLoading(true);
//       const res = await fetchRightById(right.id);
//       setSelectedRight(res.data);
//       setViewModalOpen(true);
//     } catch (error) {
//       message.error("Failed to fetch right details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: labels?.display_name,
//       dataIndex: "display_name",
//       key: "display_name",
//     },
//     {
//       title: labels?.name,
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: labels?.sequence || "Sequence",
//       dataIndex: "sequence",
//       key: "sequence",
//       render: (sequence) => (sequence !== null ? sequence : "None"),
//     },
//     {
//       title: labels?.is_active,
//       dataIndex: "is_active",
//       key: "is_active",
//       render: (val) => <Switch checked={val} disabled />,
//     },
//     {
//       title: labels?.actions,
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="Edit">
//             <Button
//               type="link"
//               icon={<EditOutlined />}
//               onClick={() => handleEditRight(record)}
//               style={{ padding: 0 }}
//             />
//           </Tooltip>
//           <Tooltip title="View">
//             <Button
//               type="link"
//               icon={<EyeOutlined />}
//               onClick={() => handleViewRight(record)}
//               style={{ padding: 0 }}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   if (!labels) {
//     return <div>Loading labels...</div>;
//   }

//   return (
//     <div>
//       <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
//         <h2 style={{ margin: 0, flex: 1 }}>{labels?.headerName}</h2>
//         {showSearch ? (
//           <AutoComplete
//             style={{ width: 200, marginRight: 8 }}
//             value={searchValue}
//             onChange={handleSearch}
//             placeholder="Search by display name"
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
//           <Button
//             onClick={handleDownloadExcel}
//             style={{ marginRight: 8 }}
//             icon={<DownloadOutlined />}
//           />
//         </Tooltip>
//         <Tooltip title={labels?.addRoleButton}>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => {
//               setRightName("");
//               setRightDisplayName("");
//               setRightDescription("");
//               setRightUrl("");
//               setRightMethod("");
//               setRightGroupName("");
//               setRightIcon("");
//               setRightParentId(null);
//               setRightOrderIndex(0);
//               setRightSequence(null);
//               setRightActive(true);
//               setModalOpen(true);
//             }}
//           />
//         </Tooltip>
//       </div>

//       <Table
//         dataSource={Array.isArray(filteredRights) ? filteredRights : []}
//         columns={columns}
//         rowKey="id"
//         loading={loading}
//         pagination={{
//           pageSize: 10,
//           showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Right`,
//         }}
//       />

//       {/* Add Modal */}
//       <Modal
//         open={modalOpen}
//         title={labels?.add_right?.headerName}
//         onCancel={() => setModalOpen(false)}
//         onOk={handleAddRight}
//         okText={labels?.add_right?.submitbutton}
//         okButtonProps={{ loading }}
//         cancelText={labels?.add_right?.cancelbutton}
//         width={600}
//       >
//         <Form layout="vertical">
//           <Form.Item label={labels?.add_right?.name} required>
//             <AutoComplete
//               value={rightName}
//               onChange={setRightName}
//               options={rights.map((right) => ({ value: right.name }))}
//               placeholder={`Enter ${labels?.add_right?.name}`}
//               filterOption={(inputValue, option) =>
//                 option.value.toLowerCase().includes(inputValue.toLowerCase())
//               }
//             />
//           </Form.Item>
//           <Form.Item label={labels?.add_right?.display_name} required>
//             <Input
//               value={rightDisplayName}
//               onChange={(e) => setRightDisplayName(e.target.value)}
//               placeholder={`Enter ${labels?.add_right?.display_name}`}
//             />
//           </Form.Item>
//           <Form.Item label={labels?.add_right?.description}>
//             <Input.TextArea
//               value={rightDescription}
//               onChange={(e) => setRightDescription(e.target.value)}
//               placeholder={`Enter ${labels?.add_right?.description}`}
//             />
//           </Form.Item>
//           <Form.Item label={labels?.add_right?.sequence || "Sequence"}>
//             <InputNumber
//               value={rightSequence}
//               onChange={(value) => setRightSequence(value)}
//               placeholder={`Enter ${labels?.add_right?.sequence || "Sequence"}`}
//               min={0}
//               style={{ width: "100%" }}
//             />
//           </Form.Item>
//           <Form.Item>
//             <Checkbox
//               checked={rightActive}
//               onChange={(e) => setRightActive(e.target.checked)}
//             >
//               {labels?.add_right?.is_active}
//             </Checkbox>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal
//         open={editModalOpen}
//         title={labels?.edit_right?.headerName}
//         onCancel={() => setEditModalOpen(false)}
//         onOk={handleSaveEdit}
//         okText={labels?.edit_right?.submitbutton}
//         okButtonProps={{ loading }}
//         cancelText={labels?.edit_right?.cancelbutton}
//         width={600}
//       >
//         <Form layout="vertical">
//           <Form.Item label={labels?.edit_right?.name} required>
//             <Input
//               value={rightName}
//               onChange={(e) => setRightName(e.target.value)}
//               placeholder={`Enter ${labels?.edit_right?.name}`}
//             />
//           </Form.Item>
//           <Form.Item label={labels?.edit_right?.display_name} required>
//             <Input
//               value={rightDisplayName}
//               onChange={(e) => setRightDisplayName(e.target.value)}
//               placeholder={`Enter ${labels?.edit_right?.display_name}`}
//             />
//           </Form.Item>
//           <Form.Item label={labels?.edit_right?.description}>
//             <Input.TextArea
//               value={rightDescription}
//               onChange={(e) => setRightDescription(e.target.value)}
//               placeholder={`Enter ${labels?.edit_right?.description}`}
//             />
//           </Form.Item>
//           <Form.Item label={labels?.edit_right?.sequence || "Sequence"}>
//             <InputNumber
//               value={rightSequence}
//               onChange={(value) => setRightSequence(value)}
//               placeholder={`Enter ${labels?.edit_right?.sequence || "Sequence"}`}
//               min={0}
//               style={{ width: "100%" }}
//             />
//           </Form.Item>
//           <Form.Item>
//             <Checkbox
//               checked={rightActive}
//               onChange={(e) => setRightActive(e.target.checked)}
//             >
//               {labels?.edit_right?.is_active}
//             </Checkbox>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* View Modal */}
//       <Modal
//         open={viewModalOpen}
//         title={labels?.view_right?.headerName}
//         onCancel={() => setViewModalOpen(false)}
//         footer={null}
//         width={600}
//       >
//         {selectedRight && (
//           <Form layout="vertical">
//             <Form.Item label={labels?.view_right?.name}>
//               <Input value={selectedRight.name} disabled />
//             </Form.Item>
//             <Form.Item label={labels?.view_right?.display_name}>
//               <Input value={selectedRight.display_name} disabled />
//             </Form.Item>
//             <Form.Item label={labels?.view_right?.description}>
//               <Input.TextArea value={selectedRight.description} disabled />
//             </Form.Item>
//             <Form.Item label={labels?.view_right?.sequence || "Sequence"}>
//               <Input value={selectedRight.sequence !== null ? selectedRight.sequence : "None"} disabled />
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default Rights;


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
  InputNumber,
  Switch
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
  fetchRights,
  createRight,
  fetchRightById,
  updateRightById,
  fetchScreenLabelById
} from "../../services/locationService";

const Rights = () => {
  const [rights, setRights] = useState([]);
  const [filteredRights, setFilteredRights] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRight, setSelectedRight] = useState(null);
  const [rightName, setRightName] = useState("");
  const [rightDisplayName, setRightDisplayName] = useState("");
  const [rightDescription, setRightDescription] = useState("");
  const [rightSequence, setRightSequence] = useState(null);
  const [rightActive, setRightActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [labels, setLabels] = useState({});
  const [rightsRights, setRightsRights] = useState([]); // State for user rights
  const [searchOptions, setSearchOptions] = useState([]);
  const [modalOptions, setModalOptions] = useState([]);

  // Load labels from API
  const loadLabels = async () => {
    try {
      const data = await fetchScreenLabelById(4);
      setLabels(data.labelconfig || {});
    } catch (err) {
      console.error("Failed to load labels:", err);
    }
  };

  // Load rights from API
  const loadRights = async () => {
    setLoading(true);
    try {
      const data = await fetchRights();
      const rightsData = Array.isArray(data) ? data : data?.data || [];
      setRights(rightsData);
      setFilteredRights(rightsData);
      setSearchOptions(rightsData.map(right => ({ value: right.display_name })));
    } catch (err) {
      message.error(labels?.fetchFail || "Failed to load rights.");
      setRights([]);
      setFilteredRights([]);
    } finally {
      setLoading(false);
    }
  };

  // Load user rights for Rights submenu
  useEffect(() => {
    loadLabels();
    loadRights();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role_menu_mapping) {
        const mastersMenu = user.role_menu_mapping.find(menu => menu.alias_name === "masters");
        if (mastersMenu && mastersMenu.sub_menus) {
          const rightsSubmenu = mastersMenu.sub_menus.find(submenu => submenu.alias_name === "rights");
          if (rightsSubmenu && rightsSubmenu.rights) {
            const rights = rightsSubmenu.rights.map(right => right.right_name);
            setRightsRights(rights);
          } else {
            console.warn("No rights or rights submenu found");
            setRightsRights([]);
          }
        } else {
          console.warn("No masters menu or sub_menus found");
          setRightsRights([]);
        }
      } else {
        console.warn("No user or role_menu_mapping found in localStorage");
        setRightsRights([]);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setRightsRights([]);
    }
  }, []);

  // Search
  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = rights.filter(right =>
      right.display_name.toLowerCase().includes(value.toLowerCase()) ||
      right.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRights(filtered);
    setSearchOptions(
      filtered.map(right => ({ value: right.display_name }))
    );
    if (!value) {
      setFilteredRights(rights);
      setSearchOptions(rights.map(right => ({ value: right.display_name })));
    }
  };

  // Handle Add modal AutoComplete
  const handleAddModalSearch = (text) => {
    setRightName(text);
    const filtered = rights
      .filter(right => right.name.toLowerCase().includes(text.toLowerCase()))
      .map(right => ({ value: right.name }));
    setModalOptions(filtered);
  };

  // Download Excel
  const handleDownloadExcel = () => {
    if (rights.length === 0) {
      message.warning(labels?.noDataExport || "No rights to export.");
      return;
    }

    const data = rights.map(right => ({
      [labels?.id || "ID"]: right.id,
      [labels?.display_name]: right.display_name,
      [labels?.name]: right.name,
      [labels?.sequence || "Sequence"]: right.sequence !== null ? right.sequence : "None",
      [labels?.is_active]: right.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rights");

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedDateTime = `${day}-${month}-${year}_${hours}-${minutes}_${ampm}`;
    const filename = `Rights_${formattedDateTime}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  // Validate sequence for add/edit
  const validateSequence = (sequence, isActive, currentRightId = null) => {
    if (sequence === null) return true;
    if (!isActive) return true;
    return !rights.some(
      right =>
        right.sequence === sequence &&
        right.is_active &&
        (currentRightId === null || right.id !== currentRightId)
    );
  };

  // Handle add right
  const handleAddRight = async () => {
    if (!rightName.trim()) {
      message.warning(labels?.requiredMessage || `${labels?.add_right?.name || "Name"} is required`);
      return;
    }
    if (!rightDisplayName.trim()) {
      message.warning(labels?.requiredMessage || `${labels?.add_right?.display_name || "Display Name"} is required`);
      return;
    }
    if (rights.some(r => r.name.toLowerCase() === rightName.trim().toLowerCase())) {
      message.warning(labels?.duplicateMessage || `${labels?.add_right?.name || "Name"} already exists`);
      return;
    }
    if (!validateSequence(rightSequence, rightActive)) {
      message.error(labels?.sequenceDuplicate || "Sequence number is already used by an active right");
      return;
    }

    try {
      setLoading(true);
      await createRight({
        name: rightName.trim(),
        display_name: rightDisplayName.trim(),
        description: rightDescription.trim(),
        sequence: rightSequence !== null ? Number(rightSequence) : null,
        is_active: rightActive
      });
      message.success(labels?.addSuccess || "Right added successfully!");
      setModalOpen(false);
      setRightName("");
      setRightDisplayName("");
      setRightDescription("");
      setRightSequence(null);
      setRightActive(true);
      setModalOptions([]);
      await loadRights();
    } catch (error) {
      message.error(labels?.addFail || "Failed to add right");
      console.error("Add right error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open Edit modal with fresh data
  const openEditModal = async (right) => {
    try {
      setLoading(true);
      const res = await fetchRightById(right.id);
      const fresh = res.data;
      setSelectedRight(fresh);
      setRightName(fresh.name);
      setRightDisplayName(fresh.display_name);
      setRightDescription(fresh.description || "");
      setRightSequence(fresh.sequence !== undefined ? fresh.sequence : null);
      setRightActive(fresh.is_active);
      setEditModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch right details");
    } finally {
      setLoading(false);
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!rightName.trim()) {
      message.warning(labels?.requiredMessage || `${labels?.edit_right?.name || "Name"} is required`);
      return;
    }
    if (!rightDisplayName.trim()) {
      message.warning(labels?.requiredMessage || `${labels?.edit_right?.display_name || "Display Name"} is required`);
      return;
    }
    if (
      rights.some(
        r =>
          r.name.toLowerCase() === rightName.trim().toLowerCase() &&
          r.id !== selectedRight.id
      )
    ) {
      message.warning(labels?.duplicateMessage || `${labels?.edit_right?.name || "Name"} already exists`);
      return;
    }
    if (!validateSequence(rightSequence, rightActive, selectedRight.id)) {
      message.error(labels?.sequenceDuplicate || "Sequence number is already used by another active right");
      return;
    }

    try {
      setLoading(true);
      await updateRightById(selectedRight.id, {
        name: rightName.trim(),
        display_name: rightDisplayName.trim(),
        description: rightDescription.trim(),
        sequence: rightSequence !== null ? Number(rightSequence) : null,
        is_active: rightActive
      });
      message.success(labels?.updateSuccess || "Right updated successfully!");
      setEditModalOpen(false);
      setSelectedRight(null);
      setRightName("");
      setRightDisplayName("");
      setRightDescription("");
      setRightSequence(null);
      setRightActive(true);
      await loadRights();
    } catch (error) {
      message.error(labels?.updateFail || "Failed to update right");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle view right
  const handleViewRight = async (right) => {
    try {
      setLoading(true);
      const res = await fetchRightById(right.id);
      setSelectedRight(res.data);
      setViewModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch right details");
    } finally {
      setLoading(false);
    }
  };

  // Toggle active status (for future use)
  const handleToggleActive = (id) => {
    setRights(prev =>
      prev.map(r => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
    setFilteredRights(prev =>
      prev.map(r => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
  };

  const columns = [
    {
      title: labels?.display_name || "Display Name",
      dataIndex: "display_name",
      key: "display_name"
    },
    {
      title: labels?.name || "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: labels?.sequence || "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      render: sequence => (sequence !== null ? sequence : "None")
    },
    {
      title: labels?.is_active || "Active Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val, record) => (
        <Switch
          checked={val}
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
          {rightsRights.includes("edit") && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
                style={{ padding: 0 }}
              />
            </Tooltip>
          )}
          {rightsRights.includes("View") && (
            <Tooltip title="View">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewRight(record)}
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
        <h2 style={{ margin: 0, flex: 1 }}>{labels?.headerName || "Rights"}</h2>
        {rightsRights.includes("search") && (
          <>
            {showSearch ? (
              <AutoComplete
                style={{ width: 200, marginRight: 8 }}
                value={searchValue}
                onChange={handleSearch}
                onSelect={value => {
                  setSearchValue(value);
                  const filtered = rights.filter(
                    right => right.display_name === value || right.name === value
                  );
                  setFilteredRights(filtered);
                }}
                options={searchOptions}
                placeholder={labels?.searchPlaceholder || "Search by display name or name"}
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
        {rightsRights.includes("download") && (
          <Tooltip title="Export">
            <Button
              icon={<DownloadOutlined />}
              style={{ marginRight: 8 }}
              onClick={handleDownloadExcel}
            />
          </Tooltip>
        )}
        {rightsRights.includes("add") && (
          <Tooltip title={labels?.addRoleButton || "Add Right"}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setRightName("");
                setRightDisplayName("");
                setRightDescription("");
                setRightSequence(null);
                setRightActive(true);
                setModalOptions([]);
                setModalOpen(true);
              }}
            />
          </Tooltip>
        )}
      </div>

      <Table
        dataSource={filteredRights}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Rights`
        }}
      />

      {/* Add Modal */}
      {rightsRights.includes("add") && (
        <Modal
          open={modalOpen}
          title={labels?.add_right?.headerName || "Add Right"}
          onCancel={() => setModalOpen(false)}
          onOk={handleAddRight}
          okText={labels?.add_right?.submitbutton || "Add"}
          cancelText={labels?.add_right?.cancelbutton || "Cancel"}
          okButtonProps={{ loading }}
          width={600}
        >
          <Form layout="vertical">
            <Form.Item label={labels?.add_right?.name || "Name"} required>
              <AutoComplete
                value={rightName}
                onChange={handleAddModalSearch}
                onSelect={value => setRightName(value)}
                options={modalOptions}
                placeholder={labels?.add_right?.namePlaceholder || `Enter ${labels?.add_right?.name || "Name"}`}
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item label={labels?.add_right?.display_name || "Display Name"} required>
              <Input
                value={rightDisplayName}
                onChange={e => setRightDisplayName(e.target.value)}
                placeholder={labels?.add_right?.displayNamePlaceholder || `Enter ${labels?.add_right?.display_name || "Display Name"}`}
              />
            </Form.Item>
            <Form.Item label={labels?.add_right?.description || "Description"}>
              <Input.TextArea
                value={rightDescription}
                onChange={e => setRightDescription(e.target.value)}
                placeholder={labels?.add_right?.descriptionPlaceholder || `Enter ${labels?.add_right?.description || "Description"}`}
              />
            </Form.Item>
            <Form.Item label={labels?.add_right?.sequence || "Sequence"}>
              <InputNumber
                value={rightSequence}
                onChange={value => setRightSequence(value)}
                placeholder={labels?.add_right?.sequencePlaceholder || `Enter ${labels?.add_right?.sequence || "Sequence"}`}
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item>
              <Checkbox
                checked={rightActive}
                onChange={e => setRightActive(e.target.checked)}
              >
                {labels?.add_right?.is_active || "Active"}
              </Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Edit Modal */}
      {rightsRights.includes("edit") && (
        <Modal
          open={editModalOpen}
          title={labels?.edit_right?.headerName || "Edit Right"}
          onCancel={() => setEditModalOpen(false)}
          onOk={handleSaveEdit}
          okText={labels?.edit_right?.submitbutton || "Save"}
          cancelText={labels?.edit_right?.cancelbutton || "Cancel"}
          okButtonProps={{ loading }}
          width={600}
        >
          <Form layout="vertical">
            <Form.Item label={labels?.edit_right?.name || "Name"} required>
              <Input
                value={rightName}
                onChange={e => setRightName(e.target.value)}
                placeholder={labels?.edit_right?.namePlaceholder || `Enter ${labels?.edit_right?.name || "Name"}`}
              />
            </Form.Item>
            <Form.Item label={labels?.edit_right?.display_name || "Display Name"} required>
              <Input
                value={rightDisplayName}
                onChange={e => setRightDisplayName(e.target.value)}
                placeholder={labels?.edit_right?.displayNamePlaceholder || `Enter ${labels?.edit_right?.display_name || "Display Name"}`}
              />
            </Form.Item>
            <Form.Item label={labels?.edit_right?.description || "Description"}>
              <Input.TextArea
                value={rightDescription}
                onChange={e => setRightDescription(e.target.value)}
                placeholder={labels?.edit_right?.descriptionPlaceholder || `Enter ${labels?.edit_right?.description || "Description"}`}
              />
            </Form.Item>
            <Form.Item label={labels?.edit_right?.sequence || "Sequence"}>
              <InputNumber
                value={rightSequence}
                onChange={value => setRightSequence(value)}
                placeholder={labels?.edit_right?.sequencePlaceholder || `Enter ${labels?.edit_right?.sequence || "Sequence"}`}
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item>
              <Checkbox
                checked={rightActive}
                onChange={e => setRightActive(e.target.checked)}
              >
                {labels?.edit_right?.is_active || "Active"}
              </Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* View Modal */}
      {rightsRights.includes("View") && (
        <Modal
          open={viewModalOpen}
          title={labels?.view_right?.headerName || "View Right"}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
          width={600}
        >
          {selectedRight && (
            <Form layout="vertical">
              <Form.Item label={labels?.view_right?.id || "ID"}>
                <Input value={selectedRight.id} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_right?.name || "Name"}>
                <Input value={selectedRight.name} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_right?.display_name || "Display Name"}>
                <Input value={selectedRight.display_name} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_right?.description || "Description"}>
                <Input.TextArea value={selectedRight.description} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_right?.sequence || "Sequence"}>
                <Input value={selectedRight.sequence !== null ? selectedRight.sequence : "None"} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_right?.is_active || "Active Status"}>
                <Checkbox checked={selectedRight.is_active} disabled>
                  {selectedRight.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")}
                </Checkbox>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Rights;