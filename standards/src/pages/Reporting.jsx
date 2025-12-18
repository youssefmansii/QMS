import { useState, useEffect } from 'react';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function Reporting() {
  const [equipment, setEquipment] = useState([]);
  const [dashboard, setDashboard] = useState({ total: 0, active: 0, maintenance: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    fetchData();
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const handleExport = () => {
    const reportData = {
      generated: new Date().toISOString(),
      summary: dashboard,
      equipment: equipment.map(item => ({
        name: item.name,
        type: item.type,
        status: item.status,
        location: item.location,
        lastInspection: item.lastInspection,
        nextInspection: item.nextInspection
      }))
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipment-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Reports</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Comprehensive reports on equipment status, maintenance history, and compliance
          </p>
        </div>
        <button onClick={handleExport} className="btn-primary">Export Report</button>
      </div>

      <div className="report-tabs">
        <button
          className={reportType === 'summary' ? 'active' : ''}
          onClick={() => setReportType('summary')}
        >
          Summary Report
        </button>
        <button
          className={reportType === 'status' ? 'active' : ''}
          onClick={() => setReportType('status')}
        >
          Status Report
        </button>
        <button
          className={reportType === 'maintenance' ? 'active' : ''}
          onClick={() => setReportType('maintenance')}
        >
          Maintenance Report
        </button>
        <button
          className={reportType === 'detailed' ? 'active' : ''}
          onClick={() => setReportType('detailed')}
        >
          Detailed Report
        </button>
      </div>

      {reportType === 'summary' && (
        <div className="report-section">
          <h3>Summary Report</h3>
          <div className="report-summary">
            <div className="report-summary-card">
              <h4>Equipment Overview</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Total Equipment:</span>
                  <span className="stat-value">{dashboard.total}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Active:</span>
                  <span className="stat-value">{dashboard.active} ({calculatePercentage(dashboard.active, dashboard.total)}%)</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">In Maintenance:</span>
                  <span className="stat-value">{dashboard.maintenance} ({calculatePercentage(dashboard.maintenance, dashboard.total)}%)</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Inactive:</span>
                  <span className="stat-value">{dashboard.inactive} ({calculatePercentage(dashboard.inactive, dashboard.total)}%)</span>
                </div>
              </div>
            </div>
            
            <div className="report-chart">
              <h4>Status Distribution</h4>
              <div className="chart-container">
                <div className="chart-bar">
                  <div className="chart-label">Active</div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill active"
                      style={{ width: `${calculatePercentage(dashboard.active, dashboard.total)}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{dashboard.active}</div>
                </div>
                <div className="chart-bar">
                  <div className="chart-label">Maintenance</div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill maintenance"
                      style={{ width: `${calculatePercentage(dashboard.maintenance, dashboard.total)}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{dashboard.maintenance}</div>
                </div>
                <div className="chart-bar">
                  <div className="chart-label">Inactive</div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill inactive"
                      style={{ width: `${calculatePercentage(dashboard.inactive, dashboard.total)}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{dashboard.inactive}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'status' && (
        <div className="report-section">
          <h3>Equipment Status Report</h3>
          <div className="status-report-grid">
            <div className="status-report-card">
              <h4>Active Equipment ({dashboard.active})</h4>
              <ul>
                {equipment.filter(e => e.status === 'Active').map(item => (
                  <li key={item._id}>{item.name} - {item.type}</li>
                ))}
              </ul>
            </div>
            <div className="status-report-card">
              <h4>Maintenance Equipment ({dashboard.maintenance})</h4>
              <ul>
                {equipment.filter(e => e.status === 'Maintenance').map(item => (
                  <li key={item._id}>{item.name} - {item.type}</li>
                ))}
              </ul>
            </div>
            <div className="status-report-card">
              <h4>Inactive Equipment ({dashboard.inactive})</h4>
              <ul>
                {equipment.filter(e => e.status === 'Inactive').map(item => (
                  <li key={item._id}>{item.name} - {item.type}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {reportType === 'maintenance' && (
        <div className="report-section">
          <h3>Maintenance Schedule Report</h3>
          <table>
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Type</th>
                <th>Last Inspection</th>
                <th>Next Inspection</th>
                <th>Status</th>
                <th>Days Until</th>
              </tr>
            </thead>
            <tbody>
              {equipment
                .filter(item => item.nextInspection)
                .sort((a, b) => new Date(a.nextInspection) - new Date(b.nextInspection))
                .map((item) => {
                  const daysUntil = Math.ceil((new Date(item.nextInspection) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.lastInspection ? new Date(item.lastInspection).toLocaleDateString() : '-'}</td>
                      <td>{new Date(item.nextInspection).toLocaleDateString()}</td>
                      <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td className={daysUntil < 0 ? 'overdue' : daysUntil <= 30 ? 'upcoming' : ''}>
                        {daysUntil < 0 ? `Overdue by ${Math.abs(daysUntil)} days` : `${daysUntil} days`}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {reportType === 'detailed' && (
        <div className="report-section">
          <h3>Detailed Equipment Report</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Location</th>
                <th>Last Inspection</th>
                <th>Next Inspection</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td>{item.location || '-'}</td>
                  <td>{item.lastInspection ? new Date(item.lastInspection).toLocaleDateString() : '-'}</td>
                  <td>{item.nextInspection ? new Date(item.nextInspection).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reporting;

