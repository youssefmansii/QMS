import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function Schedule() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      filterEquipmentByDate(selectedDate);
    }
  }, [selectedDate, equipment]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${API_URL}/equipment`);
      const data = await response.json();
      setEquipment(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const filterEquipmentByDate = (date) => {
    // Use local date format (YYYY-MM-DD) for comparison
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const filtered = equipment.filter(item => {
      if (!item.nextInspection) return false;
      const inspectionDate = new Date(item.nextInspection);
      const inspectionYear = inspectionDate.getFullYear();
      const inspectionMonth = String(inspectionDate.getMonth() + 1).padStart(2, '0');
      const inspectionDay = String(inspectionDate.getDate()).padStart(2, '0');
      const inspectionDateStr = `${inspectionYear}-${inspectionMonth}-${inspectionDay}`;
      return inspectionDateStr === dateStr;
    });
    setSelectedEquipment(filtered);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };


  const hasMaintenance = (day) => {
    return getMaintenanceCount(day) > 0;
  };

  const getMaintenanceCount = (day) => {
    const { year, month } = getDaysInMonth(currentDate);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return equipment.filter(item => {
      if (!item.nextInspection) return false;
      const inspectionDate = new Date(item.nextInspection);
      const inspectionYear = inspectionDate.getFullYear();
      const inspectionMonth = String(inspectionDate.getMonth() + 1).padStart(2, '0');
      const inspectionDay = String(inspectionDate.getDate()).padStart(2, '0');
      const inspectionDateStr = `${inspectionYear}-${inspectionMonth}-${inspectionDay}`;
      return inspectionDateStr === dateStr;
    }).length;
  };

  const handleDayClick = (day) => {
    const { year, month } = getDaysInMonth(currentDate);
    const date = new Date(year, month, day);
    setSelectedDate(date);
    filterEquipmentByDate(date);
  };

  const handleEquipmentClick = (id) => {
    navigate(`/equipment/edit/${id}`);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Maintenance Schedule</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        View equipment maintenance schedule by date. Click on highlighted dates to see equipment requiring maintenance.
      </p>

      <div className="schedule-container">
        <div className="calendar-wrapper">
          <div className="calendar-header">
            <button onClick={previousMonth} className="calendar-nav-btn">‹</button>
            <h3>{monthNames[month]} {year}</h3>
            <button onClick={nextMonth} className="calendar-nav-btn">›</button>
          </div>

          <div className="calendar">
            <div className="calendar-weekdays">
              {dayNames.map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>

            <div className="calendar-days">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="calendar-day empty"></div>
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const hasMaintenanceDay = hasMaintenance(day);
                const maintenanceCount = getMaintenanceCount(day);
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                const isSelected = selectedDate && 
                  selectedDate.getDate() === day && 
                  selectedDate.getMonth() === month && 
                  selectedDate.getFullYear() === year;

                return (
                  <div
                    key={day}
                    className={`calendar-day ${hasMaintenanceDay ? 'has-maintenance' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span className="day-number">{day}</span>
                    {hasMaintenanceDay && (
                      <span className="maintenance-indicator" title={`${maintenanceCount} equipment(s) need maintenance`}>
                        {maintenanceCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-box today-legend"></div>
              <span>Today</span>
            </div>
            <div className="legend-item">
              <div className="legend-box maintenance-legend"></div>
              <span>Maintenance Scheduled</span>
            </div>
            <div className="legend-item">
              <div className="legend-box selected-legend"></div>
              <span>Selected Date</span>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="selected-date-equipment">
            <h3>Equipment Scheduled for {selectedDate.toLocaleDateString()}</h3>
            {selectedEquipment.length > 0 ? (
              <div className="equipment-list-mini">
                {selectedEquipment.map(item => (
                  <div 
                    key={item._id} 
                    className="equipment-item-mini"
                    onClick={() => handleEquipmentClick(item._id)}
                  >
                    <div className="equipment-item-header">
                      <strong>{item.name}</strong>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="equipment-item-details">
                      <span>{item.type}</span>
                      {item.location && <span> • {item.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-equipment">No equipment scheduled for this date</p>
            )}
            <button 
              onClick={() => navigate('/equipment')} 
              className="btn-primary"
              style={{ marginTop: '20px' }}
            >
              View All Equipment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;

