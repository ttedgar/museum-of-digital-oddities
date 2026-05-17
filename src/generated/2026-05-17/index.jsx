import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [phase, setPhase] = useState('queue');
  const [formData, setFormData] = useState({
    perishables: '',
    prohibited: '',
    acquired: '',
    currency: '',
  });
  const [activeField, setActiveField] = useState(null);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [inspectionIndex, setInspectionIndex] = useState(0);
  const [inspectionResponse, setInspectionResponse] = useState('');
  const [officerMessage, setOfficerMessage] = useState('');
  const [officerTyping, setOfficerTyping] = useState(false);
  const [stampVisible, setStampVisible] = useState(false);
  const [stampPressed, setStampPressed] = useState(false);
  const [stampRead, setStampRead] = useState(false);
  const [receiptItems, setReceiptItems] = useState([]);
  const [queuePosition, setQueuePosition] = useState(Math.floor(Math.random() * 5) + 3);
  const [verdictItems, setVerdictItems] = useState([]);
  const [verdictRevealIndex, setVerdictRevealIndex] = useState(0);
  const [inspectionAnswers, setInspectionAnswers] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const typewriterRef = useRef(null);
  const queueRef = useRef(null);

  const CATEGORIES = {
    perishables: 'PERISHABLES',
    prohibited: 'PROHIBITED GOODS',
    acquired: 'ITEMS ACQUIRED ABROAD',
    currency: 'AMOUNT OF CURRENCY',
  };

  const PLACEHOLDERS = {
    perishables: 'Any joy that may have spoiled in transit. Warmth borrowed and not returned. The particular quality of Tuesday mornings.',
    prohibited: 'Certainties not permitted across this border. Fixed ideas about who you were. The version of them you still carry.',
    acquired: 'A way of holding your shoulders you picked up from someone else. New tolerances. A different relationship with silence.',
    currency: 'How much of that time do you still have on you — round to the nearest feeling.',
  };

  const OFFICER_QUESTIONS = {
    perishables: [
      'Can you describe the condition of these items at the time of departure?',
      'Were these perishables stored properly during transit, or did you leave them somewhere warm?',
      'At what point did you notice the spoilage? Before or after you left?',
    ],
    prohibited: [
      'You are aware these items are not permitted. Do you intend to declare them anyway?',
      'How long have you been carrying these? Were you aware of their status when you acquired them?',
      'These certainties — are they yours originally, or did you bring them back for someone else?',
    ],
    acquired: [
      'Can you confirm you did not pay for these items? Some things acquired abroad are still a form of debt.',
      'Do these items belong to you now, or are you still borrowing them?',
      'Were these acquired voluntarily, or did they attach themselves during the journey?',
    ],
    currency: [
      'Currency must be declared in full. Is there any you failed to mention?',
      'How do you intend to spend this? Some denominations are not accepted here.',
      'Is this amount more or less than you started with? We need an accounting.',
    ],
  };

  const EMOTIONAL_KEYWORDS = ['love', 'lost', 'gone', 'still', 'never', 'always', 'miss', 'grief', 'hurt', 'broke', 'end', 'left', 'stay', 'remember', 'forget', 'pain', 'hope', 'wish', 'sorry', 'hold', 'alone'];
  const CLEARED_KEYWORDS = ['accept', 'peace', 'okay', 'fine', 'learning', 'understand', 'carrying', 'keeping', 'mine', 'ready', 'present', 'now', 'here', 'choose', 'both', 'all', 'everything'];
  const CONFISCATED_KEYWORDS = ['done', 'over', 'finished', 'gone', 'lost', 'gave', 'left', 'threw', 'abandoned', 'past', 'never', 'ended', 'stopped', 'quit', 'released', 'let go'];

  const typewriterEffect = useCallback((text, onComplete) => {
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    setOfficerMessage('');
    setOfficerTyping(true);
    setCanProceed(false);
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setOfficerMessage(text.slice(0, i));
        i++;
        typewriterRef.current = setTimeout(type, 28);
      } else {
        setOfficerTyping(false);
        if (onComplete) onComplete();
      }
    };
    type();
  }, []);

  // Queue countdown
  useEffect(() => {
    if (phase !== 'queue') return;
    if (queuePosition <= 0) return;
    queueRef.current = setTimeout(() => {
      setQueuePosition(p => p - 1);
    }, 1200);
    return () => clearTimeout(queueRef.current);
  }, [phase, queuePosition]);

  // Enter form phase
  const enterForm = () => {
    setPhase('form');
    typewriterEffect('Please complete the declaration form. Answer truthfully. We have seen everything. We are still somehow surprised.');
  };

  // Submit declaration
  const submitDeclaration = () => {
    const items = Object.entries(formData)
      .filter(([, v]) => v.trim().length > 0)
      .map(([category, text]) => ({ category, text, status: 'pending' }));

    if (items.length === 0) {
      typewriterEffect('Nothing declared. That is itself a declaration. Please try again.');
      return;
    }

    setFlaggedItems(items);
    setInspectionIndex(0);
    setInspectionAnswers([]);
    setPhase('inspection');
  };

  // Inspection phase: show officer question for current item
  useEffect(() => {
    if (phase !== 'inspection') return;
    if (flaggedItems.length === 0) return;
    if (inspectionIndex >= flaggedItems.length) {
      // Move to verdict
      setTimeout(() => setPhase('verdict'), 800);
      return;
    }
    const item = flaggedItems[inspectionIndex];
    const questions = OFFICER_QUESTIONS[item.category];
    const hasEmotional = EMOTIONAL_KEYWORDS.some(k => item.text.toLowerCase().includes(k));
    const qIndex = hasEmotional ? 0 : Math.floor(Math.random() * questions.length);
    const question = questions[qIndex];
    setInspectionResponse('');
    typewriterEffect(`[${CATEGORIES[item.category]}] — "${item.text.slice(0, 60)}${item.text.length > 60 ? '…' : ''}"\n\n${question}`, () => setCanProceed(true));
  }, [phase, inspectionIndex, flaggedItems]);

  const determineStatus = (text, response) => {
    const combined = (text + ' ' + response).toLowerCase();
    const clearedScore = CLEARED_KEYWORDS.filter(k => combined.includes(k)).length;
    const confiscatedScore = CONFISCATED_KEYWORDS.filter(k => combined.includes(k)).length;
    const totalLen = combined.trim().length;

    if (totalLen < 20) return 'quarantine';
    if (combined.includes('nothing') || combined.includes('none') || combined.includes('empty')) return 'quarantine';
    if (confiscatedScore > clearedScore) return 'confiscated';
    if (clearedScore > 0) return 'cleared';
    return 'quarantine';
  };

  const submitInspectionResponse = () => {
    if (!canProceed) return;
    const item = flaggedItems[inspectionIndex];
    const status = determineStatus(item.text, inspectionResponse);
    const answer = { ...item, response: inspectionResponse, status };
    setInspectionAnswers(prev => [...prev, answer]);
    setInspectionIndex(i => i + 1);
    setCanProceed(false);
  };

  // Verdict phase
  useEffect(() => {
    if (phase !== 'verdict') return;
    setVerdictRevealIndex(0);
    setVerdictItems([]);
    const receipts = [];
    inspectionAnswers.forEach(item => {
      if (item.status === 'confiscated') {
        receipts.push(`RCPT-${Math.floor(Math.random() * 90000) + 10000}: ${CATEGORIES[item.category]}`);
      }
    });
    setReceiptItems(receipts);

    typewriterEffect('Processing your declaration. Please remain at the desk.', () => {
      let idx = 0;
      const reveal = () => {
        if (idx < inspectionAnswers.length) {
          setVerdictItems(prev => [...prev, inspectionAnswers[idx]]);
          idx++;
          setTimeout(reveal, 900);
        } else {
          setTimeout(() => {
            setCanProceed(true);
          }, 600);
        }
      };
      setTimeout(reveal, 800);
    });
  }, [phase]);

  // Stamp phase
  useEffect(() => {
    if (phase !== 'stamp') return;
    setStampVisible(false);
    setStampPressed(false);
    setStampRead(false);
    typewriterEffect('Your declaration has been processed. Stand by for entry authorization.', () => {
      setTimeout(() => setStampVisible(true), 800);
    });
  }, [phase]);

  const pressStamp = () => {
    if (!stampVisible) return;
    setStampPressed(true);
    setTimeout(() => setStampRead(true), 600);
  };

  const statusIcon = (status) => {
    if (status === 'cleared') return '✓';
    if (status === 'confiscated') return '✗';
    return '⧗';
  };

  const statusColor = (status) => {
    if (status === 'cleared') return '#5a7a4a';
    if (status === 'confiscated') return '#8b3a2a';
    return '#8b7a2a';
  };

  const statusLabel = (status) => {
    if (status === 'cleared') return 'CLEARED';
    if (status === 'confiscated') return 'CONFISCATED';
    return 'QUARANTINE — PENDING REVIEW';
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#e8e0d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Courier New", Courier, monospace',
    padding: '20px',
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.04) 27px, rgba(0,0,0,0.04) 28px)',
  };

  const cardStyle = {
    backgroundColor: '#f5f0e8',
    border: '2px solid #1a1a1a',
    maxWidth: '680px',
    width: '100%',
    padding: '40px',
    position: 'relative',
    boxShadow: '4px 4px 0px #1a1a1a, 8px 8px 20px rgba(0,0,0,0.3)',
  };

  const headerStyle = {
    textAlign: 'center',
    borderBottom: '2px solid #1a1a1a',
    paddingBottom: '16px',
    marginBottom: '24px',
  };

  const titleStyle = {
    fontSize: '11px',
    letterSpacing: '3px',
    color: '#1a1a1a',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
  };

  const subtitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0 0 4px 0',
    letterSpacing: '1px',
  };

  const officerBoxStyle = {
    backgroundColor: '#ede8dc',
    border: '1px solid #1a1a1a',
    borderLeft: '4px solid #6b5a3a',
    padding: '14px 16px',
    marginBottom: '24px',
    fontSize: '13px',
    lineHeight: '1.7',
    color: '#1a1a1a',
    whiteSpace: 'pre-wrap',
    minHeight: '52px',
  };

  const labelStyle = {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#6b5a3a',
    marginBottom: '4px',
    display: 'block',
  };

  const textareaStyle = (focused) => ({
    width: '100%',
    backgroundColor: focused ? '#faf8f2' : '#f5f0e8',
    border: '1px solid #1a1a1a',
    borderTop: 'none',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '13px',
    color: '#1a1a1a',
    padding: '10px 12px',
    resize: 'vertical',
    minHeight: '80px',
    outline: 'none',
    lineHeight: '1.6',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s',
  });

  const fieldRowStyle = {
    marginBottom: '20px',
    borderTop: '1px solid #1a1a1a',
    paddingTop: '8px',
  };

  const buttonStyle = (disabled) => ({
    backgroundColor: disabled ? '#c0b89a' : '#1a1a1a',
    color: '#f5f0e8',
    border: 'none',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '12px 28px',
    cursor: disabled ? 'default' : 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s',
  });

  const queueNumStyle = {
    fontSize: '72px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: '-2px',
    lineHeight: '1',
    margin: '24px 0',
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes stampDown {
          0% { transform: scale(1.4) rotate(-3deg) translateY(-60px); opacity: 0; }
          40% { transform: scale(0.95) rotate(-2deg) translateY(4px); opacity: 1; }
          55% { transform: scale(1.05) rotate(-2deg) translateY(-2px); opacity: 1; }
          70% { transform: scale(1.0) rotate(-2deg) translateY(0px); opacity: 1; }
          100% { transform: scale(1.0) rotate(-2deg) translateY(0px); opacity: 1; }
        }
        @keyframes inkFade {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes verdictSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>

      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <p style={titleStyle}>Customs & Border Declaration — Form 7-Ω</p>
          <p style={subtitleStyle}>DECLARATION OF WHAT YOU BROUGHT BACK</p>
          <p style={{ fontSize: '10px', color: '#6b5a3a', margin: 0, letterSpacing: '1px' }}>
            ALL TRAVELERS MUST COMPLETE — RETAIN FOR YOUR RECORDS
          </p>
        </div>

        {/* QUEUE PHASE */}
        {phase === 'queue' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={officerBoxStyle}>
              {queuePosition > 0
                ? 'Please wait. Your case is being prepared. The queue moves at its own pace.'
                : 'The officer will see you now.'}
            </div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={labelStyle}>POSITION IN QUEUE</span>
              <div style={queueNumStyle}>
                {queuePosition === 0 ? '—' : queuePosition}
              </div>
              {queuePosition > 0 && (
                <p style={{ fontSize: '11px', color: '#6b5a3a', letterSpacing: '1px', margin: 0 }}>
                  PLEASE DO NOT LEAVE THE DESIGNATED AREA
                </p>
              )}
            </div>
            {queuePosition === 0 && (
              <div style={{ textAlign: 'center', marginTop: '20px', animation: 'fadeIn 0.4s ease' }}>
                <button style={buttonStyle(false)} onClick={enterForm}>
                  Next.
                </button>
              </div>
            )}
          </div>
        )}

        {/* FORM PHASE */}
        {phase === 'form' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={officerBoxStyle}>
              {officerMessage}
              {officerTyping && <span style={{ animation: 'blink 0.8s infinite' }}>▌</span>}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: '#6b5a3a', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                Declare all items acquired, lost, or transformed during the period in question.
                Failure to declare may result in delays of indeterminate length.
              </p>
            </div>

            {Object.entries(CATEGORIES).map(([key, label]) => (
              <div key={key} style={fieldRowStyle}>
                <label style={labelStyle}>{label}</label>
                <textarea
                  style={textareaStyle(activeField === key)}
                  placeholder={PLACEHOLDERS[key]}
                  value={formData[key]}
                  onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                  onFocus={() => setActiveField(key)}
                  onBlur={() => setActiveField(null)}
                />
              </div>
            ))}

            <div style={{ borderTop: '2px solid #1a1a1a', paddingTop: '16px', textAlign: 'right', marginTop: '8px' }}>
              <p style={{ fontSize: '10px', color: '#6b5a3a', margin: '0 0 12px 0', textAlign: 'left' }}>
                I declare that the above is accurate to the best of my current understanding.
                I understand that some items cannot be kept.
              </p>
              <button style={buttonStyle(false)} onClick={submitDeclaration}>
                Submit Declaration →
              </button>
            </div>
          </div>
        )}

        {/* INSPECTION PHASE */}
        {phase === 'inspection' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={labelStyle}>SECONDARY INSPECTION</span>
              <div style={{
                display: 'flex',
                gap: '4px',
                marginTop: '6px',
              }}>
                {flaggedItems.map((_, i) => (
                  <div key={i} style={{
                    height: '4px',
                    flex: 1,
                    backgroundColor: i < inspectionIndex ? '#6b5a3a' : i === inspectionIndex ? '#1a1a1a' : '#c0b89a',
                    transition: 'background-color 0.3s',
                  }} />
                ))}
              </div>
              <p style={{ fontSize: '10px', color: '#6b5a3a', margin: '6px 0 0 0' }}>
                ITEM {Math.min(inspectionIndex + 1, flaggedItems.length)} OF {flaggedItems.length}
              </p>
            </div>

            <div style={officerBoxStyle}>
              {officerMessage}
              {officerTyping && <span style={{ animation: 'blink 0.8s infinite' }}>▌</span>}
            </div>

            {inspectionIndex < flaggedItems.length && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <label style={labelStyle}>Your response</label>
                <textarea
                  style={{ ...textareaStyle(true), minHeight: '70px', borderTop: '1px solid #1a1a1a' }}
                  placeholder="Answer as honestly as you are able."
                  value={inspectionResponse}
                  onChange={e => setInspectionResponse(e.target.value)}
                  disabled={officerTyping}
                />
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button
                    style={buttonStyle(!canProceed)}
                    onClick={submitInspectionResponse}
                    disabled={!canProceed}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VERDICT PHASE */}
        {phase === 'verdict' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={officerBoxStyle}>
              {officerMessage}
              {officerTyping && <span style={{ animation: 'blink 0.8s infinite' }}>▌</span>}
            </div>

            <span style={labelStyle}>DETERMINATION OF STATUS</span>

            <div style={{ marginTop: '12px', marginBottom: '20px' }}>
              {verdictItems.map((item, i) => (
                <div key={i} style={{
                  borderBottom: '1px solid #c0b89a',
                  padding: '12px 0',
                  animation: 'verdictSlide 0.4s ease',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <span style={{
                    fontSize: '18px',
                    color: statusColor(item.status),
                    lineHeight: '1',
                    marginTop: '2px',
                    minWidth: '20px',
                  }}>
                    {statusIcon(item.status)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '10px',
                      letterSpacing: '2px',
                      color: statusColor(item.status),
                      marginBottom: '3px',
                    }}>
                      {CATEGORIES[item.category]} — {statusLabel(item.status)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#1a1a1a', lineHeight: '1.5' }}>
                      {item.text.slice(0, 80)}{item.text.length > 80 ? '…' : ''}
                    </div>
                    {item.status === 'quarantine' && (
                      <div style={{ fontSize: '10px', color: '#8b7a2a', marginTop: '3px' }}>
                        Held pending review. No projected completion date.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {receiptItems.length > 0 && verdictItems.length === inspectionAnswers.length && (
              <div style={{
                backgroundColor: '#f0ebe0',
                border: '1px dashed #8b3a2a',
                padding: '12px 16px',
                marginBottom: '16px',
                animation: 'fadeIn 0.5s ease',
              }}>
                <span style={{ ...labelStyle, color: '#8b3a2a' }}>CONFISCATION RECEIPT</span>
                {receiptItems.map((r, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#8b3a2a', marginTop: '4px' }}>{r}</div>
                ))}
                <div style={{ fontSize: '10px', color: '#6b5a3a', marginTop: '8px' }}>
                  These items are now in custody. You may not retrieve them. This is not a punishment.
                </div>
              </div>
            )}

            {canProceed && (
              <div style={{ textAlign: 'right', animation: 'fadeIn 0.4s ease' }}>
                <button style={buttonStyle(false)} onClick={() => setPhase('stamp')}>
                  Proceed to Authorization →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAMP PHASE */}
        {phase === 'stamp' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={officerBoxStyle}>
              {officerMessage}
              {officerTyping && <span style={{ animation: 'blink 0.8s infinite' }}>▌</span>}
            </div>

            {stampVisible && !stampPressed && (
              <div style={{ textAlign: 'center', margin: '24px 0', animation: 'fadeIn 0.4s ease' }}>
                <p style={{ fontSize: '11px', color: '#6b5a3a', letterSpacing: '1px', marginBottom: '16px' }}>
                  CLICK TO AUTHORIZE ENTRY
                </p>
                <div
                  onClick={pressStamp}
                  style={{
                    display: 'inline-block',
                    cursor: 'pointer',
                    animation: 'fadeIn 0.5s ease',
                  }}
                >
                  <div style={{
                    width: '160px',
                    height: '160px',
                    border: '6px solid #7a2a1a',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f0e8',
                    color: '#7a2a1a',
                    fontFamily: '"Courier New", Courier, monospace',
                    transition: 'transform 0.1s, box-shadow 0.1s',
                    boxShadow: '0 4px 12px rgba(122,42,26,0.2)',
                    userSelect: 'none',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(122,42,26,0.35)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(122,42,26,0.2)';
                    }}
                  >
                    <div style={{ fontSize: '9px', letterSpacing: '2px', marginBottom: '4px' }}>ENTRY</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>AUTHORIZED</div>
                    <div style={{ fontSize: '8px', letterSpacing: '1px', marginTop: '4px', color: '#9a4a3a' }}>FORM 7-Ω</div>
                  </div>
                </div>
              </div>
            )}

            {stampPressed && (
              <div style={{ textAlign: 'center', margin: '24px 0' }}>
                <div style={{
                  display: 'inline-block',
                  animation: 'stampDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                }}>
                  <div style={{
                    width: '160px',
                    height: '160px',
                    border: '6px solid #7a2a1a',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: stampRead ? '#f5f0e8' : '#c03a20',
                    color: stampRead ? '#7a2a1a' : '#f5f0e8',
                    fontFamily: '"Courier New", Courier, monospace',
                    transition: 'background-color 0.8s, color 0.8s',
                    transform: 'rotate(-2deg)',
                    boxShadow: '0 2px 20px rgba(122,42,26,0.5)',
                    animation: stampRead ? 'inkFade 0.4s ease' : 'stampDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                    userSelect: 'none',
                  }}>
                    <div style={{ fontSize: '9px', letterSpacing: '2px', marginBottom: '4px' }}>ENTRY</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>AUTHORIZED</div>
                    <div style={{ fontSize: '8px', letterSpacing: '1px', marginTop: '4px' }}>FORM 7-Ω</div>
                  </div>
                </div>
              </div>
            )}

            {stampRead && (
              <div style={{ animation: 'fadeIn 0.6s ease' }}>
                <div style={{
                  border: '1px solid #1a1a1a',
                  padding: '20px',
                  marginBottom: '24px',
                  backgroundColor: '#faf8f2',
                  lineHeight: '2',
                }}>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#6b5a3a', marginBottom: '12px' }}>
                    ENTRY PERMIT — ISSUED THIS DATE
                  </div>
                  {[
                    ['NAME', 'The one who left. The one who returned.'],
                    ['DURATION OF STAY', 'Unknown'],
                    ['PURPOSE OF VISIT', 'Ongoing'],
                    ['ITEMS CLEARED', `${inspectionAnswers.filter(i => i.status === 'cleared').length} items authorized for re-entry`],
                    ['ITEMS IN QUARANTINE', `${inspectionAnswers.filter(i => i.status === 'quarantine').length} items under indefinite review`],
                    ['ITEMS CONFISCATED', `${inspectionAnswers.filter(i => i.status === 'confiscated').length} items surrendered at border`],
                    ['RESTRICTIONS', 'None that can be named here'],
                    ['CONDITIONS OF ENTRY', 'You are permitted to proceed. You are permitted to be changed.'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '16px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#6b5a3a', minWidth: '160px' }}>{k}:</span>
                      <span style={{ fontSize: '12px', color: '#1a1a1a', flex: 1 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={officerBoxStyle}>
                  "Welcome back. Duration of stay: unknown. Purpose of visit: ongoing."
                  <div style={{ fontSize: '10px', color: '#6b5a3a', marginTop: '8px' }}>
                    — The officer does not look up.
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #c0b89a', paddingTop: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#6b5a3a', margin: 0, letterSpacing: '1px' }}>
                    YOU MAY NOW PROCEED THROUGH THE GATE.<br />
                    RETAIN THIS PERMIT. OR DON'T. IT'S YOURS.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #c0b89a',
          marginTop: '24px',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '9px', color: '#9a8a6a', letterSpacing: '1px' }}>
            DEPT. OF INTERIOR CROSSINGS
          </span>
          <span style={{ fontSize: '9px', color: '#9a8a6a', letterSpacing: '1px' }}>
            THE QUEUE IS ALSO A QUESTION
          </span>
        </div>
      </div>
    </div>
  );
}