import '../../App.css';

function PreventiveMaintenance() {
  const steps = [
    {
      number: 1,
      title: 'Equipment Registration',
      description: 'Register all medical equipment with unique IDs, specifications, and criticality levels'
    },
    {
      number: 2,
      title: 'Schedule Creation',
      description: 'Establish maintenance schedules based on manufacturer recommendations and regulatory requirements'
    },
    {
      number: 3,
      title: 'Maintenance Execution',
      description: 'Perform scheduled maintenance, inspections, and component replacements'
    },
    {
      number: 4,
      title: 'Documentation',
      description: 'Record all maintenance activities, findings, and corrective actions'
    },
    {
      number: 5,
      title: 'Verification',
      description: 'Verify equipment functionality and update status in the system'
    }
  ];

  return (
    <div className="process-container">
      <h2 className="process-title">Preventive Maintenance Process</h2>
      <div className="process-steps">
        {steps.map((step, index) => (
          <div key={step.number} className="step-container">
            <div className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="step-arrow">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreventiveMaintenance;

