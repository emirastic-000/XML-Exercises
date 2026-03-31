import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: String, required: true },
  lessonId: { type: String, required: true },
  readingCompleted: { type: Boolean, default: false },
  exercisesCompleted: [{
    exerciseId: { type: String, required: true },
    passed: { type: Boolean, default: false },
    lastAttempt: { type: String, default: '' },
  }],
  quizScore: { type: Number, default: null },
  quizAnswers: [Number],
  completedAt: { type: Date, default: null },
}, { timestamps: true });

progressSchema.index({ userId: 1, moduleId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
