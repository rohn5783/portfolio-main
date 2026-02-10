import React from 'react'
import MacWindow from './MacWindow'
import "./finder.scss"

const items = [
  { name: 'Resume', icon: '📄', action: 'resume' },
  { name: 'GitHub', icon: '🐙', action: 'github' },
  { name: 'Note', icon: '📝', action: 'note' },
  { name: 'Terminal', icon: '⌨️', action: 'cli' },
  { name: 'LinkedIn', icon: '💼', href: 'https://www.linkedin.com/in/rohit-pandey-bb9468355' },
  { name: 'Email', icon: '✉️', href: 'mailto:rp5120523@gmail.com' },
]

const Finder = ({ windowName, setWindowsState, setMinimizedState, setFocusedWindow, isFocused, onFocus, onMinimize }) => {
  const openApp = (action) => {
    const item = items.find(i => i.action === action)
    if (item && !item.href) {
      setWindowsState(s => ({ ...s, [action]: true }))
      setMinimizedState(s => ({ ...s, [action]: false }))
      setFocusedWindow?.(action)
    }
  }

  return (
    <MacWindow
      width="32vw"
      height="50vh"
      windowName={windowName}
      title="Finder"
      setWindowsState={setWindowsState}
      isFocused={isFocused}
      onFocus={onFocus}
      onMinimize={onMinimize}
    >
      <div className="finder-window">
        <div className="finder-sidebar">
          <div className="sidebar-section">
            <span className="sidebar-label">Favorites</span>
            <div className="sidebar-item">Documents</div>
            <div className="sidebar-item">Downloads</div>
            <div className="sidebar-item">Projects</div>
          </div>
        </div>
        <div className="finder-content">
          <h3 className="finder-heading">Documents</h3>
          <div className="finder-grid">
            {items.map((item) => (
              <div
                key={item.name}
                className="finder-item"
                onClick={() => item.href ? window.open(item.href, '_blank') : openApp(item.action)}
              >
                <span className="finder-item-icon">{item.icon}</span>
                <span className="finder-item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MacWindow>
  )
}

export default Finder
