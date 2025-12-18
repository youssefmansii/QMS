import '../../App.css';

function Calibration() {
  const steps = [
    {
      number: 1,
      title: 'Calibration Schedule',
      description: 'Determine calibration intervals based on equipment type and usage'
    },
    {
      number: 2,
      title: 'Traceability',
      description: 'Ensure calibration standards are traceable to national/international standards'
    },
    {
      number: 3,
      title: 'Calibration Execution',
      description: 'Perform calibration using certified equipment and documented procedures'
    },
    {
      number: 4,
      title: 'Certificate Issuance',
      description: 'Generate calibration certificates with measurement uncertainties'
    },
    {
      number: 5,
      title: 'Status Update',
      description: 'Update equipment status and schedule next calibration'
    }
  ];

  return (
    <div className="process-container">
      <h2 className="process-title">Calibration Process</h2>
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

export default Calibration;

