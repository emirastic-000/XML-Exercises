import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import env from './config/env.js';
import { connectDB } from './config/db.js';
import './config/passport.js';
import authRoutes from './routes/auth.js';
import moduleRoutes from './routes/modules.js';
import lessonRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';
import achievementRoutes from './routes/achievements.js';
import validateRoutes from './routes/validate.js';

const app = express();

await connectDB();

app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: env.mongoUri }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/modules', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/validate', validateRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
