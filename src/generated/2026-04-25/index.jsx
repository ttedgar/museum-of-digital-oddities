import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const getUserNumber = () => {
    const now = new Date();
    const future = new Date(now.getTime() + 3 * 365.25 * 24 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${pad(future.getHours())}:${pad(future.getMinutes())}`;
    const dateStr = `${future.getMonth() + 1}/${future.getDate()}/${future.getFullYear()}`;
    return {
      number: `(${555 + (now.getSeconds() % 10) * 3}-${pad(now.getMinutes())}-${pad(now.getSeconds())}${pad(now.getMilliseconds() % 100)})`,
      timestamp: `${dateStr} ${timeStr}`
    };
  };

  const INITIAL_VOICEMAILS = [
    {
      id: 1,
      from: '(975) 555-0142',
      label: 'Disconnected — Mercer County exchange, retired 1994',
      timestamp: '3/14/1994  11:07 AM',
      transcript: "Hi, it's me. I just wanted to remind you about the casserole dish — the [INAUDIBLE] one, the blue one with the [INAUDIBLE] handle. I left it at your place last [INAUDIBLE] and I was wondering if you could just set it by the door. I'll come by whenever. No rush. I just — the [INAUDIBLE] doesn't hold heat the same way and I need it for [INAUDIBLE]. Okay. Love you. Okay. Bye.",
      duration: '0:32',
    },
    {
      id: 2,
      from: '(000) 000-0001',
      label: 'Area code 000 — never assigned',
      timestamp: '7/4/1976  9:00 AM',
      transcript: "This is a confirmation call for your appointment on [INAUDIBLE]. Please arrive fifteen minutes early and bring your [INAUDIBLE]. If you need to reschedule, press one. If you need to cancel, press two. If you need to [INAUDIBLE], press [INAUDIBLE]. We look forward to seeing you on [INAUDIBLE]. This month has been [INAUDIBLE]. Thank you.",
      duration: '0:28',
    },
    {
      id: 3,
      from: '(312) 744-1987',
      label: 'Briefly assigned to a laundromat, Wicker Park, 1987',
      timestamp: '11/22/1987  2:44 PM',
      transcript: "Hello? Hello, is this — okay I think I got the machine. This is [INAUDIBLE] from the laundromat on [INAUDIBLE]. We found something in dryer number four. A [INAUDIBLE], I think? Or maybe a [INAUDIBLE]. Either way it's important-looking. We're open until nine. You can come by whenever you [INAUDIBLE]. We put it somewhere [INAUDIBLE]. Okay. We put it somewhere safe.",
      duration: '0:41',
    },
    {
      id: 4,
      from: '(NXX) 555-0199',
      label: 'NXX — letters in area code position',
      timestamp: '??/??/????  ??:?? ??',
      transcript: "It's okay to come home now. [INAUDIBLE]? Can you hear me? I said it's okay. Everyone's [INAUDIBLE] and we [INAUDIBLE] and the [INAUDIBLE] is done now. It's done. You can come back. The door is [INAUDIBLE]. I left the light [INAUDIBLE]. Come home. It's okay. It's [INAUDIBLE]. Please.",
      duration: '0:19',
    },
    {
      id: 5,
      from: '(-1) 800-BEFORE',
      label: 'Negative area code — impossible routing',
      timestamp: 'BEFORE  BEFORE:BEFORE',
      transcript: "Hi! You've reached the extended warranty department for your [INAUDIBLE]. Our records show your [INAUDIBLE] is about to expire. This is your final notice regarding your [INAUDIBLE]. To extend your [INAUDIBLE], press one. To speak to a representative about your [INAUDIBLE], press two. To decline this offer and [INAUDIBLE] forever, press [INAUDIBLE]. We've been trying to reach you. We've been [INAUDIBLE]. We just wanted you to know about the [INAUDIBLE].",
      duration: '0:55',
    },
  ];

  const IMPOSSIBLE_NUMBERS = [
    {
      from: 'BEFORE BEFORE BEFORE',
      label: 'Not a number — a word, repeated',
      timestamp: 'BEFORE  BEFORE:BEFORE',
      transcript: "I keep calling because the [INAUDIBLE] keeps ringing. Do you hear it? Every time I [INAUDIBLE] I hear it again. I don't know if this is the right number. I don't know if there is a right number. I just — I needed to tell someone that [INAUDIBLE] and I [INAUDIBLE] and I'm sorry about the [INAUDIBLE]. I'm sorry. Can you hear me? Is anyone [INAUDIBLE]?",
      duration: '1:03',
    },
    {
      from: '(∅∅∅) ∅∅∅-∅∅∅∅',
      label: 'Null set — number does not exist in any system',
      timestamp: '0/0/0000  00:00 AM',
      transcript: "The [INAUDIBLE] has been [INAUDIBLE]. We wanted to let you know. The [INAUDIBLE] you left with us in [INAUDIBLE] has been [INAUDIBLE] safely and the [INAUDIBLE] is still [INAUDIBLE] and we think about it sometimes. We think about [INAUDIBLE]. We think about you. Not in a [INAUDIBLE] way. Just in a — you were here and now you [INAUDIBLE] and the [INAUDIBLE] is still here. That's all.",
      duration: '0:47',
    },
    {
      from: '(−800) 555-AFTER',
      label: 'Negative exchange — routed from after the call ends',
      timestamp: 'AFTER  AFTER:AFTER',
      transcript: "Hi, this message is for [INAUDIBLE]. We're calling to confirm that [INAUDIBLE] went [INAUDIBLE]. The [INAUDIBLE] was [INAUDIBLE] and everyone was [INAUDIBLE] and at the end [INAUDIBLE] said something about [INAUDIBLE] and we thought you should know. We thought [INAUDIBLE]. We're going to stop calling after this. After this we're [INAUDIBLE]. But we wanted you to hear it from [INAUDIBLE]. We wanted you to hear it.",
      duration: '1:14',
    },
  ];

  const [voicemails, setVoicemails] = useState(() =>
    INITIAL_VOICEMAILS.map(v => ({ ...v, read: false, saving: false, deleted: false }))
  );
  const [activeId, setActiveId] = useState(null);
  const [transcriptProgress, setTranscriptProgress] = useState({});
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [finalRevealed, setFinalRevealed] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [newFlashIds, setNewFlashIds] = useState(new Set());
  const [impossibleIndex, setImpossibleIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [tick, setTick] = useState(0);

  const transcriptIntervalRef = useRef(null);
  const newMessageIntervalRef = useRef(null);
  const transcriptPanelRef = useRef(null);

  const activeVoicemail = voicemails.find(v => v.id === activeId && !v.deleted);

  // Transcription ticker
  useEffect(() => {
    if (transcriptIntervalRef.current) clearInterval(transcriptIntervalRef.current);
    if (!activeId || !activeVoicemail) return;

    const vm = activeVoicemail;
    const fullText = vm.transcript;
    const isFinal = vm.isFinal;

    setTranscriptProgress(prev => ({ ...prev, [activeId]: prev[activeId] || 0 }));

    const speed = isFinal ? 80 : 45;

    transcriptIntervalRef.current = setInterval(() => {
      setTranscriptProgress(prev => {
        const current = prev[activeId] || 0;
        if (current >= fullText.length) {
          clearInterval(transcriptIntervalRef.current);
          return prev;
        }
        return { ...prev, [activeId]: current + 1 };
      });
    }, speed);

    return () => clearInterval(transcriptIntervalRef.current);
  }, [activeId]);

  // Mark as read when active
  useEffect(() => {
    if (activeId) {
      setVoicemails(prev => prev.map(v => v.id === activeId ? { ...v, read: true } : v));
    }
  }, [activeId]);

  // Auto-scroll transcript panel
  useEffect(() => {
    if (transcriptPanelRef.current) {
      transcriptPanelRef.current.scrollTop = transcriptPanelRef.current.scrollHeight;
    }
  }, [transcriptProgress, activeId]);

  // New voicemail arrival interval
  useEffect(() => {
    newMessageIntervalRef.current = setInterval(() => {
      if (finalRevealed) {
        clearInterval(newMessageIntervalRef.current);
        return;
      }
      setImpossibleIndex(prev => {
        if (prev >= IMPOSSIBLE_NUMBERS.length) return prev;
        const newVm = {
          ...IMPOSSIBLE_NUMBERS[prev],
          id: 100 + prev,
          read: false,
          saving: false,
          deleted: false,
        };
        setVoicemails(vms => [...vms, newVm]);
        setNewFlashIds(ids => new Set([...ids, newVm.id]));
        setTimeout(() => {
          setNewFlashIds(ids => {
            const next = new Set(ids);
            next.delete(newVm.id);
            return next;
          });
        }, 3000);
        return prev + 1;
      });
    }, 28000);

    return () => clearInterval(newMessageIntervalRef.current);
  }, [finalRevealed]);

  // Trigger final voicemail when 2+ deleted
  useEffect(() => {
    if (deletedIds.size >= 2 && !finalRevealed) {
      setFinalRevealed(true);
      const { number, timestamp } = getUserNumber();
      const finalVm = {
        id: 999,
        from: number,
        label: 'Your number — call placed ' + timestamp,
        timestamp: timestamp,
        transcript: '[INAUDIBLE] but I meant it.',
        duration: '0:04',
        read: false,
        saving: false,
        deleted: false,
        isFinal: true,
      };
      setTimeout(() => {
        setVoicemails(vms => [...vms, finalVm]);
        setNewFlashIds(ids => new Set([...ids, 999]));
        setTimeout(() => {
          setNewFlashIds(ids => {
            const next = new Set(ids);
            next.delete(999);
            return next;
          });
        }, 5000);
      }, 2000);
    }
  }, [deletedIds, finalRevealed]);

  // Star key handler
  const handleStar = useCallback(() => {
    if (!activeId) return;
    const vm = voicemails.find(v => v.id === activeId);
    if (!vm || vm.deleted || vm.saving) return;

    setVoicemails(prev => prev.map(v => v.id === activeId ? { ...v, saving: true } : v));
    setThankYouVisible(true);

    setTimeout(() => {
      setThankYouVisible(false);
      setVoicemails(prev => prev.map(v => v.id === activeId ? { ...v, deleted: true } : v));
      setDeletedIds(prev => new Set([...prev, activeId]));
      setActiveId(null);
      setTranscriptProgress(prev => {
        const next = { ...prev };
        delete next[activeId];
        return next;
      });
    }, 1800);
  }, [activeId, voicemails]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '*') {
        e.preventDefault();
        handleStar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStar]);

  // Tick for blinking cursor
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 500);
    return () => clearInterval(t);
  }, []);

  const visibleVoicemails = voicemails.filter(v => !v.deleted);
  const unreadCount = visibleVoicemails.filter(v => !v.read).length;

  const getTranscriptDisplay = (vm) => {
    if (!vm) return '';
    const progress = transcriptProgress[vm.id] || 0;
    if (vm.saving) return 'Thank you for listening.';
    return vm.transcript.slice(0, progress);
  };

  const isTranscribing = (vm) => {
    if (!vm) return false;
    const progress = transcriptProgress[vm.id] || 0;
    return progress < vm.transcript.length && activeId === vm.id;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0d12',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#7fff8a',
    }}>
      <style>{`
        @keyframes phosphorFlicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.85; }
          94% { opacity: 1; }
          97% { opacity: 0.9; }
          98% { opacity: 1; }
        }
        @keyframes newFlash {
          0%, 100% { background: transparent; }
          25% { background: rgba(246, 173, 85, 0.18); }
          75% { background: rgba(246, 173, 85, 0.08); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes thankYouFade {
          0% { opacity: 0; transform: scale(0.97); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'rgba(127, 255, 138, 0.04)',
          animation: 'scanline 8s linear infinite',
        }} />
      </div>

      {/* CRT vignette */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 99,
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
      }} />

      {/* Thank you overlay */}
      {thankYouVisible && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          background: 'rgba(10, 13, 18, 0.85)',
          animation: 'thankYouFade 1.8s ease forwards',
        }}>
          <div style={{
            color: '#7fff8a',
            fontSize: '22px',
            letterSpacing: '0.15em',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(127, 255, 138, 0.8)',
          }}>
            Thank you for listening.
          </div>
        </div>
      )}

      {/* Main container */}
      <div style={{
        width: '100%',
        maxWidth: '720px',
        animation: 'phosphorFlicker 12s infinite',
      }}>
        {/* Header */}
        <div style={{
          borderBottom: '1px solid #1e2d1e',
          paddingBottom: '12px',
          marginBottom: '0',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '4px',
          }}>
            <div style={{ fontSize: '11px', color: '#3a5040', letterSpacing: '0.2em' }}>
              CARRIER VOICEMAIL SYSTEM v2.1
            </div>
            <div style={{ fontSize: '11px', color: '#3a5040', letterSpacing: '0.1em' }}>
              SVC: OFFLINE
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '20px', letterSpacing: '0.08em', color: '#7fff8a' }}>
              VOICEMAIL INBOX
            </div>
            <div style={{
              fontSize: '13px',
              color: unreadCount > 0 ? '#f6ad55' : '#3a5040',
              animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
            }}>
              {unreadCount > 0 ? `${unreadCount} NEW` : 'NO NEW MESSAGES'}
            </div>
          </div>
        </div>

        {/* Voicemail list */}
        <div style={{
          borderBottom: '1px solid #1e2d1e',
          marginBottom: '0',
        }}>
          {visibleVoicemails.map((vm, i) => {
            const isActive = activeId === vm.id;
            const isNew = newFlashIds.has(vm.id);
            const isHovered = hoveredId === vm.id;
            const isFinal = vm.isFinal;

            return (
              <div
                key={vm.id}
                onClick={() => {
                  if (!vm.saving) {
                    setActiveId(vm.id);
                    if (!transcriptProgress[vm.id]) {
                      setTranscriptProgress(prev => ({ ...prev, [vm.id]: 0 }));
                    }
                  }
                }}
                onMouseEnter={() => setHoveredId(vm.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: '10px 12px',
                  borderBottom: i < visibleVoicemails.length - 1 ? '1px solid #111820' : 'none',
                  cursor: 'pointer',
                  background: isActive
                    ? 'rgba(127, 255, 138, 0.06)'
                    : isNew
                    ? 'rgba(246, 173, 85, 0.08)'
                    : isHovered
                    ? 'rgba(127, 255, 138, 0.03)'
                    : 'transparent',
                  animation: isNew ? 'newFlash 1.5s ease 3' : (isActive ? 'fadeIn 0.2s ease' : 'none'),
                  transition: 'background 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      {!vm.read && (
                        <span style={{
                          width: '6px', height: '6px',
                          borderRadius: '50%',
                          background: isFinal ? '#ff6b6b' : '#f6ad55',
                          display: 'inline-block',
                          flexShrink: 0,
                          boxShadow: isFinal ? '0 0 6px rgba(255,107,107,0.8)' : '0 0 4px rgba(246,173,85,0.6)',
                        }} />
                      )}
                      {vm.read && <span style={{ width: '6px', flexShrink: 0 }} />}
                      <span style={{
                        fontSize: '15px',
                        color: isFinal
                          ? '#ff9999'
                          : isActive
                          ? '#7fff8a'
                          : vm.read
                          ? '#4a5568'
                          : '#a0c4a8',
                        letterSpacing: '0.05em',
                        textShadow: isActive ? '0 0 8px rgba(127,255,138,0.4)' : 'none',
                      }}>
                        {vm.from}
                      </span>
                      {isNew && (
                        <span style={{
                          fontSize: '9px',
                          color: '#f6ad55',
                          border: '1px solid #f6ad55',
                          padding: '1px 4px',
                          letterSpacing: '0.15em',
                          animation: 'pulse 1s infinite',
                        }}>NEW</span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: isHovered || isActive ? '#3a5040' : '#1e2d1e',
                      paddingLeft: '14px',
                      letterSpacing: '0.05em',
                      transition: 'color 0.2s',
                    }}>
                      {vm.label}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#3a5040' }}>{vm.timestamp}</div>
                    <div style={{ fontSize: '11px', color: '#2a3a2a' }}>{vm.duration}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {visibleVoicemails.length === 0 && (
            <div style={{ padding: '20px 12px', color: '#2a3a2a', fontSize: '13px', textAlign: 'center' }}>
              NO MESSAGES
            </div>
          )}
        </div>

        {/* Transcript panel */}
        <div style={{
          minHeight: '180px',
          background: '#060910',
          border: '1px solid #1e2d1e',
          borderTop: 'none',
          padding: '16px',
          position: 'relative',
        }}>
          {!activeVoicemail ? (
            <div style={{
              color: '#1e2d1e',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textAlign: 'center',
              marginTop: '30px',
            }}>
              SELECT A MESSAGE TO BEGIN TRANSCRIPTION
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                borderBottom: '1px solid #111820',
                paddingBottom: '8px',
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#3a5040', letterSpacing: '0.15em', marginBottom: '2px' }}>
                    TRANSCRIBING FROM
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: activeVoicemail.isFinal ? '#ff9999' : '#7fff8a',
                    letterSpacing: '0.06em',
                    textShadow: activeVoicemail.isFinal ? '0 0 10px rgba(255,100,100,0.5)' : '0 0 8px rgba(127,255,138,0.4)',
                  }}>
                    {activeVoicemail.from}
                  </div>
                  <div style={{ fontSize: '10px', color: '#2a3a2a', marginTop: '2px' }}>
                    {activeVoicemail.timestamp}
                  </div>
                </div>
                {isTranscribing(activeVoicemail) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#3a5040',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#7fff8a',
                      animation: 'pulse 0.8s infinite',
                    }} />
                    LIVE
                  </div>
                )}
              </div>

              <div
                ref={transcriptPanelRef}
                style={{
                  maxHeight: '140px',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                }}
              >
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: activeVoicemail.saving
                    ? '#7fff8a'
                    : activeVoicemail.isFinal
                    ? '#ffaaaa'
                    : '#7fff8a',
                  letterSpacing: '0.03em',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  textShadow: activeVoicemail.saving
                    ? '0 0 12px rgba(127,255,138,0.6)'
                    : activeVoicemail.isFinal
                    ? '0 0 8px rgba(255,150,150,0.4)'
                    : '0 0 4px rgba(127,255,138,0.2)',
                }}>
                  {(() => {
                    const text = getTranscriptDisplay(activeVoicemail);
                    const parts = text.split(/(\[INAUDIBLE\])/g);
                    return parts.map((part, i) =>
                      part === '[INAUDIBLE]' ? (
                        <span key={i} style={{ color: '#2a4a2a', fontStyle: 'italic' }}>[INAUDIBLE]</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    );
                  })()}
                  {isTranscribing(activeVoicemail) && (
                    <span style={{
                      opacity: tick % 2 === 0 ? 1 : 0,
                      color: '#7fff8a',
                      transition: 'opacity 0.1s',
                    }}>▌</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          borderTop: '1px solid #111820',
          background: '#060910',
          border: '1px solid #1e2d1e',
          borderTop: '1px solid #111820',
        }}>
          <div style={{ fontSize: '10px', color: '#2a3a2a', letterSpacing: '0.08em', lineHeight: '1.5' }}>
            <div>1 — LISTEN</div>
            <div>7 — DELETE</div>
            <div style={{ color: activeId ? '#3a5040' : '#1e2d1e' }}>* — SAVE</div>
          </div>

          <button
            onClick={handleStar}
            disabled={!activeId}
            style={{
              background: activeId ? 'rgba(127, 255, 138, 0.08)' : 'transparent',
              border: `1px solid ${activeId ? '#3a5040' : '#1e2d1e'}`,
              color: activeId ? '#7fff8a' : '#2a3a2a',
              fontSize: '24px',
              width: '52px',
              height: '52px',
              cursor: activeId ? 'pointer' : 'default',
              fontFamily: '"Courier New", Courier, monospace',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              textShadow: activeId ? '0 0 10px rgba(127,255,138,0.5)' : 'none',
            }}
          >
            *
          </button>

          <div style={{ fontSize: '10px', color: '#2a3a2a', letterSpacing: '0.08em', textAlign: 'right', lineHeight: '1.5' }}>
            <div>{visibleVoicemails.length} MESSAGE{visibleVoicemails.length !== 1 ? 'S' : ''}</div>
            <div style={{ color: deletedIds.size > 0 ? '#3a5040' : '#1e2d1e' }}>
              {deletedIds.size} SAVED
            </div>
            <div style={{ color: '#1a2a1a' }}>STORAGE: —</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '12px',
          fontSize: '10px',
          color: '#1a2a1a',
          letterSpacing: '0.12em',
          textAlign: 'center',
          lineHeight: '1.8',
        }}>
          <div>PRESS * TO SAVE A MESSAGE — SAVING IS PERMANENT</div>
          <div style={{ marginTop: '2px', color: '#111820' }}>
            MESSAGES FROM DISCONNECTED NUMBERS MAY NOT BE RETRIEVABLE
          </div>
        </div>
      </div>
    </div>
  );
}