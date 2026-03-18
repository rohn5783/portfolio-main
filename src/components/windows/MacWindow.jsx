import React, { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Rnd } from 'react-rnd'
import "./window.scss"


const ENTRY_ANIMATION = { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' }
const INITIAL_ANIMATION = { opacity: 0, scale: 0.9, x: 0, y: 24, filter: 'blur(10px)' }
const EXIT_ANIMATIONS = {
    close: { opacity: 0, scale: 0.94, x: 0, y: 18, filter: 'blur(8px)' },
    minimize: { opacity: 0.18, scale: 0.2, x: 0, y: 280, filter: 'blur(4px)' }
}

const MacWindow = ({ children, width = "40vw", height = "40vh", windowName, title, setWindowsState, isFocused, windowAction, onFocus, onMinimize, onClose, onWindowActionComplete }) => {
    const windowRef = useRef(null)
    const MotionDiv = motion.div
    const controls = useAnimationControls()
    const isExitingRef = useRef(false)

    const handleClose = () => {
        if (onClose) {
            onClose()
            return
        }
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

    useEffect(() => {
        controls.set(INITIAL_ANIMATION)
        controls.start(ENTRY_ANIMATION, {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1]
        })
    }, [controls])

    useEffect(() => {
        if (!windowAction || isExitingRef.current) return

        const runExitAnimation = async () => {
            isExitingRef.current = true
            await controls.start(EXIT_ANIMATIONS[windowAction] ?? EXIT_ANIMATIONS.close, {
                duration: windowAction === 'minimize' ? 0.32 : 0.24,
                ease: [0.32, 0, 0.2, 1]
            })
            onWindowActionComplete?.(windowAction)
        }

        runExitAnimation()
    }, [controls, onWindowActionComplete, windowAction])

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
            <MotionDiv
                className={`window ${isFocused ? 'window--focused' : ''}`}
                ref={windowRef}
                initial={INITIAL_ANIMATION}
                animate={controls}
            >
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
            </MotionDiv>
        </Rnd>
    )
}

export default MacWindow
