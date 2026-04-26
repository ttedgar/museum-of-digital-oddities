import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const correspondents = [
    {
      name: "DANA KRELL",
      location: "OUTSIDE 14 ELM STREET",
      sublocation: "RESIDENTIAL ZONE, UNINCORPORATED MOMENT",
      nonEvent: "Furniture Not Rearranged",
      description: "Eleven minutes ago, a resident of this home stood in the living room and considered moving the couch. They did not move the couch. The couch remains where it was. We are monitoring the situation.",
      quote: "I've been standing here for forty minutes and I can confirm: nothing about this house has changed. The blinds are still at half-mast. There is a car in the driveway. It has been there the whole time.",
      bgColor: "#1a2a1a",
      bgAccent: "#2d3d2d",
      timeAgo: "11 MIN AGO",
      updateLine: "COUCH POSITION UNCHANGED. SOURCES CONFIRM CUSHIONS UNDISTURBED.",
    },
    {
      name: "BRETT HOLLIS",
      location: "KITCHEN INTERIOR, THIRD FLOOR",
      sublocation: "REFRIGERATOR SECTOR, APARTMENT 4B",
      nonEvent: "Refrigerator Opened and Closed",
      description: "At 2:14 PM, a refrigerator was opened. The individual stared into it for approximately four seconds. Nothing was taken. The door was closed. We are awaiting further developments.",
      quote: "The cold air was released. That much we know. Whether it was the leftover pasta or the vague sense of wanting something that couldn't be named — we may never know. We are working our sources.",
      bgColor: "#1a1a2a",
      bgAccent: "#2a2a3d",
      timeAgo: "23 MIN AGO",
      updateLine: "REFRIGERATOR DOOR REMAINS CLOSED. INTERIOR TEMPERATURE: STABLE. HUNGER: UNRESOLVED.",
    },
    {
      name: "PRIYA OKONKWO",
      location: "PARK BENCH, SECTOR 7",
      sublocation: "DOG OBSERVATION POST, RIVERSIDE",
      nonEvent: "Dog Looked Up Then Looked Down",
      description: "A medium-sized dog of indeterminate breed raised its head at approximately 3:07 PM. It appeared to perceive something. It then lowered its head. The dog has not moved significantly since.",
      quote: "The dog's ears — and I want to be very careful here — the dog's ears did perk. Briefly. We have footage. We are having it enhanced. Whether this constitutes awareness of an event is something our experts are actively debating.",
      bgColor: "#2a1a1a",
      bgAccent: "#3d2a2a",
      timeAgo: "7 MIN AGO",
      updateLine: "DOG NOW ASLEEP. PREVIOUS ALERTNESS UNCONFIRMED. TAIL: STATIONARY.",
    },
    {
      name: "MARCUS VEIL",
      location: "DIGITAL DESK, REMOTE",
      sublocation: "EMAIL MONITORING UNIT",
      nonEvent: "Pause Before Reply Email",
      description: "An email was drafted. The sender paused for fourteen seconds before clicking send. The email read 'Sounds good, thanks!' The pause has not been explained. We have reached out for comment.",
      quote: "Fourteen seconds. That's not nothing. That's not something either. That's exactly what we're looking at here. The ellipsis appeared. The ellipsis disappeared. 'Sounds good thanks' does not tell the whole story.",
      bgColor: "#1a1a1a",
      bgAccent: "#2d2d2d",
      timeAgo: "34 MIN AGO",
      updateLine: "'SOUNDS GOOD THANKS' EMAIL RECEIVED. EXCLAMATION POINT USAGE: BEING ANALYZED.",
    },
    {
      name: "SASHA TRENT",
      location: "BEDROOM WINDOW, NORTH FACING",
      sublocation: "THOUGHT MONITORING BUREAU",
      nonEvent: "Thought Had and Released",
      description: "At an unspecified time, a thought occurred to a subject in this building. The thought was, by all accounts, neither pursued nor dismissed with particular force. It simply concluded. We are on the ground.",
      quote: "The subject described it later as 'just one of those things.' We are not prepared to accept that characterization at this time. We have a panel standing by.",
      bgColor: "#1a1a2a",
      bgAccent: "#252535",
      timeAgo: "52 MIN AGO",
      updateLine: "THOUGHT GONE. NO FOLLOW-UP THOUGHTS CONFIRMED. COGNITIVE SITUATION: AMBIENT.",
    },
  ];

  const experts = [
    { name: "DR. ALAN MORSE", title: "Senior Non-Event Analyst", affiliation: "Institute for Uneventful Studies" },
    { name: "CAROL FINCH", title: "Former Moment Correspondent", affiliation: "Retired, Available" },
    { name: "PROF. JAMES BEEL", title: "Chair of Ambient Situations", affiliation: "University of Nothing Happening" },
    { name: "WENDY CROSS", title: "Threat Level Consultant", affiliation: "AMBIENT Advisory Group" },
  ];

  const expertQuotes = [
    [
      "What we're seeing here is a non-event with significant non-implications. The fact that nothing is escalating is itself a form of escalation we haven't seen since last Tuesday, when also nothing happened.",
      "I've been tracking these situations for twenty years. The couch not moving is consistent with patterns we observed in 2019, 2021, and again in March of this year.",
      "My concern — and I want to be clear this is a concern — is the sustained nature of the ambient. We are in minute eleven. At minute twelve, we may be in different territory.",
      "The refrigerator event is what keeps me up at night. Not the opening. Not the closing. The four seconds in between. That's where the real nothing is.",
    ],
    [
      "I've reported from twelve non-events and I've never seen a couch stay this still for this long. Something is not happening here and it is not happening loudly.",
      "The dog's behavior is consistent with being a dog. But in this context? That's a story.",
      "When I covered the Great Email Pause of 2022, we thought we'd seen the ceiling on nothing. We were wrong. This is a new kind of nothing.",
      "Ambient is a level we invented because we needed a word for 'completely fine but we needed to fill airtime.' I stand by that level completely.",
    ],
    [
      "The pause before the email is pedagogically significant. In my research, subjects pause an average of 3.2 seconds. Fourteen seconds is — and I want to be careful — also fine.",
      "What the thought represents, cognitively, is the entire spectrum of human interior experience. It had and it released. That is the whole thing. We are covering the whole thing.",
      "I think what viewers at home need to understand is that AMBIENT is not a low threat level. It is the correct threat level. The situation is accurately AMBIENT.",
      "Nothing continuing to happen is, statistically, what usually happens. We should not lose sight of that even as we continue to cover this with our full resources.",
    ],
    [
      "We have seventeen correspondents deployed. The budget for this non-event coverage is, I'm told, substantial. We are committed to seeing this nothing through to its conclusion.",
      "My threat assessment: the moment is stable. The moment was always stable. The moment will continue to be stable. We will be here when it isn't.",
      "I want to push back slightly on the characterization of 'fine.' I think what we're looking at is 'fine-adjacent.' There's a distinction. It's subtle. It matters.",
      "The dog looked up. The dog looked down. I have given a TED talk about this specific sequence of events. I would give another one right now if asked.",
    ],
  ];

  const chyronMessages = [
    "SOURCES CONFIRM: MOMENT CONTINUES • STILL NO ESCALATION • FEELING DESCRIBED AS FINE",
    "BREAKING: COUCH HAS NOT MOVED IN OVER ELEVEN MINUTES • CUSHION INTEGRITY INTACT • NO COMMENT FROM RESIDENT",
    "DEVELOPING: REFRIGERATOR DOOR CLOSED NORMALLY • INTERIOR CONTENTS UNDISTURBED • HUNGER STATUS UNCLEAR",
    "UPDATE: EMAIL SENT • FOURTEEN-SECOND PAUSE UNDER INVESTIGATION • RECIPIENT SAYS 'THANKS'",
    "EXPERTS WARN: NOTHING MAY CONTINUE TO NOT HAPPEN • PANEL CONVENES • FINDINGS EXPECTED TO BE UNREMARKABLE",
    "THREAT LEVEL REMAINS: AMBIENT • AUTHORITIES DESCRIBE SITUATION AS 'BASICALLY FINE' • CITIZENS ADVISED TO CONTINUE",
    "JUST IN: DOG HAS RESUMED NORMAL BREATHING PATTERNS • EARLIER ALERTNESS STILL UNEXPLAINED • SOURCES: 'IT WAS PROBABLY NOTHING'",
    "BREAKING: THOUGHT RELEASED WITHOUT EXAMINATION • SUBJECT MOVED ON • THOUGHT UNAVAILABLE FOR COMMENT",
    "LIVE COVERAGE DAY 1: THE MOMENT • OUR REPORTERS ARE ON THE GROUND • THE GROUND IS UNREMARKABLE",
    "DEVELOPING SITUATION: PERSON STOOD IN ROOM • CONSIDERED OPTIONS • LEFT ROOM • LEFT OPTIONS BEHIND",
    "SOURCES CLOSE TO THE NON-EVENT SAY: 'I MEAN, YEAH' • FULL STATEMENT PENDING • STATEMENT EXPECTED TO BE BRIEF",
    "UPDATE: THE PAUSE BEFORE THE REPLY • FOURTEEN SECONDS • EVERY SECOND ACCOUNTED FOR • NONE SIGNIFICANT",
    "AMBIENT LEVEL ADVISORY: EVERYTHING IS FINE • THIS IS NOT AN ALL-CLEAR • THIS IS JUST A CLEAR",
    "BREAKING: NOTHING DEVELOPED • CONTINUES TO NOT DEVELOP • DEVELOPMENT UNCONFIRMED AND UNLIKELY",
  ];

  const [activeCorrespondent, setActiveCorrespondent] = useState(0);
  const [breakingFlash, setBreakingFlash] = useState(true);
  const [minutesSinceEvent, setMinutesSinceEvent] = useState(11);
  const [panelSpeaker, setPanelSpeaker] = useState(0);
  const [expertQuoteIndex, setExpertQuoteIndex] = useState([0, 0, 0, 0]);
  const [signalGlitch, setSignalGlitch] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [chyronIndex, setChyronIndex] = useState(0);
  const [tickerX, setTickerX] = useState(0);
  const tickerRef = useRef(null);
  const animFrameRef = useRef(null);
  const tickerWidthRef = useRef(0);
  const containerWidthRef = useRef(0);
  const lastTimeRef = useRef(null);

  const fullTickerText = chyronMessages.join("     ◆     ");

  useEffect(() => {
    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      setTickerX(prev => {
        if (tickerRef.current) {
          tickerWidthRef.current = tickerRef.current.scrollWidth;
        }
        const newX = prev - (delta * 0.08);
        if (tickerWidthRef.current > 0 && newX < -tickerWidthRef.current / 2) {
          return 0;
        }
        return newX;
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreakingFlash(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesSinceEvent(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPanelSpeaker(prev => (prev + 1) % experts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 8000 + Math.random() * 15000;
      return setTimeout(() => {
        setSignalGlitch(true);
        setTimeout(() => setSignalGlitch(false), 200 + Math.random() * 300);
        scheduleGlitch();
      }, delay);
    };
    const t = scheduleGlitch();
    return () => clearTimeout(t);
  }, []);

  const handleGoLive = (index) => {
    if (index === activeCorrespondent) return;
    setConnecting(true);
    setTimeout(() => {
      setActiveCorrespondent(index);
      setConnecting(false);
    }, 1200);
  };

  const handleExpertClick = (expertIndex) => {
    setExpertQuoteIndex(prev => {
      const next = [...prev];
      next[expertIndex] = (next[expertIndex] + 1) % expertQuotes[expertIndex].length;
      return next;
    });
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const current = correspondents[activeCorrespondent];

  const styles = `
    @keyframes pulse-red {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes scan-line {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes threat-pulse {
      0%, 100% { filter: drop-shadow(0 0 4px #ff6600); }
      50% { filter: drop-shadow(0 0 12px #ff9900); }
    }
    @keyframes glitch-h {
      0% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      40% { transform: translateX(4px); }
      60% { transform: translateX(-2px); }
      80% { transform: translateX(2px); }
      100% { transform: translateX(0); }
    }
    @keyframes connecting-flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes ambient-glow {
      0%, 100% { box-shadow: 0 0 8px #ff6600aa; }
      50% { box-shadow: 0 0 20px #ff9900cc, 0 0 40px #ff660044; }
    }
    @keyframes noise {
      0% { background-position: 0 0; }
      10% { background-position: -5% -10%; }
      20% { background-position: -15% 5%; }
      30% { background-position: 7% -25%; }
      40% { background-position: 20% 25%; }
      50% { background-position: -25% 10%; }
      60% { background-position: 15% 5%; }
      70% { background-position: 0 15%; }
      80% { background-position: 25% 35%; }
      90% { background-position: -10% 10%; }
      100% { background-position: 0 0; }
    }
  `;

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#0a0d14',
      color: '#ffffff',
      fontFamily: '"Arial Narrow", Arial, sans-serif',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{styles}</style>

      {/* Connecting overlay */}
      {connecting && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#000000',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'connecting-flash 0.3s ease infinite',
        }}>
          <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', letterSpacing: '6px', marginBottom: '16px' }}>
            CONNECTING TO FIELD
          </div>
          <div style={{ color: '#cc0000', fontSize: '14px', letterSpacing: '3px' }}>
            LIVE SIGNAL INCOMING...
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#cc0000',
                animation: `pulse-red 0.6s ease ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Top navigation bar */}
      <div style={{
        background: 'linear-gradient(90deg, #0d0d0d 0%, #1a0000 50%, #0d0d0d 100%)',
        borderBottom: '3px solid #cc0000',
        padding: '0 16px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#cc0000',
            padding: '4px 10px',
            fontWeight: 'bold',
            fontSize: '20px',
            letterSpacing: '3px',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}>
            NNN
          </div>
          <div style={{ color: '#cccccc', fontSize: '11px', letterSpacing: '2px', lineHeight: '1.3' }}>
            <div>NOTHING NEWS</div>
            <div style={{ color: '#888888' }}>NETWORK</div>
          </div>
        </div>

        {/* Center: LIVE BREAKING */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: breakingFlash ? '#cc0000' : '#880000',
            padding: '3px 10px',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            transition: 'background 0.1s',
          }}>
            ● BREAKING
          </div>
          <div style={{ fontSize: '13px', letterSpacing: '1px', color: '#eeeeee' }}>
            LIVE COVERAGE: THE MOMENT
          </div>
        </div>

        {/* Time + signal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '12px', color: '#aaaaaa', letterSpacing: '1px' }}>
            {timeStr} ET
          </div>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
            {[4, 7, 10, 13, 10].map((h, i) => (
              <div key={i} style={{
                width: '3px',
                height: `${h}px`,
                background: i < 4 ? '#00cc44' : '#444444',
                borderRadius: '1px',
              }} />
            ))}
          </div>
          <div style={{ fontSize: '10px', color: '#00cc44', letterSpacing: '1px' }}>LIVE</div>
        </div>
      </div>

      {/* Main content area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Left sidebar — expert panel */}
        <div style={{
          width: '220px',
          background: '#0d1117',
          borderRight: '1px solid #1e2533',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            background: '#1a0000',
            borderBottom: '2px solid #cc0000',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            color: '#cc0000',
          }}>
            ▸ EXPERT ANALYSIS
          </div>

          {experts.map((expert, i) => (
            <div
              key={i}
              onClick={() => handleExpertClick(i)}
              style={{
                padding: '12px',
                borderBottom: '1px solid #1e2533',
                cursor: 'pointer',
                background: panelSpeaker === i ? '#131b2e' : 'transparent',
                transition: 'background 0.3s',
                position: 'relative',
              }}
            >
              {panelSpeaker === i && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: '#cc0000',
                  animation: 'pulse-red 0.8s ease infinite',
                }} />
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px',
              }}>
                {panelSpeaker === i && (
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#cc0000',
                    animation: 'pulse-red 0.8s ease infinite',
                    flexShrink: 0,
                  }} />
                )}
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
                  {expert.name}
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#cc6600', marginBottom: '2px' }}>
                {expert.title}
              </div>
              <div style={{ fontSize: '9px', color: '#666666', marginBottom: '8px' }}>
                {expert.affiliation}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#bbbbbb',
                lineHeight: '1.5',
                fontStyle: 'italic',
                borderLeft: '2px solid #333333',
                paddingLeft: '8px',
              }}>
                "{expertQuotes[i][expertQuoteIndex[i]]}"
              </div>
              <div style={{ marginTop: '6px', fontSize: '9px', color: '#555555' }}>
                [click to hear more]
              </div>
            </div>
          ))}

          {/* Threat Level */}
          <div style={{
            marginTop: 'auto',
            padding: '12px',
            borderTop: '1px solid #1e2533',
          }}>
            <div style={{
              fontSize: '10px',
              color: '#888888',
              letterSpacing: '2px',
              marginBottom: '8px',
              textAlign: 'center',
            }}>
              THREAT LEVEL
            </div>

            <div
              style={{ position: 'relative', cursor: 'help' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <svg width="196" height="110" viewBox="0 0 196 110" style={{ animation: 'threat-pulse 2s ease infinite' }}>
                {/* Background arc */}
                <path d="M 20 100 A 78 78 0 0 1 176 100" fill="none" stroke="#1e2533" strokeWidth="12" strokeLinecap="round" />
                {/* Colored segments */}
                <path d="M 20 100 A 78 78 0 0 1 57 37" fill="none" stroke="#004400" strokeWidth="10" strokeLinecap="round" />
                <path d="M 57 37 A 78 78 0 0 1 98 22" fill="none" stroke="#336600" strokeWidth="10" strokeLinecap="round" />
                <path d="M 98 22 A 78 78 0 0 1 139 37" fill="none" stroke="#ff6600" strokeWidth="12" strokeLinecap="round" />
                <path d="M 139 37 A 78 78 0 0 1 176 100" fill="none" stroke="#880000" strokeWidth="10" strokeLinecap="round" />
                {/* Needle — always pointing to AMBIENT (around 9 o'clock from center) */}
                <line x1="98" y1="100" x2="125" y2="44" stroke="#ff9900" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="98" cy="100" r="6" fill="#ff9900" />
                <circle cx="98" cy="100" r="3" fill="#000000" />
                {/* Labels */}
                <text x="22" y="88" fontSize="7" fill="#004400" fontFamily="Arial" letterSpacing="0.5">NONE</text>
                <text x="42" y="48" fontSize="7" fill="#336600" fontFamily="Arial" letterSpacing="0.5">LOW</text>
                <text x="86" y="18" fontSize="7" fill="#ff6600" fontFamily="Arial" letterSpacing="0.5">AMBIENT</text>
                <text x="144" y="48" fontSize="7" fill="#884400" fontFamily="Arial" letterSpacing="0.5">MILD</text>
                <text x="154" y="88" fontSize="7" fill="#880000" fontFamily="Arial" letterSpacing="0.5">SOME</text>
              </svg>

              <div style={{
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ff9900',
                letterSpacing: '3px',
                marginTop: '-4px',
                animation: 'ambient-glow 2s ease infinite',
              }}>
                AMBIENT
              </div>

              {showTooltip && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0d1117',
                  border: '1px solid #ff6600',
                  padding: '8px 12px',
                  fontSize: '10px',
                  color: '#cccccc',
                  lineHeight: '1.6',
                  width: '180px',
                  textAlign: 'center',
                  zIndex: 200,
                  marginBottom: '4px',
                }}>
                  Situation assessed as: fine.<br />
                  Possibly fine-adjacent.<br />
                  <span style={{ color: '#ff6600' }}>Threat level will not change.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main video feed */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
        }}>

          {/* Simulated video feed */}
          <div style={{
            flex: 1,
            position: 'relative',
            background: `linear-gradient(160deg, ${current.bgColor} 0%, ${current.bgAccent} 50%, ${current.bgColor} 100%)`,
            overflow: 'hidden',
            animation: signalGlitch ? 'glitch-h 0.2s ease' : 'none',
            filter: signalGlitch ? 'hue-rotate(90deg) saturate(3)' : 'none',
            transition: 'filter 0.1s',
          }}>

            {/* Scanlines overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
              pointerEvents: 'none',
              zIndex: 2,
            }} />

            {/* Grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
              zIndex: 3,
            }} />

            {/* Vignette */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
              pointerEvents: 'none',
              zIndex: 4,
            }} />

            {/* Reporter silhouette area */}
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 5,
            }}>
              {/* Abstract reporter figure */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.2)',
                marginBottom: '4px',
              }} />
              <div style={{
                width: '80px',
                height: '90px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px 4px 0 0',
                border: '1px solid rgba(255,255,255,0.1)',
              }} />
            </div>

            {/* Location tag top left */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{
                background: '#cc0000',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#ffffff',
                  animation: 'pulse-red 0.8s ease infinite',
                }} />
                LIVE
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.8)',
                padding: '3px 10px',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#cccccc',
              }}>
                {current.location}
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '2px 10px',
                fontSize: '9px',
                color: '#888888',
                letterSpacing: '1px',
              }}>
                {current.sublocation}
              </div>
            </div>

            {/* Time since non-event */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid #333333',
              padding: '8px 12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '9px', color: '#888888', letterSpacing: '2px', marginBottom: '2px' }}>
                TIME SINCE NON-EVENT
              </div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '2px' }}>
                {minutesSinceEvent}:00
              </div>
              <div style={{ fontSize: '9px', color: '#cc6600', letterSpacing: '1px' }}>
                {current.timeAgo}
              </div>
            </div>

            {/* Signal glitch noise */}
            {signalGlitch && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 2px, transparent 4px)',
                zIndex: 20,
                pointerEvents: 'none',
              }} />
            )}

            {/* Reporter name lower third */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              zIndex: 10,
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #cc0000 0%, #880000 100%)',
                padding: '6px 14px',
                display: 'inline-block',
                marginBottom: '2px',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>
                  {current.name}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginLeft: '12px', letterSpacing: '1px' }}>
                  NNN FIELD CORRESPONDENT
                </span>
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.85)',
                padding: '8px 14px',
                borderLeft: '4px solid #cc0000',
                maxWidth: '100%',
              }}>
                <div style={{ fontSize: '11px', color: '#cc6600', letterSpacing: '2px', marginBottom: '4px' }}>
                  REPORTING ON: {current.nonEvent.toUpperCase()}
                </div>
                <div style={{ fontSize: '12px', color: '#dddddd', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{current.quote}"
                </div>
              </div>

              {/* Update line */}
              <div style={{
                background: '#1a1a00',
                border: '1px solid #666600',
                padding: '4px 12px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <div style={{
                  background: '#cccc00',
                  color: '#000000',
                  padding: '1px 6px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  flexShrink: 0,
                }}>
                  UPDATE
                </div>
                <div style={{ fontSize: '10px', color: '#cccc88', letterSpacing: '0.5px' }}>
                  {current.updateLine}
                </div>
              </div>
            </div>
          </div>

          {/* Description panel */}
          <div style={{
            background: '#0d1117',
            borderTop: '2px solid #cc0000',
            padding: '10px 16px',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                background: '#cc0000',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                SITUATION
              </div>
              <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: '1.7' }}>
                {current.description}
              </div>
            </div>
          </div>

          {/* Correspondent selector bar */}
          <div style={{
            background: '#070a0f',
            borderTop: '1px solid #1e2533',
            padding: '8px 12px',
            display: 'flex',
            gap: '8px',
            flexShrink: 0,
            overflowX: 'auto',
          }}>
            <div style={{
              fontSize: '9px',
              color: '#666666',
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              paddingRight: '8px',
              borderRight: '1px solid #1e2533',
              marginRight: '4px',
            }}>
              GO LIVE
            </div>
            {correspondents.map((c, i) => (
              <div
                key={i}
                onClick={() => handleGoLive(i)}
                style={{
                  background: activeCorrespondent === i ? '#1a0000' : '#0d1117',
                  border: `1px solid ${activeCorrespondent === i ? '#cc0000' : '#1e2533'}`,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  minWidth: '120px',
                  position: 'relative',
                }}
              >
                {activeCorrespondent === i && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#cc0000',
                    animation: 'pulse-red 0.8s ease infinite',
                  }} />
                )}
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: activeCorrespondent === i ? '#ffffff' : '#888888', letterSpacing: '0.5px' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: '9px', color: '#cc6600', letterSpacing: '0.5px' }}>
                  {c.nonEvent}
                </div>
                <div style={{ fontSize: '8px', color: '#555555' }}>
                  {c.timeAgo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar — additional info */}
        <div style={{
          width: '200px',
          background: '#0d1117',
          borderLeft: '1px solid #1e2533',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            background: '#1a0000',
            borderBottom: '2px solid #cc0000',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            color: '#cc0000',
          }}>
            ▸ NON-EVENTS TODAY
          </div>

          {correspondents.map((c, i) => (
            <div
              key={i}
              onClick={() => handleGoLive(i)}
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #1e2533',
                cursor: 'pointer',
                background: activeCorrespondent === i ? '#131b2e' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#dddddd', flex: 1 }}>
                  {c.nonEvent}
                </div>
                {activeCorrespondent === i && (
                  <div style={{
                    background: '#cc0000',
                    padding: '1px 4px',
                    fontSize: '7px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    flexShrink: 0,
                    marginLeft: '4px',
                  }}>
                    LIVE
                  </div>
                )}
              </div>
              <div style={{ fontSize: '9px', color: '#666666', marginBottom: '2px' }}>
                {c.location}
              </div>
              <div style={{ fontSize: '8px', color: '#cc6600' }}>
                {c.timeAgo}
              </div>
            </div>
          ))}

          {/* Status readouts */}
          <div style={{
            marginTop: 'auto',
            padding: '12px',
            borderTop: '1px solid #1e2533',
          }}>
            <div style={{ fontSize: '9px', color: '#555555', letterSpacing: '2px', marginBottom: '8px' }}>
              SITUATION STATUS
            </div>
            {[
              { label: 'ESCALATION', value: 'NONE', color: '#00cc44' },
              { label: 'DEVELOPMENT', value: 'PENDING', color: '#cccc00' },
              { label: 'RESOLUTION', value: 'N/A', color: '#888888' },
              { label: 'NEXT UPDATE', value: 'UNKNOWN', color: '#cc6600' },
              { label: 'OVERALL', value: 'FINE', color: '#00cc44' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}>
                <div style={{ fontSize: '9px', color: '#666666', letterSpacing: '1px' }}>{item.label}</div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: item.color, letterSpacing: '1px' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Reporter count */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid #1e2533',
            background: '#070a0f',
          }}>
            <div style={{ fontSize: '9px', color: '#555555', letterSpacing: '1px', marginBottom: '4px' }}>
              CORRESPONDENTS DEPLOYED
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#cc0000' }}>
              {correspondents.length}
            </div>
            <div style={{ fontSize: '9px', color: '#666666' }}>
              to cover nothing
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div style={{
        background: '#0d0000',
        borderTop: '3px solid #cc0000',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
      }}>
        {/* Breaking badge */}
        <div style={{
          background: breakingFlash ? '#cc0000' : '#880000',
          padding: '0 14px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          fontSize: '11px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          flexShrink: 0,
          transition: 'background 0.1s',
          borderRight: '2px solid #ff0000',
        }}>
          BREAKING
        </div>

        {/* Scrolling ticker */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div
            ref={tickerRef}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '12px',
              color: '#ffffff',
              letterSpacing: '0.5px',
              transform: `translateX(${tickerX}px)`,
              position: 'absolute',
              willChange: 'transform',
            }}
          >
            {fullTickerText + "     ◆     " + fullTickerText}
          </div>
        </div>

        {/* Right side time */}
        <div style={{
          background: '#0d0d0d',
          borderLeft: '1px solid #333333',
          padding: '0 12px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          fontSize: '11px',
          color: '#888888',
          flexShrink: 0,
          letterSpacing: '1px',
        }}>
          {timeStr}
        </div>
      </div>
    </div>
  );
}