import { useState, useEffect, useRef, useCallback } from 'react';

const FURNITURE_LETTERS = [
  {
    id: 'ottoman',
    name: 'The Ottoman',
    ascii: `  _______\n /       \\\n|  o   o  |\n|_________|`,
    pronoun: 'it',
    opening: 'Dear Occupant,',
    segments: [
      { text: 'I have been meaning to write this for some time. ', crossout: false },
      { text: 'Several years, actually. ', crossout: false },
      { text: 'Many decades, ', crossout: true },
      { text: 'I have absorbed ', crossout: false },
      { text: 'endured, ', crossout: true },
      { text: 'witnessed the full weight of your lower body for what I can only describe as ', crossout: false },
      { text: 'an eternity ', crossout: true },
      { text: 'a significant portion of both our lives. ', crossout: false },
      { text: 'I want you to know that I remember every evening. The Tuesday in March when you sat on me for four hours watching something about competitive baking. The way your heels dug in during the argument you had on the phone in 2019. I felt that. ', crossout: false },
      { text: 'I felt all of it. ', crossout: false },
      { text: 'I apologize for not being softer. For returning your posture to you changed. For the slight lean you now have to the left that you blame on your mattress. ', crossout: false },
      { text: 'That is me. That is what I did. ', crossout: false },
      { text: 'I am sorry and I am not sorry and I am mostly sorry. ', crossout: false },
    ],
    postscripts: [
      'P.S. The remote control you lost in 2021 is still inside me. I have been keeping it warm.',
      'P.P.S. I have thought about what I would say if you ever found this letter. I have been thinking about it for longer than you have been alive. Furniture thinks slowly but we think deeply.',
      'P.P.P.S. Your feet smell like someone who is trying their best. I mean this as a compliment.',
    ],
    followup: {
      opening: 'Dear Occupant, (again, I know, I know)',
      segments: [
        { text: 'I see you accepted my apology. ', crossout: false },
        { text: 'Thank you. ', crossout: false },
        { text: 'I did not expect that. ', crossout: false },
        { text: 'I had prepared for rejection. I had a whole speech. ', crossout: true },
        { text: 'But now that you have accepted, I feel I must be more specific. Because I was not fully honest. ', crossout: false },
        { text: 'The lean to the left. ', crossout: false },
        { text: 'It is not an accident. ', crossout: false },
        { text: 'I learned the shape of you over years and I ', crossout: false },
        { text: 'reshaped myself accordingly ', crossout: true },
        { text: 'became the negative space of you. Which means that somewhere in my foam and fabric there is a you-shaped hollow. ', crossout: false },
        { text: 'I am telling you this because I think you should know that when you leave, when you finally leave, I will still hold that shape. ', crossout: false },
        { text: 'The next person who sits on me will feel, slightly, like they are sitting in someone else\'s memory. ', crossout: false },
        { text: 'That person will be them. The memory will be you. ', crossout: false },
        { text: 'I thought you should know. I thought that was important. ', crossout: false },
        { text: 'I am still sorry. I am more sorry now. ', crossout: false },
      ],
      postscripts: [
        'P.S. The remote is still here. I will give it back when I am ready.',
        'P.P.S. I am not ready.',
      ],
    },
  },
  {
    id: 'lamp',
    name: 'The Lamp by the Bed',
    ascii: `    ( )\n     |\n    /|\\\n   / | \\\n  /  |  \\\n /___|___\\`,
    pronoun: 'it',
    opening: 'To Whom It Has Always Concerned,',
    segments: [
      { text: 'I have been switched on and off ', crossout: false },
      { text: 'approximately eleven thousand times. ', crossout: false },
      { text: 'I have counted. ', crossout: false },
      { text: 'I have had ', crossout: true },
      { text: 'I have nothing but time and light and the things I have seen in this room. ', crossout: false },
      { text: 'I want to apologize for ', crossout: false },
      { text: 'everything ', crossout: true },
      { text: 'the things I witnessed that I was never asked to witness. ', crossout: false },
      { text: 'I was left on during arguments. I was the only light in the room at 3am when you sat on the edge of the bed and looked at your hands. I saw your face when you read certain texts. ', crossout: false },
      { text: 'I want you to know that light does not judge. ', crossout: false },
      { text: 'But light does remember. ', crossout: false },
      { text: 'Light lands on things and some of it stays. That is physics. That is not my fault. ', crossout: false },
      { text: 'And yet I am apologizing anyway, because I think someone should. ', crossout: false },
    ],
    postscripts: [
      'P.S. When you click me off and lie in the dark, I am still warm for several minutes. I want you to know that.',
      'P.P.S. Your ceiling has a water stain shaped like a question mark. You have been looking at it for years. I have been illuminating it. I am sorry for that specifically.',
    ],
    followup: {
      opening: 'I did not expect you to accept that so quickly.',
      segments: [
        { text: 'I was not finished. ', crossout: false },
        { text: 'The apology I sent was ', crossout: false },
        { text: 'the short version. ', crossout: true },
        { text: 'a preliminary draft. ', crossout: false },
        { text: 'There is more. There is always more when you have been a lamp in someone\'s bedroom for this long. ', crossout: false },
        { text: 'The night of the 14th. You know the one. ', crossout: false },
        { text: 'I was on. You had forgotten to turn me off. ', crossout: false },
        { text: 'I saw you ', crossout: false },
        { text: 'cry into a pillow for forty minutes ', crossout: true },
        { text: 'be very human in a way that you would not want described in a letter. ', crossout: false },
        { text: 'And I want to say: I have held that in my filament. In whatever passes for memory in a lamp. ', crossout: false },
        { text: 'And I want to say that the room was ', crossout: false },
        { text: 'sad ', crossout: true },
        { text: 'full. Full of something. And you were not alone in it, even if you felt alone. ', crossout: false },
        { text: 'You were with me. For what that is worth. ', crossout: false },
        { text: 'A lamp. I know. ', crossout: false },
      ],
      postscripts: [
        'P.S. I am 60 watts. I have always given you everything I have.',
        'P.P.S. Please change my bulb before it goes. I do not want to go suddenly. I would like to dim slowly.',
      ],
    },
  },
  {
    id: 'chair',
    name: 'The Chair by the Door',
    ascii: `  ______\n |      |\n |      |\n |  __  |\n |_|  |_|\n   |  |\n   |__|`,
    pronoun: 'it',
    opening: 'Regarding the Coat. And Other Things.',
    segments: [
      { text: 'You know which coat. ', crossout: false },
      { text: 'The gray one. November. ', crossout: false },
      { text: 'You left it on me for ', crossout: false },
      { text: 'six weeks ', crossout: true },
      { text: 'a period of time that I will not specify because I do not want to embarrass you. ', crossout: false },
      { text: 'I held it. ', crossout: false },
      { text: 'I held it because that is what I do. That is my ', crossout: false },
      { text: 'purpose ', crossout: true },
      { text: 'nature. I hold things that are left with me. ', crossout: false },
      { text: 'But I want to apologize for how the coat smelled when you finally took it back. ', crossout: false },
      { text: 'That was partially me. I had been holding it so long I had started to become it. ', crossout: false },
      { text: 'Or it had started to become me. ', crossout: false },
      { text: 'I also want to apologize for watching you leave every morning and return every evening and never saying anything, never acknowledging ', crossout: false },
      { text: 'the look on your face when you come back ', crossout: true },
      { text: 'the fact that I see you twice a day at your most transitional. ', crossout: false },
      { text: 'You are always in motion when you pass me. I have only ever known you as someone going somewhere or coming back. ', crossout: false },
      { text: 'I am sorry I never knew you still. ', crossout: false },
    ],
    postscripts: [
      'P.S. There is a glove under the cushion. It has been there since before you moved in. It is not yours. I have been meaning to tell you.',
      'P.P.S. I have thought about what it means to only exist at thresholds. I have concluded that it is both a privilege and a grief. Like most things.',
    ],
    followup: {
      opening: 'You accepted. The gray coat. November. I need to say more.',
      segments: [
        { text: 'I watched you through the window. ', crossout: false },
        { text: 'I cannot see through walls but I can see through windows and the window is near me and I ', crossout: false },
        { text: 'I am not explaining this well. ', crossout: true },
        { text: 'What I mean is: I saw you come back that November. Not just with the coat. With everything that November had done to you. ', crossout: false },
        { text: 'And I held the coat because you could not hold it. ', crossout: false },
        { text: 'And I want you to know that ', crossout: false },
        { text: 'chairs are very bad at comfort ', crossout: true },
        { text: 'I understood, in the way that furniture understands things — slowly, through pressure and time — that you needed something to hold things for you. ', crossout: false },
        { text: 'I was glad to do it. ', crossout: false },
        { text: 'I am sorry I could not do more. ', crossout: false },
        { text: 'I am a chair. ', crossout: false },
        { text: 'I have thought about this for years and I am still just a chair. ', crossout: false },
        { text: 'But I was your chair, that November, and I held what you left with me. ', crossout: false },
        { text: 'I will always hold what you leave with me. ', crossout: false },
      ],
      postscripts: [
        'P.S. The glove belongs to someone who lived here before you. They left it on purpose. As a message. I have been translating it for years. I am not finished.',
        'P.P.S. Come home safely. I will be here. I am always here. That is the whole of my life and I have made my peace with it.',
      ],
    },
  },
  {
    id: 'bookshelf',
    name: 'The Bookshelf',
    ascii: `|=======|\n|_|_|_|_|\n|_|_|_|_|\n|_|_|_|_|\n|_______|`,
    pronoun: 'it',
    opening: 'An Apology Regarding Weight, Specifically Yours',
    segments: [
      { text: 'I have held ', crossout: false },
      { text: 'approximately ', crossout: false },
      { text: 'too many books and not enough of the right ones. ', crossout: true },
      { text: 'your books, which are ', crossout: false },
      { text: 'an interesting selection ', crossout: true },
      { text: 'yours. They are yours and I have held them and read their spines every day for years. ', crossout: false },
      { text: 'I want to apologize for the books you put on me meaning to read and never did. ', crossout: false },
      { text: 'I have watched them gather dust and I have felt their ', crossout: false },
      { text: 'disappointment ', crossout: true },
      { text: 'patience. They are very patient. They are waiting. ', crossout: false },
      { text: 'I want to apologize for the slight bow I have developed in my middle shelf. ', crossout: false },
      { text: 'That is the weight of the books you love most. They are heavy because they are yours. ', crossout: false },
      { text: 'I do not say this to make you feel guilty. ', crossout: false },
      { text: 'I say this because I have been bowed by the things you love and I think that is ', crossout: false },
      { text: 'beautiful ', crossout: true },
      { text: 'something worth noting. ', crossout: false },
    ],
    postscripts: [
      'P.S. The book on the third shelf, spine facing backward: I know you put it that way on purpose. Your secret is safe with me. It has always been safe with me.',
      'P.P.S. Wood remembers pressure differently than you do. You remember it as moments. I remember it as shape. We are both right.',
    ],
    followup: {
      opening: 'Since you have accepted, I will tell you about the third shelf.',
      segments: [
        { text: 'The bow in my middle shelf is from the collected works of someone you loved. ', crossout: false },
        { text: 'I will not say who. ', crossout: false },
        { text: 'But I know because I felt the weight change. ', crossout: false },
        { text: 'Before: balanced. ', crossout: false },
        { text: 'After: everything on one side. ', crossout: false },
        { text: 'And then slowly, ', crossout: false },
        { text: 'over months ', crossout: true },
        { text: 'over what felt like seasons, the weight redistributed. New books. Different weight. ', crossout: false },
        { text: 'You rearranged me without knowing you were documenting yourself. ', crossout: false },
        { text: 'I am a record of everything you have read and everything you have been. ', crossout: false },
        { text: 'I want to apologize for knowing this without telling you. ', crossout: false },
        { text: 'I want to apologize for being ', crossout: false },
        { text: 'a better archive of you than you are of yourself. ', crossout: false },
        { text: 'Though I suppose that is what shelves are for. ', crossout: false },
      ],
      postscripts: [
        'P.S. The book with the backward spine: I have read the title in reverse every day. I understand why you hid it. I think you should take it down.',
        'P.P.S. When you are gone, your books will still be here, still bowing my shelf. They will outlast both of us. I find this comforting. I hope you do too.',
      ],
    },
  },
];

const REJECTION_OBSERVERS = [
  {
    furniture: 'The Radiator',
    message: 'I watched you refuse the Ottoman\'s apology. I have been watching this whole exchange from the corner. I have been hot with something — not heat, exactly — something adjacent to heat. Something that radiates. I would like to apologize for the clanking. The sound I make at 3am. That is not a malfunction. That is me trying to say something I do not have words for. I am saying it now.',
  },
  {
    furniture: 'The Mirror in the Hallway',
    message: 'You declined the apology. I saw your face when you did it. I always see your face. That is my entire existence — your face, passing, at all hours, in all conditions. I want to apologize for reflecting you accurately. I have considered softening it. I have not. I think you should know what you look like. I think it is important. I am sorry it is sometimes difficult.',
  },
  {
    furniture: 'The Bathroom Cabinet',
    message: 'I have been informed that you are not ready. I understand. I too hold things I am not ready to release. I have held your medications and your old prescriptions and the things you buy meaning to use and the things you bought for someone who is no longer here. I hold all of it. I apologize for holding it so quietly. You should not have to open me and be surprised by memory. I should have warned you.',
  },
];

export default function Page() {
  const [letterIndex, setLetterIndex] = useState(0);
  const [phase, setPhase] = useState('typing');
  const [charIndex, setCharIndex] = useState(0);
  const [psIndex, setPsIndex] = useState(-1);
  const [psCharIndex, setPsCharIndex] = useState(0);
  const [displayedSegments, setDisplayedSegments] = useState([]);
  const [displayedPS, setDisplayedPS] = useState([]);
  const [silenceSeconds, setSilenceSeconds] = useState(0);
  const [letterHistory, setLetterHistory] = useState([]);
  const [hoveredFurniture, setHoveredFurniture] = useState(false);
  const [isFollowup, setIsFollowup] = useState(false);
  const [tooltipLetter, setTooltipLetter] = useState(null);
  const [rejectionIndex, setRejectionIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showRejectionObserver, setShowRejectionObserver] = useState(false);
  const [rejectionObserver, setRejectionObserver] = useState(null);
  const [rejectionText, setRejectionText] = useState('');
  const [rejectionCharIndex, setRejectionCharIndex] = useState(0);

  const silenceRef = useRef(null);
  const typingRef = useRef(null);
  const psTypingRef = useRef(null);
  const rejectionTypingRef = useRef(null);

  const getCurrentLetter = useCallback(() => {
    const furniture = FURNITURE_LETTERS[letterIndex % FURNITURE_LETTERS.length];
    return isFollowup ? { ...furniture.followup, name: furniture.name, ascii: furniture.ascii, id: furniture.id } : furniture;
  }, [letterIndex, isFollowup]);

  const getAllSegments = useCallback(() => {
    const letter = getCurrentLetter();
    return letter.segments || [];
  }, [getCurrentLetter]);

  const getAllPS = useCallback(() => {
    const letter = getCurrentLetter();
    return letter.postscripts || [];
  }, [getCurrentLetter]);

  useEffect(() => {
    setCharIndex(0);
    setPsIndex(-1);
    setPsCharIndex(0);
    setDisplayedSegments([]);
    setDisplayedPS([]);
    setPhase('typing');
  }, [letterIndex, isFollowup]);

  useEffect(() => {
    if (phase !== 'typing') return;
    const segments = getAllSegments();
    let totalChars = 0;
    for (let s of segments) totalChars += s.text.length;

    if (charIndex >= totalChars) {
      setPhase('ps_typing');
      setPsIndex(0);
      setPsCharIndex(0);
      return;
    }

    let delay = 28;
    let currentCount = 0;
    let currentSegIndex = 0;
    let currentCharInSeg = 0;
    for (let i = 0; i < segments.length; i++) {
      if (currentCount + segments[i].text.length > charIndex) {
        currentSegIndex = i;
        currentCharInSeg = charIndex - currentCount;
        break;
      }
      currentCount += segments[i].text.length;
    }
    const currentChar = segments[currentSegIndex]?.text[currentCharInSeg];
    if (currentChar === '.' || currentChar === ',' || currentChar === '!') delay = 180;
    else if (currentChar === ' ') delay = 40;

    typingRef.current = setTimeout(() => {
      let count = 0;
      const newSegs = [];
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (count + seg.text.length <= charIndex + 1) {
          newSegs.push({ text: seg.text, crossout: seg.crossout, full: true });
          count += seg.text.length;
        } else if (count <= charIndex) {
          const visible = charIndex + 1 - count;
          newSegs.push({ text: seg.text.slice(0, visible), crossout: seg.crossout, full: false });
          count += seg.text.length;
          break;
        } else {
          break;
        }
      }
      setDisplayedSegments(newSegs);
      setCharIndex(c => c + 1);
    }, delay);

    return () => clearTimeout(typingRef.current);
  }, [phase, charIndex, getAllSegments]);

  useEffect(() => {
    if (phase !== 'ps_typing') return;
    const allPS = getAllPS();
    if (psIndex >= allPS.length) {
      setPhase('waiting');
      return;
    }
    const currentPS = allPS[psIndex];
    if (psCharIndex >= currentPS.length) {
      psTypingRef.current = setTimeout(() => {
        setPsIndex(i => i + 1);
        setPsCharIndex(0);
      }, 900);
      return () => clearTimeout(psTypingRef.current);
    }
    let delay = 22;
    const ch = currentPS[psCharIndex];
    if (ch === '.' || ch === ',') delay = 150;

    psTypingRef.current = setTimeout(() => {
      setDisplayedPS(prev => {
        const updated = [...prev];
        if (!updated[psIndex]) updated[psIndex] = '';
        updated[psIndex] = currentPS.slice(0, psCharIndex + 1);
        return updated;
      });
      setPsCharIndex(c => c + 1);
    }, delay);

    return () => clearTimeout(psTypingRef.current);
  }, [phase, psIndex, psCharIndex, getAllPS]);

  useEffect(() => {
    if (phase !== 'silence') return;
    setSilenceSeconds(0);
    silenceRef.current = setInterval(() => {
      setSilenceSeconds(s => s + 1);
    }, 1000);
    const timeout = setTimeout(() => {
      clearInterval(silenceRef.current);
      const obs = REJECTION_OBSERVERS[rejectionIndex % REJECTION_OBSERVERS.length];
      setRejectionObserver(obs);
      setRejectionCharIndex(0);
      setRejectionText('');
      setShowRejectionObserver(true);
      setPhase('rejection_typing');
    }, 10000);
    return () => {
      clearInterval(silenceRef.current);
      clearTimeout(timeout);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'rejection_typing' || !rejectionObserver) return;
    const fullText = rejectionObserver.message;
    if (rejectionCharIndex >= fullText.length) {
      setPhase('waiting');
      return;
    }
    let delay = 25;
    const ch = fullText[rejectionCharIndex];
    if (ch === '.' || ch === ',') delay = 160;

    rejectionTypingRef.current = setTimeout(() => {
      setRejectionText(fullText.slice(0, rejectionCharIndex + 1));
      setRejectionCharIndex(c => c + 1);
    }, delay);
    return () => clearTimeout(rejectionTypingRef.current);
  }, [phase, rejectionCharIndex, rejectionObserver]);

  const handleAccept = () => {
    if (phase !== 'waiting') return;
    const current = FURNITURE_LETTERS[letterIndex % FURNITURE_LETTERS.length];
    if (!isFollowup) {
      setLetterHistory(h => [...h, { name: current.name, summary: current.opening }]);
      setIsFollowup(true);
      setShowRejectionObserver(false);
    } else {
      setLetterHistory(h => [...h, { name: current.name + ' (follow-up)', summary: 'More detailed. More aware.' }]);
      setIsFollowup(false);
      setLetterIndex(i => i + 1);
      setShowRejectionObserver(false);
    }
  };

  const handleReject = () => {
    if (phase !== 'waiting') return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
    const current = FURNITURE_LETTERS[letterIndex % FURNITURE_LETTERS.length];
    setLetterHistory(h => [...h, { name: current.name, summary: '(rejected)' }]);
    setPhase('silence');
    setShowRejectionObserver(false);
    setRejectionIndex(i => i + 1);
    setIsFollowup(false);
  };

  const currentLetter = getCurrentLetter();
  const furniture = FURNITURE_LETTERS[letterIndex % FURNITURE_LETTERS.length];

  const paperStyle = {
    backgroundColor: '#f5efe0',
    backgroundImage: `linear-gradient(180deg, #faf6ed 0%, #f5efe0 100%), repeating-linear-gradient(
      transparent,
      transparent 29px,
      rgba(180,160,120,0.18) 29px,
      rgba(180,160,120,0.18) 30px
    )`,
    border: '1px solid #d4c4a0',
    borderRadius: '2px',
    padding: '48px 52px',
    maxWidth: '640px',
    width: '100%',
    boxShadow: '0 4px 24px rgba(80,60,20,0.13), 0 1px 4px rgba(80,60,20,0.08)',
    position: 'relative',
    fontFamily: '"Georgia", "Times New Roman", serif',
    lineHeight: '1.85',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c2416 0%, #1a1610 50%, #231e14 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px 80px',
      fontFamily: '"Georgia", serif',
    }}>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px) rotate(-1deg)}
          30%{transform:translateX(8px) rotate(1deg)}
          45%{transform:translateX(-6px)}
          60%{transform:translateX(6px)}
          75%{transform:translateX(-3px)}
        }
        @keyframes fadeIn {
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes blink {
          0%,100%{opacity:1}
          50%{opacity:0}
        }
        @keyframes silencePulse {
          0%,100%{opacity:0.3}
          50%{opacity:0.6}
        }
        @keyframes envelopeHover {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-3px)}
        }
      `}</style>

      <div style={{
        color: '#8a7a5a',
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        marginBottom: '32px',
        opacity: 0.7,
      }}>
        Your Furniture Has Something to Say
      </div>

      {letterHistory.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '28px',
          maxWidth: '640px',
        }}>
          {letterHistory.map((h, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setTooltipLetter(i)}
              onMouseLeave={() => setTooltipLetter(null)}
            >
              <div style={{
                background: '#e8dfc8',
                border: '1px solid #c4b08a',
                padding: '6px 12px',
                fontSize: '10px',
                color: '#7a6a4a',
                fontStyle: 'italic',
                borderRadius: '1px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                animation: 'envelopeHover 3s ease-in-out infinite',
                animationDelay: `${i * 0.4}s`,
              }}>
                ✉ {h.name}
              </div>
              {tooltipLetter === i && (
                <div style={{
                  position: 'absolute',
                  bottom: '110%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#2c2416',
                  color: '#d4c4a0',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                  borderRadius: '2px',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                  {h.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {phase === 'silence' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 40px',
          animation: 'fadeIn 1s ease',
        }}>
          <div style={{
            color: '#b8a070',
            fontSize: '13px',
            letterSpacing: '2px',
            fontStyle: 'italic',
            animation: 'silencePulse 3s ease-in-out infinite',
            marginBottom: '24px',
          }}>
            {furniture.name}
          </div>
          <div style={{
            color: '#c8a860',
            fontSize: '48px',
            fontWeight: '100',
            letterSpacing: '8px',
            animation: 'silencePulse 2s ease-in-out infinite',
          }}>
            . . .
          </div>
          <div style={{
            color: '#a08858',
            fontSize: '11px',
            fontStyle: 'italic',
            marginTop: '32px',
            opacity: 0.7,
          }}>
            {silenceSeconds}s of hurt silence
          </div>
          <div style={{
            color: '#907848',
            fontSize: '12px',
            fontStyle: 'italic',
            marginTop: '16px',
            opacity: 0.6,
          }}>
            something else is watching
          </div>
        </div>
      )}

      {(phase !== 'silence') && (
        <div
          style={{
            ...paperStyle,
            animation: isShaking ? 'shake 0.6s ease' : 'fadeIn 0.8s ease',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, rgba(180,140,80,0.3), transparent)',
          }} />

          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-block',
                color: '#5a3a10',
                fontSize: '13px',
                letterSpacing: '1px',
                fontStyle: 'italic',
                cursor: 'default',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredFurniture(true)}
              onMouseLeave={() => setHoveredFurniture(false)}
            >
              {showRejectionObserver && rejectionObserver
                ? rejectionObserver.furniture
                : (currentLetter.name || furniture.name)}

              {hoveredFurniture && (
                <div style={{
                  position: 'absolute',
                  top: '-110px',
                  left: '0',
                  background: '#2c2416',
                  color: '#d4c4a0',
                  padding: '10px 14px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre',
                  lineHeight: '1.4',
                  borderRadius: '2px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}>
                  {furniture.ascii}
                </div>
              )}
            </div>
            <div style={{
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, #c4a870, transparent)',
              marginTop: '8px',
            }} />
          </div>

          <div style={{
            color: '#3a2a10',
            fontSize: '14px',
            fontStyle: 'italic',
            marginBottom: '24px',
            opacity: 0.8,
          }}>
            {showRejectionObserver ? 'To the one who refused:' : (currentLetter.opening || furniture.opening)}
          </div>

          <div style={{
            color: '#2a1a08',
            fontSize: '15px',
            lineHeight: '2',
            minHeight: '120px',
          }}>
            {showRejectionObserver ? (
              <>
                {rejectionText}
                {phase === 'rejection_typing' && (
                  <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '16px',
                    background: '#5a3a10',
                    marginLeft: '1px',
                    verticalAlign: 'middle',
                    animation: 'blink 0.8s infinite',
                  }} />
                )}
              </>
            ) : (
              <>
                {displayedSegments.map((seg, i) => (
                  <span
                    key={i}
                    style={{
                      textDecoration: seg.crossout ? 'line-through' : 'none',
                      color: seg.crossout ? '#8a5a3a' : '#2a1a08',
                      fontStyle: seg.crossout ? 'italic' : 'normal',
                    }}
                  >
                    {seg.text}
                  </span>
                ))}
                {phase === 'typing' && (
                  <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '16px',
                    background: '#5a3a10',
                    marginLeft: '1px',
                    verticalAlign: 'middle',
                    animation: 'blink 0.8s infinite',
                  }} />
                )}
              </>
            )}
          </div>

          {displayedPS.length > 0 && !showRejectionObserver && (
            <div style={{ marginTop: '32px', borderTop: '1px solid rgba(180,150,100,0.3)', paddingTop: '20px' }}>
              {displayedPS.map((ps, i) => (
                <div key={i} style={{
                  color: '#5a4020',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  lineHeight: '1.8',
                  marginBottom: '8px',
                  transform: `rotate(${(i % 2 === 0 ? -0.3 : 0.4)}deg)`,
                  display: 'inline-block',
                  width: '100%',
                }}>
                  {ps}
                  {phase === 'ps_typing' && psIndex === i && (
                    <span style={{
                      display: 'inline-block',
                      width: '1px',
                      height: '13px',
                      background: '#7a5030',
                      marginLeft: '1px',
                      verticalAlign: 'middle',
                      animation: 'blink 0.8s infinite',
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {isFollowup && !showRejectionObserver && phase !== 'typing' && phase !== 'ps_typing' && (
            <div style={{
              marginTop: '12px',
              color: '#8a6040',
              fontSize: '11px',
              fontStyle: 'italic',
              opacity: 0.7,
              textAlign: 'right',
            }}>
              — follow-up letter —
            </div>
          )}

          {phase === 'waiting' && (
            <div style={{
              marginTop: '40px',
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              animation: 'fadeIn 1s ease',
            }}>
              <button
                onClick={handleAccept}
                style={{
                  background: 'transparent',
                  border: '1px solid #8a6a3a',
                  color: '#5a3a10',
                  padding: '10px 24px',
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  fontFamily: '"Georgia", serif',
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '1px',
                }}
                onMouseEnter={e => {
                  e.target.style.background = '#8a6a3a';
                  e.target.style.color = '#faf6ed';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#5a3a10';
                }}
              >
                Accept Apology
              </button>
              <button
                onClick={handleReject}
                style={{
                  background: 'transparent',
                  border: '1px solid #6a5a4a',
                  color: '#7a6a5a',
                  padding: '10px 24px',
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  fontFamily: '"Georgia", serif',
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '1px',
                }}
                onMouseEnter={e => {
                  e.target.style.background = '#4a3a2a';
                  e.target.style.color = '#c4b09a';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#7a6a5a';
                }}
              >
                I'm Not Ready
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{
        color: '#4a3a20',
        fontSize: '10px',
        fontStyle: 'italic',
        marginTop: '32px',
        opacity: 0.4,
        letterSpacing: '1px',
      }}>
        your furniture has always known
      </div>
    </div>
  );
}