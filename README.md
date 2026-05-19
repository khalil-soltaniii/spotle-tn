# 🎧 Spotle TN

> A Spotify-inspired daily guessing game for Tunisian music 🇹🇳
> Discover, guess, and explore artists across Mezoued, Rap, Pop, and Underground scenes.

---

## ✨ Overview

**Spotle TN** is a full-stack web application where players guess a mystery Tunisian artist each day using clues like genre, debut year, popularity, and more.

Inspired by games like Wordle and music platforms like Spotify, the app combines **music discovery + game mechanics** into a fun and competitive experience.

---

## 🚀 Features

* 🎯 **Daily Artist Challenge** (Wordle-style gameplay)
* 🎵 **Multiple Genres**: Mezoued / Rap / Pop / Underground
* 📊 **Smart Feedback System** (compare attributes)
* 🔊 **Audio Previews (iTunes integration)**
* 🌍 **Multi-language support** (English / French / Tunisian Arabic)
* 🔥 **Spotify-style popularity ranking**
* ⚡ **Fast & lightweight UI (Nginx)**

---

## 🧱 Tech Stack

### Frontend

* HTML / CSS / JavaScript
* Nginx (served in Docker)

### Backend

* Node.js + Express

### Database

* PostgreSQL

### DevOps

* Docker + Docker Compose

---

## 📁 Project Structure

```
spotle-tn/
│
├── backend/        # Express API
├── frontend/       # Static UI (served via Nginx)
├── database/       # SQL schema & seed data
│
├── docker-compose.yml
├── .env.example
├── README.md
└── DOCKER.md
```

---

## ⚡ Quick Start (Recommended)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/spotle-tn.git
cd spotle-tn
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

### 3. Run the application

```bash
docker compose up -d --build
```

### 4. Open in your browser

```
http://localhost:8080
```

---

## 🛑 Stop the application

```bash
docker compose down
```

---

## 🧪 Run Without Docker (Dev Mode)

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

Serve manually or use Live Server.

---

## 📡 API Endpoints

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| GET    | `/api/today`   | Get today's puzzle metadata |
| GET    | `/api/artists` | List all artists            |
| POST   | `/api/guess`   | Submit a guess              |
| GET    | `/api/result`  | Get correct answer          |

---

## 🔐 Security Features

* Rate limiting (anti-spam protection)
* Input validation
* CORS protection
* Docker isolation

---

## 🧠 Game Logic

Each guess is evaluated based on:

* Genre 🎵
* Debut Year 📅
* Nationality 🌍
* Gender 👤
* Popularity Rank 📊
* Group Size 👥

Players receive feedback after each guess to narrow down the correct artist.

---

## 🌍 Deployment

You can deploy this project using:

* VPS (Docker + Nginx)
* Cloud platforms (Render, Railway, DigitalOcean)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request 🚀

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Khalil Soltani**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🧠 Share feedback

---
