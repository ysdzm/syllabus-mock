import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const daysOfWeek = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];
const periods = ["1-2", "3-4", "5-6", "7-8", "9-10", "11-12", "13-14"];
const quarters = ["１", "２", "３", "４"];

function App() {
  const [data, setData] = useState([]);
  const [activeQuarter, setActiveQuarter] = useState("１");
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [highlight1000, setHighlight1000] = useState(false);
  const [highlight2000, setHighlight2000] = useState(false);
  const [highlight3000, setHighlight3000] = useState(false);
  const [highlight4000, setHighlight4000] = useState(false);
  const [highlight5000, setHighlight5000] = useState(false);
  const [highlight6000, setHighlight6000] = useState(false);
  const [highlight7000, setHighlight7000] = useState(false);
  const [highlight8000, setHighlight8000] = useState(false);

  useEffect(() => {
    fetch('/all_timetable_data.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const handleSubjectToggle = (subject, day, period, quarter, number) => {
    setSelectedSubjects(prevSubjects => {
      const key = day === "全遠隔" ? `${quarter}-${day}-${period}-${number}` : `${quarter}-${day}-${period}`;
      const isSelected = prevSubjects[key]?.subject === subject;
      const newSubjects = { ...prevSubjects };

      if (isSelected) {
        delete newSubjects[key];
      } else {
        newSubjects[key] = { subject, quarter };
      }

      return newSubjects;
    });
  };

  const groupedSubjects = quarters.reduce((acc, quarter) => {
    acc[quarter] = Object.entries(selectedSubjects).filter(([key, { quarter: q }]) => q === quarter).map(([key, { subject }]) => ({ key, subject }));
    return acc;
  }, {});

  const [regularData, remoteData] = data.reduce(([regular, remote], item) => {
    if (item.曜日 === "全遠隔") {
      remote.push(item);
    } else {
      regular.push(item);
    }
    return [regular, remote];
  }, [[], []]);

  // 選択されている科目の個数を取得
  const selectedSubjectCount = Object.keys(selectedSubjects).length;

  const getHighlightClass = (number) => {
    if (highlight1000 && number >= 1000 && number < 2000) return 'highlight1000';
    if (highlight2000 && number >= 2000 && number < 3000) return 'highlight2000';
    if (highlight3000 && number >= 3000 && number < 4000) return 'highlight3000';
    if (highlight4000 && number >= 4000 && number < 5000) return 'highlight4000';
    if (highlight5000 && number >= 5000 && number < 6000) return 'highlight5000';
    if (highlight6000 && number >= 6000 && number < 7000) return 'highlight6000';
    if (highlight7000 && number >= 7000 && number < 8000) return 'highlight7000';
    if (highlight8000 && number >= 8000 && number < 9000) return 'highlight8000';
    return '';
  };

  return (
    <div className="outer-container">
      <div className="checkbox-container">
          <label>
            <input type="checkbox" checked={highlight1000} onChange={() => setHighlight1000(!highlight1000)} />
            1000番台
          </label>
          <label>
            <input type="checkbox" checked={highlight2000} onChange={() => setHighlight2000(!highlight2000)} />
            2000番台
          </label>
          <label>
            <input type="checkbox" checked={highlight3000} onChange={() => setHighlight3000(!highlight3000)} />
            3000番台
          </label>
          <label>
            <input type="checkbox" checked={highlight4000} onChange={() => setHighlight4000(!highlight4000)} />
            4000番台
          </label>
          <label>
            <input type="checkbox" checked={highlight5000} onChange={() => setHighlight5000(!highlight5000)} />
            5000番台
          </label>
          <label>
            <input type="checkbox" checked={highlight6000} onChange={() => setHighlight6000(!highlight6000)} />
            6000番台
          </label>
          <label>
            <input type="checkbox" checked={highlight7000} onChange={() => setHighlight7000(!highlight7000)} />
            7000番台
          </label>
          <label>
            <input type="checkbox" checked={highlight8000} onChange={() => setHighlight8000(!highlight8000)} />
            8000番台
          </label>
        </div>
      <div className="main-content">
        <header>名古屋工業大学 大学院 履修チェッカー</header>
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
                      {regularData
                        .filter(item => item.クォーター === activeQuarter && item.曜日 + "曜日" === day && item.時間 === periodRange)
                        .map(item => (
                          <button
                            key={item.講義名}
                            className={`subject-button ${selectedSubjects[`${activeQuarter}-${day}-${periodRange}`]?.subject === item.講義名 ? 'active' : ''} ${getHighlightClass(item.時間割番号)}`}
                            onClick={() => handleSubjectToggle(item.講義名, day, periodRange, activeQuarter)}
                          >
                            {item.講義名} <br/> {item.時間割番号}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="remote-container">
            {remoteData
              .filter(item => item.クォーター === activeQuarter && item.曜日 === "全遠隔")
              .map(item => (
                <button
                  key={item.講義名}
                  className={`subject-button ${selectedSubjects[`${activeQuarter}-全遠隔-${item.時間}-${item.時間割番号}`]?.subject === item.講義名 ? 'active' : ''} ${getHighlightClass(item.時間割番号)}`}
                  onClick={() => handleSubjectToggle(item.講義名, "全遠隔", item.時間, activeQuarter, item.時間割番号)}
                >
                  {item.講義名} <br/> {item.時間割番号}
                </button>
              ))}
          </div>
        </div>
      </div>
      <div className="selected-subject-info">
        <h3>選択されている科目数: {selectedSubjectCount}</h3>
        {quarters.map(quarter => (
          <div key={quarter}>
            <h3>第{quarter}クォーター</h3>
            {groupedSubjects[quarter].length > 0 ? (
              groupedSubjects[quarter].map(({ key, subject }) => {
                const [q, day, period] = key.split('-');
                return (
                  <div key={key}>
                    <p class="subject-button">{subject}</p>
                    {/* <ul>
                      {data
                        .filter(item => item.講義名 === subject && item.クォーター === quarter && (item.曜日 + "曜日" === day || (day === "全遠隔" && item.曜日 === "全遠隔")) && item.時間 === period)
                        .map(item => (
                          <li key={`${item.曜日}-${item.時間}`}>
                            {item.曜日}曜日 - {item.時間}
                          </li>
                        ))}
                    </ul> */}
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
