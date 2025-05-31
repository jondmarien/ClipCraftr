# ClipCraftr

A Discord bot that creates automated video montages from user-submitted clips, fully operable via slash commands, with an optional React/Next.js dashboard for advanced management.

## ✨ Features

- **Discord Bot**
  - Slash commands for all functionality
  - Video clip submission and queue management
  - FFmpeg-powered montage generation
  - Real-time progress updates

- **Web Dashboard** (Optional)
  - Real-time queue and status monitoring
  - Clip management interface
  - Admin controls and analytics
  - Discord OAuth2 authentication

## 🚀 Tech Stack

- **Backend**: Node.js, Fastify, Socket.io
- **Discord Bot**: discord.js
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Database**: MongoDB (with Mongoose)
- **Video Processing**: FFmpeg
- **Package Manager**: pnpm
- **Linting/Formatting**: ESLint, Prettier

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- FFmpeg
- MongoDB (local or cloud instance)
- Discord Bot Token

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/clipcraftr.git
   cd clipcraftr
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in the required values:

   ```bash
   cp .env.example .env
   ```

4. **Start development servers**

   ```bash
   # Start all services in development mode
   pnpm dev
   ```

   Or start services individually:

   ```bash
   # Start Discord bot
   pnpm bot:dev
   
   # Start backend server
   pnpm server:dev
   
   # Start dashboard
   pnpm dashboard:dev
   ```

## 📁 Project Structure

```text
clipcraftr/
├── packages/
│   ├── bot/               # Discord bot
│   ├── server/            # Backend API server
│   ├── dashboard/         # Next.js dashboard
│   └── shared/            # Shared types and utilities
├── .github/               # GitHub workflows
├── docs/                  # Documentation
└── scripts/               # Utility scripts
```

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Discord
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback

# MongoDB
MONGODB_URI=mongodb://localhost:27017/clipcraftr

# API
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
API_BASE_URL=http://localhost:4000

# FFmpeg
FFMPEG_PATH=/usr/local/bin/ffmpeg
```

## 🚀 Deployment

### Production Build

```bash
# Build all packages
pnpm build

# Start all services in production
pnpm start
```

### Docker (Coming Soon)

```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [discord.js](https://discord.js.org/) - Discord API wrapper
- [Next.js](https://nextjs.org/) - React Framework
- [FFmpeg](https://ffmpeg.org/) - Video processing
- [MongoDB](https://www.mongodb.com/) - Database
