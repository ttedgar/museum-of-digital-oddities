import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [observations, setObservations] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [subjectName, setSubjectName] = useState('Gerald');
  const [clickCount, setClickCount] = useState(0);
  const [submitState, setSubmitState] = useState('idle');
  const [abstractVisible, setAbstractVisible] = useState(false);
  const [hoverTarget, setHoverTarget] = useState(null);
  const [totalObservations, setTotalObservations] = useState(0);
  const [blinkOn, setBlinkOn] = useState(true);

  const lastMouseMoveRef = useRef(0);
  const lastMouseObsRef = useRef(0);
  const lastClickRef = useRef(0);
  const idleRef = useRef(0);
  const hoverStartRef = useRef(null);
  const hoverObsPostedRef = useRef(false);
  const observationCountRef = useRef(0);
  const feedRef = useRef(null);
  const clickCountRef = useRef(0);
  const abstractPostedRef = useRef(false);
  const idleThresholdsHit = useRef({ t3: false, t7: false, t15: false, t30: false });
  const mousePosRef = useRef({ x: 0, y: 0 });

  const NAMES = ['Gerald', 'Beatrice', 'Mortimer', 'Clementine', 'Reginald', 'Euphemia', 'Thaddeus', 'Dorothea'];
  const WRONG_CONCLUSIONS = [
    'Subject is fundamentally afraid of birds.',
    'Subject has, at some point, lied about enjoying a film.',
    'Subject is secretly hoping someone will notice.',
    'Subject has unresolved feelings about a specific Tuesday.',
    'Subject believes, incorrectly, that they are good at parallel parking.',
    'Subject has rehearsed a conversation that never happened.',
  ];

  const addObservation = useCallback((text, type = 'general') => {
    observationCountRef.current += 1;
    const id = observationCountRef.current;
    setTotalObservations(id);
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}.${String(now.getMilliseconds()).padStart(3,'0')}`;
    setObservations(prev => {
      const next = [...prev, { id, text, timestamp: ts, type }];
      return next.length > 40 ? next.slice(next.length - 40) : next;
    });
  }, []);

  // Init
  useEffect(() => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    setSubjectName(name);
    addObservation(`Terminal initialized. Subject acquired. We have named it ${name}.`, 'system');
    addObservation(`${name} appears to be reading this. Fascinating. Note the micro-saccades.`, 'meta');
    addObservation(`Field study commenced. All findings are peer-reviewed. The peers are also watching.`, 'system');

    const blinkInterval = setInterval(() => setBlinkOn(b => !b), 530);
    return () => clearInterval(blinkInterval);
  }, []);

  // Idle timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastMouseMoveRef.current) / 1000;
      idleRef.current = elapsed;
      setIdleSeconds(elapsed);

      const thresholds = idleThresholdsHit.current;

      if (elapsed >= 3 && !thresholds.t3) {
        thresholds.t3 = true;
        addObservation(`Subject has remained motionless for ${elapsed.toFixed(1)}s. We believe it is processing. Possibly also breathing.`, 'idle');
      }
      if (elapsed >= 7 && !thresholds.t7) {
        thresholds.t7 = true;
        addObservation(`${elapsed.toFixed(1)} seconds of stillness. The research team has begun to whisper. Dr. Pemberton has made tea.`, 'idle');
      }
      if (elapsed >= 15 && !thresholds.t15) {
        thresholds.t15 = true;
        addObservation(`EXTENDED PAUSE DETECTED (${elapsed.toFixed(1)}s). This is now a separate publication. Working title: "The Great Stillness of ${subjectName || 'Gerald'}."`, 'idle');
      }
      if (elapsed >= 30 && !thresholds.t30) {
        thresholds.t30 = true;
        addObservation(`${elapsed.toFixed(0)} seconds. We have begun to wonder if the subject is, in some philosophical sense, still here. A grant has been applied for.`, 'idle');
      }

      // Hover tracking
      if (hoverStartRef.current && !hoverObsPostedRef.current) {
        const hoverDuration = (now - hoverStartRef.current) / 1000;
        if (hoverDuration >= 1.0) {
          hoverObsPostedRef.current = true;
          addObservation(`Pre-click hesitation noted on the Submit button (${hoverDuration.toFixed(2)}s). The ambivalence is exquisite. This will be Figure 3.`, 'hover');
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [addObservation]);

  // Mouse movement
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    setMousePos({ x: e.clientX, y: e.clientY });
    lastMouseMoveRef.current = now;

    // Reset idle thresholds on movement
    idleThresholdsHit.current = { t3: false, t7: false, t15: false, t30: false };

    if (now - lastMouseObsRef.current > 600) {
      lastMouseObsRef.current = now;
      const quadrant = e.clientX < window.innerWidth / 2 ? (e.clientY < window.innerHeight / 2 ? 'upper-left' : 'lower-left') : (e.clientY < window.innerHeight / 2 ? 'upper-right' : 'lower-right');
      const mousePhrases = [
        `Subject's cursor drifted toward the ${quadrant} quadrant. Motivation: unclear.`,
        `Cursor velocity: ${(Math.random() * 200 + 50).toFixed(0)} px/s. Trajectory: purposeful but ultimately directionless.`,
        `Mouse movement detected. Subject is seeking something. We do not know what. Neither do they.`,
        `Cursor positioned at (${e.clientX}, ${e.clientY}). The coordinates mean nothing. The gesture means everything.`,
        `A movement. Brief. Decisive. The subject reconsidered partway through. Classic ${subjectName || 'Gerald'} behavior.`,
      ];
      addObservation(mousePhrases[Math.floor(Math.random() * mousePhrases.length)], 'mouse');
    }
  }, [addObservation, subjectName]);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [observations]);

  // Abstract trigger
  useEffect(() => {
    if (clickCountRef.current >= 3 && !abstractPostedRef.current) {
      abstractPostedRef.current = true;
      setTimeout(() => {
        addObservation(`URGENT: The study has collapsed into being about itself. Subject is now listed as co-author. We are sorry. We are not sorry.`, 'system');
        setTimeout(() => setAbstractVisible(true), 1500);
      }, 2000);
    }
  }, [clickCount, addObservation]);

  const handleSubmitClick = useCallback(() => {
    const now = Date.now();
    lastClickRef.current = now;
    clickCountRef.current += 1;
    setClickCount(c => c + 1);
    setSubmitState('clicked');

    const hoverDuration = hoverStartRef.current ? ((now - hoverStartRef.current) / 1000).toFixed(2) : '0.00';

    addObservation(`Click registered on Submit button. The subject did it. After ${hoverDuration}s of deliberation. Bold.`, 'click');
    addObservation(`FINDING #${observationCountRef.current + 1}: The act of submission was itself a form of resistance. Or compliance. The data is ambiguous.`, 'finding');

    setTimeout(() => {
      addObservation(`Micro-pause detected (post-click). Subject is now wondering if something was supposed to happen. Nothing was. This is the experiment.`, 'aftermath');
      setSubmitState('aftermath');
      setTimeout(() => setSubmitState('idle'), 2000);
    }, 800);
  }, [addObservation]);

  const handleSubmitHover = useCallback(() => {
    setHoverTarget('submit');
    hoverStartRef.current = Date.now();
    hoverObsPostedRef.current = false;
  }, []);

  const handleSubmitLeave = useCallback(() => {
    setHoverTarget(null);
    if (hoverStartRef.current) {
      const duration = (Date.now() - hoverStartRef.current) / 1000;
      if (duration > 0.3 && duration < 1.0) {
        addObservation(`Subject hovered the Submit button for ${duration.toFixed(2)}s then retreated. The retreat has been logged. The retreat is telling.`, 'hover');
      }
    }
    hoverStartRef.current = null;
  }, [addObservation]);

  const handleObsHover = useCallback((id) => {
    if (Math.random() < 0.3) {
      addObservation(`Subject is reading Finding #${id}. The act of reading is itself a finding. We have created a recursive grant application.`, 'meta');
    }
  }, [addObservation]);

  const getSubjectConclusion = () => {
    const hash = subjectName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return WRONG_CONCLUSIONS[hash % WRONG_CONCLUSIONS.length];
  };

  const typeColors = {
    system: '#4a9e6b',
    meta: '#c8a84b',
    idle: '#9b7ec8',
    mouse: '#4a8ec8',
    click: '#c84a4a',
    hover: '#c87a4a',
    finding: '#c8c84a',
    aftermath: '#c84a8e',
    general: '#7a9e7a',
  };

  const typeLabels = {
    system: 'SYS',
    meta: 'META',
    idle: 'IDLE',
    mouse: 'MVMT',
    click: 'CLICK',
    hover: 'HOVR',
    finding: 'FIND',
    aftermath: 'AFTR',
    general: 'OBS',
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        background: '#0a0c0f',
        color: '#7a9e7a',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '13px',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes abstractAppear {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0c0f; }
        ::-webkit-scrollbar-thumb { background: #2a3a2a; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        pointerEvents: 'none',
        zIndex: 100,
      }} />

      {/* Moving scanline */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: 'rgba(74, 158, 107, 0.06)',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 101,
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>

        {/* Header */}
        <div style={{
          borderBottom: '1px solid #2a3a2a',
          paddingBottom: '16px',
        }}>
          <div style={{ color: '#4a9e6b', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>
            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#c8a84b', fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>
                ◈ INSTITUTE FOR INTERSTITIAL BEHAVIOR STUDIES ◈
              </div>
              <div style={{ color: '#4a9e6b', fontSize: '11px', marginTop: '4px', letterSpacing: '1px' }}>
                LIVE FIELD RESEARCH TERMINAL — SESSION ACTIVE — DO NOT CLOSE
              </div>
              <div style={{ color: '#3a5a3a', fontSize: '10px', marginTop: '2px' }}>
                Subject Designation: <span style={{ color: '#c8a84b' }}>{subjectName}</span> &nbsp;|&nbsp;
                Findings: <span style={{ color: '#c8a84b' }}>{totalObservations}</span> &nbsp;|&nbsp;
                Idle: <span style={{ color: idleSeconds > 5 ? '#9b7ec8' : '#4a9e6b' }}>{idleSeconds.toFixed(1)}s</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10px', color: '#3a5a3a' }}>
              <div style={{ color: '#4a9e6b', animation: 'pulse 2s infinite' }}>● RECORDING</div>
              <div style={{ marginTop: '4px' }}>cursor: ({mousePos.x}, {mousePos.y})</div>
              <div style={{ marginTop: '2px' }}>submissions: {clickCount}</div>
            </div>
          </div>
          <div style={{ color: '#2a4a2a', fontSize: '10px', marginTop: '8px' }}>
            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '10px',
          color: '#3a5a3a',
          borderBottom: '1px solid #1a2a1a',
          paddingBottom: '8px',
          flexWrap: 'wrap',
        }}>
          {['BEHAVIOR ANALYSIS: ACTIVE', 'ETHICS BOARD: NOTIFIED (RETROACTIVELY)', 'PEER REVIEW: ONGOING', 'SUBJECT CONSENT: ASSUMED', `STUDY STATUS: ${clickCount >= 3 ? 'COLLAPSED' : 'NOMINAL'}`].map((s, i) => (
            <div key={i} style={{ color: i === 4 && clickCount >= 3 ? '#c84a4a' : '#4a9e6b' }}>
              [{s}]
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>

          {/* Observations feed */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: '#c8a84b', fontSize: '11px', letterSpacing: '2px' }}>
              ▸ LIVE FIELD OBSERVATIONS
            </div>

            <div
              ref={feedRef}
              style={{
                height: '420px',
                overflowY: 'auto',
                border: '1px solid #1a2a1a',
                background: '#050709',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {observations.map((obs) => (
                <div
                  key={obs.id}
                  onMouseEnter={() => handleObsHover(obs.id)}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    animation: 'slideIn 0.2s ease-out',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    cursor: 'default',
                    padding: '2px 4px',
                    borderLeft: `2px solid ${typeColors[obs.type] || '#3a5a3a'}22`,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <span style={{ color: '#2a4a2a', whiteSpace: 'nowrap', fontSize: '10px', paddingTop: '2px' }}>
                    {obs.timestamp}
                  </span>
                  <span style={{
                    color: typeColors[obs.type] || '#3a5a3a',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    paddingTop: '3px',
                    minWidth: '32px',
                  }}>
                    {typeLabels[obs.type] || 'OBS'}
                  </span>
                  <span style={{ color: '#8aae8a', flex: 1 }}>
                    <span style={{ color: '#4a6a4a' }}>#{String(obs.id).padStart(3, '0')} </span>
                    {obs.text}
                  </span>
                </div>
              ))}
              <div style={{ color: blinkOn ? '#4a9e6b' : 'transparent', fontSize: '12px' }}>█</div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Submit button section */}
            <div style={{
              border: '1px solid #2a3a2a',
              padding: '16px',
              background: '#050709',
            }}>
              <div style={{ color: '#c8a84b', fontSize: '10px', letterSpacing: '2px', marginBottom: '12px' }}>
                ▸ BEHAVIOR SUBMISSION
              </div>
              <div style={{ color: '#4a6a4a', fontSize: '11px', marginBottom: '12px', lineHeight: '1.6' }}>
                Submit a behavior for analysis. The researchers are waiting. They have been waiting for some time now.
              </div>

              <button
                onClick={handleSubmitClick}
                onMouseEnter={handleSubmitHover}
                onMouseLeave={handleSubmitLeave}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: submitState === 'clicked' ? '#1a3a1a' : submitState === 'aftermath' ? '#1a1a3a' : hoverTarget === 'submit' ? '#0f1f0f' : '#0a0f0a',
                  border: `1px solid ${submitState === 'clicked' ? '#4a9e6b' : submitState === 'aftermath' ? '#4a4a9e' : hoverTarget === 'submit' ? '#3a6a3a' : '#2a3a2a'}`,
                  color: submitState === 'clicked' ? '#4a9e6b' : submitState === 'aftermath' ? '#8a8ace' : '#7a9e7a',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                  letterSpacing: '1px',
                  transition: 'all 0.15s',
                }}
              >
                {submitState === 'clicked' ? '[ BEHAVIOR LOGGED ]' :
                  submitState === 'aftermath' ? '[ ANALYZING... ]' :
                    hoverTarget === 'submit' ? '[ HESITATION NOTED ]' :
                      '[ SUBMIT A BEHAVIOR ]'}
              </button>

              <div style={{ color: '#2a4a2a', fontSize: '10px', marginTop: '8px', lineHeight: '1.5' }}>
                Note: Clicking this button is itself a behavior. Not clicking it is also a behavior. The researchers have anticipated both outcomes.
              </div>
            </div>

            {/* Researcher status */}
            <div style={{
              border: '1px solid #2a3a2a',
              padding: '16px',
              background: '#050709',
              fontSize: '11px',
            }}>
              <div style={{ color: '#c8a84b', fontSize: '10px', letterSpacing: '2px', marginBottom: '10px' }}>
                ▸ RESEARCH TEAM STATUS
              </div>
              {[
                { name: 'Dr. Pemberton', status: 'Making tea. Watching.', color: '#4a9e6b' },
                { name: 'Dr. Yilmaz', status: 'Updating spreadsheet.', color: '#4a8ec8' },
                { name: 'Grad Student K.', status: 'Crying softly (unrelated).', color: '#9b7ec8' },
                { name: 'The Ethics Board', status: idleSeconds > 10 ? 'Concerned.' : 'Asleep.', color: '#c8a84b' },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: r.color, whiteSpace: 'nowrap' }}>{r.name}</span>
                  <span style={{ color: '#3a5a3a', textAlign: 'right', fontSize: '10px' }}>{r.status}</span>
                </div>
              ))}
            </div>

            {/* Idle meter */}
            <div style={{
              border: '1px solid #2a3a2a',
              padding: '16px',
              background: '#050709',
              fontSize: '11px',
            }}>
              <div style={{ color: '#c8a84b', fontSize: '10px', letterSpacing: '2px', marginBottom: '10px' }}>
                ▸ PAUSE QUANTIFICATION
              </div>
              <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a6a4a' }}>Current pause:</span>
                <span style={{ color: idleSeconds > 10 ? '#9b7ec8' : '#4a9e6b' }}>{idleSeconds.toFixed(2)}s</span>
              </div>
              <div style={{
                height: '6px',
                background: '#1a2a1a',
                marginBottom: '8px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (idleSeconds / 30) * 100)}%`,
                  background: idleSeconds > 15 ? '#9b7ec8' : idleSeconds > 7 ? '#c8a84b' : '#4a9e6b',
                  transition: 'width 0.1s, background 0.5s',
                }} />
              </div>
              <div style={{ color: '#2a4a2a', fontSize: '10px', lineHeight: '1.5' }}>
                {idleSeconds < 3 ? 'Within normal parameters.' :
                  idleSeconds < 7 ? 'Elevated stillness detected.' :
                    idleSeconds < 15 ? 'Subject appears to be contemplating.' :
                      'Grant application submitted.'}
              </div>
            </div>

          </div>
        </div>

        {/* Abstract panel */}
        {abstractVisible && (
          <div style={{
            border: '1px solid #c8a84b',
            background: '#0a0a05',
            padding: '24px',
            animation: 'abstractAppear 0.4s ease-out',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '20px',
              background: '#0a0a05',
              padding: '0 8px',
              color: '#c8a84b',
              fontSize: '10px',
              letterSpacing: '3px',
            }}>
              ◈ DRAFT ABSTRACT — CONFIDENTIAL — YOU ARE READING THIS ◈
            </div>

            <div style={{ color: '#c8c84a', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', letterSpacing: '1px' }}>
              "The Pauses of {subjectName}: A Longitudinal Study of Interstitial Behavior in a Single Observed Entity Across One Browser Session"
            </div>

            <div style={{ color: '#7a7a4a', fontSize: '11px', marginBottom: '12px' }}>
              Authors: Pemberton, E.; Yilmaz, R.; K. (Grad Student); <span style={{ color: '#c8a84b' }}>{subjectName} (Subject, Listed Without Consent)</span>
            </div>

            <div style={{ color: '#5a5a3a', fontSize: '11px', lineHeight: '1.8', marginBottom: '12px' }}>
              <strong style={{ color: '#7a7a4a' }}>Abstract:</strong> This study presents a comprehensive real-time analysis of {subjectName}, an entity observed interacting with a research terminal over a duration of one session. {clickCount} behavioral submissions were recorded, each of which was simultaneously the subject of study and a methodological contamination. The study, initially designed to examine pauses, has become a study of itself examining pauses. The researchers acknowledge this is a problem. The researchers have decided this is actually the finding.
            </div>

            <div style={{ color: '#5a5a3a', fontSize: '11px', lineHeight: '1.8', marginBottom: '12px' }}>
              <strong style={{ color: '#7a7a4a' }}>Methods:</strong> {subjectName} was observed without meaningful consent across {totalObservations} discrete moments. Mouse movement data ({mousePos.x}, {mousePos.y} at time of publication) was analyzed using a proprietary framework called Looking At It. Pauses were quantified using the SI unit "awkward."
            </div>

            <div style={{
              borderTop: '1px solid #3a3a1a',
              paddingTop: '12px',
              marginTop: '8px',
            }}>
              <strong style={{ color: '#c8a84b', fontSize: '11px' }}>Conclusion:</strong>
              <span style={{ color: '#c84a4a', fontSize: '11px' }}> {getSubjectConclusion()}</span>
            </div>

            <div style={{ color: '#3a3a1a', fontSize: '10px', marginTop: '12px' }}>
              This paper has been accepted for publication in the Journal of Things We Noticed. DOI: 10.{subjectName.length}999/{clickCount}.pause.{totalObservations}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #1a2a1a',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#2a4a2a',
        }}>
          <div>© Institute for Interstitial Behavior Studies. All pauses reserved.</div>
          <div>Session: {subjectName} | Findings: {totalObservations} | Status: {clickCount >= 3 ? 'STUDY COLLAPSED' : 'ONGOING'}</div>
        </div>

      </div>
    </div>
  );
}