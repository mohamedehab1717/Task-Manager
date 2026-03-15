import { useState, useEffect, useCallback } from "react";
import API from "../api/api";
import AddTask from "./AddTask";

export default function ProjectList({ projects, fetchProjects }) {
  if (projects.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>No projects found</h3>
        <p>Create your first project to start managing tasks.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
      {projects.map(project => (
        <ProjectItem key={project._id} project={project} fetchProjects={fetchProjects} />
      ))}
    </div>
  );
}

function ProjectItem({ project, fetchProjects }) {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");
  const [editTitle, setEditTitle] = useState(project.title);
  const [editDescription, setEditDescription] = useState(project.description);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get(`/tasks/${project._id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [project._id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const sortedTasks = [...tasks].sort((a, b) => {
    // 1. Done tasks always go to bottom
    if (a.status === "Done" && b.status !== "Done") return 1;
    if (a.status !== "Done" && b.status === "Done") return -1;

    if (sortBy === "deadline") {
      const timeA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const timeB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      
      if (timeA !== timeB) return timeA - timeB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    
    if (sortBy === "status") {
      const statusOrder = { "Pending": 0, "In Progress": 1, "Done": 2 };
      if (statusOrder[a.status] === statusOrder[b.status]) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    if (sortBy === "priority") {
      const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
      if (priorityOrder[a.priority] === priorityOrder[b.priority]) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await API.delete(`/projects/${project._id}`);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/projects/${project._id}`, { title: editTitle, description: editDescription });
      setIsEditing(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const completedTasks = tasks.filter(t => t.status === "Done").length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        {isEditing ? (
          <form onSubmit={handleUpdateProject} style={{ flex: 1, marginRight: '10px' }}>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} required style={{ marginBottom: '5px' }} />
            <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} style={{ fontSize: '0.9rem', minHeight: '60px' }} />
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              <button type="submit" className="badge-low badge" style={{ border: 'none', background: 'var(--primary)', color: 'white' }}>Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="badge-low badge" style={{ border: 'none' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0 }}>{project.title}</h3>
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✏️</button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{project.description}</p>
          </div>
        )}
        <button onClick={handleDeleteProject} style={{ background: 'none', color: 'var(--high)', fontSize: '1.2rem', padding: '4px', border: 'none' }}>
          🗑️
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>Tasks ({tasks.length})</h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto', marginBottom: 0 }}
            >
              <option value="status">By Status</option>
              <option value="deadline">By Deadline</option>
              <option value="priority">By Priority</option>
              <option value="title">By Name</option>
            </select>
            <button onClick={() => setShowAddTask(!showAddTask)} className="badge-low badge" style={{ border: 'none', height: '28px' }}>
              {showAddTask ? "✕" : "+"}
            </button>
          </div>
        </div>
        
        {showAddTask && (
          <div style={{ marginBottom: '1.5rem' }}>
            <AddTask projectId={project._id} fetchTasks={fetchTasks} onSuccess={() => setShowAddTask(false)} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedTasks.map(task => (
            <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} />
          ))}
          {tasks.length === 0 && !showAddTask && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, fetchTasks }) {
  const [showDescription, setShowDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState(task.priority || "Medium");
  const [editDeadline, setEditDeadline] = useState(task.deadline ? task.deadline.split('T')[0] : "");

  const handleStatusChange = async (newStatus) => {
    try {
      await API.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const toggleDone = async () => {
    const newStatus = task.status === "Done" ? "Pending" : "Done";
    handleStatusChange(newStatus);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = { 
        title: editTitle, 
        description: editDescription,
        priority: editPriority, 
        deadline: editDeadline || undefined 
      };
      await API.put(`/tasks/${task._id}`, taskData);
      setIsEditing(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    try {
      await API.delete(`/tasks/${task._id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "Done";
  const priorityClass = `badge-${task.priority?.toLowerCase() || 'medium'}`;

  return (
    <div style={{ 
      padding: '16px', 
      background: 'white', 
      borderRadius: '12px', 
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      transition: 'all 0.2s ease'
    }} className={task.status === "Done" ? "task-done" : ""}>
      {isEditing ? (
        <form onSubmit={handleUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input value={editTitle} onChange={e => setEditTitle(e.target.value)} required placeholder="Task Title" />
          <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Description" style={{ fontSize: '0.85rem', minHeight: '60px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={editPriority} onChange={e => setEditPriority(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button type="submit" className="badge-low badge" style={{ border: 'none', background: 'var(--primary)', color: 'white' }}>Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="badge-low badge" style={{ border: 'none' }}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <input 
                  type="checkbox" 
                  className="task-checkbox" 
                  checked={task.status === "Done"} 
                  onChange={toggleDone}
                />
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{task.title}</span>
                <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}>✏️</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {task.description && (
                  <button 
                    onClick={() => setShowDescription(!showDescription)} 
                    style={{ background: 'none', color: 'var(--primary)', padding: '2px', border: 'none', fontSize: '0.9rem' }}
                    title="View Description"
                  >
                    ℹ️
                  </button>
                )}
                <span className={`badge ${priorityClass}`}>{task.priority || 'Medium'}</span>
            </div>
          </div>

          {showDescription && task.description && (
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px', background: 'var(--bg-main)', borderRadius: '6px' }}>
              {task.description}
            </p>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <select 
              value={task.status} 
              onChange={e => handleStatusChange(e.target.value)}
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem', marginBottom: 0 }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem' }} className={isOverdue ? "overdue" : "text-muted"}>
                {isOverdue ? "Overdue: " : ""}
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No date'}
              </span>
              <button onClick={handleDeleteTask} style={{ background: 'none', color: 'var(--text-muted)', padding: '4px', border: 'none' }}>
                ✕
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}