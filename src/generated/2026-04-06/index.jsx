import { useState, useEffect, useRef } from 'react';

const TAB_TITLES = [
  "How Long Can Shrimp Live On Land?",
  "Flights to Somewhere",
  "Is It Too Late To",
  "Why Do I Keep Doing This",
  "Signs You Might Be",
  "How to Start Over at Any Age",
  "The Best Time to Plant a Tree",
  "What Does It Mean When You Dream About",
  "How to Finally Finish Something",
  "Apartments in Cities I've Never Been",
  "Is This Normal",
  "How Long Does It Take to Learn Piano",
  "Symptoms of Loneliness vs. Being Alone",
  "Can You Train Yourself to Wake Up Earlier",
  "Famous People Who Started Late",
  "How to Stop Refreshing Things",
  "What Happens to Light Underwater",
  "The Difference Between Tired and Sad",
  "Recipes That Only Need What You Have",
  "How to Write a Letter You'll Never Send",
  "Do Fish Feel Pain",
  "Best Countries to Disappear In",
  "How to Forgive Yourself",
  "What the Ocean Looks Like at Night",
  "Can Octopuses Dream",
  "How to Be Someone Who Finishes Books",
  "Is Nostalgia a Form of Grief",
  "The Last Person to Know a Dead Language",
  "Why Does Music Make You Feel Things",
  "How to Stop Wasting Time",
  "What Happens If You Just Don't",
  "Signs a Friendship Is Ending",
  "How Far Away Is the Nearest Star",
  "Things That Are Older Than You Think",
  "How to Disappear Completely",
  "What Do Clouds Weigh",
  "The Loneliest Places on Earth",
  "How to Grow Something from Nothing",
  "What Were You Before You Were Afraid",
  "Can You Miss Someone You Never Met",
  "How to Tell If You're Happy",
  "What Time Is It Somewhere Else",
  "The Quietest Place in the World",
  "How to Want Less",
  "What Remains After",
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const HOURS = ['12:03am', '1:47am', '2:14am', '3:08am', '11:52pm', '10:31pm', '9:44pm', '2:33pm', '4:17am', '11:19am', '3:55pm', '7:22am'];
const CAUSES = [
  'a browser restart that came without warning',
  'the quiet accumulation of other tabs',
  'a moment of decisive clarity that never arrived',
  'the weight of everything else open at the time',
  'a power outage that took no prisoners',
  'the simple passage of Tuesday into Wednesday',
  'an update that required a restart',
  'the slow erosion of original intent',
  'distraction, which is to say: everything',
  'the particular exhaustion of 3am',
  'a device that finally gave out',
  'the moment the wifi came back on and somehow it no longer mattered',
];
const SURVIVED_BY = [
  '47 of its siblings',
  '23 other open tabs and a pinned Twitter',
  '11 tabs it barely knew',
  '67 cousins in other windows',
  '3 windows and a PDF that refused to close',
  '82 tabs, none of whom were coping well',
  '14 siblings and one YouTube video, paused',
  '38 others, all equally uncertain of their purpose',
];
const EULOGY_CLOSINGS = [
  'It deserved to be read.',
  'The answer it sought was never delivered.',
  'It waited, as all things wait, for a moment that did not come.',
  'It is survived by the question it contained.',
  'It knew what it was for. That was more than most.',
  'No memorial service is planned. The browser has moved on.',
  'The search continues, elsewhere.',
  'It opened in hope. It closed in the background.',
  'We close it now for the last time, with full ceremony.',
  'It asked something real. The internet had an answer. These two facts never met.',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTab(id, personalityShift = 0) {
  const title = randomFrom(TAB_TITLES);
  const day = randomFrom(DAYS);
  const month = randomFrom(MONTHS);
  const date = randomInt(1, 28);
  const hour = randomFrom(HOURS);
  const abandonDay = randomFrom(DAYS);
  const siblingText = randomFrom(SURVIVED_BY);
  const cause = randomFrom(CAUSES);
  const closing = randomFrom(EULOGY_CLOSINGS);
  const tabNum = randomInt(1000, 99999);
  const daysOpen = randomInt(1, 340);

  const subject = personalityShift > 0.7 ? 'you' : personalityShift > 0.4 ? 'they say you once' : 'the tab';
  const possessive = personalityShift > 0.7 ? 'your' : personalityShift > 0.4 ? 'your' : 'its';

  const eulogy = `Tab #${tabNum} — "${title}" — opened ${day} at ${hour} on ${month} ${date}, lived for ${daysOpen} days in ${possessive} original window, and was lost to ${cause}. ${subject.charAt(0).toUpperCase() + subject.slice(1)} ${personalityShift > 0.4 ? 'never' : 'never'} got the answer ${possessive === 'your' ? 'you' : 'it'} came for. Survived by ${siblingText}. ${closing}`;

  return {
    id,
    title,
    openedDay: day,
    openedTime: hour,
    openedDate: `${month} ${date}`,
    abandonedDay: abandonDay,
    tabNum,
    eulogy,
    respects: 0,
    wilting: false,
    visible: false,
  };
}

export default function Page() {
  const [tabs, setTabs] = useState([]);
  const [worldwideDeaths, setWorldwideDeaths] = useState(847293847 + randomInt(0, 999999));
  const [hoveredId, setHoveredId] = useState(null);
  const [paidRespects, setPaidRespects] = useState(new Set());
  const [wiltingTabs, setWiltingTabs] = useState(new Set());
  const startTimeRef = useRef(Date.now());
  const wiltTimersRef = useRef({});

  useEffect(() => {
    const count = randomInt(6, 8);
    const generated = Array.from({ length: count }, (_, i) => generateTab(i));
    setTabs(generated);

    generated.forEach((_, i) => {
      setTimeout(() => {
        setTabs(prev => prev.map((t, idx) => idx === i ? { ...t, visible: true } : t));
      }, 200 + i * 280);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorldwideDeaths(prev => prev + randomInt(1, 7));
    }, 47);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const shift = Math.min(elapsed / 300, 1.0);
      setTabs(prev => {
        if (prev.length === 0) return prev;
        const idx = randomInt(0, prev.length - 1);
        const updated = [...prev];
        const old = updated[idx];
        updated[idx] = { ...generateTab(old.id, shift), visible: true, respects: old.respects };
        return updated;
      });
    }, 90000);
    return () => clearInterval(interval);
  }, []);

  const handlePayRespects = (id) => {
    if (paidRespects.has(id)) return;

    setPaidRespects(prev => new Set([...prev, id]));
    setWiltingTabs(prev => new Set([...prev, id]));
    setTabs(prev => prev.map(t => t.id === id ? { ...t, respects: t.respects + 1 } : t));

    wiltTimersRef.current[id] = setTimeout(() => {
      setWiltingTabs(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  const formatDeaths = (n) => n.toLocaleString();

  const elapsed = (Date.now() - startTimeRef.current) / 1000;
  const personalityFactor = Math.min(elapsed / 300, 1);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f0e8',
      color: '#1a1a1a',
      fontFamily: 'Georgia, "Times New Roman", serif',
      padding: '0',
    }}>
      <style>{`
        @keyframes wiltDrop {
          0% { transform: rotate(0deg) translateY(0px); opacity: 1; }
          30% { transform: rotate(-20deg) translateY(2px); opacity: 0.9; }
          60% { transform: rotate(-45deg) translateY(8px); opacity: 0.6; }
          100% { transform: rotate(-70deg) translateY(16px); opacity: 0.3; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tickUp {
          0% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        @keyframes ribbonSlide {
          from { opacity: 0; transform: scaleX(0); }
          to { opacity: 1; transform: scaleX(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: '3px double #1a1a1a',
        padding: '32px 40px 24px',
        textAlign: 'center',
        backgroundColor: '#f5f0e8',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: '#555',
          marginBottom: '6px',
        }}>
          In Memoriam
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'normal',
          letterSpacing: '2px',
          textTransform: 'small-caps',
          margin: '0 0 6px 0',
          lineHeight: 1.2,
        }}>
          Obituaries for Abandoned Tabs
        </h1>
        <div style={{
          fontSize: '11px',
          color: '#666',
          fontStyle: 'italic',
          marginBottom: '16px',
          letterSpacing: '0.5px',
        }}>
          Each window held a small intention. The intention has since become a mineral.
        </div>
        <div style={{
          display: 'inline-block',
          border: '1px solid #1a1a1a',
          padding: '8px 20px',
          fontSize: '12px',
          letterSpacing: '1px',
          backgroundColor: '#ede8dc',
        }}>
          <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '3px', display: 'block', marginBottom: '2px' }}>
            Tabs closed worldwide since you opened this page
          </span>
          <span style={{
            fontSize: '22px',
            fontFamily: 'Georgia, serif',
            letterSpacing: '2px',
            animation: 'tickUp 0.1s ease',
            display: 'inline-block',
          }}>
            {formatDeaths(worldwideDeaths)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ textAlign: 'center', padding: '20px 0 8px', color: '#888', fontSize: '16px', letterSpacing: '8px' }}>
        ✦ ✦ ✦
      </div>

      {/* Obituary Cards */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        {tabs.map((tab, i) => {
          const isHovered = hoveredId === tab.id;
          const isWilting = wiltingTabs.has(tab.id);
          const hasRespected = paidRespects.has(tab.id);

          return (
            <div
              key={tab.id}
              onMouseEnter={() => setHoveredId(tab.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: tab.visible ? 1 : 0,
                transform: tab.visible ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                border: `1px solid ${isHovered ? '#555' : '#bbb'}`,
                borderLeft: `4px solid ${isHovered ? '#1a1a1a' : '#888'}`,
                backgroundColor: isHovered ? '#f0ead8' : '#faf7f2',
                marginBottom: '32px',
                padding: '28px 32px',
                position: 'relative',
                boxShadow: isHovered ? '0 4px 20px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                cursor: 'default',
              }}
            >
              {/* Mourning ribbon on hover */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: '#1a1a1a',
                  animation: 'ribbonSlide 0.3s ease forwards',
                  transformOrigin: 'left center',
                }} />
              )}

              {/* Tab number badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                fontSize: '9px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#aaa',
              }}>
                #{tab.tabNum}
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'normal',
                fontStyle: 'italic',
                margin: '0 0 8px 0',
                lineHeight: 1.3,
                paddingRight: '60px',
              }}>
                "{tab.title}"
              </h2>

              {/* Dates */}
              <div style={{
                fontSize: '11px',
                color: '#777',
                letterSpacing: '1px',
                marginBottom: '16px',
                textTransform: 'uppercase',
                borderBottom: '1px solid #ddd',
                paddingBottom: '12px',
              }}>
                Opened {tab.openedDay}, {tab.openedDate} at {tab.openedTime}
                <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
                Abandoned on a {tab.abandonedDay}
              </div>

              {/* Eulogy */}
              <p style={{
                fontSize: '14px',
                lineHeight: '1.9',
                color: '#2a2a2a',
                margin: '0 0 20px 0',
                letterSpacing: '0.2px',
              }}>
                {tab.eulogy}
              </p>

              {/* Footer: respects */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #e0d8cc',
                paddingTop: '14px',
              }}>
                <button
                  onClick={() => handlePayRespects(tab.id)}
                  disabled={hasRespected}
                  style={{
                    background: 'none',
                    border: `1px solid ${hasRespected ? '#bbb' : '#888'}`,
                    padding: '6px 14px',
                    cursor: hasRespected ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    color: hasRespected ? '#aaa' : '#444',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    backgroundColor: hasRespected ? '#f0ead8' : 'transparent',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '18px',
                      transformOrigin: 'bottom center',
                      animation: isWilting ? 'wiltDrop 2s ease forwards' : 'none',
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {hasRespected ? '🥀' : '🌸'}
                  </span>
                  {hasRespected ? 'Respects Paid' : 'Pay Respects'}
                </button>

                <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>
                  {tab.respects === 0
                    ? 'No one has mourned this tab.'
                    : tab.respects === 1
                    ? '1 person has paid respects.'
                    : `${tab.respects} have paid respects.`}
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer note */}
        {tabs.length > 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 0 20px',
            borderTop: '1px solid #ccc',
            color: '#888',
            fontSize: '12px',
            fontStyle: 'italic',
            lineHeight: 1.8,
          }}>
            <div style={{ fontSize: '20px', marginBottom: '12px', letterSpacing: '6px' }}>✦</div>
            {personalityFactor > 0.5
              ? 'The longer you stay here, the more you recognize yourself in these titles.'
              : 'These tabs are gone. They are not coming back. Neither is the version of you that opened them.'}
            <br />
            <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', display: 'block', marginTop: '12px' }}>
              Refresh for a new congregation of the lost.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}