import { useState, useEffect, useRef } from 'react';
export default function Page() {
  const claimPool = [
    "Dread has been here longer than your memory",
    "Pride is essential for property value",
    "Indecision has established a common-law tenancy through repeated trespass",
    "Hope claims squatters' rights by emotional adverse possession",
    "Jealousy files for eminent domain over your success",
    "Guilt argues it has established a habitable mood",
    "Envy has annexed your neighbor's accomplishments",
    "Boredom petitions for a lease extension",
    "Confusion seeks a writ of possession",
    "Resentment demands reparations for past neglect"
  ];

  const [emotions, setEmotions] = useState([]);
  const [courtStage, setCourtStage] = useState(0);
  const [precedents, setPrecedents] = useState([]);
  const [lawsuitCount, setLawsuitCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const fileClaim = () => {
    const randomIdx = Math.floor(Math.random() * claimPool.length);
    const claimText = claimPool[randomIdx];
    const newEmotion = {
      id: Date.now(),
      name: `Emotion ${emotions.length + 1}`,
      claim: claimText
    };
    setEmotions(prev => [...prev, newEmotion]);
  };

  const dismissCurrent = () => {
    if (courtStage >= emotions.length) return;
    setIsDismissed(true);
    const current = emotions[courtStage];
    const newPrecedent = `Precedent ${lawsuitCount + 1}: ${current.claim} now legally resident`;
    setPrecedents(prev => [...prev, newPrecedent]);
    setLawsuitCount(prev => prev + 1);
    const newEmotions = [...emotions];
    const newEmotion = {
      id: Date.now(),
      name: `Precedent ${lawsuitCount + 1}`,
      claim: newPrecedent    };
    newEmotions[courtStage] = newEmotion;
    setEmotions(newEmotions);
    const timer = setTimeout(() => setIsDismissed(false), 1500);
  };

  const proceedNext = () => {
    if (courtStage < 9) {
      setCourtStage(prev => prev + 1);
    } else {
      setCourtStage(prev => prev + 1);
    }
  };

  const isFinal = courtStage >= 10;

  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '20px', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .judge { font-size: 48px; }
        .card { background: #fff; border: 2px solid #333; borderRadius: 8px; padding: 12px; margin: 8px 0; color: #222; fontWeight: bold; }
        .card:hover { background: #ffdddd; }
        .highlight { animation: pulse 1s infinite; }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '48px', lineHeight: '1' }}>⚖️</div>
        <h1 style={{ margin: '10px 0', fontSize: '24px', color: '#2c3e50' }}>Emotional Eviction Tribunal</h1>
        <p style={{ color: '#777', fontSize: '14px' }}>Your emotions are suing for tenancy.</p>
      </div>

      {isFinal ? (
        <div style={{ textAlign: 'center', color: '#c0392b', fontSize: '20px', marginTop: '30px' }}>
          You have reached the tenth hearing. <br />
          <strong>Your own precedents have formed a corporation</strong> and are now suing you for emotional debt.
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '12px' }}>
            <strong>Hearing {courtStage + 1}/10</strong>
          </div>

          {emotions[courtStage] && (
            <div
              style={{
                backgroundColor: '#ffcccc',
                border: '2px solid #a00',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '18px', marginBottom: '6px', color: '#a00' }}>
                {emotions[courtStage].name}
              </div>
              <div style={{ fontSize: '16px', lineHeight: '1.4' }}>
                {emotions[courtStage].claim}
              </div>
              <button
                onClick={dismissCurrent}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#a00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Counter‑Sue
              </button>
              {isDismissed && (
                <div style={{ fontSize: '12px', color: '#900', marginTop: '4px' }}>
                  Dismissed! Precedent created.
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '20px', color: '#2c3e50' }}>Suing Emotions</h2>
            {emotions.map((emo, idx) => (
              <div
                key={emo.id}
                style={{
                  backgroundColor: idx === courtStage ? '#ffdddd' : '#e0e0e0',
                  border: '1px solid #bbb',
                  borderRadius: '4px',
                  padding: '8px',
                  margin: '4px 0',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <strong>{emo.name}:</strong> {emo.claim}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={fileClaim}
              style={{
                padding: '10px 20px',
                backgroundColor: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              File Claim
            </button>

            <button
              onClick={() => {
                if (courtStage < emotions.length) {
                  dismissCurrent();
                }
              }}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: '#e67e22',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Counter‑Sue            </button>

            <button
              onClick={proceedNext}
              disabled={courtStage >= emotions.length || isFinal}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Proceed to Next Hearing            </button>
          </div>
        </>
      )}
    </div>
  );
}