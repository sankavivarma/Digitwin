import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Play, Pause, Square, Coffee, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PomodoroTimer = () => {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleComplete]);

  const handleComplete = useCallback(async () => {
    setIsActive(false);
    
    // Save session to backend
    if (user) {
      try {
        await axios.post('/api/focus', {
          userId: user._id || user.id,
          durationMinutes: mode === 'focus' ? 25 : 5,
          type: mode
        });
      } catch (err) {
        console.error('Failed to save focus session', err);
      }
    }

    if (mode === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  }, [mode, user]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {mode === 'focus' ? <CheckCircle size={20} color="var(--primary)" /> : <Coffee size={20} color="var(--accent)" />}
        {mode === 'focus' ? 'Focus Session' : 'Break Time'}
      </h3>
      
      <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: mode === 'focus' ? 'var(--primary)' : 'var(--accent)', fontFamily: 'monospace', marginBottom: '1.5rem' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={toggleTimer} className={`btn ${mode === 'focus' ? 'btn-primary' : 'btn-accent'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Square size={18} />
          Reset
        </button>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Sessions Completed Today: <strong>{sessionsCompleted}</strong>
      </p>
    </div>
  );
};

export default PomodoroTimer;
