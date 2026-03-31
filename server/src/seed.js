import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Achievement from './models/Achievement.js';

const achievements = [
  {
    achievementId: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    condition: { type: 'lesson_complete', target: null },
  },
  {
    achievementId: 'xml-basics-master',
    title: 'XML Basics Master',
    description: 'Complete all lessons in the XML Basics module',
    icon: '📄',
    condition: { type: 'module_complete', target: '01-xml-basics' },
  },
  {
    achievementId: 'dtd-master',
    title: 'DTD Master',
    description: 'Complete all lessons in the DTD module',
    icon: '📋',
    condition: { type: 'module_complete', target: '02-dtd' },
  },
  {
    achievementId: 'schema-architect',
    title: 'Schema Architect',
    description: 'Complete all lessons in the XML Schema module',
    icon: '🏗️',
    condition: { type: 'module_complete', target: '03-xml-schema' },
  },
  {
    achievementId: 'xpath-navigator',
    title: 'XPath Navigator',
    description: 'Complete all lessons in the XPath module',
    icon: '🧭',
    condition: { type: 'module_complete', target: '04-xpath' },
  },
  {
    achievementId: 'xslt-transformer',
    title: 'XSLT Transformer',
    description: 'Complete all lessons in the XSLT module',
    icon: '🔄',
    condition: { type: 'module_complete', target: '05-xslt' },
  },
  {
    achievementId: 'xquery-expert',
    title: 'XQuery Expert',
    description: 'Complete all lessons in the XQuery module',
    icon: '🔍',
    condition: { type: 'module_complete', target: '06-xquery' },
  },
  {
    achievementId: 'curriculum-complete',
    title: 'Curriculum Complete',
    description: 'Complete every lesson in the entire curriculum',
    icon: '🏆',
    condition: { type: 'all_complete', target: null },
  },
  {
    achievementId: 'perfect-score',
    title: 'Perfect Score',
    description: 'Score 100% on any quiz',
    icon: '⭐',
    condition: { type: 'perfect_quiz', target: null },
  },
  {
    achievementId: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% on every quiz',
    icon: '💎',
    condition: { type: 'all_perfect', target: null },
  },
];

async function seed() {
  await connectDB();

  for (const a of achievements) {
    await Achievement.findOneAndUpdate(
      { achievementId: a.achievementId },
      a,
      { upsert: true }
    );
  }

  console.log(`Seeded ${achievements.length} achievements`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
