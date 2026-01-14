# AI Study Helper

A full-stack intelligent study assistant that allows you to upload notes, manage them, and ask context-aware questions using Cohere AI.

## Features
- **User Authentication**: Secure Login and Registration system.
- **Note Management**: Upload and store PDF or Text file notes.
- **Context-Aware Q&A**: Ask questions specifically about a selected note.
- **AI Formatting**: Get smart summaries of your uploaded notes.
- **Dashboard**: Track and manage all your study materials in one place.
- **Modern UI**: Fully responsive, glassmorphism-inspired design.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, Cohere AI SDK
- **Frontend**: React, Vite, Context API, Vanilla CSS (Glassmorphism)
- **Authentication**: JWT & Bcrypt
- **File Handling**: Multer & PDF-Parse

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or via Atlas)
- A Cohere API Key (Get one at [dashboard.cohere.com](https://dashboard.cohere.com))

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/ai-study-helper  # Or your Atlas URI
   JWT_SECRET=your_jwt_secret_key_here
   COHERE_API_KEY=your_cohere_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   Server runs on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

## Usage
1. **Register** a new account.
2. Go to the **Dashboard**.
3. **Upload** a PDF or Text file containing your notes.
4. Click **Study** on any note card.
5. In the Study View:
   - Click **Generate Summary** to get a quick overview.
   - Type a question to ask specifically about that note.
   - Or, go back and paste text manually if you prefer.
