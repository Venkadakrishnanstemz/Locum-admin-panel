import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Card, ProgressBar } from "react-bootstrap";
import { EditOutlined } from "@ant-design/icons";
import { FaMapMarkerAlt, FaBriefcase, FaStar, FaLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { createUser, updateUser } from "../../services/locationService";
import { message } from "antd";
import PersonalInfoForm from "./personalInfoForm";
import LocationForm from "./userLocation";
import Role from "./userRole";
import FeatureForm from "./userFeature";
import PasswordForm from "./userPassword";
import "./userMain.css";

const stepKeyMap = {
  1: "general",
  2: "location",
  3: "role",
  4: "feature",
  5: "password",
};

const totalSteps = Object.keys(stepKeyMap).length;

console.log("Step Key Map:", totalSteps);

const UserMain = () => {
  const [activeKey, setActiveKey] = useState("general");
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [formPayload, setFormPayload] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const user = state?.user || null;
  const isCreating = state?.isCreating || false;

  const isEditing = !!user && !isCreating;

  useEffect(() => {
    if (user && !isCreating) {
      setFormPayload({
        name: user.name,
        role: user.role,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        email: user.mailid,
        isActive: user.isActive,
      });
      setStep(1);
      setActiveKey("general");
    } else if (isCreating) {
      setFormPayload({
        name: "",
        role: "",
        gender: "",
        phoneNumber: "",
        email: "",
        isActive: true,
      });
      setStep(1);
      setActiveKey("general");
    }
  }, [user, isCreating]);

  const handleNext = (data) => {
    setFormPayload((prev) => ({ ...prev, ...data }));

    if (step < totalSteps) {
      setCompletedSteps((prev) => Math.min(prev + 1, totalSteps));
    }

    const nextStep = step + 1;
    setStep(nextStep);
    setActiveKey(stepKeyMap[nextStep]);
  };

  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    setActiveKey(stepKeyMap[prevStep]);
  };

  const handleSubmit = async () => {
    const payload = {
      name: formPayload.name,
      role: formPayload.role,
      gender: formPayload.gender,
      phone_number: formPayload.phoneNumber,
      email: formPayload.email,
      is_active: formPayload.isActive,
    };

    try {
      if (isCreating) {
        const response = await createUser(payload);
        const newUser = {
          ...payload,
          key: response?.id || Date.now(),
        };
        setCompletedSteps(totalSteps); // Set progress to 100% on success
        message.success("User created successfully");
        navigate("/");
      } else if (user) {
        await updateUser(user.key, payload);
        setCompletedSteps(totalSteps); // Set progress to 100% on success
        message.success("User info updated successfully");
        navigate("/");
      }
    } catch (err) {
      message.error("Failed to submit user info");
    }
  };

  const progress = Math.floor((completedSteps / totalSteps) * 100);

  return (
    <Container fluid className="px-0">
      <Row className="g-0">
        <h5 className="ms-2">Account Settings</h5>
        {/* Sidebar */}
        <Col
          md={3}
          className="bg-white border p-3"
          style={{ height: "100vh", borderRadius: "10px" }}
        >
          <h5 className="ms-2">Profile</h5>

          <div className="w-100 px-2 mb-3">
            <ProgressBar now={progress} label={`${progress}%`} />
          </div>

          <Nav variant="pills" activeKey={activeKey} className="flex-column">
            <Nav.Link eventKey="general" className="d-flex align-items-center" disabled>
              <EditOutlined style={{ marginRight: "8px", color: isEditing ? "#1890ff" : "inherit" }} /> Personal Information
            </Nav.Link>

            <Nav.Link eventKey="location" className="d-flex align-items-center" disabled>
              <FaMapMarkerAlt className="me-2" /> Location
            </Nav.Link>

            <Nav.Link eventKey="role" className="d-flex align-items-center" disabled>
              <FaBriefcase className="me-2" /> Role
            </Nav.Link>

            <Nav.Link eventKey="feature" className="d-flex align-items-center" disabled>
              <FaStar className="me-2" /> Features
            </Nav.Link>

            <Nav.Link eventKey="password" className="d-flex align-items-center" disabled>
              <FaLock className="me-2" /> Set Password
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Section */}
        <Col md={9} className="bg-light" style={{ height: "100vh", borderRadius: "10px" }}>
          <div className="pt-3 px-3">
            <div className="account-title">Account Setup</div>
            <div className="account-description">
              Please complete the following steps to set up your account.
            </div>

            <Card className="shadow-sm">
              <Card.Body>
                {step === 1 && (
                  <PersonalInfoForm
                    onNext={handleNext}
                    data={formPayload}
                    isEditing={isEditing}
                    onChange={(data) => setFormPayload((prev) => ({ ...prev, ...data }))}
                  />
                )}
                {step === 2 && (
                  <LocationForm
                    onNext={handleNext}
                    onBack={handleBack}
                    data={formPayload}
                    isEditing={isEditing}
                    onChange={(data) => setFormPayload((prev) => ({ ...prev, ...data }))}
                  />
                )}
                {step === 3 && (
                  <Role
                    onNext={handleNext}
                    onBack={handleBack}
                    data={formPayload}
                    isEditing={isEditing}
                    onChange={(data) => setFormPayload((prev) => ({ ...prev, ...data }))}
                  />
                )}
                {step === 4 && (
                  <FeatureForm
                    onNext={handleNext}
                    onBack={handleBack}
                    data={formPayload}
                    isEditing={isEditing}
                    onChange={(data) => setFormPayload((prev) => ({ ...prev, ...data }))}
                  />
                )}
                {step === 5 && (
                  <PasswordForm
                    onNext={handleNext}
                    onBack={handleBack}
                    data={formPayload}
                    isEditing={isEditing}
                    onChange={(data) => setFormPayload((prev) => ({ ...prev, ...data }))}
                    onSubmit={handleSubmit}
                  />
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserMain;

