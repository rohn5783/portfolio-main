import React, { useEffect } from 'react'
import "./about-modal.scss"

const AboutModal = ({ onClose }) => {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="about-modal-backdrop" onClick={onClose}>
      <div className="about-modal" onClick={e => e.stopPropagation()}>
        <div className="about-modal-header">
          <div className="about-logo">◆</div>
          <h2>About This Mac</h2>
        </div>
        <div className="about-modal-body">
          <p className="about-name">Rohit Pandey</p>
          <p className="about-role">Backend-Focused Full Stack Developer</p>
          <p className="about-stack">Node.js · React · MongoDB · Rust</p>
          <p className="about-links">
            <a href="https://github.com/rohitn5783" target="_blank" rel="noopener noreferrer">GitHub</a>
            {' · '}
            <a href="https://www.linkedin.com/in/rohit-pandey-bb9468355" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </div>
        <div className="about-modal-footer">
          <button type="button" className="about-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  )
}

export default AboutModal
