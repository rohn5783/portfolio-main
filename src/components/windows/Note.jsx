import React, { useEffect, useMemo, useRef, useState } from 'react'
import MacWindow from './MacWindow'
import "./note.scss"

const NOTES_STORAGE_KEY = 'portfolio-notes'

const createNote = (overrides = {}) => {
  const now = new Date().toISOString()

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: 'Untitled Note',
    content: '',
    createdAt: now,
    updatedAt: now,
    ...overrides
  }
}

const getPreview = (content) => {
  const cleaned = content.replace(/\s+/g, ' ').trim()
  return cleaned || 'No additional text yet.'
}

const formatTimestamp = (value) => {
  if (!value) return 'Just now'

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(value))
  } catch {
    return 'Just now'
  }
}

const Note = ({
  windowName,
  title,
  setWindowsState,
  isFocused,
  onFocus,
  onMinimize,
  windowAction,
  onWindowActionComplete,
  onClose
}) => {
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saveState, setSaveState] = useState('saved')
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const initializeNotes = async () => {
      try {
        const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY)

        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes)

          if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
            if (!isMounted) return
            setNotes(parsedNotes)
            setSelectedNoteId(parsedNotes[0].id)
            hasHydratedRef.current = true
            setIsLoading(false)
            return
          }
        }
      } catch {
        // Ignore malformed storage payloads and fall back to starter content.
      }

      let starterContent = ''

      try {
        const response = await fetch('/note.txt')
        starterContent = await response.text()
      } catch {
        starterContent = ''
      }

      if (!isMounted) return

      const starterNote = createNote({
        title: 'Welcome Note',
        content: starterContent.trim() || 'Start typing here to create your first note.'
      })

      setNotes([starterNote])
      setSelectedNoteId(starterNote.id)
      hasHydratedRef.current = true
      setIsLoading(false)
    }

    initializeNotes()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!hasHydratedRef.current || notes.length === 0) return

    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
      const timeoutId = window.setTimeout(() => {
        setSaveState('saved')
      }, 180)

      return () => window.clearTimeout(timeoutId)
    } catch {
      setSaveState('error')
    }
  }, [notes])

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? notes[0] ?? null,
    [notes, selectedNoteId]
  )

  useEffect(() => {
    if (!selectedNote && notes[0]) {
      setSelectedNoteId(notes[0].id)
    }
  }, [notes, selectedNote])

  const handleCreateNote = () => {
    const newNote = createNote({
      title: `Note ${notes.length + 1}`,
      content: ''
    })

    setSaveState('saving')
    setNotes((currentNotes) => [newNote, ...currentNotes])
    setSelectedNoteId(newNote.id)
  }

  const handleDeleteNote = () => {
    if (!selectedNote) return

    setSaveState('saving')
    const remainingNotes = notes.filter((note) => note.id !== selectedNote.id)

    if (remainingNotes.length > 0) {
      setNotes(remainingNotes)
      setSelectedNoteId(remainingNotes[0].id)
      return
    }

    const freshNote = createNote()
    setNotes([freshNote])
    setSelectedNoteId(freshNote.id)
  }

  const updateSelectedNote = (changes) => {
    if (!selectedNote) return

    setSaveState('saving')

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              ...changes,
              updatedAt: new Date().toISOString()
            }
          : note
      )
    )
  }

  return (
    <MacWindow
      windowName={windowName}
      title={title}
      width="58vw"
      height="68vh"
      setWindowsState={setWindowsState}
      isFocused={isFocused}
      windowAction={windowAction}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onWindowActionComplete={onWindowActionComplete}
      onClose={onClose}
    >
      <div className="note-window">
        <aside className="note-sidebar">
          <div className="note-sidebar-top">
            <div>
              <p className="note-eyebrow">Workspace</p>
              <h2>Notes</h2>
            </div>
            <button type="button" className="note-create-btn" onClick={handleCreateNote}>
              New Note
            </button>
          </div>

          <div className="note-list">
            {isLoading ? (
              <div className="note-card note-card-placeholder">Loading notes...</div>
            ) : (
              notes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className={`note-card ${selectedNote?.id === note.id ? 'note-card-active' : ''}`}
                  onClick={() => setSelectedNoteId(note.id)}
                >
                  <div className="note-card-head">
                    <strong>{note.title || 'Untitled Note'}</strong>
                    <span>{formatTimestamp(note.updatedAt)}</span>
                  </div>
                  <p>{getPreview(note.content)}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="note-editor">
          {selectedNote ? (
            <>
              <div className="note-editor-toolbar">
                <div className="note-meta">
                  <span className={`note-save-badge note-save-${saveState}`}>{saveState === 'error' ? 'Save failed' : saveState === 'saving' ? 'Saving...' : 'Saved'}</span>
                  <span>Updated {formatTimestamp(selectedNote.updatedAt)}</span>
                </div>

                <button type="button" className="note-delete-btn" onClick={handleDeleteNote}>
                  Delete
                </button>
              </div>

              <input
                className="note-title-input"
                type="text"
                value={selectedNote.title}
                placeholder="Untitled Note"
                onChange={(e) => updateSelectedNote({ title: e.target.value })}
              />

              <textarea
                className="note-body-input"
                value={selectedNote.content}
                placeholder="Write down ideas, todos, links, or anything you want to keep around."
                onChange={(e) => updateSelectedNote({ content: e.target.value })}
              />
            </>
          ) : (
            <div className="note-empty-state">
              <h3>No note selected</h3>
              <p>Create a note to start writing.</p>
            </div>
          )}
        </section>
      </div>
    </MacWindow>
  )
}

export default Note
