# ClipCraftr: Fast-Track Development Plan (2–3 Weeks)

This plan is structured for a solo, experienced developer moving quickly. It emphasizes building a Discord bot fully controlled by slash commands, with an optional developer dashboard for advanced monitoring and queue management.

---

## 1. **Project Overview**

- **Goal:** Discord bot ("ClipCraftr") that takes user-submitted video clips, creates automatic montages, and is fully operable via slash commands. A web dashboard provides enhanced management and analytics.
- **Stack:** Node.js, discord.js (v14+), FFmpeg, Express.js, React (or Next.js) for dashboard, Socket.io for real-time updates, MongoDB (or SQLite for MVP) for persistence.

---

## 2. **Core Features**

### Discord Bot

- Slash commands for all bot functions (queue, status, montage creation, config, etc.)
- Accept video uploads via Discord, validate and queue them
- **Montage Creation User Flows:**
  - Users can upload multiple clips individually (single uploads), then use `/montage create` to combine all clips in the queue into a montage. Optionally, support named queues for organizational flexibility.
  - Users can upload multiple clips in a single command (batch upload), then use `/montage create` to create a montage from that batch of clips.
  - Supporting both flows is a project goal.
- FFmpeg-powered montage creation (concat, transitions, output settings)
- Progress/status updates in Discord
- Admin-only config commands (channels, limits, etc.)
- Error handling and user feedback

### Optional Dev Dashboard

- Discord OAuth2 login
- Real-time queue/status view
- Clip management (view/remove/force-process)
- Montage history/logs
- Config panel (change settings, view health)
- WebSocket/REST API integration with bot

---

## 3. **Development Timeline (2–3 Weeks)**

### **Day 1–2: Planning & Setup**

- Define MVP feature list and command structure
- Set up Git repo, Node.js project, FFmpeg install
- Create Discord application, bot token, invite to test server

### **Day 3–5: Bot Core & Slash Commands**

- Set up discord.js with slash command registration
- Implement `/queue add`, `/queue status`, `/queue remove`, `/queue clear`
- Accept video attachments, validate/queue them
- Basic in-memory queue (swap for DB later)
- Simple status/progress messages

### **Day 6–8: Video Processing Pipeline**

- Integrate FFmpeg for concatenation
- Implement `/montage create` (with options for quality, transitions, etc.)
- Handle file download, temp storage, cleanup
- Progress reporting back to Discord
- Error handling, retries, and user feedback

### **Day 9–10: Persistence & Robustness**

- Swap in MongoDB or SQLite for queue/history
- Add job recovery on restart
- Implement `/config` commands (set channels, limits, etc.)
- Permissions: restrict admin commands

### **Day 11–13: Dev Dashboard MVP**

- Express.js backend with REST/WebSocket API
- React (or Next.js) frontend: queue view, status, logs, config
- Discord OAuth2 login (passport-discord or similar)
- Sync dashboard actions with bot (remove, force process, etc.)

### **Day 14–15: Testing & Polish**

- End-to-end testing: Discord commands, montage output, dashboard sync
- Edge cases: large files, unsupported formats, concurrent jobs
- UI/UX polish on dashboard
- Documentation (README, usage guide, deployment steps)

### **Day 16–17: Deployment & Support**

- Deploy bot (VPS, Heroku, Railway, etc.)
- Deploy dashboard (Vercel, Netlify, or same VPS)
- Set up logging/monitoring (optional)
- Create support/test Discord server if desired

---

## 4. **Slash Command Examples**

- `/queue add [attachment] [priority]` — Add a clip to the queue
- `/queue status` — View current queue
- `/queue remove [clip_id]` — Remove a clip
- `/montage create [options]` — Start montage
- `/config set [option] [value]` — Change settings
- `/dashboard link` — Get a secure dashboard login URL

---

## 5. **Potential Enhancements (Post-MVP)**

- AI-based highlight detection
- Custom transitions/themes
- Multi-platform sharing (YouTube, TikTok)
- User stats/leaderboards
- More granular permissions/roles

---

## 6. **Development Best Practices**

- Use environment variables for secrets/tokens
- Modularize bot commands and processing logic
- Write basic unit/integration tests (especially for video pipeline)
- Document API endpoints and dashboard usage
- Regularly commit and push to version control

---

## 7. **Icon/Branding Suggestion**

- **Icon:** Stylized film strip or clapperboard with a “C” and subtle pixel/clip motif, Discord-inspired color palette (blurple, dark gray, white).
- **Favicon:** Simple “C” inside a film reel or montage grid.

---

## 8. **LLM Prompt for Assistance**

> You are assisting with the development of ClipCraftr, a Discord bot that creates automated video montages from user-submitted clips, fully operable via slash commands, with an optional React/Next.js dashboard for advanced management. The stack is Node.js, discord.js, FFmpeg, Express.js, MongoDB, and Socket.io. Please help with code, debugging, and architectural suggestions as I build the bot and dashboard according to this plan.

---
