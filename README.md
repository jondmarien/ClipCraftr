# ClipCraftr

A powerful Discord bot that creates automated video montages from user-submitted clips, featuring an optional modern web dashboard for management and analytics.

## ✨ Features

- **Discord Bot**
  - Slash commands for all functionality
  - Video clip submission and queue management
  - FFmpeg-powered montage generation
  - Real-time progress updates
  - MongoDB database integration
  - Custom logging system

- **Web Dashboard**
  - Next.js 14 with App Router
  - Discord OAuth2 authentication
  - Real-time queue and status monitoring
  - Clip management interface
  - Admin controls and analytics
  - Responsive design with Chakra UI

- **Backend API**
  - Fastify server with TypeScript
  - RESTful API endpoints
  - WebSocket support for real-time updates
  - Swagger/OpenAPI documentation
  - MongoDB integration with Mongoose

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Package Manager**: pnpm 8+
- **Discord Bot**: discord.js v14
- **Frontend**: Next.js 14, React 18, TypeScript, Chakra UI
- **Backend**: Fastify, Socket.io
- **Database**: MongoDB (with Mongoose)
- **Authentication**: NextAuth.js with Discord OAuth2
- **Video Processing**: FFmpeg
- **Linting/Formatting**: ESLint, Prettier
- **Testing**: Jest, Supertest

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- FFmpeg
- MongoDB (local or cloud instance)
- Discord Developer Application with Bot

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

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Discord
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
   DEV_GUILD_ID=your_development_server_id
   
   # MongoDB
   MONGODB_URI=mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=generate_with_openssl_rand_-base64_32
   NEXTAUTH_URL=http://localhost:3000
   
   # API
   API_BASE_URL=http://localhost:4000
   ```

4. **Start development servers**

   ```bash
   # Start all services in development mode
   pnpm dev
   ```

   Or start services individually:

   ```bash
   # Start Discord bot with hot reload
   pnpm bot:dev
   
   # Start backend API server
   pnpm server:dev
   
   # Start Next.js dashboard
   pnpm dashboard:dev
   ```

## 📁 Project Structure

```text
clipcraftr/
├── packages/
│   ├── bot/               # Discord bot (TypeScript)
│   │   ├── src/
│   │   │   ├── commands/  # Slash commands
│   │   │   ├── events/    # Discord events
│   │   │   ├── utils/     # Utility functions
│   │   │   └── index.ts   # Entry point
│   │   └── package.json
│   │
│   ├── server/           # Backend API (Fastify + TypeScript)
│   │   ├── src/
│   │   │   ├── api/      # API routes
│   │   │   ├── config/    # Configuration
│   │   │   ├── models/    # Database models
│   │   │   └── index.ts   # Entry point
│   │   └── package.json
│   │
│   ├── dashboard/        # Next.js dashboard (TypeScript)
│   │   ├── app/          # App Router
│   │   ├── components/    # Reusable components
│   │   ├── lib/          # Utility functions
│   │   └── package.json
│   │
│   └── shared/          # Shared types and utilities
│       └── package.json
│
├── .github/             # GitHub workflows
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

## 🔧 Configuration

### Environment Variables

Required environment variables are listed in the `.env` file. Make sure to set up all required values before starting the application.

### Discord Bot Setup

1. Create a new application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Go to the "Bot" tab and create a new bot
3. Enable these intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
4. Generate an invite URL with these scopes:
   - `bot`
   - `applications.commands`

## 📚 Documentation

- [API Documentation](http://localhost:4000/docs) (available when server is running)
- [Discord.js Guide](https://discordjs.guide/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com/docs/components)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

## 🙏 Acknowledgments

- [discord.js](https://discord.js.org/) - Discord API wrapper
- [Next.js](https://nextjs.org/) - React Framework
- [FFmpeg](https://ffmpeg.org/) - Video processing
- [MongoDB](https://www.mongodb.com/) - Database
