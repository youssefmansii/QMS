import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function AddEquipment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'Active',
    location: '',
    lastInspection: '',
    nextInspection: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        navigate('/equipment');
      }
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  return (
    <div>
      <h2>Add Equipment</h2>
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-primary">Add Equipment</button>
          <button type="button" onClick={() => navigate('/equipment')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddEquipment;

