import { Router } from 'express';
import { getAllModules, getModule } from '../services/contentLoader.js';

const router = Router();

router.get('/', (req, res) => {
  const modules = getAllModules();
  res.json(modules);
});

router.get('/:moduleId', (req, res) => {
  const mod = getModule(req.params.moduleId);
  if (!mod) return res.status(404).json({ error: 'Module not found' });
  res.json(mod);
});

export default router;
