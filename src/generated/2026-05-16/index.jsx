import { useState, useEffect, useRef } from 'react';

const QUESTIONS = [
  {
    id: 'ceiling',
    text: 'Was the ceiling height consistent with ambition?',
    options: [
      { label: 'Yes — it pressed down exactly as needed', value: 'a', weight: 12 },
      { label: 'No — it was too high and ambition escaped', value: 'b', weight: 27 },
      { label: 'The ceiling was a negotiation I lost', value: 'c', weight: 44 },
      { label: 'There was no ceiling, only the sense of one', value: 'd', weight: 61 },
    ],
  },
  {
    id: 'door',
    text: 'Did the door lock from the inside, the outside, or from a feeling?',
    options: [
      { label: 'Inside — I was the one doing the locking', value: 'a', weight: 8 },
      { label: 'Outside — others determined the terms', value: 'b', weight: 33 },
      { label: 'From a feeling, specifically dread', value: 'c', weight: 55 },
      { label: 'It did not lock. That was the lock.', value: 'd', weight: 71 },
    ],
  },
  {
    id: 'window',
    text: 'What did the window primarily admit?',
    options: [
      { label: 'Light, in its usual capacity', value: 'a', weight: 6 },
      { label: 'Too much Tuesday', value: 'b', weight: 29 },
      { label: 'The sound of someone else being happy', value: 'c', weight: 48 },
      { label: 'Possibilities that did not apply to me', value: 'd', weight: 66 },
    ],
  },
  {
    id: 'closet',
    text: 'Was the closet load-bearing?',
    options: [
      { label: 'Structurally, no. Otherwise, obviously.', value: 'a', weight: 52 },
      { label: 'It held things that had nowhere else to go', value: 'b', weight: 37 },
      { label: 'The closet was where I kept the other self', value: 'c', weight: 68 },
      { label: 'I never opened it fully. Precautionary.', value: 'd', weight: 19 },
    ],
  },
  {
    id: 'corner',
    text: 'Identify the corner in which dread primarily pooled.',
    options: [
      { label: 'Northeast — near the outlet that sparked', value: 'a', weight: 41 },
      { label: 'Southwest — furthest from the door', value: 'b', weight: 23 },
      { label: 'The corner was mobile. It followed me.', value: 'c', weight: 77 },
      { label: 'All corners equally. Democratic dread.', value: 'd', weight: 58 },
    ],
  },
  {
    id: 'floor',
    text: 'Did the floor hold a deposition?',
    options: [
      { label: 'Yes — the carpet remembered everything', value: 'a', weight: 34 },
      { label: 'The floor was impartial and I resented it', value: 'b', weight: 16 },
      { label: 'Certain areas were testimonial in nature', value: 'c', weight: 49 },
      { label: 'The floor refused to testify on my behalf', value: 'd', weight: 63 },
    ],
  },
  {
    id: 'frequency',
    text: 'The window remembers a frequency. What was it?',
    options: [
      { label: 'A frequency of longing, approximately 440Hz', value: 'a', weight: 31 },
      { label: 'The frequency of a television in another room', value: 'b', weight: 22 },
      { label: 'Silence at a frequency only I could hear', value: 'c', weight: 57 },
      { label: 'The frequency of not yet, not yet, not yet', value: 'd', weight: 74 },
    ],
  },
];

const ZONE_DATA = {
  window: {
    label: 'WINDOW — ZONE 1',
    intended: 'To admit natural light and provide visual egress to exterior environments, thereby supporting occupant orientation to diurnal cycles.',
    actual: 'The window functioned primarily as an admission device for non-light phenomena, including but not limited to: the sound of leisure occurring elsewhere, Tuesday in its most concentrated form, and a persistent implication that the exterior world was proceeding without adequate input from the occupant. The glazing has been found to retain frequency. This is not a defect. This is a finding.',
    citation: 'See Annotation 1-W: Inadmissible Admissions',
  },
  closet: {
    label: 'CLOSET — ZONE 2',
    intended: 'To provide enclosed storage for personal effects, seasonal items, and materials not in active use.',
    actual: 'The closet has been assessed as load-bearing in ways that fall outside standard structural classification. It bore: the other self, the version of events that was not selected, objects whose function was to remain unexamined, and a quantity of feeling that the primary space could not accommodate without code violation. The door, when closed, constituted a kind of agreement. When open, a kind of question. Neither state was comfortable. Both were necessary.',
    citation: 'See Annotation 2-C: Non-Structural Load Classification',
  },
  corner: {
    label: 'DREAD CORNER — ZONE 3',
    intended: 'To serve as an architectural terminus where two walls meet at a standard 90-degree angle, providing spatial definition.',
    actual: 'Dread was found to pool in this zone in excess of permitted levels. The corner demonstrated insufficient egress from imagination, meaning that what entered did not leave by conventional means. Inspector notes the presence of a residual charge consistent with repeated occupancy during periods of uncertainty. The 90-degree angle was found to concentrate rather than distribute. This is not the corner\'s fault. The corner was doing what corners do. The fault, if any, is a matter for another proceeding.',
    citation: 'See Annotation 3-D: Pooled Affect, Non-Remediated',
  },
  door: {
    label: 'DOOR — ZONE 4',
    intended: 'To provide controlled ingress and egress between the subject space and adjacent areas, with locking mechanism for privacy.',
    actual: 'The locking mechanism was found to operate on a non-standard protocol. In addition to physical actuation, the door responded to emotional states, familial proximity, and a feeling described in testimony as "the specific quality of footsteps on the stairs." The door is hereby cited for ambiguity of function: it was simultaneously the thing that kept things out and the evidence that things could come in. Inspector notes that the door knew. Doors often know. This one knew more than most.',
    citation: 'See Annotation 4-D: Threshold Ambiguity',
  },
  center: {
    label: 'CENTRAL FIELD — ZONE 5',
    intended: 'To constitute the primary occupiable area of the subject space, providing room for habitation, movement, and daily function.',
    actual: 'The central field was the zone in which the occupant attempted to become whoever they were going to be. Inspector notes this is an unusually large task for a space of these dimensions. The floor here retains deposition — a layer of testimony laid down in sediment, compressed by years of standing in the same place while thinking about standing somewhere else. The space did not fail this task. The task was simply larger than the space. This is not an unusual finding. It is the most common finding. It is in every report.',
    citation: 'See Annotation 5-CF: Ontological Overload',
  },
};

const GENERATING_STEPS = [
  'Initiating property intake cross-reference...',
  'Calibrating affect-to-square-footage conversion matrix...',
  'Retrieving deposition records from subfloor archive...',
  'Annotating zones of insufficient egress...',
  'Calculating THEN currency valuation (pre-conversion)...',
  'Compiling interpreter findings for official record...',
  'Affixing seal. Report is now binding.',
];

function computeValuation(answers) {
  let total = 0;
  QUESTIONS.forEach(q => {
    const selected = answers[q.id];
    if (selected) {
      const opt = q.options.find(o => o.value === selected);
      if (opt) total += opt.weight;
    }
  });
  const base = total * 47 + 3120;
  return base.toLocaleString() + ' THEN';
}

function getZoneAnnotationVariant(answers, zoneKey) {
  const weights = { window: 0, closet: 0, corner: 0, door: 0, center: 0 };
  if (answers.window) {
    const opt = QUESTIONS.find(q => q.id === 'window').options.find(o => o.value === answers.window);
    if (opt) weights.window = opt.weight;
  }
  if (answers.closet) {
    const opt = QUESTIONS.find(q => q.id === 'closet').options.find(o => o.value === answers.closet);
    if (opt) weights.closet = opt.weight;
  }
  if (answers.corner) {
    const opt = QUESTIONS.find(q => q.id === 'corner').options.find(o => o.value === answers.corner);
    if (opt) weights.corner = opt.weight;
  }
  if (answers.door) {
    const opt = QUESTIONS.find(q => q.id === 'door').options.find(o => o.value === answers.door);
    if (opt) weights.door = opt.weight;
  }
  if (answers.floor) {
    const opt = QUESTIONS.find(q => q.id === 'floor').options.find(o => o.value === answers.floor);
    if (opt) weights.center = opt.weight;
  }
  return weights;
}

function getSeverityLabel(weight) {
  if (weight >= 60) return 'CRITICAL';
  if (weight >= 40) return 'ELEVATED';
  if (weight >= 20) return 'MODERATE';
  return 'NOMINAL';
}

export default function Page() {
  const [phase, setPhase] = useState('intake');
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeZone, setActiveZone] = useState(null);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [reportData, setReportData] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    if (phase === 'generating') {
      setGeneratingStep(0);
      const interval = setInterval(() => {
        setGeneratingStep(prev => {
          if (prev >= GENERATING_STEPS.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              const valuation = computeValuation(answers);
              const zoneWeights = getZoneAnnotationVariant(answers, null);
              setReportData({ valuation, zoneWeights });
              setPhase('report');
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handleSubmit = () => {
    setPhase('generating');
  };

  const handleZoneClick = (zoneKey, e) => {
    e.stopPropagation();
    setActiveZone(activeZone === zoneKey ? null : zoneKey);
  };

  const fontMono = '"Courier New", Courier, monospace';
  const fontSerif = 'Georgia, "Times New Roman", serif';
  const cream = '#F5F0E8';
  const darkInk = '#1A1A2E';
  const fadedInk = '#3A3A4E';
  const mutedRed = '#8B1A1A';
  const stampRed = '#A0201A';
  const lineColor = '#2A2A3E';
  const faintLine = '#C8C0B0';

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: cream,
    color: darkInk,
    fontFamily: fontMono,
    padding: '0',
    margin: '0',
    position: 'relative',
    overflowX: 'hidden',
  };

  const noiseOverlay = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: 'none',
    zIndex: 0,
  };

  if (phase === 'intake') {
    const q = QUESTIONS[currentQuestion];
    const answered = answers[q.id];
    const isLast = currentQuestion === QUESTIONS.length - 1;
    const allAnswered = QUESTIONS.every(q2 => answers[q2.id]);

    return (
      <div style={pageStyle}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
          @keyframes stampIn { from { opacity:0; transform: scale(1.4) rotate(-3deg); } to { opacity:1; transform: scale(1) rotate(-3deg); } }
          .intake-option:hover { background: rgba(139,26,26,0.07) !important; border-color: #8B1A1A !important; }
        `}</style>
        <div style={noiseOverlay} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px', borderBottom: `2px solid ${darkInk}`, paddingBottom: '24px' }}>
            <div style={{ fontFamily: fontMono, fontSize: '10px', letterSpacing: '3px', color: fadedInk, marginBottom: '8px' }}>
              FORM AR-7 (REV. 1987) — ARCHITECTURAL INTERPRETER'S INTAKE
            </div>
            <div style={{ fontFamily: fontSerif, fontSize: '22px', fontWeight: 'bold', color: darkInk, lineHeight: 1.3 }}>
              Preliminary Examination of Subject Childhood Bedroom
            </div>
            <div style={{ fontSize: '10px', color: fadedInk, marginTop: '8px', letterSpacing: '1px' }}>
              OFFICE OF RESIDENTIAL MEMORY ASSESSMENT — DIVISION OF INTERIOR FINDINGS
            </div>
          </div>

          <div style={{ fontSize: '10px', color: fadedInk, marginBottom: '32px', display: 'flex', justifyContent: 'space-between' }}>
            <span>QUESTION {currentQuestion + 1} OF {QUESTIONS.length}</span>
            <span style={{ color: mutedRed }}>{'█'.repeat(currentQuestion + 1)}{'░'.repeat(QUESTIONS.length - currentQuestion - 1)}</span>
          </div>

          <div key={q.id} style={{ animation: 'fadeIn 0.4s ease forwards' }}>
            <div style={{
              fontFamily: fontSerif,
              fontSize: '18px',
              color: darkInk,
              marginBottom: '32px',
              lineHeight: 1.6,
              borderLeft: `3px solid ${mutedRed}`,
              paddingLeft: '16px',
            }}>
              {q.text}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  className="intake-option"
                  onClick={() => handleAnswer(q.id, opt.value)}
                  style={{
                    background: answered === opt.value ? 'rgba(139,26,26,0.1)' : 'transparent',
                    border: `1px solid ${answered === opt.value ? mutedRed : faintLine}`,
                    borderLeft: answered === opt.value ? `4px solid ${mutedRed}` : `1px solid ${faintLine}`,
                    color: darkInk,
                    fontFamily: fontMono,
                    fontSize: '13px',
                    padding: '14px 18px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.5,
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: `1px solid ${answered === opt.value ? mutedRed : faintLine}`,
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: answered === opt.value ? mutedRed : 'transparent',
                  }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {isLast && allAnswered && (
            <div style={{ marginTop: '48px', textAlign: 'center', animation: 'fadeIn 0.5s ease forwards' }}>
              <div style={{ fontSize: '10px', color: fadedInk, marginBottom: '16px', letterSpacing: '2px' }}>
                ALL INTAKE FIELDS COMPLETED. PROCEED TO ASSESSMENT?
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  background: darkInk,
                  color: cream,
                  border: 'none',
                  fontFamily: fontMono,
                  fontSize: '12px',
                  letterSpacing: '3px',
                  padding: '16px 40px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                SUBMIT FOR ASSESSMENT
              </button>
              <div style={{ fontSize: '9px', color: fadedInk, marginTop: '12px' }}>
                You are asked to sign nothing, which is the most suspicious part.
              </div>
            </div>
          )}

          {!isLast && answered && (
            <div style={{ marginTop: '32px', textAlign: 'right' }}>
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${faintLine}`,
                  color: fadedInk,
                  fontFamily: fontMono,
                  fontSize: '11px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                }}
              >
                NEXT →
              </button>
            </div>
          )}

          <div style={{ marginTop: '64px', borderTop: `1px solid ${faintLine}`, paddingTop: '16px', fontSize: '9px', color: faintLine, display: 'flex', justifyContent: 'space-between' }}>
            <span>FORM AR-7 | CONFIDENTIAL INTAKE RECORD</span>
            <span>DO NOT REPRODUCE WITHOUT AUTHORIZATION</span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'generating') {
    return (
      <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        `}</style>
        <div style={noiseOverlay} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '480px', padding: '24px' }}>
          <div style={{ fontFamily: fontSerif, fontSize: '20px', color: darkInk, marginBottom: '8px' }}>
            Generating Official Report
          </div>
          <div style={{ fontSize: '10px', color: fadedInk, letterSpacing: '2px', marginBottom: '48px' }}>
            OFFICE OF RESIDENTIAL MEMORY ASSESSMENT
          </div>
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            {GENERATING_STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  fontFamily: fontMono,
                  fontSize: '12px',
                  color: i <= generatingStep ? darkInk : faintLine,
                  padding: '8px 0',
                  borderBottom: `1px solid ${faintLine}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: i === generatingStep ? 'pulse 1s ease infinite' : 'none',
                  transition: 'color 0.3s ease',
                }}
              >
                <span style={{ color: i < generatingStep ? mutedRed : i === generatingStep ? mutedRed : faintLine }}>
                  {i < generatingStep ? '✓' : i === generatingStep ? '▶' : '○'}
                </span>
                {step}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '9px', color: faintLine, letterSpacing: '1px' }}>
            THIS PROCESS CANNOT BE EXPEDITED. MEMORY DOES NOT RUSH.
          </div>
        </div>
      </div>
    );
  }

  // REPORT PHASE
  const zoneWeights = reportData?.zoneWeights || {};
  const valuation = reportData?.valuation || '0 THEN';

  const reportDate = 'September 14, 1987 (Reconstructed)';
  const caseNumber = `AR-${Object.values(answers).join('').split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0)}-MEM`;

  return (
    <div style={pageStyle} onClick={() => setActiveZone(null)}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes stampIn { from { opacity:0; transform: scale(1.3) rotate(-3deg); } to { opacity:1; transform: scale(1) rotate(-3deg); } }
        @keyframes noteSlide { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }
        .zone-area:hover { opacity: 0.8 !important; }
      `}</style>
      <div style={noiseOverlay} />

      <div ref={reportRef} style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ borderBottom: `3px double ${darkInk}`, paddingBottom: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '9px', letterSpacing: '3px', color: fadedInk, marginBottom: '6px' }}>
                OFFICIAL ARCHITECTURAL INTERPRETER'S REPORT
              </div>
              <div style={{ fontFamily: fontSerif, fontSize: '26px', fontWeight: 'bold', color: darkInk, lineHeight: 1.2 }}>
                Assessment of Subject Childhood Bedroom
              </div>
              <div style={{ fontFamily: fontSerif, fontSize: '13px', color: fadedInk, marginTop: '6px', fontStyle: 'italic' }}>
                Reconstructed From Intake Record — Form AR-7
              </div>
            </div>
            <div style={{
              animation: 'stampIn 0.6s ease 0.5s both',
              border: `3px solid ${stampRed}`,
              color: stampRed,
              fontFamily: fontMono,
              fontSize: '11px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              padding: '8px 16px',
              transform: 'rotate(-3deg)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}>
              BINDING<br />ASSESSMENT<br />ISSUED
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginTop: '20px', fontSize: '10px', color: fadedInk, flexWrap: 'wrap' }}>
            <span>CASE NO: {caseNumber}</span>
            <span>DATE OF ASSESSMENT: {reportDate}</span>
            <span>JURISDICTION: PERSONAL</span>
            <span>INSPECTOR: REDACTED</span>
          </div>
        </div>

        {/* Preamble */}
        <div style={{ marginBottom: '40px', fontSize: '12px', lineHeight: 1.9, color: fadedInk, borderLeft: `2px solid ${faintLine}`, paddingLeft: '20px' }}>
          <div style={{ fontFamily: fontSerif, fontSize: '14px', color: darkInk, marginBottom: '12px', fontWeight: 'bold' }}>
            I. PREAMBLE AND SCOPE OF FINDINGS
          </div>
          <p style={{ margin: '0 0 12px 0' }}>
            The undersigned interpreter has conducted a full architectural assessment of the subject property as described in intake record Form AR-7. The subject space — hereinafter referred to as "the Bedroom" or "the Site" — is understood to have existed during a period of occupant development, the precise dates of which are not material to these findings, though they are material to everything else.
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            This report does not constitute a structural certificate, a certificate of occupancy, or a certificate of anything. It constitutes a finding. Findings are different from certificates in that certificates can be filed. Findings accumulate.
          </p>
          <p style={{ margin: 0 }}>
            The occupant is asked to sign nothing. The interpreter notes that this is the most suspicious part.
          </p>
        </div>

        {/* Floor Plan Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: fontSerif, fontSize: '14px', color: darkInk, marginBottom: '16px', fontWeight: 'bold' }}>
            II. ANNOTATED FLOOR PLAN — CLICK ANY ZONE TO RETRIEVE INTERPRETER'S NOTE
          </div>
          <div style={{ fontSize: '10px', color: fadedInk, marginBottom: '20px', letterSpacing: '1px' }}>
            ⚠ ZONES MARKED WITH CIRCLED NUMERALS INDICATE FINDINGS OF INTEREST. CLICK TO EXPAND.
          </div>

          <div style={{ border: `1px solid ${lineColor}`, backgroundColor: '#EDE8DE', padding: '8px', position: 'relative' }}>
            <svg
              viewBox="0 0 560 420"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onClick={(e) => e.stopPropagation()}
            >
              <defs>
                <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke={faintLine} strokeWidth="0.8" />
                </pattern>
                <pattern id="hatch2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke={faintLine} strokeWidth="0.5" />
                </pattern>
                <pattern id="dotPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="0.8" fill={faintLine} />
                </pattern>
              </defs>

              {/* Room outline */}
              <rect x="60" y="40" width="440" height="340" fill="#EDE8DE" stroke={lineColor} strokeWidth="3" />

              {/* Wall thickness */}
              <rect x="60" y="40" width="440" height="12" fill="url(#hatch)" stroke={lineColor} strokeWidth="1" />
              <rect x="60" y="368" width="440" height="12" fill="url(#hatch)" stroke={lineColor} strokeWidth="1" />
              <rect x="60" y="40" width="12" height="340" fill="url(#hatch)" stroke={lineColor} strokeWidth="1" />
              <rect x="488" y="40" width="12" height="340" fill="url(#hatch)" stroke={lineColor} strokeWidth="1" />

              {/* Center field - clickable */}
              <rect
                x="150" y="120" width="260" height="180"
                fill={activeZone === 'center' ? 'rgba(139,26,26,0.08)' : 'url(#dotPattern)'}
                stroke={activeZone === 'center' ? mutedRed : 'transparent'}
                strokeWidth="1.5"
                strokeDasharray="4,4"
                className="zone-area"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={(e) => handleZoneClick('center', e)}
              />

              {/* Floor hatching decorative */}
              <line x1="72" y1="52" x2="488" y2="52" stroke={faintLine} strokeWidth="0.5" />
              <line x1="72" y1="368" x2="488" y2="368" stroke={faintLine} strokeWidth="0.5" />

              {/* Window on top wall */}
              <rect
                x="200" y="40" width="120" height="12"
                fill={activeZone === 'window' ? 'rgba(139,26,26,0.3)' : '#A8C4D4'}
                stroke={lineColor}
                strokeWidth="1.5"
                className="zone-area"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={(e) => handleZoneClick('window', e)}
              />
              <line x1="260" y1="40" x2="260" y2="52" stroke={lineColor} strokeWidth="1" />
              <line x1="230" y1="40" x2="230" y2="52" stroke={lineColor} strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="290" y1="40" x2="290" y2="52" stroke={lineColor} strokeWidth="0.5" strokeDasharray="2,2" />

              {/* Window sill extension */}
              <rect
                x="195" y="52" width="130" height="20"
                fill={activeZone === 'window' ? 'rgba(139,26,26,0.06)' : 'rgba(168,196,212,0.3)'}
                stroke={activeZone === 'window' ? mutedRed : faintLine}
                strokeWidth="0.8"
                strokeDasharray="3,3"
                className="zone-area"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleZoneClick('window', e)}
              />

              {/* Door on right wall */}
              <rect
                x="488" y="180" width="12" height="80"
                fill={activeZone === 'door' ? 'rgba(139,26,26,0.3)' : '#EDE8DE'}
                stroke={lineColor}
                strokeWidth="1.5"
                className="zone-area"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleZoneClick('door', e)}
              />
              {/* Door swing arc */}
              <path
                d="M 488 180 A 80 80 0 0 0 488 260"
                fill="none"
                stroke={lineColor}
                strokeWidth="0.8"
                strokeDasharray="3,3"
              />
              <line x1="488" y1="180" x2="440" y2="220" stroke={lineColor} strokeWidth="0.8" strokeDasharray="2,2" />

              {/* Closet bottom-left */}
              <rect
                x="60" y="270" width="120" height="100"
                fill={activeZone === 'closet' ? 'rgba(139,26,26,0.08)' : 'url(#hatch2)'}
                stroke={lineColor}
                strokeWidth="1.5"
                className="zone-area"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={(e) => handleZoneClick('closet', e)}
              />
              <line x1="120" y1="270" x2="120" y2="370" stroke={lineColor} strokeWidth="0.8" strokeDasharray="4,2" />
              <text x="90" y="325" fontFamily={fontMono} fontSize="8" fill={fadedInk} textAnchor="middle">CLOSET</text>
              <text x="90" y="337" fontFamily={fontMono} fontSize="7" fill={fadedInk} textAnchor="middle">[LOAD-BEARING]</text>

              {/* Dread corner - top left */}
              <polygon
                points="72,52 160,52 72,160"
                fill={activeZone === 'corner' ? 'rgba(139,26,26,0.15)' : 'rgba(139,26,26,0.04)'}
                stroke={activeZone === 'corner' ? mutedRed : '#8B1A1A'}
                strokeWidth="1"
                strokeDasharray="4,3"
                className="zone-area"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={(e) => handleZoneClick('corner', e)}
              />

              {/* Dimension lines */}
              <line x1="60" y1="22" x2="500" y2="22" stroke={fadedInk} strokeWidth="0.5" />
              <line x1="60" y1="18" x2="60" y2="26" stroke={fadedInk} strokeWidth="0.5" />
              <line x1="500" y1="18" x2="500" y2="26" stroke={fadedInk} strokeWidth="0.5" />
              <text x="280" y="19" fontFamily={fontMono} fontSize="9" fill={fadedInk} textAnchor="middle">RECONSTRUCTED DIMENSION (NOT TO SCALE)</text>

              <line x1="528" y1="40" x2="528" y2="380" stroke={fadedInk} strokeWidth="0.5" />
              <line x1="524" y1="40" x2="532" y2="40" stroke={fadedInk} strokeWidth="0.5" />
              <line x1="524" y1="380" x2="532" y2="380" stroke={fadedInk} strokeWidth="0.5" />
              <text x="540" y="215" fontFamily={fontMono} fontSize="8" fill={fadedInk} textAnchor="middle" transform="rotate(90, 540, 215)">MEMORY DEPTH: VARIABLE</text>

              {/* Annotation markers */}
              {/* Zone 1: Window */}
              <circle cx="260" cy="75" r="10" fill={cream} stroke={mutedRed} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => handleZoneClick('window', e)} />
              <text x="260" y="79" fontFamily={fontMono} fontSize="9" fill={mutedRed} textAnchor="middle" style={{ cursor: 'pointer', pointerEvents: 'none' }}>1</text>

              {/* Zone 2: Closet */}
              <circle cx="90" cy="295" r="10" fill={cream} stroke={mutedRed} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => handleZoneClick('closet', e)} />
              <text x="90" y="299" fontFamily={fontMono} fontSize="9" fill={mutedRed} textAnchor="middle" style={{ cursor: 'pointer', pointerEvents: 'none' }}>2</text>

              {/* Zone 3: Corner */}
              <circle cx="100" cy="95" r="10" fill={cream} stroke={mutedRed} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => handleZoneClick('corner', e)} />
              <text x="100" y="99" fontFamily={fontMono} fontSize="9" fill={mutedRed} textAnchor="middle" style={{ cursor: 'pointer', pointerEvents: 'none' }}>3</text>

              {/* Zone 4: Door */}
              <circle cx="466" cy="218" r="10" fill={cream} stroke={mutedRed} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => handleZoneClick('door', e)} />
              <text x="466" y="222" fontFamily={fontMono} fontSize="9" fill={mutedRed} textAnchor="middle" style={{ cursor: 'pointer', pointerEvents: 'none' }}>4</text>

              {/* Zone 5: Center */}
              <circle cx="280" cy="210" r="10" fill={cream} stroke={mutedRed} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => handleZoneClick('center', e)} />
              <text x="280" y="214" fontFamily={fontMono} fontSize="9" fill={mutedRed} textAnchor="middle" style={{ cursor: 'pointer', pointerEvents: 'none' }}>5</text>

              {/* Labels */}
              <text x="260" y="30" fontFamily={fontMono} fontSize="8" fill={fadedInk} textAnchor="middle">WINDOW (CITING PENDING)</text>
              <text x="466" y="175" fontFamily={fontMono} fontSize="8" fill={fadedInk} textAnchor="middle">DOOR</text>
              <text x="100" y="165" fontFamily={fontMono} fontSize="7" fill={mutedRed} textAnchor="middle">DREAD</text>
              <text x="100" y="175" fontFamily={fontMono} fontSize="7" fill={mutedRed} textAnchor="middle">ZONE</text>
              <text x="280" y="195" fontFamily={fontMono} fontSize="8" fill={fadedInk} textAnchor="middle">CENTRAL FIELD</text>
              <text x="280" y="207" fontFamily={fontMono} fontSize="7" fill={fadedInk} textAnchor="middle">(ONTOLOGICAL OVERLOAD)</text>

              {/* Severity indicators */}
              {Object.entries({ window: [260, 90], closet: [90, 310], corner: [100, 110], door: [466, 233], center: [280, 225] }).map(([zone, [cx, cy]]) => {
                const w = zoneWeights[zone === 'door' ? 'door' : zone === 'center' ? 'center' : zone] || 30;
                const sev = getSeverityLabel(w);
                return (
                  <text key={zone} x={cx} y={cy} fontFamily={fontMono} fontSize="6" fill={sev === 'CRITICAL' ? mutedRed : fadedInk} textAnchor="middle" style={{ pointerEvents: 'none' }}>
                    [{sev}]
                  </text>
                );
              })}
            </svg>
          </div>

          <div style={{ fontSize: '9px', color: fadedInk, marginTop: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span>FIG. 1 — RECONSTRUCTED FLOOR PLAN, NOT TO SCALE, NOT TO REASON</span>
            <span>CLICK CIRCLED NUMERALS OR ZONES TO RETRIEVE INTERPRETER'S NOTES</span>
          </div>
        </div>

        {/* Active Zone Panel */}
        {activeZone && ZONE_DATA[activeZone] && (
          <div
            style={{
              animation: 'noteSlide 0.3s ease forwards',
              border: `2px solid ${mutedRed}`,
              backgroundColor: '#F9F5EE',
              padding: '28px',
              marginBottom: '40px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveZone(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: `1px solid ${faintLine}`,
                color: fadedInk,
                fontFamily: fontMono,
                fontSize: '11px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              CLOSE ×
            </button>

            <div style={{ fontSize: '9px', letterSpacing: '3px', color: mutedRed, marginBottom: '8px' }}>
              INTERPRETER'S NOTE — {ZONE_DATA[activeZone].label}
            </div>
            <div style={{ fontFamily: fontSerif, fontSize: '16px', color: darkInk, marginBottom: '20px', fontWeight: 'bold' }}>
              {ZONE_DATA[activeZone].label}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '9px', letterSpacing: '2px', color: fadedInk, marginBottom: '8px', borderBottom: `1px solid ${faintLine}`, paddingBottom: '4px' }}>
                  INTENDED FUNCTION
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: fadedInk, fontStyle: 'italic' }}>
                  {ZONE_DATA[activeZone].intended}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', letterSpacing: '2px', color: mutedRed, marginBottom: '8px', borderBottom: `1px solid ${mutedRed}`, paddingBottom: '4px' }}>
                  ACTUAL EFFECT (FINDING)
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: darkInk }}>
                  {ZONE_DATA[activeZone].actual}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '10px', color: fadedInk, borderTop: `1px solid ${faintLine}`, paddingTop: '12px', fontStyle: 'italic' }}>
              {ZONE_DATA[activeZone].citation}
            </div>

            <div style={{ marginTop: '12px', fontSize: '10px', color: fadedInk }}>
              SEVERITY CLASSIFICATION: <span style={{ color: getSeverityLabel(zoneWeights[activeZone] || 30) === 'CRITICAL' ? mutedRed : darkInk, fontWeight: 'bold' }}>
                {getSeverityLabel(zoneWeights[activeZone] || 30)}
              </span>
              {' '}— WEIGHT: {zoneWeights[activeZone] || 30} UNITS (NON-STANDARD)
            </div>
          </div>
        )}

        {/* Findings Summary */}
        <div style={{ marginBottom: '40px', fontSize: '12px', lineHeight: 1.9, color: fadedInk }}>
          <div style={{ fontFamily: fontSerif, fontSize: '14px', color: darkInk, marginBottom: '16px', fontWeight: 'bold', borderBottom: `1px solid ${faintLine}`, paddingBottom: '8px' }}>
            III. SUMMARY OF FINDINGS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 24px', alignItems: 'baseline' }}>
            {[
              ['Ceiling Assessment', answers.ceiling === 'a' ? 'Consistent with ambition. Ambition found subsequently inconsistent with ceiling.' : answers.ceiling === 'b' ? 'Height excessive. Ambition reported as escaped. Unrecovered.' : answers.ceiling === 'c' ? 'Ceiling classified as contested zone. Negotiation status: unresolved.' : 'Ceiling presence ambiguous. Inspector notes the sense of one is sufficient for code.'],
              ['Door Protocol', answers.door === 'a' ? 'Interior locking confirmed. Occupant held terms. Terms held occupant.' : answers.door === 'b' ? 'Exterior locking confirmed. Third-party determination of access. See note on sovereignty.' : answers.door === 'c' ? 'Dread-actuated locking mechanism. Non-standard. Fully functional.' : 'Absence of lock constituted lock. Inspector finds this logical.'],
              ['Window Citation Status', answers.window === 'a' ? 'Light admitted in standard capacity. Inspector notes light was not the issue.' : answers.window === 'b' ? 'Tuesday admitted in excess. Quantity not specified. Quantity not necessary.' : answers.window === 'c' ? 'Adjacent happiness audible through glazing. Constitutes hostile acoustic environment.' : 'Non-applicable possibilities admitted. Frequency retained in glass.'],
              ['Closet Classification', answers.closet === 'a' ? 'Non-structural load confirmed. Structural code does not address this category.' : answers.closet === 'b' ? 'Displaced objects in excess of storage mandate. Inspector acknowledges objects had nowhere else.' : answers.closet === 'c' ? 'Secondary self confirmed in storage. See Annotation 2-C.' : 'Partial aperture documented. Precautionary basis noted and accepted.'],
              ['Dread Pooling', answers.corner === 'a' ? 'Northeast accumulation. Electrical adjacency noted as contributing factor.' : answers.corner === 'b' ? 'Southwest accumulation. Maximal distance from egress. Inspector finds this characteristic.' : answers.corner === 'c' ? 'Mobile dread documented. Inspector notes this is the most advanced presentation.' : 'Democratic distribution confirmed. All corners equally implicated.'],
              ['Floor Testimony', answers.floor === 'a' ? 'Carpet deposition confirmed. All of it. The carpet remembered.' : answers.floor === 'b' ? 'Floor found impartial. Occupant resentment of impartiality noted in record.' : answers.floor === 'c' ? 'Partial testimony zones identified. Mapped in Appendix D (withheld).' : 'Floor invoked Fifth Amendment equivalent. Inspector notes the floor was protecting itself.'],
              ['Frequency Retained', answers.frequency === 'a' ? '440Hz longing confirmed. Inspector notes this is A above middle C. Inspector notes this is appropriate.' : answers.frequency === 'b' ? 'Adjacent television frequency documented. Source room unidentified.' : answers.frequency === 'c' ? 'Occupant-exclusive silence frequency confirmed. Non-transmissible. Retained in window.' : '"Not yet" frequency confirmed. Repeating. Non-terminal.'],
            ].map(([label, finding]) => (
              <>
                <div style={{ fontSize: '10px', color: mutedRed, letterSpacing: '1px', whiteSpace: 'nowrap', paddingTop: '4px' }}>{label}:</div>
                <div style={{ fontSize: '11px', lineHeight: 1.7 }}>{finding}</div>
              </>
            ))}
          </div>
        </div>

        {/* Valuation */}
        <div style={{
          border: `3px solid ${darkInk}`,
          padding: '32px',
          backgroundColor: '#F0EBE0',
          position: 'relative',
          marginBottom: '40px',
        }}>
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '24px',
            backgroundColor: '#F0EBE0',
            padding: '0 8px',
            fontSize: '10px',
            letterSpacing: '3px',
            color: darkInk,
          }}>
            IV. VALUATION
          </div>

          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontFamily: fontMono, fontSize: '11px', letterSpacing: '2px', color: fadedInk, marginBottom: '8px' }}>
              ASSESSED VALUE OF SUBJECT BEDROOM IN CURRENCY THEN
            </div>
            <div style={{ fontFamily: fontSerif, fontSize: '48px', color: darkInk, letterSpacing: '-1px', margin: '16px 0' }}>
              {valuation}
            </div>
            <div style={{ fontSize: '10px', color: fadedInk, maxWidth: '480px', margin: '0 auto', lineHeight: 1.8 }}>
              The currency THEN cannot be converted to any current denomination. The Office of Residential Memory Assessment notes that THEN is not pegged to any standard, does not accrue interest, and does not depreciate except in the specific way that everything from that time depreciates, which is to say: it becomes more valuable in a way that is painful and cannot be spent.
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${faintLine}`, paddingTop: '20px', marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '10px', color: fadedInk, textAlign: 'center' }}>
            <div>
              <div style={{ color: darkInk, fontWeight: 'bold', marginBottom: '4px' }}>CONVERSION RATE</div>
              <div>1 THEN = 1 THEN</div>
              <div style={{ fontStyle: 'italic' }}>This is not a tautology.</div>
            </div>
            <div>
              <div style={{ color: darkInk, fontWeight: 'bold', marginBottom: '4px' }}>TRANSFERABILITY</div>
              <div>Non-transferable.</div>
              <div style={{ fontStyle: 'italic' }}>Can only be carried.</div>
            </div>
            <div>
              <div style={{ color: darkInk, fontWeight: 'bold', marginBottom: '4px' }}>EXPIRATION</div>
              <div>Does not expire.</div>
              <div style={{ fontStyle: 'italic' }}>This is the problem.</div>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div style={{ fontSize: '11px', lineHeight: 1.9, color: fadedInk, marginBottom: '32px' }}>
          <div style={{ fontFamily: fontSerif, fontSize: '14px', color: darkInk, marginBottom: '12px', fontWeight: 'bold' }}>
            V. INTERPRETER'S CLOSING NOTATION
          </div>
          <p>
            The subject bedroom has been assessed in full. The inspector wishes to note, for the record and for no other purpose, that such spaces are rarely what they were intended to be. This is not a deficiency. This is the nature of spaces occupied during the formation of a person: they absorb more than they were designed to hold. They retain frequency. They hold depositions. The carpet, in particular, remembers.
          </p>
          <p style={{ marginTop: '12px' }}>
            The occupant is not required to return to the subject property. The subject property, however, may continue to return to the occupant. This is outside the inspector's jurisdiction. The inspector notes it anyway.
          </p>
          <p style={{ marginTop: '12px', fontStyle: 'italic' }}>
            This report is binding. The occupant is asked to sign nothing. The inspector notes, for the final time, that this is the most suspicious part.
          </p>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `2px double ${darkInk}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '9px', color: fadedInk, lineHeight: 1.8 }}>
            <div>OFFICE OF RESIDENTIAL MEMORY ASSESSMENT</div>
            <div>DIVISION OF INTERIOR FINDINGS — CHILDHOOD PROPERTIES UNIT</div>
            <div>FORM AR-7 REPORT — CASE {caseNumber}</div>
            <div style={{ marginTop: '8px', color: faintLine }}>This document has been photocopied too many times.</div>
          </div>
          <div style={{ fontSize: '9px', color: fadedInk, textAlign: 'right', lineHeight: 1.8 }}>
            <div>INSPECTOR: ___________________</div>
            <div style={{ marginTop: '4px' }}>DATE: {reportDate}</div>
            <div style={{ marginTop: '4px' }}>SEAL: [AFFIXED]</div>
          </div>
        </div>
      </div>
    </div>
  );
}