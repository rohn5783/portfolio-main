import React, { useRef } from 'react'
import { Rnd } from 'react-rnd'
import "./window.scss"


const MacWindow = ({ children, width = "40vw", height = "40vh", windowName, title, setWindowsState, isFocused, onFocus, onMinimize }) => {
    const windowRef = useRef(null)

    const handleClose = () => {
        setWindowsState(state => ({ ...state, [windowName]: false }))
    }

    const handleMinimize = () => {
        if (onMinimize) {
            onMinimize()
        } else {
            setWindowsState(state => ({ ...state, [windowName]: false }))
        }
    }

    const handleMaximize = () => {
        const el = windowRef.current
        if (!el) return
        if (!document.fullscreenElement) {
            el.requestFullscreen?.()
        } else {
            document.exitFullscreen?.()
        }
    }

    return (
        <Rnd
            default={{
                width: width,
                height: height,
                x: 300,
                y: 200
            }}
            onMouseDown={onFocus}
            style={{ zIndex: isFocused ? 100 : 50 }}
        >
            <div className={`window ${isFocused ? 'window--focused' : ''}`} ref={windowRef}>
                <div className="nav">
                    <div className="window-controls">
                        <button type="button" className="window-btn close" onClick={handleClose} aria-label="Close">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                            </svg>
                        </button>
                        <button type="button" className="window-btn minimize" onClick={handleMinimize} aria-label="Minimize">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 4h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button type="button" className="window-btn maximize" onClick={handleMaximize} aria-label="Maximize">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                                <rect x="0.5" y="0.5" width="7" height="7" rx="0.5" />
                            </svg>
                        </button>
                    </div>

                    <div className="title"><p>{title ?? windowName}</p></div>

                </div>
                <div className="main-content">
                    {children}
                </div>
            </div>
        </Rnd>
    )
}

export default MacWindow