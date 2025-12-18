import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <h2>Medical Equipment QMS</h2>
      </Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/qms-processes" className={location.pathname === '/qms-processes' ? 'active' : ''}>
          QMS Processes
        </Link>
        <Link to="/equipment" className={location.pathname.startsWith('/equipment') ? 'active' : ''}>
          Equipment
        </Link>
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/monitoring" className={location.pathname === '/monitoring' ? 'active' : ''}>
          Monitoring
        </Link>
        <Link to="/reporting" className={location.pathname === '/reporting' ? 'active' : ''}>
          Reporting
        </Link>
        <Link to="/challenging-point" className={location.pathname === '/challenging-point' ? 'active' : ''}>
          Challenging Point
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

