import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [customComplaint, setCustomComplaint] = useState('');
  const [submissionState, setSubmissionState] = useState('idle');
  const [responseText, setResponseText] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [totalComplaints, setTotalComplaints] = useState(3.7e14);
  const [typingDots, setTypingDots] = useState(0);
  const [hoveredComplaint, setHoveredComplaint] = useState(null);
  const typewriterRef = useRef(null);
  const dotsRef = useRef(null);

  const predefinedComplaints = [
    "The sun is an unreasonable distance away given my commute.",
    "I was not consulted during the formation of matter.",
    "The speed of light is clearly a vendor limitation, not a physical law.",
    "Entropy was implemented without adequate user testing.",
    "Dark matter constitutes 27% of the universe but zero percent of the provided documentation.",
    "The universe's expansion is causing my personal space to decrease in relative value.",
    "Death was not listed in the original terms and conditions I agreed to.",
  ];

  const comfortingBoilerplate = [
    "You are, statistically speaking, the most improbable arrangement of atoms to have ever filed a grievance, and we find that remarkable.",
    "Your continued existence in the face of overwhelming cosmic indifference is noted and, quietly, admired.",
    "Of all the configurations matter could have taken, it chose to become you, and it has not yet chosen to stop.",
    "The void acknowledges that you are here, that you have always been here in some form, and that this is, in the grand ledger, something.",
    "We cannot fix the universe, but we can confirm that your complaint was received by something that, in its own way, was listening.",
  ];

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.6; text-shadow: 0 0 8px rgba(100, 160, 255, 0.4); }
        50% { opacity: 1; text-shadow: 0 0 20px rgba(100, 160, 255, 0.9); }
      }
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes flicker {
        0%, 95%, 100% { opacity: 1; }
        96% { opacity: 0.8; }
        97% { opacity: 1; }
        98% { opacity: 0.7; }
      }
      @keyframes counter-tick {
        0% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
        100% { transform: translateY(0); }
      }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes blink-cursor {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalComplaints(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (submissionState === 'typing') {
      dotsRef.current = setInterval(() => {
        setTypingDots(d => (d + 1) % 4);
      }, 400);
    } else {
      if (dotsRef.current) clearInterval(dotsRef.current);
    }
    return () => { if (dotsRef.current) clearInterval(dotsRef.current); };
  }, [submissionState]);

  const generateTicket = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ticket = 'CGD-';
    for (let i = 0; i < 4; i++) ticket += chars[Math.floor(Math.random() * chars.length)];
    ticket += '-';
    for (let i = 0; i < 6; i++) ticket += chars[Math.floor(Math.random() * chars.length)];
    return ticket;
  };

  const buildResponse = (complaint, ticket) => {
    const boilerplate = comfortingBoilerplate[Math.floor(Math.random() * comfortingBoilerplate.length)];
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `COSMOS GRIEVANCE DIVISION
Office of Universal Affairs, Sector 0
───────────────────────────────────────

OFFICIAL RESPONSE — FORM LETTER 44-Ω

DATE: ${dateStr}
TICKET NO.: ${ticket}
STATUS: RECEIVED / UNDER REVIEW / UNRESOLVABLE
PRIORITY: LOW (all complaints are low priority)

RE: Your Grievance Against the Universe

───────────────────────────────────────

Dear Valued Constituent,

Thank you for contacting the Cosmos Grievance Division. We have received your formal objection:

    "${complaint}"

We want to acknowledge your concern and assure you that it has been logged in our system alongside 3.7 × 10¹⁴ other complaints filed this cycle, the majority of which originated from Earth, predominantly on Tuesdays.

After careful review by our team of physicists, philosophers, and one very tired intern, we regret to inform you that the universe is unable to accommodate your requested changes at this time. The fundamental constants, laws, and general disposition of existence were finalized approximately 13.8 billion years ago and are not subject to revision based on individual feedback, however valid.

We understand this is not the response you were hoping for.

PROJECTED RESOLUTION DATE: Heat Death +3 Business Days

Please note that standard resolution timelines may be affected by quantum uncertainty, the heat death of the universe, and our current staffing levels (1 intern, see above).

In the meantime, please accept this complimentary statement:

    "${boilerplate}"

We value your continued existence as a customer of the universe. Your complaint has been filed. Your complaint matters to us. We are sorry for the inconvenience.

Warm regards (2.7K above absolute zero),

THE UNIVERSE
Cosmos Grievance Division
"Expanding Since the Beginning. Sorry About That."

───────────────────────────────────────
TICKET ${ticket} | DO NOT REPLY TO THIS FORM LETTER
The universe does not have a reply-to address.`;
  };

  const handleSubmit = () => {
    const complaint = selectedComplaint !== null
      ? predefinedComplaints[selectedComplaint]
      : customComplaint.trim();
    if (!complaint) return;

    const ticket = generateTicket();
    setTicketNumber(ticket);
    setSubmissionState('submitting');
    setResponseText('');

    setTimeout(() => {
      setSubmissionState('typing');
      const fullResponse = buildResponse(complaint, ticket);

      let index = 0;
      typewriterRef.current = setInterval(() => {
        index++;
        setResponseText(fullResponse.slice(0, index));
        if (index >= fullResponse.length) {
          clearInterval(typewriterRef.current);
          setSubmissionState('responded');
        }
      }, 18);
    }, 2200);
  };

  const handleReset = () => {
    setSubmissionState('idle');
    setSelectedComplaint(null);
    setCustomComplaint('');
    setResponseText('');
    setTicketNumber('');
    if (typewriterRef.current) clearInterval(typewriterRef.current);
  };

  const formatComplaints = (num) => {
    if (num >= 1e14) {
      return (num / 1e14).toFixed(4) + ' × 10¹⁴';
    }
    return num.toLocaleString();
  };

  const isSubmittable = selectedComplaint !== null || customComplaint.trim().length > 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050a14',
      color: '#c8d8f0',
      fontFamily: '"Courier New", Courier, monospace',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Star field */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: `
          radial-gradient(1px 1px at 10% 15%, rgba(200,220,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 23% 67%, rgba(200,220,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 45% 23%, rgba(200,220,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 67% 45%, rgba(200,220,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 78% 89%, rgba(200,220,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 90% 12%, rgba(200,220,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 34% 91%, rgba(200,220,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 56% 78%, rgba(200,220,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 12% 45%, rgba(200,220,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 89% 56%, rgba(200,220,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 3% 78%, rgba(200,220,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 71% 34%, rgba(200,220,255,0.6) 0%, transparent 100%),
          radial-gradient(2px 2px at 50% 50%, rgba(200,220,255,0.2) 0%, transparent 100%)
        `,
      }} />

      {/* Scanline effect */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '780px',
        margin: '0 auto',
        padding: '40px 20px 80px',
      }}>

        {/* Header */}
        <div style={{
          borderBottom: '1px solid rgba(100,160,255,0.2)',
          paddingBottom: '24px',
          marginBottom: '32px',
          animation: 'flicker 8s infinite',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <div style={{
                fontSize: '10px',
                letterSpacing: '4px',
                color: 'rgba(100,160,255,0.5)',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                UNITED NATIONS OF OBSERVABLE MATTER
              </div>
              <div style={{
                fontSize: '26px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                color: '#e8f0ff',
                textShadow: '0 0 20px rgba(100,160,255,0.4)',
              }}>
                COSMOS GRIEVANCE DIVISION
              </div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(200,220,255,0.4)',
                marginTop: '4px',
                letterSpacing: '1px',
              }}>
                FORM 44-Ω · UNIVERSAL COMPLAINT PORTAL · EST. ~13.8 BYA
              </div>
            </div>
            <div style={{
              textAlign: 'right',
              fontSize: '10px',
              color: 'rgba(100,160,255,0.4)',
              lineHeight: '1.8',
            }}>
              <div>SECTOR: 0</div>
              <div>JURISDICTION: ALL OF IT</div>
              <div>APPEALS: N/A</div>
            </div>
          </div>
        </div>

        {/* Counter */}
        <div style={{
          background: 'rgba(5,15,30,0.8)',
          border: '1px solid rgba(100,160,255,0.15)',
          borderRadius: '4px',
          padding: '12px 18px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <div style={{ fontSize: '10px', color: 'rgba(200,220,255,0.4)', letterSpacing: '2px' }}>
            COMPLAINTS FILED TODAY AGAINST THE UNIVERSE:
          </div>
          <div style={{
            fontSize: '18px',
            color: '#f0b84a',
            fontWeight: 'bold',
            letterSpacing: '1px',
            animation: 'counter-tick 0.3s ease',
            textShadow: '0 0 10px rgba(240,184,74,0.4)',
          }}>
            {formatComplaints(totalComplaints)}
            <span style={{
              fontSize: '9px',
              color: 'rgba(240,184,74,0.5)',
              marginLeft: '8px',
              letterSpacing: '1px',
            }}>
              (mostly Earth, mostly Tuesdays)
            </span>
          </div>
        </div>

        {submissionState === 'idle' && (
          <div style={{ animation: 'fade-in 0.4s ease' }}>
            {/* Instructions */}
            <div style={{
              fontSize: '11px',
              color: 'rgba(200,220,255,0.35)',
              letterSpacing: '2px',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}>
              SELECT GRIEVANCE CATEGORY
            </div>

            {/* Predefined complaints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {predefinedComplaints.map((complaint, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedComplaint(selectedComplaint === i ? null : i)}
                  onMouseEnter={() => setHoveredComplaint(i)}
                  onMouseLeave={() => setHoveredComplaint(null)}
                  style={{
                    padding: '14px 16px',
                    border: selectedComplaint === i
                      ? '1px solid rgba(100,160,255,0.6)'
                      : hoveredComplaint === i
                      ? '1px solid rgba(100,160,255,0.3)'
                      : '1px solid rgba(100,160,255,0.1)',
                    borderRadius: '3px',
                    background: selectedComplaint === i
                      ? 'rgba(100,160,255,0.08)'
                      : hoveredComplaint === i
                      ? 'rgba(100,160,255,0.04)'
                      : 'rgba(5,15,30,0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                    boxShadow: selectedComplaint === i ? '0 0 12px rgba(100,160,255,0.1)' : 'none',
                  }}
                >
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    border: selectedComplaint === i
                      ? '2px solid rgba(100,160,255,0.8)'
                      : '2px solid rgba(100,160,255,0.25)',
                    flexShrink: 0,
                    marginTop: '1px',
                    background: selectedComplaint === i ? 'rgba(100,160,255,0.4)' : 'transparent',
                    boxShadow: selectedComplaint === i ? '0 0 6px rgba(100,160,255,0.5)' : 'none',
                    transition: 'all 0.15s ease',
                  }} />
                  <div style={{
                    fontSize: '13px',
                    color: selectedComplaint === i ? '#e8f0ff' : 'rgba(200,220,255,0.65)',
                    lineHeight: '1.5',
                    transition: 'color 0.15s ease',
                  }}>
                    {complaint}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(100,160,255,0.1)' }} />
              <div style={{ fontSize: '10px', color: 'rgba(200,220,255,0.25)', letterSpacing: '2px' }}>
                OR DESCRIBE CUSTOM GRIEVANCE
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(100,160,255,0.1)' }} />
            </div>

            {/* Custom textarea */}
            <textarea
              value={customComplaint}
              onChange={(e) => {
                setCustomComplaint(e.target.value);
                if (e.target.value.trim()) setSelectedComplaint(null);
              }}
              placeholder="Describe your specific objection to the universe in formal terms..."
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(5,15,30,0.8)',
                border: customComplaint.trim()
                  ? '1px solid rgba(100,160,255,0.4)'
                  : '1px solid rgba(100,160,255,0.12)',
                borderRadius: '3px',
                color: '#c8d8f0',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '13px',
                padding: '12px 14px',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                lineHeight: '1.6',
                transition: 'border-color 0.2s ease',
              }}
            />

            {/* Submit */}
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={handleSubmit}
                disabled={!isSubmittable}
                style={{
                  background: isSubmittable
                    ? 'rgba(100,160,255,0.12)'
                    : 'rgba(100,160,255,0.04)',
                  border: isSubmittable
                    ? '1px solid rgba(100,160,255,0.5)'
                    : '1px solid rgba(100,160,255,0.1)',
                  color: isSubmittable ? '#e8f0ff' : 'rgba(200,220,255,0.2)',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '12px',
                  letterSpacing: '3px',
                  padding: '12px 28px',
                  cursor: isSubmittable ? 'pointer' : 'not-allowed',
                  borderRadius: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  boxShadow: isSubmittable ? '0 0 16px rgba(100,160,255,0.1)' : 'none',
                }}
              >
                SUBMIT GRIEVANCE
              </button>
              <div style={{
                fontSize: '10px',
                color: 'rgba(200,220,255,0.2)',
                lineHeight: '1.5',
              }}>
                By submitting, you acknowledge that the universe<br />
                is under no obligation to respond, but will anyway.
              </div>
            </div>
          </div>
        )}

        {/* Submitting state */}
        {submissionState === 'submitting' && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            animation: 'fade-in 0.4s ease',
          }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: 'rgba(100,160,255,0.6)',
              marginBottom: '20px',
              animation: 'pulse-glow 1.5s infinite',
            }}>
              TRANSMITTING GRIEVANCE TO THE VOID
            </div>
            <div style={{
              fontSize: '10px',
              color: 'rgba(200,220,255,0.2)',
              letterSpacing: '2px',
              lineHeight: '2',
            }}>
              <div>ROUTING THROUGH DARK MATTER RELAY...</div>
              <div>BYPASSING SPEED OF LIGHT LIMITATION (TICKET FILED)...</div>
              <div>LOCATING UNIVERSE COMPLAINT DEPARTMENT...</div>
            </div>
            <div style={{
              marginTop: '28px',
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
            }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'rgba(100,160,255,0.4)',
                  animation: `pulse-glow ${0.8 + i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Typing state */}
        {(submissionState === 'typing' || submissionState === 'responded') && (
          <div style={{ animation: 'fade-in 0.5s ease' }}>
            {/* Status bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11px',
              }}>
                {submissionState === 'typing' ? (
                  <>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#4af',
                      animation: 'pulse-glow 1s infinite',
                    }} />
                    <span style={{
                      color: 'rgba(100,160,255,0.8)',
                      letterSpacing: '2px',
                      animation: 'pulse-glow 2s infinite',
                    }}>
                      THE VOID IS TYPING{'.'.repeat(typingDots)}
                      {' '.repeat(3 - typingDots)}
                    </span>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'rgba(100,240,160,0.7)',
                    }} />
                    <span style={{ color: 'rgba(100,240,160,0.7)', letterSpacing: '2px' }}>
                      RESPONSE RECEIVED
                    </span>
                  </>
                )}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#f0b84a',
                letterSpacing: '1px',
                textShadow: '0 0 8px rgba(240,184,74,0.3)',
              }}>
                TICKET: {ticketNumber}
              </div>
            </div>

            {/* Response letter */}
            <div style={{
              background: 'rgba(8,18,36,0.9)',
              border: '1px solid rgba(100,160,255,0.15)',
              borderRadius: '4px',
              padding: '28px 28px',
              position: 'relative',
              boxShadow: '0 0 40px rgba(100,160,255,0.05), inset 0 0 60px rgba(0,0,20,0.3)',
            }}>
              {/* Corner decorations */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                width: '12px',
                height: '12px',
                borderTop: '1px solid rgba(100,160,255,0.2)',
                borderLeft: '1px solid rgba(100,160,255,0.2)',
              }} />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '12px',
                height: '12px',
                borderTop: '1px solid rgba(100,160,255,0.2)',
                borderRight: '1px solid rgba(100,160,255,0.2)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                width: '12px',
                height: '12px',
                borderBottom: '1px solid rgba(100,160,255,0.2)',
                borderLeft: '1px solid rgba(100,160,255,0.2)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '12px',
                height: '12px',
                borderBottom: '1px solid rgba(100,160,255,0.2)',
                borderRight: '1px solid rgba(100,160,255,0.2)',
              }} />

              <pre style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '12px',
                lineHeight: '1.7',
                color: 'rgba(200,220,255,0.8)',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {responseText}
                {submissionState === 'typing' && (
                  <span style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '13px',
                    background: 'rgba(100,160,255,0.7)',
                    marginLeft: '1px',
                    verticalAlign: 'middle',
                    animation: 'blink-cursor 0.7s infinite',
                  }} />
                )}
              </pre>
            </div>

            {/* Actions */}
            {submissionState === 'responded' && (
              <div style={{
                marginTop: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                animation: 'fade-in 0.5s ease',
              }}>
                <button
                  onClick={handleReset}
                  style={{
                    background: 'rgba(100,160,255,0.06)',
                    border: '1px solid rgba(100,160,255,0.3)',
                    color: 'rgba(200,220,255,0.7)',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '11px',
                    letterSpacing: '3px',
                    padding: '10px 22px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(100,160,255,0.12)';
                    e.target.style.color = '#e8f0ff';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'rgba(100,160,255,0.06)';
                    e.target.style.color = 'rgba(200,220,255,0.7)';
                  }}
                >
                  FILE ANOTHER COMPLAINT
                </button>
                <div style={{
                  fontSize: '10px',
                  color: 'rgba(200,220,255,0.15)',
                  letterSpacing: '1px',
                  lineHeight: '1.6',
                }}>
                  The universe will continue to operate<br />
                  as normal pending resolution.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          borderTop: '1px solid rgba(100,160,255,0.08)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '9px',
          color: 'rgba(200,220,255,0.15)',
          letterSpacing: '1.5px',
          lineHeight: '1.8',
        }}>
          <div>
            <div>COSMOS GRIEVANCE DIVISION</div>
            <div>UNIVERSAL AFFAIRS PORTAL v∞.0.1</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>ALL COMPLAINTS LOGGED BUT UNRESOLVABLE</div>
            <div>JURISDICTION: OBSERVABLE UNIVERSE AND BEYOND</div>
          </div>
        </div>

      </div>
    </div>
  );
}