import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import MaintenanceDocumentationModal from '../components/MaintenanceDocumentationModal';
import ViewMaintenanceHistoryModal from '../components/ViewMaintenanceHistoryModal';

const API_URL = 'http://localhost:5000/api';

function EquipmentList() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

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

  const handleCompleteMaintenanceClick = (item) => {
    setSelectedEquipment(item);
    setShowDocumentationModal(true);
  };

  const handleSaveDocumentation = async (documentationData) => {
    try {
      const response = await fetch(`${API_URL}/equipment/${selectedEquipment._id}`);
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
      
      // Calculate default next inspection (3 months from today) if not provided
      const defaultNextInspection = new Date();
      defaultNextInspection.setMonth(defaultNextInspection.getMonth() + 3);
      const nextInspectionDate = documentationData.nextInspection || defaultNextInspection.toISOString().split('T')[0];
      
      // Only send the fields we want to update
      const updatedData = {
        name: equipment.name,
        type: equipment.type,
        status: 'Active',
        location: equipment.location,
        lastInspection: new Date().toISOString(),
        nextInspection: nextInspectionDate,
        maintenanceHistory: maintenanceHistory
      };
      
      const updateResponse = await fetch(`${API_URL}/equipment/${selectedEquipment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (updateResponse.ok) {
        const result = await updateResponse.json();
        console.log('Maintenance history saved:', result);
        setShowDocumentationModal(false);
        setSelectedEquipment(null);
        fetchEquipment();
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
                    {(item.maintenanceHistory && item.maintenanceHistory.length > 0) && (
                      <button 
                        onClick={() => {
                          setSelectedEquipment(item);
                          setShowHistoryModal(true);
                        }} 
                        className="btn-info"
                        title="View maintenance history and documentation"
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        📄 History
                      </button>
                    )}
                    {item.status === 'Maintenance' && (
                      <button 
                        onClick={() => handleCompleteMaintenanceClick(item)} 
                        className="btn-success"
                        title="Complete maintenance and add documentation"
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

      {showDocumentationModal && selectedEquipment && (
        <MaintenanceDocumentationModal
          equipment={selectedEquipment}
          onClose={() => {
            setShowDocumentationModal(false);
            setSelectedEquipment(null);
          }}
          onSave={handleSaveDocumentation}
        />
      )}

      {showHistoryModal && selectedEquipment && (
        <ViewMaintenanceHistoryModal
          equipment={selectedEquipment}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedEquipment(null);
          }}
        />
      )}
    </div>
  );
}

export default EquipmentList;

