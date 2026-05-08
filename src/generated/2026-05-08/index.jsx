import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [phase, setPhase] = useState('notice');
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationAnswers, setVerificationAnswers] = useState({});
  const [qualified, setQualified] = useState(false);
  const [selectedReplacement, setSelectedReplacement] = useState(null);
  const [repDialogIndex, setRepDialogIndex] = useState(0);
  const [grievanceAttempts, setGrievanceAttempts] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const typingRef = useRef(null);
  const cursorRef = useRef(null);
  const grievanceRef = useRef(null);
  const offServiceDate = useRef(null);

  const offServiceDates = [
    'sometime in late [REDACTED]',
    'a Tuesday you almost remember',
    'the summer before third grade (unconfirmed)',
    'March or possibly April of a year that felt longer than most',
    'the day after the thing with the dog',
  ];

  useEffect(() => {
    offServiceDate.current = offServiceDates[Math.floor(Math.random() * offServiceDates.length)];
  }, []);

  const verificationQuestions = [
    {
      question: 'Was the sky in question primarily observed from a car window, backseat, during travel of indeterminate length?',
      context: 'Required for eligibility under Section 4.2(b) of the Formative Chromatic Exposure Act',
    },
    {
      question: 'Did the sky contain at least one cloud shaped like something that wasn\'t the thing you said it was?',
      context: 'Cloud ambiguity is a key indicator of affected product batches from this period',
    },
    {
      question: 'Was the blue in question a specific shade that you have not been able to locate since, despite looking?',
      context: 'Claimants must confirm the color has not been successfully reproduced in paint, screen, or memory',
    },
    {
      question: 'Did the sky feel like it belonged to you, specifically, in a way that is difficult to articulate to others?',
      context: 'Proprietary emotional encoding is a known defect in affected units',
    },
    {
      question: 'Do you sometimes look up and feel that the current sky is a reasonable facsimile but not the original?',
      context: 'This is the primary symptom. Please answer honestly. It doesn\'t matter either way.',
    },
  ];

  const repDialogue = [
    'Thank you for holding. Your call is— I\'m sorry, you\'re not on a call. Thank you for clicking. Your click is important to us.',
    'I\'m pulling up your file. ...Okay. Okay, I see it. Yeah. That\'s— that\'s a lot of sky.',
    'So what happened — and I want you to know this wasn\'t your fault — is that during your formative years, the sky blue distributed to your region was part of a batch that contained undisclosed chromatic substitution.',
    'Basically, what you remember as "the sky" is a proprietary blend that was never approved for long-term emotional use. It was supposed to be temporary. Nobody told anyone. Classic.',
    'I\'ve been on this case since— honestly I don\'t want to talk about it. I just need you to select a replacement sky from the approved list and we can close this ticket.',
    'Each replacement comes with documentation. I have to tell you that. I have to say "each replacement comes with documentation." That\'s just part of this.',
    'Take your time. I\'ll be here. I\'m always here.',
  ];

  const replacementSkies = [
    {
      id: 'technical',
      name: 'SKY-7743-A (Technically Accurate)',
      color: '#87CEEB',
      label: 'STANDARD ISSUE',
      disclaimer: 'This sky has been verified accurate to atmospheric light scattering models. Emotional resonance is NOT covered under this warranty. Any feelings of familiarity are coincidental and not the liability of this office.',
    },
    {
      id: 'resonant',
      name: 'SKY-2201-F (Correct Color, Emotional Void)',
      color: '#6CA0DC',
      label: 'CHROMATIC MATCH',
      disclaimer: 'Color has been matched to within 94% of original. However, this unit ships without the associated feelings of smallness and wonder. Those have been discontinued. A refund for emotional content is not available at this time or any future time.',
    },
    {
      id: 'pending',
      name: 'SKY-PENDING (Litigation Hold)',
      color: '#888888',
      label: 'PENDING LITIGATION',
      disclaimer: 'This replacement sky is currently the subject of ongoing proceedings in the matter of You v. The Passage of Time (Case No. 00-0000-UNRESOLVED). Do not attempt to feel nostalgic about this sky. It is evidence.',
    },
  ];

  const grievanceErrors = [
    'ERROR: This form has been out of service since ' + (offServiceDate.current || 'a date you cannot quite remember') + '. Please try again.',
    'SYSTEM NOTICE: Grievance escalation is temporarily unavailable. Temporarily has been in effect since ' + (offServiceDate.current || 'a date you cannot quite remember') + '.',
    'TIMEOUT: Your session expired. Your original session expired ' + (offServiceDate.current || 'a date you cannot quite remember') + '. These may be related.',
    'FORM ERROR 404: The original sky was not found. It was last indexed ' + (offServiceDate.current || 'a date you cannot quite remember') + '. We are sorry for any inconvenience.',
    'CRITICAL: This button has been disabled by court order pending resolution of the case. Filed: ' + (offServiceDate.current || 'a date you cannot quite remember') + '. Status: unresolved.',
    'NOTICE: We have logged your attempt. We have been logging your attempts since ' + (offServiceDate.current || 'a date you cannot quite remember') + '. Nothing has changed.',
  ];

  useEffect(() => {
    if (phase !== 'representative') return;
    if (typingRef.current) clearInterval(typingRef.current);
    setDisplayedText('');
    setTypingComplete(false);
    const fullText = repDialogue[repDialogIndex];
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setDisplayedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(typingRef.current);
        setTypingComplete(true);
      }
    }, 28);
    return () => clearInterval(typingRef.current);
  }, [repDialogIndex, phase]);

  useEffect(() => {
    if (cursorRef.current) clearInterval(cursorRef.current);
    cursorRef.current = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(cursorRef.current);
  }, []);

  useEffect(() => {
    if (grievanceAttempts > 0 && grievanceRef.current) {
      grievanceRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [grievanceAttempts]);

  const handleVerificationAnswer = (answer) => {
    const newAnswers = { ...verificationAnswers, [verificationStep]: answer };
    setVerificationAnswers(newAnswers);
    if (verificationStep < verificationQuestions.length - 1) {
      setVerificationStep(verificationStep + 1);
    } else {
      setQualified(true);
    }
  };

  const handleRepContinue = () => {
    if (repDialogIndex < repDialogue.length - 1) {
      setRepDialogIndex(repDialogIndex + 1);
    } else {
      setPhase('selection');
    }
  };

  const baseDoc = {
    maxWidth: '680px',
    margin: '0 auto',
    background: '#fff',
    border: '2px solid #000',
    padding: '48px 52px',
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    position: 'relative',
    boxSizing: 'border-box',
  };

  const stamp = {
    display: 'inline-block',
    border: '3px solid',
    padding: '4px 12px',
    fontWeight: 'bold',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    transform: 'rotate(-2deg)',
    position: 'absolute',
  };

  const sectionHeader = {
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    fontFamily: 'Georgia, serif',
    color: '#555',
    borderBottom: '1px solid #ccc',
    paddingBottom: '4px',
    marginBottom: '16px',
    marginTop: '32px',
  };

  const btn = {
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    border: '2px solid #000',
    background: '#000',
    color: '#fff',
    padding: '10px 24px',
    cursor: 'pointer',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginTop: '8px',
  };

  const btnOutline = {
    ...btn,
    background: '#fff',
    color: '#000',
  };

  const yesNoBtn = {
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    border: '2px solid #000',
    padding: '10px 32px',
    cursor: 'pointer',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: '0 8px',
  };

  const pageStyle = {
    minHeight: '100vh',
    background: '#e8e4dc',
    padding: '40px 20px',
    boxSizing: 'border-box',
  };

  const renderNotice = () => (
    <div style={baseDoc}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#888', marginBottom: '4px' }}>UNITED STATES CONSUMER MEMORY SAFETY COMMISSION</div>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#888' }}>OFFICE OF CHROMATIC INCIDENT RESPONSE</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#888', lineHeight: '1.6' }}>
          <div>CASE NO: CMR-{Math.floor(Math.random() * 90000) + 10000}-SKY</div>
          <div>FORM: CPSC-7741-R (Rev. 04)</div>
          <div>PRIORITY: PERSONAL</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '9px', color: '#999', letterSpacing: '4px', marginBottom: '8px' }}>
        {'|'.repeat(3)} {'||| || ||| | || |||'.split('').join('')} {'|'.repeat(3)}
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '8px', color: '#bbb', marginBottom: '24px' }}>
        7741-0000-RECALL-SKY-CHILDHOOD
      </div>

      <div style={{ ...stamp, top: '52px', right: '48px', borderColor: '#cc0000', color: '#cc0000', fontSize: '12px' }}>
        URGENT
      </div>

      <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '16px 0', margin: '24px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#cc0000', marginBottom: '8px', textTransform: 'uppercase' }}>Official Recall Notice</div>
        <div style={{ fontSize: '26px', fontWeight: 'bold', lineHeight: '1.2', letterSpacing: '-0.5px' }}>Recall Notice: Your Childhood Sky</div>
        <div style={{ fontSize: '13px', color: '#444', marginTop: '8px', fontStyle: 'italic' }}>Chromatic Product Recall — Formative Exposure Period (All Years)</div>
      </div>

      <p style={{ style: sectionHeader }}></p>
      <div style={sectionHeader}>Affected Population</div>
      <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#222', margin: '0 0 16px' }}>
        This notice applies to <strong>all individuals</strong> who, during their formative years, observed a specific shade of sky blue and formed what is clinically referred to as a <em>foundational chromatic memory</em>.
      </p>
      <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#222', margin: '0 0 16px' }}>
        It has come to the attention of this office that the sky blue distributed during this period was <strong>not the approved formula</strong>. An undisclosed substitution was made during manufacturing. You were not informed. We are informing you now.
      </p>

      <div style={sectionHeader}>Nature of the Defect</div>
      <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#222', margin: '0 0 16px' }}>
        The affected sky contains a proprietary chromatic compound (designated <strong>COMPOUND-7: Irreducible Childhood Blue</strong>) that was not approved for long-term emotional storage. Over time, this compound may cause:
      </p>
      <ul style={{ fontSize: '14px', lineHeight: '2', color: '#222', paddingLeft: '24px' }}>
        <li>Inability to locate the original color in current sky</li>
        <li>A persistent sense that the sky <em>used to mean something</em></li>
        <li>Involuntary recall triggered by car windows, late afternoon light, or nothing in particular</li>
        <li>The feeling that you have misplaced something large and blue and important</li>
      </ul>

      <div style={sectionHeader}>Required Action</div>
      <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#222', margin: '0 0 24px' }}>
        Please complete the verification process below to confirm receipt of affected product. A claims representative will then assist you in selecting a replacement sky from the currently approved inventory.
      </p>
      <p style={{ fontSize: '11px', color: '#888', lineHeight: '1.6', fontStyle: 'italic', margin: '0 0 32px' }}>
        Note: Original sky cannot be returned. The facility that processed your formative memories is no longer accepting deposits of that type. We understand this is not ideal. We are sorry. That is also not covered.
      </p>

      <div style={{ textAlign: 'center' }}>
        <button style={btn} onClick={() => setPhase('verification')}>
          Begin Verification
        </button>
      </div>
      <div style={{ marginTop: '32px', borderTop: '1px solid #ddd', paddingTop: '16px', fontSize: '10px', color: '#aaa', lineHeight: '1.8', textAlign: 'center' }}>
        CPSC FORM 7741-R · CHROMATIC MEMORY RECALL DIVISION · NOT FOR PUBLIC DISTRIBUTION<br/>
        This notice was generated specifically for you. Do not share with others. They have their own.
      </div>
    </div>
  );

  const renderVerification = () => {
    const q = verificationQuestions[verificationStep];
    const isComplete = qualified;

    return (
      <div style={baseDoc}>
        <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#888', marginBottom: '4px' }}>VERIFICATION FORM — SECTION B</div>
        <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>CHROMATIC EXPOSURE ELIGIBILITY QUESTIONNAIRE</div>

        <div style={{ borderTop: '4px solid #000', borderBottom: '2px solid #000', padding: '12px 0', marginBottom: '32px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Eligibility Verification</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Question {Math.min(verificationStep + 1, verificationQuestions.length)} of {verificationQuestions.length}
          </div>
        </div>

        {!isComplete ? (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: '#f9f9f9', border: '1px solid #ddd', padding: '24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', lineHeight: '1.7', color: '#111', marginBottom: '16px', fontStyle: 'italic' }}>
                "{q.question}"
              </div>
              <div style={{ fontSize: '11px', color: '#888', letterSpacing: '1px' }}>
                {q.context}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
              <button
                style={{ ...yesNoBtn, background: '#000', color: '#fff' }}
                onClick={() => handleVerificationAnswer('yes')}
              >
                Yes
              </button>
              <button
                style={{ ...yesNoBtn, background: '#fff', color: '#000' }}
                onClick={() => handleVerificationAnswer('no')}
              >
                No
              </button>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '4px', justifyContent: 'center' }}>
              {verificationQuestions.map((_, i) => (
                <div key={i} style={{
                  width: '24px',
                  height: '4px',
                  background: i < verificationStep ? '#000' : i === verificationStep ? '#555' : '#ddd',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ ...stamp, top: '80px', right: '48px', borderColor: '#0044aa', color: '#0044aa' }}>
              VERIFIED
            </div>
            <div style={{ border: '2px solid #000', padding: '24px', marginBottom: '24px', background: '#f9f9f9' }}>
              <div style={{ fontSize: '12px', letterSpacing: '2px', color: '#0044aa', marginBottom: '8px', textTransform: 'uppercase' }}>Eligibility Confirmed</div>
              <div style={{ fontSize: '16px', lineHeight: '1.7' }}>
                Your responses indicate receipt of the affected sky product. You are eligible to participate in the replacement program.
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              {verificationQuestions.map((q, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '12px', color: '#555' }}>
                  <span style={{ maxWidth: '80%' }}>{q.question.slice(0, 60)}...</span>
                  <span style={{ fontWeight: 'bold', color: '#000' }}>{verificationAnswers[i] === 'yes' ? 'YES' : 'NO'}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', lineHeight: '1.6' }}>
              Note: Eligibility is confirmed regardless of your answers. The sky was distributed universally. The questions were for our records.
            </p>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button style={btn} onClick={() => { setPhase('representative'); setRepDialogIndex(0); }}>
                Connect to Representative
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRepresentative = () => {
    const isLast = repDialogIndex === repDialogue.length - 1;

    return (
      <div style={{ ...baseDoc, background: '#faf8f4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #000' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ddd', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            😔
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>CLAIMS REPRESENTATIVE</div>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '1px' }}>CHROMATIC RECALL DIVISION · EXT. 7741 · STATUS: AVAILABLE (TECHNICALLY)</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '10px', color: '#aaa', textAlign: 'right' }}>
            <div>CASE OPEN</div>
            <div style={{ color: '#cc6600' }}>■ ACTIVE</div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '24px', minHeight: '120px', marginBottom: '16px', position: 'relative' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#bbb', marginBottom: '12px', textTransform: 'uppercase' }}>
            Representative — Message {repDialogIndex + 1} of {repDialogue.length}
          </div>
          <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#222' }}>
            {displayedText}
            {!typingComplete && (
              <span style={{ opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}>|</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {repDialogIndex > 0 && repDialogue.slice(0, repDialogIndex).map((line, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#aaa', fontStyle: 'italic', padding: '4px 8px', background: '#f0f0f0', border: '1px solid #e0e0e0', maxWidth: '100%' }}>
              {line.slice(0, 50)}...
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button
            style={{ ...btn, opacity: typingComplete ? 1 : 0.4, cursor: typingComplete ? 'pointer' : 'not-allowed' }}
            onClick={() => typingComplete && handleRepContinue()}
          >
            {isLast ? 'View Replacement Options' : 'Continue'}
          </button>
        </div>

        <div style={{ marginTop: '32px', borderTop: '1px solid #e0e0e0', paddingTop: '16px', fontSize: '10px', color: '#bbb', lineHeight: '1.8' }}>
          This conversation is being recorded for quality assurance purposes. Quality has not been assured since {offServiceDate.current || 'a date we cannot locate'}. We appreciate your patience.
        </div>
      </div>
    );
  };

  const renderSelection = () => (
    <div style={baseDoc}>
      <div style={{ borderTop: '4px solid #000', borderBottom: '2px solid #000', padding: '12px 0', marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>Step 3 of 3</div>
        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Select Replacement Sky</div>
        <div style={{ fontSize: '13px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>All options are final. Choose carefully. Or don't. It doesn't change much.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        {replacementSkies.map((sky) => (
          <div
            key={sky.id}
            style={{
              border: selectedReplacement === sky.id ? '3px solid #000' : '1px solid #ccc',
              padding: '20px',
              cursor: 'pointer',
              background: selectedReplacement === sky.id ? '#f9f9f9' : '#fff',
              transition: 'all 0.2s',
              position: 'relative',
            }}
            onClick={() => setSelectedReplacement(sky.id)}
          >
            {selectedReplacement === sky.id && (
              <div style={{ ...stamp, top: '16px', right: '16px', borderColor: '#0044aa', color: '#0044aa', fontSize: '10px', transform: 'rotate(1deg)' }}>
                SELECTED
              </div>
            )}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                width: '180px',
                height: '110px',
                background: sky.color,
                flexShrink: 0,
                border: '1px solid #aaa',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  padding: '4px 8px',
                  width: '100%',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  boxSizing: 'border-box',
                }}>
                  {sky.label}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {sky.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.7', fontStyle: 'italic' }}>
                  {sky.disclaimer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          style={{ ...btn, opacity: selectedReplacement ? 1 : 0.4, cursor: selectedReplacement ? 'pointer' : 'not-allowed' }}
          onClick={() => selectedReplacement && setPhase('accepted')}
        >
          Accept Replacement
        </button>
        <button style={{ ...btnOutline, borderColor: '#cc0000', color: '#cc0000' }} onClick={() => setPhase('grievance')}>
          I Want My Original Sky
        </button>
      </div>

      <div style={{ marginTop: '24px', fontSize: '10px', color: '#bbb', lineHeight: '1.8', borderTop: '1px solid #eee', paddingTop: '16px' }}>
        By selecting a replacement sky, you agree to relinquish all claims to the original. Original sky will be archived in a facility you do not have access to. This is standard procedure.
      </div>
    </div>
  );

  const renderAccepted = () => {
    const sky = replacementSkies.find(s => s.id === selectedReplacement);
    return (
      <div style={baseDoc}>
        <div style={{ ...stamp, top: '60px', right: '48px', borderColor: '#006600', color: '#006600', fontSize: '14px', transform: 'rotate(-3deg)' }}>
          PROCESSED
        </div>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#006600', marginBottom: '8px', textTransform: 'uppercase' }}>Recall Resolution Confirmed</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Your Replacement Has Been Issued</div>
          <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>Case No. CMR-SKY-CHILDHOOD · Status: CLOSED (PENDING YOUR ACCEPTANCE)</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ width: '100%', maxWidth: '400px', height: '180px', background: sky.color, border: '2px solid #000', position: 'relative', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.85)', padding: '4px 10px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid #ccc' }}>
              {sky.label}
            </div>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', fontSize: '9px', letterSpacing: '1px' }}>
              ISSUED TO: YOU
            </div>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>{sky.name}</div>
        </div>

        <div style={{ background: '#f9f9f9', border: '1px solid #ddd', padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Warranty Disclaimer</div>
          <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.7', fontStyle: 'italic' }}>{sky.disclaimer}</div>
        </div>

        <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#444', textAlign: 'center' }}>
          Your claim has been processed. The replacement sky will be applied retroactively to applicable memories within 6-8 business years. You may not notice the difference. That is intended.
        </p>
        <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', fontStyle: 'italic', marginTop: '8px' }}>
          Thank you for your cooperation in this matter. The representative has gone home. He left without saying anything. He does that now.
        </p>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button style={btnOutline} onClick={() => { setPhase('notice'); setVerificationStep(0); setVerificationAnswers({}); setQualified(false); setSelectedReplacement(null); setRepDialogIndex(0); setGrievanceAttempts(0); }}>
            Start New Claim
          </button>
        </div>
      </div>
    );
  };

  const renderGrievance = () => {
    const errorIndex = Math.min(grievanceAttempts - 1, grievanceErrors.length - 1);
    const currentError = grievanceAttempts > 0 ? grievanceErrors[errorIndex] : null;

    return (
      <div style={baseDoc}>
        <div style={{ borderTop: '4px solid #cc0000', borderBottom: '2px solid #cc0000', padding: '12px 0', marginBottom: '32px', borderLeft: 'none', borderRight: 'none' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#cc0000', marginBottom: '4px', textTransform: 'uppercase' }}>Grievance Escalation — Form GE-7741-X</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Request for Original Sky</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>This form must be submitted to initiate escalation to a senior chromatic arbitrator.</div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          {[
            ['Claimant Name', '(You)'],
            ['Original Sky Description', 'The one from before. The real one.'],
            ['Basis for Grievance', 'It was mine. It was supposed to stay mine.'],
            ['Requested Resolution', 'Return of original, unsubstituted sky'],
            ['Supporting Documentation', 'I remember it. Isn\'t that enough?'],
          ].map(([label, value], i) => (
            <div key={i} style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '12px 0', gap: '16px' }}>
              <div style={{ width: '200px', fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', flexShrink: 0, paddingTop: '2px' }}>{label}</div>
              <div style={{ fontSize: '14px', color: '#333', fontStyle: 'italic' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff8f8', border: '1px solid #ffcccc', padding: '16px', marginBottom: '24px', fontSize: '12px', color: '#aa4444', lineHeight: '1.7' }}>
          <strong>NOTICE:</strong> This form has been under review since {offServiceDate.current || 'a date you cannot quite remember but feels significant'}. Submission does not guarantee review. Review does not guarantee resolution. Resolution is not currently available for this type of claim.
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            style={{ ...btn, background: '#cc0000', border: '2px solid #cc0000' }}
            onClick={() => setGrievanceAttempts(g => g + 1)}
          >
            Submit Grievance
          </button>
        </div>

        {currentError && (
          <div ref={grievanceRef} style={{ background: '#111', color: '#ff4444', padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.8', border: '2px solid #cc0000', marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ color: '#ff8888', marginBottom: '4px', fontSize: '10px', letterSpacing: '2px' }}>SYSTEM ERROR — ATTEMPT {grievanceAttempts}</div>
            {currentError}
          </div>
        )}

        {grievanceAttempts >= 3 && (
          <div style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', fontStyle: 'italic', lineHeight: '1.8', animation: 'fadeIn 0.5s ease' }}>
            You have submitted {grievanceAttempts} grievance attempt{grievanceAttempts !== 1 ? 's' : ''}.<br/>
            Each one has been logged. Each one is in a folder.<br/>
            The folder is in a room. The room is locked. The key is not missing.<br/>
            There is no key. There was never a key. The door was always locked.
          </div>
        )}

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button style={btnOutline} onClick={() => setPhase('selection')}>
            ← Return to Replacement Options
          </button>
        </div>
      </div>
    );
  };

  const renderPhase = () => {
    switch (phase) {
      case 'notice': return renderNotice();
      case 'verification': return renderVerification();
      case 'representative': return renderRepresentative();
      case 'selection': return renderSelection();
      case 'accepted': return renderAccepted();
      case 'grievance': return renderGrievance();
      default: return renderNotice();
    }
  };

  const phaseLabels = ['notice', 'verification', 'representative', 'selection'];
  const currentPhaseIndex = phaseLabels.indexOf(phase);

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        button:hover { filter: brightness(0.88); }
      `}</style>

      {currentPhaseIndex >= 0 && (
        <div style={{ maxWidth: '680px', margin: '0 auto 16px', display: 'flex', gap: '4px', alignItems: 'center', fontFamily: 'Georgia, serif', fontSize: '11px', color: '#aaa' }}>
          {phaseLabels.map((p, i) => (
            <span key={p} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: i <= currentPhaseIndex ? '#333' : '#ccc', fontWeight: i === currentPhaseIndex ? 'bold' : 'normal', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {p}
              </span>
              {i < phaseLabels.length - 1 && <span style={{ color: '#ddd' }}>›</span>}
            </span>
          ))}
        </div>
      )}

      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {renderPhase()}
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#bbb', fontFamily: 'Georgia, serif', letterSpacing: '2px' }}>
        CPSC CHROMATIC RECALL DIVISION · ALL SKIES RESERVED · NOT FOR REDISTRIBUTION
      </div>
    </div>
  );
}