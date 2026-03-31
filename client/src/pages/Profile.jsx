import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { progress as progressApi, achievements as achievementsApi } from '../api/index.js';
import AchievementBadge from '../components/AchievementBadge.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([progressApi.getAll(), achievementsApi.list()])
      .then(([prog, ach]) => {
        setProgressData(prog);
        setAchievementsList(ach);
      })
      .catch((err) => setError(err.message || 'Failed to load profile data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>;

  const completedLessons = progressData.filter((p) => p.completedAt != null).length;
  const totalLessons = progressData.length;
  const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const quizzesAced = progressData.filter((p) => p.quizScore != null && p.quizScore >= 80).length;

  const earnedAchievements = achievementsList
    .filter((a) => a.earned)
    .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
    .slice(0, 6);

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user?.avatar && (
          <img
            src={user.avatar}
            alt="Avatar"
            style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--border)' }}
          />
        )}
        <div>
          <h1>{user?.displayName || user?.name || 'Learner'}</h1>
          {user?.email && <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>}
        </div>
      </div>

      <div className="stats-row">
        <div className="card stat-card">
          <div className="stat-value">{completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{completionPct}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{quizzesAced}</div>
          <div className="stat-label">Quizzes Aced</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Recent Achievements</h2>
      {earnedAchievements.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No achievements earned yet. Keep learning!</p>
      ) : (
        <div className="badge-grid">
          {earnedAchievements.map((ach) => (
            <AchievementBadge key={ach.id || ach._id} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
}
