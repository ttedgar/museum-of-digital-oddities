import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [birthDate, setBirthDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [aspectVisible, setAspectVisible] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [luckyHorse, setLuckyHorse] = useState(null);
  const [horoscope, setHoroscope] = useState({ planets: [], rising: '', paragraphs: [] });

  const rafRef = useRef();

  // simple deterministic hash
  const hash = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  };

  const planetNames = ['Sunhorse', 'Mercurial Mare', 'Venus Vanguard', 'Mars Stallion', 'Jupiter Jumper', 'Saturn Sire', 'Uranus Unicorn', 'Neptune Noggin'];
  const aspectSentences = [
    'You gallop through life with a mane of misplaced confidence.',
    'Your hooves echo louder than your words.',
    'A sudden whinny will reveal a hidden truth.',
    'You carry the weight of a thousand carrots, yet never eat one.',
    'Your shadow is a phantom steed that follows you everywhere.',
    'When you sniff the air, destiny smells of ozone and hay.',
    'Your neigh is the soundtrack of the cosmos.',
    'A stray feather will steer you toward unexpected pastures.'
  ];
  const adjectives = ['Spirited', 'Limping', 'Majestic', 'Wary', 'Shimmering'];
  const markings = ['a scar over the left eye', 'a silver blaze', 'a dappled coat', 'a golden horn'];
  const breeds = ['Arabian', 'Clydesdale', 'Mustang', 'Paint'];
  const locations = ['near the old barn', 'by the abandoned carousel', 'at the crossroads of dusk', 'under the waning moon'];

  // generate horoscope on submit
  useEffect(() => {
    if (!submitted) return;
    const seed = hash(birthDate);
    const planets = planetNames.map((name, i) => ({
      name,
      angleOffset: (seed + i * 37) % 360,
      speed: 0.02 + (i % 3) * 0.01,
      aspect: aspectSentences[(seed + i) % aspectSentences.length],
    }));
    const rising = planetNames[seed % planetNames.length];
    const paragraphs = planetNames.map((p, i) => {
      const adj = adjectives[(seed + i) % adjectives.length];
      const mark = markings[(seed + i * 2) % markings.length];
      return `${p} whispers that ${adj.toLowerCase()} tides will bring ${mark} into your path this week.`;
    });
    setHoroscope({ planets, rising, paragraphs });

    // lucky horse generation (non‑deterministic)
    const lh = {
      name: `${adjectives[Math.floor(Math.random()*adjectives.length)]} ${breeds[Math.floor(Math.random()*breeds.length)]}`,
      markings: markings[Math.floor(Math.random()*markings.length)],
      temperament: adjectives[Math.floor(Math.random()*adjectives.length)].toLowerCase(),
      lastSeen: locations[Math.floor(Math.random()*locations.length)],
    };
    setLuckyHorse(lh);
  }, [submitted, birthDate]);

  // animation loop
  useEffect(() => {
    const tick = () => {
      setOrbitAngle((a) => (a + 0.1) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (birthDate) setSubmitted(true);
  };

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
    setAspectVisible(true);
  };

  const closeAspect = () => {
    setAspectVisible(false);
    setSelectedPlanet(null);
  };

  // calculate planet positions
  const renderPlanets = () => {
    if (!submitted) return null;
    const cx = 150;
    const cy = 150;
    const radiusBase = 40;
    return horoscope.planets.map((p, i) => {
      const angle = (orbitAngle * p.speed + p.angleOffset) * (Math.PI / 180);
      const r = radiusBase + i * 15;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return (
        <g key={p.name} onClick={() => handlePlanetClick(p)} style={{ cursor: 'pointer' }}>
          <text x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 20, fill: '#ffd700', textShadow: '0 0 6px #fff' }}>
            🐴
          </text>
          <title>{p.name}</title>
        </g>
      );
    });
  };

  return (
    <div style={{ background: '#0b0b2b', minHeight: '100vh', color: '#f5e8c7', fontFamily: 'Georgia, serif', padding: 20 }}>
      <style>{`
        @keyframes pulse {
          0% { text-shadow: 0 0 4px #fff; }
          50% { text-shadow: 0 0 12px #ffd700; }
          100% { text-shadow: 0 0 4px #fff; }
        }
      `}</style>
      <h1 style={{ textAlign: 'center', fontSize: 36, marginBottom: 10 }}>Horroscope: Your Future in Horses</h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic', marginBottom: 30 }}>The stars are horses. You were always a horse.</p>

      {!submitted && (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 18 }}>Enter your birth date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{ padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #555', background: '#1a1a3d', color: '#f5e8c7', marginBottom: 12, width: '100%' }}
            required
          />
          <button type="submit" style={{ padding: '10px 20px', fontSize: 16, background: '#b33', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Reveal the Herd
          </button>
        </form>
      )}

      {submitted && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <svg width={300} height={300} style={{ background: 'transparent' }}>
              <circle cx={150} cy={150} r={120} stroke="#444" strokeWidth={1} fill="none" />
              {horoscope.planets.map((p, i) => {
                const r = 40 + i * 15;
                return <circle key={p.name} cx={150} cy={150} r={r} stroke="#333" strokeWidth={0.5} fill="none" />;
              })}
              {renderPlanets()}
            </svg>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 28, borderBottom: '1px solid #444', paddingBottom: 4 }}>Rising Horse: {horoscope.rising}</h2>
          </div>

          {horoscope.paragraphs.map((para, i) => (
            <p key={i} style={{ lineHeight: 1.6, marginBottom: 16 }}>{para}</p>
          ))}

          {luckyHorse && (
            <div style={{ marginTop: 40, padding: 20, border: '2px solid #555', borderRadius: 8, background: '#1a1a3d' }}>
              <h3 style={{ marginBottom: 8 }}>Lucky Horse of the Day</h3>
              <p><strong>Name:</strong> {luckyHorse.name}</p>
              <p><strong>Markings:</strong> {luckyHorse.markings}</p>
              <p><strong>Temperament:</strong> {luckyHorse.temperament}</p>
              <p><strong>Last Seen:</strong> {luckyHorse.lastSeen}</p>
            </div>
          )}
        </>
      )}

      {aspectVisible && selectedPlanet && (
        <div
          onClick={closeAspect}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            padding: 20,
            cursor: 'pointer',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1a3d',
              padding: 20,
              borderRadius: 8,
              maxWidth: 400,
              textAlign: 'center',
              animation: 'pulse 2s infinite',
            }}
          >
            <h4 style={{ marginBottom: 12 }}>{selectedPlanet.name} Aspect</h4>
            <p>{selectedPlanet.aspect}</p>
            <small>(click anywhere to close)</small>
          </div>
        </div>
      )}
    </div>
  );
}