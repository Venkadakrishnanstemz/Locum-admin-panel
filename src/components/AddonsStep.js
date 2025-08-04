// import React, { useEffect, useState } from "react";
// import Pack from "./Pack";
// import { useDispatch } from "react-redux";
// import user, { info } from "../features/user";
// import { useSelector } from "react-redux";


// const AddonsStep = () => {
//   const dispatch=useDispatch();
//   const user=useSelector((e)=>e.user.value)
//   const [paks, setPaks] = useState(user.packs);
//   const chengeClick = title => {
//     console.log(paks);
//     setPaks(paks.map(e => (e.title === title ? { ...e, addon: !e.addon } : e)));
//   };

//   useEffect(()=>{
//     paks.map((e)=>{
//         dispatch(info({...user,packs:paks}));
//     })
//   },[paks])

//   return (
//     <div className="addons info">
//       <h2>Pick add-ons</h2>
//       <p>Add-ons help enhance your gaming experience.</p>
//       <div className="packs">
//         {paks.map((e, i) => (
//           <Pack key={i} packs={e} chengeClick={chengeClick} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AddonsStep;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { info } from "../features/user";
import { fetchRoles } from "../services/locationService";
import Select from "react-select";

const AddonsStep = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [roles, setRoles] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(false);

  // Fetch roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles();
        setRoles(data);

        // Pre-select any previously selected roles
        const selected = data
          .filter((role) => user.roles?.some((r) => r.id === role.id))
          .map((role) => ({ value: role.id, label: role.name }));
        setSelectedOptions(selected);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };

    loadRoles();
  }, []);

  // Update redux when selectedOptions change
  useEffect(() => {
    const selectedRoles = selectedOptions.map((opt) => ({
      id: opt.value,
      name: opt.label,
      selected: true,
    }));
    dispatch(info({ ...user, roles: selectedRoles }));
  }, [selectedOptions]);

  const options = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <div className="addons info">
      <h2>Select Role</h2>
      <p>Select <strong>one</strong> or more roles to assign to the user.</p>

      <label htmlFor="roles" style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
        Roles:
      </label>
      <Select
        id="roles"
        isMulti
        options={options}
        value={selectedOptions}
        onChange={(selected) => setSelectedOptions(selected)}
        closeMenuOnSelect={false}
        styles={{
          control: (base) => ({
            ...base,
            padding: "5px",
            borderRadius: "8px",
            fontSize: "16px",
            borderColor: error ? "red" : base.borderColor,
          }),
        }}
      />
    </div>
  );
};

export default AddonsStep;
