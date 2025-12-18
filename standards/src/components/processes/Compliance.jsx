import '../../App.css';

function Compliance() {
  const columns = [
    {
      title: 'Regulatory Requirements',
      items: [
        'FDA compliance (21 CFR Part 820)',
        'ISO 13485 certification',
        'CE marking requirements',
        'Local health authority regulations'
      ]
    },
    {
      title: 'Risk Management',
      items: [
        'Equipment risk classification',
        'Hazard identification',
        'Risk assessment and mitigation',
        'Incident reporting and investigation'
      ]
    },
    {
      title: 'Quality Assurance',
      items: [
        'Internal audits',
        'External audits',
        'Corrective and preventive actions (CAPA)',
        'Continuous improvement'
      ]
    }
  ];

  return (
    <div className="process-container">
      <h2 className="process-title">Compliance Management</h2>
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

export default Compliance;

