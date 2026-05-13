import { useState, useEffect, useRef, useCallback } from 'react';

const VIOLATION_POOL = [
  {
    id: 1,
    code: 'CFR 29.BREATH.4(a)',
    description: 'Improper tension storage in primary thoracic cavity. Load-bearing anxiety has been distributed across non-structural rib segments without permit.',
    severity: 'CRITICAL',
    penalty: 12,
    evidenceLabel: 'Fig. A: Unlicensed Tension Distribution Map',
    evidenceParts: [
      { x: 120, y: 80, label: 'tertiary worry duct' },
      { x: 200, y: 120, label: 'unsanctioned sternum pressure node' },
      { x: 80, y: 150, label: 'informal dread reservoir (L)' },
    ]
  },
  {
    id: 2,
    code: 'CFR 29.BREATH.7(b)',
    description: 'Ribcage operating at 114% of permitted capacity since an unspecified Tuesday. No variance application on file.',
    severity: 'MAJOR',
    penalty: 9,
    evidenceLabel: 'Fig. B: Overcapacity Thoracic Load Survey',
    evidenceParts: [
      { x: 160, y: 90, label: 'overextended compliance lobe' },
      { x: 100, y: 160, label: 'auxiliary breath socket (unapproved)' },
      { x: 210, y: 170, label: 'Tuesday residue deposit' },
    ]
  },
  {
    id: 3,
    code: 'CFR 29.DIAPHRAGM.2(c)',
    description: 'Diaphragm found in sustained pre-exhale position. This constitutes unauthorized hold exceeding 4.7 seconds without licensed supervision.',
    severity: 'CRITICAL',
    penalty: 14,
    evidenceLabel: 'Fig. C: Unauthorized Hold Duration Diagram',
    evidenceParts: [
      { x: 150, y: 200, label: 'suspended diaphragm shelf' },
      { x: 90, y: 130, label: 'unlicensed pause membrane' },
      { x: 200, y: 100, label: 'involuntary retention flange' },
    ]
  },
  {
    id: 4,
    code: 'CFR 29.ANXIETY.11(a)',
    description: 'Unregistered anxiety load detected bearing weight on pulmonary infrastructure. No load-bearing certificate issued for emotional content exceeding 3.2 units.',
    severity: 'MAJOR',
    penalty: 10,
    evidenceLabel: 'Fig. D: Emotional Load-Bearing Schematic',
    evidenceParts: [
      { x: 130, y: 110, label: 'primary anxiety truss' },
      { x: 180, y: 180, label: 'unregistered dread column' },
      { x: 75, y: 190, label: 'subcutaneous worry stratum' },
    ]
  },
  {
    id: 5,
    code: 'CFR 29.STERNUM.3(f)',
    description: 'Sternum exhibiting non-compliant forward lean (estimated 7-9 degrees). Postural deviation consistent with unresolved anticipatory posture syndrome.',
    severity: 'MODERATE',
    penalty: 7,
    evidenceLabel: 'Fig. E: Postural Deviation Measurement',
    evidenceParts: [
      { x: 155, y: 95, label: 'deviant sternum axis' },
      { x: 110, y: 155, label: 'anticipatory lean zone' },
      { x: 195, y: 145, label: 'unresolved forward momentum node' },
    ]
  },
  {
    id: 6,
    code: 'CFR 29.LUNG.8(d)',
    description: 'Left lung found operating in shadow capacity. Right lung compensating beyond approved parameters. Asymmetric respiratory burden distribution — see Form 44-B.',
    severity: 'MAJOR',
    penalty: 11,
    evidenceLabel: 'Fig. F: Asymmetric Burden Survey',
    evidenceParts: [
      { x: 95, y: 125, label: 'shadow capacity lung (L)' },
      { x: 205, y: 115, label: 'overcompensation lobe (R)' },
      { x: 150, y: 175, label: 'burden redistribution fault line' },
    ]
  },
  {
    id: 7,
    code: 'CFR 29.BREATH.9(g)',
    description: 'Held breath contains unprocessed auditory memory from prior inspection cycle. Memory storage in respiratory tissue is not permitted under current zoning.',
    severity: 'MODERATE',
    penalty: 8,
    evidenceLabel: 'Fig. G: Unauthorized Memory Deposit',
    evidenceParts: [
      { x: 140, y: 100, label: 'auditory residue chamber' },
      { x: 185, y: 160, label: 'non-zoned memory tissue' },
      { x: 100, y: 175, label: 'prior inspection scar (unlabeled)' },
    ]
  },
  {
    id: 8,
    code: 'CFR 29.THROAT.1(a)',
    description: 'Throat corridor found partially obstructed by unnamed feeling. Obstruction classified as non-physical but measurably present. Clearance permit expired.',
    severity: 'CRITICAL',
    penalty: 13,
    evidenceLabel: 'Fig. H: Throat Corridor Obstruction Map',
    evidenceParts: [
      { x: 150, y: 60, label: 'unnamed feeling obstruction' },
      { x: 130, y: 100, label: 'expired clearance zone' },
      { x: 170, y: 130, label: 'secondary blockage node' },
    ]
  },
  {
    id: 9,
    code: 'CFR 29.CHEST.5(b)',
    description: 'Chest cavity found operating under ambient dread conditions without hazard classification. Dread must be labeled, contained, and submitted to Form 77.',
    severity: 'MODERATE',
    penalty: 6,
    evidenceLabel: 'Fig. I: Ambient Dread Distribution',
    evidenceParts: [
      { x: 150, y: 140, label: 'ambient dread cloud (unlabeled)' },
      { x: 100, y: 100, label: 'unclassified hazard zone' },
      { x: 200, y: 160, label: 'Form 77 submission point (missing)' },
    ]
  },
  {
    id: 10,
    code: 'CFR 29.DECISION.0(z)',
    description: 'Decisional act performed without permit. The act of choosing between CONTROLLED RELEASE and CONTINUED HOLD constitutes an unlicensed respiratory decision under sub-clause 0(z).',
    severity: 'CRITICAL',
    penalty: 15,
    evidenceLabel: 'Fig. Z: Unauthorized Decision Event',
    evidenceParts: [
      { x: 150, y: 120, label: 'decision event epicenter' },
      { x: 100, y: 170, label: 'unpermitted choice membrane' },
      { x: 200, y: 80, label: 'compliance failure origin point' },
    ]
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function EvidenceDiagram({ violation }) {
  return (
    <svg width="300" height="260" viewBox="0 0 300 260" style={{ display: 'block', margin: '0 auto' }}>
      <rect x="0" y="0" width="300" height="260" fill="#F5F0E8" stroke="#333" strokeWidth="1" />
      <ellipse cx="150" cy="145" rx="85" ry="100" fill="none" stroke="#555" strokeWidth="1.5" strokeDasharray="4,2" />
      <ellipse cx="110" cy="155" rx="35" ry="55" fill="none" stroke="#888" strokeWidth="1" />
      <ellipse cx="190" cy="155" rx="35" ry="55" fill="none" stroke="#888" strokeWidth="1" />
      <line x1="150" y1="45" x2="150" y2="245" stroke="#aaa" strokeWidth="0.5" strokeDasharray="3,3" />
      <path d="M135 45 Q150 35 165 45 Q160 70 150 80 Q140 70 135 45Z" fill="none" stroke="#666" strokeWidth="1" />
      <path d="M120 195 Q150 210 180 195" fill="none" stroke="#888" strokeWidth="1" />
      {violation.evidenceParts.map((part, i) => (
        <g key={i}>
          <circle cx={part.x} cy={part.y} r="4" fill="#CC2200" opacity="0.8" />
          <line x1={part.x} y1={part.y} x2={part.x + (part.x < 150 ? -30 : 30)} y2={part.y + (i % 2 === 0 ? -20 : 20)} stroke="#CC2200" strokeWidth="0.8" />
          <text
            x={part.x + (part.x < 150 ? -35 : 35)}
            y={part.y + (i % 2 === 0 ? -22 : 22)}
            fontSize="7"
            fill="#CC2200"
            textAnchor={part.x < 150 ? 'end' : 'start'}
            fontFamily="monospace"
          >
            {part.label}
          </text>
        </g>
      ))}
      <text x="150" y="15" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">{violation.evidenceLabel}</text>
      <text x="150" y="252" fontSize="7" fill="#666" textAnchor="middle" fontFamily="monospace">INSPECTOR USE ONLY — NOT FOR OCCUPANT REVIEW</text>
    </svg>
  );
}

export default function Page() {
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phase, setPhase] = useState('entry');
  const [violations, setViolations] = useState([]);
  const [loggedCount, setLoggedCount] = useState(0);
  const [complianceScore, setComplianceScore] = useState(100);
  const [contestedId, setContestedId] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [inspectorText, setInspectorText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [hoveredViolation, setHoveredViolation] = useState(null);
  const [reinspectCount, setReinspectCount] = useState(0);
  const [stamped, setStamped] = useState(false);

  const violationIntervalRef = useRef(null);
  const typewriterRef = useRef(null);
  const speedRef = useRef(2500);

  const INSPECTOR_TEXTS = {
    arriving: `INSPECTOR HARLOW, D. — BADGE 7741\nOccupational Safety & Internal Compliance Division\nDate of Inspection: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}\n\nInitiating site assessment. Occupant has been notified.\nProceeding to thoracic cavity. Please do not exhale.`,
    inspecting: `Conducting systematic review of held breath.\nAll findings are preliminary until stamped.\nDo not adjust your breathing during inspection.\nViolations will be logged in order of severity.`,
    recommending: `Inspection complete. ${0} violations on record.\nOccupant compliance score has been noted.\nTwo options are available. Choose carefully.\nBoth options are being monitored.`,
    filing: `Your selection has been recorded.\nNote: The act of selecting constitutes a new violation.\nFiling report. Please remain still.\nCabinet location pending. See footnote 7(c).`,
    reinspecting: `Re-inspection initiated.\nPrevious violations remain on file.\nNew violations detected as a result of prior inspection.\nPlease do not attempt to breathe normally.`,
  };

  const typeText = useCallback((text) => {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayedText('');
    let i = 0;
    typewriterRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(typewriterRef.current);
    }, 22);
  }, []);

  const startInspection = useCallback((violationSet, startScore, speed) => {
    const pool = violationSet.filter(v => v.id !== 10);
    const selected = shuffle(pool).slice(0, 6);
    setViolations(selected.map(v => ({ ...v, logged: false, contested: false })));
    setLoggedCount(0);
    setRecommendation(null);
    setStamped(false);
    setContestedId(null);
    speedRef.current = speed;

    let idx = 0;
    if (violationIntervalRef.current) clearInterval(violationIntervalRef.current);
    violationIntervalRef.current = setInterval(() => {
      if (idx >= selected.length) {
        clearInterval(violationIntervalRef.current);
        setTimeout(() => setPhase('recommending'), 2000);
        return;
      }
      const penalty = selected[idx].penalty;
      setViolations(prev => prev.map((v, i) => i === idx ? { ...v, logged: true } : v));
      setLoggedCount(prev => prev + 1);
      setComplianceScore(prev => Math.max(0, prev - penalty));
      idx++;
    }, speed);
  }, []);

  useEffect(() => {
    if (phase === 'arriving') {
      typeText(INSPECTOR_TEXTS.arriving);
      setTimeout(() => {
        setPhase('inspecting');
      }, 3500);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'inspecting') {
      typeText(INSPECTOR_TEXTS.inspecting);
      startInspection(VIOLATION_POOL, complianceScore, speedRef.current);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'recommending') {
      const text = `Inspection complete. ${loggedCount} violations on record.\nOccupant compliance score has been noted.\nTwo options are available. Choose carefully.\nBoth options are being monitored.`;
      typeText(text);
    }
    if (phase === 'filing') {
      typeText(INSPECTOR_TEXTS.filing);
      setTimeout(() => setStamped(true), 1200);
      setTimeout(() => setPhase('reinspecting'), 3500);
    }
    if (phase === 'reinspecting') {
      typeText(INSPECTOR_TEXTS.reinspecting);
      setReinspectCount(prev => prev + 1);
      const newSpeed = Math.max(800, speedRef.current - 300);
      const decisionViolation = VIOLATION_POOL.find(v => v.id === 10);
      const newPool = [...VIOLATION_POOL.filter(v => v.id !== 10)];
      setTimeout(() => {
        setViolations([{ ...decisionViolation, logged: true, contested: false }]);
        setComplianceScore(prev => Math.max(0, prev - decisionViolation.penalty));
        setLoggedCount(1);
        setTimeout(() => {
          startInspection(newPool, complianceScore, newSpeed);
        }, 1500);
      }, 1500);
      setPhase('inspecting');
    }
  }, [phase]);

  const handleBeginInspection = () => {
    const name = nameInput.trim() || 'OCCUPANT';
    setUserName(name.toUpperCase());
    setPhase('arriving');
  };

  const handleContest = (id) => {
    setContestedId(id);
    setViolations(prev => prev.map(v => v.id === id ? { ...v, contested: true } : v));
  };

  const handleRecommendation = (choice) => {
    setRecommendation(choice);
    setPhase('filing');
  };

  const severityColor = (s) => {
    if (s === 'CRITICAL') return '#CC2200';
    if (s === 'MAJOR') return '#994400';
    return '#665500';
  };

  const contestedViolation = violations.find(v => v.id === contestedId);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#E8E0D0',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#1a1a1a',
      padding: '0',
    }}>
      <style>{`
        @keyframes stampIn {
          0% { transform: rotate(-12deg) scale(2.5); opacity: 0; }
          60% { transform: rotate(-12deg) scale(0.95); opacity: 1; }
          100% { transform: rotate(-12deg) scale(1); opacity: 1; }
        }
        @keyframes violationSlide {
          from { opacity: 0; transform: translateX(-8px); background: #ffeeee; }
          to { opacity: 1; transform: translateX(0); background: transparent; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scoreFlash {
          0% { color: #CC2200; }
          100% { color: #1a1a1a; }
        }
        @keyframes arrivePulse {
          0%, 100% { border-color: #CC2200; }
          50% { border-color: #888; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: '#2a2a2a',
        color: '#F5F0E8',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px solid #CC2200',
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '2px' }}>
          OCCUPATIONAL SAFETY & INTERNAL COMPLIANCE DIVISION
        </div>
        <div style={{ fontSize: '10px', color: '#aaa' }}>
          FORM IB-7741 — HELD BREATH INSPECTION REPORT
        </div>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '20px 16px 60px' }}>

        {/* Title Block */}
        <div style={{
          border: '2px solid #2a2a2a',
          background: '#F5F0E8',
          padding: '16px 20px',
          marginBottom: '16px',
          position: 'relative',
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '4px' }}>
            FORMAL INSPECTION: YOUR HELD BREATH
          </div>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px' }}>
            WORKSITE: INTERIOR THORACIC ZONE — OCCUPANT PREMISES &nbsp;|&nbsp; INSPECTOR: HARLOW, D. — BADGE 7741
          </div>
          <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '10px', color: '#888', textAlign: 'right' }}>
            REF: OS-ICD-{new Date().getFullYear()}<br />
            CITATION CLASS: RESPIRATORY
          </div>
        </div>

        {/* Entry Phase */}
        {phase === 'entry' && (
          <div style={{
            border: '2px solid #2a2a2a',
            background: '#F5F0E8',
            padding: '24px',
          }}>
            <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '16px', color: '#555' }}>
              SECTION 1 — OCCUPANT IDENTIFICATION
            </div>
            <div style={{ marginBottom: '20px', fontSize: '13px', lineHeight: '1.8' }}>
              <div>This inspection has been scheduled in response to anomalous respiratory activity</div>
              <div>detected in your immediate vicinity. Your cooperation is required.</div>
              <div style={{ marginTop: '8px', color: '#CC2200', fontSize: '11px' }}>
                NOTE: Failure to comply with this inspection does not exempt you from inspection findings.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', letterSpacing: '1px', minWidth: '140px' }}>OCCUPANT NAME:</label>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBeginInspection()}
                placeholder="LEAVE BLANK FOR OCCUPANT"
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '13px',
                  background: '#fff',
                  border: '1px solid #2a2a2a',
                  padding: '6px 10px',
                  width: '240px',
                  outline: 'none',
                  letterSpacing: '1px',
                }}
              />
            </div>
            <div style={{ marginBottom: '16px', fontSize: '11px', color: '#666', lineHeight: '1.7' }}>
              By proceeding, you acknowledge that your held breath is subject to inspection under
              Sub-Title B, Part 1910, Section 7(a) of the Internal Compliance Code. You further
              acknowledge that you are currently holding your breath to some degree.
            </div>
            <button
              onClick={handleBeginInspection}
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '13px',
                letterSpacing: '2px',
                background: '#CC2200',
                color: '#F5F0E8',
                border: '2px solid #880000',
                padding: '10px 28px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              BEGIN INSPECTION
            </button>
          </div>
        )}

        {/* Active Inspection Phases */}
        {phase !== 'entry' && (
          <>
            {/* Compliance Score */}
            <div style={{
              border: '2px solid #2a2a2a',
              background: '#F5F0E8',
              padding: '10px 20px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#555' }}>
                OCCUPANT: <strong style={{ color: '#1a1a1a' }}>{userName}</strong>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                RE-INSPECTION CYCLE: <strong>{reinspectCount}</strong>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                VIOLATIONS LOGGED: <strong style={{ color: '#CC2200' }}>{violations.filter(v => v.logged).length}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '1px' }}>COMPLIANCE SCORE:</div>
                <div style={{
                  fontSize: '26px',
                  fontWeight: 'bold',
                  color: complianceScore > 60 ? '#1a1a1a' : complianceScore > 30 ? '#994400' : '#CC2200',
                  minWidth: '52px',
                  textAlign: 'right',
                  animation: 'scoreFlash 0.3s',
                }}>
                  {complianceScore}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>/100</div>
              </div>
            </div>

            {/* Inspector Remarks */}
            <div style={{
              border: '2px solid #2a2a2a',
              background: '#1a1a1a',
              color: '#c8c0a8',
              padding: '14px 18px',
              marginBottom: '12px',
              fontSize: '12px',
              lineHeight: '1.8',
              minHeight: '80px',
              animation: (phase === 'arriving') ? 'arrivePulse 1.5s infinite' : 'none',
            }}>
              <div style={{ color: '#888', fontSize: '10px', letterSpacing: '1px', marginBottom: '8px' }}>
                ▶ INSPECTOR HARLOW — FIELD NOTES
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {displayedText}
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>█</span>
              </div>
            </div>

            {/* Violations Table */}
            <div style={{
              border: '2px solid #2a2a2a',
              background: '#F5F0E8',
              marginBottom: '12px',
            }}>
              <div style={{
                background: '#2a2a2a',
                color: '#F5F0E8',
                padding: '8px 16px',
                fontSize: '11px',
                letterSpacing: '2px',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>VIOLATION LOG — HELD BREATH INSPECTION</span>
                <span>FORM IB-7741-A</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 90px 110px',
                background: '#ddd8cc',
                padding: '6px 16px',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#555',
                borderBottom: '1px solid #aaa',
              }}>
                <div>CITATION CODE</div>
                <div>DESCRIPTION</div>
                <div>SEVERITY</div>
                <div>ACTION</div>
              </div>
              {violations.length === 0 && (
                <div style={{ padding: '20px 16px', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                  No violations logged yet. Inspection in progress...
                </div>
              )}
              {violations.map((v) => (
                v.logged && (
                  <div
                    key={v.id}
                    onMouseEnter={() => setHoveredViolation(v.id)}
                    onMouseLeave={() => setHoveredViolation(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '160px 1fr 90px 110px',
                      padding: '10px 16px',
                      borderBottom: '1px solid #ccc8bc',
                      fontSize: '11px',
                      lineHeight: '1.5',
                      background: hoveredViolation === v.id ? '#ffecec' : v.contested ? '#fff8f0' : 'transparent',
                      animation: 'violationSlide 0.4s ease-out',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ color: '#CC2200', fontWeight: 'bold', fontSize: '10px', paddingRight: '8px' }}>
                      {v.code}
                    </div>
                    <div style={{ paddingRight: '12px', color: '#1a1a1a' }}>
                      {v.description}
                      {v.contested && (
                        <div style={{ color: '#994400', fontSize: '10px', marginTop: '4px' }}>
                          ⚠ CONTESTED — Evidence submitted. See diagram.
                        </div>
                      )}
                    </div>
                    <div>
                      <span style={{
                        background: severityColor(v.severity),
                        color: '#F5F0E8',
                        padding: '2px 6px',
                        fontSize: '9px',
                        letterSpacing: '1px',
                        fontWeight: 'bold',
                      }}>
                        {v.severity}
                      </span>
                      <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>
                        -{v.penalty} pts
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleContest(v.id)}
                        style={{
                          fontFamily: '"Courier New", monospace',
                          fontSize: '10px',
                          letterSpacing: '1px',
                          background: v.contested ? '#ddd' : '#F5F0E8',
                          color: v.contested ? '#888' : '#CC2200',
                          border: `1px solid ${v.contested ? '#bbb' : '#CC2200'}`,
                          padding: '4px 8px',
                          cursor: v.contested ? 'default' : 'pointer',
                          display: 'block',
                          width: '90px',
                        }}
                        disabled={v.contested}
                      >
                        {v.contested ? 'CONTESTED' : 'CONTEST'}
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Recommendation Phase */}
            {phase === 'recommending' && (
              <div style={{
                border: '2px solid #CC2200',
                background: '#F5F0E8',
                padding: '20px',
                marginBottom: '12px',
              }}>
                <div style={{ fontSize: '12px', letterSpacing: '2px', color: '#CC2200', marginBottom: '16px', fontWeight: 'bold' }}>
                  INSPECTOR RECOMMENDATION — REQUIRED SELECTION
                </div>
                <div style={{ fontSize: '11px', color: '#555', marginBottom: '16px', lineHeight: '1.7' }}>
                  Based on findings documented above, the Inspector recommends one of the following
                  courses of action. The Occupant must select. Failure to select is itself a selection
                  and will be cited under CFR 29.BREATH.0(null).
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={() => handleRecommendation('release')}
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: '12px',
                      letterSpacing: '1px',
                      background: '#F5F0E8',
                      color: '#1a1a1a',
                      border: '2px solid #2a2a2a',
                      padding: '12px 20px',
                      cursor: 'pointer',
                      flex: 1,
                      textAlign: 'left',
                      lineHeight: '1.6',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>OPTION A: CONTROLLED RELEASE</div>
                    <div style={{ fontSize: '10px', color: '#666' }}>
                      Exhale under supervision. Requires Form 88-C.<br />
                      May trigger secondary inspection.
                    </div>
                  </button>
                  <button
                    onClick={() => handleRecommendation('hold')}
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: '12px',
                      letterSpacing: '1px',
                      background: '#F5F0E8',
                      color: '#1a1a1a',
                      border: '2px solid #2a2a2a',
                      padding: '12px 20px',
                      cursor: 'pointer',
                      flex: 1,
                      textAlign: 'left',
                      lineHeight: '1.6',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>OPTION B: CONTINUED HOLD</div>
                    <div style={{ fontSize: '10px', color: '#666' }}>
                      Pending further review. Duration unspecified.<br />
                      May trigger secondary inspection.
                    </div>
                  </button>
                </div>
                <div style={{ fontSize: '9px', color: '#CC2200', marginTop: '12px' }}>
                  * Both options trigger re-inspection. This has been noted in your file.
                </div>
              </div>
            )}

            {/* Filing Phase Stamp */}
            {phase === 'filing' && stamped && (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <div style={{
                  border: '2px solid #2a2a2a',
                  background: '#F5F0E8',
                  padding: '24px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '12px', marginBottom: '16px', color: '#555', letterSpacing: '1px' }}>
                    FINAL INSPECTION REPORT — FILED
                  </div>
                  <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.8', marginBottom: '20px' }}>
                    Occupant: <strong>{userName}</strong><br />
                    Total Violations: <strong style={{ color: '#CC2200' }}>{violations.filter(v => v.logged).length}</strong><br />
                    Final Compliance Score: <strong>{complianceScore}</strong><br />
                    Selection Made: <strong>{recommendation === 'release' ? 'CONTROLLED RELEASE' : 'CONTINUED HOLD'}</strong><br />
                    Selection Cited As: <strong style={{ color: '#CC2200' }}>CFR 29.DECISION.0(z)</strong>
                  </div>
                  <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    animation: 'stampIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                  }}>
                    <div style={{
                      border: '4px solid #CC2200',
                      color: '#CC2200',
                      padding: '10px 24px',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      letterSpacing: '3px',
                      opacity: 0.85,
                      transform: 'rotate(-12deg)',
                      display: 'inline-block',
                    }}>
                      CONDITIONALLY<br />OCCUPIED
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Evidence Diagram Overlay */}
        {contestedId && contestedViolation && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
            onClick={() => setContestedId(null)}
          >
            <div
              style={{
                background: '#F5F0E8',
                border: '3px solid #2a2a2a',
                padding: '20px',
                maxWidth: '400px',
                width: '90%',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#CC2200', fontWeight: 'bold' }}>
                  PHOTOGRAPHIC EVIDENCE — {contestedViolation.code}
                </div>
                <div style={{ fontSize: '10px', color: '#888' }}>INSPECTOR USE ONLY</div>
              </div>
              <EvidenceDiagram violation={contestedViolation} />
              <div style={{ fontSize: '10px', color: '#555', marginTop: '12px', lineHeight: '1.6', padding: '0 4px' }}>
                <strong>CONTEST STATUS:</strong> Noted. Evidence has been added to your file.
                Contesting a violation does not remove the violation. It adds a record of
                the contest, which may itself be reviewed for compliance.
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  onClick={() => setContestedId(null)}
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    background: '#2a2a2a',
                    color: '#F5F0E8',
                    border: 'none',
                    padding: '8px 20px',
                    cursor: 'pointer',
                  }}
                >
                  DISMISS EVIDENCE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer / Footnotes */}
        <div style={{
          borderTop: '1px solid #aaa8a0',
          paddingTop: '12px',
          marginTop: '8px',
        }}>
          <div style={{ fontSize: '9px', color: '#888', lineHeight: '1.8' }}>
            <strong>FOOTNOTES:</strong><br />
            1. This inspection was conducted in accordance with OS-ICD Internal Procedure Manual, Revision 14.<br />
            2. All anatomical diagrams are for illustrative purposes. Parts labeled herein may not correspond to established medical terminology.<br />
            3. The compliance score is informational only. A score of zero does not constitute medical advice.<br />
            4. Contested violations remain in effect during and after the contest process.<br />
            5. Re-inspection cycles are automatic. There is no opt-out procedure at this time.<br />
            6. The Inspector's findings are final. The Inspector's findings are also ongoing.<br />
            <span style={{ color: '#CC2200' }}>
              7(c). Records filed under this form are maintained in Cabinet 7-C of the Internal Compliance Archive. Cabinet 7-C cannot be located at this time. This footnote has been filed in Cabinet 7-C.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}