# Full Stack Note App

A Single Page Application (SPA) for managing notes with tagging capabilities.

## Features
- **Phase 1**: Create, edit, delete, archive/unarchive notes.
- **Phase 2**: Create categories, tag notes, filter notes by category.
- **Tech Stack**:
    - **Frontend**: React (Vite) + Tailwind CSS + Axios.
    - **Backend**: NestJS (Node.js) + TypeORM + SQLite.

## Requirements
- Node.js (v18+)
- npm (v9+)
- Bash/Zsh (for run script)

## Running the App

### One-Command Start (Linux/macOS)
```bash
./run.sh
```

### Manual Start
1. **Backend**:
    ```bash
    cd backend
    npm install
    npm run start
    ```
    Runs on http://localhost:3000

2. **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Runs on http://localhost:5173

## Configuration
- Database: SQLite (`backend/database.sqlite`) created automatically.
- API URL: configured in `frontend/src/api.ts` (default: http://localhost:3000).

## Login
No login required for this version.
