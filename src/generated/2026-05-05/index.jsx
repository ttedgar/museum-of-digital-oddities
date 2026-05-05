import { useState, useEffect, useRef, useCallback } from 'react';

const MOOD_TEMPLATES = [
  { label: 'Inexplicable Melancholy', owner: 'UNKNOWN CIVILIAN (WINDOW SEAT, NORTHBOUND)', feePerSecond: 0.003 },
  { label: 'Unearned Optimism', owner: 'THE PERSON HUMMING IN THE PARKING GARAGE', feePerSecond: 0.002 },
  { label: 'Secondhand Dread', owner: 'WAITING ROOM OCCUPANT #4', feePerSecond: 0.005 },
  { label: 'Borrowed Tenderness', owner: 'UNKNOWN CIVILIAN (OVERHEARD PHONE CALL)', feePerSecond: 0.001 },
  { label: 'Ambient Irritation', owner: 'COWORKER\'S TUESDAY', feePerSecond: 0.004 },
  { label: 'Residual Excitement', owner: 'STRANGER AT BUS STOP (UMBRELLA, RED)', feePerSecond: 0.002 },
  { label: 'Unnamed Longing', owner: 'THE COUPLE ARGUING QUIETLY IN AISLE 7', feePerSecond: 0.006 },
  { label: 'Diffuse Contentment', owner: 'UNKNOWN CIVILIAN (SMELLED LIKE CEDAR)', feePerSecond: 0.001 },
  { label: 'Low-Grade Panic', owner: 'ELEVATOR OCCUPANT, FLOOR 12-14', feePerSecond: 0.007 },
  { label: 'Reflexive Nostalgia', owner: 'THE RADIO IN SOMEONE ELSE\'S CAR', feePerSecond: 0.003 },
  { label: 'Performative Calm', owner: 'UNKNOWN CIVILIAN (WAITING FOR TEST RESULTS)', feePerSecond: 0.004 },
  { label: 'Surplus Grief', owner: 'FUNERAL ATTENDEE, PEW 3 (UNRELATED FUNERAL)', feePerSecond: 0.005 },
  { label: 'Contagious Boredom', owner: 'THE ENTIRE WAITING ROOM, COLLECTIVELY', feePerSecond: 0.002 },
  { label: 'Furtive Glee', owner: 'UNKNOWN CIVILIAN (JUST GOT AWAY WITH SOMETHING)', feePerSecond: 0.003 },
  { label: 'Atmospheric Unease', owner: 'THE BUILDING ITSELF (TUESDAYS)', feePerSecond: 0.004 },
];

const CLERK_RULINGS = [
  'RULING: Sustained internal residency constitutes emotional squatting under Municipal Code §7.4(b). Grievance denied. Fee doubled.',
  'RULING: Claimant\'s assertion of "it just happened to me" does not constitute lawful acquisition. Emotional squatting confirmed. Fee doubled.',
  'RULING: The doctrine of Involuntary Absorption does not apply when residency exceeds 72 hours. See Feelings v. Municipality (1987). Fee doubled.',
  'RULING: Grievance reviewed. Clerk finds claimant\'s argument "emotionally persuasive but legally incoherent." Denied. Fee doubled.',
  'RULING: Per ordinance 14-C, all moods carried beyond their original context are subject to impound. You had thirty days. Fee doubled.',
  'RULING: The mood in question has established domicile. Eviction proceedings would cause undue disruption. Grievance denied. Fee doubled.',
  'RULING: Clerk notes that claimant has filed this same grievance before, under different pretenses. Pattern of emotional hoarding noted. Fee doubled.',
  'RULING: "I didn\'t ask for this feeling" is not a recognized legal defense in this jurisdiction. Fee doubled.',
  'RULING: The original owner has been contacted. They do not want it back. You are now the de facto owner. Fee doubled.',
  'RULING: Grievance form submitted incorrectly (wrong emotional context). Resubmission permitted within 30 days. Current fee doubled pending.',
];

const DATES = [
  '2021-03-14', '2020-11-07', '2022-06-22', '2019-08-30',
  '2023-01-15', '2021-09-03', '2020-04-18', '2022-12-01',
  '2019-05-27', '2023-07-09', '2021-07-20', '2020-02-14',
];

let globalId = 0;
function makeId() { return ++globalId; }

function createMood(templateIndex, daysCarried, startTick = 0, status = 'impounded') {
  const t = MOOD_TEMPLATES[templateIndex % MOOD_TEMPLATES.length];
  const dateIndex = Math.floor(Math.random() * DATES.length);
  return {
    id: makeId(),
    label: t.label,
    owner: t.owner,
    dateAcquired: DATES[dateIndex],
    daysCarried,
    feePerSecond: t.feePerSecond,
    startTick,
    status,
    lotNumber: `LOT-${String(Math.floor(Math.random() * 900) + 100)}-${String.fromCharCode(65 + Math.floor(Math.random() * 8))}`,
    contestMultiplier: 1,
  };
}

export default function Page() {
  const [tick, setTick] = useState(0);
  const [moods, setMoods] = useState(() => {
    const initial = [];
    const used = new Set();
    const indices = [];
    while (indices.length < 7) {
      const i = Math.floor(Math.random() * MOOD_TEMPLATES.length);
      if (!used.has(i)) { used.add(i); indices.push(i); }
    }
    const days = [842, 412, 156, 67, 23, 8, 1203];
    indices.forEach((idx, i) => {
      const status = days[i] > 800 ? 'abandoned' : 'impounded';
      initial.push(createMood(idx, days[i], 0, status));
    });
    return initial;
  });
  const [releasingIds, setReleasingIds] = useState(new Set());
  const [contestingId, setContestingId] = useState(null);
  const [grievanceText, setGrievanceText] = useState('');
  const [clerkMessages, setClerkMessages] = useState([]);
  const [newlyTowedId, setNewlyTowedId] = useState(null);
  const [permanentRecord, setPermanentRecord] = useState([]);
  const [towedInIds, setTowedInIds] = useState(new Set());
  const [lotFull, setLotFull] = useState(false);

  const tickRef = useRef(0);
  const moodsRef = useRef(moods);
  moodsRef.current = moods;

  const nextTowIndex = useRef(Math.floor(Math.random() * MOOD_TEMPLATES.length));
  const towCountdown = useRef(Math.floor(Math.random() * 15) + 25);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const currentTick = tickRef.current;
      setTick(currentTick);

      towCountdown.current -= 1;
      if (towCountdown.current <= 0) {
        towCountdown.current = Math.floor(Math.random() * 15) + 20;
        const activeCount = moodsRef.current.filter(m => m.status !== 'released').length;
        if (activeCount < 12) {
          let idx = nextTowIndex.current;
          nextTowIndex.current = (idx + 1) % MOOD_TEMPLATES.length;
          const newMood = createMood(idx, Math.floor(Math.random() * 30) + 1, currentTick, 'impounded');
          setMoods(prev => [...prev, newMood]);
          setNewlyTowedId(newMood.id);
          setTowedInIds(prev => new Set([...prev, newMood.id]));
          setTimeout(() => setTowedInIds(prev => { const n = new Set(prev); n.delete(newMood.id); return n; }), 1200);
          setTimeout(() => setNewlyTowedId(null), 100);
        } else {
          setLotFull(true);
          setTimeout(() => setLotFull(false), 4000);
        }
      }

      setMoods(prev => prev.map(m => {
        if (m.status === 'impounded' || m.status === 'contested') {
          if (m.daysCarried > 800 && m.status !== 'abandoned') {
            setPermanentRecord(pr => pr.includes(m.label) ? pr : [...pr, m.label]);
            return { ...m, status: 'abandoned' };
          }
        }
        return m;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getFee = (mood) => {
    const elapsed = tick - mood.startTick;
    return (elapsed * mood.feePerSecond * mood.contestMultiplier).toFixed(2);
  };

  const handlePayFine = (moodId) => {
    setReleasingIds(prev => new Set([...prev, moodId]));
    setTimeout(() => {
      setMoods(prev => prev.map(m => m.id === moodId ? { ...m, status: 'released' } : m));
      setReleasingIds(prev => { const n = new Set(prev); n.delete(moodId); return n; });
    }, 2600);
  };

  const handleContest = (moodId) => {
    setContestingId(moodId);
    setGrievanceText('');
  };

  const handleSubmitGrievance = () => {
    const ruling = CLERK_RULINGS[Math.floor(Math.random() * CLERK_RULINGS.length)];
    setClerkMessages(prev => [...prev, ruling]);
    setMoods(prev => prev.map(m =>
      m.id === contestingId
        ? { ...m, status: 'contested', contestMultiplier: 2 }
        : m
    ));
    setContestingId(null);
    setGrievanceText('');
  };

  const dismissClerk = (index) => {
    setClerkMessages(prev => prev.filter((_, i) => i !== index));
  };

  const activeModds = moods.filter(m => m.status !== 'released');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#E8E4DC',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#2A2A2A',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          30% { transform: translateY(-40px) rotate(-2deg); opacity: 1; }
          100% { transform: translateY(-120vh) rotate(5deg); opacity: 0; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(110%); opacity: 0; }
          60% { transform: translateX(-10px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes stampIn {
          0% { transform: scale(2) rotate(-15deg); opacity: 0; }
          50% { transform: scale(0.95) rotate(-15deg); opacity: 1; }
          100% { transform: scale(1) rotate(-15deg); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes tickerScroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: '#3A4A5C',
        borderBottom: '4px solid #C8622A',
        padding: '0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
        }}>
          <div>
            <div style={{ color: '#E8E4DC', fontSize: '10px', letterSpacing: '4px', marginBottom: '2px' }}>
              MUNICIPAL DEPARTMENT OF EMOTIONAL PROPERTY MANAGEMENT
            </div>
            <div style={{ color: '#E8E4DC', fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>
              IMPOUND LOT FOR BORROWED MOODS
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#C8622A', fontSize: '11px', animation: 'blink 2s infinite' }}>
              ● LOT OPERATING
            </div>
            <div style={{ color: '#9AACBF', fontSize: '10px', marginTop: '2px' }}>
              CAPACITY: {activeModds.length}/12 SPACES
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div style={{
          background: '#C8622A',
          overflow: 'hidden',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            whiteSpace: 'nowrap',
            animation: 'tickerScroll 30s linear infinite',
            color: '#E8E4DC',
            fontSize: '11px',
            letterSpacing: '2px',
          }}>
            NOTICE: YOU HAVE THIRTY DAYS TO CLAIM OR RELEASE IMPOUNDED MOODS &nbsp;&nbsp;●&nbsp;&nbsp;
            EMOTIONAL SQUATTING IS A MUNICIPAL VIOLATION &nbsp;&nbsp;●&nbsp;&nbsp;
            FEES ACCRUE IN REAL TIME &nbsp;&nbsp;●&nbsp;&nbsp;
            THE CLERK IS ALWAYS RIGHT &nbsp;&nbsp;●&nbsp;&nbsp;
            ABANDONED MOODS BECOME PERMANENT RECORD &nbsp;&nbsp;●&nbsp;&nbsp;
            NEW TOWS ARRIVING DAILY &nbsp;&nbsp;●&nbsp;&nbsp;
            CONTESTING OWNERSHIP DOUBLES YOUR FEE &nbsp;&nbsp;●&nbsp;&nbsp;
          </div>
        </div>
      </div>

      {/* Lot Full Alert */}
      {lotFull && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#C8622A',
          color: '#E8E4DC',
          padding: '12px 24px',
          fontSize: '13px',
          letterSpacing: '2px',
          zIndex: 200,
          border: '2px solid #8B3A10',
          animation: 'shake 0.5s ease',
        }}>
          ⚠ LOT CAPACITY REACHED — MOOD TURNED AWAY — CIRCLING THE BLOCK
        </div>
      )}

      <div style={{ display: 'flex', gap: '0', minHeight: 'calc(100vh - 90px)' }}>

        {/* Main Lot */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

          {/* Notice */}
          <div style={{
            border: '1px solid #9AACBF',
            background: '#F0EDE6',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '11px',
            lineHeight: '1.8',
            color: '#4A5568',
          }}>
            <strong>NOTICE OF IMPOUNDMENT</strong> — The following moods were towed from your person having been
            acquired from third parties and not returned within the statutory period. Each mood is held pending
            payment of accumulated fees. Fees continue to accrue until release. Contesting ownership is your right
            and will double your fee. The clerk's ruling is final.
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {activeModds.map(mood => {
              const isReleasing = releasingIds.has(mood.id);
              const isNewlyTowed = towedInIds.has(mood.id);
              const fee = getFee(mood);

              return (
                <div
                  key={mood.id}
                  style={{
                    border: mood.status === 'abandoned'
                      ? '2px solid #8B3A10'
                      : mood.status === 'contested'
                        ? '2px solid #C8622A'
                        : '2px solid #BDB8AE',
                    background: mood.status === 'abandoned' ? '#F5EDE6' : '#FAFAF7',
                    padding: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: isReleasing
                      ? 'floatUp 2.6s ease-in forwards'
                      : isNewlyTowed
                        ? 'slideInRight 0.8s ease-out forwards'
                        : 'none',
                    cursor: 'default',
                  }}
                >
                  {/* Lot Number */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '12px',
                    fontSize: '10px',
                    color: '#9AACBF',
                    letterSpacing: '1px',
                  }}>
                    {mood.lotNumber}
                  </div>

                  {/* Status Badge */}
                  {mood.status === 'abandoned' && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '-24px',
                      background: '#8B3A10',
                      color: '#E8E4DC',
                      fontSize: '9px',
                      padding: '2px 30px',
                      transform: 'rotate(-45deg)',
                      letterSpacing: '1px',
                    }}>
                      ABANDONED
                    </div>
                  )}

                  {mood.status === 'contested' && (
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      background: '#C8622A',
                      color: '#E8E4DC',
                      fontSize: '9px',
                      padding: '2px 8px',
                      letterSpacing: '2px',
                      textAlign: 'center',
                    }}>
                      UNDER CONTEST — FEE DOUBLED — RULING PENDING
                    </div>
                  )}

                  <div style={{ marginTop: mood.status === 'contested' ? '16px' : '0' }}>
                    {/* Mood Label */}
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                      marginBottom: '10px',
                      color: '#2A2A2A',
                      borderBottom: '1px dashed #BDB8AE',
                      paddingBottom: '8px',
                    }}>
                      {mood.label.toUpperCase()}
                    </div>

                    {/* Details */}
                    <div style={{ fontSize: '10px', lineHeight: '2', color: '#4A5568' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9AACBF' }}>ORIGINAL OWNER:</span>
                        <span style={{ textAlign: 'right', maxWidth: '180px', fontSize: '9px' }}>{mood.owner}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9AACBF' }}>DATE ACQUIRED:</span>
                        <span>{mood.dateAcquired}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9AACBF' }}>DAYS CARRIED:</span>
                        <span>{mood.daysCarried} days</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', borderTop: '1px dashed #BDB8AE', paddingTop: '4px' }}>
                        <span style={{ color: '#9AACBF' }}>RATE:</span>
                        <span style={{ color: '#C8622A' }}>${(mood.feePerSecond * mood.contestMultiplier).toFixed(4)}/sec</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9AACBF' }}>ACCRUED FEE:</span>
                        <span style={{
                          color: '#C8622A',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          animation: 'blink 1.5s infinite',
                        }}>
                          ${fee}
                        </span>
                      </div>
                    </div>

                    {/* Abandoned Notice */}
                    {mood.status === 'abandoned' && (
                      <div style={{
                        marginTop: '10px',
                        background: '#8B3A10',
                        color: '#E8E4DC',
                        padding: '6px 8px',
                        fontSize: '9px',
                        lineHeight: '1.5',
                        letterSpacing: '0.5px',
                      }}>
                        ⚠ CLASSIFIED AS ABANDONED PROPERTY — TRANSFERRED TO PERMANENT RECORD —
                        RELEASE STILL AVAILABLE AT ACCUMULATED RATE
                      </div>
                    )}

                    {/* Actions */}
                    {mood.status !== 'abandoned' && contestingId !== mood.id && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          onClick={() => handlePayFine(mood.id)}
                          disabled={isReleasing}
                          style={{
                            flex: 1,
                            background: '#3A4A5C',
                            color: '#E8E4DC',
                            border: 'none',
                            padding: '8px 4px',
                            fontSize: '10px',
                            letterSpacing: '1px',
                            cursor: isReleasing ? 'default' : 'pointer',
                            opacity: isReleasing ? 0.5 : 1,
                          }}
                        >
                          PAY FINE (${fee})
                        </button>
                        <button
                          onClick={() => handleContest(mood.id)}
                          style={{
                            flex: 1,
                            background: 'transparent',
                            color: '#C8622A',
                            border: '1px solid #C8622A',
                            padding: '8px 4px',
                            fontSize: '10px',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                          }}
                        >
                          CONTEST OWNERSHIP
                        </button>
                      </div>
                    )}

                    {mood.status === 'abandoned' && (
                      <button
                        onClick={() => handlePayFine(mood.id)}
                        disabled={isReleasing}
                        style={{
                          width: '100%',
                          background: '#8B3A10',
                          color: '#E8E4DC',
                          border: 'none',
                          padding: '8px 4px',
                          fontSize: '10px',
                          letterSpacing: '1px',
                          cursor: isReleasing ? 'default' : 'pointer',
                          marginTop: '10px',
                          opacity: isReleasing ? 0.5 : 1,
                        }}
                      >
                        PAY FINE — RELEASE FROM RECORD (${fee})
                      </button>
                    )}

                    {/* Grievance Form */}
                    {contestingId === mood.id && (
                      <div style={{
                        marginTop: '12px',
                        border: '1px solid #C8622A',
                        padding: '10px',
                        background: '#FDF8F4',
                      }}>
                        <div style={{ fontSize: '10px', color: '#C8622A', letterSpacing: '2px', marginBottom: '8px' }}>
                          GRIEVANCE FORM 7-B: OWNERSHIP CONTEST
                        </div>
                        <div style={{ fontSize: '9px', color: '#9AACBF', marginBottom: '6px' }}>
                          State your grounds for contesting impoundment of: {mood.label.toUpperCase()}
                        </div>
                        <textarea
                          value={grievanceText}
                          onChange={e => setGrievanceText(e.target.value)}
                          placeholder="I believe this mood was not voluntarily acquired because..."
                          style={{
                            width: '100%',
                            height: '70px',
                            background: '#E8E4DC',
                            border: '1px solid #BDB8AE',
                            fontFamily: '"Courier New", Courier, monospace',
                            fontSize: '10px',
                            padding: '6px',
                            color: '#2A2A2A',
                            resize: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                        <div style={{ fontSize: '9px', color: '#C8622A', margin: '4px 0 8px' }}>
                          ⚠ WARNING: Submission doubles your accrued fee regardless of outcome.
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={handleSubmitGrievance}
                            style={{
                              flex: 2,
                              background: '#C8622A',
                              color: '#E8E4DC',
                              border: 'none',
                              padding: '7px',
                              fontSize: '10px',
                              letterSpacing: '1px',
                              cursor: 'pointer',
                            }}
                          >
                            SUBMIT GRIEVANCE
                          </button>
                          <button
                            onClick={() => setContestingId(null)}
                            style={{
                              flex: 1,
                              background: 'transparent',
                              color: '#9AACBF',
                              border: '1px solid #BDB8AE',
                              padding: '7px',
                              fontSize: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Released Stamp Overlay */}
                  {isReleasing && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(248, 244, 238, 0.85)',
                    }}>
                      <div style={{
                        border: '4px solid #8B1A1A',
                        color: '#8B1A1A',
                        padding: '10px 20px',
                        fontSize: '16px',
                        letterSpacing: '3px',
                        fontWeight: 'bold',
                        transform: 'rotate(-15deg)',
                        animation: 'stampIn 0.4s ease-out forwards',
                        textAlign: 'center',
                        lineHeight: '1.4',
                      }}>
                        RETURNED<br />TO ATMOSPHERE
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {activeModds.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#9AACBF',
              fontSize: '13px',
              marginTop: '60px',
              letterSpacing: '2px',
              lineHeight: '2',
            }}>
              LOT EMPTY<br />
              <span style={{ fontSize: '10px' }}>New moods arrive daily. Check back.</span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{
          width: '260px',
          borderLeft: '3px solid #BDB8AE',
          background: '#EEEBE4',
          padding: '16px',
          flexShrink: 0,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 90px)',
          position: 'sticky',
          top: '90px',
        }}>
          {/* Stats */}
          <div style={{
            borderBottom: '2px solid #BDB8AE',
            paddingBottom: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#4A5568', marginBottom: '10px' }}>
              LOT STATISTICS
            </div>
            {[
              { label: 'IMPOUNDED', val: moods.filter(m => m.status === 'impounded').length },
              { label: 'CONTESTED', val: moods.filter(m => m.status === 'contested').length },
              { label: 'ABANDONED', val: moods.filter(m => m.status === 'abandoned').length },
              { label: 'RELEASED', val: moods.filter(m => m.status === 'released').length },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                marginBottom: '4px',
                color: '#4A5568',
              }}>
                <span style={{ color: '#9AACBF' }}>{row.label}</span>
                <span>{row.val}</span>
              </div>
            ))}
          </div>

          {/* Total Fees */}
          <div style={{
            borderBottom: '2px solid #BDB8AE',
            paddingBottom: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#4A5568', marginBottom: '8px' }}>
              TOTAL OUTSTANDING
            </div>
            <div style={{
              fontSize: '22px',
              color: '#C8622A',
              fontWeight: 'bold',
              animation: 'blink 2s infinite',
            }}>
              ${activeModds
                .filter(m => m.status !== 'released')
                .reduce((sum, m) => sum + parseFloat(getFee(m)), 0)
                .toFixed(2)}
            </div>
            <div style={{ fontSize: '9px', color: '#9AACBF', marginTop: '2px' }}>
              AND ACCRUING
            </div>
          </div>

          {/* Permanent Record */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#4A5568', marginBottom: '8px' }}>
              PERMANENT RECORD
            </div>
            {permanentRecord.length === 0 ? (
              <div style={{ fontSize: '10px', color: '#9AACBF', fontStyle: 'italic' }}>
                No entries yet.
              </div>
            ) : (
              permanentRecord.map((label, i) => (
                <div key={i} style={{
                  fontSize: '10px',
                  color: '#8B3A10',
                  borderLeft: '2px solid #8B3A10',
                  paddingLeft: '8px',
                  marginBottom: '6px',
                  lineHeight: '1.4',
                }}>
                  {label}
                </div>
              ))
            )}
          </div>

          {/* Instructions */}
          <div style={{
            fontSize: '9px',
            color: '#9AACBF',
            lineHeight: '1.8',
            borderTop: '1px dashed #BDB8AE',
            paddingTop: '12px',
          }}>
            <div style={{ marginBottom: '4px', color: '#4A5568', letterSpacing: '1px' }}>OFFICE HOURS</div>
            Moods are processed 24 hours a day, 7 days a week, including holidays and moments of personal crisis.
            <br /><br />
            The clerk does not accept appeals by phone.
            <br /><br />
            Moods carried beyond 800 days are considered abandoned and transferred to your permanent emotional record without notice.
          </div>
        </div>
      </div>

      {/* Clerk Window Overlay */}
      {clerkMessages.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '500px',
          width: '90%',
        }}>
          {clerkMessages.map((msg, i) => (
            <div key={i} style={{
              background: '#3A4A5C',
              color: '#E8E4DC',
              padding: '14px 16px',
              borderTop: '3px solid #C8622A',
              fontSize: '11px',
              lineHeight: '1.7',
              letterSpacing: '0.5px',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              <div style={{
                fontSize: '9px',
                color: '#9AACBF',
                letterSpacing: '3px',
                marginBottom: '6px',
              }}>
                ◼ CLERK WINDOW — OFFICIAL RULING
              </div>
              {msg}
              <button
                onClick={() => dismissClerk(i)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#9AACBF',
                  cursor: 'pointer',
                  fontSize: '14px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}