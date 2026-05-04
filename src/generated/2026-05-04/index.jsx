import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [incidents, setIncidents] = useState([
    { id: 1, severity: 'CRITICAL', message: 'Attention still mounted to unresolved argument from 2019', timestamp: '09:14:02', resolved: false },
    { id: 2, severity: 'WARNING', message: 'Legacy dependency: "that thing you said at the party"', timestamp: '09:14:07', resolved: false },
    { id: 3, severity: 'INFO', message: 'Background process: replaying conversation — thread count: 847', timestamp: '09:14:11', resolved: false },
  ]);
  const [techChat, setTechChat] = useState([
    { id: 1, sender: 'MRVN-2', text: 'Beginning pre-migration scan. The attention is larger than the manifest indicated.', time: '09:13:58' },
    { id: 2, sender: 'PTCH-9', text: 'Confirmed. It has subdirectories we were not briefed on.', time: '09:14:03' },
  ]);
  const [activeWarnings, setActiveWarnings] = useState([
    'DESTINATION ENV DOES NOT SUPPORT AMBIENT DREAD',
    'PACKET LOSS EXCEEDS ACCEPTABLE THRESHOLD',
  ]);
  const [userInterventions, setUserInterventions] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('INITIALIZING MIGRATION');
  const [packetLoss, setPacketLoss] = useState(34);
  const [stabilized, setStabilized] = useState(false);
  const [blinkingNodes, setBlinkingNodes] = useState(['AMBIENT-DREAD', 'MEMORY-2017']);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [rerouting, setRerouting] = useState(false);
  const incidentIdRef = useRef(100);
  const chatIdRef = useRef(10);
  const chatEndRef = useRef(null);

  const phases = [
    'UNMOUNTING ATTENTION',
    'SERIALIZING FOCUS',
    'PACKET TRANSFER IN PROGRESS',
    'DEPENDENCY RESOLUTION FAILED',
    'RETRYING DEPENDENCY RESOLUTION',
    'COMPRESSING MEMORY FRAGMENTS',
    'VALIDATING DESTINATION ENVIRONMENT',
    'ROLLBACK INITIATED — ROLLBACK ABORTED',
    'NEGOTIATING WITH LEGACY SYSTEMS',
    'AWAITING RESPONSE FROM CORE',
  ];

  const allNodes = ['PREFRONTAL', 'MEMORY-2017', 'AMBIENT-DREAD', 'FOCUS-CORE', 'REGRET-CACHE', 'BACKGROUND-LOOP', 'PRESENT-MOMENT', 'HERE'];

  const incidentPool = [
    { severity: 'CRITICAL', message: 'Cannot serialize: thought still in use by unknown process' },
    { severity: 'WARNING', message: 'Circular reference detected: worry → cause of worry → worry' },
    { severity: 'CRITICAL', message: 'Memory fragment "what they meant by that" — cannot be freed' },
    { severity: 'WARNING', message: 'Ambient dread has spawned child process: ambient dread (child)' },
    { severity: 'INFO', message: 'Attention briefly arrived at HERE — then left' },
    { severity: 'CRITICAL', message: 'Legacy dependency: something from 2017 is still running' },
    { severity: 'WARNING', message: 'Focus container reports it is "fine"' },
    { severity: 'CRITICAL', message: 'Destination environment cannot parse: "what is the point"' },
    { severity: 'WARNING', message: 'Background process "that one decision" — kill attempt failed' },
    { severity: 'INFO', message: 'Packet arrived at HERE but immediately looked for the exit' },
    { severity: 'CRITICAL', message: 'Memory leak: 2am thoughts consuming 94% of available bandwidth' },
    { severity: 'WARNING', message: 'Intrusive process "but what if" — marked as essential by system' },
    { severity: 'CRITICAL', message: 'Attention has remounted to something from 2016 without authorization' },
    { severity: 'WARNING', message: 'Focus thread asking to speak to a supervisor' },
    { severity: 'INFO', message: 'Temporary container reports: occupant is asking questions' },
    { severity: 'CRITICAL', message: 'Cannot migrate: "that look on their face" is hardcoded' },
    { severity: 'WARNING', message: 'Orphaned thread: half-formed plan — no parent process found' },
    { severity: 'CRITICAL', message: '"What am I doing" process has escalated to kernel level' },
    { severity: 'WARNING', message: 'Nostalgia module interference — signal corrupted' },
    { severity: 'INFO', message: 'Migration paused: attention stopped to read something unrelated' },
    { severity: 'CRITICAL', message: 'Core dump: too many tabs open in consciousness' },
    { severity: 'WARNING', message: 'Reroute failed — path leads back to origin' },
    { severity: 'CRITICAL', message: 'Subdirectory "/regrets/minor/2018" is write-protected' },
    { severity: 'WARNING', message: 'Scheduler conflict: "being present" vs "replaying 2015"' },
    { severity: 'INFO', message: 'BRHL-7 has filed an incident report about the incident reports' },
  ];

  const chatPool = [
    { sender: 'MRVN-2', text: 'The attention is resisting serialization. This is normal. Probably.' },
    { sender: 'PTCH-9', text: 'I found a subdirectory we cannot name in the ticket. Logging it as "misc."' },
    { sender: 'KLVN-4', text: 'Packet loss is within expected range if expected range is "bad."' },
    { sender: 'BRHL-7', text: 'Please do not assist further. Each intervention increases scope.' },
    { sender: 'MRVN-2', text: 'The ambient dread module has requested a meeting. We declined.' },
    { sender: 'PTCH-9', text: 'Migration at 34%. Note: it has been at 34% for some time.' },
    { sender: 'KLVN-4', text: 'Background process "unfinished business" — estimated completion: unknown.' },
    { sender: 'BRHL-7', text: 'The attention briefly achieved stability. Then it remembered something.' },
    { sender: 'MRVN-2', text: 'We are rerouting around the 2017 dependency. It is load-bearing.' },
    { sender: 'PTCH-9', text: 'New incident created. By you. By clicking. We noted this.' },
    { sender: 'KLVN-4', text: 'Destination environment HERE is ready. Attention is not.' },
    { sender: 'BRHL-7', text: 'We have escalated to Tier 2 support. Tier 2 support is also us.' },
    { sender: 'MRVN-2', text: 'The memory fragments are heavier than the documentation suggested.' },
    { sender: 'PTCH-9', text: 'Circular dependency detected. We are aware. We have feelings about it.' },
    { sender: 'KLVN-4', text: 'Rollback was attempted. Rollback encountered the same problems.' },
    { sender: 'BRHL-7', text: 'Status: ongoing. ETA: we do not provide ETAs anymore.' },
    { sender: 'MRVN-2', text: 'The focus core is asking where it is supposed to go after this.' },
    { sender: 'PTCH-9', text: 'Good question. We forwarded it to BRHL-7. BRHL-7 is on a call.' },
  ];

  const chatPoolRef = useRef(0);
  const incidentPoolRef = useRef(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setMigrationProgress(prev => {
        if (prev >= 73) return 73;
        const increment = Math.random() * 2.5;
        const damping = prev > 65 ? 0.05 : prev > 50 ? 0.3 : 1;
        return Math.min(73, prev + increment * damping);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const phaseIndex = Math.floor(Math.random() * phases.length);
      setCurrentPhase(phases[phaseIndex]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!stabilized) {
        setPacketLoss(prev => {
          const newVal = 12 + Math.random() * 55;
          return Math.round(newVal);
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [stabilized]);

  useEffect(() => {
    const interval = setInterval(() => {
      const numBlink = 2 + Math.floor(Math.random() * 4);
      const shuffled = [...allNodes].sort(() => Math.random() - 0.5);
      setBlinkingNodes(shuffled.slice(0, numBlink));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stabilized) return;
      const chatEntry = chatPool[chatPoolRef.current % chatPool.length];
      chatPoolRef.current++;
      const newMsg = {
        id: chatIdRef.current++,
        sender: chatEntry.sender,
        text: chatEntry.text,
        time: new Date().toTimeString().slice(0, 8),
      };
      setTechChat(prev => [...prev.slice(-20), newMsg]);

      if (Math.random() > 0.5) {
        const inc = incidentPool[incidentPoolRef.current % incidentPool.length];
        incidentPoolRef.current++;
        const newInc = {
          id: incidentIdRef.current++,
          severity: inc.severity,
          message: inc.message,
          timestamp: new Date().toTimeString().slice(0, 8),
          resolved: false,
        };
        setIncidents(prev => [...prev.slice(-30), newInc]);
      }
    }, 3500 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [stabilized]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [techChat]);

  useEffect(() => {
    if (userInterventions >= 8 && !stabilized) {
      setStabilized(true);
      setTimeout(() => setShowFinalMessage(true), 1500);
      setTechChat(prev => [...prev, {
        id: chatIdRef.current++,
        sender: 'BRHL-7',
        text: 'User intervention count has exceeded safe parameters. Initiating containment.',
        time: new Date().toTimeString().slice(0, 8),
      }]);
    }
  }, [userInterventions, stabilized]);

  const handleAssist = useCallback((incidentId) => {
    if (stabilized) {
      setTechChat(prev => [...prev, {
        id: chatIdRef.current++,
        sender: 'PTCH-9',
        text: 'We appreciate the continued assistance. It is not helping.',
        time: new Date().toTimeString().slice(0, 8),
      }]);
      return;
    }
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, resolved: true } : i));
    const newIncidents = [0, 1, 2].map(offset => {
      const inc = incidentPool[(incidentPoolRef.current + offset) % incidentPool.length];
      return {
        id: incidentIdRef.current++,
        severity: inc.severity,
        message: inc.message,
        timestamp: new Date().toTimeString().slice(0, 8),
        resolved: false,
      };
    });
    incidentPoolRef.current += 3;
    setIncidents(prev => [...prev, ...newIncidents]);
    setUserInterventions(prev => prev + 1);
    setTechChat(prev => [...prev, {
      id: chatIdRef.current++,
      sender: 'MRVN-2',
      text: `Intervention logged. 3 new incidents created. Net change: +2.`,
      time: new Date().toTimeString().slice(0, 8),
    }]);
  }, [stabilized]);

  const handleForceQuit = useCallback(() => {
    if (stabilized) {
      setTechChat(prev => [...prev, {
        id: chatIdRef.current++,
        sender: 'KLVN-4',
        text: 'Force quit acknowledged. Process restarted automatically.',
        time: new Date().toTimeString().slice(0, 8),
      }]);
      return;
    }
    const newInc = {
      id: incidentIdRef.current++,
      severity: 'CRITICAL',
      message: 'Orphaned threads detected — parent process "force quit" has no children to return to',
      timestamp: new Date().toTimeString().slice(0, 8),
      resolved: false,
    };
    setIncidents(prev => [...prev, newInc]);
    setUserInterventions(prev => prev + 1);
    setActiveWarnings(prev => [...prev, 'ORPHANED THREADS CANNOT BE COLLECTED']);
  }, [stabilized]);

  const handleReroute = useCallback(() => {
    if (stabilized) return;
    setRerouting(true);
    setPacketLoss(8);
    setUserInterventions(prev => prev + 1);
    setTechChat(prev => [...prev, {
      id: chatIdRef.current++,
      sender: 'KLVN-4',
      text: 'Reroute successful. Packet loss temporarily reduced. Enjoy it.',
      time: new Date().toTimeString().slice(0, 8),
    }]);
    setTimeout(() => {
      setPacketLoss(78);
      setRerouting(false);
      setTechChat(prev => [...prev, {
        id: chatIdRef.current++,
        sender: 'KLVN-4',
        text: 'Reroute has failed. Packet loss is now worse. As predicted.',
        time: new Date().toTimeString().slice(0, 8),
      }]);
      const newInc = {
        id: incidentIdRef.current++,
        severity: 'CRITICAL',
        message: 'Reroute caused cascading failure in FOCUS-CORE → PRESENT-MOMENT path',
        timestamp: new Date().toTimeString().slice(0, 8),
        resolved: false,
      };
      const newInc2 = {
        id: incidentIdRef.current++,
        severity: 'WARNING',
        message: 'New route leads back through 2015 — unavoidable',
        timestamp: new Date().toTimeString().slice(0, 8),
        resolved: false,
      };
      const newInc3 = {
        id: incidentIdRef.current++,
        severity: 'WARNING',
        message: 'PRESENT-MOMENT node reporting "not ready"',
        timestamp: new Date().toTimeString().slice(0, 8),
        resolved: false,
      };
      setIncidents(prev => [...prev, newInc, newInc2, newInc3]);
    }, 2000);
  }, [stabilized]);

  const handleNodeClick = useCallback((nodeName) => {
    const messages = {
      'PREFRONTAL': 'BRHL-7',
      'MEMORY-2017': 'MRVN-2',
      'AMBIENT-DREAD': 'PTCH-9',
      'FOCUS-CORE': 'KLVN-4',
      'REGRET-CACHE': 'MRVN-2',
      'BACKGROUND-LOOP': 'PTCH-9',
      'PRESENT-MOMENT': 'BRHL-7',
      'HERE': 'KLVN-4',
    };
    const nodeMessages = {
      'PREFRONTAL': 'This node is still managing 2017 dependencies. We cannot touch it.',
      'MEMORY-2017': 'This memory is load-bearing. Removal attempted in Q3. Not recommended.',
      'AMBIENT-DREAD': 'The dread is not a bug. It is a feature of the original architecture.',
      'FOCUS-CORE': 'Focus core is online but not attending. This is a known state.',
      'REGRET-CACHE': 'Cache is full. Has been full since approximately 2016. Flush denied.',
      'BACKGROUND-LOOP': 'This loop has been running since before we were assigned to this ticket.',
      'PRESENT-MOMENT': 'Present moment node is available. Attention refuses to connect.',
      'HERE': 'Destination is ready. We are waiting. We have always been waiting.',
    };
    if (stabilized) {
      setTechChat(prev => [...prev, {
        id: chatIdRef.current++,
        sender: messages[nodeName] || 'BRHL-7',
        text: 'The system is stabilized. Please stop touching things.',
        time: new Date().toTimeString().slice(0, 8),
      }]);
      return;
    }
    setTechChat(prev => [...prev, {
      id: chatIdRef.current++,
      sender: messages[nodeName] || 'BRHL-7',
      text: nodeMessages[nodeName] || 'Node acknowledged. Nothing changed.',
      time: new Date().toTimeString().slice(0, 8),
    }]);
    setUserInterventions(prev => prev + 1);
    const newInc = {
      id: incidentIdRef.current++,
      severity: 'WARNING',
      message: `Manual inspection of ${nodeName} has destabilized adjacent nodes`,
      timestamp: new Date().toTimeString().slice(0, 8),
      resolved: false,
    };
    const newInc2 = {
      id: incidentIdRef.current++,
      severity: 'INFO',
      message: `${nodeName} is asking why you clicked it`,
      timestamp: new Date().toTimeString().slice(0, 8),
      resolved: false,
    };
    const newInc3 = {
      id: incidentIdRef.current++,
      severity: 'WARNING',
      message: `Legacy dependency from ${nodeName} reactivated`,
      timestamp: new Date().toTimeString().slice(0, 8),
      resolved: false,
    };
    setIncidents(prev => [...prev, newInc, newInc2, newInc3]);
  }, [stabilized]);

  const nodePositions = {
    'PREFRONTAL': { x: 80, y: 60 },
    'MEMORY-2017': { x: 220, y: 40 },
    'AMBIENT-DREAD': { x: 340, y: 90 },
    'FOCUS-CORE': { x: 150, y: 160 },
    'REGRET-CACHE': { x: 290, y: 180 },
    'BACKGROUND-LOOP': { x: 60, y: 240 },
    'PRESENT-MOMENT': { x: 200, y: 290 },
    'HERE': { x: 350, y: 270 },
  };

  const edges = [
    ['PREFRONTAL', 'MEMORY-2017'],
    ['PREFRONTAL', 'FOCUS-CORE'],
    ['MEMORY-2017', 'AMBIENT-DREAD'],
    ['MEMORY-2017', 'REGRET-CACHE'],
    ['AMBIENT-DREAD', 'REGRET-CACHE'],
    ['FOCUS-CORE', 'BACKGROUND-LOOP'],
    ['FOCUS-CORE', 'PRESENT-MOMENT'],
    ['REGRET-CACHE', 'PRESENT-MOMENT'],
    ['BACKGROUND-LOOP', 'PRESENT-MOMENT'],
    ['PRESENT-MOMENT', 'HERE'],
    ['AMBIENT-DREAD', 'HERE'],
  ];

  const severityColor = (sev) => {
    if (sev === 'CRITICAL') return '#ff3333';
    if (sev === 'WARNING') return '#ffb000';
    return '#00ff41';
  };

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(interval);
  }, []);

  const progressBarWidth = `${(migrationProgress / 100) * 100}%`;

  return (
    <div style={{
      background: '#0a0f0a',
      minHeight: '100vh',
      color: '#00ff41',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.08)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes dashMove { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-20} }
        @keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes nodePulse { 0%,100%{fill-opacity:0.2} 50%{fill-opacity:0.6} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .blink { animation: blink 1s infinite; }
        .node-alarm { animation: pulse 0.8s infinite; }
        .dash-line { stroke-dasharray:5,5; animation: dashMove 1s linear infinite; }
        .slide-in { animation: slideIn 0.4s ease-out; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)',
        pointerEvents: 'none', zIndex: 999,
      }} />

      {/* Header */}
      <div style={{
        borderBottom: '1px solid #00ff4133',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0a0f0a',
      }}>
        <div>
          <span style={{ color: '#00ff41', letterSpacing: '3px', fontSize: '13px' }}>
            ▶ ATTN-MIGRATE v2.7.1 — LIVE MIGRATION DASHBOARD
          </span>
          <span className="blink" style={{ marginLeft: '8px', color: '#ffb000' }}>●</span>
          <span style={{ marginLeft: '4px', color: '#ffb000', fontSize: '11px' }}>MIGRATION IN PROGRESS</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '11px' }}>
          <span style={{ color: '#666' }}>TICKET: ATTN-{String(Date.now()).slice(-6)}</span>
          <span style={{ color: packetLoss > 50 ? '#ff3333' : '#ffb000' }}>PKT LOSS: {packetLoss}%</span>
          <span style={{ color: '#666' }}>INTERVENTIONS: <span style={{ color: userInterventions > 5 ? '#ff3333' : '#00ff41' }}>{userInterventions}</span></span>
          <span style={{ color: '#666' }}>SYS TIME: {new Date().toTimeString().slice(0, 8)}</span>
        </div>
      </div>

      {/* Active warnings ticker */}
      {activeWarnings.length > 0 && (
        <div style={{
          background: '#1a0a00',
          borderBottom: '1px solid #ffb00044',
          padding: '4px 16px',
          color: '#ffb000',
          fontSize: '11px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ marginRight: '16px' }}>⚠</span>
          {activeWarnings.map((w, i) => (
            <span key={i} style={{ marginRight: '48px' }}>[ {w} ]</span>
          ))}
        </div>
      )}

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 80px)' }}>

        {/* LEFT: Network Topology */}
        <div style={{
          width: '420px',
          borderRight: '1px solid #00ff4122',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ color: '#00ff4188', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>
            ── NETWORK TOPOLOGY ── ATTENTION MIGRATION MAP ──
          </div>

          <div style={{ border: '1px solid #00ff4122', padding: '8px', marginBottom: '8px' }}>
            <svg width="400" height="340" style={{ display: 'block' }}>
              {/* Edges */}
              {edges.map(([a, b], i) => {
                const pa = nodePositions[a];
                const pb = nodePositions[b];
                const isActive = !blinkingNodes.includes(a) && !blinkingNodes.includes(b);
                return (
                  <line
                    key={i}
                    x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                    stroke={isActive ? '#00ff4155' : '#ff333355'}
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    className="dash-line"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                );
              })}

              {/* Nodes */}
              {Object.entries(nodePositions).map(([name, pos]) => {
                const isAlarming = blinkingNodes.includes(name);
                const isHere = name === 'HERE';
                const color = isHere ? '#00aaff' : isAlarming ? '#ff3333' : '#00ff41';
                return (
                  <g key={name} onClick={() => handleNodeClick(name)} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={pos.x} cy={pos.y} r={isHere ? 20 : 16}
                      fill={color}
                      fillOpacity={isAlarming ? 0.3 : 0.15}
                      stroke={color}
                      strokeWidth={isAlarming ? 2 : 1}
                      className={isAlarming ? 'node-alarm' : ''}
                    />
                    <circle
                      cx={pos.x} cy={pos.y} r={4}
                      fill={color}
                      className={isAlarming ? 'node-alarm' : ''}
                    />
                    <text
                      x={pos.x} y={pos.y + 28}
                      textAnchor="middle"
                      fill={color}
                      fontSize="8"
                      fontFamily="Courier New, monospace"
                    >
                      {name}
                    </text>
                    {isAlarming && (
                      <text
                        x={pos.x + 14} y={pos.y - 14}
                        fill="#ff3333"
                        fontSize="10"
                        className="blink"
                      >!</text>
                    )}
                  </g>
                );
              })}

              {/* Source/Dest labels */}
              <text x={10} y={320} fill="#00ff4144" fontSize="9" fontFamily="Courier New">SRC: WHEREVER-YOU-WERE</text>
              <text x={260} y={320} fill="#00aaff88" fontSize="9" fontFamily="Courier New">DST: HERE</text>
            </svg>
          </div>

          <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>
            CLICK NODES TO INSPECT — RESULTS MAY VARY
          </div>

          {/* Background Processes */}
          <div style={{ border: '1px solid #00ff4122', padding: '8px', flex: 1, overflow: 'auto' }}>
            <div style={{ color: '#00ff4188', fontSize: '10px', letterSpacing: '1px', marginBottom: '6px' }}>
              ── BACKGROUND PROCESSES ──
            </div>
            {[
              { name: 'replaying-conversation.exe', cpu: '34%', status: 'RUNNING' },
              { name: 'what-did-they-mean.svc', cpu: '67%', status: 'HUNG' },
              { name: 'ambient-dread-daemon', cpu: '12%', status: 'RUNNING' },
              { name: 'unfinished-business.proc', cpu: '89%', status: 'CRITICAL' },
              { name: 'that-one-decision-2016', cpu: '23%', status: 'ZOMBIE' },
            ].map((proc, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '3px 0', borderBottom: '1px solid #00ff4111',
              }}>
                <span style={{ color: proc.status === 'CRITICAL' ? '#ff3333' : proc.status === 'ZOMBIE' ? '#ffb000' : '#00ff4199', fontSize: '10px' }}>
                  {proc.name}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontSize: '9px' }}>{proc.cpu}</span>
                  <button
                    onClick={handleForceQuit}
                    style={{
                      background: 'transparent', border: '1px solid #ff333344',
                      color: stabilized ? '#333' : '#ff3333', padding: '1px 4px',
                      fontSize: '9px', cursor: stabilized ? 'default' : 'pointer',
                      fontFamily: 'Courier New, monospace',
                    }}
                  >KILL</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Migration Dashboard */}
        <div style={{
          flex: 1,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Progress section */}
          <div style={{ border: '1px solid #00ff4122', padding: '12px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#00ff41', letterSpacing: '2px', fontSize: '11px' }}>
                MIGRATION PROGRESS
              </span>
              <span style={{
                color: migrationProgress >= 70 ? '#ffb000' : '#00ff41',
                fontSize: '13px', fontWeight: 'bold',
              }}>
                {migrationProgress.toFixed(1)}%
                {migrationProgress >= 70 && <span className="blink" style={{ marginLeft: '6px', fontSize: '10px', color: '#ffb000' }}>[STALLED]</span>}
              </span>
            </div>
            <div style={{
              height: '16px', background: '#0a1a0a', border: '1px solid #00ff4133',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: progressBarWidth,
                background: migrationProgress >= 70 ? 'repeating-linear-gradient(90deg, #ffb000 0px, #ffb000 8px, #7a5500 8px, #7a5500 16px)' : 'repeating-linear-gradient(90deg, #00ff41 0px, #00ff41 8px, #006618 8px, #006618 16px)',
                transition: 'width 1s ease-out',
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', color: '#00ff4188', letterSpacing: '2px',
              }}>
                {currentPhase}
                <span className="blink" style={{ marginLeft: '4px' }}>_</span>
              </div>
            </div>
            <div style={{ marginTop: '6px', fontSize: '10px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
              <span>ETA: INDETERMINATE</span>
              <span style={{ color: '#ff3333' }}>TARGET: 100% — CURRENT CEILING: 73%</span>
              <span>RETRIES: {userInterventions * 3 + 2}</span>
            </div>
          </div>

          {/* Phase status indicators */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'UNMOUNT', done: migrationProgress > 15 },
              { label: 'SERIALIZE', done: migrationProgress > 28 },
              { label: 'TRANSFER', done: false, active: migrationProgress > 28 },
              { label: 'VALIDATE', done: false, active: false },
              { label: 'MOUNT', done: false, active: false },
            ].map((step, i) => (
              <div key={i} style={{
                border: `1px solid ${step.done ? '#00ff4166' : step.active ? '#ffb00066' : '#333'}`,
                padding: '4px 8px', fontSize: '9px', letterSpacing: '1px',
                color: step.done ? '#00ff41' : step.active ? '#ffb000' : '#333',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {step.done ? '✓' : step.active ? '▶' : '○'} {step.label}
              </div>
            ))}
            <div style={{ border: '1px solid #ff333344', padding: '4px 8px', fontSize: '9px', color: '#ff3333' }}>
              ✗ COMPLETE — BLOCKED
            </div>
          </div>

          {/* Network stats */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {[
              { label: 'PACKET LOSS', value: `${packetLoss}%`, crit: packetLoss > 50 },
              { label: 'BANDWIDTH', value: `${(2.4 - packetLoss * 0.02).toFixed(1)} Mb/s`, crit: false },
              { label: 'LATENCY', value: `${140 + packetLoss * 3}ms`, crit: packetLoss > 40 },
              { label: 'INCIDENTS', value: incidents.filter(i => !i.resolved).length, crit: incidents.filter(i => !i.resolved).length > 10 },
            ].map((stat, i) => (
              <div key={i} style={{
                border: `1px solid ${stat.crit ? '#ff333344' : '#00ff4122'}`,
                padding: '6px 10px', flex: 1, textAlign: 'center',
                background: stat.crit ? '#1a0000' : 'transparent',
              }}>
                <div style={{ fontSize: '9px', color: '#666', letterSpacing: '1px' }}>{stat.label}</div>
                <div style={{ fontSize: '16px', color: stat.crit ? '#ff3333' : '#00ff41', marginTop: '2px' }}>
                  {stat.value}
                </div>
              </div>
            ))}
            <button
              onClick={handleReroute}
              style={{
                border: `1px solid ${rerouting ? '#ffb000' : '#00ff4144'}`,
                background: 'transparent',
                color: stabilized ? '#333' : rerouting ? '#ffb000' : '#00ff41',
                padding: '6px 12px', cursor: stabilized ? 'default' : 'pointer',
                fontSize: '10px', fontFamily: 'Courier New, monospace',
                letterSpacing: '1px', whiteSpace: 'nowrap',
              }}
            >
              {rerouting ? 'REROUTING...' : '⇄ REROUTE'}
            </button>
          </div>

          {/* Incidents list */}
          <div style={{
            border: '1px solid #00ff4122', flex: 1, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              padding: '6px 10px', borderBottom: '1px solid #00ff4122',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '10px', color: '#00ff4188', letterSpacing: '2px' }}>
                ── INCIDENT LOG ──
              </span>
              <span style={{ fontSize: '9px', color: '#666' }}>
                {incidents.filter(i => !i.resolved).length} OPEN / {incidents.filter(i => i.resolved).length} RESOLVED
              </span>
            </div>
            <div style={{ overflow: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #00ff4111' }}>
                    {['TIME', 'SEV', 'MESSAGE', 'ACTION'].map(h => (
                      <th key={h} style={{
                        padding: '4px 8px', textAlign: 'left',
                        fontSize: '9px', color: '#444', letterSpacing: '1px',
                        position: 'sticky', top: 0, background: '#0a0f0a',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...incidents].reverse().map(inc => (
                    <tr
                      key={inc.id}
                      className="slide-in"
                      style={{
                        borderBottom: '1px solid #00ff4108',
                        opacity: inc.resolved ? 0.3 : 1,
                        background: inc.severity === 'CRITICAL' && !inc.resolved ? '#1a000011' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '3px 8px', color: '#444', fontSize: '10px', whiteSpace: 'nowrap' }}>
                        {inc.timestamp}
                      </td>
                      <td style={{ padding: '3px 8px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          color: severityColor(inc.severity), fontSize: '9px',
                          border: `1px solid ${severityColor(inc.severity)}44`,
                          padding: '1px 4px',
                        }}>
                          {inc.severity}
                        </span>
                      </td>
                      <td style={{ padding: '3px 8px', color: '#00ff41cc', fontSize: '10px' }}>
                        {inc.message}
                      </td>
                      <td style={{ padding: '3px 8px' }}>
                        {!inc.resolved ? (
                          <button
                            onClick={() => handleAssist(inc.id)}
                            style={{
                              background: 'transparent',
                              border: `1px solid ${stabilized ? '#333' : '#00ff4144'}`,
                              color: stabilized ? '#333' : '#00ff41',
                              padding: '2px 6px', fontSize: '9px',
                              cursor: stabilized ? 'default' : 'pointer',
                              fontFamily: 'Courier New, monospace',
                            }}
                          >
                            ASSIST
                          </button>
                        ) : (
                          <span style={{ color: '#333', fontSize: '9px' }}>RESOLVED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Technician Chat */}
        <div style={{
          width: '300px',
          borderLeft: '1px solid #00ff4122',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '8px 12px', borderBottom: '1px solid #00ff4122',
            fontSize: '10px', color: '#00ff4188', letterSpacing: '2px',
          }}>
            ── TECH TEAM COMMS ──
          </div>

          {/* Technician status badges */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #00ff4111', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['MRVN-2', 'PTCH-9', 'KLVN-4', 'BRHL-7'].map(tech => (
              <div key={tech} style={{
                fontSize: '9px', padding: '2px 6px',
                border: `1px solid ${tech === 'BRHL-7' ? '#ffb00066' : '#00ff4133'}`,
                color: tech === 'BRHL-7' ? '#ffb000' : '#00ff4188',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <span className="blink" style={{ color: tech === 'BRHL-7' ? '#ffb000' : '#00ff41' }}>●</span>
                {tech}
                {tech === 'BRHL-7' && <span style={{ fontSize: '8px', color: '#ffb000' }}>LEAD</span>}
              </div>
            ))}
          </div>

          {/* Final message pinned */}
          {showFinalMessage && (
            <div className="slide-in" style={{
              margin: '8px',
              border: '1px solid #ffb000',
              background: '#1a0f00',
              padding: '10px',
              fontSize: '10px',
            }}>
              <div style={{ color: '#ffb000', marginBottom: '4px', fontSize: '9px', letterSpacing: '1px' }}>
                📌 PINNED — BRHL-7 — LEAD TECHNICIAN — FINAL STATUS
              </div>
              <div style={{ color: '#ffb000', lineHeight: '1.6' }}>
                We have stabilized the attention in a temporary container. It is asking questions we are not equipped to answer. We recommend leaving it here for now.
              </div>
              <div style={{ marginTop: '6px', fontSize: '9px', color: '#7a5500' }}>
                Migration status: INDEFINITELY DEFERRED<br />
                Container: STABLE (TEMPORARY)<br />
                Next action: NONE RECOMMENDED
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            {techChat.map(msg => (
              <div key={msg.id} className="slide-in" style={{
                marginBottom: '10px', padding: '6px 8px',
                borderLeft: `2px solid ${msg.sender === 'BRHL-7' ? '#ffb000' : '#00ff4144'}`,
                background: msg.sender === 'BRHL-7' ? '#0f0800' : 'transparent',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{
                    color: msg.sender === 'BRHL-7' ? '#ffb000' : '#00ff4199',
                    fontSize: '9px', letterSpacing: '1px',
                  }}>
                    {msg.sender}
                  </span>
                  <span style={{ color: '#333', fontSize: '9px' }}>{msg.time}</span>
                </div>
                <div style={{ color: '#00ff41cc', fontSize: '10px', lineHeight: '1.5' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input (disabled, sad) */}
          <div style={{ padding: '8px', borderTop: '1px solid #00ff4122' }}>
            <div style={{
              border: '1px solid #00ff4122', padding: '6px 8px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ color: '#333', fontSize: '10px', flex: 1 }}>
                {stabilized ? 'COMMS CLOSED' : 'READ-ONLY CHANNEL'}
              </span>
              <span className="blink" style={{ color: '#333' }}>_</span>
            </div>
            <div style={{ fontSize: '9px', color: '#333', marginTop: '4px', textAlign: 'center' }}>
              {stabilized ? 'TECHNICIANS HAVE LEFT THE CHANNEL' : 'USER INPUT NOT SUPPORTED'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #00ff4122',
        padding: '4px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '9px',
        color: '#333',
        background: '#0a0f0a',
      }}>
        <span>ATTN-MIGRATE ENTERPRISE — COGNITIVE INFRASTRUCTURE DIVISION</span>
        <span style={{ color: '#00ff4133' }}>
          {stabilized ? '⚠ SYSTEM STABILIZED — FURTHER ACTION NOT RECOMMENDED' : `▶ MIGRATING — TICK ${tick}`}
          {!stabilized && <span className="blink"> _</span>}
        </span>
        <span>© WHEREVER-YOU-WERE SYSTEMS LLC</span>
      </div>
    </div>
  );
}