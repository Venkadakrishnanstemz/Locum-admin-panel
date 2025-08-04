
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import {
//   fetchLocations,
//   fetchRoles,
//   postUserSteps,
//   fetchMenus,
//   fetchSubMenus,
//   fetchFeatures,
// } from "../services/locationService";

// const getNamesFromIds = (ids, list) =>
//   (ids || [])
//     .map((id) =>
//       list.find((item) => item.id === id || item.value === id)?.name ||
//       list.find((item) => item.id === id || item.value === id)?.menu_name ||
//       list.find((item) => item.id === id || item.value === id)?.sub_menu_name ||
//       list.find((item) => item.id === id || item.value === id)?.feature_name ||
//       ""
//     )
//     .filter(Boolean);

// const extractIds = (items) =>
//   (items || []).map((item) => item?.value ?? item?.id ?? item);

// const Finalstep = () => {
//   const [latestData, setLatestData] = useState({});
//   const [latestStepKey, setLatestStepKey] = useState(null);
//   const [locationList, setLocationList] = useState([]);
//   const [roleList, setRoleList] = useState([]);
//   const [menuList, setMenuList] = useState([]);
//   const [submenuList, setSubmenuList] = useState([]);
//   const [featureList, setFeatureList] = useState([]);
//   const [submenusByMenuId, setSubmenusByMenuId] = useState({});

//   const handleChange = (field, value) => {
//     setLatestData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     const payload = {
//       ...latestData,
//       roles: extractIds(latestData.roles),
//       locations: extractIds(latestData.locations),
//       menus: extractIds(latestData.menus),
//       features: extractIds(latestData.features),
//       submenus: Object.fromEntries(
//         Object.entries(latestData.submenus || {}).map(([menuId, subIds]) => [
//           menuId,
//           extractIds(subIds),
//         ])
//       ),
//     };

//     try {
//       const res = await postUserSteps(payload);
//       console.log("Saved:", res);
//       alert("Data saved successfully!");
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert("Failed to save.");
//     }
//   };

//   const handleDelete = () => {
//     if (latestStepKey) {
//       localStorage.removeItem(latestStepKey);
//       alert(`Deleted data from ${latestStepKey}`);
//       setLatestData({});
//     }
//   };

//   useEffect(() => {
//     const allStepsData = {};
//     const stepKeys = Object.keys(localStorage).filter((key) =>
//       key.startsWith("user_step")
//     );

//     stepKeys.forEach((key) => {
//       const stepData = JSON.parse(localStorage.getItem(key));
//       Object.assign(allStepsData, stepData);
//     });

//     setLatestData(allStepsData);
//     setLatestStepKey(stepKeys[stepKeys.length - 1] || null);
//     console.log("UserData loaded:", allStepsData);

//     const fetchAll = async () => {
//       try {
//         const [locations, roles, menus, submenus, features] =
//           await Promise.all([
//             fetchLocations(),
//             fetchRoles(),
//             fetchMenus(),
//             fetchSubMenus(),
//             fetchFeatures(),
//           ]);

//         setLocationList(locations);
//         setRoleList(roles);
//         setMenuList(menus);
//         setSubmenuList(submenus);
//         setFeatureList(features);

//         const groupedSubmenus = {};
//         submenus.forEach((submenu) => {
//           const menuId = submenu.menu_id;
//           if (!groupedSubmenus[menuId]) {
//             groupedSubmenus[menuId] = [];
//           }
//           groupedSubmenus[menuId].push(submenu);
//         });

//         setSubmenusByMenuId(groupedSubmenus);
//       } catch (err) {
//         console.error("Error loading dropdowns:", err);
//       }
//     };

//     fetchAll();
//   }, []);

//   return (
//     <div style={{ padding: "20px", maxWidth: "1400px", margin: "auto" }}>
//       <h2 style={{ marginBottom: "10px" }}>Final Review & Submission</h2>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
//         {/* Basic Inputs */}
//         {[
//           { label: "Name", type: "text", field: "name" },
//           { label: "Email", type: "email", field: "email" },
//           { label: "Phone", type: "text", field: "phone" },
//         ].map(({ label, type, field }) => (
//           <div key={field}>
//             <label><strong>{label}:</strong></label>
//             <input
//               type={type}
//               value={latestData[field] || ""}
//               onChange={(e) => handleChange(field, e.target.value)}
//               style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
//             />
//           </div>
//         ))}

//         {/* Locations */}
//         <div>
//           <label><strong>Locations:</strong></label>
//           <Select
//             isMulti
//             options={locationList.map((loc) => ({ value: loc.id, label: loc.name }))}
//             value={(latestData.locations || []).map((id) => {
//               const loc = locationList.find((l) => l.id === id || l.value === id);
//               return loc ? { value: loc.id, label: loc.name } : null;
//             }).filter(Boolean)}
//             onChange={(selected) => handleChange("locations", selected)}
//             placeholder="Select location(s)"
//           />
//         </div>

//         {/* Roles */}
//         <div>
//           <label><strong>Roles:</strong></label>
//           <Select
//             isMulti
//             options={roleList.map((role) => ({ value: role.id, label: role.name }))}
//             value={(latestData.roles || []).map((id) => {
//               const role = roleList.find((r) => r.id === id || r.value === id);
//               return role ? { value: role.id, label: role.name } : null;
//             }).filter(Boolean)}
//             onChange={(selected) => handleChange("roles", selected)}
//             placeholder="Select role(s)"
//           />
//         </div>

//         {/* Menus */}
//         <div>
//           <label><strong>Menus:</strong></label>
//           <Select
//             isMulti
//             options={menuList.map((menu) => ({
//               value: menu.id,
//               label: menu.menu_name,
//             }))}
//             value={(latestData.menus || []).map((id) => {
//               const menu = menuList.find((m) => m.id === id || m.value === id);
//               return menu ? { value: menu.id, label: menu.menu_name } : null;
//             }).filter(Boolean)}
//             onChange={(selected) => handleChange("menus", selected)}
//             placeholder="Select menu(s)"
//           />
//         </div>

//         {/* Features */}
//         <div>
//           <label><strong>Features:</strong></label>
//           <Select
//             isMulti
//             options={featureList.map((feature) => ({
//               value: feature.id,
//               label: feature.feature_name,
//             }))}
//             value={(latestData.features || []).map((id) => {
//               const feature = featureList.find((f) => f.id === id || f.value === id);
//               console.log("Feature selected:", feature);
              
//               return feature
//                 ? { value: feature.id, label: feature.name }
//                 : null;
//             }).filter(Boolean)}
//             onChange={(selected) => handleChange("features", selected)}
//             placeholder="Select feature(s)"
//           />
//         </div>
//       </div>

//       {/* Submenus */}
//       <div style={{ marginTop: "30px" }}>
//         <label><strong>Submenus:</strong></label>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
//           {Object.entries(submenusByMenuId).map(([menuId, submenus]) => (
//             <div key={menuId}>
//               <label style={{ fontWeight: "bold" }}>
//                 {menuList.find((m) => m.id === parseInt(menuId))?.menu_name || `Menu ${menuId}`}
//               </label>
//               <Select
//                 isMulti
//                 options={submenus.map((sub) => ({
//                   value: sub.id,
//                   label: sub.sub_menu_name,
//                 }))}
//                 value={(latestData.submenus?.[menuId] || []).map((id) => {
//                   const submenu = submenus.find((s) => s.id === (id?.value || id));
//                   return submenu
//                     ? { value: submenu.id, label: submenu.sub_menu_name }
//                     : null;
//                 }).filter(Boolean)}
//                 onChange={(selected) =>
//                   handleChange("submenus", {
//                     ...latestData.submenus,
//                     [menuId]: selected,
//                   })
//                 }
//                 placeholder="Select submenu(s)"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Summary */}
//       <hr style={{ margin: "30px 0" }} />
//       <h3>Summary View</h3>
//       <p><strong>Name:</strong> {latestData.name}</p>
//       <p><strong>Email:</strong> {latestData.email}</p>
//       <p><strong>Phone:</strong> {latestData.phone}</p>
//       <p><strong>Locations:</strong> {getNamesFromIds(extractIds(latestData.locations), locationList).join(", ")}</p>
//       <p><strong>Roles:</strong> {getNamesFromIds(extractIds(latestData.roles), roleList).join(", ")}</p>
//       <p><strong>Menus:</strong> {getNamesFromIds(extractIds(latestData.menus), menuList).join(", ")}</p>
//       <p><strong>Features:</strong> {getNamesFromIds(extractIds(latestData.features), featureList).join(", ")}</p>
//       <p><strong>Submenus:</strong></p>
//       {Object.entries(latestData.submenus || {}).map(([menuId, subItems]) => {
//         const submenuListByMenu = submenusByMenuId[menuId] || [];
//         const extractedIds = extractIds(subItems);
//         const submenuNames = getNamesFromIds(extractedIds, submenuListByMenu);
//         const menuName = menuList.find((m) => m.id === parseInt(menuId))?.menu_name || `Menu ${menuId}`;
//         return (
//           <div key={menuId}>
//             <strong>{menuName}</strong>: {submenuNames.join(", ")}
//           </div>
//         );
//       })}

//       {/* Actions */}
//       <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px" }}>
//         <button onClick={handleSave} style={{ padding: "10px 20px", background: "#4CAF50", color: "#fff", border: "none" }}>
//           Save
//         </button>
//         <button onClick={handleDelete} style={{ padding: "10px 20px", background: "#f44336", color: "#fff", border: "none" }}>
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Finalstep;
