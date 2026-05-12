import { useState, useEffect, useRef } from 'react';

const FUTURE_SELVES = [
  {
    id: 0,
    ticketNum: 847,
    description: "Slightly worn around the certainty. Smells faintly of a decision not yet made. Left sleeve frayed from leaning against too many open windows.",
    foundLocation: "Outside a city three jobs from now, sitting on a curb that doesn't exist yet",
    condition: "Fair. Some structural damage to the confidence. Interior lining intact.",
    sentence: "The thing you keep almost saying — say it. The weather after will be mild.",
    donationAddress: "a feeling of Tuesday afternoon in a city you visited once"
  },
  {
    id: 1,
    ticketNum: 848,
    description: "Heavier than expected. Carries the weight of a name used differently. Eyes calibrated to a slightly different version of ordinary.",
    foundLocation: "At the edge of a conversation that hadn't started yet, near the part where you almost leave",
    condition: "Good. Shows signs of having been loved by someone who didn't say so.",
    sentence: "You will be surprised by how small the thing is that finally changes everything.",
    donationAddress: "the specific warmth of a stranger's car in winter"
  },
  {
    id: 2,
    ticketNum: 849,
    description: "Quieter than the others. Hands suggest someone who learned to hold things without gripping. Slight discoloration at the temples from thinking sideways.",
    foundLocation: "Two years down a road you haven't chosen, standing at a window facing inward",
    condition: "Very Good. Has been repaired in places. The repairs are visible and this is intentional.",
    sentence: "The version of this that terrifies you is not the version that arrives.",
    donationAddress: "the feeling of remembering something before it happens"
  },
  {
    id: 3,
    ticketNum: 850,
    description: "Noticeably lighter. Appears to have set something down somewhere and not gone back for it. Moves like someone who has stopped rehearsing exits.",
    foundLocation: "Inside a year you haven't reached, in a room arranged the way you keep meaning to arrange things",
    condition: "Good. Evidence of at least one complete transformation. Some original parts replaced.",
    sentence: "The grief was real and then it was furniture and then it was just a room you lived in.",
    donationAddress: "somewhere between relief and its exact opposite"
  },
  {
    id: 4,
    ticketNum: 851,
    description: "Recognizable but altered. Something in the posture suggests a reckoning survived. Carries no bag. Appears to have stopped needing one.",
    foundLocation: "Just outside next autumn, leaning against the particular silence after a long phone call",
    condition: "Excellent. Has clearly been through something. Is not diminished by it.",
    sentence: "You will forgive them, not because they deserve it, but because the weight was yours.",
    donationAddress: "the exact moment a song stops sounding like a wound"
  },
  {
    id: 5,
    ticketNum: 852,
    description: "Almost familiar. Stands the way you stand when no one is watching. Wearing your coat. Has been wearing it for some time.",
    foundLocation: "Six months from now, in the parking lot outside the conversation you keep rescheduling",
    condition: "Good. Recently through something ordinary that turned out to matter enormously.",
    sentence: "Go to the thing. Bring nothing prepared. Let it be awkward. It will matter anyway.",
    donationAddress: "the specific longing for a version of home that may be a person"
  },
  {
    id: 6,
    ticketNum: 853,
    description: "Exactly the right size. Breathing. Looking at something just above the screen. Smells like this room, this light, this moment. Wearing your coat because it is their coat because it is yours.",
    foundLocation: "Here, just now, holding this mouse",
    condition: "Present. Which is to say: complete. Which is to say: enough.",
    sentence: "You were never lost. You were just between the last place and here.",
    donationAddress: "nowhere — this one was always yours"
  }
];

export default function Page() {
  const [phase, setPhase] = useState('waiting'); // waiting, dispensing, viewing, acting, transitioning, done
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dispositions, setDispositions] = useState({});
  const [activeAction, setActiveAction] = useState(null);
  const [claimedSentence, setClaimedSentence] = useState('');
  const [sentenceVisible, setSentenceVisible] = useState(false);
  const [stampVisible, setStampVisible] = useState(false);
  const [stampText, setStampText] = useState('');
  const [itemVisible, setItemVisible] = useState(false);
  const [itemSliding, setItemSliding] = useState(false);
  const [ticketPulled, setTicketPulled] = useState(false);
  const [ticketVisible, setTicketVisible] = useState(false);
  const [finalReveal, setFinalReveal] = useState(false);
  const [windowPersonVisible, setWindowPersonVisible] = useState(false);
  const timeoutRef = useRef(null);

  const currentSelf = FUTURE_SELVES[currentIndex];
  const allResolved = Object.keys(dispositions).length === 7;

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  useEffect(() => {
    if (phase === 'viewing') {
      setTimeout(() => setItemVisible(true), 100);
    }
  }, [phase, currentIndex]);

  const pullTicket = () => {
    setTicketPulled(true);
    setTicketVisible(true);
    setTimeout(() => {
      setPhase('viewing');
      setItemVisible(false);
      setTimeout(() => setItemVisible(true), 200);
    }, 1800);
  };

  const handleClaim = () => {
    if (activeAction) return;
    setActiveAction('claiming');
    setWindowPersonVisible(true);
    setTimeout(() => {
      setClaimedSentence(currentSelf.sentence);
      setSentenceVisible(true);
      setTimeout(() => {
        setSentenceVisible(false);
        setWindowPersonVisible(false);
        setTimeout(() => {
          resolveItem('claimed');
        }, 600);
      }, 3000);
    }, 800);
  };

  const handleDonate = () => {
    if (activeAction) return;
    setActiveAction('donating');
    setStampText('DONATED');
    setStampVisible(true);
    setItemSliding(true);
    setTimeout(() => {
      setItemSliding(false);
      setStampVisible(false);
      resolveItem('donated');
    }, 1400);
  };

  const handleAbandon = () => {
    if (activeAction) return;
    setActiveAction('abandoning');
    setStampText('ABANDONED PROPERTY');
    setStampVisible(true);
    setTimeout(() => {
      setTimeout(() => {
        setStampVisible(false);
        resolveItem('abandoned');
      }, 600);
    }, 900);
  };

  const resolveItem = (disposition) => {
    setDispositions(prev => ({ ...prev, [currentIndex]: disposition }));
    setActiveAction(null);
    setClaimedSentence('');
    setItemVisible(false);
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= 7) {
        setPhase('done');
        setTimeout(() => setFinalReveal(true), 800);
      } else {
        setCurrentIndex(nextIndex);
        setPhase('transitioning');
        setTimeout(() => {
          setPhase('viewing');
        }, 500);
      }
    }, 500);
  };

  const getStampColor = (d) => {
    if (d === 'claimed') return '#1a6b2a';
    if (d === 'donated') return '#8b4513';
    return '#8b0000';
  };

  const getStampLabel = (d) => {
    if (d === 'claimed') return 'CLAIMED';
    if (d === 'donated') return 'DONATED';
    return 'ABANDONED';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #e8e0cc 0%, #d4c9a8 100%)',
      fontFamily: '"Georgia", "Times New Roman", serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '60px'
    }}>
      <style>{`
        @keyframes fluorescent-flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.85; }
          97% { opacity: 1; }
          98% { opacity: 0.9; }
        }
        @keyframes ticket-pull {
          0% { transform: translateY(0px); }
          40% { transform: translateY(8px); }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        @keyframes stamp-drop {
          0% { transform: rotate(-15deg) scale(1.4) translateY(-20px); opacity: 0; }
          60% { transform: rotate(-15deg) scale(0.95) translateY(2px); opacity: 1; }
          100% { transform: rotate(-15deg) scale(1) translateY(0px); opacity: 1; }
        }
        @keyframes item-slide-out {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes person-rise {
          0% { transform: translateY(30px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        @keyframes dissolve {
          0% { opacity: 1; filter: blur(0px); }
          100% { opacity: 0; filter: blur(8px); }
        }
        @keyframes final-glow {
          0% { box-shadow: 0 0 0px rgba(180, 140, 60, 0); }
          100% { box-shadow: 0 0 40px rgba(180, 140, 60, 0.4); }
        }
        @keyframes counter-buzz {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Fluorescent ceiling light strip */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'linear-gradient(90deg, #c8d4b0, #e8f0d0, #f0f8e8, #e8f0d0, #c8d4b0)',
        animation: 'fluorescent-flicker 8s infinite',
        boxShadow: '0 2px 20px rgba(200, 220, 160, 0.5)'
      }} />

      {/* Header sign */}
      <div style={{
        width: '100%',
        background: '#4a5240',
        padding: '16px 0',
        textAlign: 'center',
        borderBottom: '4px solid #2e3328'
      }}>
        <div style={{
          color: '#c8c8a0',
          fontSize: '11px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>Municipal Department of Temporal Misplacement</div>
        <div style={{
          color: '#e8e0c0',
          fontSize: '22px',
          letterSpacing: '2px',
          fontWeight: 'bold'
        }}>LOST & FOUND</div>
        <div style={{
          color: '#a0a080',
          fontSize: '10px',
          letterSpacing: '3px',
          marginTop: '4px'
        }}>OFFICE HOURS: WHENEVER YOU ARE READY</div>
      </div>

      {/* Main counter area */}
      <div style={{
        width: '100%',
        maxWidth: '680px',
        marginTop: '30px',
        padding: '0 20px'
      }}>

        {/* Counter window */}
        <div style={{
          background: '#b8c4a0',
          border: '6px solid #4a5240',
          borderRadius: '4px',
          padding: '0',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Counter surface label */}
          <div style={{
            background: '#4a5240',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#c8c8a0', fontSize: '10px', letterSpacing: '3px' }}>
              COUNTER WINDOW A — UNCLAIMED FUTURES
            </span>
            {phase !== 'waiting' && (
              <span style={{ color: '#a0c080', fontSize: '10px', letterSpacing: '2px' }}>
                TICKET #{currentIndex < 7 ? currentSelf?.ticketNum : 853}
              </span>
            )}
          </div>

          {/* Glass partition simulation */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(200,220,180,0.15) 0%, rgba(180,200,160,0.08) 100%)',
            borderBottom: '3px solid #4a5240',
            height: '200px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Glass reflection */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, rgba(255,255,240,0.12) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            {/* Waiting state */}
            {phase === 'waiting' && (
              <div style={{
                textAlign: 'center',
                animation: 'fade-in-up 1s ease forwards'
              }}>
                <div style={{
                  color: '#4a5240',
                  fontSize: '13px',
                  letterSpacing: '2px',
                  marginBottom: '8px'
                }}>PLEASE TAKE A NUMBER</div>
                <div style={{
                  color: '#6a7060',
                  fontSize: '11px',
                  letterSpacing: '1px'
                }}>Seven items are waiting to be identified</div>
              </div>
            )}

            {/* Person at window when claiming */}
            {windowPersonVisible && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                animation: activeAction === 'claiming' ? 'person-rise 0.8s ease forwards' : 'dissolve 0.8s ease forwards',
                background: 'rgba(180, 200, 160, 0.3)'
              }}>
                <div style={{ fontSize: '52px', marginBottom: '8px' }}>🪟</div>
                <div style={{
                  color: '#2e3328',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  fontStyle: 'italic'
                }}>looking directly at you</div>
              </div>
            )}

            {/* Claimed sentence */}
            {sentenceVisible && (
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'rgba(46, 51, 40, 0.92)',
                padding: '16px 24px',
                animation: 'fade-in-up 0.5s ease forwards'
              }}>
                <div style={{
                  color: '#e8e0c0',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  lineHeight: '1.6',
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}>"{claimedSentence}"</div>
              </div>
            )}

            {/* Viewing state — counter staff message */}
            {(phase === 'viewing' || phase === 'transitioning') && !windowPersonVisible && (
              <div style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{
                  color: '#3a4030',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  marginBottom: '12px',
                  textTransform: 'uppercase'
                }}>
                  {currentIndex < 6 ? 'Item checked in. Awaiting disposition.' : 'Final item. Found here, just now.'}
                </div>
                <div style={{
                  color: '#5a6450',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  fontStyle: 'italic'
                }}>
                  {currentIndex < 6
                    ? `${6 - currentIndex} item${6 - currentIndex !== 1 ? 's' : ''} remaining after this one`
                    : 'This is the last one. It has been waiting the least amount of time.'}
                </div>
              </div>
            )}

            {/* Done state */}
            {phase === 'done' && (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                animation: 'fade-in-up 1s ease forwards'
              }}>
                <div style={{ color: '#2e3328', fontSize: '13px', letterSpacing: '2px', marginBottom: '8px' }}>
                  ALL ITEMS PROCESSED
                </div>
                <div style={{ color: '#5a6450', fontSize: '11px', letterSpacing: '1px', fontStyle: 'italic' }}>
                  Thank you for your visit to the Department of Temporal Misplacement
                </div>
              </div>
            )}
          </div>

          {/* Counter surface */}
          <div style={{
            background: '#8a9870',
            padding: '20px 24px',
            borderTop: '2px solid #6a7860'
          }}>
            {/* Ticket dispenser */}
            {phase === 'waiting' && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  background: '#3a3a2a',
                  border: '3px solid #2a2a1a',
                  borderRadius: '4px',
                  padding: '12px 20px',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                  transition: 'transform 0.1s'
                }}
                  onClick={pullTicket}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{
                    color: '#e8e0a0',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    marginBottom: '8px'
                  }}>TAKE A NUMBER</div>
                  {/* Ticket sticking out */}
                  <div style={{
                    background: '#f0e8c0',
                    border: '1px solid #c8b870',
                    width: '60px',
                    margin: '0 auto',
                    padding: '6px 4px',
                    textAlign: 'center',
                    animation: ticketPulled ? 'ticket-pull 1.8s ease forwards' : 'none'
                  }}>
                    <div style={{ fontSize: '8px', color: '#6a6040', letterSpacing: '1px' }}>NOW SERVING</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2a2010' }}>847</div>
                  </div>
                  <div style={{
                    color: '#a0a070',
                    fontSize: '8px',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    marginTop: '6px'
                  }}>click to begin</div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {(phase === 'viewing' || phase === 'transitioning') && !activeAction && (
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {[
                  { label: 'CLAIM IT', action: handleClaim, bg: '#2e5020', hover: '#3a6028', border: '#1e3818' },
                  { label: 'DONATE IT', action: handleDonate, bg: '#7a4a20', hover: '#8a5228', border: '#5a3418' },
                  { label: 'ABANDONED PROPERTY', action: handleAbandon, bg: '#6a2020', hover: '#7a2828', border: '#4a1818' }
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} style={{
                    background: btn.bg,
                    border: `3px solid ${btn.border}`,
                    color: '#e8e0c0',
                    padding: '10px 16px',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif',
                    textTransform: 'uppercase',
                    transition: 'background 0.2s, transform 0.1s',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = btn.hover; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = btn.bg; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >{btn.label}</button>
                ))}
              </div>
            )}

            {activeAction && (
              <div style={{
                textAlign: 'center',
                color: '#3a3a2a',
                fontSize: '11px',
                letterSpacing: '3px',
                padding: '10px',
                animation: 'blink-cursor 1s infinite'
              }}>
                PROCESSING...
              </div>
            )}

            {phase === 'done' && (
              <div style={{ textAlign: 'center', color: '#3a3a2a', fontSize: '11px', letterSpacing: '2px', padding: '10px' }}>
                WINDOW CLOSED — HAVE A GOOD REMAINDER OF YOUR LIFE
              </div>
            )}
          </div>
        </div>

        {/* Claim tag / Item card */}
        {(phase === 'viewing' || phase === 'transitioning' || activeAction) && currentIndex < 7 && (
          <div style={{
            marginTop: '24px',
            background: '#f0e8c0',
            border: '2px solid #c8b060',
            borderRadius: '2px',
            padding: '24px 28px',
            position: 'relative',
            boxShadow: '2px 3px 12px rgba(0,0,0,0.2)',
            opacity: itemVisible ? 1 : 0,
            transform: itemSliding ? 'translateX(120%)' : itemVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: itemSliding ? 'transform 1.2s ease, opacity 0.8s ease' : 'opacity 0.4s ease, transform 0.4s ease',
            overflow: 'hidden'
          }}>
            {/* Hole punch */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid #c8b060',
              background: '#b8c4a0'
            }} />

            {/* Tag header */}
            <div style={{
              borderBottom: '1px solid #c8b060',
              paddingBottom: '12px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#8a7840', textTransform: 'uppercase', marginBottom: '4px' }}>
                  MUNICIPAL DEPT. OF TEMPORAL MISPLACEMENT
                </div>
                <div style={{ fontSize: '13px', letterSpacing: '1px', color: '#2a2010', fontWeight: 'bold' }}>
                  UNCLAIMED ITEM — TAG #{currentSelf.ticketNum}
                </div>
              </div>
            </div>

            {/* Tag fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '8px', letterSpacing: '3px', color: '#8a7840', textTransform: 'uppercase', marginBottom: '4px' }}>DESCRIPTION</div>
                <div style={{ fontSize: '13px', color: '#2a2010', lineHeight: '1.6', fontStyle: 'italic' }}>{currentSelf.description}</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', letterSpacing: '3px', color: '#8a7840', textTransform: 'uppercase', marginBottom: '4px' }}>FOUND LOCATION</div>
                <div style={{ fontSize: '13px', color: '#2a2010', lineHeight: '1.6' }}>{currentSelf.foundLocation}</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', letterSpacing: '3px', color: '#8a7840', textTransform: 'uppercase', marginBottom: '4px' }}>CONDITION REPORT</div>
                <div style={{ fontSize: '13px', color: '#2a2010', lineHeight: '1.6' }}>{currentSelf.condition}</div>
              </div>
              {activeAction === 'donating' && (
                <div>
                  <div style={{ fontSize: '8px', letterSpacing: '3px', color: '#8a7840', textTransform: 'uppercase', marginBottom: '4px' }}>DONATION DESTINATION</div>
                  <div style={{ fontSize: '12px', color: '#5a4020', lineHeight: '1.6', fontStyle: 'italic' }}>{currentSelf.donationAddress}</div>
                </div>
              )}
            </div>

            {/* Stamp overlay */}
            {stampVisible && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-15deg)',
                border: `4px solid ${stampText === 'ABANDONED PROPERTY' ? '#8b0000' : '#8b4513'}`,
                padding: '8px 16px',
                color: stampText === 'ABANDONED PROPERTY' ? '#8b0000' : '#8b4513',
                fontSize: '16px',
                letterSpacing: '3px',
                fontWeight: 'bold',
                opacity: 0.85,
                animation: 'stamp-drop 0.4s ease forwards',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase'
              }}>
                {stampText}
              </div>
            )}
          </div>
        )}

        {/* Disposition ledger */}
        {Object.keys(dispositions).length > 0 && (
          <div style={{
            marginTop: '20px',
            background: '#e8e0c0',
            border: '1px solid #c8b060',
            padding: '16px 20px'
          }}>
            <div style={{ fontSize: '8px', letterSpacing: '3px', color: '#6a5830', textTransform: 'uppercase', marginBottom: '12px' }}>
              DISPOSITION LEDGER
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.entries(dispositions).map(([idx, disp]) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 0',
                  borderBottom: '1px dotted #c8b060'
                }}>
                  <span style={{ fontSize: '11px', color: '#4a3820' }}>
                    Tag #{FUTURE_SELVES[parseInt(idx)].ticketNum} — {FUTURE_SELVES[parseInt(idx)].foundLocation.split(',')[0]}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    letterSpacing: '2px',
                    color: getStampColor(disp),
                    fontWeight: 'bold'
                  }}>
                    {getStampLabel(disp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final reveal */}
        {finalReveal && (
          <div style={{
            marginTop: '30px',
            background: '#f0e8c0',
            border: '3px solid #4a5240',
            padding: '32px',
            textAlign: 'center',
            animation: 'fade-in-up 1.2s ease forwards, final-glow 2s ease 1.2s forwards',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#8a7840', textTransform: 'uppercase', marginBottom: '20px' }}>
              END OF UNCLAIMED ITEMS — CASE CLOSED
            </div>
            <div style={{ fontSize: '15px', color: '#2a2010', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '24px' }}>
              Seven versions of you have been processed.<br />
              One of them said something true.<br />
              You already know which one.
            </div>
            <div style={{
              borderTop: '1px solid #c8b060',
              paddingTop: '20px',
              fontSize: '11px',
              color: '#6a5830',
              letterSpacing: '1px',
              lineHeight: '1.8'
            }}>
              The coat has been returned to its owner.<br />
              <span style={{ fontSize: '10px', color: '#8a7840' }}>
                Thank you for visiting the Municipal Department of Temporal Misplacement.<br />
                We are open whenever you are between one version of yourself and the next.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}