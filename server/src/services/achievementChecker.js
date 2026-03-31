import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';
import { getAllModuleIds, getLessonCountForModule, getTotalLessonCount } from './contentLoader.js';

/**
 * Check and award any new achievements for the user.
 * Called after progress updates.
 * @returns {Array} Newly earned achievements
 */
export async function checkAchievements(user) {
  const allAchievements = await Achievement.find();
  const earnedIds = new Set(user.earnedAchievements.map(a => a.achievementId));
  const progress = await Progress.find({ userId: user._id });

  const completedLessons = progress.filter(p => p.completedAt != null);
  const newlyEarned = [];

  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.achievementId)) continue;

    let earned = false;
    const { type, target } = achievement.condition;

    switch (type) {
      case 'lesson_complete':
        earned = completedLessons.length >= 1;
        break;

      case 'module_complete':
        if (target) {
          const moduleLessons = completedLessons.filter(p => p.moduleId === target);
          const totalInModule = getLessonCountForModule(target);
          earned = totalInModule > 0 && moduleLessons.length >= totalInModule;
        }
        break;

      case 'all_complete':
        earned = completedLessons.length >= getTotalLessonCount();
        break;

      case 'perfect_quiz':
        earned = progress.some(p => p.quizScore === 100);
        break;

      case 'all_perfect':
        const withQuiz = progress.filter(p => p.quizScore != null);
        earned = withQuiz.length > 0 && withQuiz.every(p => p.quizScore === 100);
        break;
    }

    if (earned) {
      newlyEarned.push(achievement);
      user.earnedAchievements.push({
        achievementId: achievement.achievementId,
        earnedAt: new Date(),
      });
    }
  }

  if (newlyEarned.length > 0) {
    await user.save();
  }

  return newlyEarned;
}
