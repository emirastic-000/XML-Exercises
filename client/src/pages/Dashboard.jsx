import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { modules as modulesApi, progress as progressApi } from '../api/index.js';
import ModuleCard from '../components/ModuleCard.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [modulesList, setModulesList] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([modulesApi.list(), progressApi.getAll()])
      .then(([mods, prog]) => {
        setModulesList(mods);
        setProgressData(prog);
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>;

  const totalModules = modulesList.length;
  const completedLessons = progressData.filter((p) => p.completedAt != null).length;
  const totalLessons = modulesList.reduce((sum, m) => sum + (m.lessonCount || 0), 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const progressForModule = (moduleId) =>
    progressData.filter((p) => p.moduleId === moduleId);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome back, {user?.displayName || user?.name || 'Learner'}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Continue your XML learning journey.</p>
      </div>

      <div className="stats-row">
        <div className="card stat-card">
          <div className="stat-value">{totalModules}</div>
          <div className="stat-label">Total Modules</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{completedLessons}</div>
          <div className="stat-label">Completed Lessons</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{overallPct}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Your Modules</h2>
      <div className="card-grid">
        {modulesList.map((mod) => (
          <ModuleCard
            key={mod.id || mod._id}
            module={mod}
            progressData={progressForModule(mod.id || mod._id)}
          />
        ))}
      </div>
    </div>
  );
}
