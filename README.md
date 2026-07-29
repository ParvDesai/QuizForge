# QuizForge — AI-Powered Question Paper Generator

A full-stack application that helps teachers create structured question papers using AI. Describe your assignment requirements (or use voice input), and QuizForge generates a complete, formatted question paper with configurable question types, difficulty levels, answer keys, and rubrics.

---

## Features

- **AI Paper Generation** — Generates structured question papers using Google Gemini with support for MCQ, Short Answer, Long Answer, True/False, and Fill-in-the-Blanks
- **Voice Input** — Speak your assignment requirements and the AI parses them into form fields
- **File Context** — Upload PDF/TXT reference material that the AI uses to generate contextually relevant questions
- **Real-Time Updates** — Socket.IO pushes generation progress and results to the UI instantly
- **Per-Section & Per-Question Regeneration** — Regenerate individual sections or questions without redoing the entire paper
- **Refinement** — Give natural language instructions to refine an existing paper (e.g., "make the MCQs harder")
- **Answer Keys & Rubrics** — Optionally include model answers and marking criteria
- **Redis Caching** — Generated papers are cached for fast retrieval with automatic invalidation on updates
- **Async Job Processing** — BullMQ handles AI generation jobs with retry logic and exponential backoff
- **JWT Authentication** — Secure registration, login, and route protection with bcrypt password hashing
- **Print Mode** — Clean print-friendly paper layout

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose** | Data persistence |
| **Redis + ioredis** | Caching & BullMQ broker |
| **BullMQ** | Async job queue for AI generation |
| **Socket.IO** | Real-time event broadcasting |
| **Google Gemini AI** | LLM for question paper generation |
| **Zod** | Input validation & LLM output schema enforcement |
| **bcrypt + JWT** | Authentication |
| **Multer** | File upload handling |
| **pdf-parse** | PDF text extraction |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16 (React 19)** | App framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling |
| **Zustand** | State management |
| **React Hook Form + Zod** | Form handling & validation |
| **Socket.IO Client** | Real-time updates |
| **Lucide React** | Icons |
| **Web Speech API** | Voice input |

---

## Architecture

```
┌────────────────────┐         ┌─────────────────────────────────┐
│   Next.js Frontend │◄──────► │       Express API Server        │
│   (React 19)       │  HTTP   │                                 │
│                    │◄──────► │  ┌───────────┐  ┌────────────┐  │
│   Socket.IO Client │  WS    │  │  MongoDB   │  │   Redis    │  │
└────────────────────┘         │  └───────────┘  └─────┬──────┘  │
                               │                       │         │
                               │  ┌────────────────────┴──────┐  │
                               │  │  BullMQ Worker            │  │
                               │  │  ├─ generate              │  │
                               │  │  ├─ refine                │  │
                               │  │  ├─ regenerate            │  │
                               │  │  ├─ regenerate-section    │  │
                               │  │  └─ regenerate-question   │  │
                               │  └───────────┬───────────────┘  │
                               │              │                  │
                               │  ┌───────────▼───────────────┐  │
                               │  │     Google Gemini API     │  │
                               │  └───────────────────────────┘  │
                               └─────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **Docker & Docker Compose** (for MongoDB and Redis)
- **Google Gemini API Key** — get one from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/ParvDesai/QuizForge.git
cd QuizForge
```

### 2. Start Infrastructure (MongoDB + Redis)

```bash
docker-compose up -d
```

This starts:
- **MongoDB 7.0** on port `27017`
- **Redis 7.2** on port `6379`

### 3. Backend Setup

```bash
cd Backend
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/quizforge
REDIS_HOST=localhost
REDIS_PORT=6379
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_secret_here
UPLOAD_DIR=uploads
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

### 4. Frontend Setup

```bash
cd Frontend
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new teacher account |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET` | `/api/auth/me` | Get current user profile |
| `PATCH` | `/api/auth/me` | Update profile |

### Assignments (Protected)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/assignments` | Create assignment + enqueue generation |
| `GET` | `/api/assignments` | List all assignments |
| `GET` | `/api/assignments/:id` | Get single assignment |
| `DELETE` | `/api/assignments/:id` | Delete assignment + paper |
| `POST` | `/api/assignments/parse-voice` | Parse voice transcript into form data |

### Papers (Protected)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/papers/:assignmentId` | Get generated paper (cached) |
| `POST` | `/api/papers/:assignmentId/refine` | Refine paper with instruction |
| `POST` | `/api/papers/:assignmentId/regenerate` | Regenerate entire paper |
| `POST` | `/api/papers/:assignmentId/regenerate-section` | Regenerate a single section |
| `POST` | `/api/papers/:assignmentId/regenerate-question` | Regenerate a single question |

---

## Project Structure

```
├── Backend/
│   └── src/
│       ├── config/          # DB, Redis, and env configuration
│       ├── controllers/     # Route handlers
│       ├── middleware/       # Auth, validation, error handling, upload
│       ├── models/          # Mongoose schemas (User, Assignment, QuestionPaper)
│       ├── queues/          # BullMQ queue definitions
│       ├── repositories/    # Database access layer
│       ├── routes/          # Express route definitions
│       ├── services/        # Business logic, LLM, caching, prompts
│       ├── socket/          # Socket.IO setup and event emitters
│       ├── workers/         # BullMQ job processors
│       ├── app.ts           # Express app factory
│       └── server.ts        # Bootstrap & startup
│
├── Frontend/
│   └── src/
│       ├── app/             # Next.js App Router pages
│       ├── components/      # React components (forms, paper view, layout)
│       ├── hooks/           # Custom hooks (socket, voice input)
│       ├── lib/             # API client, types, utilities
│       └── store/           # Zustand state management
│
└── docker-compose.yml       # MongoDB + Redis containers
```

---

## Socket Events

| Event | Direction | Description |
|---|---|---|
| `join-assignment` | Client → Server | Join a room to receive updates for an assignment |
| `joined` | Server → Client | Confirmation of room join |
| `job:processing` | Server → Client | Generation is in progress (with status message) |
| `paper:ready` | Server → Client | Paper generation completed |
| `paper:updated` | Server → Client | Paper was refined or partially regenerated |
| `job:failed` | Server → Client | Generation failed (with error message) |

---
