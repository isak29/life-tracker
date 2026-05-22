# 🧠 DevLog — Personal Developer Portfolio & Knowledge Base

A cloud-native, AI-powered portfolio where I log everything I work on throughout my career. Ask the AI anything about my work history, projects, and technical decisions.

---

## 💡 What is this?

DevLog is a personal developer portfolio and knowledge base. Instead of forgetting what I've built and learned over the years, I log every project, feature, and technical decision here with dates, descriptions, and tags. An AI chat interface lets me (and others) query my entire work history in natural language.

**Example queries:**
- *"What did I work on in 2026?"*
- *"How does the sensor pipeline in the car project work?"*
- *"What AWS services have I used?"*
- *"Summarize everything I've done/built the last year"*

---

## 🏗️ Architecture Overview

```
User (Browser)
      │
      ▼
 S3 Static Website (Frontend - React/TypeScript)
      │
      ▼
 API Gateway (HTTPS entry point)
      │
      ▼
 AWS Lambda (Node.js backend)
      │
      ├──────────────────────┐
      ▼                      ▼
DynamoDB (entries)     OpenAI/Anthropic API (AI chat)
```

### How it works

1. **Frontend** — React app hosted on AWS S3. You log entries (projects, features, learnings) and chat with the AI through here.
2. **API Gateway** — Exposes HTTPS endpoints that the frontend calls.
3. **Lambda** — Serverless Node.js functions that handle saving entries and processing AI queries.
4. **DynamoDB** — NoSQL database that stores all log entries.
5. **AI Layer** — When you ask a question, Lambda fetches relevant entries from DynamoDB and sends them as context to the AI API, which answers in natural language.
6. **Docker** — The backend is fully containerised, ensuring consistent environments across local development and production.
7. **GitHub Actions** — CI/CD pipeline that automatically builds, tests, and deploys on every push to main.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript |
| Backend | Node.js, Express |
| Database | AWS DynamoDB |
| Hosting (Frontend) | AWS S3 + CloudFront |
| Serverless | AWS Lambda |
| API | AWS API Gateway |
| Containerisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| AI | OpenAI API / Anthropic API |
| Infrastructure | AWS (eu-north-1 — Stockholm) |

---

## 📁 Project Structure

```
devlog/
├── frontend/                  # React + TypeScript app
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Main pages (Dashboard, Chat, Entry)
│   │   └── api/               # API call functions
│   ├── Dockerfile
│   └── package.json
│
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── routes/            # API routes (entries, chat)
│   │   ├── services/          # DynamoDB service, AI service
│   │   └── index.js           # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── infrastructure/            # AWS configuration
│   ├── lambda/                # Lambda function configs
│   └── dynamodb/              # Table definitions
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline
│
├── docker-compose.yml         # Local dev environment
└── README.md
```

---

## 🐳 Docker Setup

The entire backend runs in Docker, both locally and in production. This ensures the environment is identical everywhere.

### Local development

```bash
# Start everything locally
docker-compose up

# Frontend runs on http://localhost:3000
# Backend runs on http://localhost:4000
```

### docker-compose.yml overview

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DYNAMODB_TABLE=devlog-entries
      - AI_API_KEY=${AI_API_KEY}
      - AWS_REGION=eu-north-1
```

---

## 🔁 CI/CD Pipeline (GitHub Actions)

Every push to the `main` branch triggers the pipeline automatically.

### Pipeline steps

```
Push to main
     │
     ▼
1. Run tests
     │
     ▼
2. Build Docker image
     │
     ▼
3. Push image to AWS ECR (container registry)
     │
     ▼
4. Deploy backend to AWS Lambda
     │
     ▼
5. Build React frontend
     │
     ▼
6. Deploy frontend to S3
     │
     ▼
Live ✅
```

### deploy.yml overview

```yaml
name: Deploy DevLog

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
      - name: Build & push Docker image
        run: docker build and push to ECR
      - name: Deploy to Lambda
        run: update Lambda with new image
      - name: Deploy frontend to S3
        run: aws s3 sync frontend/build s3://devlog-bucket
```

---

## 🗄️ Database Schema (DynamoDB)

Each log entry is stored as a document with this structure:

```json
{
  "id": "uuid",
  "date": "2026-08-15",
  "project": "Volvo — Car Project",
  "feature": "Real-time sensor data pipeline",
  "description": "Built a Lambda function that processes CAN bus data...",
  "tags": ["AWS", "Lambda", "IoT", "Node.js"],
  "type": "feature | project | learning | bug-fix"
}
```

---

## 🤖 AI Chat — How it works

The AI doesn't just answer from general knowledge — it answers from **my actual logged entries.**

```
User asks: "What did I do at Knightec in 2026?"
      │
      ▼
Backend fetches all entries where project contains "Knightec" and date is 2026
      │
      ▼
Those entries are sent as context to the AI API
      │
      ▼
AI reads the entries and answers in natural language
      │
      ▼
Response shown in chat UI
```

This is called **RAG (Retrieval Augmented Generation)** — a core AI engineering pattern used in production systems everywhere.

---

## 🚀 Deployment

The app is deployed to AWS in the **eu-north-1 (Stockholm)** region.

- **Frontend:** `https://devlog.yourdomain.se`
- **API:** Via AWS API Gateway (HTTPS)
- **Database:** AWS DynamoDB (serverless, scales automatically)
- **Backend:** AWS Lambda (serverless, only runs when called)

---

## 🗺️ Roadmap

### Phase 1 — Foundation
- [ ] Project setup, repo, folder structure
- [ ] Basic React frontend with entry form
- [ ] Node.js backend with Express
- [ ] Docker + docker-compose local setup

### Phase 2 — Cloud
- [ ] AWS DynamoDB table setup
- [ ] Deploy backend to AWS Lambda
- [ ] Deploy frontend to AWS S3
- [ ] API Gateway configuration

### Phase 3 — AI
- [ ] Connect AI API (OpenAI/Anthropic)
- [ ] Build chat interface in frontend
- [ ] Implement RAG — fetch relevant entries as AI context
- [ ] Test and refine AI responses

### Phase 4 — CI/CD
- [ ] GitHub Actions pipeline
- [ ] Automatic deployment on push to main
- [ ] Environment variable management
- [ ] Basic tests

### Phase 5 — Polish
- [ ] Public portfolio view (read-only for visitors)
- [ ] Tags and filtering
- [ ] Search functionality
- [ ] Custom domain

---

## 👨‍💻 Author

Built as a summer 2026 project to learn AWS, Docker, CI/CD, and AI engineering — and to never forget what I've built.