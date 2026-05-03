import { useState, useEffect, useRef, useCallback } from 'react';

const INITIAL_ITEMS = [
  { id: 1, text: 'Milk (2%)', crossed: false, replacement: null, typed: '' },
  { id: 2, text: 'Regret (2%)', crossed: false, replacement: null, typed: '' },
  { id: 3, text: 'Bread — the soft kind, not the kind that judges you', crossed: false, replacement: null, typed: '' },
  { id: 4, text: 'The apology (store brand is fine)', crossed: false, replacement: null, typed: '' },
  { id: 5, text: 'Fresh dill', crossed: false, replacement: null, typed: '' },
  { id: 6, text: 'Something for the thing on Thursday', crossed: false, replacement: null, typed: '' },
  { id: 7, text: 'Whatever you called hope before you had a word for it', crossed: false, replacement: null, typed: '' },
  { id: 8, text: 'Eggs (a dozen, or however many you think you deserve)', crossed: false, replacement: null, typed: '' },
  { id: 9, text: 'More of the same (see last week)', crossed: false, replacement: null, typed: '' },
  { id: 10, text: 'The version of Tuesday that still felt possible', crossed: false, replacement: null, typed: '' },
  { id: 11, text: 'Dish soap', crossed: false, replacement: null, typed: '' },
  { id: 12, text: 'The silence you left on the counter — it has gone bad', crossed: false, replacement: null, typed: '' },
];

const REPLACEMENTS = {
  1: 'Milk (the kind from before you knew what dairy does to you)',
  2: 'Specific regret, 2006, aisle 4, the one with your name on it',
  3: 'Bread — the kind you used to bake when you still had time for that',
  4: 'The apology with your handwriting on it, not the generic one',
  5: 'Fresh dill, but she liked it and you don\'t know why you\'re buying it',
  6: 'Something for the thing on Thursday — you know the one — yes, that one',
  7: 'Hope (you called it "maybe" then, and also "him," and also "morning")',
  8: 'Exactly eleven eggs. You\'ll know why when you get home.',
  9: 'More of the same, but this time you\'ll notice what the same is',
  10: 'Tuesday, the real one, the one you walked away from at 3:14pm',
  11: 'Dish soap (the scent she used — it\'s still on the shelf, somehow)',
  12: 'The silence, repackaged. Expiration date: ongoing.',
};

const VARIANCE_PRICES = {
  1: 3.47, 2: 12.00, 3: 4.29, 4: 0.00, 5: 1.89,
  6: 9.99, 7: 22.50, 8: 6.12, 9: 14.44, 10: 88.00,
  11: 2.79, 12: 0.01,
};

export default function Page() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [crossedIds, setCrossedIds] = useState(new Set());
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [redactShift, setRedactShift] = useState(0);
  const [redactOpacity, setRedactOpacity] = useState(1);
  const [typingQueue, setTypingQueue] = useState([]);
  const [receiptSlide, setReceiptSlide] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const typingRef = useRef({});
  const allCrossedRef = useRef(false);

  useEffect(() => {
    const shiftInterval = setInterval(() => {
      setRedactShift(Math.floor(Math.random() * 8) - 4);
      setRedactOpacity(0.85 + Math.random() * 0.15);
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(shiftInterval);
  }, []);

  useEffect(() => {
    if (typingQueue.length === 0) return;
    const [currentId, ...rest] = typingQueue;
    if (typingRef.current[currentId]) return;

    const targetText = REPLACEMENTS[currentId] || '';
    let charIndex = 0;

    typingRef.current[currentId] = true;

    const interval = setInterval(() => {
      charIndex++;
      setItems(prev => prev.map(item => {
        if (item.id === currentId && item.replacement !== null) {
          return { ...item, typed: targetText.slice(0, charIndex) };
        }
        return item;
      }));
      if (charIndex >= targetText.length) {
        clearInterval(interval);
        setTypingQueue(q => q.slice(1));
      }
    }, 28);

    return () => clearInterval(interval);
  }, [typingQueue]);

  useEffect(() => {
    const allCrossed = items.length > 0 && items.every(item => item.crossed);
    if (allCrossed && !allCrossedRef.current) {
      allCrossedRef.current = true;
      setTimeout(() => {
        setReceiptVisible(true);
        setTimeout(() => setReceiptSlide(true), 50);
      }, 1200);
    }
  }, [items]);

  const crossItem = useCallback((id) => {
    if (crossedIds.has(id)) return;
    setCrossedIds(prev => new Set([...prev, id]));
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, crossed: true, replacement: '', typed: '' } : item
    ));
    setTimeout(() => {
      setTypingQueue(prev => [...prev, id]);
    }, 400);
  }, [crossedIds]);

  const totalVariance = Array.from(crossedIds).reduce((sum, id) => sum + (VARIANCE_PRICES[id] || 0), 0);

  const redactedNote = (
    <div style={{
      marginTop: 32,
      fontFamily: "'Georgia', serif",
      fontSize: 13,
      color: '#3a3030',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      opacity: 0.7,
      userSelect: 'none',
      position: 'relative',
    }}>
      <span style={{ fontStyle: 'italic', letterSpacing: 1 }}>don't forget</span>
      <span style={{ position: 'relative', display: 'inline-block', marginLeft: 4 }}>
        <span style={{
          color: 'transparent',
          userSelect: 'none',
          letterSpacing: 1,
        }}>to call about the thing with the—</span>
        <span style={{
          position: 'absolute',
          top: '50%',
          left: redactShift,
          transform: 'translateY(-50%)',
          width: '100%',
          height: '1.3em',
          background: '#1a1a2e',
          opacity: redactOpacity,
          transition: 'left 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
          borderRadius: 1,
        }} />
      </span>
    </div>
  );

  const receipt = receiptVisible ? (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: receiptSlide ? 'translate(-50%, 0)' : 'translate(-50%, 100%)',
      transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
      width: 340,
      maxHeight: '70vh',
      overflowY: 'auto',
      background: '#fafaf7',
      borderTop: '2px dashed #ccc',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
      padding: '24px 24px 32px',
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: 12,
      color: '#222',
      zIndex: 100,
      borderRadius: '8px 8px 0 0',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 12, letterSpacing: 2, fontSize: 11, color: '#555' }}>
        *** PARALLEL MARKET ***
      </div>
      <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 10, color: '#888' }}>
        RECEIPT — BRANCH: YOU/B<br />
        CASHIER: #7 (the quiet one)
      </div>
      <div style={{ borderTop: '1px dashed #aaa', marginBottom: 12 }} />
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
          <span style={{ flex: 1, lineHeight: 1.4, color: '#333', fontSize: 11 }}>
            {item.text.length > 32 ? item.text.slice(0, 32) + '…' : item.text}
          </span>
          <span style={{ whiteSpace: 'nowrap', color: '#444', fontWeight: 'bold', fontSize: 11 }}>
            {(VARIANCE_PRICES[item.id] || 0).toFixed(2)} V
          </span>
        </div>
      ))}
      <div style={{ borderTop: '1px dashed #aaa', marginTop: 12, marginBottom: 12 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>
        <span>TOTAL</span>
        <span>{totalVariance.toFixed(2)} VARIANCE</span>
      </div>
      <div style={{ fontSize: 10, color: '#888', marginBottom: 16 }}>
        (exchange rate: 1 V = one thing you almost did)
      </div>
      <div style={{ borderTop: '1px dashed #aaa', marginBottom: 16 }} />
      <div style={{ textAlign: 'center', fontSize: 11, color: '#555', lineHeight: 1.8, fontStyle: 'italic' }}>
        Thank you for shopping.<br />
        We hope to see the other one next time.
      </div>
      <div style={{ textAlign: 'center', marginTop: 12, fontSize: 9, color: '#bbb', letterSpacing: 1 }}>
        *** *** ***
      </div>
    </div>
  ) : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f0e8',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, #ede8d8 0%, #f5f0e8 60%, #ece4d4 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 24px 120px',
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes paperGrain {
          0% { opacity: 0.03; }
          100% { opacity: 0.06; }
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: 520,
        position: 'relative',
      }}>
        {/* Paper texture overlay */}
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.4,
        }} />

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            fontSize: 11,
            letterSpacing: 3,
            color: '#8a7a6a',
            textTransform: 'uppercase',
            marginBottom: 8,
            fontFamily: "'Courier New', monospace",
          }}>
            found in a coat pocket — not yours
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 'normal',
            color: '#2a2030',
            margin: 0,
            fontStyle: 'italic',
            letterSpacing: -0.5,
            lineHeight: 1.3,
          }}>
            Grocery List
          </h1>
          <div style={{
            fontSize: 12,
            color: '#9a8a7a',
            marginTop: 6,
            fontStyle: 'italic',
          }}>
            from the other week — or the other you
          </div>
          <div style={{
            width: 60,
            height: 1,
            background: 'linear-gradient(to right, transparent, #8a7a6a, transparent)',
            margin: '16px auto 0',
          }} />
        </div>

        {/* List container */}
        <div style={{
          background: 'rgba(255,252,245,0.85)',
          borderRadius: 4,
          padding: '32px 36px 28px',
          boxShadow: '0 2px 24px rgba(60,40,20,0.08), 0 1px 4px rgba(60,40,20,0.06), inset 0 0 0 1px rgba(140,120,90,0.1)',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Ruled lines background */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(180,160,140,0.12) 31px, rgba(180,160,140,0.12) 32px)',
            backgroundPosition: '0 40px',
            borderRadius: 4,
            pointerEvents: 'none',
          }} />

          {/* Left margin line */}
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: 56,
            width: 1,
            background: 'rgba(200,140,140,0.2)',
            pointerEvents: 'none',
          }} />

          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            position: 'relative',
          }}>
            {items.map((item, index) => {
              const isReplacement = false;
              const showReplacement = item.crossed && item.replacement !== null;
              return (
                <li key={item.id} style={{
                  animation: `fadeSlideIn 0.4s ease both`,
                  animationDelay: `${index * 0.06}s`,
                }}>
                  {/* Original item */}
                  <div
                    onClick={() => crossItem(item.id)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '6px 0',
                      cursor: item.crossed ? 'default' : 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    {/* Checkbox-ish bullet */}
                    <span style={{
                      display: 'inline-block',
                      width: 14,
                      height: 14,
                      border: `1.5px solid ${item.crossed ? '#aaa' : (hoveredId === item.id ? '#5a4a7a' : '#8a7a9a')}`,
                      borderRadius: 2,
                      marginTop: 3,
                      flexShrink: 0,
                      background: item.crossed ? 'rgba(90,74,122,0.15)' : 'transparent',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}>
                      {item.crossed && (
                        <span style={{
                          position: 'absolute',
                          top: -1, left: 1,
                          fontSize: 12,
                          color: '#5a4a7a',
                          lineHeight: 1,
                        }}>✓</span>
                      )}
                    </span>
                    <span style={{
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: item.crossed ? '#bbb' : (hoveredId === item.id ? '#3a2050' : '#2a2030'),
                      textDecoration: item.crossed ? 'line-through' : 'none',
                      textDecorationColor: '#8a7a9a',
                      fontStyle: index % 3 === 1 ? 'italic' : 'normal',
                      transition: 'color 0.3s',
                      letterSpacing: 0.2,
                    }}>
                      {item.text}
                    </span>
                  </div>

                  {/* Replacement item (typed in) */}
                  {showReplacement && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '2px 0 6px 24px',
                      animation: 'fadeSlideIn 0.3s ease both',
                    }}>
                      <span style={{
                        fontSize: 12,
                        color: '#7a6a9a',
                        marginTop: 2,
                        flexShrink: 0,
                        letterSpacing: 1,
                      }}>↳</span>
                      <span style={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: '#5a4a7a',
                        fontStyle: 'italic',
                        letterSpacing: 0.3,
                      }}>
                        {item.typed}
                        {item.typed.length < (REPLACEMENTS[item.id] || '').length && (
                          <span style={{
                            display: 'inline-block',
                            width: 1.5,
                            height: '0.9em',
                            background: '#7a6a9a',
                            marginLeft: 1,
                            verticalAlign: 'middle',
                            animation: 'blink 0.7s step-end infinite',
                          }} />
                        )}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Don't forget note */}
          {redactedNote}
        </div>

        {/* Instruction hint */}
        {crossedIds.size === 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 11,
            color: '#9a8a7a',
            fontStyle: 'italic',
            letterSpacing: 0.5,
            animation: 'fadeSlideIn 0.8s ease 1s both',
            position: 'relative',
            zIndex: 1,
          }}>
            tap an item to cross it off
          </div>
        )}

        {/* Progress note */}
        {crossedIds.size > 0 && crossedIds.size < items.length && (
          <div style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 11,
            color: '#9a8a7a',
            fontStyle: 'italic',
            letterSpacing: 0.5,
            position: 'relative',
            zIndex: 1,
          }}>
            {crossedIds.size} of {items.length} accounted for
          </div>
        )}

        {crossedIds.size === items.length && !receiptVisible && (
          <div style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 11,
            color: '#7a6a9a',
            fontStyle: 'italic',
            letterSpacing: 0.5,
            position: 'relative',
            zIndex: 1,
            animation: 'fadeSlideIn 0.5s ease both',
          }}>
            tallying your variance…
          </div>
        )}
      </div>

      {receipt}
    </div>
  );
}