import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TaskDashboardStyles.css";

const TaskDashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]); // Array to hold tasks
  const [search, setSearch] = useState(""); // Search term for filtering tasks
  const [filter, setFilter] = useState("All"); // Current filter applied to tasks
  const [customStart, setCustomStart] = useState(""); // Custom start date for filtering
  const [customEnd, setCustomEnd] = useState(""); // Custom end date for filtering

  const [modalType, setModalType] = useState(""); // "edit" or "delete"
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [tempTask, setTempTask] = useState(null); // Temporary task data for editing
  const [loading, setLoading] = useState(true); // Loading state for tasks

const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
const token = localStorage.getItem("token");  // Get authentication token from localStorage


// Fetch user tasks on component mount or when user changes
useEffect(() => {
  if (user?.id && token) {
    axios.get(`http://localhost:8080/user/tasks?userId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setTasks(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      setLoading(false);
    });
  }
}, [user?.id, token]);

// Function to open modal for editing or deleting a task
  const openModal = (index, type) => {
    setSelectedTaskIndex(index);
    setModalType(type);
    setTempTask({ ...tasks[index] });
  };
// Function to close the modal
  const closeModal = () => {
    setModalType("");
    setSelectedTaskIndex(null);
    setTempTask(null);
  };

  // Handle task editing
  // This function updates the task in the backend and updates the state
  const handleSaveEdit = async () => {
  const updatedTask = {
    ...tempTask,
    createdDate: new Date().toISOString().split("T")[0],
  };

  //
  try {
    // Update the task in the backend
    await axios.put(
      `http://localhost:8080/user/tasks/${tempTask.id}`,
      updatedTask,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update the task in the local state
    const updated = [...tasks];
    updated[selectedTaskIndex] = updatedTask;
    setTasks(updated);
    closeModal();
  } catch (error) {
    console.error("Failed to update task:", error);
    alert("Update failed.");
  }
};


// Handle task deletion
// This function deletes the task from the backend and updates the state
 const handleDelete = async () => {
  try {
    await axios.delete(
      `http://localhost:8080/user/tasks/${tempTask.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updated = [...tasks];
    updated.splice(selectedTaskIndex, 1);
    setTasks(updated);
    closeModal();
  } catch (error) {
    console.error("Failed to delete task:", error);
    alert("Delete failed.");
  }
};

// Handle user logout
// This function confirms logout and clears localStorage
const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
};

// Fetch tasks when the component mounts or when user changes
// Filter tasks based on the selected filter and search term
  const filterTasks = (task) => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);

    switch (filter) {
      case "Today":
        return taskDate.toDateString() === today.toDateString();
      case "This Week":
        return taskDate >= today && taskDate <= weekFromNow;
      case "This Month":
        return (
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
      case "Custom Range":
        if (!customStart || !customEnd) return true;
        const start = new Date(customStart);
        const end = new Date(customEnd);
        return taskDate >= start && taskDate <= end;
      default:
        return true;
    }
  };

  // Filter tasks based on the current filter and search term
  // This function returns tasks that match the filter criteria and search term
  const filteredTasks = tasks
    .filter(filterTasks)
    .filter((task) =>
      (task.title + task.description)
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // Render the TaskDashboard component
  // This component displays the tasks, allows filtering, searching, and editing/deleting tasks
  return (
    <div className="task-container">
      <div className="top-bar">
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  </div>
      <div className="task-header">
        <h2>📋 All Tasks ({filteredTasks.length})</h2>
        <button className="home-btn" onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </div>

      <div className="task-filters">
        <h4>Quick Filters</h4>
        <div className="filter-buttons">
          {["All", "Today", "This Week", "This Month", "Custom Range"].map(
            (f) => (
              <button
                key={f}
                className={filter === f ? "active-filter" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            )
          )}
        </div>

        {filter === "Custom Range" && (
          <div className="custom-range">
            <label>Start Date:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <label>End Date:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
        )}

        <label>Search Tasks</label>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="no-task-message">No tasks found.</p>
      ) : (
        filteredTasks.map((task, idx) => (
          <div className="task-card" key={idx}>
            <div className="task-info">
              <p>
                <strong>Title:</strong> {task.title}
              </p>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(task.dueDate).toDateString()}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(task.createdDate).toDateString()}
              </p>
            </div>
            <div className="task-actions">
              <button
                onClick={() => openModal(idx, "edit")}
                className="action-icon edit-icon"
                title="Edit Task"
              >
                <span>Edit</span>
              </button>
              <button
                onClick={() => openModal(idx, "delete")}
                className="action-icon delete-icon"
                title="Delete Task"
              >
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {modalType && selectedTaskIndex !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modalType === "edit" ? (
              <>
                <h3>Edit Task</h3>
                <input
                  type="text"
                  value={tempTask.title}
                  onChange={(e) =>
                    setTempTask({ ...tempTask, title: e.target.value })
                  }
                />
                <textarea
                  rows={3}
                  value={tempTask.description}
                  onChange={(e) =>
                    setTempTask({ ...tempTask, description: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={tempTask.dueDate}
                  onChange={(e) =>
                    setTempTask({ ...tempTask, dueDate: e.target.value })
                  }
                />
                <div className="modal-buttons">
                  <button className="cancel-button" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={handleSaveEdit}>
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Are you sure you want to delete?</h3>
                <p>
                  <strong>{tempTask.title}</strong>
                </p>
                <div className="modal-buttons">
                  <button className="cancel-button" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="delete-button" onClick={handleDelete}>
                    Yes, Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
