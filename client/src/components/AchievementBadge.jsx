export default function AchievementBadge({ achievement }) {
  const { icon, title, description, earned, earnedAt } = achievement;

  return (
    <div className={`badge ${earned ? 'earned' : 'locked'}`}>
      <div className="badge-icon">{icon}</div>
      <div className="badge-title">{title}</div>
      <div className="badge-desc">{description}</div>
      {earned && earnedAt && (
        <div className="badge-desc" style={{ marginTop: '0.5rem' }}>
          Earned {new Date(earnedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
