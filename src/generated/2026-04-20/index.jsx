import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [phase, setPhase] = useState('waiting');
  const [ticketNumber, setTicketNumber] = useState(0);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [takeNumber, setTakeNumber] = useState(1);
  const [directorNote, setDirectorNote] = useState('');
  const [displayedNote, setDisplayedNote] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [noteScrolling, setNoteScrolling] = useState(false);
  const [callbackVisible, setCallbackVisible] = useState(false);
  const [chairWarm, setChairWarm] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [goingQuiet, setGoingQuiet] = useState(false);
  const [quietDots, setQuietDots] = useState('');
  const typewriterRef = useRef(null);
  const quietRef = useRef(null);

  const stageDirections = [
    {
      text: 'Subject pauses before answering. The pause is slightly too long. Subject is aware of the pause. Subject is aware of being aware of the pause.',
      responses: [
        'Pause. Mean it.',
        'Pause. But make it look like thinking.',
        'Pause. Forget you were supposed to.'
      ]
    },
    {
      text: 'Subject laughs slightly too late. The laugh lands after the moment has passed. Subject adjusts. Subject does not acknowledge the adjustment.',
      responses: [
        'Laugh. Right on time for once.',
        'Laugh. A beat behind. Classic.',
        'Laugh. Then wonder why.'
      ]
    },
    {
      text: 'Subject checks phone for a reason that has already changed by the time the phone is unlocked. Subject does not find what they were looking for. Subject was not looking for anything.',
      responses: [
        'Check phone. Urgently.',
        'Check phone. Casually. Too casually.',
        'Check phone. Put it away. Check it again.'
      ]
    },
    {
      text: 'Subject does the thing with their hands. Subject is not sure what the thing is, exactly. Others have mentioned it. Subject has tried to stop. The hands continue.',
      responses: [
        'Do the thing. Consciously.',
        'Do the thing. Without knowing.',
        'Try not to do the thing. Do the thing.'
      ]
    },
    {
      text: 'Subject begins a sentence and trails off. Subject believed, at the start of the sentence, that it was going somewhere. Subject is no longer certain. The room waits.',
      responses: [
        'Finish the sentence. Somehow.',
        'Trail off. Own it.',
        'Trail off. Pretend that was the point.'
      ]
    },
    {
      text: 'Subject is in a room full of people. Subject is performing being fine with being in a room full of people. The performance is convincing. Subject finds the performance exhausting.',
      responses: [
        'Be fine. Actually.',
        'Perform being fine. Perfectly.',
        'Be fine. Wonder if you are.'
      ]
    },
    {
      text: 'Subject lies down at the end of the day and reviews the record. The record is incomplete. Several scenes are missing. Subject cannot tell if this is normal. Subject decides it is normal. Subject is not sure.',
      responses: [
        'Review the record. Accept it.',
        'Review the record. Edit nothing.',
        'Review the record. Close it.'
      ]
    }
  ];

  const directorNotes = [
    [
      'Good. Again, but this time — mean it.',
      'Once more. Less performed.',
      'Again. But as if no one is watching.',
      'Try it without the awareness.',
      'Once more. Less you.',
      'Again. The other one.',
      '...'
    ],
    [
      'Mmhm. Again, but land it.',
      'Once more. A little less late.',
      'Again. As if the moment never passed.',
      'Try it like you don\'t know what a moment is.',
      'Once more. Less correction.',
      'Again. The one who doesn\'t adjust.',
      '...'
    ],
    [
      'Good. Once more, but you know why.',
      'Again. But stay on the screen this time.',
      'Once more. As if you found something.',
      'Try it like the phone is empty.',
      'Once more. Less reaching.',
      'Again. The one who doesn\'t check.',
      '...'
    ],
    [
      'Good. Again. This time — no hands.',
      'Once more. The hands are fine. The hands are a choice.',
      'Again. But know what you\'re doing.',
      'Try it like the hands belong to you.',
      'Once more. Never mind the hands.',
      'Again. Can we see the one who doesn\'t do that.',
      '...'
    ],
    [
      'Good. Finish the sentence.',
      'Once more. Know where it goes.',
      'Again. But arrive somewhere.',
      'Try it like the sentence has been waiting.',
      'Once more. Less ellipsis.',
      'Again. The one who finishes things.',
      '...'
    ],
    [
      'Good. Again. Actually fine this time.',
      'Once more. Drop the performance.',
      'Again. As if you\'ve always been fine.',
      'Try it without the monitoring.',
      'Once more. Less maintenance.',
      'Again. The one who doesn\'t track it.',
      '...'
    ],
    [
      'Good. Again. Accept the gaps.',
      'Once more. Don\'t edit.',
      'Again. The record is what it is.',
      'Try it without the review.',
      'Once more. Less accounting.',
      'Again. The one who doesn\'t check.',
      '...'
    ]
  ];

  useEffect(() => {
    setTicketNumber(Math.floor(Math.random() * 900) + 100);
    const timer = setTimeout(() => setChairWarm(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let blink = setInterval(() => setCursorBlink(c => !c), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    if (!directorNote) return;
    setDisplayedNote('');
    setNoteScrolling(true);
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    let i = 0;
    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayedNote(directorNote.slice(0, i));
      if (i >= directorNote.length) {
        clearInterval(typewriterRef.current);
        setNoteScrolling(false);
      }
    }, 38);
    return () => clearInterval(typewriterRef.current);
  }, [directorNote]);

  useEffect(() => {
    if (callbackVisible) {
      document.title = 'a strong candidate';
      const existing = document.querySelector("link[rel*='icon']");
      const link = existing || document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      const svgFace = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <rect width='100' height='100' fill='#F5F4EE'/>
        <circle cx='50' cy='50' r='40' fill='none' stroke='#555' stroke-width='4'/>
        <circle cx='38' cy='44' r='5' fill='#555'/>
        <circle cx='62' cy='44' r='5' fill='#555'/>
        <path d='M 35 63 Q 50 72 65 63' fill='none' stroke='#555' stroke-width='3' stroke-linecap='round'/>
      </svg>`;
      link.href = 'data:image/svg+xml,' + encodeURIComponent(svgFace);
      if (!existing) document.head.appendChild(link);
    }
  }, [callbackVisible]);

  const handleTakeNumber = () => {
    setPhase('reading');
  };

  const handleResponseSelect = (index) => {
    if (selectedResponse !== null || noteScrolling) return;
    setSelectedResponse(index);
    const note = directorNotes[currentDirection][takeNumber - 1];

    if (takeNumber === 7) {
      setGoingQuiet(true);
      setDirectorNote(note);
      let dots = 0;
      if (quietRef.current) clearInterval(quietRef.current);
      quietRef.current = setInterval(() => {
        dots++;
        setQuietDots('.'.repeat(dots % 4));
        if (dots >= 12) {
          clearInterval(quietRef.current);
          setTimeout(() => {
            setGoingQuiet(false);
            setCallbackVisible(true);
          }, 1200);
        }
      }, 300);
    } else {
      setDirectorNote(note);
    }
  };

  const handleAgain = () => {
    if (noteScrolling) return;
    if (takeNumber < 7) {
      setTakeNumber(t => t + 1);
      setSelectedResponse(null);
      setDirectorNote('');
      setDisplayedNote('');
    } else if (currentDirection < stageDirections.length - 1) {
      setCurrentDirection(d => d + 1);
      setTakeNumber(1);
      setSelectedResponse(null);
      setDirectorNote('');
      setDisplayedNote('');
    }
  };

  const handleCheckPhone = () => {
    setCallbackVisible(false);
    setPhase('waiting');
    setCurrentDirection(0);
    setTakeNumber(1);
    setSelectedResponse(null);
    setDirectorNote('');
    setDisplayedNote('');
    setChairWarm(false);
    setGoingQuiet(false);
    setQuietDots('');
    document.title = 'Audition for the Role of Yourself';
    setTimeout(() => setChairWarm(true), 800);
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F5F4EE',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontFamily: '"Courier New", Courier, monospace',
    color: '#3A3A3A',
    padding: '60px 20px',
    boxSizing: 'border-box'
  };

  const columnStyle = {
    maxWidth: '560px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px'
  };

  if (callbackVisible) {
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
        <div style={{ ...columnStyle, gap: '32px', animation: 'fadeInUp 1.2s ease both' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase' }}>
            CASTING NOTICE
          </div>
          <div style={{
            border: '1px solid #C8C4B4',
            padding: '36px',
            backgroundColor: '#FAFAF6'
          }}>
            <div style={{ fontSize: '13px', lineHeight: '2', color: '#444' }}>
              <div style={{ marginBottom: '24px', fontSize: '11px', color: '#999', letterSpacing: '0.15em' }}>
                RE: YOUR AUDITION — TICKET #{ticketNumber}
              </div>
              <p style={{ margin: '0 0 20px 0' }}>
                Thank you for coming in today.
              </p>
              <p style={{ margin: '0 0 20px 0' }}>
                After careful consideration, the role of <strong>yourself</strong> in this production has been offered to a strong candidate with more availability.
              </p>
              <p style={{ margin: '0 0 20px 0' }}>
                The candidate was compelling. The candidate had range. The candidate did not do the thing with their hands.
              </p>
              <p style={{ margin: '0 0 32px 0', color: '#888' }}>
                We will keep your materials on file.
              </p>
              <div style={{
                borderTop: '1px solid #E0DDD4',
                paddingTop: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#D4C84A',
                  border: '1px solid #B8AD38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  animation: 'pulse 3s ease infinite'
                }}>
                  🙂
                </div>
                <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.8' }}>
                  THE CANDIDATE<br />
                  <span style={{ color: '#555' }}>a strong candidate</span><br />
                  <span style={{ color: '#999', fontSize: '10px' }}>headshot on file</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckPhone}
            style={{
              background: 'none',
              border: '1px solid #C8C4B4',
              padding: '14px 24px',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '12px',
              color: '#777',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              alignSelf: 'flex-start',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#888'; e.target.style.color = '#444'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#C8C4B4'; e.target.style.color = '#777'; }}
          >
            CHECK YOUR PHONE
          </button>
          <div style={{ fontSize: '10px', color: '#BBB', letterSpacing: '0.15em' }}>
            (this will not help)
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'waiting') {
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            92% { opacity: 1; }
            93% { opacity: 0.85; }
            94% { opacity: 1; }
            97% { opacity: 0.9; }
            98% { opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #D4C84A 0%, #E8DC5A 50%, #D4C84A 100%)',
          animation: 'flicker 4s ease infinite'
        }} />
        <div style={{ ...columnStyle, gap: '48px' }}>
          <div style={{ animation: 'fadeIn 0.8s ease both' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#AAA', textTransform: 'uppercase', marginBottom: '8px' }}>
              OPEN CALL
            </div>
            <div style={{ fontSize: '22px', letterSpacing: '0.05em', color: '#2A2A2A', lineHeight: '1.4' }}>
              Audition for the Role<br />of Yourself
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '12px', letterSpacing: '0.1em' }}>
              An unnamed production. No prior experience necessary.
            </div>
          </div>

          <div style={{
            borderLeft: '3px solid #D4C84A',
            paddingLeft: '20px',
            animation: 'fadeIn 1.2s ease 0.4s both',
            opacity: 0
          }}>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '2', letterSpacing: '0.05em' }}>
              <div>LOCATION: This room</div>
              <div>TIME: Now</div>
              <div>ROLE: Self (featured)</div>
              <div>SIDES: Provided on arrival</div>
              <div style={{ marginTop: '8px', color: '#AAA', fontSize: '11px' }}>
                The casting director has no notes.<br />
                The casting director is also you.<br />
                {chairWarm && (
                  <span style={{ animation: 'slideIn 0.6s ease both' }}>
                    The chair is already warm.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ animation: 'fadeIn 1.2s ease 0.8s both', opacity: 0 }}>
            <div
              onClick={handleTakeNumber}
              style={{
                display: 'inline-block',
                border: '2px solid #D4C84A',
                backgroundColor: '#FAFAF0',
                padding: '24px 32px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                userSelect: 'none'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0EDD0'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FAFAF0'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#888', marginBottom: '8px' }}>
                TAKE A NUMBER
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2A2A2A', lineHeight: 1 }}>
                {ticketNumber}
              </div>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#AAA', marginTop: '8px' }}>
                CLICK TO PROCEED
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '10px',
            color: '#CCC',
            letterSpacing: '0.15em',
            animation: 'fadeIn 1.2s ease 1.4s both',
            opacity: 0
          }}>
            PLEASE SILENCE YOUR PHONE. (YOU WON'T.)
          </div>
        </div>
      </div>
    );
  }

  const direction = stageDirections[currentDirection];
  const progressText = `DIRECTION ${currentDirection + 1} OF ${stageDirections.length} — TAKE ${takeNumber}`;

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.85; }
          94% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #D4C84A 0%, #E8DC5A 50%, #D4C84A 100%)',
        animation: 'flicker 4s ease infinite'
      }} />

      <div style={{ ...columnStyle, gap: '40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', animation: 'fadeIn 0.5s ease both' }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#AAA' }}>
              {progressText}
            </div>
          </div>
          <div style={{
            border: '1px solid #D4C84A',
            padding: '4px 10px',
            fontSize: '10px',
            color: '#888',
            letterSpacing: '0.1em'
          }}>
            #{ticketNumber}
          </div>
        </div>

        {/* Stage Direction */}
        <div style={{
          borderLeft: '3px solid #C8C4B4',
          paddingLeft: '20px',
          animation: 'fadeIn 0.6s ease 0.2s both',
          opacity: 0
        }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#AAA', marginBottom: '12px' }}>
            STAGE DIRECTION
          </div>
          <div style={{
            fontSize: '13px',
            lineHeight: '2',
            color: '#444',
            letterSpacing: '0.03em'
          }}>
            {direction.text}
          </div>
        </div>

        {/* Response Options */}
        <div style={{ animation: 'fadeIn 0.6s ease 0.4s both', opacity: 0 }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#AAA', marginBottom: '16px' }}>
            PERFORM THE DIRECTION
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {direction.responses.map((response, i) => {
              const isSelected = selectedResponse === i;
              const isDisabled = selectedResponse !== null && !isSelected;
              return (
                <button
                  key={i}
                  onClick={() => handleResponseSelect(i)}
                  disabled={selectedResponse !== null}
                  style={{
                    background: isSelected ? '#F0EDD0' : '#FAFAF6',
                    border: isSelected ? '1px solid #D4C84A' : '1px solid #DEDAD0',
                    padding: '14px 18px',
                    textAlign: 'left',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '12px',
                    color: isDisabled ? '#CCC' : isSelected ? '#2A2A2A' : '#555',
                    cursor: selectedResponse !== null ? 'default' : 'pointer',
                    letterSpacing: '0.05em',
                    lineHeight: '1.5',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={e => {
                    if (selectedResponse === null) {
                      e.currentTarget.style.borderColor = '#B8AD38';
                      e.currentTarget.style.backgroundColor = '#F5F2DC';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedResponse === null) {
                      e.currentTarget.style.borderColor = '#DEDAD0';
                      e.currentTarget.style.backgroundColor = '#FAFAF6';
                    }
                  }}
                >
                  <span style={{ color: isSelected ? '#D4C84A' : '#CCC', fontSize: '10px', minWidth: '16px' }}>
                    {isSelected ? '▶' : `${i + 1}.`}
                  </span>
                  {response}
                </button>
              );
            })}
          </div>
        </div>

        {/* Director Note */}
        {(displayedNote || noteScrolling) && (
          <div style={{
            border: '1px solid #DEDAD0',
            backgroundColor: '#F8F7F2',
            padding: '20px 24px',
            animation: 'slideIn 0.4s ease both'
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#AAA', marginBottom: '12px' }}>
              DIRECTOR'S NOTE
            </div>
            <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.8', letterSpacing: '0.04em' }}>
              {displayedNote}
              {goingQuiet && quietDots && (
                <span style={{ color: '#D4C84A' }}>{quietDots}</span>
              )}
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '13px',
                backgroundColor: '#D4C84A',
                marginLeft: '2px',
                verticalAlign: 'middle',
                animation: 'blink 1s step-end infinite',
                opacity: noteScrolling ? 1 : (cursorBlink ? 1 : 0)
              }} />
            </div>
          </div>
        )}

        {/* Again Button */}
        {selectedResponse !== null && !noteScrolling && !goingQuiet && !callbackVisible && (
          <div style={{ animation: 'slideIn 0.4s ease both' }}>
            {(takeNumber < 7 || currentDirection < stageDirections.length - 1) ? (
              <button
                onClick={handleAgain}
                style={{
                  background: 'none',
                  border: '1px solid #C8C4B4',
                  padding: '12px 28px',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '11px',
                  color: '#666',
                  cursor: 'pointer',
                  letterSpacing: '0.15em',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#888'; e.target.style.color = '#333'; e.target.style.backgroundColor = '#F0EDD0'; }}
                onMouseLeave={e => { e.target.style.borderColor = '#C8C4B4'; e.target.style.color = '#666'; e.target.style.backgroundColor = 'transparent'; }}
              >
                {takeNumber < 7 ? 'AGAIN' : 'CONTINUE'}
              </button>
            ) : null}
          </div>
        )}

        {/* Going quiet indicator */}
        {goingQuiet && (
          <div style={{ fontSize: '11px', color: '#CCC', letterSpacing: '0.15em', animation: 'fadeIn 0.5s ease both' }}>
            the director has gone quiet{quietDots}
          </div>
        )}

        {/* Take indicator dots */}
        <div style={{ display: 'flex', gap: '6px', paddingTop: '8px' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: i < takeNumber - 1 ? '#D4C84A' : i === takeNumber - 1 ? '#888' : '#E0DDD4',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
          <div style={{ fontSize: '9px', color: '#CCC', letterSpacing: '0.1em', marginLeft: '8px', lineHeight: '6px' }}>
            TAKES
          </div>
        </div>
      </div>
    </div>
  );
}