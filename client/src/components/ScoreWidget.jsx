import React, { useState, useEffect } from 'react';
import { fetchScore } from '../services/api';
import { Award, TrendingUp } from 'lucide-react';

const ScoreWidget = ({ tasks }) => {
  const [score, setScore] = useState({
    value: 0,
    completedTasks: 0,
    importantCompletedTasks: 0,
    consistencyDays: 0,
    taskPoints: 0,
    consistencyBonus: 0
  });

  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await fetchScore();
        setScore(data);
      } catch (error) {
        console.error('Error fetching score:', error);
      }
    };
    getScore();
  }, [tasks]);

  return (
    <div className="score-hero-card">
      <div className="score-hero-left">
        <h2>Your Productivity</h2>
        <div className="score-big">
          {score.value}
          <span>/ 100 pts</span>
        </div>
        <p style={{ marginTop: '1rem', opacity: 0.7 }}>
          {score.completedTasks === 0
            ? 'Complete a task to start building your score.'
            : `${score.completedTasks} completed task${score.completedTasks === 1 ? '' : 's'} · ${score.consistencyDays} active day${score.consistencyDays === 1 ? '' : 's'}`}
        </p>
      </div>
      <div className="score-hero-right">
        <div className="status-badge" style={{ background: '#4ade80', color: '#064e3b', marginBottom: '1rem' }}>
          <TrendingUp size={16} />
          {score.consistencyDays > 1 ? 'Building Consistency' : 'Start Your Streak'}
        </div>
        <div className="logo-icon" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <Award size={48} />
        </div>
        <p className="score-breakdown">
          {score.taskPoints} task points + {score.consistencyBonus} consistency bonus
          {score.importantCompletedTasks > 0 && ` · ${score.importantCompletedTasks} important`}
        </p>
      </div>
    </div>
  );
};

export default ScoreWidget;
