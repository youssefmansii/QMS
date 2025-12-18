import { useState } from 'react';
import '../App.css';
import PreventiveMaintenance from '../components/processes/PreventiveMaintenance';
import Calibration from '../components/processes/Calibration';
import Documentation from '../components/processes/Documentation';
import Compliance from '../components/processes/Compliance';

function QMSProcesses() {
  const [activeTab, setActiveTab] = useState('preventive-maintenance');

  return (
    <div>
      <div className="process-tabs">
        <button
          className={activeTab === 'preventive-maintenance' ? 'active' : ''}
          onClick={() => setActiveTab('preventive-maintenance')}
        >
          Preventive Maintenance
        </button>
        <button
          className={activeTab === 'calibration' ? 'active' : ''}
          onClick={() => setActiveTab('calibration')}
        >
          Calibration
        </button>
        <button
          className={activeTab === 'documentation' ? 'active' : ''}
          onClick={() => setActiveTab('documentation')}
        >
          Documentation
        </button>
        <button
          className={activeTab === 'compliance' ? 'active' : ''}
          onClick={() => setActiveTab('compliance')}
        >
          Compliance
        </button>
      </div>

      <div className="process-content">
        {activeTab === 'preventive-maintenance' && <PreventiveMaintenance />}
        {activeTab === 'calibration' && <Calibration />}
        {activeTab === 'documentation' && <Documentation />}
        {activeTab === 'compliance' && <Compliance />}
      </div>
    </div>
  );
}

export default QMSProcesses;

