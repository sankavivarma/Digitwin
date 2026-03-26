import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Activity, TrendingUp, Clock, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import PomodoroTimer from '../components/PomodoroTimer';
import ProductivitySimulator from '../components/ProductivitySimulator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const DashboardCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: `var(--${colorClass}-light)`, color: `var(--${colorClass})` }}>
      <Icon size={28} />
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{value}</h3>
      <p style={{ color: `var(--${colorClass})`, fontSize: '0.875rem', fontWeight: '500' }}>{subtitle}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [focusTime, setFocusTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnalytics, resInsights, resFocus] = await Promise.all([
           axios.get(`/api/analytics/${user.id}`),
           axios.get(`/api/analytics/${user.id}/insights`),
           axios.get(`/api/focus/${user.id}/insights`)
        ]);

        setData(resAnalytics.data);
        setInsights(resInsights.data);
        setFocusTime(resFocus.data.bestTime);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchData();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>Error loading data.</div>;

  const { latestScore, weeklyImprovement, averages, scores } = data;

  const chartData = {
    labels: scores.slice(-7).map(s => new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' })),
    datasets: [
      {
        fill: true,
        label: 'Productivity Score',
        data: scores.slice(-7).map(s => s.score),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 } }
  };

  return (
    <div>
      {/* Burnout Detection Warning */}
      {insights?.burnoutRisk && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#FEF2F2', border: '1px solid #F87171', borderRadius: '12px', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <AlertTriangle size={24} />
          <div>
            <strong>Burnout Risk Detected!</strong> Consider taking a break tomorrow. You've logged very low sleep and high study hours or poor mood.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <DashboardCard 
          title="Productivity Score" 
          value={latestScore ? `${latestScore.score} / 100` : 'N/A'} 
          subtitle="Latest Logged Score"
          icon={Activity} 
          colorClass="primary" 
        />
        <DashboardCard 
          title="This Week" 
          value={weeklyImprovement > 0 ? `+${weeklyImprovement}%` : `${weeklyImprovement}%`} 
          subtitle="Compared to last week"
          icon={TrendingUp} 
          colorClass="secondary" 
        />
        <DashboardCard 
          title="Avg Sleep" 
          value={`${averages.sleep} hrs`} 
          subtitle="Last 7 days"
          icon={Clock} 
          colorClass="accent" 
        />
        <DashboardCard 
          title="Best Focus Time" 
          value={focusTime || "Morning"} 
          subtitle="Based on Pomodoros"
          icon={Target} 
          colorClass="primary" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Digital Twin AI Insights */}
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
          <h3 style={{ marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={24} /> Digital Twin Simulation
          </h3>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.6', fontWeight: '500', marginBottom: '1rem' }}>
            {insights?.twinInsight || "Log more habits to train your digital twin model."}
          </p>
          
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.95rem' }}><strong>Recommendation:</strong> {insights?.recommendation}</span>
          </div>
        </div>

        {/* Pomodoro Timer */}
        <PomodoroTimer />

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
            Productivity Trend
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
          </h3>
          <div style={{ height: '300px' }}>
            {scores.length > 0 ? (
              <Line options={chartOptions} data={chartData} />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data to display yet</div>
            )}
          </div>
        </div>

        {/* Productivity Simulator */}
        <ProductivitySimulator />

      </div>
    </div>
  );
};

export default Dashboard;
