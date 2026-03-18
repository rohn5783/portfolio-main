import React, { useEffect,useState } from 'react'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierDuneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import MacWindow from './MacWindow'
import "./note.scss"


const Note = ({ windowName, title, setWindowsState, isFocused, onFocus, onMinimize, windowAction, onWindowActionComplete, onClose }) => {

    const [ markdown, setMarkdown ] = useState(null)

    useEffect(() => {
        fetch("/note.txt")
            .then(res => res.text())
            .then(text => setMarkdown(text))
    }, [])

    return (
        <MacWindow windowName={windowName} title={title} setWindowsState={setWindowsState} isFocused={isFocused} windowAction={windowAction} onFocus={onFocus} onMinimize={onMinimize} onWindowActionComplete={onWindowActionComplete} onClose={onClose} >
            <div className="note-window">
                { markdown ? <SyntaxHighlighter language='typescript' style={atelierDuneDark} >{markdown}</SyntaxHighlighter> : <p>Loading...</p> }
            </div>
        </MacWindow>
    )
}

export default Note
