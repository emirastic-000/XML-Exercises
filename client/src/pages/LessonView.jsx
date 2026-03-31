import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { modules as modulesApi, progress as progressApi, validate as validateApi } from '../api/index.js';
import LessonReader from '../components/LessonReader.jsx';
import XMLEditor from '../components/XMLEditor.jsx';
import QuizPanel from '../components/QuizPanel.jsx';

export default function LessonView() {
  const { moduleId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('read');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exercise state: code per exercise and validation results
  const [exerciseCode, setExerciseCode] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});
  const [validating, setValidating] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    modulesApi
      .getLesson(moduleId, lessonId)
      .then((data) => {
        setLesson(data);
        // Initialize exercise code with starter values
        const initial = {};
        (data.exercises || []).forEach((ex, i) => {
          initial[i] = ex.starterCode || '';
        });
        setExerciseCode(initial);
      })
      .catch((err) => setError(err.message || 'Failed to load lesson.'))
      .finally(() => setLoading(false));
  }, [moduleId, lessonId]);

  // Mark lesson as read when Read tab is viewed
  const markRead = useCallback(() => {
    progressApi.update(moduleId, lessonId, { readCompleted: true }).catch(() => {});
  }, [moduleId, lessonId]);

  useEffect(() => {
    if (activeTab === 'read' && lesson) {
      markRead();
    }
  }, [activeTab, lesson, markRead]);

  const handleValidate = async (exerciseIndex) => {
    const exercise = lesson.exercises[exerciseIndex];
    const code = exerciseCode[exerciseIndex] || '';
    setValidating((prev) => ({ ...prev, [exerciseIndex]: true }));
    try {
      const result = await validateApi.submit({
        moduleId,
        lessonId,
        exerciseId: exercise.id || exerciseIndex,
        code,
      });
      setExerciseResults((prev) => ({ ...prev, [exerciseIndex]: result }));
    } catch (err) {
      setExerciseResults((prev) => ({
        ...prev,
        [exerciseIndex]: { pass: false, message: err.response?.data?.message || 'Validation failed.' },
      }));
    } finally {
      setValidating((prev) => ({ ...prev, [exerciseIndex]: false }));
    }
  };

  const handleQuizComplete = (score) => {
    progressApi.update(moduleId, lessonId, { quizScore: score, completedAt: new Date().toISOString() }).catch(() => {});
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>;
  if (!lesson) return <div className="card">Lesson not found.</div>;

  const tabs = ['read', 'practice', 'quiz'];

  return (
    <div>
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        {lesson.description && (
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{lesson.description}</p>
        )}
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'read' ? 'Read' : t === 'practice' ? 'Practice' : 'Quiz'}
          </button>
        ))}
      </div>

      {activeTab === 'read' && (
        <LessonReader content={lesson.content} />
      )}

      {activeTab === 'practice' && (
        <div>
          {(!lesson.exercises || lesson.exercises.length === 0) ? (
            <p style={{ color: 'var(--text-muted)' }}>No exercises available for this lesson.</p>
          ) : (
            lesson.exercises.map((ex, i) => (
              <div key={i} className="exercise">
                <div className="exercise-prompt">{ex.prompt || `Exercise ${i + 1}`}</div>
                <XMLEditor
                  defaultValue={exerciseCode[i] || ''}
                  onChange={(val) =>
                    setExerciseCode((prev) => ({ ...prev, [i]: val }))
                  }
                />
                <div style={{ marginTop: '0.75rem' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => handleValidate(i)}
                    disabled={validating[i]}
                  >
                    {validating[i] ? 'Validating...' : 'Validate'}
                  </button>
                </div>
                {exerciseResults[i] && (
                  <div className={`exercise-result ${exerciseResults[i].pass ? 'pass' : 'fail'}`}>
                    {exerciseResults[i].pass ? 'Passed!' : 'Not quite.'}{' '}
                    {exerciseResults[i].message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'quiz' && (
        <QuizPanel
          questions={lesson.quiz || []}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}
