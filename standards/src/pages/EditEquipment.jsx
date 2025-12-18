import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import MaintenanceDocumentationModal from '../components/MaintenanceDocumentationModal';

const API_URL = 'http://localhost:5000/api';

function EditEquipment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
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
          : '',
        maintenanceHistory: data.maintenanceHistory || []
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
      // Get current equipment to preserve maintenanceHistory
      const currentResponse = await fetch(`${API_URL}/equipment/${id}`);
      const currentData = await currentResponse.json();
      
      const updateData = {
        ...formData,
        maintenanceHistory: currentData.maintenanceHistory || formData.maintenanceHistory || []
      };
      
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (response.ok) {
        navigate('/equipment');
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Error updating equipment. Please try again.');
    }
  };

  const handleCompleteMaintenance = () => {
    setShowDocumentationModal(true);
  };

  const handleSaveDocumentation = async (documentationData) => {
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`);
      const equipment = await response.json();
      
      // Add maintenance history entry with ISO date string
      const maintenanceEntry = {
        date: new Date().toISOString(),
        documentation: documentationData.documentation,
        technician: documentationData.technician || '',
        notes: documentationData.notes || ''
      };
      
      const maintenanceHistory = equipment.maintenanceHistory || [];
      maintenanceHistory.push(maintenanceEntry);
      
      const today = new Date().toISOString().split('T')[0];
      // Use the nextInspection from documentationData if provided, otherwise use formData
      const nextInspectionDate = documentationData.nextInspection || formData.nextInspection;
      
      // Only send the fields we want to update
      const updatedData = {
        name: formData.name,
        type: formData.type,
        status: 'Active',
        location: formData.location,
        lastInspection: today,
        nextInspection: nextInspectionDate,
        maintenanceHistory: maintenanceHistory
      };
      
      const updateResponse = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (updateResponse.ok) {
        const result = await updateResponse.json();
        console.log('Maintenance history saved:', result);
        setShowDocumentationModal(false);
        navigate('/equipment');
      } else {
        const errorData = await updateResponse.json();
        console.error('Update failed:', errorData);
        alert('Error saving documentation: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving documentation:', error);
      alert('Error saving documentation. Please try again.');
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

      {formData.maintenanceHistory && formData.maintenanceHistory.length > 0 && (
        <div className="maintenance-history-section">
          <h3 style={{ marginTop: '40px', marginBottom: '20px', color: '#333' }}>
            Maintenance History
          </h3>
          <div className="maintenance-history-list">
            {formData.maintenanceHistory
              .slice()
              .reverse()
              .map((entry, index) => (
                <div key={index} className="maintenance-history-item">
                  <div className="maintenance-history-header">
                    <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                    {entry.technician && (
                      <span className="maintenance-technician">Technician: {entry.technician}</span>
                    )}
                  </div>
                  <div className="maintenance-documentation">
                    <strong>Documentation:</strong>
                    <p>{entry.documentation}</p>
                  </div>
                  {entry.notes && (
                    <div className="maintenance-notes">
                      <strong>Notes:</strong>
                      <p>{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {showDocumentationModal && (
        <MaintenanceDocumentationModal
          equipment={formData}
          onClose={() => setShowDocumentationModal(false)}
          onSave={handleSaveDocumentation}
        />
      )}
    </div>
  );
}

export default EditEquipment;

