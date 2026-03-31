import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/auth.js';
import Progress from '../models/Progress.js';
import { checkAchievements } from '../services/achievementChecker.js';

const router = Router();

router.use(ensureAuthenticated);

// Get all progress for current user
router.get('/', async (req, res) => {
  const progress = await Progress.find({ userId: req.user._id });
  res.json(progress);
});

// Get progress for a module
router.get('/:moduleId', async (req, res) => {
  const progress = await Progress.find({
    userId: req.user._id,
    moduleId: req.params.moduleId,
  });
  res.json(progress);
});

// Update progress for a lesson
router.put('/:moduleId/:lessonId', async (req, res) => {
  const { moduleId, lessonId } = req.params;
  const { readingCompleted, exercisesCompleted, quizScore, quizAnswers } = req.body;

  const update = {};
  if (readingCompleted !== undefined) update.readingCompleted = readingCompleted;
  if (exercisesCompleted !== undefined) update.exercisesCompleted = exercisesCompleted;
  if (quizScore !== undefined) update.quizScore = quizScore;
  if (quizAnswers !== undefined) update.quizAnswers = quizAnswers;

  const progress = await Progress.findOneAndUpdate(
    { userId: req.user._id, moduleId, lessonId },
    { $set: update },
    { new: true, upsert: true }
  );

  // Check if lesson is fully completed
  const allExercisesPassed = progress.exercisesCompleted?.every(e => e.passed);
  if (progress.readingCompleted && allExercisesPassed && progress.quizScore != null) {
    progress.completedAt = progress.completedAt || new Date();
    await progress.save();
  }

  // Check for new achievements
  const newAchievements = await checkAchievements(req.user);

  res.json({ progress, newAchievements });
});

export default router;
