import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const defaultThoughts = [
    { name: "whether the noise the fridge makes is normal", origin: "arose during a Tuesday commute, 2021", coachQuote: "Just stay in your lane. Don't overthink it. (pause) Sorry.", specialBehavior: null, personalBest: "1:02.44" },
    { name: "the face from the dream", origin: "emerged from REM sleep, origin unknown", coachQuote: "We don't talk about what happened at regionals.", specialBehavior: null, personalBest: "0:58.11" },
    { name: "that embarrassing thing from 2009", origin: "resurfaces every 3-5 business days", coachQuote: "Last time we just... let it go. We won't be doing that again.", specialBehavior: "embarrassing", personalBest: "DQ (multiple false starts)" },
    { name: "the email you haven't replied to", origin: "first appeared: 14 days ago, inbox, unread", coachQuote: "It's not about the email. It's about what the email represents.", specialBehavior: "avoiding", personalBest: "1:14.88" },
    { name: "whether you left the oven on", origin: "domestic anxiety cluster, recurring", coachQuote: "We've been here before. We know how this ends.", specialBehavior: null, personalBest: "0:55.22" },
    { name: "a song you can't identify", origin: "auditory cortex, Tuesday afternoon", coachQuote: "Hum it. Just hum it. No one is watching.", specialBehavior: null, personalBest: "1:08.77" },
    { name: "what you should have said", origin: "post-conversation cortex, 2019-present", coachQuote: "The time for that was then. This is now. Different pool.", specialBehavior: null, personalBest: "1:01.33" },
    { name: "whether any of this matters", origin: "existential background process, always running", coachQuote: "...", specialBehavior: null, personalBest: "0:49.99" },
    { name: "the thing you almost remembered", origin: "tip-of-tongue region, sporadic", coachQuote: "Don't reach for it. Let it come to you.", specialBehavior: null, personalBest: "1:19.04" },
    { name: "if that person likes you back", origin: "prefrontal cortex, hopeful sector", coachQuote: "We train for the possibility. Not the certainty.", specialBehavior: null, personalBest: "1:05.66" },
  ];

  const [thoughts, setThoughts] = useState(defaultThoughts.slice(0, 4));
  const [inputValue, setInputValue] = useState('');
  const [racePhase, setRacePhase] = useState('seeding');
  const [raceProgress, setRaceProgress] = useState(0);
  const [commentaryLog, setCommentaryLog] = useState([]);
  const [heatBracket, setHeatBracket] = useState([]);
  const [scoreboard, setScoreboard] = useState([]);
  const [malfunctionDigit, setMalfunctionDigit] = useState(2);
  const [firstPlace, setFirstPlace] = useState(0);
  const [pdfStatus, setPdfStatus] = useState('idle');
  const [falseStartActive, setFalseStartActive] = useState(false);
  const [falseStartThought, setFalseStartThought] = useState('');
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [scratchedThought, setScratchedThought] = useState('');
  const [glitchChar, setGlitchChar] = useState('8');

  const raceIntervalRef = useRef(null);
  const malfunctionIntervalRef = useRef(null);
  const firstPlaceIntervalRef = useRef(null);
  const firstPlaceCounter = useRef(0);
  const progressRef = useRef(0);
  const scratchedRef = useRef(false);

  const seededRandom = (seed) => {
    let x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  };

  const generateSplitTimes = (thoughtName) => {
    const seed = thoughtName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const base = 25 + seededRandom(seed) * 15;
    return [
      (base * 0.48 + seededRandom(seed + 1) * 2).toFixed(2),
      (base * 0.52 + seededRandom(seed + 2) * 2).toFixed(2),
      (base * 0.50 + seededRandom(seed + 3) * 2).toFixed(2),
      (base * 0.54 + seededRandom(seed + 4) * 2).toFixed(2),
    ];
  };

  const generateFinalTime = (thoughtName) => {
    const seed = thoughtName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const mins = 0;
    const secs = (50 + seededRandom(seed) * 30).toFixed(2);
    return parseFloat(secs);
  };

  const assignHeat = useCallback(() => {
    const pool = [...thoughts];
    while (pool.length < 8) {
      const extra = defaultThoughts[pool.length % defaultThoughts.length];
      if (!pool.find(t => t.name === extra.name)) pool.push(extra);
      else pool.push({ ...defaultThoughts[(pool.length + 3) % defaultThoughts.length], name: defaultThoughts[(pool.length + 3) % defaultThoughts.length].name + ' (again)' });
    }
    const heat = pool.slice(0, 8).map((t, i) => ({
      ...t,
      lane: i + 1,
      splits: generateSplitTimes(t.name),
      finalTime: generateFinalTime(t.name),
    }));
    setHeatBracket(heat);
    return heat;
  }, [thoughts]);

  const startRace = useCallback(() => {
    const heat = assignHeat();
    scratchedRef.current = false;
    setScratchedThought('');
    setFalseStartActive(false);
    setCommentaryLog([]);
    setRaceProgress(0);
    progressRef.current = 0;

    const embarrassingThought = heat.find(t => t.specialBehavior === 'embarrassing');
    const avoidingThought = heat.find(t => t.specialBehavior === 'avoiding');

    if (embarrassingThought) {
      setFalseStartThought(embarrassingThought.name);
    }

    setRacePhase('starting');

    setTimeout(() => {
      setCommentaryLog(['[OFFICIAL STARTER]: Swimmers, take your marks.']);
      setTimeout(() => {
        if (embarrassingThought) {
          setFalseStartActive(true);
          setCommentaryLog(prev => [...prev,
            `[STARTER]: FALSE START — Lane ${embarrassingThought.lane} — "${embarrassingThought.name}" — DISQUALIFIED from this heat.`,
            '[COMMENTARY]: And there it is. We all knew. We all knew.'
          ]);
          setTimeout(() => {
            setFalseStartActive(false);
            setCommentaryLog(prev => [...prev, '[STARTER]: Remaining swimmers, take your marks...', '[PISTOL]: BANG']);
            beginRace(heat, avoidingThought);
          }, 2000);
        } else {
          setCommentaryLog(prev => [...prev, '[PISTOL]: BANG']);
          beginRace(heat, avoidingThought);
        }
      }, 1500);
    }, 500);
  }, [assignHeat]);

  const beginRace = (heat, avoidingThought) => {
    setRacePhase('racing');
    progressRef.current = 0;
    setRaceProgress(0);

    raceIntervalRef.current = setInterval(() => {
      progressRef.current += 2;
      setRaceProgress(progressRef.current);

      if (progressRef.current >= 100) {
        clearInterval(raceIntervalRef.current);
        const finalHeat = heat.filter(t => t.specialBehavior !== 'embarrassing');
        const sorted = [...finalHeat]
          .sort((a, b) => a.finalTime - b.finalTime)
          .map((t, i) => ({ ...t, place: i + 1 }));
        setScoreboard(sorted);
        setFirstPlace(0);
        firstPlaceCounter.current = 0;
        setTimeout(() => setRacePhase('results'), 500);
      }
    }, 80);

    if (avoidingThought) {
      setTimeout(() => {
        if (!scratchedRef.current) {
          scratchedRef.current = true;
          setScratchedThought(avoidingThought.name);
          setCommentaryLog(prev => [...prev,
            `[BREAKING]: "${avoidingThought.name}" has SCRATCHED from the race.`,
            '[MEDICAL REPORT]: Cited a recurring hamstring issue. Qualifies for finals but will not compete today.',
            '[COMMENTARY]: Sources close to the thought confirm this has happened before. No one is surprised. Everyone is a little relieved.'
          ]);
        }
      }, 4800);
    }
  };

  useEffect(() => {
    const thresholds = {
      10: ["[COMMENTARY]: And they're off! The water is churning with cognitive activity!"],
      25: ["[COMMENTARY]: At the 25-meter mark — several thoughts are neck and neck. The fridge noise is showing remarkable form.", "[SPLIT CLOCK]: Intermediate times posting now."],
      50: ["[COMMENTARY]: HALFWAY. The crowd is on their feet. Or they would be, if thoughts had crowds.", "[COMMENTARY]: The dream face is pulling ahead. Classic."],
      75: ["[COMMENTARY]: Final stretch! You can see the effort. You can FEEL the effort. That's what cognition looks like, folks."],
      90: ["[COMMENTARY]: Nearly there — this is going to be CLOSE —", "[COMMENTARY]: The email — THE EMAIL — is making a move —"],
      100: ["[COMMENTARY]: AND THAT'S THE FINISH!", "[COMMENTARY]: What a race. What a race. The times will be posted momentarily."],
    };

    Object.entries(thresholds).forEach(([threshold, lines]) => {
      if (raceProgress === parseInt(threshold)) {
        setCommentaryLog(prev => [...prev, ...lines]);
      }
    });
  }, [raceProgress]);

  useEffect(() => {
    if (racePhase === 'results') {
      malfunctionIntervalRef.current = setInterval(() => {
        const chars = '0123456789E ';
        setGlitchChar(chars[Math.floor(Math.random() * chars.length)]);
        setMalfunctionDigit(Math.floor(Math.random() * 6));
      }, 300);

      setTimeout(() => {
        setRacePhase('podium');
      }, 4000);
    } else {
      clearInterval(malfunctionIntervalRef.current);
    }
    return () => clearInterval(malfunctionIntervalRef.current);
  }, [racePhase]);

  useEffect(() => {
    if (racePhase === 'podium' && scoreboard.length > 0) {
      firstPlaceIntervalRef.current = setInterval(() => {
        firstPlaceCounter.current = (firstPlaceCounter.current + 1) % scoreboard.length;
        setFirstPlace(firstPlaceCounter.current);
      }, 3000);
    } else {
      clearInterval(firstPlaceIntervalRef.current);
    }
    return () => clearInterval(firstPlaceIntervalRef.current);
  }, [racePhase, scoreboard]);

  const addThought = () => {
    if (!inputValue.trim()) return;
    const newThought = {
      name: inputValue.trim(),
      origin: `entered manually, ${new Date().getFullYear()}`,
      coachQuote: "You showed up. That's more than most thoughts do.",
      specialBehavior: null,
      personalBest: `1:${(Math.random() * 30 + 10).toFixed(2)}`,
    };
    setThoughts(prev => [...prev.filter(t => t.name !== newThought.name), newThought]);
    setInputValue('');
    setRacePhase('seeding');
  };

  const addRandomThought = () => {
    const unused = defaultThoughts.filter(t => !thoughts.find(th => th.name === t.name));
    if (unused.length > 0) {
      const pick = unused[Math.floor(Math.random() * unused.length)];
      setThoughts(prev => [...prev, pick]);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toFixed(2).padStart(5, '0');
    return `${m}:${s}`;
  };

  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const medalLabels = ['GOLD', 'SILVER', 'BRONZE'];

  const glitchDigits = (timeStr, lane) => {
    if (lane === malfunctionDigit) {
      const arr = timeStr.split('');
      const idx = Math.floor(Math.random() * arr.length);
      arr[idx] = glitchChar;
      return arr.join('');
    }
    return timeStr;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1a2e 40%, #061018 100%)',
      color: '#e8f4f8',
      fontFamily: '"Courier New", Courier, monospace',
      padding: '0',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 1; }
          50% { opacity: 0.2; }
          55% { opacity: 1; }
          70% { opacity: 0.8; }
          75% { opacity: 0.1; }
          80% { opacity: 1; }
        }
        @keyframes laneSwim {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(0px); }
        }
        @keyframes progressPulse {
          0%, 100% { box-shadow: 0 0 4px #00e5ff; }
          50% { box-shadow: 0 0 12px #00e5ff, 0 0 20px #00e5ff44; }
        }
        @keyframes commentaryScroll {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes podiumRise {
          from { transform: scaleY(0); transform-origin: bottom; }
          to { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes medalSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes glitch {
          0%, 100% { color: #ff3333; text-shadow: 0 0 8px #ff3333; }
          25% { color: #ff9900; text-shadow: 0 0 4px #ff9900; }
          50% { color: #ffffff; }
          75% { color: #ff3333; text-shadow: 2px 0 #00ffff; }
        }
        @keyframes waveAnim {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes firstPlaceShift {
          0% { opacity: 1; }
          45% { opacity: 1; }
          50% { opacity: 0; }
          55% { opacity: 1; }
        }
        @keyframes scanline {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #001a2e 0%, #003355 50%, #001a2e 100%)',
        borderBottom: '3px solid #00b4d8',
        padding: '16px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(0,180,216,0.04) 18px, rgba(0,180,216,0.04) 19px)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#00b4d8', marginBottom: '4px' }}>
              OFFICIAL RESULTS — COGNITIVE ATHLETICS FEDERATION
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#ffffff' }}>
              SWIM MEET RESULTS: YOUR THOUGHTS
            </div>
            <div style={{ fontSize: '11px', color: '#7ecfdf', marginTop: '4px', letterSpacing: '1px' }}>
              HEAT 1 · INDOOR 50M · CHLORINE SMELL: OPTIONAL
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#7ecfdf', letterSpacing: '2px' }}>EVENT DATE</div>
            <div style={{ fontSize: '13px', color: '#fff' }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</div>
            <div style={{
              marginTop: '4px',
              fontSize: '11px',
              padding: '2px 8px',
              border: '1px solid #00b4d8',
              color: '#00b4d8',
              display: 'inline-block',
              animation: 'flicker 4s infinite',
            }}>
              ● LIVE
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Seeding Section */}
        <div style={{
          background: 'rgba(0,40,70,0.7)',
          border: '1px solid #00b4d8',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#00b4d8', marginBottom: '12px' }}>
            ATHLETE SEEDING — HEAT REGISTRATION
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addThought()}
              placeholder="Enter a thought to compete..."
              style={{
                flex: 1,
                minWidth: '200px',
                background: 'rgba(0,20,40,0.9)',
                border: '1px solid #00b4d8',
                color: '#e8f4f8',
                padding: '8px 12px',
                fontFamily: '"Courier New", monospace',
                fontSize: '13px',
                outline: 'none',
                borderRadius: '2px',
              }}
            />
            <button onClick={addThought} style={{
              background: '#003355',
              border: '1px solid #00b4d8',
              color: '#00e5ff',
              padding: '8px 16px',
              fontFamily: '"Courier New", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              letterSpacing: '1px',
              borderRadius: '2px',
            }}>REGISTER THOUGHT</button>
            <button onClick={addRandomThought} style={{
              background: 'rgba(0,20,40,0.5)',
              border: '1px solid #445566',
              color: '#7ecfdf',
              padding: '8px 16px',
              fontFamily: '"Courier New", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              letterSpacing: '1px',
              borderRadius: '2px',
            }}>+ RANDOM THOUGHT</button>
          </div>

          {/* Registered Thoughts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {thoughts.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(0,60,100,0.6)',
                border: `1px solid ${t.specialBehavior === 'embarrassing' ? '#ff6644' : t.specialBehavior === 'avoiding' ? '#ffaa00' : '#336688'}`,
                padding: '4px 10px',
                fontSize: '11px',
                color: t.specialBehavior === 'embarrassing' ? '#ff9977' : t.specialBehavior === 'avoiding' ? '#ffcc66' : '#aaccdd',
                borderRadius: '2px',
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                title: t.name,
              }}>
                {t.specialBehavior === 'embarrassing' && '⚠ '}
                {t.specialBehavior === 'avoiding' && '◈ '}
                {t.name}
              </div>
            ))}
          </div>

          <button
            onClick={startRace}
            disabled={racePhase === 'racing' || racePhase === 'starting'}
            style={{
              background: racePhase === 'racing' || racePhase === 'starting' ? 'rgba(0,30,50,0.5)' : 'linear-gradient(90deg, #003366, #005588)',
              border: `2px solid ${racePhase === 'racing' || racePhase === 'starting' ? '#334' : '#00e5ff'}`,
              color: racePhase === 'racing' || racePhase === 'starting' ? '#446' : '#00e5ff',
              padding: '10px 24px',
              fontFamily: '"Courier New", monospace',
              fontSize: '13px',
              cursor: racePhase === 'racing' || racePhase === 'starting' ? 'not-allowed' : 'pointer',
              letterSpacing: '2px',
              fontWeight: 'bold',
              borderRadius: '2px',
              transition: 'all 0.2s',
            }}>
            {racePhase === 'starting' ? '▶ STARTING...' : racePhase === 'racing' ? '▶ RACE IN PROGRESS' : '▶ START HEAT 1'}
          </button>
        </div>

        {/* Heat Bracket */}
        {heatBracket.length > 0 && (
          <div style={{
            background: 'rgba(0,30,55,0.8)',
            border: '1px solid #336688',
            borderRadius: '4px',
            marginBottom: '16px',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'rgba(0,50,90,0.8)',
              padding: '10px 16px',
              fontSize: '11px',
              letterSpacing: '3px',
              color: '#00b4d8',
              borderBottom: '1px solid #336688',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>LANE ASSIGNMENTS — HEAT 1</span>
              <span style={{ color: '#7ecfdf', fontSize: '10px' }}>HOVER LANE FOR COACH QUOTE</span>
            </div>

            {/* Pool visual */}
            <div style={{ position: 'relative', padding: '0', overflow: 'hidden' }}>
              {racePhase === 'racing' && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: `linear-gradient(90deg, rgba(0,180,216,0.05) 0%, rgba(0,180,216,0.12) ${raceProgress}%, transparent ${raceProgress}%)`,
                  transition: 'background 0.3s',
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />
              )}

              {heatBracket.map((t, i) => {
                const isScratched = t.name === scratchedThought;
                const isEmbarrassing = t.specialBehavior === 'embarrassing';
                const isDQ = isEmbarrassing && falseStartActive;
                const laneColors = ['#00b4d8', '#ffd700', '#00b4d8', '#ffd700', '#00b4d8', '#ffd700', '#00b4d8', '#ffd700'];

                return (
                  <div
                    key={i}
                    onMouseEnter={e => setTooltip({ visible: true, text: `Coach: "${t.coachQuote}"`, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip({ visible: false, text: '', x: 0, y: 0 })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid rgba(0,100,160,0.3)',
                      borderLeft: `4px solid ${laneColors[i]}`,
                      background: isScratched ? 'rgba(80,40,0,0.3)' : isDQ ? 'rgba(100,0,0,0.3)' : i % 2 === 0 ? 'rgba(0,20,40,0.4)' : 'rgba(0,30,55,0.4)',
                      opacity: isScratched || isDQ ? 0.6 : 1,
                      cursor: 'default',
                      transition: 'background 0.3s',
                      position: 'relative',
                      zIndex: 2,
                    }}>
                    <div style={{ width: '28px', fontSize: '14px', fontWeight: 'bold', color: laneColors[i] }}>
                      {t.lane}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '12px',
                        color: isDQ ? '#ff6644' : isScratched ? '#ffaa44' : '#e8f4f8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {isDQ ? '⚠ [FALSE START] ' : isScratched ? '◈ [SCRATCHED] ' : ''}
                        {t.name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#556677', marginTop: '2px' }}>
                        {t.origin}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#7ecfdf' }}>PB</div>
                      <div style={{ fontSize: '12px', color: '#aaccdd' }}>{t.personalBest}</div>
                    </div>

                    {/* Race progress indicator */}
                    {racePhase === 'racing' && !isScratched && !isDQ && (
                      <div style={{
                        position: 'absolute',
                        left: `${4 + raceProgress * 0.9}%`,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '16px',
                        zIndex: 3,
                        filter: 'drop-shadow(0 0 4px #00e5ff)',
                        animation: 'laneSwim 0.5s ease-in-out infinite alternate',
                        transition: 'left 0.08s linear',
                        pointerEvents: 'none',
                      }}>
                        🏊
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Race progress bar */}
            {(racePhase === 'racing' || racePhase === 'starting') && (
              <div style={{ padding: '10px 12px', borderTop: '1px solid #336688', background: 'rgba(0,10,20,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#7ecfdf', marginBottom: '4px' }}>
                  <span>START</span>
                  <span>{raceProgress}m / 100m</span>
                  <span>FINISH</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,40,70,0.8)', border: '1px solid #336688', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${raceProgress}%`,
                    background: 'linear-gradient(90deg, #0066aa, #00e5ff)',
                    transition: 'width 0.08s linear',
                    animation: 'progressPulse 1s ease-in-out infinite',
                    borderRadius: '4px',
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Commentary */}
        {commentaryLog.length > 0 && (
          <div style={{
            background: 'rgba(0,10,20,0.9)',
            border: '1px solid #223344',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px',
            maxHeight: '180px',
            overflowY: 'auto',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#556677', marginBottom: '8px' }}>
              LIVE COMMENTARY TRANSCRIPT
            </div>
            {commentaryLog.map((line, i) => (
              <div key={i} style={{
                fontSize: '11px',
                color: line.startsWith('[COMMENTARY]') ? '#aaccdd' :
                  line.startsWith('[STARTER]') || line.startsWith('[OFFICIAL') ? '#ffdd88' :
                    line.startsWith('[PISTOL]') ? '#ff8888' :
                      line.startsWith('[BREAKING]') ? '#ffaa44' :
                        line.startsWith('[MEDICAL]') ? '#cc8844' : '#7ecfdf',
                marginBottom: '3px',
                animation: 'commentaryScroll 0.3s ease-out',
                lineHeight: '1.4',
              }}>
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Scoreboard */}
        {(racePhase === 'results' || racePhase === 'podium') && scoreboard.length > 0 && (
          <div style={{
            background: 'rgba(0,10,25,0.95)',
            border: '2px solid #00b4d8',
            borderRadius: '4px',
            marginBottom: '16px',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #001a2e, #003355, #001a2e)',
              padding: '12px 16px',
              fontSize: '13px',
              letterSpacing: '3px',
              color: '#00e5ff',
              borderBottom: '2px solid #00b4d8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>OFFICIAL RESULTS — HEAT 1 — FINAL</span>
              <span style={{ animation: 'flicker 2s infinite', color: '#ff4444', fontSize: '11px' }}>⚠ SCOREBOARD ERROR ON LANE {malfunctionDigit + 1}</span>
            </div>

            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 40px 1fr 90px 90px 90px',
              padding: '6px 12px',
              fontSize: '10px',
              letterSpacing: '2px',
              color: '#556677',
              borderBottom: '1px solid #223344',
              gap: '4px',
            }}>
              <span>PL</span>
              <span>LN</span>
              <span>THOUGHT</span>
              <span style={{ textAlign: 'right' }}>50M SPLIT</span>
              <span style={{ textAlign: 'right' }}>FINAL TIME</span>
              <span style={{ textAlign: 'right' }}>POINTS</span>
            </div>

            {scoreboard.map((t, i) => {
              const timeStr = formatTime(t.finalTime);
              const isGlitch = i === malfunctionDigit;
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 40px 1fr 90px 90px 90px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(0,60,100,0.3)',
                  background: i === 0 ? 'rgba(40,30,0,0.4)' : i === 1 ? 'rgba(20,20,20,0.3)' : i === 2 ? 'rgba(30,15,0,0.3)' : 'transparent',
                  gap: '4px',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#556677',
                  }}>{t.place}</span>
                  <span style={{ fontSize: '12px', color: '#7ecfdf' }}>{t.lane}</span>
                  <span style={{
                    fontSize: '11px',
                    color: '#e8f4f8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{t.name}</span>
                  <span style={{
                    fontSize: '12px',
                    textAlign: 'right',
                    color: '#aaccdd',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{t.splits ? t.splits[1] : '--'}</span>
                  <span style={{
                    fontSize: '13px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    fontVariantNumeric: 'tabular-nums',
                    animation: isGlitch ? 'glitch 0.3s infinite' : 'none',
                    color: isGlitch ? '#ff3333' : i === 0 ? '#ffd700' : '#e8f4f8',
                  }}>
                    {isGlitch ? glitchDigits(timeStr, i) : timeStr}
                  </span>
                  <span style={{ fontSize: '12px', textAlign: 'right', color: '#7ecfdf' }}>
                    {(scoreboard.length - i) * 10}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Podium */}
        {racePhase === 'podium' && scoreboard.length >= 3 && (
          <div style={{
            background: 'rgba(0,15,30,0.95)',
            border: '2px solid #ffd700',
            borderRadius: '4px',
            padding: '20px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#ffd700', marginBottom: '16px' }}>
              ★ MEDAL CEREMONY — HEAT 1 ★
            </div>

            {/* Podium graphic */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4px', marginBottom: '20px', height: '120px' }}>
              {/* Silver (2nd) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px', animation: 'medalSpin 3s ease-in-out infinite', display: 'inline-block' }}>🥈</div>
                <div style={{ fontSize: '10px', color: '#c0c0c0', marginBottom: '4px', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {scoreboard[1]?.name}
                </div>
                <div style={{
                  height: '70px',
                  width: '100%',
                  background: 'linear-gradient(180deg, #888 0%, #555 100%)',
                  border: '1px solid #c0c0c0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#fff',
                  animation: 'podiumRise 0.8s ease-out 0.2s both',
                }}>2</div>
              </div>

              {/* Gold (1st) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
                <div style={{ fontSize: '26px', marginBottom: '4px', animation: 'medalSpin 2s ease-in-out infinite' }}>🥇</div>
                <div style={{
                  fontSize: '11px',
                  color: '#ffd700',
                  marginBottom: '4px',
                  maxWidth: '130px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  animation: 'firstPlaceShift 3s infinite',
                }}>
                  {scoreboard[firstPlace]?.name || scoreboard[0]?.name}
                </div>
                <div style={{
                  height: '90px',
                  width: '100%',
                  background: 'linear-gradient(180deg, #cc9900 0%, #996600 100%)',
                  border: '1px solid #ffd700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#fff',
                  animation: 'podiumRise 0.8s ease-out both',
                  boxShadow: '0 0 20px rgba(255,215,0,0.3)',
                }}>1</div>
              </div>

              {/* Bronze (3rd) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
                <div style={{ fontSize: '20px', marginBottom: '4px', animation: 'medalSpin 4s ease-in-out infinite' }}>🥉</div>
                <div style={{ fontSize: '10px', color: '#cd7f32', marginBottom: '4px', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {scoreboard[2]?.name}
                </div>
                <div style={{
                  height: '55px',
                  width: '100%',
                  background: 'linear-gradient(180deg, #996633 0%, #664422 100%)',
                  border: '1px solid #cd7f32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#fff',
                  animation: 'podiumRise 0.8s ease-out 0.4s both',
                }}>3</div>
              </div>
            </div>

            {/* Anthem */}
            <div style={{
              fontSize: '11px',
              color: '#7ecfdf',
              fontStyle: 'italic',
              background: 'rgba(0,30,50,0.5)',
              border: '1px solid #336688',
              borderRadius: '2px',
              padding: '10px 16px',
              marginBottom: '16px',
              lineHeight: '1.6',
            }}>
              *(The anthem plays now. It is not a national anthem, exactly. It is something older — a frequency you almost recognize. The crowd is silent, which may mean the crowd is moved, or may mean there is no crowd. The thought in first place stares at the middle distance. It has been here before. It will be here again.)*
            </div>

            {/* First place note */}
            <div style={{
              fontSize: '10px',
              color: '#445566',
              marginBottom: '16px',
            }}>
              * The athlete in first place is determined at time of viewing. Results may vary. Do not look away.
            </div>

            {/* PDF Button */}
            <button
              onClick={() => setPdfStatus('generating')}
              style={{
                background: 'rgba(0,20,40,0.8)',
                border: `1px solid ${pdfStatus === 'generating' ? '#ffd700' : '#336688'}`,
                color: pdfStatus === 'generating' ? '#ffd700' : '#7ecfdf',
                padding: '10px 24px',
                fontFamily: '"Courier New", monospace',
                fontSize: '12px',
                cursor: pdfStatus === 'generating' ? 'not-allowed' : 'pointer',
                letterSpacing: '2px',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
              }}>
              {pdfStatus === 'generating' ? (
                <>
                  <span style={{ animation: 'flicker 0.5s infinite' }}>⟳</span>
                  GENERATING...
                </>
              ) : '⬇ DOWNLOAD OFFICIAL RESULTS PDF'}
            </button>
            {pdfStatus === 'generating' && (
              <div style={{ fontSize: '10px', color: '#445566', marginTop: '6px' }}>
                Please wait. Estimated completion: always.
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '10px',
          color: '#445566',
          borderTop: '1px solid #223344',
          paddingTop: '12px',
          marginTop: '4px',
        }}>
          <span>⚠ = EMBARRASSING THOUGHT (false start guaranteed)</span>
          <span>◈ = THOUGHT BEING AVOIDED (will scratch)</span>
          <span>* = SCOREBOARD ERROR: NOT OUR FAULT</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 12,
          top: tooltip.y - 40,
          background: 'rgba(0,20,40,0.97)',
          border: '1px solid #00b4d8',
          padding: '8px 12px',
          fontSize: '11px',
          color: '#aaccdd',
          maxWidth: '280px',
          zIndex: 1000,
          borderRadius: '2px',
          pointerEvents: 'none',
          fontStyle: 'italic',
          lineHeight: '1.4',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}