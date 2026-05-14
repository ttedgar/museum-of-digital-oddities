import { useState, useEffect, useRef, useCallback } from 'react';

const HOBBIES = [
  {
    id: 1,
    name: 'UKULELE',
    delayYear: 2019,
    gate: 'Enthusiasm, now closed',
    announcement: 'Boarding would feel like this: the strap still fits. You remember the C chord — index finger, second fret, third string — and your fingertip finds the groove it wore into the wood. The living room smells like Tuesday evening. You play one measure and it sounds almost right. Almost is enough to continue.',
  },
  {
    id: 2,
    name: 'WATERCOLOR PAINTING',
    delayYear: 2020,
    gate: 'Creative Impulse B (seasonal)',
    announcement: 'Boarding would feel like this: the pan of Prussian blue is cracked but still usable. You wet the brush and it blooms exactly the way you forgot it could. The paper buckles slightly at the edges. You paint a window. It is not a good window. You paint another. The afternoon goes somewhere.',
  },
  {
    id: 3,
    name: 'SOURDOUGH BAKING',
    delayYear: 2020,
    gate: 'Kitchen Counter, far end',
    announcement: 'Boarding would feel like this: the starter smell — sour, alive, faintly alcoholic — hits you when you open the jar. The dough is warm under your hands. You fold it and it pushes back with exactly the right resistance. The oven preheats. The house fills with something that was always going to happen.',
  },
  {
    id: 4,
    name: 'LEARNING PORTUGUESE',
    delayYear: 2018,
    gate: 'Terminal Someday, Concourse Boa Intenção',
    announcement: 'Boarding would feel like this: the word for "saudade" is already in your mouth. You open the app and it says "Welcome back" in a tone that means it. You say "obrigado" out loud in an empty room and it sounds like something you have always known and only recently misplaced.',
  },
  {
    id: 5,
    name: 'THAT THING WITH THE CANDLES',
    delayYear: 2021,
    gate: 'Craft Room (hypothetical)',
    announcement: 'Boarding would feel like this: the wax melts evenly this time. You chose the right wick. The lavender fragrance oil is not overpowering. You pour slowly and it sets without the sinkhole in the middle. You made a thing. It smells like something you would give someone. You almost do.',
  },
  {
    id: 6,
    name: 'RUNNING',
    delayYear: 2017,
    gate: 'Outside (gate permanently ajar)',
    announcement: 'Boarding would feel like this: the first five minutes are still terrible. Then something releases. Your breathing finds a rhythm your body apparently kept in storage. The neighborhood looks different at this speed — slower in a way, more particular. You notice a fence you have never noticed. You run past it twice.',
  },
  {
    id: 7,
    name: 'JOURNALING',
    delayYear: 2016,
    gate: 'Quiet Intention, Gate 3am',
    announcement: 'Boarding would feel like this: the pen works. The page is blank in the way that feels like permission rather than pressure. You write one sentence that is not for anyone. Then another. By the third you have said something true. You close the notebook. It stays said.',
  },
  {
    id: 8,
    name: 'LEARNING THE GUITAR',
    delayYear: 2015,
    gate: 'Barre Chord Terminal (closed for renovation)',
    announcement: 'Boarding would feel like this: the callus is gone but the muscle memory is not entirely. You press an F chord and it rings cleanly on the third try. You find a tab for a song you used to know. You play it slowly. It sounds like the song. It sounds exactly like the song.',
  },
];

const DELAY_REASONS = [
  'awaiting momentum',
  'gate agent has not arrived and may not',
  'passenger repeatedly rebooked but not reboarded',
  'pending favorable conditions (none forecast)',
  'equipment available, will not confirmed',
  'connecting enthusiasm failed to arrive',
  'weather: a general sense that later is fine',
  'under review by committee of previous selves',
];

const NEW_HOBBY = {
  id: 99,
  name: 'CERAMICS',
  gate: 'STILL TIME',
  status: 'NOW BOARDING',
};

export default function Page() {
  const [hobbies, setHobbies] = useState(() =>
    HOBBIES.map((h) => ({
      ...h,
      status: `DELAYED SINCE ${h.delayYear}`,
      cancelled: false,
      checkedIn: false,
      reasonIndex: 0,
    }))
  );
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [announcementHobbyId, setAnnouncementHobbyId] = useState(null);
  const [countdown, setCountdown] = useState(847);
  const [flipCells, setFlipCells] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [countdownPulsed, setCountdownPulsed] = useState(false);
  const announcementTimer = useRef(null);
  const reasonTimer = useRef(null);
  const countdownTimer = useRef(null);
  const prevHiddenRef = useRef(false);

  // Inject keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes flipIn {
        0% { transform: rotateX(90deg); opacity: 0; background: #f5c518; color: #0a0a0a; }
        40% { transform: rotateX(45deg); opacity: 0.5; background: #f5c518; color: #0a0a0a; }
        100% { transform: rotateX(0deg); opacity: 1; background: #111; color: #f5c518; }
      }
      @keyframes flipInStatus {
        0% { transform: rotateX(90deg); opacity: 0; background: #c0392b; color: #fff; }
        40% { transform: rotateX(45deg); opacity: 0.5; }
        100% { transform: rotateX(0deg); opacity: 1; background: #1a0000; color: #ff4444; }
      }
      @keyframes announcementFadeIn {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { color: #f5c518; }
        50% { color: #fff; text-shadow: 0 0 12px #f5c518; }
        100% { color: #f5c518; }
      }
      @keyframes boardingPulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
      @keyframes countdownPulse {
        0% { color: #f5c518; transform: scale(1); }
        50% { color: #fff; transform: scale(1.15); text-shadow: 0 0 20px #f5c518; }
        100% { color: #f5c518; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Cycle reasons
  useEffect(() => {
    reasonTimer.current = setInterval(() => {
      const randomHobbyIndex = Math.floor(Math.random() * HOBBIES.length);
      const hobbyId = HOBBIES[randomHobbyIndex].id;
      setHobbies((prev) =>
        prev.map((h) =>
          h.id === hobbyId && !h.cancelled
            ? { ...h, reasonIndex: (h.reasonIndex + 1) % DELAY_REASONS.length }
            : h
        )
      );
      setFlipCells((prev) => ({ ...prev, [`reason_${hobbyId}`]: Date.now() }));
    }, 3200);
    return () => clearInterval(reasonTimer.current);
  }, []);

  // Countdown: decrements only when tab is hidden
  useEffect(() => {
    countdownTimer.current = setInterval(() => {
      if (document.hidden) {
        prevHiddenRef.current = true;
        setCountdown((c) => Math.max(0, c - 1));
      } else {
        if (prevHiddenRef.current) {
          prevHiddenRef.current = false;
          setCountdownPulsed(true);
          setTimeout(() => setCountdownPulsed(false), 1200);
        }
      }
    }, 1000);
    return () => clearInterval(countdownTimer.current);
  }, []);

  const handleRowClick = useCallback((hobby) => {
    if (hobby.cancelled || activeAnnouncement) return;
    setActiveAnnouncement(hobby.announcement);
    setAnnouncementHobbyId(hobby.id);
    setFlipCells((prev) => ({ ...prev, [`status_${hobby.id}`]: Date.now() }));

    if (announcementTimer.current) clearTimeout(announcementTimer.current);
    announcementTimer.current = setTimeout(() => {
      setHobbies((prev) =>
        prev.map((h) =>
          h.id === hobby.id
            ? {
                ...h,
                cancelled: true,
                status: 'CANCELLED',
                gate: 'closed — weather: general ambient reasonableness',
              }
            : h
        )
      );
      setFlipCells((prev) => ({
        ...prev,
        [`status_${hobby.id}`]: Date.now() + 1,
        [`gate_${hobby.id}`]: Date.now() + 1,
      }));
      setActiveAnnouncement(null);
      setAnnouncementHobbyId(null);
    }, 4500);
  }, [activeAnnouncement]);

  const formatCountdown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const cellStyle = (flipKey, isStatus, isCancelled) => ({
    display: 'inline-block',
    padding: '4px 8px',
    background: isCancelled && isStatus ? '#1a0000' : '#111',
    border: '1px solid #222',
    borderRadius: '2px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), inset 0 -1px 2px rgba(255,200,0,0.04)',
    color: isCancelled && isStatus ? '#ff4444' : '#f5c518',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '12px',
    letterSpacing: '0.08em',
    animation: flipKey ? `${isStatus && isCancelled ? 'flipInStatus' : 'flipIn'} 0.5s ease-out` : 'none',
    transformOrigin: 'center top',
    minWidth: '20px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '260px',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: '"Courier New", Courier, monospace',
      position: 'relative',
    }}>

      {/* Announcement overlay */}
      {activeAnnouncement && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            background: '#faf6f0',
            borderRadius: '4px',
            padding: '40px 48px',
            maxWidth: '560px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            animation: 'announcementFadeIn 0.4s ease-out',
          }}>
            <div style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#888',
              marginBottom: '12px',
              fontFamily: '"Courier New", monospace',
              textTransform: 'uppercase',
            }}>
              ✦ GATE ANNOUNCEMENT ✦
            </div>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#555',
              marginBottom: '20px',
              fontFamily: '"Courier New", monospace',
            }}>
              {HOBBIES.find(h => h.id === announcementHobbyId)?.name} — FINAL BOARDING CALL
            </div>
            <p style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '17px',
              lineHeight: '1.75',
              color: '#2a2a2a',
              margin: 0,
              fontStyle: 'italic',
            }}>
              {activeAnnouncement}
            </p>
            <div style={{
              marginTop: '28px',
              fontSize: '10px',
              color: '#aaa',
              letterSpacing: '0.15em',
              fontFamily: '"Courier New", monospace',
            }}>
              flight status updating...
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ width: '100%', maxWidth: '900px', marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '2px solid #222',
          paddingBottom: '16px',
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              color: '#555',
              letterSpacing: '0.3em',
              marginBottom: '6px',
            }}>DEPARTURES</div>
            <div style={{
              fontSize: '28px',
              color: '#f5c518',
              letterSpacing: '0.15em',
              fontWeight: 'bold',
              textShadow: '0 0 30px rgba(245,197,24,0.3)',
            }}>
              THINGS YOU WERE GOING TO DO
            </div>
            <div style={{
              fontSize: '10px',
              color: '#444',
              letterSpacing: '0.2em',
              marginTop: '4px',
            }}>
              INTERNATIONAL TERMINAL OF GOOD INTENTIONS
            </div>
          </div>
          <div style={{
            textAlign: 'right',
            color: '#444',
            fontSize: '11px',
            letterSpacing: '0.1em',
          }}>
            <div style={{ color: '#f5c518', fontSize: '22px', letterSpacing: '0.05em' }}>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div>LOCAL TIME</div>
          </div>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 180px 1fr 140px',
          gap: '4px',
          padding: '8px 4px',
          borderBottom: '1px solid #1a1a1a',
        }}>
          {['FLIGHT / HOBBY', 'STATUS', 'REASON FOR DELAY', 'GATE'].map(h => (
            <div key={h} style={{
              fontSize: '9px',
              color: '#444',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}>{h}</div>
          ))}
        </div>
      </div>

      {/* Board rows */}
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {hobbies.map((hobby) => {
          const isHovered = hoveredId === hobby.id;
          const isCancelled = hobby.cancelled;
          const flipReasonKey = flipCells[`reason_${hobby.id}`];
          const flipStatusKey = flipCells[`status_${hobby.id}`];
          const flipGateKey = flipCells[`gate_${hobby.id}`];
          const reason = DELAY_REASONS[hobby.reasonIndex];

          return (
            <div
              key={hobby.id}
              onClick={() => handleRowClick(hobby)}
              onMouseEnter={() => !isCancelled && setHoveredId(hobby.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 180px 1fr 140px',
                gap: '4px',
                padding: '8px 4px',
                background: isCancelled
                  ? 'rgba(80,0,0,0.15)'
                  : isHovered
                  ? 'rgba(245,197,24,0.04)'
                  : 'transparent',
                cursor: isCancelled ? 'default' : 'pointer',
                borderRadius: '2px',
                transition: 'background 0.2s',
                borderLeft: isCancelled ? '2px solid #440000' : isHovered ? '2px solid rgba(245,197,24,0.3)' : '2px solid transparent',
                opacity: isCancelled ? 0.6 : 1,
              }}
            >
              {/* Name */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isCancelled ? '#440000' : isHovered ? '#f5c518' : '#333',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }} />
                <span style={{
                  ...cellStyle(false, false, false),
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  fontWeight: 'bold',
                  color: isCancelled ? '#555' : '#f5c518',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '4px 0',
                  maxWidth: '180px',
                }}>
                  {hobby.name}
                </span>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  key={flipStatusKey}
                  style={{
                    ...cellStyle(!!flipStatusKey, true, isCancelled),
                    fontSize: '11px',
                    color: isCancelled ? '#ff4444' : '#f5c518',
                    background: isCancelled ? '#1a0000' : '#111',
                  }}
                >
                  {hobby.status}
                </span>
              </div>

              {/* Reason */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isCancelled ? (
                  <span style={{
                    ...cellStyle(false, false, false),
                    fontSize: '11px',
                    color: '#553333',
                    fontStyle: 'italic',
                  }}>
                    weather: general ambient reasonableness
                  </span>
                ) : (
                  <span
                    key={flipReasonKey}
                    style={{
                      ...cellStyle(!!flipReasonKey, false, false),
                      fontSize: '11px',
                      color: '#c9a800',
                      fontStyle: 'italic',
                    }}
                  >
                    {reason}
                  </span>
                )}
              </div>

              {/* Gate */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  key={flipGateKey}
                  style={{
                    ...cellStyle(!!flipGateKey, false, false),
                    fontSize: '10px',
                    color: isCancelled ? '#553333' : '#a08800',
                    maxWidth: '130px',
                    whiteSpace: 'normal',
                    lineHeight: '1.3',
                  }}
                >
                  {hobby.gate}
                </span>
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div style={{
          borderTop: '1px dashed #222',
          margin: '12px 0 8px',
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0a0a0a',
            padding: '0 12px',
            fontSize: '9px',
            color: '#333',
            letterSpacing: '0.3em',
          }}>
            NEW DEPARTURE
          </span>
        </div>

        {/* New hobby — NOW BOARDING */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 180px 1fr 140px',
          gap: '4px',
          padding: '10px 4px',
          background: 'rgba(0,80,20,0.12)',
          borderRadius: '2px',
          borderLeft: '2px solid rgba(0,200,80,0.3)',
          animation: 'boardingPulse 2.5s ease-in-out infinite',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00cc55',
              flexShrink: 0,
              boxShadow: '0 0 8px #00cc55',
            }} />
            <span style={{
              fontSize: '13px',
              letterSpacing: '0.12em',
              fontWeight: 'bold',
              color: '#00cc55',
              fontFamily: '"Courier New", monospace',
            }}>
              {NEW_HOBBY.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 8px',
              background: '#001a08',
              border: '1px solid #004d1a',
              borderRadius: '2px',
              color: '#00cc55',
              fontSize: '11px',
              letterSpacing: '0.1em',
              fontFamily: '"Courier New", monospace',
              fontWeight: 'bold',
            }}>
              NOW BOARDING
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 8px',
              background: '#0a0a0a',
              border: '1px solid #1a1a1a',
              borderRadius: '2px',
              color: '#006622',
              fontSize: '11px',
              fontStyle: 'italic',
              fontFamily: '"Courier New", monospace',
            }}>
              no prior experience required
            </span>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
              <span style={{
                fontSize: '8px',
                color: '#004d1a',
                letterSpacing: '0.2em',
                marginBottom: '2px',
              }}>CLOSES IN</span>
              <span style={{
                fontSize: '16px',
                fontFamily: '"Courier New", monospace',
                color: '#00cc55',
                letterSpacing: '0.1em',
                animation: countdownPulsed ? 'countdownPulse 1.2s ease-in-out' : 'none',
                display: 'inline-block',
              }}>
                {formatCountdown(countdown)}
              </span>
              {countdownPulsed && (
                <span style={{
                  fontSize: '8px',
                  color: '#ff9900',
                  letterSpacing: '0.1em',
                  marginTop: '2px',
                }}>
                  ↓ decreased while you were away
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 8px',
              background: '#001a08',
              border: '1px solid #004d1a',
              borderRadius: '2px',
              color: '#00cc55',
              fontSize: '11px',
              letterSpacing: '0.08em',
              fontFamily: '"Courier New", monospace',
            }}>
              STILL TIME
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        marginTop: '40px',
        borderTop: '1px solid #1a1a1a',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: '9px',
          color: '#333',
          letterSpacing: '0.2em',
        }}>
          ← CLICK ANY DELAYED FLIGHT TO CHECK IN
        </div>
        <div style={{
          fontSize: '9px',
          color: '#2a2a2a',
          letterSpacing: '0.15em',
          textAlign: 'right',
          fontStyle: 'italic',
        }}>
          all flights subject to cancellation due to weather
        </div>
      </div>
    </div>
  );
}