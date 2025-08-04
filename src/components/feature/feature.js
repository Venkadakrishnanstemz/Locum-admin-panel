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
  fetchFeatures,
  createFeature,
  fetchFeatureById,
  updateFeatureById,
  fetchScreenLabelById
} from "../../services/locationService";

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [labels, setLabels] = useState({});
  const [featureRights, setFeatureRights] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [modalOptions, setModalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Load labels from API
  const loadLabels = async () => {
    try {
      const data = await fetchScreenLabelById(5);
      setLabels(data.labelconfig || {});
    } catch (err) {
      console.error("Failed to load labels:", err);
    }
  };

  // Load features from API
  const loadFeatures = async () => {
    setLoading(true);
    try {
      const response = await fetchFeatures();
      const featuresData = Array.isArray(response) ? response : response?.data || [];
      setFeatures(featuresData);
      setFilteredFeatures(featuresData);
      setSearchOptions(featuresData.map(feature => ({ value: feature.display_name })));
    } catch (err) {
      message.error(labels?.fetchFail || "Failed to load features.");
      setFeatures([]);
      setFilteredFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  // Load user rights for Features submenu
  useEffect(() => {
    loadLabels();
    loadFeatures();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role_menu_mapping) {
        const mastersMenu = user.role_menu_mapping.find(menu => menu.alias_name === "masters");
        if (mastersMenu && mastersMenu.sub_menus) {
          const featuresSubmenu = mastersMenu.sub_menus.find(submenu => submenu.alias_name === "features");
          if (featuresSubmenu && featuresSubmenu.rights) {
            const rights = featuresSubmenu.rights.map(right => right.right_name);
            setFeatureRights(rights);
          } else {
            console.warn("No rights or features submenu found");
            setFeatureRights([]);
          }
        } else {
          console.warn("No masters menu or sub_menus found");
          setFeatureRights([]);
        }
      } else {
        console.warn("No user or role_menu_mapping found in localStorage");
        setFeatureRights([]);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setFeatureRights([]);
    }
  }, []);

  // Search handler
  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = features.filter(
      feature =>
        feature.display_name.toLowerCase().includes(value.toLowerCase()) ||
        feature.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFeatures(filtered);
    setSearchOptions(
      filtered.map(feature => ({ value: feature.display_name }))
    );
    if (!value) {
      setFilteredFeatures(features);
      setSearchOptions(features.map(feature => ({ value: feature.display_name })));
    }
  };

  // Handle Add modal AutoComplete
  const handleAddModalSearch = (text) => {
    form.setFieldsValue({ name: text });
    const filtered = features
      .filter(feature => feature.name.toLowerCase().includes(text.toLowerCase()))
      .map(feature => ({ value: feature.name }));
    setModalOptions(filtered);
  };

  // Download Excel
  const handleDownloadExcel = () => {
    if (features.length === 0) {
      message.warning(labels?.noDataExport || "No features to export.");
      return;
    }

    const data = features.map(feature => ({
      [labels?.id || "ID"]: feature.id,
      [labels?.name || "Name"]: feature.name,
      [labels?.display_name || "Display Name"]: feature.display_name,
      [labels?.is_active || "Active Status"]: feature.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Features");

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedDateTime = `${day}-${month}-${year}_${hours}-${minutes}_${ampm}`;
    const filename = `Features_${formattedDateTime}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  // Handle add feature
  const handleAddFeature = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      if (features.some(f => f.name.toLowerCase() === values.name.trim().toLowerCase())) {
        message.warning(labels?.duplicateMessage || `${labels?.add_feature?.name || "Name"} already exists`);
        return;
      }

      setLoading(true);
      await createFeature({
        name: values.name.trim(),
        display_name: values.display_name.trim(),
        description: values.description?.trim() || "",
        is_active: values.is_active
      });
      message.success(labels?.addSuccess || "Feature added successfully!");
      setModalOpen(false);
      form.resetFields();
      setModalOptions([]);
      await loadFeatures();
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error(labels?.addFail || "Failed to add feature");
      console.error("Add feature error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open Edit modal with fresh data
  const openEditModal = async (feature) => {
    try {
      setLoading(true);
      const fresh = await fetchFeatureById(feature.id);
      const featureData = fresh.data;
      setSelectedFeature(featureData);
      form.setFieldsValue({
        name: featureData.name,
        display_name: featureData.display_name,
        description: featureData.description || "",
        is_active: featureData.is_active
      });
      setEditModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch feature details");
    } finally {
      setLoading(false);
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      if (
        features.some(
          f =>
            f.name.toLowerCase() === values.name.trim().toLowerCase() &&
            f.id !== selectedFeature.id
        )
      ) {
        message.warning(labels?.duplicateMessage || `${labels?.edit_feature?.name || "Name"} already exists`);
        return;
      }

      setLoading(true);
      await updateFeatureById(selectedFeature.id, {
        name: values.name.trim(),
        display_name: values.display_name.trim(),
        description: values.description?.trim() || "",
        is_active: values.is_active
      });
      message.success(labels?.updateSuccess || "Feature updated successfully!");
      setEditModalOpen(false);
      form.resetFields();
      setSelectedFeature(null);
      await loadFeatures();
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error(labels?.updateFail || "Failed to update feature");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle view feature
  const handleViewFeature = async (feature) => {
    try {
      setLoading(true);
      const fresh = await fetchFeatureById(feature.id);
      setSelectedFeature(fresh.data);
      setViewModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch feature details");
      console.error("View feature error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle active status (for future use)
  const handleToggleActive = (id) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, is_active: !f.is_active } : f))
    );
    setFilteredFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, is_active: !f.is_active } : f))
    );
  };

  const columns = [
    {
      title: labels?.name || "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: labels?.display_name || "Display Name",
      dataIndex: "display_name",
      key: "display_name"
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
          {featureRights.includes("edit") && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
                style={{ padding: 0 }}
              />
            </Tooltip>
          )}
          {featureRights.includes("View") && (
            <Tooltip title="View">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewFeature(record)}
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
        <h2 style={{ margin: 0, flex: 1 }}>{labels?.headerName || "Features"}</h2>
        {featureRights.includes("search") && (
          <>
            {showSearch ? (
              <AutoComplete
                style={{ width: 200, marginRight: 8 }}
                value={searchValue}
                onChange={handleSearch}
                onSelect={value => {
                  setSearchValue(value);
                  const filtered = features.filter(
                    feature => feature.display_name === value || feature.name === value
                  );
                  setFilteredFeatures(filtered);
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
        {featureRights.includes("download") && (
          <Tooltip title="Export">
            <Button
              icon={<DownloadOutlined />}
              style={{ marginRight: 8 }}
              onClick={handleDownloadExcel}
            />
          </Tooltip>
        )}
        {featureRights.includes("add") && (
          <Tooltip title={labels?.addFeatureButton || "Add Feature"}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setModalOptions([]);
                setModalOpen(true);
              }}
            />
          </Tooltip>
        )}
      </div>

      <Table
        dataSource={filteredFeatures}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Features`
        }}
      />

      {/* Add Modal */}
      {featureRights.includes("add") && (
        <Modal
          open={modalOpen}
          title={labels?.add_feature?.headerName || "Add Feature"}
          onCancel={() => {
            setModalOpen(false);
            form.resetFields();
          }}
          onOk={handleAddFeature}
          okText={labels?.add_feature?.submitbutton || "Add"}
          cancelText={labels?.add_feature?.cancelbutton || "Cancel"}
          okButtonProps={{ loading }}
          width={600}
        >
          <Form form={form} layout="vertical" initialValues={{ is_active: true }}>
            <Form.Item
              label={labels?.add_feature?.name || "Name"}
              name="name"
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.add_feature?.name || "Name"} is required` }]}
            >
              <AutoComplete
                onChange={handleAddModalSearch}
                onSelect={value => form.setFieldsValue({ name: value })}
                options={modalOptions}
                placeholder={labels?.add_feature?.namePlaceholder || `Enter ${labels?.add_feature?.name || "Name"}`}
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              label={labels?.add_feature?.display_name || "Display Name"}
              name="display_name"
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.add_feature?.display_name || "Display Name"} is required` }]}
            >
              <Input placeholder={labels?.add_feature?.displayNamePlaceholder || `Enter ${labels?.add_feature?.display_name || "Display Name"}`} />
            </Form.Item>
            <Form.Item
              label={labels?.add_feature?.description || "Description"}
              name="description"
            >
              <Input.TextArea placeholder={labels?.add_feature?.descriptionPlaceholder || `Enter ${labels?.add_feature?.description || "Description"}`} />
            </Form.Item>
            <Form.Item name="is_active" valuePropName="checked">
              <Checkbox>{labels?.add_feature?.is_active || "Active"}</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Edit Modal */}
      {featureRights.includes("edit") && (
        <Modal
          open={editModalOpen}
          title={labels?.edit_feature?.headerName || "Edit Feature"}
          onCancel={() => {
            setEditModalOpen(false);
            form.resetFields();
          }}
          onOk={handleSaveEdit}
          okText={labels?.edit_feature?.submitbutton || "Save"}
          cancelText={labels?.edit_feature?.cancelbutton || "Cancel"}
          okButtonProps={{ loading }}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label={labels?.edit_feature?.name || "Name"}
              name="name"
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.edit_feature?.name || "Name"} is required` }]}
            >
              <Input placeholder={labels?.edit_feature?.namePlaceholder || `Enter ${labels?.edit_feature?.name || "Name"}`} />
            </Form.Item>
            <Form.Item
              label={labels?.edit_feature?.display_name || "Display Name"}
              name="display_name"
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.edit_feature?.display_name || "Display Name"} is required` }]}
            >
              <Input placeholder={labels?.edit_feature?.displayNamePlaceholder || `Enter ${labels?.edit_feature?.display_name || "Display Name"}`} />
            </Form.Item>
            <Form.Item
              label={labels?.edit_feature?.description || "Description"}
              name="description"
            >
              <Input.TextArea placeholder={labels?.edit_feature?.descriptionPlaceholder || `Enter ${labels?.edit_feature?.description || "Description"}`} />
            </Form.Item>
            <Form.Item name="is_active" valuePropName="checked">
              <Checkbox>{labels?.edit_feature?.is_active || "Active"}</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* View Modal */}
      {featureRights.includes("View") && (
        <Modal
          open={viewModalOpen}
          title={labels?.view_feature?.headerName || "View Feature"}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
          width={600}
        >
          {selectedFeature && (
            <Form layout="vertical">
              <Form.Item label={labels?.view_feature?.id || "ID"}>
                <Input value={selectedFeature.id} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_feature?.name || "Name"}>
                <Input value={selectedFeature.name} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_feature?.display_name || "Display Name"}>
                <Input value={selectedFeature.display_name} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_feature?.description || "Description"}>
                <Input.TextArea value={selectedFeature.description} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_feature?.is_active || "Active Status"}>
                <Checkbox checked={selectedFeature.is_active} disabled>
                  {selectedFeature.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")}
                </Checkbox>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Features;