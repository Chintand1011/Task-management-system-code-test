import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import TaskModal from "../components/tasks/TaskModal";
import "../css/dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const [modalTask, setModalTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (assigneeFilter) params.assignee = assigneeFilter;

      const response = await axios.get("/tasks/gettasks", { params });
      setTasks(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, assigneeFilter]);

  const handleAddTask = () => {
    axios
      .post("/tasks/createtask", modalTask)
      .then(() => {
        setModalTask(null);
        fetchTasks();
      })
      .catch((err) => console.error("Failed to add task:", err));
  };

  const handleUpdateTask = () => {
    axios
      .put(`/tasks/${modalTask.id}`, modalTask)
      .then(() => {
        setModalTask(null);
        setIsEditMode(false);
        fetchTasks();
      })
      .catch((err) => console.error("Failed to update task:", err));
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    axios
      .delete(`/tasks/${taskId}`)
      .then(() => fetchTasks())
      .catch((err) => console.error("Failed to delete task:", err));
  };

  const openAddModal = () => {
    setModalTask({
      title: "",
      description: "",
      status: "TODO",
      priority: 1,
      assigneeId: "",
      creatorId: "",
    });
    setIsEditMode(false);
  };

  const openEditModal = (task) => {
    setModalTask({ ...task });
    setIsEditMode(true);
  };

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Filters & Add button */}
       <div className="filters-container">
        <input
          type="text"
          placeholder="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Filter by assignee ID"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchTasks}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={openAddModal}
          className="bg-green-500 text-white px-4 py-2 rounded ml-auto"
        >
          Add Task
        </button>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Priority</th>
              <th className="px-4 py-2 border">Assignee</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-4">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{task.id}</td>
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border">{task.description}</td>
                  <td className="px-4 py-2 border">{task.status}</td>
                  <td className="px-4 py-2 border">{task.priority}</td>
                  <td className="px-4 py-2 border">{task.assignee}</td>
                  <td className="px-4 py-2 border">
                    {new Date(task.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(task.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="px-2 py-1 rounded bg-yellow-400 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-2 py-1 rounded bg-red-500 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modalTask && (
        <TaskModal
          task={modalTask}
          setTask={setModalTask}
          onClose={() => setModalTask(null)}
          onSubmit={isEditMode ? handleUpdateTask : handleAddTask}
          isEdit={isEditMode}
        />
      )}
    </div>
  );
};

export default Dashboard;
