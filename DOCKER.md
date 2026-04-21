# 🐳 Docker Setup Guide

## Quick Start with Docker

The easiest way to run Spotle TN is using Docker Compose. Everything (database, backend, frontend) runs in containers with a single command!

### Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** (included with Docker Desktop)

Download: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

---

## 🚀 Running with Docker Compose

### 1. Set Environment Variables (Optional)

By default, Docker Compose uses `spotle_password` as the database password. To change it:

```bash
# Copy the environment template
copy .env.docker .env

# Edit .env and update DB_PASSWORD
# DB_PASSWORD=your_secure_password
```

### 2. Start All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f
```

This will:
- ✅ Start PostgreSQL container
- ✅ Initialize database with schema and seed data
- ✅ Start backend API on port 3000
- ✅ Start frontend on port 8080

### 3. Access the Application

Open your browser and visit:
```
http://localhost:8080
```

The game is ready to play! 🎵

---

## 📋 Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Data
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f db
docker-compose logs -f frontend
```

### Rebuild Containers
```bash
# After code changes
docker-compose up -d --build
```

### Check Status
```bash
docker-compose ps
```

### Execute Commands in Container
```bash
# Access PostgreSQL
docker-compose exec db psql -U postgres -d spotle_tn

# Access backend shell
docker-compose exec backend sh

# Run npm commands
docker-compose exec backend npm install new-package
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Docker Compose Network            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐      ┌──────────────┐    │
│  │   Frontend   │      │   Backend    │    │
│  │   (Nginx)    │─────→│  (Node.js)   │    │
│  │  Port: 8080  │      │  Port: 3000  │    │
│  └──────────────┘      └──────┬───────┘    │
│                               │             │
│                               ↓             │
│                        ┌──────────────┐     │
│                        │  PostgreSQL  │     │
│                        │  Port: 5432  │     │
│                        └──────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📦 Container Details

### Database Container (`db`)
- **Image**: `postgres:15-alpine`
- **Port**: 5432
- **Volume**: `postgres_data` (persistent storage)
- **Auto-initialization**: Runs `schema.sql` and `seed.sql` on first start
- **Health check**: `pg_isready` every 10s

### Backend Container (`backend`)
- **Image**: Built from `backend/Dockerfile`
- **Base**: `node:18-alpine`
- **Port**: 3000
- **Dependencies**: Waits for database health check
- **Health check**: `/api/health` endpoint every 30s

### Frontend Container (`frontend`)
- **Image**: Built from `frontend/Dockerfile`
- **Base**: `nginx:alpine`
- **Port**: 8080 (mapped to 80 in container)
- **Serves**: Static HTML/CSS/JS files
- **Config**: Custom `nginx.conf` with caching and security headers

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
DB_PASSWORD=your_secure_password
```

All environment variables:
- `DB_PASSWORD` - PostgreSQL password (default: `spotle_password`)

### Frontend API URL

The frontend automatically connects to `http://localhost:3000/api`.

For production deployment, edit `frontend/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

---

## 🗄️ Database Management

### Access PostgreSQL CLI
```bash
docker-compose exec db psql -U postgres -d spotle_tn
```

### Backup Database
```bash
docker-compose exec db pg_dump -U postgres spotle_tn > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U postgres -d spotle_tn < backup.sql
```

### Add New Artists
```bash
# Connect to database
docker-compose exec db psql -U postgres -d spotle_tn

# Insert artist
INSERT INTO artists (name, debut_year, genre, nationality, popularity_rank, group_size, gender, active)
VALUES ('New Artist', 2020, 'Pop', 'Tunisia', 100, 1, 'male', true);
```

### Reset Database
```bash
# Stop containers and remove volumes
docker-compose down -v

# Start again (will reinitialize)
docker-compose up -d
```

---

## 🚢 Production Deployment

### Option 1: Docker Compose on Server

1. Install Docker on your server
2. Copy project files
3. Update `.env` with secure password
4. Run `docker-compose up -d`
5. Set up reverse proxy (Nginx/Caddy) for SSL

### Option 2: Kubernetes

Convert `docker-compose.yml` to Kubernetes manifests:
```bash
# Using kompose
kompose convert
kubectl apply -f .
```

### Option 3: Cloud Platforms

**AWS ECS / Azure Container Instances / Google Cloud Run**
- Build and push images to container registry
- Deploy using platform-specific tools
- Configure environment variables
- Set up managed PostgreSQL (recommend for production)

---

## 🔍 Troubleshooting

### "Cannot connect to database"
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### "Port already in use"
```bash
# Change ports in docker-compose.yml
ports:
  - "8081:80"  # Change 8080 to 8081
  - "3001:3000"  # Change 3000 to 3001
```

### "Backend not responding"
```bash
# Check backend logs
docker-compose logs backend

# Check health
docker-compose exec backend wget -O- http://localhost:3000/api/health

# Restart backend
docker-compose restart backend
```

### "Database initialization failed"
```bash
# Remove volume and recreate
docker-compose down -v
docker-compose up -d

# Check init logs
docker-compose logs db | grep init
```

### Clean Slate
```bash
# Remove everything and start fresh
docker-compose down -v --remove-orphans
docker system prune -a
docker-compose up -d --build
```

---

## 🎯 Development Workflow

### Local Development with Hot Reload

For development, you can mount volumes for live code updates:

```yaml
# Add to docker-compose.yml under backend service
volumes:
  - ./backend:/app
  - /app/node_modules

# Add to frontend service
volumes:
  - ./frontend:/usr/share/nginx/html
```

Then rebuild:
```bash
docker-compose up -d --build
```

### Running Tests
```bash
# Run backend tests
docker-compose exec backend npm test

# Run with coverage
docker-compose exec backend npm run test:coverage
```

---

## 📊 Monitoring

### Resource Usage
```bash
docker stats
```

### Container Health
```bash
docker-compose ps
```

### Database Size
```bash
docker-compose exec db psql -U postgres -d spotle_tn -c "SELECT pg_size_pretty(pg_database_size('spotle_tn'));"
```

---

## ✅ Docker vs Manual Setup

| Feature | Docker | Manual |
|---------|--------|--------|
| Setup Time | 2 minutes | 15-30 minutes |
| Dependencies | Docker only | Node.js, PostgreSQL, npm |
| Consistency | ✅ Same everywhere | ⚠️ Environment-dependent |
| Isolation | ✅ Containers | ❌ System-wide |
| Database Setup | ✅ Automatic | Manual SQL execution |
| Updates | `docker-compose up -d --build` | Pull + npm install + restart |
| Cleanup | `docker-compose down -v` | Manual uninstall |

---

## 🎉 Summary

**To run the entire application:**
```bash
docker-compose up -d
```

**To stop:**
```bash
docker-compose down
```

**That's it!** Visit `http://localhost:8080` and start playing! 🎵

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)
