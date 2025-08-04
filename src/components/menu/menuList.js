import React, { useEffect, useState } from "react";
import {
  Card,
  Select,
  Table,
  Row,
  Col,
  message,
  AutoComplete,
  Button,
  Tooltip,
  Switch
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { fetchMenus, fetchSubMenus, fetchScreenLabelById } from "../../services/locationService";
import * as XLSX from "xlsx";

const { Option } = Select;

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [filteredSubMenus, setFilteredSubMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuSearch, setMenuSearch] = useState("");
  const [subMenuSearch, setSubMenuSearch] = useState("");
  const [isMenuSearchOpen, setIsMenuSearchOpen] = useState(false);
  const [isSubMenuSearchOpen, setIsSubMenuSearchOpen] = useState(false);
  const [menuSearchOptions, setMenuSearchOptions] = useState([]);
  const [subMenuSearchOptions, setSubMenuSearchOptions] = useState([]);
  const [labels, setLabels] = useState({});
  const [menuRights, setMenuRights] = useState([]);

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
          console.log("mastersMenu", mastersMenu);
          const menusSubmenu = mastersMenu.sub_menus.find(submenu => submenu.alias_name === "menu");
          if (menusSubmenu && menusSubmenu.rights) {
            const rights = menusSubmenu.rights.map(right => right.right_name);
            console.log("rights", rights);
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
    try {
      const data = await fetchMenus();
      const formatted = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setMenus(formatted);
      setFilteredMenus(formatted);
      setMenuSearchOptions(formatted.map(menu => ({ value: menu.menu_name })));
    } catch {
      message.error(labels?.fetchFail || "Failed to load menus");
      setMenus([]);
      setFilteredMenus([]);
    }
  };

  const loadSubMenus = async (menuId) => {
    try {
      const data = await fetchSubMenus(menuId);
      const formatted = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setSubMenus(formatted);
      setFilteredSubMenus(formatted);
      setSubMenuSearchOptions(formatted.map(subMenu => ({ value: subMenu.sub_menu_name })));
    } catch {
      message.error(labels?.fetchFail || "Failed to load submenus");
      setSubMenus([]);
      setFilteredSubMenus([]);
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

  const handleToggleMenuActive = (id) => {
    setMenus(prev =>
      prev.map(m => (m.id === id ? { ...m, is_active: !m.is_active } : m))
    );
    setFilteredMenus(prev =>
      prev.map(m => (m.id === id ? { ...m, is_active: !m.is_active } : m))
    );
  };

  const handleToggleSubMenuActive = (id) => {
    setSubMenus(prev =>
      prev.map(s => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
    setFilteredSubMenus(prev =>
      prev.map(s => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  const downloadExcel = (items, filenamePrefix) => {
    if (!items.length) return message.warning(labels?.noDataExport || `No ${filenamePrefix.toLowerCase()} to export`);
    const data = items.map(item => ({
      [labels?.name || "Name"]: item.menu_name || item.sub_menu_name,
      [labels?.alias || "Alias"]: item.alias_name || "",
      [labels?.sequence || "Sequence"]: item.sequence,
      [labels?.is_active || "Status"]: item.is_active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filenamePrefix);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedDateTime = `${day}-${month}-${year}_${hours}-${minutes}_${ampm}`;
    const filename = `${filenamePrefix}_${formattedDateTime}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  const menuColumns = [
    {
      title: labels?.name || "Name",
      dataIndex: "menu_name",
      key: "menu_name",
      width: 200,
      fixed: "left"
    },
    {
      title: labels?.alias || "Alias",
      dataIndex: "alias_name",
      key: "alias_name",
      width: 150
    },
    {
      title: labels?.sequence || "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      width: 100
    },
    {
      title: labels?.is_active || "Status",
      key: "is_active",
      width: 120,
      render: (_, record) => (
        <Switch
          checked={record.is_active}
          disabled
          onChange={() => handleToggleMenuActive(record.id)}
        />
      )
    }
  ];

  const subMenuColumns = [
    {
      title: labels?.name || "Name",
      dataIndex: "sub_menu_name",
      key: "sub_menu_name",
      width: 200,
      fixed: "left"
    },
    {
      title: labels?.alias || "Alias",
      dataIndex: "alias_name",
      key: "alias_name",
      width: 150
    },
    {
      title: labels?.sequence || "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      width: 100
    },
    {
      title: labels?.is_active || "Status",
      key: "is_active",
      width: 120,
      render: (_, record) => (
        <Switch
          checked={record.is_active}
          disabled
          onChange={() => handleToggleSubMenuActive(record.id)}
        />
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{labels?.headerName || "Menu List"}</h2>
      </div>

      <Row gutter={24}>
        {/* Menus */}
        <Col span={12}>
          <Card
            title={labels?.menus || "Menus"}
            extra={
              menuRights.includes("search") || menuRights.includes("download") ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {menuRights.includes("search") && (
                    <>
                      {isMenuSearchOpen ? (
                        <AutoComplete
                          autoFocus
                          placeholder={labels?.searchPlaceholder || "Search menus..."}
                          value={menuSearch}
                          onChange={handleMenuSearch}
                          onSelect={value => {
                            setMenuSearch(value);
                            const filtered = menus.filter(
                              m => m.menu_name === value || m.alias_name === value
                            );
                            setFilteredMenus(filtered);
                          }}
                          options={menuSearchOptions}
                          allowClear
                          onBlur={() => setIsMenuSearchOpen(false)}
                          style={{ width: 180 }}
                        />
                      ) : (
                        <Tooltip title="Search">
                          <Button icon={<SearchOutlined />} onClick={() => setIsMenuSearchOpen(true)} />
                        </Tooltip>
                      )}
                    </>
                  )}
                  {menuRights.includes("download") && (
                    <Tooltip title="Download Excel">
                      <Button icon={<DownloadOutlined />} onClick={() => downloadExcel(filteredMenus, "Menus")} />
                    </Tooltip>
                  )}
                </div>
              ) : null
            }
          >
            <div style={{ overflowX: "auto" }}>
              <Table
                dataSource={filteredMenus}
                columns={menuColumns}
                rowKey="id"
                pagination={{ pageSize: 10, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Menus` }}
                scroll={{ x: 570, y: 400 }}
              />
            </div>
          </Card>
        </Col>

        {/* SubMenus */}
        <Col span={12}>
          <Card
            title={labels?.submenus || "SubMenus"}
            extra={
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {menuRights.includes("view") && (
                  <Select
                    placeholder={labels?.selectMenu || "Select Menu"}
                    value={selectedMenuId}
                    onChange={setSelectedMenuId}
                    allowClear
                    style={{ width: 160 }}
                  >
                    {menus.map(m => (
                      <Option key={m.id} value={m.id}>{m.menu_name}</Option>
                    ))}
                  </Select>
                )}
                {menuRights.includes("search") && (
                  <>
                    {isSubMenuSearchOpen ? (
                      <AutoComplete
                        autoFocus
                        placeholder={labels?.searchPlaceholder || "Search submenus..."}
                        value={subMenuSearch}
                        onChange={handleSubMenuSearch}
                        onSelect={value => {
                          setSubMenuSearch(value);
                          const filtered = subMenus.filter(
                            s => s.sub_menu_name === value || s.alias_name === value
                          );
                          setFilteredSubMenus(filtered);
                        }}
                        options={subMenuSearchOptions}
                        allowClear
                        onBlur={() => setIsSubMenuSearchOpen(false)}
                        style={{ width: 180 }}
                      />
                    ) : (
                      <Tooltip title="Search">
                        <Button icon={<SearchOutlined />} onClick={() => setIsSubMenuSearchOpen(true)} />
                      </Tooltip>
                    )}
                  </>
                )}
                {menuRights.includes("download") && (
                  <Tooltip title="Download Excel">
                    <Button icon={<DownloadOutlined />} onClick={() => downloadExcel(filteredSubMenus, "SubMenus")} />
                  </Tooltip>
                )}
              </div>
            }
          >
            <div style={{ overflowX: "auto" }}>
              <Table
                dataSource={filteredSubMenus}
                columns={subMenuColumns}
                rowKey="id"
                pagination={{ pageSize: 10, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} SubMenus` }}
                scroll={{ x: 570, y: 400 }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MenuList;