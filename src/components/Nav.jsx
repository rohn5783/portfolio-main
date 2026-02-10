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

const Nav = ({ onAboutThisMac, theme, onThemeChange, windowsState, minimizedState, setWindowsState, setMinimizedState, setFocusedWindow }) => {
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

  return (
    <nav>
      <div className="left" ref={menuRef}>
        <div className="nav-menu-wrap">
          <div
            className="apple-icon"
            onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'apple' ? null : 'apple') }}
          >
            <img src="/navbar-icons/apple.svg" alt="" />
          </div>
          {openMenu === 'apple' && (
            <div className="nav-dropdown">
              <div className="nav-dropdown-item" onClick={() => { onAboutThisMac?.(); setOpenMenu(null) }}>
                About This Mac
              </div>
              <div className="nav-dropdown-divider" />
              <div
                className="nav-dropdown-item"
                onClick={() => { onThemeChange?.(theme === 'dark' ? 'light' : 'dark'); setOpenMenu(null) }}
              >
                {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              </div>
            </div>
          )}
        </div>

        <div className="nav-menu-wrap">
          <div className="nav-item" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'file' ? null : 'file') }}>
            <p>File</p>
          </div>
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
          <div className="nav-item" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'window' ? null : 'window') }}>
            <p>Window</p>
          </div>
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

        <div className="nav-item" onClick={() => openApp('cli')}>
          <p>Terminal</p>
        </div>
      </div>
      <div className="right">
        <div className="nav-icon">
          <img src="/navbar-icons/wifi.svg" alt="" />
        </div>
        <div className="nav-item">
          <DateTime />
        </div>
      </div>
    </nav>
  )
}

export default Nav