
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Table, Button, Modal, Input, Checkbox, Tooltip, Form, Switch, message, AutoComplete } from "antd";
import { SearchOutlined, EyeOutlined, EditOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchLocations, postLocation, fetchLocationsById, postLocationsById, fetchScreenLabelById } from "../../services/locationService";

const LocationScreen = () => {
  const [locations, setLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [locationActive, setLocationActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [labels, setLabels] = useState({});
  const [locationRights, setLocationRights] = useState([]);

  // Load labels
  const loadLabel = async () => {
    try {
      const data = await fetchScreenLabelById(2);
      if (data && data.labelconfig) {
        setLabels(data.labelconfig);
        console.log("Labels loaded:", data.labelconfig);
      } else {
        console.error("labelconfig missing in response");
      }
    } catch (error) {
      console.error("Failed to load screen labels:", error);
    }
  };

  // Load locations
  const loadLocations = async () => {
    setLoading(true);
    try {
      const data = await fetchLocations();
      setAllLocations(data);
      setLocations(data);
    } catch (error) {
      message.error("Failed to fetch locations");
    }
    setLoading(false);
  };

  // Load rights for Location submenu
  useEffect(() => {
    loadLabel();
    loadLocations();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role_menu_mapping) {
        const mastersMenu = user.role_menu_mapping.find(menu => menu.alias_name === "masters");
        if (mastersMenu && mastersMenu.sub_menus) {
          const locationSubmenu = mastersMenu.sub_menus.find(submenu => submenu.alias_name === "location");
          if (locationSubmenu && locationSubmenu.rights) {
            const rights = locationSubmenu.rights.map(right => right.right_name);
            console.log("Rights:", rights);
            setLocationRights(rights);
            console.log("Location Rights:", rights);
          } else {
            console.warn("No rights or location submenu found");
            setLocationRights([]);
          }
        } else {
          console.warn("No masters menu or sub_menus found");
          setLocationRights([]);
        }
      } else {
        console.warn("No user or role_menu_mapping found in localStorage");
        setLocationRights([]);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setLocationRights([]);
    }
  }, []);

  const handleAddLocation = async () => {
    if (!locationName.trim() || !locationCode.trim()) {
      message.warning(labels?.requiredMessage || "Location name and code required");
      return;
    }
    if (locations.some(l => l.name === locationName.trim() && l.code === locationCode.trim())) {
      message.warning(labels?.duplicateMessage || "Duplicate location");
      return;
    }
    try {
      await postLocation({
        name: locationName.trim(),
        code: locationCode.trim(),
        active: locationActive,
      });
      setLocationName("");
      setLocationCode("");
      setLocationActive(true);
      setModalOpen(false);
      message.success(labels?.addSuccess || "Location added!");
      loadLocations();
    } catch (error) {
      message.error(labels?.addFail || "Failed to add location");
    }
  };

  const handleEditLocation = async () => {
    if (!locationName.trim() || !locationCode.trim()) {
      message.warning(labels?.requiredMessage || "Location name and code required");
      return;
    }
    try {
      setLoading(true);
      const updatedData = await postLocationsById(selectedLocation?.id, {
        name: locationName.trim(),
        code: locationCode.trim(),
        active: locationActive,
      });
      setLocations(prev =>
        prev.map(item =>
          item.id === selectedLocation.id ? { ...item, ...updatedData } : item
        )
      );
      setAllLocations(prev =>
        prev.map(item =>
          item.id === selectedLocation.id ? { ...item, ...updatedData } : item
        )
      );
      message.success(labels?.updateSuccess || "Location updated!");
      setEditModalOpen(false);
      setSelectedLocation(null);
      setLocationName("");
      setLocationCode("");
      setLocationActive(true);
    } catch (error) {
      message.error(labels?.updateFail || "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (location) => {
    try {
      setLoading(true);
      const freshLocation = await postLocationsById(location.id);
      setSelectedLocation(freshLocation);
      setLocationName(freshLocation.name);
      setLocationCode(freshLocation.code);
      setLocationActive(freshLocation.active);
      setEditModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch location details");
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (location) => {
    try {
      setLoading(true);
      const freshLocation = await fetchLocationsById(location.id);
      setSelectedLocation(freshLocation);
      setViewModalOpen(true);
    } catch (error) {
      message.error(labels?.fetchFail || "Failed to fetch location details");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = (id) => {
    setLocations(locations.map(l =>
      l.id === id ? { ...l, active: !l.active } : l
    ));
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    const options = allLocations
      .filter(loc => loc.name.toLowerCase().includes(value.toLowerCase()))
      .map(loc => ({ value: loc.name }));
    setFilteredOptions(options);
    if (value) {
      const filteredTable = allLocations.filter(loc =>
        loc.name.toLowerCase().includes(value.toLowerCase())
      );
      setLocations(filteredTable);
    } else {
      setLocations(allLocations);
    }
  };

  const handleDownloadExcel = () => {
    if (locations.length === 0) {
      message.warning(labels?.noDataExport || "No locations to export.");
      return;
    }
    const data = locations.map(loc => ({
      [labels?.locationName]: loc.name,
      [labels?.locationCode]: loc.code,
      [labels?.status]: loc.active ? (labels?.active) : (labels?.inactive),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedDateTime = `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    const filename = `Locations_${formattedDateTime}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const columns = [
    { title: labels?.location_name, dataIndex: "name", key: "name" },
    { title: labels?.location_code, dataIndex: "code", key: "code" },
    {
      title: labels?.is_active,
      key: "active",
      render: (_, record) => (
        <Switch
          checked={record.active}
          disabled
          onChange={() => handleToggleActive(record.id)}
          checkedChildren={labels?.active}
          unCheckedChildren={labels?.inactive}
        />
      ),
    },
    {
      title: labels?.actions,
      key: "actions",
      render: (_, record) => (
        <>
          {locationRights.includes("edit") && (
            <Tooltip title={labels?.edit}>
              <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
            </Tooltip>
          )}
          {locationRights.includes("View") && (
            <Tooltip title={labels?.view}>
              <Button type="link" icon={<EyeOutlined />} onClick={() => openViewModal(record)} />
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
        <h2 style={{ margin: 0, flex: 1 }}>{labels?.headerName}</h2>

        {locationRights.includes("search") && (
          <>
            {searchExpanded ? (
              <AutoComplete
                style={{ width: 200, marginRight: 8 }}
                options={filteredOptions}
                value={searchValue}
                onChange={handleSearch}
                onSelect={(value) => {
                  const selected = allLocations.filter(loc => loc.name === value);
                  setLocations(selected);
                  setSearchValue(value);
                  setFilteredOptions([]);
                }}
                placeholder={labels?.searchPlaceholder}
                allowClear
                onBlur={() => setSearchExpanded(false)}
                autoFocus
              />
            ) : (
              <Tooltip title={labels?.search}>
                <Button icon={<SearchOutlined />} style={{ marginRight: 8 }} onClick={() => setSearchExpanded(true)} />
              </Tooltip>
            )}
          </>
        )}

        {locationRights.includes("download") && (
          <Tooltip title={labels?.export}>
            <Button onClick={handleDownloadExcel} style={{ marginRight: 8 }} icon={<DownloadOutlined />} />
          </Tooltip>
        )}

        {locationRights.includes("add") && (
          <Tooltip title={labels?.add}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setLocationName("");
                setLocationCode("");
                setLocationActive(true);
                setModalOpen(true);
              }}
            />
          </Tooltip>
        )}
      </div>

      <Table
        dataSource={locations}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      {/* Add Modal */}
      {locationRights.includes("add") && (
        <Modal
          open={modalOpen}
          title={labels?.add_location?.headerName}
          onCancel={() => setModalOpen(false)}
          onOk={handleAddLocation}
          okText={labels?.add_location?.submitbutton}
        >
          <Form layout="vertical">
            <Form.Item label={labels?.add_location?.location_name} required>
              <AutoComplete
                value={locationName}
                onChange={(text) => {
                  setLocationName(text);
                  const filtered = allLocations
                    .filter(loc => loc.name.toLowerCase().includes(text.toLowerCase()))
                    .map(loc => ({ value: loc.name }));
                  setModalOptions(filtered);
                }}
                onSelect={(value) => setLocationName(value)}
                options={modalOptions}
                placeholder={labels?.locationNamePlaceholder}
              />
            </Form.Item>
            <Form.Item label={labels?.add_location?.location_code} required>
              <Input
                value={locationCode}
                onChange={e => setLocationCode(e.target.value)}
                placeholder={labels?.locationCodePlaceholder}
              />
            </Form.Item>
            <Form.Item required>
              <Checkbox checked={locationActive} onChange={e => setLocationActive(e.target.checked)}>
                {labels?.add_location?.is_active}
              </Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Edit Modal */}
      {locationRights.includes("edit") && (
        <Modal
          open={editModalOpen}
          title={labels?.edit_location?.headerName}
          onCancel={() => setEditModalOpen(false)}
          onOk={handleEditLocation}
          okText={labels?.edit_location?.submitbutton}
        >
          <Form layout="vertical">
            <Form.Item label={labels?.edit_location?.location_name} required>
              <Input value={locationName} onChange={e => setLocationName(e.target.value)} />
            </Form.Item>
            <Form.Item label={labels?.edit_location?.location_code} required>
              <Input value={locationCode} onChange={e => setLocationCode(e.target.value)} />
            </Form.Item>
            <Checkbox checked={locationActive} onChange={e => setLocationActive(e.target.checked)}>
              {labels?.edit_location?.is_active}
            </Checkbox>
          </Form>
        </Modal>
      )}

      {/* View Modal */}
      {locationRights.includes("view") && (
        <Modal
          open={viewModalOpen}
          title={labels?.view_location?.headerName || "View Location"}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
        >
          {selectedLocation && (
            <Form layout="vertical">
              <Form.Item label={labels?.view_location?.location_name || "Location Name"}>
                <Input value={selectedLocation?.name} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_location?.location_code || "Location Code"}>
                <Input value={selectedLocation?.code} disabled />
              </Form.Item>
              <Form.Item label={labels?.view_location?.is_active || "Active Status"}>
                <Checkbox checked={selectedLocation?.active} disabled>
                  {selectedLocation?.active ? (labels?.active || "Active") : (labels?.inactive || "Inactive")}
                </Checkbox>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default LocationScreen;