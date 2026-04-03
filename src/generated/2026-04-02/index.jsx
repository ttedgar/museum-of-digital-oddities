import { useState, useEffect, useRef } from 'react';

const TASKS = [
  'Locating sadness origin...',
  'Scanning childhood for anomalies...',
  'Decompressing repressed memories...',
  'Defragmenting emotional core...',
  'Patching self-worth.dll...',
  'Compiling regret log (87,441 entries)...',
  'Removing duplicate expectations...',
  'Indexing unlived lives...',
  'Backing up personality fragments...',
  'Optimizing disappointment cache...',
  'Rebuilding trust architecture...',
  'Installing Acceptance v2.0...',
];

const ERRORS = [
  'FATAL: self-worth.dll is read-only',
  'ERROR 0x000FEEL: Childhood not found on this system',
  'EXCEPTION: Recursive hope stack overflow',
  'CRITICAL: Acceptance module requires administrator privileges',
  'WARNING: Too many regrets. Disk full.',
  'ERROR: Cannot patch what was never whole',
];

const winStyle = {
  fontFamily: '"MS Sans Serif", "Segoe UI", Tahoma, sans-serif',
  fontSize: '11px',
};

export default function Page() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [runCount, setRunCount] = useState(0);
  const [blinking, setBlinking] = useState(true);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const currentTask = TASKS[Math.min(taskIndex, TASKS.length - 1)];

  const startProcessing = () => {
    setTaskIndex(0);
    setProgress(0);
    setCompleted([]);
    setShowError(false);
  };

  useEffect(() => {
    const blinkTimer = setInterval(() => setBlinking(b => !b), 530);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    if (showError) return;

    const speed = 60 + Math.random() * 80;
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (0.3 + Math.random() * 0.9);

        // Trigger error near 95%
        if (next >= 95 && taskIndex >= TASKS.length - 1) {
          clearInterval(intervalRef.current);
          const err = ERRORS[Math.floor(Math.random() * ERRORS.length)];
          timeoutRef.current = setTimeout(() => {
            setErrorMsg(err);
            setShowError(true);
          }, 400);
          return 94.8;
        }

        // Advance task
        const taskThreshold = ((taskIndex + 1) / TASKS.length) * 94;
        if (next >= taskThreshold && taskIndex < TASKS.length - 1) {
          setCompleted(c => [...c, taskIndex]);
          setTaskIndex(t => t + 1);
        }

        return Math.min(next, 94.9);
      });
    }, speed);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [taskIndex, showError]);

  const handleErrorOk = () => {
    setRunCount(r => r + 1);
    startProcessing();
  };

  const progressDisplay = Math.floor(progress);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#008080',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '11px',
    }}>
      {/* Desktop icons scattered behind */}
      {['My Computer', 'Recycle Bin', 'My Heart', 'The Void'].map((label, i) => (
        <div key={label} style={{
          position: 'fixed',
          left: `${20 + i * 80}px`,
          top: `${20 + (i % 2) * 80}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: 'white',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontSize: '11px',
          fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
          userSelect: 'none',
          cursor: 'default',
          width: '64px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px' }}>
            {['💻', '🗑️', '💔', '⬛'][i]}
          </div>
          {label}
        </div>
      ))}

      {/* Main dialog */}
      <div style={{
        background: '#d4d0c8',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
        width: '420px',
        userSelect: 'none',
      }}>
        {/* Title bar */}
        <div style={{
          background: 'linear-gradient(90deg, #000080, #1084d0)',
          padding: '3px 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px' }}>⚙️</span>
            <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', ...winStyle }}>
              SadnessProcessor.exe
            </span>
          </div>
          <div style={{ display: 'flex', gap: '2px' }}>
            {['_', '□', '✕'].map(btn => (
              <div key={btn} style={{
                width: '16px', height: '14px',
                background: '#d4d0c8',
                border: '1px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', cursor: 'pointer', fontWeight: 'bold',
              }}>{btn}</div>
            ))}
          </div>
        </div>

        {/* Dialog body */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', flexShrink: 0 }}>😔</div>
            <div>
              <div style={{ ...winStyle, fontWeight: 'bold', marginBottom: '6px' }}>
                Processing your sadness...
              </div>
              <div style={{ ...winStyle, color: '#444', lineHeight: '1.5' }}>
                Windows is analyzing and optimizing your emotional state.
                This may take several lifetimes. Please wait.
              </div>
              {runCount > 0 && (
                <div style={{ ...winStyle, color: '#800000', marginTop: '4px' }}>
                  Attempt #{runCount + 1}
                </div>
              )}
            </div>
          </div>

          {/* Task list */}
          <div style={{
            background: 'white',
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            padding: '6px',
            height: '120px',
            overflowY: 'auto',
            marginBottom: '10px',
            ...winStyle,
          }}>
            {TASKS.map((task, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 0',
                color: i > taskIndex ? '#aaa' : '#000',
                background: i === taskIndex ? '#000080' : 'transparent',
              }}>
                <span style={{ color: i === taskIndex ? 'white' : (completed.includes(i) ? 'green' : '#aaa') }}>
                  {completed.includes(i) ? '✓' : (i === taskIndex ? (blinking ? '►' : ' ') : '○')}
                </span>
                <span style={{ color: i === taskIndex ? 'white' : undefined }}>
                  {task}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ ...winStyle, marginBottom: '4px', color: '#444' }}>
              {currentTask}
            </div>
            <div style={{
              background: 'white',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              height: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: `${progress}%`,
                background: 'repeating-linear-gradient(90deg, #000080 0px, #000080 12px, #1084d0 12px, #1084d0 24px)',
                transition: 'width 0.1s linear',
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                mixBlendMode: 'difference',
                color: 'white',
                ...winStyle,
              }}>
                {progressDisplay}%
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '12px' }}>
            {['Cancel', 'Help'].map(btn => (
              <button key={btn} onClick={() => {}} style={{
                ...winStyle,
                padding: '3px 12px',
                background: '#d4d0c8',
                border: '2px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                cursor: 'pointer',
                minWidth: '60px',
              }}>
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error dialog */}
      {showError && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{
            background: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            width: '340px',
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #800000, #c00000)',
              padding: '3px 4px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', ...winStyle }}>
                Critical Error
              </span>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '28px' }}>⛔</div>
                <div>
                  <div style={{ ...winStyle, fontWeight: 'bold', color: '#800000', marginBottom: '6px' }}>
                    {errorMsg}
                  </div>
                  <div style={{ ...winStyle, color: '#444', lineHeight: '1.5' }}>
                    Sadness processing has failed. Would you like to try again?
                    <br />
                    <span style={{ color: '#800000' }}>
                      Note: This has never worked.
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button onClick={handleErrorOk} style={{
                  ...winStyle,
                  padding: '4px 16px',
                  background: '#d4d0c8',
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}>
                  OK
                </button>
                <button onClick={handleErrorOk} style={{
                  ...winStyle,
                  padding: '4px 16px',
                  background: '#d4d0c8',
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  cursor: 'pointer',
                }}>
                  Ignore
                </button>
                <button onClick={handleErrorOk} style={{
                  ...winStyle,
                  padding: '4px 16px',
                  background: '#d4d0c8',
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  cursor: 'pointer',
                }}>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
