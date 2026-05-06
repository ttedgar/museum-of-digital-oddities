import { useState, useEffect, useRef } from 'react';

const TEAMS = [
  {
    id: 'buffet2011',
    label: 'SECTOR 7 — THE BUFFET, 2011',
    short: 'BUFFET/2011',
    x: 18,
    y: 62,
    report: [
      'TEAM 1 TO BASE — SECTOR 7 SWEEP COMPLETE.',
      'Found residue consistent with sustained eye contact, pre-2014 vintage.',
      'Napkin recovered. Subject had written something down, crossed it out.',
      'Dogs are indicating near the dessert station. Something was here.',
      'It left in a hurry. Possibly startled. Over.',
    ],
  },
  {
    id: 'compliment',
    label: 'SECTOR 12 — THE COMPLIMENT YOU DEFLECTED',
    short: 'COMPLIMENT/DEFLECT',
    x: 72,
    y: 28,
    report: [
      'TEAM 2 TO BASE — SECTOR 12 NEGATIVE CONTACT.',
      'Located partial impression in carpet where subject used to stand.',
      'Impression suggests medium build. Appeared larger in mirrors.',
      'Found cached version of confidence, 2009 vintage. Will not load properly.',
      'File corrupted or — wait. It loads. Then it doesn\'t. Over.',
    ],
  },
  {
    id: 'perfReview',
    label: 'SECTOR 3 — PERFORMANCE REVIEW ARCHIVE',
    short: 'PERF/REVIEW',
    x: 45,
    y: 78,
    report: [
      'TEAM 3 TO BASE — SECTOR 3 ACCESSED. CONDITIONS HOSTILE.',
      'Documents recovered. Subject is referenced 14 times as "meets expectations."',
      'Signs of recent activity — something was here, left documents open.',
      'Thermal reads warm in Q3 2016 vicinity. Cold after.',
      'Recommend psychological support for field team. Over.',
    ],
  },
  {
    id: 'dance',
    label: 'SECTOR 19 — THE NIGHT YOU DANCED',
    short: 'DANCE/NIGHT',
    x: 82,
    y: 71,
    report: [
      'TEAM 4 TO BASE — SECTOR 19 LOCATED.',
      'Evidence of sustained movement. Floor markings consistent with joy.',
      'Subject was last observed speaking first. This was before Q3 2016.',
      'Witnesses confirm: it was there. It knew the words.',
      'We don\'t know what happened after midnight. Records end. Over.',
    ],
  },
];

const THERMAL_GRID = [
  [0,0,0,1,1,0,0,0],
  [0,0,1,2,2,1,0,0],
  [0,1,2,3,2,1,0,0],
  [0,0,1,2,2,1,0,0],
  [0,0,1,1,1,0,0,0],
  [0,1,2,2,1,1,0,0],
  [1,2,3,2,1,0,0,0],
  [0,1,1,1,0,0,0,0],
];

const THERMAL_COLORS = ['#1a1a2e','#2d1b00','#7a3300','#d4580a','#f2a93b'];

export default function Page() {
  const [activeTeam, setActiveTeam] = useState(null);
  const [teamReports, setTeamReports] = useState({});
  const [airSearchActivated, setAirSearchActivated] = useState(false);
  const [airSearchComplete, setAirSearchComplete] = useState(false);
  const [finalDispatchVisible, setFinalDispatchVisible] = useState(false);
  const [leaveItOpenChecked, setLeaveItOpenChecked] = useState(true);
  const [readyChecked] = useState(false);
  const [dispatchLog, setDispatchLog] = useState([
    'BASE OPS ACTIVE — CASE #CV-0000 OPENED.',
    'SUBJECT: CONFIDENCE (PERSONAL, UNCLASSIFIED)',
    'LAST KNOWN POSITION: BUFFET, REGIONAL CONFERENCE, 2011.',
    'ALL UNITS STAND BY FOR SECTOR ASSIGNMENTS.',
  ]);
  const [currentTime, setCurrentTime] = useState('');
  const [signalStrength, setSignalStrength] = useState(3);
  const [caseCloseAttempted, setCaseCloseAttempted] = useState(false);
  const [hoveredPhrase, setHoveredPhrase] = useState(null);
  const [blinkOn, setBlinkOn] = useState(true);
  const logRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2,'0');
      const m = String(now.getMinutes()).padStart(2,'0');
      const s = String(now.getSeconds()).padStart(2,'0');
      setCurrentTime(`${h}:${m}:${s} LOCAL`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSignalStrength(Math.floor(Math.random() * 4) + 1);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBlinkOn(b => !b), 700);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const allContacted = TEAMS.every(t => teamReports[t.id]);
    if (allContacted && !finalDispatchVisible) {
      const timer = setTimeout(() => {
        setFinalDispatchVisible(true);
        setDispatchLog(prev => [
          ...prev,
          '--- PRIORITY TRANSMISSION ---',
          'BASE TO ALL UNITS — SUBJECT LOCATED.',
          'CONFIDENCE FOUND. COORDINATES: UNKNOWN.',
          'SUBJECT IS REFUSING RECOVERY.',
          'OBSERVED OPERATING INDEPENDENTLY IN REGION WE CANNOT REACH',
          'WITHOUT YOUR COOPERATION.',
          'AWAITING AUTHORIZATION TO CLOSE CASE #CV-0000.',
          '--- END TRANSMISSION ---',
        ]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [teamReports, finalDispatchVisible]);

  useEffect(() => {
    if (airSearchActivated && !airSearchComplete) {
      const timer = setTimeout(() => {
        setAirSearchComplete(true);
        setDispatchLog(prev => [
          ...prev,
          'AIR UNIT TO BASE — SWEEP COMPLETE.',
          'NOTHING LOCATED FROM ALTITUDE.',
          'THERMAL IMAGING RETURNED ANOMALOUS READINGS.',
          'WARMTH DETECTED IN ALL THE WRONG PLACES.',
          'RECOMMEND GROUND FOLLOW-UP. OVER.',
        ]);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [airSearchActivated, airSearchComplete]);

  useEffect(() => {
    if (!leaveItOpenChecked) {
      const id = setTimeout(() => {
        setLeaveItOpenChecked(true);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [leaveItOpenChecked]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [dispatchLog]);

  const handleTeamClick = (team) => {
    if (teamReports[team.id]) {
      setActiveTeam(team.id);
      return;
    }
    setActiveTeam(team.id);
    setTeamReports(prev => ({ ...prev, [team.id]: true }));
    setDispatchLog(prev => [...prev, ...team.report]);
  };

  const handleAirSearch = () => {
    if (airSearchActivated) return;
    setAirSearchActivated(true);
    setDispatchLog(prev => [
      ...prev,
      'AIR SEARCH AUTHORIZED.',
      'DEPLOYING UNIT OVERHEAD. STAND BY.',
    ]);
  };

  const handleCloseCase = () => {
    if (!finalDispatchVisible) return;
    setCaseCloseAttempted(true);
  };

  const scanlineStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
  };

  const screenStyle = {
    minHeight: '100vh',
    background: '#0a0c07',
    color: '#8aaa4a',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '12px',
    padding: '0',
    position: 'relative',
    overflowX: 'hidden',
  };

  const phraseStyle = (key) => ({
    color: hoveredPhrase === key ? '#f2c94c' : '#b8d46a',
    background: hoveredPhrase === key ? 'rgba(242,201,76,0.1)' : 'transparent',
    cursor: 'default',
    transition: 'all 0.2s',
    borderBottom: '1px dotted #4a6020',
  });

  return (
    <div style={screenStyle}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scanmove { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:0.97} 94%{opacity:0.85} 96%{opacity:0.97} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; background: #0a0c07; }
        ::-webkit-scrollbar-thumb { background: #3a5010; }
      `}</style>
      <div style={scanlineStyle} />

      {/* Header Bar */}
      <div style={{
        background: '#0f1209',
        borderBottom: '2px solid #3a5010',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: 'flicker 8s infinite',
      }}>
        <div>
          <div style={{ color: '#f2c94c', fontSize: '16px', letterSpacing: '3px', fontWeight: 'bold' }}>
            ◈ SEARCH & RESCUE OPERATIONS CENTER
          </div>
          <div style={{ color: '#5a7a2a', fontSize: '10px', letterSpacing: '2px', marginTop: '2px' }}>
            CASE FILE #CV-0000 ▸ MISSING ENTITY ▸ CLASSIFICATION: PERSONAL
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#f2c94c', fontSize: '14px', letterSpacing: '2px' }}>
            {currentTime || '00:00:00 LOCAL'}
          </div>
          <div style={{ color: '#5a7a2a', fontSize: '10px', marginTop: '2px' }}>
            SIGNAL: {Array.from({length: 4}, (_,i) => (
              <span key={i} style={{ color: i < signalStrength ? '#8aaa4a' : '#2a3a10' }}>█</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0', minHeight: 'calc(100vh - 54px)' }}>

        {/* Left Panel — Missing Entity Report */}
        <div style={{
          width: '280px',
          minWidth: '280px',
          borderRight: '1px solid #2a3a10',
          padding: '16px',
          background: '#080b05',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{
            border: '1px solid #3a5010',
            padding: '10px',
            background: '#0d1008',
          }}>
            <div style={{ color: '#f2c94c', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>
              ▸ MISSING ENTITY REPORT
            </div>
            <div style={{ color: '#4a6a20', fontSize: '10px', marginBottom: '4px' }}>ENTITY:</div>
            <div style={{ color: '#c8e84a', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>
              CONFIDENCE (PERSONAL)
            </div>
            <div style={{ color: '#4a6a20', fontSize: '10px', marginBottom: '4px' }}>FILED BY:</div>
            <div style={{ color: '#8aaa4a', marginBottom: '10px' }}>THE USER (YOU)</div>
            <div style={{ color: '#4a6a20', fontSize: '10px', marginBottom: '4px' }}>DATE OPENED:</div>
            <div style={{ color: '#8aaa4a', marginBottom: '10px' }}>SOMETIME AFTER Q3 2016</div>
            <div style={{ color: '#4a6a20', fontSize: '10px', marginBottom: '4px' }}>STATUS:</div>
            <div style={{
              color: '#f2a93b',
              fontSize: '11px',
              animation: 'pulse 2s infinite',
              letterSpacing: '2px',
            }}>
              ● ACTIVE SEARCH
            </div>
          </div>

          <div style={{
            border: '1px solid #3a5010',
            padding: '10px',
            background: '#0d1008',
          }}>
            <div style={{ color: '#f2c94c', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>
              ▸ PHYSICAL DESCRIPTION
            </div>
            <div style={{ color: '#7a9a3a', lineHeight: '1.7', fontSize: '11px' }}>
              <span
                style={phraseStyle('build')}
                onMouseEnter={() => setHoveredPhrase('build')}
                onMouseLeave={() => setHoveredPhrase(null)}
              >Medium build.</span>
              {' '}
              <span
                style={phraseStyle('mirrors')}
                onMouseEnter={() => setHoveredPhrase('mirrors')}
                onMouseLeave={() => setHoveredPhrase(null)}
              >Appeared larger in mirrors.</span>
              {' '}
              <span
                style={phraseStyle('spoke')}
                onMouseEnter={() => setHoveredPhrase('spoke')}
                onMouseLeave={() => setHoveredPhrase(null)}
              >Spoke first in most rooms until approximately Q3 2016.</span>
              {' '}
              <span
                style={phraseStyle('laugh')}
                onMouseEnter={() => setHoveredPhrase('laugh')}
                onMouseLeave={() => setHoveredPhrase(null)}
              >Laughed without checking if it was appropriate.</span>
              {' '}
              <span
                style={phraseStyle('known')}
                onMouseEnter={() => setHoveredPhrase('known')}
                onMouseLeave={() => setHoveredPhrase(null)}
              >Known to occupy space without apologizing for it.</span>
            </div>
          </div>

          <div style={{
            border: '1px solid #3a5010',
            padding: '10px',
            background: '#0d1008',
          }}>
            <div style={{ color: '#f2c94c', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>
              ▸ LAST KNOWN POSITION
            </div>
            <div style={{ color: '#7a9a3a', lineHeight: '1.7', fontSize: '11px' }}>
              Regional Conference Buffet<br/>
              Sector 7, Grid Reference 18-62<br/>
              <span style={{ color: '#5a7a2a' }}>YEAR: 2011</span><br/>
              <span style={{ color: '#f2a93b', fontSize: '10px' }}>
                Dogs picking up something near the dessert station.
              </span>
            </div>
          </div>

          <div style={{
            border: '1px solid #3a5010',
            padding: '10px',
            background: '#0d1008',
          }}>
            <div style={{ color: '#f2c94c', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>
              ▸ TEAMS DEPLOYED
            </div>
            {TEAMS.map(team => (
              <div key={team.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '5px',
                fontSize: '10px',
              }}>
                <span style={{
                  color: teamReports[team.id] ? '#8aaa4a' : '#3a5010',
                  animation: !teamReports[team.id] ? 'pulse 3s infinite' : 'none',
                }}>
                  {teamReports[team.id] ? '◉' : '○'}
                </span>
                <span style={{ color: teamReports[team.id] ? '#7a9a3a' : '#3a5010' }}>
                  {team.short}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Center — Map */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #2a3a10',
        }}>
          <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid #2a3a10',
            background: '#0a0d07',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ color: '#5a7a2a', fontSize: '10px', letterSpacing: '2px' }}>
              OPERATIONAL MAP — SEARCH AREA ALPHA
            </div>
            <div style={{ fontSize: '10px', color: '#4a6020' }}>
              CLICK TEAM MARKERS TO REQUEST FIELD REPORTS
            </div>
          </div>

          {/* Map area */}
          <div style={{
            flex: 1,
            position: 'relative',
            background: '#080b05',
            overflow: 'hidden',
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'linear-gradient(rgba(58,80,16,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(58,80,16,0.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
            }} />

            {/* Contour-like rings */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <ellipse cx="45%" cy="50%" rx="30%" ry="25%" fill="none" stroke="#2a3a10" strokeWidth="1" strokeDasharray="4,8" />
              <ellipse cx="45%" cy="50%" rx="20%" ry="17%" fill="none" stroke="#2a3a10" strokeWidth="1" strokeDasharray="4,12" />
              <ellipse cx="45%" cy="50%" rx="10%" ry="9%" fill="none" stroke="#3a5010" strokeWidth="1" />
            </svg>

            {/* Team markers */}
            {TEAMS.map(team => {
              const contacted = !!teamReports[team.id];
              const isActive = activeTeam === team.id;
              return (
                <div
                  key={team.id}
                  onClick={() => handleTeamClick(team)}
                  style={{
                    position: 'absolute',
                    left: `${team.x}%`,
                    top: `${team.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                >
                  {/* Pulse ring */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isActive ? '40px' : '30px',
                    height: isActive ? '40px' : '30px',
                    borderRadius: '50%',
                    border: `2px solid ${contacted ? '#8aaa4a' : '#f2a93b'}`,
                    opacity: 0.4,
                    animation: 'pulse 2s infinite',
                    transition: 'all 0.3s',
                  }} />
                  {/* Marker */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: contacted ? '#1a2a08' : '#1a1000',
                    border: `2px solid ${contacted ? '#8aaa4a' : '#f2a93b'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: contacted ? '#8aaa4a' : '#f2a93b',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: isActive ? `0 0 12px ${contacted ? '#8aaa4a' : '#f2a93b'}` : 'none',
                  }}>
                    {contacted ? '◉' : '○'}
                  </div>
                  {/* Label */}
                  <div style={{
                    position: 'absolute',
                    top: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: '9px',
                    color: contacted ? '#7a9a3a' : '#7a6020',
                    background: '#080b05',
                    padding: '1px 4px',
                    border: `1px solid ${contacted ? '#3a5010' : '#3a2a10'}`,
                    letterSpacing: '1px',
                  }}>
                    {team.short}
                  </div>
                </div>
              );
            })}

            {/* Air search indicator */}
            {airSearchActivated && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '10px',
                color: airSearchComplete ? '#8aaa4a' : '#f2c94c',
                border: `1px solid ${airSearchComplete ? '#3a5010' : '#7a6020'}`,
                padding: '6px 10px',
                background: '#080b05',
                animation: airSearchComplete ? 'none' : 'pulse 1s infinite',
                letterSpacing: '1px',
              }}>
                {airSearchComplete ? '✓ AIR SWEEP COMPLETE' : '◈ AIR UNIT DEPLOYED...'}
              </div>
            )}

            {/* Thermal image */}
            {airSearchComplete && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                border: '1px solid #3a5010',
                background: '#050705',
                padding: '10px',
              }}>
                <div style={{ color: '#5a7a2a', fontSize: '9px', letterSpacing: '2px', marginBottom: '6px' }}>
                  THERMAL IMAGING — AIR UNIT RETURN
                </div>
                <div style={{ marginBottom: '6px' }}>
                  {THERMAL_GRID.map((row, ri) => (
                    <div key={ri} style={{ display: 'flex' }}>
                      {row.map((val, ci) => (
                        <div key={ci} style={{
                          width: '14px',
                          height: '14px',
                          background: THERMAL_COLORS[val],
                          border: '1px solid #080b05',
                        }} />
                      ))}
                    </div>
                  ))}
                </div>
                <div style={{ color: '#5a7a2a', fontSize: '9px', maxWidth: '120px', lineHeight: '1.5' }}>
                  WARMTH DETECTED.<br/>ALL WRONG PLACES.
                </div>
              </div>
            )}

            {/* Compass */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              color: '#3a5010',
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: '1',
            }}>
              <div style={{ textAlign: 'center', color: '#5a7a2a', fontSize: '10px' }}>N</div>
              <div style={{ textAlign: 'center' }}>+</div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: '#3a5010' }}>
                <span>W</span><span style={{ opacity: 0 }}>+</span><span>E</span>
              </div>
              <div style={{ textAlign: 'center', color: '#3a5010', fontSize: '10px' }}>S</div>
            </div>
          </div>

          {/* Active team report */}
          {activeTeam && (
            <div style={{
              borderTop: '1px solid #2a3a10',
              background: '#0a0d07',
              padding: '12px 16px',
              maxHeight: '140px',
              overflow: 'hidden',
            }}>
              <div style={{ color: '#f2c94c', fontSize: '10px', letterSpacing: '2px', marginBottom: '6px' }}>
                ▸ INCOMING TRANSMISSION — {TEAMS.find(t => t.id === activeTeam)?.short}
              </div>
              {TEAMS.find(t => t.id === activeTeam)?.report.map((line, i) => (
                <div key={i} style={{
                  color: i === 0 ? '#f2a93b' : '#7a9a3a',
                  fontSize: '11px',
                  lineHeight: '1.6',
                  letterSpacing: '0.5px',
                }}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Air search button */}
          <div style={{
            borderTop: '1px solid #2a3a10',
            padding: '10px 16px',
            background: '#080b05',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}>
            <button
              onClick={handleAirSearch}
              disabled={airSearchActivated}
              style={{
                background: airSearchActivated ? '#0a0d07' : '#1a2a08',
                border: `1px solid ${airSearchActivated ? '#2a3a10' : '#5a8020'}`,
                color: airSearchActivated ? '#3a5010' : '#8aaa4a',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '11px',
                padding: '8px 16px',
                cursor: airSearchActivated ? 'not-allowed' : 'pointer',
                letterSpacing: '2px',
                transition: 'all 0.2s',
              }}
            >
              {airSearchActivated
                ? (airSearchComplete ? '✓ AIR SWEEP COMPLETE' : '◈ AIR UNIT DEPLOYED')
                : '◈ AUTHORIZE AIR SEARCH'}
            </button>
            <span style={{ color: '#3a5010', fontSize: '10px' }}>
              {airSearchActivated ? '' : '— COSTS ONE CLICK. FINDS NOTHING.'}
            </span>
          </div>
        </div>

        {/* Right Panel — Dispatch Log & Case Closure */}
        <div style={{
          width: '300px',
          minWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
          background: '#080b05',
        }}>
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid #2a3a10',
            color: '#5a7a2a',
            fontSize: '10px',
            letterSpacing: '2px',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span>▸ DISPATCH LOG</span>
            <span style={{ color: blinkOn ? '#f2a93b' : 'transparent', fontSize: '10px' }}>● REC</span>
          </div>

          <div
            ref={logRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {dispatchLog.map((line, i) => (
              <div key={i} style={{
                color: line.startsWith('---') ? '#f2c94c' :
                       line.startsWith('BASE') ? '#f2a93b' :
                       line.startsWith('TEAM') || line.startsWith('AIR') ? '#8aaa4a' :
                       '#5a7a2a',
                fontSize: '10px',
                lineHeight: '1.6',
                letterSpacing: line.startsWith('---') ? '2px' : '0.3px',
                borderLeft: line.startsWith('---') ? '2px solid #f2c94c' : 'none',
                paddingLeft: line.startsWith('---') ? '6px' : '0',
              }}>
                {line}
              </div>
            ))}
            <div style={{ color: blinkOn ? '#5a7a2a' : 'transparent', fontSize: '10px' }}>▌</div>
          </div>

          {/* Final dispatch & case closure */}
          <div style={{
            borderTop: '2px solid #3a5010',
            padding: '14px',
            background: '#0a0d07',
          }}>
            {finalDispatchVisible ? (
              <>
                <div style={{
                  color: '#f2c94c',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  marginBottom: '10px',
                  borderBottom: '1px solid #3a5010',
                  paddingBottom: '8px',
                }}>
                  ▸ CASE CLOSURE AUTHORIZATION
                </div>
                <div style={{ color: '#7a9a3a', fontSize: '10px', lineHeight: '1.7', marginBottom: '12px' }}>
                  Subject located. Refusing recovery.<br/>
                  Operating independently.<br/>
                  <span style={{ color: '#f2a93b' }}>Requires your cooperation to reach.</span>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={readyChecked}
                    onChange={() => {}}
                    onClick={(e) => e.preventDefault()}
                    style={{ cursor: 'not-allowed', marginTop: '2px', accentColor: '#3a5010' }}
                  />
                  <label style={{ color: '#3a5010', fontSize: '10px', letterSpacing: '1px', cursor: 'not-allowed' }}>
                    I AM READY
                  </label>
                </div>

                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={leaveItOpenChecked}
                    onChange={() => setLeaveItOpenChecked(false)}
                    style={{ cursor: 'pointer', marginTop: '2px', accentColor: '#8aaa4a' }}
                  />
                  <label style={{ color: '#8aaa4a', fontSize: '10px', letterSpacing: '1px', cursor: 'pointer' }}>
                    LEAVE IT OPEN
                  </label>
                </div>

                <button
                  onClick={handleCloseCase}
                  style={{
                    width: '100%',
                    background: '#0d1008',
                    border: '1px solid #5a8020',
                    color: '#8aaa4a',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '10px',
                    padding: '8px',
                    cursor: 'pointer',
                    letterSpacing: '2px',
                  }}
                >
                  CLOSE CASE #CV-0000
                </button>
              </>
            ) : (
              <div style={{ color: '#3a5010', fontSize: '10px', lineHeight: '1.7', letterSpacing: '1px' }}>
                CASE CLOSURE PENDING.<br/>
                DEPLOY ALL TEAMS TO<br/>
                UNLOCK THIS SECTION.<br/>
                <span style={{ color: '#2a3a10' }}>
                  [{TEAMS.filter(t => teamReports[t.id]).length}/{TEAMS.length} TEAMS CONTACTED]
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case close modal */}
      {caseCloseAttempted && (
        <div
          onClick={() => setCaseCloseAttempted(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0a0d07',
              border: '2px solid #f2c94c',
              padding: '30px',
              maxWidth: '420px',
              width: '90%',
              fontFamily: '"Courier New", Courier, monospace',
              boxShadow: '0 0 40px rgba(242,201,76,0.2)',
            }}
          >
            <div style={{ color: '#f2c94c', fontSize: '14px', letterSpacing: '3px', marginBottom: '16px' }}>
              ◈ CASE CANNOT BE CLOSED
            </div>
            <div style={{ color: '#7a9a3a', fontSize: '11px', lineHeight: '1.8', marginBottom: '20px' }}>
              REASON: Subject is uncooperative.<br/><br/>
              The entity has been located but has declined recovery operations. It is currently operating in a region that cannot be accessed by field teams.<br/><br/>
              <span style={{ color: '#f2a93b' }}>
                Access requires cooperation from the filing party (you).
              </span><br/><br/>
              The case will remain open.<br/>
              The dogs will remain deployed.<br/>
              We will keep looking.
            </div>
            <button
              onClick={() => setCaseCloseAttempted(false)}
              style={{
                background: 'transparent',
                border: '1px solid #5a7a2a',
                color: '#8aaa4a',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '11px',
                padding: '8px 20px',
                cursor: 'pointer',
                letterSpacing: '2px',
                width: '100%',
              }}
            >
              ACKNOWLEDGE AND CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}