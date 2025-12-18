import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import AddEquipment from './pages/AddEquipment';
import EditEquipment from './pages/EditEquipment';
import QMSProcesses from './pages/QMSProcesses';
import Schedule from './pages/Schedule';
import Monitoring from './pages/Monitoring';
import Reporting from './pages/Reporting';
import ChallengingPoint from './pages/ChallengingPoint';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Medical Equipment QMS</h1>
        </header>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qms-processes" element={<QMSProcesses />} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/equipment/add" element={<AddEquipment />} />
            <Route path="/equipment/edit/:id" element={<EditEquipment />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/challenging-point" element={<ChallengingPoint />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
