import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { createUser } from "../../services/locationService";

const SetPassword = ({ onBack, data, onSubmit, isSubmitting }) => {
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validationRules = [
    { test: (pwd) => pwd.length >= 8, label: "At least 8 characters" },
    { test: (pwd) => /[A-Z]/.test(pwd), label: "Contains uppercase letter" },
    { test: (pwd) => /[a-z]/.test(pwd), label: "Contains lowercase letter" },
    { test: (pwd) => /[0-9]/.test(pwd), label: "Contains number" },
    { test: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd), label: "Contains special character" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const failedRule = validationRules.find((rule) => !rule.test(passwords.password));
    if (failedRule) return setError(`Password must satisfy: ${failedRule.label}`);

    if (!passwords.password || !passwords.confirmPassword) {
      return setError("Both fields are required.");
    }

    if (passwords.password !== passwords.confirmPassword) {
      return setError("Passwords do not match.");
    }

    const fullPayload = {
      ...data,
      password: passwords.password,
    };

    try {
      setLoading(true);
      await createUser(fullPayload);
      setSuccess(true);
      console.log("SetPassword: Triggering onSubmit");
      onSubmit(); // Call onSubmit to trigger handleSubmit in UserMain
    } catch (err) {
      setError(err.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthPercent = () => {
    const passed = validationRules.filter((r) => r.test(passwords.password)).length;
    return (passed / validationRules.length) * 100;
  };

  return (
    <div>
      <div className="">
        <h4 className="">Create Password</h4>
      </div>

      <Form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-white">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">User created successfully!</Alert>}

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={passwords.password}
              onChange={handleChange}
              placeholder="Enter password"
              isInvalid={!!error}
              disabled={isSubmitting}
            />
            <Button variant="outline-secondary" onClick={toggleShowPassword} disabled={isSubmitting}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-4">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            isInvalid={!!error}
            disabled={isSubmitting}
          />
        </Form.Group>

        <div className="mb-4">
          {validationRules.map((rule, idx) => (
            <div
              key={idx}
              variant={rule.test(passwords.password) ? "success" : "light"}
              className="d-flex align-items-center"
            >
              <span className="me-2" style={{ fontSize: "1.2em" }}>
                {rule.test(passwords.password) ? "✔" : "✘"}
              </span>
              {rule.label}
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={onBack} disabled={loading || isSubmitting}>
            Back
          </Button>
          <Button type="submit" variant="primary" disabled={loading || isSubmitting}>
            {loading || isSubmitting ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SetPassword;