import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [phase, setPhase] = useState('intro');
  const [currentEvidenceIndex, setCurrentEvidenceIndex] = useState(0);
  const [rulings, setRulings] = useState([]);
  const [sustainCount, setSustainCount] = useState(0);
  const [selectedVerdict, setSelectedVerdict] = useState(null);
  const [softness, setSoftness] = useState(0);
  const [showGavel, setShowGavel] = useState(false);
  const [reindictmentVisible, setReindictmentVisible] = useState(false);
  const [docketVisible, setDocketVisible] = useState(false);
  const [pulseOpacity, setPulseOpacity] = useState(0.03);
  const [hoveredDocket, setHoveredDocket] = useState(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [verdictRevealed, setVerdictRevealed] = useState(false);
  const pulseRef = useRef(null);
  const typewriterRef = useRef(null);

  const evidence = [
    {
      exhibit: 'Exhibit A',
      object: 'A Specific Parking Lot (Unnamed, Off Route 9)',
      allegedMemory: 'Defendant allegedly caused subject to recall, without consent, standing in a strip mall parking lot aged eleven, holding a slushie, feeling that summer would never end. Duration: 4–7 seconds of unwanted certainty.',
      prosecutionObjection: 'The prosecution notes that the subject was also holding a slushie and therefore already vulnerable. The smell merely exploited an existing emotional opening.'
    },
    {
      exhibit: 'Exhibit B',
      object: 'A Screen Door (Aluminum Frame, Circa 1994)',
      allegedMemory: 'Defendant induced involuntary recall of a grandmother\'s house, specifically the sound of the screen door closing behind you as you ran inside before the rain hit. The court notes the subject described this memory as "like being caught by something kind."',
      prosecutionObjection: 'The prosecution argues that screen doors are co-conspirators and requests they be named in a separate indictment. Motion pending.'
    },
    {
      exhibit: 'Exhibit C',
      object: 'A Tent (August, Unknown Campground)',
      allegedMemory: 'Defendant caused subject to re-experience lying in a sleeping bag listening to rain on nylon, age fourteen, believing that this exact moment — this particular darkness — was somehow permanent and safe. The memory lasted until the subject reached their car.',
      prosecutionObjection: 'Fourteen is a formative age. The prosecution contends the defendant specifically targets developmental windows.'
    },
    {
      exhibit: 'Exhibit D',
      object: 'Hot Pavement (Any)',
      allegedMemory: 'Upon contact with hot pavement, defendant released geosmin compounds causing subject to feel, briefly but completely, that they were every age they had ever been simultaneously. Subject reported feeling "too much" for approximately two minutes.',
      prosecutionObjection: 'The compound geosmin has no legal right to time travel. The prosecution rests on this point.'
    },
    {
      exhibit: 'Exhibit E',
      object: 'A Library Parking Lot (Saturday, Late Afternoon)',
      allegedMemory: 'Defendant caused subject to remember returning library books with a parent, the specific quality of that Saturday afternoon light, and the feeling that the week ahead was entirely, impossibly open. No books were harmed. The subject cried briefly in their car.',
      prosecutionObjection: 'Libraries are public institutions. The defendant has no jurisdiction over public infrastructure or the emotional states triggered therein.'
    },
    {
      exhibit: 'Exhibit F',
      object: 'A Baseball Field (Outfield Grass)',
      allegedMemory: 'Defendant allegedly triggered in three separate subjects the memory of watching rain approach across a field, the smell arriving seconds before the first drop, creating what witnesses describe as "the longest possible moment." Subjects reported feeling "seen by weather."',
      prosecutionObjection: 'Being seen by weather is not a legally cognizable experience. The prosecution moves to strike.'
    }
  ];

  const docketCases = [
    { id: 1, charge: 'The Sound of a Ceiling Fan v. The Feeling of Being Eight Years Old on a Sick Day' },
    { id: 2, charge: 'Certain Chord Progressions v. Driving Alone After Midnight' },
    { id: 3, charge: 'The Smell of Sunscreen v. Every Summer Before Anything Went Wrong' },
    { id: 4, charge: 'A Specific Shade of Yellow v. Late Afternoon in October' },
    { id: 5, charge: 'The Sound of a Sprinkler v. Lawns Generally' },
    { id: 6, charge: 'Old Paperback Books v. The Concept of Having Nowhere To Be' },
    { id: 7, charge: 'The Smell of Chlorine v. Being Eleven Forever' },
    { id: 8, charge: 'Wood Smoke v. Every Campfire You Ever Sat Around' },
    { id: 9, charge: 'The Sound of a Screen Door v. Being Called Inside For Dinner' },
    { id: 10, charge: 'Crayons v. The Entire Idea of September' },
    { id: 11, charge: 'New Car Smell v. Road Trips Before GPS' },
    { id: 12, charge: 'The Smell of Pencil Shavings v. First Days Generally' },
    { id: 13, charge: 'Certain Restaurant Smells v. Being Someone\'s Child in Public' },
    { id: 14, charge: 'The Sound of Dial-Up v. The Feeling That The Internet Was Still a Secret' },
    { id: 15, charge: 'A Specific Shade of Blue v. Swimming Pools at Dusk' },
    { id: 16, charge: 'The Smell of Gasoline v. Road Trips Before You Knew They Would End' },
    { id: 17, charge: 'Silence After Snow v. The Concept of Being Cancelled (School)' }
  ];

  const totalEvidence = evidence.length;

  useEffect(() => {
    const newSoftness = (sustainCount / totalEvidence) * 10;
    setSoftness(newSoftness);
  }, [sustainCount]);

  useEffect(() => {
    pulseRef.current = setInterval(() => {
      setPulseOpacity(prev => prev === 0.03 ? 0.06 : 0.03);
    }, 4000);
    return () => clearInterval(pulseRef.current);
  }, []);

  useEffect(() => {
    if (phase === 'reindicted') {
      const reindictText = 'RE-INDICTMENT NOTICE: The Smell of Rain has been formally charged with a new offense — to wit: Unlawful Association with the Sound of a Ceiling Fan, with Intent to Cause Temporal Displacement in Civilians. Bail has been set at one dry summer.';
      let i = 0;
      setTypewriterText('');
      typewriterRef.current = setInterval(() => {
        if (i < reindictText.length) {
          setTypewriterText(reindictText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typewriterRef.current);
          setReindictmentVisible(true);
          setTimeout(() => setDocketVisible(true), 2000);
        }
      }, 30);
      return () => clearInterval(typewriterRef.current);
    }
  }, [phase]);

  const lerpColor = (color1, color2, t) => {
    const c1 = { r: parseInt(color1.slice(1, 3), 16), g: parseInt(color1.slice(3, 5), 16), b: parseInt(color1.slice(5, 7), 16) };
    const c2 = { r: parseInt(color2.slice(1, 3), 16), g: parseInt(color2.slice(3, 5), 16), b: parseInt(color2.slice(5, 7), 16) };
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r},${g},${b})`;
  };

  const softnessT = softness / 10;
  const bgColor = lerpColor('#F5F0E8', '#E8EDF5', softnessT);
  const textBlur = softnessT * 0.8;
  const textShadow = softnessT > 0 ? `0 0 ${textBlur * 8}px rgba(100, 130, 180, ${softnessT * 0.4})` : 'none';
  const bodyFontWeight = Math.round(400 - softnessT * 50);
  const containerRadius = softnessT * 16;
  const letterSpacing = softnessT * 0.3;

  const handleRule = (ruling) => {
    setShowGavel(true);
    setTimeout(() => setShowGavel(false), 800);

    const newRulings = [...rulings, ruling];
    setRulings(newRulings);

    if (ruling === 'SUSTAIN') {
      setSustainCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentEvidenceIndex + 1 >= totalEvidence) {
        setPhase('verdict');
      } else {
        setCurrentEvidenceIndex(prev => prev + 1);
      }
    }, 600);
  };

  const handleVerdict = (verdict) => {
    setSelectedVerdict(verdict);
    setVerdictRevealed(true);
    setTimeout(() => {
      setPhase('reindicted');
    }, 2500);
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: bgColor,
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: '#2C2C2C',
    transition: 'background-color 1.5s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden'
  };

  const ambientStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: `radial-gradient(ellipse at center, rgba(100,130,180,${pulseOpacity}) 0%, transparent 70%)`,
    pointerEvents: 'none',
    transition: 'opacity 4s ease',
    zIndex: 0
  };

  const panelStyle = {
    maxWidth: '780px',
    width: '100%',
    backgroundColor: softnessT > 0.3 ? `rgba(232, 237, 245, ${0.5 + softnessT * 0.3})` : 'rgba(245, 240, 232, 0.95)',
    border: `2px solid rgba(184, 150, 12, ${0.6 + softnessT * 0.2})`,
    borderRadius: `${4 + containerRadius}px`,
    padding: '48px',
    position: 'relative',
    zIndex: 1,
    boxShadow: `0 4px ${20 + softnessT * 20}px rgba(100, 130, 180, ${0.1 + softnessT * 0.15})`,
    transition: 'all 1.5s ease'
  };

  const headingStyle = {
    color: '#B8960C',
    fontFamily: 'Georgia, "Times New Roman", serif',
    textShadow: textShadow,
    letterSpacing: `${0.05 + letterSpacing}em`,
    transition: 'all 1.5s ease',
    fontWeight: bodyFontWeight + 200
  };

  const bodyTextStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: '#2C2C2C',
    textShadow: textShadow,
    letterSpacing: `${letterSpacing * 0.5}em`,
    fontWeight: bodyFontWeight,
    lineHeight: `${1.7 + softnessT * 0.3}`,
    transition: 'all 1.5s ease'
  };

  const sealStyle = {
    width: '80px',
    height: '80px',
    border: '3px solid #B8960C',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: '32px',
    color: '#B8960C',
    boxShadow: `0 0 ${10 + softnessT * 10}px rgba(184, 150, 12, 0.3)`,
    transition: 'all 1.5s ease'
  };

  const dividerStyle = {
    border: 'none',
    borderTop: `1px solid rgba(184, 150, 12, ${0.4 + softnessT * 0.2})`,
    margin: '24px 0',
    transition: 'all 1.5s ease'
  };

  const buttonBaseStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    cursor: 'pointer',
    border: '2px solid',
    padding: '12px 28px',
    fontSize: '14px',
    letterSpacing: '0.12em',
    transition: 'all 0.3s ease',
    borderRadius: `${2 + containerRadius * 0.5}px`,
    fontWeight: bodyFontWeight + 100
  };

  if (phase === 'intro') {
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes gavelDrop {
            0% { transform: rotate(-30deg) translateY(-20px); }
            60% { transform: rotate(10deg) translateY(5px); }
            80% { transform: rotate(-5deg) translateY(0px); }
            100% { transform: rotate(0deg) translateY(0px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes gentlePulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
        `}</style>
        <div style={ambientStyle} />
        <div style={{ ...panelStyle, textAlign: 'center', animation: 'fadeIn 1s ease' }}>
          <div style={sealStyle}>⚖</div>
          <div style={{ ...headingStyle, fontSize: '11px', letterSpacing: '0.25em', marginBottom: '8px' }}>
            SUPERIOR COURT OF ATMOSPHERIC PHENOMENA
          </div>
          <div style={{ ...headingStyle, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '32px', color: '#888' }}>
            THIRD DISTRICT — SENSORY OFFENSES DIVISION
          </div>
          <h1 style={{ ...headingStyle, fontSize: '28px', marginBottom: '8px', fontWeight: 400 }}>
            Formal Hearing:
          </h1>
          <h1 style={{ ...headingStyle, fontSize: '36px', marginBottom: '32px', fontStyle: 'italic' }}>
            The Smell of Rain
          </h1>
          <hr style={dividerStyle} />
          <div style={{ ...bodyTextStyle, fontSize: '15px', marginBottom: '24px' }}>
            <strong>Case No. 1987-∞-P</strong>
          </div>
          <div style={{ ...bodyTextStyle, fontSize: '15px', marginBottom: '16px' }}>
            <em>The Dry Afternoon</em> (Plaintiff) v. <em>Petrichor</em> (Defendant)
          </div>
          <div style={{ ...bodyTextStyle, fontSize: '14px', marginBottom: '32px', color: '#555', fontStyle: 'italic' }}>
            Charges: Arriving without announcement and causing unsolicited nostalgia in civilians.
            This case has been building for decades.
          </div>
          <hr style={dividerStyle} />
          <div style={{ ...bodyTextStyle, fontSize: '14px', marginBottom: '32px', color: '#666' }}>
            You are the Honorable Judge of this proceeding.<br />
            You are also, in some capacity, the rain.
          </div>
          <button
            onClick={() => setPhase('trial')}
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#B8960C',
              borderColor: '#B8960C',
              color: '#F5F0E8',
              fontSize: '13px',
              padding: '16px 40px',
              letterSpacing: '0.2em'
            }}
            onMouseEnter={e => { e.target.style.backgroundColor = '#9A7A08'; e.target.style.borderColor = '#9A7A08'; }}
            onMouseLeave={e => { e.target.style.backgroundColor = '#B8960C'; e.target.style.borderColor = '#B8960C'; }}
          >
            ⚖ BEGIN HEARING
          </button>
          <div style={{ ...bodyTextStyle, fontSize: '12px', marginTop: '24px', color: '#999', letterSpacing: '0.1em' }}>
            THE BAILIFF IS PRESENT. THE COURT IS NOW IN SESSION.
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'trial') {
    const current = evidence[currentEvidenceIndex];
    const progress = currentEvidenceIndex / totalEvidence;

    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes gavelDrop {
            0% { transform: rotate(-40deg) scale(1.2); opacity: 0; }
            30% { transform: rotate(10deg) scale(1.1); opacity: 1; }
            60% { transform: rotate(-5deg) scale(1); }
            100% { transform: rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
        <div style={ambientStyle} />

        {showGavel && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '72px',
            animation: 'gavelDrop 0.8s ease',
            zIndex: 100,
            pointerEvents: 'none'
          }}>
            🔨
          </div>
        )}

        <div style={{ ...panelStyle, animation: 'fadeIn 0.6s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ ...headingStyle, fontSize: '11px', letterSpacing: '0.2em' }}>
              SUPERIOR COURT — ATMOSPHERIC PHENOMENA
            </div>
            <div style={{ ...bodyTextStyle, fontSize: '12px', color: '#888' }}>
              Case No. 1987-∞-P
            </div>
          </div>

          <div style={{
            height: '3px',
            backgroundColor: 'rgba(184, 150, 12, 0.2)',
            borderRadius: '2px',
            marginBottom: '32px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress * 100}%`,
              backgroundColor: `rgba(184, 150, 12, ${0.5 + softnessT * 0.3})`,
              transition: 'width 0.8s ease',
              borderRadius: '2px'
            }} />
          </div>

          <div style={{ ...headingStyle, fontSize: '13px', letterSpacing: '0.25em', marginBottom: '4px' }}>
            {current.exhibit}
          </div>
          <h2 style={{ ...headingStyle, fontSize: '22px', marginBottom: '24px', fontStyle: 'italic', fontWeight: 300 }}>
            {current.object}
          </h2>

          <hr style={dividerStyle} />

          <div style={{
            backgroundColor: softnessT > 0 ? `rgba(100, 130, 180, ${softnessT * 0.08})` : 'rgba(44, 44, 44, 0.03)',
            border: `1px solid rgba(100, 130, 180, ${0.1 + softnessT * 0.2})`,
            borderRadius: `${4 + containerRadius * 0.7}px`,
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 1.5s ease',
            animation: 'slideIn 0.5s ease'
          }}>
            <div style={{ ...bodyTextStyle, fontSize: '11px', letterSpacing: '0.2em', color: '#888', marginBottom: '12px' }}>
              DEFENSE — EVIDENCE ENTERED
            </div>
            <div style={{ ...bodyTextStyle, fontSize: '15px', lineHeight: 1.8 }}>
              {current.allegedMemory}
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(44, 44, 44, 0.03)',
            border: '1px solid rgba(44, 44, 44, 0.1)',
            borderRadius: `${4 + containerRadius * 0.5}px`,
            padding: '20px',
            marginBottom: '32px',
            transition: 'all 1.5s ease'
          }}>
            <div style={{ ...bodyTextStyle, fontSize: '11px', letterSpacing: '0.2em', color: '#888', marginBottom: '10px' }}>
              PROSECUTION — OBJECTION
            </div>
            <div style={{ ...bodyTextStyle, fontSize: '14px', color: '#555', fontStyle: 'italic', lineHeight: 1.7 }}>
              {current.prosecutionObjection}
            </div>
          </div>

          <div style={{ ...bodyTextStyle, fontSize: '13px', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '20px', color: '#888' }}>
            IS THIS MEMORY ADMISSIBLE AS EVIDENCE?
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => handleRule('SUSTAIN')}
              style={{
                ...buttonBaseStyle,
                backgroundColor: softnessT > 0.5 ? `rgba(100, 130, 180, ${0.15 + softnessT * 0.1})` : 'transparent',
                borderColor: `rgba(100, 130, 180, ${0.5 + softnessT * 0.3})`,
                color: '#2C5282',
                fontSize: '13px',
                letterSpacing: '0.2em'
              }}
              onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(100, 130, 180, 0.15)'; }}
              onMouseLeave={e => { e.target.style.backgroundColor = softnessT > 0.5 ? `rgba(100, 130, 180, ${0.15 + softnessT * 0.1})` : 'transparent'; }}
            >
              SUSTAIN
            </button>
            <button
              onClick={() => handleRule('OVERRULE')}
              style={{
                ...buttonBaseStyle,
                backgroundColor: 'transparent',
                borderColor: 'rgba(44, 44, 44, 0.4)',
                color: '#555',
                fontSize: '13px',
                letterSpacing: '0.2em'
              }}
              onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(44, 44, 44, 0.06)'; }}
              onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
            >
              OVERRULE
            </button>
          </div>

          {sustainCount > 0 && (
            <div style={{
              ...bodyTextStyle,
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '24px',
              color: `rgba(100, 130, 180, ${0.5 + softnessT * 0.4})`,
              fontStyle: 'italic',
              transition: 'all 1.5s ease'
            }}>
              {sustainCount === 1 && 'The room is slightly different than it was.'}
              {sustainCount === 2 && 'Something has shifted. The air is a degree cooler.'}
              {sustainCount === 3 && 'The plaintiff\'s attorney appears tired. They were already tired.'}
              {sustainCount === 4 && 'The court reporter has stopped typing. They are looking at the window.'}
              {sustainCount === 5 && 'It is possible it is raining outside this courtroom.'}
              {sustainCount >= 6 && 'The bailiff — you — are experiencing something.'}
            </div>
          )}
        </div>

        <div style={{ ...bodyTextStyle, fontSize: '11px', color: '#aaa', marginTop: '16px', letterSpacing: '0.15em', zIndex: 1 }}>
          EXHIBIT {currentEvidenceIndex + 1} OF {totalEvidence} — {rulings.filter(r => r === 'SUSTAIN').length} SUSTAINED
        </div>
      </div>
    );
  }

  if (phase === 'verdict') {
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes verdictPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(184, 150, 12, 0.2); }
            50% { box-shadow: 0 0 40px rgba(184, 150, 12, 0.4); }
          }
        `}</style>
        <div style={ambientStyle} />
        <div style={{ ...panelStyle, animation: 'fadeIn 0.8s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={sealStyle}>⚖</div>
            <div style={{ ...headingStyle, fontSize: '11px', letterSpacing: '0.25em', marginBottom: '8px' }}>
              ALL EVIDENCE HAS BEEN HEARD
            </div>
            <h2 style={{ ...headingStyle, fontSize: '32px', fontStyle: 'italic', fontWeight: 300 }}>
              The Court Must Now Rule
            </h2>
          </div>

          <hr style={dividerStyle} />

          <div style={{ ...bodyTextStyle, fontSize: '14px', marginBottom: '32px', textAlign: 'center', color: '#555', fontStyle: 'italic' }}>
            {sustainCount} of {totalEvidence} memories were sustained as admissible.<br />
            {sustainCount >= 4
              ? 'The court notes that it has been significantly affected by the proceedings.'
              : sustainCount >= 2
              ? 'The court notes that two or more memories were found credible.'
              : 'The court notes that it has remained largely dry throughout.'}
          </div>

          {verdictRevealed ? (
            <div style={{
              textAlign: 'center',
              animation: 'fadeIn 0.8s ease',
              padding: '32px',
              border: `2px solid rgba(184, 150, 12, 0.6)`,
              borderRadius: `${8 + containerRadius}px`
            }}>
              <div style={{ ...headingStyle, fontSize: '13px', letterSpacing: '0.3em', marginBottom: '16px' }}>
                VERDICT ENTERED
              </div>
              <div style={{ ...headingStyle, fontSize: '24px', fontStyle: 'italic' }}>
                {selectedVerdict}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  label: 'GUILTY OF BEAUTY',
                  sub: 'The defendant is found guilty as charged. The sentence is ongoing.'
                },
                {
                  label: 'NOT GUILTY — INSUFFICIENT DRYNESS',
                  sub: 'The plaintiff failed to establish a baseline of adequate dryness prior to the incident.'
                },
                {
                  label: 'CASE DISMISSED: THE COURT IS ALSO EXPERIENCING IT',
                  sub: 'The court acknowledges a conflict of interest and recuses itself from objectivity.'
                }
              ].map((v, i) => (
                <button
                  key={i}
                  onClick={() => handleVerdict(v.label)}
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: 'transparent',
                    borderColor: `rgba(184, 150, 12, ${0.4 + i * 0.1})`,
                    color: '#2C2C2C',
                    textAlign: 'left',
                    padding: '20px 24px',
                    display: 'block',
                    width: '100%',
                    animation: `verdictPulse ${3 + i}s ease infinite`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = `rgba(184, 150, 12, 0.08)`;
                    e.currentTarget.style.borderColor = '#B8960C';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = `rgba(184, 150, 12, ${0.4 + i * 0.1})`;
                  }}
                >
                  <div style={{ ...headingStyle, fontSize: '14px', letterSpacing: '0.15em', marginBottom: '6px' }}>
                    {v.label}
                  </div>
                  <div style={{ ...bodyTextStyle, fontSize: '13px', color: '#666', fontStyle: 'italic', fontWeight: 400 }}>
                    {v.sub}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'reindicted') {
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes stampIn {
            0% { transform: scale(2) rotate(-15deg); opacity: 0; }
            60% { transform: scale(0.95) rotate(2deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes docketFadeIn {
            from { opacity: 0; transform: translateX(-8px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
        <div style={ambientStyle} />
        <div style={{ ...panelStyle, animation: 'fadeIn 0.6s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-block',
              border: '3px solid rgba(180, 40, 40, 0.7)',
              color: 'rgba(180, 40, 40, 0.8)',
              padding: '8px 20px',
              fontSize: '18px',
              letterSpacing: '0.3em',
              fontFamily: 'Georgia, serif',
              transform: 'rotate(-2deg)',
              animation: 'stampIn 0.8s ease',
              marginBottom: '24px'
            }}>
              RE-INDICTED
            </div>
          </div>

          <div style={{
            ...bodyTextStyle,
            fontSize: '14px',
            lineHeight: 1.9,
            marginBottom: '32px',
            padding: '20px',
            backgroundColor: 'rgba(100, 130, 180, 0.06)',
            border: '1px solid rgba(100, 130, 180, 0.2)',
            borderRadius: `${4 + containerRadius}px`,
            fontFamily: '"Courier New", Courier, monospace',
            color: '#2C2C2C',
            minHeight: '80px'
          }}>
            {typewriterText}
            <span style={{ animation: 'fadeIn 0.5s ease infinite alternate', opacity: typewriterText.length < 50 ? 1 : 0 }}>▌</span>
          </div>

          {reindictmentVisible && (
            <div style={{ animation: 'fadeIn 0.8s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{ ...headingStyle, fontSize: '13px', letterSpacing: '0.2em' }}>
                  — VERDICT ENTERED: {selectedVerdict} —
                </div>
              </div>
              <div style={{ ...bodyTextStyle, fontSize: '13px', textAlign: 'center', color: '#888', fontStyle: 'italic', marginBottom: '32px' }}>
                The verdict is noted. The defendant has already been re-processed.
              </div>
            </div>
          )}

          {docketVisible && (
            <div style={{ animation: 'fadeIn 1s ease' }}>
              <hr style={dividerStyle} />
              <div style={{ ...headingStyle, fontSize: '13px', letterSpacing: '0.2em', marginBottom: '8px' }}>
                PENDING DOCKET — SENSORY OFFENSES DIVISION
              </div>
              <div style={{ ...bodyTextStyle, fontSize: '12px', color: '#888', marginBottom: '20px', fontStyle: 'italic' }}>
                17 cases currently awaiting hearing. Hover for charges.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {docketCases.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: `${2 + containerRadius * 0.3}px`,
                      cursor: 'pointer',
                      backgroundColor: hoveredDocket === i ? 'rgba(100, 130, 180, 0.1)' : 'transparent',
                      transition: 'background-color 0.3s ease',
                      animation: `docketFadeIn 0.4s ease ${i * 0.06}s both`,
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                    onMouseEnter={() => setHoveredDocket(i)}
                    onMouseLeave={() => setHoveredDocket(null)}
                  >
                    <span style={{ ...bodyTextStyle, fontSize: '11px', color: '#B8960C', letterSpacing: '0.1em', minWidth: '28px', paddingTop: '1px' }}>
                      {String(c.id).padStart(2, '0')}.
                    </span>
                    <div style={{ flex: 1 }}>
                      {hoveredDocket === i ? (
                        <div style={{ ...bodyTextStyle, fontSize: '13px', color: '#2C5282', fontStyle: 'italic', animation: 'fadeIn 0.2s ease' }}>
                          {c.charge}
                        </div>
                      ) : (
                        <div style={{ ...bodyTextStyle, fontSize: '12px', color: '#666' }}>
                          Case No. 1987-∞-{String(c.id + 1).padStart(2, '0')} — [CHARGES SEALED]
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <hr style={{ ...dividerStyle, marginTop: '24px' }} />
              <div style={{ ...bodyTextStyle, fontSize: '12px', textAlign: 'center', color: '#aaa', fontStyle: 'italic' }}>
                The docket grows. The court is always in session.<br />
                The smell of rain has retained new counsel.<br />
                New counsel is also a smell.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}