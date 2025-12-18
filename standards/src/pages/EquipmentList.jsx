import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function EquipmentList() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${API_URL}/equipment`);
      const data = await response.json();
      setEquipment(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await fetch(`${API_URL}/equipment/${id}`, { method: 'DELETE' });
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const handleQuickStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`);
      const equipment = await response.json();
      const updatedData = { ...equipment, status: newStatus };
      if (equipment.status === 'Maintenance' && newStatus === 'Active') {
        updatedData.lastInspection = new Date().toISOString();
      }
      const updateResponse = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (updateResponse.ok) {
        fetchEquipment();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`);
      const equipment = await response.json();
      const updatedData = { ...equipment, status: newStatus };
      if (currentStatus === 'Maintenance' && newStatus === 'Active') {
        updatedData.lastInspection = new Date().toISOString();
      }
      const updateResponse = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (updateResponse.ok) {
        fetchEquipment();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Equipment List</h2>
        <Link to="/equipment/add" className="btn-primary">Add New Equipment</Link>
      </div>
      {equipment.length === 0 ? (
        <p className="empty">No equipment found. Add some equipment to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Last Inspection</th>
              <th>Next Inspection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              {equipment.map((item) => (
              <tr key={item._id}>
                <td style={{ fontWeight: '500' }}>{item.name}</td>
                <td>{item.type}</td>
                <td>
                  <select 
                    value={item.status} 
                    onChange={(e) => handleStatusChange(item._id, item.status, e.target.value)}
                    className="status-select"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      backgroundColor: item.status === 'Active' ? '#d1fae5' : 
                                     item.status === 'Maintenance' ? '#fef3c7' : '#fee2e2',
                      color: item.status === 'Active' ? '#065f46' : 
                             item.status === 'Maintenance' ? '#92400e' : '#991b1b'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>{item.location}</td>
                <td>{item.lastInspection ? new Date(item.lastInspection).toLocaleDateString() : '-'}</td>
                <td>{item.nextInspection ? new Date(item.nextInspection).toLocaleDateString() : '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => navigate(`/equipment/edit/${item._id}`)} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    {item.status === 'Maintenance' && (
                      <button 
                        onClick={() => handleQuickStatusUpdate(item._id, 'Active')} 
                        className="btn-success"
                        title="Mark maintenance as complete"
                      >
                        ✓ Complete
                      </button>
                    )}
                    <button onClick={() => handleDelete(item._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EquipmentList;

