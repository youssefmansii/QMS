import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [dashboard, setDashboard] = useState({ total: 0, active: 0, maintenance: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard`);
      const data = await response.json();
      setDashboard(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Equipment</h3>
          <p className="stat-number">{dashboard.total}</p>
        </div>
        <div className="stat-card active">
          <h3>Active</h3>
          <p className="stat-number">{dashboard.active}</p>
        </div>
        <div className="stat-card maintenance">
          <h3>Maintenance</h3>
          <p className="stat-number">{dashboard.maintenance}</p>
        </div>
        <div className="stat-card inactive">
          <h3>Inactive</h3>
          <p className="stat-number">{dashboard.inactive}</p>
        </div>
      </div>
      <div className="actions">
        <Link to="/equipment" className="btn-primary" style={{ marginRight: '10px' }}>
          View All Equipment
        </Link>
        <Link to="/equipment/add" className="btn-primary">Add New Equipment</Link>
      </div>
    </div>
  );
}

export default Dashboard;

