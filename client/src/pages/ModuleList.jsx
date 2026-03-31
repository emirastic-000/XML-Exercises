import { useState, useEffect } from 'react';
import { modules as modulesApi, progress as progressApi } from '../api/index.js';
import ModuleCard from '../components/ModuleCard.jsx';

export default function ModuleList() {
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
      .catch((err) => setError(err.message || 'Failed to load modules.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>;

  const progressForModule = (moduleId) =>
    progressData.filter((p) => p.moduleId === moduleId);

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>All Modules</h1>
      {modulesList.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No modules available yet.</p>
      ) : (
        <div className="card-grid">
          {modulesList.map((mod) => (
            <ModuleCard
              key={mod.id || mod._id}
              module={mod}
              progressData={progressForModule(mod.id || mod._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
