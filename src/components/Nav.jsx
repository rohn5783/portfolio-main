import React, { useState, useRef, useEffect } from 'react'
import "./nav.scss"
import DateTime from './DateTime'

const APP_LABELS = {
  finder: 'Finder',
  github: 'GitHub',
  note: 'Note',
  resume: 'Resume',
  spotify: 'Spotify',
  cli: 'Terminal'
}

const THEME_MODE_LABELS = {
  auto: 'Automatic',
  light: 'Day Mode',
  dark: 'Night Mode'
}

const getActiveAppLabel = (focusedWindow, windowsState) => {
  if (focusedWindow && windowsState[focusedWindow] && APP_LABELS[focusedWindow]) {
    return APP_LABELS[focusedWindow]
  }

  const openWindow = Object.keys(APP_LABELS).find((key) => windowsState[key])
  return openWindow ? APP_LABELS[openWindow] : 'Portfolio'
}

const Nav = ({
  onAboutThisMac,
  theme,
  themePreference,
  onThemePreferenceChange,
  windowsState,
  setWindowsState,
  setMinimizedState,
  setFocusedWindow,
  focusedWindow
}) => {
  const [openMenu, setOpenMenu] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!openMenu) return
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [openMenu])

  const openApp = (key) => {
    setWindowsState(s => ({ ...s, [key]: true }))
    setMinimizedState(s => ({ ...s, [key]: false }))
    setFocusedWindow?.(key)
    setOpenMenu(null)
  }

  const focusWindow = (key) => {
    setMinimizedState(s => ({ ...s, [key]: false }))
    setFocusedWindow?.(key)
    setOpenMenu(null)
  }

  const openWindows = Object.entries(windowsState).filter(([k, v]) => v && APP_LABELS[k])
  const activeAppLabel = getActiveAppLabel(focusedWindow, windowsState)
  const appearanceLabel = theme === 'light' ? 'Sunlit' : 'After Dark'

  return (
    <nav className="topbar">
      <div className="left" ref={menuRef}>
        <div className="nav-cluster nav-cluster-primary">
          <div className="nav-menu-wrap">
            <button
              type="button"
              className="apple-icon"
              aria-label="Open Apple menu"
              onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'apple' ? null : 'apple') }}
            >
              <img src="/navbar-icons/apple.svg" alt="" />
            </button>
            {openMenu === 'apple' && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-item" onClick={() => { onAboutThisMac?.(); setOpenMenu(null) }}>
                  About This Mac
                </div>
                <div className="nav-dropdown-divider" />
                <div
                  className="nav-dropdown-item"
                  onClick={() => { onThemePreferenceChange?.('auto'); setOpenMenu(null) }}
                >
                  Automatic Theme {themePreference === 'auto' ? 'On' : 'Off'}
                </div>
                <div
                  className="nav-dropdown-item"
                  onClick={() => { onThemePreferenceChange?.('light'); setOpenMenu(null) }}
                >
                  Use Day Mode
                </div>
                <div
                  className="nav-dropdown-item"
                  onClick={() => { onThemePreferenceChange?.('dark'); setOpenMenu(null) }}
                >
                  Use Night Mode
                </div>
              </div>
            )}
          </div>

          <div className="nav-app-indicator" aria-label={`Active app ${activeAppLabel}`}>
            <span className="nav-app-indicator-dot" />
            <span>{activeAppLabel}</span>
          </div>
        </div>

        <div className="nav-cluster nav-cluster-menu">
          <div className="nav-menu-wrap">
            <button
              type="button"
              className="nav-item"
              onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'file' ? null : 'file') }}
            >
              <p>File</p>
            </button>
            {openMenu === 'file' && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-item" onClick={() => openApp('finder')}>New Finder Window</div>
                <div className="nav-dropdown-item" onClick={() => openApp('note')}>New Note</div>
                <div className="nav-dropdown-divider" />
                <div className="nav-dropdown-item" onClick={() => { window.open('/resume.pdf', '_blank'); setOpenMenu(null) }}>Open Resume</div>
              </div>
            )}
          </div>

          <div className="nav-menu-wrap">
            <button
              type="button"
              className="nav-item"
              onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'window' ? null : 'window') }}
            >
              <p>Window</p>
            </button>
            {openMenu === 'window' && (
              <div className="nav-dropdown">
                {openWindows.length === 0 ? (
                  <div className="nav-dropdown-item disabled">No open windows</div>
                ) : (
                  openWindows.map(([key]) => (
                    <div key={key} className="nav-dropdown-item" onClick={() => focusWindow(key)}>
                      {APP_LABELS[key]}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button type="button" className="nav-item nav-item-terminal" onClick={() => openApp('cli')}>
            <p>Terminal</p>
          </button>
        </div>
      </div>

      <div className="right">
        <div className="nav-status-pill">
          <span className="nav-status-kicker">{THEME_MODE_LABELS[themePreference]}</span>
          <span className="nav-status-value">{appearanceLabel}</span>
        </div>

        <div className="nav-icon">
          <img src="/navbar-icons/wifi.svg" alt="" />
        </div>

        <div className="nav-item nav-time">
          <DateTime />
        </div>
      </div>
    </nav>
  )
}

export default Nav
