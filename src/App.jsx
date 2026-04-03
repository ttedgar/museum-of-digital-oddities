import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import GeneratedPageWrapper from './pages/GeneratedPageWrapper.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:date" element={<GeneratedPageWrapper />} />
    </Routes>
  )
}
