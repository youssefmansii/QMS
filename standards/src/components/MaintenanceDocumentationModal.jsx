import { useState } from 'react';
import '../App.css';

function MaintenanceDocumentationModal({ equipment, onClose, onSave }) {
  // Calculate default next inspection date (3 months from today)
  const defaultNextInspection = new Date();
  defaultNextInspection.setMonth(defaultNextInspection.getMonth() + 3);
  const defaultNextInspectionStr = defaultNextInspection.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    documentation: '',
    technician: '',
    notes: '',
    nextInspection: defaultNextInspectionStr
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.documentation.trim()) {
      onSave(formData);
    } else {
      alert('Please enter maintenance documentation');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Maintenance Documentation</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '20px', color: '#666' }}>
            <strong>{equipment.name}</strong> - {equipment.type}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Maintenance Documentation *</label>
              <textarea
                value={formData.documentation}
                onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                placeholder="Describe the maintenance work performed, parts replaced, issues found, etc."
                rows="6"
                required
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label>Technician Name</label>
              <input
                type="text"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                placeholder="Name of technician who performed maintenance"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes or observations"
                rows="4"
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label>Next Inspection Date *</label>
              <input
                type="date"
                value={formData.nextInspection}
                onChange={(e) => setFormData({ ...formData, nextInspection: e.target.value })}
                className="form-input"
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                Set when the next maintenance inspection should be scheduled
              </small>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Documentation & Complete Maintenance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceDocumentationModal;

