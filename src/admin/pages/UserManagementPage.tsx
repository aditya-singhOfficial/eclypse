import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  deleteUser,
  assignAdminRole,
  revokeAdminRole,
  type AdminManagedUser
} from '../services/AdminUserApiService';
// import { Link } from 'react-router-dom'; // For edit user page navigation

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully.');
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  const handleToggleAdminRole = async (userId: string, isAdmin: boolean) => {
    const action = isAdmin ? 'revoke admin rights from' : 'grant admin rights to';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const updatedUser = isAdmin ? await revokeAdminRole(userId) : await assignAdminRole(userId);
        setUsers(users.map(user => (user._id === userId ? updatedUser : user)));
        alert(`Admin role ${isAdmin ? 'revoked' : 'assigned'} successfully.`);
      } catch (err) {
        console.error(`Failed to ${action} user:`, err);
        alert(`Failed to ${action} user.`);
      }
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>User Management</h1>
      {/* Add button to create new user if applicable */}
      {/* <Link to="/admin/users/new">Add New User</Link> */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Is Admin?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5}>No users found.</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  {/* <Link to={`/admin/users/edit/${user._id}`}>Edit</Link> */}
                  <button onClick={() => handleToggleAdminRole(user._id, user.isAdmin)} style={{marginRight: '5px'}}>
                    {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button onClick={() => handleDeleteUser(user._id)} style={{color: 'red'}}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;