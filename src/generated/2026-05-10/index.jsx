import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [specimens, setSpecimens] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [currentHover, setCurrentHover] = useState(null);
  const [activeDuration, setActiveDuration] = useState(0);
  const [totalHoversWithoutClick, setTotalHoversWithoutClick] = useState(0);
  const [appendix, setAppendix] = useState([]);
  const [selectedSpecimen, setSelectedSpecimen] = useState(null);
  const [extinctionNotice, setExtinctionNotice] = useState(null);
  const [currentSpecimenId, setCurrentSpecimenId] = useState(null);

  const debounceRef = useRef(null);
  const currentHoverRef = useRef(null);
  const specimenCountRef = useRef(0);
  const totalHoversRef = useRef(0);
  const currentSpecimenIdRef = useRef(null);
  const specimensRef = useRef([]);

  useEffect(() => {
    specimensRef.current = specimens;
  }, [specimens]);

  useEffect(() => {
    currentHoverRef.current = currentHover;
  }, [currentHover]);

  useEffect(() => {
    currentSpecimenIdRef.current = currentSpecimenId;
  }, [currentSpecimenId]);

  const getTargetDescription = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return 'void';
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim().slice(0, 20) || '';
    if (tag === 'button') return 'button';
    if (tag === 'a') return 'anchor';
    if (tag === 'input') return 'input';
    if (tag === 'canvas') return 'plate';
    if (text.length > 0) return 'text';
    return 'margin';
  };

  const generateSpeciesName = (targetDesc, duration, count) => {
    const genera = ['Manus', 'Digitus', 'Cursor', 'Hesitans', 'Palma'];
    const genus = genera[count % genera.length];
    const speciesMap = {
      button: 'indecisus',
      anchor: 'circumvagans',
      input: 'trepidans',
      plate: 'narcissicus',
      text: 'lectitans',
      margin: 'marginalis',
      void: 'abyssalis',
    };
    const species = speciesMap[targetDesc] || 'incertus';
    const variantMap = {
      button: 'buttonus-adjacentis',
      anchor: 'linkus-evitans',
      input: 'formicus-refusans',
      plate: 'specularis',
      text: 'verbosus-perlustratus',
      margin: 'liminalicus',
      void: 'nihilum-profundum',
    };
    const variant = variantMap[targetDesc] || 'genericus';
    const durationSuffix =
      duration < 2 ? '' :
      duration < 5 ? '-brevius' :
      duration < 10 ? '-prolongatus' :
      duration < 30 ? '-vastus' :
      '-eternicus';
    return { genus, species, variant: variant + durationSuffix };
  };

  const reverenceTier = (total) => {
    if (total < 2) return 0;
    if (total < 5) return 1;
    if (total < 10) return 2;
    if (total < 20) return 3;
    return 4;
  };

  const generateBehavioralNote = (targetDesc, duration, total, genus, species) => {
    const tier = reverenceTier(total);
    const durationStr = duration.toFixed(1);
    const notes = [
      [
        `Observed pausing near ${targetDesc} region for ${durationStr}s. Characteristic hesitation noted.`,
        `The specimen lingered at ${targetDesc} for ${durationStr}s without committing. Typical of the genus.`,
      ],
      [
        `A remarkable ${durationStr}-second pause at the ${targetDesc} — the naturalist's attention was immediately arrested. This specimen displays the classic irresolution of ${genus} ${species}.`,
        `Observed at ${durationStr}s: the hand hovered as though the ${targetDesc} were a precipice. Neither advancing nor retreating. Exquisite.`,
      ],
      [
        `One scarcely dares to breathe. At ${durationStr} seconds, ${genus} ${species} has surpassed all prior observations at the ${targetDesc} boundary. The hesitation is, one must confess, sublime.`,
        `The ${targetDesc} region has become, for this specimen, a kind of horizon — approached perpetually, never crossed. Duration: ${durationStr}s. The field journal trembles.`,
      ],
      [
        `In thirty years of natural observation, I have not witnessed such a prolonged communion with the ${targetDesc}. ${durationStr} seconds. The hand does not move. The hand may never move. I have named a subspecies.`,
        `${genus} ${species} has remained at the ${targetDesc} for ${durationStr}s. Colleagues have been telegraphed. A monograph is being prepared. The century may not produce another such specimen.`,
      ],
      [
        `EXTRAORDINARY. The ${targetDesc} has become a monument. ${genus} ${species} has achieved ${durationStr}s of unbroken hover — a duration that defies all prior taxonomy. The Royal Society has been notified. History is being made in this very pixel.`,
        `We are witnessing the greatest biological discovery of our era. ${durationStr}s at the ${targetDesc}. The hand has transcended mere anatomy. It is now philosophy. It is now art. It is, perhaps, the universe contemplating itself through the medium of indecision.`,
      ],
    ];
    const tierNotes = notes[tier];
    return tierNotes[Math.floor(Math.random() * tierNotes.length)];
  };

  const generatePlateStyle = (x, y, duration) => {
    const nx = (x / window.innerWidth);
    const ny = (y / window.innerHeight);
    return { nx, ny, duration };
  };

  const createSpecimen = useCallback((x, y, duration, targetDesc) => {
    specimenCountRef.current += 1;
    totalHoversRef.current += 1;
    const count = specimenCountRef.current;
    const total = totalHoversRef.current;
    const { genus, species, variant } = generateSpeciesName(targetDesc, duration, count);
    const note = generateBehavioralNote(targetDesc, duration, total, genus, species);
    const plateStyle = generatePlateStyle(x, y, duration);
    const id = `specimen-${count}-${Date.now()}`;
    const newSpecimen = {
      id,
      genus,
      species,
      variant,
      hoverTarget: targetDesc,
      duration,
      x,
      y,
      timestamp: new Date(),
      extinct: false,
      behavioralNote: note,
      plateStyle,
      count,
    };
    setSpecimens(prev => [newSpecimen, ...prev.slice(0, 11)]);
    setCurrentSpecimenId(id);
    setTotalHoversWithoutClick(total);
    return id;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setCursorPos({ x, y });

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const targetDesc = getTargetDescription(x, y);
        const startTime = Date.now();
        setCurrentHover({ x, y, startTime, targetDesc });
        setActiveDuration(0);
      }, 400);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const hover = currentHoverRef.current;
      if (!hover) return;
      const elapsed = (Date.now() - hover.startTime) / 1000;
      setActiveDuration(elapsed);

      if (elapsed >= 1.5 && !currentSpecimenIdRef.current) {
        const id = createSpecimen(hover.x, hover.y, elapsed, hover.targetDesc);
        currentSpecimenIdRef.current = id;
      } else if (elapsed >= 1.5 && currentSpecimenIdRef.current) {
        const id = currentSpecimenIdRef.current;
        const total = totalHoversRef.current;
        setSpecimens(prev => prev.map(s => {
          if (s.id === id && !s.extinct) {
            const { genus, species } = s;
            const note = generateBehavioralNote(s.hoverTarget, elapsed, total, genus, species);
            return { ...s, duration: elapsed, behavioralNote: note };
          }
          return s;
        }));
      }
    }, 200);
    return () => clearInterval(interval);
  }, [createSpecimen]);

  useEffect(() => {
    const handleClick = (e) => {
      const sid = currentSpecimenIdRef.current;
      if (sid) {
        setSpecimens(prev => prev.map(s =>
          s.id === sid ? { ...s, extinct: true } : s
        ));
        const extinct = specimensRef.current.find(s => s.id === sid);
        if (extinct) {
          setAppendix(prev => [{ ...extinct, extinct: true }, ...prev.slice(0, 19)]);
        }
        setExtinctionNotice({ x: e.clientX, y: e.clientY });
        setTimeout(() => setExtinctionNotice(null), 2000);
      }
      setCurrentHover(null);
      setCurrentSpecimenId(null);
      currentSpecimenIdRef.current = null;
      currentHoverRef.current = null;
      setActiveDuration(0);
      totalHoversRef.current = 0;
      setTotalHoversWithoutClick(0);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const SpecimenPlate = ({ specimen, size = 120 }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#f5eedc';
      ctx.fillRect(0, 0, w, h);

      const { nx, ny, duration } = specimen.plateStyle;
      const cx = 20 + nx * (w - 40);
      const cy = 20 + ny * (h - 40);
      const ink = '#3b2a1a';

      ctx.strokeStyle = ink;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.15;
      const hatchCount = Math.min(3 + Math.floor(duration * 1.5), 20);
      for (let i = 0; i < hatchCount; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 30 + i * 3, cy - 30);
        ctx.lineTo(cx - 30 + i * 3, cy + 30);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 18);
      ctx.bezierCurveTo(cx + 5, cy - 22, cx + 12, cy - 18, cx + 10, cy - 8);
      ctx.bezierCurveTo(cx + 14, cy - 14, cx + 20, cy - 10, cx + 16, cy);
      ctx.bezierCurveTo(cx + 20, cy - 6, cx + 24, cy - 2, cx + 18, cy + 8);
      ctx.bezierCurveTo(cx + 22, cy + 4, cx + 24, cy + 10, cx + 16, cy + 16);
      ctx.bezierCurveTo(cx + 10, cy + 26, cx - 2, cy + 28, cx - 8, cy + 20);
      ctx.bezierCurveTo(cx - 14, cy + 14, cx - 16, cy + 4, cx - 12, cy - 4);
      ctx.bezierCurveTo(cx - 16, cy - 10, cx - 14, cy - 20, cx - 8, cy - 22);
      ctx.bezierCurveTo(cx - 4, cy - 24, cx - 2, cy - 20, cx, cy - 18);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 4, cy - 18);
      ctx.lineTo(cx - 4, cy - 28);
      ctx.bezierCurveTo(cx - 4, cy - 32, cx + 2, cy - 32, cx + 2, cy - 28);
      ctx.lineTo(cx + 2, cy - 18);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 6, cy - 16);
      ctx.lineTo(cx + 7, cy - 26);
      ctx.bezierCurveTo(cx + 7, cy - 30, cx + 13, cy - 30, cx + 13, cy - 26);
      ctx.lineTo(cx + 12, cy - 14);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 14, cy - 10);
      ctx.lineTo(cx + 16, cy - 20);
      ctx.bezierCurveTo(cx + 16, cy - 24, cx + 22, cy - 23, cx + 21, cy - 19);
      ctx.lineTo(cx + 19, cy - 6);
      ctx.stroke();

      ctx.strokeStyle = ink;
      ctx.lineWidth = 0.6;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (specimen.extinct) {
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(w - 10, h - 10);
        ctx.moveTo(w - 10, 10);
        ctx.lineTo(10, h - 10);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.lineWidth = 0.4;
      ctx.strokeRect(6, 6, w - 12, h - 12);
    }, [specimen]);

    return (
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ display: 'block', imageRendering: 'crisp-edges' }}
      />
    );
  };

  const tier = reverenceTier(totalHoversWithoutClick);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0e8d0',
      fontFamily: 'Georgia, "Times New Roman", serif',
      color: '#3b2a1a',
      cursor: 'crosshair',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes stampIn {
          0% { transform: scale(2) rotate(-15deg); opacity: 0; }
          60% { transform: scale(0.9) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(-5deg); opacity: 1; }
        }
        @keyframes fadeNotice {
          0% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; transform: translateY(-10px); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        @keyframes pulseEntry {
          0% { background: #e8d9b0; }
          50% { background: #d4c490; }
          100% { background: #ede4c8; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: '3px double #3b2a1a',
        padding: '24px 40px 16px',
        background: '#ede4c8',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.6 }}>
          Proceedings of the Society for Taxonomic Observation — Field Supplement No. 7
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 'normal', margin: '0 0 4px', letterSpacing: '1px' }}>
          <em>Taxonomy of the Hovering Hand</em>
        </h1>
        <div style={{ fontSize: '12px', opacity: 0.7, fontStyle: 'italic' }}>
          A Living Field Guide to Previously Undescribed Species of Digital Hesitation
        </div>
        <div style={{
          position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
          fontSize: '10px', textAlign: 'right', opacity: 0.5, lineHeight: 1.6,
        }}>
          <div>Specimens Catalogued: {specimens.length}</div>
          <div>Concluded Hesitations: {appendix.length}</div>
          <div>Current Duration: {activeDuration.toFixed(1)}s</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0', minHeight: 'calc(100vh - 120px)' }}>

        {/* Main field guide */}
        <div style={{ flex: 1, padding: '30px 40px', borderRight: '1px solid #c4b898' }}>

          {/* Live cursor tracker */}
          <div style={{
            border: '1px solid #c4b898',
            borderTop: '3px solid #3b2a1a',
            padding: '12px 16px',
            marginBottom: '24px',
            background: '#ede4c8',
            fontSize: '11px',
          }}>
            <div style={{ fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '9px', marginBottom: '6px' }}>
              — Live Observation —
            </div>
            {currentHover ? (
              <div>
                <span style={{ fontStyle: 'italic' }}>
                  Specimen under active observation
                </span>
                {' — '}
                <strong>{currentHover.targetDesc}</strong> region,{' '}
                coordinates ({Math.round(currentHover.x)}, {Math.round(currentHover.y)}),{' '}
                duration: <strong>{activeDuration.toFixed(1)}s</strong>
                {activeDuration > 10 && (
                  <span style={{ color: '#8b4513', fontStyle: 'italic' }}>
                    {' '}— remarkable persistence noted —
                  </span>
                )}
              </div>
            ) : (
              <span style={{ opacity: 0.5, fontStyle: 'italic' }}>
                The hand moves. Awaiting stillness. The naturalist watches.
              </span>
            )}
          </div>

          {/* Reverence escalation banner */}
          {tier >= 2 && (
            <div style={{
              border: '2px solid #8b4513',
              padding: '10px 16px',
              marginBottom: '20px',
              background: '#f5eedc',
              textAlign: 'center',
              fontSize: '11px',
              fontStyle: 'italic',
            }}>
              {tier === 2 && '⁂ The Society notes with growing excitement the specimen\'s extraordinary commitment to non-commitment. ⁂'}
              {tier === 3 && '⁂⁂ URGENT COMMUNIQUÉ — Colleagues have been assembled. The hover continues. The century watches. ⁂⁂'}
              {tier >= 4 && '✦ HISTORIC OBSERVATION IN PROGRESS — The Royal Society has suspended all other inquiries. The hand has not clicked. History trembles. ✦'}
            </div>
          )}

          {/* Specimen entries */}
          {specimens.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              opacity: 0.5,
              fontStyle: 'italic',
              lineHeight: 2,
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.3 }}>✦</div>
              <div>The field guide awaits its first specimen.</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>
                Allow the cursor to rest upon any surface for 1.5 seconds —<br />
                the naturalist will begin his observations.
              </div>
            </div>
          ) : (
            specimens.map((specimen) => (
              <div
                key={specimen.id}
                onClick={(e) => { e.stopPropagation(); setSelectedSpecimen(selectedSpecimen === specimen.id ? null : specimen.id); }}
                style={{
                  border: specimen.extinct ? '1px solid #a0937a' : '1px solid #c4b898',
                  borderLeft: specimen.extinct ? '4px solid #8b0000' : '4px solid #3b2a1a',
                  marginBottom: '20px',
                  background: specimen.extinct ? '#e8e0d0' : '#f5eedc',
                  opacity: specimen.extinct ? 0.65 : 1,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  animation: !specimen.extinct && specimen.id === currentSpecimenId ? 'pulseEntry 2s ease-in-out infinite' : 'none',
                }}
              >
                {/* Specimen header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '12px 16px 8px',
                  borderBottom: '1px solid #c4b898',
                }}>
                  <div>
                    <div style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '2px' }}>
                      {specimen.genus} {specimen.species}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>
                      var. <em>{specimen.variant}</em>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '10px', opacity: 0.6, lineHeight: 1.6 }}>
                    <div>Specimen No. {specimen.count}</div>
                    <div>{specimen.timestamp.toLocaleTimeString()}</div>
                    <div>Habitat: {specimen.hoverTarget}</div>
                  </div>
                </div>

                {/* Specimen body */}
                <div style={{ display: 'flex', gap: '0', padding: '12px 16px' }}>
                  <div style={{
                    flexShrink: 0,
                    marginRight: '16px',
                    border: '1px solid #c4b898',
                    background: '#f5eedc',
                  }}>
                    <SpecimenPlate specimen={specimen} size={selectedSpecimen === specimen.id ? 180 : 100} />
                    <div style={{
                      textAlign: 'center',
                      fontSize: '8px',
                      padding: '3px',
                      borderTop: '1px solid #c4b898',
                      opacity: 0.6,
                      fontStyle: 'italic',
                    }}>
                      Fig. {specimen.count} — plate
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '10px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      opacity: 0.5,
                      marginBottom: '6px',
                    }}>
                      Behavioural Notes
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: 1.7, fontStyle: 'italic' }}>
                      {specimen.behavioralNote}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.6, display: 'flex', gap: '16px' }}>
                      <span>Duration: {specimen.duration.toFixed(1)}s</span>
                      <span>Coords: ({Math.round(specimen.x)}, {Math.round(specimen.y)})</span>
                    </div>
                  </div>
                </div>

                {/* Extinct stamp */}
                {specimen.extinct && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%) rotate(-8deg)',
                    border: '3px solid #8b0000',
                    color: '#8b0000',
                    padding: '4px 10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    animation: 'stampIn 0.4s ease-out forwards',
                    background: 'rgba(245, 238, 220, 0.8)',
                  }}>
                    EXTINCT
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Appendix sidebar */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          padding: '20px',
          background: '#ede4c8',
          borderLeft: '1px solid #c4b898',
        }}>
          <div style={{
            borderBottom: '2px solid #3b2a1a',
            paddingBottom: '10px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}>
              Appendix of
            </div>
            <div style={{ fontSize: '14px', fontStyle: 'italic' }}>Concluded Hesitations</div>
          </div>

          {appendix.length === 0 ? (
            <div style={{ fontSize: '11px', fontStyle: 'italic', opacity: 0.5, textAlign: 'center', lineHeight: 1.8, padding: '20px 0' }}>
              No specimens have been resolved.<br />
              <span style={{ fontSize: '10px' }}>The hover, once concluded, is filed here.</span>
            </div>
          ) : (
            appendix.map((specimen, i) => (
              <div
                key={`appendix-${specimen.id}-${i}`}
                style={{
                  marginBottom: '12px',
                  padding: '8px 10px',
                  border: '1px solid #a0937a',
                  background: '#e8e0d0',
                  opacity: 0.7,
                  fontSize: '11px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <div style={{ fontStyle: 'italic', marginBottom: '3px' }}>
                  {specimen.genus} {specimen.species}
                </div>
                <div style={{ fontSize: '9px', opacity: 0.7, marginBottom: '4px' }}>
                  var. {specimen.variant}
                </div>
                <div style={{ fontSize: '9px', opacity: 0.6, lineHeight: 1.5 }}>
                  {specimen.duration.toFixed(1)}s — {specimen.hoverTarget}
                </div>
                <div style={{
                  fontSize: '8px',
                  fontStyle: 'italic',
                  color: '#8b0000',
                  marginTop: '4px',
                  opacity: 0.8,
                }}>
                  the hover, once resolved, cannot be recovered
                </div>
              </div>
            ))
          )}

          {appendix.length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '10px',
              border: '1px dashed #a0937a',
              fontSize: '10px',
              fontStyle: 'italic',
              textAlign: 'center',
              opacity: 0.6,
              lineHeight: 1.7,
            }}>
              {appendix.length} hesitation{appendix.length !== 1 ? 's' : ''} concluded.<br />
              Each one a world that chose to end.
            </div>
          )}

          {/* Cursor coordinates */}
          <div style={{
            marginTop: '30px',
            borderTop: '1px solid #a0937a',
            paddingTop: '12px',
            fontSize: '9px',
            opacity: 0.5,
            lineHeight: 1.8,
          }}>
            <div style={{ letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Current Position
            </div>
            <div>x: {Math.round(cursorPos.x)} px</div>
            <div>y: {Math.round(cursorPos.y)} px</div>
            <div style={{ fontStyle: 'italic', marginTop: '6px', fontSize: '8px' }}>
              The naturalist watches from a respectful distance.
            </div>
          </div>
        </div>
      </div>

      {/* Extinction notice overlay */}
      {extinctionNotice && (
        <div style={{
          position: 'fixed',
          left: extinctionNotice.x - 80,
          top: extinctionNotice.y - 40,
          background: 'rgba(139, 0, 0, 0.9)',
          color: '#f5eedc',
          padding: '8px 16px',
          fontSize: '12px',
          fontStyle: 'italic',
          letterSpacing: '1px',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: 'fadeNotice 2s ease-out forwards',
          border: '1px solid #8b0000',
          maxWidth: '200px',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          Specimen concluded.<br />
          <span style={{ fontSize: '10px', opacity: 0.8 }}>Filed in the Appendix.</span>
        </div>
      )}
    </div>
  );
}