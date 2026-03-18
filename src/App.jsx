import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
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
const INITIAL_WINDOW_ACTIONS = Object.fromEntries(
  Object.keys(INITIAL_WINDOWS).map((key) => [key, null])
)

const THEME_KEY = 'mac-os-theme'
const THEME_PREFERENCE_KEY = 'mac-os-theme-preference'

const resolveAutoTheme = () => {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

function App() {
  const [windowsState, setWindowsState] = useState(INITIAL_WINDOWS)
  const [minimizedState, setMinimizedState] = useState(INITIAL_MINIMIZED)
  const [focusedWindow, setFocusedWindow] = useState(null)
  const [iconAnimation, setIconAnimation] = useState(null)
  const [windowActions, setWindowActions] = useState(INITIAL_WINDOW_ACTIONS)
  const [showAbout, setShowAbout] = useState(false)
  const [themePreference, setThemePreference] = useState(() => {
    try {
      return localStorage.getItem(THEME_PREFERENCE_KEY) || 'auto'
    } catch {
      return 'auto'
    }
  })
  const [autoTheme, setAutoTheme] = useState(resolveAutoTheme)
  const theme = themePreference === 'auto' ? autoTheme : themePreference

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_PREFERENCE_KEY, themePreference)
    } catch {
      // Ignore storage failures in locked-down/private browsing environments.
    }
  }, [themePreference])

  useEffect(() => {
    if (themePreference !== 'auto') return undefined

    const syncTheme = () => {
      setAutoTheme(resolveAutoTheme())
    }

    syncTheme()
    const intervalId = window.setInterval(syncTheme, 60 * 1000)
    return () => window.clearInterval(intervalId)
  }, [themePreference])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Ignore storage failures in locked-down/private browsing environments.
    }
  }, [theme])

  const playIconAnimation = useCallback((key, type = 'open') => {
    setIconAnimation({ key, type, timestamp: Date.now() })
  }, [])

  useEffect(() => {
    if (!iconAnimation) return
    const t = setTimeout(() => setIconAnimation(null), 700)
    return () => clearTimeout(t)
  }, [iconAnimation])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.metaKey && !e.ctrlKey) return
      const key = e.key?.toLowerCase()
      if (key === 'w') {
        e.preventDefault()
        if (focusedWindow && windowsState[focusedWindow]) {
          setWindowActions(state => ({ ...state, [focusedWindow]: 'close' }))
          playIconAnimation(focusedWindow, 'close')
        }
      } else if (key === 'm') {
        e.preventDefault()
        if (focusedWindow && windowsState[focusedWindow] && !minimizedState[focusedWindow]) {
          setWindowActions(state => ({ ...state, [focusedWindow]: 'minimize' }))
          playIconAnimation(focusedWindow, 'minimize')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedWindow, minimizedState, playIconAnimation, windowsState])

  const handleMinimize = useCallback((windowName) => {
    setWindowActions(state => ({ ...state, [windowName]: 'minimize' }))
    playIconAnimation(windowName, 'minimize')
  }, [playIconAnimation])

  const handleWindowActionComplete = useCallback((windowName, action) => {
    if (!action) return

    setWindowActions((currentActions) => {
      if (!currentActions[windowName]) return currentActions
      return { ...currentActions, [windowName]: null }
    })

    if (action === 'minimize') {
      setMinimizedState((state) => ({ ...state, [windowName]: true }))
      setFocusedWindow((current) => (current === windowName ? null : current))
    }

    if (action === 'close') {
      setWindowsState((state) => ({ ...state, [windowName]: false }))
      setMinimizedState((state) => ({ ...state, [windowName]: false }))
      setFocusedWindow((current) => (current === windowName ? null : current))
    }
  }, [])

  const windowProps = (name, title) => ({
    windowName: name,
    title: title ?? name,
    setWindowsState,
    isFocused: focusedWindow === name,
    windowAction: windowActions[name],
    onFocus: () => setFocusedWindow(name),
    onMinimize: () => handleMinimize(name),
    onWindowActionComplete: (action) => handleWindowActionComplete(name, action),
    onClose: () => {
      setWindowActions(state => ({ ...state, [name]: 'close' }))
      playIconAnimation(name, 'close')
    }
  })

  return (
    <main>
      <Nav
        onAboutThisMac={() => setShowAbout(true)}
        theme={theme}
        themePreference={themePreference}
        onThemePreferenceChange={setThemePreference}
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
        setWindowActions={setWindowActions}
        iconAnimation={iconAnimation}
        playIconAnimation={playIconAnimation}
      />
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      <AnimatePresence>
        {windowsState.finder && !minimizedState.finder && (
          <Finder
            key="finder"
            {...windowProps('finder', 'Finder')}
            setMinimizedState={setMinimizedState}
            setFocusedWindow={setFocusedWindow}
          />
        )}
        {windowsState.github && !minimizedState.github && (
          <Github key="github" {...windowProps('github', 'GitHub')} />
        )}
        {windowsState.note && !minimizedState.note && (
          <Note key="note" {...windowProps('note', 'Note')} />
        )}
        {windowsState.resume && !minimizedState.resume && (
          <Resume key="resume" {...windowProps('resume', 'Resume')} />
        )}
        {windowsState.spotify && !minimizedState.spotify && (
          <Spotify key="spotify" {...windowProps('spotify', 'Spotify')} />
        )}
        {windowsState.cli && !minimizedState.cli && (
          <Cli key="cli" {...windowProps('cli', 'Terminal')} />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
