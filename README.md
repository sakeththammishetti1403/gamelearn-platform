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
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGO_URI` with your MongoDB connection string
   - Set a strong `JWT_SECRET` and `SESSION_SECRET`
   - Configure `FRONTEND_URL` (default: http://localhost:5173)
   - Configure `BACKEND_URL` (default: http://localhost:5000/api)
   - For OAuth setup, see [OAUTH_SETUP.md](OAUTH_SETUP.md)

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔐 Authentication

LevelUpED supports both local authentication (email/password) and OAuth providers.

### Local Authentication
Works out of the box - just register with email and password.

### OAuth Providers
- Google OAuth
- GitHub OAuth
- LinkedIn OAuth

To enable OAuth, follow the detailed setup guide in [OAUTH_SETUP.md](OAUTH_SETUP.md).

### Testing Authentication
See [AUTH_TESTING.md](AUTH_TESTING.md) for comprehensive testing instructions.

### Recent Authentication Fixes
All authentication issues have been resolved:
- ✅ Local email/password login works correctly
- ✅ OAuth configuration is properly documented
- ✅ Improved error handling and user feedback
- ✅ Security best practices implemented

For details, see [AUTH_FIXES_SUMMARY.md](AUTH_FIXES_SUMMARY.md).

## 📜 Role-based Features
- **Student**: Learning paths, statistics, games, roadmap, and multiplayer arena.
- **Instructor**: Content creation, module management, and subject oversight.
- **Admin**: User management and platform analytics.

---
© 2026 LevelUpED. All rights reserved.
