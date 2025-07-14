import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoApp.css';

const TodoApp = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch user tasks on load
  // Use useEffect to fetch tasks when the component mounts or user changes

  useEffect(() => {
    if (user?.id && token) {
      fetch(`http://localhost:8080/user/tasks?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch tasks");
          return res.json();
        })
        .then((data) => setTasks(data))
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, [user?.id, token]);

  // Handle task submission
  // Ensure user is authenticated before adding a task
  const handleAdd = async () => {
    // Validate input fields
    if (!title || !desc || !dueDate) return;

    if (!user?.id || !token) {
      // If user is not authenticated, show an alert
      alert("User not authenticated. Please log in.");
      return;
    }

    // Prepare task payload
    const taskPayload = {
      title,
      description: desc,
      dueDate,
      userId: user.id,
    };

    try {
      const res = await fetch("http://localhost:8080/user/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskPayload),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle('');
      setDesc('');
      setDueDate('');
    } catch (err) {
      console.error("Add Task Error:", err);
      alert("Error while adding task.");
    }
  };

  const goToDashboard = () => {
    // Navigate to the tasks dashboard with the current tasks
    if (tasks.length > 0) {
      navigate('/tasks', { state: { tasks } });
    } else {
      alert('No tasks found!');
    }
  };

  const lastTask = tasks[tasks.length - 1];

  // Render the TodoApp component
  return (
    <div className="todo-container">
      <h2 className="todo-heading">📝 <span>To Do List</span></h2>

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="add-btn-container">
        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>

      {lastTask && (
        <div className="task-card">
          <h4><strong>Title:</strong> {lastTask.title}</h4>
          <p><strong>Description:</strong> {lastTask.description}</p>
          <p><strong>Due Date:</strong> {new Date(lastTask.dueDate).toDateString()}</p>
          <p><strong>Created:</strong> {new Date(lastTask.createdDate).toDateString()}</p>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="view-btn-container">
          <button className="view-btn" onClick={goToDashboard}>
            View All Items ({tasks.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
