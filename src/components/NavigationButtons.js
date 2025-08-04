// // import React from 'react'
// // import { useDispatch} from 'react-redux'
// // import { next } from '../features/page'
// // import { useSelector } from 'react-redux'
// // import { back } from '../features/page'
// // import { info } from '../features/user'


// // const NavigationButtons = () => {
// //   const page=useSelector((e)=>e.page.value);
// //   const user=useSelector(e=>e.user.value)
// //   const dispatch=useDispatch();
// //   const nextClick=()=>{
// //     console.log(user)
// //     dispatch(info({...user,nextClick:true}));
// //     if(user.emailValid && user.phoneValid && user.name.length>2 && page==0){
// //       dispatch(next());
// //       dispatch(info({...user,nextClick:false}))
// //     }
// //     if(page!=0){
// //       dispatch(next());
// //     }
    
// //   }
// //   return (
// //     <div className={page==0?'navigation btnRight':'navigation'}>
// //       {page!=0 &&<button className='btn1' onClick={()=>dispatch(back())}>Go Back</button>}
// //       <button className='btn2'onClick={nextClick}>{page==3?"Conforme":"Next Step"}</button>
// //     </div>
// //   )
// // }

// // export default NavigationButtons

// // import React from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { next, back } from "../features/page";
// // import { info } from "../features/user";

// // const NavigationButtons = () => {
// //   const page = useSelector((e) => e.page.value);
// //   const user = useSelector((e) => e.user.value);
// //   const dispatch = useDispatch();

// //   // Save data to localStorage for a step
// //   const saveToLocalStorage = (step, data) => {
// //     localStorage.setItem(`user_step_${step}`, JSON.stringify(data));
// //   };

// //   // Remove data from localStorage for a step
// //   const removeFromLocalStorage = (step) => {
// //     localStorage.removeItem(`user_step_${step}`);
// //   };

// //   // Next button handler
// //   const nextClick = (e) => {
// //     e.preventDefault();
// //     dispatch(info({ ...user, nextClick: true }));

// //     // Step-specific validation
// //     const isStep0Valid = user.emailValid && user.phoneValid && user.name?.length > 2;
// //     const isStep1Valid = user.locations && user.locations.length > 0;
// //     const isStep2Valid = user.roles && user.roles.length > 0;

// //     let stepValid = true;
// //     if (page === 0) stepValid = isStep0Valid;
// //     if (page === 1) stepValid = isStep1Valid;
// //     if (page === 2) stepValid = isStep2Valid;

// //     // Save current step data before moving forward
// //     saveToLocalStorage(page, user);

// //     if (stepValid) {
// //       dispatch(next());
// //       dispatch(info({ ...user, nextClick: false }));
// //     } else {
// //       alert("Please complete all required fields before continuing.");
// //     }
// //   };

// //   // Back button handler
// //   const backClick = (e) => {
// //     e.preventDefault();
// //     // Remove current step data when going back
// //     removeFromLocalStorage(page);
// //     dispatch(back());
// //   };

// //   return (
// //     <div className={page === 0 ? "navigation btnRight" : "navigation"}>
// //       {page !== 0 && (
// //         <button className="btn1" type="button" onClick={backClick}>
// //           Go Back
// //         </button>
// //       )}
// //       <button className="btn2" type="button" onClick={nextClick}>
// //         {page === 3 ? "Confirm" : "Next Step"}
// //       </button>
// //     </div>
// //   );
// // };

// // export default NavigationButtons;



// // import React from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { next, back } from "../features/page";
// // import { info } from "../features/user";
// // import { savePersonalInfo ,updateLocation} from "../services/locationService"; 
// // import { updateRole } from "../services/locationService";// Make sure the path is correct

// // const NavigationButtons = () => {
// //   const page = useSelector((state) => state.page.value);
// //   const user = useSelector((state) => state.user.value);
// //   const dispatch = useDispatch();

// //   const saveToLocalStorage = (step, data) => {
// //     localStorage.setItem(`user_step_${step}`, JSON.stringify(data));
// //   };

// //   const removeFromLocalStorage = (step) => {
// //     localStorage.removeItem(`user_step_${step}`);
// //   };

// //   const nextClick = async (e) => {
// //     e.preventDefault();

// //     dispatch(info({ ...user, nextClick: true }));
    

// //   // Step-wise validation
// //     const isStep0Valid = user.emailValid && user.phoneValid;
// //     const isStep1Valid = user.locations && user.locations.length > 0;
// //     const isStep2Valid = user.roles && user.roles.length > 0;

// //     let stepValid = true;
// //     if (page === 0) stepValid = isStep0Valid;
// //     if (page === 1) stepValid = isStep1Valid;
// //     if (page === 2) stepValid = isStep2Valid;

// //     if (!stepValid) {
// //       alert("Please complete all required fields before continuing.");
// //       return;
// //     }

// //     // ✅ Save personal info only on Step 0
// //     // if (page === 0) {
// //     //   const payload = {
// //     //     name: user.name,
// //     //     email: user.email,
// //     //     phone_number: user.phone,
// //     //     date_of_birth: user.dob || null,  // format: YYYY-MM-DD
// //     //     gender: user.gender || "",
// //     //     address: user.address || "",
// //     //     blood_group: user.bloodGroup || "",
// //     //     marital_status: user.maritalStatus || ""
      
// //     //   };

// //     //   try {
// //     //     await savePersonalInfo(payload); // 🔁 API call
// //     //     console.log(" Personal info saved successfully.");
// //     //   } catch (error) {
// //     //     console.error(" Failed to save personal info:", error);
// //     //     alert("Something went wrong while saving your info. Please try again.");
// //     //     return; // Stop progression
// //     //   }
// //     // }

// //     if (page === 0) {
// //   const payload = {
// //     name: user.name,
// //     email: user.email,
// //     phone_number: user.phone,
// //     date_of_birth: user.dob || null,
// //     gender: user.gender || "",
// //     address: user.address || "",
// //     blood_group: user.bloodGroup || "",
// //     marital_status: user.maritalStatus || ""
// //   };

// //   try {
// //     const response = await savePersonalInfo(payload);
// //     console.log("Saved personal info with ID:", response.id);

// //     //  Save ID in Redux and localStorage
// //     dispatch(info({ ...user, personalInfoId: response.id }));
// //     localStorage.setItem("personalInfoId", response.id);
// //   } catch (error) {
// //     alert("Failed to save personal info.");
// //     return;
// //   }
// // }

// //     // ✅ Step 1: Update location
// //     // if (page === 1) {
// //     //   const personalInfoId = user.personalInfoId || localStorage.getItem("personalInfoId");
// //     //   const locationPayload = {
// //     //     location: user.locations[0] || "Unknown"
// //     //   };

// //     //   if (!personalInfoId) {
// //     //     alert("Personal info not saved. Cannot continue.");
// //     //     return;
// //     //   }

// //     //   try {
// //     //     await updateLocation(personalInfoId, locationPayload); // PUT
// //     //     console.log("Location updated.");
// //     //   } catch (error) {
// //     //     console.error(" Failed to update location:", error);
// //     //     alert("Something went wrong while updating your location.");
// //     //     return;
// //     //   }
// //     // }
// // //     if (page === 1) {
// // //   const personalInfoId = user.personalInfoId || localStorage.getItem("personalInfoId");
// // //   const locationPayload = {
// // //     location: user.locations[0] || "Unknown"
// // //   };

// // //   if (!personalInfoId) {
// // //     alert("Personal info not saved. Cannot continue.");
// // //     return;
// // //   }

// // //   await updateLocation(personalInfoId, locationPayload);
// // // }
// // // if (page === 1) {
// // //       let id = user.personalInfoId || localStorage.getItem("personalInfoId");

// // //       if (!id || id === "undefined") {
// // //         alert("Personal info not saved. Cannot continue.");
// // //         return;
// // //       }

// // //       const locationPayload = {
// // //         location: user.locations[0] || "Unknown"
// // //       };

// // //       try {
// // //         await updateLocation(id, locationPayload); //  Make the PUT call
// // //         console.log("Location updated for ID:", id);
// // //       } catch (error) {
// // //         console.error(" Failed to update location:", error);
// // //         alert("Something went wrong while updating location.");
// // //         return;
// // //       }
// // //     }
// // if (page === 1) {
// //   let id = user.personalInfoId || localStorage.getItem("personalInfoId");
// //   id = parseInt(id); // ✅ ensure it's a number

// //   if (!id || isNaN(id)) {
// //     alert("Personal info not saved. Cannot continue.");
// //     return;
// //   }

// //   const locationPayload = {
// //     location: user.locations?.[0] || "Unknown",  // ✅ safer access
// //   };

// //   try {
// //     await updateLocation(id, locationPayload); // ✅ Make the PUT call
// //     console.log("Location updated for ID:", id);
// //   } catch (error) {
// //     console.error(" Failed to update location:", error);
// //     alert("Something went wrong while updating location.");
// //     return;
// //   }
// // }

// //     // ✅ Step 2: Save role
// // if (page === 2) {
// //   let id = user.personalInfoId || localStorage.getItem("personalInfoId");

// //   if (!id || id === "undefined") {
// //     alert("Personal info not saved. Cannot continue.");
// //     return;
// //   }

// //   const rolePayload = {
// //     role: user.roles[0] || "unknown"
// //   };

// //   try {
// //     await updateRole(id, rolePayload);  // 🔁 Create this API call
// //     console.log("Role updated for ID:", id);
// //   } catch (error) {
// //     console.error("Failed to update role:", error);
// //     alert("Failed to update role.");
// //     return;
// //   }
// // }


// //     // Proceed to next step
// //     saveToLocalStorage(page, user);
// //     dispatch(next());
// //     dispatch(info({ ...user, nextClick: false }));
// //   };

// //   const backClick = (e) => {
// //     e.preventDefault();
// //     removeFromLocalStorage(page);
// //     dispatch(back());
// //   };

// //   return (
// //     <div className={page === 0 ? "navigation btnRight" : "navigation"}>
// //       {page !== 0 && (
// //         <button className="btn1" type="button" onClick={backClick}>
// //           Go Back
// //         </button>
// //       )}
// //       <button className="btn2" type="button" onClick={nextClick}>
// //         {page === 3 ? "Confirm" : "Next Step"}
// //       </button>
// //     </div>
// //   );
// // };

// // export default NavigationButtons;

// // import React from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { next, back } from "../features/page";
// // import { info } from "../features/user";
// // import {
// //   savePersonalInfo,
// //   updatePersonalInfo
// // } from "../services/locationService";

// // const NavigationButtons = () => {
// //   const page = useSelector((state) => state.page.value);
// //   const user = useSelector((state) => state.user.value);
// //   const dispatch = useDispatch();

// //   const saveToLocalStorage = (step, data) => {
// //     localStorage.setItem(`user_step_${step}`, JSON.stringify(data));
// //   };

// //   const removeFromLocalStorage = (step) => {
// //     localStorage.removeItem(`user_step_${step}`);
// //   };

// //   const getResolvedValue = (item) => {
// //     if (typeof item === "string") return item;
// //     return item?.name || item?.label || item?.value || "";
// //   };

// //   const nextClick = async (e) => {
// //     e.preventDefault();
// //     dispatch(info({ ...user, nextClick: true }));

// //     const isStep0Valid = user.emailValid && user.phoneValid;
// //     const isStep1Valid = user.locations && user.locations.length > 0;
// //     const isStep2Valid = user.roles && user.roles.length > 0;

// //     let stepValid = true;
// //     if (page === 0) stepValid = isStep0Valid;
// //     if (page === 1) stepValid = isStep1Valid;
// //     if (page === 2) stepValid = isStep2Valid;

// //     if (!stepValid) {
// //       alert("Please fill all required fields for this step.");
// //       return;
// //     }

// //     // Step 0: Save personal info
// //     if (page === 0) {
// //       const payload = {
        
// //         name: user.name,
// //         email: user.email,
// //         phone_number: user.phone,
// //         date_of_birth: user.dob || null,
// //         gender: user.gender || "",
// //         address: user.address || "",
// //         blood_group: user.bloodGroup || "",
// //         marital_status: user.maritalStatus || "",
// //       };

// //       try {
// //         const res = await savePersonalInfo(payload);
// //         const response = res.data;

// //         if (!response.id) {
// //           alert("Failed to receive ID from backend");
// //           return;
// //         }

// //         dispatch(info({ ...user, personalInfoId: response.id }));
// //         localStorage.setItem("personalInfoId", response.id);
// //       } catch (error) {
// //         console.error("❌ Failed to save personal info:", error);
// //         alert("Something went wrong while saving personal info.");
// //         return;
// //       }
// //     }

// //     // Step 1: Update location
// // if (page === 1) {
// //       let id = user.personalInfoId || localStorage.getItem("personalInfoId");
// //       id = parseInt(id);

// //       if (!id || isNaN(id)) {
// //         console.error("Invalid personalInfoId:", id);
// //         alert("Personal info not saved. Cannot continue.");
// //         dispatch(info({ ...user, nextClick: false }));
// //         return;
// //       }

// //       const selectedLocation =
// //         Array.isArray(user.location) && user.location.length > 0
// //           ? user.location[0]
// //           : null;

// //       const locationName = getResolvedValue(selectedLocation);

// //       if (locationName === "Unknown") {
// //         console.error("Invalid location:", locationName);
// //         alert("Please select a valid location.");
// //         dispatch(info({ ...user, nextClick: false }));
// //         return;
// //       }

// //       const formData = { location: locationName }; // Backend expects 'location'

// //       try {
// //         await updatePersonalInfo(id, formData);
// //         console.log("Location updated for ID:", id, "Location:", locationName);
// //         dispatch(info({ ...user, location: [locationName] }));
// //       } catch (error) {
// //         console.error("Failed to update location:", error.response?.data || error.message);
// //         alert("Failed to update location: " + (error.response?.data?.detail || error.message));
// //         dispatch(info({ ...user, nextClick: false }));
// //         return;
// //       }
// //     }


// //     // Step 2: Update role
// //     if (page === 2) {
// //       let id = user.personalInfoId || localStorage.getItem("personalInfoId");
// //       id = parseInt(id);

// //       if (!id || isNaN(id)) {
// //         alert("Personal info not saved. Cannot continue with role update.");
// //         return;
// //       }

// //       const selectedRole =
// //         Array.isArray(user.roles) && user.roles.length > 0
// //           ? user.roles[0]
// //           : null;

// //       const roleName = getResolvedValue(selectedRole);

// //       if (!roleName || roleName === "Unknown") {
// //         alert("Invalid role selected. Please select a valid role.");
// //         return;
// //       }

// //       const rolePayload = { role: roleName };

// //       try {
// //         await updatePersonalInfo(id, rolePayload);
// //         console.log("✅ Role updated for ID:", id);
// //       } catch (error) {
// //         console.error("❌ Failed to update role:", error);
// //         alert("Something went wrong while updating role.");
// //         return;
// //       }
// //     }

// //     // ✅ Move to next step
// //     saveToLocalStorage(page, user);
// //     dispatch(next());
// //     dispatch(info({ ...user, nextClick: false }));
// //   };

// //   const backClick = (e) => {
// //     e.preventDefault();
// //     removeFromLocalStorage(page);
// //     dispatch(back(page-1));
// //   };

// //   return (
// //     <div className={page === 0 ? "navigation btnRight" : "navigation"}>
// //       {page > 0 && page <= 6 && (
// //         <button className="btn1" type="button" onClick={backClick}>
// //           Go Back
// //         </button>
// //       )}
// //       <button className="btn2" type="button" onClick={nextClick}>
// //         {page === 6 ? "Confirm" : "Next Step"}
// //       </button>
// //     </div>
// //   );
// // };

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { next, back, setPage } from "../features/page";
// import { info } from "../features/user";
// import { savePersonalInfo } from "../services/locationService"; // <-- Import API

// const NavigationButtons = () => {
//   const page = useSelector((state) => state.page.value);
//   const user = useSelector((state) => state.user.value);
//   const dispatch = useDispatch();

//   // useEffect(() => {
//   //   const isRefresh =
//   //     performance.navigation.type === 1 ||
//   //     performance.getEntriesByType("navigation")[0]?.type === "reload";
//   //   if (isRefresh) {
//   //     localStorage.removeItem("user_step");
//   //     localStorage.removeItem("personalInfoId");
//   //     console.log("🔁 Page refreshed — cleared localStorage");
//   //   }
//   // }, []);

//   const saveUserState = (data) => {
//     localStorage.setItem("user_step", JSON.stringify(data));
//   };

//   const nextClick = async (e) => {
//     e.preventDefault();
//     dispatch(info({ ...user, nextClick: true }));

//     // Step validations
//     const isStep0Valid = user.emailValid && user.phoneValid;
//     const isStep1Valid = user.locations && user.locations.length > 0;
//     const isStep2Valid = user.roles && user.roles.length > 0;
//     const isStep4Valid = user.features && user.features.length > 0;
//     const isStep5Valid = user.menus && user.menus.length > 0;
//     const isStep6Valid = user.summary && user.summary.length > 0;

//     let stepValid = true;
//     switch (page) {
//       case 0:
//         stepValid = isStep0Valid;
//         break;
//       case 1:
//         stepValid = isStep1Valid;
//         break;
//       case 2:
//         stepValid = isStep2Valid;
//         break;
//       case 4:
//         stepValid = isStep4Valid;
//         break;
//       case 5:
//         stepValid = isStep5Valid;
//         break;
//       case 6:
//         stepValid = isStep6Valid;
//         break;
//       default:
//         stepValid = true;
//     }

//     if (!stepValid) {
//       alert("Please fill all required fields for this step.");
//       return;
//     }

//     saveUserState({ ...user });

//     if (page === 5) {
//       try {
//         const payload = { ...user }; // shape it if needed
//         const response = await savePersonalInfo(payload);
//         console.log("✅ Data saved to DB:", response);
//         dispatch(setPage(7)); // Go to Thank You page
//       } catch (error) {
//         console.error("❌ Failed to save to DB:", error);
//         alert("Error saving data. Please try again.");
//       }
//     } else {
//       dispatch(next());
//       dispatch(info({ ...user, nextClick: false }));
//     }
//   };

//   const backClick = (e) => {
//     e.preventDefault();
//     saveUserState({ ...user });
//     dispatch(back(page - 1));
//   };

//   const shouldShowButtons = page >= 0 && page <= 5;

//   return shouldShowButtons ? (
//     <div
//       className={page === 0 ? "navigation btnRight" : "navigation"}
//       style={{
//         display: "flex",
//         justifyContent: page === 0 ? "flex-end" : "space-between",
//         marginTop: "20px",
//         padding: "20px",
//       }}
//     >
//       {page > 0 && (
//         <button className="btn1" type="button" onClick={backClick}>
//           Go Back
//         </button>
//       )}

//       <button className="btn2" type="button" onClick={nextClick}>
//         {page === 5 ? "Confirm" : "Next Step"}
//       </button>
//     </div>
//   ) : null;
// };

// export default NavigationButtons;
