# ClipCraftr MVP: Remaining Work Summary

This document summarizes all remaining tasks required to achieve a Minimum Viable Product (MVP) for ClipCraftr, based on the current codebase and up-to-date checklists.

---

## 1. Discord Bot (`packages/bot`)

### Core Slash Commands

- [ ] `/queue status` — Show the current queue and user’s position.
- [ ] `/queue remove [clip_id]` — Allow users/admins to remove a clip from the queue.
- [ ] `/queue clear` — Admin-only: clear the entire queue.
- [ ] `/montage create [options]` — Start montage creation from queued clips (support both per-queue and batch flows).
- [ ] `/config set [option] [value]` — Admin-only: set config values.
- [ ] Support montage creation from all clips in queue (optionally: named queues).
- [ ] Support batch upload of clips for montage creation.
- [ ] Ensure queue position logic updates so processed clips show no clips ahead.

### FFmpeg Pipeline

- [ ] Integrate FFmpeg for video concatenation and montage creation.
- [ ] Handle file download, temp storage, and cleanup.
- [ ] Implement progress/status reporting in Discord (for long jobs).
- [ ] Add error handling, retries, and admin notifications for failures.

### Admin & Permissions

- [ ] Implement admin-only config commands and restrict sensitive commands.

---

## 2. Dashboard (`packages/dashboard`)

- [ ] Ensure login/logout/reauth flows are smooth and error-handled.
- [ ] Display real-time queue and status (via WebSocket or polling).
- [ ] Clip management: view, remove, force-process from dashboard.
- [ ] Display montage history/logs.
- [ ] Config panel for admin settings.
- [ ] UI/UX polish for all dashboard features.
- [ ] Ensure dashboard actions update bot/server in real time.
- [ ] Handle error/success feedback for all actions.

---

## 3. Server/API (`packages/server`)

- [ ] Ensure integration with bot and dashboard is robust and all real-time flows are working (MVP mostly complete).

---

## 4. Shared/General

- [ ] End-to-end manual and/or automated tests for:
  - [ ] Discord command flows
  - [ ] Montage output correctness
  - [ ] Dashboard-bot-server sync
  - [ ] Edge cases: large files, unsupported formats, concurrent jobs
- [ ] Complete README and usage guide.
- [ ] Add deployment instructions for bot, server, and dashboard.
- [ ] Document environment variables and setup steps.
- [ ] Prepare production environment (VPS, Vercel, Railway, etc.).
- [ ] Deploy bot, server, and dashboard.
- [ ] Create support/test Discord server (optional).

---

## Focus Next On

- Finalizing bot commands, queue persistence, and FFmpeg pipeline
- Real-time dashboard/bot/server integration
- Robust testing and polish before deployment

Refer to this document for a high-level view of what remains for MVP launch. For detailed status and sub-tasks, see `next_steps_checklist.md` and `command_implementation_plan.md`.
