import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogHabit = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studyHours: '',
    sleepHours: '',
    screenTime: '',
    exerciseMinutes: '',
    mood: 'Neutral',
    tasksCompleted: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: user.id,
        studyHours: Number(formData.studyHours),
        sleepHours: Number(formData.sleepHours),
        screenTime: Number(formData.screenTime),
        exerciseMinutes: Number(formData.exerciseMinutes),
        mood: formData.mood,
        tasksCompleted: Number(formData.tasksCompleted)
      };
      
      await axios.post('/api/habits', payload);
      setSuccessMsg('Habit logged successfully! Your digital twin is updating...');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error logging habit:', error);
      alert('Failed to log habit');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Log Daily Habits</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Record your daily activities to feed your digital twin model. Be as accurate as possible for the best insights.
        </p>

        {successMsg && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Study / Work Hours</label>
              <input type="number" name="studyHours" value={formData.studyHours} onChange={handleChange} className="form-input" min="0" step="0.5" required />
            </div>
            <div className="form-group">
              <label className="form-label">Sleep Hours</label>
              <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleChange} className="form-input" min="0" step="0.5" required />
            </div>
            <div className="form-group">
              <label className="form-label">Screen Time (Hours)</label>
              <input type="number" name="screenTime" value={formData.screenTime} onChange={handleChange} className="form-input" min="0" step="0.5" required />
            </div>
            <div className="form-group">
              <label className="form-label">Exercise (Minutes)</label>
              <input type="number" name="exerciseMinutes" value={formData.exerciseMinutes} onChange={handleChange} className="form-input" min="0" required />
            </div>
            <div className="form-group">
              <label className="form-label">Tasks Completed</label>
              <input type="number" name="tasksCompleted" value={formData.tasksCompleted} onChange={handleChange} className="form-input" min="0" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mood</label>
              <select name="mood" value={formData.mood} onChange={handleChange} className="form-input" required>
                <option value="Great">Great</option>
                <option value="Good">Good</option>
                <option value="Neutral">Neutral</option>
                <option value="Bad">Bad</option>
                <option value="Awful">Awful</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
            Save & Update Twin
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogHabit;
