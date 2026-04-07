import { useState, useEffect, useRef, useCallback } from 'react';

const OBJECT_TYPES = {
  lamp: { emoji: '🪔', label: 'lamp' },
  briefcase: { emoji: '💼', label: 'briefcase' },
  owl: { emoji: '🦉', label: 'ceramic owl' },
  shoe: { emoji: '👟', label: 'shoe' },
  clock: { emoji: '🕰️', label: 'clock' },
  vase: { emoji: '🏺', label: 'vase' },
  chair: { emoji: '🪑', label: 'chair' },
  globe: { emoji: '🌍', label: 'globe' },
  teacup: { emoji: '🍵', label: 'teacup' },
  mirror: { emoji: '🪞', label: 'mirror' },
  plant: { emoji: '🌿', label: 'plant' },
  book: { emoji: '📕', label: 'book' },
};

const CAPTIONS = {
  lamp: [
    "This lamp fell because you left a room in 2019 without saying goodbye to it. It has been falling since.",
    "The lamp remembers the exact temperature of your hand on its switch. You never touched it again.",
    "It illuminated seventeen of your worst decisions. You thanked the ceiling.",
    "The lamp has had time to think. It believes you always preferred the dark.",
    "At this velocity, the lamp calculates it will reach your level of emotional availability in approximately never.",
  ],
  briefcase: [
    "This briefcase fell when you stopped pretending to be the person who carries briefcases.",
    "It contains documents you were going to deal with. It is still waiting. It has learned patience from the fall.",
    "The briefcase knew before you did. That's why it let go.",
    "Inside: seventeen unread emails, two ambitions, and a granola bar from 2021 that has achieved enlightenment.",
    "The briefcase does not blame you. That is somehow worse.",
  ],
  owl: [
    "This ceramic owl fell because you donated it to a charity shop and told yourself it was generosity.",
    "The owl watched you from a shelf for four years. You never once asked its name.",
    "It was a gift from someone who loved you carefully. You called it 'that owl thing.'",
    "The owl has been rotating for a long time. It has now seen every angle of your absence.",
    "It was made by hand. The hands miss it. You do not.",
  ],
  shoe: [
    "This shoe fell because its pair is still by the door of somewhere you no longer live.",
    "You wore it to an event you said you'd remember. You do not remember the event.",
    "The shoe held the shape of your foot long after you left it. This is more loyalty than you showed it.",
    "It walked you to a decision you've never fully admitted to making.",
    "The shoe knows the exact weight of your hesitation. It catalogued it with every step.",
  ],
  clock: [
    "This clock fell because you stopped checking it when the days began to feel the same.",
    "It measured fourteen months of your life that you have described as 'a weird period.'",
    "The clock is still ticking. You simply chose not to listen.",
    "Every second it counted, you were somewhere else. It counted anyway. That is its tragedy.",
    "Time fell with it. You didn't notice. This is the most accurate thing about you.",
  ],
  vase: [
    "This vase fell because the flowers you put in it died and you left the water in anyway.",
    "It held things you received but did not deserve. It did this without complaint.",
    "You bought it at a market on a day you called 'spontaneous.' You haven't been spontaneous since.",
    "The vase is empty now. It has always been empty. Even when it wasn't.",
    "It is falling in the direction of everyone who ever gave you flowers.",
  ],
  chair: [
    "This chair fell because you sat in it every day for a year and never once noticed it.",
    "It held you through seventeen phone calls you should have made in person.",
    "The chair supported weight you never acknowledged. It finds this very on-brand.",
    "Someone sat across from you in a chair like this and told you something important. You were on your phone.",
    "It is falling toward a floor that does not exist. It finds this deeply relatable.",
  ],
  globe: [
    "This globe fell because you pointed to places you were going to go and then did not go.",
    "It contains countries you mispronounced confidently at dinner parties.",
    "The globe has been rotating since before you were born. You interrupted this with your ambitions.",
    "You spun it once and said 'wherever my finger lands.' Your finger landed. You did not go.",
    "The globe knows where you actually went. It is not impressed.",
  ],
  teacup: [
    "This teacup fell because you made tea and forgot about it until it was cold, then poured it out, then felt guilty.",
    "It held the last hot thing in a relationship you described as 'fine, actually.'",
    "The teacup was part of a set. The set is no longer a set. You did this.",
    "Someone made you tea in a cup like this. You said 'thank you' and meant 'I am leaving.'",
    "It is a very small fall. The teacup is used to being minimized.",
  ],
  mirror: [
    "This mirror fell because you looked into it and made a decision you still haven't told anyone about.",
    "It reflected you accurately. You found this unacceptable.",
    "The mirror has seen every version of you getting ready to be someone else.",
    "It broke in a different house. You said seven years bad luck. You counted. You know.",
    "The mirror is falling face-down. Even it needs a break from you.",
  ],
  plant: [
    "This plant fell because you watered it too much when you were anxious and not at all when you were fine.",
    "It was alive when you got it. You took this personally.",
    "The plant tried very hard. You described it as 'low maintenance.' It was not low maintenance.",
    "It photosynthesized your ambient guilt for three years. It became very large.",
    "The plant is falling toward light it will never reach. It has been doing this its whole life, actually.",
  ],
  book: [
    "This book fell because you told people you'd read it and then did not read it.",
    "It contains an underlined sentence from 2017 that you have never revisited but think about constantly.",
    "The book was recommended by someone you were trying to impress. You impressed no one.",
    "You got to page 47. Something happened. You never went back. The book is still on page 47.",
    "It is falling spine-first. It wants you to know what it feels like.",
  ],
};

const GENEALOGY_CAPTIONS = [
  (a, b) => `This object was born from the collision of ${a} and ${b}. It inherited both their grievances and none of their charm.`,
  (a, b) => `When ${a} met ${b} in freefall, something new was created. It arrived already disappointed.`,
  (a, b) => `The ${a} and the ${b} collided in a moment you were not watching. This is the result. It blames you for the circumstances of its birth.`,
  (a, b) => `Born of impact. The ${a} brought resentment. The ${b} brought unfinished business. This object carries both like luggage.`,
];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getRandomType() {
  const types = Object.keys(OBJECT_TYPES);
  return types[Math.floor(Math.random() * types.length)];
}

function createInitialObject(type, x, y, scale) {
  return {
    id: generateId(),
    type,
    x,
    y,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0,
    rotation: (Math.random() - 0.5) * 60,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    falling: false,
    fallDuration: 0,
    captionStage: 0,
    scale,
    opacity: 1,
    wobble: 0,
    wobbleDir: 1,
    isChild: false,
    genealogy: null,
    collided: false,
  };
}

export default function Page() {
  const [objects, setObjects] = useState([]);
  const [fallingCount, setFallingCount] = useState(0);
  const [activeCaption, setActiveCaption] = useState(null);
  const animRef = useRef(null);
  const objectsRef = useRef([]);
  const fallingCountRef = useRef(0);
  const lastTimeRef = useRef(null);
  const captionTimersRef = useRef({});

  useEffect(() => {
    const initial = [
      createInitialObject('lamp', 20, 25, 1.6),
      createInitialObject('briefcase', 55, 15, 1.2),
      createInitialObject('owl', 75, 35, 1.0),
      createInitialObject('shoe', 35, 55, 0.9),
      createInitialObject('clock', 65, 60, 1.3),
      createInitialObject('vase', 15, 65, 0.8),
      createInitialObject('chair', 80, 20, 1.5),
      createInitialObject('globe', 45, 40, 1.1),
    ];
    objectsRef.current = initial;
    setObjects([...initial]);
  }, []);

  const spawnChildObject = useCallback((objA, objB) => {
    const types = Object.keys(OBJECT_TYPES);
    const childType = types[Math.floor(Math.random() * types.length)];
    const childX = (objA.x + objB.x) / 2 + (Math.random() - 0.5) * 10;
    const childY = (objA.y + objB.y) / 2 + (Math.random() - 0.5) * 10;
    const childScale = (objA.scale + objB.scale) / 2 + (Math.random() - 0.5) * 0.3;
    const genealogyFn = GENEALOGY_CAPTIONS[Math.floor(Math.random() * GENEALOGY_CAPTIONS.length)];
    const child = {
      ...createInitialObject(childType, Math.max(5, Math.min(90, childX)), Math.max(5, Math.min(85, childY)), Math.max(0.6, Math.min(2.0, childScale))),
      falling: true,
      vy: 0.15,
      vx: (Math.random() - 0.5) * 0.4,
      rotationSpeed: (Math.random() - 0.5) * 1.2,
      isChild: true,
      genealogy: genealogyFn(OBJECT_TYPES[objA.type].label, OBJECT_TYPES[objB.type].label),
    };
    return child;
  }, []);

  useEffect(() => {
    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(timestamp - lastTimeRef.current, 50);
      lastTimeRef.current = timestamp;

      let changed = false;
      let newObjects = [];
      const collidedPairs = new Set();

      const updated = objectsRef.current.map(obj => {
        if (!obj.falling) {
          const newWobble = obj.wobble + obj.wobbleDir * 0.02;
          const newDir = (Math.abs(newWobble) > 1.5) ? -obj.wobbleDir : obj.wobbleDir;
          if (newWobble !== obj.wobble) {
            changed = true;
            return { ...obj, wobble: newWobble, wobbleDir: newDir };
          }
          return obj;
        }

        const gravity = 0.018;
        const newVy = obj.vy + gravity * (dt / 16);
        const newVx = obj.vx * 0.999;
        const newX = obj.x + newVx * (dt / 16);
        const newY = obj.y + newVy * (dt / 16);
        const newRotation = obj.rotation + obj.rotationSpeed * (dt / 16);
        const newFallDuration = obj.fallDuration + dt;

        changed = true;
        return {
          ...obj,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation,
          fallDuration: newFallDuration,
        };
      }).filter(obj => obj.y < 130);

      const fallingObjs = updated.filter(o => o.falling && !o.collided);
      for (let i = 0; i < fallingObjs.length; i++) {
        for (let j = i + 1; j < fallingObjs.length; j++) {
          const a = fallingObjs[i];
          const b = fallingObjs[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = (a.scale + b.scale) * 4;
          const pairKey = [a.id, b.id].sort().join('|');
          if (dist < threshold && !collidedPairs.has(pairKey)) {
            collidedPairs.add(pairKey);
            if (Math.random() < 0.3) {
              const child = spawnChildObject(a, b);
              newObjects.push(child);
              fallingCountRef.current += 1;
              setFallingCount(fallingCountRef.current);
            }
            const aIdx = updated.findIndex(o => o.id === a.id);
            const bIdx = updated.findIndex(o => o.id === b.id);
            if (aIdx !== -1) updated[aIdx] = { ...updated[aIdx], collided: true };
            if (bIdx !== -1) updated[bIdx] = { ...updated[bIdx], collided: true };
          }
        }
      }

      if (newObjects.length > 0 || changed) {
        const combined = [...updated, ...newObjects];
        objectsRef.current = combined;
        setObjects([...combined]);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [spawnChildObject]);

  const handleObjectClick = useCallback((e, objId) => {
    e.stopPropagation();
    const obj = objectsRef.current.find(o => o.id === objId);
    if (!obj) return;

    if (!obj.falling) {
      fallingCountRef.current += 1;
      setFallingCount(fallingCountRef.current);

      const updated = objectsRef.current.map(o =>
        o.id === objId
          ? { ...o, falling: true, vy: 0.1, vx: (Math.random() - 0.5) * 0.5, rotationSpeed: (Math.random() - 0.5) * 1.5, captionStage: 0 }
          : o
      );
      objectsRef.current = updated;
      setObjects([...updated]);

      const captions = CAPTIONS[obj.type] || CAPTIONS.lamp;
      setActiveCaption({ objectId: objId, text: captions[0], stage: 0 });

      if (captionTimersRef.current[objId]) clearInterval(captionTimersRef.current[objId]);
      let stage = 0;
      captionTimersRef.current[objId] = setInterval(() => {
        stage++;
        const capts = CAPTIONS[obj.type] || CAPTIONS.lamp;
        if (stage >= capts.length) {
          clearInterval(captionTimersRef.current[objId]);
          return;
        }
        const currentObj = objectsRef.current.find(o => o.id === objId);
        if (!currentObj) {
          clearInterval(captionTimersRef.current[objId]);
          return;
        }
        const nextUpdated = objectsRef.current.map(o =>
          o.id === objId ? { ...o, captionStage: stage } : o
        );
        objectsRef.current = nextUpdated;
        setActiveCaption({ objectId: objId, text: capts[stage], stage });
      }, 4000);
    } else {
      const captions = obj.isChild && obj.genealogy
        ? [obj.genealogy, "It does not know why it exists. Neither do you.", "It has been falling since before it had a name.", "The collision that created it was inevitable. Like most disasters.", "It forgives neither of its parents. It certainly does not forgive you."]
        : (CAPTIONS[obj.type] || CAPTIONS.lamp);
      const nextStage = Math.min(obj.captionStage + 1, captions.length - 1);
      const updated = objectsRef.current.map(o =>
        o.id === objId ? { ...o, captionStage: nextStage } : o
      );
      objectsRef.current = updated;
      setObjects([...updated]);
      setActiveCaption({ objectId: objId, text: captions[nextStage], stage: nextStage });
    }
  }, []);

  const gridLines = [];
  const vpX = 50;
  const vpY = 40;
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const startX = t * 100;
    gridLines.push({ x1: startX, y1: 100, x2: vpX, y2: vpY, opacity: 0.06 + t * 0.02 });
  }
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const startY = 50 + t * 50;
    gridLines.push({ x1: 0, y1: startY, x2: 100, y2: startY, opacity: 0.04 + (1 - t) * 0.04 });
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#f8f7f5',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'default',
      fontFamily: 'Georgia, serif',
    }}>
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>

      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={`${line.x1}%`} y1={`${line.y1}%`}
            x2={`${line.x2}%`} y2={`${line.y2}%`}
            stroke="#1a1a1a"
            strokeWidth="0.15"
            opacity={line.opacity}
          />
        ))}
        <circle cx="50%" cy="40%" r="0.4%" fill="#1a1a1a" opacity="0.08" />
      </svg>

      <div style={{
        position: 'fixed',
        top: '24px',
        left: '28px',
        zIndex: 100,
        fontFamily: 'Courier New, monospace',
        fontSize: '11px',
        color: '#2a2a2a',
        letterSpacing: '0.05em',
        lineHeight: 1.8,
        animation: 'pulse 3s ease-in-out infinite',
      }}>
        <div style={{ color: '#666', fontSize: '9px', letterSpacing: '0.15em', marginBottom: '4px' }}>
          OBJECTS CURRENTLY FALLING ON YOUR BEHALF
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: 1 }}>
          {fallingCount}
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '28px',
        zIndex: 100,
        fontFamily: 'Georgia, serif',
        fontSize: '10px',
        color: '#aaa',
        fontStyle: 'italic',
        textAlign: 'right',
        maxWidth: '200px',
        lineHeight: 1.6,
      }}>
        click an object to release it<br />
        <span style={{ fontSize: '9px', color: '#ccc' }}>the floor is theoretical</span>
      </div>

      {objects.map(obj => {
        const typeData = OBJECT_TYPES[obj.type];
        const captions = obj.isChild && obj.genealogy
          ? [obj.genealogy, "It does not know why it exists. Neither do you.", "It has been falling since before it had a name.", "The collision that created it was inevitable. Like most disasters.", "It forgives neither of its parents. It certainly does not forgive you."]
          : (CAPTIONS[obj.type] || CAPTIONS.lamp);
        const captionText = captions[Math.min(obj.captionStage, captions.length - 1)];
        const isActive = activeCaption && activeCaption.objectId === obj.id;
        const wobbleRotation = !obj.falling ? Math.sin(obj.wobble) * 3 : 0;
        const fontSize = Math.round(24 * obj.scale);

        return (
          <div
            key={obj.id}
            onClick={(e) => handleObjectClick(e, obj.id)}
            style={{
              position: 'absolute',
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: `translate(-50%, -50%) rotate(${obj.rotation + wobbleRotation}deg)`,
              cursor: 'pointer',
              userSelect: 'none',
              zIndex: Math.round(obj.scale * 10),
              transition: obj.falling ? 'none' : 'transform 0.1s ease',
            }}
          >
            <div style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              filter: obj.falling
                ? `drop-shadow(0 ${Math.min(obj.fallDuration / 200, 8)}px ${Math.min(obj.fallDuration / 100, 12)}px rgba(0,0,0,0.12))`
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
            }}>
              {typeData.emoji}
            </div>

            {isActive && (
              <div style={{
                position: 'absolute',
                top: `${fontSize + 8}px`,
                left: '50%',
                transform: 'translateX(-50%) rotate(' + (-(obj.rotation + wobbleRotation)) + 'deg)',
                width: '180px',
                background: 'rgba(248,247,245,0.95)',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '10px 14px',
                fontFamily: 'Georgia, serif',
                fontSize: '11px',
                fontStyle: 'italic',
                color: '#2a2a2a',
                lineHeight: 1.7,
                textAlign: 'center',
                animation: 'floatIn 0.4s ease forwards',
                zIndex: 200,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                pointerEvents: 'none',
              }}>
                {captionText}
                {obj.captionStage < captions.length - 1 && (
                  <div style={{ marginTop: '8px', fontSize: '9px', color: '#bbb', fontStyle: 'normal', letterSpacing: '0.1em' }}>
                    click again to continue
                  </div>
                )}
              </div>
            )}

            {!obj.falling && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${fontSize * 2}px`,
                height: `${fontSize * 2}px`,
                borderRadius: '50%',
                background: 'transparent',
                cursor: 'pointer',
              }} />
            )}
          </div>
        );
      })}

      {objects.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ccc',
          fontStyle: 'italic',
          fontSize: '13px',
          fontFamily: 'Georgia, serif',
        }}>
          everything is still for now
        </div>
      )}
    </div>
  );
}