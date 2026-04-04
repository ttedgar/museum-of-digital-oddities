import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [dots, setDots] = useState(1);

  const conversions = {
    'email_2014': {
      quantity: '3.7',
      livestock: 'goats',
      livestockDetail: '(3 standard, 0.7 spectral)',
      footnotes: [
        'Per Directive 88-B of the Emotional Quantification Act (2003), residual email dread is assessed at a base rate of 1.2 goats per calendar year elapsed.',
        'The fractional goat (0.7) represents an unresolved attachment to the subject line. See Appendix F: "Partial Ungulates and Their Meaning."',
        'If the email contained an attachment you never opened, add 0.4 geese. This form does not cover geese. File Form GL-2A separately.',
      ],
      warning: 'The Ministry notes that attempting to revisit the email voids all livestock claims retroactively.',
    },
    'strangers_sneeze': {
      quantity: '1',
      livestock: 'goose',
      livestockDetail: '(with reservations)',
      footnotes: [
        'Warmth of incidental human contact is classified under Schedule 7: Ambient Affections (Miscellaneous), subsection 3, paragraph ii.',
        'The goose has been informed of its assignment. It is not pleased but has agreed to comply pending review.',
        'Note: If the stranger said "excuse me" afterward, the goose is upgraded to a goose with hat. This upgrade is non-transferable.',
      ],
      warning: 'The Ministry reminds applicants that warmth accrued from strangers depreciates at 12% per hour. File promptly.',
    },
    'being_perceived': {
      quantity: '0.5',
      livestock: 'draft horse',
      livestockDetail: '(the horse is mostly regret)',
      footnotes: [
        'Being perceived is classified as a Tier 4 Ambiguous Sensation under the Feelings Reclassification Order of 1997, amended twice but never satisfactorily.',
        'Half a draft horse is assigned because the other half is still deciding whether you deserved to be seen.',
        'The horse will not make eye contact. This is considered part of the conversion.',
      ],
      warning: 'The Ministry strongly advises against seeking further perception until the half-horse situation is resolved.',
    },
    'almost_remembered': {
      quantity: '14',
      livestock: 'geese',
      livestockDetail: '(all facing slightly different directions)',
      footnotes: [
        'Per Circular 44: "On the Livestock Equivalent of Cognitive Near-Misses," almost-remembered feelings are assigned geese in direct proportion to frustration density.',
        'The geese are arranged in a formation that suggests meaning but does not deliver it. This is intentional.',
        'Should the memory surface within 72 hours, 7 geese must be returned. The Ministry will know.',
      ],
      warning: 'Do not attempt to force the memory. The geese become hostile.',
    },
    'sunday_dread': {
      quantity: '2',
      livestock: 'draft horses',
      livestockDetail: '(one is Monday, one knows)',
      footnotes: [
        'Sunday Evening Anticipatory Dread (SEAD) is one of the most heavily studied emotional categories in the Ministry\'s 40-year history.',
        'Two draft horses have been allocated: one representing the dread itself, and one representing your awareness that the dread is irrational, which makes it worse.',
        'Both horses are tired. This is load-bearing to the conversion.',
      ],
      warning: 'The Ministry accepts no responsibility for what happens on Monday.',
    },
    'almost_said_it': {
      quantity: '6',
      livestock: 'goats',
      livestockDetail: '(plus 1 goat pending)',
      footnotes: [
        'Unexpressed significant statements are assessed under Form EL-7C Subsection 9: "Livestock for Things That Didn\'t Happen But Almost Did."',
        'The 6 goats represent the statement. The pending goat represents the version of you that almost said it.',
        'If the moment passed more than one year ago, the goats have formed their own opinions about the matter.',
      ],
      warning: 'The pending goat will remain pending indefinitely. The Ministry does not resolve pending goats.',
    },
    'too_much_sky': {
      quantity: '∞',
      livestock: 'geese',
      livestockDetail: '(theoretical)',
      footnotes: [
        'Sublime overwhelm triggered by excessive sky is classified as an Uncountable Sensation per the Infinite Livestock Exemption Act (1961).',
        'Theoretical geese are not physical geese. They exist in a livestock sense only. Do not attempt to house them.',
        'The Ministry\'s own mathematicians have looked at this one and walked away quietly.',
      ],
      warning: 'The Ministry advises looking at slightly less sky next time. Maybe some medium sky.',
    },
    'proud_crying': {
      quantity: '4.1',
      livestock: 'goats',
      livestockDetail: '(emotionally complex)',
      footnotes: [
        'Pride-adjacent weeping is assessed at a premium rate due to its dual-channel emotional signature (Schedule 12, Clause 7: "Feelings That Cry But Shouldn\'t").',
        'The 0.1 goat is the part of you that is embarrassed about crying. It is a very small goat and it is fine.',
        'All four point one goats are proud of you, which may cause further crying and further goats.',
      ],
      warning: 'Recursive proud-crying loops must be reported to the Ministry within 48 hours.',
    },
  };

  const feelings = [
    { value: 'email_2014', label: 'That specific dread when you remember an email from 2014' },
    { value: 'strangers_sneeze', label: 'The warmth of a stranger\'s sneeze' },
    { value: 'being_perceived', label: 'Being perceived' },
    { value: 'almost_remembered', label: 'A thing you almost remembered' },
    { value: 'sunday_dread', label: 'Sunday evening (the feeling, not the time)' },
    { value: 'almost_said_it', label: 'Something you almost said but didn\'t' },
    { value: 'too_much_sky', label: 'Too much sky at once' },
    { value: 'proud_crying', label: 'Crying because you are proud of someone' },
  ];

  useEffect(() => {
    let interval;
    if (isCalculating) {
      interval = setInterval(() => {
        setDots(d => (d % 3) + 1);
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isCalculating]);

  useEffect(() => {
    if (!isCalculating) return;
    const timeout = setTimeout(() => {
      const data = conversions[selectedFeeling];
      setResult(data);
      setIsCalculating(false);
      setShowStamp(true);
      setTimeout(() => setStamped(true), 100);
    }, 1800);
    return () => clearTimeout(timeout);
  }, [isCalculating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFeeling) return;
    setResult(null);
    setShowStamp(false);
    setStamped(false);
    setIsCalculating(true);
  };

  const handleReset = () => {
    setFormKey(k => k + 1);
    setSelectedFeeling('');
    setResult(null);
    setIsCalculating(false);
    setShowStamp(false);
    setStamped(false);
    setDots(1);
  };

  const dotsStr = '.'.repeat(dots);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#2c2c2c',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '40px 20px',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        key={formKey}
        style={{
          backgroundColor: '#f5f0e0',
          width: '100%',
          maxWidth: '720px',
          border: '2px solid #8a7a5a',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 0 60px rgba(180,160,100,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Paper texture overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.015) 28px, rgba(0,0,0,0.015) 29px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Header band */}
        <div style={{
          backgroundColor: '#1a2340',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <span style={{ color: '#c8b87a', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Ministry of Approximate Emotions
          </span>
          <span style={{ color: '#c8b87a', fontSize: '10px', letterSpacing: '1px' }}>
            Form EL-7C (Rev. 14)
          </span>
        </div>

        {/* Seal and title */}
        <div style={{ padding: '24px 32px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              border: '3px solid #1a2340',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backgroundColor: '#f0ead0',
              boxShadow: '0 0 0 2px #8a7a5a',
            }}>
              <div style={{ fontSize: '22px', lineHeight: 1 }}>🐐</div>
              <div style={{ fontSize: '7px', color: '#1a2340', letterSpacing: '0.5px', marginTop: '2px', textAlign: 'center', lineHeight: 1.2 }}>OFFICIAL<br/>SEAL</div>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: '#4a4030', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                Official Document — Not For Personal Use
              </div>
              <h1 style={{
                fontSize: '18px',
                color: '#1a2340',
                margin: 0,
                fontWeight: 'bold',
                lineHeight: 1.2,
              }}>
                Emotional Livestock Conversion Request
              </h1>
              <div style={{ fontSize: '12px', color: '#4a4030', marginTop: '2px' }}>
                Form EL-7C — Administered under the Feelings Quantification Act, Schedule 9
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #8a7a5a',
            borderBottom: '1px solid #8a7a5a',
            padding: '6px 0',
            margin: '16px 0',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#5a4a30',
            letterSpacing: '0.5px',
          }}>
            <span>PROCESSING OFFICE USE ONLY ▪ DO NOT WRITE BELOW THIS LINE</span>
            <span>Ref: MAE/EL/{new Date().getFullYear()}/∞</span>
          </div>
        </div>

        {/* Form body */}
        <div style={{ padding: '0 32px 32px', position: 'relative', zIndex: 1 }}>

          {/* Applicant section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              backgroundColor: '#1a2340',
              color: '#c8b87a',
              fontSize: '10px',
              letterSpacing: '2px',
              padding: '4px 8px',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}>
              Section A — Applicant Declaration
            </div>
            <p style={{ fontSize: '12px', color: '#3a3020', margin: '0 0 12px', lineHeight: 1.7 }}>
              I, the undersigned, hereby attest that I am currently experiencing or have recently experienced a feeling of indeterminate character and wish to convert said feeling into its recognized livestock equivalent for purposes of record, closure, or general bureaucratic compliance. I understand that the Ministry's conversion rates are final and that emotional rounding is performed in the Ministry's favor.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#5a4a30', marginBottom: '3px', letterSpacing: '1px' }}>
                  APPLICANT NAME (or nearest approximation)
                </div>
                <div style={{
                  borderBottom: '1px solid #8a7a5a',
                  height: '22px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }} />
              </div>
              <div style={{ width: '140px' }}>
                <div style={{ fontSize: '10px', color: '#5a4a30', marginBottom: '3px', letterSpacing: '1px' }}>
                  DATE OF FEELING
                </div>
                <div style={{
                  borderBottom: '1px solid #8a7a5a',
                  height: '22px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }} />
              </div>
            </div>
          </div>

          {/* Feeling selection */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              backgroundColor: '#1a2340',
              color: '#c8b87a',
              fontSize: '10px',
              letterSpacing: '2px',
              padding: '4px 8px',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}>
              Section B — Feeling Identification
            </div>
            <div style={{ fontSize: '10px', color: '#5a4a30', marginBottom: '6px', letterSpacing: '1px' }}>
              SELECT THE FEELING TO BE CONVERTED (check one — multiple feelings require separate Form EL-7C submissions)
            </div>
            <select
              value={selectedFeeling}
              onChange={e => {
                setSelectedFeeling(e.target.value);
                setResult(null);
                setShowStamp(false);
                setStamped(false);
              }}
              disabled={isCalculating}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '13px',
                fontFamily: 'Georgia, serif',
                color: '#1a2340',
                backgroundColor: selectedFeeling ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                border: '1px solid #8a7a5a',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M0 0l6 8 6-8z\' fill=\'%231a2340\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '32px',
              }}
            >
              <option value="">— Select a feeling from the approved registry —</option>
              {feelings.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <div style={{ fontSize: '9px', color: '#7a6a50', marginTop: '5px', fontStyle: 'italic' }}>
              Note: If your feeling does not appear in the registry, it has not been approved for existence. Please contact your regional Emotional Compliance Officer.
            </div>
          </div>

          {/* Submit */}
          {!result && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                backgroundColor: '#1a2340',
                color: '#c8b87a',
                fontSize: '10px',
                letterSpacing: '2px',
                padding: '4px 8px',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}>
                Section C — Conversion Request Submission
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFeeling || isCalculating}
                  style={{
                    backgroundColor: selectedFeeling && !isCalculating ? '#1a2340' : '#8a8070',
                    color: '#c8b87a',
                    border: 'none',
                    padding: '12px 28px',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: selectedFeeling && !isCalculating ? 'pointer' : 'not-allowed',
                    fontFamily: 'Georgia, serif',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {isCalculating ? `Processing Request${dotsStr}` : 'Submit for Conversion'}
                </button>
                {isCalculating && (
                  <span style={{
                    fontSize: '11px',
                    color: '#5a4a30',
                    fontStyle: 'italic',
                    animation: 'blink 1.2s ease-in-out infinite',
                  }}>
                    Consulting the livestock register...
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div style={{
              animation: 'fadeIn 0.5s ease-out',
              position: 'relative',
            }}>
              <div style={{
                backgroundColor: '#1a2340',
                color: '#c8b87a',
                fontSize: '10px',
                letterSpacing: '2px',
                padding: '4px 8px',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}>
                Section D — Conversion Result (Official)
              </div>

              {/* Main result box */}
              <div style={{
                border: '2px solid #1a2340',
                padding: '20px',
                backgroundColor: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
                position: 'relative',
              }}>
                <div style={{ fontSize: '10px', color: '#5a4a30', letterSpacing: '1px', marginBottom: '8px' }}>
                  YOUR FEELING HAS BEEN ASSESSED AND CONVERTED AS FOLLOWS:
                </div>
                <div style={{
                  fontSize: '36px',
                  color: '#1a2340',
                  fontWeight: 'bold',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  {result.quantity}
                </div>
                <div style={{ fontSize: '22px', color: '#1a2340', marginBottom: '4px' }}>
                  {result.livestock}
                </div>
                <div style={{ fontSize: '13px', color: '#5a4a30', fontStyle: 'italic' }}>
                  {result.livestockDetail}
                </div>

                {/* Stamp */}
                {showStamp && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    border: '3px solid #8b1a1a',
                    padding: '6px 10px',
                    color: '#8b1a1a',
                    fontSize: '8px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    transform: stamped ? 'rotate(-14deg) scale(1)' : 'rotate(-14deg) scale(2)',
                    opacity: stamped ? 0.85 : 0,
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
                    backgroundColor: 'rgba(245,240,224,0.6)',
                    boxShadow: 'inset 0 0 8px rgba(139,26,26,0.15)',
                    maxWidth: '120px',
                  }}>
                    PROCESSED<br />
                    ⬥⬥⬥<br />
                    MINISTRY OF<br />
                    APPROXIMATE<br />
                    EMOTIONS
                  </div>
                )}
              </div>

              {/* Footnotes */}
              <div style={{
                borderTop: '1px solid #8a7a5a',
                paddingTop: '12px',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '9px', color: '#5a4a30', letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Official Footnotes — Please Read Before Taking Possession of Livestock
                </div>
                {result.footnotes.map((fn, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '6px',
                    animation: `fadeIn 0.4s ease-out ${0.2 + i * 0.15}s both`,
                  }}>
                    <span style={{ fontSize: '9px', color: '#8b1a1a', fontWeight: 'bold', flexShrink: 0, marginTop: '1px' }}>
                      [{i + 1}]
                    </span>
                    <span style={{ fontSize: '10px', color: '#3a3020', lineHeight: 1.6 }}>
                      {fn}
                    </span>
                  </div>
                ))}
              </div>

              {/* Warning box */}
              <div style={{
                border: '1px solid #8b1a1a',
                backgroundColor: 'rgba(139,26,26,0.05)',
                padding: '10px 14px',
                marginBottom: '20px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                animation: 'fadeIn 0.4s ease-out 0.6s both',
              }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠</span>
                <div>
                  <div style={{ fontSize: '9px', color: '#8b1a1a', letterSpacing: '1.5px', fontWeight: 'bold', marginBottom: '3px', textTransform: 'uppercase' }}>
                    Ministry Warning
                  </div>
                  <div style={{ fontSize: '11px', color: '#5a1a1a', lineHeight: 1.6 }}>
                    {result.warning}
                  </div>
                  <div style={{ fontSize: '9px', color: '#8b1a1a', marginTop: '5px', fontStyle: 'italic' }}>
                    The Ministry does not accept appeals. The Ministry has never accepted appeals. The Ministry is not aware that appeals exist.
                  </div>
                </div>
              </div>

              {/* Reset button */}
              <div style={{
                borderTop: '1px solid #8a7a5a',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                animation: 'fadeIn 0.4s ease-out 0.8s both',
              }}>
                <div style={{ fontSize: '10px', color: '#7a6a50', fontStyle: 'italic' }}>
                  This conversion is binding. Thank you for your emotional compliance.
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#1a2340',
                    border: '1px solid #1a2340',
                    padding: '8px 18px',
                    fontSize: '10px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Convert Another Feeling
                </button>
              </div>
            </div>
          )}

          {/* Footer fine print */}
          <div style={{
            borderTop: '1px solid #8a7a5a',
            marginTop: result ? '0' : '20px',
            paddingTop: '12px',
            fontSize: '8px',
            color: '#9a8a6a',
            lineHeight: 1.7,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>MAE/FORM/EL-7C/14 — Supersedes all previous versions</span>
              <span>Page 1 of 1 (there is no page 2)</span>
            </div>
            The Ministry of Approximate Emotions is a non-statutory body operating under the Emotional Governance Framework (2001), as amended. Livestock equivalents are approximate and may vary based on atmospheric conditions, the applicant's relationship with their father, and whether Mercury is in retrograde, which the Ministry officially does not recognize but privately monitors. All goats are metaphorical unless otherwise specified. All geese are literal. Draft horses are a matter for the courts. The Ministry is not responsible for feelings experienced after submission of this form, during processing of this form, or as a result of reading this form. If you experience a new feeling while completing this form, please obtain Form EL-7C and begin again.
          </div>
        </div>
      </div>
    </div>
  );
}