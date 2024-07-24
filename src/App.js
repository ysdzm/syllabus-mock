import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import './App.css';

const daysOfWeek = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];
const periods = ["1-2", "3-4", "5-6", "7-8", "9-10", "11-12", "13-14"];
const quarters = ["１", "２", "３", "４"]; // クォーターの順序

function App() {
  const [data, setData] = useState([]);
  const [activeQuarter, setActiveQuarter] = useState("１");
  const [selectedSubjects, setSelectedSubjects] = useState({});

  useEffect(() => {
    fetch('/all_timetable_data.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const handleSubjectToggle = (subject, day, period, quarter) => {
    setSelectedSubjects(prevSubjects => {
      const key = `${quarter}-${day}-${period}`;
      const isSelected = prevSubjects[key]?.subject === subject;
      const newSubjects = { ...prevSubjects };

      if (isSelected) {
        delete newSubjects[key];
      } else {
        newSubjects[key] = { subject, quarter }; // クォーター名も保存
      }

      return newSubjects;
    });
  };

  const groupedSubjects = quarters.reduce((acc, quarter) => {
    acc[quarter] = Object.entries(selectedSubjects).filter(([key, { quarter: q }]) => q === quarter).map(([key, { subject }]) => ({ key, subject }));
    return acc;
  }, {});

  return (
    <div className="outer-container">
      <div className="main-content">
        <div className="tab-container">
          <Nav variant="tabs" defaultActiveKey="1" onSelect={(selectedKey) => setActiveQuarter(selectedKey)}>
            {quarters.map((quarter) => (
              <Nav.Item key={quarter}>
                <Nav.Link eventKey={quarter}>第{quarter}クォーター</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <div className="quarter">
          <h2 className="quarter-header">第{activeQuarter}クォーター</h2>
          <div className="schedule-table">
            <div className="schedule-row header-row">
              <div className="schedule-cell"></div>
              {daysOfWeek.map(day => (
                <div className="schedule-cell" key={day}>{day}</div>
              ))}
            </div>
            {periods.map(periodRange => (
              <div className="schedule-row" key={periodRange}>
                <div className="schedule-cell period-cell">{periodRange}限目</div>
                {daysOfWeek.map(day => (
                  <div className="schedule-cell" key={day}>
                    <div className="subjects-container">
                      {data
                        .filter(item => item.クォーター === activeQuarter && item.曜日 + "曜日" === day && item.時間 === periodRange)
                        .map(item => (
                          <button
                            key={item.講義名}
                            className={`subject-button ${selectedSubjects[`${activeQuarter}-${day}-${periodRange}`]?.subject === item.講義名 ? 'active' : ''}`}
                            onClick={() => handleSubjectToggle(item.講義名, day, periodRange, activeQuarter)}
                          >
                            {item.講義名}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="selected-subject-info">
        {quarters.map(quarter => (
          <div key={quarter}>
            <h3>第{quarter}クォーター</h3>
            {groupedSubjects[quarter].length > 0 ? (
              groupedSubjects[quarter].map(({ key, subject }) => {
                const [day, period] = key.split('-');
                return (
                  <div key={key}>
                    <p>{subject}</p>
                    <ul>
                      {data
                        .filter(item => item.講義名 === subject && item.クォーター === quarter && item.曜日 + "曜日" === day && item.時間 === period)
                        .map(item => (
                          <li key={`${item.曜日}-${item.時間}`}>
                            {item.曜日}曜日 - {item.時間}
                          </li>
                        ))}
                    </ul>
                  </div>
                );
              })
            ) : (
              <p>選択された科目はありません。</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
