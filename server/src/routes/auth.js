import { Router } from 'express';
import passport from 'passport';
import env from '../config/env.js';

const router = Router();

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: env.clientUrl }),
  (req, res) => res.redirect(env.clientUrl)
);

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: env.clientUrl }),
  (req, res) => res.redirect(env.clientUrl)
);

// Current user
router.get('/me', (req, res) => {
  res.json({ user: req.user || null });
});

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ ok: true });
  });
});

export default router;
