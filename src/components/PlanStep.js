// import React from "react";
// import Plan from "./Plan";
// import Arcade from "../assets/images/icon-arcade.svg";
// import Advanced from "../assets/images/icon-advanced.svg";
// import Pro from "../assets/images/icon-pro.svg";
// import { useState ,useEffect,useRef} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { info } from "../features/user";

// const PlanStep = () => {
//   const user=useSelector(e=>e.user.value);
//   const [yearly, setYearly] = useState({
//     arcade: 90,
//     advanced: 120,
//     pro: 150,
//   });
//   const [monthly, setMonthly] = useState({
//     arcade: 9,
//     advanced: 12,
//     pro: 15,
//   });
//   const [switchOff, setSwitch] = useState(false);
//   const [plan, setPlan] = useState({
//     arcade: true,
//     advanced: false,
//     pro: false,
//   });
//   const dispatch=useDispatch();
//   const refSwitch=useRef();
//   useEffect(()=>{
//     if(user.plantime=="Yearly"){
//       setSwitch(true);
//       refSwitch.current.checked=true;
//   }
//     switch(user.plan){
//       case "advanced":
//         setPlan({arcade: false,advanced: true,pro: false});
//         break;
//       case "pro":
//         setPlan({arcade: false,advanced: false,pro: true});
//         break;
//     }
//   },[])
//   useEffect(()=>{
//     var t=0;
//     var palntitle,price,plant;
//     Object.values(plan).map((e,i)=>{if(e==true)t=i;});
//     Object.keys(plan).map((e,i)=>{if(i==t)palntitle=e;});
//     if(!switchOff){
//       Object.values(monthly).map((e,i)=>{if(i==t)price=e;});
//       plant="Monthly";
//     }
//     else{
//       Object.values(yearly).map((e,i)=>{if(i==t)price=e;});
//       plant="Yearly";
//     }
//     dispatch(info({...user,plan:palntitle,price:price,plantime:plant}));

//   },[user.nextClick,plan,switchOff]);
  

//   return (
//     <div className="Plan info">
//       <h2>Select your plan</h2>
//       <p>You have the option of monthly or yearly billing.</p>
//       <div className="plansCrads">
//         <div onClick={()=>setPlan({arcade: true,advanced: false,pro: false,})}>
//           <Plan
//             img={Arcade}
//             title={"Arcade"}
//             price={switchOff ? yearly.arcade + "/yr" : monthly.arcade + "/mo"}
//             switchOff={switchOff}
//             selected={plan.arcade}
//           />
//         </div>
//         <div onClick={()=>setPlan({arcade: false,advanced: true,pro: false,})}>
//           <Plan
//             img={Advanced}
//             title={"Advanced"}
//             price={
//               switchOff ? yearly.advanced + "/yr" : monthly.advanced + "/mo"
//             }
//             switchOff={switchOff}
//             selected={plan.advanced}
//           />
//         </div>
//         <div onClick={()=>setPlan({arcade: false,advanced: false,pro: true,})}>
//           <Plan
//             img={Pro}
//             title={"Pro"}
//             price={switchOff ? yearly.pro + "/yr" : monthly.pro + "/mo"}
//             switchOff={switchOff}
//             selected={plan.pro}
//           />
//         </div>
//       </div>
//       <label for="plan" className="switch">
//         <span className={!switchOff?"switOn":""}>Monthly</span>
//         <input
//           type="checkbox"
//           name="plan"
//           id="plan" ref={refSwitch}
//           onChange={() => setSwitch(!switchOff)}
//         />
//         <span className={switchOff?"switOn":""}>Yearly</span>
//       </label>
//     </div>
//   );
// };

// export default PlanStep;

// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { useDispatch, useSelector } from "react-redux";
// import { info } from "../features/user";
// import { fetchLocations } from "../services/locationService";

// const PlanStep = () => {
//   const user = useSelector((state) => state.user.value);
//   const dispatch = useDispatch();

//   const [location, setLocations] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [error, setError] = useState("");

//   // Fetch location list
//   useEffect(() => {
//     const loadLocations = async () => {
//       try {
//         const data = await fetchLocations();
//         setLocations(data);

//         // Pre-fill if locations exist
//         if (user.location) {
//           const preSelected = data
//             .filter((loc) => user.location.includes(loc.id))
//             .map((loc) => ({ value: loc.id, label: loc.name }));
//           setSelectedOptions(preSelected);
//         }
//       } catch (err) {
//         console.error("Error loading locations:", err);
//       }
//     };
//     loadLocations();
//   }, []);

//   // Validate and sync on "Next"
//   useEffect(() => {
//     if (user.nextClick) {
//       const selectedIds = selectedOptions.map((opt) => opt.value);
//       if (selectedIds.length === 0) {
//         setError("Please select at least one location.");
//       } else {
//         setError("");
//         dispatch(info({ ...user, location: selectedIds }));
//       }
//     }
//   }, [user.nextClick, selectedOptions]);

//   // Convert locations to react-select format
//   const options = location.map((loc) => ({
//     value: loc.id,
//     label: loc.name,
//   }));

//   return (
//     <div className="Plan info">
//       <h2>Select Your Preferred Locations</h2>
//       <p>Select one or more locations applicable for the user.</p>

//       <div style={{ marginTop: "20px" }}>
//         <label
//           htmlFor="locations"
//           style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}
//         >
//           Location:
//         </label>

//         <Select
//           id="locations"
//           isMulti
//           options={options}
//           value={selectedOptions}
//           onChange={(selected) => setSelectedOptions(selected)}
//           closeMenuOnSelect={false}
//           styles={{
//             control: (base) => ({
//               ...base,
//               padding: "5px",
//               borderRadius: "8px",
//               fontSize: "16px",
//               borderColor: error ? "red" : base.borderColor,
//             }),
//           }}
//         />

//         {error && (
//           <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlanStep;
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { info } from "../features/user";
import { fetchLocations } from "../services/locationService";

const PlanStep = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [location, setLocations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  // Fetch location list + prefill
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchLocations();
        setLocations(data);

        // 🔄 Prefill using user.locations
        if (user.locations && user.locations.length > 0) {
          const preSelected = data
            .filter((loc) => user.locations.includes(loc.id))
            .map((loc) => ({ value: loc.id, label: loc.name }));
          setSelectedOptions(preSelected);
        }
      } catch (err) {
        console.error("Error loading locations:", err);
      }
    };
    loadLocations();
  }, []);

  // Validate and dispatch on nextClick
  useEffect(() => {
    if (user.nextClick) {
      const selectedIds = selectedOptions.map((opt) => opt.value);

      if (selectedIds.length === 0) {
        setError("Please select at least one location.");
      } else {
        setError("");
        // ✅ Save in user.locations for validation and flow
        dispatch(info({ ...user, locations: selectedIds }));
      }
    }
  }, [user.nextClick, selectedOptions]);

  const options = location.map((loc) => ({
    value: loc.id,
    label: loc.name,
  }));

  return (
    <div className="Plan info">
      <h2>Select Your Preferred Locations</h2>
      <p>Select one or more locations applicable for the user.</p>

      <div style={{ marginTop: "20px" }}>
        <label
          htmlFor="locations"
          style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}
        >
          Location:
        </label>

        <Select
          id="locations"
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

        {error && (
          <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
        )}
      </div>
    </div>
  );
};

export default PlanStep;
