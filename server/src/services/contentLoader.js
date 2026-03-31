import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../../content');

let modulesCache = null;

function loadContent() {
  if (modulesCache) return modulesCache;

  const modules = [];
  const moduleDirs = fs.readdirSync(CONTENT_DIR)
    .filter(d => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory())
    .sort();

  for (const dir of moduleDirs) {
    const modulePath = path.join(CONTENT_DIR, dir);
    const moduleFile = path.join(modulePath, 'module.yaml');

    if (!fs.existsSync(moduleFile)) continue;

    const moduleData = yaml.load(fs.readFileSync(moduleFile, 'utf8'));

    const lessonFiles = fs.readdirSync(modulePath)
      .filter(f => f !== 'module.yaml' && f.endsWith('.yaml'))
      .sort();

    const lessons = lessonFiles.map(f => {
      const lessonData = yaml.load(fs.readFileSync(path.join(modulePath, f), 'utf8'));
      return lessonData;
    });

    modules.push({
      ...moduleData,
      lessons,
      lessonCount: lessons.length,
    });
  }

  modulesCache = modules;
  return modules;
}

export function getAllModules() {
  const modules = loadContent();
  return modules.map(({ lessons, ...mod }) => ({
    ...mod,
    lessons: lessons.map(({ reading, exercises, quiz, ...l }) => l),
  }));
}

export function getModule(moduleId) {
  const modules = loadContent();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return null;
  return {
    ...mod,
    lessons: mod.lessons.map(({ reading, exercises, quiz, ...l }) => l),
  };
}

export function getLesson(moduleId, lessonId) {
  const modules = loadContent();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return null;
  return mod.lessons.find(l => l.id === lessonId) || null;
}

export function getAllModuleIds() {
  return loadContent().map(m => m.id);
}

export function getLessonCountForModule(moduleId) {
  const mod = loadContent().find(m => m.id === moduleId);
  return mod ? mod.lessonCount : 0;
}

export function getTotalLessonCount() {
  return loadContent().reduce((sum, m) => sum + m.lessonCount, 0);
}

// Clear cache (for dev reloading)
export function clearCache() {
  modulesCache = null;
}
