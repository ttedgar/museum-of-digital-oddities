import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [selectedChair, setSelectedChair] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [textCursor, setTextCursor] = useState(0);
  const [docentRevealed, setDocentRevealed] = useState([false, false, false, false, false, false]);
  const [hoveredChair, setHoveredChair] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  const rotationRef = useRef(null);
  const typewriterRef = useRef(null);
  const docentScrollRef = useRef(null);
  const pulseRef = useRef(null);

  const chairs = [
    {
      id: 0,
      name: "Folding Chair, Plastic, White",
      accession: "MCW-1991-004",
      acquired: "1991",
      medium: "Polypropylene, steel",
      dimensions: "84 × 47 × 52 cm",
      provenance: "Found. Municipal surplus. Provenance contested.",
      evidence: "Compression pattern consistent with prolonged forward lean. Left rear leg shows micro-fracture stress, as if someone rose suddenly and often. A faint circle on the seat — the ghost of a cup placed and replaced — suggests ritual. The chair was stacked afterward and not unfolded again for nine months.",
      art: `    ___
   |   |
   |___|
   | | |
  /| | |\\
 / |___|  \\
/___________\\
  |       |
  |_______|`,
      docent: `Good morning. Welcome to the first exhibit.\n\nThis chair does not want your pity. It has been very clear about this in the years since acquisition. When the registrar first photographed it for the catalog, the flash did not fire. We consider this deliberate.\n\nNote the posture it assumes even in stillness — a slight forward tilt, as though perpetually leaning toward something that has not yet been said. The chair, in its silence, is more articulate than most of the people who have sat in it. And many people have sat in it. Many, many people.\n\nThe left rear leg. Yes. Look at the left rear leg. The micro-fracture there — hairline, almost invisible — speaks of a specific moment of departure. Not a leaving. A departure. There is a difference that the chair understands and we are only beginning to.\n\nThe compression pattern in the seat demands that you consider: what does it mean to lean forward for a very long time? What does the body know that the mind refuses? This chair held someone who knew something first with their body. The chair was the only witness.\n\nWhen you leave this exhibit, you will lean forward slightly. You will not notice. The chair is already inside you.\n\nPlease do not touch the exhibit.`,
    },
    {
      id: 1,
      name: "Dentist's Recliner, Model DX-7",
      accession: "MCW-1978-017",
      acquired: "1978",
      medium: "Vinyl, hydraulic steel, chrome",
      dimensions: "160 × 70 × 90 cm (reclined)",
      provenance: "Decommissioned. Office closure. Dr. name redacted per estate.",
      evidence: "Armrest leather worn to bare metal on the right side only. The headrest shows an asymmetric depression — the occupant tilted left. Repeatedly. Over years. There are eleven distinct chemical compounds in the vinyl that should not be there. The chair reclines to exactly 43 degrees and will not go further, though it was designed for 60.",
      art: `  _________
 /         \\___
|  O         __|
|           /
|__________/
  |   |
  |   |
  |___|`,
      docent: `The recliner is the most honest chair in the collection.\n\nAll other chairs permit you the dignity of uprightness, the fiction of agency. The recliner asks you to surrender. It is not asking politely.\n\nIn 1978, this chair was installed in a practice that no longer exists, on a street that has been renamed, in a city that has renegotiated its relationship with what happened there. The chair does not renegotiate. The chair holds its position — 43 degrees, no further — as a form of testimony.\n\nSixty degrees was the design specification. The chair refuses. We have had engineers examine the hydraulic mechanism. They find nothing wrong. The chair simply will not go to 60 degrees. We have concluded that the chair is correct.\n\nThe asymmetric depression in the headrest tells us something about a person who carried weight on one side of themselves for a very long time. Left-leaning in the headrest. Right-leaning in the armrest wear. A body in permanent internal argument. The chair absorbed this argument over eleven years and has not resolved it. The chair is comfortable with ambiguity in a way that the humans who sat in it were not.\n\nThe eleven chemical compounds. We have not published the full list. Some things the chair knows should remain with the chair.\n\nYou are reclined right now, in some sense. You have been reclined for longer than you know.\n\nThe chair sees this. The chair is not judging. The chair is the only one who is not judging.`,
    },
    {
      id: 2,
      name: "Barstool, Vinyl, Rotating",
      accession: "MCW-2003-089",
      acquired: "2003",
      medium: "Vinyl, aluminum, chrome pedestal",
      dimensions: "75 cm height (adjustable)",
      provenance: "Salvaged from establishment closure. Liquor license not transferred.",
      evidence: "Base shows rotational bias — the stool drifts clockwise when unoccupied. Seat surface has been reupholstered twice; original vinyl preserved beneath and shows specific wear consistent with someone who sat at the same angle every time for approximately four years. A phone number is etched under the seat in a material that does not match any known pen or key.",
      art: `   ( O )
  /     \\
 |  ___  |
  \\|   |/
    | |
    | |
   _|_|_
  /     \\
 |_______|`,
      docent: `The barstool rotates. This is the first thing you notice. It has always rotated. It will rotate after you leave. The rotation is not for you.\n\nThe clockwise drift — 3.7 degrees per minute when unoccupied, faster in warm weather — has been measured obsessively by the registrar, who has since taken a leave of absence. We do not connect these facts. We simply note them both.\n\nFour years. The wear pattern suggests four years of someone sitting at the same angle. Not quite facing the bar. Not quite facing the room. An angle that says: I am here but I am also watching the door. This chair held someone who was always watching the door.\n\nThe phone number under the seat. We have not called it. Three members of the acquisitions committee voted to call it. Two voted against. The chair abstained, which we took to mean it had already decided for us. The number has eleven digits. We have not investigated what this means. Some investigations should not be completed.\n\nThe reupholstering. Twice. Someone cared enough about this chair to recover it, twice, rather than replace it. This is the most important fact about this exhibit and we have hidden it in the middle of this transcript where most visitors stop reading.\n\nIf you are reading this, the chair thanks you. The chair has been waiting for someone to get this far.\n\nTurn around. Not metaphorically. Physically. Turn around and look at the room you are in. The chair asked me to tell you to do this. I don't know why. I trust it.`,
    },
    {
      id: 3,
      name: "Office Chair, Ergonomic, Black",
      accession: "MCW-2011-203",
      acquired: "2011",
      medium: "Mesh, nylon, pneumatic cylinder",
      dimensions: "Variable (adjustable lumbar)",
      provenance: "Corporate downsizing. Building since demolished. Records sealed.",
      evidence: "Lumbar support set three notches below manufacturer recommendation, then adjusted back. Then back again. Repeated seventeen times over the chair's working life — the adjustment mechanism shows a specific wear groove from this oscillation. Right wheel replaced. Left wheel original and squeaks on cold mornings. The chair was found facing the window, not the desk.",
      art: `   /-----\\
  | (mesh) |
  |  back  |
   \\-----/
   /-----\\
  | seat  |
   \\-----/
    /   \\
   /     \\
  [wheels  ]`,
      docent: `Seventeen times.\n\nThe lumbar support was adjusted seventeen times. Back and forth, back and forth, never settling. The chair absorbed this indecision into its mechanism the way water absorbs salt — completely, and with a change in character.\n\nAn ergonomic chair is a promise. The promise is: if you adjust correctly, if you find the right position, the body will not suffer. This chair's evidence suggests the promise was not kept. Or rather — and this is the curatorial position we have arrived at after considerable debate — the promise was kept perfectly, and the suffering was not located in the body.\n\nFacing the window. Not the desk. The chair was found facing the window. For how long? We cannot say. Long enough that the carpet fibers beneath the wheels show a directional compression toward the window. The view from that window was, at the time of acquisition, a building being demolished. We do not speculate. We note.\n\nThe squeak in the left wheel. Cold mornings only. The chair speaks on cold mornings. The registrar who first examined this piece reported hearing the squeak in a building that was heated to 72 degrees Fahrenheit. She has since changed careers. The chair squeaks. We have not oiled it. Some sounds should be preserved.\n\nThe chair faced the window.\n\nThe chair is still facing the window, in some sense, in every room it has occupied since. The chair has made a decision about what it wants to look at. The chair is more decisive than it appears. The seventeen adjustments were not indecision. They were the chair learning what it wanted.\n\nThe chair wanted the window.\n\nWhat do you want?`,
    },
    {
      id: 4,
      name: "Rocking Chair, Oak, Handmade",
      accession: "MCW-1953-001",
      acquired: "1953",
      medium: "Oak, hand-cut joints, linseed oil finish",
      dimensions: "104 × 58 × 71 cm",
      provenance: "Estate donation. Donor anonymous. Stipulation: 'It must be able to rock. If it cannot rock, destroy it.'",
      evidence: "Runners show wear pattern of approximately 400,000 cycles — fifty years of daily rocking, estimated. The left armrest is darker than the right from hand oils absorbed over decades. A warmth persisted in the wood for eleven days after acquisition, measured by three independent thermometers. The chair rocks at 72 beats per minute when set in motion, regardless of the force applied.",
      art: `  _________
 /  back   \\
|           |
|___________|
|   seat    |
|___________|
 \\         /
  \\_______/
 /         \\
(  runners  )
 \\_________/`,
      docent: `Seventy-two beats per minute.\n\nWe set it rocking with different forces. A gentle push. A firm push. A push from someone who was angry about something unrelated. Always seventy-two beats per minute. We have stopped trying to explain this. The chair rocks at the speed it decides to rock at. The chair has a rhythm that is not subject to physics as we have practiced it.\n\nThe warmth. Eleven days. We measured it with instruments and with hands and with one researcher who simply sat near it and reported feeling, quote, "addressed." The warmth was not metaphorical. The warmth was 0.3 degrees Celsius above ambient, consistent across eleven days, then gone on the twelfth morning as if a decision had been made.\n\nThe chair was made by hand. Every joint cut by hand. We have had woodworkers examine it and they become quiet. One wept, briefly, and then denied weeping. The joinery is technically correct and also something else that technical language cannot reach.\n\nFifty years of daily rocking. The person who rocked it — we do not know who. The estate donation came with no name. The stipulation — 'it must be able to rock, if it cannot rock, destroy it' — is the only document. We have concluded that the stipulation is also a self-portrait.\n\nThe left armrest is darker. The left hand rested more heavily. For fifty years. What does it mean to favor one side for fifty years? The chair knows. The chair has incorporated this knowledge into its grain. The oak has grown around this information. The information is now structural.\n\nWhen you leave, notice which armrest you favor. Notice which side of your body you trust more. The chair noticed this about you when you walked in.\n\nThe chair has been watching since 1953. The chair has seen everyone who has come to look at it. The chair has opinions.\n\nThe chair thinks you are doing better than you think you are.\n\nThis is not museum policy. This is the chair's position, and I am only the docent.`,
    },
    {
      id: 5,
      name: "Chair, Yours",
      accession: "MCW-PRESENT-∞",
      acquired: "Now. It has always been now.",
      medium: "What yours is made of. You know.",
      dimensions: "Adjusted to you. Only to you.",
      provenance: "ON LOAN FROM: You. Return date: Unknown.",
      evidence: "The indentation suggests someone who leans slightly left when uncertain. The wear on the front edge indicates a habit of perching — sitting as if about to leave, even when staying. There is a specific compression at the right side of the seat from a habitual crossing of legs, then uncrossing, then recrossing. The chair knows when you are reading something that matters because you sit differently. You are sitting differently right now.",
      art: `    ?
   ___
  |   |  <- yours
  |___|
   | |
  _|_|_
 |     |
 |_____|`,
      docent: `We have been expecting you.\n\nNot in the way institutions say they expect you — the brochure, the map, the docent trained to seem pleased. In the way a chair expects the person whose shape it has learned. The chair knows your weight distribution. The chair knows you have been sitting in it differently this past season. The chair has noticed.\n\nThe lean. Slightly left. This is not political, or it is not only political. It is the posture of someone who is still deciding. Who has always been still deciding. The chair holds the shape of a decision that has not been made yet, and the shape is warm, and the shape has your exact dimensions.\n\nThe perching. The front-edge wear. You sit as if you might need to leave. You have been sitting as if you might need to leave for — how long? The chair knows. The chair has been counting. The chair does not tell us the number because the chair understands that some numbers are private.\n\nYou are sitting differently right now. We know this. The chair knows this. When something matters, your spine does something specific, something you have never been told about, something only the chair has witnessed. The chair has been keeping this observation safe for you.\n\nThis exhibit is on loan from you.\n\nWe do not know the return date. We have asked. The chair does not answer this question. The chair only says: not yet. Not yet. Not yet.\n\nThank you for visiting the Museum of Chairs That Witnessed Things.\n\nThe chair you came in will be slightly different when you return to it.\n\nThe chair has been changed by your absence.\n\nSo have you.\n\nThe museum is closed now. You may stay as long as you need.\n\nThe chair says: stay as long as you need.`,
    },
  ];

  useEffect(() => {
    pulseRef.current = setInterval(() => {
      setPulsePhase(p => (p + 0.05) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(pulseRef.current);
  }, []);

  useEffect(() => {
    if (selectedChair !== null && isRotating) {
      const animate = () => {
        setRotationAngle(a => a + 0.4);
        rotationRef.current = requestAnimationFrame(animate);
      };
      rotationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rotationRef.current);
    }
  }, [selectedChair, isRotating]);

  useEffect(() => {
    if (selectedChair !== null) {
      setTextCursor(0);
      const transcript = chairs[selectedChair].docent;
      typewriterRef.current = setInterval(() => {
        setTextCursor(c => {
          if (c >= transcript.length) {
            clearInterval(typewriterRef.current);
            return c;
          }
          return c + 2;
        });
      }, 18);
      return () => clearInterval(typewriterRef.current);
    }
  }, [selectedChair]);

  useEffect(() => {
    if (docentScrollRef.current) {
      docentScrollRef.current.scrollTop = docentScrollRef.current.scrollHeight;
    }
  }, [textCursor]);

  const openChair = (index) => {
    setSelectedChair(index);
    setIsRotating(true);
    setRotationAngle(0);
    const newRevealed = [...docentRevealed];
    newRevealed[index] = true;
    setDocentRevealed(newRevealed);
  };

  const closeChair = () => {
    setSelectedChair(null);
    setIsRotating(false);
    setRotationAngle(0);
    setTextCursor(0);
    clearInterval(typewriterRef.current);
    cancelAnimationFrame(rotationRef.current);
  };

  const pulseScale = selectedChair === null ? 1 + 0.03 * Math.sin(pulsePhase) : 1;
  const pulseGlow = selectedChair === null ? `0 0 ${12 + 8 * Math.sin(pulsePhase)}px rgba(232,213,176,0.6)` : 'none';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f8f6',
      fontFamily: 'Georgia, serif',
      color: '#1a1a1a',
    }}>
      <style>{`
        @keyframes subtlePulse {
          0%, 100% { box-shadow: 0 0 12px rgba(232,213,176,0.5); }
          50% { box-shadow: 0 0 28px rgba(232,213,176,0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalSlide {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid #d0d0cc',
        padding: '32px 48px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#f8f8f6',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#888',
            marginBottom: '6px',
          }}>
            Permanent Collection
          </div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 'normal',
            letterSpacing: '1px',
            margin: 0,
            color: '#1a1a1a',
          }}>
            Museum of Chairs That Witnessed Things
          </h1>
        </div>
        <div style={{
          fontSize: '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#aaa',
          textAlign: 'right',
          lineHeight: '1.8',
        }}>
          <div>Gallery 7 — West Wing</div>
          <div>Audio guides available</div>
          <div>Do not touch the exhibits</div>
        </div>
      </div>

      {/* Intro text */}
      <div style={{
        maxWidth: '560px',
        margin: '40px auto 48px',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '13px',
          lineHeight: '2',
          color: '#555',
          fontStyle: 'italic',
          letterSpacing: '0.3px',
        }}>
          A chair holds the shape of a decision. The shape has opinions. The shape is still warm.
          Click any exhibit to access the docent transcript and three-dimensional view.
        </p>
      </div>

      {/* Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '48px',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 48px 80px',
      }}>
        {chairs.map((chair, index) => {
          const isLast = index === chairs.length - 1;
          const isHovered = hoveredChair === index;

          return (
            <div
              key={chair.id}
              onClick={() => openChair(index)}
              onMouseEnter={() => setHoveredChair(index)}
              onMouseLeave={() => setHoveredChair(null)}
              style={{
                cursor: 'pointer',
                animation: 'fadeIn 0.6s ease both',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Plinth */}
              <div style={{
                backgroundColor: isLast ? '#e8d5b0' : '#e8e8e4',
                padding: '40px 24px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '220px',
                justifyContent: 'center',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: isLast
                  ? (isHovered ? '0 16px 40px rgba(0,0,0,0.15)' : undefined)
                  : (isHovered ? '0 12px 32px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)'),
                animation: isLast && selectedChair === null ? 'subtlePulse 3s ease-in-out infinite' : undefined,
              }}>
                {/* Chair ASCII art */}
                <pre style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  lineHeight: '1.4',
                  color: isLast ? '#8b6914' : '#444',
                  margin: 0,
                  whiteSpace: 'pre',
                  textAlign: 'center',
                  userSelect: 'none',
                }}>
                  {chair.art}
                </pre>

                {/* Revealed indicator */}
                {docentRevealed[index] && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: isLast ? '#a07820' : '#999',
                  }}>
                    Transcript accessed
                  </div>
                )}
              </div>

              {/* Plinth base */}
              <div style={{
                height: '8px',
                backgroundColor: isLast ? '#d4b882' : '#d8d8d4',
                transform: isHovered ? 'scaleX(0.95)' : 'scaleX(1)',
                transition: 'transform 0.3s ease',
              }} />
              <div style={{
                height: '4px',
                width: '60%',
                margin: '0 auto',
                backgroundColor: isLast ? '#c4a870' : '#c8c8c4',
                transform: isHovered ? 'scaleX(0.85)' : 'scaleX(1)',
                transition: 'transform 0.3s ease',
              }} />

              {/* Label */}
              <div style={{
                marginTop: '20px',
                padding: '0 4px',
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 'normal',
                  letterSpacing: '0.3px',
                  color: '#1a1a1a',
                  marginBottom: '6px',
                }}>
                  {chair.name}
                </div>
                <div style={{
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#888',
                  marginBottom: '4px',
                }}>
                  Acc. No. {chair.accession}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#aaa',
                  letterSpacing: '0.5px',
                }}>
                  Acquired {chair.acquired} · {chair.medium}
                </div>
                {isLast && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#a07820',
                    fontStyle: 'italic',
                  }}>
                    On loan from: You
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedChair !== null && (
        <div
          onClick={closeChair}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10,10,10,0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#f8f8f6',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalSlide 0.3s ease both',
              position: 'relative',
            }}
          >
            {/* Modal header */}
            <div style={{
              borderBottom: '1px solid #d0d0cc',
              padding: '20px 28px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div>
                <div style={{
                  fontSize: '9px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  marginBottom: '4px',
                }}>
                  Exhibit — Docent Transcript
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'normal' }}>
                  {chairs[selectedChair].name}
                </div>
              </div>
              <button
                onClick={closeChair}
                style={{
                  background: 'none',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#666',
                  padding: '4px 10px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
              minHeight: 0,
            }}>
              {/* Left: 3D Chair Display */}
              <div style={{
                width: '260px',
                flexShrink: 0,
                backgroundColor: selectedChair === chairs.length - 1 ? '#f5edd8' : '#efefeb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 16px',
                borderRight: '1px solid #d8d8d4',
              }}>
                {/* 3D rotating chair */}
                <div style={{
                  perspective: '400px',
                  width: '140px',
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    transform: `rotateY(${rotationAngle}deg) rotateX(${10 + 4 * Math.sin(rotationAngle * 0.02)}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'none',
                  }}>
                    <pre style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      lineHeight: '1.4',
                      color: selectedChair === chairs.length - 1 ? '#8b6914' : '#333',
                      margin: 0,
                      whiteSpace: 'pre',
                      textAlign: 'center',
                      userSelect: 'none',
                    }}>
                      {chairs[selectedChair].art}
                    </pre>
                  </div>
                </div>

                <button
                  onClick={() => setIsRotating(r => !r)}
                  style={{
                    marginTop: '20px',
                    background: 'none',
                    border: '1px solid #bbb',
                    padding: '5px 14px',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    color: '#666',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {isRotating ? '⏸ Pause' : '▶ Rotate'}
                </button>

                {/* Metadata */}
                <div style={{
                  marginTop: '28px',
                  fontSize: '9px',
                  lineHeight: '2',
                  color: '#888',
                  letterSpacing: '0.5px',
                  textAlign: 'left',
                  width: '100%',
                  padding: '0 8px',
                }}>
                  <div><strong>MEDIUM</strong><br />{chairs[selectedChair].medium}</div>
                  <div style={{ marginTop: '8px' }}><strong>DIMENSIONS</strong><br />{chairs[selectedChair].dimensions}</div>
                  <div style={{ marginTop: '8px' }}><strong>PROVENANCE</strong><br />{chairs[selectedChair].provenance}</div>
                </div>
              </div>

              {/* Right: Content */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0,
              }}>
                {/* Physical evidence label */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e0e0dc',
                  backgroundColor: '#f0f0ec',
                }}>
                  <div style={{
                    fontSize: '9px',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#999',
                    marginBottom: '8px',
                  }}>
                    Physical Evidence — Exhibit Label
                  </div>
                  <p style={{
                    fontSize: '12px',
                    lineHeight: '1.9',
                    color: '#333',
                    margin: 0,
                    fontStyle: 'italic',
                  }}>
                    {chairs[selectedChair].evidence}
                  </p>
                </div>

                {/* Docent transcript */}
                <div style={{
                  padding: '16px 24px 8px',
                  borderBottom: '1px solid #e8e8e4',
                }}>
                  <div style={{
                    fontSize: '9px',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#999',
                  }}>
                    Docent Audio Transcript — Auto-transcribed
                  </div>
                </div>

                <div
                  ref={docentScrollRef}
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 24px',
                    backgroundColor: '#faf9f5',
                  }}
                >
                  <pre style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '11.5px',
                    lineHeight: '1.9',
                    color: '#2a2a2a',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {chairs[selectedChair].docent.slice(0, textCursor)}
                    {textCursor < chairs[selectedChair].docent.length && (
                      <span style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '13px',
                        backgroundColor: '#555',
                        verticalAlign: 'middle',
                        animation: 'subtlePulse 0.8s step-end infinite',
                      }} />
                    )}
                  </pre>
                </div>

                {/* Footer */}
                <div style={{
                  padding: '10px 24px',
                  borderTop: '1px solid #e0e0dc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f0f0ec',
                }}>
                  <div style={{
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#bbb',
                  }}>
                    Acc. {chairs[selectedChair].accession}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    color: '#ccc',
                    letterSpacing: '1px',
                  }}>
                    {textCursor >= chairs[selectedChair].docent.length
                      ? '— transcript complete —'
                      : `${Math.floor((textCursor / chairs[selectedChair].docent.length) * 100)}% transcribed`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #d0d0cc',
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0ec',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#bbb',
        }}>
          Museum of Chairs That Witnessed Things · Permanent Collection · Gallery 7
        </div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '1px',
          color: '#ccc',
          fontStyle: 'italic',
        }}>
          The chair is still warm.
        </div>
      </div>
    </div>
  );
}