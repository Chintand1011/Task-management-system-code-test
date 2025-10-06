import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance"; // your axios instance
import "../../css/taskModal.css";

const TaskModal = ({ task, setTask, onClose, onSubmit, isEdit = false }) => {
  if (!task) return null;

  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);

  // Decode JWT token manually to get userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJSON = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(payloadJSON);
        setUserId(payload.nameid || payload.id || "");
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  // Fetch users for assignee select
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users/users");
        setUsers(res.data || []);

        // If task.assigneeId is empty, set default as first user
        if (!task.assigneeId && res.data.length > 0) {
          setTask((prev) => ({ ...prev, assigneeId: res.data[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [setTask, task.assigneeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: name === "priority" || name.includes("Id") ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title) {
      alert("Title is required");
      return;
    }
    if (!task.assigneeId) {
      alert("Assignee is required");
      return;
    }
    onSubmit();
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal-container">
        <h2>{isEdit ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            value={task.title ?? ""}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="description"
            value={task.description ?? ""}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={task.status ?? "TODO"}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <input
            type="number"
            name="priority"
            value={task.priority ?? 1}
            onChange={handleChange}
            placeholder="Priority"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Assignee select */}
          <select
            name="assigneeId"
            value={task.assigneeId ?? ""}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="creatorId"
            value={userId ?? ""}
            placeholder="Creator ID"
            readOnly
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white transition ${
                isEdit ? "update" : "add"
              }`}
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
