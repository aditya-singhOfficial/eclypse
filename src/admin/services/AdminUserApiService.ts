import axiosInstance from '../../services/api'; // Assuming a general API instance

// Define User types based on your API response
// This might already exist in your main 'types' folder, adjust as needed
export interface AdminManagedUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  // Add other relevant user fields
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = '/users'; // Adjust if your admin user routes are different, e.g., /admin/users

// Fetch all users (admin)
export const getAllUsers = async (): Promise<AdminManagedUser[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}`);
    return response.data.users || response.data; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Fetch a single user by ID (admin)
export const getUserById = async (userId: string): Promise<AdminManagedUser> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${userId}`);
    return response.data.user || response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Update user details (admin)
export const updateUser = async (userId: string, userData: Partial<AdminManagedUser>): Promise<AdminManagedUser> => {
  try {
    // The backend might expect specific fields, e.g., for role changes
    // Example: { isAdmin: true/false }
    const response = await axiosInstance.put(`${API_BASE_URL}/${userId}`, userData);
    return response.data.user || response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete a user (admin)
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${userId}`);
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// Assign admin role to a user
export const assignAdminRole = async (userId: string): Promise<AdminManagedUser> => {
  try {
    // Your API might have a specific endpoint or expect a certain payload for this
    // This is a common pattern: updating the user with isAdmin: true
    const response = await axiosInstance.put(`${API_BASE_URL}/${userId}/assign-admin`); // Or similar endpoint
    // Or: const response = await axiosInstance.put(`${API_BASE_URL}/${userId}`, { isAdmin: true });
    return response.data.user || response.data;
  } catch (error) {
    console.error(`Error assigning admin role to user ${userId}:`, error);
    throw error;
  }
};

// Revoke admin role from a user
export const revokeAdminRole = async (userId: string): Promise<AdminManagedUser> => {
  try {
    // Similar to assignAdminRole, adjust to your API's needs
    const response = await axiosInstance.put(`${API_BASE_URL}/${userId}/revoke-admin`); // Or similar endpoint
    // Or: const response = await axiosInstance.put(`${API_BASE_URL}/${userId}`, { isAdmin: false });
    return response.data.user || response.data;
  } catch (error) {
    console.error(`Error revoking admin role from user ${userId}:`, error);
    throw error;
  }
};