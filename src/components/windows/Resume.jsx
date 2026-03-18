import React from 'react'
import MacWindow from './MacWindow'
import "./resume.scss"

const Resume = ({ windowName, title, setWindowsState, isFocused, onFocus, onMinimize, windowAction, onWindowActionComplete, onClose }) => {
    return (
        <MacWindow windowName={windowName} title={title} setWindowsState={setWindowsState} isFocused={isFocused} windowAction={windowAction} onFocus={onFocus} onMinimize={onMinimize} onWindowActionComplete={onWindowActionComplete} onClose={onClose} >
            <div className="resume-window">
                <embed src="/resume.pdf" frameborder="0"></embed>
            </div>
        </MacWindow>
    )
}

export default Resume
