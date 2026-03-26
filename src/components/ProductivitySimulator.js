import React, { useState } from 'react';
import { Sliders, Activity } from 'lucide-react';

const ProductivitySimulator = () => {
  const [sleep, setSleep] = useState(7);
  const [exercise, setExercise] = useState(30);
  const [screen, setScreen] = useState(4);
  const [study, setStudy] = useState(4);

  // Simple simulation calculation matching the backend pattern roughly
  // Productivity Score = (Study Hours × 5) + (Exercise × 2) + (Sleep Hours × 3) − (Screen Time × 2)
  const calculateSimulatedScore = () => {
    let score = (study * 5) + ((exercise / 60) * 2 * 60) + (sleep * 3) - (screen * 2);
    if (score > 100) return 100;
    if (score < 0) return 0;
    return Math.round(score);
  };

  const predictedScore = calculateSimulatedScore();

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sliders size={20} color="var(--primary)" />
        What-If Productivity Simulator
      </h3>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Adjust your planned habits to see how your Digital Twin predicts your productivity score.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            <span>Sleep (Hours)</span>
            <span style={{ color: 'var(--primary)' }}>{sleep}h</span>
          </label>
          <input type="range" min="0" max="12" value={sleep} onChange={(e) => setSleep(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            <span>Study/Work (Hours)</span>
            <span style={{ color: 'var(--primary)' }}>{study}h</span>
          </label>
          <input type="range" min="0" max="16" value={study} step="0.5" onChange={(e) => setStudy(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            <span>Exercise (Mins)</span>
            <span style={{ color: 'var(--primary)' }}>{exercise}m</span>
          </label>
          <input type="range" min="0" max="120" value={exercise} step="5" onChange={(e) => setExercise(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            <span>Screen Time (Hours)</span>
            <span style={{ color: 'var(--primary)' }}>{screen}h</span>
          </label>
          <input type="range" min="0" max="16" value={screen} step="0.5" onChange={(e) => setScreen(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Predicted Score</p>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Activity size={28} />
          {predictedScore} / 100
        </div>
      </div>
    </div>
  );
};

export default ProductivitySimulator;
