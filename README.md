# YouTube Video Summarizer 🎥✨

An AI-powered web application that generates concise summaries for YouTube videos. It handles videos with existing captions and falls back to audio transcription for those without. Built with a Node.js backend and a modern React frontend.

## 🚀 Features

- **Automatic Transcription**: Fetches existing YouTube transcripts (captions).
- **Audio Fallback**: Automatically downloads audio using `yt-dlp` and transcribes it using **Groq Whisper** if captions are unavailable.
- **AI Summarization**: Uses **Groq (Llama 3.3 70B)** to generate insightful bullet-point summaries.
- **Rate Limiting**: Prevents abuse by limiting usage to 1 request every 3 minutes per IP.
- **Responsive UI**: A modern, dark-themed React interface with a split-view layout.

## 🛠️ Tech Stack

**Backend:**

- Node.js & Express
- `youtube-transcript` (Primary Transcript Fetcher)
- `yt-dlp` (Audio Download Fallback)
- `axios` & `form-data` (API Requests)
- `express-rate-limit` (API Protection)

**Frontend:**

- React (Vite)
- Vanilla CSS (Modern Dark Theme)

**AI Services:**

- [Groq API](https://groq.com/) (Whisper for Audio & Llama 3 for Summaries)

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- A **Groq API Key** (Get one at [console.groq.com](https://console.groq.com))
- **yt-dlp**: The backend automatically downloads `yt-dlp.exe` if not present, but having it installed generally is good practice.

## ⚙️ Installation & Setup

### 1. Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your Groq API Key:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```
4.  Run the setup script (optional, usually handled automatically on first run, but good for verification):
    ```bash
    node setup_ytdlp.js
    ```
5.  Start the server:
    ```bash
    npm start
    ```
    _The server runs on `http://localhost:3000`_

### 2. Frontend Setup

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    _The app runs on `http://localhost:5173`_

## 📖 Usage

1.  Open the frontend URL (`http://localhost:5173`).
2.  Paste a valid YouTube video URL into the input field.
3.  Click **"Summarize Video"**.
4.  Wait for the process to complete (can take a minute if audio download/transcription is needed).
5.  View the generated summary in the right-hand panel.

## ⚠️ Notes

- **Rate Limit**: You can only summarize one video every 3 minutes. If you hit the limit, wait a moment and try again.
- **Audio Download**: For videos without captions, the server downloads audio temporarily. This requires the server IP to not be blocked by YouTube (standard `yt-dlp` restrictions apply).

## 📄 License

This project is open-source. Feel free to modify and distribute.
