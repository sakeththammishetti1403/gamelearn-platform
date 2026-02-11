# LevelUpED - Learn by Unlocking Levels

LevelUpED is a production-grade, game-based edtech platform designed to make learning immersive and competitive. Students unlock new learning levels by completing modules, succeeding in interactive games, and competing in the Multiplayer Arena.

## 🚀 Vision
LevelUpED competes with world-class edtech platforms by integrating real-time feedback, gamified progression, and AI-powered support.

## 🔗 Production Links
- **Frontend**: [leveluped.vercel.app](https://leveluped.vercel.app)
- **Backend API**: [api.leveluped.onrender.com](https://api.leveluped.onrender.com)

## 🏗️ Architecture
- **Frontend**: React (Vite), Axios, Socket.IO Client, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO.
- **Real-time**: WebSockets for Multiplayer Arena and Live Chat.
- **Email**: Nodemailer for student support.
- **Security**: JWT-based Authentication, Bcrypt hashing, Helmet protection.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis (Optional, for caching)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Set up environment variables in `.env`:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT=5000`
   - `FRONTEND_URL=http://localhost:5173`
   - `OAUTH_GOOGLE_ID / SECRET`
   - `OAUTH_GITHUB_ID / SECRET`
   - `OAUTH_LINKEDIN_ID / SECRET`

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 Role-based Features
- **Student**: Learning paths, statistics, games, roadmap, and multiplayer arena.
- **Instructor**: Content creation, module management, and subject oversight.
- **Admin**: User management and platform analytics.

---
© 2026 LevelUpED. All rights reserved.
