import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resAnalytics, resPrediction, resWeekly, resHeatmap] = await Promise.all([
          axios.get(`/api/analytics/${user.id}`),
          axios.get(`/api/analytics/${user.id}/prediction`),
          axios.get(`/api/analytics/${user.id}/weekly`),
          axios.get(`/api/analytics/${user.id}/heatmap`)
        ]);

        setData(resAnalytics.data);
        setPrediction(resPrediction.data.prediction);
        setWeekly(resWeekly.data);
        setHeatmap(resHeatmap.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchAllData();
  }, [user]);

  if (loading) return <div>Loading analytics...</div>;
  if (!data || !data.logs || data.logs.length === 0) return <div>Log some habits first to see analytics.</div>;

  const labels = data.logs.map(log => new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }));
  
  const studyData = data.logs.map(log => log.studyHours);
  const screenData = data.logs.map(log => log.screenTime);

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Study Hours',
        data: studyData,
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
      },
      {
        label: 'Screen Time',
        data: screenData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      }
    ]
  };

  const pieChartData = {
    labels: ['Study', 'Sleep', 'Screen Time', 'Exercise (hrs)'],
    datasets: [
      {
        data: [
          data.averages.study, 
          data.averages.sleep, 
          data.averages.screen, 
          data.logs.reduce((acc, curr) => acc + curr.exerciseMinutes, 0) / (data.logs.length * 60)
        ],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
      }
    ]
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Productivity Intelligence & Analytics</h2>
      
      {/* Advanced Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Prediction Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: 'var(--primary-light)' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Tomorrow's Prediction</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)', margin: '0.25rem 0' }}>
              {prediction ? `${prediction}%` : 'Need more data'}
            </h3>
            <p style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>Estimated based on trends</p>
          </div>
        </div>

        {/* Weekly Report Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--secondary)" /> Weekly Report
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Average Score:</span>
            <span style={{ fontWeight: 'bold' }}>{weekly?.averageScore || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Best Day:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{weekly?.bestDay || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Needs Focus:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{weekly?.worstDay || 'N/A'}</span>
          </div>
        </div>

      </div>

      {/* Productivity Heatmap */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           Productivity Heatmap (Last 30 Days)
        </h3>
        {heatmap.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Not enough data for heatmap.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {heatmap.map((day, idx) => {
               let bgColor = '#E5E7EB'; // Default gray
               if (day.level === 'green') bgColor = '#10B981';
               if (day.level === 'yellow') bgColor = '#FBBF24';
               if (day.level === 'red') bgColor = '#EF4444';

               return (
                 <div 
                   key={idx} 
                   title={`${new Date(day.date).toLocaleDateString()}: ${day.score}`}
                   style={{
                     width: '20px', 
                     height: '20px', 
                     backgroundColor: bgColor, 
                     borderRadius: '4px',
                     cursor: 'pointer'
                   }}
                 />
               )
            })}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '2px' }} /> High (≥80)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#FBBF24', borderRadius: '2px' }} /> Medium (50-79)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', borderRadius: '2px' }} /> Low (&lt;50)
          </div>
        </div>
      </div>
      
      {/* Existing Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Study vs Screen Time</h3>
          <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Time Distribution</h3>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
