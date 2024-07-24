import React, { useState, useEffect } from 'react';
import './App.css';

const daysOfWeek = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];
const periods = [1, 2, 3, 4, 5];

function App() {
  const [data, setData] = useState([]);
  const [activeQuarter, setActiveQuarter] = useState(0);
  const [toggledSubjects, setToggledSubjects] = useState(new Set());

  useEffect(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const handleSubjectToggle = (subject) => {
    setToggledSubjects(prevSubjects => {
      const updatedSubjects = new Set(prevSubjects);
      if (updatedSubjects.has(subject)) {
        updatedSubjects.delete(subject);
      } else {
        updatedSubjects.add(subject);
      }
      return updatedSubjects;
    });
  };

  return (
    <div className="outer-container">
      <div className="button-container">
        {data.map((quarterData, index) => (
          <button key={index} onClick={() => setActiveQuarter(index)}>
            {quarterData.quarter}
          </button>
        ))}
      </div>
      <div className="quarter">
        <h2 className="quarter-header">{data[activeQuarter].quarter}</h2>
        <div className="schedule-table">
          <div className="schedule-row">
            <div className="schedule-cell"></div>
            {daysOfWeek.map(day => (
              <div className="schedule-cell" key={day}>{day}</div>
            ))}
          </div>
          {periods.map(period => (
            <div className="schedule-row" key={period}>
              <div className="schedule-cell period-cell">{period}限目</div>
              {daysOfWeek.map(day => (
                <div className="schedule-cell" key={day}>
                  {data[activeQuarter].items
                    .filter(item => item.day === day && item.period === period)
                    .map(item => (
                      <button
                        key={item.subject}
                        className={`subject-button ${toggledSubjects.has(item.subject) ? 'active' : ''}`}
                        onClick={() => handleSubjectToggle(item.subject)}
                      >
                        {item.subject}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        {toggledSubjects.size > 0 && (
          <div className="selected-subject-info">
            <h3>選択された科目</h3>
            <p>
              {Array.from(toggledSubjects).map(subject => (
                <div key={subject}>
                  <strong>{subject}</strong>
                  <ul>
                    {data[activeQuarter].items
                      .filter(item => item.subject === subject)
                      .map(item => (
                        <li key={`${item.day}-${item.period}`}>
                          {item.day} - {item.period}限目
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
