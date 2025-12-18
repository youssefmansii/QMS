import '../App.css';

function ChallengingPoint() {
  return (
    <div>
      <h2>Challenging Point & Resolution</h2>
      <div className="challenge-section">
        <h3>Challenge Identified</h3>
        <p>One of the challenging points in implementing a QMS for medical equipment is ensuring real-time tracking of equipment status and coordinating maintenance schedules across multiple departments while maintaining compliance with regulatory requirements.</p>
        
        <h3>Solution Implemented</h3>
        <p>Our system addresses this challenge by providing:</p>
        <ul>
          <li>Centralized equipment database with MongoDB for reliable data storage</li>
          <li>Automated maintenance schedule tracking</li>
          <li>Real-time dashboard for equipment status monitoring</li>
          <li>Comprehensive documentation and reporting features</li>
          <li>Alert system for upcoming maintenance and calibration due dates</li>
        </ul>
      </div>
    </div>
  );
}

export default ChallengingPoint;

