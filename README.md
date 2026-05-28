# 📊 NIM-Research: AI Research Assistant Multi-Agent 

> An intelligent document analysis and research platform leveraging **LLM agents**, **RAG (Retrieval-Augmented Generation)**, and **multi-agent orchestration** to transform unstructured documents into actionable insights.

---

## 🛠️ Tech Stack & Technologies

### Backend
![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135+-009688?style=flat-square&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-red?style=flat-square&logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql&logoColor=white)

### AI/ML & LLM
![LangChain](https://img.shields.io/badge/LangChain-1.2+-1f425f?style=flat-square&logo=chainlink&logoColor=white)
![LanGraph](https://img.shields.io/badge/LanGraph-1.1+-FF6B6B?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-2.37+-412991?style=flat-square&logo=openai&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-0.37+-FF6B35?style=flat-square)
![Pinecone](https://img.shields.io/badge/Pinecone-9.0+-00D084?style=flat-square&logo=pinecone&logoColor=white)
![RAG](https://img.shields.io/badge/RAG-Retrieval%20Augmented%20Generation-4A90E2?style=flat-square)

### Frontend
![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-7.14+-F3702A?style=flat-square&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.15+-5A29E4?style=flat-square&logo=axios&logoColor=white)

### Infrastructure & DevOps
![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?style=flat-square&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Latest-2496ED?style=flat-square&logo=docker&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-1.18+-FFA500?style=flat-square)
![Pytest](https://img.shields.io/badge/Pytest-9.0+-0A9EDC?style=flat-square&logo=pytest&logoColor=white)

### Security & Authentication
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-5.0+-FF6B6B?style=flat-square)
![Pydantic](https://img.shields.io/badge/Pydantic-2.12+-E92063?style=flat-square&logo=pydantic&logoColor=white)

### Additional Tools
![WebSocket](https://img.shields.io/badge/WebSocket-Real%20Time-4CAF50?style=flat-square)
![Loguru](https://img.shields.io/badge/Loguru-0.7+-FF6B6B?style=flat-square)
![Streamlit](https://img.shields.io/badge/Streamlit-1.56+-FF0000?style=flat-square&logo=streamlit&logoColor=white)

---

## 🎯 Project Overview

**NIM-Research** is a full-stack web application designed to help users upload, analyze, and generate comprehensive reports from documents using cutting-edge AI technologies. The platform combines **FastAPI** backend with **React** frontend to provide a seamless experience for document intelligence tasks.

### Key Features

✨ **AI-Powered Document Analysis**
- Intelligent document parsing and content extraction
- Multi-document analysis with cross-referencing capabilities
- Semantic understanding using embeddings and vector databases

🤖 **Multi-Agent Orchestration**
- Specialized agents for different tasks (Analysis, QA, Research, Synthesis)
- Intelligent agent coordination for complex workflows
- Real-time processing with WebSocket support

📈 **Advanced Report Generation**
- Automated report creation from analyzed documents
- Multiple report types (Research Summary, Executive Summary, etc.)
- HTML and text format support

🔍 **Knowledge Base & RAG**
- Vector-based semantic search using Pinecone
- Retrieval-Augmented Generation for accurate responses
- Context-aware information retrieval

🔐 **Enterprise-Grade Security**
- JWT-based authentication and authorization
- Role-based access control (RBAC)
- Secure password hashing with bcrypt

📊 **Project Management**
- Organize documents into projects
- Track analysis history and results
- Collaborative workspace support

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **LLM Integration:** LangChain, Groq, OpenAI
- **Vector DB:** Pinecone for semantic search
- **Authentication:** JWT with python-jose
- **API Documentation:** Auto-generated Swagger UI

**Frontend:**
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Real-time:** WebSocket support

**Infrastructure:**
- **Containerization:** Docker & Docker Compose
- **Database Migrations:** Alembic
- **Logging:** Loguru
- **Testing:** Pytest

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  Dashboard | Projects | Documents | Analysis | Reports      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                  FastAPI Backend                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: Auth | Projects | Documents | Analysis     │   │
│  │           Research | Reports | Knowledge Base       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Multi-Agent System                                  │   │
│  │  • Orchestrator Agent (workflow coordination)        │   │
│  │  • Analysis Agent (document analysis)                │   │
│  │  • Research Agent (information gathering)            │   │
│  │  • QA Agent (question answering)                     │   │
│  │  • Synthesis Agent (report generation)               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services Layer                                      │   │
│  │  • Document Service | Analysis Service              │   │
│  │  • Report Service | Research Service                │   │
│  │  • Project Service | User Service                    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼──┐        ┌───▼──┐
    │  DB  │        │Vector│
    │(PG)  │        │  DB  │
    └──────┘        └──────┘
                  (Pinecone)
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Docker & Docker Compose** (optional)

### Environment Setup

#### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nim-eng/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/nim_eng
   
   # LLM APIs
   GROQ_API_KEY=your_groq_api_key
   OPENAI_API_KEY=your_openai_api_key
   
   # Vector Database
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=nim-eng-index
   
   # JWT
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Initialize database:**
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at: `http://localhost:8000`
   API Documentation: `http://localhost:8000/docs`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173`

### Docker Setup (Recommended)

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend API (FastAPI)
- Frontend (React)

---

## 📖 Usage Guide

### 1. **Authentication**
- Visit `http://localhost:5173` and register a new account
- Login with your credentials
- JWT token is automatically stored and used for API requests

### 2. **Create a Project**
- Navigate to **Projects** page
- Click "New Project" and provide project details
- Projects organize your documents and analyses

### 3. **Upload Documents**
- Go to **Documents** section
- Upload PDF, DOCX, or TXT files
- Documents are automatically processed and indexed

### 4. **Analyze Documents**
- Navigate to **Analysis** page
- Select documents to analyze
- Choose analysis type (Summary, Q&A, Extraction, etc.)
- AI agents process documents and generate insights

### 5. **Generate Reports**
- Go to **Reports** section
- Create new report from analyzed documents
- Select report type and customize content
- Export as PDF or HTML

### 6. **Knowledge Base**
- Access **Knowledge Base** for semantic search
- Query across all your documents
- Get AI-powered answers with source citations

### 7. **Manage Profile**
- Update profile information in **Profile** page
- Configure preferences in **Settings**

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{projectId}` - Get project details
- `PUT /api/projects/{projectId}` - Update project
- `DELETE /api/projects/{projectId}` - Delete project

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/{documentId}` - Get document details
- `DELETE /api/documents/{documentId}` - Delete document

### Analysis
- `POST /api/analysis` - Create analysis task
- `GET /api/analysis/{analysisId}` - Get analysis results
- `GET /api/analysis` - List analyses

### Reports
- `POST /api/reports` - Generate report
- `GET /api/reports/{reportId}` - Get report
- `PUT /api/reports/{reportId}` - Update report
- `DELETE /api/reports/{reportId}` - Delete report

### Knowledge Base
- `POST /api/knowledge-base/search` - Semantic search
- `POST /api/knowledge-base/query` - Ask questions

---

## 🤖 AI Agent System

The platform uses a sophisticated multi-agent architecture:

### Agent Types

1. **Orchestrator Agent**
   - Coordinates workflow between other agents
   - Manages task distribution and prioritization

2. **Analysis Agent**
   - Performs document analysis
   - Extracts key information and insights
   - Identifies patterns and relationships

3. **Research Agent**
   - Gathers additional context
   - Performs semantic searches
   - Retrieves relevant information from knowledge base

4. **QA Agent**
   - Answers questions about documents
   - Provides citations and sources
   - Handles follow-up queries

5. **Synthesis Agent**
   - Combines analysis results
   - Generates comprehensive reports
   - Formats output for different use cases

### Agent Communication

Agents communicate through:
- **WebSocket:** Real-time updates to frontend
- **Vector Store:** Pinecone for semantic memory

---

## 📊 Database Schema

### Core Tables

- **users** - User accounts and authentication
- **projects** - User projects
- **documents** - Uploaded documents
- **analyses** - Analysis tasks and results
- **reports** - Generated reports
- **research** - Research data and findings

All tables include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Soft delete support where applicable
- Proper indexing for performance

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

### Test Coverage
```bash
pytest --cov=app
```

---

## 📝 Project Structure

```
nim-eng/
├── backend/
│   ├── app/
│   │   ├── agents/          # Multi-agent system
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── database/        # DB configuration
│   │   ├── utils/           # Utilities
│   │   └── websocket/       # WebSocket handlers
│   ├── alembic/             # Database migrations
│   ├── tests/               # Test suite
│   ├── requirements.txt     # Python dependencies
│   └── main.py              # FastAPI app entry
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # API services
│   │   └── App.jsx          # Main app component
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
│
└── .kiro/                   # Kiro specs (development)
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Input validation (Pydantic)
- ✅ Rate limiting ready
- ✅ Secure headers configuration

---

## 🚀 Performance Optimizations

- **Database Indexing:** Strategic indexes on frequently queried columns
- **Vector Search:** Pinecone for fast semantic similarity
- **Connection Pooling:** SQLAlchemy connection management
- **Frontend Optimization:** Code splitting, lazy loading with Vite

---

## 📚 Key Technologies & Keywords

### AI/ML Stack
- **LangChain** - LLM orchestration framework
- **LanGraph** - Agent workflow management
- **Groq API** - Fast LLM inference
- **OpenAI** - Advanced language models
- **Embeddings** - Semantic understanding
- **RAG (Retrieval-Augmented Generation)** - Context-aware AI responses
- **Vector Database** - Pinecone for semantic search

### Backend Technologies
- **FastAPI** - Modern async Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **Alembic** - Database migration tool

### Frontend Technologies
- **React 19** - Latest React with hooks
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request


## 👨‍💻 Author

**AI Engineer Portfolio Project**

This project demonstrates expertise in:
- Full-stack web development
- AI/ML integration and multi-agent systems
- Database design and optimization
- Real-time communication (WebSocket)
- Cloud-ready architecture
- Enterprise security practices

---

## 👨‍💻 Support & Contact

For questions or issues:
- Email: [minh2m5@gmail.com]
- Github: [https://github.com/nNm205]

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---


