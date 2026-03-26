import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Cpu, Zap, Brain, Battery } from 'lucide-react';

const DigitalTwin = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/api/analytics/${user.id}`);
        setData(res.data);
      } catch (err) {}
    };
    if (user) fetchAnalytics();
  }, [user]);

  if (!data || !data.averages) return <div>Loading...</div>;

  const { study, sleep, screen } = data.averages;
  const isHealthy = sleep >= 7 && screen <= 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', background: 'var(--primary-light)', padding: '3rem' }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
           <Cpu size={120} color={isHealthy ? 'var(--secondary)' : 'var(--accent)'} style={{ opacity: 0.9, filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.1))' }} />
           <div style={{ marginTop: '2rem' }}>
             <h2 style={{ color: 'var(--primary)' }}>Your Digital Twin Model</h2>
             <p style={{ color: 'var(--text-muted)' }}>Status: {isHealthy ? 'Optimized' : 'Needs Adjustment'}</p>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Brain size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.125rem' }}>Focus Simulation</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Based on average study ({study}h) vs screen time ({screen}h), your twin predicts a focus capacity of <strong>{study > screen ? 'High' : 'Moderate'}</strong>.
            Reducing screen time by 1 hour could increase productivity by 15%.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Battery size={24} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.125rem' }}>Energy Reserves</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Averaging {sleep}h of sleep. {sleep < 7 ? 'Warning: Consistent sleep deprivation increases burnout risk by 40%.' : 'Excellent recovery time. Peak cognitive performance expected in morning sessions.'}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Zap size={24} color="var(--accent)" />
            <h3 style={{ fontSize: '1.125rem' }}>Smart Recommendations</h3>
          </div>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {sleep < 7 && <li>• Increase sleep time to minimum 7 hours</li>}
            {screen > 4 && <li>• Unplug 30 mins before bedtime</li>}
            {study < 2 && <li>• Schedule dedicated 2-hour study blocks</li>}
            {sleep >= 7 && screen <= 4 && study >= 2 && <li>• You're doing great! Maintain current habits.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
