import React from 'react'
import "./dock.scss"

function DockIcon({ iconClass, imgSrc, onClick, isRunning, bounce }) {
    return (
        <div
            onClick={onClick}
            className={`icon ${iconClass} ${isRunning ? 'running' : ''} ${bounce ? 'bounce' : ''}`}
        >
            <img src={imgSrc} alt="" />
        </div>
    )
}

const Dock = ({ windowsState, setWindowsState, minimizedState, setMinimizedState, setFocusedWindow, bounceIcon, setBounceIcon }) => {
    const openOrRestore = (key) => {
        if (!windowsState[key]) {
            setWindowsState(s => ({ ...s, [key]: true }))
            setMinimizedState(s => ({ ...s, [key]: false }))
            setFocusedWindow(key)
            setBounceIcon?.(key)
        } else if (minimizedState[key]) {
            setMinimizedState(s => ({ ...s, [key]: false }))
            setFocusedWindow(key)
            setBounceIcon?.(key)
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
                bounce={bounceIcon === 'finder'}
            />
            <DockIcon
                iconClass="github"
                imgSrc="/doc-icons/github.svg"
                onClick={() => openOrRestore('github')}
                isRunning={windowsState.github}
                bounce={bounceIcon === 'github'}
            />
            <DockIcon
                iconClass="note"
                imgSrc="/doc-icons/note.svg"
                onClick={() => openOrRestore('note')}
                isRunning={windowsState.note}
                bounce={bounceIcon === 'note'}
            />
            <DockIcon
                iconClass="pdf"
                imgSrc="/doc-icons/pdf.svg"
                onClick={() => openOrRestore('resume')}
                isRunning={windowsState.resume}
                bounce={bounceIcon === 'resume'}
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
                bounce={bounceIcon === 'spotify'}
            />
            <div
                onClick={() => window.open("mailto:ankur@example.com", "_blank")}
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
                bounce={bounceIcon === 'cli'}
            />
        </footer>
    )
}

export default Dock