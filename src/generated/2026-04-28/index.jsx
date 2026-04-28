import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [selectedSilence, setSelectedSilence] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [boothTranscripts, setBoothTranscripts] = useState(['', '', '', '']);
  const [boothStates, setBoothStates] = useState(['idle', 'idle', 'idle', 'idle']);
  const [clarifyingBooth, setClarifyingBooth] = useState(null);
  const [clarificationText, setClarificationText] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [onAir, setOnAir] = useState(false);
  const [tickCount, setTickCount] = useState(0);

  const tickRef = useRef(0);
  const intervalRef = useRef(null);
  const onAirRef = useRef(null);
  const clarifyTimeoutRef = useRef(null);
  const boothRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const silences = [
    { value: 'honest_question', label: 'the silence after a question that was too honest' },
    { value: 'gift_opening', label: 'the silence when someone opens a gift you gave' },
    { value: 'song_ends', label: 'the silence in a car after a song ends and no one changes it' },
    { value: 'phone_goodbye', label: 'the silence before you hang up but neither person does' },
    { value: 'apology', label: 'the silence after an apology that was almost enough' },
    { value: 'window_stare', label: 'the silence of someone looking out a window for too long' },
  ];

  const transcriptFragments = {
    honest_question: [
      [
        'Initial acoustic scan: the silence presents as— [clears throat] — well, it presents as—',
        'The question itself has already— [long pause] — you understand what I mean. Yes.',
        'In Tertian we would say [throat-clearing sequence: hh-hmm-hh] which roughly— no, not roughly—',
        'There is a phrase, and I am almost— the phrase is almost— [FOOTNOTE 1: see Booth 2 re: "almost"]',
        'The respondent\'s intake of breath at 0.3 seconds constitutes, in our framework, a full subordinate clause—',
        'I want to be clear that this silence is not— [sound of papers] — it is categorically not the same as—',
        '...and yet. And yet. [FOOTNOTE 2: Booth 3 is wrong about the "yet"]',
        'If we parse the silence backward, which is the only honest direction—',
      ],
      [
        'OBLIQUE TRANSLATION INITIATED. Note: Oblique has 40 words for "almost." We will require most of them.',
        '"Presque-vide" (almost-empty, but the emptiness has already been furnished)',
        'The silence is "kashmiri-ward" — moving toward something it will not name',
        '"Halvnær" — the feeling of being almost-near to understanding why you asked',
        'Cross-reference: Booth 1 has used "almost" incorrectly. In Oblique, that usage is "faintward" not "almost."',
        '"Beinahe-wahr" — almost true, which is the most dangerous kind of almost',
        'The question hangs in "tangential proximity" — [FOOTNOTE A: Booth 1, please. Please.]',
        '"Presque-dit" — almost said. The silence IS the almost-said.',
        '"Velvet-adjacent" — we coined this term three years ago and this silence is why.',
      ],
      [
        'MUTE FORMAL — OFFICIAL TRANSLATION RECORD',
        'The silence (hereinafter "the Subject") is formally acknowledged.',
        'Duration: indeterminate. Nature: intentional [disputed — see Annex C]',
        'The Subject contains: one (1) unresolved interrogative, affect: high',
        'Structural analysis: the silence is load-bearing. Do NOT attempt to fill.',
        'The question asked was, per our assessment, three questions wearing one question\'s coat—',
        '[TRANSLATION SUSPENDED — FILING FORMAL COMPLAINT — SEE COMPLAINT DOCUMENT]',
      ],
      [
        'Right so — and I want to say first that we moved the couch last Tuesday — this silence is familiar.',
        'When you move furniture you learn that some spaces were always there. The silence knew this.',
        'We call it "the gap behind the bookshelf." It has been there the whole time.',
        '[FOOTNOTE: Booth 2, your word "halvnær" — we have a better one. We call it "where the couch was."]',
        'The person who was asked is currently standing in "the gap behind the bookshelf."',
        'They will answer when they find what was lost back there. It may take some time.',
        'We have found: one earring, three pens, and a silence from 2019 that still has not been translated.',
      ],
    ],
    gift_opening: [
      [
        'The silence begins at the moment of unwrapping. Note: the wrapping was— [clears throat twice] — adequate.',
        'In Tertian, the first 0.8 seconds are a complete sentence: [hh-hmm, intake, hh]',
        'It means: "I can see what you thought I wanted." This is different from wanting.',
        'The giver is currently— [long pause] — watching. Yes. The watching is the second sentence.',
        '[FOOTNOTE 1: This silence has a face. Booth 2 refuses to acknowledge the face.]',
        'The third sentence, which occurs between seconds 1.2 and 2.4, is: "I will perform wanting."',
        'This is not dishonest. In Tertian, performance and feeling share a root. They are considered the same.',
      ],
      [
        'OBLIQUE TRANSLATION: This silence is "cadeau-adjacent" — gift-shaped but not gift-feeling.',
        '"Presque-reconnu" — almost recognized. You almost knew them.',
        'The silence contains: one (1) moment of "beinahe-richtig" — almost right, which is its own country.',
        '"Halvgitt" — half-given. The gift was half given. The silence is the other half.',
        'There is a word: "tangential-love" — loving someone so much you miss them slightly.',
        '[FOOTNOTE B: Booth 1, the face you mentioned — in Oblique that is "the face of almost-yes"]',
        '"Presque-merci" — almost-thank-you. The actual thank you is coming. It will be warm and untrue.',
      ],
      [
        'MUTE FORMAL — The gift has been received. The silence is being catalogued.',
        'Contents of silence: gratitude (partial), recognition (partial), performance (full)',
        'Note: the giver is experiencing "expectation-exposure" — a vulnerable and inadvisable condition.',
        'The receiver is protecting the giver. This is documented as an act of care. [DISPUTED — see Annex F]',
        '[TRANSLATION SUSPENDED — FILING FORMAL COMPLAINT — SEE COMPLAINT DOCUMENT]',
      ],
      [
        'We moved the gift table last week. It is now by the window.',
        'Before, the gifts went in the corner. The corner held something. The window holds something different.',
        'This silence is "corner-to-window." It is a transition silence. It does not know where it lives yet.',
        '[FOOTNOTE: Booth 3 — "expectation-exposure" — we have a couch for that feeling. We call it "the viewing couch."]',
        'The gift sits on the new table. In the new light. Looking slightly wrong and completely correct.',
        'We call this silence "the space where the old table was." It is being refurnished in real time.',
      ],
    ],
    song_ends: [
      [
        'The song has ended. The silence is— [clears throat] — the song is still ending.',
        'In Tertian, a silence that follows music is called [hm-hh-hmm-pause] which means: "the sound is still here."',
        'It is not nostalgia. Nostalgia is in the past. This silence is happening now.',
        '[FOOTNOTE 1: Booth 4 will say something about a speaker placement. This is relevant but I will not admit it.]',
        'No one changes the song because changing it would mean— [long pause] — yes. Exactly.',
        'The car is moving. The silence is also moving. They are moving together at 60 miles per hour.',
        'At some point someone will say "that was a good song." This will be the burial.',
      ],
      [
        'OBLIQUE: The silence is "post-sonique" — after-sound, which is louder than sound.',
        '"Presque-chanté" — almost-sung. You almost sang along. You know why you didn\'t.',
        'The car window is showing you a landscape that matches the song perfectly. This is suspicious.',
        '"Halvmelodi" — half-melody. The silence is the second half.',
        '[FOOTNOTE B: Booth 1, "the burial" — in Oblique this is "presque-fin" — almost-ending, not ending]',
        '"Beinahe-gesagt" — you almost said something. About the song. About something else.',
        'The silence is "road-shaped." It will end when the road ends. Neither will end.',
      ],
      [
        'MUTE FORMAL — Post-musical silence. Duration: ongoing. Intensity: substantial.',
        'The parties present (occupants 1 and 2) are maintaining the silence by mutual unstated agreement.',
        'This constitutes a contract. The contract has no exit clause.',
        'The song that ended was: [REDACTED — too specific — could identify parties]',
        '[TRANSLATION SUSPENDED — FILING FORMAL COMPLAINT — SEE COMPLAINT DOCUMENT]',
      ],
      [
        'We moved the speakers last month. They face the window now.',
        'Before, the sound went into the room. Now it goes outward. The silence goes outward too.',
        'This car silence — we know this silence. It is "the gap where the old speakers were."',
        'The music has left. The space it occupied is still warm.',
        '[FOOTNOTE: Booth 2 — "road-shaped" — in our language this is "the shape of where the couch left marks on the carpet"]',
        'Someone will speak. When they do, they will be speaking from the space the music left.',
        'We recommend: do not speak. Or speak. Both are translations of the same silence.',
      ],
    ],
    phone_goodbye: [
      [
        'The goodbye has been said. [clears throat] The line remains open.',
        'In Tertian, this silence is [hh-pause-hm-hm-hh] — "we are still here by choice."',
        'The choice is not to hang up. The choice is made every 0.3 seconds.',
        '[FOOTNOTE 1: Booth 2 will overcomplicate this. It is simple. It is the simplest thing.]',
        'Simple: [long pause] — I withdraw the word "simple."',
        'The silence is a room you are both standing in. The room has no walls.',
        'One of you will leave first. You both know who. Neither of you is wrong.',
      ],
      [
        'OBLIQUE: "Presque-raccroché" — almost hung up. The distance between almost and actually is infinite.',
        '"Halvnær-stemme" — almost-near-voice. The voice is becoming memory in real time.',
        'This silence has forty-three sub-categories in Oblique. We are using all of them.',
        '"Beinahe-abschied" — almost-goodbye. You said goodbye but it was a "presque-adieu."',
        '[FOOTNOTE B: Booth 1, it is NOT simple. Nothing here is simple. I have forty-three words for why.]',
        '"Tangential-presence" — present but becoming absent. The phone is warm in your hand.',
        '"Presque-toujours" — almost-always. You almost always say what you mean by now.',
      ],
      [
        'MUTE FORMAL — Open telephone line. Parties: 2. Duration of silence: accumulating.',
        'Both parties are present. Both parties are aware of being present.',
        'The goodbye was: sincere. The continuation of the call after the goodbye is: also sincere.',
        'These two sincerities are in conflict. We have filed a motion.',
        '[TRANSLATION SUSPENDED — FILING FORMAL COMPLAINT — SEE COMPLAINT DOCUMENT]',
      ],
      [
        'We moved the phone charger to the bedroom last week.',
        'Before, we charged in the kitchen. Now the phone is with us when we sleep.',
        'This silence is "bedroom-charger silence." It is a decision that was made without being made.',
        '[FOOTNOTE: Booth 3 — your "motion" — we would simply rearrange the furniture. It usually helps.]',
        'Neither person hangs up because hanging up is a kind of moving furniture.',
        'You have to decide where the conversation goes after. And you do not know yet.',
        'When you hang up, decide where the couch goes first. Then you will know what to say.',
      ],
    ],
    apology: [
      [
        'The apology has been delivered. [clears throat] It was— [long pause] — it landed.',
        'In Tertian, "almost enough" is [hm-hh-hm] followed by [extended pause] followed by [hm].',
        'The final [hm] is the most important word in the language. It means: "I heard you. And."',
        'The "and" is the silence. The silence is everything that comes after "I heard you."',
        '[FOOTNOTE 1: Booth 2 — I know you have a word for this. Use it. Please use the right one.]',
        'The person who apologized is watching the silence land. They are calibrating.',
        'The person receiving the apology is doing something harder. We do not have a word for it.',
      ],
      [
        'OBLIQUE: This silence is "presque-pardonné" — almost-forgiven, which is its own country with its own flag.',
        '"Halvdone" — half-done. The apology was half of a two-part process. This is the second part.',
        'In response to Booth 1: the word is "beinahe-genug" — almost-enough, which we have mapped extensively.',
        '"Presque-guéri" — almost-healed. The wound is still visible but it is being looked at differently.',
        '[FOOTNOTE B: The "and" Booth 1 mentioned — we have seventeen words for that "and." I will list them.]',
        '"Tangential-repair" — not fixing but standing near the fixing.',
        '"Halvnær-tilgivelse" — almost-near-forgiveness. You can see it from here.',
      ],
      [
        'MUTE FORMAL — Post-apology silence. This office takes no position on the adequacy of the apology.',
        'The silence is being used to: process (confirmed), decide (unconfirmed), feel (off the record).',
        'Both parties are present in the silence. One party is waiting. One party is—',
        'Note: we do not translate waiting. Waiting translates itself.',
        '[TRANSLATION SUSPENDED — FILING FORMAL COMPLAINT — SEE COMPLAINT DOCUMENT]',
      ],
      [
        'We moved the dining table away from the wall. It is in the center now.',
        'Before, one side of the table had a wall. Now both sides have space.',
        'This silence is "center-table silence." Both people are equidistant from everything.',
        'The apology moved the table. The silence is sitting in the new center.',
        '[FOOTNOTE: Booth 2 — "presque-pardonné" — we call this "the rug you put down after you move the table"]',
        'The rug covers the marks. The marks are still there. The rug is also real.',
        'Both things are true. The silence knows this. The silence is the rug.',
      ],
    ],
    window_stare: [
      [
        'The person is at the window. [clears throat] They have been at the window for— [clears throat again]',
        'In Tertian, the duration of window-looking is a grammatical tense. Past the third minute: it changes.',
        'Before three minutes: observing. After three minutes: [hm-hh-long pause-hm] — being observed by.',
        'The window is now looking back. The silence is the window\'s reply.',
        '[FOOTNOTE 1: Booth 4, I know you will say something about curtains. Please say it. It matters.]',
        'What is being seen: technically, the outside. Actually: something that is not outside.',
        'The silence is the distance between the glass and whatever they are actually looking at.',
      ],
      [
        'OBLIQUE: "Presque-dehors" — almost-outside. Looking out is not the same as being out.',
        '"Halvnær-tanke" — almost-near-thought. The thought is almost here. It has been almost here for minutes.',
        '"Beinahe-verstanden" — almost understood. Something is almost understood at the window.',
        'Windows are liminal in Oblique. We have sixty words for glass. None of them mean "transparent."',
        '[FOOTNOTE B: Booth 1 — "being observed by" — we call this "presque-vu" — almost-seen, from the outside in]',
        '"Tangential-outside" — outside is present but not accessible. This is fine. This is preferred.',
        '"Presque-prêt" — almost ready. They are almost ready to turn around.',
      ],
      [
        'MUTE FORMAL — Subject is stationed at window. Duration: extended. Classification: contemplative.',
        'The silence is self-directed. This is unusual. Most silences are addressed to another party.',
        'A silence addressed to oneself requires a different translation methodology.',
        'We do not have this methodology. We are developing it in real time. Results: pending.',
        '[TRANSLATION SUSPENDED — FILING FORMAL COMPLAINT — SEE COMPLAINT DOCUMENT]',
      ],
      [
        'We moved the armchair to face the window.',
        'Before, it faced the television. Now it faces the outside.',
        'This person is sitting in "the chair that faces the window now." We know this chair.',
        'The silence is the view. The view has been there the whole time. The chair was pointed wrong.',
        '[FOOTNOTE: Booth 2 — "almost ready to turn around" — in our language: "the chair remembers the television"]',
        'The chair remembers. The person in the chair is learning to forget.',
        'When they turn around, the room will look different. The furniture will be in new places.',
        'It always is, after a window like this.',
      ],
    ],
  };

  const clarificationTexts = [
    'My grandmother kept her winter coat in a box under the bed. When she died, the box still smelled like cedar. I don\'t know why I\'m telling you this.',
    'The number of times I have started to learn a new language and stopped at the word for "love" is, at this point, diagnostic.',
    'There is a particular kind of Tuesday that feels like it has been Tuesday for several weeks.',
    'I once drove past my exit on the highway for forty-five minutes before I noticed. The radio was off.',
    'Every time I water a plant I think: this is the most optimistic thing I do.',
    'The last voicemail I saved is from someone who no longer knows my number. I have not listened to it in three years. I will not delete it.',
    'When I rearrange my bookshelf I always end up sitting on the floor reading for two hours. The shelf stays disordered. Something else gets organized.',
    'There is a word in Portuguese — "saudade" — but this isn\'t about that. This is about the word that comes after saudade, which doesn\'t exist yet.',
    'I keep the lights lower than necessary. I tell people it\'s aesthetic. I don\'t examine this.',
    'The last time I was truly surprised by something beautiful, I didn\'t tell anyone. I\'m not sure why.',
    'Some mornings I make coffee and then forget to drink it. By the time I remember, it\'s the right temperature. This feels like a metaphor. I refuse to pursue it.',
    'I have a drawer I don\'t open. Everyone does. You know which one.',
  ];

  const complaintDocument = (silenceLabel) => `FORMAL COMPLAINT — MUTE FORMAL TRANSLATION BUREAU
Filed by: Senior Interpreter, Booth 3 (Mute Formal Division)
Re: The Silence Known As "${silenceLabel}"
Case No.: MF-${Math.floor(Math.random() * 9000) + 1000}-ONGOING

TO: The Office of Silence Regulation and Oversight
FROM: This Booth, Specifically
DATE: Now (approximate)

GROUNDS FOR COMPLAINT:

1. STRUCTURAL AMBIGUITY
   The subject silence (hereafter "the Silence") is structurally 
   ambiguous in ways that exceed our mandate. The Silence contains 
   at least three (3) possible meanings, all of which are correct, 
   none of which are compatible.

2. POSSIBLE INTENTIONALITY
   ~~We believe the Silence is accidental.~~
   We believe the Silence may be deliberate.
   We believe the Silence does not care what we believe.
   (This last point is the complaint.)

3. INTER-BOOTH COORDINATION FAILURE
   Booth 1 (Tertian) is translating feelings as grammar.
   Booth 2 (Oblique) is translating grammar as feelings.
   Booth 4 (Furniture) is translating everything as furniture.
   ~~This office has been translating correctly.~~
   This office has been translating sincerely. [margin note: different]

4. THE SILENCE ITSELF
   The Silence has not cooperated with this process.
   The Silence was not informed of this process.
   The Silence would likely object to this process.
   We find this objectionable.
   We also find this: correct.

REQUESTED RESOLUTION:
   That the Silence be formally acknowledged as untranslatable.
   That we continue translating it anyway.
   That this contradiction be noted in the record.
   
   [It has been noted.]

Signed,
The Interpreter Who Stopped
Booth 3, Mute Formal
[STILL ON AIR]`;

  const resetAndStart = useCallback((silence) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (onAirRef.current) clearInterval(onAirRef.current);
    if (clarifyTimeoutRef.current) clearTimeout(clarifyTimeoutRef.current);

    tickRef.current = 0;
    setTickCount(0);
    setBoothTranscripts(['', '', '', '']);
    setBoothStates(['idle', 'idle', 'idle', 'idle']);
    setClarifyingBooth(null);
    setShowSummary(false);
    setOnAir(true);

    if (!silence) return;

    setIsTranslating(true);

    onAirRef.current = setInterval(() => {
      setOnAir(prev => !prev);
    }, 800);

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;
      setTickCount(tick);

      const frags = transcriptFragments[silence];
      if (!frags) return;

      setBoothTranscripts(prev => {
        const next = [...prev];
        for (let b = 0; b < 4; b++) {
          const pool = frags[b];
          if (!pool) continue;
          if (b === 2 && tick >= 7) continue;
          const idx = tick - 1;
          if (idx < pool.length) {
            next[b] = prev[b] + (prev[b] ? '\n\n' : '') + pool[idx];
          }
        }
        return next;
      });

      setBoothStates(prev => {
        const next = [...prev];
        if (tick >= 2) { next[0] = 'translating'; next[1] = 'translating'; next[3] = 'translating'; }
        if (tick >= 1) { next[2] = 'translating'; }
        if (tick >= 4) { next[0] = 'arguing'; }
        if (tick >= 5) { next[1] = 'arguing'; }
        if (tick >= 7) { next[2] = 'complaining'; }
        if (tick >= 6) { next[3] = 'arguing'; }
        return next;
      });

      if (tick >= 22) {
        setShowSummary(true);
        setIsTranslating(false);
        clearInterval(intervalRef.current);
        clearInterval(onAirRef.current);
        setOnAir(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedSilence) {
      resetAndStart(selectedSilence);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (onAirRef.current) clearInterval(onAirRef.current);
      if (clarifyTimeoutRef.current) clearTimeout(clarifyTimeoutRef.current);
    };
  }, [selectedSilence]);

  useEffect(() => {
    boothRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    });
  }, [boothTranscripts]);

  const handleBoothClick = (idx) => {
    if (clarifyingBooth !== null) return;
    const text = clarificationTexts[Math.floor(Math.random() * clarificationTexts.length)];
    setClarificationText(text);
    setClarifyingBooth(idx);
    clarifyTimeoutRef.current = setTimeout(() => {
      setClarifyingBooth(null);
    }, 4000);
  };

  const boothLanguages = ['TERTIAN', 'OBLIQUE', 'MUTE FORMAL', 'FURNITURE'];
  const boothSubtitles = [
    'throat-clearings & unfinished sentences',
    '40 words for "almost"',
    'official bureaucratic silence',
    'post-relocation vernacular',
  ];
  const boothColors = ['#a8c4a2', '#b8c4a0', '#a0b8c4', '#c4b8a0'];
  const boothHeaderColors = ['#2a4a2a', '#3a4a2a', '#2a3a4a', '#4a3a2a'];

  const selectedLabel = silences.find(s => s.value === selectedSilence)?.label || '';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1410',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#c8d4c0',
      padding: '0',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.1; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 8px #c84040; } 50% { box-shadow: 0 0 20px #ff4040; } }
        @keyframes summaryAppear { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes typewriter { from { width: 0; } to { width: 100%; } }
        @keyframes complaintFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #1a2a1a 0%, #141e14 100%)',
        borderBottom: '1px solid #2a3a2a',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a6a8a, #2a4a6a)',
            border: '2px solid #6a8aaa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}>🌐</div>
          <div>
            <div style={{ fontSize: '11px', color: '#6a8a6a', letterSpacing: '3px', textTransform: 'uppercase' }}>
              United Bureau of Silence
            </div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#d0dcc8', letterSpacing: '1px' }}>
              Simultaneous Translation Division
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isTranslating && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1a0a0a',
              border: '1px solid #4a1a1a',
              borderRadius: '4px',
              padding: '6px 12px',
              animation: 'pulse 1.6s infinite',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: onAir ? '#ff3030' : '#4a0a0a',
                transition: 'background 0.1s',
              }} />
              <span style={{ fontSize: '11px', color: '#ff6060', letterSpacing: '2px', fontWeight: 'bold' }}>
                ON AIR
              </span>
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#4a5a4a', letterSpacing: '1px' }}>
            SESSION: {tickCount.toString().padStart(3, '0')}
          </div>
        </div>
      </div>

      {/* Silence Selector */}
      <div style={{
        background: '#141a14',
        borderBottom: '1px solid #2a3a2a',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '11px', color: '#6a8a6a', letterSpacing: '2px', textTransform: 'uppercase', minWidth: '140px' }}>
          Select Silence:
        </div>
        <select
          value={selectedSilence}
          onChange={e => setSelectedSilence(e.target.value)}
          style={{
            background: '#0f1a0f',
            color: '#a8c4a0',
            border: '1px solid #3a5a3a',
            borderRadius: '4px',
            padding: '10px 14px',
            fontSize: '13px',
            fontFamily: '"Courier New", Courier, monospace',
            cursor: 'pointer',
            minWidth: '380px',
            outline: 'none',
            letterSpacing: '0.3px',
          }}
        >
          <option value="">— choose a silence to translate —</option>
          {silences.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {selectedSilence && (
          <div style={{
            fontSize: '11px',
            color: '#4a6a4a',
            fontStyle: 'italic',
            letterSpacing: '0.5px',
          }}>
            The silence was not consulted about this process.
          </div>
        )}
      </div>

      {/* No silence selected */}
      {!selectedSilence && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          gap: '16px',
        }}>
          <div style={{ fontSize: '48px', opacity: 0.3 }}>🎧</div>
          <div style={{ color: '#3a4a3a', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Awaiting silence selection
          </div>
          <div style={{ color: '#2a3a2a', fontSize: '12px', maxWidth: '400px', textAlign: 'center', lineHeight: '1.8' }}>
            Four interpreter booths are standing by. They are doing what interpreters do while standing by: 
            thinking about other silences, and whether they were translated correctly.
          </div>
        </div>
      )}

      {/* Booths */}
      {selectedSilence && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: '#0a0f0a',
          margin: '0',
          padding: '1px',
          minHeight: '500px',
        }}>
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              onClick={() => handleBoothClick(idx)}
              style={{
                background: '#121812',
                border: `1px solid ${boothHeaderColors[idx]}`,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                animation: 'flicker 8s infinite',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Booth Header */}
              <div style={{
                background: `linear-gradient(90deg, ${boothHeaderColors[idx]}dd, ${boothHeaderColors[idx]}88)`,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${boothColors[idx]}44`,
              }}>
                <div>
                  <div style={{
                    fontSize: '10px',
                    color: '#6a7a6a',
                    letterSpacing: '2px',
                    marginBottom: '2px',
                  }}>
                    BOOTH {idx + 1} — LANGUAGE:
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: boothColors[idx],
                    letterSpacing: '2px',
                  }}>
                    {boothLanguages[idx]}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    color: '#4a5a4a',
                    letterSpacing: '1px',
                    fontStyle: 'italic',
                    marginTop: '2px',
                  }}>
                    {boothSubtitles[idx]}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{
                    fontSize: '9px',
                    padding: '3px 7px',
                    borderRadius: '2px',
                    letterSpacing: '1px',
                    background: boothStates[idx] === 'idle' ? '#1a1a1a' :
                      boothStates[idx] === 'translating' ? '#1a2a1a' :
                      boothStates[idx] === 'arguing' ? '#2a1a0a' :
                      boothStates[idx] === 'complaining' ? '#2a0a0a' : '#1a1a1a',
                    color: boothStates[idx] === 'idle' ? '#3a3a3a' :
                      boothStates[idx] === 'translating' ? '#6a9a6a' :
                      boothStates[idx] === 'arguing' ? '#9a7a4a' :
                      boothStates[idx] === 'complaining' ? '#9a4a4a' : '#3a3a3a',
                    border: `1px solid ${boothStates[idx] === 'idle' ? '#2a2a2a' :
                      boothStates[idx] === 'translating' ? '#3a5a3a' :
                      boothStates[idx] === 'arguing' ? '#5a3a1a' :
                      boothStates[idx] === 'complaining' ? '#5a1a1a' : '#2a2a2a'}`,
                  }}>
                    {boothStates[idx].toUpperCase()}
                  </div>
                  <div style={{ fontSize: '10px' }}>🎧</div>
                </div>
              </div>

              {/* Clarification Overlay */}
              {clarifyingBooth === idx && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(10, 15, 10, 0.96)',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  animation: 'slideIn 0.3s ease',
                  borderTop: `2px solid ${boothColors[idx]}`,
                }}>
                  <div style={{ fontSize: '10px', color: '#6a7a6a', letterSpacing: '2px', marginBottom: '16px' }}>
                    CLARIFICATION REQUESTED — BOOTH {idx + 1}
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: boothHeaderColors[idx],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    marginBottom: '16px',
                    border: `1px solid ${boothColors[idx]}`,
                  }}>👁</div>
                  <div style={{
                    fontSize: '13px',
                    color: '#c0d0b8',
                    lineHeight: '1.8',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    maxWidth: '320px',
                  }}>
                    "{clarificationText}"
                  </div>
                  <div style={{ fontSize: '9px', color: '#3a4a3a', marginTop: '16px', letterSpacing: '1px' }}>
                    [INTERPRETER LOOKING DIRECTLY AT CAMERA]
                  </div>
                </div>
              )}

              {/* Transcript Area */}
              <div
                ref={boothRefs[idx]}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  overflowY: 'auto',
                  fontSize: '12px',
                  lineHeight: '1.9',
                  color: boothStates[idx] === 'complaining' ? '#b0a090' : boothColors[idx],
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '320px',
                  background: 'transparent',
                  letterSpacing: '0.3px',
                }}
              >
                {boothStates[idx] === 'complaining' ? (
                  <div style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '11px',
                    lineHeight: '1.7',
                    color: '#b0a090',
                    animation: 'complaintFade 0.5s ease',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {complaintDocument(selectedLabel)}
                  </div>
                ) : (
                  <>
                    {boothTranscripts[idx] ? (
                      boothTranscripts[idx].split('\n\n').map((fragment, fi) => (
                        <div
                          key={fi}
                          style={{
                            marginBottom: '12px',
                            animation: 'slideIn 0.4s ease',
                            paddingLeft: fragment.startsWith('[FOOTNOTE') || fragment.startsWith('Cross-reference') ? '12px' : '0',
                            borderLeft: fragment.startsWith('[FOOTNOTE') || fragment.startsWith('Cross-reference') ? `2px solid ${boothColors[idx]}44` : 'none',
                            color: fragment.startsWith('[FOOTNOTE') ? `${boothColors[idx]}aa` : boothColors[idx],
                            fontSize: fragment.startsWith('[FOOTNOTE') ? '11px' : '12px',
                            fontStyle: fragment.startsWith('[FOOTNOTE') ? 'italic' : 'normal',
                          }}
                        >
                          {fragment}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: '#2a3a2a', fontStyle: 'italic', fontSize: '11px' }}>
                        {boothStates[idx] === 'idle' ? 'Interpreter standing by...' : 'Initializing translation...'}
                      </div>
                    )}
                    {isTranslating && boothStates[idx] !== 'idle' && clarifyingBooth !== idx && (
                      <div style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '14px',
                        background: boothColors[idx],
                        animation: 'blink 1s infinite',
                        marginLeft: '2px',
                        verticalAlign: 'text-bottom',
                      }} />
                    )}
                  </>
                )}
              </div>

              {/* Click hint */}
              <div style={{
                padding: '6px 16px',
                fontSize: '9px',
                color: '#2a3a2a',
                borderTop: '1px solid #1a2a1a',
                letterSpacing: '1px',
                textAlign: 'right',
              }}>
                CLICK TO REQUEST CLARIFICATION
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div style={{
          margin: '24px auto',
          maxWidth: '700px',
          background: 'linear-gradient(180deg, #141e14, #0f1810)',
          border: '1px solid #3a5a3a',
          borderRadius: '4px',
          padding: '32px 40px',
          animation: 'summaryAppear 0.8s ease',
          boxShadow: '0 0 40px rgba(60, 100, 60, 0.15)',
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#4a7a4a',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            United Bureau of Silence — Final Translation Summary
          </div>
          <div style={{
            borderTop: '1px solid #2a4a2a',
            borderBottom: '1px solid #2a4a2a',
            padding: '20px 0',
            margin: '0 0 20px 0',
          }}>
            <div style={{ fontSize: '11px', color: '#5a7a5a', marginBottom: '8px' }}>SUBJECT SILENCE:</div>
            <div style={{ fontSize: '14px', color: '#a0c0a0', fontStyle: 'italic', marginBottom: '20px' }}>
              "{selectedLabel}"
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                ['MEANING', 'disputed'],
                ['DURATION', 'ongoing'],
                ['TRANSLATORS', '4 (consensus: 0)'],
                ['COMPLAINTS FILED', '1 (Booth 3, Mute Formal)'],
                ['FOOTNOTE ARGUMENTS', `${Math.max(0, tickCount - 4)}`],
                ['CLARIFICATIONS GIVEN', 'irrelevant (all)'],
              ].map(([label, val]) => (
                <div key={label} style={{
                  background: '#0f180f',
                  border: '1px solid #1a2a1a',
                  padding: '10px 14px',
                  borderRadius: '2px',
                }}>
                  <div style={{ fontSize: '9px', color: '#4a6a4a', letterSpacing: '2px', marginBottom: '4px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8ab08a' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#0a1a0a',
            border: '1px solid #2a4a2a',
            borderRadius: '2px',
          }}>
            <div style={{ fontSize: '10px', color: '#4a6a4a', letterSpacing: '2px', marginBottom: '12px' }}>
              RESOLUTION 001 — ADOPTED BY CONSENSUS OF THOSE PRESENT
            </div>
            <div style={{
              fontSize: '15px',
              color: '#b0d0a8',
              lineHeight: '2',
              fontStyle: 'italic',
              letterSpacing: '0.5px',
            }}>
              "Meaning: disputed.<br />
              Duration: ongoing.<br />
              Recommended response: another silence, slightly warmer."
            </div>
            <div style={{
              marginTop: '16px',
              fontSize: '10px',
              color: '#3a4a3a',
              letterSpacing: '1px',
            }}>
              The silence was not present for this vote. This was noted. It did not change anything.
            </div>
          </div>
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '10px',
            color: '#2a3a2a',
            letterSpacing: '1px',
          }}>
            Session closed. Booths: standing by. The silence: still going.
          </div>
          <div style={{
            marginTop: '16px',
            textAlign: 'center',
          }}>
            <button
              onClick={() => setSelectedSilence('')}
              style={{
                background: 'transparent',
                border: '1px solid #3a5a3a',
                color: '#6a9a6a',
                padding: '8px 20px',
                fontSize: '11px',
                fontFamily: '"Courier New", Courier, monospace',
                letterSpacing: '2px',
                cursor: 'pointer',
                borderRadius: '2px',
                textTransform: 'uppercase',
              }}
            >
              Translate Another Silence
            </button>
          </div>
        </div>
      )}
    </div>
  );
}