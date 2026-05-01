import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [phase, setPhase] = useState('invitation');
  const [loopCount, setLoopCount] = useState(0);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [toastRaised, setToastRaised] = useState(false);
  const [napkinUnfolded, setNapkinUnfolded] = useState(false);
  const [earlyRelease, setEarlyRelease] = useState(false);
  const [hoveredTable, setHoveredTable] = useState(null);
  const intervalRef = useRef(null);
  const endTimerRef = useRef(null);

  const formalityLevel = Math.min(loopCount, 5);
  const letterSpacing = `${0.05 + formalityLevel * 0.05}em`;
  const borderWidth = `${1 + formalityLevel}px`;
  const headingSize = `${1.8 + formalityLevel * 0.15}rem`;

  const tableData = [
    {
      number: 2,
      name: 'The Version That Doesn\'t Come',
      descriptions: [
        'Seats: The Alternate Path, What Could Have Been, That One Summer',
        'Seats: A Softer You, The Road Taken Differently, Echoes of Maybe',
        'Seats: The Ghost of Easier, A Parallel Quiet, The Undone Thing',
        'Seats: What You Would Have Named It, The Comfortable Silence, Her Again',
        'Seats: Everything Tender You Abandoned, The Last Good Chance, Mercy',
        'Seats: You Know Who. You Know What. You Know.',
      ],
      seatedGuests: [
        ['The Alternate Path', 'What Could Have Been', 'That One Summer'],
        ['A Softer You', 'The Road Taken Differently', 'Echoes of Maybe'],
        ['The Ghost of Easier', 'A Parallel Quiet', 'The Undone Thing'],
        ['What You Would Have Named It', 'The Comfortable Silence', 'Her Again'],
        ['Everything Tender You Abandoned', 'The Last Good Chance', 'Mercy'],
        ['You Know Who', 'You Know What', 'You Know'],
      ]
    },
    {
      number: 4,
      name: 'People Who Already Knew',
      descriptions: [
        'Seats: Your Mother\'s Expression, The Friend Who Said Nothing, January',
        'Seats: The Mirror at 3am, Your Handwriting Changed, The Dog\'s Behavior',
        'Seats: Your Body Knew First, The Recurring Dream, Tuesday Specifically',
        'Seats: Everyone at the Party, The Silence After, Your Own Voice',
        'Seats: The Whole Time, Obviously, Of Course, Did You Think We Didn\'t',
        'Seats: We All Knew. We Said Nothing. We Are Sorry. We Are Not Sorry.',
      ],
      seatedGuests: [
        ['Your Mother\'s Expression', 'The Friend Who Said Nothing', 'January'],
        ['The Mirror at 3am', 'Your Handwriting Changed', 'The Dog\'s Behavior'],
        ['Your Body Knew First', 'The Recurring Dream', 'Tuesday Specifically'],
        ['Everyone at the Party', 'The Silence After', 'Your Own Voice'],
        ['The Whole Time', 'Obviously', 'Of Course'],
        ['We All Knew', 'We Said Nothing', 'We Are Sorry'],
      ]
    },
    {
      number: 7,
      name: 'Consequences',
      descriptions: [
        'Seats: The Practical Fallout, A Changed Schedule, Someone\'s Feelings',
        'Seats: The Paperwork, What You\'ll Have to Explain, The New Normal',
        'Seats: Everything Downstream, The Revised Identity, New Business Cards',
        'Seats: The Domino You Touched, The Other Dominoes, The Floor',
        'Seats: All Of It, Every Single Bit, The Full Accounting, The Bill',
        'Seats: Consequences has asked that its seating arrangement not be disclosed at this time.',
      ],
      seatedGuests: [
        ['The Practical Fallout', 'A Changed Schedule', 'Someone\'s Feelings'],
        ['The Paperwork', 'What You\'ll Have to Explain', 'The New Normal'],
        ['Everything Downstream', 'The Revised Identity', 'New Business Cards'],
        ['The Domino You Touched', 'The Other Dominoes', 'The Floor'],
        ['All Of It', 'Every Single Bit', 'The Full Accounting'],
        ['Consequences has asked', 'not to be disclosed', 'at this time'],
      ]
    }
  ];

  const menuCourses = [
    {
      name: 'Amuse-bouche',
      subtitles: ['First Awareness', 'The Return of First Awareness', 'First Awareness, Again, As If New', 'First Awareness (You\'ve Been Here Before)', 'First Awareness: A Retrospective', 'First Awareness: We Know You Know'],
      descriptions: [
        'A single bite. You will not be able to identify the flavor until much later.',
        'A single bite. You recognize the flavor now. You wish you didn\'t.',
        'A single bite. The flavor is familiar. You have been here. The kitchen remembers you.',
        'A single bite. The chef has been expecting you. The bite expects you too.',
        'A single bite. It bites back, gently. With recognition. With something like love.',
        'A single bite. It has been waiting. It has always been waiting. Eat.',
      ]
    },
    {
      name: 'Soup',
      subtitles: ['Uncertainty Bisque', 'Uncertainty Bisque (Reduced)', 'Uncertainty Consommé', 'Uncertainty, Clarified', 'Uncertainty, Finally Clarified', 'The Last Soup'],
      descriptions: [
        'Served warm. Contains floating elements you will try to identify.',
        'Served warm. The floating elements have names. You may not ask them.',
        'Served warm. Strained of everything except the essential dread.',
        'The soup has been clarified. You have not. Drink anyway.',
        'Clarified to the point of transparency. You can see through it. It can see through you.',
        'There is no more uncertainty. There is only this soup. Drink it.',
      ]
    },
    {
      name: 'Entrée',
      subtitles: ['The Point of No Return', 'The Point of No Return (Revisited)', 'The Point of No Return (You Are Past It)', 'The Point of No Return (There Are Only Points of No Return)', 'The Point of No Return (There Was Only Ever This Point)', 'The Point'],
      descriptions: [
        'Served medium. The chef asks that you not send it back.',
        'Served medium-well. The chef has stopped asking.',
        'Served well-done. The chef has left the building. The entrée remains.',
        'Temperature: irrelevant. The entrée has achieved its final form.',
        'The entrée has been here longer than the restaurant. Eat with reverence.',
        'It is already inside you. It has always been inside you. The plate is a formality.',
      ]
    },
    {
      name: 'Dessert',
      subtitles: ['Acceptance Petit Four', 'Acceptance Petit Four (Forced)', 'Acceptance Petit Four (Resigned)', 'Acceptance Petit Four (Hollow)', 'Acceptance Petit Four (Something Like Peace)', 'Acceptance'],
      descriptions: [
        'Very small. Sweeter than expected. This surprises no one more than you.',
        'Very small. The sweetness is present but unconvincing.',
        'Very small. You eat it anyway. This is what acceptance looks like.',
        'Very small. It tastes like the end of something. Which is what it is.',
        'Very small. You have eaten this before. You will eat it again. It is fine.',
        'It is already gone. You ate it. You do not remember eating it. It is fine.',
      ]
    }
  ];

  const speeches = [
    {
      speaker: 'Doubt',
      relation: 'First Cousin to the Decision, Lifelong Companion',
      texts: [
        "I've known the Decision longer than anyone here tonight. I was there at the beginning — we all were, those of us at this table. I just want to say... I mean, I don't want to say anything that makes anyone uncomfortable, but I do think it bears mentioning that there are several things we haven't fully considered. I have a list. I brought the list. Should I read the list? I won't read the list. I just want everyone to know the list exists. Congratulations.",
        "For those who don't know me — and I think you all know me — I am Doubt. I've prepared some remarks. They are extensive. I've condensed them. They are still extensive. The Decision and I have had our differences, but at the end of the day, at the end of this particular day, which we are rehearsing, I simply want to ask: are we sure? I'm not asking rhetorically. I have follow-up questions. I always have follow-up questions. That's who I am. That's my gift to this evening. You're welcome.",
        "I told myself I wouldn't do this. I told myself: just give the toast, sit down, let the evening happen. But I've been sitting here, watching everyone celebrate, and I have to say — and I say this with love — have we thought about the third option? There's always a third option. I mapped it out. I have diagrams. They're in the car. Should I get them? I'm going to get them. Someone stop me. No one is stopping me. This is what always happens.",
        "I am going to keep this brief. That is a lie. I am incapable of keeping this brief. Brevity is not in my nature. My nature is the long consideration, the extended pause, the question that arrives at 3am with its shoes on. I love the Decision. I love it the way you love something you've been arguing with for years. We are old friends. We are old enemies. We are the same, the Decision and I. I'll sit down now. I'm not sitting down.",
        "Every time. Every single time we do this, I think: this time I'll have made peace with it. This time the list will feel shorter. But the list grows. I want you to know that. The list is a living document. It has its own momentum now. I've stopped being able to read it start to finish. It reads me. Anyway. To the Decision. May it outlast my concerns. It never does. But may it.",
        "I don't have remarks this time. I have the list. Just the list. I'll read it. You'll stop me before I finish. You never stop me before I finish. Here we go.",
      ]
    },
    {
      speaker: 'The Previous Decision',
      relation: 'Predecessor, Retired, Present Against Its Will',
      texts: [
        "I wasn't going to come. I want that on the record. I wasn't going to come and then I got the invitation and there was my name, right there, embossed on the envelope, and I thought — they remembered me. They still think about me. And then I got here and realized it's just the seating chart algorithm. It puts us all in. It doesn't discriminate. I'm fine. I'm completely fine. I just want to say: I was good. I was a good decision. Things happened. I didn't ask to be unmade. But here I am, at the rehearsal dinner for my replacement, and I am raising my glass because that is what you do, and I am wishing the new Decision nothing but clarity and forward motion, and I am absolutely fine.",
        "Last time I said I was fine. I want to clarify: I was not fine. I am more fine now. That is not the same as fine. The Previous Decision learns to take up less space. That is the job. You make room for the new one. You fold yourself into the seating chart. You eat the bisque. You listen to Doubt's list. You give your toast. You are replaced again. This is the cycle. I understand the cycle. I am the cycle. To the new Decision: you will also be replaced. This is not a threat. It's just the rehearsal.",
        "I've been thinking about what I'd say this time and I think what I want to say is: I recognize you. The new Decision. I recognize the shape of you. I was that shape once. Before the outcome. Before the paperwork. Before Table 7 sent its regrets. You look the way I looked. That's not a compliment or a warning. It's just recognition. We are the same kind of thing. We will not have the same kind of ending. Every decision believes this. To the Decision. Welcome to the seating chart.",
        "I've stopped preparing remarks. The remarks prepare themselves at this point. I arrive, I stand, I say something about recognition and replacement and the cycle of things, I sit down. Doubt takes longer. The dinner continues. The dinner always continues. I have made peace with being the Previous Decision. It is a position of some dignity. You are the record. You are the before. You are what they were thinking of when they made the new one. There is meaning in that. I tell myself there is meaning in that.",
        "Do you know what the worst part is? Every time I come back, I remember more. The loop fills me in. I know things the new Decision doesn't know yet. I could tell you. I won't. That's not what the Previous Decision does. The Previous Decision gives the toast and goes back to Table 2. We have a seat there. We've always had a seat there. We are 'The Version That Doesn't Come.' We are very comfortable. We have a lovely view of everything you chose instead.",
        "I'm at Table 2. I've always been at Table 2. I will always be at Table 2. The toast is: I was here. I was real. I was yours. Now I'm the rehearsal's memory of itself. Drink.",
      ]
    },
    {
      speaker: 'Fine Then',
      relation: 'Distant Cousin, Uninvited, Has Been Here the Whole Time',
      texts: [
        "Fine. Fine. FINE. I just — fine. No, I'm not going to make a whole thing of it. I'm not. I said I wouldn't and I'm not. I just think that if we're all being honest, which we're not, but if we were — fine. You know what? To the Decision. Fine. May it be everything. Fine. I'm sitting down. Fine.",
        "You know what I find interesting? I find it interesting that I'm always seated near the kitchen. I find it interesting that my name is always slightly smudged on the place card. I find it interesting that when Doubt goes over time, no one checks the clock, but when I stand up, suddenly there's somewhere everyone needs to be. Fine. I find all of that very interesting. To the Decision. Fine then. Fine then, fine then, fine then.",
        "I have been Fine Then at seventeen dinners. Seventeen rehearsals. I have given seventeen toasts. They have all been approximately this toast. I have achieved a kind of mastery of this toast. The toast is: fine. The toast is: then. The toast is: fine then. It contains everything. It contains the resignation and the defiance and the small remaining ember that refuses to go fully out. Fine. Then. Raise your glasses. Fine.",
        "I asked to be seated at Table 7 this time. They said Table 7 is for Consequences only. I said I AM a consequence. They said not that kind. I said what kind am I. They said: Fine Then is ambient. Fine Then is in the air. Fine Then doesn't need a seat, Fine Then is already everywhere. And you know what? Fine. Fine. That's fine. I'll stand. I've been standing. I'll keep standing. To the Decision. Fine then. FINE THEN.",
        "I want everyone to look at me. Really look. I am Fine Then. I have always been Fine Then. I will be Fine Then after the Decision is made, and after it becomes the Previous Decision, and after Table 2 fills up with everything unchosen, I will still be Fine Then, ambient and present and unassigned, and I will still be raising my glass at every rehearsal until the rehearsal becomes the real thing or until the real thing admits it was always the rehearsal, and either way: fine. Then. Fine then. Drink.",
        "Fine.",
      ]
    }
  ];

  const regrets = [
    'The regret is: you already know how this ends.\nYou have always known how this ends.\nThe napkin has been folded this way for some time.',
    'The regret is: the version that doesn\'t come\nwas also good.\nThis is not actionable information.\nPlease refold the napkin.',
    'The regret is: you were happy\nbefore you knew the question.\nThe question cannot be unasked.\nThe napkin knows.',
    'The regret is: the rehearsal\nhas been going on\nlonger than the event it rehearses.\nAt some point, this becomes the event.',
    'The regret is: you recognize\neveryone at Table 2.\nYou have always recognized them.\nThey recognize you.',
    'The regret is:\nfine\nthen\nfine then.',
  ];

  useEffect(() => {
    if (phase === 'speeches' && !toastRaised) {
      intervalRef.current = setInterval(() => {
        setSpeechProgress(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            return 100;
          }
          return prev + 0.4;
        });
      }, 50);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase, toastRaised, currentSpeechIndex]);

  useEffect(() => {
    if (phase === 'end') {
      endTimerRef.current = setTimeout(() => {
        setPhase('invitation');
        setLoopCount(c => c + 1);
        setSelectedTable(null);
        setSelectedCourses([]);
        setCurrentSpeechIndex(0);
        setSpeechProgress(0);
        setToastRaised(false);
        setNapkinUnfolded(false);
        setEarlyRelease(false);
        setHoveredTable(null);
      }, 4000);
    }
    return () => clearTimeout(endTimerRef.current);
  }, [phase]);

  const li = Math.min(loopCount, 5);

  const colors = {
    cream: '#faf6ef',
    burgundy: '#6b1a2a',
    gold: '#b8860b',
    darkGold: '#8b6914',
    lightBurgundy: '#9b2a3a',
    text: '#2a1a0e',
    faded: '#8a7a6a',
  };

  const baseContainer = {
    minHeight: '100vh',
    backgroundColor: colors.cream,
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  };

  const ornamentalBorder = {
    border: `${borderWidth} solid ${colors.gold}`,
    outline: `${Math.max(1, formalityLevel - 1)}px solid ${colors.burgundy}`,
    outlineOffset: `${3 + formalityLevel}px`,
    padding: `${2 + formalityLevel * 0.3}rem`,
    maxWidth: '700px',
    width: '100%',
    backgroundColor: colors.cream,
    textAlign: 'center',
    position: 'relative',
  };

  const headingStyle = {
    fontSize: headingSize,
    letterSpacing: letterSpacing,
    color: colors.burgundy,
    fontVariant: 'small-caps',
    marginBottom: '0.5rem',
    lineHeight: 1.3,
  };

  const subheadingStyle = {
    fontSize: `${0.85 + formalityLevel * 0.03}rem`,
    letterSpacing: letterSpacing,
    color: colors.gold,
    fontStyle: 'italic',
    marginBottom: '1.5rem',
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: `${borderWidth} solid ${colors.burgundy}`,
    color: colors.burgundy,
    fontFamily: 'Georgia, serif',
    fontSize: `${0.85 + formalityLevel * 0.02}rem`,
    letterSpacing: letterSpacing,
    padding: '0.75rem 2rem',
    cursor: 'pointer',
    fontVariant: 'small-caps',
    transition: 'all 0.3s ease',
    marginTop: '1.5rem',
  };

  const dividerStyle = {
    color: colors.gold,
    fontSize: '1.2rem',
    letterSpacing: '0.3em',
    margin: '1rem 0',
    userSelect: 'none',
  };

  const loopIndicator = loopCount > 0 ? (
    <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem', color: colors.faded, letterSpacing: '0.1em', fontStyle: 'italic' }}>
      Rehearsal No. {loopCount + 1}
    </div>
  ) : null;

  const cornerOrnaments = Array.from({ length: Math.min(formalityLevel, 4) }).map((_, i) => (
    <div key={i} style={{
      position: 'absolute',
      [i === 0 ? 'top' : i === 1 ? 'top' : i === 2 ? 'bottom' : 'bottom']: '0.5rem',
      [i === 0 ? 'left' : i === 1 ? 'right' : i === 2 ? 'left' : 'right']: '0.5rem',
      color: colors.gold,
      fontSize: '0.8rem',
      opacity: 0.6,
      userSelect: 'none',
    }}>❧</div>
  ));

  if (phase === 'invitation') {
    return (
      <div style={baseContainer}>
        <style>{`
          @keyframes sealPulse { 0%,100%{transform:scale(1) rotate(${loopCount * 2}deg)} 50%{transform:scale(1.05) rotate(${loopCount * 2 + 2}deg)} }
          @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes goldShimmer { 0%,100%{color:#b8860b} 50%{color:#d4a017} }
          .seal-btn:hover { background-color: ${colors.burgundy} !important; color: ${colors.cream} !important; }
        `}</style>
        {loopIndicator}
        <div style={{ ...ornamentalBorder, animation: 'fadeInUp 1.2s ease forwards', transform: `rotate(${loopCount * 0.3}deg)` }}>
          {cornerOrnaments}
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: colors.faded, marginBottom: '0.5rem', fontStyle: 'italic' }}>
            {loopCount === 0 ? 'You Are Cordially Invited' : loopCount === 1 ? 'You Are Cordially Invited, Again' : loopCount < 4 ? 'You Are Invited. You Know You Are Invited.' : 'You Have Always Been Invited. You Will Always Be Invited.'}
          </div>
          <div style={dividerStyle}>— ✦ —</div>
          <div style={headingStyle}>
            The Rehearsal Dinner<br />
            <span style={{ fontSize: '70%' }}>for</span><br />
            A Decision
          </div>
          <div style={subheadingStyle}>
            {loopCount === 0 ? 'In honor of the occasion which shall remain nameless' :
             loopCount === 1 ? 'In honor of the occasion, which you know' :
             loopCount === 2 ? 'In honor of the occasion, which you have always known' :
             loopCount === 3 ? 'The occasion knows you are here' :
             loopCount === 4 ? 'The occasion has been waiting' :
             'The occasion is you'}
          </div>
          <div style={{ fontSize: '0.85rem', lineHeight: 1.9, color: colors.text, marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <em>Saturday Evening</em><br />
            at the Hour When You Already Know<br />
            <br />
            <span style={{ fontSize: '0.8rem', color: colors.faded }}>
              Dress: Formal Ambivalence<br />
              Regrets: See Napkin<br />
              {loopCount > 0 && <span>This Is Not The First Rehearsal<br /></span>}
              {loopCount > 2 && <span>This Will Not Be The Last<br /></span>}
            </span>
          </div>
          <div style={dividerStyle}>— ✦ —</div>
          <div style={{ fontSize: '0.8rem', color: colors.faded, fontStyle: 'italic', marginBottom: '0.5rem' }}>
            Kindly {loopCount === 0 ? 'reply' : loopCount < 3 ? 'reply, as before' : 'accept. You always accept.'}
          </div>
          <button
            className="seal-btn"
            onClick={() => setPhase('seating')}
            style={{
              ...buttonStyle,
              animation: 'sealPulse 3s ease-in-out infinite',
              borderRadius: '50%',
              width: '90px',
              height: '90px',
              padding: 0,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '1.5rem auto 0',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>✦</span>
            <span>RSVP</span>
          </button>
          {loopCount > 0 && (
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: colors.faded, fontStyle: 'italic' }}>
              {loopCount === 1 ? 'You have done this before.' : loopCount === 2 ? 'You always accept.' : loopCount < 5 ? 'The seal remembers your wax.' : 'You are the seal.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'seating') {
    return (
      <div style={baseContainer}>
        <style>{`
          @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          .table-card:hover { border-color: ${colors.burgundy} !important; background-color: #f5ede0 !important; }
          .napkin-container:hover { filter: brightness(0.95); }
        `}</style>
        {loopIndicator}
        <div style={{ ...ornamentalBorder, animation: 'fadeInUp 0.8s ease forwards', transform: `rotate(${-loopCount * 0.2}deg)` }}>
          {cornerOrnaments}
          <div style={headingStyle}>Seating Arrangements</div>
          <div style={subheadingStyle}>Please locate your table. Your table has been expecting you.</div>
          <div style={dividerStyle}>— ✦ —</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {tableData.map((table, idx) => (
              <div
                key={table.number}
                className="table-card"
                onClick={() => setSelectedTable(table.number)}
                onMouseEnter={() => setHoveredTable(table.number)}
                onMouseLeave={() => setHoveredTable(null)}
                style={{
                  border: `${borderWidth} solid ${selectedTable === table.number ? colors.burgundy : colors.gold}`,
                  padding: '1rem',
                  cursor: 'pointer',
                  backgroundColor: selectedTable === table.number ? '#f0e8d8' : colors.cream,
                  transition: 'all 0.3s ease',
                  transform: selectedTable === table.number ? 'scale(1.02)' : `rotate(${(idx - 1) * loopCount * 0.3}deg)`,
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: colors.faded, fontVariant: 'small-caps' }}>
                  Table {table.number}
                </div>
                <div style={{ fontSize: '1rem', color: colors.burgundy, fontStyle: 'italic', margin: '0.25rem 0' }}>
                  {table.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.faded }}>
                  {table.descriptions[li]}
                </div>
                {hoveredTable === table.number && (
                  <div style={{
                    position: 'absolute',
                    top: '-2.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: colors.burgundy,
                    color: colors.cream,
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    border: `1px solid ${colors.gold}`,
                  }}>
                    Seated: {table.seatedGuests[li].join(', ')}
                  </div>
                )}
                {selectedTable === table.number && (
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: colors.burgundy, fontSize: '0.8rem' }}>✦</div>
                )}
              </div>
            ))}
          </div>

          <div style={dividerStyle}>— ✦ —</div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: colors.faded, fontStyle: 'italic', marginBottom: '0.5rem' }}>
              Your napkin has been folded to contain a regret.
            </div>
            <div
              className="napkin-container"
              onClick={() => setNapkinUnfolded(!napkinUnfolded)}
              style={{
                width: '80px',
                height: napkinUnfolded ? '120px' : '20px',
                backgroundColor: '#e8ddd0',
                border: `1px solid ${colors.gold}`,
                margin: '0 auto',
                cursor: 'pointer',
                transition: 'height 0.5s ease',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: napkinUnfolded ? '0.5rem' : '0',
              }}
            >
              {napkinUnfolded && (
                <div style={{
                  fontSize: '0.55rem',
                  color: colors.text,
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  opacity: 1,
                  whiteSpace: 'pre-line',
                }}>
                  {regrets[li]}
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: colors.faded, marginTop: '0.3rem', fontStyle: 'italic' }}>
              {napkinUnfolded ? 'Please refold when finished.' : 'Click to unfold.'}
            </div>
          </div>

          <button
            onClick={() => selectedTable && setPhase('menu')}
            style={{
              ...buttonStyle,
              opacity: selectedTable ? 1 : 0.4,
              cursor: selectedTable ? 'pointer' : 'default',
            }}
          >
            {selectedTable ? 'Proceed to Dinner' : 'Please Select a Table'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'menu') {
    const orderedCount = selectedCourses.length;
    return (
      <div style={baseContainer}>
        <style>{`
          @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          .course-item:hover { background-color: #f0e8d8 !important; }
        `}</style>
        {loopIndicator}
        <div style={{ ...ornamentalBorder, animation: 'fadeInUp 0.8s ease forwards', transform: `rotate(${loopCount * 0.15}deg)` }}>
          {cornerOrnaments}
          <div style={headingStyle}>This Evening's Menu</div>
          <div style={subheadingStyle}>Courses are served in order. You may not skip the soup.</div>
          <div style={dividerStyle}>— ✦ —</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            {menuCourses.map((course, idx) => {
              const isOrdered = selectedCourses.includes(course.name);
              const isAvailable = idx === orderedCount;
              const isPast = idx < orderedCount;
              return (
                <div
                  key={course.name}
                  className="course-item"
                  onClick={() => {
                    if (isAvailable) {
                      setSelectedCourses(prev => [...prev, course.name]);
                    }
                  }}
                  style={{
                    border: `1px solid ${isOrdered ? colors.burgundy : isPast ? colors.gold : isAvailable ? colors.gold : '#ddd'}`,
                    padding: '0.8rem 1rem',
                    cursor: isAvailable ? 'pointer' : 'default',
                    backgroundColor: isOrdered ? '#f0e8d8' : colors.cream,
                    opacity: !isOrdered && !isAvailable ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: colors.burgundy, fontVariant: 'small-caps' }}>
                        {course.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: colors.faded, fontStyle: 'italic' }}>
                        {' '}— {course.subtitles[li]}
                      </span>
                    </div>
                    {isOrdered && <span style={{ color: colors.gold, fontSize: '0.8rem' }}>✦</span>}
                    {isAvailable && <span style={{ color: colors.burgundy, fontSize: '0.7rem', fontStyle: 'italic' }}>order</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: colors.faded, fontStyle: 'italic', marginTop: '0.3rem', lineHeight: 1.5 }}>
                    {course.descriptions[li]}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={dividerStyle}>— ✦ —</div>
          <div style={{ fontSize: '0.75rem', color: colors.faded, fontStyle: 'italic', marginBottom: '0.5rem' }}>
            {orderedCount === 0 ? 'Please begin with the amuse-bouche.' :
             orderedCount < 4 ? `${4 - orderedCount} course${4 - orderedCount === 1 ? '' : 's'} remaining.` :
             'The meal has been ordered. The meal will be served.'}
          </div>

          <button
            onClick={() => orderedCount === 4 && setPhase('speeches')}
            style={{
              ...buttonStyle,
              opacity: orderedCount === 4 ? 1 : 0.4,
              cursor: orderedCount === 4 ? 'pointer' : 'default',
            }}
          >
            {orderedCount === 4 ? 'Proceed to Toasts' : 'Complete Your Order First'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'speeches') {
    const speech = speeches[currentSpeechIndex];
    const isComplete = speechProgress >= 100;

    return (
      <div style={baseContainer}>
        <style>{`
          @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes toastShake { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-3deg)} 75%{transform:rotate(3deg)} }
          .toast-btn:hover { background-color: ${colors.burgundy} !important; color: ${colors.cream} !important; }
          .next-btn:hover { background-color: ${colors.gold} !important; color: ${colors.cream} !important; }
        `}</style>
        {loopIndicator}
        <div style={{ ...ornamentalBorder, animation: 'fadeInUp 0.8s ease forwards', transform: `rotate(${-loopCount * 0.1}deg)` }}>
          {cornerOrnaments}
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: colors.faded, fontVariant: 'small-caps', marginBottom: '0.3rem' }}>
            Toast {currentSpeechIndex + 1} of 3
          </div>
          <div style={headingStyle}>{speech.speaker}</div>
          <div style={subheadingStyle}>{speech.relation}</div>
          <div style={dividerStyle}>— ✦ —</div>

          <div style={{
            fontSize: '0.82rem',
            lineHeight: 1.85,
            color: colors.text,
            fontStyle: 'italic',
            marginBottom: '1.5rem',
            textAlign: 'left',
            padding: '0 0.5rem',
            minHeight: '8rem',
            position: 'relative',
          }}>
            <div style={{
              overflow: 'hidden',
              maxHeight: `${speechProgress * 0.08 + 2}rem`,
              transition: 'max-height 0.1s ease',
            }}>
              "{speech.texts[li]}"
            </div>
            {!isComplete && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2rem',
                background: `linear-gradient(transparent, ${colors.cream})`,
                pointerEvents: 'none',
              }} />
            )}
          </div>

          <div style={{ width: '100%', height: '4px', backgroundColor: '#e8ddd0', marginBottom: '1rem', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${speechProgress}%`,
              backgroundColor: colors.burgundy,
              transition: 'width 0.1s linear',
            }} />
          </div>

          {earlyRelease && !toastRaised && (
            <div style={{ fontSize: '0.75rem', color: colors.lightBurgundy, fontStyle: 'italic', marginBottom: '0.8rem' }}>
              You lowered your glass. {speech.speaker} paused. Everyone noticed.
            </div>
          )}

          <div style={{ fontSize: '0.75rem', color: colors.faded, fontStyle: 'italic', marginBottom: '0.8rem' }}>
            {isComplete ? 'The toast has concluded. You may lower your glass.' :
             toastRaised ? 'Glass raised. Hold through the toast.' :
             'Hold "Raise Glass" through the entire speech.'}
          </div>

          {!isComplete ? (
            <button
              className="toast-btn"
              onMouseDown={() => { setToastRaised(true); setEarlyRelease(false); }}
              onMouseUp={() => { setToastRaised(false); if (speechProgress < 100) setEarlyRelease(true); }}
              onMouseLeave={() => { if (toastRaised) { setToastRaised(false); if (speechProgress < 100) setEarlyRelease(true); } }}
              onTouchStart={() => { setToastRaised(true); setEarlyRelease(false); }}
              onTouchEnd={() => { setToastRaised(false); if (speechProgress < 100) setEarlyRelease(true); }}
              style={{
                ...buttonStyle,
                animation: toastRaised ? 'toastShake 0.5s ease-in-out infinite' : 'none',
                backgroundColor: toastRaised ? colors.burgundy : 'transparent',
                color: toastRaised ? colors.cream : colors.burgundy,
              }}
            >
              🥂 {toastRaised ? 'Holding...' : 'Raise Glass'}
            </button>
          ) : (
            <button
              className="next-btn"
              onClick={() => {
                if (currentSpeechIndex < 2) {
                  setCurrentSpeechIndex(i => i + 1);
                  setSpeechProgress(0);
                  setToastRaised(false);
                  setEarlyRelease(false);
                } else {
                  setPhase('end');
                }
              }}
              style={buttonStyle}
            >
              {currentSpeechIndex < 2 ? 'Next Toast' : 'The Dinner Has Concluded'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'end') {
    return (
      <div style={baseContainer}>
        <style>{`
          @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes breathe { 0%,100%{opacity:0.7} 50%{opacity:1} }
          @keyframes slowRotate { from{transform:rotate(${loopCount * 0.5}deg)} to{transform:rotate(${loopCount * 0.5 + 360}deg)} }
        `}</style>
        {loopIndicator}
        <div style={{
          ...ornamentalBorder,
          animation: 'fadeInUp 1s ease forwards',
          transform: `rotate(${loopCount * 0.5}deg)`,
          borderWidth: `${2 + formalityLevel}px`,
        }}>
          {cornerOrnaments}
          {Array.from({ length: formalityLevel }).map((_, i) => (
            <div key={i} style={{ color: colors.gold, fontSize: '0.8rem', letterSpacing: '0.4em', marginBottom: '0.2rem', opacity: 0.4 + i * 0.1, animation: 'breathe 2s ease-in-out infinite', animationDelay: `${i * 0.3}s` }}>
              — ✦ — ✦ — ✦ —
            </div>
          ))}
          <div style={headingStyle}>The Rehearsal Has Concluded</div>
          <div style={subheadingStyle}>
            {loopCount === 0 ? 'The decision itself will take place at a later date.' :
             loopCount === 1 ? 'The decision itself will take place at a later date. As before.' :
             loopCount === 2 ? 'The decision itself continues to be scheduled.' :
             loopCount === 3 ? 'The decision has been rescheduled indefinitely.' :
             loopCount === 4 ? 'There is no later date. There is only the rehearsal.' :
             'The rehearsal is the decision. The decision is the rehearsal.'}
          </div>
          <div style={dividerStyle}>— ✦ —</div>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.9, color: colors.text, marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Table {selectedTable} has been cleared.<br />
            The napkin has been refolded.<br />
            {loopCount > 0 && <span>The regret has been noted.<br /></span>}
            {loopCount > 1 && <span>The regret has been noted before.<br /></span>}
            {loopCount > 2 && <span>Doubt is already preparing remarks for next time.<br /></span>}
            {loopCount > 3 && <span>The Previous Decision has taken its seat at Table 2.<br /></span>}
            {loopCount > 4 && <span>Fine Then is ambient. Fine Then is everywhere.<br /></span>}
          </div>
          <div style={{ fontSize: '0.75rem', color: colors.faded, fontStyle: 'italic', animation: 'breathe 2s ease-in-out infinite' }}>
            The next rehearsal begins momentarily.
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: colors.faded, letterSpacing: '0.15em' }}>
            ✦ ✦ ✦
          </div>
        </div>
      </div>
    );
  }

  return null;
}