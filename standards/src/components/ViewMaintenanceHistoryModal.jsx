import '../App.css';

function ViewMaintenanceHistoryModal({ equipment, onClose }) {
  const maintenanceHistory = equipment.maintenanceHistory || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Maintenance History</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '20px', color: '#666', fontSize: '1.1rem' }}>
            <strong>{equipment.name}</strong> - {equipment.type}
            {equipment.location && <span> • {equipment.location}</span>}
          </p>

          {maintenanceHistory.length === 0 ? (
            <div className="empty-maintenance-history">
              <p>No maintenance history available for this equipment.</p>
            </div>
          ) : (
            <div className="maintenance-history-list">
              {maintenanceHistory
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
          )}

          <div className="modal-actions" style={{ marginTop: '30px' }}>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMaintenanceHistoryModal;

