import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [dashboard, setDashboard] = useState({ total: 0, active: 0, maintenance: 0, inactive: 0 });
  const [equipment, setEquipment] = useState([]);
  const [analytics, setAnalytics] = useState({
    upcomingInspections: 0,
    overdueInspections: 0,
    byLocation: {},
    byType: {},
    recentInspections: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashRes, equipRes] = await Promise.all([
        fetch(`${API_URL}/dashboard`),
        fetch(`${API_URL}/equipment`)
      ]);
      const dashData = await dashRes.json();
      const equipData = await equipRes.json();
      
      setDashboard(dashData);
      setEquipment(equipData);
      
      // Calculate analytics
      const now = new Date();
      const upcomingInspections = equipData.filter(item => {
        if (!item.nextInspection) return false;
        const nextDate = new Date(item.nextInspection);
        const daysUntil = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
        return daysUntil <= 30 && daysUntil >= 0;
      }).length;

      const overdueInspections = equipData.filter(item => {
        if (!item.nextInspection) return false;
        return new Date(item.nextInspection) < now;
      }).length;

      const byLocation = {};
      equipData.forEach(item => {
        const loc = item.location || 'Unknown';
        byLocation[loc] = (byLocation[loc] || 0) + 1;
      });

      const byType = {};
      equipData.forEach(item => {
        const type = item.type || 'Unknown';
        byType[type] = (byType[type] || 0) + 1;
      });

      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentInspections = equipData.filter(item => {
        if (!item.lastInspection) return false;
        return new Date(item.lastInspection) >= thirtyDaysAgo;
      }).length;

      setAnalytics({
        upcomingInspections,
        overdueInspections,
        byLocation,
        byType,
        recentInspections
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) return <div className="loading">Loading...</div>;

  const topLocations = Object.entries(analytics.byLocation)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topTypes = Object.entries(analytics.byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h2>Dashboard</h2>
      
      {/* Main Stats */}
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Equipment</h3>
          <p className="stat-number">{dashboard.total}</p>
        </div>
        <div className="stat-card active">
          <h3>Active</h3>
          <p className="stat-number">{dashboard.active}</p>
          <small>{calculatePercentage(dashboard.active, dashboard.total)}% of total</small>
        </div>
        <div className="stat-card maintenance">
          <h3>Maintenance</h3>
          <p className="stat-number">{dashboard.maintenance}</p>
          <small>{calculatePercentage(dashboard.maintenance, dashboard.total)}% of total</small>
        </div>
        <div className="stat-card inactive">
          <h3>Inactive</h3>
          <p className="stat-number">{dashboard.inactive}</p>
          <small>{calculatePercentage(dashboard.inactive, dashboard.total)}% of total</small>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="analytics-section">
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>📅 Upcoming Inspections</h3>
            <p className="analytics-number">{analytics.upcomingInspections}</p>
            <small>Within next 30 days</small>
          </div>
          <div className="analytics-card urgent">
            <h3>⚠️ Overdue Inspections</h3>
            <p className="analytics-number">{analytics.overdueInspections}</p>
            <small>Require immediate attention</small>
          </div>
          <div className="analytics-card">
            <h3>✅ Recent Inspections</h3>
            <p className="analytics-number">{analytics.recentInspections}</p>
            <small>In last 30 days</small>
          </div>
          <div className="analytics-card">
            <h3>📊 Active Rate</h3>
            <p className="analytics-number">{calculatePercentage(dashboard.active, dashboard.total)}%</p>
            <small>Equipment operational</small>
          </div>
        </div>

        <div className="analytics-details">
          <div className="analytics-detail-card">
            <h3>Equipment by Location</h3>
            <div className="detail-list">
              {topLocations.length > 0 ? (
                topLocations.map(([location, count]) => (
                  <div key={location} className="detail-item">
                    <span className="detail-label">{location}</span>
                    <div className="detail-bar">
                      <div 
                        className="detail-bar-fill" 
                        style={{ width: `${calculatePercentage(count, dashboard.total)}%` }}
                      ></div>
                    </div>
                    <span className="detail-value">{count}</span>
                  </div>
                ))
              ) : (
                <p className="empty-detail">No location data available</p>
              )}
            </div>
          </div>

          <div className="analytics-detail-card">
            <h3>Equipment by Type</h3>
            <div className="detail-list">
              {topTypes.length > 0 ? (
                topTypes.map(([type, count]) => (
                  <div key={type} className="detail-item">
                    <span className="detail-label">{type}</span>
                    <div className="detail-bar">
                      <div 
                        className="detail-bar-fill type" 
                        style={{ width: `${calculatePercentage(count, dashboard.total)}%` }}
                      ></div>
                    </div>
                    <span className="detail-value">{count}</span>
                  </div>
                ))
              ) : (
                <p className="empty-detail">No type data available</p>
              )}
            </div>
          </div>
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

