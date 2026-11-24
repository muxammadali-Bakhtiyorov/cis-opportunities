import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRecommendationPlan, matchActivitiesToProfile } from './admissionsKnowledge.js';

const sampleActivities = [
  {
    id: 1,
    title: 'Central Asia AI Hackathon 2026',
    category: 'Хакатон',
    format: 'Онлайн',
    age: '16–22 года',
    location: 'Онлайн',
    description: 'Командный хакатон по разработке AI и ML продуктов за 48 часов.',
    active: true
  },
  {
    id: 2,
    title: 'Global Game Jam Tashkent',
    category: 'Game Jam',
    format: 'Гибрид',
    age: '15–25 лет',
    location: 'Ташкент / Онлайн',
    description: 'Создание прототипа игры на Unity или Unreal за выходные.',
    active: true
  },
  {
    id: 3,
    title: 'Волонтерский форум молодежи Центральной Азии',
    category: 'Волонтерство',
    format: 'Очно',
    age: '16–25 лет',
    location: 'Алматы, Казахстан',
    description: 'Трехдневный форум для лидеров социальных инициатив.',
    active: true
  },
  {
    id: 4,
    title: 'Скрытая олимпиада',
    category: 'Олимпиада',
    format: 'Онлайн',
    age: '14–18 лет',
    location: 'Онлайн',
    description: 'Олимпиада по программированию.',
    active: false
  }
];

test('matches USA + Computer Science to hackathons and game jams first', () => {
  const results = matchActivitiesToProfile(sampleActivities, {
    country: 'usa',
    major: 'cs',
    stage: 'school_senior',
    goal: 'projects',
    format: 'Онлайн'
  });

  assert.equal(results.length >= 2, true);
  assert.equal(results[0].activity.id, 1);
  assert.equal(results[1].activity.id, 2);
  assert.equal(results.some(r => r.activity.id === 4), false);
});

test('builds complete recommendation plan with country scholarships and major blueprints', () => {
  const plan = buildRecommendationPlan({
    country: 'usa',
    major: 'cs',
    stage: 'school_senior',
    goal: 'projects',
    format: 'Любой'
  });

  assert.equal(plan.country.id, 'usa');
  assert.equal(plan.major.id, 'cs');
  assert.equal(plan.blueprints.some(bp => bp.category === 'Game Jam'), true);
  assert.equal(plan.relevantScholarships.length >= 1, true);
});
