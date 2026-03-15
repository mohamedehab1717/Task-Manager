import { useState } from "react";
import API from "../api/api";

export default function AddTask({ projectId, fetchTasks, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up deadline if it's an empty string to avoid Mongoose casting errors
      const taskData = { 
        title, 
        description,
        projectId, 
        priority, 
        deadline: deadline || undefined 
      };
      
      await API.post("/tasks", taskData);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      fetchTasks();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add task. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--bg-main)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <input placeholder="Task name..." value={title} onChange={e => setTitle(e.target.value)} required style={{ marginBottom: '10px' }} />
      <textarea placeholder="Description (optional)..." value={description} onChange={e => setDescription(e.target.value)} style={{ fontSize: '0.9rem', minHeight: '60px', marginBottom: '10px' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <select value={priority} onChange={e => setPriority(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
      </div>
      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Add Task</button>
    </form>
  );
}