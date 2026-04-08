import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const ERROR_CODES = [
    'ERR_MOMENT_ELAPSED',
    'ERR_RECIPIENT_HAS_MOVED_ON',
    'ERR_THE_FEELING_CHANGED_SHAPE',
    'ERR_PROXIMITY_LAPSED',
    'ERR_SOCIAL_CONTRACT_EXPIRED',
    'ERR_MUSCLE_MEMORY_CORRUPTED',
    'ERR_EYE_CONTACT_BROKEN',
    'ERR_WARMTH_DISSIPATED',
    'ERR_INTENTION_UNVERIFIABLE',
    'ERR_TOUCH_BUFFER_OVERFLOW',
  ];

  const NEW_GESTURE_TYPES = [
    { type: 'CONSOLATORY PAT', recipient: 'someone standing in a doorway', status: 'suspended mid-air, palm open, since the conversation ended', progress: 91 },
    { type: 'FAREWELL WAVE', recipient: 'a departing figure in a parking lot', status: 'hand at shoulder height, wrist rotating, indefinitely', progress: 88 },
    { type: 'BECKONING GESTURE', recipient: 'a person across a crowded room who may have looked away', status: 'index finger curled, held at hip level, unacknowledged', progress: 79 },
    { type: 'SYMPATHETIC SQUEEZE', recipient: 'the forearm of a colleague near a copy machine', status: 'fingers hovering 0.4 inches from sleeve, since the bad news', progress: 94 },
    { type: 'THUMBS UP', recipient: 'a stranger who did something brave', status: 'thumb elevated, eye contact lost, gesture orphaned', progress: 83 },
    { type: 'FIST BUMP', recipient: 'a person who had already retracted their fist', status: 'knuckles extended, cooling, since Q3', progress: 97 },
    { type: 'HAIR TUCK', recipient: 'someone whose face was obscured', status: 'fingers approaching temple, movement arrested, undated', progress: 86 },
    { type: 'HANDSHAKE (FORMAL)', recipient: 'an official of unknown department', status: 'right hand extended, grip prepared, recipient turned away', progress: 72 },
  ];

  const INITIAL_GESTURES = [
    {
      id: 1,
      type: 'HUG (PARTIAL)',
      recipient: 'a person near a refrigerator',
      context: 'kitchen of a rented apartment, late evening, 2017',
      status: 'arms at elbow-height, angled inward, hovering',
      progress: 94,
      errorCode: null,
      isNew: false,
      timestamp: 'FILED: 2017-11-03 / REF: UG-00441',
    },
    {
      id: 2,
      type: 'HIGH-FIVE',
      recipient: 'a colleague whose name was later forgotten',
      context: 'office corridor, end of fiscal quarter, Q2',
      status: 'palm raised, contact never established, hand cooling since',
      progress: 87,
      errorCode: null,
      isNew: false,
      timestamp: 'FILED: 2019-06-28 / REF: UG-00892',
    },
    {
      id: 3,
      type: 'SHOULDER TAP',
      recipient: 'a person in a gray coat at a bus stop',
      context: 'near-miss, became lifelong silence',
      status: 'fingertips 0.3 inches from contact, since March',
      progress: 96,
      errorCode: null,
      isNew: false,
      timestamp: 'FILED: 2021-03-14 / REF: UG-01205',
    },
    {
      id: 4,
      type: 'HANDSHAKE (INFORMAL)',
      recipient: 'an acquaintance at a mutual friend\'s gathering',
      context: 'threshold of a living room, someone called their name',
      status: 'grip initiated, interrupted, never resolved',
      progress: 61,
      errorCode: null,
      isNew: false,
      timestamp: 'FILED: 2020-08-22 / REF: UG-01089',
    },
    {
      id: 5,
      type: 'WAVE (LONG DISTANCE)',
      recipient: 'a figure on a train platform, possibly known',
      context: 'train was departing, uncertain of recognition',
      status: 'hand raised to ear level, train has since arrived elsewhere',
      progress: 78,
      errorCode: null,
      isNew: false,
      timestamp: 'FILED: 2018-04-07 / REF: UG-00731',
    },
    {
      id: 6,
      type: 'BACK PAT (CONGRATULATORY)',
      recipient: 'a sibling at an undisclosed ceremony',
      context: 'crowded moment, bodies repositioned before contact',
      status: 'palm descending, arc unfinished, suspended',
      progress: 89,
      errorCode: null,
      isNew: false,
      timestamp: 'FILED: 2016-05-19 / REF: UG-00318',
    },
    {
      id: 7,
      type: 'ELBOW NUDGE',
      recipient: 'a person who would have found it funny',
      context: 'the joke passed before the nudge landed',
      status: 'elbow angled outward, moment elapsed, still angled',
      progress: 93,
      errorCode: null,
      isNew: false,
      timestamp: 'FILED: 2022-09-01 / REF: UG-01447',
    },
  ];

  const [gestures, setGestures] = useState(INITIAL_GESTURES);
  const [attemptingId, setAttemptingId] = useState(null);
  const [errorOverlay, setErrorOverlay] = useState(null);
  const [limbProgress, setLimbProgress] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const animFrameRef = useRef(null);
  const nextIdRef = useRef(100);

  const generateCaseNumber = () => {
    return 'CASE-' + Math.floor(Math.random() * 90000 + 10000) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  const attemptCompletion = useCallback((gestureId) => {
    if (attemptingId !== null) return;
    setAttemptingId(gestureId);
    setLimbProgress(0);
    setGlitchActive(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 3 + 1;
      if (progress >= 85) {
        progress = 85 + Math.random() * 2;
        setLimbProgress(progress);
        setGlitchActive(true);
        clearInterval(interval);

        setTimeout(() => {
          const errorCode = ERROR_CODES[Math.floor(Math.random() * ERROR_CODES.length)];
          const caseNum = generateCaseNumber();
          setErrorOverlay({ errorCode, caseNum, gestureId });
          setAttemptingId(null);
          setGlitchActive(false);

          setGestures(prev => prev.map(g =>
            g.id === gestureId ? { ...g, errorCode, progress: Math.min(g.progress + 1, 99) } : g
          ));

          const newGestureTemplate = NEW_GESTURE_TYPES[Math.floor(Math.random() * NEW_GESTURE_TYPES.length)];
          const newId = nextIdRef.current++;
          const now = new Date();
          const newGesture = {
            id: newId,
            type: newGestureTemplate.type,
            recipient: newGestureTemplate.recipient,
            context: 'generated by failed completion attempt #' + (totalAttempts + 1),
            status: newGestureTemplate.status,
            progress: newGestureTemplate.progress,
            errorCode: null,
            isNew: true,
            timestamp: `FILED: ${now.toISOString().split('T')[0]} / REF: UG-${String(Math.floor(Math.random() * 90000 + 10000))}`,
          };
          setGestures(prev => [newGesture, ...prev]);
          setTotalAttempts(t => t + 1);
        }, 1200);
      } else {
        setLimbProgress(progress);
      }
    }, 60);
  }, [attemptingId, totalAttempts]);

  const closeOverlay = () => setErrorOverlay(null);

  const getStatusColor = (progress) => {
    if (progress >= 90) return '#c0392b';
    if (progress >= 75) return '#e67e22';
    return '#7f8c8d';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e8ebe6',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#2c3e2d',
    }}>
      <style>{`
        @keyframes glitch1 {
          0% { transform: translateX(0px) skewX(0deg); }
          20% { transform: translateX(-3px) skewX(-2deg); }
          40% { transform: translateX(2px) skewX(1deg); }
          60% { transform: translateX(-4px) skewX(3deg); }
          80% { transform: translateX(1px) skewX(-1deg); }
          100% { transform: translateX(0px) skewX(0deg); }
        }
        @keyframes glitch2 {
          0% { transform: translateX(0px) skewX(0deg); }
          25% { transform: translateX(4px) skewX(2deg); }
          50% { transform: translateX(-2px) skewX(-3deg); }
          75% { transform: translateX(3px) skewX(1deg); }
          100% { transform: translateX(0px) skewX(0deg); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
          75% { opacity: 0.9; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes newBadgePulse {
          0%, 100% { background-color: #c0392b; }
          50% { background-color: #e74c3c; }
        }
        @keyframes overlayIn {
          0% { opacity: 0; transform: scale(0.96) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes progressPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
      }} />

      {/* Header */}
      <div style={{
        backgroundColor: '#3d4f3e',
        color: '#c8d5c0',
        padding: '0',
        borderBottom: '3px solid #2c3e2d',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          backgroundColor: '#2c3e2d',
          padding: '4px 24px',
          fontSize: '9px',
          letterSpacing: '2px',
          color: '#8aaa8b',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>DEPARTMENT OF INCOMPLETE HUMAN CONTACT — FORM UG-SERIES</span>
          <span>QUEUE CURRENT AS OF YOUR LAST BREATH</span>
        </div>
        <div style={{ padding: '16px 24px 12px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#8aaa8b', marginBottom: '4px' }}>
            PENDING GESTURE REGISTRY
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px', color: '#ddeedd' }}>
            Bureau of Unfinished Gestures
          </div>
          <div style={{
            marginTop: '8px',
            display: 'flex',
            gap: '24px',
            fontSize: '10px',
            color: '#7a9c7b',
          }}>
            <span>TOTAL PENDING: {gestures.length}</span>
            <span>COMPLETION ATTEMPTS: {totalAttempts}</span>
            <span>SUCCESSFUL COMPLETIONS: 0</span>
            <span style={{ color: '#c0392b' }}>BACKLOG: GROWING</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Notice */}
        <div style={{
          border: '1px solid #9aaa9b',
          backgroundColor: '#dde8dd',
          padding: '12px 16px',
          marginBottom: '28px',
          fontSize: '11px',
          lineHeight: '1.8',
          color: '#3d5040',
        }}>
          <strong>NOTICE TO ALL REGISTERED PARTIES:</strong> The gestures listed below were initiated under reasonable social conditions and remain in an unresolved state. Each entry reflects a physical intention that departed the body but failed to establish contact. The Department makes no guarantee of resolution. Completion attempts are permitted but have historically resulted in further filings. Proceed with awareness that the moment in question has, in most cases, already relocated.
        </div>

        {/* Gesture Queue */}
        {gestures.map((gesture, index) => (
          <GestureCard
            key={gesture.id}
            gesture={gesture}
            isAttempting={attemptingId === gesture.id}
            limbProgress={limbProgress}
            glitchActive={glitchActive && attemptingId === gesture.id}
            onAttempt={attemptCompletion}
            statusColor={getStatusColor(gesture.progress)}
          />
        ))}

        {/* Footer notice */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          borderTop: '1px solid #9aaa9b',
          fontSize: '10px',
          color: '#7a9c7b',
          lineHeight: '1.9',
          textAlign: 'center',
        }}>
          All gestures are filed in perpetuity. The queue does not close.<br />
          A wave that never arrived. The hand remembers departing but cannot locate the destination shoulder.<br />
          <span style={{ color: '#c0392b' }}>DO NOT ATTEMPT TO GRIEVE THE ITEMS IN THIS REGISTRY.</span>
        </div>
      </div>

      {/* Error Overlay */}
      {errorOverlay && (
        <div
          onClick={closeOverlay}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(44,62,45,0.7)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#1a2a1b',
              border: '2px solid #c0392b',
              padding: '0',
              maxWidth: '480px',
              width: '100%',
              animation: 'overlayIn 0.3s ease',
              boxShadow: '0 0 40px rgba(192,57,43,0.3)',
            }}
          >
            <div style={{
              backgroundColor: '#c0392b',
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '10px', letterSpacing: '2px', fontWeight: 'bold' }}>
                COMPLETION FAILURE — SYSTEM REPORT
              </span>
              <span style={{ color: '#fff', fontSize: '10px' }}>{errorOverlay.caseNum}</span>
            </div>
            <div style={{ padding: '28px 24px' }}>
              <div style={{
                fontSize: '28px',
                color: '#e74c3c',
                fontWeight: 'bold',
                letterSpacing: '1px',
                marginBottom: '16px',
                animation: 'flicker 0.8s ease infinite',
              }}>
                {errorOverlay.errorCode}
              </div>
              <div style={{ fontSize: '11px', color: '#8aaa8b', lineHeight: '1.9', marginBottom: '24px' }}>
                The completion attempt was processed and denied.<br />
                The gesture has been returned to the queue in its original unresolved state.<br />
                A new filing has been generated as a result of this attempt.<br />
                The Department regrets any inconvenience caused by the passage of time.
              </div>
              <div style={{
                borderTop: '1px solid #3d5040',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '10px', color: '#5a7a5b' }}>
                  ONE NEW GESTURE HAS BEEN ADDED TO YOUR QUEUE.
                </span>
                <button
                  onClick={closeOverlay}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #5a7a5b',
                    color: '#8aaa8b',
                    padding: '6px 14px',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    fontFamily: '"Courier New", Courier, monospace',
                  }}
                >
                  ACKNOWLEDGE & CONTINUE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GestureCard({ gesture, isAttempting, limbProgress, glitchActive, onAttempt, statusColor }) {
  const leftX = -100 + (limbProgress / 100) * 80;
  const rightX = 100 - (limbProgress / 100) * 80;

  return (
    <div style={{
      backgroundColor: gesture.isNew ? '#dde8d8' : '#dfe8df',
      border: `1px solid ${gesture.isNew ? '#7aaa7b' : '#aabcab'}`,
      marginBottom: '16px',
      position: 'relative',
      boxShadow: gesture.isNew ? '0 0 0 1px #7aaa7b' : 'none',
    }}>
      {/* Card header */}
      <div style={{
        backgroundColor: gesture.isNew ? '#3d6040' : '#4a5e4b',
        padding: '6px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {gesture.isNew && (
            <span style={{
              backgroundColor: '#c0392b',
              color: '#fff',
              fontSize: '8px',
              padding: '2px 6px',
              letterSpacing: '1px',
              fontWeight: 'bold',
              animation: 'newBadgePulse 1.5s ease infinite',
            }}>
              NEWLY FILED
            </span>
          )}
          <span style={{ color: '#c8d5c0', fontSize: '10px', letterSpacing: '2px' }}>
            GESTURE TYPE: <strong>{gesture.type}</strong>
          </span>
        </div>
        <span style={{ color: '#8aaa8b', fontSize: '9px' }}>{gesture.timestamp}</span>
      </div>

      {/* Form fields */}
      <div style={{ padding: '16px 14px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: '12px' }}>
          <FormField label="INTENDED RECIPIENT" value={gesture.recipient} />
          <FormField label="CONTEXTUAL LOCATION" value={gesture.context} />
          <FormField label="CURRENT STATUS" value={gesture.status} highlight />
          <FormField label="FILING DEPARTMENT" value="Dept. of Incomplete Human Contact, Sub-Bureau of Suspended Motion" />
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '9px', color: '#5a7a5b', letterSpacing: '1px', marginBottom: '4px' }}>
            COMPLETION PROGRESS — FROZEN AT {gesture.progress}%
          </div>
          <div style={{
            height: '8px',
            backgroundColor: '#b8c8b8',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${gesture.progress}%`,
              backgroundColor: statusColor,
              animation: 'progressPulse 3s ease infinite',
              transition: 'width 0.5s ease',
            }} />
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: `${100 - gesture.progress}%`,
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)',
            }} />
          </div>
          <div style={{ fontSize: '9px', color: '#8a9c8b', marginTop: '3px', textAlign: 'right' }}>
            REMAINING: {100 - gesture.progress}% — CANNOT BE RECOVERED
          </div>
        </div>

        {/* Error code display if present */}
        {gesture.errorCode && (
          <div style={{
            backgroundColor: '#2c1a1a',
            border: '1px solid #c0392b',
            padding: '6px 10px',
            marginBottom: '12px',
            fontSize: '10px',
            color: '#e74c3c',
            letterSpacing: '1px',
          }}>
            LAST ERROR: {gesture.errorCode}
          </div>
        )}

        {/* Limb animation area */}
        {isAttempting && (
          <div style={{
            position: 'relative',
            height: '80px',
            backgroundColor: '#c8d8c0',
            border: '1px solid #9aaa9b',
            marginBottom: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '9px',
              color: '#5a7a5b',
              letterSpacing: '1px',
              zIndex: 2,
            }}>
              COMPLETION IN PROGRESS — DO NOT LEAVE SCREEN
            </div>

            {/* Left limb */}
            <svg
              width="120"
              height="60"
              viewBox="0 0 120 60"
              style={{
                position: 'absolute',
                top: '16px',
                left: `calc(50% - 130px + ${leftX}px)`,
                animation: glitchActive ? 'glitch1 0.15s ease infinite' : 'none',
                transition: glitchActive ? 'none' : 'left 0.06s linear',
              }}
            >
              <path
                d="M 10 50 Q 40 30 70 35 Q 90 36 110 40"
                stroke="#2c3e2d"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 90 28 Q 105 33 110 40 Q 108 47 100 44"
                stroke="#2c3e2d"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse cx="10" cy="50" rx="6" ry="4" fill="#3d5040" opacity="0.5" />
            </svg>

            {/* Right limb */}
            <svg
              width="120"
              height="60"
              viewBox="0 0 120 60"
              style={{
                position: 'absolute',
                top: '16px',
                left: `calc(50% + 10px + ${-leftX}px)`,
                transform: 'scaleX(-1)',
                animation: glitchActive ? 'glitch2 0.15s ease infinite' : 'none',
                transition: glitchActive ? 'none' : 'left 0.06s linear',
              }}
            >
              <path
                d="M 10 50 Q 40 30 70 35 Q 90 36 110 40"
                stroke="#2c3e2d"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 90 28 Q 105 33 110 40 Q 108 47 100 44"
                stroke="#2c3e2d"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse cx="10" cy="50" rx="6" ry="4" fill="#3d5040" opacity="0.5" />
            </svg>

            {glitchActive && (
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '9px',
                color: '#c0392b',
                letterSpacing: '2px',
                animation: 'flicker 0.2s ease infinite',
              }}>
                CONTACT IMMINENT — CONTACT IMMINENT — CONTACT—
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '9px', color: '#8a9c8b', fontStyle: 'italic' }}>
            {isAttempting ? 'PROCESSING ATTEMPT...' : 'STATUS: UNRESOLVED / OPEN'}
          </span>
          <button
            onClick={() => !isAttempting && onAttempt(gesture.id)}
            disabled={isAttempting}
            style={{
              backgroundColor: isAttempting ? '#5a7a5b' : '#3d5040',
              color: isAttempting ? '#8aaa8b' : '#c8d5c0',
              border: '1px solid #5a7a5b',
              padding: '6px 16px',
              fontSize: '10px',
              letterSpacing: '1px',
              cursor: isAttempting ? 'not-allowed' : 'pointer',
              fontFamily: '"Courier New", Courier, monospace',
              transition: 'background-color 0.2s',
              animation: isAttempting ? 'flicker 1s ease infinite' : 'none',
            }}
          >
            {isAttempting ? 'ATTEMPTING...' : 'ATTEMPT COMPLETION'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, highlight }) {
  return (
    <div>
      <div style={{
        fontSize: '8px',
        color: '#5a7a5b',
        letterSpacing: '1.5px',
        marginBottom: '3px',
      }}>
        {label}
      </div>
      <div style={{
        backgroundColor: '#f0f4ef',
        border: '1px solid #b8c8b8',
        padding: '5px 8px',
        fontSize: '10px',
        color: highlight ? '#2c3e2d' : '#4a5e4b',
        fontStyle: highlight ? 'italic' : 'normal',
        lineHeight: '1.5',
        minHeight: '28px',
      }}>
        {value}
      </div>
    </div>
  );
}