import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';

export default function ModuleCard({ module, progressData = [] }) {
  const { id, title, description, icon, lessonCount, lessons } = module;

  const completedLessons = progressData.filter((p) => p.completedAt != null).length;
  const pct = lessonCount > 0 ? Math.round((completedLessons / lessonCount) * 100) : 0;

  // Determine first lesson id for the "Start" link
  const firstLessonId = lessons && lessons.length > 0 ? lessons[0].id || lessons[0]._id : 1;

  return (
    <div className="card">
      {icon && <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>}
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        {description}
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        {completedLessons} / {lessonCount} lessons completed
      </p>
      <ProgressBar value={pct} />
      <div style={{ marginTop: '1rem' }}>
        <Link to={`/lesson/${id}/${firstLessonId}`} className="btn btn-primary">
          {completedLessons > 0 ? 'Continue' : 'Start'}
        </Link>
      </div>
    </div>
  );
}
