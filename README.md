# ✒️ Journal

A minimalist, paper-inspired personal journaling web app — beautifully simple, entirely private, and powered by AI when you need it.

![Journal App](https://img.shields.io/badge/Made_With-HTML%20%2B%20CSS%20%2B%20JS-f5f0e8?style=for-the-badge&labelColor=8b5e3c)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## Why Journaling Matters

Journaling is one of the most powerful tools for personal growth, mental clarity, and emotional wellbeing. It's not just writing — it's a conversation with yourself.

### 🧠 Mental Health & Emotional Wellbeing
Research consistently shows that **expressive writing reduces stress, anxiety, and symptoms of depression**. When you put your thoughts on paper, you externalize what's tangled inside your mind. This simple act creates distance between you and your worries, making them feel more manageable. Studies from the University of Texas found that journaling about stressful events for just 15–20 minutes a day can significantly improve both mental and physical health.

### 🪞 Self-Awareness & Reflection
Journaling acts as a mirror. By reviewing your own words over days, weeks, and months, you begin to notice **patterns in your thinking, recurring emotions, and behavioral habits** you might otherwise miss. This self-awareness is the foundation of personal change — you can't change what you don't notice.

### 🎯 Clarity & Decision-Making
When life feels overwhelming, writing brings order to chaos. Putting a complex problem into words forces you to **organize your thoughts logically**, often revealing solutions that were hidden in the noise. Many of history's greatest thinkers — from Marcus Aurelius to Virginia Woolf — were dedicated journalers.

### 💪 Resilience & Gratitude
Regular journaling builds emotional resilience. By documenting both challenges and victories, you create a **personal record of growth** that you can look back on during difficult times. Gratitude journaling in particular has been shown to increase happiness, improve sleep, and strengthen relationships.

### 🔒 A Safe, Private Space
Unlike social media, a journal has no audience, no likes, no judgment. It's a space where you can be **completely honest** with yourself — where you can process grief, celebrate quietly, work through confusion, or simply record the texture of an ordinary day. That honesty is what makes journaling transformative.

> *"Journal writing is a voyage to the interior."* — Christina Baldwin

---

## Features

| Feature | Description |
|---------|-------------|
| 📄 **Paper Design** | Clean, warm parchment aesthetic that makes writing feel intentional |
| ✒️ **Handwritten Serif Font** | Cormorant Garamond — an elegant serif typeface with a literary feel |
| 🌗 **Light & Dark Theme** | Automatically follows your system preference (`prefers-color-scheme`) |
| ✏️ **Rich Text Editing** | Bold, italic, underline, strikethrough, hyperlinks, bullet & numbered lists |
| 📋 **Sidebar** | Lists all entries with title and date; toggle newest/oldest sort order |
| 💾 **JSON Persistence** | All entries saved in a single `journal.json` file — download to back up, drag-and-drop or file picker to restore |
| 🔄 **LocalStorage Cache** | Entries persist automatically between sessions without needing to save to file |
| 🤖 **AI Insights** | Connect any OpenAI-compatible API to analyze mood, recurring themes, and mental health patterns across all your entries |
| ⌨️ **Keyboard Shortcuts** | `Cmd/Ctrl+S` save, `Cmd/Ctrl+K` insert link, `Esc` close modals |
| 📱 **Responsive** | Sidebar collapses to a hamburger menu on mobile devices |

---

## Getting Started

### 1. Open Locally

Simply open `index.html` in any modern browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

No build step. No dependencies. No server required.

### 2. Host on the Web

Upload the three files (`index.html`, `style.css`, `app.js`) to any static hosting provider:
- GitHub Pages
- Netlify
- Vercel
- Any web server

---

## How It Works

### Writing & Formatting

Click the paper area and start writing. Use the toolbar or keyboard shortcuts:

| Action | Toolbar | Shortcut |
|--------|---------|----------|
| Bold | **B** | `Cmd/Ctrl + B` |
| Italic | *I* | `Cmd/Ctrl + I` |
| Underline | U̲ | `Cmd/Ctrl + U` |
| Strikethrough | ~~S~~ | Toolbar only |
| Insert Link | 🔗 | `Cmd/Ctrl + K` |
| Save Entry | Save | `Cmd/Ctrl + S` |

### Saving & Loading

All entries are stored in a **single JSON file** (`journal.json`) with this structure:

```json
{
  "entries": [
    {
      "id": "a1b2-c3d4-4e5f-kx7m8n9o",
      "title": "My First Entry",
      "content": "<p>Today was a wonderful day...</p>",
      "createdAt": "2026-03-12T02:21:00.000Z",
      "updatedAt": "2026-03-12T02:21:00.000Z"
    }
  ]
}
```

- **Save to file**: Click **💾 Save journal.json** — downloads the file to your computer
- **Load from file**: Click **📂 Load journal.json** or **drag-and-drop** the file onto the page
- **Auto-cache**: Entries are also stored in `localStorage` so they persist between browser sessions automatically

### AI Insights

1. Click **✨ AI Insights** in the sidebar
2. Enter your API key (OpenAI or any compatible provider)
3. Optionally change the endpoint URL and model name
4. Click **Analyze My Journal**

The AI will read all your entries and provide:
- **Overall Mood Summary** — the emotional tone across your writing
- **Mood Trend** — whether things are improving, declining, or stable
- **Recurring Themes** — patterns and topics that come up repeatedly
- **Mental Health Observations** — gentle flags for stress, burnout, anxiety, or positive growth
- **Suggestions** — actionable tips to support your wellbeing

> Your API key is stored in your browser's `localStorage` only — it is never sent anywhere except directly to the API endpoint you configure.

---

## Tech Stack

- **HTML5** — semantic structure
- **Vanilla CSS** — custom properties, `prefers-color-scheme`, responsive layout
- **Vanilla JavaScript** — zero dependencies, `contenteditable` rich text editor
- **Google Fonts** — [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (editor) + [Inter](https://fonts.google.com/specimen/Inter) (UI)

---

## Project Structure

```
Journal/
├── index.html    # App shell, sidebar, toolbar, modals
├── style.css     # Paper design, light/dark theme, animations
├── app.js        # Editor logic, persistence, AI integration
└── README.md     # This file
```

---

## Privacy

This app is **100% client-side**. Your journal entries never leave your device unless you explicitly:
1. Download the `journal.json` file and share it
2. Use the AI Insights feature (which sends entry text to the API endpoint you configure)

No analytics. No tracking. No server. Your thoughts are yours.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
