import { useState, useEffect, useRef, useCallback } from 'react';

const POOL = [
  { name: "The Apology to Mother (2019)", occupation: "Ambient Pressure", citizenship: "Naturalized" },
  { name: "You Look Beautiful Today", occupation: "Unuttered Compliment", citizenship: "Permanent Resident" },
  { name: "Actually, That's Incorrect", occupation: "Meeting Suppressor", citizenship: "Naturalized" },
  { name: "I Love You (→ Drive Safe)", occupation: "Conversion Artifact", citizenship: "Citizen by Birth" },
  { name: "Please Stop Talking To Me", occupation: "Polite Hostage", citizenship: "Asylum Seeker" },
  { name: "I Am Struggling", occupation: "Low-Grade Hum", citizenship: "Naturalized" },
  { name: "That Joke Was Not Funny", occupation: "Social Lubricant Withheld", citizenship: "Temporary Resident" },
  { name: "I Miss You", occupation: "Retroactive Grief", citizenship: "Citizen by Birth" },
  { name: "No.", occupation: "Blunt Instrument", citizenship: "Stateless" },
  { name: "You Hurt Me When You Said That", occupation: "Archived Wound", citizenship: "Naturalized" },
  { name: "I Don't Actually Agree", occupation: "Performed Consensus", citizenship: "Permanent Resident" },
  { name: "This Is Too Much For Me", occupation: "Load-Bearing Silence", citizenship: "Asylum Seeker" },
  { name: "I'm Proud of You", occupation: "Inherited Restraint", citizenship: "Citizen by Birth" },
  { name: "Can We Talk About This Later", occupation: "Deferral Mechanism", citizenship: "Temporary Resident" },
  { name: "I Don't Know How To Do This", occupation: "Competence Theater", citizenship: "Naturalized" },
  { name: "I Forgive You", occupation: "Unprocessed Cargo", citizenship: "Permanent Resident" },
  { name: "You Were Wrong About Me", occupation: "Dignitary Withheld", citizenship: "Stateless" },
  { name: "Help", occupation: "Emergency Suppressed", citizenship: "Asylum Seeker" },
  { name: "I'm Lonely", occupation: "Structural Hum", citizenship: "Citizen by Birth" },
  { name: "That Meant A Lot To Me", occupation: "Vulnerability Quarantined", citizenship: "Naturalized" },
];

function makeAge() {
  const years = Math.floor(Math.random() * 15);
  const months = Math.floor(Math.random() * 12);
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years} yr ${months} mo`;
}

function makeId() {
  return 'UNS-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function makeEntry(poolIndex) {
  const base = POOL[poolIndex % POOL.length];
  return {
    id: makeId(),
    name: base.name,
    occupation: base.occupation,
    citizenship: base.citizenship,
    age: makeAge(),
    arrivalTime: Date.now(),
    deportStatus: 'idle',
    poolIndex,
    isNew: true,
  };
}

const CITIZENSHIP_COLOR = {
  "Naturalized": "#5a6e3a",
  "Permanent Resident": "#4a5a6e",
  "Citizen by Birth": "#6e4a5a",
  "Temporary Resident": "#6e6040",
  "Asylum Seeker": "#7a4a3a",
  "Stateless": "#555",
};

const keyframesCSS = `
@keyframes fadeInRow {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes deportFly {
  0% { transform: translateX(0); opacity: 1; }
  60% { transform: translateX(55vw); opacity: 0.7; }
  75% { transform: translateX(55vw); opacity: 0.7; }
  100% { transform: translateX(0); opacity: 1; }
}
@keyframes stampIn {
  0% { opacity: 0; transform: rotate(-8deg) scale(1.4); }
  30% { opacity: 1; transform: rotate(-8deg) scale(1); }
  80% { opacity: 1; transform: rotate(-8deg) scale(1); }
  100% { opacity: 0; transform: rotate(-8deg) scale(0.95); }
}
@keyframes mouthPulse {
  0%, 100% { d: path('M 10 30 Q 30 50 50 30 Q 70 10 90 30'); }
  50% { d: path('M 10 30 Q 30 55 50 30 Q 70 5 90 30'); }
}
@keyframes populationTick {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
@keyframes arrivalPulse {
  0% { box-shadow: 0 0 0 0 rgba(90, 110, 58, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(90, 110, 58, 0); }
  100% { box-shadow: 0 0 0 0 rgba(90, 110, 58, 0); }
}
@keyframes blinkCursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

export default function Page() {
  const initialPool = useRef([...Array(20).keys()]);
  const usedPool = useRef([]);
  const poolCounter = useRef(0);

  function getNextPoolIndex() {
    const idx = poolCounter.current % POOL.length;
    poolCounter.current++;
    return idx;
  }

  const [inhabitants, setInhabitants] = useState(() => {
    const initial = [];
    for (let i = 0; i < 6; i++) {
      const entry = makeEntry(i);
      entry.isNew = false;
      initial.push(entry);
    }
    poolCounter.current = 6;
    return initial;
  });

  const [population, setPopulation] = useState(1847);
  const [deniedLog, setDeniedLog] = useState([]);
  const bottomRef = useRef(null);
  const [tickAnim, setTickAnim] = useState(false);

  useEffect(() => {
    const popInterval = setInterval(() => {
      setPopulation(p => p + 1);
      setTickAnim(t => !t);
    }, 1200);
    return () => clearInterval(popInterval);
  }, []);

  useEffect(() => {
    let timeout;
    function scheduleArrival() {
      const delay = 8000 + Math.random() * 6000;
      timeout = setTimeout(() => {
        const idx = getNextPoolIndex();
        setInhabitants(prev => [...prev, makeEntry(idx)]);
        setPopulation(p => p + Math.floor(Math.random() * 3) + 1);
        scheduleArrival();
      }, delay);
    }
    scheduleArrival();
    return () => clearTimeout(timeout);
  }, []);

  const handleDeport = useCallback((id) => {
    setInhabitants(prev =>
      prev.map(inh => inh.id === id ? { ...inh, deportStatus: 'deporting' } : inh)
    );

    setTimeout(() => {
      setInhabitants(prev =>
        prev.map(inh => {
          if (inh.id === id) {
            const denied = { ...inh, deportStatus: 'denied' };
            setDeniedLog(log => [denied, ...log.slice(0, 4)]);
            return denied;
          }
          return inh;
        })
      );
    }, 2600);

    setTimeout(() => {
      setInhabitants(prev =>
        prev.map(inh => inh.id === id
          ? { ...inh, deportStatus: 'idle', isNew: false, age: inh.age }
          : inh
        )
      );
    }, 5200);
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f0ebe0',
    fontFamily: "'Courier New', Courier, monospace",
    color: '#2a2a2a',
    padding: '0 0 120px 0',
    position: 'relative',
  };

  const headerStyle = {
    backgroundColor: '#d8d0be',
    borderBottom: '3px double #999',
    padding: '24px 40px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  };

  const sealStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '12px',
  };

  const sealCircle = {
    width: '54px',
    height: '54px',
    border: '3px solid #5a6e3a',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    color: '#5a6e3a',
    flexShrink: 0,
    backgroundColor: '#eee8d8',
  };

  const titleBlock = {
    flex: 1,
  };

  const mainTitle = {
    fontSize: '15px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#3a3a3a',
    margin: 0,
    fontWeight: 'bold',
  };

  const subTitle = {
    fontSize: '11px',
    letterSpacing: '0.1em',
    color: '#666',
    margin: '3px 0 0',
  };

  const populationBanner = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    backgroundColor: '#c8c0ae',
    padding: '8px 14px',
    borderRadius: '2px',
    border: '1px solid #aaa',
  };

  const popLabel = {
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#555',
  };

  const popNumber = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2a3a1a',
    letterSpacing: '0.05em',
    animation: 'populationTick 1.2s ease infinite',
  };

  const popProjected = {
    fontSize: '10px',
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 'auto',
  };

  const tableHeaderRow = {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 160px 130px 80px 110px',
    gap: '0',
    backgroundColor: '#c0b8a8',
    padding: '8px 40px',
    borderBottom: '1px solid #999',
    fontSize: '9px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#555',
    position: 'sticky',
    top: '130px',
    zIndex: 99,
  };

  const listContainer = {
    padding: '0 40px',
  };

  const getRowStyle = (inh) => {
    const isDeporting = inh.deportStatus === 'deporting';
    const isDenied = inh.deportStatus === 'denied';
    return {
      display: 'grid',
      gridTemplateColumns: '90px 1fr 160px 130px 80px 110px',
      gap: '0',
      padding: '14px 0',
      borderBottom: '1px solid #ccc4b4',
      position: 'relative',
      animation: inh.isNew
        ? 'fadeInRow 0.8s ease forwards, arrivalPulse 1.5s ease 0.3s'
        : isDeporting
        ? 'deportFly 2.6s ease forwards'
        : 'none',
      transition: 'background-color 0.3s',
      backgroundColor: isDenied ? '#f5e8e0' : 'transparent',
      overflow: 'visible',
    };
  };

  const cellStyle = {
    padding: '0 8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const idStyle = {
    fontSize: '9px',
    color: '#888',
    letterSpacing: '0.08em',
  };

  const nameStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 1.3,
  };

  const occupationStyle = {
    fontSize: '11px',
    color: '#555',
    fontStyle: 'italic',
  };

  const ageStyle = {
    fontSize: '11px',
    color: '#444',
  };

  const deportButton = {
    backgroundColor: 'transparent',
    border: '1px solid #8a3a2a',
    color: '#8a3a2a',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '9px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '5px 8px',
    cursor: 'pointer',
    borderRadius: '1px',
    transition: 'background-color 0.2s, color 0.2s',
  };

  const deportButtonHover = {
    backgroundColor: '#8a3a2a',
    color: '#f0ebe0',
  };

  const stampStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-8deg)',
    border: '3px solid #cc2200',
    color: '#cc2200',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    zIndex: 200,
    animation: 'stampIn 4.5s ease forwards',
    pointerEvents: 'none',
    backgroundColor: 'rgba(240, 235, 224, 0.92)',
    lineHeight: 1.4,
    textAlign: 'center',
  };

  const footerNote = {
    padding: '30px 40px',
    fontSize: '10px',
    color: '#888',
    fontStyle: 'italic',
    letterSpacing: '0.08em',
    borderTop: '1px solid #ccc',
    lineHeight: 1.8,
  };

  const mouthSvgContainer = {
    position: 'fixed',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '60px',
    zIndex: 50,
    opacity: 0.6,
    pointerEvents: 'none',
  };

  const borderStampFixed = {
    position: 'fixed',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    zIndex: 51,
    pointerEvents: 'none',
  };

  const borderLabel = {
    fontSize: '7px',
    color: '#5a6e3a',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    opacity: 0.7,
    marginTop: '8px',
  };

  const [hoveredId, setHoveredId] = useState(null);

  return (
    <>
      <style>{keyframesCSS}</style>
      <div style={containerStyle}>

        {/* Fixed mouth border crossing */}
        <div style={mouthSvgContainer}>
          <svg viewBox="0 0 100 80" width="60" height="48">
            <path
              d="M 5 40 Q 25 65 50 40 Q 75 15 95 40"
              fill="none"
              stroke="#5a6e3a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 5 40 Q 25 18 50 40 Q 75 62 95 40"
              fill="none"
              stroke="#5a6e3a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 20 40 Q 35 52 50 40 Q 65 28 80 40"
              fill="#c8b8a0"
              opacity="0.4"
            />
          </svg>
        </div>
        <div style={borderStampFixed}>
          <span style={borderLabel}>BORDER CROSSING · THE UNSAID</span>
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <div style={sealStyle}>
            <div style={sealCircle}>◎</div>
            <div style={titleBlock}>
              <p style={mainTitle}>MINISTRY OF INTERNAL SILENCE</p>
              <p style={subTitle}>Census Bureau · The Nation of The Unsaid · Est. Before Memory</p>
            </div>
            <div style={populationBanner}>
              <span style={popLabel}>Current Population</span>
              <span style={popNumber}>{population.toLocaleString()}</span>
              <span style={popProjected}>Projected by end of visit: More.</span>
            </div>
          </div>
          <div style={{ fontSize: '10px', color: '#777', fontStyle: 'italic', letterSpacing: '0.06em' }}>
            FORM UNS-7 · OFFICIAL CENSUS OF INHABITANTS · All entries are permanent unless deported. Deportation is not guaranteed.
          </div>
        </div>

        {/* Table header */}
        <div style={tableHeaderRow}>
          <span>File No.</span>
          <span>Name of Unsaid</span>
          <span>Occupation</span>
          <span>Citizenship Status</span>
          <span>Age Held</span>
          <span>Action</span>
        </div>

        {/* Inhabitants list */}
        <div style={listContainer}>
          {inhabitants.map((inh) => (
            <div key={inh.id} style={getRowStyle(inh)}>
              {/* Stamp overlay */}
              {inh.deportStatus === 'denied' && (
                <div style={stampStyle}>
                  REPATRIATED<br />
                  <span style={{ fontSize: '8px', letterSpacing: '0.1em' }}>Entry denied. Mouth was occupied.</span>
                </div>
              )}

              {/* File No */}
              <div style={cellStyle}>
                <span style={idStyle}>{inh.id}</span>
              </div>

              {/* Name */}
              <div style={{ ...cellStyle, paddingLeft: '0' }}>
                <span style={nameStyle}>{inh.name}</span>
              </div>

              {/* Occupation */}
              <div style={cellStyle}>
                <span style={occupationStyle}>{inh.occupation}</span>
              </div>

              {/* Citizenship */}
              <div style={cellStyle}>
                <span style={{
                  fontSize: '9px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: CITIZENSHIP_COLOR[inh.citizenship] || '#555',
                  border: `1px solid ${CITIZENSHIP_COLOR[inh.citizenship] || '#555'}`,
                  padding: '2px 5px',
                  display: 'inline-block',
                  borderRadius: '1px',
                }}>
                  {inh.citizenship}
                </span>
              </div>

              {/* Age */}
              <div style={cellStyle}>
                <span style={ageStyle}>{inh.age}</span>
              </div>

              {/* Deport button */}
              <div style={{ ...cellStyle, alignItems: 'flex-start' }}>
                {inh.deportStatus === 'idle' && (
                  <button
                    style={hoveredId === inh.id ? { ...deportButton, ...deportButtonHover } : deportButton}
                    onMouseEnter={() => setHoveredId(inh.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleDeport(inh.id)}
                  >
                    DEPORT
                  </button>
                )}
                {inh.deportStatus === 'deporting' && (
                  <span style={{ fontSize: '9px', color: '#8a3a2a', letterSpacing: '0.1em', fontStyle: 'italic' }}>
                    processing...
                  </span>
                )}
                {inh.deportStatus === 'denied' && (
                  <span style={{ fontSize: '9px', color: '#cc2200', letterSpacing: '0.1em' }}>
                    ✗ denied
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Footer note */}
        <div style={footerNote}>
          <p style={{ margin: '0 0 6px' }}>
            NOTE: The Nation of The Unsaid does not recognize extradition treaties with the spoken world.
          </p>
          <p style={{ margin: '0 0 6px' }}>
            All inhabitants retain rights of residency regardless of the discomfort of the host.
          </p>
          <p style={{ margin: '0' }}>
            New arrivals are processed continuously. The border is always open. The mouth is rarely.
          </p>
        </div>

        {/* Denied log sidebar note */}
        {deniedLog.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: '#f5e8e0',
            border: '1px solid #cc2200',
            padding: '12px 16px',
            maxWidth: '260px',
            zIndex: 300,
            fontSize: '9px',
            color: '#8a2a1a',
            letterSpacing: '0.08em',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Recent Denials
            </div>
            {deniedLog.slice(0, 3).map((entry, i) => (
              <div key={entry.id + i} style={{ marginBottom: '4px', borderBottom: '1px solid #ddd', paddingBottom: '4px', fontStyle: 'italic' }}>
                {entry.name}
              </div>
            ))}
            <div style={{ marginTop: '6px', color: '#aaa', fontStyle: 'italic' }}>
              Returned to host. Indefinitely.
            </div>
          </div>
        )}

        {/* Ambient ticker */}
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          height: '2px',
          backgroundColor: '#5a6e3a',
          opacity: 0.3,
          zIndex: 200,
        }} />
      </div>
    </>
  );
}