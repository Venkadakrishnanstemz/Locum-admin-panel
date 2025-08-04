// import React, { useState, useEffect } from "react";
// import Select from "react-select";

// // Example data - Replace this with API data if needed
// const menuOptions = [
//   { value: "Doctor", label: "Doctor" },
//   { value: "GRO", label: "GRO" },
//   { value: "Physician", label: "Physician" },
// ];

// const SelectMenu = () => {
//   const [selectedMenus, setSelectedMenus] = useState([]);

//   const handleChange = (selectedOptions) => {
//     setSelectedMenus(selectedOptions);
//     console.log("Selected Menus:", selectedOptions);
//   };

//   return (
//     <div style={{ width: "400px", margin: "50px auto", fontFamily: "Arial" }}>
//       <h2 style={{ color: "#002c5f" }}>Select Menus</h2>
//       <p>Select one or more menus to assign to the user.</p>
//       <label style={{ fontWeight: "bold" }}>Menus:</label>
//       <Select
//         options={menuOptions}
//         isMulti
//         onChange={handleChange}
//         placeholder="Select..."
//         styles={{
//           control: (base, state) => ({
//             ...base,
//             borderColor: state.isFocused ? "#2684ff" : "#dc3545", // red border if not focused
//             boxShadow: state.isFocused ? null : null,
//           }),
//         }}
//       />
//     </div>
//   );
// };
// export default SelectMenu;
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { info } from "../features/user";
import { fetchMenus, fetchSubMenus } from "../services/locationService";
import NavigationButtons from "./NavigationButtons";

const MultiMenuLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [menus, setMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [submenusByMenuId, setSubmenusByMenuId] = useState({});
  const [selectedSubmenus, setSelectedSubmenus] = useState({});

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const res = await fetchMenus();
        setMenus(res.data || []);
      } catch (err) {
        console.error("Failed to fetch menus:", err);
      }
    };

    loadMenus();
  }, []);

  // Load user_step from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("user_step");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.selectedMenus) setSelectedMenus(data.selectedMenus);
      if (data.selectedSubmenus) setSelectedSubmenus(data.selectedSubmenus);

      // Fetch submenus for restored menus
      const fetchAllSubmenus = async () => {
        const updated = {};
        for (const menu of data.selectedMenus || []) {
          try {
            const subRes = await fetchSubMenus(menu.value);
            updated[menu.value] = subRes.data || [];
          } catch (err) {
            console.error("Failed to fetch submenus:", err);
          }
        }
        setSubmenusByMenuId(updated);
      };

      fetchAllSubmenus();
    }
  }, []);

  // Sync Redux user to localStorage when it changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      localStorage.setItem("user_step", JSON.stringify(user));
    }
  }, [user]);

  const handleMenuSelection = async (selectedOptions) => {
    setSelectedMenus(selectedOptions);

    const updated = { ...submenusByMenuId };
    for (const menu of selectedOptions) {
      if (!updated[menu.value]) {
        try {
          const subRes = await fetchSubMenus(menu.value);
          updated[menu.value] = subRes.data || [];
        } catch (err) {
          console.error("Failed to fetch submenus:", err);
        }
      }
    }
    setSubmenusByMenuId(updated);
  };

  const handleSubmenuChange = (menuId, selectedOptions) => {
    setSelectedSubmenus((prev) => ({
      ...prev,
      [menuId]: selectedOptions.map((opt) => opt.value),
    }));
  };

  const handleSubmit = () => {
    const validMenus = selectedMenus.length > 0;
    const validSubmenus = Object.keys(selectedSubmenus).length > 0;

    if (!validMenus || !validSubmenus) {
      alert("Please select at least one menu and its submenus.");
      return;
    }

    const selectedMenuValues = selectedMenus.map((m) => m.value);

    const userStepData = {
      ...user,
      menus: selectedMenuValues,
      selectedMenus,
      selectedSubmenus,
    };

    dispatch(info(userStepData));
    localStorage.setItem("user_step", JSON.stringify(userStepData));
    alert("Menu and submenu selections saved.");
  };

  const menuOptions = menus.map((menu) => ({
    value: menu.id,
    label: menu.menu_name,
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ color: "#002c5f" }}>Step 5: Menu & Submenu Selection</h2>

      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        {/* Menu selection */}
        <div style={{ flex: 1 }}>
          <h3>Select Menus</h3>
          <Select
            options={menuOptions}
            isMulti
            onChange={handleMenuSelection}
            value={selectedMenus}
            placeholder="Choose menus..."
          />
        </div>

        {/* Submenu selection */}
        <div style={{ flex: 2 }}>
          <h3>Select Submenus</h3>
          {selectedMenus.length === 0 ? (
            <p>Please select at least one menu to show submenus.</p>
          ) : (
            selectedMenus.map((menu) => {
              const submenuOptions = (submenusByMenuId[menu.value] || []).map((submenu) => ({
                value: submenu.id,
                label: submenu.sub_menu_name,
              }));

              return (
                <div key={menu.value} style={{ marginBottom: "20px" }}>
                  <label style={{ fontWeight: "bold" }}>{menu.label}</label>
                  <Select
                    options={submenuOptions}
                    isMulti
                    value={
                      (selectedSubmenus[menu.value] || []).map((id) =>
                        submenuOptions.find((opt) => opt.value === id)
                      ) || []
                    }
                    onChange={(selected) => handleSubmenuChange(menu.value, selected || [])}
                    placeholder="Choose submenus..."
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Navigation Button */}
      <NavigationButtons onNext={handleSubmit} />
    </div>
  );
};

export default MultiMenuLayout;
