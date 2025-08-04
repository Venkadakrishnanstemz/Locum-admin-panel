import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Form, Button, Row, Col } from "react-bootstrap";
import { fetchRoles } from "../../services/locationService"; // Make sure this fetches roles

const Role = ({ onNext, onBack, data }) => {
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const fetched = await fetchRoles();
        console.log("Fetched roles:", fetched);
        const activeRole = fetched.filter((role) => role.is_active === true);
        const formatted = activeRole.map((role) => ({
          value: role.id,
          label: role.name,
        }));
        setRoleOptions(formatted);

        // Prefill if data.userMenu exists
        if (data.userMenu && data.userMenu.length > 0) {
          const preSelected = formatted.filter((opt) =>
            data.userMenu.includes(opt.value)
          );
          setSelectedRoles(preSelected);
        }
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };

    loadRoles();
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    setError("");
    const roles = selectedRoles.map((i) => i.value)
    onNext({ ...data, roles: roles }); // Save as userMenu
  };

  return (
    <div>
      <div className="">
        <h4 className="">Role Details</h4>
      </div>

      <Form onSubmit={handleSubmit} className="border p-3 rounded shadow-sm">
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Roles</Form.Label>
              <Select
                isMulti
                options={roleOptions}
                value={selectedRoles}
                onChange={(selected) => setSelectedRoles(selected)}
                closeMenuOnSelect={false}
                placeholder="Select roles"
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

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary">
            Save & Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Role;



