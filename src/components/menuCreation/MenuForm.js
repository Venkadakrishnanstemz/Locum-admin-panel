import React, { useEffect, useState } from "react";
import {
  Card, AutoComplete, Button, Table, message, Select, Form, Row, Col, Modal, Tooltip, Space, Switch, Checkbox, InputNumber,Input
} from "antd";
import {
  PlusOutlined, DownloadOutlined, SearchOutlined, EyeOutlined, EditOutlined
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  fetchMenus, createMenu, fetchSubMenus, createSubMenu, fetchMenuById, fetchSubMenuById, updateMenu, updateSubMenu, fetchScreenLabelById
} from "../../services/locationService";

const { Option } = Select;

const MenuForm = () => {
  const [menus, setMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [filteredSubMenus, setFilteredSubMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuSearch, setMenuSearch] = useState("");
  const [subMenuSearch, setSubMenuSearch] = useState("");
  const [isMenuSearchOpen, setIsMenuSearchOpen] = useState(false);
  const [isSubMenuSearchOpen, setIsSubMenuSearchOpen] = useState(false);
  const [menuSearchOptions, setMenuSearchOptions] = useState([]);
  const [subMenuSearchOptions, setSubMenuSearchOptions] = useState([]);
  const [menuForm] = Form.useForm();
  const [subMenuForm] = Form.useForm();
  const [editMenuForm] = Form.useForm();
  const [editSubMenuForm] = Form.useForm();
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [isSubMenuModalVisible, setIsSubMenuModalVisible] = useState(false);
  const [isMenuEditModalVisible, setIsMenuEditModalVisible] = useState(false);
  const [isSubMenuEditModalVisible, setIsSubMenuEditModalVisible] = useState(false);
  const [isMenuViewModalVisible, setIsMenuViewModalVisible] = useState(false);
  const [isSubMenuViewModalVisible, setIsSubMenuViewModalVisible] = useState(false);
  const [viewMenuData, setViewMenuData] = useState(null);
  const [viewSubMenuData, setViewSubMenuData] = useState(null);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editingSubMenuId, setEditingSubMenuId] = useState(null);
  const [labels, setLabels] = useState({});
  const [menuRights, setMenuRights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load labels from API
  const loadLabels = async () => {
    try {
      const data = await fetchScreenLabelById(6);
      setLabels(data.labelconfig || {});
    } catch (err) {
      console.error("Failed to load labels:", err);
    }
  };

  // Load user rights for Menus submenu
  useEffect(() => {
    loadLabels();
    loadMenus();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role_menu_mapping) {
        const mastersMenu = user.role_menu_mapping.find(menu => menu.alias_name === "masters");
        if (mastersMenu && mastersMenu.sub_menus) {
          console.log("Masters Menu:", mastersMenu);
          const menusSubmenu = mastersMenu.sub_menus.find(submenu => submenu.alias_name === "menuCreation");
          if (menusSubmenu && menusSubmenu.rights) {
            const rights = menusSubmenu.rights.map(right => right.right_name);
            setMenuRights(rights);
          } else {
            console.warn("No rights or menus submenu found");
            setMenuRights([]);
          }
        } else {
          console.warn("No masters menu or sub_menus found");
          setMenuRights([]);
        }
      } else {
        console.warn("No user or role_menu_mapping found in localStorage");
        setMenuRights([]);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setMenuRights([]);
    }
  }, []);

  const loadMenus = async () => {
    setLoading(true);
    try {
      const res = await fetchMenus();
      const data = Array.isArray(res) ? res : res?.data || [];
      const normalizedData = data.map(item => ({
        ...item,
        is_active: item.is_active === true || item.status === "Active"
      }));
      setMenus(normalizedData);
      setFilteredMenus(normalizedData);
      setMenuSearchOptions(normalizedData.map(menu => ({ value: menu.menu_name })));
    } catch {
      message.error(labels?.fetchFail || "Failed to load menus");
      setMenus([]);
      setFilteredMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSubMenus = async (menuId) => {
    setLoading(true);
    try {
      const res = await fetchSubMenus(menuId);
      const data = Array.isArray(res) ? res : res?.data || [];
      const normalizedData = data.map(item => ({
        ...item,
        is_active: item.is_active === true || item.status === "Active"
      }));
      setSubMenus(normalizedData);
      setFilteredSubMenus(normalizedData);
      setSubMenuSearchOptions(normalizedData.map(subMenu => ({ value: subMenu.sub_menu_name })));
    } catch {
      message.error(labels?.fetchFail || "Failed to load submenus");
      setSubMenus([]);
      setFilteredSubMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMenuId) loadSubMenus(selectedMenuId);
    else {
      setSubMenus([]);
      setFilteredSubMenus([]);
      setSubMenuSearchOptions([]);
    }
  }, [selectedMenuId]);

  // Validate sequence number for menus
  const validateMenuSequence = async (sequence, currentMenuId = null) => {
    const activeMenus = menus.filter(menu => menu.is_active && menu.id !== currentMenuId);
    return !activeMenus.some(menu => menu.sequence === sequence);
  };

  // Validate sequence number for submenus
  const validateSubMenuSequence = async (sequence, currentSubMenuId = null) => {
    const activeSubMenus = subMenus.filter(subMenu => subMenu.is_active && subMenu.id !== currentSubMenuId);
    return !activeSubMenus.some(subMenu => subMenu.sequence === sequence);
  };

  const handleMenuSearch = (value) => {
    setMenuSearch(value);
    const filtered = menus.filter(
      m =>
        m.menu_name.toLowerCase().includes(value.toLowerCase()) ||
        (m.alias_name || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMenus(filtered);
    setMenuSearchOptions(
      filtered.map(menu => ({ value: menu.menu_name }))
    );
    if (!value) {
      setFilteredMenus(menus);
      setMenuSearchOptions(menus.map(menu => ({ value: menu.menu_name })));
    }
  };

  const handleSubMenuSearch = (value) => {
    setSubMenuSearch(value);
    const filtered = subMenus.filter(
      s =>
        s.sub_menu_name.toLowerCase().includes(value.toLowerCase()) ||
        (s.alias_name || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubMenus(filtered);
    setSubMenuSearchOptions(
      filtered.map(subMenu => ({ value: subMenu.sub_menu_name }))
    );
    if (!value) {
      setFilteredSubMenus(subMenus);
      setSubMenuSearchOptions(subMenus.map(subMenu => ({ value: subMenu.sub_menu_name })));
    }
  };

  const handleMenuSubmit = async (values) => {
    const sequence = values.sequence !== undefined ? parseInt(values.sequence, 10) : null;
    if (values.is_active && sequence !== null && !(await validateMenuSequence(sequence))) {
      message.error(labels?.sequenceDuplicate || "Sequence number already exists for an active menu");
      return;
    }
    if (menus.some(m => m.menu_name.toLowerCase() === values.menu_name.trim().toLowerCase())) {
      message.warning(labels?.duplicateMessage || `${labels?.add_menu?.name || "Menu Name"} already exists`);
      return;
    }

    const payload = {
      menu_name: values.menu_name.trim(),
      alias_name: values.alias_name?.trim() || "",
      sequence,
      is_active: values.is_active
    };
    try {
      setLoading(true);
      await createMenu(payload);
      message.success(labels?.addSuccess || "Menu created!");
      menuForm.resetFields();
      setIsMenuModalVisible(false);
      loadMenus();
    } catch {
      message.error(labels?.addFail || "Failed to create menu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubMenuSubmit = async (values) => {
    if (!selectedMenuId) return message.warning(labels?.selectMenu || "Select menu first");
    const sequence = values.sequence !== undefined ? parseInt(values.sequence, 10) : null;
    if (values.is_active && sequence !== null && !(await validateSubMenuSequence(sequence))) {
      message.error(labels?.sequenceDuplicate || "Sequence number already exists for an active submenu");
      return;
    }
    if (subMenus.some(s => s.sub_menu_name.toLowerCase() === values.sub_menu_name.trim().toLowerCase())) {
      message.warning(labels?.duplicateMessage || `${labels?.add_submenu?.name || "SubMenu Name"} already exists`);
      return;
    }

    const payload = {
      sub_menu_name: values.sub_menu_name.trim(),
      alias_name: values.alias_name?.trim() || "",
      menu: selectedMenuId,
      sequence,
      is_active: values.is_active
    };
    try {
      setLoading(true);
      await createSubMenu(payload);
      message.success(labels?.addSuccess || "SubMenu created!");
      subMenuForm.resetFields();
      setIsSubMenuModalVisible(false);
      loadSubMenus(selectedMenuId);
    } catch {
      message.error(labels?.addFail || "Failed to create submenu");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuStatusToggle = async (menuId, checked) => {
    try {
      setLoading(true);
      const payload = { id: menuId, is_active: checked };
      await updateMenu(payload);
      message.success(labels?.updateSuccess || "Menu status updated!");
      setMenus(prev => prev.map(menu => (menu.id === menuId ? { ...menu, is_active: checked } : menu)));
      setFilteredMenus(prev => prev.map(menu => (menu.id === menuId ? { ...menu, is_active: checked } : menu)));
    } catch {
      message.error(labels?.updateFail || "Failed to update menu status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubMenuStatusToggle = async (subMenuId, checked) => {
    try {
      setLoading(true);
      const payload = { id: subMenuId, menu: selectedMenuId, is_active: checked };
      await updateSubMenu(subMenuId, payload);
      message.success(labels?.updateSuccess || "SubMenu status updated!");
      setSubMenus(prev => prev.map(subMenu => (subMenu.id === subMenuId ? { ...subMenu, is_active: checked } : subMenu)));
      setFilteredSubMenus(prev => prev.map(subMenu => (subMenu.id === subMenuId ? { ...subMenu, is_active: checked } : subMenu)));
    } catch {
      message.error(labels?.updateFail || "Failed to update submenu status");
    } finally {
      setLoading(false);
    }
  };

  const handleMainMenuEditModel = async (id) => {
    try {
      setLoading(true);
      const res = await fetchMenuById(id);
      const menuData = res.data;
      if (!menuData) {
        message.error(labels?.fetchFail || "No menu data found");
        return;
      }
      setEditingMenuId(id);
      editMenuForm.setFieldsValue({
        menu_name: menuData.menu_name || "",
        alias_name: menuData.alias_name || "",
        sequence: menuData.sequence || null,
        is_active: menuData.is_active
      });
      setIsMenuEditModalVisible(true);
    } catch {
      message.error(labels?.fetchFail || "Failed to fetch menu details");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuEditSubmit = async (values) => {
    const sequence = values.sequence !== undefined ? parseInt(values.sequence, 10) : null;
    if (values.is_active && sequence !== null && !(await validateMenuSequence(sequence, editingMenuId))) {
      message.error(labels?.sequenceDuplicate || "Sequence number already exists for an active menu");
      return;
    }
    if (menus.some(m => m.menu_name.toLowerCase() === values.menu_name.trim().toLowerCase() && m.id !== editingMenuId)) {
      message.warning(labels?.duplicateMessage || `${labels?.edit_menu?.name || "Menu Name"} already exists`);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: editingMenuId,
        menu_name: values.menu_name.trim(),
        alias_name: values.alias_name?.trim() || "",
        sequence,
        is_active: values.is_active
      };
      await updateMenu(payload);
      message.success(labels?.updateSuccess || "Menu updated!");
      setIsMenuEditModalVisible(false);
      editMenuForm.resetFields();
      setEditingMenuId(null);
      loadMenus();
    } catch {
      message.error(labels?.updateFail || "Failed to update menu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubMenuEditModel = async (id) => {
    try {
      setLoading(true);
      const res = await fetchSubMenuById(id);
      const subMenuData = res.data;
      if (!subMenuData) {
        message.error(labels?.fetchFail || "No submenu data found");
        return;
      }
      setEditingSubMenuId(id);
      editSubMenuForm.setFieldsValue({
        sub_menu_name: subMenuData.sub_menu_name || "",
        alias_name: subMenuData.alias_name || "",
        sequence: subMenuData.sequence || null,
        is_active: subMenuData.is_active
      });
      setIsSubMenuEditModalVisible(true);
    } catch {
      message.error(labels?.fetchFail || "Failed to fetch submenu details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubMenuEditSubmit = async (values) => {
    const sequence = values.sequence !== undefined ? parseInt(values.sequence, 10) : null;
    if (values.is_active && sequence !== null && !(await validateSubMenuSequence(sequence, editingSubMenuId))) {
      message.error(labels?.sequenceDuplicate || "Sequence number already exists for an active submenu");
      return;
    }
    if (subMenus.some(s => s.sub_menu_name.toLowerCase() === values.sub_menu_name.trim().toLowerCase() && s.id !== editingSubMenuId)) {
      message.warning(labels?.duplicateMessage || `${labels?.edit_submenu?.name || "SubMenu Name"} already exists`);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: editingSubMenuId,
        menu: selectedMenuId,
        sub_menu_name: values.sub_menu_name.trim(),
        alias_name: values.alias_name?.trim() || "",
        sequence,
        is_active: values.is_active
      };
      await updateSubMenu(editingSubMenuId, payload);
      message.success(labels?.updateSuccess || "SubMenu updated!");
      setIsSubMenuEditModalVisible(false);
      editSubMenuForm.resetFields();
      setEditingSubMenuId(null);
      loadSubMenus(selectedMenuId);
    } catch {
      message.error(labels?.updateFail || "Failed to update submenu");
    } finally {
      setLoading(false);
    }
  };

  const handleMainMenuViewModel = async (id) => {
    try {
      setLoading(true);
      const res = await fetchMenuById(id);
      const menuData = {
        ...res.data,
        is_active: res.data.is_active === true || res.data.status === "Active"
      };
      setViewMenuData(menuData);
      setIsMenuViewModalVisible(true);
    } catch {
      message.error(labels?.fetchFail || "Failed to fetch menu details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubMenuViewModel = async (id) => {
    try {
      setLoading(true);
      const res = await fetchSubMenuById(id);
      const subMenuData = {
        ...res.data,
        is_active: res.data.is_active === true || res.data.status === "Active"
      };
      setViewSubMenuData(subMenuData);
      setIsSubMenuViewModalVisible(true);
    } catch {
      message.error(labels?.fetchFail || "Failed to fetch submenu details");
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = (data, filename) => {
    if (!data.length) return message.warning(labels?.noDataExport || `No ${filename.toLowerCase()} to export`);
    const exportData = data.map(item => ({
      [labels?.id || "ID"]: item.id,
      [labels?.name || "Name"]: item.menu_name || item.sub_menu_name,
      [labels?.alias || "Alias"]: item.alias_name || "",
      [labels?.sequence || "Sequence"]: item.sequence || "None",
      [labels?.is_active || "Status"]: item.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedDateTime = `${day}-${month}-${year}_${hours}-${minutes}_${ampm}`;
    const filenameWithDate = `${filename}_${formattedDateTime}.xlsx`;

    XLSX.writeFile(wb, filenameWithDate);
  };

  const menuColumns = [
    { title: labels?.name || "Name", dataIndex: "menu_name", fixed: "left" },
    { title: labels?.alias || "Alias", dataIndex: "alias_name" },
    { title: labels?.sequence || "Sequence", dataIndex: "sequence", render: sequence => sequence || "None" },
    {
      title: labels?.is_active || "Active",
      dataIndex: "is_active",
      render: (is_active, record) => (
        <Switch
          checked={is_active}
          onChange={checked => handleMenuStatusToggle(record.id, checked)}
          disabled={!menuRights.includes("edit")}
        />
      )
    },
    {
      title: labels?.actions || "Actions",
      render: (_, record) => (
        <Space>
          {menuRights.includes("edit") && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleMainMenuEditModel(record.id)}
              />
            </Tooltip>
          )}
          {menuRights.includes("view") && (
            <Tooltip title="View">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleMainMenuViewModel(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const subMenuColumns = [
    { title: labels?.name || "Name", dataIndex: "sub_menu_name", fixed: "left" },
    { title: labels?.alias || "Alias", dataIndex: "alias_name" },
    { title: labels?.sequence || "Sequence", dataIndex: "sequence", render: sequence => sequence || "None" },
    {
      title: labels?.is_active || "Active",
      dataIndex: "is_active",
      render: (is_active, record) => (
        <Switch
          checked={is_active}
          onChange={checked => handleSubMenuStatusToggle(record.id, checked)}
          disabled={!menuRights.includes("edit")}
        />
      )
    },
    {
      title: labels?.actions || "Actions",
      render: (_, record) => (
        <Space>
          {menuRights.includes("edit") && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleSubMenuEditModel(record.id)}
              />
            </Tooltip>
          )}
          {menuRights.includes("view") && (
            <Tooltip title="View">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleSubMenuViewModel(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2>{labels?.headerName || "Menu Creation"}</h2>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={labels?.menus || "Menus"} extra={
            (menuRights.includes("search") || menuRights.includes("download") || menuRights.includes("add")) ? (
              <Space>
                {menuRights.includes("search") && (
                  <>
                    {isMenuSearchOpen ? (
                      <AutoComplete
                        autoFocus
                        placeholder={labels?.searchPlaceholder || "Search Menu"}
                        value={menuSearch}
                        onChange={handleMenuSearch}
                        onSelect={value => {
                          setMenuSearch(value);
                          const filtered = menus.filter(m => m.menu_name === value || m.alias_name === value);
                          setFilteredMenus(filtered);
                        }}
                        options={menuSearchOptions}
                        allowClear
                        onBlur={() => setIsMenuSearchOpen(false)}
                        style={{ width: 180 }}
                      />
                    ) : (
                      <Tooltip title="Search">
                        <Button
                          icon={<SearchOutlined />}
                          onClick={() => setIsMenuSearchOpen(true)}
                        />
                      </Tooltip>
                    )}
                  </>
                )}
                {menuRights.includes("download") && (
                  <Tooltip title="Export">
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => exportExcel(filteredMenus, "Menus")}
                    />
                  </Tooltip>
                )}
                {menuRights.includes("add") && (
                  <Tooltip title={labels?.add_menu?.button || "Add Menu"}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        menuForm.resetFields();
                        setIsMenuModalVisible(true);
                      }}
                    />
                  </Tooltip>
                )}
              </Space>
            ) : null
          }>
            <Table
              dataSource={filteredMenus}
              columns={menuColumns}
              rowKey="id"
              pagination={{ pageSize: 5, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Menus` }}
              scroll={{ x: 600 }}
              loading={loading}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={labels?.submenus || "SubMenus"} extra={
            (menuRights.includes("view") || menuRights.includes("search") || menuRights.includes("download") || menuRights.includes("add")) ? (
              <Space>
                {menuRights.includes("view") && (
                  <Select
                    placeholder={labels?.selectMenu || "Select Menu"}
                    value={selectedMenuId}
                    onChange={setSelectedMenuId}
                    allowClear
                    style={{ width: 160 }}
                  >
                    {menus.map(menu => (
                      <Option key={menu.id} value={menu.id}>
                        {menu.menu_name}
                      </Option>
                    ))}
                  </Select>
                )}
                {menuRights.includes("search") && (
                  <>
                    {isSubMenuSearchOpen ? (
                      <AutoComplete
                        autoFocus
                        placeholder={labels?.searchPlaceholder || "Search SubMenu"}
                        value={subMenuSearch}
                        onChange={handleSubMenuSearch}
                        onSelect={value => {
                          setSubMenuSearch(value);
                          const filtered = subMenus.filter(s => s.sub_menu_name === value || s.alias_name === value);
                          setFilteredSubMenus(filtered);
                        }}
                        options={subMenuSearchOptions}
                        allowClear
                        onBlur={() => setIsSubMenuSearchOpen(false)}
                        style={{ width: 180 }}
                      />
                    ) : (
                      <Tooltip title="Search">
                        <Button
                          icon={<SearchOutlined />}
                          onClick={() => setIsSubMenuSearchOpen(true)}
                        />
                      </Tooltip>
                    )}
                  </>
                )}
                {menuRights.includes("download") && (
                  <Tooltip title="Export">
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => exportExcel(filteredSubMenus, "SubMenus")}
                    />
                  </Tooltip>
                )}
                {menuRights.includes("add") && (
                  <Tooltip title={labels?.add_submenu?.button || "Add SubMenu"}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        if (!selectedMenuId) return message.warning(labels?.selectMenu || "Please select a menu first");
                        subMenuForm.resetFields();
                        setIsSubMenuModalVisible(true);
                      }}
                    />
                  </Tooltip>
                )}
              </Space>
            ) : null
          }>
            <Table
              dataSource={filteredSubMenus}
              columns={subMenuColumns}
              rowKey="id"
              pagination={{ pageSize: 5, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} SubMenus` }}
              scroll={{ x: 600 }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Add Menu Modal */}
      {menuRights.includes("add") && (
        <Modal
          title={labels?.add_menu?.headerName || "Create Menu"}
          open={isMenuModalVisible}
          onCancel={() => {
            setIsMenuModalVisible(false);
            menuForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={menuForm}
            layout="vertical"
            onFinish={handleMenuSubmit}
            initialValues={{ is_active: true }}
          >
            <Form.Item
              name="menu_name"
              label={labels?.add_menu?.name || "Menu Name"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.add_menu?.name || "Menu Name"} is required` }]}
            >
              <AutoComplete
                onChange={value => menuForm.setFieldsValue({ menu_name: value })}
                options={menus
                  .filter(m => m.menu_name.toLowerCase().includes(menuSearch.toLowerCase()))
                  .map(m => ({ value: m.menu_name }))
                }
                placeholder={labels?.add_menu?.namePlaceholder || `Enter ${labels?.add_menu?.name || "Menu Name"}`}
              />
            </Form.Item>
            <Form.Item
              name="alias_name"
              label={labels?.add_menu?.alias || "Alias Name"}
            >
              <Input placeholder={labels?.add_menu?.aliasPlaceholder || `Enter ${labels?.add_menu?.alias || "Alias Name"}`} />
            </Form.Item>
            <Form.Item
              name="sequence"
              label={labels?.add_menu?.sequence || "Sequence"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.add_menu?.sequence || "Sequence"} is required` }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder={labels?.add_menu?.sequencePlaceholder || `Enter ${labels?.add_menu?.sequence || "Sequence"}`} />
            </Form.Item>
            <Form.Item
              name="is_active"
              valuePropName="checked"
            >
              <Checkbox>{labels?.add_menu?.is_active || "Active"}</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {labels?.add_menu?.submitbutton || "Save Menu"}
            </Button>
          </Form>
        </Modal>
      )}

      {/* Add Submenu Modal */}
      {menuRights.includes("add") && (
        <Modal
          title={labels?.add_submenu?.headerName || "Create SubMenu"}
          open={isSubMenuModalVisible}
          onCancel={() => {
            setIsSubMenuModalVisible(false);
            subMenuForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={subMenuForm}
            layout="vertical"
            onFinish={handleSubMenuSubmit}
            initialValues={{ is_active: true }}
          >
            <Form.Item
              name="sub_menu_name"
              label={labels?.add_submenu?.name || "SubMenu Name"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.add_submenu?.name || "SubMenu Name"} is required` }]}
            >
              <AutoComplete
                onChange={value => subMenuForm.setFieldsValue({ sub_menu_name: value })}
                options={subMenus
                  .filter(s => s.sub_menu_name.toLowerCase().includes(subMenuSearch.toLowerCase()))
                  .map(s => ({ value: s.sub_menu_name }))
                }
                placeholder={labels?.add_submenu?.namePlaceholder || `Enter ${labels?.add_submenu?.name || "SubMenu Name"}`}
              />
            </Form.Item>
            <Form.Item
              name="alias_name"
              label={labels?.add_submenu?.alias || "Alias Name"}
            >
              <Input placeholder={labels?.add_submenu?.aliasPlaceholder || `Enter ${labels?.add_submenu?.alias || "Alias Name"}`} />
            </Form.Item>
            <Form.Item
              name="sequence"
              label={labels?.add_submenu?.sequence || "Sequence"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.add_submenu?.sequence || "Sequence"} is required` }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder={labels?.add_submenu?.sequencePlaceholder || `Enter ${labels?.add_submenu?.sequence || "Sequence"}`} />
            </Form.Item>
            <Form.Item
              name="is_active"
              valuePropName="checked"
            >
              <Checkbox>{labels?.add_submenu?.is_active || "Active"}</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {labels?.add_submenu?.submitbutton || "Save SubMenu"}
            </Button>
          </Form>
        </Modal>
      )}

      {/* View Menu Modal */}
      {menuRights.includes("view") && (
        <Modal
          title={labels?.view_menu?.headerName || "Menu Details"}
          open={isMenuViewModalVisible}
          onCancel={() => setIsMenuViewModalVisible(false)}
          footer={null}
        >
          {viewMenuData ? (
            <Form layout="vertical">
              <Form.Item label={labels?.view_menu?.id || "ID"}>
                <Input value={viewMenuData.id} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_menu?.name || "Menu Name"}>
                <Input value={viewMenuData.menu_name || ""} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_menu?.alias || "Alias Name"}>
                <Input value={viewMenuData.alias_name || ""} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_menu?.sequence || "Sequence"}>
                <Input value={viewMenuData.sequence || "None"} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_menu?.is_active || "Active Status"}>
                <Checkbox checked={viewMenuData.is_active} disabled>
                  {viewMenuData.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")}
                </Checkbox>
              </Form.Item>
            </Form>
          ) : (
            "Loading..."
          )}
        </Modal>
      )}

      {/* Edit Menu Modal */}
      {menuRights.includes("edit") && (
        <Modal
          title={labels?.edit_menu?.headerName || "Edit Menu"}
          open={isMenuEditModalVisible}
          onCancel={() => {
            setIsMenuEditModalVisible(false);
            editMenuForm.resetFields();
            setEditingMenuId(null);
          }}
          footer={null}
        >
          <Form
            form={editMenuForm}
            layout="vertical"
            onFinish={handleMenuEditSubmit}
          >
            <Form.Item
              name="menu_name"
              label={labels?.edit_menu?.name || "Menu Name"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.edit_menu?.name || "Menu Name"} is required` }]}
            >
              <Input placeholder={labels?.edit_menu?.namePlaceholder || `Enter ${labels?.edit_menu?.name || "Menu Name"}`} />
            </Form.Item>
            <Form.Item
              name="alias_name"
              label={labels?.edit_menu?.alias || "Alias Name"}
            >
              <Input placeholder={labels?.edit_menu?.aliasPlaceholder || `Enter ${labels?.edit_menu?.alias || "Alias Name"}`} />
            </Form.Item>
            <Form.Item
              name="sequence"
              label={labels?.edit_menu?.sequence || "Sequence"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.edit_menu?.sequence || "Sequence"} is required` }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder={labels?.edit_menu?.sequencePlaceholder || `Enter ${labels?.edit_menu?.sequence || "Sequence"}`} />
            </Form.Item>
            <Form.Item
              name="is_active"
              valuePropName="checked"
            >
              <Checkbox>{labels?.edit_menu?.is_active || "Active"}</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {labels?.edit_menu?.submitbutton || "Update Menu"}
            </Button>
          </Form>
        </Modal>
      )}

      {/* View Submenu Modal */}
      {menuRights.includes("view") && (
        <Modal
          title={labels?.view_submenu?.headerName || "SubMenu Details"}
          open={isSubMenuViewModalVisible}
          onCancel={() => setIsSubMenuViewModalVisible(false)}
          footer={null}
        >
          {viewSubMenuData ? (
            <Form layout="vertical">
              <Form.Item label={labels?.view_submenu?.id || "ID"}>
                <Input value={viewSubMenuData.id} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_submenu?.name || "SubMenu Name"}>
                <Input value={viewSubMenuData.sub_menu_name || ""} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_submenu?.alias || "Alias Name"}>
                <Input value={viewSubMenuData.alias_name || ""} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_submenu?.sequence || "Sequence"}>
                <Input value={viewSubMenuData.sequence || "None"} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_submenu?.is_active || "Active Status"}>
                <Checkbox checked={viewSubMenuData.is_active} disabled>
                  {viewSubMenuData.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")}
                </Checkbox>
              </Form.Item>
            </Form>
          ) : (
            "Loading..."
          )}
        </Modal>
      )}

      {/* Edit SubMenu Modal */}
      {menuRights.includes("edit") && (
        <Modal
          title={labels?.edit_submenu?.headerName || "Edit SubMenu"}
          open={isSubMenuEditModalVisible}
          onCancel={() => {
            setIsSubMenuEditModalVisible(false);
            editSubMenuForm.resetFields();
            setEditingSubMenuId(null);
          }}
          footer={null}
        >
          <Form
            form={editSubMenuForm}
            layout="vertical"
            onFinish={handleSubMenuEditSubmit}
          >
            <Form.Item
              name="sub_menu_name"
              label={labels?.edit_submenu?.name || "SubMenu Name"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.edit_submenu?.name || "SubMenu Name"} is required` }]}
            >
              <Input placeholder={labels?.edit_submenu?.namePlaceholder || `Enter ${labels?.edit_submenu?.name || "SubMenu Name"}`} />
            </Form.Item>
            <Form.Item
              name="alias_name"
              label={labels?.edit_submenu?.alias || "Alias Name"}
            >
              <Input placeholder={labels?.edit_submenu?.aliasPlaceholder || `Enter ${labels?.edit_submenu?.alias || "Alias Name"}`} />
            </Form.Item>
            <Form.Item
              name="sequence"
              label={labels?.edit_submenu?.sequence || "Sequence"}
              rules={[{ required: true, message: labels?.requiredMessage || `${labels?.edit_submenu?.sequence || "Sequence"} is required` }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder={labels?.edit_submenu?.sequencePlaceholder || `Enter ${labels?.edit_submenu?.sequence || "Sequence"}`} />
            </Form.Item>
            <Form.Item
              name="is_active"
              valuePropName="checked"
            >
              <Checkbox>{labels?.edit_submenu?.is_active || "Active"}</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {labels?.edit_submenu?.submitbutton || "Update SubMenu"}
            </Button>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default MenuForm;
