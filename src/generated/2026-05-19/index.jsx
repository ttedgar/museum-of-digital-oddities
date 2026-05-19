import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [phase, setPhase] = useState('subpoena');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [redactedLines, setRedactedLines] = useState([]);
  const [redactionIndex, setRedactionIndex] = useState(0);
  const [survivingLineIndex, setSurvivingLineIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [suppressionStep, setSuppressionStep] = useState(0);
  const inputRef = useRef(null);

  const caseNumber = 'CASE NO. 00-DR-2019-∞';
  const exhibitDate = 'DATE: THE NIGHT YOU ALREADY KNOW';

  const intakeQuestions = [
    'State your full name as it appeared in the dream, even if it was different from your legal name, or if you had no name but only a feeling of being named.',
    'Describe the primary location. At what point did the location become your elementary school without changing in any observable way?',
    'Please list all exits used. Include exits that were present but could not be reached, exits that were doors to additional doors, and any exits that were also entrances to the same space.',
    'Identify the other party or parties. Was the other party aware they were symbolic? If yes, did they seem embarrassed about it?',
    'Describe the event which caused you to understand that something was wrong, noting that this understanding may have preceded the event itself.',
    'At any point did a figure with your mother\'s voice appear? If no figure was present, describe the voice anyway. If the voice was a staircase, describe the staircase.',
    'What were you trying to do when the dream changed the rules? Please indicate whether you were informed of the rule change in advance.',
    'Describe the feeling upon waking. Do not use the word "unsettled." You may use "legally compromised." You may use "present as evidence."',
  ];

  const legalTransform = (answer, questionIndex) => {
    const procedural = [
      'Court reporter notes: witness paused for an indeterminate period before responding. The pause was also entered into evidence.',
      'Court reporter notes: the spelling of the name was confirmed three times. On the third confirmation, the name had changed.',
      'Court reporter notes: counsel requested a diagram of the exits. The diagram, when produced, depicted only the interior of the diagram.',
      'Court reporter notes: the other party, when contacted for comment, denied being a symbol but could not produce documentation to that effect.',
      'Court reporter notes: the witness was asked to clarify the chronology. The witness indicated that chronology was not applicable. This was sustained.',
      'Court reporter notes: the staircase was entered into evidence as Exhibit B. Exhibit B has not been located. The bailiff cannot find Exhibit B.',
      'Court reporter notes: the rules, as described, were not rules but a texture. The court accepted this. The court has seen this before.',
      'Court reporter notes: the witness was instructed not to use the word "unsettled." The witness complied. The word appeared anyway in the transcript. It has been stricken. It is still there.',
    ];
    const trimmed = answer.trim() || '[WITNESS DECLINED TO ANSWER. THE SILENCE WAS TRANSCRIBED.]';
    return `THE WITNESS TESTIFIED, UNDER OATH ADMINISTERED IN A JURISDICTION THAT CANNOT BE NAMED, THAT: "${trimmed.toUpperCase()}." ${procedural[questionIndex] || 'Court reporter notes: see attached.'}`;
  };

  const generateTranscript = (finalAnswers) => {
    const lines = finalAnswers.map((ans, i) => legalTransform(ans, i));
    const surviving = finalAnswers.reduce((maxIdx, ans, i, arr) =>
      ans.length > arr[maxIdx].length ? i : maxIdx, 0);
    setTranscriptLines(lines);
    setRedactedLines(new Array(lines.length).fill(false));
    setSurvivingLineIndex(surviving);
    setPhase('transcript');
  };

  useEffect(() => {
    if (phase === 'suppression') {
      const timer = setTimeout(() => {
        setSuppressionStep(1);
        setTimeout(() => {
          setSuppressionStep(2);
          setTimeout(() => {
            setSuppressionStep(3);
            setRedactionIndex(0);
          }, 2000);
        }, 2500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (suppressionStep === 3 && transcriptLines.length > 0) {
      const interval = setInterval(() => {
        setRedactionIndex(prev => {
          const next = prev + 1;
          if (next > transcriptLines.length) {
            clearInterval(interval);
            setTimeout(() => setPhase('redacted'), 800);
            return prev;
          }
          return next;
        });
      }, 320);
      return () => clearInterval(interval);
    }
  }, [suppressionStep, transcriptLines.length]);

  useEffect(() => {
    if (redactionIndex > 0 && redactionIndex <= transcriptLines.length) {
      const lineToRedact = redactionIndex - 1;
      if (lineToRedact !== survivingLineIndex) {
        setRedactedLines(prev => {
          const updated = [...prev];
          updated[lineToRedact] = true;
          return updated;
        });
      }
    }
  }, [redactionIndex, survivingLineIndex, transcriptLines.length]);

  useEffect(() => {
    if (phase === 'intake' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentQuestion]);

  const handleAcknowledge = () => setPhase('intake');

  const handleAnswer = () => {
    const newAnswers = [...answers, inputValue];
    setAnswers(newAnswers);
    setInputValue('');
    if (currentQuestion + 1 >= intakeQuestions.length) {
      generateTranscript(newAnswers);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnswer();
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f0e8',
    fontFamily: '"Courier New", Courier, monospace',
    color: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    boxSizing: 'border-box',
  };

  const documentStyle = {
    width: '100%',
    maxWidth: '720px',
    backgroundColor: '#f8f4ec',
    border: '1px solid #c8c0b0',
    boxShadow: '2px 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
    padding: '50px 60px',
    boxSizing: 'border-box',
    position: 'relative',
  };

  const headerStyle = {
    textAlign: 'center',
    borderBottom: '2px solid #1a1a1a',
    paddingBottom: '20px',
    marginBottom: '30px',
  };

  const caseNumStyle = {
    fontSize: '10px',
    letterSpacing: '2px',
    marginBottom: '8px',
    color: '#444',
  };

  const titleStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '6px',
  };

  const subtitleStyle = {
    fontSize: '11px',
    color: '#555',
    letterSpacing: '1px',
  };

  const bodyTextStyle = {
    fontSize: '12px',
    lineHeight: '1.9',
    marginBottom: '20px',
    textAlign: 'justify',
  };

  const stampStyle = {
    position: 'absolute',
    top: '30px',
    right: '40px',
    border: '3px solid rgba(180,20,20,0.6)',
    color: 'rgba(180,20,20,0.6)',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    padding: '6px 10px',
    transform: 'rotate(8deg)',
    textTransform: 'uppercase',
  };

  const buttonStyle = {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    backgroundColor: '#1a1a1a',
    color: '#f5f0e8',
    border: 'none',
    padding: '12px 24px',
    cursor: 'pointer',
    marginTop: '20px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const sectionLabelStyle = {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '8px',
    borderTop: '1px solid #ccc',
    paddingTop: '16px',
  };

  if (phase === 'subpoena') {
    return (
      <div style={pageStyle}>
        <style>{`
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
          body { margin: 0; }
        `}</style>
        <div style={documentStyle}>
          <div style={{
            ...stampStyle,
            animation: 'flicker 4s ease-in-out infinite',
          }}>
            OFFICIAL NOTICE
          </div>
          <div style={headerStyle}>
            <div style={caseNumStyle}>{caseNumber}</div>
            <div style={titleStyle}>Subpoena Duces Tecum</div>
            <div style={subtitleStyle}>In the matter of: <em>The State v. A Dream You Had</em></div>
            <div style={{...subtitleStyle, marginTop: '4px'}}>{exhibitDate}</div>
          </div>

          <div style={bodyTextStyle}>
            TO: THE DREAMER CURRENTLY IN POSSESSION OF THIS DOCUMENT
          </div>

          <div style={bodyTextStyle}>
            YOU ARE HEREBY COMMANDED to appear before this Court and produce, in full, the dream
            described in the attached intake form, which has not yet been attached because you
            have not yet completed it. The dream is required as material evidence in the above-captioned
            proceeding.
          </div>

          <div style={bodyTextStyle}>
            THE COURT HAS DETERMINED that the dream in question constitutes a discoverable record
            under Rule 26(b)(1) of the Federal Rules of Civil Procedure (as amended to include
            unconscious disclosures). Failure to produce the dream may result in sanctions,
            adverse inference instructions, or continued uncertainty about the staircase.
          </div>

          <div style={bodyTextStyle}>
            THE BAILIFF CANNOT FIND THE DEFENDANT. The defendant was a staircase. The staircase
            had your mother's voice. These facts are not in dispute.
          </div>

          <div style={{
            borderTop: '1px dashed #aaa',
            borderBottom: '1px dashed #aaa',
            padding: '16px 0',
            margin: '24px 0',
            fontSize: '11px',
            lineHeight: '1.8',
            color: '#333',
          }}>
            <div style={{fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px'}}>NOTICE TO DREAMER:</div>
            You have certain rights under the Unconscious Disclosure Protection Act of an unspecified year.
            These rights include the right to remain asleep, the right to an interpreter if the dream
            was in a language you do not speak, and the right to object to the admission of any
            symbolic content on the grounds that you did not intend it.
            <br/><br/>
            These rights will be disregarded.
          </div>

          <div style={bodyTextStyle}>
            You must acknowledge receipt of this subpoena to proceed. Acknowledgment constitutes
            agreement that the dream occurred, that you were present, and that you understood,
            on some level, what it meant.
          </div>

          <button style={buttonStyle} onClick={handleAcknowledge}>
            ACKNOWLEDGE RECEIPT
          </button>

          <div style={{
            textAlign: 'center',
            fontSize: '9px',
            color: '#aaa',
            marginTop: '30px',
            letterSpacing: '1px',
          }}>
            COURT OF UNSPECIFIED JURISDICTION — DIVISION OF NOCTURNAL EVIDENCE
            <br/>
            This document is legally binding in all jurisdictions that exist at 3:00 AM.
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'intake') {
    const progress = currentQuestion / intakeQuestions.length;
    return (
      <div style={pageStyle}>
        <div style={documentStyle}>
          <div style={headerStyle}>
            <div style={caseNumStyle}>{caseNumber}</div>
            <div style={titleStyle}>Dream Intake Form — Exhibit A (Pre-Production)</div>
            <div style={subtitleStyle}>
              Question {currentQuestion + 1} of {intakeQuestions.length} — Complete all fields under penalty of continued not-knowing
            </div>
          </div>

          <div style={{
            width: '100%',
            height: '3px',
            backgroundColor: '#e0d8cc',
            marginBottom: '30px',
          }}>
            <div style={{
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor: '#1a1a1a',
              transition: 'width 0.4s ease',
            }} />
          </div>

          <div style={sectionLabelStyle}>INTAKE QUESTION {currentQuestion + 1}</div>

          <div style={{
            fontSize: '12px',
            lineHeight: '1.9',
            marginBottom: '28px',
            padding: '16px',
            backgroundColor: '#ede8de',
            borderLeft: '3px solid #1a1a1a',
          }}>
            {intakeQuestions[currentQuestion]}
          </div>

          <div style={sectionLabelStyle}>YOUR ANSWER (FOR THE RECORD)</div>

          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Answer truthfully. The court can tell."
            style={{
              width: '100%',
              minHeight: '100px',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '12px',
              backgroundColor: '#f8f4ec',
              border: '1px solid #999',
              padding: '12px',
              resize: 'vertical',
              lineHeight: '1.7',
              color: '#1a1a1a',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />

          <div style={{
            fontSize: '9px',
            color: '#aaa',
            marginTop: '6px',
            letterSpacing: '1px',
          }}>
            PRESS ENTER TO SUBMIT — OR CLICK BELOW — YOU MAY LEAVE THE FIELD BLANK BUT THE BLANK WILL BE TRANSCRIBED
          </div>

          <button style={buttonStyle} onClick={handleAnswer}>
            ENTER FOR THE RECORD
          </button>

          {currentQuestion > 0 && (
            <div style={{
              marginTop: '24px',
              borderTop: '1px solid #ddd',
              paddingTop: '16px',
              fontSize: '10px',
              color: '#999',
            }}>
              PREVIOUSLY ENTERED:
              {answers.slice(-2).map((ans, i) => (
                <div key={i} style={{marginTop: '6px', fontStyle: 'italic', color: '#bbb'}}>
                  Q{answers.length - (answers.slice(-2).length - i - 1)}: "{ans || '[silence]'}"
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'transcript') {
    return (
      <div style={pageStyle}>
        <style>{`
          @keyframes stampIn {
            0% { transform: rotate(-3deg) scale(1.4); opacity: 0; }
            60% { transform: rotate(-3deg) scale(0.95); opacity: 1; }
            100% { transform: rotate(-3deg) scale(1); opacity: 1; }
          }
        `}</style>
        <div style={documentStyle}>
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            border: '3px solid rgba(180,20,20,0.55)',
            color: 'rgba(180,20,20,0.55)',
            fontSize: '10px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            padding: '5px 9px',
            transform: 'rotate(-3deg)',
            textTransform: 'uppercase',
            animation: 'stampIn 0.5s ease forwards',
          }}>
            EXHIBIT A
          </div>

          <div style={headerStyle}>
            <div style={caseNumStyle}>{caseNumber}</div>
            <div style={titleStyle}>Official Dream Transcript</div>
            <div style={subtitleStyle}>
              IN THE COURT OF UNSPECIFIED JURISDICTION<br/>
              Court Reporter: Unknown. The reporter was present. The reporter understood.
            </div>
          </div>

          <div style={{
            fontSize: '10px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#888',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            THE FOLLOWING IS A TRUE AND ACCURATE RECORD<br/>
            INSOFAR AS ACCURACY IS APPLICABLE
          </div>

          {transcriptLines.map((line, i) => (
            <div key={i} style={{
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px dotted #ccc',
            }}>
              <div style={{
                fontSize: '9px',
                letterSpacing: '2px',
                color: '#aaa',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                LINE {i + 1} / INTAKE RESPONSE {i + 1}
                {i === survivingLineIndex && (
                  <span style={{color: 'rgba(180,20,20,0.5)', marginLeft: '8px'}}>
                    [FLAGGED BY OPPOSING COUNSEL]
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '11px',
                lineHeight: '1.8',
                color: '#222',
              }}>
                {line}
              </div>
            </div>
          ))}

          <div style={{
            borderTop: '2px solid #1a1a1a',
            paddingTop: '20px',
            marginTop: '10px',
            fontSize: '10px',
            color: '#555',
            lineHeight: '1.7',
          }}>
            <em>
              This transcript has been certified by a notary whose name is illegible.
              The seal is present. The seal is watching.
              Any reproduction of this document constitutes a secondary dream event
              and may be subject to additional subpoenas.
            </em>
          </div>

          <button
            style={{...buttonStyle, backgroundColor: '#8b0000'}}
            onClick={() => setPhase('suppression')}
          >
            SUBMIT TO COURT
          </button>

          <div style={{
            textAlign: 'center',
            fontSize: '9px',
            color: '#bbb',
            marginTop: '12px',
            letterSpacing: '1px',
          }}>
            SUBMISSION IS IRREVOCABLE — THIS DREAM WILL BECOME PART OF THE PUBLIC RECORD
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'suppression') {
    return (
      <div style={pageStyle}>
        <style>{`
          @keyframes typeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes redactSlide {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes gavel {
            0% { transform: rotate(-30deg) translateY(-10px); }
            50% { transform: rotate(10deg) translateY(5px); }
            100% { transform: rotate(0deg) translateY(0); }
          }
        `}</style>
        <div style={documentStyle}>
          <div style={headerStyle}>
            <div style={caseNumStyle}>{caseNumber}</div>
            <div style={titleStyle}>Motion Proceedings</div>
          </div>

          {suppressionStep >= 1 && (
            <div style={{
              animation: 'typeIn 0.6s ease forwards',
              marginBottom: '24px',
              padding: '16px',
              border: '1px solid #c8c0b0',
              backgroundColor: '#ede8de',
            }}>
              <div style={{
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '10px',
                color: '#888',
              }}>
                OPPOSING COUNSEL FILING — RECEIVED
              </div>
              <div style={{fontSize: '12px', lineHeight: '1.8'}}>
                <strong>MOTION TO SUPPRESS DREAM EVIDENCE</strong>
                <br/><br/>
                Counsel moves to suppress the entirety of Exhibit A (Dream Transcript) on the
                following grounds:
                <br/><br/>
                1. The dream is hearsay from a version of the witness that no longer exists.
                <br/>
                2. The version of the witness who had the dream cannot be cross-examined,
                as she has been replaced by subsequent versions who remember it differently.
                <br/>
                3. The staircase is unavailable for deposition.
                <br/>
                4. The feelings described in Lines {survivingLineIndex + 1} are particularly inadmissible
                on the grounds that they are too accurate.
              </div>
            </div>
          )}

          {suppressionStep >= 2 && (
            <div style={{
              animation: 'typeIn 0.6s ease forwards',
              marginBottom: '24px',
              padding: '16px',
              borderLeft: '4px solid #1a1a1a',
              backgroundColor: '#f0ece0',
            }}>
              <div style={{
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '10px',
                color: '#888',
              }}>
                JUDGE'S RULING
              </div>
              <div style={{fontSize: '12px', lineHeight: '1.8'}}>
                <div style={{
                  animation: 'gavel 0.4s ease',
                  display: 'inline-block',
                  fontSize: '20px',
                  marginBottom: '8px',
                }}>⚖</div>
                <br/>
                <strong>SUSTAINED.</strong>
                <br/><br/>
                The court agrees that the witness who had the dream is no longer present.
                The court notes that she has not been present for some time. The court
                has seen this before and declines to comment further on the matter of
                the staircase.
                <br/><br/>
                The transcript will be redacted. All lines will be suppressed except
                the one the witness would prefer to keep private. This is standard procedure.
              </div>
            </div>
          )}

          {suppressionStep >= 3 && (
            <div style={{animation: 'typeIn 0.4s ease forwards'}}>
              <div style={{
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                color: '#888',
              }}>
                EXHIBIT A — REDACTION IN PROGRESS
              </div>
              {transcriptLines.map((line, i) => (
                <div key={i} style={{
                  marginBottom: '12px',
                  position: 'relative',
                  minHeight: '24px',
                }}>
                  {redactedLines[i] ? (
                    <div style={{
                      backgroundColor: '#1a1a1a',
                      height: '18px',
                      width: '100%',
                      display: 'block',
                      animation: 'redactSlide 0.3s ease forwards',
                    }} />
                  ) : (
                    <div style={{
                      fontSize: '10px',
                      lineHeight: '1.6',
                      color: i === survivingLineIndex ? '#222' : '#888',
                    }}>
                      {line.substring(0, 80)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'redacted') {
    return (
      <div style={pageStyle}>
        <style>{`
          @keyframes stampFinal {
            0% { transform: rotate(4deg) scale(1.6); opacity: 0; }
            40% { transform: rotate(4deg) scale(0.9); opacity: 1; }
            100% { transform: rotate(4deg) scale(1); opacity: 1; }
          }
          @keyframes pulseRed {
            0%, 100% { color: rgba(180,20,20,0.7); }
            50% { color: rgba(180,20,20,1); }
          }
          @keyframes fadeInSurvivor {
            0% { opacity: 0; background-color: rgba(255,255,200,0.8); }
            100% { opacity: 1; background-color: rgba(255,255,200,0); }
          }
        `}</style>
        <div style={documentStyle}>
          <div style={{
            position: 'absolute',
            top: '35px',
            right: '35px',
            border: '4px solid rgba(180,20,20,0.7)',
            color: 'rgba(180,20,20,0.7)',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '3px',
            padding: '8px 14px',
            transform: 'rotate(4deg)',
            textTransform: 'uppercase',
            animation: 'stampFinal 0.6s ease 0.3s both',
          }}>
            CASE DISMISSED
          </div>

          <div style={headerStyle}>
            <div style={caseNumStyle}>{caseNumber}</div>
            <div style={titleStyle}>Exhibit A — Final Redacted Version</div>
            <div style={subtitleStyle}>
              FOR THE PUBLIC RECORD
              <br/>
              All suppressed material has been removed in accordance with the court's order.
            </div>
          </div>

          <div style={{
            fontSize: '10px',
            letterSpacing: '1px',
            color: '#999',
            marginBottom: '24px',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}>
            THE FOLLOWING REPRESENTS THE COMPLETE OFFICIAL RECORD OF EXHIBIT A
          </div>

          {transcriptLines.map((line, i) => (
            <div key={i} style={{
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px dotted #ddd',
            }}>
              <div style={{
                fontSize: '9px',
                letterSpacing: '1px',
                color: '#bbb',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}>
                LINE {i + 1}
              </div>
              {i === survivingLineIndex ? (
                <div style={{
                  fontSize: '12px',
                  lineHeight: '1.9',
                  color: '#1a1a1a',
                  padding: '12px',
                  border: '1px solid rgba(180,20,20,0.3)',
                  backgroundColor: 'rgba(255,255,220,0.3)',
                  animation: 'fadeInSurvivor 1.5s ease forwards',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '8px',
                    fontSize: '8px',
                    letterSpacing: '2px',
                    color: 'rgba(180,20,20,0.7)',
                    textTransform: 'uppercase',
                    animation: 'pulseRed 2s ease-in-out infinite',
                  }}>
                    ▲ NOT SUPPRESSED ▲
                  </div>
                  {line}
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#1a1a1a',
                  height: '16px',
                  width: `${75 + (i * 7) % 25}%`,
                  display: 'block',
                }} />
              )}
            </div>
          ))}

          <div style={{
            borderTop: '2px solid #1a1a1a',
            paddingTop: '20px',
            marginTop: '20px',
            fontSize: '10px',
            color: '#666',
            lineHeight: '1.8',
            textAlign: 'center',
          }}>
            This matter is closed.
            <br/>
            The staircase remains at large.
            <br/>
            The court thanks you for your cooperation and regrets the inconvenience
            of having had the dream in the first place.
          </div>

          <div style={{
            marginTop: '30px',
            padding: '16px',
            backgroundColor: '#ede8de',
            border: '1px solid #c8c0b0',
            fontSize: '10px',
            lineHeight: '1.8',
            color: '#555',
          }}>
            <strong>NOTICE:</strong> The above unsuppressed line (Line {survivingLineIndex + 1}) has been
            read into the record and is now part of the permanent public archive.
            It will be read aloud at proceedings you are not invited to.
            It will be read in a room with good acoustics.
            Someone in that room will recognize it.
          </div>

          <button
            style={{
              ...buttonStyle,
              backgroundColor: '#555',
              marginTop: '30px',
              fontSize: '10px',
            }}
            onClick={() => {
              setPhase('subpoena');
              setCurrentQuestion(0);
              setAnswers([]);
              setTranscriptLines([]);
              setRedactedLines([]);
              setRedactionIndex(0);
              setSurvivingLineIndex(0);
              setInputValue('');
              setSuppressionStep(0);
            }}
          >
            PETITION FOR A NEW DREAM
          </button>
        </div>
      </div>
    );
  }

  return null;
}