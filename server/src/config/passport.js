import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import env from './env.js';

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

async function findOrCreateUser(provider, profile) {
  let user = await User.findOne({ oauthProvider: provider, oauthId: profile.id });
  if (!user) {
    user = await User.create({
      oauthProvider: provider,
      oauthId: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value || '',
      avatarUrl: profile.photos?.[0]?.value || '',
    });
  }
  return user;
}

if (env.google.clientId) {
  passport.use(new GoogleStrategy({
    clientID: env.google.clientId,
    clientSecret: env.google.clientSecret,
    callbackURL: `${env.serverUrl}/auth/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser('google', profile);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

if (env.github.clientId) {
  passport.use(new GitHubStrategy({
    clientID: env.github.clientId,
    clientSecret: env.github.clientSecret,
    callbackURL: `${env.serverUrl}/auth/github/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser('github', profile);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}
