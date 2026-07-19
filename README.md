# Resume Roaster 🔥

A fun, interactive resume roasting chatbot with a premium dark-themed UI and real-time streaming replies. Upload your resume (PDF or DOCX), get a hilarious, brutal Hinglish roast powered by **Groq + Llama 3.3**, and chat back to argue or ask for actual advice!

---

## 🚀 Features

- **Brutal Hinglish Roasts**: Custom-tuned LLM persona that sounds like a stand-up comedian doing a friendly roast. Roman script (Hinglish) with desi comparisons, filmy references, and typical student banter.
- **Incremental SSE Streaming**: Modern, typewriter-style token streaming for the initial roast and all follow-up chat replies.
- **Premium Chat UI**: Dark glassmorphic panels, glowing accents (`#FF6B35` → `#FF2E63`), custom scrollbars, and fluid animations.
- **Drag-and-Drop Uploader**: Visual file upload zone with validation for PDF/DOCX (max 10MB) and upload feedback.
- **Graceful Error Recovery**: Catch-all stream error events that display exact backend issues (like Groq API rate limits) directly in a customized warning card.
- **Auto-Scrolling Chat**: Automatically scrolls to the newest tokens as they arrive, keeping the active message focused.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 + Custom CSS animations
- **Interactions**: Native Web SSE (`fetch` ReadableStream reader)

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **LLM Client**: Groq SDK (`llama-3.3-70b-versatile`)
- **PDF Extractor**: `pdfplumber` (layout-aware, handles columns nicely)
- **DOCX Extractor**: `python-docx` (extracts paragraphs and tables)
- **Server**: Uvicorn

---

## 📂 Project Structure

```
resume-roaster/
├── backend/
│   ├── main.py            # FastAPI endpoints, CORS, SSE generators
│   ├── groq_client.py     # Groq API client with stream support & exponential backoff
│   ├── extractor.py       # PDF & DOCX text extraction logic
│   ├── pyproject.toml     # Backend dependencies (managed by uv)
│   └── .env               # Groq API keys
│
└── frontend/
    ├── app/
    │   ├── globals.css    # Premium CSS design system, colors & keyframes
    │   ├── layout.js      # Font configuration, root layout & metadata
    │   ├── page.js        # Main state machine, fetch/stream logic
    │   └── components/    # Reusable modular UI components
    │       ├── LandingHero.js
    │       ├── FileUpload.js
    │       ├── ChatWindow.js
    │       ├── MessageBubble.js
    │       ├── ChatInput.js
    │       └── TypingIndicator.js
    └── public/            # Assets (like favicon.png)
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Python**: `>=3.12` installed (preferably managed using `uv`)
- **Node.js**: `>=18` installed (with `npm`)
- **Groq API Key**: Get one from the [Groq Console](https://console.groq.com/)

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create your `.env` file and add your Groq API Key:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   ```
3. Install dependencies and start the Uvicorn server:
   ```bash
   uv sync
   uv run uvicorn main:app --reload --port 8000
   ```
   *The backend will now be running on [http://localhost:8000](http://localhost:8000).*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will now be running on [http://localhost:3000](http://localhost:3000).*

---

## 💬 System Roast Rules

The roaster operates under a strict set of behavior guidelines:
1. **Savage but Safe**: Insults generic buzzwords, layout alignment, empty metrics, and tutorial projects. Never insults personal info, family, caste, or background.
2. **Roast First**: It will *only* roast on the initial upload. It will **not** give useful advice or suggestion tips unless the user explicitly asks for them in a follow-up chat message (e.g., *"theek hai bhai, ab solution bhi bata de"*).
3. **Desi Vibe**: Naturally mixes English and Hindi (Hinglish) using Roman script.

---

## ⚠️ API Limit & Error Handlers
If your Groq API hits a rate limit or falls over:
1. The backend catches the exception and sends a structured SSE event:
   ```json
   { "type": "error", "message": "Groq rate limit hit — try again in a moment." }
   ```
2. The frontend intercepts this and renders an inline warning card with a prompt asking the user to wait or try again later.

---


