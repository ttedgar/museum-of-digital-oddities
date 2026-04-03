import { useParams, Link } from 'react-router-dom'
import { registry } from '../generated/registry.js'
import manifest from '../generated/manifest.json'

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    padding: '16px 24px',
    borderBottom: '1px solid #222228',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#0c0c0e',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  backLink: {
    fontSize: '12px',
    color: '#5a5a6a',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color 0.15s',
  },
  meta: {
    fontSize: '11px',
    color: '#3a3a4a',
    letterSpacing: '2px',
  },
  content: {
    flex: 1,
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    color: '#3a3a4a',
    gap: '16px',
    fontSize: '13px',
  },
}

export default function GeneratedPageWrapper() {
  const { date } = useParams()
  const Page = registry[date]
  const meta = manifest.find(p => p.date === date)

  if (!Page) {
    return (
      <div style={styles.root}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.backLink}>← Archive</Link>
        </nav>
        <div style={styles.notFound}>
          <div style={{ fontSize: '32px' }}>404</div>
          <div>No exhibit found for <code style={{ color: '#7c5cbf' }}>{date}</code></div>
          <Link to="/" style={{ color: '#7c5cbf', fontSize: '12px' }}>Return to museum</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.root}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.backLink}>← Archive</Link>
        <div style={styles.meta}>
          {date}{meta ? ` — ${meta.title}` : ''}
        </div>
      </nav>
      <div style={styles.content}>
        <Page />
      </div>
    </div>
  )
}
