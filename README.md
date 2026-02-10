# macOS Portfolio

A macOS-style developer portfolio built with React. The entire site mimics a Mac desktop: menu bar, dock, draggable windows, and system-style interactions—all in the browser.

---

## Features

- **Desktop UI** – Menu bar (Apple, File, Window, Terminal), dock with app icons, and draggable/resizable windows
- **Apps**
  - **Finder** – Quick links to Resume, GitHub, Note, Terminal, LinkedIn, and Email
  - **GitHub** – Project cards loaded from `src/assets/github.json`
  - **Note** – Renders markdown from `public/note.txt` with syntax highlighting
  - **Resume** – Embedded PDF viewer for `public/resume.pdf`
  - **Spotify** – Embedded Spotify playlist
  - **Terminal (CLI)** – Interactive terminal with custom commands (about, skills, projects, contact, etc.)
- **Window behavior** – Close, minimize (to dock), maximize (fullscreen), per-window titles, focus/bring-to-front
- **Dock** – Running indicator (dot under open apps), bounce on open/restore, click to open or restore minimized windows
- **Menu bar** – Apple menu (About This Mac, theme toggle), File (New Finder/Note, Open Resume), Window (list and focus open windows)
- **Light & dark theme** – Toggle from Apple menu; preference saved in `localStorage`
- **Keyboard shortcuts** – `Cmd/Ctrl + W` (close), `Cmd/Ctrl + M` (minimize)
- **External links** – Calendar, Mail, LinkedIn open in new tabs

---

## Tech Stack

| Category    | Technology |
|------------|------------|
| Framework  | React 19 + Vite 7 |
| Styling   | SCSS (Sass) |
| UI        | react-rnd (draggable/resizable windows) |
| Terminal  | react-console-emulator |
| Content   | react-markdown, react-syntax-highlighter |

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** (comes with Node) or **yarn** / **pnpm**

Check versions:

```bash
node -v   # v18.x or higher
npm -v
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mac-os-main.git
cd mac-os-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Then open **http://localhost:5173** (or the URL shown in the terminal).

### 4. Build for production

```bash
npm run build
```

Output is in the `dist/` folder. Preview the production build:

```bash
npm run preview
```

### 5. Lint

```bash
npm run lint
```

---

## Project Structure

```
mac-os-main/
├── public/                    # Static assets (served at /)
│   ├── doc-icons/             # Dock app icons (SVG)
│   │   ├── finder.svg
│   │   ├── github.svg
│   │   ├── note.svg
│   │   ├── pdf.svg
│   │   ├── spotify.svg
│   │   ├── cli.svg
│   │   ├── calender.svg
│   │   ├── mail.svg
│   │   ├── link.svg
│   │   └── ...
│   ├── navbar-icons/
│   │   ├── apple.svg
│   │   ├── wifi.svg
│   │   └── mac-wallpaper.jpg  # Desktop wallpaper
│   ├── note.txt               # Markdown content for Note app
│   └── resume.pdf             # PDF for Resume app
├── src/
│   ├── App.jsx                # Root: state, theme, windows, shortcuts
│   ├── app.scss               # Global layout + wallpaper
│   ├── theme.scss             # CSS variables (dark / light theme)
│   ├── main.jsx
│   ├── assets/
│   │   └── github.json        # GitHub project cards data
│   └── components/
│       ├── Nav.jsx            # Menu bar + dropdowns
│       ├── nav.scss
│       ├── Dock.jsx           # Dock + icons
│       ├── dock.scss
│       ├── DateTime.jsx       # Live date/time in menu bar
│       ├── AboutModal.jsx     # “About This Mac” modal
│       ├── about-modal.scss
│       └── windows/
│           ├── MacWindow.jsx  # Shared window chrome (title bar, controls)
│           ├── window.scss
│           ├── Finder.jsx
│           ├── finder.scss
│           ├── Github.jsx
│           ├── github.scss
│           ├── Note.jsx
│           ├── note.scss
│           ├── Resume.jsx
│           ├── resume.scss
│           ├── Spotify.jsx
│           ├── spotify.scss
│           ├── Cli.jsx         # Terminal + commands
│           └── cli.scss
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Customization

### Wallpaper

- Replace `public/navbar-icons/mac-wallpaper.jpg` with your own image.
- Or change the URL in `src/app.scss`:

```scss
background-image: url(/navbar-icons/your-image.jpg);
```

### Resume

- Replace `public/resume.pdf` with your resume PDF (keep the filename or update references in the app if you rename it).

### Note (markdown)

- Edit `public/note.txt` with your markdown. The Note app fetches it and renders it with syntax highlighting.

### GitHub projects

- Edit `src/assets/github.json`. Each item can have:
  - `id` – number
  - `image` – image URL
  - `title` – string
  - `description` – string
  - `tags` – array of strings
  - `repoLink` – GitHub (or other) URL
  - `demoLink` – optional demo URL

Example:

```json
{
  "id": 1,
  "image": "https://example.com/screenshot.png",
  "title": "My Project",
  "description": "Short description.",
  "tags": ["React", "Node.js"],
  "repoLink": "https://github.com/you/repo",
  "demoLink": "https://your-demo.com"
}
```

### Terminal (CLI) commands

- Edit `src/components/windows/Cli.jsx`. The `commands` object defines each command (e.g. `about`, `skills`, `projects`, `contact`, `github`, `resume`, `echo`). Adjust the `fn` and text to match your info.

### Links (Finder, Dock, About)

- **Finder** – In `src/components/windows/Finder.jsx`, update the `items` array (e.g. LinkedIn URL, `mailto:`).
- **Dock** – In `src/components/Dock.jsx`, update:
  - Calendar: `window.open("https://calendar.google.com/", "_blank")`
  - Mail: `window.open("mailto:your@email.com", "_blank")`
  - LinkedIn: `window.open("https://www.linkedin.com/in/your-profile", "_blank")`
- **About modal** – In `src/components/AboutModal.jsx`, change name, role, stack, and GitHub/LinkedIn links.

### Spotify playlist

- In `src/components/windows/Spotify.jsx`, replace the `src` URL of the iframe with your own Spotify embed URL (e.g. from Share → Embed playlist).

### Theme

- Light/dark is toggled from **Apple menu → Switch to Light Theme / Switch to Dark Theme**.
- Theme is stored in `localStorage` under the key `mac-os-theme`.
- Colors are in `src/theme.scss` (CSS variables for `:root` and `[data-theme="light"]`). Adjust variables there to change the look.

### Menu bar name

- In `src/components/Nav.jsx`, the first nav item after the Apple icon can be changed from “Rohit Pandey” to your name (or removed) by editing the JSX.

---

## Deployment

### Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Use default settings (Vite is auto-detected). Deploy.

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy.

### Other hosts

- Run `npm run build`, then upload the contents of `dist/` to any static hosting (GitHub Pages, Cloudflare Pages, etc.).

---

## Browser Support

- Modern browsers with ES modules and CSS custom properties (Chrome, Firefox, Safari, Edge).
- Best experience on desktop; layout is not optimized for small mobile screens.

---

## License

MIT (or your chosen license). If you use this template, a credit or link back is appreciated.

---

## Credits

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/).
- Window dragging/resizing: [react-rnd](https://github.com/bokuweb/react-rnd).
- Terminal UI: [react-console-emulator](https://github.com/linuswillner/react-console-emulator).
