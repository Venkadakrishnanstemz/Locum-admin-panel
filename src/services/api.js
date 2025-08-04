import axios from "axios";

const API_BASE_URL = "http://192.168.60.118:8000/api"; // replace with your actual base URL

// ---------------------- MENU APIs ----------------------

export const fetchMenus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/masters/accounts/menumaster/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    throw error;
  }
};

export const createMenu = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/masters/accounts/menumaster/`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create menu:", error.response?.data || error);
    throw error;
  }
};

// ---------------------- SUBMENU APIs ----------------------

export const fetchSubMenus = async (menuId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/masters/accounts/submenumaster/${menuId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch submenus:", error);
    throw error;
  }
};

export const createSubMenu = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/masters/accounts/submenumaster/`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create submenu:", error.response?.data || error);
    throw error;
  }
};

// ---------------------- COMBINED MENU API ----------------------

export const fetchMenuData = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/masters/accounts/`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch combined menu:", error.response?.data || error);
    throw error;
  }
};

// ---------------------- DUMMY API EXAMPLES ----------------------

export const fetchMenuById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/menus/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch menu");
    return await res.json();
  } catch (error) {
    console.error("Error in fetchMenuById:", error);
    throw error;
  }
};

export const fetchSubMenuById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/submenus/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch submenu");
    return await res.json();
  } catch (error) {
    console.error("Error in fetchSubMenuById:", error);
    throw error;
  }
};




export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user/create_user`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};
export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user/create_user/${id}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch user by ID:", error);
    throw error;
  }
};
export const fetchUserByRole = async (ids) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user/create_user_role/`, {
      params: {
        ids: ids, // this can be an array like [1, 2, 3]
      },
      paramsSerializer: params => {
        return new URLSearchParams(params).toString();
      }
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch user by IDs:", error);
    throw error;
  }
};

export const fetchAllLocations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user/locations/`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
};

// Fetch all qualifications
export const fetchAllQualifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user/qualifications/`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch qualifications:", error);
    return [];
  }
};

// Fetch all Availability options
export const fetchAllAvailability = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user/availability/`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch availability options:", error);
    return [];
  }
}
// Fetch all roles
export const fetchAllRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user/roles/`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return [];
  }
}