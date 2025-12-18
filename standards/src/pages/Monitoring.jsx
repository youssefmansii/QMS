import { useState, useEffect } from 'react';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function Monitoring() {
  const [equipment, setEquipment] = useState([]);
  const [dashboard, setDashboard] = useState({ total: 0, active: 0, maintenance: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [equipRes, dashRes] = await Promise.all([
        fetch(`${API_URL}/equipment`),
        fetch(`${API_URL}/dashboard`)
      ]);
      const equipData = await equipRes.json();
      const dashData = await dashRes.json();
      setEquipment(equipData);
      setDashboard(dashData);
      
      const now = new Date();
      const upcomingAlerts = equipData
        .filter(item => item.nextInspection)
        .map(item => {
          const nextDate = new Date(item.nextInspection);
          const daysUntil = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
          return { ...item, daysUntil };
        })
        .filter(item => item.daysUntil <= 30 && item.daysUntil >= 0)
        .sort((a, b) => a.daysUntil - b.daysUntil);
      
      setAlerts(upcomingAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '🟢';
      case 'maintenance':
        return '🟡';
      case 'inactive':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getAlertLevel = (daysUntil) => {
    if (daysUntil <= 7) return 'urgent';
    if (daysUntil <= 14) return 'warning';
    return 'info';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Equipment Monitoring</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Real-time monitoring of equipment status, maintenance schedules, and performance metrics
      </p>

      <div className="monitoring-overview">
        <div className="monitoring-card">
          <div className="monitoring-icon">📊</div>
          <div className="monitoring-info">
            <h3>Total Equipment</h3>
            <p className="monitoring-value">{dashboard.total}</p>
          </div>
        </div>
        <div className="monitoring-card active">
          <div className="monitoring-icon">✅</div>
          <div className="monitoring-info">
            <h3>Active</h3>
            <p className="monitoring-value">{dashboard.active}</p>
          </div>
        </div>
        <div className="monitoring-card maintenance">
          <div className="monitoring-icon">🔧</div>
          <div className="monitoring-info">
            <h3>In Maintenance</h3>
            <p className="monitoring-value">{dashboard.maintenance}</p>
          </div>
        </div>
        <div className="monitoring-card inactive">
          <div className="monitoring-icon">⏸️</div>
          <div className="monitoring-info">
            <h3>Inactive</h3>
            <p className="monitoring-value">{dashboard.inactive}</p>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Upcoming Maintenance Alerts</h3>
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert._id} className={`alert-item ${getAlertLevel(alert.daysUntil)}`}>
                <div className="alert-icon">
                  {getAlertLevel(alert.daysUntil) === 'urgent' ? '🔴' : '🟡'}
                </div>
                <div className="alert-content">
                  <strong>{alert.name}</strong> - {alert.type}
                  <br />
                  <small>
                    Next inspection: {new Date(alert.nextInspection).toLocaleDateString()} 
                    ({alert.daysUntil} {alert.daysUntil === 1 ? 'day' : 'days'} remaining)
                  </small>
                </div>
                <div className="alert-status">
                  <span className={`status-badge ${alert.status.toLowerCase()}`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="monitoring-table-section">
        <h3>Equipment Status Overview</h3>
        <div className="monitoring-table-wrapper">
          <table className="monitoring-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Equipment Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Last Inspection</th>
                <th>Next Inspection</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item._id} className={`status-row-${item.status.toLowerCase()}`}>
                  <td>
                    <span className="status-icon">{getStatusIcon(item.status)}</span>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.type}</td>
                  <td>{item.location || '-'}</td>
                  <td>{item.lastInspection ? new Date(item.lastInspection).toLocaleDateString() : '-'}</td>
                  <td>
                    {item.nextInspection ? (
                      <span className={new Date(item.nextInspection) < new Date() ? 'overdue' : ''}>
                        {new Date(item.nextInspection).toLocaleDateString()}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Monitoring;

