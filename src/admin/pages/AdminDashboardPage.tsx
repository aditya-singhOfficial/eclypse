import React, { useEffect, useState, useMemo } from 'react';
import {
  getDashboardStats,
  type AdminDashboardStats
} from '../services/AdminAnalyticsApiService';
// Import a charting library, e.g., Recharts or Chart.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedStats = await getDashboardStats();
        setStats(fetchedStats);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
        // You could set mock data here for UI development if the API isn't ready
        // setStats({ totalSales: 12345, totalOrders: 150, totalUsers: 500, totalProducts: 75, salesOverTime: [], ordersOverTime: [], userRegistrationsOverTime: [] });
      }
      setIsLoading(false);
    };
    fetchStats();
  }, []);
  // Prepare data for the sales chart, memoizing to prevent recalculation on every render
  const salesData = useMemo(() => {
    if (!stats || !stats.salesOverTime) return []; // Return empty array if data is not available
    return [
      { name: 'Jan', sales: stats.salesOverTime.find(s => s.date.includes('-01-'))?.totalSales || 0 },
      { name: 'Feb', sales: stats.salesOverTime.find(s => s.date.includes('-02-'))?.totalSales || 0 },
      { name: 'Mar', sales: stats.salesOverTime.find(s => s.date.includes('-03-'))?.totalSales || 0 },
      { name: 'Apr', sales: stats.salesOverTime.find(s => s.date.includes('-04-'))?.totalSales || 0 },
      { name: 'May', sales: stats.salesOverTime.find(s => s.date.includes('-05-'))?.totalSales || 0 },
      { name: 'Jun', sales: stats.salesOverTime.find(s => s.date.includes('-06-'))?.totalSales || 0 },
      // You can extend this for more months or make it dynamic based on available data
    ];
  }, [stats]);
  if (isLoading) return <div>Loading dashboard data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!stats) return <div>No dashboard data available.</div>;




  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Here's an overview of your store:</p>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Total Sales</h2>
          <p style={{ fontSize: '2em' }}>${stats.totalSales.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Total Orders</h2>
          <p style={{ fontSize: '2em' }}>{stats.totalOrders}</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Total Users</h2>
          <p style={{ fontSize: '2em' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Total Products</h2>
          <p style={{ fontSize: '2em' }}>{stats.totalProducts}</p>
        </div>
      </div>

      <h2>Sales Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}> // Using the memoized salesData
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      {/* <p><em>Charting library (e.g., Recharts) integration needed for actual graph.</em></p> */}

      {/* Add more charts for ordersOverTime, userRegistrationsOverTime etc. */}
    </div>
  );
};

export default AdminDashboardPage;