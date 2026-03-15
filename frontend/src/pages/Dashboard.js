import { useState, useEffect } from "react";
import API from "../api/api";
import AddProject from "../components/AddProject";
import ProjectList from "../components/ProjectList";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const sortedProjects = [...projects]
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "az") return a.title.localeCompare(b.title);
      if (sortBy === "za") return b.title.localeCompare(a.title);
      
      if (sortBy === "deadline") {
        const timeA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const timeB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        
        if (timeA !== timeB) return timeA - timeB;
        // Tie-breaker: newest created first
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div className="container">
      <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Your Workspace</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your projects and tasks efficiently</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', marginBottom: 0, padding: '8px 12px' }}
          >
            <option value="deadline">Nearest Deadline</option>
            <option value="newest">Recently Added</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '200px', marginBottom: 0, padding: '10px' }}
          />
          <AddProject fetchProjects={fetchProjects} />
        </div>
      </div>
      
      <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        <ProjectList 
          projects={sortedProjects} 
          fetchProjects={fetchProjects} 
        />
      </div>
    </div>
  );
}