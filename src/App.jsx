import { useEffect, useState } from 'react'
import { loadState, saveState } from './lib/storage.js'
import Home from './components/Home.jsx'
import TreatFund from './components/TreatFund.jsx'
import History from './components/History.jsx'
import Settings from './components/Settings.jsx'
import AddHabit from './components/AddHabit.jsx'
import LogRun from './components/LogRun.jsx'

// Derives a foreground + background CSS color pair from an HSL knob, keeping
// backgrounds light in light mode and dark in dark mode regardless of hue.
function colorVarsFor(h, s, l, isDark) {
  const fgL = isDark ? Math.min(80, l + 32) : l
  const bgS = isDark ? Math.min(50, s * 0.6) : Math.min(60, s * 0.85)
  const bgL = isDark ? 18 : 90
  return { fg: `hsl(${h}, ${s}%, ${fgL}%)`, bg: `hsl(${h}, ${bgS}%, ${bgL}%)` }
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [tab, setTab] = useState('home')
  const [modal, setModal] = useState(null) // 'addHabit' | 'logRun' | null

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    const isDark = state.theme === 'dark'
    const { accentH, accentS, accentL, highlightH, highlightS, highlightL } = state.colors
    const accent = colorVarsFor(accentH, accentS, accentL, isDark)
    const highlight = colorVarsFor(highlightH, highlightS, highlightL, isDark)
    const root = document.documentElement
    root.style.setProperty('--green', accent.fg)
    root.style.setProperty('--green-bg', accent.bg)
    root.style.setProperty('--amber', highlight.fg)
    root.style.setProperty('--amber-bg', highlight.bg)
  }, [state.colors, state.theme])

  function update(fn) {
    setState((prev) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })
  }

  return (
    <>
      {tab === 'home' && (
        <Home state={state} update={update} onAddHabit={() => setModal('addHabit')} onLogRun={() => setModal('logRun')} />
      )}
      {tab === 'treats' && <TreatFund state={state} update={update} />}
      {tab === 'history' && <History state={state} />}
      {tab === 'settings' && <Settings state={state} update={update} />}

      {modal === 'addHabit' && <AddHabit update={update} onClose={() => setModal(null)} />}
      {modal === 'logRun' && <LogRun state={state} update={update} onClose={() => setModal(null)} />}

      <nav className="bottom-nav">
        <button className={`nav-item ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
          <i className="ti ti-home" aria-hidden="true" />
          Home
        </button>
        <button className={`nav-item ${tab === 'treats' ? 'active' : ''}`} onClick={() => setTab('treats')}>
          <i className="ti ti-cup" aria-hidden="true" />
          Treat fund
        </button>
        <button className={`nav-item ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          <i className="ti ti-chart-bar" aria-hidden="true" />
          History
        </button>
        <button className={`nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
          <i className="ti ti-settings" aria-hidden="true" />
          Settings
        </button>
      </nav>
    </>
  )
}
