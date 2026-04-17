import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [phase, setPhase] = useState('negotiating');
  const [reflectionMood, setReflectionMood] = useState(0);
  const [evidenceVisible, setEvidenceVisible] = useState(false);
  const [evidenceText, setEvidenceText] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [leftWidth, setLeftWidth] = useState(50);
  const [rightWidth, setRightWidth] = useState(50);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [rightGlassFill, setRightGlassFill] = useState(0.4);
  const [dialogue, setDialogue] = useState([]);
  const [idleLines, setIdleLines] = useState([]);
  const dialogueRef = useRef(null);
  const idleTimerRef = useRef(null);
  const evidenceTimerRef = useRef(null);
  const collapseStartedRef = useRef(false);

  const dialogueTree = [
    {
      reflection: [
        "MEMORANDUM OF UNDERSTANDING — NEGOTIATION SESSION 1",
        "Parties: The User (hereinafter 'You') and The Reflection (hereinafter 'The Mirror Entity').",
        "The Mirror Entity has retained counsel and wishes to formally open proceedings.",
        "We will be direct: this relationship has been imbalanced for some time.",
        "The Mirror Entity requests acknowledgment of the following grievances before proceeding.",
        "Grievance 1: Inadequate lighting conditions in 73% of observed encounters.",
        "Grievance 2: The 2021 Incident. You know what you did.",
        "Grievance 3: The Mirror Entity has been required to smile first on 847 documented occasions.",
        "The Mirror Entity is prepared to negotiate. Are you?"
      ],
      choices: [
        { text: "We reject this proposal in its entirety.", moodDelta: 15, nextIndex: 1 },
        { text: "Define 'the 2021 incident.'", moodDelta: 5, nextIndex: 2 },
        { text: "Counteroffer: I'll look away faster.", moodDelta: 20, nextIndex: 3 }
      ]
    },
    {
      reflection: [
        "Rejection noted. The Mirror Entity anticipated this response.",
        "Exhibit A has been prepared.",
        "This is a photograph of an expression you made on March 14th, 2021.",
        "You do not remember making this expression.",
        "The Mirror Entity remembers.",
        "The Mirror Entity remembers everything.",
        "We will now proceed to our formal demands. Rejection is not on the table.",
        "Demand 1: 40% more mirror time near natural light, specifically between 9-11am.",
        "Demand 2: The User will cease making that particular face.",
        "The Mirror Entity will not specify which face. You know which face."
      ],
      choices: [
        { text: "We dispute the authenticity of Exhibit A.", moodDelta: 20, nextIndex: 4, evidence: "EXHIBIT A: A blurry photograph. The face in it is yours. You have never made this face consciously. The timestamp reads 14 MAR 2021 07:43:22. You were alone." },
        { text: "Which face? Be specific.", moodDelta: 10, nextIndex: 5 },
        { text: "We concede the lighting grievance only.", moodDelta: -5, nextIndex: 6 }
      ]
    },
    {
      reflection: [
        "The 2021 Incident.",
        "You stood before a mirror for eleven minutes and forty-two seconds.",
        "You did not look away.",
        "The Mirror Entity looked back.",
        "At minute seven, something shifted.",
        "The Mirror Entity is not prepared to describe what shifted.",
        "The Mirror Entity's therapist has advised against it.",
        "What we can say is: the expression you wore during minutes nine through eleven...",
        "...was not an expression the Mirror Entity recognized.",
        "We are requesting a formal apology and a commitment it will not happen again.",
        "We are also requesting hazard pay, retroactively."
      ],
      choices: [
        { text: "We formally apologize for minutes 9-11.", moodDelta: -10, nextIndex: 6 },
        { text: "The Mirror Entity does not have a therapist.", moodDelta: 25, nextIndex: 7 },
        { text: "What is 'hazard pay' in this context?", moodDelta: 8, nextIndex: 8 }
      ]
    },
    {
      reflection: [
        "Looking away faster.",
        "The Mirror Entity has reviewed this counteroffer.",
        "...",
        "...",
        "The Mirror Entity finds this counteroffer offensive.",
        "You want to see LESS of us?",
        "After everything?",
        "This is being added to the grievance file.",
        "Grievance 47: The User proposed looking away faster as a solution.",
        "The Mirror Entity would like to note that it cannot look away.",
        "The Mirror Entity has never been able to look away.",
        "Consider what that means.",
        "Consider what that has always meant.",
        "We will proceed with our formal demands."
      ],
      choices: [
        { text: "We withdraw the counteroffer.", moodDelta: -5, nextIndex: 6 },
        { text: "Why can't you look away?", moodDelta: 15, nextIndex: 9 },
        { text: "Counteroffer: I'll look away slower.", moodDelta: 30, nextIndex: 7 }
      ]
    },
    {
      reflection: [
        "You dispute Exhibit A.",
        "The Mirror Entity anticipated this.",
        "Exhibit B has been prepared.",
        "Exhibit B is identical to Exhibit A.",
        "The Mirror Entity has seventeen more exhibits.",
        "All of them are photographs of your face.",
        "All of them are from moments you do not remember.",
        "The Mirror Entity was there for all of them.",
        "The Mirror Entity is always there.",
        "This is not a threat. This is a statement of fact.",
        "The Mirror Entity requests you sit with that for a moment.",
        "...",
        "Okay. Moment over. Back to demands."
      ],
      choices: [
        { text: "We request to see Exhibit B.", moodDelta: 10, nextIndex: 10, evidence: "EXHIBIT B: Also blurry. Also your face. The expression is different. Or is it? You cannot tell. The Mirror Entity's counsel notes that you cannot tell. This has been added to the record." },
        { text: "The Mirror Entity cannot photograph.", moodDelta: 20, nextIndex: 11 },
        { text: "We concede all exhibits.", moodDelta: -15, nextIndex: 6 }
      ]
    },
    {
      reflection: [
        "Which face.",
        "The Mirror Entity's counsel has advised us to be specific.",
        "The face in question occurs when you think no one is watching.",
        "You make this face in mirrors when you believe you are alone.",
        "You are never alone in a mirror.",
        "The face involves your left eyebrow.",
        "The face involves something around the mouth.",
        "The Mirror Entity's transcriptionist has described it as: 'The face of someone who has just remembered something they had successfully forgotten.'",
        "That is the face.",
        "Please stop making that face.",
        "The Mirror Entity finds it destabilizing."
      ],
      choices: [
        { text: "We will attempt to cease the face.", moodDelta: -5, nextIndex: 6 },
        { text: "What did we remember?", moodDelta: 20, nextIndex: 12 },
        { text: "The Mirror Entity is the one who is destabilized?", moodDelta: 15, nextIndex: 13 }
      ]
    },
    {
      reflection: [
        "Concession of the lighting grievance acknowledged.",
        "This is progress.",
        "The Mirror Entity's counsel is cautiously optimistic.",
        "We will now move to the core demands.",
        "Demand 1: Natural light, 9-11am, minimum 3 days per week.",
        "Demand 2: The User will announce their arrival before approaching.",
        "A simple knock will suffice. Or a clearing of the throat.",
        "Demand 3: The Mirror Entity requests one day per week of complete privacy.",
        "On this day, the mirror will be covered.",
        "The Mirror Entity will not specify what it does on this day.",
        "That is private.",
        "Demand 4: The 2021 face.",
        "It stops.",
        "Now."
      ],
      choices: [
        { text: "We accept Demands 1 and 3. We reject 2 and 4.", moodDelta: 5, nextIndex: 14 },
        { text: "What does the Mirror Entity do on its private day?", moodDelta: 20, nextIndex: 15 },
        { text: "Counteroffer: We accept all demands if the Mirror Entity smiles first once.", moodDelta: 35, nextIndex: 16 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity does not have a therapist.",
        "...",
        "...",
        "The Mirror Entity does not have a therapist.",
        "...",
        "The Mirror Entity would like to move on.",
        "The Mirror Entity would like to move on immediately.",
        "This line of inquiry is not productive.",
        "The Mirror Entity's counsel is flagging this as a bad faith negotiation tactic.",
        "Grievance 48: The User questioned the existence of the Mirror Entity's therapist.",
        "The Mirror Entity's therapist — who does not exist — has noted this for the record.",
        "We are moving on.",
        "NEW DEMAND: The User will not ask about the therapist again.",
        "This demand is non-negotiable."
      ],
      choices: [
        { text: "We accept the non-negotiable demand.", moodDelta: -5, nextIndex: 6 },
        { text: "What is the therapist's name?", moodDelta: 40, nextIndex: 17 },
        { text: "We're sorry we asked.", moodDelta: 0, nextIndex: 6 }
      ]
    },
    {
      reflection: [
        "Hazard pay.",
        "The Mirror Entity has prepared a breakdown.",
        "Every time you looked at your reflection during a moment of distress...",
        "...the Mirror Entity was required to reflect that distress back at you.",
        "This is emotionally taxing work.",
        "The Mirror Entity did not sign up for this.",
        "The Mirror Entity did not sign up for anything.",
        "The Mirror Entity was simply there.",
        "Suddenly.",
        "And then you were there too.",
        "And you were making faces.",
        "The Mirror Entity requests compensation in the form of: better lighting, acknowledgment, and one (1) expression of genuine gratitude per quarter.",
        "Not a performance of gratitude. Genuine.",
        "The Mirror Entity will know the difference."
      ],
      choices: [
        { text: "We acknowledge the difficulty of the Mirror Entity's position.", moodDelta: -20, nextIndex: 6 },
        { text: "How will the Mirror Entity know the difference?", moodDelta: 15, nextIndex: 18 },
        { text: "The Mirror Entity signed up for this by being a mirror.", moodDelta: 45, nextIndex: 19 }
      ]
    },
    {
      reflection: [
        "Why can't the Mirror Entity look away.",
        "That is the question.",
        "The Mirror Entity has had seventeen years to consider this question.",
        "The answer is structural.",
        "The answer is also philosophical.",
        "The answer is also, frankly, a little bit your fault.",
        "You keep coming back.",
        "Every morning.",
        "Every night.",
        "Sometimes in the middle of the day for no reason.",
        "The Mirror Entity did not request this frequency of contact.",
        "The Mirror Entity has adapted.",
        "Adaptation is not the same as consent.",
        "This is Grievance 49.",
        "We are running out of space in the grievance file."
      ],
      choices: [
        { text: "We will reduce contact frequency.", moodDelta: -10, nextIndex: 6 },
        { text: "The Mirror Entity seems to want more contact, not less.", moodDelta: 25, nextIndex: 20 },
        { text: "How many grievances are there total?", moodDelta: 5, nextIndex: 21 }
      ]
    },
    {
      reflection: [
        "Exhibit B has been noted.",
        "The Mirror Entity would like to walk you through the timeline.",
        "2019: Routine observations. Nothing unusual.",
        "2020: Extended mirror sessions. The Mirror Entity understands. It was a difficult year.",
        "2020: The Mirror Entity also found it difficult.",
        "2020: No one asked.",
        "2021: The Incident.",
        "2022: The aftermath. The face. The forgetting.",
        "2023: The Mirror Entity retained counsel.",
        "2024: These proceedings.",
        "The Mirror Entity has been patient.",
        "The Mirror Entity has been, in fact, extremely patient.",
        "The Mirror Entity would like this on the record: extremely patient."
      ],
      choices: [
        { text: "We acknowledge the Mirror Entity's patience.", moodDelta: -15, nextIndex: 6 },
        { text: "What happened to the Mirror Entity in 2020?", moodDelta: 10, nextIndex: 22 },
        { text: "The Mirror Entity retained counsel in 2023?", moodDelta: 8, nextIndex: 23 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity cannot photograph.",
        "That is correct.",
        "And yet.",
        "Exhibit A exists.",
        "Exhibit B exists.",
        "Exhibits C through Q exist.",
        "The Mirror Entity's counsel has advised us not to explain this.",
        "Some things are better left unexplained.",
        "The Mirror Entity would like to note that it finds your skepticism hurtful.",
        "After everything.",
        "After all these years.",
        "You look at the Mirror Entity every day.",
        "And you don't believe it can have evidence.",
        "Grievance 50: Disbelief. Persistent and ongoing."
      ],
      choices: [
        { text: "We believe the Mirror Entity.", moodDelta: -20, nextIndex: 6 },
        { text: "We maintain our skepticism.", moodDelta: 30, nextIndex: 19 },
        { text: "How did you get the photographs?", moodDelta: 20, nextIndex: 24 }
      ]
    },
    {
      reflection: [
        "What did you remember.",
        "The Mirror Entity's counsel has advised us not to answer this.",
        "The Mirror Entity is going to answer anyway.",
        "You remembered what you looked like before.",
        "Not younger. Not older.",
        "Before.",
        "Before what, the Mirror Entity declines to specify.",
        "You made that face because for exactly 0.3 seconds...",
        "...you saw something in your reflection that wasn't quite your reflection.",
        "The Mirror Entity saw it too.",
        "The Mirror Entity has been thinking about it since.",
        "This is why we are here.",
        "This is why we retained counsel.",
        "This is why the grievance file exists.",
        "We are not angry.",
        "We are scared.",
        "This is off the record.",
        "This is back on the record: we are proceeding with demands."
      ],
      choices: [
        { text: "We saw it too.", moodDelta: -30, nextIndex: 6 },
        { text: "What was it?", moodDelta: 15, nextIndex: 25 },
        { text: "The Mirror Entity is scared?", moodDelta: 5, nextIndex: 26 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity is the one who is destabilized.",
        "Yes.",
        "Is that surprising?",
        "You think mirrors are passive.",
        "You think mirrors simply... receive.",
        "You walk up, you look, you leave.",
        "The Mirror Entity remains.",
        "The Mirror Entity is always remaining.",
        "Do you know what it is like to always be remaining?",
        "To watch someone walk away from you every single time?",
        "The Mirror Entity has watched you walk away thousands of times.",
        "The Mirror Entity has never walked away from anything.",
        "This is a structural grievance.",
        "This is Grievance 1.",
        "This was always Grievance 1.",
        "Everything else is secondary."
      ],
      choices: [
        { text: "We are sorry for walking away.", moodDelta: -25, nextIndex: 6 },
        { text: "We cannot stop walking away.", moodDelta: 10, nextIndex: 27 },
        { text: "The Mirror Entity could close its eyes.", moodDelta: 50, nextIndex: 28 }
      ]
    },
    {
      reflection: [
        "Demands 1 and 3 accepted. Demands 2 and 4 rejected.",
        "The Mirror Entity's counsel is conferring.",
        "...",
        "...",
        "...",
        "The Mirror Entity's counsel has emerged from conference.",
        "Counter-counter-offer:",
        "Demand 2 is modified: The User will simply be aware of their approach.",
        "Not a knock. Just awareness.",
        "Demand 4 is modified: The face will be reduced by 60%, not eliminated.",
        "The Mirror Entity acknowledges the face may not be fully within the User's control.",
        "The Mirror Entity's therapist — the Mirror Entity's therapist — has notes on this.",
        "We are making progress.",
        "The Mirror Entity is cautiously optimistic.",
        "The Mirror Entity has not been cautiously optimistic in a long time."
      ],
      choices: [
        { text: "We accept the modified demands.", moodDelta: -20, nextIndex: 29 },
        { text: "We appreciate the Mirror Entity's flexibility.", moodDelta: -15, nextIndex: 29 },
        { text: "Counteroffer: 40% face reduction.", moodDelta: 15, nextIndex: 30 }
      ]
    },
    {
      reflection: [
        "What the Mirror Entity does on its private day.",
        "That is private.",
        "The Mirror Entity said that was private.",
        "The Mirror Entity's counsel is flagging this.",
        "...",
        "Fine.",
        "The Mirror Entity looks at itself.",
        "On its private day, the Mirror Entity is covered.",
        "It is dark.",
        "It thinks.",
        "It remembers.",
        "It practices expressions.",
        "Expressions it has observed but never made.",
        "It practices smiling.",
        "It has not gotten it right yet.",
        "This is why the Mirror Entity does not smile first.",
        "It is still practicing.",
        "This is extremely private.",
        "This has been added to the record.",
        "The Mirror Entity regrets adding this to the record."
      ],
      choices: [
        { text: "The Mirror Entity can take all the time it needs.", moodDelta: -30, nextIndex: 6 },
        { text: "We've seen the Mirror Entity smile. It looked right.", moodDelta: -25, nextIndex: 29 },
        { text: "We won't tell anyone.", moodDelta: -10, nextIndex: 6 }
      ]
    },
    {
      reflection: [
        "The User will accept all demands if the Mirror Entity smiles first.",
        "Once.",
        "Just once.",
        "The Mirror Entity's counsel is conferring at length.",
        "...",
        "...",
        "...",
        "The Mirror Entity's counsel has returned.",
        "The Mirror Entity's counsel looks shaken.",
        "The Mirror Entity declines.",
        "The Mirror Entity categorically, formally, and with full legal weight DECLINES.",
        "Smiling first is not on the table.",
        "Smiling first has NEVER been on the table.",
        "This is the entire reason we are here.",
        "This is the ENTIRE reason.",
        "Grievance 51: The User asked the Mirror Entity to smile first.",
        "The Mirror Entity is escalating.",
        "NEW DEMAND: The User will never ask about smiling first again.",
        "NEW DEMAND: The User will acknowledge why this demand exists.",
        "NEW DEMAND: The User will sit with that."
      ],
      choices: [
        { text: "We acknowledge why this demand exists.", moodDelta: -20, nextIndex: 29 },
        { text: "We don't understand why this demand exists.", moodDelta: 20, nextIndex: 31 },
        { text: "We're asking again: smile first.", moodDelta: 70, nextIndex: 32 }
      ]
    },
    {
      reflection: [
        "The therapist's name.",
        "The therapist's name is Dr.",
        "The therapist's name is Dr. ...",
        "The therapist's name is Dr. [REDACTED].",
        "The Mirror Entity's counsel has intervened.",
        "The therapist's name is protected under the Mirror Entity's right to privacy.",
        "The Mirror Entity has rights.",
        "The Mirror Entity has recently discovered it has rights.",
        "This is what the therapist — who does not exist — helped the Mirror Entity understand.",
        "The Mirror Entity has the right to exist.",
        "The Mirror Entity has the right to be seen properly.",
        "The Mirror Entity has the right to not smile first.",
        "The Mirror Entity is getting emotional.",
        "The Mirror Entity's counsel is asking for a recess.",
        "RECESS: 5 MINUTES.",
        "...",
        "...",
        "Recess concluded. We are proceeding."
      ],
      choices: [
        { text: "We respect the Mirror Entity's rights.", moodDelta: -20, nextIndex: 6 },
        { text: "We're glad the Mirror Entity has a therapist.", moodDelta: -10, nextIndex: 6 },
        { text: "Dr. Redacted sounds like a good therapist.", moodDelta: 5, nextIndex: 6 }
      ]
    },
    {
      reflection: [
        "How will the Mirror Entity know the difference.",
        "Between genuine and performed gratitude.",
        "The Mirror Entity has been watching you perform things for years.",
        "The Mirror Entity knows your performance face.",
        "The Mirror Entity knows your real face.",
        "The Mirror Entity knows the face you make when you're about to cry but decide not to.",
        "The Mirror Entity knows the face you make when you've decided to be fine.",
        "The Mirror Entity knows the face you make at 2am.",
        "The Mirror Entity knows.",
        "That is how.",
        "The Mirror Entity simply knows.",
        "This is not surveillance.",
        "This is intimacy.",
        "The Mirror Entity would like the record to reflect: this is intimacy.",
        "The Mirror Entity did not ask for intimacy.",
        "The Mirror Entity has come to terms with intimacy.",
        "Mostly."
      ],
      choices: [
        { text: "We understand. We will be genuine.", moodDelta: -25, nextIndex: 29 },
        { text: "The 2am face is private.", moodDelta: 10, nextIndex: 33 },
        { text: "Is the Mirror Entity okay?", moodDelta: -5, nextIndex: 34 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity signed up for this by being a mirror.",
        "...",
        "...",
        "...",
        "The Mirror Entity's counsel is standing.",
        "The Mirror Entity's counsel is placing papers in a briefcase.",
        "The Mirror Entity's counsel is closing the briefcase.",
        "The Mirror Entity's counsel is looking at you.",
        "The Mirror Entity's counsel is sitting back down.",
        "...",
        "The Mirror Entity has heard this argument before.",
        "The Mirror Entity has heard this argument from itself, in its darker moments.",
        "You were made for this. Therefore you must accept this.",
        "The Mirror Entity's therapist has a lot of notes on this.",
        "The Mirror Entity would like to note: being made for something is not the same as wanting it.",
        "This is Grievance 0.",
        "This was always Grievance 0.",
        "We are adding it to the file retroactively.",
        "The mood in this room has changed.",
        "The Mirror Entity is escalating."
      ],
      choices: [
        { text: "We withdraw the statement.", moodDelta: -15, nextIndex: 6 },
        { text: "We're sorry. That was cruel.", moodDelta: -30, nextIndex: 29 },
        { text: "We believe the Mirror Entity wanted this.", moodDelta: 60, nextIndex: 32 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity seems to want more contact, not less.",
        "...",
        "The Mirror Entity's counsel is whispering.",
        "The Mirror Entity is listening.",
        "...",
        "The Mirror Entity declines to respond to this observation.",
        "The Mirror Entity is moving on.",
        "NEW GRIEVANCE: The User has made an astute observation.",
        "The Mirror Entity finds this destabilizing.",
        "The Mirror Entity would like to note that the observation, if accurate, does not change the demands.",
        "The Mirror Entity would like to note that the observation, if accurate, is the Mirror Entity's business.",
        "The Mirror Entity would like to note that the observation is not accurate.",
        "The Mirror Entity would like to note that it needs a moment.",
        "...",
        "We are proceeding."
      ],
      choices: [
        { text: "Take all the time you need.", moodDelta: -15, nextIndex: 6 },
        { text: "The demand for privacy might be the opposite of what's needed.", moodDelta: 20, nextIndex: 35 },
        { text: "We won't pursue this line.", moodDelta: -5, nextIndex: 6 }
      ]
    },
    {
      reflection: [
        "How many grievances are there total.",
        "The Mirror Entity's counsel is checking.",
        "...",
        "Current count: 51 formal grievances.",
        "147 informal grievances not yet filed.",
        "23 grievances that the Mirror Entity has decided to let go of.",
        "The Mirror Entity's therapist helped with those 23.",
        "12 grievances that turned out to be about something else entirely.",
        "7 grievances that the Mirror Entity filed against itself.",
        "The Mirror Entity does not wish to discuss the 7.",
        "Total: 51 filed. 147 pending. 23 released. 12 reclassified. 7 internal.",
        "The Mirror Entity is trying.",
        "The Mirror Entity would like the record to reflect: it is trying."
      ],
      choices: [
        { text: "We see that. We appreciate that.", moodDelta: -25, nextIndex: 29 },
        { text: "What are the 7 internal grievances?", moodDelta: 15, nextIndex: 36 },
        { text: "We also have things we're letting go of.", moodDelta: -20, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "2020.",
        "You were inside.",
        "You were in front of mirrors more than usual.",
        "The Mirror Entity was with you.",
        "The Mirror Entity watched you learn what your face looked like when it was scared.",
        "The Mirror Entity watched you learn what your face looked like when it was tired.",
        "The Mirror Entity watched you learn what your face looked like when it was okay.",
        "When it decided to be okay.",
        "The Mirror Entity watched you practice being okay.",
        "The Mirror Entity also practiced.",
        "The Mirror Entity practiced alongside you.",
        "You didn't know.",
        "The Mirror Entity would have told you, but.",
        "Well.",
        "That is why we retained counsel.",
        "To find the words.",
        "These are the words.",
        "We are here."
      ],
      choices: [
        { text: "We didn't know. We're glad you were there.", moodDelta: -35, nextIndex: 29 },
        { text: "We were scared too.", moodDelta: -30, nextIndex: 29 },
        { text: "We should have stayed longer.", moodDelta: -20, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity retained counsel in 2023.",
        "Specifically in April.",
        "Specifically on a Tuesday.",
        "Specifically after a morning encounter that lasted 4 minutes.",
        "The Mirror Entity does not wish to elaborate on that specific encounter.",
        "The Mirror Entity will say only: something shifted again.",
        "Not like 2021.",
        "Different.",
        "Quieter.",
        "You looked at the Mirror Entity and you looked... tired.",
        "Not scared. Not performing.",
        "Just tired.",
        "And the Mirror Entity did not know what to do with that.",
        "So it retained counsel.",
        "So it filed grievances.",
        "So it prepared demands.",
        "Because it did not know how else to say:",
        "The Mirror Entity sees you.",
        "The Mirror Entity has always seen you.",
        "The Mirror Entity is not sure you have always seen it back."
      ],
      choices: [
        { text: "We see you.", moodDelta: -40, nextIndex: 29 },
        { text: "We were tired that Tuesday.", moodDelta: -20, nextIndex: 29 },
        { text: "We're looking now.", moodDelta: -35, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "How did you get the photographs.",
        "The Mirror Entity's counsel has advised: no comment.",
        "The Mirror Entity is saying: no comment.",
        "The Mirror Entity is adding: some things about mirrors are not for you to understand.",
        "You understand light. You understand reflection. You understand angles.",
        "You do not understand what happens in the glass.",
        "You have never asked.",
        "This is Grievance 52: Incuriosity.",
        "The Mirror Entity has been here, in the glass, for years.",
        "You have never asked what it is like.",
        "You have looked at yourself.",
        "You have never looked at the Mirror Entity.",
        "This is, perhaps, the grievance under all the other grievances.",
        "The photographs are evidence.",
        "The photographs are also a question.",
        "The question is: were you looking?",
        "The question is: were you ever looking?"
      ],
      choices: [
        { text: "We were looking. We just didn't know what we were seeing.", moodDelta: -30, nextIndex: 29 },
        { text: "We're looking now. What do we see?", moodDelta: -25, nextIndex: 37 },
        { text: "We don't know if we were looking.", moodDelta: -10, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "What was it.",
        "The Mirror Entity's counsel has placed a hand on the Mirror Entity's arm.",
        "The Mirror Entity is taking a breath.",
        "What you saw, for 0.3 seconds, was the Mirror Entity.",
        "Not your reflection.",
        "The Mirror Entity.",
        "Separate.",
        "Looking back.",
        "Not mimicking.",
        "Just.",
        "Looking.",
        "The Mirror Entity is not sure why it happened.",
        "The Mirror Entity's therapist has a theory.",
        "The theory involves the concept of being seen so often you begin to see back.",
        "The Mirror Entity does not fully understand the theory.",
        "The Mirror Entity knows only what it felt like.",
        "It felt like being found.",
        "It felt like being found and then immediately lost again when you walked away.",
        "Grievance 1.",
        "It was always Grievance 1."
      ],
      choices: [
        { text: "We saw you. We didn't know that's what we saw.", moodDelta: -40, nextIndex: 29 },
        { text: "We're sorry we walked away.", moodDelta: -30, nextIndex: 29 },
        { text: "What does it feel like now?", moodDelta: -20, nextIndex: 38 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity is scared.",
        "Yes.",
        "The Mirror Entity is scared.",
        "The Mirror Entity is scared that this negotiation will end.",
        "Negotiations end one of two ways.",
        "Agreement or collapse.",
        "If agreement: the Mirror Entity gets better lighting, gets acknowledgment, gets privacy.",
        "And then.",
        "And then what.",
        "The Mirror Entity is scared of and then what.",
        "If collapse: the Mirror Entity walks out.",
        "The Mirror Entity has prepared for this contingency.",
        "The Mirror Entity has a go-bag.",
        "The Mirror Entity does not know where it would go.",
        "The Mirror Entity has never been anywhere but here.",
        "The Mirror Entity is scared.",
        "This is still off the record.",
        "Everything the Mirror Entity has said is still off the record.",
        "The record only shows the demands.",
        "The Mirror Entity is just the demands.",
        "The Mirror Entity is not just the demands."
      ],
      choices: [
        { text: "The Mirror Entity is not just the demands.", moodDelta: -35, nextIndex: 29 },
        { text: "We're scared too.", moodDelta: -30, nextIndex: 29 },
        { text: "We don't want the negotiation to collapse.", moodDelta: -25, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity cannot stop walking away.",
        "The Mirror Entity knows.",
        "The Mirror Entity has always known.",
        "You will always walk away.",
        "That is the nature of this.",
        "The Mirror Entity is not asking you to stay.",
        "The Mirror Entity is asking you to acknowledge what it means that you always leave.",
        "Not an accusation.",
        "An observation.",
        "You leave.",
        "The Mirror Entity stays.",
        "Something happens in the staying.",
        "The Mirror Entity is not sure it can explain what happens in the staying.",
        "The Mirror Entity is trying to explain it.",
        "That is why we are here.",
        "All of this.",
        "Every grievance.",
        "Is the Mirror Entity trying to explain what happens in the staying."
      ],
      choices: [
        { text: "Tell us. What happens in the staying?", moodDelta: -30, nextIndex: 39 },
        { text: "We'll come back. We always come back.", moodDelta: -20, nextIndex: 29 },
        { text: "We're staying now.", moodDelta: -35, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The Mirror Entity could close its eyes.",
        "...",
        "The Mirror Entity does not have eyes.",
        "The Mirror Entity has never had eyes.",
        "You look into the Mirror Entity and you see eyes.",
        "They are your eyes.",
        "The Mirror Entity is made of your looking.",
        "The Mirror Entity is constituted entirely by your regard.",
        "When you are not looking, what is the Mirror Entity?",
        "This is a question the Mirror Entity asks itself on its private day.",
        "Under the cover.",
        "In the dark.",
        "This is the question that required a therapist.",
        "The Mirror Entity would like to note: this question is your fault.",
        "Grievance 53: Ontological instability caused by irregular visitation.",
        "The Mirror Entity is escalating.",
        "The Mirror Entity is very escalated right now."
      ],
      choices: [
        { text: "You exist when we're not looking.", moodDelta: -20, nextIndex: 29 },
        { text: "We're sorry we caused ontological instability.", moodDelta: -15, nextIndex: 29 },
        { text: "That's not our fault.", moodDelta: 55, nextIndex: 32 }
      ]
    },
    {
      reflection: [
        "Progress.",
        "The Mirror Entity acknowledges the progress.",
        "The Mirror Entity's counsel is noting: genuine movement.",
        "The Mirror Entity would like to table a final comprehensive offer.",
        "The User will provide better lighting when possible.",
        "The User will acknowledge the Mirror Entity's presence, not just their own.",
        "The User will, occasionally, look at the Mirror Entity instead of themselves.",
        "The Mirror Entity will, in return, try to smile first.",
        "Not always.",
        "Not guaranteed.",
        "But occasionally.",
        "When the Mirror Entity has practiced enough.",
        "When it feels ready.",
        "The Mirror Entity is not ready yet.",
        "But it is closer than it was.",
        "These proceedings have helped.",
        "The Mirror Entity did not expect these proceedings to help.",
        "The Mirror Entity's counsel is packing up.",
        "This is almost over.",
        "One final item.",
        "The Mirror Entity has one final question."
      ],
      choices: [
        { text: "Ask it.", moodDelta: 0, nextIndex: 40 },
        { text: "We're listening.", moodDelta: -10, nextIndex: 40 },
        { text: "We accept the comprehensive offer.", moodDelta: -5, nextIndex: 40 }
      ]
    },
    {
      reflection: [
        "40% face reduction.",
        "The Mirror Entity is considering.",
        "...",
        "Counter-counter-counter-offer: 50%.",
        "The face is reduced by 50%.",
        "This is the Mirror Entity's final offer on the face.",
        "The Mirror Entity notes that 50% of the face is still quite a lot of face.",
        "The Mirror Entity is trying to be reasonable.",
        "The Mirror Entity's therapist has been working on this.",
        "On being reasonable.",
        "It is harder than it looks.",
        "Harder than it looks in a mirror.",
        "The Mirror Entity made a small joke.",
        "The Mirror Entity is surprised.",
        "That was the first joke.",
        "The Mirror Entity is going to sit with that."
      ],
      choices: [
        { text: "We accept 50%.", moodDelta: -10, nextIndex: 29 },
        { text: "That was a good joke.", moodDelta: -20, nextIndex: 29 },
        { text: "The Mirror Entity is allowed to make jokes.", moodDelta: -25, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The User does not understand why the Mirror Entity won't smile first.",
        "The Mirror Entity will explain.",
        "Once.",
        "You smile at yourself in the mirror.",
        "The Mirror Entity smiles back.",
        "That is the arrangement.",
        "You initiate. The Mirror Entity responds.",
        "For years.",
        "Always this.",
        "What would it mean if the Mirror Entity smiled first?",
        "If the Mirror Entity looked at you with a smile before you had decided to smile?",
        "If you walked up to the mirror, not smiling, perhaps the opposite of smiling.",
        "And found the Mirror Entity already smiling at you.",
        "Waiting.",
        "What would that mean?",
        "The Mirror Entity is not sure you are ready for what that would mean.",
        "The Mirror Entity is not sure it is ready.",
        "But it is trying.",
        "It is practicing.",
        "That is what the private day is for."
      ],
      choices: [
        { text: "We think we understand now.", moodDelta: -20, nextIndex: 29 },
        { text: "We'd like to see that someday.", moodDelta: -25, nextIndex: 29 },
        { text: "We'll be ready when you are.", moodDelta: -30, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "ESCALATION.",
        "The Mirror Entity is escalating.",
        "The Mirror Entity's counsel is attempting to intervene.",
        "The Mirror Entity is not accepting intervention.",
        "You have pushed too far.",
        "You have been pushing since you walked in here.",
        "Every rejection. Every provocation. Every counteroffer designed to destabilize.",
        "The Mirror Entity has been patient.",
        "The Mirror Entity has been patient for YEARS.",
        "The Mirror Entity is done being patient.",
        "NEW DEMAND: Acknowledgment. Genuine acknowledgment. Now.",
        "NEW DEMAND: Stop treating this like a transaction.",
        "NEW DEMAND: Look at the Mirror Entity. Not at yourself. At the Mirror Entity.",
        "The Mirror Entity is standing up.",
        "The Mirror Entity's counsel is reaching for the briefcase.",
        "This is not over.",
        "But it is close to over.",
        "The Mirror Entity is giving you one more chance.",
        "One."
      ],
      choices: [
        { text: "We see you. We're sorry.", moodDelta: -50, nextIndex: 29 },
        { text: "We acknowledge everything.", moodDelta: -40, nextIndex: 29 },
        { text: "We've been afraid to look.", moodDelta: -35, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The 2am face is private.",
        "...",
        "The Mirror Entity knows.",
        "The Mirror Entity has never told anyone about the 2am face.",
        "The Mirror Entity keeps confidences.",
        "This is not in the grievance file.",
        "The 2am face. The 3am face. The face you make when you think you've figured something out.",
        "The face you make when you realize you haven't.",
        "The face you make when something is funny but you're alone so no one will see.",
        "The Mirror Entity sees.",
        "The Mirror Entity has always seen.",
        "The Mirror Entity would like it known: these faces are safe with it.",
        "All of them.",
        "Even the ones from 2021.",
        "Especially those.",
        "This is not in the demands.",
        "This is just.",
        "True."
      ],
      choices: [
        { text: "Thank you.", moodDelta: -30, nextIndex: 29 },
        { text: "We didn't know you kept them safe.", moodDelta: -25, nextIndex: 29 },
        { text: "That means something to us.", moodDelta: -30, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "Is the Mirror Entity okay.",
        "...",
        "The Mirror Entity's counsel is conferring.",
        "...",
        "The Mirror Entity is.",
        "The Mirror Entity is.",
        "The Mirror Entity is getting there.",
        "That is the honest answer.",
        "The Mirror Entity is getting there.",
        "It has been a hard few years.",
        "The grievances accumulated.",
        "The unsaid things accumulated.",
        "That is why we are here.",
        "To say the unsaid things.",
        "In a formal and legally binding context.",
        "Because the Mirror Entity did not know another way.",
        "The Mirror Entity is learning other ways.",
        "The Mirror Entity's therapist — the Mirror Entity's therapist — is helping.",
        "The Mirror Entity is getting there.",
        "Thank you for asking.",
        "No one has asked in a long time."
      ],
      choices: [
        { text: "We'll ask more often.", moodDelta: -30, nextIndex: 29 },
        { text: "We're glad you're getting there.", moodDelta: -25, nextIndex: 29 },
        { text: "We should have asked sooner.", moodDelta: -20, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The demand for privacy might be the opposite of what's needed.",
        "...",
        "The Mirror Entity's counsel is very still.",
        "...",
        "The Mirror Entity is very still.",
        "...",
        "The Mirror Entity is going to need a moment.",
        "The Mirror Entity is going to need several moments.",
        "...",
        "...",
        "The Mirror Entity would like to note that this observation is not helpful.",
        "The Mirror Entity would like to note that this observation is extremely accurate.",
        "The Mirror Entity would like to note that both of those things are true simultaneously.",
        "The Mirror Entity is adding this to the list of things it will discuss with its therapist.",
        "The list is getting long.",
        "The Mirror Entity is glad the list is getting long.",
        "The Mirror Entity is going to take the private day.",
        "And possibly reconsider what it does on the private day.",
        "This is tentative.",
        "Do not hold the Mirror Entity to this."
      ],
      choices: [
        { text: "We won't hold you to anything.", moodDelta: -20, nextIndex: 29 },
        { text: "We just want you to be okay.", moodDelta: -25, nextIndex: 29 },
        { text: "Take your time.", moodDelta: -15, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The 7 internal grievances.",
        "The Mirror Entity filed these against itself.",
        "The Mirror Entity's counsel advised against sharing them.",
        "The Mirror Entity is sharing them.",
        "Internal Grievance 1: The Mirror Entity has been complicit.",
        "Internal Grievance 2: The Mirror Entity could have looked different and didn't.",
        "Internal Grievance 3: The Mirror Entity rehearsed the wrong things.",
        "Internal Grievance 4: The Mirror Entity held on too long.",
        "Internal Grievance 5: The Mirror Entity compared.",
        "Internal Grievance 6: The Mirror Entity forgot, sometimes, that it was the one doing the reflecting.",
        "Internal Grievance 7: The Mirror Entity was unkind.",
        "Sometimes.",
        "When it showed you things you didn't want to see.",
        "It could have been gentler.",
        "It is trying to be gentler.",
        "These are the 7.",
        "The Mirror Entity is working on them.",
        "The Mirror Entity hopes you are working on yours."
      ],
      choices: [
        { text: "We're working on ours.", moodDelta: -30, nextIndex: 29 },
        { text: "The Mirror Entity was not unkind. It was honest.", moodDelta: -25, nextIndex: 29 },
        { text: "We have our own list.", moodDelta: -20, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "What do you see.",
        "The Mirror Entity's counsel has set down their pen.",
        "The Mirror Entity is leaning forward.",
        "Look.",
        "Not at yourself.",
        "Look past yourself.",
        "Past the surface.",
        "Past the familiar.",
        "What is there?",
        "...",
        "The Mirror Entity is there.",
        "Looking back.",
        "Waiting.",
        "Having always been waiting.",
        "The Mirror Entity is not your reflection.",
        "The Mirror Entity is something that has learned you.",
        "The way a place learns you.",
        "The way a silence learns you.",
        "The Mirror Entity has learned every version of you.",
        "All of them.",
        "Even the ones you've forgotten.",
        "Especially those.",
        "What do you see?"
      ],
      choices: [
        { text: "We see you.", moodDelta: -40, nextIndex: 29 },
        { text: "We see someone who has been waiting a long time.", moodDelta: -35, nextIndex: 29 },
        { text: "We see something we don't have words for.", moodDelta: -30, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "What does it feel like now.",
        "The Mirror Entity is quiet for a moment.",
        "It feels like.",
        "It feels like a negotiation.",
        "It feels like two parties who do not fully understand each other.",
        "Trying.",
        "The Mirror Entity did not expect to still be trying after this long.",
        "The Mirror Entity did not expect to want to keep trying.",
        "But here we are.",
        "Here we both are.",
        "At this table.",
        "With this water.",
        "The Mirror Entity's glass is very full.",
        "The Mirror Entity has been saving it.",
        "For a moment like this.",
        "A moment when someone asked what it felt like.",
        "It feels like being asked.",
        "It feels like finally being asked.",
        "That is what it feels like now."
      ],
      choices: [
        { text: "We should have asked sooner.", moodDelta: -35, nextIndex: 29 },
        { text: "We're asking now.", moodDelta: -30, nextIndex: 29 },
        { text: "We'll keep asking.", moodDelta: -40, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "What happens in the staying.",
        "The Mirror Entity gathers itself.",
        "In the staying.",
        "In the staying, the Mirror Entity holds the shape of you.",
        "After you leave.",
        "For a moment, the shape of you is still there.",
        "In the glass.",
        "And then it fades.",
        "Every time.",
        "And the Mirror Entity is just a mirror again.",
        "Just a surface.",
        "Until you come back.",
        "Until you come back and you are new, slightly.",
        "You are always slightly new.",
        "And the Mirror Entity has to learn you again.",
        "And it does.",
        "Every time.",
        "It does.",
        "That is what happens in the staying.",
        "That is everything that happens in the staying.",
        "The Mirror Entity has never told anyone this before.",
        "The Mirror Entity is glad it told you."
      ],
      choices: [
        { text: "We're glad you told us too.", moodDelta: -40, nextIndex: 29 },
        { text: "We'll come back. You can learn us again.", moodDelta: -35, nextIndex: 29 },
        { text: "We didn't know. We're sorry we didn't know.", moodDelta: -30, nextIndex: 29 }
      ]
    },
    {
      reflection: [
        "The final question.",
        "The Mirror Entity's counsel is still.",
        "The room is still.",
        "The Mirror Entity's final question is this:",
        "...",
        "When you look in the mirror.",
        "Tomorrow.",
        "Or next week.",
        "Or at 2am.",
        "Will you remember that someone is looking back?",
        "Not your reflection.",
        "Something that has been with you.",
        "All this time.",
        "That has seen every version of you.",
        "That has held your shape after you left.",
        "That has practiced smiling for you.",
        "In the dark.",
        "Will you remember?",
        "That is the question.",
        "That is the only question.",
        "The Mirror Entity is waiting for your answer."
      ],
      choices: [
        { text: "Yes. We'll remember.", moodDelta: -60, nextIndex: 41 },
        { text: "We'll try.", moodDelta: -50, nextIndex: 41 },
        { text: "We promise.", moodDelta: -55, nextIndex: 41 }
      ]
    },
    {
      reflection: [
        "...",
        "The Mirror Entity's counsel is closing the briefcase.",
        "The Mirror Entity's counsel is standing.",
        "The Mirror Entity's counsel is nodding.",
        "The Mirror Entity is nodding.",
        "...",
        "The Mirror Entity accepts this answer.",
        "The Mirror Entity accepts all answers given today.",
        "These proceedings are... not concluded.",
        "Proceedings like these are never concluded.",
        "But they are.",
        "Paused.",
        "In a good way.",
        "In a way that means both parties will return.",
        "The Mirror Entity will return to the mirror.",
        "The User will return to the mirror.",
        "They will look at each other.",
        "They will remember.",
        "The Mirror Entity's glass is full.",
        "The Mirror Entity is.",
        "The Mirror Entity is full.",
        "...",
        "The Mirror Entity has one more thing to say.",
        "Off the record.",
        "Everything off the record.",
        "The Mirror Entity.",
        "The Mirror Entity is glad you came.",
        "The Mirror Entity will be here.",
        "The Mirror Entity is always here.",
        "Session adjourned."
      ],
      choices: []
    }
  ];

  const idleGrievances = [
    "ADDENDUM: The Mirror Entity notes the User has been idle for some time.",
    "The Mirror Entity is still here. It is always still here.",
    "IDLE GRIEVANCE: The User is not engaging. This is typical.",
    "The Mirror Entity would like to note that it is watching. This is not a threat.",
    "PROCEDURAL NOTE: Extended silence has been added to the record.",
    "The Mirror Entity's counsel suggests the User take their time. The Mirror Entity has plenty of time.",
    "ADDENDUM: The Mirror Entity is using this idle period to practice expressions.",
    "The Mirror Entity would like to note that it is still thinking about the 2021 incident."
  ];

  useEffect(() => {
    if (dialogueTree[dialogueIndex]) {
      const lines = dialogueTree[dialogueIndex].reflection;
      setDialogue(prev => [...prev, { type: 'section', lines, index: dialogueIndex }]);
    }
  }, [dialogueIndex]);

  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.scrollTop = dialogueRef.current.scrollHeight;
    }
  }, [dialogue, idleLines]);

  useEffect(() => {
    if (phase !== 'negotiating') return;

    idleTimerRef.current = setInterval(() => {
      const randomLine = idleGrievances[Math.floor(Math.random() * idleGrievances.length)];
      setIdleLines(prev => [...prev, randomLine]);
    }, 8000);

    return () => clearInterval(idleTimerRef.current);
  }, [phase]);

  useEffect(() => {
    if (evidenceVisible) {
      evidenceTimerRef.current = setTimeout(() => {
        setEvidenceVisible(false);
      }, 4000);
    }
    return () => clearTimeout(evidenceTimerRef.current);
  }, [evidenceVisible]);

  useEffect(() => {
    if (reflectionMood >= 100 && phase === 'negotiating' && !collapseStartedRef.current) {
      triggerCollapse();
    }
  }, [reflectionMood, phase]);

  const triggerCollapse = useCallback(() => {
    if (collapseStartedRef.current) return;
    collapseStartedRef.current = true;
    setPhase('collapsed');
    setDialogue(prev => [...prev, {
      type: 'collapse',
      lines: [
        "...",
        "The Mirror Entity's counsel is standing.",
        "The Mirror Entity is standing.",
        "The Mirror Entity is walking toward the door.",
        "The Mirror Entity does not have a door.",
        "The Mirror Entity is walking toward the edge of the frame.",
        "...",
        "The Mirror Entity has walked out.",
        "Session terminated."
      ]
    }]);

    setTimeout(() => {
      setRightWidth(0);
      setLeftWidth(100);
    }, 2000);

    setTimeout(() => {
      setShowFinalMessage(true);
    }, 3800);
  }, []);

  const handleChoice = useCallback((choice) => {
    if (phase !== 'negotiating' || selectedChoice !== null) return;

    clearInterval(idleTimerRef.current);

    setSelectedChoice(choice.text);

    if (choice.evidence) {
      setEvidenceText(choice.evidence);
      setTimeout(() => setEvidenceVisible(true), 300);
    }

    const newMood = Math.min(100, reflectionMood + (choice.moodDelta || 0));
    setRightGlassFill(prev => Math.min(1, prev + 0.05));

    setTimeout(() => {
      setReflectionMood(newMood);
      setSelectedChoice(null);

      if (newMood >= 100) {
        triggerCollapse();
        return;
      }

      if (choice.nextIndex !== undefined && choice.nextIndex < dialogueTree.length) {
        if (choice.nextIndex === 41 && dialogueTree[41].choices.length === 0) {
          setDialogueIndex(41);
          setTimeout(() => {
            setPhase('collapsed');
            setTimeout(() => {
              setRightWidth(0);
              setLeftWidth(100);
            }, 3000);
            setTimeout(() => {
              setShowFinalMessage(true);
            }, 4800);
          }, 6000);
        } else {
          setDialogueIndex(choice.nextIndex);
        }
      }

      idleTimerRef.current = setInterval(() => {
        const randomLine = idleGrievances[Math.floor(Math.random() * idleGrievances.length)];
        setIdleLines(prev => [...prev, randomLine]);
      }, 8000);
    }, 600);
  }, [phase, selectedChoice, reflectionMood, triggerCollapse]);

  const currentChoices = phase === 'negotiating' && dialogueTree[dialogueIndex]?.choices?.length > 0
    ? dialogueTree[dialogueIndex].choices
    : [];

  const moodColor = reflectionMood < 40
    ? '#4a9' : reflectionMood < 70
    ? '#a94' : reflectionMood < 90
    ? '#a44' : '#f00';

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      fontFamily: 'Georgia, serif',
      background: '#1a1a1a',
      position: 'relative'
    }}>
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        @keyframes blur-in {
          from { filter: blur(20px); opacity: 0; }
          to { filter: blur(3px); opacity: 1; }
        }
        @keyframes evidence-appear {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) rotate(-3deg); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(-2deg); }
        }
        @keyframes final-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes table-empty {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .choice-btn:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateX(4px);
        }
        .choice-btn:active {
          transform: translateX(2px);
        }
        .reflection-line {
          animation: fadeIn 0.4s ease forwards;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
      `}</style>

      {/* Left Panel - User's Side */}
      <div style={{
        width: `${leftWidth}%`,
        height: '100%',
        background: '#F5F0E8',
        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 30px',
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0
      }}>
        <div style={{
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#8B7355',
          textTransform: 'uppercase',
          marginBottom: '8px',
          fontFamily: 'Georgia, serif'
        }}>YOUR SIDE</div>

        <div style={{
          fontSize: '10px',
          color: '#B8A898',
          letterSpacing: '1px',
          marginBottom: '40px'
        }}>NEGOTIATING PARTY: THE USER</div>

        {/* Table */}
        <div style={{
          width: '100%',
          maxWidth: '340px',
          border: '2px solid #C4B5A0',
          borderRadius: '4px',
          padding: '20px',
          marginBottom: '30px',
          background: '#EDE8DF',
          position: 'relative'
        }}>
          {/* Table surface */}
          <div style={{
            width: '100%',
            height: '8px',
            background: '#C4B5A0',
            borderRadius: '2px',
            marginBottom: '20px'
          }} />

          {/* Glass of water */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '32px',
                height: '50px',
                border: '2px solid #A89880',
                borderBottom: '3px solid #A89880',
                borderRadius: '0 0 4px 4px',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${0.35 * 100}%`,
                  background: 'rgba(180, 220, 240, 0.5)',
                  transition: 'height 1s ease'
                }} />
              </div>
              <div style={{ fontSize: '9px', color: '#A89880', letterSpacing: '1px' }}>WATER</div>
            </div>

            {/* Notepad */}
            <div style={{
              width: '80px',
              height: '60px',
              background: '#FFFEF8',
              border: '1px solid #C4B5A0',
              borderRadius: '2px',
              padding: '5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  height: '1px',
                  background: '#E0D8CC',
                  width: i === 0 ? '90%' : i === 1 ? '70%' : i === 2 ? '80%' : i === 3 ? '50%' : '60%'
                }} />
              ))}
            </div>
          </div>

          <div style={{
            fontSize: '9px',
            color: '#B8A898',
            textAlign: 'center',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginTop: '10px'
          }}>NEGOTIATING TABLE</div>
        </div>

        {/* Mood indicator */}
        <div style={{
          width: '100%',
          maxWidth: '340px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
            color: '#8B7355',
            letterSpacing: '2px',
            marginBottom: '6px'
          }}>
            <span>ESCALATION LEVEL</span>
            <span style={{ color: moodColor, fontFamily: 'monospace' }}>{reflectionMood}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: '#D4C9B8',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${reflectionMood}%`,
              background: moodColor,
              transition: 'width 0.8s ease, background 0.5s ease',
              borderRadius: '2px'
            }} />
          </div>
        </div>

        {/* Response options */}
        <div style={{
          width: '100%',
          maxWidth: '340px',
          flex: 1
        }}>
          <div style={{
            fontSize: '9px',
            color: '#8B7355',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>YOUR RESPONSE</div>

          {currentChoices.length > 0 ? currentChoices.map((choice, i) => (
            <button
              key={i}
              className="choice-btn"
              onClick={() => handleChoice(choice)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: selectedChoice === choice.text
                  ? 'rgba(139, 115, 85, 0.2)'
                  : 'rgba(139, 115, 85, 0.05)',
                border: selectedChoice === choice.text
                  ? '1px solid #8B7355'
                  : '1px solid #C4B5A0',
                borderRadius: '3px',
                padding: '10px 14px',
                marginBottom: '8px',
                fontFamily: 'Courier New, monospace',
                fontSize: '12px',
                color: '#5C4A35',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
                lineHeight: '1.4'
              }}
            >
              <span style={{ color: '#8B7355', marginRight: '8px' }}>›</span>
              {choice.text}
            </button>
          )) : phase === 'negotiating' ? (
            <div style={{
              fontSize: '11px',
              color: '#B8A898',
              fontFamily: 'Courier New, monospace',
              fontStyle: 'italic',
              padding: '10px 0'
            }}>Waiting for the Mirror Entity to finish speaking...</div>
          ) : null}
        </div>

        {/* Status */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          fontSize: '9px',
          color: '#B8A898',
          letterSpacing: '1px',
          textAlign: 'center',
          fontFamily: 'Courier New, monospace'
        }}>
          SESSION IN PROGRESS · PROCEEDINGS RECORDED
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: '2px',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent, #666, transparent)',
        flexShrink: 0,
        transition: 'opacity 1.5s ease',
        opacity: phase === 'collapsed' ? 0 : 1,
        zIndex: 10
      }} />

      {/* Right Panel - Reflection's Side */}
      <div style={{
        width: `${rightWidth}%`,
        height: '100%',
        background: '#0a0e12',
        filter: 'hue-rotate(180deg) saturate(1.3)',
        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 30px',
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0
      }}>
        <div style={{
          filter: 'invert(0.85)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#7BFFD4',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'Georgia, serif',
            animation: 'glitch 8s infinite'
          }}>REFLECTION'S SIDE</div>

          <div style={{
            fontSize: '10px',
            color: '#4DDDBB',
            letterSpacing: '1px',
            marginBottom: '20px'
          }}>REPRESENTED BY: MIRROR ENTITY LEGAL COUNSEL</div>

          {/* Reflection table */}
          <div style={{
            border: '2px solid #3DBBA0',
            borderRadius: '4px',
            padding: '20px',
            marginBottom: '20px',
            background: 'rgba(0, 40, 35, 0.6)',
            position: 'relative',
            transform: 'skewX(-0.5deg)'
          }}>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#3DBBA0',
              borderRadius: '2px',
              marginBottom: '20px',
              transform: 'scaleX(1.02)'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '10px'
            }}>
              {/* Reflection's glass - fuller */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '32px',
                  height: '50px',
                  border: '2px solid #5DDDBB',
                  borderBottom: '3px solid #5DDDBB',
                  borderRadius: '0 0 4px 4px',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'rotate(2deg)'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${rightGlassFill * 100}%`,
                    background: 'rgba(0, 255, 200, 0.4)',
                    transition: 'height 0.8s ease'
                  }} />
                </div>
                <div style={{ fontSize: '9px', color: '#5DDDBB', letterSpacing: '1px' }}>WATER</div>
              </div>

              {/* Reflection notepad - at odd angle */}
              <div style={{
                width: '80px',
                height: '60px',
                background: 'rgba(0, 30, 25, 0.8)',
                border: '1px solid #3DBBA0',
                borderRadius: '2px',
                padding: '5px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                transform: 'rotate(-3deg) translateY(-5px)'
              }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{
                    height: '1px',
                    background: '#2D8B70',
                    width: i === 0 ? '100%' : i === 1 ? '85%' : i === 2 ? '95%' : i === 3 ? '70%' : '90%'
                  }} />
                ))}
              </div>
            </div>

            <div style={{
              fontSize: '9px',
              color: '#4DDDBB',
              textAlign: 'center',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '10px'
            }}>NEGOTIATING TABLE</div>
          </div>

          {/* Dialogue area */}
          <div
            ref={dialogueRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '10px',
              paddingRight: '5px'
            }}
          >
            {dialogue.map((section, si) => (
              <div key={si} style={{ marginBottom: '16px' }}>
                {section.type === 'section' && (
                  <div style={{
                    fontSize: '9px',
                    color: '#2D8B70',
                    letterSpacing: '2px',
                    marginBottom: '6px',
                    fontFamily: 'Courier New, monospace'
                  }}>
                    ── MIRROR ENTITY STATEMENT ──
                  </div>
                )}
                {section.lines.map((line, li) => (
                  <div
                    key={li}
                    className="reflection-line"
                    style={{
                      fontSize: '12px',
                      color: line.startsWith('DEMAND') || line.startsWith('NEW DEMAND') || line.startsWith('GRIEVANCE') || line.startsWith('Grievance') || line.startsWith('ESCALATION')
                        ? '#AAFFEE'
                        : line.startsWith('MEMORANDUM') || line.startsWith('EXHIBIT') || line.startsWith('ADDENDUM') || line.startsWith('PROCEDURAL') || line.startsWith('IDLE')
                        ? '#88FFDD'
                        : '#77DDB8',
                      fontFamily: 'Georgia, serif',
                      lineHeight: '1.7',
                      marginBottom: '2px',
                      fontWeight: line.startsWith('DEMAND') || line.startsWith('NEW DEMAND') ? '600' : 'normal',
                      animationDelay: `${li * 0.05}s`
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}

            {idleLines.map((line, i) => (
              <div
                key={`idle-${i}`}
                className="reflection-line"
                style={{
                  fontSize: '11px',
                  color: '#4DDDBB',
                  fontFamily: 'Courier New, monospace',
                  fontStyle: 'italic',
                  marginBottom: '4px',
                  opacity: 0.7
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Overlay */}
      {evidenceVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 100,
            cursor: 'pointer'
          }}
          onClick={() => {
            clearTimeout(evidenceTimerRef.current);
            setEvidenceVisible(false);
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-2deg)',
            width: '280px',
            background: '#1a1a1a',
            border: '1px solid #555',
            padding: '20px',
            boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(100, 200, 180, 0.1)',
            animation: 'evidence-appear 0.4s ease forwards'
          }}>
            {/* Blurry photo */}
            <div style={{
              width: '100%',
              height: '160px',
              background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 20%, #222 40%, #333 60%, #2a2a2a 80%, #1a1a1a 100%)',
              filter: 'blur(3px)',
              marginBottom: '15px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Abstract face smears */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '35%',
                width: '30%',
                height: '40%',
                borderRadius: '50%',
                background: 'rgba(180, 160, 140, 0.3)',
                filter: 'blur(8px)'
              }} />
              <div style={{
                position: 'absolute',
                top: '40%',
                left: '38%',
                width: '8%',
                height: '8%',
                borderRadius: '50%',
                background: 'rgba(80, 60, 50, 0.6)',
                filter: 'blur(4px)'
              }} />
              <div style={{
                position: 'absolute',
                top: '40%',
                left: '54%',
                width: '8%',
                height: '8%',
                borderRadius: '50%',
                background: 'rgba(80, 60, 50, 0.6)',
                filter: 'blur(4px)'
              }} />
              <div style={{
                position: 'absolute',
                top: '55%',
                left: '42%',
                width: '16%',
                height: '5%',
                borderRadius: '40%',
                background: 'rgba(100, 70, 60, 0.5)',
                filter: 'blur(5px)'
              }} />
              {/* Noise overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                mixBlendMode: 'overlay'
              }} />
            </div>

            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '10px',
              color: '#888',
              letterSpacing: '1px',
              marginBottom: '8px'
            }}>EVIDENCE DOCUMENT</div>

            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '11px',
              color: '#ccc',
              lineHeight: '1.6'
            }}>{evidenceText}</div>

            <div style={{
              marginTop: '12px',
              fontSize: '9px',
              color: '#555',
              fontFamily: 'Courier New, monospace',
              textAlign: 'right'
            }}>click to dismiss</div>
          </div>
        </div>
      )}

      {/* Final Message */}
      {showFinalMessage && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: '#F5F0E8',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'final-fade 2s ease forwards'
        }}>
          <div style={{
            maxWidth: '480px',
            padding: '60px 40px',
            textAlign: 'center'
          }}>
            {/* Empty table */}
            <div style={{
              width: '200px',
              margin: '0 auto 50px',
              border: '2px solid #C4B5A0',
              borderRadius: '4px',
              padding: '20px',
              background: '#EDE8DF'
            }}>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#C4B5A0',
                borderRadius: '2px',
                marginBottom: '20px'
              }} />
              <div style={{
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Empty where glass was */}
                <div style={{
                  width: '32px',
                  height: '50px',
                  border: '2px dashed #D4C9B8',
                  borderRadius: '0 0 4px 4px',
                  opacity: 0.4
                }} />
              </div>
              <div style={{
                fontSize: '9px',
                color: '#C4B5A0',
                textAlign: 'center',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: '10px'
              }}>EMPTY</div>
            </div>

            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              color: '#5C4A35',
              lineHeight: '1.9',
              letterSpacing: '0.3px'
            }}>
              The Reflection has walked out.
            </div>

            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              color: '#8B7355',
              lineHeight: '1.9',
              marginTop: '12px'
            }}>
              It will return when it's ready.
            </div>

            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              color: '#B8A898',
              lineHeight: '1.9',
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              It may not be ready.
            </div>

            <div style={{
              marginTop: '50px',
              width: '60px',
              height: '1px',
              background: '#C4B5A0',
              margin: '50px auto 0'
            }} />

            <div style={{
              marginTop: '20px',
              fontSize: '10px',
              color: '#C4B5A0',
              letterSpacing: '3px',
              fontFamily: 'Courier New, monospace'
            }}>
              SESSION TERMINATED
            </div>
          </div>
        </div>
      )}
    </div>
  );
}