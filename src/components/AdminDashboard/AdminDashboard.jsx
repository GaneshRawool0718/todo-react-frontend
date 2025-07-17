import React, { useState } from 'react';
import AdminProfile from './AdminProfile';
import AllUsers from './AllUsers';
import UserProfile from './UserProfile';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // State to manage the current view in the dashboard
  // Use useState to switch between admin profile, all users, and user profile views
  const [view, setView] = useState('users'); // default view
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewUser = (user) => {
    // Set the selected user and switch to user profile view
    // Use the user object to display detailed information
    setSelectedUser(user);
    setView('userProfile');
  };

  const handleCloseProfile = () => {
    // Close the user profile view and return to the users list
    // Reset selected user and switch back to users view
    setSelectedUser(null);
    setView('users');
  };
  const handleLogout = () => {
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (confirmed) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  }
};


  return (
    <div className="dashboard-container">
      <h1>🔧 Admin Dashboard</h1>
      <div className="top-bar">
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  </div>
      <div className="dashboard-buttons">
        <button onClick={() => setView('admin')}>Admin Profile</button>
        <button onClick={() => setView('users')}>View All Users</button>
      </div>
    
      {view === 'admin' && <AdminProfile />}
      {view === 'users' && <AllUsers onViewUser={handleViewUser} />}
      {view === 'userProfile' && selectedUser && (
        <UserProfile user={selectedUser} onClose={handleCloseProfile} />
      )}
    </div>
  );
};

export default AdminDashboard;
