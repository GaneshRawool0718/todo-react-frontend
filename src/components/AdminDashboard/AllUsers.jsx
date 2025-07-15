import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsers = ({ onViewUser }) => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get('http://localhost:8080/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error('Error fetching users:', err));
  }, [token]);

  return (
    <div className="all-users-container">
      <h2>👥 All Users</h2>
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id}>
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email ID:</strong> {user.email}</p>
            </div>
            <button className="user-action-btn" onClick={() => onViewUser(user)}>
              View Tasks
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
