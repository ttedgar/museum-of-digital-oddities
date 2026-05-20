import { useState, useEffect, useRef, useCallback } from 'react';

const FEELINGS = [
  {
    id: 'ambient_pride',
    name: 'AMBIENT PRIDE',
    description: 'Contains traces of embarrassment. May cause posture improvements. Best served warm.',
    color: '#d4a843',
    blobColor: '#e8c068',
    highlight: '#f5d98a',
    servingWarning: 2,
    unit: 'scoop',
  },
  {
    id: 'retroactive_fondness',
    name: 'RETROACTIVE FONDNESS',
    description: 'Prepared fresh daily from events that were not enjoyable at the time. Pairs with distance.',
    color: '#7a9e7e',
    blobColor: '#9ec4a2',
    highlight: '#c2e0c5',
    servingWarning: 2,
    unit: 'ladle',
  },
  {
    id: 'low_grade_dread',
    name: 'LOW-GRADE DREAD',
    description: 'A house specialty. Simmering since before you arrived. Gluten-free by accident.',
    color: '#6b7c93',
    blobColor: '#8a9db5',
    highlight: '#b0c0d4',
    servingWarning: 1,
    unit: 'portion',
  },
  {
    id: 'borrowed_nostalgia',
    name: 'BORROWED NOSTALGIA',
    description: 'For places you have never been. Sourced from films and other peoples childhoods.',
    color: '#b07d62',
    blobColor: '#cc9a7e',
    highlight: '#e0bc9e',
    servingWarning: 2,
    unit: 'scoop',
  },
  {
    id: 'competence_surprise',
    name: 'COMPETENCE SURPRISE',
    description: 'The feeling of having done something correctly. Seasonal. Limited quantities.',
    color: '#5a8a6e',
    blobColor: '#7ab090',
    highlight: '#a4d4b8',
    servingWarning: 3,
    unit: 'serving',
  },
  {
    id: 'preemptive_grief',
    name: 'PREEMPTIVE GRIEF',
    description: 'Why wait. Available in bulk. The management recommends a small portion.',
    color: '#7d6b8a',
    blobColor: '#9e8aae',
    highlight: '#c0aed0',
    servingWarning: 1,
    unit: 'unit',
  },
  {
    id: 'ambient_guilt',
    name: 'AMBIENT GUILT',
    description: 'Origin unknown. Present regardless. Complimentary with every meal.',
    color: '#8a7a5a',
    blobColor: '#aa9a78',
    highlight: '#ccbc98',
    servingWarning: 1,
    unit: 'dollop',
  },
  {
    id: 'performative_calm',
    name: 'PERFORMATIVE CALM',
    description: 'Mostly surface. Smooth texture. Not to be confused with actual calm, which is unavailable.',
    color: '#5a8a9e',
    blobColor: '#7aaabe',
    highlight: '#9ecce0',
    servingWarning: 2,
    unit: 'slice',
  },
  {
    id: 'wistfulness',
    name: 'WISTFULNESS',
    description: 'A classic. Pairs with windows, rain, and train stations. Do not overserve.',
    color: '#8a6e7a',
    blobColor: '#aa8e9a',
    highlight: '#ccb0be',
    servingWarning: 1,
    unit: 'spoonful',
  },
  {
    id: 'unexpected_tenderness',
    name: 'UNEXPECTED TENDERNESS',
    description: 'Arrives without warning. Handle carefully. May cause brief eye contact with strangers.',
    color: '#c07878',
    blobColor: '#d89898',
    highlight: '#f0bcbc',
    servingWarning: 2,
    unit: 'piece',
  },
  {
    id: 'administrative_despair',
    name: 'ADMINISTRATIVE DESPAIR',
    description: 'Form-based. Requires three forms of ID. The third form does not exist.',
    color: '#7a7a7a',
    blobColor: '#9a9a9a',
    highlight: '#bebebe',
    servingWarning: 1,
    unit: 'helping',
  },
  {
    id: 'sunday_feeling',
    name: 'SUNDAY FEELING',
    description: 'Temporally specific. Available seven days a week. Tastes like 4pm.',
    color: '#9a8a6a',
    blobColor: '#baaa88',
    highlight: '#d8caa8',
    servingWarning: 2,
    unit: 'bowl',
  },
];

const ATTENDANT_PHRASES = {
  wistfulness: [
    "That's a lot of wistfulness for a Tuesday. I'm going to have to ask you to put some back.",
    "Ma'am, the wistfulness is for everyone. One spoonful. Please.",
    "Sir, you have taken enough wistfulness. This is a buffet, not a lifestyle.",
  ],
  low_grade_dread: [
    "We ask that guests limit themselves to one portion of low-grade dread. You have taken two. I am noting this.",
    "The dread is self-serve but not unlimited. Please.",
  ],
  preemptive_grief: [
    "That is a concerning amount of preemptive grief. Are you okay. I am required to ask.",
    "We recommend a small portion of preemptive grief. This is not a small portion.",
  ],
  ambient_guilt: [
    "The ambient guilt is complimentary but I still need you to take less of it.",
    "You already have ambient guilt on your tray. You do not need more ambient guilt.",
  ],
  administrative_despair: [
    "One helping of administrative despair is the maximum. There is a sign. The sign is laminated.",
  ],
  default: [
    "That seems like a lot. I'm going to need you to think about whether you can finish all of that.",
    "I'm watching the portion sizes here. Just so you know.",
    "We ask that guests take only what they can finish. This is a reminder.",
    "The feelings bar is not a competition. Please take a reasonable amount.",
    "I have seen this before. It doesn't end well. Put some back.",
  ],
};

const DIETITIAN_REPORTS = {
  ambient_pride: "Nutritional aftermath: You have consumed AMBIENT PRIDE. Posture has improved by 4 degrees. Traces of embarrassment detected in the aftertaste, as warned. The body is processing this. You may stand slightly taller for the next 20 minutes. This is normal and will pass.",
  retroactive_fondness: "Nutritional aftermath: RETROACTIVE FONDNESS has been absorbed. Events that were unpleasant at the time are now being recontextualized. This process cannot be reversed. The memories taste different now. The dietitian notes this is technically fine.",
  low_grade_dread: "Nutritional aftermath: LOW-GRADE DREAD is now circulating. It will not peak. It will not resolve. It will simply be present, at a consistent low level, like background music in a waiting room. The dietitian recommends water.",
  borrowed_nostalgia: "Nutritional aftermath: You have consumed BORROWED NOSTALGIA for places you have never been. You may now feel homesick for a country that does not exist, a summer that belongs to someone else, a kitchen with yellow curtains. This is expected. The dietitian has no notes.",
  competence_surprise: "Nutritional aftermath: COMPETENCE SURPRISE absorbed. The body is adjusting to the unfamiliar sensation of having done something correctly. Minor disorientation is normal. You may experience a brief impulse to tell someone. The dietitian suggests you do not.",
  preemptive_grief: "Nutritional aftermath: PREEMPTIVE GRIEF has entered the system. You are now grieving things that have not yet ended. The dietitian observes that this is, technically, a form of love. The dietitian is not a therapist. Please see a therapist.",
  ambient_guilt: "Nutritional aftermath: AMBIENT GUILT is now ambient. It was already there. You have simply made it official. No further action is required. No further action is possible. The dietitian nods slowly.",
  performative_calm: "Nutritional aftermath: PERFORMATIVE CALM successfully consumed. Surface tension: normal. Underneath: undetermined. The dietitian notes that performative calm and actual calm produce identical readings from a distance. Distance is recommended.",
  wistfulness: "Nutritional aftermath: WISTFULNESS has been processed. You are now experiencing the past as a place you can almost see from here. The window you are imagining is real. The light in the window is from a season that no longer exists. The dietitian says this is fine. The dietitian is also looking out a window.",
  unexpected_tenderness: "Nutritional aftermath: UNEXPECTED TENDERNESS absorbed. Mild disorientation. Brief softening of the face noted. You may have made eye contact with a stranger and both of you looked away too slowly. The dietitian says: this is what it is. That is all. That is enough.",
  administrative_despair: "Nutritional aftermath: ADMINISTRATIVE DESPAIR processed. The form has been filled out. The form has been lost. There is another form. The dietitian has reviewed your case and determined that your case is being reviewed. Please hold.",
  sunday_feeling: "Nutritional aftermath: SUNDAY FEELING consumed. It is now 4pm regardless of the time. The light is the wrong color. Something was supposed to happen today and didn't. The week begins again. The dietitian is looking at their hands. So are you.",
};

const REFILL_MESSAGES = [
  "Closing time. The attendant wordlessly scrapes the remaining feelings into a container and places it on your tray.",
  "What remains in the trays at the end of the day belongs to you now. This is policy.",
  "The feelings bar is always open. The attendant refills your tray. She does not make eye contact. This is customary.",
  "Leftovers from the steam table. Whatever was left. The attendant nods. You nod back. Something has passed between you.",
];

function BlobSVG({ color, highlight, amount, width = 80, height = 60 }) {
  if (amount === 0) return (
    <svg width={width} height={height} viewBox="0 0 80 60">
      <rect x="4" y="40" width="72" height="16" rx="3" fill="#c8c0b0" opacity="0.3" />
      <text x="40" y="52" textAnchor="middle" fontSize="9" fill="#a09880" fontFamily="monospace">— empty —</text>
    </svg>
  );
  const blobs = Array.from({ length: amount });
  return (
    <svg width={width} height={height} viewBox="0 0 80 60">
      <defs>
        <filter id={`blur_${color.replace('#','')}`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      {blobs.map((_, i) => {
        const cx = 15 + i * 20 + (i % 2) * 5;
        const cy = 30 + (i % 2) * -6;
        const rx = 14 - i * 1;
        const ry = 12 - i * 0.5;
        return (
          <g key={i}>
            <ellipse cx={cx + 2} cy={cy + 3} rx={rx} ry={ry * 0.6} fill="#000" opacity="0.12" filter={`url(#blur_${color.replace('#','')})`} />
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
            <ellipse cx={cx - 4} cy={cy - 3} rx={rx * 0.4} ry={ry * 0.3} fill={highlight} opacity="0.7" />
          </g>
        );
      })}
      <rect x="4" y="50" width="72" height="6" rx="2" fill={color} opacity="0.2" />
    </svg>
  );
}

function SteamLines({ x, y }) {
  return (
    <g>
      {[0, 8, 16].map((ox, i) => (
        <path key={i} d={`M${x + ox} ${y} Q${x + ox + 4} ${y - 8} ${x + ox} ${y - 16} Q${x + ox - 4} ${y - 24} ${x + ox} ${y - 32}`}
          stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      ))}
    </g>
  );
}

export default function Page() {
  const [portions, setPortions] = useState(() => Object.fromEntries(FEELINGS.map(f => [f.id, 0])));
  const [plate, setPlate] = useState([]);
  const [phase, setPhase] = useState('buffet');
  const [trayPosition, setTrayPosition] = useState(0);
  const [attendantMessage, setAttendantMessage] = useState('');
  const [judgmentVisible, setJudgmentVisible] = useState(false);
  const [dietitianReport, setDietitianReport] = useState('');
  const [reportVisible, setReportVisible] = useState(false);
  const [consumedIndex, setConsumedIndex] = useState(0);
  const [refillMessage, setRefillMessage] = useState('');
  const [refillVisible, setRefillVisible] = useState(false);
  const [steamAnim, setSteamAnim] = useState(0);
  const judgmentTimer = useRef(null);
  const reportTimer = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setSteamAnim(a => a + 1), 1200);
    return () => clearInterval(interval);
  }, []);

  const showAttendantMessage = useCallback((message) => {
    setAttendantMessage(message);
    setJudgmentVisible(true);
    if (judgmentTimer.current) clearTimeout(judgmentTimer.current);
    judgmentTimer.current = setTimeout(() => setJudgmentVisible(false), 4000);
  }, []);

  const handleScoop = (feelingId) => {
    const feeling = FEELINGS.find(f => f.id === feelingId);
    const current = portions[feelingId];
    if (current >= 3) {
      const phrases = ATTENDANT_PHRASES[feelingId] || ATTENDANT_PHRASES.default;
      showAttendantMessage(phrases[Math.floor(Math.random() * phrases.length)]);
      return;
    }
    const newAmount = current + 1;
    setPortions(prev => ({ ...prev, [feelingId]: newAmount }));
    if (newAmount >= (feeling.servingWarning || 2)) {
      const phrases = ATTENDANT_PHRASES[feelingId] || ATTENDANT_PHRASES.default;
      showAttendantMessage(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  };

  const handleRemoveScoop = (feelingId) => {
    setPortions(prev => ({ ...prev, [feelingId]: Math.max(0, prev[feelingId] - 1) }));
  };

  const handleBringToTable = () => {
    const plated = FEELINGS.filter(f => portions[f.id] > 0).map(f => ({ feelingId: f.id, portion: portions[f.id] }));
    if (plated.length === 0) {
      showAttendantMessage("Your plate is empty. You must take something. This is the feelings bar. Please.");
      return;
    }
    setPlate(plated);
    setConsumedIndex(0);
    setPhase('eating');
  };

  const handleConsume = (index) => {
    if (index !== consumedIndex) return;
    const item = plate[index];
    const report = DIETITIAN_REPORTS[item.feelingId] || "Nutritional aftermath: Something has been consumed. The dietitian is updating their records.";
    setDietitianReport(report);
    setReportVisible(true);
    if (reportTimer.current) clearTimeout(reportTimer.current);
    reportTimer.current = setTimeout(() => {
      setReportVisible(false);
      const nextIndex = consumedIndex + 1;
      setConsumedIndex(nextIndex);
      if (nextIndex >= plate.length) {
        setTimeout(() => setPhase('aftermath'), 500);
      }
    }, 5000);
  };

  const handleFinished = () => {
    const msg = REFILL_MESSAGES[Math.floor(Math.random() * REFILL_MESSAGES.length)];
    setRefillMessage(msg);
    setRefillVisible(true);
    setTimeout(() => {
      const leftovers = FEELINGS.filter(f => portions[f.id] > 0 && !plate.find(p => p.feelingId === f.id));
      const newPortions = Object.fromEntries(FEELINGS.map(f => [f.id, 0]));
      const newPlate = leftovers.length > 0
        ? leftovers.map(f => ({ feelingId: f.id, portion: portions[f.id] }))
        : FEELINGS.slice(0, 3).map(f => ({ feelingId: f.id, portion: 1 }));
      setPortions(newPortions);
      setPlate(newPlate);
      setConsumedIndex(0);
      setRefillVisible(false);
      setPhase('eating');
    }, 3500);
  };

  const visibleStart = trayPosition;
  const visibleFeelings = FEELINGS.slice(visibleStart, visibleStart + 4);

  const totalScoops = Object.values(portions).reduce((a, b) => a + b, 0);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f5f0e8 0%, #ede8dc 100%)',
    fontFamily: "'Courier New', Courier, monospace",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'hidden',
    position: 'relative',
  };

  const fluorStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,252,240,0.03) 2px, rgba(255,252,240,0.03) 4px)',
    pointerEvents: 'none',
    zIndex: 0,
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes steam1 { 0%,100%{transform:translateY(0) scaleX(1);opacity:0.5} 50%{transform:translateY(-12px) scaleX(1.3);opacity:0.2} }
        @keyframes steam2 { 0%,100%{transform:translateY(0) scaleX(1);opacity:0.4} 50%{transform:translateY(-10px) scaleX(0.8);opacity:0.15} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7} 94%{opacity:1} 97%{opacity:0.8} 98%{opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes wobble { 0%,100%{transform:rotate(-1deg)} 50%{transform:rotate(1deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        .tongs-btn:hover { transform: scale(1.12) rotate(-8deg) !important; background: #e8d870 !important; }
        .tongs-btn:active { transform: scale(0.95) rotate(4deg) !important; }
        .consume-btn:hover { filter: brightness(1.15) !important; transform: scale(1.05) !important; }
        .station-card:hover { box-shadow: 0 0 0 2px #d4a843, 0 4px 20px rgba(0,0,0,0.15) !important; }
      `}</style>
      <div style={fluorStyle} />
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(255,252,200,0.08) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'flicker 8s infinite',
      }} />

      {/* HEADER SIGN */}
      <div style={{
        width: '100%', background: '#2a2010', color: '#f5e070',
        textAlign: 'center', padding: '14px 20px 10px',
        borderBottom: '4px solid #8a7020',
        position: 'relative', zIndex: 10,
        animation: 'flicker 6s infinite',
        boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '6px', textTransform: 'uppercase' }}>
          FEELINGS BAR
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#c8b040', marginTop: '2px' }}>
          HOURS: ALWAYS. &nbsp;|&nbsp; WE ARE ALWAYS OPEN. &nbsp;|&nbsp; SNEEZE GUARD IN USE.
        </div>
        <div style={{
          position: 'absolute', top: '8px', right: '16px',
          fontSize: '10px', color: '#8a7020', letterSpacing: '1px',
          animation: 'blink 3s infinite',
        }}>
          ● OPEN
        </div>
      </div>

      {/* FLUORESCENT LIGHT BAR */}
      <div style={{
        width: '100%', height: '8px',
        background: 'linear-gradient(180deg, rgba(255,255,220,0.9) 0%, rgba(255,255,200,0.1) 100%)',
        boxShadow: '0 0 30px rgba(255,255,180,0.6)',
        animation: 'flicker 4s infinite',
        position: 'relative', zIndex: 9,
      }} />

      <div style={{ width: '100%', maxWidth: '900px', padding: '0 16px', position: 'relative', zIndex: 5 }}>

        {/* PHASE: BUFFET */}
        {phase === 'buffet' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* ATTENDANT */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: '12px',
              margin: '20px 0 10px', position: 'relative',
            }}>
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{
                  width: '52px', height: '52px', background: '#e8e0d0',
                  border: '2px solid #c0b090', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px', position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  👩
                  <div style={{
                    position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)',
                    width: '46px', height: '14px',
                    background: 'rgba(255,255,255,0.85)',
                    border: '1px solid #d0c8b0',
                    borderRadius: '20px 20px 0 0',
                    fontSize: '7px', color: '#888', textAlign: 'center', lineHeight: '14px',
                    letterSpacing: '0.5px',
                  }}>hairnet</div>
                </div>
                <div style={{ fontSize: '8px', color: '#8a7a60', marginTop: '2px', letterSpacing: '1px' }}>ATTENDANT</div>
              </div>
              {judgmentVisible && (
                <div style={{
                  background: '#fffde0', border: '2px solid #c8a820',
                  borderRadius: '8px 8px 8px 2px',
                  padding: '10px 14px', maxWidth: '340px',
                  fontSize: '12px', color: '#3a2a08', lineHeight: '1.5',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  animation: 'slideUp 0.3s ease',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', bottom: '-10px', left: '0px',
                    width: '0', height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '0px solid transparent',
                    borderTop: '10px solid #c8a820',
                  }} />
                  {attendantMessage}
                </div>
              )}
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#8a7a60', letterSpacing: '1px' }}>TRAY TOTAL</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3a2a08' }}>{totalScoops}</div>
                <div style={{ fontSize: '9px', color: '#aa9060' }}>SCOOP{totalScoops !== 1 ? 'S' : ''}</div>
              </div>
            </div>

            {/* SNEEZE GUARD LABEL */}
            <div style={{
              textAlign: 'center', fontSize: '9px', letterSpacing: '2px',
              color: '#a09880', margin: '4px 0 2px',
              borderTop: '1px solid rgba(180,170,150,0.4)',
              paddingTop: '6px',
            }}>
              ⚠ SNEEZE GUARD IN USE — PLEASE DO NOT REACH OVER THE SNEEZE GUARD
            </div>

            {/* STEAM TABLE */}
            <div style={{
              background: 'linear-gradient(180deg, #d8d0c0 0%, #c8c0b0 50%, #b8b0a0 100%)',
              border: '3px solid #a8a090',
              borderRadius: '4px',
              padding: '8px',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Chrome rail */}
              <div style={{
                position: 'absolute', top: '0', left: '0', right: '0', height: '12px',
                background: 'linear-gradient(180deg, #e8e0d8 0%, #c8c0b8 50%, #d8d0c8 100%)',
                borderBottom: '1px solid #b0a898',
              }} />

              {/* Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', marginBottom: '8px' }}>
                <button
                  onClick={() => setTrayPosition(Math.max(0, trayPosition - 1))}
                  disabled={trayPosition === 0}
                  style={{
                    background: trayPosition === 0 ? '#c0b8a8' : '#8a7a5a',
                    border: '2px solid #6a5a3a', borderRadius: '3px',
                    color: trayPosition === 0 ? '#a09880' : '#f5e8d0',
                    padding: '6px 12px', cursor: trayPosition === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '16px', fontFamily: 'monospace',
                    boxShadow: trayPosition === 0 ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s',
                  }}
                >◀</button>
                <div style={{
                  flex: 1, textAlign: 'center', fontSize: '10px',
                  color: '#6a5a3a', letterSpacing: '2px',
                }}>
                  STATION {trayPosition + 1}–{Math.min(trayPosition + 4, 12)} OF 12
                </div>
                <button
                  onClick={() => setTrayPosition(Math.min(8, trayPosition + 1))}
                  disabled={trayPosition >= 8}
                  style={{
                    background: trayPosition >= 8 ? '#c0b8a8' : '#8a7a5a',
                    border: '2px solid #6a5a3a', borderRadius: '3px',
                    color: trayPosition >= 8 ? '#a09880' : '#f5e8d0',
                    padding: '6px 12px', cursor: trayPosition >= 8 ? 'not-allowed' : 'pointer',
                    fontSize: '16px', fontFamily: 'monospace',
                    boxShadow: trayPosition >= 8 ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s',
                  }}
                >▶</button>
              </div>

              {/* Feeling Stations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {visibleFeelings.map((feeling) => (
                  <div
                    key={feeling.id}
                    className="station-card"
                    style={{
                      background: 'linear-gradient(180deg, #f0ece0 0%, #e8e0d0 100%)',
                      border: `2px solid ${feeling.color}40`,
                      borderRadius: '3px',
                      padding: '8px 6px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: '4px', position: 'relative',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    {/* Heat lamp glow */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '30px',
                      background: `radial-gradient(ellipse at 50% 0%, ${feeling.color}30, transparent 70%)`,
                      pointerEvents: 'none',
                    }} />

                    {/* Steam */}
                    <div style={{ position: 'relative', width: '80px', height: '8px', overflow: 'visible' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          position: 'absolute',
                          left: `${15 + i * 25}px`,
                          bottom: '0',
                          width: '3px',
                          height: `${6 + i * 2}px`,
                          background: 'rgba(255,255,255,0.6)',
                          borderRadius: '2px',
                          animation: `steam${i % 2 + 1} ${1.5 + i * 0.4}s ease-in-out infinite`,
                          animationDelay: `${i * 0.3 + (steamAnim % 3) * 0.1}s`,
                        }} />
                      ))}
                    </div>

                    {/* Blob */}
                    <div style={{
                      background: `${feeling.color}18`,
                      border: `1px solid ${feeling.color}40`,
                      borderRadius: '3px',
                      padding: '4px',
                      width: '100%',
                      display: 'flex', justifyContent: 'center',
                    }}>
                      <BlobSVG color={feeling.blobColor} highlight={feeling.highlight} amount={portions[feeling.id]} />
                    </div>

                    {/* Placard */}
                    <div style={{
                      background: '#fffde8',
                      border: '1px solid #d4c880',
                      borderRadius: '2px',
                      padding: '4px 6px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}>
                      <div style={{
                        fontSize: '8px', fontWeight: 'bold', letterSpacing: '0.5px',
                        color: '#3a2a08', textTransform: 'uppercase', marginBottom: '2px',
                        lineHeight: '1.2',
                      }}>{feeling.name}</div>
                      <div style={{
                        fontSize: '7px', color: '#6a5a38', lineHeight: '1.3',
                        fontStyle: 'italic',
                      }}>{feeling.description}</div>
                    </div>

                    {/* Amount indicator */}
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                      {[1, 2, 3].map(n => (
                        <div key={n} style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: portions[feeling.id] >= n ? feeling.color : '#d0c8b0',
                          border: `1px solid ${portions[feeling.id] >= n ? feeling.color : '#b0a890'}`,
                          transition: 'all 0.3s',
                        }} />
                      ))}
                      <div style={{ fontSize: '8px', color: '#8a7a60', marginLeft: '2px' }}>
                        {portions[feeling.id]}/{3}
                      </div>
                    </div>

                    {/* Tongs controls */}
                    <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                      <button
                        onClick={() => handleRemoveScoop(feeling.id)}
                        disabled={portions[feeling.id] === 0}
                        style={{
                          flex: 1, padding: '4px 0',
                          background: portions[feeling.id] === 0 ? '#d0c8b8' : '#c8a080',
                          border: '1px solid #a08060',
                          borderRadius: '2px',
                          fontSize: '10px', cursor: portions[feeling.id] === 0 ? 'not-allowed' : 'pointer',
                          color: portions[feeling.id] === 0 ? '#a09880' : '#3a2010',
                          fontFamily: 'monospace',
                          transition: 'all 0.2s',
                        }}
                      >−</button>
                      <button
                        className="tongs-btn"
                        onClick={() => handleScoop(feeling.id)}
                        style={{
                          flex: 2, padding: '4px 0',
                          background: '#d4a843',
                          border: '1px solid #a07820',
                          borderRadius: '2px',
                          fontSize: '10px', cursor: 'pointer',
                          color: '#2a1a00', fontFamily: 'monospace',
                          fontWeight: 'bold',
                          transition: 'all 0.2s',
                          letterSpacing: '0.5px',
                        }}
                      >🥄 SCOOP</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom chrome rail */}
              <div style={{
                height: '10px', marginTop: '8px',
                background: 'linear-gradient(180deg, #d0c8c0 0%, #e0d8d0 50%, #c8c0b8 100%)',
                borderRadius: '0 0 2px 2px',
                borderTop: '1px solid #b0a898',
              }} />
            </div>

            {/* TONGS NOTE */}
            <div style={{
              textAlign: 'center', fontSize: '9px', color: '#8a7a60',
              margin: '6px 0', letterSpacing: '1px', fontStyle: 'italic',
            }}>
              * The tongs are also a feeling. Please return them to the holder when finished.
            </div>

            {/* BRING TO TABLE */}
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <button
                onClick={handleBringToTable}
                style={{
                  background: totalScoops > 0
                    ? 'linear-gradient(180deg, #5a7a4a 0%, #3a5a2a 100%)'
                    : '#a0a090',
                  border: `3px solid ${totalScoops > 0 ? '#2a4a1a' : '#808070'}`,
                  borderRadius: '4px',
                  padding: '12px 32px',
                  color: totalScoops > 0 ? '#d8f0c0' : '#c0c0b0',
                  fontSize: '13px', fontFamily: 'monospace',
                  fontWeight: 'bold', letterSpacing: '2px',
                  cursor: totalScoops > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: totalScoops > 0 ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.3s',
                  textTransform: 'uppercase',
                }}
              >
                🍽 BRING TRAY TO TABLE
              </button>
              {totalScoops === 0 && (
                <div style={{ fontSize: '10px', color: '#8a7a60', marginTop: '6px', fontStyle: 'italic' }}>
                  You must take at least one feeling.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PHASE: EATING */}
        {phase === 'eating' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{
              background: '#f5f0e4',
              border: '3px solid #c0b090',
              borderRadius: '4px',
              margin: '20px 0 10px',
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}>
              {/* Table surface */}
              <div style={{
                fontSize: '11px', letterSpacing: '3px', color: '#8a7a60',
                textAlign: 'center', marginBottom: '12px', textTransform: 'uppercase',
              }}>
                — YOUR TABLE —
              </div>
              <div style={{
                fontSize: '10px', color: '#6a5a40', textAlign: 'center',
                marginBottom: '16px', fontStyle: 'italic',
              }}>
                Please consume in order. Each feeling must be fully processed before the next.
              </div>

              {/* Plate */}
              <div style={{
                background: 'radial-gradient(ellipse at 50% 40%, #fdfbf5 60%, #e8e0d0 100%)',
                border: '4px solid #c8c0b0',
                borderRadius: '50%',
                width: '320px', height: '240px',
                margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexWrap: 'wrap', gap: '8px', padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 2px 8px rgba(255,255,255,0.8)',
                position: 'relative',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                  width: '90%', height: '1px', background: 'rgba(200,190,170,0.4)',
                  borderRadius: '50%',
                }} />
                {plate.map((item, i) => {
                  const feeling = FEELINGS.find(f => f.id === item.feelingId);
                  const isConsumed = i < consumedIndex;
                  const isCurrent = i === consumedIndex;
                  const isLocked = i > consumedIndex;
                  return (
                    <button
                      key={item.feelingId}
                      className={isCurrent ? 'consume-btn' : ''}
                      onClick={() => handleConsume(i)}
                      disabled={!isCurrent}
                      style={{
                        background: isConsumed
                          ? 'rgba(200,190,170,0.2)'
                          : `${feeling.blobColor}`,
                        border: isCurrent
                          ? `2px solid ${feeling.color}`
                          : isConsumed
                          ? '2px dashed #c0b8a8'
                          : `2px solid ${feeling.color}40`,
                        borderRadius: '50%',
                        width: `${42 + item.portion * 8}px`,
                        height: `${38 + item.portion * 6}px`,
                        cursor: isCurrent ? 'pointer' : 'not-allowed',
                        opacity: isConsumed ? 0.25 : isLocked ? 0.5 : 1,
                        transition: 'all 0.4s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column',
                        boxShadow: isCurrent ? `0 0 12px ${feeling.color}80` : 'none',
                        animation: isCurrent ? 'pulse 2s infinite' : 'none',
                        position: 'relative',
                        padding: 0,
                      }}
                      title={isCurrent ? `Click to consume: ${feeling.name}` : isLocked ? 'Not yet' : 'Consumed'}
                    >
                      {!isConsumed && (
                        <div style={{
                          fontSize: '7px', fontFamily: 'monospace',
                          color: isCurrent ? '#fff' : `${feeling.color}99`,
                          textAlign: 'center', lineHeight: '1.1',
                          padding: '0 2px', fontWeight: isCurrent ? 'bold' : 'normal',
                        }}>
                          {feeling.name.split(' ').slice(0, 2).join('\n')}
                        </div>
                      )}
                      {isConsumed && (
                        <div style={{ fontSize: '14px', opacity: 0.4 }}>✓</div>
                      )}
                      {isCurrent && (
                        <div style={{
                          position: 'absolute', top: '-18px', left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '9px', color: feeling.color,
                          letterSpacing: '1px', whiteSpace: 'nowrap',
                          fontWeight: 'bold',
                        }}>▼ EAT</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Progress */}
              <div style={{
                textAlign: 'center', fontSize: '10px', color: '#8a7a60',
                letterSpacing: '1px', marginBottom: '8px',
              }}>
                {consumedIndex} / {plate.length} FEELINGS CONSUMED
              </div>
              <div style={{
                width: '100%', height: '4px', background: '#d0c8b8',
                borderRadius: '2px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(consumedIndex / plate.length) * 100}%`,
                  background: 'linear-gradient(90deg, #7a9e7e, #d4a843)',
                  transition: 'width 0.5s ease',
                  borderRadius: '2px',
                }} />
              </div>
            </div>

            {/* Dietitian report overlay */}
            {reportVisible && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(20,15,5,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100, padding: '20px',
              }}>
                <div style={{
                  background: '#f8f4e8',
                  border: '3px solid #8a7a5a',
                  borderRadius: '4px',
                  padding: '24px 28px',
                  maxWidth: '480px', width: '100%',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                  animation: 'slideUp 0.4s ease',
                  position: 'relative',
                }}>
                  <div style={{
                    fontSize: '9px', letterSpacing: '3px', color: '#8a7a5a',
                    textTransform: 'uppercase', marginBottom: '12px',
                    borderBottom: '1px solid #d0c8a8', paddingBottom: '8px',
                  }}>
                    NUTRITIONAL AFTERMATH REPORT
                  </div>
                  <div style={{
                    fontSize: '9px', letterSpacing: '1px', color: '#6a5a38',
                    marginBottom: '16px', fontStyle: 'italic',
                  }}>
                    From the desk of the Cafeteria Dietitian
                  </div>
                  <div style={{
                    fontSize: '13px', color: '#2a1a08', lineHeight: '1.7',
                    fontFamily: "'Courier New', monospace",
                  }}>
                    {dietitianReport}
                  </div>
                  <div style={{
                    marginTop: '16px', textAlign: 'right',
                    fontSize: '9px', color: '#a09070', fontStyle: 'italic',
                  }}>
                    Auto-dismissing in 5 seconds...
                  </div>
                  <button
                    onClick={() => {
                      if (reportTimer.current) clearTimeout(reportTimer.current);
                      setReportVisible(false);
                      const nextIndex = consumedIndex + 1;
                      setConsumedIndex(nextIndex);
                      if (nextIndex >= plate.length) {
                        setTimeout(() => setPhase('aftermath'), 500);
                      }
                    }}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: '#8a7a5a', border: 'none', borderRadius: '2px',
                      color: '#f5e8d0', fontSize: '11px', padding: '4px 10px',
                      cursor: 'pointer', fontFamily: 'monospace',
                      letterSpacing: '1px',
                    }}
                  >CLOSE</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHASE: AFTERMATH */}
        {phase === 'aftermath' && (
          <div style={{ animation: 'fadeIn 0.6s ease', textAlign: 'center', padding: '30px 20px' }}>
            <div style={{
              fontSize: '13px', letterSpacing: '3px', color: '#8a7a60',
              marginBottom: '8px', textTransform: 'uppercase',
            }}>
              — TRAY CLEARED —
            </div>
            <div style={{
              fontSize: '28px', margin: '16px 0',
            }}>🍽</div>
            <div style={{
              fontSize: '13px', color: '#5a4a30', lineHeight: '1.8',
              maxWidth: '420px', margin: '0 auto 24px',
              fontStyle: 'italic',
            }}>
              You have consumed all selected feelings.<br />
              The cafeteria notes your intake.<br />
              The cafeteria does not judge.<br />
              The cafeteria is always here.
            </div>
            <div style={{
              fontSize: '10px', color: '#8a7a60', letterSpacing: '1px',
              marginBottom: '20px',
            }}>
              The attendant is preparing the closing-time tray.
            </div>
            <button
              onClick={handleFinished}
              style={{
                background: 'linear-gradient(180deg, #6a5a3a 0%, #4a3a1a 100%)',
                border: '3px solid #2a1a00',
                borderRadius: '4px',
                padding: '12px 28px',
                color: '#e8d8a0', fontSize: '12px',
                fontFamily: 'monospace', fontWeight: 'bold',
                letterSpacing: '2px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
              }}
            >
              I AM FINISHED
            </button>
          </div>
        )}

        {/* REFILL OVERLAY */}
        {refillVisible && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(20,15,5,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '20px',
          }}>
            <div style={{
              background: '#2a2010', border: '3px solid #8a7020',
              borderRadius: '4px', padding: '32px 36px',
              maxWidth: '420px', textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
              boxShadow: '0 0 60px rgba(200,160,0,0.2)',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>👩</div>
              <div style={{
                fontSize: '9px', letterSpacing: '3px', color: '#8a7020',
                marginBottom: '12px', textTransform: 'uppercase',
              }}>
                CLOSING TIME REFILL
              </div>
              <div style={{
                fontSize: '14px', color: '#f5e070', lineHeight: '1.7',
                fontFamily: "'Courier New', monospace",
              }}>
                {refillMessage}
              </div>
              <div style={{
                marginTop: '20px', fontSize: '10px', color: '#8a7020',
                animation: 'blink 1s infinite',
              }}>
                ● PREPARING NEW TRAY...
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{
          textAlign: 'center', padding: '20px 0 30px',
          fontSize: '9px', color: '#a09878', letterSpacing: '1.5px',
          borderTop: '1px solid rgba(160,150,130,0.3)',
          marginTop: '10px', lineHeight: '1.8',
        }}>
          FEELINGS BAR EST. UNKNOWN &nbsp;|&nbsp; ALWAYS OPEN &nbsp;|&nbsp; NO OUTSIDE FEELINGS<br />
          MANAGEMENT NOT RESPONSIBLE FOR FEELINGS TAKEN IN EXCESS OF RECOMMENDED SERVING<br />
          <span style={{ fontStyle: 'italic', opacity: 0.6 }}>
            "We are here for you. We have always been here for you."
          </span>
        </div>
      </div>
    </div>
  );
}