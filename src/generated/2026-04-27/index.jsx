import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [phase, setPhase] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [compassAngle, setCompassAngle] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const compassRef = useRef(null);
  const analysisRef = useRef(null);

  const questions = [
    {
      id: 'formation',
      text: 'How was this secret initially formed?',
      subtext: 'Field notation: Describe the primary geological event.',
      options: [
        { label: 'Accumulated gradually — layers deposited over many seasons, barely noticed at the time', traits: { type: 'sedimentary', depth: 'deep', porosity: 'high' } },
        { label: 'Formed suddenly under extreme pressure — a single event, crystallized immediately', traits: { type: 'igneous', depth: 'shallow', porosity: 'low' } },
        { label: 'Transformed from something else — original material altered by sustained heat or weight', traits: { type: 'metamorphic', depth: 'medium', porosity: 'medium' } },
      ]
    },
    {
      id: 'depth',
      text: 'At what depth does this secret become load-bearing?',
      subtext: 'Field notation: Estimate using standard field penetrometer readings.',
      options: [
        { label: 'Surface level — it is visible in the topsoil of my daily behavior', traits: { depth: 'shallow', stability: 'low', age: 'recent' } },
        { label: 'Mid-stratum — encountered only under sustained excavation pressure', traits: { depth: 'medium', stability: 'medium', age: 'intermediate' } },
        { label: 'Bedrock adjacent — has become structural, removing it would cause collapse', traits: { depth: 'deep', stability: 'high', age: 'old' } },
      ]
    },
    {
      id: 'settling',
      text: 'Has any settling occurred near the foundation of your daily routine?',
      subtext: 'Field notation: Observe for subsidence, micro-fractures, or differential compression.',
      options: [
        { label: 'No observable settling — the surface above remains level and undisturbed', traits: { settling: 'none', risk: 'low', containment: 'good' } },
        { label: 'Minor cracking noted — hairline fractures visible under certain lighting conditions', traits: { settling: 'minor', risk: 'medium', containment: 'partial' } },
        { label: 'Significant subsidence — the ground above has visibly shifted, others may have noticed', traits: { settling: 'major', risk: 'high', containment: 'poor' } },
      ]
    },
    {
      id: 'moisture',
      text: 'What is the current moisture content of this secret?',
      subtext: 'Field notation: Use gravimetric analysis or emotional proxy indicators.',
      options: [
        { label: 'Desiccated — dried out, possibly forgotten, crumbles when touched', traits: { moisture: 'dry', emotion: 'detached', texture: 'coarse' } },
        { label: 'Field capacity — moist but stable, retains shape under moderate examination', traits: { moisture: 'moist', emotion: 'present', texture: 'loamy' } },
        { label: 'Saturated — waterlogged, near the point of liquefaction under any pressure', traits: { moisture: 'saturated', emotion: 'overwhelmed', texture: 'clay' } },
      ]
    },
    {
      id: 'porosity',
      text: 'How permeable is this secret to prolonged eye contact?',
      subtext: 'Field notation: Measure hydraulic conductivity under interpersonal gradient.',
      options: [
        { label: 'Impermeable — eye contact passes over the surface, nothing seeps through', traits: { porosity: 'low', exposure: 'minimal', crust: 'thick' } },
        { label: 'Moderately permeable — some seepage occurs, especially with familiar individuals', traits: { porosity: 'medium', exposure: 'moderate', crust: 'thin' } },
        { label: 'Highly permeable — nearly transparent, flows freely under any sustained attention', traits: { porosity: 'high', exposure: 'high', crust: 'none' } },
      ]
    },
    {
      id: 'horizon',
      text: 'What material was present before the secret formed?',
      subtext: 'Field notation: Characterize the parent material in the O/A horizon.',
      options: [
        { label: 'Good intentions — nutrient-rich, organic, well-aerated prior conditions', traits: { origin: 'good', organic: 'high', ph: 'neutral' } },
        { label: 'Ambiguity — neither fertile nor barren, the conditions were simply unclear', traits: { origin: 'ambiguous', organic: 'medium', ph: 'variable' } },
        { label: 'Previous secrets — the parent material was itself a concealment, layered beneath', traits: { origin: 'recursive', organic: 'low', ph: 'acidic' } },
      ]
    },
  ];

  const computeReport = (ans) => {
    const traits = {};
    Object.values(ans).forEach(a => {
      Object.entries(a.traits).forEach(([k, v]) => {
        if (!traits[k]) traits[k] = [];
        traits[k].push(v);
      });
    });

    const count = (arr, val) => (arr || []).filter(x => x === val).length;
    const majority = (arr) => {
      if (!arr) return null;
      const freq = {};
      arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
      return Object.entries(freq).sort((a,b) => b[1]-a[1])[0][0];
    };

    const type = majority(traits.type) || 'sedimentary';
    const depth = majority(traits.depth) || 'medium';
    const settling = majority(traits.settling) || 'minor';
    const moisture = majority(traits.moisture) || 'moist';
    const porosity = majority(traits.porosity) || 'medium';
    const origin = majority(traits.origin) || 'ambiguous';

    const classificationMap = {
      sedimentary: {
        shallow: 'SUPERFICIAL LOAM-ADJACENT CONCEALMENT',
        medium: 'STRATIFIED SILTY WITHHOLDING',
        deep: 'CONSOLIDATED CLAYEY OMISSION',
      },
      igneous: {
        shallow: 'EXTRUSIVE OBSIDIAN-CLASS DENIAL',
        medium: 'INTRUSIVE BASALTIC SUPPRESSION',
        deep: 'PLUTONIC GRANITE-GRADE ENCLOSURE',
      },
      metamorphic: {
        shallow: 'FOLIATED SCHIST-TYPE TRANSFORMATION',
        medium: 'GNEISSIC REWORKED CONCEALMENT',
        deep: 'ECLOGITE-PHASE IRREVERSIBLE BURIAL',
      },
    };

    const classification = (classificationMap[type] || classificationMap.sedimentary)[depth] || 'UNDIFFERENTIATED CONCEALMENT MATERIAL';

    const porosityDesc = { low: 'low porosity', medium: 'moderate porosity', high: 'high porosity' }[porosity] || 'variable porosity';
    const settlingDesc = { none: 'no subsidence detected', minor: 'minor subsidence risk', major: 'active subsidence — structural concern' }[settling] || 'subsidence uncharacterized';
    const moistureDesc = { dry: 'desiccated — handle with caution', moist: 'field-capacity moisture content', saturated: 'near liquefaction — do not disturb' }[moisture] || 'moisture undetermined';

    const subtitle = `${porosityDesc}, ${settlingDesc}, ${moistureDesc}`;

    const currentYear = new Date().getFullYear();
    const layerSets = {
      sedimentary: [
        { color: '#C4A882', label: 'O HORIZON — SURFACE PRESENTATION LAYER', sublabel: `(ca. ${currentYear})`, height: 52 },
        { color: '#A67C52', label: 'A HORIZON — OXIDIZED JUSTIFICATION LAYER', sublabel: `(ca. ${currentYear - 2})`, height: 68 },
        { color: '#8B6340', label: 'B HORIZON — ILLUVIATED REASONING ACCUMULATION', sublabel: `(ca. ${currentYear - 4})`, height: 80 },
        { color: '#6B4C2A', label: 'C HORIZON — COMPACTED ORIGINAL FEELING', sublabel: 'DO NOT DISTURB', height: 90 },
        { color: '#4A3520', label: 'R HORIZON — BEDROCK OF UNSPOKEN PREMISE', sublabel: '(undated — pre-formation)', height: 60 },
      ],
      igneous: [
        { color: '#B8C4C8', label: 'SURFACE GLAZE — VITREOUS COMPOSURE LAYER', sublabel: `(ca. ${currentYear})`, height: 40 },
        { color: '#7A8E96', label: 'VESICULAR ZONE — PRESSURIZED MEMORY POCKETS', sublabel: `(ca. ${currentYear - 1})`, height: 72 },
        { color: '#4A6470', label: 'COLUMNAR ZONE — CRYSTALLIZED DECISION MATRIX', sublabel: `(ca. ${currentYear - 3})`, height: 88 },
        { color: '#2E4A54', label: 'MASSIVE ZONE — DENSE ORIGINAL INCIDENT', sublabel: 'FORMATION EVENT — SINGLE EPISODE', height: 95 },
        { color: '#1A2E36', label: 'INTRUSIVE BODY — THE THING ITSELF', sublabel: '(date of formation withheld)', height: 55 },
      ],
      metamorphic: [
        { color: '#C8C0B0', label: 'FOLIATION SURFACE — VISIBLE NARRATIVE LAYER', sublabel: `(ca. ${currentYear})`, height: 48 },
        { color: '#9E9080', label: 'SCHISTOSE ZONE — RECRYSTALLIZED EXPLANATION', sublabel: `(ca. ${currentYear - 3})`, height: 76 },
        { color: '#7A6A5A', label: 'GNEISSIC BANDING — ALTERNATING TRUTH/OMISSION', sublabel: `(ca. ${currentYear - 5})`, height: 84 },
        { color: '#5A4A3A', label: 'GRANULITE ZONE — PRESSURE-ALTERED ORIGINAL FORM', sublabel: '(transformation date unclear)', height: 92 },
        { color: '#3A2A1A', label: 'ECLOGITE CORE — IRREVERSIBLY CHANGED ORIGINAL', sublabel: '(pre-metamorphism: unknown)', height: 58 },
      ],
    };

    const layers = layerSets[type] || layerSets.sedimentary;

    const recommendations = [
      { text: 'Leave fallow. The site should remain undisturbed for a minimum of one growing season. Erosion may naturally reduce surface expression over time. Monitor for seepage.', action: 'LEAVE FALLOW', color: '#4A6A4A' },
      { text: 'Gently aerate. Introduce controlled micro-perforations to relieve internal pressure. Recommend gradual disclosure to a single trusted party using a small-diameter probe. Proceed at field pace.', action: 'GENTLY AERATE', color: '#6A6A2A' },
      { text: 'Condemn and return to nature. Site is beyond remediation through standard concealment protocols. Recommend full decommission, surface disclosure, and ecological restoration of affected relationships.', action: 'CONDEMN — RETURN TO NATURE', color: '#8B1A1A' },
    ];

    let recIndex = 0;
    if (settling === 'major' || porosity === 'high' || moisture === 'saturated') recIndex = 2;
    else if (settling === 'minor' || porosity === 'medium' || depth === 'medium') recIndex = 1;
    else recIndex = 0;

    const recommendation = recommendations[recIndex];

    const geologistInitials = ['R.T.K.', 'M.V.H.', 'J.B.Q.', 'A.L.W.', 'C.P.N.'][Math.floor(Math.random() * 5)];
    const credentials = ['C.S.A. (Certified Secrets Analyst)', 'F.G.E. (Field Geologist, Emotional)', 'B.Sc. Concealment Sciences', 'Ph.D. Applied Omission Studies', 'M.S.G. (Master Surveyor of Grief)'];
    const credential = credentials[Math.floor(Math.random() * credentials.length)];

    const sampleId = `USDA-${Math.floor(Math.random() * 9000) + 1000}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    return { classification, subtitle, layers, recommendation, geologistInitials, credential, sampleId, type, depth, origin };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCompassAngle(a => (a + 0.4) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'analyzing') {
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            const report = computeReport(answers);
            setReportData(report);
            setTimeout(() => setPhase('report'), 400);
            return 100;
          }
          return p + (Math.random() * 3 + 0.5);
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    const newAnswers = { ...answers, [questions[currentQuestion].id]: option };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(q => q + 1);
        setSelectedAnswer(null);
      } else {
        setPhase('analyzing');
      }
    }, 500);
  };

  const paperStyle = {
    background: '#F5F0E8',
    minHeight: '100vh',
    fontFamily: '"Courier New", Courier, monospace',
    color: '#3B3220',
    position: 'relative',
    overflow: 'hidden',
  };

  const gridOverlay = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: 'linear-gradient(rgba(59,50,32,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,50,32,0.06) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    pointerEvents: 'none',
    zIndex: 0,
  };

  const CompassRose = ({ size = 120 }) => {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 8;
    return (
      <svg width={size} height={size} style={{ transform: `rotate(${compassAngle}deg)`, transition: 'none' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3B3220" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx={cx} cy={cy} r={r * 0.7} fill="none" stroke="#3B3220" strokeWidth="0.8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180;
          const x1 = cx + Math.cos(rad) * r * 0.72;
          const y1 = cy + Math.sin(rad) * r * 0.72;
          const x2 = cx + Math.cos(rad) * r * 0.98;
          const y2 = cy + Math.sin(rad) * r * 0.98;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3B3220" strokeWidth={i % 2 === 0 ? 1.5 : 0.8} />;
        })}
        <polygon points={`${cx},${cy - r * 0.6} ${cx - 6},${cy} ${cx},${cy + r * 0.2} ${cx + 6},${cy}`} fill="#8B1A1A" />
        <polygon points={`${cx},${cy + r * 0.6} ${cx - 6},${cy} ${cx},${cy - r * 0.2} ${cx + 6},${cy}`} fill="#3B3220" />
        <circle cx={cx} cy={cy} r={4} fill="#3B3220" />
        <text x={cx} y={cy - r * 0.85} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="Courier New" fill="#3B3220" fontWeight="bold">N</text>
        <text x={cx} y={cy + r * 0.9} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="Courier New" fill="#3B3220">S</text>
        <text x={cx + r * 0.88} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="Courier New" fill="#3B3220">E</text>
        <text x={cx - r * 0.88} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="Courier New" fill="#3B3220">W</text>
      </svg>
    );
  };

  const HeaderBlock = ({ sampleId }) => (
    <div style={{ borderBottom: '2px solid #3B3220', paddingBottom: 16, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#6B5A3A', marginBottom: 4 }}>UNITED STATES DEPARTMENT OF INTERIOR GEOLOGY</div>
          <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 1, lineHeight: 1.1 }}>FIELD SOIL SURVEY</div>
          <div style={{ fontSize: 11, color: '#6B5A3A', marginTop: 2 }}>CONCEALMENT CLASSIFICATION DIVISION — FORM 7-C</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 10, color: '#6B5A3A' }}>
          <div>SAMPLE ID: {sampleId || '——————'}</div>
          <div>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</div>
          <div>CLASSIFICATION: PERSONAL / SENSITIVE</div>
        </div>
      </div>
    </div>
  );

  if (phase === 'intro') {
    return (
      <div style={paperStyle}>
        <style>{`
          @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.92} }
          @keyframes stampIn { 0%{transform:scale(2) rotate(-8deg);opacity:0} 60%{transform:scale(0.95) rotate(2deg);opacity:1} 100%{transform:scale(1) rotate(-2deg);opacity:1} }
          @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
          @keyframes blink { 0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0} 99%{opacity:0} }
        `}</style>
        <div style={gridOverlay} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
          <HeaderBlock sampleId="PENDING-INIT" />
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#8B1A1A', marginBottom: 8 }}>SURVEY PURPOSE</div>
              <div style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
                This instrument has been deployed to characterize the physical and structural properties of a concealment currently present within the survey subject's geological profile.
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: '#6B5A3A', borderLeft: '2px solid #3B3220', paddingLeft: 12, marginBottom: 32 }}>
                The geologist arrives with instruments.<br />
                The instruments are wrong.<br />
                The ground confesses anyway.
              </div>
              <div style={{ fontSize: 10, letterSpacing: 1, marginBottom: 8, color: '#6B5A3A' }}>SUBJECT NOTICE:</div>
              <div style={{ fontSize: 11, lineHeight: 1.7, marginBottom: 32 }}>
                You will be asked {questions.length} field questions. Answer honestly. The instruments cannot detect dishonesty, but the soil can. Results are binding under no applicable law. Results may feel true anyway.
              </div>
              <button
                onClick={() => setPhase('survey')}
                style={{
                  background: '#3B3220',
                  color: '#F5F0E8',
                  border: 'none',
                  padding: '14px 32px',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 13,
                  letterSpacing: 3,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  animation: 'flicker 3s infinite',
                }}
              >
                BEGIN FIELD SURVEY ▶
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <CompassRose size={140} />
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#6B5A3A', textAlign: 'center' }}>INSTRUMENT CALIBRATING<br /><span style={{ animation: 'blink 1s infinite', display: 'inline-block' }}>●</span> ACQUIRING SIGNAL</div>
              <div style={{ border: '1px solid #3B3220', padding: '12px 16px', fontSize: 10, lineHeight: 1.8, maxWidth: 180 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>FIELD KIT INCLUDES:</div>
                <div>· Penetrometer (emotional)</div>
                <div>· Moisture gauge</div>
                <div>· Core extractor</div>
                <div>· Conscience probe</div>
                <div>· Classification manual</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'survey') {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion) / questions.length) * 100;
    return (
      <div style={paperStyle}>
        <style>{`@keyframes slideIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }`}</style>
        <div style={gridOverlay} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
          <HeaderBlock sampleId="IN-PROGRESS" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#6B5A3A' }}>
              FIELD QUESTION {currentQuestion + 1} OF {questions.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CompassRose size={60} />
            </div>
          </div>
          <div style={{ height: 4, background: '#D4C9B0', marginBottom: 32, position: 'relative' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#3B3220', transition: 'width 0.5s' }} />
          </div>
          <div style={{ animation: 'slideIn 0.4s ease', key: currentQuestion }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#8B1A1A', marginBottom: 6 }}>FIELD OBSERVATION REQUEST</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 1.4, marginBottom: 8 }}>{q.text}</div>
            <div style={{ fontSize: 11, color: '#6B5A3A', fontStyle: 'italic', marginBottom: 28, paddingLeft: 12, borderLeft: '2px solid #C4A882' }}>
              {q.subtext}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                return (
                  <div
                    key={i}
                    onClick={() => !selectedAnswer && handleAnswer(opt)}
                    style={{
                      border: `1.5px solid ${isSelected ? '#3B3220' : '#A89870'}`,
                      padding: '16px 20px',
                      cursor: selectedAnswer ? 'default' : 'pointer',
                      background: isSelected ? '#3B3220' : 'transparent',
                      color: isSelected ? '#F5F0E8' : '#3B3220',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      opacity: selectedAnswer && !isSelected ? 0.5 : 1,
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      border: `1.5px solid ${isSelected ? '#F5F0E8' : '#3B3220'}`,
                      flexShrink: 0, marginTop: 2,
                      background: isSelected ? '#F5F0E8' : 'transparent',
                    }} />
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>{opt.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 40, borderTop: '1px dashed #A89870', paddingTop: 12, fontSize: 9, color: '#A89870', letterSpacing: 1 }}>
            FORM 7-C · CONCEALMENT CLASSIFICATION DIVISION · ALL ANSWERS RECORDED IN FIELD LOG
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'analyzing') {
    const stages = [
      'DEPLOYING PENETROMETER...',
      'EXTRACTING CORE SAMPLE...',
      'ANALYZING MOISTURE CONTENT...',
      'CROSS-REFERENCING CLASSIFICATION MANUAL...',
      'CALCULATING SUBSIDENCE RISK...',
      'CONSULTING EMOTIONAL HORIZON DATA...',
      'GENERATING OFFICIAL REPORT...',
    ];
    const stageIndex = Math.floor((analysisProgress / 100) * stages.length);
    const currentStage = stages[Math.min(stageIndex, stages.length - 1)];
    return (
      <div style={paperStyle}>
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        `}</style>
        <div style={gridOverlay} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
          <HeaderBlock sampleId="ANALYZING..." />
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ marginBottom: 32 }}>
              <CompassRose size={160} />
            </div>
            <div style={{ fontSize: 12, letterSpacing: 3, color: '#8B1A1A', marginBottom: 24, animation: 'pulse 1.5s infinite' }}>
              FIELD ANALYSIS IN PROGRESS
            </div>
            <div style={{ fontSize: 14, marginBottom: 8 }}>{currentStage}</div>
            <div style={{ maxWidth: 400, margin: '0 auto 8px', height: 8, background: '#D4C9B0', position: 'relative' }}>
              <div style={{ height: '100%', width: `${Math.min(analysisProgress, 100)}%`, background: '#3B3220', transition: 'width 0.1s' }} />
            </div>
            <div style={{ fontSize: 10, color: '#6B5A3A', letterSpacing: 2 }}>{Math.floor(Math.min(analysisProgress, 100))}% COMPLETE</div>
            <div style={{ marginTop: 40, fontSize: 10, color: '#A89870', lineHeight: 1.8 }}>
              The instruments have recorded your responses.<br />
              The soil is being cross-referenced against 40 years of field data.<br />
              This may take a moment. The secret is not going anywhere.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'report' && reportData) {
    const { classification, subtitle, layers, recommendation, geologistInitials, credential, sampleId, type } = reportData;
    const totalHeight = layers.reduce((s, l) => s + l.height, 0);
    return (
      <div style={paperStyle}>
        <style>{`
          @keyframes stampDrop { 0%{transform:scale(2.5) rotate(-12deg);opacity:0} 70%{transform:scale(0.9) rotate(3deg);opacity:1} 100%{transform:scale(1) rotate(-4deg);opacity:1} }
          @keyframes fadeUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
          @print { body{background:white} }
        `}</style>
        <div style={gridOverlay} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto', padding: '32px 24px 60px' }}>
          <HeaderBlock sampleId={sampleId} />

          <div style={{ textAlign: 'center', marginBottom: 32, animation: 'fadeUp 0.6s ease' }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B1A1A', marginBottom: 6 }}>OFFICIAL USDA SOIL TAXONOMY — CONCEALMENT SUBORDER</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: 1, lineHeight: 1.2, marginBottom: 8 }}>{classification}</div>
            <div style={{ fontSize: 12, color: '#6B5A3A', fontStyle: 'italic', letterSpacing: 0.5 }}>{subtitle}</div>
          </div>

          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ flex: '0 0 auto', animation: 'fadeUp 0.8s ease' }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#8B1A1A', marginBottom: 12 }}>CROSS-SECTION DIAGRAM</div>
              <div style={{ fontSize: 9, color: '#6B5A3A', marginBottom: 6, letterSpacing: 1 }}>DEPTH PROFILE — NOT TO SCALE</div>
              <div style={{ display: 'flex', gap: 0 }}>
                <div style={{ width: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 6 }}>
                  {layers.map((l, i) => (
                    <div key={i} style={{ height: l.height, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: '#6B5A3A', writingMode: 'vertical-rl', letterSpacing: 1 }}>
                      {(i * 30)}cm
                    </div>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 140, border: '2px solid #3B3220', overflow: 'hidden' }}>
                    {layers.map((layer, i) => (
                      <div
                        key={i}
                        style={{
                          height: layer.height,
                          background: layer.color,
                          borderBottom: i < layers.length - 1 ? '1px dashed rgba(59,50,32,0.4)' : 'none',
                          position: 'relative',
                          backgroundImage: i % 2 === 0
                            ? 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 5px)'
                            : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 5px)',
                        }}
                      >
                        <div style={{ position: 'absolute', left: 4, top: 4, fontSize: 7, color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', letterSpacing: 0.5, lineHeight: 1.3 }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {layers.map((layer, i) => (
                    <div
                      key={i}
                      style={{
                        height: layer.height,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingLeft: 8,
                        borderLeft: `3px solid ${layer.color}`,
                      }}
                    >
                      <div style={{ fontSize: 8, fontWeight: 'bold', letterSpacing: 0.5, lineHeight: 1.3, color: '#3B3220', maxWidth: 200 }}>{layer.label}</div>
                      <div style={{ fontSize: 7, color: '#8B1A1A', letterSpacing: 0.5, marginTop: 2 }}>{layer.sublabel}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 240, animation: 'fadeUp 1s ease' }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#8B1A1A', marginBottom: 12 }}>FIELD OBSERVATIONS</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                {[
                  ['Formation Type', type.toUpperCase()],
                  ['Horizon Count', layers.length.toString()],
                  ['Estimated Age', answers.depth?.traits?.age ? answers.depth.traits.age.toUpperCase() : 'INDETERMINATE'],
                  ['Moisture Class', answers.moisture?.traits?.moisture ? answers.moisture.traits.moisture.toUpperCase() : 'UNKNOWN'],
                  ['Porosity Rating', answers.porosity?.traits?.porosity ? answers.porosity.traits.porosity.toUpperCase() : 'UNKNOWN'],
                  ['Parent Material', answers.horizon?.traits?.origin ? answers.horizon.traits.origin.toUpperCase() : 'UNKNOWN'],
                  ['Structural Risk', answers.settling?.traits?.risk ? answers.settling.traits.risk.toUpperCase() : 'UNKNOWN'],
                ].map(([k, v], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #D4C9B0' }}>
                    <td style={{ padding: '6px 0', color: '#6B5A3A', width: '55%' }}>{k}</td>
                    <td style={{ padding: '6px 0', fontWeight: 'bold', letterSpacing: 1 }}>{v}</td>
                  </tr>
                ))}
              </table>

              <div style={{ marginTop: 24, padding: 16, border: '1px solid #A89870', background: 'rgba(196,168,130,0.15)' }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: '#8B1A1A', marginBottom: 8 }}>CORE SAMPLE NOTES</div>
                <div style={{ fontSize: 11, lineHeight: 1.7, color: '#3B3220' }}>
                  Sample exhibits characteristics consistent with {type} origin. The {layers[layers.length - 2]?.label?.toLowerCase()} shows signs of long-term compaction. Recommend against unsupervised excavation. Handle with care near the {layers[layers.length - 1]?.label?.toLowerCase()}.
                </div>
              </div>
            </div>
          </div>

          <div style={{
            border: '2px solid #3B3220',
            padding: '24px 28px',
            marginBottom: 32,
            position: 'relative',
            animation: 'fadeUp 1.2s ease',
            background: 'rgba(245,240,232,0.8)',
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#8B1A1A', marginBottom: 12 }}>OFFICIAL FIELD RECOMMENDATION</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: recommendation.color, letterSpacing: 2, marginBottom: 12 }}>
              {recommendation.action}
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.8, maxWidth: 580 }}>{recommendation.text}</div>
            <div style={{
              position: 'absolute',
              top: 16, right: 24,
              fontSize: 28,
              fontWeight: 'bold',
              color: '#8B1A1A',
              opacity: 0.15,
              letterSpacing: 2,
              textTransform: 'uppercase',
              transform: 'rotate(-8deg)',
              pointerEvents: 'none',
              animation: 'stampDrop 0.6s ease 1.2s both',
            }}>
              CLASSIFIED
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
            <div style={{ fontSize: 10, lineHeight: 1.8, color: '#6B5A3A' }}>
              <div style={{ fontWeight: 'bold', color: '#3B3220', fontSize: 11, marginBottom: 4 }}>SIGNED AND CERTIFIED BY:</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#3B3220', borderBottom: '1px solid #3B3220', paddingBottom: 4, marginBottom: 4, letterSpacing: 2 }}>
                {geologistInitials}
              </div>
              <div>{credential}</div>
              <div>Concealment Classification Division</div>
              <div>USDI Field Office — Sector Unknown</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <CompassRose size={80} />
              <div style={{ fontSize: 9, letterSpacing: 1, color: '#6B5A3A', textAlign: 'right' }}>INSTRUMENT CALIBRATED<br />RESULTS FINAL</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              style={{
                background: '#3B3220',
                color: '#F5F0E8',
                border: 'none',
                padding: '12px 24px',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 11,
                letterSpacing: 2,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              PRINT / ARCHIVE REPORT
            </button>
            <button
              onClick={() => {
                setPhase('intro');
                setCurrentQuestion(0);
                setAnswers({});
                setSelectedAnswer(null);
                setReportData(null);
                setAnalysisProgress(0);
              }}
              style={{
                background: 'transparent',
                color: '#3B3220',
                border: '1.5px solid #3B3220',
                padding: '12px 24px',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 11,
                letterSpacing: 2,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              SURVEY NEW SITE
            </button>
          </div>

          <div style={{ marginTop: 32, borderTop: '1px dashed #A89870', paddingTop: 12, fontSize: 9, color: '#A89870', letterSpacing: 1, lineHeight: 1.8 }}>
            FORM 7-C · CONCEALMENT CLASSIFICATION DIVISION · USDA SOIL TAXONOMY 14TH EDITION (EMOTIONAL SUPPLEMENT) · THIS REPORT IS NOT ADMISSIBLE IN ANY COURT. IT MAY, HOWEVER, BE ADMISSIBLE IN CONVERSATION.
          </div>
        </div>
      </div>
    );
  }

  return <div style={paperStyle}><div style={gridOverlay} /></div>;
}