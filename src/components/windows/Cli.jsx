import React from 'react'
import MacWindow from './MacWindow'
import Terminal from 'react-console-emulator'
import "./cli.scss"

const Cli = ({ windowName, title, setWindowsState, isFocused, onFocus, onMinimize }) => {

    const commands = {
        about: {
            description: 'About me',
            usage: 'about',
            fn: () => `Backend-focused Full Stack Developer passionate about building scalable applications and production-ready APIs.

Currently mastering Node.js, Express, MongoDB, and React while expanding into systems programming with Rust.

Strong believer in consistency, clean code, and real-world project building.`
        },

        skills: {
            description: 'List technical skills',
            usage: 'skills',
            fn: () => `⚡ Languages:
JavaScript | TypeScript (Basic) | Rust (Learning)

🚀 Backend:
Node.js | Express.js | REST APIs | JWT Auth | MVC Architecture

🎨 Frontend:
React.js | HTML | CSS | TailwindCSS

🗄 Databases:
MongoDB | Schema Design

🛠 Tools:
Git | GitHub | Postman | Linux | Vercel | Docker (Fundamentals)`
        },

        projects: {
            description: 'View my projects',
            usage: 'projects',
            fn: () => `🔥 Full Stack Task Management App
   → Secure authentication + scalable REST APIs

⚡ CLI Todo Application
   → Command-line productivity tool with CRUD operations

🌐 Developer Portfolio (Live)
   → Modern responsive portfolio showcasing projects

🦀 Rust CLI Tools (Ongoing)
   → Exploring memory safety & high-performance systems`
        },

        contact: {
            description: 'Get contact information',
            usage: 'contact',
            fn: () => `📧 Email: web3developer.rohit@gmail.com
📱 Phone: +91 7488331383
📍 Location: Bihar, India

💼 LinkedIn:
www.linkedin.com/in/rohit-pandey-bb9468355`
        },

        github: {
            description: 'Open GitHub profile',
            usage: 'github',
            fn: () => {
                window.open('https://github.com/rohitn5783', '_blank')
                return 'Opening GitHub profile...'
            }
        },

        resume: {
            description: 'Download resume',
            usage: 'resume',
            fn: () => {
                window.open('/resume.pdf', '_blank') // place resume in public folder
                return 'Opening resume...'
            }
        },

        social: {
            description: 'View social links',
            usage: 'social',
            fn: () => `🐙 GitHub: github.com/rohitn5783
💼 LinkedIn: www.linkedin.com/in/rohit-pandey-bb9468355
🌐 Portfolio: web3rohit.dev`
        },

        goal: {
            description: 'See my career goal',
            usage: 'goal',
            fn: () => `🎯 Mission: Become a high-impact software engineer.

Focused on:
→ Backend mastery  
→ Scalable systems  
→ Advanced engineering skills  
→ Continuous growth`
        },

        echo: {
            description: 'Echo a passed string',
            usage: 'echo <string>',
            fn: (...args) => args.join(' ')
        }
    }

    // Tiranga-colored name for the header (Saffron | White | Green)
    const tirangaName = '<span style="color:#FF9933">Roh</span><span style="color:#FFFFFF">it</span> <span style="color:#FF9933">Pan</span><span style="color:#FFFFFF">de</span><span style="color:#138808">y</span>'
    const welcomeMessage = `<div style="white-space: pre-wrap; font-family: inherit;">
╔════════════════════════════════════════════╗
║        ${tirangaName} | Portfolio CLI        ║
╚════════════════════════════════════════════╝

Welcome to my interactive developer terminal 👨‍💻

I am a Backend-Focused Full Stack Developer who loves building scalable applications and solving real-world problems.

Type 'help' to explore commands.

⭐ Recommended:
  • about      → Who am I?
  • skills     → My tech stack
  • projects   → What I've built
  • goal       → Where I'm heading
  • contact    → Let's connect

Recruiters love terminals 😉
</div>`

    // Tiranga (Indian flag) colours: Saffron | White | Green
    const tirangaPrompt = (
        <>
            <span style={{ color: '#FF9933' }}>ro</span>
            <span style={{ color: '#FFFFFF' }}>h</span>
            <span style={{ color: '#138808' }}>it</span>
            <span style={{ color: '#00ff00' }}>@backend:~$</span>
        </>
    )

    return (
        <MacWindow windowName={windowName} title={title} setWindowsState={setWindowsState} isFocused={isFocused} onFocus={onFocus} onMinimize={onMinimize} >
            <div className="cli-window">
                <Terminal
                    commands={commands}
                    welcomeMessage={welcomeMessage}
                    dangerMode
                    promptLabel={tirangaPrompt}
                    promptLabelStyle={{ color: '#00ff00' }}
                />
            </div>
        </MacWindow>
    )
}

export default Cli
