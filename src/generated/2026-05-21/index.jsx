import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [selectedExcuses, setSelectedExcuses] = useState([]);
  const [chartPoints, setChartPoints] = useState([]);
  const [activeIncident, setActiveIncident] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [animFrame, setAnimFrame] = useState(0);
  const [fathomsSincerity, setFathomsSincerity] = useState(0);
  const [predictedHighTide, setPredictedHighTide] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const rafRef = useRef(null);
  const flickerRef = useRef(null);

  const excuseCategories = [
    { id: 'iwas', label: 'I was going to but', freq: 1.2, amp: 40, color: '#00b4d8' },
    { id: 'nothat', label: "It's not that I don't want to", freq: 0.8, amp: 55, color: '#48cae4' },
    { id: 'ivejust', label: "I've just been really", freq: 1.7, amp: 35, color: '#90e0ef' },
    { id: 'normally', label: 'Normally I would', freq: 0.6, amp: 60, color: '#ade8f4' },
    { id: 'iknow', label: 'I know, I know, but', freq: 2.1, amp: 30, color: '#caf0f8' },
    { id: 'timing', label: "The timing isn't right", freq: 0.9, amp: 50, color: '#0096c7' },
    { id: 'eventually', label: 'Eventually I will', freq: 0.4, amp: 70, color: '#0077b6' },
    { id: 'deserve', label: "I don't deserve to be", freq: 1.5, amp: 45, color: '#023e8a' },
  ];

  const contradictionPairs = [
    ['iwas', 'eventually'],
    ['nothat', 'deserve'],
    ['timing', 'normally'],
    ['iknow', 'ivejust'],
  ];

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const forecastDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'next Friday', 'an unspecified future date'];
  const conditions = [
    'favorable for postponement',
    'excellent visibility of better options not taken',
    'light winds, heavy regret',
    'overcast with intermittent clarity',
    'fog advisory: self-knowledge reduced to 0.2 nautical miles',
    'seas 4-6 ft, intentions moderate to confused',
    'calm surface, significant subsurface turbulence',
  ];

  const incidentTemplates = {
    iwas: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Intention-Class Sloop 'Eventually'\nPOSITION: {lat}N {lon}W\n\nAt approximately {time}, Station 7 received automated distress signal from tidal body designated I-WAS-GOING-TO. Analysis confirms subject vessel departed intention harbor but executed unauthorized 180-degree course reversal at bearing 270. No distress equipment deployed. Crew reports 'something came up.' Coast Guard finds this explanation structurally insufficient. The something has not been identified. The something may not exist. Chart notation: NAVIGATIONAL HAZARD — unmanned good intention drifting in shipping lane. Vessels carrying actual plans are advised to maintain 2nm clearance.",
    nothat: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Ambivalence-Class Tender 'Technically Willing'\nPOSITION: {lat}N {lon}W\n\nStation 7 logs report of vessel broadcasting contradictory signals simultaneously on channels 16 and 22. Subject repeatedly transmitting 'I do want to' while executing evasive maneuvers away from port of destination. Rescue personnel dispatched and stood down three times. Subject insists no rescue required. Subject's want-to-meter reads full. Subject's do-to-meter reads empty. Instrument discrepancy under investigation. Chart notation: DOUBLE SIGNAL HAZARD — approach with caution, verify actual bearing before accepting stated bearing.",
    ivejust: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Fatigue-Class Barge 'Chronically Occupied'\nPOSITION: {lat}N {lon}W\n\nStation 7 records third consecutive week of 'I've just been really' tidal surge. Surge began Sunday. Surge has not abated. Survey team attempted to measure depth of 'really' and encountered instrument failure at 40 fathoms. The 'really' continues downward. No bottom found. Subject reports being 'slammed' though no collision has been recorded in any maritime log since initial excuse deployment. Chart notation: DEPTH UNKNOWN — do not anchor here. The really is load-bearing and unstable.",
    normally: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Precedent-Class Cruiser 'Historical Me'\nPOSITION: {lat}N {lon}W\n\nStation 7 has received report of ghost vessel. Vessel 'Historical Me' frequently cited in communications but cannot be located in current waters. Extensive search conducted. No vessel matching description found at cited coordinates. Witnesses insist vessel exists and 'normally' operates at high efficiency. Witnesses have not provided documentation. Documentation request pending since 2019. Chart notation: PHANTOM VESSEL — do not rely on for navigation. Existence unconfirmed. Behavior unpredictable if found.",
    iknow: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Acknowledgment-Class Patrol 'Yes But'\nPOSITION: {lat}N {lon}W\n\nStation 7 documents unusual tidal pattern: full acknowledgment of hazard followed by immediate re-entry into hazard. Subject confirmed to have received all warnings. Subject confirmed warnings understood. Subject entered warned area anyway. This is the fourth documented entry. Rescue personnel have begun bringing their own coffee. The 'I know' is functioning correctly. The function of the 'I know' appears to be decorative. Chart notation: KNOWN HAZARD, WILLINGLY NAVIGATED — no further rescue resources to be allocated without written waiver.",
    timing: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Scheduling-Class Dinghy 'When Things Calm Down'\nPOSITION: {lat}N {lon}W\n\nStation 7 has been monitoring vessel 'When Things Calm Down' for 847 days. Vessel has not moved. Subject reports awaiting favorable conditions. Conditions have been favorable on 203 separate occasions during monitoring period. Subject was notified on each occasion. Subject reports conditions were 'almost' favorable. Station 7 meteorologists have reviewed all 203 occasions and found them to be definitionally favorable. The definition of favorable may have changed. Chart notation: PERMANENTLY ANCHORED IN WAITING — fairway obstruction, report to harbormaster.",
    eventually: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Deferral-Class Tanker 'Someday'\nPOSITION: {lat}N {lon}W\n\nStation 7 notes that vessel 'Someday' has been listing 'eventual departure' in its sailing plan for an indeterminate period. 'Eventually' does not appear in the International Maritime Organization's approved list of departure times. Station 7 has requested clarification. Vessel has not responded. Vessel appears operational. Vessel's engines are running. Vessel is pointed at the correct destination. Vessel is not moving. Harbor pilot reports the vessel 'knows where it's going.' Chart notation: OPERATIONAL BUT STATIONARY — caution when passing, wake may disturb.",
    deserve: "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7\nDATE/TIME: {time} LOCAL\nVESSEL: Worthiness-Class Submarine 'Beneath Notice'\nPOSITION: {lat}N {lon}W\n\nStation 7 has located vessel running at extreme depth. Vessel capable of surface operation. Vessel has declined to surface. Subject reports not deserving favorable waters. Station 7 has reviewed subject's maritime record and found no disqualifying infractions. Favorable waters remain available. Subject disputes station's authority to make this determination. Subject has countermanded their own sailing permit. Chart notation: SELF-SUBMERGED VESSEL — surface recommended but cannot be compelled. Waters remain reserved pending subject's revised assessment of own seaworthiness.",
  };

  const contradictionTemplate = "INCIDENT REPORT — NOAA EXCUSE MONITORING STATION 7 *** PRIORITY ALPHA ***\nDATE/TIME: {time} LOCAL\nCLASSIFICATION: RIP CURRENT EVENT / CONTRADICTORY TIDAL BODY\nPOSITION: {lat}N {lon}W\n\nSTATION 7 ALERT: Two incompatible tidal bodies have achieved simultaneous high pressure. Analysis confirms subject is currently maintaining mutually exclusive positions. The water is aware of this. The water has recorded this. Tidal bodies designated {ex1} and {ex2} are generating opposing currents in the same navigational channel. Rip current velocity: significant. Any intention attempting to navigate this channel will be pulled seaward and deposited approximately 400 meters from where it started. Station 7 has issued SMALL CRAFT ADVISORY for all intentions under 40 feet. Larger intentions may attempt passage but should expect structural fatigue. Chart notation: CONTRADICTORY WATERS — do not swim here. The water knows you are lying. The water has always known.";

  useEffect(() => {
    let t = 0;
    const loop = () => {
      t += 0.02;
      setAnimFrame(t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (selectedExcuses.length === 0) {
      setChartPoints([]);
      setAdvisories([]);
      setPredictedHighTide('');
      return;
    }

    const pts = [];
    const width = 700;
    const steps = 140;
    const baseline = 120;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const t = (i / steps) * Math.PI * 4;
      let y = 0;

      selectedExcuses.forEach((id, idx) => {
        const cat = excuseCategories.find(c => c.id === id);
        if (cat) {
          y += Math.sin(t * cat.freq + idx * 0.7) * cat.amp;
          y += Math.sin(t * cat.freq * 1.618 + idx) * (cat.amp * 0.3);
        }
      });

      const hasContradiction = contradictionPairs.some(
        ([a, b]) => selectedExcuses.includes(a) && selectedExcuses.includes(b)
      );

      if (hasContradiction) {
        const spike = Math.sin(t * 5.3) * 30 * Math.random();
        y += spike;
      }

      pts.push({ x, y: baseline - y * 0.5, rawY: y, idx: i });
    }

    const newAdvisories = [];
    const stacked = selectedExcuses.length >= 3;
    if (stacked) newAdvisories.push('SMALL CRAFT ADVISORY: Stacked excuses detected. Load-bearing capacity exceeded.');

    const contradiction = contradictionPairs.find(
      ([a, b]) => selectedExcuses.includes(a) && selectedExcuses.includes(b)
    );
    if (contradiction) {
      newAdvisories.push('RIP CURRENT WARNING: Contradictory tidal bodies in simultaneous operation.');
    }

    if (selectedExcuses.includes('eventually') && selectedExcuses.includes('timing')) {
      newAdvisories.push('GALE FORCE WARNING: Infinite deferral loop detected in excuse system.');
    }

    setChartPoints(pts);
    setAdvisories(newAdvisories);

    const dayIdx = (selectedExcuses.length * 3 + 1) % forecastDays.length;
    const condIdx = selectedExcuses.reduce((a, s) => a + s.length, 0) % conditions.length;
    setPredictedHighTide(`${forecastDays[dayIdx]}, conditions: ${conditions[condIdx]}`);
  }, [selectedExcuses]);

  useEffect(() => {
    if (selectedExcuses.length > 0) {
      clearTimeout(flickerRef.current);
      setFathomsSincerity(0.1);
      flickerRef.current = setTimeout(() => setFathomsSincerity(0), 400);
    }
    return () => clearTimeout(flickerRef.current);
  }, [selectedExcuses]);

  const toggleExcuse = (id) => {
    setSelectedExcuses(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handlePointClick = (pt) => {
    const excuseId = selectedExcuses[pt.idx % selectedExcuses.length] || selectedExcuses[0];
    const contradiction = contradictionPairs.find(
      ([a, b]) => selectedExcuses.includes(a) && selectedExcuses.includes(b)
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const lat = (40 + Math.sin(pt.idx) * 5).toFixed(4);
    const lon = (70 + Math.cos(pt.idx) * 5).toFixed(4);

    let text;
    if (contradiction && Math.abs(pt.rawY) > 50) {
      const cat1 = excuseCategories.find(c => c.id === contradiction[0]);
      const cat2 = excuseCategories.find(c => c.id === contradiction[1]);
      text = contradictionTemplate
        .replace(/{time}/g, timeStr)
        .replace(/{lat}/g, lat)
        .replace(/{lon}/g, lon)
        .replace('{ex1}', cat1?.label || contradiction[0])
        .replace('{ex2}', cat2?.label || contradiction[1]);
    } else {
      const template = incidentTemplates[excuseId] || incidentTemplates['iwas'];
      text = template
        .replace(/{time}/g, timeStr)
        .replace(/{lat}/g, lat)
        .replace(/{lon}/g, lon);
    }

    const tideLevel = Math.abs(pt.rawY).toFixed(1);
    const classification = Math.abs(pt.rawY) > 60 ? 'SPRING TIDE' : Math.abs(pt.rawY) > 30 ? 'NEAP TIDE' : 'SLACK WATER';

    setActiveIncident({ text, tideLevel, classification, x: pt.x, y: pt.y });
  };

  const getWavePath = (offset = 0, amplitude = 15, freq = 1) => {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 700;
      const y = 220 + Math.sin((i / 100) * Math.PI * 2 * freq + animFrame + offset) * amplitude
                   + Math.sin((i / 100) * Math.PI * 3 * freq + animFrame * 1.3 + offset) * (amplitude * 0.4);
      pts.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
    }
    return pts.join(' ');
  };

  const chartPolyline = chartPoints.length > 0
    ? chartPoints.map(p => `${p.x},${p.y}`).join(' ')
    : '';

  const animatedChartPath = chartPoints.length > 0
    ? chartPoints.map((p, i) => {
        const wobble = Math.sin(animFrame * 2 + i * 0.15) * 2;
        return `${p.x},${p.y + wobble}`;
      }).join(' ')
    : '';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a1628',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#c8d8e8',
      padding: '0',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes advisoryPulse { 0%,100%{background:#7a0000} 50%{background:#d62828} }
        @keyframes waveShimmer { 0%{opacity:0.6} 50%{opacity:1} 100%{opacity:0.6} }
        @keyframes scanline {
          0%{transform:translateY(-100%)}
          100%{transform:translateY(100vh)}
        }
        @keyframes flicker {
          0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.4} 95%{opacity:1} 97%{opacity:0.6} 98%{opacity:1}
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        pointerEvents: 'none', zIndex: 1000,
      }} />

      {/* Header */}
      <div style={{
        background: '#0d1f3c',
        borderBottom: '2px solid #00b4d8',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#4a90a4', letterSpacing: '3px', marginBottom: '2px' }}>
            NATIONAL OCEANIC AND ATMOSPHERIC ADMINISTRATION
          </div>
          <div style={{ fontSize: '10px', color: '#4a90a4', letterSpacing: '2px', marginBottom: '4px' }}>
            CENTER FOR PERSONAL TIDAL ANALYSIS — STATION 7
          </div>
          <div style={{ fontSize: '20px', color: '#e8f4f8', letterSpacing: '1px', fontWeight: 'bold' }}>
            TIDE CHART FOR YOUR EXCUSES
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#4a90a4' }}>
          <div>DATUM: MEAN LOWER LOW INTENTION</div>
          <div>UNIT: FATHOMS OF SINCERITY</div>
          <div style={{ color: '#00b4d8', animation: 'flicker 4s infinite' }}>● LIVE MONITORING ACTIVE</div>
        </div>
      </div>

      {/* Advisories */}
      {advisories.length > 0 && (
        <div style={{ padding: '0 24px' }}>
          {advisories.map((adv, i) => (
            <div key={i} style={{
              background: '#7a0000',
              border: '1px solid #d62828',
              color: '#ffcccc',
              padding: '8px 16px',
              fontSize: '11px',
              letterSpacing: '1px',
              marginTop: '8px',
              animation: 'advisoryPulse 2s infinite',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '16px', animation: 'blink 1s infinite' }}>⚠</span>
              {adv}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '16px 24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

        {/* Left panel — controls */}
        <div style={{ width: '260px', flexShrink: 0 }}>
          <div style={{
            background: '#0d1f3c',
            border: '1px solid #1a3a5c',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '10px', color: '#4a90a4', letterSpacing: '2px', marginBottom: '12px', borderBottom: '1px solid #1a3a5c', paddingBottom: '8px' }}>
              EXCUSE CATEGORY SELECTOR
            </div>
            <div style={{ fontSize: '9px', color: '#4a90a4', marginBottom: '10px' }}>
              SELECT ACTIVE TIDAL BODIES:
            </div>
            {excuseCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => toggleExcuse(cat.id)}
                style={{
                  padding: '8px 10px',
                  marginBottom: '6px',
                  cursor: 'pointer',
                  border: `1px solid ${selectedExcuses.includes(cat.id) ? cat.color : '#1a3a5c'}`,
                  background: selectedExcuses.includes(cat.id) ? `${cat.color}22` : 'transparent',
                  color: selectedExcuses.includes(cat.id) ? cat.color : '#6a8a9a',
                  fontSize: '10px',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  userSelect: 'none',
                }}
              >
                <span style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: selectedExcuses.includes(cat.id) ? cat.color : '#1a3a5c',
                  flexShrink: 0,
                  boxShadow: selectedExcuses.includes(cat.id) ? `0 0 6px ${cat.color}` : 'none',
                }} />
                "{cat.label}"
              </div>
            ))}
          </div>

          {/* Fathoms gauge */}
          <div style={{
            background: '#0d1f3c',
            border: '1px solid #1a3a5c',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '10px', color: '#4a90a4', letterSpacing: '2px', marginBottom: '12px', borderBottom: '1px solid #1a3a5c', paddingBottom: '8px' }}>
              DEPTH INSTRUMENTATION
            </div>
            <div style={{ fontSize: '9px', color: '#4a90a4', marginBottom: '8px' }}>FATHOMS OF SINCERITY:</div>
            <svg width="100%" height="80" viewBox="0 0 220 80">
              <rect x="0" y="20" width="220" height="30" fill="#050d1a" stroke="#1a3a5c" strokeWidth="1" />
              <rect x="2" y="22" width={Math.max(2, fathomsSincerity * 216)} height="26" fill="#00b4d8" opacity="0.8" />
              {[0,25,50,75,100,125,150,175,200].map(x => (
                <line key={x} x1={x+10} y1="20" x2={x+10} y2="50" stroke="#1a3a5c" strokeWidth="0.5" />
              ))}
              <text x="110" y="40" textAnchor="middle" fill="#00b4d8" fontSize="16" fontFamily="Courier New">
                {fathomsSincerity.toFixed(1)}
              </text>
              <text x="110" y="68" textAnchor="middle" fill="#4a90a4" fontSize="8" fontFamily="Courier New">
                [0.0 = EXPECTED / INSTRUMENT NOMINAL]
              </text>
            </svg>
            <div style={{ fontSize: '8px', color: '#4a5a6a', marginTop: '4px', lineHeight: '1.4' }}>
              * Instrument may be miscalibrated.<br />
              * Alternatively, the user may be.
            </div>
          </div>

          {/* Predicted high tide */}
          {predictedHighTide && (
            <div style={{
              background: '#0d1f3c',
              border: '1px solid #1a3a5c',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '10px', color: '#4a90a4', letterSpacing: '2px', marginBottom: '12px', borderBottom: '1px solid #1a3a5c', paddingBottom: '8px' }}>
                PREDICTED HIGH TIDE
              </div>
              <div style={{ fontSize: '9px', color: '#c8d8e8', lineHeight: '1.6' }}>
                Approximately {predictedHighTide}
              </div>
              <div style={{ fontSize: '8px', color: '#4a5a6a', marginTop: '8px' }}>
                Forecast confidence: LOW<br />
                This is not a guarantee.<br />
                Nothing here is a guarantee.
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{
            background: '#0d1f3c',
            border: '1px solid #1a3a5c',
            padding: '16px',
          }}>
            <div style={{ fontSize: '10px', color: '#4a90a4', letterSpacing: '2px', marginBottom: '12px', borderBottom: '1px solid #1a3a5c', paddingBottom: '8px' }}>
              CHART LEGEND
            </div>
            {[
              { color: '#00b4d8', label: 'Excuse tide level' },
              { color: '#48cae4', label: 'Composite harmonic' },
              { color: '#d62828', label: 'Advisory threshold' },
              { color: '#f5f0e8', label: 'Clickable incident node' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '2px', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '9px', color: '#8a9aaa' }}>{item.label}</span>
              </div>
            ))}
            <div style={{ marginTop: '8px', fontSize: '8px', color: '#4a5a6a', lineHeight: '1.5' }}>
              Click any point to generate<br />
              Coast Guard incident report.
            </div>
          </div>
        </div>

        {/* Main chart area */}
        <div style={{ flex: 1, minWidth: '320px' }}>
          <div style={{
            background: '#f5f0e8',
            border: '2px solid #8a7a60',
            padding: '0',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Chart header */}
            <div style={{
              background: '#0d1f3c',
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '9px', color: '#4a90a4', letterSpacing: '2px' }}>
                TIDAL PREDICTIONS — PERSONAL EXCUSE ECOSYSTEM
              </span>
              <span style={{ fontSize: '9px', color: '#4a90a4' }}>
                {selectedExcuses.length} BODY(IES) ACTIVE
              </span>
            </div>

            <svg
              width="100%"
              viewBox="0 0 700 260"
              style={{ display: 'block', cursor: chartPoints.length > 0 ? 'crosshair' : 'default' }}
            >
              {/* Parchment background */}
              <rect width="700" height="260" fill="#f0ebd8" />

              {/* Nautical chart texture lines */}
              {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
                <line key={`h${i}`} x1="0" y1={i * 26} x2="700" y2={i * 26}
                  stroke="#c8b89a" strokeWidth="0.4" strokeDasharray="2,4" />
              ))}
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => (
                <line key={`v${i}`} x1={i * 56} y1="0" x2={i * 56} y2="260"
                  stroke="#c8b89a" strokeWidth="0.4" strokeDasharray="2,4" />
              ))}

              {/* Day labels */}
              {days.map((day, i) => (
                <text key={day} x={50 + i * 100} y="252" textAnchor="middle"
                  fill="#7a6a50" fontSize="9" fontFamily="Courier New" letterSpacing="1">
                  {day}
                </text>
              ))}

              {/* Tide level markers */}
              {[0,1,2,3].map(i => (
                <g key={`lvl${i}`}>
                  <line x1="0" y1={40 + i * 55} x2="700" y2={40 + i * 55}
                    stroke="#9a8a70" strokeWidth="0.6" strokeDasharray="6,3" />
                  <text x="4" y={37 + i * 55} fill="#9a8a70" fontSize="7" fontFamily="Courier New">
                    {['HIGH', 'MID-H', 'MID-L', 'LOW'][i]}
                  </text>
                </g>
              ))}

              {/* Animated water fill */}
              <clipPath id="waterClip">
                <rect x="0" y="0" width="700" height="260" />
              </clipPath>

              {/* Water layers */}
              <path
                d={`${getWavePath(0, 12, 1)} L700,260 L0,260 Z`}
                fill="#0077b6" opacity="0.15"
              />
              <path
                d={`${getWavePath(1, 8, 1.5)} L700,260 L0,260 Z`}
                fill="#00b4d8" opacity="0.12"
              />
              <path
                d={`${getWavePath(2, 5, 0.7)} L700,260 L0,260 Z`}
                fill="#48cae4" opacity="0.1"
              />

              {/* Empty state message */}
              {chartPoints.length === 0 && (
                <g>
                  <text x="350" y="100" textAnchor="middle" fill="#9a8a70" fontSize="11" fontFamily="Courier New">
                    NO EXCUSE BODIES CURRENTLY ACTIVE
                  </text>
                  <text x="350" y="118" textAnchor="middle" fill="#9a8a70" fontSize="9" fontFamily="Courier New">
                    Select categories to begin tidal monitoring.
                  </text>
                  <text x="350" y="134" textAnchor="middle" fill="#9a8a70" fontSize="9" fontFamily="Courier New">
                    The water is waiting. The water is always waiting.
                  </text>
                  <text x="350" y="158" textAnchor="middle" fill="#b8a880" fontSize="8" fontFamily="Courier New">
                    [INSTRUMENT READING: 0.0 FATHOMS SINCERITY — BASELINE NOMINAL]
                  </text>
                </g>
              )}

              {/* Advisory threshold line */}
              {selectedExcuses.length >= 3 && (
                <line x1="0" y1="60" x2="700" y2="60"
                  stroke="#d62828" strokeWidth="1" strokeDasharray="4,2" opacity="0.7" />
              )}
              {selectedExcuses.length >= 3 && (
                <text x="4" y="57" fill="#d62828" fontSize="7" fontFamily="Courier New">
                  ADVISORY THRESHOLD
                </text>
              )}

              {/* Main tide chart polyline */}
              {chartPoints.length > 0 && (
                <>
                  {/* Glow effect */}
                  <polyline
                    points={animatedChartPath}
                    fill="none"
                    stroke="#00b4d8"
                    strokeWidth="4"
                    opacity="0.2"
                  />
                  {/* Main line */}
                  <polyline
                    points={animatedChartPath}
                    fill="none"
                    stroke="#0077b6"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  {/* Fill under curve */}
                  <polyline
                    points={`0,240 ${animatedChartPath} 700,240`}
                    fill="#00b4d8"
                    opacity="0.08"
                    stroke="none"
                  />
                </>
              )}

              {/* Chart points — clickable */}
              {chartPoints.filter((_, i) => i % 10 === 0).map((pt, i) => {
                const realIdx = i * 10;
                const isHovered = hoveredPoint === realIdx;
                const isAdvisory = advisories.length > 0 && Math.abs(pt.rawY) > 55;
                return (
                  <g key={realIdx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y + Math.sin(animFrame * 2 + realIdx * 0.15) * 2}
                      r={isHovered ? 8 : 5}
                      fill={isAdvisory ? '#d62828' : '#f5f0e8'}
                      stroke={isAdvisory ? '#ff4444' : '#0077b6'}
                      strokeWidth={isHovered ? 2 : 1}
                      style={{ cursor: 'pointer', transition: 'r 0.1s' }}
                      onClick={() => handlePointClick(pt)}
                      onMouseEnter={() => setHoveredPoint(realIdx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {isHovered && (
                      <g>
                        <rect
                          x={Math.min(pt.x - 50, 600)}
                          y={pt.y - 50}
                          width="100"
                          height="40"
                          fill="#0d1f3c"
                          stroke="#00b4d8"
                          strokeWidth="0.5"
                          opacity="0.95"
                        />
                        <text
                          x={Math.min(pt.x, 650)}
                          y={pt.y - 34}
                          textAnchor="middle"
                          fill="#00b4d8"
                          fontSize="7"
                          fontFamily="Courier New"
                        >
                          {Math.abs(pt.rawY) > 55 ? 'SPRING TIDE' : Math.abs(pt.rawY) > 25 ? 'NEAP TIDE' : 'SLACK WATER'}
                        </text>
                        <text
                          x={Math.min(pt.x, 650)}
                          y={pt.y - 22}
                          textAnchor="middle"
                          fill="#c8d8e8"
                          fontSize="7"
                          fontFamily="Courier New"
                        >
                          {Math.abs(pt.rawY).toFixed(1)} FATHOMS
                        </text>
                        <text
                          x={Math.min(pt.x, 650)}
                          y={pt.y - 12}
                          textAnchor="middle"
                          fill="#4a90a4"
                          fontSize="6"
                          fontFamily="Courier New"
                        >
                          [CLICK FOR REPORT]
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Contradiction spike indicator */}
              {contradictionPairs.some(([a, b]) => selectedExcuses.includes(a) && selectedExcuses.includes(b)) && (
                <text x="350" y="20" textAnchor="middle" fill="#d62828" fontSize="8" fontFamily="Courier New"
                  style={{ animation: 'blink 1.5s infinite' }}>
                  ⚡ CONTRADICTORY CURRENTS DETECTED — RIP CURRENT IN PROGRESS ⚡
                </text>
              )}

              {/* Chart border */}
              <rect x="0" y="0" width="700" height="260" fill="none" stroke="#8a7a60" strokeWidth="1.5" />
            </svg>

            {/* Chart footer */}
            <div style={{
              background: '#0d1f3c',
              padding: '6px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '8px',
              color: '#4a90a4',
              letterSpacing: '1px',
            }}>
              <span>CHART NO. EXC-7-{String(selectedExcuses.length).padStart(3, '0')}</span>
              <span>SCALE: 1:APPROXIMATELY ACCURATE</span>
              <span>THE BUOY IS ALSO LYING</span>
            </div>
          </div>

          {/* Bottom info panels */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
            <div style={{
              flex: 1,
              background: '#0d1f3c',
              border: '1px solid #1a3a5c',
              padding: '12px',
              minWidth: '200px',
            }}>
              <div style={{ fontSize: '9px', color: '#4a90a4', letterSpacing: '2px', marginBottom: '8px' }}>
                TIDAL BODY STATUS
              </div>
              {selectedExcuses.length === 0 ? (
                <div style={{ fontSize: '9px', color: '#4a5a6a' }}>No active tidal bodies.<br />Waters calm. Suspiciously calm.</div>
              ) : (
                selectedExcuses.map(id => {
                  const cat = excuseCategories.find(c => c.id === id);
                  return (
                    <div key={id} style={{ fontSize: '9px', color: '#8a9aaa', marginBottom: '4px', display: 'flex', gap: '6px' }}>
                      <span style={{ color: cat?.color }}>■</span>
                      <span>"{cat?.label}" — ACTIVE / UNRESOLVED</span>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{
              flex: 1,
              background: '#0d1f3c',
              border: '1px solid #1a3a5c',
              padding: '12px',
              minWidth: '200px',
            }}>
              <div style={{ fontSize: '9px', color: '#4a90a4', letterSpacing: '2px', marginBottom: '8px' }}>
                MONITORING NOTES
              </div>
              <div style={{ fontSize: '8px', color: '#6a7a8a', lineHeight: '1.6' }}>
                The water knows when you are lying.<br />
                The water has always known.<br />
                <br />
                Station 7 has been operational since<br />
                before you developed your current<br />
                relationship with accountability.<br />
                <br />
                We do not judge. We only measure.<br />
                <span style={{ color: '#4a5a6a' }}>(The measurement is a form of judgment.)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      {activeIncident && (
        <div
          onClick={() => setActiveIncident(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 13, 26, 0.92)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#f5f0e8',
              border: '2px solid #8a7a60',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '0',
              position: 'relative',
            }}
          >
            {/* Modal header */}
            <div style={{
              background: '#0d1f3c',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #d62828',
            }}>
              <div>
                <div style={{ fontSize: '9px', color: '#d62828', letterSpacing: '2px', animation: 'blink 2s infinite' }}>
                  ⚠ COAST GUARD INCIDENT REPORT — CONFIDENTIAL
                </div>
                <div style={{ fontSize: '11px', color: '#c8d8e8', marginTop: '2px' }}>
                  CLASSIFICATION: {activeIncident.classification} / {activeIncident.tideLevel} FATHOMS
                </div>
              </div>
              <button
                onClick={() => setActiveIncident(null)}
                style={{
                  background: '#d62828',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontFamily: 'Courier New',
                  fontSize: '10px',
                  letterSpacing: '1px',
                }}
              >
                CLOSE / DISMISS
              </button>
            </div>

            {/* Report content */}
            <div style={{
              padding: '20px',
              background: '#f5f0e8',
            }}>
              <div style={{
                fontFamily: 'Courier New',
                fontSize: '11px',
                color: '#3a2a1a',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                borderLeft: '3px solid #8a7a60',
                paddingLeft: '16px',
              }}>
                {activeIncident.text}
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #8a7a60',
                fontSize: '8px',
                color: '#6a5a40',
                fontFamily: 'Courier New',
              }}>
                <div>REPORT GENERATED: {new Date().toUTCString()}</div>
                <div>STATION 7 / PERSONAL TIDAL ANALYSIS DIVISION</div>
                <div>THIS REPORT IS FOR MONITORING PURPOSES ONLY.</div>
                <div>STATION 7 CANNOT COMPEL YOU TO RESOLVE ANYTHING.</div>
                <div>STATION 7 HAS NOTED THAT YOU HAVE NOT RESOLVED ANYTHING.</div>
                <div style={{ marginTop: '8px', color: '#8a7a60' }}>
                  [Click outside or press CLOSE to dismiss. The water will remember this was opened.]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}