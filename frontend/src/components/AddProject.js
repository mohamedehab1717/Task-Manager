import { useState } from "react";
import API from "../api/api";

export default function AddProject({ fetchProjects }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/projects", { title, description, deadline: deadline || undefined });
      setTitle("");
      setDescription("");
      setDeadline("");
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (!showForm) {
    return <button onClick={() => setShowForm(true)} className="btn-primary">+ New Project</button>;
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bg: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setShowForm(false)} />
      <div className="glass-card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, width: '400px' }}>
        <h3>Create Project</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: '100px', marginBottom: '10px' }} />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: 'var(--border)', color: 'var(--text-main)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}