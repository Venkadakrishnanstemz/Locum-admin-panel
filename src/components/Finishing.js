import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { info } from "../features/user"; 
import { fetchFeatures } from "../services/locationService"; 

const SelectFeature = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [features, setFeatures] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await fetchFeatures();
        console.log("Fetched features:", data);
        // setFeatures(data || []);
        setFeatures(data.data || []);

        const selected = (data || [])
          .filter((feature) =>
            (user.features || []).some((f) => f.id === feature.id)
          )
          .map((feature) => ({ value: feature.id, label: feature.name }));

        setSelectedOptions(selected);
      } catch (err) {
        console.error("Failed to load features:", err);
        setError(true);
      }
    };

    loadFeatures();
  }, []);

  useEffect(() => {
    const selectedFeatures = selectedOptions.map((opt) => ({
      id: opt.value,
      name: opt.label,
      selected: true,
    }));
    dispatch(info({ ...user, features: selectedFeatures }));
  }, [selectedOptions]);

  const options = features.map((feature) => ({
    value: feature.id,
    label: feature.name,
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI", maxWidth: "600px", margin: "auto" }}>
      <h2>Select Features</h2>
      <p>Select <strong>one</strong> or more features to assign to the user.</p>

      <label htmlFor="features" style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
        Features:
      </label>

      <Select
        id="features"
        isMulti
        options={options}
        value={selectedOptions}
        onChange={(selected) => setSelectedOptions(selected || [])}
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

export default SelectFeature;
