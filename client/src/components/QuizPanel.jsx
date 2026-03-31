import { useState } from 'react';

export default function QuizPanel({ questions = [], onComplete }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions.length) {
    return <p>No quiz questions available for this lesson.</p>;
  }

  const selectAnswer = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    if (onComplete) onComplete(pct);
  };

  const optionClass = (qIndex, optIndex) => {
    const classes = ['quiz-option'];
    if (!submitted) {
      if (answers[qIndex] === optIndex) classes.push('selected');
    } else {
      if (optIndex === questions[qIndex].correctIndex) {
        classes.push('correct');
      } else if (answers[qIndex] === optIndex) {
        classes.push('incorrect');
      }
    }
    return classes.join(' ');
  };

  return (
    <div>
      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            {qIndex + 1}. {q.question}
          </p>

          {q.options.map((opt, optIndex) => (
            <button
              key={optIndex}
              className={optionClass(qIndex, optIndex)}
              onClick={() => selectAnswer(qIndex, optIndex)}
              disabled={submitted}
            >
              {opt}
            </button>
          ))}

          {submitted && q.explanation && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={answers.some((a) => a === null)}
        >
          Submit Answers
        </button>
      ) : (
        <div className="card" style={{ textAlign: 'center', marginTop: '1rem' }}>
          <div className="stat-value">{score}%</div>
          <div className="stat-label">
            {score >= 80 ? 'Great job!' : score >= 50 ? 'Not bad, keep practicing!' : 'Review the lesson and try again.'}
          </div>
        </div>
      )}
    </div>
  );
}
