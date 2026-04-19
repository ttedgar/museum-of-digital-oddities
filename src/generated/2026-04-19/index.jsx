import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const FLOOR_BUTTONS = [
  { label: 'W', id: 'W' },
  { label: '0.5', id: '0.5' },
  { label: 'BEFORE', id: 'BEFORE' },
  { label: 'THE ONE\nYOU MEANT', id: 'THE_ONE' },
  { label: '∅', id: 'NULL' },
  { label: 'SOON', id: 'SOON' },
  { label: '13A', id: '13A' },
  { label: 'ALMOST', id: 'ALMOST' },
];

const LOBBY_SCENES = {
  W: {
    title: 'FLOOR W',
    description: 'A waiting room. Twelve versions of you sit in orange plastic chairs. None of them look up. They are all reading the same magazine from 1987. The cover story is about you specifically but the byline is your name misspelled by one letter. The carpet smells like the inside of every waiting room you have ever been in simultaneously.',
    detail: 'One of them is wearing your exact shoes. They have been here since before shoes were invented.',
    atmosphereColor: 'rgba(180, 120, 60, 0.18)',
    borderColor: '#8B6914',
  },
  '0.5': {
    title: 'FLOOR 0.5',
    description: 'A hallway that is only Tuesday afternoons, specifically the ones between 2:15 and 2:47 PM. The light here is the precise color of homework you forgot to do. A water fountain runs with something that is almost water. At the end of the hallway there is a door. The door is not for you. You already know this.',
    detail: 'The clock on the wall shows 2:31 PM. It has always shown 2:31 PM. It will continue to show 2:31 PM after the concept of time has been refiled under a different category.',
    atmosphereColor: 'rgba(100, 130, 180, 0.18)',
    borderColor: '#4466AA',
  },
  BEFORE: {
    title: 'FLOOR BEFORE',
    description: 'This is the lobby of the building before the building was decided. The front desk is made of something that became wood later. A receptionist is staffed by the concept of "almost" — she has your mother\'s hands but no face you can hold onto. She is about to tell you something. She has been about to tell you something since the first morning.',
    detail: 'There is a guest book. Your name is already in it. The ink is still wet.',
    atmosphereColor: 'rgba(60, 80, 60, 0.22)',
    borderColor: '#446644',
  },
  THE_ONE: {
    title: 'FLOOR: THE ONE YOU MEANT',
    description: 'You recognize this floor. You have never been here. It is the exact place you were trying to get to when you took a wrong turn in 2009 and ended up somewhere that turned out fine actually but. The hallway continues in a direction that is not a cardinal direction. Someone has left a coat on a chair. You know whose coat it is.',
    detail: 'The coat is warm. Someone just left.',
    atmosphereColor: 'rgba(140, 80, 140, 0.18)',
    borderColor: '#885588',
  },
  NULL: {
    title: 'FLOOR ∅',
    description: 'The lobby of the empty set. There is nothing here except the shape of where things would be. The air has the texture of a held breath. A sign reads RECEPTION but the desk is the idea of a desk and behind it sits the idea of a person who almost knows you. They gesture toward chairs that are the concept of chairs. You feel, for a moment, perfectly understood.',
    detail: 'The silence here is not empty. It is full of everything that was never said.',
    atmosphereColor: 'rgba(20, 20, 40, 0.35)',
    borderColor: '#334466',
  },
  SOON: {
    title: 'FLOOR SOON',
    description: 'A lobby perpetually five minutes from opening. The lights are on but the chairs still have plastic wrap. The elevator directory lists floors that include your future address. A janitor mops the floor in slow circles — she is mopping up something that hasn\'t spilled yet. She nods at you like she has been expecting this specific inconvenience.',
    detail: 'The directory lists your name on the 7th floor under OCCUPANT (PENDING).',
    atmosphereColor: 'rgba(160, 140, 80, 0.18)',
    borderColor: '#AA9933',
  },
  '13A': {
    title: 'FLOOR 13A',
    description: 'The floor between 13 and 14 that no building admits to. A corridor of doors, each labeled with a date you almost remember. One door is ajar. Through the gap: a kitchen, late at night, someone standing at the counter with their back to you. The refrigerator hums a frequency you felt as a child. You could call out. You do not call out.',
    detail: 'The door is always slightly more ajar than the last time you checked.',
    atmosphereColor: 'rgba(100, 60, 60, 0.22)',
    borderColor: '#774444',
  },
  ALMOST: {
    title: 'FLOOR ALMOST',
    description: 'A lobby that is nearly complete. The chandeliers are on but one bulb is always about to go. The front desk has a bell but the bell produces no sound — only the feeling that a sound has just ended. A man at the desk looks exactly like someone you trust. He says: "We\'ve been holding your reservation." He slides a key card across the counter. The room number is a feeling.',
    detail: 'The key card is warm. The room is on a floor this elevator does not visit.',
    atmosphereColor: 'rgba(80, 100, 120, 0.22)',
    borderColor: '#556677',
  },
};

const CLOSING_SCENES = [
  { text: 'As the doors close, you see: the waiting room chairs are now empty. The magazines are open to the page about you. The photographs have been removed from the frames.' },
  { text: 'As the doors close, you see: the hallway has rearranged itself. The door at the end is now behind you. The water fountain has stopped.' },
  { text: 'As the doors close, you see: the receptionist has turned around. You cannot see her face. You are not sure you want to.' },
  { text: 'As the doors close, you see: the coat on the chair is gone. The chair is still warm. There are footprints leading toward the elevator.' },
  { text: 'As the doors close, you see: the lobby of the empty set now contains one thing. It is looking at you.' },
  { text: 'As the doors close, you see: the plastic wrap is gone from the chairs. Someone has been sitting in them. Recently.' },
  { text: 'As the doors close, you see: the kitchen door is fully open now. The person at the counter has turned around. The doors finish closing before you can see their face.' },
  { text: 'As the doors close, you see: the man at the desk is gone. The key card is still on the counter. There is a second key card now. It has your name on it.' },
];

const PHONE_MESSAGES = [
  'You have reached — I\'m sorry, I almost said your name.',
  'We spoke before. Not recently. Not in this context.',
  'I keep your number under a category I can\'t explain to anyone else.',
  'The building has a record of you. Several records, actually. Some of them are from before.',
  'Don\'t worry about the floor. The floor is not the point.',
  'I recognize your voice from something that hasn\'t happened yet.',
  'There is a message for you from someone who couldn\'t stay. I\'m holding it. It\'s warm.',
  'If you find the room — and I think you will — don\'t knock. Just stand there. They already know.',
  'I\'m sorry. I thought you were someone else. I think that\'s still true.',
];

const INDICATOR_LABELS = [
  '??', 'W', '∅', '0.5', 'SOON', '—', '13A', 'BEFORE', '∞', 'THE ONE', 'ALMOST', 'HERE', 'THERE', 'THEN', 'WHICH', '0', 'WAIT', 'BETWEEN', 'AFTER', 'NOT YET',
];

export default function Page() {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [lobbyScene, setLobbyScene] = useState(null);
  const [doorClosingScene, setDoorClosingScene] = useState(null);
  const [phoneActive, setPhoneActive] = useState(false);
  const [phoneMessageIndex, setPhoneMessageIndex] = useState(0);
  const [indicatorHistory, setIndicatorHistory] = useState([]);
  const [currentIndicator, setCurrentIndicator] = useState('—');
  const [flickerState, setFlickerState] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(null);
  const [doorsTransition, setDoorsTransition] = useState('idle');
  const [closingReveal, setClosingReveal] = useState(false);
  const [hoveredLobby, setHoveredLobby] = useState(false);
  const [pressedControl, setPressedControl] = useState(null);

  const flickerRef = useRef(null);
  const phoneRef = useRef(null);
  const closingTimeoutRef = useRef(null);

  const getNextIndicator = useCallback((history) => {
    const available = INDICATOR_LABELS.filter(l => !history.includes(l));
    if (available.length === 0) return INDICATOR_LABELS[Math.floor(Math.random() * INDICATOR_LABELS.length)];
    return available[Math.floor(Math.random() * available.length)];
  }, []);

  useEffect(() => {
    const runFlicker = () => {
      const delay = Math.random() * 320 + 80;
      flickerRef.current = setTimeout(() => {
        if (doorsTransition !== 'idle') {
          setFlickerState(s => !s);
        } else {
          setFlickerState(true);
        }
        runFlicker();
      }, delay);
    };
    runFlicker();
    return () => clearTimeout(flickerRef.current);
  }, [doorsTransition]);

  useEffect(() => {
    if (phoneActive) {
      phoneRef.current = setInterval(() => {
        setPhoneMessageIndex(i => i + 1);
      }, 3200);
    } else {
      clearInterval(phoneRef.current);
    }
    return () => clearInterval(phoneRef.current);
  }, [phoneActive]);

  const openDoors = useCallback((floorId) => {
    if (doorsTransition !== 'idle') return;
    clearTimeout(closingTimeoutRef.current);
    setClosingReveal(false);
    setDoorClosingScene(null);

    const newIndicator = getNextIndicator(indicatorHistory);
    setIndicatorHistory(h => [...h, newIndicator]);
    setCurrentIndicator(newIndicator);
    setDoorsTransition('opening');

    setTimeout(() => {
      setDoorsOpen(true);
      setLobbyScene(LOBBY_SCENES[floorId] || LOBBY_SCENES['W']);
      setDoorsTransition('idle');
    }, 1100);
  }, [doorsTransition, indicatorHistory, getNextIndicator]);

  const closeDoors = useCallback(() => {
    if (doorsTransition !== 'idle') return;
    if (!doorsOpen) return;
    setDoorsTransition('closing');

    const randomClosing = CLOSING_SCENES[Math.floor(Math.random() * CLOSING_SCENES.length)];

    closingTimeoutRef.current = setTimeout(() => {
      setClosingReveal(true);
      setDoorClosingScene(randomClosing);
    }, 600);

    closingTimeoutRef.current = setTimeout(() => {
      setDoorsOpen(false);
      setClosingReveal(false);
      setDoorClosingScene(null);
      setDoorsTransition('idle');
    }, 1400);
  }, [doorsTransition, doorsOpen]);

  const handleFloorButton = (id) => {
    if (doorsTransition !== 'idle') return;
    setButtonPressed(id);
    setTimeout(() => setButtonPressed(null), 300);

    if (doorsOpen) {
      closeDoors();
      setTimeout(() => {
        setSelectedButton(id);
        openDoors(id);
      }, 1600);
    } else {
      setSelectedButton(id);
      openDoors(id);
    }
  };

  const handleDoorOpen = () => {
    if (doorsTransition !== 'idle') return;
    setPressedControl('open');
    setTimeout(() => setPressedControl(null), 300);
    if (!doorsOpen && selectedButton) {
      openDoors(selectedButton);
    } else if (doorsOpen && lobbyScene) {
      setLobbyScene(s => s ? { ...s, description: s.description + ' The doors have opened again. Something has shifted slightly.' } : s);
    }
  };

  const handleDoorClose = () => {
    if (doorsTransition !== 'idle') return;
    setPressedControl('close');
    setTimeout(() => setPressedControl(null), 300);
    closeDoors();
  };

  const handlePhone = () => {
    setPhoneActive(p => !p);
    if (!phoneActive) setPhoneMessageIndex(0);
  };

  const doorOpenPercent = doorsOpen ? 50 : (doorsTransition === 'opening' ? 50 : 0);
  const doorClosePercent = (doorsTransition === 'closing') ? 50 : (doorsOpen ? 50 : 0);

  const leftDoorTranslate = doorsOpen ? '-50%' : doorsTransition === 'opening' ? '-50%' : doorsTransition === 'closing' ? '0%' : '0%';
  const rightDoorTranslate = doorsOpen ? '50%' : doorsTransition === 'opening' ? '50%' : doorsTransition === 'closing' ? '0%' : '0%';

  const doorTransitionStyle = doorsTransition !== 'idle' ? 'transform 1.1s cubic-bezier(0.4,0,0.2,1)' : 'transform 1.1s cubic-bezier(0.4,0,0.2,1)';

  const indicatorOpacity = flickerState ? 1 : (Math.random() > 0.5 ? 0.3 : 0.7);

  const woodGradient = `repeating-linear-gradient(
    92deg,
    rgba(60,30,10,0.0) 0px,
    rgba(80,40,15,0.08) 2px,
    rgba(60,30,10,0.0) 4px,
    rgba(100,55,20,0.06) 8px,
    rgba(60,30,10,0.0) 12px
  ), linear-gradient(180deg, #3B1F0A 0%, #5C2E0F 30%, #4A2208 60%, #3B1F0A 100%)`;

  const brassGradient = `linear-gradient(135deg, #DAA520 0%, #B8860B 40%, #FFD700 55%, #B8860B 70%, #8B6914 100%)`;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0603',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @keyframes flicker-bulb {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
          75% { opacity: 0.9; }
        }
        @keyframes pulse-phone {
          0%, 100% { box-shadow: 0 0 8px 2px rgba(184,134,11,0.5); }
          50% { box-shadow: 0 0 18px 6px rgba(184,134,11,0.9); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes static-noise {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        @keyframes door-light-flicker {
          0%, 90%, 100% { opacity: 1; }
          92% { opacity: 0.4; }
          95% { opacity: 0.8; }
          97% { opacity: 0.2; }
        }
        @keyframes float-text {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes lobby-appear {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
      `}</style>

      {/* Ambient room vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Ceiling light */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '300px', height: '120px',
        background: 'radial-gradient(ellipse at top, rgba(255,245,180,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0px',
      }}>

        {/* Title */}
        <div style={{
          color: '#C8A96E',
          fontSize: '11px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          marginBottom: '16px',
          opacity: 0.7,
          fontFamily: 'Georgia, serif',
        }}>
          UNSCHEDULED FLOORS — SERVICE ELEVATOR
        </div>

        {/* Main elevator body */}
        <div style={{
          width: '520px',
          background: woodGradient,
          border: '3px solid #8B6914',
          borderRadius: '4px',
          boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.4), 0 0 0 1px #DAA520',
          overflow: 'hidden',
          position: 'relative',
        }}>

          {/* Top trim */}
          <div style={{
            height: '8px',
            background: brassGradient,
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }} />

          {/* Floor indicator panel */}
          <div style={{
            background: '#1A0E05',
            borderBottom: '2px solid #8B6914',
            borderTop: '1px solid #DAA520',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Indicator display */}
            <div style={{
              background: '#0D0800',
              border: '2px solid #8B6914',
              borderRadius: '3px',
              padding: '8px 20px',
              minWidth: '100px',
              textAlign: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`,
                animation: 'static-noise 0.15s infinite',
                pointerEvents: 'none',
              }} />
              <div style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#FFB800',
                opacity: indicatorOpacity,
                transition: 'opacity 0.05s',
                textShadow: '0 0 8px #FFB800, 0 0 16px rgba(255,184,0,0.5)',
                letterSpacing: '0.1em',
                animation: 'door-light-flicker 8s infinite',
              }}>
                {currentIndicator}
              </div>
              <div style={{
                fontSize: '8px',
                color: '#8B6914',
                letterSpacing: '0.2em',
                marginTop: '2px',
                fontFamily: '"Courier New", monospace',
              }}>FLOOR</div>
            </div>

            {/* Art deco arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.6 }}>
              <div style={{ color: '#DAA520', fontSize: '16px', lineHeight: 1 }}>▲</div>
              <div style={{ color: '#DAA520', fontSize: '16px', lineHeight: 1, opacity: 0.3 }}>▼</div>
            </div>

            {/* Company plate */}
            <div style={{
              textAlign: 'right',
              color: '#8B6914',
              fontSize: '9px',
              letterSpacing: '0.15em',
              lineHeight: 1.6,
              fontFamily: '"Courier New", monospace',
            }}>
              <div style={{ color: '#DAA520', fontSize: '11px', marginBottom: '2px' }}>OTIS-∅</div>
              <div>CAPACITY: UNKNOWN</div>
              <div>MAX LOAD: ONE MEMORY</div>
            </div>
          </div>

          {/* Door viewport */}
          <div style={{
            height: '280px',
            position: 'relative',
            background: '#0A0603',
            overflow: 'hidden',
            borderBottom: '2px solid #5C2E0F',
          }}>

            {/* Lobby scene behind doors */}
            {(doorsOpen || doorsTransition === 'opening' || doorsTransition === 'closing') && (
              <div style={{
                position: 'absolute', inset: 0,
                background: closingReveal
                  ? 'rgba(5,5,8,1)'
                  : (lobbyScene ? lobbyScene.atmosphereColor : 'rgba(10,8,5,1)'),
                backgroundColor: '#050508',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                transition: 'background 0.6s ease',
              }}>
                {/* Atmosphere wash */}
                {lobbyScene && !closingReveal && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: lobbyScene.atmosphereColor,
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Lobby light flicker */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '200px', height: '80px',
                  background: 'radial-gradient(ellipse at top, rgba(255,245,200,0.12) 0%, transparent 70%)',
                  animation: 'flicker-bulb 4s infinite',
                  pointerEvents: 'none',
                }} />

                {closingReveal && doorClosingScene ? (
                  <div style={{
                    color: '#C8C8C8',
                    fontSize: '12px',
                    lineHeight: 1.8,
                    textAlign: 'center',
                    fontStyle: 'italic',
                    animation: 'lobby-appear 0.4s ease',
                    maxWidth: '380px',
                    position: 'relative', zIndex: 1,
                  }}>
                    {doorClosingScene.text}
                  </div>
                ) : lobbyScene ? (
                  <div
                    style={{
                      position: 'relative', zIndex: 1,
                      cursor: 'default',
                      animation: 'lobby-appear 0.8s ease',
                    }}
                    onMouseEnter={() => setHoveredLobby(true)}
                    onMouseLeave={() => setHoveredLobby(false)}
                  >
                    <div style={{
                      color: '#E8E0D0',
                      fontSize: '11px',
                      letterSpacing: '0.3em',
                      textAlign: 'center',
                      marginBottom: '10px',
                      borderBottom: `1px solid ${lobbyScene.borderColor}`,
                      paddingBottom: '8px',
                      textTransform: 'uppercase',
                    }}>
                      {lobbyScene.title}
                    </div>
                    <div style={{
                      color: hoveredLobby ? '#FFFFFF' : '#B0A898',
                      fontSize: '11.5px',
                      lineHeight: 1.85,
                      textAlign: 'center',
                      maxWidth: '400px',
                      transition: 'color 0.3s ease',
                    }}>
                      {hoveredLobby ? lobbyScene.detail : lobbyScene.description}
                    </div>
                    {hoveredLobby && (
                      <div style={{
                        position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)',
                        color: lobbyScene.borderColor,
                        fontSize: '9px',
                        letterSpacing: '0.2em',
                        whiteSpace: 'nowrap',
                        animation: 'float-text 2s infinite ease-in-out',
                      }}>
                        — look closer —
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Left door panel */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '50%', height: '100%',
              background: woodGradient,
              borderRight: '1px solid #8B6914',
              transform: `translateX(${doorsOpen ? '-100%' : doorsTransition === 'closing' ? '0%' : '0%'})`,
              transition: doorTransitionStyle,
              zIndex: 2,
              boxShadow: '4px 0 12px rgba(0,0,0,0.6)',
            }}>
              {/* Door detail lines */}
              {[0.2, 0.5, 0.8].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: `${pos * 100}%`,
                  left: '10%', right: '10%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.4), transparent)',
                }} />
              ))}
              <div style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '12px', height: '40px',
                background: brassGradient,
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }} />
            </div>

            {/* Right door panel */}
            <div style={{
              position: 'absolute',
              top: 0, right: 0,
              width: '50%', height: '100%',
              background: woodGradient,
              borderLeft: '1px solid #8B6914',
              transform: `translateX(${doorsOpen ? '100%' : doorsTransition === 'closing' ? '0%' : '0%'})`,
              transition: doorTransitionStyle,
              zIndex: 2,
              boxShadow: '-4px 0 12px rgba(0,0,0,0.6)',
            }}>
              {[0.2, 0.5, 0.8].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: `${pos * 100}%`,
                  left: '10%', right: '10%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.4), transparent)',
                }} />
              ))}
              <div style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '12px', height: '40px',
                background: brassGradient,
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }} />
            </div>

            {/* Door gap center line */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '2px', height: '100%',
              background: 'rgba(0,0,0,0.8)',
              zIndex: 3,
              opacity: doorsOpen ? 0 : 1,
              transition: 'opacity 0.5s',
            }} />
          </div>

          {/* Control panel */}
          <div style={{
            background: `repeating-linear-gradient(88deg, rgba(50,25,8,0.0) 0px, rgba(60,30,10,0.1) 1px, rgba(50,25,8,0.0) 2px), #2A1506`,
            padding: '20px',
            borderTop: '2px solid #8B6914',
          }}>

            {/* Floor buttons grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '16px',
            }}>
              {FLOOR_BUTTONS.map((btn) => {
                const isPressed = buttonPressed === btn.id;
                const isSelected = selectedButton === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => handleFloorButton(btn.id)}
                    style={{
                      background: isPressed
                        ? 'radial-gradient(circle, #FFD700 0%, #B8860B 100%)'
                        : isSelected
                        ? 'radial-gradient(circle, #DAA520 0%, #8B6914 100%)'
                        : 'radial-gradient(circle, #3A2010 0%, #1A0A03 100%)',
                      border: `2px solid ${isSelected ? '#FFD700' : '#8B6914'}`,
                      borderRadius: '50%',
                      width: '52px',
                      height: '52px',
                      cursor: 'pointer',
                      color: isSelected ? '#1A0A03' : '#DAA520',
                      fontSize: btn.label.length > 4 ? '6px' : btn.label.length > 2 ? '9px' : '14px',
                      fontFamily: 'Georgia, serif',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.2,
                      boxShadow: isSelected
                        ? '0 0 12px 4px rgba(218,165,32,0.6), inset 0 1px 0 rgba(255,255,255,0.2)'
                        : '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                      transform: isPressed ? 'scale(0.92)' : 'scale(1)',
                      transition: 'all 0.15s ease',
                      letterSpacing: '0.05em',
                      textShadow: isSelected ? 'none' : '0 0 4px rgba(218,165,32,0.4)',
                      justifySelf: 'center',
                    }}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Door control buttons + phone */}
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {/* Door open */}
              <button
                onClick={handleDoorOpen}
                style={{
                  background: pressedControl === 'open'
                    ? brassGradient
                    : 'linear-gradient(135deg, #2A1506 0%, #1A0A03 100%)',
                  border: '2px solid #8B6914',
                  borderRadius: '4px',
                  color: '#DAA520',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  transform: pressedControl === 'open' ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.15s',
                  flex: 1,
                }}
              >
                ◁▷{'\n'}DOOR OPEN
              </button>

              {/* Emergency phone */}
              <button
                onClick={handlePhone}
                style={{
                  background: phoneActive
                    ? 'linear-gradient(135deg, #8B6914 0%, #DAA520 100%)'
                    : 'linear-gradient(135deg, #1A0A03 0%, #0D0600 100%)',
                  border: `2px solid ${phoneActive ? '#FFD700' : '#8B6914'}`,
                  borderRadius: '50%',
                  width: '52px',
                  height: '52px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  animation: phoneActive ? 'pulse-phone 1.5s infinite' : 'none',
                  boxShadow: phoneActive
                    ? '0 0 16px 4px rgba(218,165,32,0.7)'
                    : '0 2px 6px rgba(0,0,0,0.6)',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                title="Emergency Phone"
              >
                ☎
              </button>

              {/* Door close */}
              <button
                onClick={handleDoorClose}
                style={{
                  background: pressedControl === 'close'
                    ? brassGradient
                    : 'linear-gradient(135deg, #2A1506 0%, #1A0A03 100%)',
                  border: '2px solid #8B6914',
                  borderRadius: '4px',
                  color: '#DAA520',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  transform: pressedControl === 'close' ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.15s',
                  flex: 1,
                }}
              >
                ▷◁{'\n'}DOOR CLOSE
              </button>
            </div>

            {/* Phone message display */}
            {phoneActive && (
              <div style={{
                marginTop: '14px',
                background: '#050300',
                border: '1px solid #8B6914',
                borderRadius: '3px',
                padding: '10px 14px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '2px',
                  background: 'rgba(255,184,0,0.1)',
                  animation: 'scanline 3s linear infinite',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  fontSize: '9px',
                  color: '#8B6914',
                  letterSpacing: '0.2em',
                  marginBottom: '6px',
                  fontFamily: '"Courier New", monospace',
                }}>
                  ● REC — LINE 1
                </div>
                <div style={{
                  color: '#FFB800',
                  fontSize: '11px',
                  lineHeight: 1.7,
                  fontFamily: '"Courier New", monospace',
                  textShadow: '0 0 6px rgba(255,184,0,0.4)',
                  animation: 'lobby-appear 0.4s ease',
                  key: phoneMessageIndex,
                }}>
                  "{PHONE_MESSAGES[phoneMessageIndex % PHONE_MESSAGES.length]}"
                </div>
                <div style={{
                  fontSize: '8px',
                  color: '#5C4010',
                  marginTop: '6px',
                  fontFamily: '"Courier New", monospace',
                  letterSpacing: '0.15em',
                }}>
                  — message {(phoneMessageIndex % PHONE_MESSAGES.length) + 1} of {PHONE_MESSAGES.length} —
                </div>
              </div>
            )}
          </div>

          {/* Bottom trim */}
          <div style={{
            height: '8px',
            background: brassGradient,
            boxShadow: '0 -2px 6px rgba(0,0,0,0.5)',
          }} />
        </div>

        {/* Bottom label */}
        <div style={{
          marginTop: '14px',
          color: '#5C4010',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textAlign: 'center',
          lineHeight: 2,
          fontFamily: '"Courier New", monospace',
        }}>
          IN CASE OF EMERGENCY, DO NOT PRESS ANYTHING<br />
          THIS ELEVATOR SERVICES FLOORS THAT HAVE BEEN WAITING FOR YOU SPECIFICALLY
        </div>
      </div>
    </div>
  );
}