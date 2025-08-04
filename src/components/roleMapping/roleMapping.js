import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Checkbox, Button, Row, Col, Table, message, Space, Tooltip, Input } from "antd";
import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchRights, fetchMenus, fetchSubMenus, fetchFeatures, createMenuMapping, fetchMenuMappingId } from "../../services/locationService";

const RoleMapping = ({ role, mode = "add", onClose }) => {
  const [rights, setRights] = useState([]);
  const [menus, setMenus] = useState([]);
  const [subMenusMap, setSubMenusMap] = useState({});
  const [features, setFeatures] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedMenuRights, setSelectedMenuRights] = useState({});
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedFeatureRights, setSelectedFeatureRights] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMenuSearchOpen, setIsMenuSearchOpen] = useState(false);
  const [menuSearchText, setMenuSearchText] = useState("");
  const [showFeatureSearch, setShowFeatureSearch] = useState(false);
  const [featureSearchText, setFeatureSearchText] = useState("");
  const isViewMode = mode === "view";
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [rightsRes, menusRes, featuresRes] = await Promise.all([
        fetchRights(),
        fetchMenus(),
        fetchFeatures(),
      ]);
      setRights(rightsRes?.data || []);
      setMenus(menusRes?.data || []);
      setFeatures(featuresRes?.data || []);

      const subs = {};
      await Promise.all(
        menusRes?.data?.map(async (menu) => {
          const res = await fetchSubMenus(menu.id);
          subs[menu.id] = res?.data || [];
        })
      );
      setSubMenusMap(subs);

      if (mode === "edit" || mode === "view") {
        const mappingRes = await fetchMenuMappingId(role?.id);
        const menuMappings = mappingRes?.data?.menu_mappings || [];
        const featureMappings = mappingRes?.data?.feature_mappings || [];

        // Map menu and submenu selections
        const newSelectedMenus = [];
        const newSelectedMenuRights = {};
        const menuIds = [...new Set(menuMappings.map((item) => item.menu.id))];
        menuIds.forEach((menuId) => {
          const menuKey = `menu-${menuId}`;
          newSelectedMenus.push(menuKey);
          const submenus = menuMappings.filter((item) => item.menu.id === menuId);
          submenus.forEach((submenuItem) => {
            const submenuKey = `submenu-${submenuItem.submenu.id}`;
            newSelectedMenus.push(submenuKey);
            if (submenuItem.rights?.length > 0) {
              newSelectedMenuRights[submenuKey] = submenuItem.rights.map((right) => right.id);
            }
          });
        });
        setSelectedMenus(newSelectedMenus);
        setSelectedMenuRights(newSelectedMenuRights);

        // Map feature selections
        const newSelectedFeatures = [];
        const newSelectedFeatureRights = {};
        featureMappings.forEach((featureItem) => {
          const featureKey = `feature-${featureItem.feature.id}`;
          newSelectedFeatures.push(featureKey);
          if (featureItem.rights?.length > 0) {
            newSelectedFeatureRights[featureKey] = featureItem.rights.map((right) => right.id);
          }
        });
        setSelectedFeatures(newSelectedFeatures);
        setSelectedFeatureRights(newSelectedFeatureRights);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSearch = (value) => {
    setMenuSearchText(value);
  };

  const toggleMenuSelect = (key, record) => {
    if (isViewMode) return;
    const isMenu = record.type === "menu";
    const isChecked = selectedMenus.includes(key);
    if (isMenu) {
      const submenuKeys = (subMenusMap[record.id] || []).map((sub) => `submenu-${sub.id}`);
      if (isChecked) {
        setSelectedMenus((prev) => prev.filter((k) => k !== key && !submenuKeys.includes(k)));
        setSelectedMenuRights((prev) => {
          const copy = { ...prev };
          delete copy[key];
          submenuKeys.forEach((k) => delete copy[k]);
          return copy;
        });
      } else {
        setSelectedMenus((prev) => [...prev, key, ...submenuKeys]);
      }
    } else {
      if (isChecked) {
        setSelectedMenus((prev) => prev.filter((k) => k !== key));
        setSelectedMenuRights((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      } else {
        setSelectedMenus((prev) => [...prev, key]);
      }
    }
  };

  const toggleMenuRight = (itemKey, rightId) => {
    if (isViewMode) return;
    setSelectedMenuRights((prev) => {
      const current = prev[itemKey] || [];
      if (current.includes(rightId)) {
        return { ...prev, [itemKey]: current.filter((id) => id !== rightId) };
      } else {
        return { ...prev, [itemKey]: [...current, rightId] };
      }
    });
  };

  const toggleFeatureSelect = (featureKey) => {
    if (isViewMode) return;
    if (selectedFeatures.includes(featureKey)) {
      setSelectedFeatures((prev) => prev.filter((k) => k !== featureKey));
      setSelectedFeatureRights((prev) => {
        const copy = { ...prev };
        delete copy[featureKey];
        return copy;
      });
    } else {
      setSelectedFeatures((prev) => [...prev, featureKey]);
    }
  };

  const toggleFeatureRight = (featureKey, rightId) => {
    if (isViewMode) return;
    setSelectedFeatureRights((prev) => {
      const current = prev[featureKey] || [];
      if (current.includes(rightId)) {
        return { ...prev, [featureKey]: current.filter((id) => id !== rightId) };
      } else {
        return { ...prev, [featureKey]: [...current, rightId] };
      }
    });
  };

  const handleSave = async () => {
    if (isViewMode) return;
    try {
      const menuMappings = [];
      const selectedMenuIds = [
        ...new Set(selectedMenus.filter((key) => key.startsWith("menu-")).map((key) => parseInt(key.split("-")[1]))),
      ];

      for (const menuId of selectedMenuIds) {
        const submenus = (subMenusMap[menuId] || [])
          .filter((sub) => selectedMenus.includes(`submenu-${sub.id}`))
          .map((sub) => ({
            submenu_id: sub.id,
            rights: selectedMenuRights[`submenu-${sub.id}`] || [],
          }));
        if (submenus.length > 0) {
          menuMappings.push({
            menu_id: menuId,
            submenus,
          });
        }
      }

      const featureMappings = selectedFeatures.map((key) => ({
        feature_id: parseInt(key.split("-")[1]),
        rights: selectedFeatureRights[key] || [],
      }));

      const payload = {
        role_id: role?.id,
        menus: menuMappings,
        features: featureMappings,
      };

      setLoading(true);
      const response = await createMenuMapping(payload);

      if (response.success) {
        message.success("Role mapping saved successfully!");
      } else {
        message.error("Failed to save role mapping: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving role mapping:", error);
      message.error("Failed to save role mapping");
    } finally {
      setLoading(false);
    }
  };

  const menuTableData = [];
  menus.forEach((menu) => {
    const menuKey = `menu-${menu.id}`;
    menuTableData.push({ key: menuKey, name: menu.menu_name, type: "menu", id: menu.id });
    if (selectedMenus.includes(menuKey)) {
      (subMenusMap[menu.id] || []).forEach((sub) => {
        const subKey = `submenu-${sub.id}`;
        menuTableData.push({ key: subKey, name: sub.sub_menu_name, type: "submenu", id: sub.id });
      });
    }
  });

  const featureTableData = features.map((f) => ({
    key: `feature-${f.id}`,
    name: f.display_name,
    id: f.id,
  }));

  const menuColumns = [
    {
      title: "Menu / Submenu",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Checkbox
          disabled={isViewMode}
          checked={selectedMenus.includes(record.key)}
          onChange={() => toggleMenuSelect(record.key, record)}
          style={{ marginLeft: record.type === "submenu" ? 20 : 0 }}
        >
          {record.name}
        </Checkbox>
      ),
    },
    ...rights.map((r) => ({
      title: r.display_name,
      dataIndex: r.id,
      key: r.id,
      render: (_, record) =>
        record.type === "submenu" ? (
          <Checkbox
            disabled={isViewMode}
            checked={selectedMenuRights[record.key]?.includes(r.id)}
            onChange={() => toggleMenuRight(record.key, r.id)}
          />
        ) : null,
    })),
  ];

  const featureColumns = [
    {
      title: "Feature",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Checkbox
          disabled={isViewMode}
          checked={selectedFeatures.includes(record.key)}
          onChange={() => toggleFeatureSelect(record.key)}
        >
          {record.name}
        </Checkbox>
      ),
    },
    ...rights.map((r) => ({
      title: r.display_name,
      dataIndex: r.id,
      key: r.id,
      render: (_, record) => (
        <Checkbox
          disabled={isViewMode || !selectedFeatures.includes(record.key)}
          checked={selectedFeatureRights[record.key]?.includes(r.id)}
          onChange={() => toggleFeatureRight(record.key, r.id)}
        />
      ),
    })),
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>
          {mode === "view" ? "View" : mode === "edit" ? "Edit" : "Add"} Role Mapping
        </h3>
        <div>
          <span style={{ marginLeft: 8 }}>Role Name : {role?.name}</span>
        </div>
        <Space>
          {!isViewMode && (
            <Button icon={<SaveOutlined />} size="small" type="primary" onClick={handleSave} />
          )}
        </Space>
      </div>

      <Row gutter={16} style={{ paddingTop: 12 }}>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>Menu & Rights</span>
              </div>
            }
            extra={
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {isMenuSearchOpen ? (
                  <Input
                    autoFocus
                    placeholder="Search menus..."
                    value={menuSearchText}
                    onChange={(e) => handleMenuSearch(e.target.value)}
                    onBlur={() => setIsMenuSearchOpen(false)}
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ width: 180 }}
                  />
                ) : (
                  <Tooltip title="Search">
                    <Button icon={<SearchOutlined />} onClick={() => setIsMenuSearchOpen(true)} />
                  </Tooltip>
                )}
              </div>
            }
          >
            <div style={{ height: 300, overflow: "auto" }}>
              <Table
                dataSource={
                  menuSearchText
                    ? menuTableData.filter((item) =>
                        item.name.toLowerCase().includes(menuSearchText.toLowerCase())
                      )
                    : menuTableData
                }
                columns={menuColumns.map((col, index) => (index === 0 ? { ...col, fixed: "left" } : col))}
                pagination={false}
                size="small"
                rowKey="key"
                loading={loading}
                scroll={{ x: "max-content" }}
              />
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>Feature & Rights</span>
              </div>
            }
            extra={
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {showFeatureSearch ? (
                  <Input
                    autoFocus
                    placeholder="Search features..."
                    value={featureSearchText}
                    onChange={(e) => setFeatureSearchText(e.target.value)}
                    onBlur={() => setShowFeatureSearch(false)}
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ width: 180 }}
                  />
                ) : (
                  <Tooltip title="Search">
                    <Button icon={<SearchOutlined />} onClick={() => setShowFeatureSearch(true)} />
                  </Tooltip>
                )}
              </div>
            }
          >
            <div style={{ height: 300, overflow: "auto" }}>
              <Table
                dataSource={
                  featureSearchText
                    ? featureTableData.filter((item) =>
                        item.name.toLowerCase().includes(featureSearchText.toLowerCase())
                      )
                    : featureTableData
                }
                columns={featureColumns.map((col, index) => (index === 0 ? { ...col, fixed: "left" } : col))}
                pagination={false}
                size="small"
                rowKey="key"
                loading={loading}
                scroll={{ x: "max-content" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RoleMapping;