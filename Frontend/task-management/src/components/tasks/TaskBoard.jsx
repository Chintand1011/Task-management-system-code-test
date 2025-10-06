import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import TaskColumn from "./TaskColumn";
import TaskModal from "./TaskModal";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

export default function TaskBoard(){
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/tasks");
      setTasks(res.data);
    } finally { setLoading(false); }
  };

  // Optimistic create example
  const createTask = async (taskDto) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { ...taskDto, id: tempId, createdAt: new Date().toISOString() };
    setTasks(prev => [optimisticTask, ...prev]);

    try {
      const res = await axios.post("/tasks", taskDto);
      // replace temp item with server item
      setTasks(prev => prev.map(t => t.id === tempId ? res.data : t));
    } catch (err) {
      // revert on failure
      setTasks(prev => prev.filter(t => t.id !== tempId));
      throw err;
    }
  };

  return (
    <div className="flex gap-4 p-4">
      {STATUSES.map(status => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks.filter(t => t.status === status)}
          onEdit={(t)=> setSelectedTask(t)}
        />
      ))}
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}
