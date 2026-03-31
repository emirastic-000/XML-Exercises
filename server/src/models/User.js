import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  oauthProvider: { type: String, required: true, enum: ['google', 'github'] },
  oauthId: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String },
  avatarUrl: { type: String },
  earnedAchievements: [{
    achievementId: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

userSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
