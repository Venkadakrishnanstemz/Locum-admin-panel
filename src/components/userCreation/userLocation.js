// // import React, { useState, useEffect } from "react";
// // import Select from "react-select";
// // import { Form, Button, Row, Col } from "react-bootstrap";
// // import { fetchLocations } from "../../services/locationService"
 
// // const LocationForm = ({ onNext, onBack, data }) => {
// //   const [locationOptions, setLocationOptions] = useState([]);
// //   const [selectedOptions, setSelectedOptions] = useState([]);
// //   const [error, setError] = useState("");
 
// //   // Fetch locations and prefill
// //   useEffect(() => {
// //     const loadLocations = async () => {
// //       try {
// //         const fetched = await fetchLocations();
// //         console.log("Fetched locations:", fetched);
        
// //         const activeLocations = fetched.filter((loc) => loc.active === true);

// //         const formatted = activeLocations.map((loc) => ({
// //           value: loc.id,
// //           label: loc.name,
// //         }));
// //         setLocationOptions(formatted);
 
// //         // Prefill
// //         if (data.location && data.location.length > 0) {
// //           const preSelected = formatted.filter((opt) =>
// //             data.location.includes(opt.value)
// //           );
// //           setSelectedOptions(preSelected);
// //         }
// //       } catch (err) {
// //         console.error("Failed to load locations:", err);
// //       }
// //     };
 
// //     loadLocations();
// //   }, [data]);
 
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (selectedOptions.length === 0) {
// //       setError("Please select at least one location.");
// //       return;
// //     }
 
// //     setError("");
// //     const selectedIds = selectedOptions.map((opt) => opt.value);
// //     onNext({ ...data, location: selectedIds });
// //   };
 
// //   return (
// //     <div>
// //       <div className="">
// //         <h4>Location Details</h4>
// //       </div>
 
// //       <Form onSubmit={handleSubmit} className="border p-3 rounded shadow-sm">
// //         <Row className="mb-3">
// //           <Col md={12}>
// //             <Form.Group>
// //               <Form.Label>Locations</Form.Label>
// //               <Select
// //                 isMulti
// //                 options={locationOptions}
// //                 value={selectedOptions}
// //                 onChange={(selected) => setSelectedOptions(selected)}
// //                 closeMenuOnSelect={false}
// //                 placeholder="Select locations"
// //                 styles={{
// //                   control: (base) => ({
// //                     ...base,
// //                     padding: "5px",
// //                     borderRadius: "6px",
// //                     borderColor: error ? "red" : base.borderColor,
// //                   }),
// //                 }}
// //               />
// //               {error && (
// //                 <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
// //               )}
// //             </Form.Group>
// //           </Col>
// //         </Row>
 
// //         <div className="d-flex justify-content-between">
// //           <Button variant="secondary" onClick={onBack}>
// //             Back
// //           </Button>
// //           <Button type="submit" variant="primary">
// //             Save & Continue
// //           </Button>
// //         </div>
// //       </Form>
// //     </div>
// //   );
// // };
 
// // export default LocationForm;
// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { EditOutlined } from "@ant-design/icons";
// import { fetchLocations } from "../../services/locationService";

// const LocationForm = ({ onNext, onBack, data, isEditing, onChange }) => {
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [error, setError] = useState("");
//   const [isEditable, setIsEditable] = useState(false);

//   // Sync selectedOptions with parent data when it changes (e.g., for editing)
//   useEffect(() => {
//     const loadLocations = async () => {
//       try {
//         const fetched = await fetchLocations();
//         console.log("Fetched locations:", fetched);
        
//         const activeLocations = fetched.filter((loc) => loc.active === true);

//         const formatted = activeLocations.map((loc) => ({
//           value: loc.id,
//           label: loc.name,
//         }));
//         setLocationOptions(formatted);

//         // Prefill based on data prop
//         if (data.location && data.location.length > 0) {
//           const preSelected = formatted.filter((opt) =>
//             data.location.includes(opt.value)
//           );
//           setSelectedOptions(preSelected);
//           if (onChange && isEditing) {
//             onChange({ ...data, location: preSelected.map(opt => opt.value) });
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load locations:", err);
//       }
//     };

//     loadLocations();
//   }, [data, isEditing, onChange]);

//   const handleChange = (selected) => {
//     setSelectedOptions(selected);
//     if (onChange) {
//       onChange({ ...data, location: selected.map(opt => opt.value) });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedOptions.length === 0) {
//       setError("Please select at least one location.");
//       return;
//     }

//     setError("");
//     const selectedIds = selectedOptions.map((opt) => opt.value);
//     onNext({ ...data, location: selectedIds });
//     if (isEditing) {
//       setIsEditable(false); // Disable edit mode after submission in edit flow
//     }
//   };

//   const toggleEdit = () => {
//     setIsEditable(!isEditable);
//   };

//   return (
//     <div>
//       <div className="">
//         <h4>Location Details</h4>
//       </div>

//       <Form onSubmit={handleSubmit} className="border p-3 rounded shadow-sm">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5>Location Information</h5>
//           {isEditing && (
//             <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
//               <Button variant="link" onClick={toggleEdit} className="p-0">
//                 <EditOutlined style={{ fontSize: "18px", color: isEditable ? "#1890ff" : "#000" }} />
//               </Button>
//             </OverlayTrigger>
//           )}
//         </div>
//         <Row className="mb-3">
//           <Col md={12}>
//             <Form.Group>
//               <Form.Label>Locations</Form.Label>
//               <Select
//                 isMulti
//                 options={locationOptions}
//                 value={selectedOptions}
//                 onChange={handleChange}
//                 closeMenuOnSelect={false}
//                 placeholder="Select locations"
//                 isDisabled={!isEditable && isEditing}
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     padding: "5px",
//                     borderRadius: "6px",
//                     borderColor: error ? "red" : base.borderColor,
//                   }),
//                 }}
//               />
//               {error && (
//                 <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
//               )}
//             </Form.Group>
//           </Col>
//         </Row>

//         <div className="d-flex justify-content-between">
//           <Button variant="secondary" onClick={onBack}>
//             Back
//           </Button>
//           <Button type="submit" variant="primary" disabled={isEditing && !isEditable}>
//             {isEditing ? "Save Changes" : "Save & Continue"}
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default LocationForm;



import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { EditOutlined } from "@ant-design/icons";
import { fetchLocations } from "../../services/locationService";

const LocationForm = ({ onNext, onBack, data, isEditing, onChange }) => {
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  // Load locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const fetched = await fetchLocations();
        console.log("Fetched locations:", fetched);

        const activeLocations = fetched.filter((loc) => loc.active === true);
        const formatted = activeLocations.map((loc) => ({
          value: loc.id, // Ensure this matches the ID field from your API
          label: loc.name,
        }));
        setLocationOptions(formatted);
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };

    loadLocations();
  }, []);

  // Sync selectedOptions with parent data when it changes
  useEffect(() => {
    if (data.location && data.location.length > 0 && locationOptions.length > 0) {
      console.log("Data location:", data.location); // Debug the incoming data
      const preSelected = locationOptions.filter((opt) =>
        data.location.includes(opt.value)
      );
      console.log("Pre-selected options:", preSelected); // Debug pre-selected
      setSelectedOptions(preSelected);
      if (onChange && isEditing) {
        onChange({ ...data, location: preSelected.map(opt => opt.value) });
      }
    } else if (!data.location || data.location.length === 0) {
      setSelectedOptions([]); // Reset if no locations are provided
    }
  }, [data.location, locationOptions, isEditing, onChange]);

  const handleChange = (selected) => {
    const updatedSelected = selected || [];
    setSelectedOptions(updatedSelected);
    if (onChange) {
      onChange({ ...data, location: updatedSelected.map(opt => opt.value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      setError("Please select at least one location.");
      return;
    }

    setError("");
    const selectedIds = selectedOptions.map((opt) => opt.value);
    onNext({ ...data, location: selectedIds });
    if (isEditing) {
      setIsEditable(false); // Disable edit mode after submission in edit flow
    }
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div>
      <div className="">
        <h4>Location Details</h4>
      </div>

      <Form onSubmit={handleSubmit} className="border p-3 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Location Information</h5>
          {isEditing && (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Button variant="link" onClick={toggleEdit} className="p-0">
                <EditOutlined style={{ fontSize: "18px", color: isEditable ? "#1890ff" : "#000" }} />
              </Button>
            </OverlayTrigger>
          )}
        </div>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Locations</Form.Label>
              <Select
                isMulti
                options={locationOptions}
                value={selectedOptions}
                onChange={handleChange}
                closeMenuOnSelect={false}
                placeholder="Select locations"
                isDisabled={!isEditable && isEditing}
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: "5px",
                    borderRadius: "6px",
                    borderColor: error ? "red" : base.borderColor,
                  }),
                }}
              />
              {error && (
                <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" disabled={isEditing && !isEditable}>
            {isEditing ? "Save Changes" : "Save & Continue"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LocationForm;
 
 