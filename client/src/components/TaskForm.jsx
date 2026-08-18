import React, { useState } from 'react';
import { createTask } from '../services/api';
import { Plus, Star } from 'lucide-react';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [important, setImportant] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask(title, important);
      setTitle('');
      setImportant(false);
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="form-card animate-fade">
      <h4>Create New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Focus on what matters..."
            className="styled-input"
            aria-label="Task title"
          />
        </div>
        <label className="important-toggle">
          <input
            type="checkbox"
            checked={important}
            onChange={(event) => setImportant(event.target.checked)}
          />
          <Star size={17} fill={important ? 'currentColor' : 'none'} />
          <span>Mark as important</span>
        </label>
        <button type="submit" className="primary-button">
          <Plus size={20} strokeWidth={3} />
          <span>Add Task</span>
        </button>
      </form>
      <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Important completed tasks earn bonus points, while completing tasks on different days builds consistency.
        </p>
      </div>
    </div>
  );
};

export default TaskForm;
