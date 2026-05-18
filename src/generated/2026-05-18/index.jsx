import { useState, useEffect, useRef } from 'react';

const ALERT_POOL = [
  {
    id: 'fog_001',
    type: 'DENSE FOG ADVISORY',
    severity: 'ADVISORY',
    region: 'STERNUM-DECISION CORRIDOR',
    headline: 'DENSE FOG ADVISORY IN EFFECT',
    body: 'A dense fog has developed in the region between your sternum and a decision you keep not making. Visibility near-zero. The National Atmospheric Feeling Service advises against attempting to see clearly until conditions improve. Conditions are not expected to improve.',
    consequence: 'calm_001',
  },
  {
    id: 'wind_001',
    type: 'WIND SHEAR WARNING',
    severity: 'WARNING',
    region: 'BILATERAL SHOULDER COMPLEX',
    headline: 'WIND SHEAR WARNING',
    body: 'Conflicting internal pressure systems are meeting near the shoulders. Rapid changes in wind direction and speed detected between what you want and what you think you should want. Do not attempt to relax the trapezius at this time.',
    consequence: 'stillness_001',
  },
  {
    id: 'anxiety_001',
    type: 'FLASH ANXIETY WATCH',
    severity: 'WATCH',
    region: 'UPPER CHEST AND ADJACENT THROAT',
    headline: 'FLASH ANXIETY WATCH',
    body: 'This is technically not a warning. The National Atmospheric Feeling Service wants you to be aware. Conditions are favorable for the rapid development of anxiety in the upper chest and adjacent throat region. You are probably fine. This is not a warning.',
    consequence: 'stillness_001',
  },
  {
    id: 'pressure_001',
    type: 'BAROMETRIC PRESSURE BULLETIN',
    severity: 'ADVISORY',
    region: 'PRE-SPEECH ZONE',
    headline: 'BAROMETRIC PRESSURE: FALLING',
    body: 'The barometric pressure of almost-saying-something continues to fall. A weather event shaped like a Tuesday insists it is not personal. Authorities are monitoring the situation. Authorities do not know what they are looking at.',
    consequence: 'fog_001',
  },
  {
    id: 'calm_001',
    type: 'HIGH PRESSURE SYSTEM — SUSPICIOUS',
    severity: 'SEVERE EVENT',
    region: 'FULL BODY JURISDICTION',
    headline: 'SUSPICIOUS CALM EVENT DETECTED',
    body: 'A high pressure system of sudden calm has developed and is being immediately reclassified as suspicious. This office has no record of calm of this nature occurring organically. Residents are advised to remain alert. The calm is watching you back.',
    consequence: 'comfort_001',
  },
  {
    id: 'comfort_001',
    type: 'SEVERE COMFORT EVENT',
    severity: 'SEVERE EVENT',
    region: 'CHEST AND LOWER ABDOMINAL BASIN',
    headline: 'SEVERE COMFORT EVENT — TAKE SHELTER',
    body: 'A SEVERE COMFORT EVENT is occurring in the chest and lower abdominal basin. This is being treated with the same urgency as distress. Residents should not become accustomed to conditions. This level of comfort is statistically anomalous and will be investigated.',
    consequence: 'anxiety_001',
  },
  {
    id: 'stillness_001',
    type: 'PROLONGED STILLNESS WARNING',
    severity: 'WARNING',
    region: 'MIND-BODY INTERFACE',
    headline: 'PROLONGED STILLNESS WARNING',
    body: 'An unusual period of stillness has been detected at the mind-body interface. Authorities cannot determine if this is rest or avoidance. The distinction has been forwarded to a subcommittee. The subcommittee has not met since 2019.',
    consequence: 'pressure_001',
  },
  {
    id: 'thermal_001',
    type: 'THERMAL INVERSION ADVISORY',
    severity: 'ADVISORY',
    region: 'MEMORY LAYER — UPPER ATMOSPHERE',
    headline: 'THERMAL INVERSION IN MEMORY LAYER',
    body: 'Warm memories are being trapped beneath a cold front of present circumstances. Normal dispersal of good feelings is not occurring. The layer will persist until conditions change. No timeline for conditions changing is available at this time.',
    consequence: 'fog_001',
  },
  {
    id: 'tuesday_001',
    type: 'UNNAMED WEATHER EVENT',
    severity: 'WATCH',
    region: 'GENERAL WEEK AREA',
    headline: 'UNNAMED WEATHER EVENT — SHAPED LIKE A TUESDAY',
    body: 'A weather event has developed that is shaped like a Tuesday. Meteorologists emphasize this is not personal. The event does not have feelings about you specifically. The event has been observed making eye contact. This may be coincidental.',
    consequence: 'calm_001',
  },
];

const SEVERITY_STYLES = {
  WATCH: { bg: '#8B6914', border: '#FFD700', label: '#FFD700', text: '#FFE' },
  ADVISORY: { bg: '#7A4F00', border: '#FF8C00', label: '#FF8C00', text: '#FFE8CC' },
  WARNING: { bg: '#6B0000', border: '#FF2200', label: '#FF4444', text: '#FFE0E0' },
  'SEVERE EVENT': { bg: '#1A001A', border: '#FF00FF', label: '#FF88FF', text: '#FFE0FF' },
};

const TICKER_BASE = 'SCHOOL CLOSURES: All institutions of self-knowledge closed until further notice. Buses will run on a modified route through your chest. *** The Department of Internal Affairs reminds residents that feelings are not weather but would like to clarify that weather is exactly like feelings. *** ROAD CONDITIONS: The road between knowing and saying remains impassable. Chains required on all routes through the larynx. *** All self-knowledge institutions: CLOSED. Modified bus route. Through your chest. *** Barometric pressure of almost-saying-something: FALLING. *** Tuesday insists: NOT PERSONAL. *** This has been a test of the Emergency Feeling Broadcast System. This was not a test. *** ';

export default function Page() {
  const [alerts, setAlerts] = useState([]);
  const [broadcastInterrupted, setBroadcastInterrupted] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [flashText, setFlashText] = useState('');
  const [alertQueue, setAlertQueue] = useState([]);
  const alertIdCounter = useRef(100);
  const acknowledgedRef = useRef(new Set());

  const getAlertById = (id) => ALERT_POOL.find(a => a.id === id);

  const makeUniqueAlert = (base) => {
    alertIdCounter.current += 1;
    return { ...base, uid: `${base.id}_${alertIdCounter.current}` };
  };

  useEffect(() => {
    const initial = [
      makeUniqueAlert(getAlertById('fog_001')),
      makeUniqueAlert(getAlertById('anxiety_001')),
      makeUniqueAlert(getAlertById('pressure_001')),
    ];
    setAlerts(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBroadcastInterrupted(true);
      setFlashText('[THAT SOUND]');
      setTimeout(() => {
        setBroadcastInterrupted(false);
        setFlashText('');
      }, 1800);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertQueue(prev => {
        if (prev.length === 0) return prev;
        const [next, ...rest] = prev;
        setAlerts(current => {
          if (current.length >= 4) return current;
          return [...current, makeUniqueAlert(next)];
        });
        return rest;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (uid, consequenceId) => {
    setAlerts(prev => prev.filter(a => a.uid !== uid));
    setTimeout(() => {
      const consequence = getAlertById(consequenceId);
      if (consequence) {
        setAlertQueue(prev => [...prev, consequence]);
      }
    }, 900);
  };

  const severityOrder = ['SEVERE EVENT', 'WARNING', 'ADVISORY', 'WATCH'];
  const sortedAlerts = [...alerts].sort((a, b) =>
    severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: '"Courier New", Courier, monospace',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-200%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes strobe {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0.6; }
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .ticker-inner {
          display: inline-block;
          white-space: nowrap;
          animation: tickerScroll 60s linear infinite;
          animation-play-state: ${tickerPaused ? 'paused' : 'running'};
        }
        .alert-card {
          animation: slideIn 0.4s ease-out forwards;
        }
        .blink-el {
          animation: blink 1.2s step-end infinite;
        }
      `}</style>

      {/* EAS diagonal stripe border wrapper */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'repeating-linear-gradient(45deg, #111 0px, #111 18px, #2a2a2a 18px, #2a2a2a 36px)',
        zIndex: 0,
      }} />

      {/* Inner content area */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        margin: '18px',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 36px)',
        border: '2px solid #333',
      }}>

        {/* Header bar */}
        <div style={{
          background: '#111',
          borderBottom: '3px solid #CC2200',
          padding: '0',
        }}>
          {/* Top identification stripe */}
          <div style={{
            background: '#CC2200',
            padding: '6px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: '11px', letterSpacing: '3px', fontWeight: 'bold' }}>
              ■ EMERGENCY ALERT SYSTEM ■
            </span>
            <span className="blink-el" style={{ color: '#fff', fontSize: '11px', letterSpacing: '2px' }}>
              ● LIVE BROADCAST
            </span>
          </div>

          {/* Title block */}
          <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ color: '#999', fontSize: '10px', letterSpacing: '4px', marginBottom: '4px' }}>
                NATIONAL ATMOSPHERIC FEELING SERVICE
              </div>
              <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', lineHeight: 1.1 }}>
                EMERGENCY BROADCAST
              </div>
              <div style={{ color: '#FF6644', fontSize: '13px', letterSpacing: '1px', marginTop: '3px' }}>
                YOUR NERVOUS SYSTEM — REGIONAL OUTLOOK
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#666', fontSize: '10px', letterSpacing: '2px' }}>BROADCAST AREA</div>
              <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>FULL BODY JURISDICTION</div>
              <div style={{ color: '#555', fontSize: '10px', marginTop: '4px' }}>ISSUED BY NAFS • REGION 7-INTERIOR</div>
            </div>
          </div>

          {/* Severity legend */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid #222',
            padding: '6px 20px',
            gap: '20px',
          }}>
            {Object.entries(SEVERITY_STYLES).map(([sev, style]) => (
              <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', background: style.border, flexShrink: 0 }} />
                <span style={{ color: '#666', fontSize: '9px', letterSpacing: '1px' }}>{sev}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main alerts area */}
        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Active alerts count */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}>
            <div style={{ color: '#555', fontSize: '10px', letterSpacing: '3px' }}>
              ACTIVE ALERTS: {alerts.length} | QUEUE: {alertQueue.length} PENDING
            </div>
            <div style={{ color: '#444', fontSize: '10px', letterSpacing: '2px' }}>
              ACKNOWLEDGE TO CONTINUE — CONSEQUENCES MAY VARY
            </div>
          </div>

          {sortedAlerts.length === 0 && (
            <div style={{
              border: '1px solid #222',
              padding: '30px',
              textAlign: 'center',
              background: '#0d0d0d',
            }}>
              <div style={{ color: '#333', fontSize: '13px', letterSpacing: '3px', marginBottom: '8px' }}>
                NO ACTIVE ALERTS
              </div>
              <div style={{ color: '#222', fontSize: '11px' }}>
                This office considers the absence of alerts to be itself an alert condition.
              </div>
              <div style={{ color: '#1a1a1a', fontSize: '10px', marginTop: '6px' }}>
                Monitoring continues.
              </div>
            </div>
          )}

          {sortedAlerts.map((alert) => {
            const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.WATCH;
            return (
              <div
                key={alert.uid}
                className="alert-card"
                style={{
                  background: style.bg,
                  border: `2px solid ${style.border}`,
                  padding: '0',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Alert header bar */}
                <div style={{
                  background: style.border,
                  padding: '5px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      color: '#000',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '1px 6px',
                    }}>
                      {alert.severity}
                    </span>
                    <span style={{ color: '#000', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {alert.type}
                    </span>
                  </div>
                  <span style={{ color: 'rgba(0,0,0,0.7)', fontSize: '9px', letterSpacing: '2px' }}>
                    NAFS • REGION 7
                  </span>
                </div>

                {/* Alert body */}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ color: '#666', fontSize: '9px', letterSpacing: '3px', marginBottom: '6px' }}>
                    AFFECTED AREA: {alert.region}
                  </div>
                  <div style={{ color: style.label, fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>
                    {alert.headline}
                  </div>
                  <div style={{ color: style.text, fontSize: '12px', lineHeight: '1.7', marginBottom: '14px', opacity: 0.9 }}>
                    {alert.body}
                  </div>

                  {/* Acknowledge button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#333', fontSize: '9px', letterSpacing: '1px' }}>
                      ACKNOWLEDGING THIS ALERT WILL GENERATE A SUBSEQUENT ALERT
                    </div>
                    <button
                      onClick={() => handleAcknowledge(alert.uid, alert.consequence)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${style.border}`,
                        color: style.label,
                        fontFamily: '"Courier New", Courier, monospace',
                        fontSize: '10px',
                        letterSpacing: '2px',
                        padding: '5px 14px',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = style.border; e.currentTarget.style.color = '#000'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = style.label; }}
                    >
                      ACKNOWLEDGE ▶
                    </button>
                  </div>
                </div>

                {/* Side accent stripe */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: `repeating-linear-gradient(180deg, ${style.border} 0px, ${style.border} 8px, transparent 8px, transparent 16px)`,
                }} />
              </div>
            );
          })}

          {/* Standing notice */}
          <div style={{
            marginTop: '8px',
            border: '1px solid #1a1a1a',
            padding: '10px 14px',
            background: '#0c0c0c',
          }}>
            <div style={{ color: '#333', fontSize: '9px', letterSpacing: '3px', marginBottom: '4px' }}>
              STANDING NOTICE — NATIONAL ATMOSPHERIC FEELING SERVICE
            </div>
            <div style={{ color: '#2a2a2a', fontSize: '11px', lineHeight: '1.6' }}>
              Residents are reminded that the Emergency Feeling Broadcast System is activated for both actual emergencies and for quiet Tuesday afternoons that feel exactly like emergencies. The Service makes no distinction. All conditions are monitored. All conditions are, in their own way, severe.
            </div>
          </div>
        </div>

        {/* Bottom ticker */}
        <div
          onClick={() => setTickerPaused(p => !p)}
          style={{
            background: '#111',
            borderTop: '3px solid #CC2200',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
          }}
          title={tickerPaused ? 'Click to resume' : 'Click to pause'}
        >
          {/* Ticker label */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            background: '#CC2200',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            zIndex: 2,
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
              {tickerPaused ? '⏸ PAUSED' : '▶ CLOSURES'}
            </span>
          </div>

          <div style={{ paddingLeft: '120px', paddingRight: '0', overflow: 'hidden' }}>
            <div className="ticker-inner" style={{
              padding: '10px 0',
              color: '#aaa',
              fontSize: '11px',
              letterSpacing: '1px',
            }}>
              {TICKER_BASE.repeat(3)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#0d0d0d',
          borderTop: '1px solid #1a1a1a',
          padding: '6px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: '#333', fontSize: '9px', letterSpacing: '2px' }}>
            THIS IS NOT A TEST — OR: THIS IS ONLY A TEST — THE DISTINCTION IS UNDER REVIEW
          </span>
          <span style={{ color: '#2a2a2a', fontSize: '9px', letterSpacing: '1px' }}>
            NAFS REGION 7-INTERIOR • FULL BODY JURISDICTION
          </span>
        </div>
      </div>

      {/* EAS Interrupt flash overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.96)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: broadcastInterrupted ? 1 : 0,
        transition: broadcastInterrupted ? 'opacity 0.05s ease-in' : 'opacity 0.6s ease-out',
      }}>
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#000',
          letterSpacing: '4px',
          animation: broadcastInterrupted ? 'strobe 0.3s ease-in-out infinite' : 'none',
          textAlign: 'center',
        }}>
          {flashText}
        </div>
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '11px',
          color: '#555',
          letterSpacing: '4px',
          marginTop: '16px',
          textAlign: 'center',
        }}>
          EMERGENCY ALERT TONE — NATIONAL ATMOSPHERIC FEELING SERVICE
        </div>
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '9px',
          color: '#aaa',
          letterSpacing: '2px',
          marginTop: '8px',
          textAlign: 'center',
        }}>
          DO NOT ADJUST YOUR NERVOUS SYSTEM
        </div>
      </div>
    </div>
  );
}