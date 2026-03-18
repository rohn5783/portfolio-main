import React, { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import "./dock.scss"

const ICON_ANIMATIONS = {
    open: {
        scale: [1, 0.94, 1.2, 0.98, 1],
        y: [0, 2, -16, -6, 0],
        rotate: [0, 0, -3, 2, 0]
    },
    close: {
        scale: [1, 1.08, 0.84, 0.96, 1],
        y: [0, -4, 10, 3, 0],
        rotate: [0, 2, -4, 1, 0]
    },
    minimize: {
        scale: [1, 0.96, 0.88, 1.05, 1],
        y: [0, 8, -12, -4, 0],
        rotate: [0, 1, -2, 1, 0]
    },
    idle: {
        scale: 1,
        y: 0,
        rotate: 0
    }
}

function DockIcon({ iconClass, imgSrc, onClick, isRunning, animationType, animationStamp }) {
    const MotionImg = motion.img
    const controls = useAnimationControls()

    useEffect(() => {
        const runAnimation = async () => {
            if (!animationType) {
                await controls.start(ICON_ANIMATIONS.idle)
                return
            }

            await controls.start(ICON_ANIMATIONS.idle)
            await controls.start(ICON_ANIMATIONS[animationType] ?? ICON_ANIMATIONS.idle, {
                duration: animationType === 'close' ? 0.5 : animationType === 'minimize' ? 0.55 : 0.65,
                ease: [0.22, 1, 0.36, 1]
            })
            await controls.start(ICON_ANIMATIONS.idle)
        }

        runAnimation()
    }, [animationType, animationStamp, controls])

    return (
        <div
            onClick={onClick}
            className={`icon ${iconClass} ${isRunning ? 'running' : ''}`}
        >
            <MotionImg
                src={imgSrc}
                alt=""
                initial={ICON_ANIMATIONS.idle}
                animate={controls}
            />
        </div>
    )
}

const Dock = ({ windowsState, setWindowsState, minimizedState, setMinimizedState, setFocusedWindow, setWindowActions, iconAnimation, playIconAnimation }) => {
    const openOrRestore = (key) => {
        setWindowActions?.(state => ({ ...state, [key]: null }))
        if (!windowsState[key]) {
            setWindowsState(s => ({ ...s, [key]: true }))
            setMinimizedState(s => ({ ...s, [key]: false }))
            setFocusedWindow(key)
            playIconAnimation?.(key, 'open')
        } else if (minimizedState[key]) {
            setMinimizedState(s => ({ ...s, [key]: false }))
            setFocusedWindow(key)
            playIconAnimation?.(key, 'open')
        } else {
            setFocusedWindow(key)
        }
    }

    return (
        <footer className='dock'>
            <DockIcon
                iconClass="finder"
                imgSrc="/doc-icons/finder.svg"
                onClick={() => openOrRestore('finder')}
                isRunning={windowsState.finder}
                animationType={iconAnimation?.key === 'finder' ? iconAnimation.type : null}
                animationStamp={iconAnimation?.key === 'finder' ? iconAnimation.timestamp : null}
            />
            <DockIcon
                iconClass="github"
                imgSrc="/doc-icons/github.svg"
                onClick={() => openOrRestore('github')}
                isRunning={windowsState.github}
                animationType={iconAnimation?.key === 'github' ? iconAnimation.type : null}
                animationStamp={iconAnimation?.key === 'github' ? iconAnimation.timestamp : null}
            />
            <DockIcon
                iconClass="note"
                imgSrc="/doc-icons/note.svg"
                onClick={() => openOrRestore('note')}
                isRunning={windowsState.note}
                animationType={iconAnimation?.key === 'note' ? iconAnimation.type : null}
                animationStamp={iconAnimation?.key === 'note' ? iconAnimation.timestamp : null}
            />
            <DockIcon
                iconClass="pdf"
                imgSrc="/doc-icons/pdf.svg"
                onClick={() => openOrRestore('resume')}
                isRunning={windowsState.resume}
                animationType={iconAnimation?.key === 'resume' ? iconAnimation.type : null}
                animationStamp={iconAnimation?.key === 'resume' ? iconAnimation.timestamp : null}
            />
            <div
                onClick={() => window.open("https://calendar.google.com/", "_blank")}
                className="icon calender"
            >
                <img src="/doc-icons/calender.svg" alt="" />
            </div>
            <DockIcon
                iconClass="spotify"
                imgSrc="/doc-icons/spotify.svg"
                onClick={() => openOrRestore('spotify')}
                isRunning={windowsState.spotify}
                animationType={iconAnimation?.key === 'spotify' ? iconAnimation.type : null}
                animationStamp={iconAnimation?.key === 'spotify' ? iconAnimation.timestamp : null}
            />
            <div
                onClick={() => window.open("mailto:web3developer.rohit@gmail.com", "_blank")}
                className="icon mail"
            >
                <img src="/doc-icons/mail.svg" alt="" />
            </div>
            <div
                onClick={() => window.open("https://www.linkedin.com/in/rohit-pandey-bb9468355", "_blank")}
                className="icon link"
            >
                <img src="/doc-icons/link.svg" alt="" />
            </div>
            <DockIcon
                iconClass="cli"
                imgSrc="/doc-icons/cli.svg"
                onClick={() => openOrRestore('cli')}
                isRunning={windowsState.cli}
                animationType={iconAnimation?.key === 'cli' ? iconAnimation.type : null}
                animationStamp={iconAnimation?.key === 'cli' ? iconAnimation.timestamp : null}
            />
        </footer>
    )
}

export default Dock
