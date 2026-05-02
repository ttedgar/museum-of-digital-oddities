import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [nameInput, setNameInput] = useState('');
  const [phase, setPhase] = useState('idle');
  const [analysisLog, setAnalysisLog] = useState([]);
  const [logIndex, setLogIndex] = useState(0);
  const [appliedFixes, setAppliedFixes] = useState([]);
  const [warpedName, setWarpedName] = useState('');
  const [pulsePhase, setPulsePhase] = useState(0);
  const [activeMeters, setActiveMeters] = useState({ L: 0.7, R: 0.65, M: 0.8, S: 0.4 });
  const [eqPoints, setEqPoints] = useState([0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
  const [fixIndex, setFixIndex] = useState(0);
  const [reverbEnv, setReverbEnv] = useState(null);
  const [showReverbPanel, setShowReverbPanel] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const eqCanvasRef = useRef(null);
  const waveCanvasRef = useRef(null);
  const logRef = useRef(null);
  const intervalRef = useRef(null);
  const meterIntervalRef = useRef(null);
  const pulseIntervalRef = useRef(null);

  const fixes = [
    { id: 'tonal', label: 'Tonal Correction', warning: 'MID-RANGE EXCESS DETECTED' },
    { id: 'phase', label: 'Phase Align', warning: 'PHASE CANCELLATION @ VOWEL 2' },
    { id: 'syllabic', label: 'Syllabic Rebalance', warning: 'LOAD-BEARING IMBALANCE' },
    { id: 'reverb', label: 'Reverb Chamber', warning: 'DRY SIGNAL — SPATIAL VOID' },
    { id: 'master', label: 'Emergency Mastering', warning: 'CLEARLY MASTERED IN A HURRY' },
  ];

  const reverbEnvironments = [
    { id: 'cathedral', label: 'Cathedral', desc: 'vast stone resonance, 4.2s decay' },
    { id: 'parking', label: 'Parking Garage', desc: 'concrete flutter echo, 1.8s decay' },
    { id: 'coat', label: 'Inside a Very Small Coat', desc: 'muffled wool absorption, 0.03s decay' },
  ];

  const vowelMap = { a: 'æh', e: 'ɛɪ', i: 'ɪh', o: 'ɔʊ', u: 'ʊɯ', y: 'ʏɨ' };
  const consonantMap = { r: 'ʀh', s: 'ʃɕ', t: 'ʈh', n: 'ɴ̈', m: 'mʍ', l: 'ɬʟ', k: 'kx', g: 'ɡʱ', d: 'ɖh', b: 'bβ', p: 'pɸ', f: 'fɸ', h: 'ħh', v: 'vβ', w: 'wʍ', c: 'kʃ', j: 'ʒh', x: 'xχ', z: 'zʐ', q: 'qʔ' };
  const unicodeVowels = { a: 'ɑ', e: 'ɘ', i: 'ɨ', o: 'ɵ', u: 'ʉ', A: 'Ɑ', E: 'Ɛ', I: 'Ɪ', O: 'Ɵ', U: 'Ʉ' };

  const getNameStats = (name) => {
    const lower = name.toLowerCase();
    const vowels = lower.match(/[aeiou]/g) || [];
    const consonants = lower.match(/[^aeiou\s]/g) || [];
    const syllables = Math.max(1, vowels.length);
    const charSum = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const firstChar = lower[0] || 'x';
    const lastChar = lower[lower.length - 1] || 'x';
    return { vowels, consonants, syllables, charSum, firstChar, lastChar, len: name.length };
  };

  const buildLog = (name) => {
    const s = getNameStats(name);
    const freq = 220 + (s.charSum % 880);
    const phase2 = s.vowels.length > 1 ? `near '${s.vowels[1].toUpperCase()}'` : 'at terminal consonant';
    const brightness = s.consonants.length > s.vowels.length ? 'OVER-BRIGHT' : 'UNDER-BRIGHT';
    const midDb = (s.charSum % 12) - 6;
    const sincerity = Math.max(0, 100 - s.len * 7).toFixed(1);
    const loadFactor = (s.syllables * 1.4).toFixed(2);
    return [
      `> INITIALIZING AUDIO ANALYSIS SUITE v3.1.4`,
      `> LOADING FILE: "${name.toUpperCase()}.wav"`,
      `> FILE SIZE: ${(s.len * 847 + 2048)} bytes`,
      `> SAMPLE RATE: ${freq * 2} Hz (non-standard)`,
      `> BIT DEPTH: 24-bit (emotional content: insufficient)`,
      `> ─────────────────────────────────────────`,
      `> [SCAN 1/7] TONAL SINCERITY CHECK...`,
      `> ... measuring harmonic authenticity`,
      `> ... cross-referencing against original intent`,
      `> RESULT: ${sincerity}% sincere — ${sincerity < 50 ? 'CRITICAL: name is mostly performance' : 'WARN: residual performance detected'}`,
      `> ─────────────────────────────────────────`,
      `> [SCAN 2/7] SYLLABIC LOAD-BEARING CAPACITY...`,
      `> ... stress distribution across ${s.syllables} syllable(s)`,
      `> ... structural integrity at phoneme junctions`,
      `> RESULT: load factor ${loadFactor} — ${parseFloat(loadFactor) > 2.5 ? 'WARN: name may buckle under repeated use' : 'INFO: load acceptable, minor fatigue expected'}`,
      `> ─────────────────────────────────────────`,
      `> [SCAN 3/7] RESONANCE AGAINST EMPTY ROOMS...`,
      `> ... simulating: empty hallway`,
      `> ... simulating: 3am kitchen`,
      `> ... simulating: room you grew up in`,
      `> RESULT: ${s.lastChar.match(/[aeiou]/) ? 'WARN: terminal vowel creates unresolved echo' : 'INFO: hard stop — name does not linger, which may be a mercy'}`,
      `> ─────────────────────────────────────────`,
      `> [SCAN 4/7] PHASE COHERENCE ANALYSIS...`,
      `> ... checking inter-phoneme phase alignment`,
      `> RESULT: PHASE CANCELLATION DETECTED ${phase2}`,
      `> ... this is why you sometimes feel unheard`,
      `> ─────────────────────────────────────────`,
      `> [SCAN 5/7] MID-RANGE FREQUENCY PROFILE...`,
      `> ... dominant frequency band: ${freq}Hz`,
      `> RESULT: ${brightness} by ${Math.abs(midDb)}dB in ${freq}-${freq + 400}Hz range`,
      `> ... the name crowds its own middle`,
      `> ─────────────────────────────────────────`,
      `> [SCAN 6/7] MASTERING QUALITY ASSESSMENT...`,
      `> ... checking limiter ceiling`,
      `> ... checking stereo width`,
      `> RESULT: CLEARLY MASTERED IN A HURRY`,
      `> ... transients uncontrolled, dynamics naive`,
      `> ... someone named you before they were ready`,
      `> ─────────────────────────────────────────`,
      `> [SCAN 7/7] CHECKING FOR PREVIOUS CORRECTIONS...`,
      `> RESULT: NO PRIOR CORRECTIONS FOUND`,
      `> ... the name has been mispronouncing itself since birth`,
      `> ─────────────────────────────────────────`,
      `> ANALYSIS COMPLETE. ${s.len * 3 + 14} issues found.`,
      `> RECOMMEND: apply corrections below`,
    ];
  };

  const applyPhonetic = (name) => {
    return name.toLowerCase().split('').map(c => {
      if (vowelMap[c]) return vowelMap[c];
      if (consonantMap[c]) return consonantMap[c];
      return c;
    }).join('');
  };

  const applyPhaseAlign = (name) => {
    return name.split('').map(c => unicodeVowels[c] || c).join('');
  };

  const applySyllabicRebalance = (name) => {
    const parts = name.split(/(?=[AEIOU])/i);
    if (parts.length <= 1) return name.split('').reverse().join('') + '-' + name[0];
    return parts.reverse().join('·');
  };

  const applyReverb = (name, env) => {
    if (env === 'cathedral') {
      const echo = name.toLowerCase().split('').filter(c => 'aeiou'.includes(c)).join('̈ ');
      return name + ' ' + echo + '̃  ' + name[0].toLowerCase() + '...';
    }
    if (env === 'parking') {
      return name + '-' + name.slice(-2) + '-' + name.slice(-1) + ' ' + name.slice(-3) + '...';
    }
    if (env === 'coat') {
      return name.split('').map(c => c.toLowerCase()).join('ʷ') + 'ʷ';
    }
    return name;
  };

  const applyEmergencyMaster = (name) => {
    const loud = name.toUpperCase();
    const compressed = loud.split('').map((c, i) => i % 2 === 0 ? c : c.toLowerCase()).join('');
    return '【' + compressed + '】';
  };

  useEffect(() => {
    if (nameInput.length > 0) {
      const s = getNameStats(nameInput);
      const seed = s.charSum;
      const points = Array.from({ length: 8 }, (_, i) => {
        const v = ((seed * (i + 1) * 1731) % 1000) / 1000;
        return 0.1 + v * 0.8;
      });
      setEqPoints(points);
    }
  }, [nameInput]);

  useEffect(() => {
    if (phase === 'analyzing') {
      const log = buildLog(nameInput);
      setAnalysisLog(log);
      setLogIndex(0);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'analyzing' && analysisLog.length > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setLogIndex(prev => {
          if (prev >= analysisLog.length - 1) {
            clearInterval(intervalRef.current);
            setTimeout(() => {
              setPhase('report');
              setWarpedName(nameInput);
            }, 400);
            return prev;
          }
          return prev + 1;
        });
      }, 90);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase, analysisLog]);

  useEffect(() => {
    if (phase === 'fixing' || phase === 'report') {
      if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
      meterIntervalRef.current = setInterval(() => {
        setActiveMeters({
          L: 0.3 + Math.random() * 0.65,
          R: 0.3 + Math.random() * 0.65,
          M: 0.2 + Math.random() * 0.75,
          S: 0.1 + Math.random() * 0.5,
        });
      }, 120);
    } else {
      clearInterval(meterIntervalRef.current);
    }
    return () => clearInterval(meterIntervalRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'mastered') {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
      pulseIntervalRef.current = setInterval(() => {
        setPulsePhase(prev => (prev + 0.015) % (Math.PI * 2));
      }, 30);
    }
    return () => clearInterval(pulseIntervalRef.current);
  }, [phase]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logIndex]);

  useEffect(() => {
    if (!eqCanvasRef.current) return;
    const canvas = eqCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#1a2a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const x = (i / 7) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let i = 0; i < 5; i++) {
      const y = (i / 4) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    eqPoints.forEach((pt, i) => {
      const x = (i / (eqPoints.length - 1)) * w;
      const y = h - pt * h;
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = ((i - 1) / (eqPoints.length - 1)) * w;
        const prevY = h - eqPoints[i - 1] * h;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,255,136,0.08)';
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [eqPoints, activeMeters]);

  useEffect(() => {
    if (!waveCanvasRef.current || phase !== 'mastered') return;
    const canvas = waveCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#1a2a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      const y = (i / 8) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, 'rgba(0,255,136,0.3)');
    gradient.addColorStop(0.5, '#00ff88');
    gradient.addColorStop(1, 'rgba(0,255,136,0.3)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;

    const s = getNameStats(nameInput);
    const f1 = 0.03 + (s.charSum % 100) * 0.0003;
    const f2 = 0.07 + (s.len % 10) * 0.002;
    const f3 = 0.015;

    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 2;
      const y1 = Math.sin(t * 3 + pulsePhase) * 0.3;
      const y2 = Math.sin(t * 7 + pulsePhase * 1.3 + f1 * 100) * 0.15;
      const y3 = Math.sin(t * 13 + pulsePhase * 0.7 + f2 * 100) * 0.08;
      const amp = Math.sin(t * f3 * 10 + pulsePhase * 0.5) * 0.1 + 0.9;
      const y = h / 2 + (y1 + y2 + y3) * amp * (h * 0.4);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [pulsePhase, phase]);

  const runAnalysis = () => {
    if (!nameInput.trim()) return;
    setPhase('analyzing');
    setAppliedFixes([]);
    setFixIndex(0);
    setReverbEnv(null);
    setShowReverbPanel(false);
  };

  const applyFix = (fixId) => {
    if (appliedFixes.includes(fixId)) return;
    if (fixId === 'reverb') {
      setShowReverbPanel(true);
      return;
    }
    let newName = warpedName;
    if (fixId === 'tonal') newName = applyPhonetic(warpedName);
    if (fixId === 'phase') newName = applyPhaseAlign(warpedName);
    if (fixId === 'syllabic') newName = applySyllabicRebalance(warpedName);
    if (fixId === 'master') newName = applyEmergencyMaster(warpedName);
    setWarpedName(newName);
    setAppliedFixes(prev => [...prev, fixId]);
    setFixIndex(prev => prev + 1);
    setPhase('fixing');
  };

  const applyReverbFix = (envId) => {
    const newName = applyReverb(warpedName, envId);
    setReverbEnv(envId);
    setWarpedName(newName);
    setAppliedFixes(prev => [...prev, 'reverb']);
    setFixIndex(prev => prev + 1);
    setShowReverbPanel(false);
    setPhase('fixing');
  };

  const commitMaster = () => {
    setPhase('mastered');
  };

  const handleWaveformClick = () => {
    if (phase !== 'mastered') return;
    setGlitching(true);
    setTimeout(() => setGlitching(false), 600);
  };

  const MeterBar = ({ value, label, color = '#00ff88' }) => {
    const segments = 12;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '2px' }}>
          {Array.from({ length: segments }, (_, i) => {
            const threshold = i / segments;
            const active = value > threshold;
            const isRed = threshold > 0.85;
            const isYellow = threshold > 0.65;
            const activeColor = isRed ? '#ff2244' : isYellow ? '#ffaa00' : color;
            return (
              <div key={i} style={{
                width: '14px',
                height: '5px',
                backgroundColor: active ? activeColor : '#1a2a1a',
                boxShadow: active ? `0 0 4px ${activeColor}` : 'none',
                transition: 'background-color 0.05s',
              }} />
            );
          })}
        </div>
        <span style={{ color: '#4a6fa5', fontSize: '9px', fontFamily: 'monospace' }}>{label}</span>
      </div>
    );
  };

  const allFixesApplied = fixes.every(f => appliedFixes.includes(f.id));

  const getFinalDescription = () => {
    const s = getNameStats(nameInput);
    return `This is "${warpedName}" — the version your name always wanted to be, before language got involved. It has been stripped of expectation, retuned to a frequency that exists outside the hearing range of people who knew you before. The phase is aligned. The syllables bear their weight evenly. In the reverb chamber, it finally sounds like what it was trying to say. This is not a name anymore. It is a sound that describes the space where a name used to be. Play it in an empty room. The room will know what to do.`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f14',
      color: '#00ff88',
      fontFamily: "'Courier New', Courier, monospace",
      padding: '0',
      overflowX: 'hidden',
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
        @keyframes glitch {
          0% { transform: translateX(0) skewX(0deg); filter: none; }
          10% { transform: translateX(-4px) skewX(-3deg); filter: hue-rotate(90deg); }
          20% { transform: translateX(4px) skewX(3deg); filter: hue-rotate(180deg); }
          30% { transform: translateX(-2px) skewX(-1deg); filter: none; }
          40% { transform: translateX(6px) skewX(4deg); filter: hue-rotate(270deg); }
          50% { transform: translateX(0) skewX(0deg); filter: none; }
          60% { transform: translateX(-6px) skewX(-4deg); filter: hue-rotate(90deg); }
          70% { transform: translateX(2px) skewX(1deg); filter: none; }
          80% { transform: translateX(-4px) skewX(-2deg); filter: hue-rotate(180deg); }
          90% { transform: translateX(4px) skewX(2deg); filter: none; }
          100% { transform: translateX(0) skewX(0deg); filter: none; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        pointerEvents: 'none', zIndex: 1000,
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{
          borderBottom: '1px solid #1a3a1a',
          paddingBottom: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <div style={{ color: '#4a6fa5', fontSize: '10px', letterSpacing: '4px', marginBottom: '4px' }}>
              NAMEFORM AUDIO ANALYSIS SUITE
            </div>
            <h1 style={{
              margin: 0, fontSize: '20px', fontWeight: 'normal', color: '#00ff88',
              textShadow: '0 0 20px rgba(0,255,136,0.4)',
            }}>
              THE NOISE YOUR NAME MAKES
            </h1>
            <div style={{ color: '#4a6fa5', fontSize: '11px', marginTop: '4px' }}>
              v3.1.4 — a frequency that has been mispronouncing itself since birth
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#2a4a2a' }}>
            <div>SESSION: {Date.now().toString(36).toUpperCase()}</div>
            <div>STATUS: {phase.toUpperCase()}</div>
            <div style={{ animation: 'blink 1s infinite' }}>● REC</div>
          </div>
        </div>

        {/* Input Track */}
        <div style={{
          border: '1px solid #1a3a1a',
          backgroundColor: '#0d0d12',
          marginBottom: '12px',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#4a6fa5', borderRadius: '50%' }} />
            <span style={{ color: '#4a6fa5', fontSize: '10px', letterSpacing: '3px' }}>TRACK 01 — SOURCE FILE</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#4a6fa5', fontSize: '9px', marginBottom: '6px', letterSpacing: '2px' }}>
                INPUT: NAME.WAV
              </div>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runAnalysis()}
                placeholder="enter name to analyze..."
                disabled={phase === 'analyzing'}
                style={{
                  width: '100%',
                  backgroundColor: '#0a0a0f',
                  border: '1px solid #1a3a1a',
                  color: '#00ff88',
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  padding: '10px 14px',
                  outline: 'none',
                  letterSpacing: '4px',
                  boxSizing: 'border-box',
                  textShadow: '0 0 10px rgba(0,255,136,0.3)',
                }}
              />
            </div>
            <button
              onClick={runAnalysis}
              disabled={!nameInput.trim() || phase === 'analyzing'}
              style={{
                backgroundColor: nameInput.trim() && phase !== 'analyzing' ? '#00ff88' : '#1a2a1a',
                color: nameInput.trim() && phase !== 'analyzing' ? '#0a0a0f' : '#2a4a2a',
                border: 'none',
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '10px 20px',
                cursor: nameInput.trim() && phase !== 'analyzing' ? 'pointer' : 'not-allowed',
                letterSpacing: '2px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              RUN ANALYSIS
            </button>
          </div>
        </div>

        {/* EQ Display */}
        {nameInput.length > 0 && (
          <div style={{
            border: '1px solid #1a3a1a',
            backgroundColor: '#0d0d12',
            marginBottom: '12px',
            padding: '16px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#00ff88', borderRadius: '50%' }} />
              <span style={{ color: '#4a6fa5', fontSize: '10px', letterSpacing: '3px' }}>TRACK 02 — EQ ANALYSIS / FREQUENCY PROFILE</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', fontSize: '9px', color: '#2a4a2a', marginBottom: '4px' }}>
              {['63Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz'].map(f => (
                <span key={f} style={{ flex: 1, textAlign: 'center' }}>{f}</span>
              ))}
            </div>
            <canvas ref={eqCanvasRef} width={840} height={80} style={{ width: '100%', height: '80px', display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#2a4a2a', marginTop: '4px' }}>
              <span>-24dB</span><span>0dB</span><span>+12dB</span>
            </div>
          </div>
        )}

        {/* Analysis Terminal */}
        {(phase === 'analyzing' || phase === 'report' || phase === 'fixing' || phase === 'mastered') && (
          <div style={{
            border: '1px solid #1a3a1a',
            backgroundColor: '#080810',
            marginBottom: '12px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{
              borderBottom: '1px solid #1a3a1a',
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#ffaa00', borderRadius: '50%', animation: phase === 'analyzing' ? 'blink 0.5s infinite' : 'none' }} />
                <span style={{ color: '#4a6fa5', fontSize: '10px', letterSpacing: '3px' }}>TRACK 03 — DIAGNOSTIC TERMINAL</span>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <MeterBar value={activeMeters.L} label="L" />
                <MeterBar value={activeMeters.R} label="R" />
                <MeterBar value={activeMeters.M} label="M" color="#ffaa00" />
                <MeterBar value={activeMeters.S} label="S" color="#4a6fa5" />
              </div>
            </div>
            <div
              ref={logRef}
              style={{
                padding: '16px',
                height: '260px',
                overflowY: 'auto',
                fontSize: '11px',
                lineHeight: '1.8',
              }}
            >
              {analysisLog.slice(0, logIndex + 1).map((line, i) => (
                <div key={i} style={{
                  color: line.startsWith('> RESULT:') ? '#ffaa00' :
                    line.startsWith('> [SCAN') ? '#00ff88' :
                      line.startsWith('> ───') ? '#1a3a1a' :
                        line.includes('CRITICAL') || line.includes('WARN') ? '#ffaa00' :
                          line.includes('COMPLETE') ? '#00ff88' :
                            '#3a6a3a',
                  animation: i === logIndex ? 'fadeIn 0.1s ease' : 'none',
                }}>
                  {line}
                  {i === logIndex && phase === 'analyzing' && (
                    <span style={{ animation: 'blink 0.7s infinite' }}>█</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fixes Panel */}
        {(phase === 'report' || phase === 'fixing') && (
          <div style={{
            border: '1px solid #1a3a1a',
            backgroundColor: '#0d0d12',
            marginBottom: '12px',
            animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{
              borderBottom: '1px solid #1a3a1a',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#ff2244', borderRadius: '50%' }} />
              <span style={{ color: '#4a6fa5', fontSize: '10px', letterSpacing: '3px' }}>TRACK 04 — CORRECTION SUITE</span>
            </div>

            {/* Current warped name display */}
            <div style={{ padding: '16px', borderBottom: '1px solid #1a2a1a' }}>
              <div style={{ color: '#4a6fa5', fontSize: '9px', marginBottom: '8px', letterSpacing: '2px' }}>CURRENT RENDER:</div>
              <div style={{
                fontSize: '28px',
                letterSpacing: '6px',
                color: '#00ff88',
                textShadow: '0 0 20px rgba(0,255,136,0.5)',
                minHeight: '40px',
                padding: '8px 0',
              }}>
                {warpedName || nameInput}
              </div>
              <div style={{ color: '#2a4a2a', fontSize: '9px', marginTop: '4px' }}>
                {appliedFixes.length === 0 ? 'UNPROCESSED — RAW SOURCE FILE' : `${appliedFixes.length} CORRECTION(S) APPLIED: ${appliedFixes.join(', ').toUpperCase()}`}
              </div>
            </div>

            {/* Fix buttons */}
            <div style={{ padding: '16px' }}>
              {fixes.map((fix, i) => {
                const applied = appliedFixes.includes(fix.id);
                const available = i <= fixIndex;
                return (
                  <div key={fix.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                    padding: '10px 12px',
                    border: `1px solid ${applied ? '#1a3a2a' : available ? '#2a2a1a' : '#0f0f14'}`,
                    backgroundColor: applied ? '#0a1a0a' : available ? '#0d0d0a' : '#0a0a0a',
                    opacity: available ? 1 : 0.3,
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      backgroundColor: applied ? '#00ff88' : available ? '#ffaa00' : '#2a2a2a',
                      boxShadow: applied ? '0 0 6px #00ff88' : 'none',
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: applied ? '#00ff88' : available ? '#ffaa00' : '#2a4a2a', letterSpacing: '2px' }}>
                        {fix.label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '9px', color: '#2a4a2a', marginTop: '2px' }}>
                        ISSUE: {fix.warning}
                      </div>
                    </div>
                    <button
                      onClick={() => available && !applied && applyFix(fix.id)}
                      disabled={!available || applied}
                      style={{
                        backgroundColor: applied ? '#0a2a0a' : available ? '#1a1a00' : 'transparent',
                        border: `1px solid ${applied ? '#00ff88' : available ? '#ffaa00' : '#1a2a1a'}`,
                        color: applied ? '#00ff88' : available ? '#ffaa00' : '#2a4a2a',
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        padding: '4px 12px',
                        cursor: available && !applied ? 'pointer' : 'not-allowed',
                        letterSpacing: '2px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {applied ? 'APPLIED ✓' : 'APPLY FIX'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Reverb sub-panel */}
            {showReverbPanel && (
              <div style={{
                margin: '0 16px 16px',
                border: '1px solid #ffaa00',
                backgroundColor: '#0a0a05',
                padding: '16px',
                animation: 'fadeIn 0.2s ease',
              }}>
                <div style={{ color: '#ffaa00', fontSize: '10px', letterSpacing: '3px', marginBottom: '12px' }}>
                  SELECT REVERB ENVIRONMENT:
                </div>
                {reverbEnvironments.map(env => (
                  <div key={env.id}
                    onClick={() => applyReverbFix(env.id)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #1a1a0a',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      backgroundColor: '#0d0d05',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#ffaa00'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a0a'}
                  >
                    <div style={{ color: '#ffaa00', fontSize: '11px', letterSpacing: '2px' }}>{env.label.toUpperCase()}</div>
                    <div style={{ color: '#4a4a1a', fontSize: '9px', marginTop: '3px' }}>{env.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Commit master button */}
            {allFixesApplied && (
              <div style={{ padding: '0 16px 16px', animation: 'fadeIn 0.4s ease' }}>
                <div style={{
                  border: '1px solid #ffaa00',
                  padding: '12px',
                  marginBottom: '12px',
                  backgroundColor: '#0d0a00',
                  fontSize: '10px',
                  color: '#ffaa00',
                  lineHeight: '1.7',
                }}>
                  ALL CORRECTIONS APPLIED. THE WAVEFORM HAS BEEN REALIGNED.<br />
                  PROCEED TO FINAL MASTER? THIS CANNOT BE UNDONE.<br />
                  <span style={{ color: '#4a4a1a' }}>NOTE: the original file will be archived but no longer accessible</span>
                </div>
                <button
                  onClick={commitMaster}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffaa00',
                    color: '#0a0a00',
                    border: 'none',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '14px',
                    cursor: 'pointer',
                    letterSpacing: '4px',
                  }}
                >
                  COMMIT MASTER
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mastered state */}
        {phase === 'mastered' && (
          <div style={{
            border: '1px solid #00ff88',
            backgroundColor: '#080810',
            marginBottom: '12px',
            animation: 'fadeIn 0.6s ease',
            boxShadow: '0 0 40px rgba(0,255,136,0.1)',
          }}>
            <div style={{
              borderBottom: '1px solid #1a3a1a',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#00ff88', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#00ff88', fontSize: '10px', letterSpacing: '3px' }}>MASTER OUTPUT — FINAL RENDER</span>
              <span style={{ color: '#2a4a2a', fontSize: '10px', marginLeft: 'auto' }}>CLICK WAVEFORM TO HEAR THE TRUTH</span>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Warped name display */}
              <div style={{
                textAlign: 'center',
                fontSize: '36px',
                letterSpacing: '8px',
                color: '#00ff88',
                textShadow: '0 0 30px rgba(0,255,136,0.6)',
                marginBottom: '24px',
                animation: glitching ? 'glitch 0.6s ease' : 'none',
                minHeight: '50px',
              }}>
                {warpedName}
              </div>

              {/* Waveform canvas */}
              <div
                onClick={handleWaveformClick}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <canvas
                  ref={waveCanvasRef}
                  width={840}
                  height={120}
                  style={{
                    width: '100%',
                    height: '120px',
                    display: 'block',
                    border: '1px solid #1a3a1a',
                    backgroundColor: '#050508',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'rgba(0,255,136,0.15)',
                  fontSize: '9px',
                  letterSpacing: '4px',
                  pointerEvents: 'none',
                }}>
                  ▶ PLAYING
                </div>
              </div>

              {/* Final description */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                border: '1px solid #1a3a1a',
                backgroundColor: '#0a0a10',
                fontSize: '11px',
                lineHeight: '2',
                color: '#3a6a3a',
              }}>
                <div style={{ color: '#4a6fa5', fontSize: '9px', letterSpacing: '3px', marginBottom: '10px' }}>
                  LINER NOTES:
                </div>
                {getFinalDescription()}
              </div>

              {/* Final meters */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '16px', justifyContent: 'center' }}>
                {['63', '125', '250', '500', '1k', '2k', '4k', '8k'].map((f, i) => (
                  <div key={f} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <div style={{
                      width: '22px',
                      backgroundColor: '#00ff88',
                      height: `${Math.max(4, eqPoints[i] * 60)}px`,
                      opacity: 0.6 + Math.sin(pulsePhase + i * 0.5) * 0.2,
                      boxShadow: '0 0 6px rgba(0,255,136,0.4)',
                      transition: 'height 0.3s ease',
                    }} />
                    <span style={{ color: '#2a4a2a', fontSize: '8px' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #1a2a1a',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9px',
          color: '#1a3a1a',
          letterSpacing: '2px',
        }}>
          <span>NAMEFORM AUDIO © ALL NAMES RESERVED</span>
          <span>THE WAVEFORM FILES A CORRECTION</span>
          <span>NO REFUNDS ON IDENTITY</span>
        </div>
      </div>
    </div>
  );
}