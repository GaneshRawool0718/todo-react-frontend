import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProfile = () => {
  // State to manage admin profile data
  // Use useState to fetch and display admin profile information
  const [admin, setAdmin] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch admin profile data from the server
    // Use axios to make a GET request with the token for authentication
    axios.get('http://localhost:8080/admin/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => setAdmin(res.data))
    .catch(err => {
      console.error("Error fetching admin profile:", err);
      setAdmin(null);
    });
  }, [token]);

  if (!admin) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2>👤 Admin Profile</h2>
      <p><strong>Name:</strong> {admin.name}</p>
      <p><strong>Email:</strong> {admin.email}</p>
      {/* Add more fields like phone, role, etc. if available */}
    </div>
  );
};

export default AdminProfile;
