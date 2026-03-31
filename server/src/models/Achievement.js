import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  achievementId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  condition: {
    type: { type: String, required: true, enum: ['lesson_complete', 'module_complete', 'all_complete', 'perfect_quiz', 'all_perfect'] },
    target: { type: String, default: null },
  },
});

export default mongoose.model('Achievement', achievementSchema);
