import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Card, Checkbox, Table } from "antd";
import {
  fetchRights,
  fetchMenus,
  fetchSubMenus,
} from "../../services/locationService";
 
const Menu = ({ onNext, onBack, data }) => {
  const [menuRightsData, setMenuRightsData] = useState({
    rights: [],
    menus: [],
    subMenusMap: {},
    selectedMenus: [],
    selectedMenuRights: {},
  });
  const [error, setError] = useState("");
 
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rightsRes, menusRes] = await Promise.all([
          fetchRights(),
          fetchMenus(),
        ]);
        const rights = rightsRes?.data || [];
        const menus = menusRes?.data || [];
 
        const subMenusMap = {};
        await Promise.all(
          menus.map(async (menu) => {
            const res = await fetchSubMenus(menu.id);
            subMenusMap[menu.id] = res?.data || [];
          })
        );
 
        setMenuRightsData({
          rights,
          menus,
          subMenusMap,
          selectedMenus: [],
          selectedMenuRights: {},
        });
      } catch (err) {
        console.error("Failed to load menu data:", err);
        setError("Failed to load menu data.");
      }
    };
 
    loadData();
  }, []);
 
  const toggleMenuSelect = (key, record) => {
    const isMenu = record.type === "menu";
    const isChecked = menuRightsData.selectedMenus.includes(key);
 
    let updatedMenus = [...menuRightsData.selectedMenus];
    let updatedRights = { ...menuRightsData.selectedMenuRights };
 
    if (isMenu) {
      const subKeys = (menuRightsData.subMenusMap[record.id] || []).map(
        (sub) => `submenu-${sub.id}`
      );
      updatedMenus = isChecked
        ? updatedMenus.filter((k) => k !== key && !subKeys.includes(k))
        : [...updatedMenus, key, ...subKeys];
      if (isChecked) {
        subKeys.forEach((k) => delete updatedRights[k]);
      }
    } else {
      updatedMenus = isChecked
        ? updatedMenus.filter((k) => k !== key)
        : [...updatedMenus, key];
      if (isChecked) delete updatedRights[key];
    }
 
    setMenuRightsData((prev) => ({
      ...prev,
      selectedMenus: updatedMenus,
      selectedMenuRights: updatedRights,
    }));
  };
 
  const toggleMenuRight = (itemKey, rightId) => {
    const current = menuRightsData.selectedMenuRights[itemKey] || [];
    const updated = current.includes(rightId)
      ? current.filter((id) => id !== rightId)
      : [...current, rightId];
 
    setMenuRightsData((prev) => ({
      ...prev,
      selectedMenuRights: {
        ...prev.selectedMenuRights,
        [itemKey]: updated,
      },
    }));
  };
 
  const getMenuTableData = () => {
    const data = [];
    menuRightsData.menus.forEach((menu) => {
      const menuKey = `menu-${menu.id}`;
      data.push({ key: menuKey, name: menu.menu_name, type: "menu", id: menu.id });
      if (menuRightsData.selectedMenus.includes(menuKey)) {
        (menuRightsData.subMenusMap[menu.id] || []).forEach((sub) => {
          const subKey = `submenu-${sub.id}`;
          data.push({ key: subKey, name: sub.sub_menu_name, type: "submenu", id: sub.id });
        });
      }
    });
    return data;
  };
 
  const getMenuColumns = () => {
    return [
      {
        title: "Menu / Submenu",
        dataIndex: "name",
        render: (_, record) => (
          <Checkbox
            checked={menuRightsData.selectedMenus.includes(record.key)}
            onChange={() => toggleMenuSelect(record.key, record)}
            style={{ marginLeft: record.type === "submenu" ? 20 : 0 }}
          >
            {record.name}
          </Checkbox>
        ),
      },
      ...(menuRightsData.rights || []).map((r) => ({
        title: r.display_name,
        key: r.id,
        render: (_, record) =>
          record.type === "submenu" ? (
            <Checkbox
              checked={menuRightsData.selectedMenuRights[record.key]?.includes(r.id)}
              onChange={() => toggleMenuRight(record.key, r.id)}
            />
          ) : null,
      })),
    ];
  };
 
  // Transform menu data to required payload structure
  const transformMenusToPayload = () => {
    const menus = [];
 
    // Get selected menu IDs
    const selectedMenuIds = menuRightsData.selectedMenus
      .filter(key => key.startsWith('menu-'))
      .map(key => parseInt(key.replace('menu-', '')));
 
    selectedMenuIds.forEach(menuId => {
      const menuObj = {
        menu_id: menuId,
        submenus: []
      };
 
      // Get submenus for this menu
      const subMenus = menuRightsData.subMenusMap[menuId] || [];
     
      subMenus.forEach(subMenu => {
        const subMenuKey = `submenu-${subMenu.id}`;
       
        // Only include submenus that are selected
        if (menuRightsData.selectedMenus.includes(subMenuKey)) {
          const subMenuRights = menuRightsData.selectedMenuRights[subMenuKey] || [];
         
          menuObj.submenus.push({
            submenu_id: subMenu.id,
            rights: subMenuRights
          });
        }
      });
 
      menus.push(menuObj);
    });
 
    return menus;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (menuRightsData.selectedMenus.length === 0) {
      setError("Please select at least one menu.");
      return;
    }
 
    // Transform menu data to required structure
    const menusPayload = transformMenusToPayload();
   
    // Create final payload combining features from previous step and current menus
    const finalPayload = {
      features: data.features || [], // Features from previous step
      menus: menusPayload,
 
    };
 
    setError("");
    onNext(finalPayload);
  };
 
  return (
    <div>
      <div className="">
        <h4 className="">Menu Mapping</h4>
      </div>
      <Form onSubmit={handleSubmit} className="border p-3 rounded shadow-sm">
        <Row className="mb-4">
          <Col>
            <div style={{ height: 300, overflow: "auto" }}>
              <Table
                dataSource={getMenuTableData()}
                columns={getMenuColumns()}
                pagination={false}
                size="small"
                rowKey="key"
                scroll={{ x: "max-content" }}
              />
            </div>
          </Col>
        </Row>
 
        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary">
            Save & Continue
          </Button>
        </div>
 
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </div>
  );
};
 
export default Menu;
 
 