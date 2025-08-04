import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { iconMapping } from './iconMapping';
import { getLocalStorageItem } from '../services/localStorageUtils';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  const user = getLocalStorageItem("user");

  useEffect(() => {
    if (!user?.role_menu_mapping) return;

    const processedMenu = user.role_menu_mapping
      .sort((a, b) => a.sequence - b.sequence)
      .map(menu => ({
        key: menu.link_menu || `/${menu.alias_name}`,
        label: menu.menu_name,
        icon: iconMapping[menu.icon] || null,
        children: (menu.sub_menus || [])
          .sort((a, b) => a.sequence - b.sequence)
          .map(sub => ({
            key: sub.link_menu || `/${sub.alias_name}`,
            label: sub.sub_menu_name,
            icon: iconMapping[sub.icon] || null,
          })),
      }));

    setMenuItems(processedMenu)
    // if (processedMenu.length > 0) {
    //   setOpenKeys([processedMenu[0].key]);
    // }
  }, [JSON.stringify(user)]);

  const handleClick = (e) => {
    navigate(e.key);
  };
  const handleopenChange = (keys) => {
    // Handle open change if needed     
    const latestopenkey=keys.find(keys => !openKeys.includes(keys));
    setOpenKeys(latestopenkey ? [latestopenkey] : []);
  };

  const handleOpenChange = (keys) => {
    // Allow only one submenu open at a time
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        flex: '1 1 auto',
        overflow: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)'
      }}>
        <Menu
          onClick={handleClick}
          mode="inline"
          items={menuItems}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          selectedKeys={[location.pathname]}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 0,
            backgroundColor: '#fff'
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
