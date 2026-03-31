import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/auth.js';
import { getLesson } from '../services/contentLoader.js';
import { validateExercise } from '../services/xmlValidator.js';

const router = Router();

router.use(ensureAuthenticated);

router.post('/', async (req, res) => {
  const { moduleId, lessonId, exerciseId, code } = req.body;

  const lesson = getLesson(moduleId, lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const exercise = lesson.exercises?.find(e => e.id === exerciseId);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

  try {
    const result = validateExercise(exercise, code);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Validation error', message: err.message });
  }
});

export default router;
