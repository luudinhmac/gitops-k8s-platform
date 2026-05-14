You are a senior fullstack engineer.

Task:
Create a fullstack project.

Stack:
- Next.js frontend
- NestJS backend
- mariadb (remote VM)

Requirements:
- Run locally with ONE command:
  npm run dev

Ports:
- frontend: 3000
- backend: 3001

Include:

1. Structure:
- frontend/
- backend/

2. Root package.json:
- use "concurrently" to run both apps

3. Backend:
- basic API
- enable CORS for localhost:3000

4. Frontend:
- call backend API

5. Environment:
- NEXT_PUBLIC_API_URL
- DB connection

6. Commands (PowerShell):
- install
- run

Output must be runnable immediately.