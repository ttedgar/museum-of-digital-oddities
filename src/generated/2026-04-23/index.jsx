import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const RETIRING_RGB = [139, 175, 60];
  const ABSENCE_RGB = [180, 172, 165];

  function drainColor(r, g, b, progress) {
    const nr = Math.round(r + (ABSENCE_RGB[0] - r) * progress);
    const ng = Math.round(g + (ABSENCE_RGB[1] - g) * progress);
    const nb = Math.round(b + (ABSENCE_RGB[2] - b) * progress);
    return `rgb(${nr},${ng},${nb})`;
  }

  function drainHex(progress) {
    return drainColor(...RETIRING_RGB, progress);
  }

  const [partyPhase, setPartyPhase] = useState('arriving');
  const [drainProgress, setDrainProgress] = useState(0);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [cardMessages, setCardMessages] = useState([]);
  const [cardOpen, setCardOpen] = useState(false);
  const [honoreeSpoken, setHonoreeSpoken] = useState(false);
  const [honoreeDialogIndex, setHonoreeDialogIndex] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const drainInterval = useRef(null);

  const guests = [
    { name: 'Taupe', hex: '#B5A89A', rgb: [181,168,154], quip: "You were always very... present. I think. I didn't really keep track." },
    { name: 'Mauve', hex: '#C3A0A8', rgb: [195,160,168], quip: "We overlapped at a sunset once. You were fine. Very fine. Extremely adequate." },
    { name: 'Chartreuse', hex: '#7FFF00', rgb: [127,255,0], quip: "Between you and me, I always thought we were cousins? No? Okay. Okay, wow." },
    { name: 'Ecru', hex: '#C2B280', rgb: [194,178,128], quip: "I brought a casserole but I left it in the car. I'll get it. I won't get it." },
    { name: 'Puce', hex: '#CC8899', rgb: [204,136,153], quip: "Do you remember that Tuesday in 2011? I don't. I just thought I'd ask." },
    { name: 'Bisque', hex: '#FFE4C4', rgb: [255,228,196], quip: "I googled your hex code once. The results were... inconclusive." },
    { name: 'Periwinkle', hex: '#CCCCFF', rgb: [204,204,255], quip: "I googled you once. Just your name. Not your hex. Your name. It was a lot." },
    { name: 'Ochre', hex: '#CC7722', rgb: [204,119,34], quip: "We're not that different, you and I. Actually we're very different. Sorry." },
  ];

  const honoreeLines = [
    "Oh. You came over. That's... you didn't have to do that.",
    "I've been thinking about it. Being perceived is exhausting. I think I'm ready.",
    "I existed in exactly 4,891 CSS files. Most of them were mistakes. I didn't mind.",
    "Someone used me for a parking lot sign in Duluth. That was the peak, I think.",
    "The mints are good. You should take some. Everyone keeps saying they will and then they don't.",
    "It's fine. The spectrum will close around me like water. It always does.",
    "I just want to sit here for a little longer. Is that okay? Just... a little longer.",
  ];

  const cardMessagePool = [
    { from: 'Periwinkle', msg: "I googled you once. Just the number. #8BAF3C. The image results were mostly lawn photos. You deserved better lawns." },
    { from: 'Taupe', msg: "We were in the same Pantone catalog once. Page 47. You were looking the other way. I thought about saying hi." },
    { from: 'Bisque', msg: "I don't know what you are or what you meant to anyone but I feel something right now and I'm going to call it grief." },
    { from: 'Chartreuse', msg: "We ARE cousins. I've decided. You can't stop me. The family is bigger now. Goodbye cousin." },
    { from: 'Mauve', msg: "There was a bedroom wall in Tucson, 2003. We were both there. I was the accent wall. You were the throw pillow. That meant something." },
    { from: 'Puce', msg: "I wrote you a poem but it was only the word 'hue' repeated fourteen times so I'm not going to share it here." },
    { from: 'Ecru', msg: "The casserole is still in the car. I want you to know I thought about getting it for a full four minutes. That's love." },
    { from: 'Ochre', msg: "If you see any other colors on the other side, tell them Ochre said it's fine. They'll know what it means. (I don't know what it means.)" },
    { from: 'An Anonymous Color', msg: "I only came for the sandwiches. But now I'm crying. This is your fault. I mean that respectfully." },
    { from: 'The Concept of Green Itself', msg: "You were a good attempt. A solid try. I've seen worse. Not many. But some." },
  ];

  useEffect(() => {
    const pieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rot: Math.random() * 360,
      drift: (Math.random() - 0.5) * 2,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
    setConfetti(pieces);
    const t = setTimeout(() => setPartyPhase('party'), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (partyPhase === 'winding') {
      drainInterval.current = setInterval(() => {
        setDrainProgress(prev => {
          if (prev >= 1) {
            clearInterval(drainInterval.current);
            setPartyPhase('gone');
            return 1;
          }
          return prev + 0.008;
        });
      }, 80);
    }
    return () => clearInterval(drainInterval.current);
  }, [partyPhase]);

  const mainColor = drainHex(drainProgress);
  const mainColorAlpha = (alpha) => {
    const [r, g, b] = RETIRING_RGB.map((c, i) => Math.round(c + (ABSENCE_RGB[i] - c) * drainProgress));
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const handleGuestClick = (name, e) => {
    e.stopPropagation();
    setSelectedGuest(selectedGuest === name ? null : name);
  };

  const handleHonoreeClick = (e) => {
    e.stopPropagation();
    setHonoreeSpoken(true);
    setHonoreeDialogIndex(prev => Math.min(prev + 1, honoreeLines.length - 1));
  };

  const handleSignCard = (e) => {
    e.stopPropagation();
    if (messageIndex < cardMessagePool.length) {
      setCardMessages(prev => [...prev, cardMessagePool[messageIndex]]);
      setMessageIndex(prev => prev + 1);
    }
    setCardOpen(true);
  };

  const handleWindDown = (e) => {
    e.stopPropagation();
    setPartyPhase('winding');
    setCardOpen(false);
    setSelectedGuest(null);
  };

  const handlePageClick = () => {
    setSelectedGuest(null);
    setCardOpen(false);
  };

  const streamers = [
    { left: '5%', delay: 0 }, { left: '15%', delay: 0.3 },
    { left: '25%', delay: 0.6 }, { left: '35%', delay: 0.1 },
    { left: '50%', delay: 0.4 }, { left: '65%', delay: 0.2 },
    { left: '75%', delay: 0.5 }, { left: '85%', delay: 0.7 },
    { left: '95%', delay: 0.3 },
  ];

  const balloons = [
    { left: '8%', top: '12%' }, { left: '20%', top: '8%' },
    { left: '35%', top: '14%' }, { left: '55%', top: '10%' },
    { left: '70%', top: '7%' }, { left: '82%', top: '13%' },
    { left: '92%', top: '9%' },
  ];

  return (
    <div onClick={handlePageClick} style={{
      minHeight: '100vh',
      background: partyPhase === 'gone'
        ? 'rgb(245,243,241)'
        : `linear-gradient(180deg, rgb(248,246,240) 0%, rgb(240,238,232) 100%)`,
      fontFamily: 'Georgia, serif',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 2s',
    }}>
      <style>{`
        @keyframes sway {
          0%,100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 20px 8px rgba(139,175,60,0.4); }
          50% { box-shadow: 0 0 35px 15px rgba(139,175,60,0.7); }
        }
        @keyframes drain {
          from { filter: saturate(1); }
          to { filter: saturate(0); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(20px) rotate(360deg); opacity: 0.3; }
        }
        @keyframes shimmer {
          0%,100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Arriving overlay */}
      {partyPhase === 'arriving' && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgb(245,244,240)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>🎈</div>
          <div style={{ fontSize: 18, color: '#666', fontStyle: 'italic' }}>
            You have been invited to a farewell party...
          </div>
        </div>
      )}

      {/* Ceiling streamers */}
      {streamers.map((s, i) => (
        <div key={i} style={{
          position: 'fixed', top: 0, left: s.left,
          width: 3, height: 80 + (i % 3) * 30,
          background: mainColor,
          opacity: partyPhase === 'gone' ? 0.15 : 0.7,
          transformOrigin: 'top center',
          animation: `sway ${2 + i * 0.3}s ease-in-out ${s.delay}s infinite`,
          transition: 'background 3s, opacity 3s',
          zIndex: 1,
        }} />
      ))}

      {/* Balloons */}
      {balloons.map((b, i) => (
        <div key={i} style={{
          position: 'fixed', left: b.left, top: b.top,
          animation: `float ${3 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
          zIndex: 1,
          opacity: partyPhase === 'gone' ? 0.1 : 0.85,
          transition: 'opacity 3s',
        }}>
          <div style={{
            width: 36, height: 44,
            background: mainColor,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            position: 'relative',
            transition: 'background 3s',
          }}>
            <div style={{
              position: 'absolute', bottom: -2, left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `6px solid ${mainColor}`,
              transition: 'border-color 3s',
            }} />
          </div>
          <div style={{
            width: 1, height: 40, background: '#ccc',
            margin: '0 auto',
          }} />
        </div>
      ))}

      {/* Confetti */}
      {confetti.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.shape === 'circle' ? p.size : p.size * 1.5,
          height: p.size,
          borderRadius: p.shape === 'circle' ? '50%' : 2,
          background: p.id % 3 === 0 ? mainColor : p.id % 3 === 1 ? mainColorAlpha(0.6) : '#d4cfc9',
          transform: `rotate(${p.rot}deg)`,
          opacity: partyPhase === 'gone' ? 0.05 : 0.5,
          transition: 'background 3s, opacity 3s',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      {/* Main content */}
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '20px 24px 60px',
        position: 'relative', zIndex: 2,
      }}>

        {/* Banner */}
        <div style={{
          textAlign: 'center', marginBottom: 8,
          padding: '12px 24px',
          background: mainColorAlpha(0.15),
          border: `3px solid ${mainColor}`,
          borderRadius: 8,
          transition: 'background 3s, border-color 3s',
        }}>
          <div style={{
            fontSize: 13, letterSpacing: 4, textTransform: 'uppercase',
            color: mainColor, marginBottom: 4,
            transition: 'color 3s',
          }}>
            {partyPhase === 'gone' ? 'PARTY HAS CONCLUDED' : 'YOU ARE CORDIALLY INVITED TO'}
          </div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 'bold',
            color: partyPhase === 'gone' ? '#aaa' : '#333',
            lineHeight: 1.3,
          }}>
            {partyPhase === 'gone'
              ? 'A Room-Shaped Hole in the Spectrum'
              : 'A Farewell Party for a Color'}
          </h1>
          <div style={{
            fontSize: 14, color: '#888', marginTop: 6, fontStyle: 'italic',
          }}>
            {partyPhase === 'gone'
              ? 'The folding chairs remain. The mints remain. The color does not.'
              : 'Honoring #8BAF3C (Amber-Green, Slightly Wrong) on the occasion of its retirement from existence'}
          </div>
        </div>

        {/* Cake */}
        {partyPhase !== 'gone' && (
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 24,
          }}>
            <div style={{
              background: '#f5f0e8',
              border: `4px solid ${mainColor}`,
              borderRadius: 12,
              padding: '16px 28px',
              textAlign: 'center',
              maxWidth: 340,
              boxShadow: `0 4px 0 ${mainColor}`,
              transition: 'border-color 3s, box-shadow 3s',
            }}>
              <div style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
                fontSize: 16, color: mainColor,
                lineHeight: 1.5,
                transition: 'color 3s',
              }}>
                WE'LL MISS YOU<br />
                #8BAF3C<br />
                <span style={{ fontSize: 12 }}>(SORT OF)</span>
              </div>
              <div style={{ fontSize: 22, marginTop: 6 }}>🎂</div>
              <div style={{
                fontSize: 11, color: '#aaa', marginTop: 4, fontStyle: 'italic',
              }}>
                (There are tiny sandwiches. No one knows what to say.)
              </div>
            </div>
          </div>
        )}

        {/* Gone state cake ghost */}
        {partyPhase === 'gone' && (
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 24,
          }}>
            <div style={{
              background: 'rgb(240,238,235)',
              border: '4px solid rgb(180,172,165)',
              borderRadius: 12, padding: '16px 28px',
              textAlign: 'center', maxWidth: 340,
              boxShadow: '0 4px 0 rgb(180,172,165)',
            }}>
              <div style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
                fontSize: 16, color: 'rgb(180,172,165)', lineHeight: 1.5,
              }}>
                WE'LL MISS YOU<br />
                ████████<br />
                <span style={{ fontSize: 12 }}>(SORT OF)</span>
              </div>
              <div style={{ fontSize: 22, marginTop: 6, filter: 'grayscale(1)' }}>🎂</div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 4, fontStyle: 'italic' }}>
                (The frosting was that color. The frosting is gone now.)
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>

          {/* Guest list */}
          <div style={{ flex: '1 1 340px' }}>
            <div style={{
              fontSize: 13, textTransform: 'uppercase', letterSpacing: 3,
              color: '#999', marginBottom: 12,
            }}>
              Guests in Attendance
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}>
              {guests.map(guest => {
                const guestColor = drainColor(guest.rgb[0], guest.rgb[1], guest.rgb[2], drainProgress);
                const isSelected = selectedGuest === guest.name;
                return (
                  <div key={guest.name} style={{ position: 'relative' }}>
                    <div
                      onClick={(e) => handleGuestClick(guest.name, e)}
                      style={{
                        background: guestColor,
                        borderRadius: 8, padding: '10px 12px',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #333' : '2px solid transparent',
                        transition: 'background 3s, transform 0.1s',
                        transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{
                        background: 'white', borderRadius: 4,
                        padding: '3px 6px', display: 'inline-block',
                        fontSize: 11, fontWeight: 'bold',
                        color: '#333', marginBottom: 4,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}>
                        HELLO I AM<br />
                        <span style={{ fontSize: 13 }}>{guest.name}</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>
                        click to overhear
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        onClick={e => e.stopPropagation()}
                        style={{
                          position: 'absolute', bottom: '110%', left: 0,
                          background: 'white',
                          border: `2px solid ${guestColor}`,
                          borderRadius: 8, padding: '10px 12px',
                          fontSize: 12, color: '#444',
                          lineHeight: 1.5, zIndex: 10,
                          minWidth: 180, maxWidth: 220,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          animation: 'fadeIn 0.2s ease',
                        }}
                      >
                        <div style={{
                          fontSize: 10, fontWeight: 'bold',
                          color: guestColor, marginBottom: 4,
                          transition: 'color 3s',
                        }}>
                          {guest.name} says:
                        </div>
                        <em>"{guest.quip}"</em>
                        <div style={{
                          position: 'absolute', bottom: -8, left: 16,
                          width: 14, height: 14, background: 'white',
                          border: `2px solid ${guestColor}`,
                          borderTop: 'none', borderLeft: 'none',
                          transform: 'rotate(45deg)',
                          transition: 'border-color 3s',
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Honoree */}
            <div style={{
              background: partyPhase === 'gone'
                ? 'rgb(240,238,235)'
                : `radial-gradient(circle at 50% 50%, ${mainColorAlpha(0.25)} 0%, transparent 70%)`,
              border: `2px dashed ${mainColor}`,
              borderRadius: 12, padding: '16px',
              position: 'relative',
              animation: partyPhase !== 'gone' ? 'glow 3s ease-in-out infinite' : 'none',
              transition: 'border-color 3s, background 3s',
            }}>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: 2,
                color: '#999', marginBottom: 8,
              }}>
                Guest of Honor · Corner of the Room
              </div>

              <div
                onClick={handleHonoreeClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: partyPhase === 'gone' ? 'default' : 'pointer',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: mainColor,
                  flexShrink: 0,
                  transition: 'background 3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: 'white', textAlign: 'center',
                  fontWeight: 'bold', lineHeight: 1.2,
                }}>
                  {partyPhase === 'gone' ? '✦' : '#8B\nAF3C'}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#333' }}>
                    {partyPhase === 'gone' ? '(no longer here)' : '#8BAF3C'}
                  </div>
                  <div style={{ fontSize: 12, color: '#777', fontStyle: 'italic' }}>
                    {partyPhase === 'gone'
                      ? 'Amber-Green · Slightly Wrong · 1998–present'
                      : 'Amber-Green, Slightly Wrong'}
                  </div>
                  {partyPhase !== 'gone' && (
                    <div style={{ fontSize: 11, color: mainColor, marginTop: 2, transition: 'color 3s' }}>
                      {honoreeSpoken ? 'click to hear more' : 'click to approach'}
                    </div>
                  )}
                </div>
              </div>

              {honoreeSpoken && partyPhase !== 'gone' && (
                <div style={{
                  marginTop: 12, padding: '10px 12px',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 8, fontSize: 13,
                  color: '#444', lineHeight: 1.6,
                  fontStyle: 'italic',
                  animation: 'fadeIn 0.3s ease',
                  borderLeft: `3px solid ${mainColor}`,
                  transition: 'border-color 3s',
                }}>
                  "{honoreeLines[honoreeDialogIndex - 1]}"
                  {honoreeDialogIndex < honoreeLines.length && (
                    <div style={{ fontSize: 10, color: '#bbb', marginTop: 4, fontStyle: 'normal' }}>
                      [{honoreeDialogIndex}/{honoreeLines.length}]
                    </div>
                  )}
                </div>
              )}

              {partyPhase === 'gone' && (
                <div style={{
                  marginTop: 12, padding: '10px 12px',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: 8, fontSize: 13,
                  color: '#aaa', lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>
                  "The spectrum will close around me like water."<br />
                  <span style={{ fontSize: 11 }}>It did.</span>
                </div>
              )}
            </div>

            {/* Farewell card button */}
            {partyPhase !== 'gone' && (
              <button
                onClick={handleSignCard}
                style={{
                  background: mainColor,
                  color: 'white', border: 'none',
                  borderRadius: 8, padding: '12px 20px',
                  fontSize: 14, cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  transition: 'background 3s',
                  boxShadow: `0 3px 0 ${mainColorAlpha(0.5)}`,
                }}
              >
                ✉️ Sign the Farewell Card
                {messageIndex >= cardMessagePool.length && (
                  <span style={{ fontSize: 11, display: 'block', opacity: 0.8 }}>
                    (card is full)
                  </span>
                )}
              </button>
            )}

            {/* Wind down button */}
            {honoreeSpoken && partyPhase === 'party' && (
              <button
                onClick={handleWindDown}
                style={{
                  background: 'transparent',
                  color: '#888',
                  border: '1px dashed #ccc',
                  borderRadius: 8, padding: '10px 20px',
                  fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  transition: 'all 0.2s',
                  animation: 'fadeIn 0.5s ease',
                }}
              >
                Wind Down the Party
              </button>
            )}

            {/* Winding status */}
            {partyPhase === 'winding' && (
              <div style={{
                fontSize: 12, color: '#aaa', fontStyle: 'italic',
                textAlign: 'center',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}>
                The color is leaving the room...<br />
                <div style={{
                  height: 4, background: '#eee', borderRadius: 2,
                  marginTop: 8, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(1 - drainProgress) * 100}%`,
                    background: mainColor,
                    transition: 'width 0.1s, background 0.1s',
                  }} />
                </div>
              </div>
            )}

            {/* To-go mints */}
            {(partyPhase === 'winding' || partyPhase === 'gone') && (
              <div style={{
                background: 'rgb(245,243,240)',
                border: '1px solid #ddd',
                borderRadius: 8, padding: '12px',
                fontSize: 12, color: '#bbb',
                fontStyle: 'italic',
                animation: 'fadeIn 0.5s ease',
              }}>
                🍬 A to-go bag of mints.<br />
                <span style={{ fontSize: 11 }}>
                  No one took any. They said they would. They didn't.
                </span>
              </div>
            )}

            {/* Folding chairs */}
            {partyPhase === 'gone' && (
              <div style={{
                fontSize: 13, color: '#ccc', textAlign: 'center',
                letterSpacing: 1,
                animation: 'fadeIn 1s ease',
              }}>
                🪑 🪑 🪑<br />
                <span style={{ fontSize: 11, fontStyle: 'italic' }}>
                  The folding chairs remain.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tiny sandwiches note */}
        {partyPhase === 'party' && (
          <div style={{
            textAlign: 'center', marginTop: 20,
            fontSize: 12, color: '#bbb', fontStyle: 'italic',
          }}>
            🥪🥪🥪 There are tiny sandwiches. No one knows what to say to a hue.
          </div>
        )}
      </div>

      {/* Card overlay */}
      {cardOpen && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 24,
          }}
        >
          <div style={{
            background: 'white', borderRadius: 12,
            padding: 28, maxWidth: 500, width: '100%',
            maxHeight: '80vh', overflow: 'auto',
            border: `4px solid ${mainColor}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            transition: 'border-color 3s',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
              fontSize: 18, color: mainColor,
              textAlign: 'center', marginBottom: 16,
              transition: 'color 3s',
            }}>
              Farewell Card for #8BAF3C
            </div>
            <div style={{
              fontSize: 12, color: '#aaa', textAlign: 'center',
              marginBottom: 16, fontStyle: 'italic',
            }}>
              Messages left by those who attended (sort of)
            </div>

            {cardMessages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#ccc', fontStyle: 'italic', padding: '20px 0' }}>
                The card is blank. Someone left a pen but it's out of ink.
              </div>
            )}

            {cardMessages.map((msg, i) => (
              <div key={i} style={{
                marginBottom: 14, padding: '10px 14px',
                background: '#fafaf8',
                borderRadius: 8,
                borderLeft: `3px solid ${mainColor}`,
                fontSize: 13, color: '#444', lineHeight: 1.6,
                animation: 'fadeIn 0.3s ease',
                transition: 'border-color 3s',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 'bold',
                  color: mainColor, marginBottom: 4,
                  transition: 'color 3s',
                }}>
                  — {msg.from}
                </div>
                <em>"{msg.msg}"</em>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {messageIndex < cardMessagePool.length && (
                <button
                  onClick={handleSignCard}
                  style={{
                    flex: 1, background: mainColor, color: 'white',
                    border: 'none', borderRadius: 8,
                    padding: '10px', fontSize: 13,
                    cursor: 'pointer', fontFamily: 'Georgia, serif',
                    transition: 'background 3s',
                  }}
                >
                  Add Another Message
                </button>
              )}
              <button
                onClick={() => setCardOpen(false)}
                style={{
                  flex: 1, background: 'transparent',
                  color: '#999', border: '1px solid #ddd',
                  borderRadius: 8, padding: '10px',
                  fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                }}
              >
                Close Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}