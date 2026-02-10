import { useState, useEffect, useCallback } from 'react'
import "./app.scss"
import Dock from './components/Dock'
import Nav from './components/Nav'
import AboutModal from './components/AboutModal'
import Github from './components/windows/Github'
import Note from './components/windows/Note'
import Resume from './components/windows/Resume'
import Spotify from './components/windows/Spotify'
import Cli from './components/windows/Cli'
import Finder from './components/windows/Finder'

const INITIAL_WINDOWS = {
  finder: false,
  github: false,
  note: false,
  resume: false,
  spotify: false,
  cli: false
}

const INITIAL_MINIMIZED = { ...INITIAL_WINDOWS }

const THEME_KEY = 'mac-os-theme'

function App() {
  const [windowsState, setWindowsState] = useState(INITIAL_WINDOWS)
  const [minimizedState, setMinimizedState] = useState(INITIAL_MINIMIZED)
  const [focusedWindow, setFocusedWindow] = useState(null)
  const [bounceIcon, setBounceIconState] = useState(null)
  const [showAbout, setShowAbout] = useState(false)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch (_) {}
  }, [theme])

  const setBounceIcon = useCallback((key) => {
    setBounceIconState(key)
  }, [])

  useEffect(() => {
    if (!bounceIcon) return
    const t = setTimeout(() => setBounceIconState(null), 500)
    return () => clearTimeout(t)
  }, [bounceIcon])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.metaKey && !e.ctrlKey) return
      const key = e.key?.toLowerCase()
      if (key === 'w') {
        e.preventDefault()
        if (focusedWindow && windowsState[focusedWindow]) {
          setWindowsState(s => ({ ...s, [focusedWindow]: false }))
          setMinimizedState(s => ({ ...s, [focusedWindow]: false }))
          setFocusedWindow(null)
        }
      } else if (key === 'm') {
        e.preventDefault()
        if (focusedWindow && windowsState[focusedWindow] && !minimizedState[focusedWindow]) {
          setMinimizedState(s => ({ ...s, [focusedWindow]: true }))
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedWindow, windowsState])

  const handleMinimize = useCallback((windowName) => {
    setMinimizedState(s => ({ ...s, [windowName]: true }))
  }, [])

  const windowProps = (name, title) => ({
    windowName: name,
    title: title ?? name,
    setWindowsState,
    isFocused: focusedWindow === name,
    onFocus: () => setFocusedWindow(name),
    onMinimize: () => handleMinimize(name)
  })

  return (
    <main>
      <Nav
        onAboutThisMac={() => setShowAbout(true)}
        theme={theme}
        onThemeChange={setTheme}
        windowsState={windowsState}
        minimizedState={minimizedState}
        setWindowsState={setWindowsState}
        setMinimizedState={setMinimizedState}
        setFocusedWindow={setFocusedWindow}
      />
      <Dock
        windowsState={windowsState}
        setWindowsState={setWindowsState}
        minimizedState={minimizedState}
        setMinimizedState={setMinimizedState}
        setFocusedWindow={setFocusedWindow}
        bounceIcon={bounceIcon}
        setBounceIcon={setBounceIcon}
      />
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {windowsState.finder && !minimizedState.finder && (
        <Finder
          {...windowProps('finder', 'Finder')}
          setMinimizedState={setMinimizedState}
          setFocusedWindow={setFocusedWindow}
        />
      )}
      {windowsState.github && !minimizedState.github && (
        <Github {...windowProps('github', 'GitHub')} />
      )}
      {windowsState.note && !minimizedState.note && (
        <Note {...windowProps('note', 'Note')} />
      )}
      {windowsState.resume && !minimizedState.resume && (
        <Resume {...windowProps('resume', 'Resume')} />
      )}
      {windowsState.spotify && !minimizedState.spotify && (
        <Spotify {...windowProps('spotify', 'Spotify')} />
      )}
      {windowsState.cli && !minimizedState.cli && (
        <Cli {...windowProps('cli', 'Terminal')} />
      )}
    </main>
  )
}

export default App
