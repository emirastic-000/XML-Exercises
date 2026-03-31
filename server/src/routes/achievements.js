import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/auth.js';
import Achievement from '../models/Achievement.js';

const router = Router();

router.use(ensureAuthenticated);

router.get('/', async (req, res) => {
  const allAchievements = await Achievement.find();
  const earnedIds = new Set(req.user.earnedAchievements.map(a => a.achievementId));

  const result = allAchievements.map(a => ({
    ...a.toObject(),
    earned: earnedIds.has(a.achievementId),
    earnedAt: req.user.earnedAchievements.find(e => e.achievementId === a.achievementId)?.earnedAt,
  }));

  res.json(result);
});

export default router;
