import { useState, useEffect, useRef, useCallback } from 'react';

const DOGS = [
  { id: 'dog1', name: 'Mireille', breed: 'Cornish Vapor Hound', owner: 'Theodora Flinch', quirk: 'a barely perceptible shimmer near the collar' },
  { id: 'dog2', name: 'Absence', breed: 'Standard Theoretical Retriever', owner: 'Bram Solstice', quirk: 'the faint impression of wagging' },
  { id: 'dog3', name: 'Sir Notherford', breed: 'Belgian Null Shepherd', owner: 'Constance Wither', quirk: 'an uncanny stillness that implies movement' },
  { id: 'dog4', name: 'Pudding (Conceptual)', breed: 'Miniature Philosophical Spaniel', owner: 'Reginald Hume', quirk: 'the sound of breathing from no discernible source' },
  { id: 'dog5', name: 'The Countess', breed: 'Grand Spectral Poodle', owner: 'Vivienne Mourn', quirk: 'a cold spot that follows the leash' },
  { id: 'dog6', name: 'Broth', breed: 'Labrador of Uncertain Ontology', owner: 'Percy Null', quirk: 'footprints that appear one second late' },
  { id: 'dog7', name: 'Whisper-Flank', breed: 'Irish Hypothetical Setter', owner: 'Delia Vague', quirk: 'the leash occasionally goes slack then taut again' },
  { id: 'dog8', name: 'Professor Gaps', breed: 'Doberman of Pure Inference', owner: 'Aldous Premise', quirk: 'a shadow cast in the wrong direction' },
  { id: 'dog9', name: 'Floof (Postulated)', breed: 'Samoyed of Approximate Location', owner: 'Margaux Elsewhere', quirk: 'an overwhelming sense of fur without fur' },
  { id: 'dog10', name: 'Tremendous Nothing', breed: 'Great Dane (Implied)', owner: 'Barnabas Void', quirk: 'the floor creaks beneath an invisible mass' },
  { id: 'dog11', name: 'Crumbs', breed: 'Terrier of Diminished Certainty', owner: 'Elowen Faint', quirk: 'a tiny collar bell heard only once' },
  { id: 'dog12', name: 'Eternity', breed: 'Alaskan Malamute (Theoretical)', owner: 'Orpheus Blank', quirk: 'judges report a feeling of being watched' },
];

const CATEGORIES = [
  { key: 'presence', label: 'PRESENCE', desc: 'Does the dog occupy space? Does it occupy it well?' },
  { key: 'conviction', label: 'CONVICTION OF BEING', desc: 'How firmly does the dog insist on existing?' },
  { key: 'coat', label: 'COAT (IMPLIED)', desc: 'The theoretical quality of the invisible coat' },
  { key: 'bearing', label: 'BEARING & CARRIAGE', desc: 'Posture inferred from leash tension' },
  { key: 'spectral', label: 'SPECTRAL DENSITY', desc: 'Concentration of absence per cubic inch' },
];

const DISQUALIFY_REASONS = [
  'excessive non-existence',
  'implausible coat (too theoretical)',
  'failed to not-bark convincingly',
  'presence score paradoxically negative',
  'owner wept too visibly',
  'invisible tail wagged in wrong direction',
  'coat implied something unspeakable',
  'existential density exceeded ring limits',
];

const IDLE_LINES = [
  'The ring is hushed. The leashes are taut.',
  'Somewhere, a dog may or may not be panting.',
  'The judges adjust their spectacles and feel something.',
  'A cold breeze passes through a warm room.',
  'The crowd holds its breath for reasons it cannot name.',
];

export default function Page() {
  const [phase, setPhase] = useState('intro');
  const [currentDogIndex, setCurrentDogIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [announcerText, setAnnouncerText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [crowdReaction, setCrowdReaction] = useState('reverent silence');
  const [disqualified, setDisqualified] = useState(new Set());
  const [completedDogs, setCompletedDogs] = useState(new Set());
  const [winner, setWinner] = useState(null);
  const [rosetteTrembleAngle, setRosetteTrembleAngle] = useState(0);
  const [leashSway, setLeashSway] = useState(0);
  const [hoveredStars, setHoveredStars] = useState({});
  const [showScorecard, setShowScorecard] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [idleIndex, setIdleIndex] = useState(0);
  const [rosettePulse, setRosettePulse] = useState(false);

  const typewriterRef = useRef(null);
  const idleRef = useRef(null);
  const swaySine = useRef(0);
  const rosetteSine = useRef(0);

  const setAnnouncer = useCallback((text) => {
    setAnnouncerText(text);
    setDisplayedText('');
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!announcerText) return;
    let i = 0;
    setDisplayedText('');
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayedText(announcerText.slice(0, i));
      if (i >= announcerText.length) {
        clearInterval(typewriterRef.current);
      }
    }, 28);
    return () => clearInterval(typewriterRef.current);
  }, [announcerText]);

  // Idle announcer cycling
  useEffect(() => {
    if (phase !== 'judging') return;
    idleRef.current = setInterval(() => {
      if (!announcerText) {
        setAnnouncer(IDLE_LINES[idleIndex % IDLE_LINES.length]);
        setIdleIndex(i => i + 1);
      }
    }, 6000);
    return () => clearInterval(idleRef.current);
  }, [phase, announcerText, idleIndex, setAnnouncer]);

  // Leash sway animation
  useEffect(() => {
    const interval = setInterval(() => {
      swaySine.current += 0.04;
      setLeashSway(Math.sin(swaySine.current) * 6);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Rosette tremble
  useEffect(() => {
    if (phase !== 'results') return;
    const interval = setInterval(() => {
      rosetteSine.current += 0.07;
      const base = Math.sin(rosetteSine.current) * 2.5;
      const jitter = (Math.random() - 0.5) * (rosettePulse ? 8 : 1);
      setRosetteTrembleAngle(base + jitter);
    }, 50);
    return () => clearInterval(interval);
  }, [phase, rosettePulse]);

  // Dog entrance narration
  useEffect(() => {
    if (phase !== 'judging') return;
    const dog = DOGS[currentDogIndex];
    setSubmitted(false);
    setShowScorecard(false);
    const t1 = setTimeout(() => setAnnouncer(`Competitor ${currentDogIndex + 1} of 12: "${dog.name}" — ${dog.breed}.`), 300);
    const t2 = setTimeout(() => setAnnouncer(`Owner: ${dog.owner}. Observers note ${dog.quirk}.`), 3500);
    const t3 = setTimeout(() => setAnnouncer(''), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [currentDogIndex, phase]);

  // Check completion
  useEffect(() => {
    if (completedDogs.size < 12) return;
    let bestId = null;
    let bestScore = -1;
    DOGS.forEach(dog => {
      if (disqualified.has(dog.id)) return;
      const s = scores[dog.id] || {};
      const total = (s.presence || 0) + (s.conviction || 0) + (s.coat || 0) + (s.bearing || 0) + (s.spectral || 0);
      if (total > bestScore) { bestScore = total; bestId = dog.id; }
    });
    setWinner(bestId);
    const t1 = setTimeout(() => setAnnouncer('All competitors have been assessed. The judges confer in haunted silence.'), 500);
    const t2 = setTimeout(() => {
      if (bestId) {
        const w = DOGS.find(d => d.id === bestId);
        setAnnouncer(`The winner is... "${w.name}" — ${w.breed}. The crowd weeps openly.`);
      } else {
        setAnnouncer('No winner can be determined. All dogs have transcended judgment.');
      }
    }, 5000);
    const t3 = setTimeout(() => setPhase('results'), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [completedDogs, disqualified, scores]);

  const currentDog = DOGS[currentDogIndex];
  const currentScores = scores[currentDog?.id] || {};
  const totalScore = CATEGORIES.reduce((sum, cat) => sum + (currentScores[cat.key] || 0), 0);
  const maxScore = CATEGORIES.length * 5;

  const setStarScore = (catKey, val) => {
    const dog = DOGS[currentDogIndex];
    setScores(prev => ({
      ...prev,
      [dog.id]: { ...(prev[dog.id] || {}), [catKey]: val }
    }));
    const reactions = ['A murmur ripples through the crowd.', 'Someone in row C dabs their eye.', 'The leash twitches almost imperceptibly.', 'A judge writes something, then crosses it out.', 'Profound.'];
    setCrowdReaction(reactions[Math.floor(Math.random() * reactions.length)]);
  };

  const submitScorecard = () => {
    const dog = DOGS[currentDogIndex];
    const allFilled = CATEGORIES.every(cat => currentScores[cat.key]);
    if (!allFilled) {
      setAnnouncer('You must score all categories. The dog is watching. In its way.');
      return;
    }
    setSubmitted(true);
    const total = CATEGORIES.reduce((s, c) => s + (currentScores[c.key] || 0), 0);
    let commentary;
    if (total >= 22) commentary = `An exceptional score of ${total}/${maxScore}. The crowd rises. Something invisible and magnificent gazes back.`;
    else if (total >= 16) commentary = `A solid ${total}/${maxScore}. The dog has convinced at least three judges of its being.`;
    else if (total >= 10) commentary = `A modest ${total}/${maxScore}. The dog exists, more or less, in a technical sense.`;
    else commentary = `Only ${total}/${maxScore}. The dog is barely a rumor. The owner apologizes to the air.`;
    setAnnouncer(commentary);
    setCompletedDogs(prev => new Set([...prev, dog.id]));
    setCrowdReaction(total >= 18 ? 'thunderous invisible applause' : total >= 12 ? 'polite murmuring' : 'awkward silence');
  };

  const disqualifyDog = () => {
    const dog = DOGS[currentDogIndex];
    const reason = DISQUALIFY_REASONS[Math.floor(Math.random() * DISQUALIFY_REASONS.length)];
    setDisqualified(prev => new Set([...prev, dog.id]));
    setAnnouncer(`"${dog.name}" has been DISQUALIFIED for ${reason}. ${dog.owner} is escorted from the ring.`);
    setCompletedDogs(prev => new Set([...prev, dog.id]));
    setSubmitted(true);
    setCrowdReaction('horrified gasps');
  };

  const nextDog = () => {
    if (currentDogIndex < 11) {
      setCurrentDogIndex(i => i + 1);
    }
  };

  const handleRosetteClick = () => {
    setRosettePulse(true);
    setTimeout(() => setRosettePulse(false), 1200);
    const lines = [
      'The rosette trembles in an unfelt wind. It knows.',
      'The ribbon floats, attached to nothing, meaning everything.',
      'First place. Best in Show. Most Convincingly Absent.',
    ];
    setAnnouncer(lines[Math.floor(Math.random() * lines.length)]);
  };

  const navyBg = '#0d1b2a';
  const ivory = '#f5f0e8';
  const gold = '#c9a84c';
  const cream = '#fdf8f0';
  const darkNavy = '#070e17';
  const mutedGold = '#a07830';
  const ringColor = '#e8e0d0';

  // SVG leash path
  const ownerX = 120, ownerY = 160;
  const leashEndX = 300 + leashSway * 2;
  const leashEndY = 155 + leashSway;
  const cp1x = 180, cp1y = 120 + leashSway * 1.5;
  const cp2x = 260, cp2y = 170 + leashSway * 0.5;

  const StarRating = ({ catKey, value, disabled }) => {
    const hovered = hoveredStars[catKey] || 0;
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onMouseEnter={() => !disabled && setHoveredStars(h => ({ ...h, [catKey]: star }))}
            onMouseLeave={() => !disabled && setHoveredStars(h => ({ ...h, [catKey]: 0 }))}
            onClick={() => !disabled && setStarScore(catKey, star)}
            style={{
              fontSize: 22,
              cursor: disabled ? 'default' : 'pointer',
              color: star <= (hovered || value || 0) ? gold : '#3a4a5a',
              transition: 'color 0.15s',
              textShadow: star <= (hovered || value || 0) ? `0 0 8px ${gold}88` : 'none',
              userSelect: 'none',
            }}
          >★</span>
        ))}
      </div>
    );
  };

  if (phase === 'intro') {
    return (
      <div style={{
        minHeight: '100vh', background: navyBg, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif',
        color: ivory, padding: 40,
      }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes goldPulse { 0%,100% { text-shadow: 0 0 10px #c9a84c44; } 50% { text-shadow: 0 0 30px #c9a84caa, 0 0 60px #c9a84c44; } }
          @keyframes ribbonFloat { 0%,100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        `}</style>
        <div style={{ textAlign: 'center', animation: 'fadeIn 1.2s ease forwards', maxWidth: 640 }}>
          <div style={{ fontSize: 13, letterSpacing: 6, color: gold, marginBottom: 16, textTransform: 'uppercase' }}>
            The Grand Annual
          </div>
          <h1 style={{
            fontSize: 42, fontWeight: 'bold', margin: '0 0 8px', lineHeight: 1.15,
            animation: 'goldPulse 3s infinite',
          }}>
            Dog Show<br />
            <span style={{ fontSize: 28, fontStyle: 'italic', color: '#d4c4a0' }}>for Invisible Dogs</span>
          </h1>
          <div style={{ width: 80, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: '20px auto' }} />
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#c4baa8', marginBottom: 8 }}>
            Twelve competitors. Twelve leashes. Twelve compelling arguments for the existence of something.
          </p>
          <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 32, fontStyle: 'italic' }}>
            You are the judge. Score with sincerity. The dogs can sense hesitation.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 32 }}>
            {['PRESENCE', 'CONVICTION OF BEING', 'COAT (IMPLIED)', 'BEARING & CARRIAGE', 'SPECTRAL DENSITY'].map(cat => (
              <div key={cat} style={{ fontSize: 11, letterSpacing: 3, color: mutedGold, textTransform: 'uppercase' }}>{cat}</div>
            ))}
          </div>
          <button
            onClick={() => { setPhase('judging'); setAnnouncer('Welcome, Judge. The first competitor is preparing to enter the ring.'); }}
            style={{
              background: 'transparent', border: `2px solid ${gold}`, color: gold,
              padding: '14px 40px', fontSize: 14, letterSpacing: 4, textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: 'Georgia, serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = gold; e.target.style.color = navyBg; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = gold; }}
          >
            Enter the Ring
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const winnerDog = winner ? DOGS.find(d => d.id === winner) : null;
    const winnerScore = winner ? CATEGORIES.reduce((s, c) => s + ((scores[winner] || {})[c.key] || 0), 0) : 0;
    return (
      <div style={{
        minHeight: '100vh', background: navyBg, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '40px 20px', fontFamily: 'Georgia, serif', color: ivory,
      }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes rosetteFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          @keyframes confettiDrift { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
        `}</style>
        <div style={{ animation: 'fadeIn 2s ease', width: '100%', maxWidth: 700 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, letterSpacing: 5, color: gold, marginBottom: 12 }}>FINAL RESULTS</div>
            <h2 style={{ fontSize: 36, margin: 0, fontWeight: 'bold' }}>Best in Show</h2>
            <div style={{ fontSize: 13, color: '#8899aa', marginTop: 8 }}>The judges have spoken. The dogs have listened (presumably).</div>
          </div>

          {winnerDog ? (
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              {/* Floating rosette */}
              <div
                onClick={handleRosetteClick}
                style={{
                  display: 'inline-block', cursor: 'pointer', marginBottom: 24,
                  transform: `rotate(${rosetteTrembleAngle}deg)`,
                  transition: 'transform 0.05s',
                  filter: `drop-shadow(0 0 20px ${gold}88)`,
                }}
              >
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {/* Ribbon tails */}
                  <polygon points="60,80 48,120 55,115 60,120 65,115 72,120" fill={gold} opacity="0.9" />
                  {/* Outer petals */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30) * Math.PI / 180;
                    const cx = 60 + Math.cos(angle) * 32;
                    const cy = 60 + Math.sin(angle) * 32;
                    return <ellipse key={i} cx={cx} cy={cy} rx={12} ry={8} fill={i % 2 === 0 ? gold : '#e8c870'} transform={`rotate(${i * 30},${cx},${cy})`} opacity="0.85" />;
                  })}
                  {/* Center circle */}
                  <circle cx="60" cy="60" r="22" fill={navyBg} stroke={gold} strokeWidth="2" />
                  <circle cx="60" cy="60" r="18" fill="#1a2a3a" />
                  <text x="60" y="56" textAnchor="middle" fill={gold} fontSize="8" fontFamily="Georgia">BEST</text>
                  <text x="60" y="66" textAnchor="middle" fill={gold} fontSize="6" fontFamily="Georgia">IN SHOW</text>
                  <text x="60" y="74" textAnchor="middle" fill="#8899aa" fontSize="5" fontFamily="Georgia">(INVISIBLE)</text>
                </svg>
              </div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: gold, marginBottom: 4 }}>{winnerDog.name}</div>
              <div style={{ fontSize: 16, color: '#c4baa8', marginBottom: 4, fontStyle: 'italic' }}>{winnerDog.breed}</div>
              <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 8 }}>Owner: {winnerDog.owner}</div>
              <div style={{ fontSize: 14, color: ivory, marginBottom: 16 }}>Final Score: <span style={{ color: gold, fontWeight: 'bold' }}>{winnerScore}/{maxScore}</span></div>
              <div style={{ fontSize: 13, color: '#aabbcc', fontStyle: 'italic', maxWidth: 400, margin: '0 auto' }}>
                "{winnerDog.quirk}." The rosette floats, trembling slightly in an unfelt breeze.
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: 40, color: '#8899aa', fontStyle: 'italic' }}>
              All competitors have exceeded the bounds of judgment. No ribbon can contain them.
            </div>
          )}

          {/* Announcer */}
          {displayedText && (
            <div style={{
              background: '#0a1520', border: `1px solid ${gold}44`, padding: '16px 24px',
              marginBottom: 24, textAlign: 'center', fontSize: 15, fontStyle: 'italic',
              color: '#d4c4a0', lineHeight: 1.6,
            }}>
              {displayedText}
            </div>
          )}

          {/* All results */}
          <div style={{ fontSize: 13, letterSpacing: 3, color: gold, marginBottom: 16, textAlign: 'center' }}>FULL STANDINGS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DOGS.map((dog, i) => {
              const s = scores[dog.id] || {};
              const total = CATEGORIES.reduce((sum, cat) => sum + (s[cat.key] || 0), 0);
              const isDQ = disqualified.has(dog.id);
              const isWinner = dog.id === winner;
              return (
                <div key={dog.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 16px',
                  background: isWinner ? '#1a2a0a' : '#0a1520',
                  border: `1px solid ${isWinner ? gold : isDQ ? '#441111' : '#1a2a3a'}`,
                  opacity: isDQ ? 0.5 : 1,
                }}>
                  <div>
                    <span style={{ color: isWinner ? gold : ivory, fontWeight: isWinner ? 'bold' : 'normal' }}>
                      {i + 1}. {dog.name}
                    </span>
                    <span style={{ color: '#667788', fontSize: 12, marginLeft: 8, fontStyle: 'italic' }}>{dog.breed}</span>
                  </div>
                  <div style={{ color: isDQ ? '#cc4444' : isWinner ? gold : '#aabbcc', fontSize: 13, fontWeight: 'bold' }}>
                    {isDQ ? 'DQ' : `${total}/${maxScore}`}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              onClick={() => { setPhase('intro'); setScores({}); setCompletedDogs(new Set()); setDisqualified(new Set()); setWinner(null); setCurrentDogIndex(0); }}
              style={{
                background: 'transparent', border: `1px solid #445566`, color: '#8899aa',
                padding: '10px 28px', fontSize: 13, letterSpacing: 3, cursor: 'pointer',
                fontFamily: 'Georgia, serif',
              }}
            >
              JUDGE AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Judging phase
  return (
    <div style={{
      minHeight: '100vh', background: navyBg, fontFamily: 'Georgia, serif',
      color: ivory, display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes leashPulse { 0%,100% { opacity: 0.9; } 50% { opacity: 0.6; } }
        @keyframes ownerSway { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(1deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid #1a2a3a`, padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: darkNavy,
      }}>
        <div>
          <span style={{ fontSize: 11, letterSpacing: 4, color: gold }}>GRAND ANNUAL INVISIBLE DOG SHOW</span>
          <span style={{ fontSize: 11, color: '#445566', marginLeft: 16 }}>Official Judging Form</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#667788' }}>
            {completedDogs.size}/12 assessed
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {DOGS.map((dog, i) => (
              <div key={dog.id} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: disqualified.has(dog.id) ? '#cc4444' :
                  completedDogs.has(dog.id) ? gold :
                  i === currentDogIndex ? '#aabbcc' : '#1a2a3a',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Announcer bar */}
      <div style={{
        background: '#050d18', borderBottom: `1px solid ${gold}22`,
        padding: '10px 24px', minHeight: 44, display: 'flex', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, letterSpacing: 3, color: gold, marginRight: 12 }}>◆ ANNOUNCER</span>
        <span style={{ fontSize: 14, fontStyle: 'italic', color: '#d4c4a0', flex: 1, lineHeight: 1.5 }}>
          {displayedText || <span style={{ color: '#334455' }}>…</span>}
        </span>
        <span style={{ fontSize: 11, color: '#445566', marginLeft: 16 }}>{crowdReaction}</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Ring area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
          {/* The ring */}
          <div style={{
            width: 420, height: 260, borderRadius: '50%',
            background: `radial-gradient(ellipse, ${ringColor} 0%, #d4caba 60%, #b8b0a0 100%)`,
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 60px #00000088, inset 0 0 40px #00000022`,
            border: `3px solid #c4b890`,
          }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: '#8a7a60', textTransform: 'uppercase', position: 'absolute', top: 20 }}>
              Competition Ring
            </div>

            {/* SVG leash + owner + empty space */}
            <svg width="380" height="220" style={{ position: 'absolute', top: 20, left: 20 }}>
              {/* Owner silhouette */}
              <g style={{ animation: 'ownerSway 3s ease-in-out infinite' }} transform="translate(0,0)">
                {/* Body */}
                <rect x={ownerX - 12} y={ownerY - 40} width={24} height={50} rx={4} fill="#2a1a0a" opacity="0.85" />
                {/* Head */}
                <circle cx={ownerX} cy={ownerY - 50} r={14} fill="#3a2a1a" opacity="0.85" />
                {/* Arm holding leash */}
                <line x1={ownerX + 10} y1={ownerY - 20} x2={ownerX + 22} y2={ownerY - 5} stroke="#2a1a0a" strokeWidth={5} strokeLinecap="round" />
                {/* Legs */}
                <rect x={ownerX - 10} y={ownerY + 8} width={9} height={22} rx={3} fill="#1a0a00" opacity="0.8" />
                <rect x={ownerX + 1} y={ownerY + 8} width={9} height={22} rx={3} fill="#1a0a00" opacity="0.8" />
                {/* Hat */}
                <rect x={ownerX - 16} y={ownerY - 68} width={32} height={6} rx={2} fill="#1a1000" />
                <rect x={ownerX - 10} y={ownerY - 84} width={20} height={18} rx={2} fill="#1a1000" />
              </g>

              {/* Leash - taut bezier to empty space */}
              <path
                d={`M ${ownerX + 22} ${ownerY - 5} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${leashEndX} ${leashEndY}`}
                fill="none"
                stroke="#8a6a3a"
                strokeWidth={2.5}
                strokeLinecap="round"
                style={{ animation: 'leashPulse 2s ease-in-out infinite' }}
              />

              {/* Empty space where dog would be */}
              <circle cx={leashEndX} cy={leashEndY} r={3} fill="#8a6a3a" opacity={0.6} />

              {/* Subtle "presence" indicator - faint shimmer */}
              <ellipse
                cx={leashEndX + 20}
                cy={leashEndY + 10}
                rx={25}
                ry={15}
                fill="none"
                stroke="#c9a84c"
                strokeWidth={0.5}
                opacity={0.15}
                strokeDasharray="3,4"
              />
            </svg>

            {/* Placard */}
            <div style={{
              position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
              background: cream, border: `2px solid ${gold}`, padding: '8px 20px',
              textAlign: 'center', minWidth: 200,
              boxShadow: '0 2px 8px #00000033',
              animation: 'fadeSlideIn 0.5s ease forwards',
            }}>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#2a1a00', letterSpacing: 1 }}>
                {currentDog.name}
              </div>
              <div style={{ fontSize: 11, color: '#6a5a40', fontStyle: 'italic', marginTop: 2 }}>
                {currentDog.breed}
              </div>
              <div style={{ fontSize: 10, color: '#8a7a60', marginTop: 4, letterSpacing: 1 }}>
                Owner: {currentDog.owner}
              </div>
              {disqualified.has(currentDog.id) && (
                <div style={{ fontSize: 10, color: '#cc2222', marginTop: 4, letterSpacing: 2, fontWeight: 'bold' }}>
                  ✕ DISQUALIFIED
                </div>
              )}
            </div>
          </div>

          {/* Dog number */}
          <div style={{ marginTop: 20, fontSize: 13, color: '#667788', letterSpacing: 2 }}>
            COMPETITOR {currentDogIndex + 1} OF 12
          </div>
          <div style={{ fontSize: 12, color: '#445566', fontStyle: 'italic', marginTop: 4, maxWidth: 360, textAlign: 'center' }}>
            Observed: {currentDog.quirk}
          </div>
        </div>

        {/* Scorecard panel */}
        <div style={{
          width: 340, background: '#060f1a', borderLeft: `1px solid #1a2a3a`,
          display: 'flex', flexDirection: 'column', overflow: 'auto',
        }}>
          {/* Scorecard header */}
          <div style={{
            padding: '16px 20px', borderBottom: `1px solid #1a2a3a`,
            background: '#0a1520',
          }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: gold, marginBottom: 4 }}>OFFICIAL JUDGING FORM</div>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: ivory }}>{currentDog.name}</div>
            <div style={{ fontSize: 11, color: '#667788', fontStyle: 'italic' }}>{currentDog.breed}</div>
          </div>

          {/* Categories */}
          <div style={{ padding: '16px 20px', flex: 1 }}>
            {CATEGORIES.map(cat => (
              <div key={cat.key} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: gold, marginBottom: 2, textTransform: 'uppercase' }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: 11, color: '#667788', marginBottom: 6, fontStyle: 'italic' }}>
                  {cat.desc}
                </div>
                <StarRating
                  catKey={cat.key}
                  value={currentScores[cat.key] || 0}
                  disabled={submitted || disqualified.has(currentDog.id)}
                />
              </div>
            ))}

            {/* Total */}
            <div style={{
              borderTop: `1px solid #1a2a3a`, paddingTop: 12, marginTop: 4,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, letterSpacing: 2, color: '#8899aa' }}>TOTAL SCORE</span>
              <span style={{ fontSize: 20, fontWeight: 'bold', color: gold }}>
                {totalScore}<span style={{ fontSize: 13, color: '#445566' }}>/{maxScore}</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          {!submitted && !disqualified.has(currentDog.id) && (
            <div style={{ padding: '16px 20px', borderTop: `1px solid #1a2a3a`, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={submitScorecard}
                style={{
                  background: totalScore > 0 ? gold : '#2a3a4a',
                  border: 'none', color: totalScore > 0 ? navyBg : '#667788',
                  padding: '12px', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 'bold',
                  transition: 'all 0.2s',
                }}
              >
                Submit Scorecard
              </button>
              <button
                onClick={disqualifyDog}
                style={{
                  background: 'transparent', border: '1px solid #441111', color: '#cc4444',
                  padding: '8px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'Georgia, serif',
                }}
              >
                Disqualify
              </button>
            </div>
          )}

          {(submitted || disqualified.has(currentDog.id)) && currentDogIndex < 11 && (
            <div style={{ padding: '16px 20px', borderTop: `1px solid #1a2a3a` }}>
              {disqualified.has(currentDog.id) && (
                <div style={{ fontSize: 12, color: '#cc4444', marginBottom: 12, textAlign: 'center', fontStyle: 'italic' }}>
                  This competitor has been removed from the ring.
                </div>
              )}
              {!disqualified.has(currentDog.id) && (
                <div style={{ fontSize: 12, color: '#556677', marginBottom: 12, textAlign: 'center', fontStyle: 'italic' }}>
                  Scorecard submitted. The dog recedes into the middle distance.
                </div>
              )}
              <button
                onClick={nextDog}
                style={{
                  width: '100%', background: 'transparent', border: `1px solid ${gold}`,
                  color: gold, padding: '12px', fontSize: 12, letterSpacing: 3,
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Georgia, serif',
                }}
                onMouseEnter={e => { e.target.style.background = gold + '22'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; }}
              >
                Next Competitor →
              </button>
            </div>
          )}

          {(submitted || disqualified.has(currentDog.id)) && currentDogIndex === 11 && completedDogs.size < 12 && (
            <div style={{ padding: '16px 20px', borderTop: `1px solid #1a2a3a` }}>
              <div style={{ fontSize: 12, color: '#667788', textAlign: 'center', fontStyle: 'italic' }}>
                All competitors have been assessed. Awaiting final deliberation…
              </div>
            </div>
          )}

          {/* Progress sidebar */}
          <div style={{ padding: '12px 20px', borderTop: `1px solid #1a2a3a`, background: '#050d16' }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: '#445566', marginBottom: 8 }}>RING STATUS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {DOGS.map((dog, i) => (
                <div key={dog.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
                  color: i === currentDogIndex ? ivory : '#445566',
                  fontWeight: i === currentDogIndex ? 'bold' : 'normal',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: disqualified.has(dog.id) ? '#cc4444' :
                      completedDogs.has(dog.id) ? gold :
                      i === currentDogIndex ? '#aabbcc' : '#1a2a3a',
                  }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dog.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}