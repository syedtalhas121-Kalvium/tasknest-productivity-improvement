/**
 * Productivity scoring rules.
 *
 * A score is derived from the current task state rather than accumulated in a
 * separate counter. This makes the value reproducible after refreshes,
 * deletions, and completion toggles.
 */
const POINTS = {
  completedTask: 10,
  importantTaskBonus: 10,
  consistencyDay: 5
};

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const getCompletedDayCount = (tasks) => {
  const completedDays = new Set(
    tasks
      .filter((task) => task.completed)
      .map((task) => startOfDay(task.completedAt || task.createdAt))
  );

  return completedDays.size;
};

const calculateProductivityScore = (tasks = []) => {
  const completedTasks = tasks.filter((task) => task.completed);
  const taskPoints = completedTasks.reduce((total, task) => {
    return total + POINTS.completedTask + (task.important ? POINTS.importantTaskBonus : 0);
  }, 0);
  const consistencyBonus = Math.min(getCompletedDayCount(tasks) * POINTS.consistencyDay, 20);

  return {
    value: Math.min(taskPoints + consistencyBonus, 100),
    completedTasks: completedTasks.length,
    importantCompletedTasks: completedTasks.filter((task) => task.important).length,
    consistencyDays: getCompletedDayCount(tasks),
    taskPoints,
    consistencyBonus
  };
};

module.exports = {
  POINTS,
  calculateProductivityScore,
  getCompletedDayCount
};
