import { useState, useEffect, useRef, useMemo } from 'react';

export default function Page() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [velocity, setVelocity] = useState(0);
  const [audienceState, setAudienceState] = useState('silence');
  const [marqueeTitle, setMarqueeTitle] = useState('The Cursor: A World Premiere');
  const [showProgram, setShowProgram] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [lightsDown, setLightsDown] = useState(false);
  const [usherVisible, setUsherVisible] = useState(false);
  const [usherX, setUsherX] = useState(-80);
  const [stillDuration, setStillDuration] = useState(0);
  const [headStates, setHeadStates] = useState({});
  const [ovationIntensity, setOvationIntensity] = useState(0);
  const [applauseOpacity, setApplauseOpacity] = useState(0);
  const [finalOvation, setFinalOvation] = useState(false);

  const prevMousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smoothVelocity = useRef(0);
  const stillTimer = useRef(null);
  const stillDurationRef = useRef(0);
  const lastMoveTime = useRef(Date.now());
  const audienceStateRef = useRef('silence');
  const usherTimerRef = useRef(null);
  const marqueeTitleRef = useRef(0);
  const behaviorHistory = useRef('still');
  const finalTriggered = useRef(false);

  const marqueeTitles = {
    still: [
      'A Man Considers the Cursor',
      'Stillness: A Meditation in Real Time',
      'The Pause (World Premiere)',
      'She Did Not Move It (And We Are Changed)',
      'Waiting: A Solo Performance',
      'The Held Breath (Reprise)',
      'Nothing Happened (Encore)',
      'The Cursor Rests Upon the Void',
    ],
    slow: [
      'The Diagonal: A Meditation',
      'She Moved It Left Again (Reprise)',
      'Gentle Arc Across the Middle Distance',
      'A Considered Journey: Northwest',
      'The Drift (In Three Movements)',
      'Slow Passage Toward the Corner',
      'He Moved It Slightly, Then Again',
      'The Long Way Around',
    ],
    fast: [
      'Chaos Theory: A Live Document',
      'The Frantic (Unauthorized)',
      'Velocity and Its Discontents',
      'She Has Gone Too Far (Act II)',
      'Speed: A Formal Complaint',
      'The Incident at Center Stage',
      'Reckless (A Study in Motion)',
      'Too Fast: An Intervention',
    ],
    click: [
      'The Click: What Did It Mean',
      'A Deliberate Act (Witnesses Remain)',
      'The Selection: An Unsolved Mystery',
      'He Pressed It (We Saw Everything)',
      'The Moment of Contact (Deconstructed)',
      'Click: A Tragedy in One Beat',
      'The Button and Its Consequence',
      'She Did It Again (We Are Speechless)',
    ],
  };

  const titleIndices = useRef({ still: 0, slow: 0, fast: 0, click: 0 });

  const audienceHeads = useMemo(() => {
    const heads = [];
    const rows = 5;
    const cols = [10, 11, 12, 11, 10];
    for (let row = 0; row < rows; row++) {
      const count = cols[row];
      for (let col = 0; col < count; col++) {
        heads.push({
          id: `${row}-${col}`,
          row,
          col,
          colTotal: count,
          xJitter: (Math.random() - 0.5) * 18,
          yJitter: (Math.random() - 0.5) * 6,
          size: 18 + Math.random() * 8,
          neckHeight: 14 + Math.random() * 6,
          reactDelay: Math.random() * 400,
          personality: Math.random(),
        });
      }
    }
    return heads;
  }, []);

  useEffect(() => {
    const computeHeadStates = (state, intensity) => {
      const newStates = {};
      audienceHeads.forEach(h => {
        const rand = Math.random();
        let lean = 0, mouthOpen = false, dab = false, rise = false, turnLeft = false, turnRight = false, armUp = false;
        if (state === 'ovation' || state === 'final') {
          lean = (Math.random() - 0.3) * 8;
          armUp = true;
          rise = true;
          mouthOpen = rand > 0.3;
        } else if (state === 'gasp') {
          lean = (Math.random() - 0.5) * 12;
          mouthOpen = rand > 0.2;
          dab = rand > 0.7;
        } else if (state === 'murmur') {
          lean = (Math.random() - 0.5) * 15;
          turnLeft = rand > 0.5;
          turnRight = !turnLeft && rand > 0.3;
          mouthOpen = rand > 0.4;
        } else if (state === 'usher') {
          lean = (Math.random() - 0.5) * 20;
          mouthOpen = rand > 0.3;
          turnLeft = rand > 0.4;
        } else {
          lean = (Math.random() - 0.5) * 4;
          mouthOpen = false;
        }
        newStates[h.id] = { lean, mouthOpen, dab, rise, armUp, turnLeft, turnRight };
      });
      return newStates;
    };

    setHeadStates(computeHeadStates(audienceState, ovationIntensity));
  }, [audienceState, audienceHeads]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      smoothVelocity.current = smoothVelocity.current * 0.6 + dist * 0.4;
      const v = smoothVelocity.current;
      setVelocity(v);
      setMousePos({ x: e.clientX, y: e.clientY });
      prevMousePos.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = now;

      clearTimeout(stillTimer.current);
      stillDurationRef.current = 0;
      setStillDuration(0);

      if (v > 15) {
        if (audienceStateRef.current !== 'murmur' && audienceStateRef.current !== 'usher') {
          audienceStateRef.current = 'murmur';
          setAudienceState('murmur');
          behaviorHistory.current = 'fast';
          updateMarquee('fast');
          if (!usherTimerRef.current) {
            setUsherVisible(true);
            setUsherX(-80);
            usherTimerRef.current = setTimeout(() => {
              setUsherVisible(false);
              setUsherX(-80);
              usherTimerRef.current = null;
              if (audienceStateRef.current === 'murmur') {
                audienceStateRef.current = 'silence';
                setAudienceState('silence');
              }
            }, 4000);
          }
        }
      } else if (v > 0.5) {
        if (audienceStateRef.current !== 'gasp') {
          audienceStateRef.current = 'gasp';
          setAudienceState('gasp');
          behaviorHistory.current = 'slow';
          updateMarquee('slow');
        }
      }

      stillTimer.current = setTimeout(() => {
        audienceStateRef.current = 'ovation';
        setAudienceState('ovation');
        setApplauseOpacity(1);
        behaviorHistory.current = 'still';
        updateMarquee('still');
        const interval = setInterval(() => {
          if (lastMoveTime.current && Date.now() - lastMoveTime.current < 1500) {
            clearInterval(interval);
            return;
          }
          stillDurationRef.current += 100;
          setStillDuration(d => d + 100);
          setOvationIntensity(i => Math.min(1, i + 0.02));
        }, 100);
        setTimeout(() => clearInterval(interval), 30000);
      }, 1500);
    };

    const handleClick = () => {
      if (finalOvation) return;
      audienceStateRef.current = 'silence';
      setAudienceState('silence');
      setApplauseOpacity(0);
      setOvationIntensity(0);
      behaviorHistory.current = 'click';
      updateMarquee('click');
      setTimeout(() => {
        if (audienceStateRef.current === 'silence') {
          audienceStateRef.current = 'gasp';
          setAudienceState('gasp');
        }
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearTimeout(stillTimer.current);
    };
  }, [audienceHeads, finalOvation]);

  useEffect(() => {
    if (audienceState === 'murmur' && usherVisible) {
      let x = -80;
      const walk = setInterval(() => {
        x += 3;
        setUsherX(x);
        if (x > window.innerWidth + 80) clearInterval(walk);
      }, 30);
      return () => clearInterval(walk);
    }
  }, [audienceState, usherVisible]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        if (next >= 180 && !finalTriggered.current) {
          finalTriggered.current = true;
          setLightsDown(true);
          setFinalOvation(true);
          audienceStateRef.current = 'final';
          setAudienceState('final');
          setApplauseOpacity(1);
          setOvationIntensity(1);
          setMarqueeTitle('FINALE');
          setTimeout(() => setShowProgram(true), 3000);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateMarquee = (behavior) => {
    const titles = marqueeTitles[behavior];
    const idx = titleIndices.current[behavior] % titles.length;
    titleIndices.current[behavior] = idx + 1;
    setMarqueeTitle(titles[idx]);
  };

  useEffect(() => {
    if (finalOvation) return;
    const interval = setInterval(() => {
      const b = behaviorHistory.current;
      updateMarquee(b);
    }, 10000);
    return () => clearInterval(interval);
  }, [finalOvation]);

  const stageWidth = Math.min(window.innerWidth * 0.7, 800);
  const stageHeight = 160;
  const stageX = (window.innerWidth - stageWidth) / 2;
  const stageY = window.innerHeight * 0.22;

  const audienceAreaY = stageY + stageHeight + 20;
  const audienceAreaHeight = window.innerHeight - audienceAreaY - 20;
  const rowHeight = audienceAreaHeight / 5.5;

  const getHeadTransform = (head, state) => {
    const hs = headStates[head.id] || {};
    const lean = hs.lean || 0;
    const rise = hs.rise || false;
    const yOffset = rise ? -10 : 0;
    return `rotate(${lean}deg) translateY(${yOffset}px)`;
  };

  const applauseChars = ['✦', '✧', '⋆', '·', '✦', '✧'];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: lightsDown ? '#030002' : '#0a0005',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'none',
      transition: 'background 3s ease',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
          75% { opacity: 0.95; }
        }
        @keyframes rise {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes applauseFloat {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.5); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes marqueePulse {
          0%, 100% { letter-spacing: 0.12em; }
          50% { letter-spacing: 0.18em; }
        }
        @keyframes usherWalk {
          0%, 100% { transform: scaleX(1) translateY(0); }
          50% { transform: scaleX(1) translateY(-3px); }
        }
        @keyframes sconce {
          0%, 100% { box-shadow: 0 0 18px 8px rgba(184,134,11,0.35); }
          50% { box-shadow: 0 0 28px 14px rgba(184,134,11,0.5); }
        }
      `}</style>

      {/* Ambient vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, #000 100%)',
        pointerEvents: 'none', zIndex: 1,
        opacity: lightsDown ? 0.95 : 0.6,
        transition: 'opacity 3s ease',
      }} />

      {/* Ceiling ornament */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 180, height: 60,
        background: 'radial-gradient(ellipse at center top, #b8860b22, transparent 70%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* Left sconce */}
      <div style={{
        position: 'absolute', left: 40, top: stageY - 20,
        width: 16, height: 40,
        background: '#b8860b',
        borderRadius: '3px 3px 0 0',
        boxShadow: '0 0 20px 10px rgba(184,134,11,0.4)',
        animation: 'sconce 3s ease-in-out infinite',
        zIndex: 3,
      }} />
      <div style={{
        position: 'absolute', left: 30, top: stageY - 40,
        width: 36, height: 22,
        background: 'linear-gradient(to bottom, #ffe89a, #b8860b)',
        borderRadius: '50% 50% 0 0',
        opacity: 0.9,
        zIndex: 3,
      }} />

      {/* Right sconce */}
      <div style={{
        position: 'absolute', right: 40, top: stageY - 20,
        width: 16, height: 40,
        background: '#b8860b',
        borderRadius: '3px 3px 0 0',
        boxShadow: '0 0 20px 10px rgba(184,134,11,0.4)',
        animation: 'sconce 3s ease-in-out infinite 1.5s',
        zIndex: 3,
      }} />
      <div style={{
        position: 'absolute', right: 30, top: stageY - 40,
        width: 36, height: 22,
        background: 'linear-gradient(to bottom, #ffe89a, #b8860b)',
        borderRadius: '50% 50% 0 0',
        opacity: 0.9,
        zIndex: 3,
      }} />

      {/* Marquee above stage */}
      <div style={{
        position: 'absolute',
        top: stageY - 80,
        left: stageX,
        width: stageWidth,
        textAlign: 'center',
        zIndex: 5,
      }}>
        <div style={{
          display: 'inline-block',
          background: '#0d0008',
          border: '2px solid #b8860b',
          borderBottom: 'none',
          padding: '10px 30px 8px',
          color: '#f5e6c8',
          fontSize: 13,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          animation: 'marqueePulse 4s ease-in-out infinite',
          fontStyle: 'italic',
          maxWidth: stageWidth - 40,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {marqueeTitle}
        </div>
      </div>

      {/* Stage */}
      <div style={{
        position: 'absolute',
        left: stageX,
        top: stageY,
        width: stageWidth,
        height: stageHeight,
        background: 'linear-gradient(to bottom, #2a1200, #1a0a00)',
        border: '3px solid #3d1a00',
        borderBottom: 'none',
        zIndex: 3,
        overflow: 'hidden',
      }}>
        {/* Stage spotlight */}
        <div style={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: stageWidth * 0.6,
          height: stageHeight + 60,
          background: 'radial-gradient(ellipse at top, rgba(255,200,80,0.18) 0%, transparent 70%)',
          animation: 'flicker 5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Mouse cursor on stage — the performer */}
        {mousePos.x >= stageX && mousePos.x <= stageX + stageWidth &&
         mousePos.y >= stageY && mousePos.y <= stageY + stageHeight && (
          <div style={{
            position: 'absolute',
            left: mousePos.x - stageX - 8,
            top: mousePos.y - stageY - 8,
            width: 16, height: 16,
            borderRadius: '50%',
            background: 'rgba(255,220,100,0.85)',
            boxShadow: '0 0 12px 6px rgba(255,200,80,0.5)',
            pointerEvents: 'none',
            transition: 'width 0.1s, height 0.1s',
          }} />
        )}

        {/* Stage floor boards */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: 0,
            left: 0, right: 0,
            height: 1,
            top: stageHeight * 0.5 + i * 14,
            background: 'rgba(184,134,11,0.08)',
          }} />
        ))}

        {/* Curtain left */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 50,
          background: 'linear-gradient(to right, #3d0014, transparent)',
        }} />
        {/* Curtain right */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: 50,
          background: 'linear-gradient(to left, #3d0014, transparent)',
        }} />

        {/* Stage text */}
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          textAlign: 'center',
          color: 'rgba(245,230,200,0.15)',
          fontSize: 11,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}>
          THE STAGE
        </div>
      </div>

      {/* Stage apron */}
      <div style={{
        position: 'absolute',
        left: stageX - 30,
        top: stageY + stageHeight,
        width: stageWidth + 60,
        height: 20,
        background: 'linear-gradient(to bottom, #1a0a00, #0d0508)',
        borderTop: '2px solid #b8860b44',
        zIndex: 3,
      }} />

      {/* Audience area */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: audienceAreaY,
        height: audienceAreaHeight,
        zIndex: 4,
      }}>
        {audienceHeads.map(head => {
          const hs = headStates[head.id] || {};
          const rowWidth = window.innerWidth * 0.85;
          const rowLeft = (window.innerWidth - rowWidth) / 2;
          const cellWidth = rowWidth / head.colTotal;
          const x = rowLeft + cellWidth * head.col + cellWidth / 2 + head.xJitter;
          const y = rowHeight * head.row + head.yJitter + rowHeight * 0.5;

          const isRising = hs.rise || false;
          const lean = hs.lean || 0;
          const mouthOpen = hs.mouthOpen || false;
          const armUp = hs.armUp || false;
          const dab = hs.dab || false;
          const turnLeft = hs.turnLeft || false;

          const headColor = '#1a0a14';
          const headHighlight = '#2d1020';

          return (
            <div key={head.id} style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${lean}deg) translateY(${isRising ? -12 : 0}px) scaleX(${turnLeft ? 0.7 : 1})`,
              transition: `transform ${0.3 + head.reactDelay * 0.001}s ease`,
              transformOrigin: 'bottom center',
            }}>
              <svg width={head.size * 2.5} height={head.size * 3 + head.neckHeight + (armUp ? 30 : 0)} style={{ overflow: 'visible' }}>
                {/* Neck */}
                <rect
                  x={head.size * 0.7}
                  y={head.size * 1.9}
                  width={head.size * 0.6}
                  height={head.neckHeight}
                  fill={headColor}
                />
                {/* Shoulders */}
                <ellipse
                  cx={head.size * 1.25}
                  cy={head.size * 2 + head.neckHeight + 6}
                  rx={head.size * 1.1}
                  ry={head.size * 0.4}
                  fill={headColor}
                />
                {/* Head */}
                <ellipse
                  cx={head.size * 1.25}
                  cy={head.size * 1}
                  rx={head.size * 0.8}
                  ry={head.size}
                  fill={headColor}
                />
                {/* Head highlight */}
                <ellipse
                  cx={head.size * 1.05}
                  cy={head.size * 0.7}
                  rx={head.size * 0.25}
                  ry={head.size * 0.3}
                  fill={headHighlight}
                  opacity={0.4}
                />
                {/* Mouth open */}
                {mouthOpen && (
                  <ellipse
                    cx={head.size * 1.25}
                    cy={head.size * 1.35}
                    rx={head.size * 0.22}
                    ry={head.size * 0.13}
                    fill="#0a0005"
                  />
                )}
                {/* Dab eye */}
                {dab && (
                  <line
                    x1={head.size * 0.85} y1={head.size * 0.85}
                    x2={head.size * 1.05} y2={head.size * 1.0}
                    stroke="#4a2030" strokeWidth={1.5}
                  />
                )}
                {/* Arms up for ovation */}
                {armUp && (
                  <>
                    <line
                      x1={head.size * 0.2}
                      y1={head.size * 2 + head.neckHeight}
                      x2={head.size * 0.0}
                      y2={head.size * 1.2}
                      stroke={headColor} strokeWidth={head.size * 0.3}
                      strokeLinecap="round"
                      style={{ animation: 'rise 0.8s ease-in-out infinite' }}
                    />
                    <line
                      x1={head.size * 2.3}
                      y1={head.size * 2 + head.neckHeight}
                      x2={head.size * 2.5}
                      y2={head.size * 1.2}
                      stroke={headColor} strokeWidth={head.size * 0.3}
                      strokeLinecap="round"
                      style={{ animation: 'rise 0.8s ease-in-out infinite 0.2s' }}
                    />
                  </>
                )}
              </svg>
            </div>
          );
        })}
      </div>

      {/* Aisle lines */}
      <div style={{
        position: 'absolute',
        left: '50%', transform: 'translateX(-50%)',
        top: audienceAreaY,
        width: 3,
        height: audienceAreaHeight,
        background: 'linear-gradient(to bottom, rgba(184,134,11,0.08), rgba(184,134,11,0.03))',
        zIndex: 3,
      }} />

      {/* Usher */}
      {usherVisible && (
        <div style={{
          position: 'absolute',
          left: usherX,
          top: audienceAreaY + rowHeight * 2,
          zIndex: 6,
          animation: 'usherWalk 0.4s steps(2) infinite',
          transition: 'left 0.03s linear',
        }}>
          <svg width={30} height={70} style={{ overflow: 'visible' }}>
            <ellipse cx={15} cy={8} rx={7} ry={8} fill="#0f0a14" />
            <rect x={8} y={16} width={14} height={32} rx={4} fill="#0f0a14" />
            <line x1={8} y1={20} x2={0} y2={38} stroke="#0f0a14" strokeWidth={5} strokeLinecap="round" />
            <line x1={22} y1={20} x2={30} y2={38} stroke="#0f0a14" strokeWidth={5} strokeLinecap="round" />
            <line x1={10} y1={48} x2={8} y2={68} stroke="#0f0a14" strokeWidth={5} strokeLinecap="round" />
            <line x1={20} y1={48} x2={22} y2={68} stroke="#0f0a14" strokeWidth={5} strokeLinecap="round" />
            <rect x={22} y={28} width={18} height={3} rx={1} fill="#b8860b" opacity={0.8} />
            <text x={34} y={28} fill="#f5e6c8" fontSize={7} fontFamily="Georgia" style={{ pointerEvents: 'none' }}>USHER</text>
          </svg>
        </div>
      )}

      {/* Audience state overlay text */}
      <div style={{
        position: 'absolute',
        top: stageY + stageHeight + 5,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8,
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        {audienceState === 'ovation' && (
          <div style={{
            color: '#f5e6c8',
            fontSize: 13,
            letterSpacing: '0.25em',
            opacity: applauseOpacity,
            animation: 'pulse 1.2s ease-in-out infinite',
            textTransform: 'uppercase',
          }}>
            {ovationIntensity > 0.6 ? '✦ STANDING OVATION ✦' : '· · · applause · · ·'}
          </div>
        )}
        {audienceState === 'final' && (
          <div style={{
            color: '#f5e6c8',
            fontSize: 15,
            letterSpacing: '0.3em',
            animation: 'pulse 0.8s ease-in-out infinite',
            textTransform: 'uppercase',
          }}>
            ✦ ✦ ✦ BRAVISSIMO ✦ ✦ ✦
          </div>
        )}
        {audienceState === 'gasp' && (
          <div style={{
            color: 'rgba(245,230,200,0.6)',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontStyle: 'italic',
          }}>
            · · · reverent gasps · · ·
          </div>
        )}
        {audienceState === 'murmur' && (
          <div style={{
            color: 'rgba(245,230,200,0.5)',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontStyle: 'italic',
          }}>
            · · · scandalized murmuring · · ·
          </div>
        )}
        {audienceState === 'silence' && (
          <div style={{
            color: 'rgba(245,230,200,0.25)',
            fontSize: 10,
            letterSpacing: '0.3em',
            fontStyle: 'italic',
          }}>
            · · · polite silence · · ·
          </div>
        )}
      </div>

      {/* Floating applause particles */}
      {(audienceState === 'ovation' || audienceState === 'final') && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${15 + i * 10}%`,
              top: `${60 + (i % 3) * 8}%`,
              color: '#b8860b',
              fontSize: 14 + (i % 3) * 4,
              opacity: 0,
              animation: `applauseFloat ${1.5 + i * 0.3}s ease-out ${i * 0.4}s infinite`,
            }}>
              {applauseChars[i % applauseChars.length]}
            </div>
          ))}
        </div>
      )}

      {/* Custom cursor */}
      <div style={{
        position: 'fixed',
        left: mousePos.x - 6,
        top: mousePos.y - 6,
        width: 12, height: 12,
        borderRadius: '50%',
        background: 'rgba(245,230,200,0.9)',
        boxShadow: '0 0 8px 3px rgba(245,230,200,0.4)',
        pointerEvents: 'none',
        zIndex: 100,
        transition: 'width 0.1s, height 0.1s',
      }} />

      {/* Elapsed indicator (subtle) */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        right: 20,
        color: 'rgba(184,134,11,0.25)',
        fontSize: 10,
        fontFamily: 'Georgia, serif',
        letterSpacing: '0.15em',
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
      </div>

      {/* Behavior hint */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 20,
        color: 'rgba(245,230,200,0.15)',
        fontSize: 9,
        fontFamily: 'Georgia, serif',
        letterSpacing: '0.12em',
        fontStyle: 'italic',
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        the audience is watching
      </div>

      {/* Final program overlay */}
      {showProgram && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          background: 'rgba(3,0,2,0.7)',
        }}>
          <div style={{
            background: '#f5e6c8',
            color: '#1a0a00',
            width: 380,
            maxWidth: '90vw',
            padding: '50px 40px',
            fontFamily: 'Georgia, "Times New Roman", serif',
            boxShadow: '0 0 80px 20px rgba(184,134,11,0.3), 0 30px 80px rgba(0,0,0,0.8)',
            animation: 'slideUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
            border: '1px solid #b8860b',
            position: 'relative',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#5a3a00', marginBottom: 6 }}>
                PROGRAM
              </div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#8a6a30', marginBottom: 20 }}>
                TONIGHT'S PERFORMANCE
              </div>
              <div style={{ width: 60, height: 1, background: '#b8860b', margin: '0 auto 20px' }} />
              <div style={{ fontSize: 22, fontStyle: 'italic', lineHeight: 1.3, marginBottom: 8 }}>
                The Thing That Happened
              </div>
              <div style={{ fontSize: 11, color: '#5a3a00', letterSpacing: '0.1em' }}>
                A Performance in One Continuous Act
              </div>
            </div>

            <div style={{ borderTop: '1px solid #c8a870', borderBottom: '1px solid #c8a870', padding: '20px 0', margin: '20px 0' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5a3a00', marginBottom: 12 }}>
                CAST
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontStyle: 'italic' }}>The Performer</span>
                <span>You</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontStyle: 'italic' }}>The Audience</span>
                <span>They Have Always Known</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontStyle: 'italic' }}>The Thing The Performance Was About All Along</span>
                <span>You</span>
              </div>
            </div>

            <div style={{ fontSize: 10, color: '#5a3a00', lineHeight: 1.7, marginBottom: 20 }}>
              <div style={{ letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>NOTES</div>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                The clapping was structural. The audience understood
                from the beginning that the cursor's hesitations
                were the most important part. They were right.
                They are always right. The performance will continue
                in their memory indefinitely.
              </p>
            </div>

            <div style={{ textAlign: 'center', fontSize: 9, color: '#8a6a30', letterSpacing: '0.15em' }}>
              PLEASE HOLD YOUR APPLAUSE<br />
              <span style={{ fontStyle: 'italic' }}>(they will not)</span>
            </div>

            <div style={{
              position: 'absolute',
              top: 12, right: 16,
              fontSize: 9, color: '#8a6a30',
              letterSpacing: '0.1em',
            }}>
              COMPLIMENTARY
            </div>
          </div>
        </div>
      )}
    </div>
  );
}