import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const items = [
    { name: 'Architect You, Age 34', price: 7, coilId: 'A1' },
    { name: 'The Version That Stayed', price: 7, coilId: 'A2' },
    { name: 'Child You Would Have Named Morrow', price: 7, coilId: 'B1' },
    { name: 'The Tuesday Where You Said Yes', price: 7, coilId: 'B2' },
    { name: 'The Apology You Meant', price: 7, coilId: 'C1' },
    { name: 'Fluency in the Language of Your Grandmother', price: 7, coilId: 'C2' },
    { name: 'The Dog That Lived Longer', price: 7, coilId: 'D1' },
    { name: 'Version 2.0 (Kinder)', price: 7, coilId: 'D2' },
  ];

  const [selectedItem, setSelectedItem] = useState(null);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptText, setReceiptText] = useState('');
  const [coilRotation, setCoilRotation] = useState(0);
  const [machineFlicker, setMachineFlicker] = useState(false);
  const [unexpectedItem, setUnexpectedItem] = useState(false);
  const [unexpectedItemOpen, setUnexpectedItemOpen] = useState(false);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [nerveBalance, setNerveBalance] = useState(7);
  const [purchaseAttempted, setPurchaseAttempted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [animatingCoil, setAnimatingCoil] = useState(false);
  const [thisOneReveal, setThisOneReveal] = useState('');
  const [trayItemDropped, setTrayItemDropped] = useState(false);
  const [machineMessage, setMachineMessage] = useState('READY. INSERT NERVE.');

  const idleRef = useRef(0);
  const rafRef = useRef(null);
  const idleIntervalRef = useRef(null);
  const flickerTimeoutRef = useRef(null);

  const resetIdle = useCallback(() => {
    idleRef.current = 0;
    setIdleSeconds(0);
  }, []);

  const generateThisOneText = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const date = now.getDate();
    const suffix = date === 1 ? 'st' : date === 2 ? 'nd' : date === 3 ? 'rd' : 'th';

    const timeOfDay =
      hour < 5 ? 'the very small hours' :
      hour < 9 ? 'early morning' :
      hour < 12 ? 'mid-morning' :
      hour < 14 ? 'around noon' :
      hour < 17 ? 'the afternoon' :
      hour < 20 ? 'early evening' :
      hour < 23 ? 'the evening' : 'late at night';

    const season =
      [11, 0, 1].includes(now.getMonth()) ? 'winter' :
      [2, 3, 4].includes(now.getMonth()) ? 'spring' :
      [5, 6, 7].includes(now.getMonth()) ? 'summer' : 'autumn';

    const lightDesc =
      hour < 6 ? 'a darkness that has been dark for hours' :
      hour < 9 ? 'the particular slant of early light that never quite lasts' :
      hour < 17 ? 'the ambient hum of daylight doing its job' :
      hour < 20 ? 'a sky in the middle of deciding something' :
      'the specific dark that belongs to screens and lamps';

    return `It is ${timeOfDay} on ${day}, ${month} ${date}${suffix}. The time is ${hour}:${minutes}. Outside, or wherever you are not looking, there is ${lightDesc}. It is ${season}. You are sitting — or standing — or something in between. You are reading this. Your eyes are moving across these words right now, in this specific arrangement of ${season} and ${timeOfDay} that has never happened before and is happening exactly once. You are breathing. You forgot you were breathing. Now you remember. This moment was not purchased by a previous self. It was not lost. It arrived slightly damp and imprecise, like all real things. It is yours. It has always been yours. Receipt not required.`;
  };

  useEffect(() => {
    idleIntervalRef.current = setInterval(() => {
      idleRef.current += 1;
      setIdleSeconds(idleRef.current);
    }, 1000);
    return () => {
      clearInterval(idleIntervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (flickerTimeoutRef.current) clearTimeout(flickerTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (idleRef.current >= 18 && !unexpectedItem && !machineFlicker) {
      setMachineFlicker(true);
      setMachineMessage('...hm...');
      flickerTimeoutRef.current = setTimeout(() => {
        setMachineFlicker(false);
        setUnexpectedItem(true);
        setTrayItemDropped(true);
        setMachineMessage('DISPENSING UNCLAIMED ITEM. NO NERVE REQUIRED.');
      }, 2000);
    }
  }, [idleSeconds, unexpectedItem, machineFlicker]);

  const animateCoil = useCallback((onComplete) => {
    const start = performance.now();
    const duration = 2200;
    const targetRotation = 270;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress < 0.8
        ? progress / 0.8
        : 1 - (progress - 0.8) / 0.2 * 0.05;
      setCoilRotation(eased * targetRotation);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCoilRotation(targetRotation * 0.95);
        onComplete();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleItemClick = (index) => {
    if (animatingCoil || purchaseAttempted) return;
    resetIdle();
    setSelectedItem(index);
    setAnimatingCoil(true);
    setMachineMessage('PROCESSING...');
    setReceiptVisible(false);

    animateCoil(() => {
      setPurchaseAttempted(true);
      setNerveBalance(0);
      setAnimatingCoil(false);

      const apologies = [
        'We regret the inconvenience.',
        'Thank you for your NERVE.',
        'This unit apologizes.',
        'Please try again. (Do not try again.)',
        'Have a regulated day.',
      ];
      const apology = apologies[Math.floor(Math.random() * apologies.length)];

      setReceiptText(
        `VENDING MACHINE RECEIPT\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `ITEM: ${items[index].name}\n` +
        `COST: ${items[index].price} NERVE\n` +
        `STATUS: UNAVAILABLE\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Item Unavailable.\n` +
        `Purchased By Previous Self.\n` +
        `See Claim Form K-9.\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${apology}\n` +
        `NERVE BALANCE: 0`
      );
      setReceiptVisible(true);
      setMachineMessage('ITEM UNAVAILABLE. SEE FORM K-9.');
    });
  };

  const handleThisOneClick = () => {
    resetIdle();
    if (!unexpectedItemOpen) {
      setUnexpectedItemOpen(true);
      setThisOneReveal(generateThisOneText());
      setMachineMessage('...');
    }
  };

  const colors = {
    bg: '#0a0b12',
    machineBody: '#1a1c26',
    machineDark: '#111318',
    chrome: '#2a2d3a',
    chromeBright: '#3d4155',
    amber: '#e8a030',
    amberDim: '#7a5010',
    paleGreen: '#a8c890',
    paleGreenDim: '#3a5030',
    glass: 'rgba(180, 210, 255, 0.04)',
    glassEdge: 'rgba(180, 210, 255, 0.12)',
    itemColors: ['#f0d8b8', '#c8d8f0', '#d8f0c8', '#f0c8d8', '#e8d8f0', '#f0e8c8', '#c8f0e8', '#f0c8c8'],
  };

  const CoilSVG = ({ index, rotation }) => {
    const isSelected = selectedItem === index;
    const color = colors.itemColors[index % colors.itemColors.length];
    const r = isSelected ? rotation : 0;

    return (
      <svg width="60" height="50" viewBox="0 0 60 50" style={{ display: 'block', margin: '0 auto' }}>
        <g transform={`rotate(${r}, 30, 25)`}>
          {[0, 1, 2, 3, 4].map(i => (
            <ellipse
              key={i}
              cx={30}
              cy={25}
              rx={22 - i * 3}
              ry={8 - i}
              fill="none"
              stroke={colors.chromeBright}
              strokeWidth="1.5"
              opacity={0.7 - i * 0.1}
            />
          ))}
        </g>
        <rect
          x={isSelected ? 30 - (r / 270) * 8 : 30}
          y={18}
          width={16}
          height={12}
          rx={2}
          fill={color}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.5"
          style={{ transition: 'none' }}
        />
        <rect x={30} y={20} width={16} height={1.5} fill="rgba(0,0,0,0.15)" rx={0.5} />
        <rect x={30} y={23} width={16} height={1} fill="rgba(0,0,0,0.1)" rx={0.5} />
      </svg>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px 16px 40px',
      fontFamily: '"Courier New", Courier, monospace',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes flicker {
          0% { opacity: 1; }
          8% { opacity: 0.3; }
          10% { opacity: 1; }
          20% { opacity: 0.6; }
          22% { opacity: 1; }
          40% { opacity: 0.2; }
          42% { opacity: 1; }
          60% { opacity: 0.8; }
          62% { opacity: 0.1; }
          64% { opacity: 1; }
          80% { opacity: 0.7; }
          82% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes receiptPrint {
          from { max-height: 0; opacity: 0; }
          to { max-height: 400px; opacity: 1; }
        }
        @keyframes trayDrop {
          0% { transform: translateY(-20px); opacity: 0; }
          60% { transform: translateY(4px); opacity: 1; }
          80% { transform: translateY(-2px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes packagePulse {
          0% { box-shadow: 0 0 8px rgba(168, 200, 144, 0.4); }
          50% { box-shadow: 0 0 20px rgba(168, 200, 144, 0.9), 0 0 40px rgba(168, 200, 144, 0.3); }
          100% { box-shadow: 0 0 8px rgba(168, 200, 144, 0.4); }
        }
        @keyframes revealExpand {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes hum {
          0% { transform: translateX(0); }
          25% { transform: translateX(0.5px); }
          75% { transform: translateX(-0.5px); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Ambient floor glow */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '200px',
        background: 'radial-gradient(ellipse at center bottom, rgba(232, 160, 48, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Scanline effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 100,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      {/* Title above machine */}
      <div style={{
        color: colors.amber,
        fontSize: '11px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '12px',
        opacity: 0.6,
      }}>
        Vending Machine for Lost Futures
      </div>

      {/* THE MACHINE */}
      <div style={{
        width: '380px',
        maxWidth: '100%',
        background: `linear-gradient(160deg, ${colors.machineDark} 0%, ${colors.machineBody} 40%, ${colors.machineDark} 100%)`,
        border: `2px solid ${colors.chrome}`,
        borderRadius: '12px 12px 6px 6px',
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.04),
          0 4px 40px rgba(0,0,0,0.8),
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 0 60px rgba(232, 160, 48, 0.06)
        `,
        position: 'relative',
        animation: machineFlicker ? 'flicker 1.5s ease-in-out' : 'hum 3s ease-in-out infinite',
      }}>

        {/* Machine top header */}
        <div style={{
          background: `linear-gradient(180deg, ${colors.chrome} 0%, ${colors.machineDark} 100%)`,
          borderRadius: '10px 10px 0 0',
          padding: '12px 16px 10px',
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ color: colors.amber, fontSize: '13px', letterSpacing: '2px', fontWeight: 'bold' }}>
            FUTUREMART™
          </div>
          <div style={{
            fontSize: '9px',
            color: colors.paleGreen,
            letterSpacing: '1px',
            background: 'rgba(168, 200, 144, 0.08)',
            border: `1px solid ${colors.paleGreenDim}`,
            padding: '2px 6px',
            borderRadius: '2px',
          }}>
            MODEL K-9
          </div>
          <div style={{ color: colors.amberDim, fontSize: '10px', letterSpacing: '1px' }}>
            SER. 0001
          </div>
        </div>

        {/* Status display */}
        <div style={{
          margin: '8px 12px',
          background: '#080c08',
          border: `1px solid ${colors.paleGreenDim}`,
          borderRadius: '3px',
          padding: '6px 10px',
          boxShadow: `inset 0 0 8px rgba(168, 200, 144, 0.05), 0 0 8px rgba(168, 200, 144, 0.1)`,
        }}>
          <div style={{
            color: colors.paleGreen,
            fontSize: '11px',
            letterSpacing: '2px',
            textShadow: `0 0 8px ${colors.paleGreen}`,
          }}>
            {machineMessage}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
            <div style={{ color: colors.amberDim, fontSize: '9px', letterSpacing: '1px' }}>
              NERVE BALANCE: <span style={{ color: nerveBalance > 0 ? colors.amber : '#666' }}>{nerveBalance}</span>
            </div>
            <div style={{ color: colors.paleGreenDim, fontSize: '9px', letterSpacing: '1px' }}>
              {purchaseAttempted ? 'FORM K-9 REQUIRED' : 'SELECT ITEM'}
            </div>
          </div>
        </div>

        {/* Glass display panel */}
        <div style={{
          margin: '4px 10px',
          background: 'rgba(10, 14, 30, 0.9)',
          border: `1px solid ${colors.glassEdge}`,
          borderRadius: '6px',
          padding: '8px',
          position: 'relative',
          boxShadow: `
            inset 0 0 30px rgba(100, 140, 200, 0.04),
            inset 0 0 2px rgba(180, 210, 255, 0.08)
          `,
          overflow: 'hidden',
        }}>
          {/* Glass reflection */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            width: '30%',
            height: '100%',
            background: 'linear-gradient(105deg, rgba(255,255,255,0.02) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: '6px',
          }} />

          {/* Item grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
          }}>
            {items.map((item, index) => {
              const isHovered = hoveredItem === index;
              const isSelected = selectedItem === index;
              const itemColor = colors.itemColors[index % colors.itemColors.length];

              return (
                <div
                  key={index}
                  onClick={() => !purchaseAttempted && !animatingCoil && handleItemClick(index)}
                  onMouseEnter={() => { setHoveredItem(index); resetIdle(); }}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    background: isSelected
                      ? `rgba(232, 160, 48, 0.08)`
                      : isHovered
                      ? `rgba(180, 210, 255, 0.06)`
                      : `rgba(255,255,255,0.02)`,
                    border: isSelected
                      ? `1px solid rgba(232, 160, 48, 0.4)`
                      : isHovered
                      ? `1px solid rgba(180, 210, 255, 0.2)`
                      : `1px solid rgba(255,255,255,0.05)`,
                    borderRadius: '4px',
                    padding: '8px 6px 6px',
                    cursor: purchaseAttempted || animatingCoil ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  {/* Slot label */}
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: '5px',
                    fontSize: '8px',
                    color: isHovered ? colors.amber : colors.amberDim,
                    letterSpacing: '1px',
                  }}>
                    {item.coilId}
                  </div>

                  {/* Coil */}
                  <div style={{ marginTop: '4px' }}>
                    <CoilSVG index={index} rotation={isSelected ? coilRotation : 0} />
                  </div>

                  {/* Item name */}
                  <div style={{
                    fontSize: '8px',
                    color: isHovered ? '#e8e0d8' : '#888',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    marginTop: '4px',
                    minHeight: '22px',
                    fontStyle: 'italic',
                    transition: 'color 0.2s',
                  }}>
                    {item.name}
                  </div>

                  {/* Price */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: '3px',
                    fontSize: '9px',
                    color: isHovered ? colors.amber : colors.amberDim,
                    letterSpacing: '1px',
                  }}>
                    {item.price} NERVE
                  </div>

                  {/* Sold indicator */}
                  {purchaseAttempted && isSelected && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                    }}>
                      <div style={{
                        fontSize: '8px',
                        color: '#666',
                        letterSpacing: '1px',
                        transform: 'rotate(-15deg)',
                        border: '1px solid #444',
                        padding: '2px 5px',
                      }}>
                        PREV. SOLD
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection keypad */}
        <div style={{
          margin: '6px 10px',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}>
          <div style={{
            background: colors.machineDark,
            border: `1px solid ${colors.chrome}`,
            borderRadius: '4px',
            padding: '4px 8px',
            flex: 1,
            display: 'flex',
            gap: '4px',
          }}>
            {['A', 'B', 'C', 'D'].map(row => (
              ['1', '2'].map(col => (
                <div
                  key={`${row}${col}`}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: colors.chrome,
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '7px',
                    color: colors.amberDim,
                    letterSpacing: '0.5px',
                  }}
                >
                  {row}{col}
                </div>
              ))
            )).flat()}
          </div>
          <div style={{
            background: colors.machineDark,
            border: `1px solid ${colors.chrome}`,
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '8px',
            color: colors.paleGreenDim,
            letterSpacing: '1px',
            textAlign: 'center',
          }}>
            NERVE<br/>
            <span style={{ color: nerveBalance > 0 ? colors.paleGreen : '#444', fontSize: '12px', fontWeight: 'bold' }}>
              {nerveBalance}
            </span>
          </div>
        </div>

        {/* Tray area */}
        <div style={{
          margin: '4px 10px 8px',
          background: colors.machineDark,
          border: `1px solid ${colors.chrome}`,
          borderRadius: '4px',
          minHeight: '60px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            top: '3px',
            left: '8px',
            fontSize: '7px',
            color: '#333',
            letterSpacing: '2px',
          }}>
            TRAY
          </div>

          {/* Empty tray message */}
          {!unexpectedItem && !receiptVisible && (
            <div style={{ color: '#2a2a2a', fontSize: '9px', letterSpacing: '1px' }}>
              — empty —
            </div>
          )}

          {/* THIS ONE package */}
          {unexpectedItem && !unexpectedItemOpen && (
            <div
              onClick={handleThisOneClick}
              style={{
                marginTop: '8px',
                background: `linear-gradient(135deg, ${colors.paleGreen}, #d8f0e8)`,
                border: `1px solid rgba(168, 200, 144, 0.6)`,
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                animation: 'trayDrop 0.6s ease-out, packagePulse 2s ease-in-out infinite',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1a2a1a',
                letterSpacing: '3px',
              }}>
                THIS ONE
              </div>
              <div style={{ fontSize: '7px', color: '#3a5a3a', letterSpacing: '1px' }}>
                click to open
              </div>
            </div>
          )}

          {unexpectedItemOpen && (
            <div style={{ color: colors.paleGreen, fontSize: '9px', letterSpacing: '1px', padding: '4px' }}>
              ✓ opened
            </div>
          )}
        </div>

        {/* Receipt */}
        {receiptVisible && (
          <div style={{
            margin: '0 10px 10px',
            background: '#f8f5ef',
            borderRadius: '0 0 4px 4px',
            overflow: 'hidden',
            animation: 'receiptPrint 0.8s ease-out',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              padding: '10px 12px',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '9px',
              color: '#1a1a1a',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              borderTop: '4px dashed #ddd',
            }}>
              {receiptText}
            </div>
          </div>
        )}

        {/* Machine bottom */}
        <div style={{
          background: `linear-gradient(0deg, ${colors.machineDark} 0%, ${colors.chrome} 100%)`,
          borderRadius: '0 0 10px 10px',
          padding: '6px 16px',
          borderTop: `1px solid rgba(255,255,255,0.04)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '7px', color: '#333', letterSpacing: '1px' }}>
            FUTUREMART CORP.
          </div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: purchaseAttempted ? '#664444' : colors.paleGreen,
            boxShadow: purchaseAttempted ? '0 0 4px #442222' : `0 0 6px ${colors.paleGreen}`,
          }} />
          <div style={{ fontSize: '7px', color: '#333', letterSpacing: '1px' }}>
            DO NOT KICK
          </div>
        </div>
      </div>

      {/* THIS ONE Reveal */}
      {unexpectedItemOpen && thisOneReveal && (
        <div style={{
          width: '380px',
          maxWidth: '100%',
          marginTop: '16px',
          background: 'rgba(8, 12, 8, 0.95)',
          border: `1px solid rgba(168, 200, 144, 0.3)`,
          borderRadius: '6px',
          padding: '20px',
          animation: 'revealExpand 0.5s ease-out',
          boxShadow: `0 0 30px rgba(168, 200, 144, 0.1)`,
        }}>
          <div style={{
            color: colors.paleGreen,
            fontSize: '8px',
            letterSpacing: '3px',
            marginBottom: '12px',
            opacity: 0.6,
          }}>
            CONTENTS OF: THIS ONE
          </div>
          <div style={{
            color: '#c8d8c8',
            fontSize: '12px',
            lineHeight: '1.9',
            fontStyle: 'italic',
            letterSpacing: '0.3px',
          }}>
            {thisOneReveal}
          </div>
          <div style={{
            marginTop: '14px',
            paddingTop: '10px',
            borderTop: `1px solid rgba(168, 200, 144, 0.15)`,
            color: colors.paleGreenDim,
            fontSize: '8px',
            letterSpacing: '2px',
            textAlign: 'right',
          }}>
            NO NERVE REQUIRED. — FUTUREMART™
          </div>
        </div>
      )}

      {/* Idle hint */}
      {!unexpectedItem && !purchaseAttempted && (
        <div style={{
          marginTop: '12px',
          color: '#2a2a35',
          fontSize: '9px',
          letterSpacing: '2px',
          textAlign: 'center',
          maxWidth: '300px',
        }}>
          {idleSeconds > 8 ? 'the machine hums...' : 'select an item above'}
        </div>
      )}

      {purchaseAttempted && !unexpectedItem && (
        <div style={{
          marginTop: '12px',
          color: colors.amberDim,
          fontSize: '9px',
          letterSpacing: '2px',
          textAlign: 'center',
          maxWidth: '300px',
          lineHeight: '1.6',
        }}>
          form k-9 available at all locations.<br />
          <span style={{ color: '#333' }}>all locations are closed.</span>
        </div>
      )}
    </div>
  );
}