import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from 'style';

const Page = export default function Page() {
  const [flickerState, setFlickerState] = useState(true);
  const flickerRef = useRef(true);
  const whisperText = [
    "You never heard the silence.",
    "Laughter in the static.",
    "A clock that never ticks.",
    "Your reflection forgot its name.",
    "The mirror breathes.",
    "Words without language.",
    "Shadows speak words you didn’t say.",
    "What you hear is the silence inside.",
    "A voice that hums in your ear.",
    "You are the echo, the echo is you."
  ];
  const whisperInterval = useCallback(() => {
    if (!flikerState) return;
    const interval = setInterval(() => {
      setFlickerState(!flickerState);
    }, 300);
    return () => clearInterval(interval);
  }, [flickerState]);

  useEffect(() => {
    if (!flickerState) {
      flickerRef.current = false;
      if (flikerState) {
        whisperText.forEach((tr, index) => {
          const reversed = tr.split(' ').reverse().join(' ');
          setWhisper(prev => prev ? [prev, reversed] : [reversed, '']);
        });
      }
    }
    return () => {
      if (flikerState) {
        clearInterval(flickerRef.current);
      }
    };
  }, [flikerState, whisperText]);

  const handleShadowTap = useCallback(
    (event) => {
      if (flikerState) {
        const reversedText = whisperText.map((word, index) => word.split('').reverse().join(' '));
        setWhisper(prev => [...prev, reversedText[0]]);
      }
    },
    [whisperText]
  );

  return (
    <div style={style({
      backgroundColor: '#0a0a2f',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: '#cce6ff',
      opacity: flickerState ? 0.7 : 1
    })}>
      <style>
        .whisper {
          font-size: 1.2rem;
          animation: whisper 1s infinite;
          opacity: 0;
          transition: opacity 0.5s;
        }
        .whisper.visible {
          opacity: 1;
        }
      </style>
      <div style={style({
        position: 'relative',
        width: '90%',
        maxWidth: '600px',
        backdropForecolor: '#0a0a2f',
        backgroundImage: 'linear-gradient(90deg, #5555ff 0%, #0a0a2f 100%)',
        backgroundBlendMode: 'overlay',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center',
        color: '#cce6ff',
        borderRadius: '20px'
      ))}
        {flickerState ? (
          <div style={{position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)'}}>
            <span className="whisper">{whisperText[0]}</span>
          </div>
        ) : null}
      </div>
      <button
        onClick={() => setFlickerState(!flickerState)}
        style={style({
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#5555ff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          width: '100%'
        })}
      >
        Toggle Shadows
      </button>
    </div>
  );
}