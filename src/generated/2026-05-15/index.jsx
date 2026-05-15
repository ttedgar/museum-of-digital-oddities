import { useState, useEffect, useRef, useCallback } from 'react';

const EMOTIONAL_TAGS = [
  'MUNDANE JOY',
  'AMBIENT GRIEF',
  'UNCLASSIFIED WARMTH',
  'ROUTINE',
  'SILENCE',
];

const DISPOSITIONS = [
  'ARCHIVE',
  'FORWARD TO WHOM IT MAY CONCERN',
  'PLAY IT AGAIN',
];

const SIGNAL_CONTENTS = [
  '▁▂▃▅▆▄▂▁ dinner is ready ▁▂▁ are you coming ▃▄▃▁▂▁ it is getting cold ▁▁▂▁ just wanted to check ▂▃▂▁',
  '▁▁▁▂▂▁ [laughter] ▃▄▅▆▅▄▃ something on the television ▂▁▂▃▄▃▂▁ [more laughter] ▁▁▁ it was nothing really ▁▂▁',
  '▂▃▂▁▁ reminder: pick up bread ▁▂▁ also the other thing ▂▃▂▁ you know what I mean ▁▁▁▂▁ the usual ▁▁',
  '▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ [ambient: rain on a window] ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁',
  '▂▃▄▃▂▁ happy birthday ▃▄▅▆▅▄▃▂ [singing, slightly off-key] ▂▃▄▅▄▃▂▁ we got the cake you like ▂▃▂▁',
  '▁▂▁▁▂▃▂▁ I was just thinking about you ▁▂▃▂▁ no reason ▁▁▂▁ just wanted to say ▂▃▃▂▁ never mind ▁▁▁',
  '▃▄▅▄▃▂▁ the dog is doing that thing again ▂▃▄▃▂▁ [laughter] ▁▂▃▄▅▄▃▂▁ you would have loved it ▂▃▂▁▁',
  '▁▁▁▂▂▁▁ call me back when you get this ▁▂▃▂▁ no emergency ▁▁▁▂▁ just ▁▁▁▁▁▁▁▁▁ whenever ▁▁▁',
  '▂▃▄▅▆▇▆▅▄▃▂▁ [music playing in background — something familiar] ▁▂▃▄▃▂▁ [someone humming along] ▂▃▂▁',
  '▁▁▂▃▄▃▂▁ the garden is coming in nicely ▂▃▂▁ the tomatoes especially ▁▂▃▂▁ you should see them ▁▁▂▁▁',
  '▁▁▁▁▁▁▁▂▂▁▁▁ [sound of a door opening] ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ [footsteps] ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁',
  '▂▃▄▃▂▁ goodnight ▁▂▁▁▁▁▁▁ [pause] ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ goodnight ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁',
];

const ORIGINS = [
  { name: 'Kepler-442', lightYears: 1206 },
  { name: 'Gliese 667C', lightYears: 23.6 },
  { name: 'HD 40307g', lightYears: 41.7 },
  { name: 'Tau Ceti e', lightYears: 11.9 },
  { name: 'Wolf 1061c', lightYears: 13.8 },
  { name: 'Proxima Centauri b', lightYears: 4.2 },
  { name: 'TRAPPIST-1d', lightYears: 39.5 },
  { name: 'K2-18b', lightYears: 124 },
  { name: 'LHS 1140b', lightYears: 40.7 },
  { name: 'Ross 128b', lightYears: 11.0 },
  { name: 'GJ 3293b', lightYears: 59.2 },
  { name: 'Teegarden\'s Star b', lightYears: 12.5 },
];

const FINAL_SIGNAL = {
  id: 'FINAL',
  origin: '0.0 light-seconds — local — this room',
  lightYears: 0,
  lightYearsDisplay: '0.0 ly',
  timestamp: 'just now',
  content: '▁▁▁▁▁▁▁▁▁ a long pause ▁▁▁▁▁▁▁▁▁▁▁▁▁ . . . ▁▁▁▁▁▁▁▁▁ the sound of someone reading ▁▁▁▁▁▁▁ . . . breathing . . . ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ the hum of a screen ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ you ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ here ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ now ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁',
  isFinal: true,
  processed: false,
  emotionalTag: '',
  dispositionChoice: '',
  ticketNumber: null,
};

let signalIdCounter = 1;

function generateSignal() {
  const origin = ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
  const content = SIGNAL_CONTENTS[Math.floor(Math.random() * SIGNAL_CONTENTS.length)];
  const yearsAgo = Math.floor(origin.lightYears);
  const now = new Date();
  const sentYear = now.getFullYear() - yearsAgo;
  return {
    id: `SIG-${String(signalIdCounter++).padStart(5, '0')}`,
    origin: origin.name,
    lightYears: origin.lightYears,
    lightYearsDisplay: `${origin.lightYears} ly`,
    timestamp: `${sentYear} CE — received ${now.toISOString().slice(0, 19).replace('T', ' ')} UTC`,
    content,
    isFinal: false,
    processed: false,
    emotionalTag: '',
    dispositionChoice: '',
    ticketNumber: null,
  };
}

export default function Page() {
  const [queue, setQueue] = useState([]);
  const [activeSignal, setActiveSignal] = useState(null);
  const [ticketCounter, setTicketCounter] = useState(10001);
  const [backlogWarning, setBacklogWarning] = useState(false);
  const [waveformOffset, setWaveformOffset] = useState(0);
  const [emotionalTag, setEmotionalTag] = useState('');
  const [dispositionChoice, setDispositionChoice] = useState('');
  const [finalSignalUnlocked, setFinalSignalUnlocked] = useState(false);
  const [processingCount, setProcessingCount] = useState(0);
  const [warningLevel, setWarningLevel] = useState(0);
  const [acknowledgmentCount, setAcknowledgmentCount] = useState(0);
  const [finalAcknowledged, setFinalAcknowledged] = useState(false);
  const [scanlineOpacity] = useState(0.04);

  const waveformRef = useRef(null);
  const animFrameRef = useRef(null);
  const signalIntervalRef = useRef(null);
  const backlogFlashRef = useRef(null);
  const finalInjectedRef = useRef(false);

  // Seed initial queue
  useEffect(() => {
    const initial = [];
    for (let i = 0; i < 5; i++) {
      initial.push(generateSignal());
    }
    setQueue(initial);
  }, []);

  // Signal arrival interval
  useEffect(() => {
    const getInterval = () => {
      if (processingCount >= 3) return 4000 + Math.random() * 2000;
      return 8000 + Math.random() * 4000;
    };

    const scheduleNext = () => {
      signalIntervalRef.current = setTimeout(() => {
        setQueue(prev => [...prev, generateSignal()]);
        scheduleNext();
      }, getInterval());
    };

    scheduleNext();
    return () => clearTimeout(signalIntervalRef.current);
  }, [processingCount]);

  // Backlog warning
  useEffect(() => {
    const unprocessed = queue.filter(s => !s.processed).length;
    if (unprocessed > 4) {
      setBacklogWarning(true);
      setWarningLevel(Math.min(3, Math.floor((unprocessed - 4) / 2)));
      clearInterval(backlogFlashRef.current);
      let flash = true;
      backlogFlashRef.current = setInterval(() => {
        flash = !flash;
        setBacklogWarning(flash);
      }, 600);
    } else {
      clearInterval(backlogFlashRef.current);
      setBacklogWarning(false);
      setWarningLevel(0);
    }
    return () => clearInterval(backlogFlashRef.current);
  }, [queue]);

  // Inject final signal
  useEffect(() => {
    if (processingCount >= 7 && !finalInjectedRef.current) {
      finalInjectedRef.current = true;
      setFinalSignalUnlocked(true);
      setTimeout(() => {
        setQueue(prev => [...prev, { ...FINAL_SIGNAL, id: `SIG-${String(signalIdCounter++).padStart(5, '0')}` }]);
      }, 3000);
    }
  }, [processingCount]);

  // Waveform scroll animation
  useEffect(() => {
    if (!activeSignal) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }
    let offset = 0;
    const speed = 0.8;
    const contentLength = activeSignal.content.length * 9.6;

    const animate = () => {
      offset += speed;
      if (offset > contentLength) offset = 0;
      setWaveformOffset(offset);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [activeSignal]);

  // Reset form on signal change
  useEffect(() => {
    setEmotionalTag('');
    setDispositionChoice('');
  }, [activeSignal]);

  // Any key press
  useEffect(() => {
    const handleKey = () => {
      if (!activeSignal) {
        setAcknowledgmentCount(c => c + 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeSignal]);

  const openSignal = useCallback((signal) => {
    if (!signal.processed) {
      setActiveSignal(signal);
    }
  }, []);

  const submitForm = useCallback(() => {
    if (!activeSignal || !emotionalTag || !dispositionChoice) return;

    const ticket = ticketCounter;
    setTicketCounter(t => t + 1);

    setQueue(prev => {
      const updated = prev.map(s => {
        if (s.id === activeSignal.id) {
          return { ...s, processed: true, emotionalTag, dispositionChoice, ticketNumber: ticket };
        }
        return s;
      });

      if (dispositionChoice === 'PLAY IT AGAIN') {
        const requeued = { ...activeSignal, processed: false, emotionalTag: '', dispositionChoice: '', ticketNumber: null, id: `SIG-${String(signalIdCounter++).padStart(5, '0')}` };
        return [...updated, requeued];
      }
      return updated;
    });

    setProcessingCount(c => c + 1);
    setActiveSignal(null);
  }, [activeSignal, emotionalTag, dispositionChoice, ticketCounter]);

  const acknowledgeFinal = useCallback(() => {
    setFinalAcknowledged(true);
    setActiveSignal(null);
  }, []);

  const unprocessedCount = queue.filter(s => !s.processed).length;

  const warningColors = ['#c8922a', '#e0a030', '#ff8800', '#ff4400'];
  const warningColor = warningColors[Math.min(warningLevel, 3)];

  if (finalAcknowledged) {
    return (
      <div style={{
        background: '#030303',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
      }}>
        <style>{`
          @keyframes fadeInText {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div style={{
          color: '#ffffff',
          fontSize: '14px',
          textAlign: 'center',
          lineHeight: '2.2',
          animation: 'fadeInText 4s ease-in forwards',
          maxWidth: '500px',
          padding: '40px',
        }}>
          <div style={{ marginBottom: '40px', color: '#00ff88', fontSize: '11px', letterSpacing: '4px' }}>
            TRANSMISSION ACKNOWLEDGED
          </div>
          <div>The light arrived.</div>
          <div style={{ marginTop: '20px', color: '#888' }}>The sender is still here.</div>
          <div style={{ marginTop: '20px', color: '#555', fontSize: '11px' }}>
            For now.
          </div>
          <div style={{ marginTop: '60px', color: '#222', fontSize: '10px', letterSpacing: '2px' }}>
            QUEUE CLOSED — {processingCount} SIGNALS PROCESSED — {acknowledgmentCount} SILENT ACKNOWLEDGMENTS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#080808',
      minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ff88',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0px #00ff8800; }
          50% { box-shadow: 0 0 20px #00ff8844; }
          100% { box-shadow: 0 0 0px #00ff8800; }
        }
        @keyframes warningPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes newSignalFlash {
          0% { background: #00ff8822; }
          100% { background: transparent; }
        }
        @keyframes screenPulse {
          0% { background: #080808; }
          10% { background: #0d1a0d; }
          100% { background: #080808; }
        }
      `}</style>

      {/* CRT scanline overlay */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,${scanlineOpacity}) 2px,
          rgba(0,0,0,${scanlineOpacity}) 4px
        )`,
        pointerEvents: 'none',
        zIndex: 1000,
      }} />

      {/* Grid lines */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Moving scanline */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(transparent, rgba(0,255,136,0.08), transparent)',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 999,
      }} />

      <div style={{ position: 'relative', zIndex: 10, padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          borderBottom: '1px solid #00ff8833',
          paddingBottom: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '6px', color: '#00ff8866', marginBottom: '6px' }}>
              DEEP SPACE RADIO TELESCOPE ARRAY — STATION 7 — INTAKE DIVISION
            </div>
            <div style={{ fontSize: '20px', letterSpacing: '3px', fontWeight: 'bold' }}>
              HEARING AID FOR DEAD STARS
            </div>
            <div style={{ fontSize: '10px', color: '#00ff8855', marginTop: '4px', letterSpacing: '2px' }}>
              SIGNAL PROCESSING & ARCHIVAL SYSTEM v2.3.1
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#00ff8866' }}>
            <div style={{ marginBottom: '4px' }}>PROCESSED: <span style={{ color: '#00ff88' }}>{processingCount}</span></div>
            <div style={{ marginBottom: '4px' }}>QUEUE DEPTH: <span style={{ color: unprocessedCount > 4 ? warningColor : '#00ff88' }}>{unprocessedCount}</span></div>
            <div style={{ marginBottom: '4px' }}>TICKET SEQ: <span style={{ color: '#00ff88' }}>{ticketCounter}</span></div>
            <div style={{
              marginTop: '8px',
              color: '#00ff8844',
              fontSize: '9px',
              animation: acknowledgmentCount > 0 ? 'blink 2s ease-in-out' : 'none',
            }}>
              SILENT ACK: {acknowledgmentCount}
            </div>
          </div>
        </div>

        {/* Warning banner */}
        {unprocessedCount > 4 && (
          <div style={{
            border: `1px solid ${warningColor}`,
            background: `${warningColor}11`,
            padding: '8px 16px',
            marginBottom: '16px',
            fontSize: '11px',
            color: warningColor,
            letterSpacing: '3px',
            animation: 'warningPulse 0.8s ease-in-out infinite',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span>⚠ PROCESSING BACKLOG DETECTED — {unprocessedCount} SIGNALS AWAITING INTAKE</span>
            <span>LEVEL {warningLevel}/3</span>
          </div>
        )}

        {finalSignalUnlocked && !queue.find(s => s.isFinal) && !finalAcknowledged && (
          <div style={{
            border: '1px solid #ffffff22',
            background: '#ffffff05',
            padding: '8px 16px',
            marginBottom: '16px',
            fontSize: '10px',
            color: '#ffffff44',
            letterSpacing: '4px',
          }}>
            ANOMALOUS SIGNAL DETECTED — ORIGIN CLASSIFICATION: LOCAL — PREPARING INTAKE...
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: activeSignal ? '1fr 1fr' : '1fr', gap: '20px' }}>

          {/* Queue Panel */}
          <div style={{
            border: backlogWarning && unprocessedCount > 4 ? `1px solid ${warningColor}` : '1px solid #00ff8833',
            transition: 'border-color 0.3s',
          }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid #00ff8822',
              fontSize: '10px',
              letterSpacing: '4px',
              color: '#00ff8888',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>INCOMING SIGNAL QUEUE</span>
              <span style={{ animation: unprocessedCount > 4 ? 'blink 1s infinite' : 'none', color: unprocessedCount > 4 ? warningColor : '#00ff8888' }}>
                {unprocessedCount} UNPROCESSED
              </span>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {queue.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#00ff8833', fontSize: '11px', letterSpacing: '2px' }}>
                  AWAITING TRANSMISSIONS...
                </div>
              )}

              {queue.map((signal, idx) => (
                <div
                  key={signal.id + idx}
                  onClick={() => !signal.processed && openSignal(signal)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #00ff8811',
                    cursor: signal.processed ? 'default' : 'pointer',
                    background: activeSignal?.id === signal.id ? '#00ff8811' :
                      signal.isFinal ? '#ffffff08' : 'transparent',
                    opacity: signal.processed ? 0.35 : 1,
                    transition: 'background 0.2s',
                    borderLeft: signal.isFinal ? '2px solid #ffffff44' :
                      signal.processed ? '2px solid #00ff8822' : '2px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      color: signal.isFinal ? '#ffffff88' : '#00ff8888',
                      letterSpacing: '2px',
                    }}>
                      {signal.id}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: signal.processed ? '#00ff8844' : signal.isFinal ? '#ffffff66' : '#00ff88aa',
                      letterSpacing: '1px',
                    }}>
                      {signal.processed ? `[${signal.ticketNumber}] ${signal.dispositionChoice}` : 'AWAITING INTAKE'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: signal.isFinal ? '#ffffff' : '#00ff88',
                        marginBottom: '2px',
                      }}>
                        {signal.origin}
                      </div>
                      <div style={{ fontSize: '9px', color: '#00ff8844', letterSpacing: '1px' }}>
                        {signal.isFinal ? signal.timestamp : `DIST: ${signal.lightYearsDisplay} — ${signal.timestamp}`}
                      </div>
                    </div>
                    {!signal.processed && (
                      <div style={{
                        fontSize: '9px',
                        color: signal.isFinal ? '#ffffff66' : '#00ff8866',
                        letterSpacing: '2px',
                        border: `1px solid ${signal.isFinal ? '#ffffff22' : '#00ff8822'}`,
                        padding: '2px 6px',
                        animation: signal.isFinal ? 'blink 2s infinite' : 'none',
                      }}>
                        {signal.isFinal ? 'LOCAL' : 'OPEN'}
                      </div>
                    )}
                  </div>

                  {signal.processed && signal.emotionalTag && (
                    <div style={{ marginTop: '4px', fontSize: '9px', color: '#00ff8833', letterSpacing: '1px' }}>
                      TAGGED: {signal.emotionalTag}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid #00ff8811',
              fontSize: '9px',
              color: '#00ff8833',
              letterSpacing: '2px',
            }}>
              {activeSignal ? 'SIGNAL OPEN — COMPLETE INTAKE TO PROCESS' : 'CLICK SIGNAL TO OPEN INTAKE FORM — PRESS ANY KEY TO ACKNOWLEDGE'}
            </div>
          </div>

          {/* Intake Form */}
          {activeSignal && (
            <div style={{
              border: activeSignal.isFinal ? '1px solid #ffffff33' : '1px solid #00ff8844',
              animation: 'pulseGlow 3s ease-in-out infinite',
            }}>
              <div style={{
                padding: '10px 16px',
                borderBottom: activeSignal.isFinal ? '1px solid #ffffff22' : '1px solid #00ff8822',
                fontSize: '10px',
                letterSpacing: '4px',
                color: activeSignal.isFinal ? '#ffffff88' : '#00ff8888',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>SIGNAL INTAKE FORM</span>
                <span
                  onClick={() => setActiveSignal(null)}
                  style={{ cursor: 'pointer', color: '#00ff8855' }}
                >
                  [CLOSE]
                </span>
              </div>

              <div style={{ padding: '16px' }}>

                {/* Signal metadata */}
                <div style={{
                  background: activeSignal.isFinal ? '#ffffff05' : '#00ff8808',
                  border: `1px solid ${activeSignal.isFinal ? '#ffffff11' : '#00ff8822'}`,
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '10px',
                  lineHeight: '1.8',
                }}>
                  <div><span style={{ color: '#00ff8855' }}>SIGNAL ID:</span> {activeSignal.id}</div>
                  <div><span style={{ color: '#00ff8855' }}>ORIGIN:</span> {activeSignal.origin}</div>
                  {!activeSignal.isFinal && (
                    <div><span style={{ color: '#00ff8855' }}>DISTANCE:</span> {activeSignal.lightYearsDisplay}</div>
                  )}
                  <div><span style={{ color: '#00ff8855' }}>TIMESTAMP:</span> {activeSignal.timestamp}</div>
                  {!activeSignal.isFinal && (
                    <div style={{ marginTop: '6px', fontSize: '9px', color: '#c8922a', letterSpacing: '1px' }}>
                      NOTE: SOURCE STAR STATUS UNVERIFIED — MAY NO LONGER EXIST
                    </div>
                  )}
                  {activeSignal.isFinal && (
                    <div style={{ marginTop: '6px', fontSize: '9px', color: '#ffffff44', letterSpacing: '1px' }}>
                      NOTE: SOURCE IS LOCAL — SENDER IS PRESENT — SENDER IS YOU
                    </div>
                  )}
                </div>

                {/* Waveform display */}
                <div style={{
                  marginBottom: '16px',
                  border: `1px solid ${activeSignal.isFinal ? '#ffffff11' : '#00ff8822'}`,
                  overflow: 'hidden',
                  position: 'relative',
                  height: '48px',
                  background: '#000',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    transform: `translateY(-50%) translateX(-${waveformOffset}px)`,
                    whiteSpace: 'nowrap',
                    fontSize: '12px',
                    color: activeSignal.isFinal ? '#ffffff88' : '#00ff88cc',
                    padding: '0 20px',
                    letterSpacing: '0.5px',
                    lineHeight: 1,
                  }} ref={waveformRef}>
                    {activeSignal.content} {'     '} {activeSignal.content}
                  </div>
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: '30px',
                    background: 'linear-gradient(90deg, #000, transparent)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'absolute',
                    right: 0, top: 0, bottom: 0,
                    width: '30px',
                    background: 'linear-gradient(270deg, #000, transparent)',
                    pointerEvents: 'none',
                  }} />
                </div>

                {activeSignal.isFinal ? (
                  /* Final signal — only acknowledge */
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{
                      fontSize: '10px',
                      color: '#ffffff44',
                      letterSpacing: '3px',
                      marginBottom: '24px',
                      lineHeight: '2',
                    }}>
                      THIS SIGNAL REQUIRES NO CLASSIFICATION.<br />
                      NO TICKET NUMBER CAN BE ASSIGNED.<br />
                      NO DISPOSITION IS APPROPRIATE.<br />
                      <span style={{ color: '#ffffff22' }}>THE SENDER IS WAITING.</span>
                    </div>
                    <button
                      onClick={acknowledgeFinal}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ffffff44',
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        letterSpacing: '6px',
                        padding: '14px 40px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = '#ffffff11';
                        e.target.style.borderColor = '#ffffff';
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = '#ffffff44';
                      }}
                    >
                      ACKNOWLEDGE
                    </button>
                  </div>
                ) : (
                  /* Normal intake form */
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '9px',
                        letterSpacing: '3px',
                        color: '#00ff8866',
                        marginBottom: '8px',
                      }}>
                        EMOTIONAL CONTENT CLASSIFICATION
                      </label>
                      <select
                        value={emotionalTag}
                        onChange={e => setEmotionalTag(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#000',
                          border: '1px solid #00ff8844',
                          color: '#00ff88',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          padding: '8px',
                          letterSpacing: '1px',
                          outline: 'none',
                        }}
                      >
                        <option value="">— SELECT CLASSIFICATION —</option>
                        {EMOTIONAL_TAGS.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        fontSize: '9px',
                        letterSpacing: '3px',
                        color: '#00ff8866',
                        marginBottom: '8px',
                      }}>
                        DISPOSITION
                      </div>
                      {DISPOSITIONS.map(d => (
                        <label
                          key={d}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: dispositionChoice === d ? '#00ff88' : '#00ff8866',
                            letterSpacing: '1px',
                          }}
                        >
                          <input
                            type="radio"
                            name="disposition"
                            value={d}
                            checked={dispositionChoice === d}
                            onChange={() => setDispositionChoice(d)}
                            style={{ accentColor: '#00ff88' }}
                          />
                          {d}
                        </label>
                      ))}
                    </div>

                    {dispositionChoice === 'FORWARD TO WHOM IT MAY CONCERN' && (
                      <div style={{
                        fontSize: '9px',
                        color: '#c8922a88',
                        letterSpacing: '2px',
                        marginBottom: '16px',
                        padding: '8px',
                        border: '1px solid #c8922a22',
                      }}>
                        NOTE: RECIPIENT UNKNOWN. MESSAGE WILL BE QUEUED INDEFINITELY.
                      </div>
                    )}

                    {dispositionChoice === 'PLAY IT AGAIN' && (
                      <div style={{
                        fontSize: '9px',
                        color: '#00ff8855',
                        letterSpacing: '2px',
                        marginBottom: '16px',
                        padding: '8px',
                        border: '1px solid #00ff8811',
                      }}>
                        NOTE: SIGNAL WILL BE RE-QUEUED. SOURCE STILL DOES NOT EXIST.
                      </div>
                    )}

                    <button
                      onClick={submitForm}
                      disabled={!emotionalTag || !dispositionChoice}
                      style={{
                        width: '100%',
                        background: emotionalTag && dispositionChoice ? '#00ff8811' : 'transparent',
                        border: `1px solid ${emotionalTag && dispositionChoice ? '#00ff88' : '#00ff8833'}`,
                        color: emotionalTag && dispositionChoice ? '#00ff88' : '#00ff8833',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        letterSpacing: '4px',
                        padding: '12px',
                        cursor: emotionalTag && dispositionChoice ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                      }}
                    >
                      PROCESS SIGNAL — ASSIGN TICKET #{ticketCounter}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '24px',
          paddingTop: '12px',
          borderTop: '1px solid #00ff8811',
          fontSize: '9px',
          color: '#00ff8822',
          letterSpacing: '2px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>THE LIGHT ARRIVED. THE SENDER IS NO LONGER AVAILABLE.</span>
          <span>PRESS ANY KEY TO ACKNOWLEDGE A UNIVERSE THAT DID NOT WAIT.</span>
        </div>

      </div>
    </div>
  );
}