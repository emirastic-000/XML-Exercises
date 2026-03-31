import { useState, useEffect } from 'react';
import { achievements as achievementsApi } from '../api/index.js';
import AchievementBadge from '../components/AchievementBadge.jsx';

export default function Achievements() {
  const [achievementsList, setAchievementsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    achievementsApi
      .list()
      .then((data) => setAchievementsList(data))
      .catch((err) => setError(err.message || 'Failed to load achievements.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>;

  // Show earned first, then locked
  const sorted = [...achievementsList].sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return 0;
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Achievements</h1>
      {sorted.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No achievements available.</p>
      ) : (
        <div className="badge-grid">
          {sorted.map((ach) => (
            <AchievementBadge key={ach.id || ach._id} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
}
