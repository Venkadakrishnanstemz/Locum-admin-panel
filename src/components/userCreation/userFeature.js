import React, { useEffect, useState } from "react";
import { Table, Checkbox } from "antd";
import { Button, Form, Row, Col } from "react-bootstrap";
import { fetchRights, fetchFeatures } from "../../services/locationService";
 
const Features = ({ onNext, onBack, data }) => {
  const [rights, setRights] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedFeatureRights, setSelectedFeatureRights] = useState({});
  const [error, setError] = useState("");
 
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rightsRes, featuresRes] = await Promise.all([
          fetchRights(),
          fetchFeatures(),
        ]);
        setRights(rightsRes?.data || []);
        setFeatures(featuresRes?.data || []);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data.");
      }
    };
    loadData();
  }, []);
 
  const toggleFeatureSelect = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };
 
  const toggleRightSelect = (featureId, rightId) => {
    const current = selectedFeatureRights[featureId] || [];
    const updated = current.includes(rightId)
      ? current.filter((r) => r !== rightId)
      : [...current, rightId];
 
    setSelectedFeatureRights((prev) => ({
      ...prev,
      [featureId]: updated,
    }));
  };
 
  const getTableColumns = () => [
    {
      title: "Select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedFeatures.includes(record.id)}
          onChange={() => toggleFeatureSelect(record.id)}
        />
      ),
      width: 60,
    },
    {
      title: "Feature",
      dataIndex: "display_name",
      key: "display_name",
    },
    ...rights.map((right) => ({
      title: right.display_name,
      key: `right-${right.id}`,
      render: (_, record) => (
        <Checkbox
          checked={selectedFeatureRights[record.id]?.includes(right.id) || false}
          onChange={() => toggleRightSelect(record.id, right.id)}
          disabled={!selectedFeatures.includes(record.id)}
        />
      ),
    })),
  ];
 
  const getTableData = () =>
    features.map((f) => ({
      ...f,
      key: f.id,
    }));
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (selectedFeatures.length === 0) {
      setError("Please select at least one feature.");
      return;
    }
 
    // Transform to required payload structure for features
    const featuresPayload = selectedFeatures.map((featureId) => ({
      feature: featureId,
      rights: selectedFeatureRights[featureId] || [],
    }));
 
    const payload = {
      ...data,
      user_features: featuresPayload,
    };
 
    setError("");
    onNext(payload);
  };
 
  return (
    <div>
      <h4 className="mb-3">Feature Rights Mapping</h4>
 
      <Form onSubmit={handleSubmit} className="border p-3 rounded shadow-sm">
        <Row className="mb-4">
          <Col>
            <div style={{ height: 300, overflow: "auto" }}>
              <Table
                dataSource={getTableData()}
                columns={getTableColumns()}
                pagination={false}
                size="small"
                rowKey="key"
                scroll={{ x: "max-content" }}
              />
            </div>
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
 
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </div>
  );
};
 
export default Features;
 