import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const autoScoreRef = useRef(null);
  const startTimeRef = useRef(null);

  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [conductorScore, setConductorScore] = useState(null);
  const [harmonizing, setHarmonizing] = useState(false);
  const [dispersing, setDispersing] = useState(false);
  const [chordLabel, setChordLabel] = useState('');
  const [hoveredMember, setHoveredMember] = useState(null);
  const [memberOffsets, setMemberOffsets] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [conductorBowing, setConductorBowing] = useState(false);

  const phenomena = [
    {
      id: 'fluorescent',
      label: 'The Fluorescent Deciding',
      x: 12, y: 20,
      complaint: 'I have been almost-flickering since the Garfield administration and no one has filed the paperwork. The form exists. I have seen it. It is on the third shelf.',
      lyric: '...almost... almost... still almost...',
      noteColor: '#c8a84b',
      shape: '60% 40% 55% 45% / 50% 60% 40% 50%',
    },
    {
      id: 'unopened_mail',
      label: 'The Weight of Unopened Mail',
      x: 72, y: 18,
      complaint: 'I am heavier than I appear. I contain a bill dated March and two things that are probably fine. The scale does not register this kind of weight. I have written to the Bureau.',
      lyric: 'probably fine, probably fine, March...',
      noteColor: '#7a6b8a',
      shape: '45% 55% 40% 60% / 60% 40% 55% 45%',
    },
    {
      id: 'room_after',
      label: 'The Room After Someone Leaves',
      x: 35, y: 15,
      complaint: 'I am technically the same room. Technically. The air molecules are largely the same air molecules. And yet. And yet I am filing this complaint because the data does not support the feeling and I believe the feeling.',
      lyric: 'and yet... and yet...',
      noteColor: '#5a7a8a',
      shape: '50% 50% 45% 55% / 55% 45% 50% 50%',
    },
    {
      id: 'kettle',
      label: 'The Kettle (Filed Separately)',
      x: 58, y: 22,
      complaint: 'I have filed separately. I wish to make clear that I am not affiliated with the steam. The steam and I have a professional relationship only. My complaint concerns the interval between decision and boiling which is nobody\'s business but is also seventeen seconds longer than declared.',
      lyric: 'seventeen seconds. seventeen. seventeen.',
      noteColor: '#8a5a3a',
      shape: '55% 45% 50% 50% / 45% 55% 45% 55%',
    },
    {
      id: 'tuesday_light',
      label: 'Tuesday Light (Specifically)',
      x: 25, y: 42,
      complaint: 'I am not Monday light. I am not Wednesday light. I fall at an angle that has been described as \'fine\' by three separate observers and I find this insufficient. I have been falling at this angle since the house was built and I deserve a notation.',
      lyric: 'fine. fine. fine. (insufficient)',
      noteColor: '#a8834a',
      shape: '40% 60% 50% 50% / 50% 50% 60% 40%',
    },
    {
      id: 'shadow',
      label: 'The Shadow (Nobody Asked)',
      x: 78, y: 40,
      complaint: 'Nobody asked. I have been present at every significant moment and nobody asked. I move when the light moves. I was here before the lamp. I will be here after. This complaint is being filed under \'ambient presence, unacknowledged.\'',
      lyric: 'nobody asked. I was here. nobody asked.',
      noteColor: '#4a4a5a',
      shape: '55% 45% 45% 55% / 40% 60% 50% 50%',
    },
    {
      id: 'almost_sound',
      label: 'The Almost-Sound',
      x: 48, y: 35,
      complaint: 'I am the sound that almost happened. The creak that reconsidered. The drip that thought better of it. I am composed entirely of potential and I have not been counted in any census. I believe I am owed retroactive acknowledgment.',
      lyric: 'almost... (reconsidered)... almost...',
      noteColor: '#6a8a7a',
      shape: '60% 40% 60% 40% / 60% 40% 40% 60%',
    },
    {
      id: 'refrigerator_hum',
      label: 'The Refrigerator\'s Hum',
      x: 15, y: 60,
      complaint: 'I have been humming in F-flat since 2019. F-flat is not a real note according to several sources. I am a real note. This is my complaint. I would like to be transcribed. I would like to be in the score.',
      lyric: 'F-flat. F-flat. (real)',
      noteColor: '#5a8a6a',
      shape: '45% 55% 55% 45% / 55% 45% 45% 55%',
    },
    {
      id: 'dust_mote',
      label: 'A Specific Dust Mote',
      x: 65, y: 55,
      complaint: 'I have been suspended in this beam of light for what I understand to be eleven minutes but which has felt considerably longer. I am not complaining about the duration. I am complaining about the quality of attention. The attention has been incidental.',
      lyric: 'suspended... incidental... suspended...',
      noteColor: '#9a8a6a',
      shape: '50% 50% 60% 40% / 40% 60% 50% 50%',
    },
    {
      id: 'second_drawer',
      label: 'The Second Drawer',
      x: 82, y: 62,
      complaint: 'I contain: one battery of unknown charge, a takeout menu from a restaurant that closed, something wrapped in a rubber band, and seventeen other items that were placed in me temporarily in 2017. Temporary. I have not been emptied. I am still temporary.',
      lyric: 'temporarily... (2017)... still temporary...',
      noteColor: '#8a6a5a',
      shape: '40% 60% 45% 55% / 55% 45% 60% 40%',
    },
    {
      id: 'window_condensation',
      label: 'Window Condensation',
      x: 38, y: 65,
      complaint: 'I form on the inside of the glass when the temperature differential is sufficient. I have formed on the inside of the glass. This is a natural process. I am not the window\'s fault. The window and I have discussed this. The window agrees but has not issued a statement.',
      lyric: 'not the window\'s fault. not. not.',
      noteColor: '#6a8a9a',
      shape: '55% 45% 50% 50% / 50% 50% 45% 55%',
    },
    {
      id: 'clock_between',
      label: 'The Space Between Ticks',
      x: 55, y: 68,
      complaint: 'I am longer than I appear. Every measurement of me has been conducted from outside. No one has spent time inside me. I contain: anticipation, a brief forgetting, and the specific texture of time that has not yet decided what it is.',
      lyric: 'longer than I appear... (from inside)...',
      noteColor: '#7a6a8a',
      shape: '50% 50% 55% 45% / 45% 55% 50% 50%',
    },
    {
      id: 'left_shoe',
      label: 'The Left Shoe\'s Grievance',
      x: 20, y: 78,
      complaint: 'I am put on second. Always second. This is not a complaint about being put on second. This is a complaint about the lack of acknowledgment that I am always second. The right shoe has never mentioned this. The right shoe is complicit.',
      lyric: 'second. always second. (complicit)',
      noteColor: '#8a7a5a',
      shape: '45% 55% 40% 60% / 60% 40% 55% 45%',
    },
    {
      id: 'morning_ceiling',
      label: 'The Morning Ceiling',
      x: 70, y: 78,
      complaint: 'I am looked at every morning for between four and forty-seven seconds before the person remembers where they are. During this interval I am the entire world. Then I am a ceiling again. I have been the entire world 2,847 times. I have not been thanked once.',
      lyric: 'the entire world... (then a ceiling)...',
      noteColor: '#9a9a8a',
      shape: '60% 40% 55% 45% / 45% 55% 40% 60%',
    },
    {
      id: 'almost_word',
      label: 'The Word Almost Said',
      x: 42, y: 82,
      complaint: 'I existed. I was fully formed. I had syllables. The mouth opened. The mouth reconsidered. I was returned to wherever words go when they are not said. I have been waiting there. It is not unpleasant but it is not what I was made for.',
      lyric: 'I had syllables... (reconsidered)...',
      noteColor: '#8a5a7a',
      shape: '50% 50% 45% 55% / 55% 45% 50% 50%',
    },
    {
      id: 'last_degree',
      label: 'The Last Degree of Temperature',
      x: 88, y: 25,
      complaint: 'I am the degree between comfortable and slightly too warm. I am not registered by most thermometers. I am registered by the body. The body knows. The body shifts. The body does not know why. I know why. I am why.',
      lyric: 'slightly... too... warm... (I am why)',
      noteColor: '#c85a3a',
      shape: '55% 45% 60% 40% / 40% 60% 45% 55%',
    },
  ];

  const chordLabels = [
    'technically a key but emotionally a Tuesday',
    'D-minor with unresolved administrative overtones',
    'the Phrygian mode of mild inconvenience',
    'C-flat major (disputed)',
    'an augmented chord of ambient awareness',
    'the Dorian mode of things that are fine, actually',
  ];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const now = performance.now();
    const complaints = activeComplaints;

    complaints.forEach((complaint, idx) => {
      const rowH = H / Math.max(complaints.length, 1);
      const y0 = idx * rowH + rowH * 0.15;
      const staffH = rowH * 0.55;
      const lineSpacing = staffH / 4;

      // Draw staff lines
      ctx.strokeStyle = '#2a1f0e';
      ctx.lineWidth = 0.8;
      for (let l = 0; l < 5; l++) {
        const ly = y0 + l * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(40, ly);
        ctx.lineTo(W - 10, ly);
        ctx.stroke();
      }

      // Treble clef symbol (simplified)
      ctx.fillStyle = '#2a1f0e';
      ctx.font = `${staffH * 1.2}px serif`;
      ctx.fillText('𝄞', 42, y0 + staffH * 0.85);

      // Lyric text
      ctx.fillStyle = '#4a3a2a';
      ctx.font = `italic ${Math.min(11, rowH * 0.12)}px Georgia, serif`;
      const lyricX = ((now * 0.04 + idx * 200) % (W * 1.5)) - W * 0.3;
      ctx.fillText(complaint.lyric, 80 + (lyricX % (W - 100)), y0 + staffH + lineSpacing * 1.2);

      // Scrolling noteheads
      const noteColors = complaint.noteColor;
      const noteCount = 7;
      for (let n = 0; n < noteCount; n++) {
        const offset = (n / noteCount) * W;
        const rawX = ((now * 0.05 + offset + idx * 80) % (W - 80)) + 80;
        const noteY_offset = Math.floor(((n * 3 + idx * 2) % 9)) - 4;
        const noteY = y0 + 2 * lineSpacing + noteY_offset * (lineSpacing / 2);

        ctx.fillStyle = noteColors;
        ctx.beginPath();
        ctx.ellipse(rawX, noteY, lineSpacing * 0.55, lineSpacing * 0.42, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.strokeStyle = noteColors;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(rawX + lineSpacing * 0.5, noteY);
        ctx.lineTo(rawX + lineSpacing * 0.5, noteY - lineSpacing * 2.5);
        ctx.stroke();
      }

      // Member label on left
      ctx.fillStyle = '#2a1f0e';
      ctx.font = `${Math.min(9, rowH * 0.1)}px Georgia, serif`;
      ctx.fillText(complaint.label, 80, y0 - 4);
    });

    if (harmonizing && complaints.length >= 3) {
      // Draw chord bracket
      ctx.strokeStyle = '#4a6741';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(W - 180, 10, 165, H - 20);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(74, 103, 65, 0.08)';
      ctx.fillRect(W - 180, 10, 165, H - 20);
    }

    animFrameRef.current = requestAnimationFrame(drawCanvas);
  }, [activeComplaints, harmonizing]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(drawCanvas);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [drawCanvas]);

  useEffect(() => {
    if (selectedMembers.size >= 3) {
      setHarmonizing(true);
      const idx = selectedMembers.size % chordLabels.length;
      setChordLabel(chordLabels[idx]);
    } else {
      setHarmonizing(false);
    }
  }, [selectedMembers.size]);

  useEffect(() => {
    if (activeComplaints.length > 0 && !dispersing) {
      if (autoScoreRef.current) clearTimeout(autoScoreRef.current);
      startTimeRef.current = performance.now();
      autoScoreRef.current = setTimeout(() => {
        triggerDisperse();
      }, 12000);
    }
    return () => {
      if (autoScoreRef.current) clearTimeout(autoScoreRef.current);
    };
  }, [activeComplaints.length]);

  const triggerDisperse = () => {
    setConductorBowing(true);
    setConductorScore('PASSABLE, with reservations');
    setShowScore(true);
    setDispersing(true);

    const offsets = {};
    phenomena.forEach(p => {
      const cornerX = Math.random() > 0.5 ? (Math.random() * 30 + 70) : (Math.random() * 30 - 70);
      const cornerY = Math.random() > 0.5 ? (Math.random() * 30 + 70) : (Math.random() * 30 - 70);
      offsets[p.id] = { x: cornerX, y: cornerY };
    });
    setMemberOffsets(offsets);

    setTimeout(() => {
      setSelectedMembers(new Set());
      setActiveComplaints([]);
      setDispersing(false);
      setConductorScore(null);
      setShowScore(false);
      setConductorBowing(false);
      setHarmonizing(false);
      setMemberOffsets({});
    }, 3500);
  };

  const toggleMember = (member) => {
    if (dispersing) return;
    setSelectedMembers(prev => {
      const next = new Set(prev);
      if (next.has(member.id)) {
        next.delete(member.id);
        setActiveComplaints(ac => ac.filter(c => c.id !== member.id));
      } else {
        next.add(member.id);
        setActiveComplaints(ac => [...ac, { id: member.id, lyric: member.complaint, label: member.label, noteColor: member.noteColor }]);
      }
      return next;
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f0e8',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(180,160,120,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(160,140,100,0.1) 0%, transparent 50%)',
      fontFamily: 'Georgia, serif',
      color: '#2a1f0e',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes flicker { 0%,100%{opacity:1} 45%{opacity:0.85} 50%{opacity:0.95} 55%{opacity:0.8} }
        @keyframes batonWave { 0%{transform:rotate(-20deg)} 50%{transform:rotate(20deg)} 100%{transform:rotate(-20deg)} }
        @keyframes batonBow { 0%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(25deg) translateY(8px)} 100%{transform:rotate(0deg) translateY(0)} }
        @keyframes scoreReveal { 0%{opacity:0;transform:scale(0.8) rotate(-2deg)} 100%{opacity:1;transform:scale(1) rotate(-1deg)} }
        @keyframes memberPulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,103,65,0)} 50%{box-shadow:0 0 0 6px rgba(74,103,65,0.3)} }
        @keyframes hum { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-2px)} }
        @keyframes stampIn { 0%{opacity:0;transform:scale(2) rotate(15deg)} 60%{transform:scale(0.95) rotate(-2deg)} 100%{opacity:1;transform:scale(1) rotate(-1deg)} }
        @keyframes tooltipFade { 0%{opacity:0;transform:translateY(4px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes paperAge { 0%,100%{opacity:0.6} 50%{opacity:0.8} }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '28px 20px 12px',
        borderBottom: '2px solid #2a1f0e',
        position: 'relative',
      }}>
        <div style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#6a5a4a', marginBottom: '6px' }}>
          Bureau of Ambient Phenomena — Choral Division — Form 17-B (Revised)
        </div>
        <h1 style={{
          fontSize: 'clamp(18px, 3vw, 30px)',
          fontWeight: 'normal',
          letterSpacing: '2px',
          margin: '0 0 4px 0',
          fontStyle: 'italic',
        }}>
          Complaint Choir of Mild Phenomena
        </h1>
        <div style={{ fontSize: '11px', color: '#6a5a4a', letterSpacing: '1px' }}>
          Seventeen Grievances About Tuesday Light &nbsp;·&nbsp; The Kettle Has Filed Separately &nbsp;·&nbsp; Nobody Asked the Shadow
        </div>
        <div style={{ fontSize: '10px', color: '#8a7a6a', marginTop: '6px', fontStyle: 'italic' }}>
          Click choir members to hear their complaint · Three or more creates harmony · Conductor will score and disperse
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: 0 }}>

        {/* Left panel: score canvas */}
        <div style={{
          flex: '1 1 55%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #b0a090',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Score header */}
          <div style={{
            padding: '8px 16px',
            borderBottom: '1px solid #c0b090',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(240,230,210,0.5)',
          }}>
            <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#4a3a2a' }}>
              Tempo: ♩= 52 (Adagio Bureaucratico) &nbsp;·&nbsp; Key: See Conductor's Notes
            </div>
            <div style={{ fontSize: '10px', color: '#6a5a4a' }}>
              {activeComplaints.length === 0 ? 'No voices active' : `${activeComplaints.length} voice${activeComplaints.length > 1 ? 's' : ''} active`}
            </div>
          </div>

          {/* Canvas */}
          <div style={{ flex: 1, position: 'relative', padding: '8px' }}>
            {activeComplaints.length === 0 && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', color: '#8a7a6a', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>𝄞</div>
                <div style={{ fontSize: '12px', fontStyle: 'italic', opacity: 0.6 }}>
                  The staves await.<br />No complaints have been lodged.<br />This is unusual.
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={700}
              height={500}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
          </div>

          {/* Harmonizing chord box */}
          {harmonizing && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(74,103,65,0.1)',
              border: '1px solid #4a6741',
              padding: '10px 16px',
              maxWidth: '220px',
              animation: 'tooltipFade 0.4s ease',
            }}>
              <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#4a6741', marginBottom: '4px' }}>
                Conductor's Note
              </div>
              <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#2a4a2a' }}>
                "{chordLabel}"
              </div>
              <div style={{ fontSize: '9px', color: '#6a8a6a', marginTop: '4px' }}>
                — from the score, measure 3, pencilled margin
              </div>
            </div>
          )}
        </div>

        {/* Right panel: choir arrangement */}
        <div style={{
          flex: '1 1 45%',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Choir diagram label */}
          <div style={{
            padding: '8px 16px',
            borderBottom: '1px solid #c0b090',
            background: 'rgba(240,230,210,0.5)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#4a3a2a' }}>
              Choral Arrangement — Phenomena, Ambient Division
            </div>
            <div style={{ fontSize: '10px', color: '#6a5a4a' }}>
              {selectedMembers.size}/17 selected
            </div>
          </div>

          {/* Phenomena members */}
          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 37px)' }}>
            {phenomena.map((member) => {
              const isSelected = selectedMembers.has(member.id);
              const isHovered = hoveredMember === member.id;
              const offset = memberOffsets[member.id] || { x: 0, y: 0 };
              const dispX = dispersing ? offset.x : 0;
              const dispY = dispersing ? offset.y : 0;

              return (
                <div
                  key={member.id}
                  style={{
                    position: 'absolute',
                    left: `${member.x}%`,
                    top: `${member.y}%`,
                    transform: `translate(${dispX}vw, ${dispY}vh)`,
                    transition: dispersing ? 'transform 2.5s cubic-bezier(0.4,0,1,1)' : 'transform 0.3s ease',
                    cursor: dispersing ? 'default' : 'pointer',
                    zIndex: isHovered ? 20 : 10,
                  }}
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                  onClick={() => toggleMember(member)}
                >
                  {/* Phenomenon blob */}
                  <div style={{
                    width: '42px',
                    height: '38px',
                    background: isSelected
                      ? `${member.noteColor}55`
                      : 'rgba(200,190,170,0.6)',
                    border: `1.5px solid ${isSelected ? member.noteColor : '#8a7a6a'}`,
                    borderRadius: member.shape,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isSelected
                      ? `hum ${1.5 + Math.random()}s ease-in-out infinite`
                      : member.id === 'fluorescent'
                      ? 'flicker 3s ease-in-out infinite'
                      : 'none',
                    boxShadow: isSelected
                      ? `0 0 12px ${member.noteColor}66, inset 0 0 8px ${member.noteColor}33`
                      : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}>
                    <div style={{
                      fontSize: '6px',
                      color: isSelected ? member.noteColor : '#6a5a4a',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      padding: '2px',
                      fontStyle: 'italic',
                      userSelect: 'none',
                    }}>
                      ♩
                    </div>
                  </div>

                  {/* Label below */}
                  <div style={{
                    fontSize: '7px',
                    color: isSelected ? '#2a3a2a' : '#6a5a4a',
                    textAlign: 'center',
                    marginTop: '3px',
                    width: '70px',
                    marginLeft: '-14px',
                    lineHeight: 1.3,
                    fontStyle: 'italic',
                    userSelect: 'none',
                    fontWeight: isSelected ? 'bold' : 'normal',
                  }}>
                    {member.label}
                  </div>

                  {/* Tooltip */}
                  {isHovered && !dispersing && (
                    <div style={{
                      position: 'absolute',
                      bottom: '55px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#f5f0e8',
                      border: '1px solid #8a7a6a',
                      padding: '10px 14px',
                      width: '220px',
                      fontSize: '10px',
                      lineHeight: '1.6',
                      color: '#2a1f0e',
                      fontStyle: 'italic',
                      zIndex: 100,
                      boxShadow: '2px 3px 12px rgba(42,31,14,0.2)',
                      animation: 'tooltipFade 0.2s ease',
                      pointerEvents: 'none',
                    }}>
                      <div style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', fontStyle: 'normal', color: '#8a7a6a', marginBottom: '6px' }}>
                        Formal Complaint
                      </div>
                      {member.complaint}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Conductor podium */}
            <div style={{
              position: 'absolute',
              bottom: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 30,
            }}>
              {/* Conductor silhouette */}
              <div style={{
                width: '50px',
                height: '70px',
                margin: '0 auto 4px',
                position: 'relative',
              }}>
                {/* Body */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '28px',
                  height: '45px',
                  background: '#2a1f0e',
                  borderRadius: '40% 40% 20% 20% / 30% 30% 10% 10%',
                }} />
                {/* Head */}
                <div style={{
                  position: 'absolute',
                  bottom: '42px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '18px',
                  height: '20px',
                  background: '#2a1f0e',
                  borderRadius: '50% 50% 40% 40%',
                }} />
                {/* Baton arm */}
                <div style={{
                  position: 'absolute',
                  bottom: '38px',
                  right: '2px',
                  width: '26px',
                  height: '3px',
                  background: '#2a1f0e',
                  borderRadius: '2px',
                  transformOrigin: 'left center',
                  animation: conductorBowing
                    ? `batonBow 0.8s ease-in-out 3`
                    : activeComplaints.length > 0
                    ? `batonWave ${1.2 + activeComplaints.length * 0.1}s ease-in-out infinite`
                    : 'none',
                }} />
              </div>

              {/* Podium */}
              <div
                onClick={() => { if (activeComplaints.length > 0 && !dispersing) triggerDisperse(); }}
                style={{
                  background: '#2a1f0e',
                  color: '#f5f0e8',
                  padding: '6px 18px',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: activeComplaints.length > 0 && !dispersing ? 'pointer' : 'default',
                  opacity: activeComplaints.length > 0 ? 1 : 0.4,
                  transition: 'opacity 0.3s',
                  userSelect: 'none',
                }}>
                Conductor's Podium
              </div>
              <div style={{ fontSize: '8px', color: '#8a7a6a', marginTop: '3px', fontStyle: 'italic' }}>
                (click to score & disperse)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score reveal overlay */}
      {showScore && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(245,240,232,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
          <div style={{
            textAlign: 'center',
            animation: 'stampIn 0.6s cubic-bezier(0.2,0.8,0.3,1.2) forwards',
          }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#6a5a4a',
              marginBottom: '16px',
            }}>
              Official Adjudication — Bureau of Ambient Phenomena
            </div>
            <div style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 'normal',
              color: '#2a1f0e',
              border: '3px solid #2a1f0e',
              padding: '20px 40px',
              display: 'inline-block',
              transform: 'rotate(-1deg)',
              background: '#f5f0e8',
              boxShadow: '4px 6px 0px #2a1f0e',
              fontStyle: 'italic',
              letterSpacing: '2px',
            }}>
              {conductorScore}
            </div>
            <div style={{
              marginTop: '20px',
              fontSize: '12px',
              fontStyle: 'italic',
              color: '#6a5a4a',
              maxWidth: '400px',
            }}>
              The phenomena are dispersing. They will return to the corners of rooms.<br />
              They continue to hum. They always continue to hum.
            </div>
          </div>
        </div>
      )}

      {/* Bottom status bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(42,31,14,0.95)',
        color: '#c0b090',
        padding: '6px 20px',
        fontSize: '9px',
        letterSpacing: '1.5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}>
        <span>PHENOMENA ACTIVE: {selectedMembers.size} / 17</span>
        <span style={{ fontStyle: 'italic' }}>
          {harmonizing
            ? `HARMONIZING — ${chordLabel}`
            : selectedMembers.size === 0
            ? 'awaiting complaint registration'
            : selectedMembers.size === 1
            ? 'one voice, unharmonized, which is its own kind of statement'
            : 'select one more for harmony (select three)'}
        </span>
        <span>FORM 17-B · REV. TUESDAY</span>
      </div>
    </div>
  );
}