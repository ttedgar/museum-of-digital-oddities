import { Link } from 'react-router-dom'
import manifest from '../generated/manifest.json'

const pages = [...manifest].reverse()

const styles = {
  root: {
    minHeight: '100vh',
    padding: '0 0 80px',
  },
  header: {
    borderBottom: '1px solid #222228',
    padding: '48px 40px 40px',
    marginBottom: '48px',
  },
  eyebrow: {
    fontSize: '10px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    color: '#5a5a6a',
    marginBottom: '16px',
  },
  title: {
    fontSize: 'clamp(24px, 5vw, 48px)',
    fontWeight: 'bold',
    letterSpacing: '-1px',
    color: '#e0e0ec',
    lineHeight: 1.1,
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#5a5a6a',
    maxWidth: '540px',
    lineHeight: 1.7,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1px',
    background: '#222228',
    border: '1px solid #222228',
    margin: '0 40px',
  },
  card: {
    background: '#0c0c0e',
    padding: '28px',
    transition: 'background 0.15s',
    cursor: 'pointer',
    display: 'block',
    minHeight: '180px',
    position: 'relative',
  },
  cardDate: {
    fontSize: '10px',
    letterSpacing: '3px',
    color: '#3a3a4a',
    marginBottom: '12px',
    fontFamily: 'monospace',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#d0d0e0',
    marginBottom: '10px',
    lineHeight: 1.3,
  },
  cardDesc: {
    fontSize: '12px',
    color: '#4a4a5a',
    lineHeight: 1.6,
  },
  cardArrow: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    fontSize: '16px',
    color: '#3a3a4a',
    transition: 'color 0.15s, transform 0.15s',
  },
  empty: {
    padding: '80px 40px',
    textAlign: 'center',
    color: '#3a3a4a',
    fontSize: '13px',
    lineHeight: 2,
  },
  emptyCmd: {
    display: 'inline-block',
    background: '#111116',
    border: '1px solid #222228',
    padding: '4px 10px',
    borderRadius: '3px',
    fontSize: '12px',
    color: '#7c5cbf',
    margin: '0 4px',
  },
  count: {
    fontSize: '11px',
    color: '#3a3a4a',
    padding: '12px 40px 0',
    letterSpacing: '2px',
  },
}

function CardHover({ page }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/${page.date}`}
      style={{
        ...styles.card,
        background: hovered ? '#111116' : '#0c0c0e',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardDate}>{page.date}</div>
      <div style={styles.cardTitle}>{page.title}</div>
      <div style={styles.cardDesc}>{page.description}</div>
      <div style={{
        ...styles.cardArrow,
        color: hovered ? '#7c5cbf' : '#3a3a4a',
        transform: hovered ? 'translateX(3px)' : 'none',
      }}>→</div>
    </Link>
  )
}

// Import useState inside the component file
import { useState } from 'react'

export default function Home() {
  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.eyebrow}>Exhibit Collection</div>
        <h1 style={styles.title}>
          Museum of<br />Digital Oddities
        </h1>
        <p style={styles.subtitle}>
          A haunted AI sketchbook. Each entry is a strange artifact generated
          by three AI minds: one dreams the idea, one draws the blueprint,
          one writes the code. Run <code style={{ color: '#7c5cbf' }}>npm run generate</code> to add today's exhibit.
        </p>
      </header>

      {pages.length === 0 ? (
        <div style={styles.empty}>
          <div>The museum is empty.</div>
          <div style={{ marginTop: '16px' }}>
            Add your first exhibit with
            <span style={styles.emptyCmd}>npm run generate</span>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.count}>{pages.length} exhibit{pages.length !== 1 ? 's' : ''} on display</div>
          <div style={{ height: '16px' }} />
          <div style={styles.grid}>
            {pages.map(page => (
              <CardHover key={page.date} page={page} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
