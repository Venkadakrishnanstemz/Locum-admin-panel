// import React, { useEffect, useRef, useState } from "react";
// import "./Personalinfo.css";
// import { useDispatch, useSelector } from "react-redux";
// import { info } from "../../features/user";
// import { fetchUserInfo, postUserInfo } from "../../services/locationService";

// const InfoStep = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((e) => e.user.value);

//   const [perinfo, setPer] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     dob: "",
//     gender: "",
//     address: "",
//     blood_group: "",
//     marital_status: "",
//   });

//   const refName = useRef();
//   const refEmail = useRef();
//   const refPhone = useRef();
//   const refDOB = useRef();
//   const refGender = useRef();
//   const refAddress = useRef();
//   const refBloodGroup = useRef();
//   const refMaritalStatus = useRef();

//   const emailval = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
//   const phoneVal = (e) =>
//     /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i.test(e);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchUserInfo();
//         setPer({
//           name: data.name || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           dob: data.dob || "",
//           gender: data.gender || "",
//           address: data.address || "",
//           blood_group: data.blood_group || "",
//           marital_status: data.marital_status || "",
//         });

//         if (refName.current) refName.current.value = data.name || "";
//         if (refEmail.current) refEmail.current.value = data.email || "";
//         if (refPhone.current) refPhone.current.value = data.phone || "";
//         if (refDOB.current) refDOB.current.value = data.dob || "";
//         if (refGender.current) refGender.current.value = data.gender || "";
//         if (refAddress.current) refAddress.current.value = data.address || "";
//         if (refBloodGroup.current)
//           refBloodGroup.current.value = data.blood_group || "";
//         if (refMaritalStatus.current)
//           refMaritalStatus.current.value = data.marital_status || "";

//         dispatch(
//           info({
//             ...user,
//             name: data.name || "",
//             email: data.email || "",
//             phone: data.phone || "",
//             emailValid: emailval(data.email || ""),
//             phoneValid: phoneVal(data.phone || ""),
//           })
//         );
//       } catch (error) {
//         console.error("Error loading user info:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     dispatch(
//       info({
//         ...user,
//         name: refName.current?.value || "",
//         email: refEmail.current?.value || "",
//         phone: refPhone.current?.value || "",
//         emailValid: emailval(refEmail.current?.value || ""),
//         phoneValid: phoneVal(refPhone.current?.value || ""),
//       })
//     );
//   }, [perinfo.name, perinfo.email, perinfo.phone]);

//   const handleSubmit = async () => {
//     const payload = {
//       name: refName.current.value,
//       email: refEmail.current.value,
//       phone: refPhone.current.value,
//       dob: refDOB.current.value,
//       gender: refGender.current.value,
//       address: refAddress.current.value,
//       blood_group: refBloodGroup.current.value,
//       marital_status: refMaritalStatus.current.value,
//     };

//     try {
//       const response = await postUserInfo(payload);
//       console.log("User info saved:", response);
//       alert("User info saved successfully.");
//     } catch (error) {
//       console.error("Error saving user info:", error);
//       alert("Failed to save user info.");
//     }
//   };

//   const labelStyle = { fontWeight: "bold", marginBottom: 4 };
//   const inputStyle = (hasError) => ({
//     padding: "8px",
//     borderRadius: "4px",
//     border: hasError ? "1px solid red" : "1px solid #ccc",
//     marginBottom: "10px",
//     width: "100%",
//   });
//   const errorText = { color: "red", fontSize: "12px", marginBottom: "6px" };

//   return (
//     <div className="form-container">
//   <h2>Personal Info</h2>
//   <p>Please provide your personal details below.</p>

//   <form onSubmit={(e) => e.preventDefault()}>
//     <div className="form-grid">
//       {/* Name */}
//       <div className="form-group">
//         <label>Name</label>
//         {user.nextClick && user.name.length < 3 && (
//           <div className="error-text">This field is required</div>
//         )}
//         <input
//           type="text"
//           ref={refName}
//           placeholder="e.g. Stephen King"
//           className={user.nextClick && user.name.length < 3 ? "input-error" : ""}
//           onChange={(e) => setPer({ ...perinfo, name: e.target.value })}
//         />
//       </div>

//       {/* Email */}
//       <div className="form-group">
//         <label>Email Address</label>
//         {!user.emailValid && user.nextClick && (
//           <div className="error-text">
//             {user.email === ""
//               ? "This field is required"
//               : "Invalid Email Address"}
//           </div>
//         )}
//         <input
//           type="email"
//           ref={refEmail}
//           placeholder="e.g. stephenking@example.com"
//           className={!user.emailValid && user.nextClick ? "input-error" : ""}
//           onChange={(e) => setPer({ ...perinfo, email: e.target.value })}
//         />
//       </div>

//       {/* Phone */}
//       <div className="form-group">
//         <label>Phone Number</label>
//         {!user.phoneValid && user.nextClick && (
//           <div className="error-text">This field is required</div>
//         )}
//         <input
//           type="tel"
//           ref={refPhone}
//           placeholder="e.g. +1 234 567 890"
//           className={!user.phoneValid && user.nextClick ? "input-error" : ""}
//           onChange={(e) => setPer({ ...perinfo, phone: e.target.value })}
//         />
//       </div>

//       {/* DOB */}
//       <div className="form-group">
//         <label>Date of Birth</label>
//         <input
//           type="date"
//           ref={refDOB}
//           onChange={(e) => setPer({ ...perinfo, dob: e.target.value })}
//         />
//       </div>

//       {/* Gender */}
//       <div className="form-group">
//         <label>Gender</label>
//         <select
//           ref={refGender}
//           defaultValue=""
//           onChange={(e) => setPer({ ...perinfo, gender: e.target.value })}
//         >
//           <option value="" disabled>Select gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* Address */}
//       <div className="form-group">
//         <label>Address</label>
//         <input
//           type="text"
//           ref={refAddress}
//           placeholder="e.g. 123 Main St"
//           onChange={(e) => setPer({ ...perinfo, address: e.target.value })}
//         />
//       </div>

//       {/* Blood Group */}
//       <div className="form-group">
//         <label>Blood Group</label>
//         <select
//           ref={refBloodGroup}
//           defaultValue=""
//           onChange={(e) => setPer({ ...perinfo, blood_group: e.target.value })}
//         >
//           <option value="" disabled>Select blood group</option>
//           <option value="A+">A+</option>
//           <option value="A-">A-</option>
//           <option value="B+">B+</option>
//           <option value="B-">B-</option>
//           <option value="O+">O+</option>
//           <option value="O-">O-</option>
//           <option value="AB+">AB+</option>
//           <option value="AB-">AB-</option>
//         </select>
//       </div>

//       {/* Marital Status */}
//       <div className="form-group">
//         <label>Marital Status</label>
//         <select
//           ref={refMaritalStatus}
//           defaultValue=""
//           onChange={(e) => setPer({ ...perinfo, marital_status: e.target.value })}
//         >
//           <option value="" disabled>Select status</option>
//           <option value="Single">Single</option>
//           <option value="Married">Married</option>
//           <option value="Divorced">Divorced</option>
//           <option value="Widowed">Widowed</option>
//         </select>
//       </div>
//     </div>

//     <div className="form-submit">
//       <button type="button" onClick={handleSubmit}>
//         Save Info
//       </button>
//     </div>
//   </form>
// </div>

//   );
// };

// export default InfoStep;
// import React from "react";
// import "./Personalinfo.css";
// import { useDispatch, useSelector } from "react-redux";
// import { info } from "../../features/user";


// const PersonalInfoForm = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.value);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Optional: validate email and phone
//     let extra = {};
//     if (name === "email") extra.emailValid = value.includes("@");
//     if (name === "phone") extra.phoneValid = value.length >= 10;

//     dispatch(info({
//       ...user,
//       [name]: value,
//       ...extra
//     }));
//   };

//   return (
//     <div className="form-container">
//       <h3>Personal Info</h3>
//       <p>Please provide your personal details below.</p>

//       <div className="form-grid">
//         <div className="form-group">
//           <label>Name</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="e.g. Stephen King"
//             value={user.name || ""}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Email Address</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="e.g. stephenking@example.com"
//             value={user.email || ""}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Phone Number</label>
//           <input
//             type="text"
//             name="phone"
//             placeholder="e.g. +1 234 567 890"
//             value={user.phone || ""}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Date of Birth</label>
//           <input
//             type="date"
//             name="dob"
//             value={user.dob || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label>Gender</label>
//           <select name="gender" value={user.gender || ""} onChange={handleChange}>
//             <option value="">Select gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Address</label>
//           <input
//             type="text"
//             name="address"
//             placeholder="e.g. 123 Main St"
//             value={user.address || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label>Blood Group</label>
//           <select
//             name="bloodGroup"
//             value={user.bloodGroup || ""}
//             onChange={handleChange}
//           >
//             <option value="">Select blood group</option>
//             <option value="A+">A+</option>
//             <option value="A-">A-</option>
//             <option value="B+">B+</option>
//             <option value="B-">B-</option>
//             <option value="O+">O+</option>
//             <option value="O-">O-</option>
//             <option value="AB+">AB+</option>
//             <option value="AB-">AB-</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Marital Status</label>
//           <select
//             name="maritalStatus"
//             value={user.maritalStatus || ""}
//             onChange={handleChange}
//           >
//             <option value="">Select status</option>
//             <option value="Single">Single</option>
//             <option value="Married">Married</option>
//             <option value="Divorced">Divorced</option>
//             <option value="Widowed">Widowed</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoForm;
import React, { useState } from "react";
import "./Personalinfo.css";
import { useDispatch, useSelector } from "react-redux";
import { info } from "../../features/user";

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let extra = {};
    if (name === "email") extra.emailValid = value.includes("@");
    if (name === "phone") extra.phoneValid = value.length >= 10;
    if (name === "confirmPassword" || name === "password") {
      extra.passwordMatch =
        name === "confirmPassword"
          ? value === user.password
          : user.confirmPassword === value;
    }

    dispatch(
      info({
        ...user,
        [name]: value,
        ...extra,
      })
    );
  };

  return (
    <div className="form-container">
      <h3>Personal Info</h3>
      <p>Please provide your personal details below.</p>

      <div className="form-grid">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Stephen King"
            value={user.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. stephenking@example.com"
            value={user.email || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. +1 234 567 890"
            value={user.phone || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={user.dob || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={user.gender || ""} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="e.g. 123 Main St"
            value={user.address || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Blood Group</label>
          <select
            name="bloodGroup"
            value={user.bloodGroup || ""}
            onChange={handleChange}
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form-group">
          <label>Marital Status</label>
          <select
            name="maritalStatus"
            value={user.maritalStatus || ""}
            onChange={handleChange}
          >
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {/* Password */}
        <div className="form-group password-field">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={user.password || ""}
              onChange={handleChange}
            />
            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group password-field">
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter password"
              value={user.confirmPassword || ""}
              onChange={handleChange}
            />
            
          </div>
          {user.password &&
            user.confirmPassword &&
            user.password !== user.confirmPassword && (
              <p style={{ color: "red", marginTop: "5px" }}>
                Passwords do not match
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
