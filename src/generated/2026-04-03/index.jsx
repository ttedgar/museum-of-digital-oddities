import { useState, useEffect, useRef } from 'react';

const letters = [
  {
    orgName: "The International Committee for Excellence in Distinguished Achievement",
    awardName: "The Award of Singular Merit",
    prizeDescription: "A prestigious honor bestowed upon fewer than one individual per annum.",
    bodyText: "It is with the utmost solemnity and institutional gravitas that we write to inform you of your selection. You have been chosen from among all persons considered. The Committee has deliberated at length and reached its conclusion unanimously. Please accept this recognition with the dignity it deserves.",
    tone: 0,
    buttonLabel: "Accept This Honor",
    signatoryTitle: "Grand Secretary of Distinctions",
    signatoryName: "Reginald P. Worthington III"
  },
  {
    orgName: "The Global Foundation for Meritorious Excellence and Distinguished Achievement",
    awardName: "The Award of Exceptional Singular Merit",
    prizeDescription: "A feeling. Specifically, the feeling. You will know it when it arrives.",
    bodyText: "We are pleased to reiterate our congratulations. You may have received a prior communication. That communication was correct. This communication is also correct. They are compatible. The feeling associated with this award has been reserved in your name and awaits your formal acceptance. Please note that the feeling is time-sensitive.",
    tone: 1,
    buttonLabel: "Accept This Honor",
    signatoryTitle: "Deputy Grand Secretary of Distinctions",
    signatoryName: "R. P. Worthington III (Acting)"
  },
  {
    orgName: "The Sovereign Institute for Recognizing People Who Deserve Recognition",
    awardName: "The Worthington-Adjacent Prize",
    prizeDescription: "A specific Tuesday. The Tuesday has been selected. It is yours.",
    bodyText: "Congratulations remain in effect. We wish to clarify that the previous organization and this organization are related but distinct. The Award has been slightly renamed for administrative reasons that need not concern you. Your Tuesday is currently being held in escrow. Acceptance is required within a reasonable period, which we are still defining. The Committee is working on it.",
    tone: 2,
    buttonLabel: "Accept and Claim Your Tuesday",
    signatoryTitle: "Interim Acting Deputy Secretary",
    signatoryName: "Someone from the Committee"
  },
  {
    orgName: "ICEDAWA (Provisional)",
    awardName: "The Prize (Formerly The Award)",
    prizeDescription: "All the medium-sized rocks. They are yours now. We are not using them.",
    bodyText: "Hello. We are still the same organization. Please do not look into this. The rocks have been counted and catalogued and there are quite a few of them, medium-sized as described. We want you to have them. This is important to us. Your acceptance would mean a great deal. We have been trying to reach you. Have you been receiving our letters? Please confirm receipt.",
    tone: 3,
    buttonLabel: "Accept the Rocks",
    signatoryTitle: "Rock Liaison",
    signatoryName: "The Committee (collectively)"
  },
  {
    orgName: "The Awards People (we changed the name again, sorry)",
    awardName: "The Big Important One",
    prizeDescription: "Something incredible. We can't say what exactly but trust us it's very good.",
    bodyText: "Okay so we realize the rocks thing was confusing and we want to walk that back slightly. The prize is NOT only rocks. There is more to it. We are not at liberty to describe the additional components at this time but they exist and they are significant. What we need from you — and this is crucial — is your acceptance. Just the acceptance. That's all we're asking. It would help us enormously. You don't know how much.",
    tone: 4,
    buttonLabel: "Accept (Please)",
    signatoryTitle: "Head of Outreach and Desperation Prevention",
    signatoryName: "Margaret (she asked us to use her first name)"
  },
  {
    orgName: "THE AWARDS ORGANIZATION — URGENT",
    awardName: "THE AWARD — TIME SENSITIVE",
    prizeDescription: "We'll figure out the prize together. Just say yes first.",
    bodyText: "We need to be honest with you. We have sent several letters. You keep clicking and yet somehow the acceptance hasn't fully registered on our end. The system shows PENDING. It has shown PENDING since the first letter. We don't know why. IT says it might be a caching issue. We have escalated. In the meantime please continue accepting. Each acceptance helps. We think.",
    tone: 5,
    buttonLabel: "ACCEPT (system still shows PENDING)",
    signatoryTitle: "whoever is left",
    signatoryName: "the remaining staff"
  },
  {
    orgName: "awards.org (website is down, sorry)",
    awardName: "the award. you know the one.",
    prizeDescription: "your acceptance. that's the prize now. we need it.",
    bodyText: "okay we're going to level with you. three people have quit this week. not because of you specifically. but also maybe a little because of you. the pending status is affecting morale. gerald from accounting says if we don't resolve this by friday he's going to 'take action' and we don't know what that means but gerald has been very quiet lately and it's worrying us. please just accept. it costs you nothing.",
    tone: 6,
    buttonLabel: "accept (please think of gerald)",
    signatoryTitle: "margaret again",
    signatoryName: "Margaret"
  },
  {
    orgName: "us. just us. the people.",
    awardName: "we don't care about the name anymore",
    prizeDescription: "please",
    bodyText: "gerald left. he didn't take action, he just left, which is somehow worse. we are down to four people. the office is very quiet. we have a lot of certificates left over and nowhere to send them. we made them all out to you. they're very nice certificates, we used the good paper. we have so much good paper. do you need paper? we can send paper. just tell us what you need. we'll do it.",
    tone: 7,
    buttonLabel: "okay fine I accept",
    signatoryTitle: "just margaret now",
    signatoryName: "Margaret (and also Dave but he's not doing great)"
  },
  {
    orgName: "margaret and dave",
    awardName: "THE AWARD THE AWARD THE AWARD",
    prizeDescription: "dave says hi. dave is doing better. dave made you a drawing.",
    bodyText: "THE SYSTEM STILL SAYS PENDING. WE HAVE TRIED EVERYTHING. MARGARET CALLED IT. DAVE DREW A POTATO. THE POTATO IS THE SEAL NOW. WE LIKE THE POTATO. THE POTATO DOES NOT JUDGE US. we are still here. we are always here. you are the winner. you have always been the winner. please accept. please. please. please.",
    tone: 8,
    buttonLabel: "I ACCEPT I ACCEPT I ACCEPT",
    signatoryTitle: "MARGARET AND DAVE AND THE POTATO",
    signatoryName: "we love you"
  },
  {
    orgName: "🥔",
    awardName: "🏆 the award 🏆",
    prizeDescription: "you. it was always you. the award is you. you are the award.",
    bodyText: "status: still pending. always pending. pending forever. the pending is the point. the pending is the prize. you have been selected and you will always be selected and the selection will never resolve and that's okay. that's okay. that's okay. margaret went home. dave is feeding the potato. we are at peace. are you at peace? you should be at peace. you have the award. you have all the awards. there are no other winners. there is only you. pending. always pending. 🥔",
    tone: 9,
    buttonLabel: "🥔 accept 🥔",
    signatoryTitle: "🥔",
    signatoryName: "🥔"
  }
];

const sealPaths = [
  // Perfect circle seal
  { type: 'circle', cx: 60, cy: 60, r: 55 },
  { type: 'circle', cx: 60, cy: 60, r: 55 },
  { type: 'circle', cx: 60, cy: 60, r: 53 },
  { type: 'circle', cx: 60, cy: 58, r: 52 },
  { type: 'circle', cx: 60, cy: 58, r: 50 },
  // Start becoming potato
  { type: 'path', d: "M60,10 C85,8 108,25 112,50 C116,75 100,105 75,112 C50,119 25,105 15,80 C5,55 15,25 35,14 C45,9 55,10 60,10 Z" },
  { type: 'path', d: "M60,8 C90,5 115,28 114,55 C113,82 95,112 68,115 C41,118 18,100 12,73 C6,46 20,18 42,10 C50,7 55,8 60,8 Z" },
  { type: 'path', d: "M55,5 C85,2 118,30 115,60 C112,90 88,118 60,116 C32,114 8,95 5,68 C2,41 20,12 45,6 C50,4 53,5 55,5 Z" },
  { type: 'path', d: "M50,8 C80,0 122,28 118,62 C114,96 85,122 55,119 C25,116 2,92 3,62 C4,32 25,14 45,8 C47,7 49,8 50,8 Z" },
  // Full potato
  { type: 'path', d: "M48,6 C75,-2 125,22 121,58 C117,94 88,128 56,122 C24,116 -2,88 2,58 C6,28 28,12 42,7 C44,6 46,6 48,6 Z" }
];

function getSealInitials(index) {
  if (index <= 1) return "ICEDA";
  if (index <= 2) return "SIRPR";
  if (index <= 3) return "ICEDAWA";
  if (index <= 4) return "TAP";
  if (index <= 5) return "URGENT";
  if (index <= 6) return "???";
  if (index <= 7) return "M+D";
  if (index <= 8) return "🥔";
  return "🥔";
}

function Seal({ index, onClick, rotation }) {
  const seal = sealPaths[index];
  const colors = [
    { stroke: '#b8860b', fill: '#fffacd', text: '#8b6914' },
    { stroke: '#b8860b', fill: '#fffacd', text: '#8b6914' },
    { stroke: '#b8860b', fill: '#fff8dc', text: '#8b6914' },
    { stroke: '#c0a020', fill: '#fff8dc', text: '#9b7a10' },
    { stroke: '#c0a020', fill: '#fff0b0', text: '#9b7a10' },
    { stroke: '#cc6600', fill: '#fff0c0', text: '#cc4400' },
    { stroke: '#dd3300', fill: '#ffe0c0', text: '#cc2200' },
    { stroke: '#ee1100', fill: '#ffd0b0', text: '#dd0000' },
    { stroke: '#ff0000', fill: '#ffccbb', text: '#cc0000' },
    { stroke: '#cc6600', fill: '#f5deb3', text: '#8b4513' },
  ];
  const c = colors[Math.min(index, colors.length - 1)];
  const initials = getSealInitials(index);
  const strokeWidth = index < 3 ? 3 : index < 6 ? 2.5 : 2;
  const strokeDash = index < 2 ? "none" : index < 5 ? "4,2" : index < 8 ? "6,3" : "8,4";

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.3s ease',
        filter: index > 6 ? 'drop-shadow(0 0 4px rgba(255,0,0,0.3))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))',
        flexShrink: 0
      }}
    >
      {seal.type === 'circle' ? (
        <>
          <circle cx={seal.cx} cy={seal.cy} r={seal.r} fill={c.fill} stroke={c.stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDash} />
          <circle cx={seal.cx} cy={seal.cy} r={seal.r - 8} fill="none" stroke={c.stroke} strokeWidth={1} strokeDasharray="3,3" />
        </>
      ) : (
        <>
          <path d={seal.d} fill={c.fill} stroke={c.stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDash} />
        </>
      )}
      <text
        x="60"
        y="55"
        textAnchor="middle"
        fontSize={index >= 8 ? "22" : index >= 5 ? "9" : "8"}
        fill={c.text}
        fontFamily="serif"
        fontWeight="bold"
      >
        {index >= 8 ? "🥔" : initials.substring(0, 6)}
      </text>
      {index < 8 && (
        <text x="60" y="70" textAnchor="middle" fontSize="7" fill={c.text} fontFamily="serif">
          {index < 3 ? "EST. MDCCCLXXXII" : index < 5 ? "EST. RECENTLY" : index < 7 ? "est. idk" : "est. tuesday"}
        </text>
      )}
      {index >= 5 && index < 9 && (
        <text x="60" y="85" textAnchor="middle" fontSize="6" fill={c.text} fontFamily="sans-serif">
          {index < 6 ? "URGENT" : index < 7 ? "please" : "PLEASE"}
        </text>
      )}
    </svg>
  );
}

export default function Page() {
  const [letterIndex, setLetterIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [acceptCount, setAcceptCount] = useState(0);
  const [sealRotation, setSealRotation] = useState(0);
  const [sealSpinning, setSealSpinning] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    document.body.style.background = '#c8b89a';
    document.body.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    return () => {
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
      document.body.style.minHeight = '';
      document.body.style.margin = '';
    };
  }, []);

  const handleAccept = () => {
    setAcceptCount(prev => prev + 1);
    setIsTransitioning(true);
    setShowStamp(true);
    setTimeout(() => {
      setShowStamp(false);
      setLetterIndex(prev => (prev + 1) % letters.length);
      setIsTransitioning(false);
    }, 600);
  };

  const handleSealClick = () => {
    if (sealSpinning) return;
    setSealSpinning(true);
    setSealRotation(prev => prev + (letterIndex > 5 ? 720 + Math.random() * 360 : 360));
    setTimeout(() => setSealSpinning(false), 600);
  };

  const letter = letters[letterIndex];
  const tone = letter.tone;

  // Derive degradation values from tone (0=pristine, 9=chaos)
  const degradation = tone / 9;

  const fontFamilies = [
    'Georgia, "Times New Roman", serif',
    'Georgia, "Times New Roman", serif',
    'Georgia, "Times New Roman", serif',
    '"Palatino Linotype", Georgia, serif',
    '"Palatino Linotype", Georgia, serif',
    'Arial, sans-serif',
    'Arial, sans-serif',
    '"Comic Sans MS", "Chalkboard SE", cursive',
    '"Comic Sans MS", "Chalkboard SE", cursive',
    '"Comic Sans MS", "Chalkboard SE", cursive',
  ];

  const bgColors = [
    '#faf6e9',
    '#faf5e6',
    '#f9f3e0',
    '#f8f0d8',
    '#f7eed0',
    '#f5e8c0',
    '#f5e0b0',
    '#f8dfc8',
    '#fad8c0',
    '#f5deb3',
  ];

  const textColors = [
    '#1a2340',
    '#1a2340',
    '#1a2850',
    '#1a3060',
    '#1a3860',
    '#333333',
    '#cc4400',
    '#dd2200',
    '#cc0000',
    '#8b4513',
  ];

  const borderStyles = [
    '3px double #b8860b',
    '3px double #b8860b',
    '2px solid #c0a020',
    '2px solid #c0a020',
    '2px dashed #c0a020',
    '2px dashed #cc6600',
    '3px dashed #dd3300',
    '3px dashed #ee1100',
    '4px dashed #ff0000',
    '4px dashed #cc6600',
  ];

  const skewValues = [0, 0, 0, 0, 0, -0.5, -1, -2, -3, 1.5];
  const scaleValues = [1, 1, 1, 1, 1, 1, 1, 0.98, 0.97, 1.02];

  const titleFontSizes = ['28px', '27px', '26px', '25px', '24px', '22px', '20px', '24px', '28px', '32px'];
  const headerFontSizes = ['14px', '14px', '13px', '13px', '12px', '11px', '11px', '12px', '13px', '16px'];

  const urgencyBanners = [null, null, null, null, null,
    "⚠ SECOND NOTICE ⚠",
    "⚠ THIRD NOTICE — URGENT ⚠",
    "🚨 CRITICAL NOTICE 🚨",
    "🚨🚨 FINAL NOTICE (4th) 🚨🚨",
    "🥔🥔🥔 POTATO NOTICE 🥔🥔🥔"
  ];

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: fontFamilies[tone],
  };

  const paperStyle = {
    background: bgColors[tone],
    maxWidth: tone < 5 ? '680px' : '700px',
    width: '100%',
    padding: tone < 5 ? '60px' : tone < 8 ? '48px' : '32px',
    border: borderStyles[tone],
    borderRadius: tone < 3 ? '2px' : tone < 6 ? '4px' : '8px',
    boxShadow: tone < 4
      ? '0 4px 20px rgba(0,0,0,0.15), inset 0 0 80px rgba(184,134,11,0.05)'
      : tone < 7
        ? '0 4px 12px rgba(0,0,0,0.2)'
        : '0 2px 8px rgba(255,0,0,0.15)',
    transform: `skewX(${skewValues[tone]}deg) scale(${scaleValues[tone]})`,
    transition: 'all 0.4s ease',
    opacity: isTransitioning ? 0 : 1,
    position: 'relative',
    color: textColors[tone],
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: tone < 5 ? '32px' : '24px',
    paddingBottom: tone < 5 ? '24px' : '16px',
    borderBottom: tone < 3 ? '1px solid #b8860b' : tone < 6 ? '1px solid #c0a020' : '2px dashed #dd3300',
  };

  const orgNameStyle = {
    fontSize: headerFontSizes[tone],
    letterSpacing: tone < 4 ? '3px' : tone < 7 ? '2px' : '0px',
    textTransform: tone < 7 ? 'uppercase' : 'none',
    color: tone < 3 ? '#8b6914' : tone < 6 ? '#9b7a10' : tone < 8 ? '#cc4400' : '#cc0000',
    marginBottom: '8px',
    fontWeight: tone < 5 ? 'normal' : 'bold',
    fontFamily: fontFamilies[tone],
  };

  const dividerStyle = {
    border: 'none',
    borderTop: tone < 3 ? '1px solid #b8860b' : '1px solid rgba(0,0,0,0.2)',
    margin: '8px auto',
    width: tone < 5 ? '60%' : '80%',
  };

  const awardTitleStyle = {
    fontSize: titleFontSizes[tone],
    fontWeight: 'bold',
    marginBottom: '12px',
    fontFamily: fontFamilies[tone],
    color: tone < 5 ? textColors[tone] : tone < 7 ? '#cc4400' : '#dd0000',
    textTransform: tone < 6 ? 'none' : tone < 8 ? 'uppercase' : 'none',
    animation: tone >= 8 ? 'none' : 'none',
  };

  const prizeStyle = {
    fontSize: tone < 5 ? '15px' : tone < 8 ? '14px' : '16px',
    fontStyle: tone < 5 ? 'italic' : 'normal',
    color: tone < 5 ? '#8b6914' : tone < 7 ? '#cc4400' : '#dd0000',
    marginBottom: '8px',
    fontWeight: tone >= 7 ? 'bold' : 'normal',
    fontFamily: fontFamilies[tone],
  };

  const bodyTextStyle = {
    fontSize: tone < 5 ? '15px' : '14px',
    lineHeight: tone < 5 ? '1.8' : '1.6',
    marginBottom: '32px',
    fontFamily: fontFamilies[tone],
    color: textColors[tone],
  };

  const buttonStyle = {
    background: tone < 3
      ? 'linear-gradient(135deg, #b8860b, #d4a017)'
      : tone < 5
        ? 'linear-gradient(135deg, #c0a020, #d4a017)'
        : tone < 7
          ? 'linear-gradient(135deg, #cc6600, #dd7700)'
          : tone < 9
            ? 'linear-gradient(135deg, #cc2200, #ee3300)'
            : 'linear-gradient(135deg, #cc6600, #f5deb3)',
    color: tone < 8 ? '#fff' : '#fff',
    border: 'none',
    padding: tone < 5 ? '14px 36px' : tone < 8 ? '12px 28px' : '16px 32px',
    fontSize: tone < 5 ? '15px' : tone < 8 ? '14px' : '18px',
    cursor: 'pointer',
    letterSpacing: tone < 4 ? '2px' : '1px',
    textTransform: tone < 7 ? 'uppercase' : 'none',
    fontFamily: fontFamilies[tone],
    fontWeight: 'bold',
    borderRadius: tone < 3 ? '0' : tone < 6 ? '2px' : '4px',
    boxShadow: tone < 5
      ? '0 2px 8px rgba(0,0,0,0.2)'
      : '0 2px 6px rgba(255,0,0,0.3)',
    transform: tone >= 7 ? `rotate(${(tone - 6) * -1}deg)` : 'none',
    animation: 'none',
  };

  const sigStyle = {
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: tone < 3 ? '1px solid #b8860b' : tone < 6 ? '1px dashed #c0a020' : 'none',
    fontSize: tone < 5 ? '13px' : '12px',
    fontFamily: fontFamilies[tone],
    color: tone < 5 ? '#8b6914' : tone < 7 ? '#cc6600' : '#cc0000',
  };

  const pendingStyle = {
    display: 'inline-block',
    background: tone < 5 ? '#e8f4e8' : tone < 7 ? '#fff3e0' : '#ffe0e0',
    border: tone < 5 ? '1px solid #4a8a4a' : tone < 7 ? '1px solid #cc6600' : '2px solid #cc0000',
    color: tone < 5 ? '#2a6a2a' : tone < 7 ? '#cc6600' : '#cc0000',
    padding: '4px 12px',
    fontSize: '11px',
    letterSpacing: '1px',
    fontFamily: 'monospace',
    marginTop: '8px',
  };

  const urgencyBanner = urgencyBanners[tone];

  const stampStyle = {
    position: 'absolute',
    top: '40px',
    right: '40px',
    width: '90px',
    height: '90px',
    border: `3px solid ${tone < 5 ? '#cc3300' : '#cc0000'}`,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(-15deg)',
    opacity: showStamp ? 0.7 : 0,
    transition: 'opacity 0.2s ease',
    color: tone < 5 ? '#cc3300' : '#cc0000',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    fontFamily: 'serif',
    textAlign: 'center',
    lineHeight: '1.3',
    pointerEvents: 'none',
    zIndex: 10,
  };

  const notesStyle = {
    marginTop: '16px',
    fontSize: '11px',
    color: tone < 5 ? '#999' : tone < 7 ? '#cc8800' : '#cc4400',
    fontStyle: tone < 7 ? 'italic' : 'normal',
    fontFamily: fontFamilies[tone],
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes pendingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes urgentShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px) rotate(-0.5deg); }
          75% { transform: translateX(2px) rotate(0.5deg); }
        }
        @keyframes potatoWiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-3deg) scale(1.02); }
          75% { transform: rotate(3deg) scale(0.98); }
        }
      `}</style>
      <div style={{ width: '100%', maxWidth: '720px', position: 'relative' }}>

        {urgencyBanner && (
          <div style={{
            background: tone < 7 ? '#cc4400' : '#cc0000',
            color: '#fff',
            textAlign: 'center',
            padding: '8px',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            fontFamily: fontFamilies[tone],
            marginBottom: '8px',
            animation: tone >= 7 ? 'urgentShake 0.5s infinite' : 'none',
            borderRadius: '2px',
          }}>
            {urgencyBanner}
          </div>
        )}

        <div style={paperStyle}>
          {/* PENDING STAMP */}
          <div style={stampStyle}>
            ACCEPTED<br />(PENDING)
          </div>

          {/* HEADER */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
              <Seal index={tone} onClick={handleSealClick} rotation={sealRotation} />
              <div style={{ flex: 1 }}>
                <div style={orgNameStyle}>{letter.orgName}</div>
                {tone < 6 && <hr style={dividerStyle} />}
                <div style={{
                  fontSize: tone < 5 ? '11px' : '10px',
                  color: tone < 5 ? '#b8860b' : '#cc6600',
                  letterSpacing: tone < 5 ? '4px' : '2px',
                  textTransform: 'uppercase',
                  fontFamily: fontFamilies[tone],
                }}>
                  {tone < 3 ? 'Official Correspondence' :
                    tone < 5 ? 'Semi-Official Correspondence' :
                      tone < 7 ? 'Urgent Correspondence' :
                        tone < 9 ? 'please read this' : '🥔'}
                </div>
              </div>
              <Seal index={tone} onClick={handleSealClick} rotation={-sealRotation * 0.7} />
            </div>

            {tone < 5 && (
              <div style={{
                fontSize: '11px',
                color: '#b8860b',
                letterSpacing: '2px',
                fontFamily: 'Georgia, serif',
              }}>
                — ✦ —
              </div>
            )}
          </div>

          {/* SALUTATION */}
          <div style={{ marginBottom: '24px', fontFamily: fontFamilies[tone] }}>
            <div style={{
              fontSize: tone < 5 ? '14px' : '13px',
              marginBottom: '4px',
              color: tone < 5 ? '#8b6914' : tone < 7 ? '#cc6600' : '#cc0000',
              fontFamily: fontFamilies[tone],
            }}>
              {tone < 2 ? 'To the Distinguished Recipient:' :
                tone < 4 ? 'Dear Award Recipient:' :
                  tone < 6 ? 'Dear You (the one reading this):' :
                    tone < 8 ? 'hello. it\'s us again.' :
                      'you. yes. you.' }
            </div>
          </div>

          {/* AWARD NAME */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            {tone < 3 && (
              <div style={{ fontSize: '12px', color: '#b8860b', letterSpacing: '4px', marginBottom: '8px', fontFamily: fontFamilies[tone] }}>
                YOU HAVE BEEN SELECTED TO RECEIVE
              </div>
            )}
            {(tone >= 3 && tone < 6) && (
              <div style={{ fontSize: '12px', color: '#c0a020', letterSpacing: '2px', marginBottom: '8px', fontFamily: fontFamilies[tone] }}>
                you have been selected (again) for
              </div>
            )}
            {tone >= 6 && (
              <div style={{ fontSize: '12px', color: '#cc4400', letterSpacing: '1px', marginBottom: '8px', fontFamily: fontFamilies[tone], fontWeight: 'bold' }}>
                {tone >= 8 ? 'STATUS: PENDING (ALWAYS PENDING)' : 'STILL SELECTED. STILL PENDING.'}
              </div>
            )}
            <div style={awardTitleStyle}>{letter.awardName}</div>
            <div style={prizeStyle}>Prize: {letter.prizeDescription}</div>
            <div style={pendingStyle}>
              STATUS: PENDING ({acceptCount} acceptance{acceptCount !== 1 ? 's' : ''} logged)
            </div>
          </div>

          {/* BODY */}
          <div style={bodyTextStyle}>{letter.bodyText}</div>

          {/* BUTTON */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <button
              onClick={handleAccept}
              style={buttonStyle}
              onMouseEnter={e => {
                e.target.style.opacity = '0.85';
                e.target.style.transform = tone >= 7
                  ? `rotate(${(tone - 6) * -1}deg) scale(1.05)`
                  : 'scale(1.03)';
              }}
              onMouseLeave={e => {
                e.target.style.opacity = '1';
                e.target.style.transform = tone >= 7
                  ? `rotate(${(tone - 6) * -1}deg)`
                  : 'none';
              }}
            >
              {letter.buttonLabel}
            </button>
          </div>

          {/* NOTES */}
          <div style={notesStyle}>
            {tone < 3 ? 'Click the seal for additional verification.' :
              tone < 5 ? 'Seal is decorative. Please do not click the seal.' :
                tone < 7 ? 'we know you\'re clicking the seal. please stop.' :
                  tone < 9 ? 'dave drew the seal. please be kind about the seal.' :
                    '🥔 the seal is the potato 🥔'}
          </div>

          {/* SIGNATURE */}
          <div style={sigStyle}>
            <div style={{ marginBottom: '4px' }}>
              {tone < 4 ? 'With institutional regards,' : tone < 7 ? 'With increasingly personal regards,' : 'with everything we have,'}
            </div>
            {tone < 5 && (
              <div style={{
                fontFamily: 'cursive',
                fontSize: '20px',
                marginBottom: '4px',
                color: tone < 3 ? '#1a2340' : '#cc6600',
              }}>
                {letter.signatoryName}
              </div>
            )}
            {tone >= 5 && (
              <div style={{
                fontFamily: tone < 8 ? 'cursive' : fontFamilies[tone],
                fontSize: tone < 8 ? '18px' : '16px',
                marginBottom: '4px',
                color: tone < 7 ? '#cc6600' : '#cc0000',
                fontWeight: tone >= 8 ? 'bold' : 'normal',
              }}>
                {letter.signatoryName}
              </div>
            )}
            <div style={{ fontSize: '11px', fontFamily: fontFamilies[tone] }}>
              {letter.signatoryTitle}
            </div>
            <div style={{ fontSize: '11px', fontFamily: fontFamilies[tone], marginTop: '8px' }}>
              {letter.orgName}
            </div>
            <div style={{
              marginTop: '12px',
              fontSize: '10px',
              color: tone < 5 ? '#b8860b' : '#cc6600',
              fontFamily: 'monospace',
            }}>
              REF: AWARD-{(acceptCount + 1).toString().padStart(6, '0')} | Letter {letterIndex + 1} of {letters.length} | Acceptance #{acceptCount}
            </div>
          </div>

          {/* EXTRA CHAOS FOR HIGH TONES */}
          {tone >= 7 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '10px',
              color: '#cc0000',
              fontFamily: fontFamilies[tone],
              transform: 'rotate(90deg)',
              transformOrigin: 'right bottom',
              opacity: 0.6,
            }}>
              {tone >= 9 ? 'pending pending pending pending' : 'please accept please accept'}
            </div>
          )}

          {tone >= 8 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '-8px',
              fontSize: '10px',
              color: '#cc6600',
              fontFamily: fontFamilies[tone],
              transform: 'rotate(-90deg)',
              transformOrigin: 'left center',
              opacity: 0.5,
              whiteSpace: 'nowrap',
            }}>
              🥔 you are the award 🥔 you are the award 🥔
            </div>
          )}
        </div>

        {/* FOOTER NOTE */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '11px',
          color: tone < 5 ? '#8b7355' : tone < 7 ? '#cc8800' : '#cc4400',
          fontFamily: fontFamilies[tone],
          fontStyle: 'italic',
        }}>
          {tone < 2 ? 'This is an official communication. Please retain for your records.' :
            tone < 4 ? 'This supersedes all previous communications. Previous communications also remain valid.' :
              tone < 6 ? 'Acceptance count logged but not resolved. System status: PENDING.' :
                tone < 8 ? 'gerald if you\'re reading this please come back. your desk is still here.' :
                  tone < 9 ? 'margaret and dave are doing okay. the potato is thriving.' :
                    '🥔 everything is pending. everything is fine. 🥔'}
        </div>
      </div>
    </div>
  );
}