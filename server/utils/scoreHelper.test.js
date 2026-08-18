const assert = require('node:assert/strict');
const { calculateProductivityScore } = require('./scoreHelper');

const day = (offset = 0) => {
  const date = new Date('2026-08-18T12:00:00.000Z');
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
};

const task = (overrides = {}) => ({
  completed: false,
  important: false,
  createdAt: day(),
  completedAt: null,
  ...overrides
});

const normal = calculateProductivityScore([
  task({ completed: true, completedAt: day() })
]);
assert.deepEqual(normal, {
  value: 15,
  completedTasks: 1,
  importantCompletedTasks: 0,
  consistencyDays: 1,
  taskPoints: 10,
  consistencyBonus: 5
});

const important = calculateProductivityScore([
  task({ completed: true, important: true, completedAt: day() })
]);
assert.equal(important.value, 25);
assert.equal(important.importantCompletedTasks, 1);

const distinctDays = calculateProductivityScore([
  task({ completed: true, completedAt: day() }),
  task({ completed: true, completedAt: day(1) }),
  task({ completed: true, completedAt: day(2) }),
  task({ completed: true, completedAt: day(3) }),
  task({ completed: true, completedAt: day(4) }),
  task({ completed: true, completedAt: day(5) })
]);
assert.equal(distinctDays.consistencyDays, 6);
assert.equal(distinctDays.consistencyBonus, 20);
assert.equal(distinctDays.value, 80);

const capped = calculateProductivityScore(
  Array.from({ length: 10 }, (_, index) => task({
    completed: true,
    important: true,
    completedAt: day(index)
  }))
);
assert.equal(capped.value, 100);

const incomplete = calculateProductivityScore([task({ important: true })]);
assert.equal(incomplete.value, 0);
assert.equal(incomplete.completedTasks, 0);

console.log('scoreHelper tests passed');
