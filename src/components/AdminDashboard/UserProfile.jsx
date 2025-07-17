import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ user, onClose }) => {
  // State to manage user tasks
  // Use useState to fetch and display tasks for the selected user
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch tasks for the selected user from the server
    // Use axios to make a GET request with the token for authentication
    axios.get(`http://localhost:8080/admin/users/${user.id}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => setTasks(res.data))
    .catch(err => console.error('Error fetching user tasks:', err));
  }, [user.id, token]);

  return (
   <div className="user-profile">
 <div className="profile-header">
  <h3>🧑 {user.name}'s Tasks</h3>
  <button className="back-button" onClick={onClose}>← Back</button>
</div>

  <ul>
    {tasks.length === 0 ? (
      <p>No tasks available.</p>
    ) : (
      tasks.map(task => (
        <li key={task.id}>
          <strong>{task.title}</strong><br />
          Description: {task.description}<br />
          Due Date: {new Date(task.dueDate).toDateString()}<br />
          Created: {new Date(task.createdDate).toDateString()}
        </li>
      ))
    )}
  </ul>
</div>

  );
};

export default UserProfile;
