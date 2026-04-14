import { useState, useEffect, useRef, useCallback } from 'react';

const TESTIMONY_POOL = [
  "CLOUD EXHIBIT {n}: The defendant stood in the parking lot of a Walgreens on a Wednesday and stared at their own car for fourteen seconds before remembering they had driven there.",
  "CLOUD EXHIBIT {n}: At 3:04 PM, the defendant made a face — specifically, a face — upon receiving a text message. The nature of the face has been logged.",
  "CLOUD EXHIBIT {n}: The defendant walked to the refrigerator, opened it, closed it, and then opened it again. Nothing had changed. They were aware of this.",
  "CLOUD EXHIBIT {n}: On the occasion in question, the defendant hummed a song they claimed not to know and then denied knowing it when no one asked.",
  "CLOUD EXHIBIT {n}: The defendant paused at a crosswalk for eleven seconds and then continued. The motivation remains unclear.",
  "CLOUD EXHIBIT {n}: At approximately 3:17 PM, the defendant googled themselves. The results were reviewed for longer than the court considers reasonable.",
  "CLOUD EXHIBIT {n}: The defendant said 'no worries' in a context where worries were, in fact, present. The discrepancy has been noted.",
  "CLOUD EXHIBIT {n}: In the parking structure on Clement Avenue, the defendant sat in their vehicle for six minutes after arriving, doing nothing. The radio was off.",
  "CLOUD EXHIBIT {n}: The defendant looked at the moon on a Tuesday and then looked away and then looked again. No explanation was offered.",
  "CLOUD EXHIBIT {n}: At 3:00 PM precisely, the defendant thought about a person they have not contacted in four years. The thought lasted longer than a sneeze.",
  "CLOUD EXHIBIT {n}: The defendant rearranged three items on a shelf, then returned them to their original positions, then left the room.",
  "CLOUD EXHIBIT {n}: On the date in question, the defendant practiced a conversation in the shower that never occurred and has not occurred since.",
  "CLOUD EXHIBIT {n}: The defendant received a voicemail and did not listen to it for eleven days. On the twelfth day, they listened to it and then did nothing.",
  "CLOUD EXHIBIT {n}: At 3:22 PM, the defendant chose not to wave back. The window of opportunity passed. The other party has been informed.",
  "CLOUD EXHIBIT {n}: The defendant stood in a grocery store aisle and read the nutrition label on a product they have purchased forty-seven times. Nothing new was learned.",
  "CLOUD EXHIBIT {n}: On a Wednesday in the third week of the month, the defendant laughed at something and then immediately felt the laugh had been too large.",
  "CLOUD EXHIBIT {n}: The defendant took a different route home. No explanation was logged. The original route remains unchanged and awaits their return.",
  "CLOUD EXHIBIT {n}: At 3:09 PM, the defendant looked out a window and said nothing. The window has been subpoenaed as a corroborating witness.",
  "CLOUD EXHIBIT {n}: The defendant made a list. The list was never completed. The list has been entered into evidence as Attachment C.",
  "CLOUD EXHIBIT {n}: On the afternoon in question, the defendant apologized for something that was not their fault and then apologized for apologizing.",
  "CLOUD EXHIBIT {n}: The defendant paused a video at the 47-second mark and did not return to it for three days. The video's emotional arc was disrupted.",
  "CLOUD EXHIBIT {n}: At 3:31 PM, the defendant considered calling someone and then placed their phone face-down on a table. The table has been notified.",
];

const VERDICT_POOL = [
  "THE COURT FINDS: That on multiple occasions, in various parking lots, the defendant has lingered. The lingering was real. The lingering was witnessed. The defendant is hereby ordered to acknowledge that the Wednesday in question happened, and that they were present for it.",
  "THE COURT FINDS: That the face made at 3:04 PM constitutes a full and binding record of inner experience. The defendant is sentenced to carry the memory of the Walgreens parking lot until such time as they can explain what they were thinking, which the court acknowledges may be never.",
  "THE COURT FINDS: That the defendant is guilty of being a person who exists in the afternoon. The court orders no remedy, as none is available. The gavel has fallen. The sky has said its piece. You may go.",
  "THE COURT FINDS: Sufficient evidence of continued presence on earth during daylight hours. The defendant is hereby formally acknowledged to have been somewhere at 3pm on a day that will not be named. The court expresses neither approval nor disapproval. The clouds are dismissed.",
  "THE COURT FINDS: That the defendant's behavior in the parking structure, the grocery aisle, and the shower constitutes a pattern. The pattern has been documented. The documentation has been filed. The filing cabinet is full. This is the verdict: you were there. You are here. The distinction is noted.",
];

function generateClouds() {
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 2,
    y: Math.random() * 45 + 5,
    speed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
    size: Math.random() * 0.5 + 0.75,
    testified: false,
    morphProgress: 0,
    isMorphing: false,
    testimonyIndex: null,
    ellipses: Array.from({ length: 5 }, () => ({
      cx: Math.random() * 40 - 20,
      cy: Math.random() * 20 - 10,
      rx: Math.random() * 30 + 20,
      ry: Math.random() * 15 + 12,
    })),
  }));
}

export default function Page() {
  const [clouds, setClouds] = useState(generateClouds);
  const [transcripts, setTranscripts] = useState([]);
  const [caseStrength, setCaseStrength] = useState(0);
  const [verdictReached, setVerdictReached] = useState(false);
  const [verdictText, setVerdictText] = useState('');
  const [gavelFalling, setGavelFalling] = useState(false);
  const [gavelDown, setGavelDown] = useState(false);
  const [exhibitCounter, setExhibitCounter] = useState(0);
  const [usedTestimonies, setUsedTestimonies] = useState([]);
  const [verdictVisible, setVerdictVisible] = useState(false);
  const [hoveredCloud, setHoveredCloud] = useState(null);

  const transcriptRef = useRef(null);
  const animRef = useRef(null);
  const cloudsRef = useRef(clouds);
  const verdictReachedRef = useRef(false);
  const morphingClouds = useRef({});

  cloudsRef.current = clouds;

  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      last = now;

      setClouds(prev => prev.map(cloud => {
        let newX = cloud.x + cloud.speed * dt * 0.3;
        if (newX > 105) newX = -15;
        if (newX < -15) newX = 105;

        let newMorph = cloud.morphProgress;
        if (cloud.isMorphing && cloud.morphProgress < 1) {
          newMorph = Math.min(1, cloud.morphProgress + dt / 800);
        }

        return { ...cloud, x: newX, morphProgress: newMorph };
      }));

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcripts]);

  const handleCloudClick = useCallback((cloudId) => {
    if (verdictReachedRef.current) return;

    setClouds(prev => {
      const cloud = prev.find(c => c.id === cloudId);
      if (!cloud || cloud.testified) return prev;
      return prev.map(c => c.id === cloudId ? { ...c, isMorphing: true, testified: true } : c);
    });

    setExhibitCounter(prev => {
      const newCount = prev + 1;
      setUsedTestimonies(used => {
        const available = TESTIMONY_POOL.filter((_, i) => !used.includes(i));
        const pool = available.length > 0 ? available : TESTIMONY_POOL.map((_, i) => i);
        const idx = Math.floor(Math.random() * pool.length);
        const testimonyIdx = pool[idx];
        const testimony = TESTIMONY_POOL[testimonyIdx].replace('{n}', newCount);

        setTranscripts(t => [...t, testimony]);
        setUsedTestimonies(u => [...u, testimonyIdx]);

        setCaseStrength(s => {
          const gain = Math.floor(Math.random() * 7 + 12);
          const newStrength = Math.min(100, s + gain);
          if (newStrength >= 100 && !verdictReachedRef.current) {
            verdictReachedRef.current = true;
            setVerdictReached(true);
            setTimeout(() => {
              setGavelFalling(true);
              setTimeout(() => {
                setGavelDown(true);
                const v = VERDICT_POOL[Math.floor(Math.random() * VERDICT_POOL.length)];
                setVerdictText(v);
                setTimeout(() => setVerdictVisible(true), 600);
              }, 500);
            }, 800);
          }
          return newStrength;
        });

        return used;
      });
      return newCount;
    });
  }, []);

  const getMorphedEllipses = (cloud) => {
    const p = cloud.morphProgress;
    if (!cloud.testified) return cloud.ellipses;
    return cloud.ellipses.map((e, i) => ({
      cx: e.cx + Math.sin(i * 2.3) * 15 * p,
      cy: e.cy + Math.cos(i * 1.7) * 8 * p,
      rx: e.rx * (1 - p * 0.35) + (i % 2 === 0 ? 8 : -5) * p,
      ry: e.ry * (1 - p * 0.4) + (i % 2 === 0 ? -4 : 6) * p,
    }));
  };

  const getCloudColor = (cloud) => {
    if (!cloud.testified) return 'rgba(255,255,255,0.92)';
    const g = Math.floor(200 + cloud.morphProgress * 20);
    return `rgba(${g},${g},${g + 10},${0.9 - cloud.morphProgress * 0.3})`;
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(180deg, #b8ccd8 0%, #c8d8e8 40%, #dde8f0 100%)',
      fontFamily: 'Georgia, serif',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'default',
    }}>
      <style>{`
        @keyframes gavelSwing {
          0% { transform: rotate(-40deg) translateY(-30px); }
          60% { transform: rotate(15deg) translateY(10px); }
          75% { transform: rotate(-5deg) translateY(5px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
        @keyframes verdictFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cloudPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.6)); }
          50% { filter: drop-shadow(0 0 18px rgba(255,255,255,0.9)); }
        }
        @keyframes meterGlow {
          0%, 100% { box-shadow: 0 0 4px rgba(30,50,80,0.4); }
          50% { box-shadow: 0 0 12px rgba(30,50,80,0.8); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '18px 20px 10px',
        zIndex: 10,
      }}>
        <div style={{
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#3a4a5a',
          textTransform: 'uppercase',
          marginBottom: '4px',
          fontFamily: 'Courier New, monospace',
        }}>IN THE MATTER OF</div>
        <div style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#1e2e3e',
          letterSpacing: '1px',
          textShadow: '0 1px 3px rgba(255,255,255,0.5)',
        }}>THE SKY v. YOU</div>
        <div style={{
          fontSize: '10px',
          color: '#5a6a7a',
          fontFamily: 'Courier New, monospace',
          marginTop: '3px',
          letterSpacing: '2px',
        }}>CASE NO. ████-████ · TESTIMONY IN PROGRESS</div>
      </div>

      {/* Gavel */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '24px',
        zIndex: 20,
        transformOrigin: 'top right',
        animation: gavelFalling ? 'gavelSwing 0.6s ease-out forwards' : 'none',
      }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <rect x="10" y="8" width="28" height="12" rx="3" fill="#4a3020" />
          <rect x="28" y="14" width="4" height="32" rx="2" fill="#6a4a2a" />
          <ellipse cx="30" cy="46" rx="8" ry="4" fill="#5a3a1a" />
        </svg>
      </div>

      {/* Case Strength Meter */}
      <div style={{
        position: 'absolute',
        top: '88px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '340px',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}>
          <span style={{
            fontSize: '9px',
            fontFamily: 'Courier New, monospace',
            color: '#3a4a5a',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>CASE STRENGTH</span>
          <span style={{
            fontSize: '9px',
            fontFamily: 'Courier New, monospace',
            color: '#3a4a5a',
            letterSpacing: '1px',
          }}>{Math.round(caseStrength)}%</span>
        </div>
        <div style={{
          height: '6px',
          background: 'rgba(30,50,80,0.15)',
          borderRadius: '3px',
          border: '1px solid rgba(30,50,80,0.25)',
          overflow: 'hidden',
          animation: caseStrength >= 100 ? 'meterGlow 1s infinite' : 'none',
        }}>
          <div style={{
            height: '100%',
            width: `${caseStrength}%`,
            background: caseStrength >= 80
              ? 'linear-gradient(90deg, #1e3050, #8a1a1a)'
              : 'linear-gradient(90deg, #1e3050, #2a4a6a)',
            borderRadius: '3px',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{
          fontSize: '8px',
          fontFamily: 'Courier New, monospace',
          color: '#7a8a9a',
          marginTop: '3px',
          letterSpacing: '1px',
          textAlign: 'center',
        }}>
          {caseStrength === 0 ? 'CLICK A CLOUD TO CALL IT AS A WITNESS' :
           caseStrength < 40 ? 'TESTIMONY BEING RECORDED' :
           caseStrength < 70 ? 'CASE BUILDING' :
           caseStrength < 100 ? 'APPROACHING VERDICT' :
           'CASE CLOSED'}
        </div>
      </div>

      {/* Clouds */}
      {clouds.map(cloud => {
        const morphed = getMorphedEllipses(cloud);
        const color = getCloudColor(cloud);
        const isHovered = hoveredCloud === cloud.id;

        return (
          <div
            key={cloud.id}
            onClick={() => !cloud.testified && handleCloudClick(cloud.id)}
            onMouseEnter={() => !cloud.testified && setHoveredCloud(cloud.id)}
            onMouseLeave={() => setHoveredCloud(null)}
            style={{
              position: 'absolute',
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              transform: `scale(${cloud.size})`,
              transformOrigin: 'center center',
              cursor: cloud.testified ? 'default' : 'pointer',
              zIndex: 5,
              transition: 'filter 0.3s',
              filter: isHovered
                ? 'drop-shadow(0 0 12px rgba(255,255,255,0.9))'
                : cloud.testified
                  ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  : 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))',
            }}
          >
            <svg width="160" height="90" viewBox="-80 -45 160 90" overflow="visible">
              {morphed.map((e, i) => (
                <ellipse
                  key={i}
                  cx={e.cx}
                  cy={e.cy}
                  rx={Math.max(2, e.rx)}
                  ry={Math.max(2, e.ry)}
                  fill={color}
                  stroke={cloud.testified ? 'rgba(100,100,120,0.3)' : 'rgba(200,210,230,0.4)'}
                  strokeWidth={cloud.testified ? 1 : 0.5}
                  style={{ transition: 'fill 0.5s' }}
                />
              ))}
              {!cloud.testified && (
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="10"
                  fill="rgba(80,100,130,0.5)"
                  fontFamily="Courier New, monospace"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {isHovered ? '▸ CALL TO TESTIFY' : ''}
                </text>
              )}
              {cloud.testified && cloud.morphProgress > 0.5 && (
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="8"
                  fill={`rgba(60,40,40,${(cloud.morphProgress - 0.5) * 1.6})`}
                  fontFamily="Courier New, monospace"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  [TESTIFIED]
                </text>
              )}
            </svg>
          </div>
        );
      })}

      {/* Verdict Overlay */}
      {verdictVisible && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(245, 240, 232, 0.97)',
            border: '2px solid #1e2e3e',
            padding: '28px 36px',
            maxWidth: '500px',
            animation: 'verdictFadeIn 1s ease forwards',
            boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              fontSize: '11px',
              fontFamily: 'Courier New, monospace',
              letterSpacing: '3px',
              color: '#3a2a1a',
              textAlign: 'center',
              marginBottom: '14px',
              borderBottom: '1px solid #3a2a1a',
              paddingBottom: '10px',
            }}>⚖ VERDICT ⚖</div>
            <div style={{
              fontSize: '13px',
              fontFamily: 'Courier New, monospace',
              lineHeight: '1.7',
              color: '#2a1a0a',
              textAlign: 'left',
            }}>{verdictText}</div>
            <div style={{
              marginTop: '16px',
              fontSize: '9px',
              fontFamily: 'Courier New, monospace',
              color: '#8a7a6a',
              textAlign: 'center',
              letterSpacing: '2px',
            }}>THE SKY RESTS. THE CLOUDS ARE DISMISSED.</div>
          </div>
        </div>
      )}

      {/* Transcript Panel */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '210px',
        background: 'linear-gradient(180deg, rgba(245,240,232,0.92) 0%, rgba(245,240,232,0.98) 20%)',
        borderTop: '2px solid #2a3a4a',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '8px 16px 4px',
          borderBottom: '1px solid rgba(42,58,74,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: '9px',
            fontFamily: 'Courier New, monospace',
            letterSpacing: '2px',
            color: '#2a3a4a',
            textTransform: 'uppercase',
          }}>OFFICIAL TRANSCRIPT</span>
          <span style={{
            fontSize: '8px',
            fontFamily: 'Courier New, monospace',
            color: '#8a9aaa',
            letterSpacing: '1px',
          }}>— STENOGRAPHIC RECORD — ATMOSPHERIC DIVISION —</span>
          {transcripts.length === 0 && (
            <span style={{
              fontSize: '8px',
              fontFamily: 'Courier New, monospace',
              color: '#aabaca',
              letterSpacing: '1px',
              fontStyle: 'italic',
            }}>awaiting testimony...</span>
          )}
        </div>
        <div
          ref={transcriptRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 16px 12px',
            scrollBehavior: 'smooth',
          }}
        >
          {transcripts.map((t, i) => (
            <div key={i} style={{
              marginBottom: '10px',
              fontSize: '11px',
              fontFamily: 'Courier New, monospace',
              lineHeight: '1.6',
              color: '#1a2a3a',
              borderLeft: '2px solid rgba(42,58,74,0.2)',
              paddingLeft: '10px',
            }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}