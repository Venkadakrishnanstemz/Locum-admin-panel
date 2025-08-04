import axios from "axios";
import { setTokens } from "./auth_utils";
import { decryptAES, encryptAES } from "./utils";
const API_BASE_URL = "http://192.168.60.118:8000/api"; // change to your production URL when needed

//---List Locations
export const fetchLocations = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/locations/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    throw error;
  }
};
// --- Create Location
export const postLocation = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/locations/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to post role:", error.response?.data || error);
    throw error;
  }
};
// --- GET Location by ID

export const fetchLocationsById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/locations/${id}/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    throw error;
  }
};
// --- Update Location by ID
export const postLocationsById = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/locations/${id}/`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    throw error;
  }
};
// --- ROLE APIs ---
// Create Role
export const postRole = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/roles/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to post role:", error.response?.data || error);
    throw error;
  }
};
// -list role
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/masters/accounts/roles/`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
};
// list role by ID
export const fetchRolesByID = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/roles/${id}/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
};
// Update Role by ID
export const UpdateRolesByID = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/roles/${id}/`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
};
// --- RIGHTS  APIs ---
// Get all rights
export const fetchRights = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/rights/`
    );
    return response.data; // adjust if backend wraps data
  } catch (error) {
    console.error("Failed to fetch rights:", error);
    throw error;
  }
};

// Create new right (POST)
export const createRight = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/rights/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create right:", error);
    throw error;
  }
};

// Get right by ID
export const fetchRightById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/rights/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch right by ID:", error);
    throw error;
  }
};

// Update right by ID (PUT)
export const updateRightById = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/rights/${id}/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update right:", error);
    throw error;
  }
};

// Delete right by ID
export const deleteRightById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete right:", error);
    throw error;
  }
};

// Get all features
export const fetchFeatures = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/features/`
    );
    return response.data; // adjust if your backend wraps data in `data` key
  } catch (error) {
    console.error("Failed to fetch features:", error);
    throw error;
  }
};

// Create new feature (POST)
export const createFeature = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/features/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create feature:", error);
    throw error;
  }
};

// Get feature by ID
export const fetchFeatureById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/features/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch feature with ID ${id}:`, error);
    throw error;
  }
};

// Update feature by ID (PUT)
export const updateFeatureById = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/features/${id}/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update feature with ID ${id}:`, error);
    throw error;
  }
};

// Delete feature by ID
export const deleteFeatureById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete feature with ID ${id}:`, error);
    throw error;
  }
};
// --- MENU APIs ---
// Fetch all menus
export const fetchMenus = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/menumaster/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    throw error;
  }
};
// Create new menu

export const createMenu = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/menumaster/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create menu:", error.response?.data || error);
    throw error;
  }
};

// Update menu by ID
export const updateMenu = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/menumaster/${id}/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update menu:", error.response?.data || error);
    throw error;
  }
};

// Fetch menu by ID
export const fetchMenuById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/menumaster/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch menu by ID:", error);
    throw error;
  }
};

// --- SUBMENU APIs ---
// Fetch all submenus
export const fetchSubMenus = async (menuId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/submenumaster/${menuId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch submenus:", error);
    throw error;
  }
};

// Create new submenu

export const createSubMenu = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/submenumaster/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create submenu:", error.response?.data || error);
    throw error;
  }
};
// Update submenu by ID
export const updateSubMenu = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/submenumaster/detail/${id}/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update submenu:", error.response?.data || error);
    throw error;
  }
};
// Fetch submenu by ID
export const fetchSubMenuById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/submenumaster/detail/${id}/`
    );
    return response.data;
    console.log("response", response);
  } catch (error) {
    console.error("Failed to fetch submenu by ID:", error);
    throw error;
  }
};
// Fetch screen label by ID

export const fetchScreenLabelById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/form-label-config/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch screen label with id "${id}":`, error);
    throw error;
  }
};

// list screen labels
export const fetchAllScreenLabels = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/form-label-config/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching screen labels:", error);
    throw error.response?.data || error;
  }
};

//createScreenLabel
// This function creates a new screen label by sending a POST request with the provided payload.
export const createScreenLabel = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/form-label-config/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating screen label:", error);
    throw error.response?.data || error;
  }
};
// updateScreenLabel by ID
export const updateScreenLabel = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/form-label-config/${id}/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating screen label with ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// PostmenuMapping
export const createMenuMapping = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/rolemapping/`,
      payload
    );
    return response.data;
    console.log("response", response.data);
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};

//getMenuMapping
export const fetchMenuMapping = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/rolemapping/`
    );
    return response.data;
    console.log("response", response.data);
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};

//updateMenuMapping
export const updateMenuMapping = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/rolemapping/${id}/`,
      payload
    );
    return response.data;
    console.log("response", response.data);
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};

//fetchMenuMappingbyid
export const fetchMenuMappingId = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/rolemapping/role/${id}/`
    );
    return response.data;
    console.log("response", response.data);
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};

//fetchfeaturemapping
export const fetchFeatureMapping = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/role-feature-mapping/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};

// Createfeaturemapping
export const createFeatureMapping = async (id, payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/role-feature-mapping/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};

//updatefeature Mapping

export const updateFeatureMapping = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/masters/accounts/role-feature-mapping/${id}/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};
//fetch  feature mapping by id
export const fetchFeatureMappingId = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/role-feature-mapping/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post menu mapping:", error);
    throw error.response?.data || error;
  }
};
// --- USER APIs ---
// Login user token generation
export const loginUser = async (email, password) => {
  const payload = {
    email: email,
    password: password,
    paneltype: "admin",
  };

  const encrypted = encryptAES(payload);

  const response = await axios.post(
    `${API_BASE_URL}/auth/token/`,
    {
      data: encrypted,
    },
    {
      headers: {
        // Explicitly remove Authorization if previously set globally
        Authorization: undefined,
      },
    }
  );
console.log(response);

  const decrypted = decryptAES(response.data.user);
  console.log("decrypted", decrypted);
  response.data["user"] = decrypted;
  console.log(response.data);
  setTokens(response.data.access, response.data.refresh);
  const response1 = await axios.post(
    `${API_BASE_URL}/masters/accounts/getuserinfo/`,
    {
      userid: response.data.user.id,
    }
  );
  const data1 = response.data;
  const data2 = response1.data;

  return { data1, data2 };
};

// Login user
export const Finalizedlogin = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/log/insertloginlog/`,
      data
    );
    console.log(response,"response");
    
    return response;
  } catch (error) {
    console.error("Error fetching user-specific menu:", error);
    throw error.response?.data || error;
  }
};

//create the user
export const createUser = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/userinfo/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error.response?.data || error;
  }
};

// List users all
export const getuser = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/masters/accounts/userinfo/`
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error.response?.data || error;
  }
};

// update user by id 

export const updateUser = async (id,payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/accounts/userinfo/${id}/`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error.response?.data || error;
  }
};
// delete user by id


// logout user

export const logoutUI = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/masters/log/UIlogout/`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error fetching user-specific menu:", error);
    throw error.response?.data || error;
  }
};
