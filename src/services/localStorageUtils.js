// src/utils/localStorageUtils.js

// Get item from localStorage
export const getLocalStorageItem = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : value;
  } catch (err) {
    console.error(`Error parsing localStorage key "${key}"`, err);
    return null;
  }
};

// Set item in localStorage
export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting localStorage key "${key}"`, err);
  }
};

// Remove item from localStorage
export const removeLocalStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing localStorage key "${key}"`, err);
  }
};
