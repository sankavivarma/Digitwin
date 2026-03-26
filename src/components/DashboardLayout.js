import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart2, Activity, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProductivityChatbot from './ProductivityChatbot';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/log-habit', label: 'Log Habit', icon: PlusCircle },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/twin', label: 'Digital Twin', icon: Activity },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem' }}>
          <h2 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={24} />
            Digital Twin
          </h2>
        </div>
        
        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '8px',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={logout}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-muted)', backgroundColor: 'transparent', padding: '0.5rem' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hello, {user?.name || 'User'}!</h1>
            <p style={{ color: 'var(--text-muted)' }}>Here's your productivity overview.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        
        {/* Render nested routes */}
        <Outlet />
      </main>

      {/* Global Chatbot */}
      <ProductivityChatbot />
    </div>
  );
};

export default DashboardLayout;
