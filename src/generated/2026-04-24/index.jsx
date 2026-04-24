import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [dateOfOnset, setDateOfOnset] = useState('');
  const [intensity, setIntensity] = useState(50);
  const [originalPackaging, setOriginalPackaging] = useState('');
  const [usageContext, setUsageContext] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [assessmentPhase, setAssessmentPhase] = useState(0);
  const [denialReason, setDenialReason] = useState(null);
  const [registerAnother, setRegisterAnother] = useState(true);
  const [claimId, setClaimId] = useState('');
  const timeoutRefs = useRef([]);

  const feelings = [
    'a longing with no object',
    'unexpected pride about something small',
    'the specific grief of a Sunday at 4pm',
    'tenderness toward a stranger you will never see again',
    'nostalgia for a version of yourself that may not have existed',
    'the dread of a good thing ending while it is still happening',
    'relief that feels like guilt',
    'love that arrived too late to be useful',
    'a happiness so fragile you stopped moving',
    'the exhaustion of having wanted something for too long',
  ];

  const denialTemplates = [
    {
      code: 'PRE-EXISTING-001',
      title: 'Pre-Existing Condition',
      body: (feeling, stats) =>
        `After thorough review of your account history, our systems have identified that "${feeling}" is consistent with a recurring emotional pattern documented across ${stats.priorClaims} prior claims filed under your account in the last ${stats.months} months. Per Section 4.2(b) of the FeelingCare Extended Protection Agreement, feelings that share more than 60% structural overlap with previously registered feelings are classified as pre-existing conditions and are therefore excluded from coverage. Our records indicate your earliest related claim was filed on ${stats.firstClaimDate}, for a feeling described as "${stats.relatedFeeling}." The current feeling appears to be a continuation of that unresolved emotional thread, rather than a new onset event.`,
    },
    {
      code: 'USER-INDUCED-WEAR-003',
      title: 'User-Induced Wear',
      body: (feeling, stats) =>
        `Our diagnostic team has completed analysis of the feeling unit described in your claim. The physical inspection log indicates significant wear patterns inconsistent with normal use. Specifically, the feeling appears to have been revisited ${stats.revisitCount} times within the first 48 hours of onset — well beyond the recommended 2-3 revisitations per day outlined in your FeelingCare warranty documentation. This level of engagement constitutes user-induced wear, which voids coverage under Clause 7. Additionally, our records show you accessed this feeling during ${stats.inappropriateContext}, an environment not approved for feelings of this intensity class.`,
    },
    {
      code: 'PACKAGING-DAMAGE-007',
      title: 'Arrived Outside Original Packaging',
      body: (feeling, stats) =>
        `FeelingCare Extended Protection LLC warrants only feelings that arrive in their original, unmodified packaging. Our assessment indicates that "${feeling}" was received in a compromised state: ${stats.packagingNote}. Feelings received in this condition have typically been pre-handled by third parties — including but not limited to: other people's experiences, ambient media, unrelated memories triggered by smell or light. We cannot confirm the feeling's integrity prior to your receipt of it. As such, we are unable to honor this claim. We recommend documenting future feelings at the moment of receipt.`,
    },
    {
      code: 'EXCEEDED-COVERAGE-WINDOW-012',
      title: 'Claim Filed Outside Coverage Window',
      body: (feeling, stats) =>
        `According to our records, the onset date you have provided falls within a period during which your FeelingCare plan was operating under reduced coverage terms. Between ${stats.windowStart} and ${stats.windowEnd}, your account was flagged for high-volume emotional activity — specifically, ${stats.flaggedCount} distinct feelings processed in a ${stats.flaggedWindow}-day window. Per our Fair Use Policy, accounts exhibiting this pattern are temporarily downgraded to Basic Emotional Coverage, which excludes complex feelings above 35 newtons of chest. Your submitted intensity of ${stats.submittedIntensity} newtons exceeds this threshold by a significant margin.`,
    },
    {
      code: 'MISUSE-CLASSIFICATION-019',
      title: 'Feeling Misclassified by User',
      body: (feeling, stats) =>
        `Our automated classification engine has reviewed the feeling you submitted and determined that "${feeling}" does not match the feeling you actually experienced. Based on your usage context and intensity rating, our system identifies the feeling as more consistent with "${stats.actualFeeling}" — a related but distinct emotional product not covered under your current plan tier. We understand this determination may itself feel incorrect. However, FeelingCare Extended Protection LLC relies on objective classification protocols and cannot accept user self-reporting as the primary diagnostic criterion. If you believe this classification is in error, you may submit a Feeling Reclassification Request (Form FC-88) within 30 days.`,
    },
    {
      code: 'FORCE-MAJEURE-024',
      title: 'Force Majeure — Environmental Origin',
      body: (feeling, stats) =>
        `Following our investigation, we have determined that "${feeling}" was not a product failure but rather a naturally occurring emotional event precipitated by conditions outside FeelingCare's sphere of responsibility. Specifically, our environmental analysis flagged the following contributing factors in your submitted context: ${stats.environmentalFactors}. Feelings arising from Force Majeure conditions — defined in Appendix C as "any emotional event caused by time of day, quality of light, overheard music, or the specific way someone said your name" — are excluded from warranty coverage. We are sorry for any inconvenience this determination may cause. The inconvenience is also not covered.`,
    },
  ];

  const fabricateStats = (feelingIndex, dateStr) => {
    const seed = feelingIndex + (dateStr ? dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 42);
    const pseudo = (n) => ((seed * 9301 + 49297 * n) % 233280) / 233280;

    const months = Math.floor(pseudo(1) * 18) + 6;
    const priorClaims = Math.floor(pseudo(2) * 5) + 2;
    const revisitCount = Math.floor(pseudo(3) * 40) + 15;
    const flaggedCount = Math.floor(pseudo(4) * 20) + 8;
    const flaggedWindow = Math.floor(pseudo(5) * 20) + 10;

    const relatedFeelings = [
      'a mild ache without location',
      'wistfulness about a Tuesday',
      'the sense of having almost remembered something',
      'quiet disappointment in a shade of blue',
      'love arriving after the deadline',
    ];
    const actualFeelings = [
      'anticipatory grief',
      'ambient yearning (Type II)',
      'displaced affection',
      'recursive melancholy',
      'performative contentment',
    ];
    const packagingNotes = [
      'it arrived mid-sentence, during an unrelated conversation',
      'it was present upon waking, before the day had context',
      'it emerged from a song you did not intend to hear',
      'it was transmitted via a photograph you were not prepared for',
    ];
    const contexts = [
      'a moving vehicle',
      'a crowded room you were pretending to enjoy',
      'a Wednesday afternoon with no particular cause',
      'the space between tasks',
    ];
    const envFactors = [
      'late afternoon light, a song from a prior decade, and the specific silence of an empty room',
      'the smell of rain on concrete, an overheard phone call, and the hour between 4pm and 5pm',
      'proximity to someone leaving, the memory of someone already gone, and low ambient noise',
    ];

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const m1 = Math.floor(pseudo(6) * 12);
    const y1 = 2022 + Math.floor(pseudo(7) * 3);
    const d1 = Math.floor(pseudo(8) * 28) + 1;
    const m2 = (m1 + Math.floor(pseudo(9) * 4) + 1) % 12;
    const y2 = m2 < m1 ? y1 + 1 : y1;

    return {
      months,
      priorClaims,
      revisitCount,
      flaggedCount,
      flaggedWindow,
      flaggedWindow2: flaggedWindow,
      submittedIntensity: intensity,
      firstClaimDate: `${monthNames[m1]} ${d1}, ${y1}`,
      windowStart: `${monthNames[m1]} ${y1}`,
      windowEnd: `${monthNames[m2]} ${y2}`,
      relatedFeeling: relatedFeelings[Math.floor(pseudo(10) * relatedFeelings.length)],
      actualFeeling: actualFeelings[Math.floor(pseudo(11) * actualFeelings.length)],
      packagingNote: packagingNotes[Math.floor(pseudo(12) * packagingNotes.length)],
      inappropriateContext: contexts[Math.floor(pseudo(13) * contexts.length)],
      environmentalFactors: envFactors[Math.floor(pseudo(14) * envFactors.length)],
    };
  };

  const generateClaimId = (feelingIndex, dateStr) => {
    const seed = feelingIndex + (dateStr ? dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 99);
    const pseudo = (n) => Math.floor(((seed * 9301 + 49297 * n) % 233280) / 233280 * 9000 + 1000);
    return `FC-${pseudo(1)}-${pseudo(2)}-${pseudo(3)}`;
  };

  useEffect(() => {
    if (!submitted) return;
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    const phases = [1, 2, 3, 4];
    phases.forEach((phase, i) => {
      const t = setTimeout(() => {
        setAssessmentPhase(phase);
        if (phase === 4) {
          const feelingIndex = feelings.indexOf(selectedFeeling);
          const templateIndex = (feelingIndex + (dateOfOnset ? dateOfOnset.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0)) % denialTemplates.length;
          const template = denialTemplates[templateIndex];
          const stats = fabricateStats(feelingIndex, dateOfOnset);
          const id = generateClaimId(feelingIndex, dateOfOnset);
          setClaimId(id);
          setDenialReason({ template, stats });
        }
      }, (i + 1) * 1400);
      timeoutRefs.current.push(t);
    });

    return () => timeoutRefs.current.forEach(clearTimeout);
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFeeling) return;
    setSubmitted(true);
    setAssessmentPhase(0);
    setDenialReason(null);
  };

  const handleReset = () => {
    setSubmitted(false);
    setAssessmentPhase(0);
    setDenialReason(null);
    setSelectedFeeling('');
    setDateOfOnset('');
    setIntensity(50);
    setOriginalPackaging('');
    setUsageContext('');
    setClaimId('');
    setRegisterAnother(true);
  };

  const phaseMessages = [
    '> Initializing FeelingCare Diagnostic Engine v4.1.2...',
    '> Scanning feeling unit for structural defects...',
    '> Cross-referencing account history (18-month lookback)...',
    '> Determining coverage eligibility...',
    '> Assessment complete.',
  ];

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f7',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    padding: '40px 20px',
    color: '#1a1a2e',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const logoStyle = {
    fontSize: '13px',
    letterSpacing: '3px',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: '8px',
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1a1a2e',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  };

  const subtitleStyle = {
    fontSize: '13px',
    color: '#999',
    letterSpacing: '0.5px',
  };

  const cardStyle = {
    maxWidth: '680px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e8',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(26,26,46,0.07)',
  };

  const cardHeaderStyle = {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '16px 28px',
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const formStyle = {
    padding: '32px 28px',
  };

  const fieldGroupStyle = {
    marginBottom: '24px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '8px',
    fontWeight: '600',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d0d0d8',
    borderRadius: '3px',
    fontSize: '14px',
    color: '#1a1a2e',
    backgroundColor: '#fafafa',
    appearance: 'none',
    cursor: 'pointer',
    outline: 'none',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d0d0d8',
    borderRadius: '3px',
    fontSize: '14px',
    color: '#1a1a2e',
    backgroundColor: '#fafafa',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const sliderContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const sliderStyle = {
    flex: 1,
    accentColor: '#1a1a2e',
    cursor: 'pointer',
  };

  const sliderValueStyle = {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#1a1a2e',
    minWidth: '120px',
    fontWeight: '600',
  };

  const radioGroupStyle = {
    display: 'flex',
    gap: '24px',
  };

  const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d0d0d8',
    borderRadius: '3px',
    fontSize: '14px',
    color: '#1a1a2e',
    backgroundColor: '#fafafa',
    resize: 'vertical',
    minHeight: '90px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#e8e8f0',
    margin: '8px 0 24px',
  };

  const submitBtnStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '3px',
    fontSize: '11px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s',
  };

  const termStyle = {
    fontSize: '11px',
    color: '#bbb',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: '1.6',
  };

  // Assessment view
  const assessmentStyle = {
    padding: '32px 28px',
  };

  const terminalStyle = {
    backgroundColor: '#0d0d1a',
    borderRadius: '4px',
    padding: '20px',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#7fff7f',
    marginBottom: '28px',
    lineHeight: '2',
  };

  const terminalLineStyle = (visible) => ({
    opacity: visible ? 1 : 0.3,
    transition: 'opacity 0.4s',
  });

  // Denial letter
  const letterWrapStyle = {
    position: 'relative',
    border: '1px solid #d0d0d8',
    borderRadius: '3px',
    padding: '36px 36px 28px',
    backgroundColor: '#fefefe',
    fontFamily: 'Georgia, "Times New Roman", serif',
    lineHeight: '1.75',
    overflow: 'hidden',
  };

  const stampStyle = {
    position: 'absolute',
    top: '40px',
    right: '36px',
    border: '3px solid #cc2200',
    color: '#cc2200',
    padding: '6px 14px',
    fontSize: '22px',
    fontWeight: '900',
    letterSpacing: '4px',
    fontFamily: 'monospace',
    transform: 'rotate(-15deg)',
    opacity: 0.85,
    userSelect: 'none',
    lineHeight: 1,
  };

  const letterheadStyle = {
    borderBottom: '2px solid #1a1a2e',
    paddingBottom: '16px',
    marginBottom: '24px',
  };

  const companyNameStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: '1px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };

  const companyTaglineStyle = {
    fontSize: '10px',
    color: '#999',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    marginTop: '2px',
  };

  const letterMetaStyle = {
    fontSize: '11px',
    color: '#888',
    fontFamily: 'monospace',
    marginBottom: '20px',
    lineHeight: '1.8',
  };

  const letterBodyStyle = {
    fontSize: '14px',
    color: '#2a2a3a',
    marginBottom: '20px',
  };

  const letterClosingStyle = {
    fontSize: '13px',
    color: '#555',
    borderTop: '1px solid #e8e8f0',
    paddingTop: '16px',
    marginTop: '24px',
  };

  const denialCodeStyle = {
    display: 'inline-block',
    backgroundColor: '#fff0f0',
    border: '1px solid #ffcccc',
    color: '#cc2200',
    fontFamily: 'monospace',
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '2px',
    letterSpacing: '1px',
  };

  const checkboxRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f8f8fb',
    border: '1px solid #e8e8f0',
    borderRadius: '3px',
  };

  const checkboxLabelStyle = {
    fontSize: '13px',
    color: '#555',
    cursor: 'pointer',
  };

  const resetBtnStyle = {
    marginTop: '16px',
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#1a1a2e',
    border: '1px solid #1a1a2e',
    borderRadius: '3px',
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: '600',
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        input[type="range"]::-webkit-slider-thumb { cursor: pointer; }
        select option { background: #fff; color: #1a1a2e; }
      `}</style>

      <div style={headerStyle}>
        <div style={logoStyle}>FeelingCare Extended Protection LLC</div>
        <div style={titleStyle}>Warranty Claim Portal</div>
        <div style={subtitleStyle}>Product registration &amp; defect reporting for feelings received</div>
      </div>

      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span>{submitted ? (assessmentPhase < 4 ? 'Processing Claim' : 'Claim Assessment Complete') : 'New Warranty Claim'}</span>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', opacity: 0.6 }}>
            {submitted && claimId ? claimId : 'CLAIM PENDING'}
          </span>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Product (Feeling Received)</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedFeeling}
                  onChange={(e) => setSelectedFeeling(e.target.value)}
                  style={selectStyle}
                  required
                >
                  <option value="">— select feeling —</option>
                  {feelings.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888', fontSize: '10px' }}>▼</div>
              </div>
            </div>

            <div style={dividerStyle} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Date of Onset</label>
                <input
                  type="date"
                  value={dateOfOnset}
                  onChange={(e) => setDateOfOnset(e.target.value)}
                  max={today}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Arrival Context</label>
                <input
                  type="text"
                  value={''}
                  placeholder="e.g. morning, unannounced"
                  style={{ ...inputStyle, color: '#bbb' }}
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Intensity — Newtons of Chest</label>
              <div style={sliderContainerStyle}>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  style={sliderStyle}
                />
                <span style={sliderValueStyle}>{intensity} N/chest</span>
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#bbb', fontFamily: 'monospace' }}>
                {intensity < 20 ? 'trace amount — may not qualify for claim' :
                  intensity < 40 ? 'mild — standard coverage tier' :
                    intensity < 65 ? 'moderate — requires documentation' :
                      intensity < 85 ? 'significant — expedited review' :
                        'severe — flagged for manual inspection'}
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Did the Feeling Arrive in Original Packaging?</label>
              <div style={radioGroupStyle}>
                {['yes', 'no', 'unsure'].map((opt) => (
                  <label key={opt} style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="packaging"
                      value={opt}
                      checked={originalPackaging === opt}
                      onChange={() => setOriginalPackaging(opt)}
                      required
                      style={{ accentColor: '#1a1a2e' }}
                    />
                    {opt === 'yes' ? 'Yes — intact' : opt === 'no' ? 'No — compromised' : 'Unsure — cannot verify'}
                  </label>
                ))}
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Circumstances of Receipt</label>
              <textarea
                value={usageContext}
                onChange={(e) => setUsageContext(e.target.value)}
                placeholder="Describe the conditions under which the feeling arrived. Include time of day, any precipitating events, whether you were alone. Do not editorialize."
                style={textareaStyle}
                required
              />
            </div>

            <div style={dividerStyle} />

            <button type="submit" style={submitBtnStyle}>
              File Warranty Claim
            </button>
            <div style={termStyle}>
              By submitting, you confirm this feeling was received within the last 90 days and has not been previously claimed.<br />
              FeelingCare Extended Protection LLC is not responsible for feelings that were always going to happen.
            </div>
          </form>
        ) : (
          <div style={assessmentStyle}>
            <div style={terminalStyle}>
              {phaseMessages.map((msg, i) => (
                <div key={i} style={terminalLineStyle(assessmentPhase >= i)}>
                  {msg}
                  {assessmentPhase === i && i < 4 && (
                    <span style={{ animation: 'blink 1s infinite' }}>█</span>
                  )}
                </div>
              ))}
            </div>

            {assessmentPhase === 4 && denialReason && (
              <>
                <div style={letterWrapStyle}>
                  <div style={stampStyle}>DENIED</div>

                  <div style={letterheadStyle}>
                    <div style={companyNameStyle}>FeelingCare Extended Protection LLC</div>
                    <div style={companyTaglineStyle}>Protecting You From the Full Weight of Your Feelings™</div>
                  </div>

                  <div style={letterMetaStyle}>
                    CLAIM ID: {claimId}<br />
                    RE: {selectedFeeling}<br />
                    ONSET DATE: {dateOfOnset}<br />
                    INTENSITY REPORTED: {intensity} N/chest<br />
                    DENIAL CODE: <span style={denialCodeStyle}>{denialReason.template.code}</span>
                  </div>

                  <div style={letterBodyStyle}>
                    <p style={{ marginTop: 0 }}>Dear Valued FeelingCare Member,</p>
                    <p>
                      Thank you for submitting your warranty claim regarding the above-referenced feeling. We have completed our assessment and regret to inform you that your claim has been <strong>denied</strong> on the following grounds:
                    </p>
                    <p style={{ fontStyle: 'italic', borderLeft: '3px solid #e0e0e8', paddingLeft: '16px', color: '#444' }}>
                      <strong>{denialReason.template.title}.</strong>{' '}
                      {denialReason.template.body(selectedFeeling, denialReason.stats)}
                    </p>
                    <p>
                      We want to be clear: this determination is not a judgment of the feeling's validity. The feeling was real. The feeling may have been significant. It is simply not, under the terms of your current coverage agreement, our responsibility.
                    </p>
                    <p>
                      You may appeal this decision by submitting Form FC-44 (Emotional Grievance Appeal) within 30 calendar days. Appeals are reviewed by our Feelings Assessment Board on a quarterly basis. The current review queue is approximately 14 months.
                    </p>
                  </div>

                  <div style={letterClosingStyle}>
                    <p style={{ margin: '0 0 8px' }}>With sincere regards,</p>
                    <p style={{ margin: 0, fontWeight: '700', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '13px' }}>
                      The FeelingCare Claims Review Team
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
                      This letter was generated automatically. No one read it. Someone wrote it once, a long time ago, for a different feeling entirely.
                    </p>
                  </div>
                </div>

                <div style={checkboxRowStyle}>
                  <input
                    type="checkbox"
                    id="registerAnother"
                    checked={registerAnother}
                    onChange={(e) => setRegisterAnother(e.target.checked)}
                    style={{ accentColor: '#1a1a2e', width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  <label htmlFor="registerAnother" style={checkboxLabelStyle}>
                    Register another feeling
                  </label>
                </div>

                {registerAnother && (
                  <button onClick={handleReset} style={resetBtnStyle}>
                    Begin New Claim
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '11px', color: '#ccc', letterSpacing: '1px' }}>
        © FeelingCare Extended Protection LLC — All feelings are final. No exchanges. No refunds.
      </div>
    </div>
  );
}