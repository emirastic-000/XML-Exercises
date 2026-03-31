import { Router } from 'express';
import { getLesson } from '../services/contentLoader.js';

const router = Router();

router.get('/:moduleId/lessons/:lessonId', (req, res) => {
  const lesson = getLesson(req.params.moduleId, req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

export default router;
