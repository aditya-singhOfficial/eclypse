import axiosInstance from '../../services/api';

// Define Product and Category types based on your API response
// These might already exist in your main 'types' folder (e.g., src/types/productTypes.ts)
export interface AdminProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string; // or an object if category details are embedded
  stock: number;
  imageUrl?: string;
  // Add other relevant product fields like SKU, brand, tags, etc.
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  // Add other category fields
}

const PRODUCT_API_BASE_URL = '/products'; // Standard product endpoint
const CATEGORY_API_BASE_URL = '/categories'; // Assuming a separate endpoint for categories

// --- Product Management --- 

// Fetch all products (admin view might have more details or different filtering)
export const getAllAdminProducts = async (): Promise<AdminProduct[]> => {
  try {
    const response = await axiosInstance.get(`${PRODUCT_API_BASE_URL}/admin`); // Or just /products if no specific admin route
    return response.data.products || response.data; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching all admin products:', error);
    throw error;
  }
};

// Fetch a single product by ID (admin)
export const getAdminProductById = async (productId: string): Promise<AdminProduct> => {
  try {
    const response = await axiosInstance.get(`${PRODUCT_API_BASE_URL}/${productId}`);
    return response.data.product || response.data;
  } catch (error) {
    console.error(`Error fetching admin product ${productId}:`, error);
    throw error;
  }
};

// Create a new product (admin)
export const createAdminProduct = async (productData: Omit<AdminProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<AdminProduct> => {
  try {
    // Consider using FormData if image uploads are involved
    const response = await axiosInstance.post(`${PRODUCT_API_BASE_URL}`, productData);
    return response.data.product || response.data;
  } catch (error) {
    console.error('Error creating admin product:', error);
    throw error;
  }
};

// Update an existing product (admin)
export const updateAdminProduct = async (productId: string, productData: Partial<AdminProduct>): Promise<AdminProduct> => {
  try {
    // Consider using FormData if image uploads are involved
    const response = await axiosInstance.put(`${PRODUCT_API_BASE_URL}/${productId}`, productData);
    return response.data.product || response.data;
  } catch (error) {
    console.error(`Error updating admin product ${productId}:`, error);
    throw error;
  }
};

// Delete a product (admin)
export const deleteAdminProduct = async (productId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${PRODUCT_API_BASE_URL}/${productId}`);
  } catch (error) {
    console.error(`Error deleting admin product ${productId}:`, error);
    throw error;
  }
};

// --- Category Management (Example - adjust based on your API) ---

// Fetch all categories
export const getAllCategories = async (): Promise<AdminCategory[]> => {
  try {
    const response = await axiosInstance.get(`${CATEGORY_API_BASE_URL}`);
    return response.data.categories || response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData: { name: string }): Promise<AdminCategory> => {
  try {
    const response = await axiosInstance.post(`${CATEGORY_API_BASE_URL}`, categoryData);
    return response.data.category || response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (categoryId: string, categoryData: { name: string }): Promise<AdminCategory> => {
  try {
    const response = await axiosInstance.put(`${CATEGORY_API_BASE_URL}/${categoryId}`, categoryData);
    return response.data.category || response.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${CATEGORY_API_BASE_URL}/${categoryId}`);
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    throw error;
  }
};

// Note: Tag management would follow a similar pattern if supported by dedicated API endpoints.
// If tags are just a field in the product, they'd be managed via product update operations.