const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, important = false } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        important: Boolean(important)
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { completed, important } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  const data = {};
  if (typeof completed === 'boolean') {
    data.completed = completed;
    data.completedAt = completed ? new Date() : null;
  }
  if (typeof important === 'boolean') {
    data.important = important;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No supported task changes supplied' });
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
