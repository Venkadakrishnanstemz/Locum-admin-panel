// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { EditOutlined } from "@ant-design/icons";
// import './personalInfoForm.css';

// const PersonalInfoForm = ({ onNext, data, setActiveKey, isEditing, onChange }) => {
//   const [formData, setFormData] = useState({
//     name: data.name || "",
//     age: data.age || "",
//     gender: data.gender || "",
//     phone: data.phone || "",
//     email: data.email || "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [isEditable, setIsEditable] = useState(false);

//   // Sync formData with parent data when it changes (e.g., for editing)
//   useEffect(() => {
//     setFormData({
//       name: data.name || "",
//       age: data.age || "",
//       gender: data.gender || "",
//       phone: data.phone || "",
//       email: data.email || "",
//     });
//   }, [data]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const newFormData = { ...formData, [name]: value };
//     setFormData(newFormData);
//     if (onChange) {
//       onChange(newFormData);
//     }
//   };

//   const validate = () => {
//     const errors = {};
//     if (!formData.name.trim()) errors.name = "Name is required.";
//     if (!formData.age || parseInt(formData.age) <= 0) errors.age = "Valid age is required.";
//     if (!formData.gender) errors.gender = "Gender is required.";
//     if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone))
//       errors.phone = "Valid phone number is required.";
//     if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
//       errors.email = "Valid email is required.";
//     return errors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     setFormErrors({});
//     onNext(formData); // Send final payload to proceed to next step
//     if (setActiveKey) {
//       setActiveKey("location"); // Update active key for step navigation
//     }
//     if (isEditing) {
//       setIsEditable(false); // Disable edit mode after submission in edit flow
//     }
//   };

//   const toggleEdit = () => {
//     setIsEditable(!isEditable);
//   };

//   return (
//     <div>
//       <h4>Basic Details</h4>
//       <div className="mt-3">
//         <Form className="border p-3 rounded" onSubmit={handleSubmit}>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5>Personal Information</h5>
//             {isEditing && (
//               <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
//                 <Button variant="link" onClick={toggleEdit} className="p-0">
//                   <EditOutlined style={{ fontSize: "18px", color: isEditable ? "#1890ff" : "#000" }} />
//                 </Button>
//               </OverlayTrigger>
//             )}
//           </div>
//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="e.g., Nathaniel Poole"
//                   isInvalid={!!formErrors.name}
//                   disabled={!isEditable && isEditing} // Disable when not editable in edit mode
//                 />
//                 <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Age</Form.Label>
//                 <Form.Control
//                   name="age"
//                   type="number"
//                   value={formData.age}
//                   onChange={handleChange}
//                   placeholder="e.g., 28"
//                   isInvalid={!!formErrors.age}
//                   disabled={!isEditable && isEditing}
//                 />
//                 <Form.Control.Feedback type="invalid">{formErrors.age}</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Gender</Form.Label>
//                 <Form.Select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   isInvalid={!!formErrors.gender}
//                   disabled={!isEditable && isEditing}
//                 >
//                   <option value="">Select Gender</option>
//                   <option>Male</option>
//                   <option>Female</option>
//                   <option>Other</option>
//                 </Form.Select>
//                 <Form.Control.Feedback type="invalid">{formErrors.gender}</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Phone Number</Form.Label>
//                 <Form.Control
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="e.g., +18001234567"
//                   isInvalid={!!formErrors.phone}
//                   disabled={!isEditable && isEditing}
//                 />
//                 <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="e.g., example@domain.com"
//                   isInvalid={!!formErrors.email}
//                   disabled={!isEditable && isEditing}
//                 />
//                 <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <div className="text-end">
//             <Button type="submit" variant="primary" disabled={isEditing && !isEditable}>
//               {isEditing ? "Save Changes" : "Save & Continue"}
//             </Button>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoForm;

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { EditOutlined } from "@ant-design/icons";
import './personalInfoForm.css';

const PersonalInfoForm = ({ onNext, data, isEditing, onChange }) => {
console.log("isEditing:", isEditing);

  const [formData, setFormData] = useState({
    name: data.name || "",
    age: data.age || "",
    gender: data.gender || "",
    phone: data.phone || "",
    email: data.email || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditable, setIsEditable] = useState(!isEditing); // Editable by default unless editing

  // Sync formData only on initial load or when isEditing changes
  useEffect(() => {
    if (isEditing && !isEditable) {
      setFormData({
        name: data.name || "",
        age: data.age || "",
        gender: data.gender || "",
        phone: data.phone || "",
        email: data.email || "",
      });
      console.log("PersonalInfoForm: Synced formData with parent data", data);
    }
  }, [data, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (onChange) {
      onChange(newFormData);
    }
    console.log("PersonalInfoForm: Updated formData", newFormData);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.age || parseInt(formData.age) <= 0) errors.age = "Valid age is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone))
      errors.phone = "Valid phone number is required.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log("PersonalInfoForm: Validation errors", errors);
      return;
    }
    setFormErrors({});
    onNext(formData);
    console.log("PersonalInfoForm: Submitted formData", formData);
    if (isEditing) {
      setIsEditable(false);
    }
  };

  const toggleEdit = () => {
    setIsEditable(true);
    console.log("PersonalInfoForm: Toggled edit mode to true");
  };

  return (
    <div>
      <h4>Basic Details</h4>
      <div className="mt-3">
        <Form className="border p-3 rounded" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Personal Information</h5>
            {isEditing && !isEditable && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <Button variant="link" onClick={toggleEdit} className="p-0">
                  <EditOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
                </Button>
              </OverlayTrigger>
            )}
          </div>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Nathaniel Poole"
                  isInvalid={!!formErrors.name}
                  disabled={isEditing && !isEditable}
                />
                <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 28"
                  isInvalid={!!formErrors.age}
                  disabled={isEditing && !isEditable}
                />
                <Form.Control.Feedback type="invalid">{formErrors.age}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  isInvalid={!!formErrors.gender}
                  disabled={isEditing && !isEditable}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.gender}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +18001234567"
                  isInvalid={!!formErrors.phone}
                  disabled={isEditing && !isEditable}
                />
                <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., example@domain.com"
                  isInvalid={!!formErrors.email}
                  disabled={isEditing && !isEditable}
                />
                <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end">
            <Button type="submit" variant="primary" disabled={isEditing && !isEditable}>
              {isEditing ? "Save Changes" : "Save & Continue"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
 
 