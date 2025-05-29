import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/users', label: 'User Management' },
  { path: '/admin/products', label: 'Product Management' },
  { path: '/admin/orders', label: 'Order Management' },
];

const AdminLayout: React.FC = () => {
  const { logout, admin } = useAdminAuth();
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  const navLinkVariants = {
    hover: { scale: 1.05, color: '#818cf8', transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <motion.aside
        className="w-64 bg-gray-800 p-6 space-y-6 shadow-lg flex flex-col"
        initial="open"
        animate="open" // Can be controlled by state for toggleable sidebar
        variants={sidebarVariants}
      >
        <div className="text-2xl font-semibold text-indigo-400">Eclypse Admin</div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <motion.div whileHover="hover" whileTap="tap" variants={navLinkVariants}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2.5 rounded-lg transition-colors duration-200 
                                ${location.pathname === item.path 
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'hover:bg-gray-700 hover:text-indigo-300'
                                }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pt-4 border-t border-gray-700">
          {admin && (
            <div className="mb-4 text-sm">
              <p className="font-medium">Welcome,</p>
              <p className="text-indigo-300 truncate">{admin.email}</p>
            </div>
          )}
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.05, backgroundColor: '#ef4444' }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200 shadow-md"
          >
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 shadow-md p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-200">Admin Panel</h1>
            {/* Add any header controls here, e.g., search bar, notifications */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          <motion.div
            key={location.pathname} // Animate on route change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;