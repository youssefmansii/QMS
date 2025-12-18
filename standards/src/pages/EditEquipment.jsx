import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function EditEquipment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'Active',
    location: '',
    lastInspection: '',
    nextInspection: ''
  });

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`);
      const data = await response.json();
      
      // Format dates for input fields
      setFormData({
        name: data.name || '',
        type: data.type || '',
        status: data.status || 'Active',
        location: data.location || '',
        lastInspection: data.lastInspection 
          ? new Date(data.lastInspection).toISOString().split('T')[0]
          : '',
        nextInspection: data.nextInspection
          ? new Date(data.nextInspection).toISOString().split('T')[0]
          : ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        navigate('/equipment');
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Error updating equipment. Please try again.');
    }
  };

  const handleCompleteMaintenance = async () => {
    const today = new Date().toISOString().split('T')[0];
    const updatedData = {
      ...formData,
      status: 'Active',
      lastInspection: today
    };
    
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        navigate('/equipment');
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Error updating equipment. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Edit Equipment</h2>
      <form onSubmit={handleSubmit} className="equipment-form">
        <input
          type="text"
          placeholder="Equipment Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <input
          type="date"
          placeholder="Last Inspection"
          value={formData.lastInspection}
          onChange={(e) => setFormData({ ...formData, lastInspection: e.target.value })}
        />
        <input
          type="date"
          placeholder="Next Inspection"
          value={formData.nextInspection}
          onChange={(e) => setFormData({ ...formData, nextInspection: e.target.value })}
        />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="submit" className="btn-primary">Update Equipment</button>
          {formData.status === 'Maintenance' && (
            <button 
              type="button" 
              onClick={handleCompleteMaintenance} 
              className="btn-success"
            >
              ✓ Complete Maintenance (Set to Active)
            </button>
          )}
          <button type="button" onClick={() => navigate('/equipment')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEquipment;

