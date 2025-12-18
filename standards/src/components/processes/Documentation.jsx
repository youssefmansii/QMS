import '../../App.css';

function Documentation() {
  const columns = [
    {
      title: 'Equipment Records',
      items: [
        'Equipment identification and specifications',
        'Installation and acceptance records',
        'Maintenance history',
        'Calibration records',
        'Repair and modification logs'
      ]
    },
    {
      title: 'Procedures',
      items: [
        'Standard Operating Procedures (SOPs)',
        'Maintenance procedures',
        'Calibration procedures',
        'Safety protocols',
        'Emergency procedures'
      ]
    },
    {
      title: 'Compliance Documents',
      items: [
        'Regulatory certificates',
        'Inspection reports',
        'Audit reports',
        'Training records',
        'Non-conformance reports'
      ]
    }
  ];

  return (
    <div className="process-container">
      <h2 className="process-title">Documentation Standards</h2>
      <div className="documentation-columns">
        {columns.map((column, index) => (
          <div key={index} className="doc-column">
            <div className="doc-column-line"></div>
            <h3 className="doc-column-title">{column.title}</h3>
            <ul className="doc-list">
              {column.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Documentation;

