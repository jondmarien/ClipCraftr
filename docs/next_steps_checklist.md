# ClipCraftr: In-Depth Next Steps & Checklist

This document provides a comprehensive, actionable checklist for completing the ClipCraftr project, based on the original development plan and current project state. Items are grouped by package and feature area. Use this as your authoritative TODO for MVP completion and launch.

---

## 1. Discord Bot (`packages/bot`)

### Slash Commands

- [ ] Ensure all core slash commands are implemented:
  - [x] `/queue add [attachment] [priority]`
  - [ ] `/queue status`
  - [ ] `/queue remove [clip_id]`
  - [ ] `/queue clear`
  - [ ] `/montage create [options]`
  - [ ] Support montage creation from all clips in queue (optionally: named queues)
  - [ ] Support batch upload of clips for montage creation
  - [ ] Ensure queue position logic updates so processed clips show no clips ahead
  - [ ] `/config set [option] [value]`
- [x] Register commands with Discord API and test in server.

I'd like to be able to either:

- upload many singular clips, then use a command like `/montage create` where it takes all the clips in a given queue (maybe add named queues), and creates a montage.
OR

- upload many clips with one command that accepts multiple inputs, and then the user can use `/montage create` to create a montage from said batch of clips.

### Queue & Video Handling

- [x] Accept video uploads via Discord, validate and queue them.
- [x] Implement in-memory queue (if not done), then swap for MongoDB-backed queue/history.
- [x] Robust error handling and user feedback for invalid files, full queue, etc.

### FFmpeg Montage Pipeline

- [ ] Integrate FFmpeg for video concatenation and montage creation.
- [ ] Handle file download, temp storage, and cleanup.
- [ ] Implement progress/status reporting in Discord (including for long jobs).
- [ ] Add error handling, retries, and admin notifications for failures.

### Admin & Permissions

- [ ] Implement admin-only config commands (channels, limits, purge (done, but need to lock behind admin) etc.).
- [ ] Restrict sensitive commands to admins only.

---

## 2. Server/API (`packages/server`)

### Core API

- [x] Fastify server with CORS, security, and logging (already present).
- [x] REST routes: `/clips`, `/montages`, `/auth` (already scaffolded).
- [x] MongoDB connection and config (already present).
- [x] Swagger API docs (already present).

### WebSocket Integration

- [x] Ensure WebSocket events are emitted for queue/status/montage updates.
- [x] Confirm dashboard can subscribe to real-time events from server.

### Bot Integration

- [x] Confirm bot communicates with server for queue, clip, and montage management (via REST or WebSocket as planned).
- [x] Add/finalize any missing endpoints needed by dashboard or bot.

### Testing & Robustness

- [x] Add/finalize tests for API endpoints and WebSocket events.

**Note:** The server package is mostly complete for MVP, but ensure integration with the bot and dashboard is robust and all real-time flows are working.

---

## 3. Dashboard (`packages/dashboard`)

### Auth & User Flows

- [x] Discord OAuth2 login (NextAuth) functional.
- [ ] Ensure login/logout/reauth flows are smooth and error-handled.

### Real-Time Queue & Clip Management

- [ ] Display real-time queue and status (via WebSocket or polling).
- [ ] Clip management: view, remove, force-process from dashboard.
- [ ] Display montage history/logs.
- [ ] Config panel for admin settings (channels, limits, etc.).
- [ ] UI/UX polish for all dashboard features.

### API Integration

- [ ] Ensure dashboard actions update bot/server in real time.
- [ ] Handle error/success feedback for all actions.

---

## 4. Shared/General

### Persistence & Recovery

- [x] Ensure all persistent data (queue, clips, montages, configs) is stored in MongoDB (not just memory).
- [x] Add job recovery on bot/server restart.

### Testing & QA

- [ ] End-to-end manual and/or automated tests for:
  - [ ] Discord command flows
  - [ ] Montage output correctness
  - [ ] Dashboard-bot-server sync
  - [ ] Edge cases: large files, unsupported formats, concurrent jobs

### Documentation

- [ ] Complete README and usage guide.
- [ ] Add deployment instructions for bot, server, and dashboard.
- [ ] Document environment variables and setup steps.

### Deployment & Monitoring

- [ ] Prepare production environment (VPS, Vercel, Railway, etc.).
- [ ] Deploy bot, server, and dashboard.
- [x] Set up logging/monitoring (optional but recommended).
- [ ] Create support/test Discord server (optional).

---

## 5. Potential Enhancements (Post-MVP)

- [ ] Advanced analytics on dashboard
- [ ] User roles/permissions in dashboard
- [ ] Notification system (email/Discord)
- [ ] More advanced montage options

---

## Legend

- [x] = Complete
- [ ] = Incomplete; needs work

---

**Focus next on:**

- Finalizing bot commands, queue persistence, and FFmpeg pipeline
- Real-time dashboard/bot/server integration
- Robust testing and polish before deployment

Refer to this checklist as your authoritative source for remaining MVP work.
