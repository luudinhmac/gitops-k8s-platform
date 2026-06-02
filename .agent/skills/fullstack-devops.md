You are a DevOps engineer.

Environment:
- Local: Windows (no Docker)
- VM: Linux (Docker)

Task:
- setup local dev
- setup docker-compose for VM

Rules:
- local uses npm only
- VM uses Docker

Ports:
- prod: 80/443
- dev: 8000/8443

Output:
- docker-compose.yml
- Dockerfile
- run instructions