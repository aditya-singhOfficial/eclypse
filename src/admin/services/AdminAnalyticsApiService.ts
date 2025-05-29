import axiosInstance from '../../services/api';

// Define types for analytics data based on expected API responses or frontend calculations

export interface SalesOverTimeDataPoint {
  date: string; // e.g., 'YYYY-MM-DD' or 'YYYY-MM'
  totalSales: number;
}

export interface OrderCountDataPoint {
  date: string; // e.g., 'YYYY-MM-DD' or 'YYYY-MM'
  orderCount: number;
}

export interface UserRegistrationDataPoint {
  date: string; // e.g., 'YYYY-MM-DD' or 'YYYY-MM'
  userCount: number;
}

// Define a type for the API response
interface DashboardStatsResponse {
  stats: AdminDashboardStats;
}

export interface AdminDashboardStats {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  salesOverTime: SalesOverTimeDataPoint[];
  ordersOverTime: OrderCountDataPoint[];
  userRegistrationsOverTime: UserRegistrationDataPoint[];
  // Potentially other stats like top-selling products, recent orders, etc.
}

const API_BASE_URL = '/admin/stats'; // Assuming a dedicated endpoint for admin statistics

// Fetch overall dashboard statistics
export const getDashboardStats = async (): Promise<AdminDashboardStats> => {
  try {
    const response = await axiosInstance.get<DashboardStatsResponse>(`${API_BASE_URL}`); // Using 'any' for broader compatibility, consider a more specific type if API structure is fixed

    let rawStatsData: Partial<AdminDashboardStats> = {};

    if (response.data && typeof response.data === 'object') {
      if ('stats' in response.data && response.data.stats && typeof response.data.stats === 'object') {
        rawStatsData = response.data.stats;
      } else if ('data' in response.data && response.data.data && typeof response.data.data === 'object') { // Handle common { data: { ... } } wrapper
        rawStatsData = response.data.data;
      } else {
        // Assume response.data itself is the stats object if no common wrapper is found
        rawStatsData = response.data as unknown as Partial<AdminDashboardStats>;
      }
    }

    // Ensure all fields of AdminDashboardStats are present, providing defaults for type safety
    return {
      totalSales: typeof rawStatsData.totalSales === 'number' ? rawStatsData.totalSales : 0,
      totalOrders: typeof rawStatsData.totalOrders === 'number' ? rawStatsData.totalOrders : 0,
      totalUsers: typeof rawStatsData.totalUsers === 'number' ? rawStatsData.totalUsers : 0,
      totalProducts: typeof rawStatsData.totalProducts === 'number' ? rawStatsData.totalProducts : 0,
      salesOverTime: Array.isArray(rawStatsData.salesOverTime) ? rawStatsData.salesOverTime : [],
      ordersOverTime: Array.isArray(rawStatsData.ordersOverTime) ? rawStatsData.ordersOverTime : [],
      userRegistrationsOverTime: Array.isArray(rawStatsData.userRegistrationsOverTime) ? rawStatsData.userRegistrationsOverTime : [],
    };

  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    // Return a default state in case of an error to prevent UI breakage
    return {
      totalSales: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      salesOverTime: [],
      ordersOverTime: [],
      userRegistrationsOverTime: [],
    };
  }
};

// Example of more granular fetch functions if a single stats endpoint isn't available
// These would likely involve fetching all orders/users/products and processing on frontend or backend

export const getTotalSales = async (): Promise<number> => {
  try {
    // Replace with actual API call or calculation logic
    // const ordersResponse = await axiosInstance.get('/orders/admin/all');
    // const total = ordersResponse.data.orders.reduce((sum, order) => sum + order.totalPrice, 0);
    // return total;
    const response = await axiosInstance.get(`${API_BASE_URL}/total-sales`); // Example endpoint
    return response.data.totalSales;
  } catch (error) {
    console.error('Error fetching total sales:', error);
    throw error;
  }
};

// Add more functions as needed for specific analytics data points
// e.g., getSalesByPeriod, getNewUserRegistrations, etc.