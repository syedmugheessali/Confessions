# Confessions 

> *"Speak into the void. It won't remember."*

<div align="center">

![MERN](https://img.shields.io/badge/Stack-MERN-black?style=for-the-badge&logo=react)
![MongoDB TTL](https://img.shields.io/badge/Storage-MongoDB%20TTL-13aa52?style=for-the-badge&logo=mongodb)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-000000?style=for-the-badge)
![Status](https://img.shields.io/badge/State-Ephemeral-critical?style=for-the-badge)

</div>

---

### The Premise

In an era where every keystroke is indexed, archived, and etched into stone forever, **Confessions** is an intentional detour. 

It is an ephemeral, minimalist sanctuary where thoughts, secrets, and raw truths exist on borrowed time. Post your confession, attach an expiration fuse, and watch it live until the clock runs dry. 

Once zero hits, MongoDB's TTL engine vaporizes the record into the digital ether. No cold storage. No archives. No second chances.

---

### The Rules of the Void

- **Time-Capped Existence** — Choose a lifespan between `1 hour` and `7 days`. When time expires, it ceases to exist.
- **Anonymous by Default** — Public feeds completely sever author identity from confession payloads. Your secrets don't trace back to you.
- **Real-Time Decay** — Live, countdown-driven UI surfaces the fleeting nature of every single confession.
- **Self-Destruct Mechanisms** — Early regret? Authors retain private keys to purge their own posts ahead of schedule.

---

### Tech Spec

```
        Client (React 18 + Vite)
                  │
          REST / JSON Payloads
                  ▼
        Server (Express + Node.js)
         ├── JWT Authentication
         ├── Controlled Controllers
         └── Mongoose Data Schemas
                  ▼
          Database (MongoDB Atlas)
            └── TTL Index (Automatic Engine Eviction)
```

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router, Vanilla CSS | Fast, minimalist client with live timers |
| **Backend** | Node.js, Express.js | Stateless REST API architecture |
| **Database** | MongoDB Atlas, Mongoose | Document store with TTL indexes |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js | Stateless auth & salted password hashing |

---

### API Surface

```http
# Authentication
POST   /api/auth/register       # Issue token + register
POST   /api/auth/login          # Authenticate credentials
GET    /api/auth/me             # Session validation

# Confessions
GET    /api/confessions         # Stream active confessions (paginated)
GET    /api/confessions/:id     # Inspect single confession
POST   /api/confessions         # Cast new confession into void
GET    /api/confessions/my      # Retrieve author's active posts
DELETE /api/confessions/:id     # Early purge
```

---

### Spin Up Locally

#### 1. Clone & Configure Server
```bash
cd server
cp .env.example .env
npm install
```

Configure your `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

#### 2. Configure Client
```bash
cd ../client
npm install
```

#### 3. Run Dev Instances
```bash
# Terminal 1 (Backend - http://localhost:5000)
cd server
npm run dev

# Terminal 2 (Frontend - http://localhost:5173)
cd client
npm run dev
```

---

### Philosophy

> Secrets are only heavy when you carry them forever. Speak freely. The clock is ticking.
