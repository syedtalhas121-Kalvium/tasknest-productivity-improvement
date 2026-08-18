import React from 'react';
import { updateTaskImportance, updateTaskStatus, deleteTaskFromApi } from '../services/api';
import { Trash2, Check, Star } from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const handleToggle = async () => {
    try {
      await updateTaskStatus(task.id, !task.completed);
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleImportanceToggle = async () => {
    try {
      await updateTaskImportance(task.id, !task.important);
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task importance:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTaskFromApi(task.id);
      onTaskUpdated();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className={`task-card-v2 animate-fade ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <button
          type="button"
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
        </button>
        <div className="task-copy">
          <span className="task-text">{task.title}</span>
          {task.important && (
            <span className="important-badge"><Star size={13} fill="currentColor" /> Important</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          onClick={handleImportanceToggle}
          className={`action-btn importance-btn ${task.important ? 'active' : ''}`}
          title={task.important ? 'Remove important flag' : 'Mark as important'}
          aria-label={task.important ? 'Remove important flag' : 'Mark as important'}
        >
          <Star size={18} fill={task.important ? 'currentColor' : 'none'} />
        </button>
        <button type="button" onClick={handleDelete} className="action-btn" title="Delete task" aria-label={`Delete ${task.title}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
