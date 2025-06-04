# Command Implementation Plan

## Example Command Implementation Outline (`/queue add`)

**Purpose:**  
Describe what the command does and its user-facing goal.

**Command Structure:**  

- Name:  
- Subcommand(s) (if any):  
- Options: (list each, with type and whether required/optional)

**Behavior:**  

- Step-by-step logic for handling the command (validation, DB, queue, feedback, etc.)

**Permissions:**  

- Who can use it? (everyone/admins only)

**User Feedback:**  

- What is sent back to the user (success, error, queue position, etc.)

---

## Slash Commands Checklist

### 1. `/queue` Commands

- [x] `/queue add [attachment] [priority] [queue (optional)]`
  - [x] Validate attachment (file type, size, duration)
  - [x] Store clip metadata in MongoDB
  - [x] Add to queue collection (optionally to a named queue if specified)
  - [x] Respond with queue position or error (show named queue if used)
  - [x] All users can use
  - [x] Success/error feedback
  - [ ] **Named Queues (optional):**
    - [ ] Allow users to specify a queue name to organize clips for different montages
    - [ ] Default to a global/shared queue if not provided
    - [ ] Support creating and listing named queues
    - [ ] Show user's queue position within the specified named queue

- [ ] `/queue add-batch [attachments] [priority]`
  - [ ] Accept multiple video files as attachments
  - [ ] Validate each file (type, size, duration)
  - [ ] Store all valid clip metadata in MongoDB
  - [ ] Add all valid clips to queue collection
  - [ ] Respond with summary: how many succeeded/failed, first/last queue position, errors if any
  - [ ] All users can use
  - [ ] Success/error feedback for each file

- [ ] `/queue status`
  - [ ] Fetch current queue from DB
  - [ ] Determine user’s position
  - [ ] Display queue summary
  - [ ] All users can use
  - [ ] Feedback: queue list, user’s position

- [ ] `/queue remove [clip_id]`
  - [ ] Validate ownership (user/admin)
  - [ ] Remove clip from queue and DB
  - [ ] Respond with confirmation or error
  - [ ] Owner or admin only
  - [ ] Success/error feedback

- [ ] `/queue clear`
  - [ ] Check admin permissions
  - [ ] Remove all clips from queue
  - [ ] Respond with confirmation
  - [ ] Admin only
  - [ ] Success/error feedback

- [x] `/purgeclips` (internal, not in original plan)
  - [x] Admin/owner-only purge of all clips
  - [x] Success/error feedback

### 2. `/montage` Commands

- [ ] `/montage create [options]`
  - [ ] Validate options and queue state
  - [ ] Trigger FFmpeg pipeline
  - [ ] Store montage record in DB
  - [ ] Respond with progress/status
  - [ ] All users (optionally restrict to admins)
  - [ ] Feedback: montage started, progress/error

### 3. `/config` Commands

- [ ] `/config set [option] [value]`
  - [ ] Check admin permissions
  - [ ] Validate option/value
  - [ ] Update config in DB
  - [ ] Respond with confirmation or error
  - [ ] Admin only
  - [ ] Success/error feedback

---

## General Implementation Checklist

- [x] Validation: user input and permissions
- [x] Persistence: MongoDB for queue, clips, montages, configs
- [x] Error Handling: clear, actionable error messages
- [x] User Feedback: always reply to user with status, errors, or results
- [x] Testing: test cases for success, failure, edge cases (for implemented commands)

---

Continue checking off each item as you implement or verify them in the codebase.

---

## Code Examples

Below are practical code snippets for implementing commands using the established structure. Adjust imports and logic as needed for each command.

### Basic Command Template

```typescript
import { Command } from '../../types/index.js';

export default new Command({
  name: 'example',
  description: 'Describe what this command does.',
  category: 'general',
  options: [
    // { name, type, description, required }
  ],
  execute: async (interaction) => {
    // Command logic here
    await interaction.reply('Example response!');
  },
});
```

### Example: `/queue add`

```typescript
import { Command } from '../../types/index.js';

export default new Command({
  name: 'queue',
  description: 'Manage the video queue.',
  category: 'queue',
  options: [
    {
      name: 'add',
      description: 'Add a video clip to the queue.',
      type: 1, // SUB_COMMAND
      options: [
        {
          name: 'attachment',
          description: 'The video file to add.',
          type: 11, // ATTACHMENT
          required: true,
        },
        {
          name: 'priority',
          description: 'Priority of the clip.',
          type: 3, // STRING
          required: false,
          choices: [
            { name: 'Normal', value: 'normal' },
            { name: 'High', value: 'high' },
          ],
        },
      ],
    },
  ],
  execute: async (interaction) => {
    // 1. Validate attachment
    // 2. Store metadata in DB
    // 3. Add to queue
    // 4. Reply to user
    await interaction.reply('Clip added to queue!');
  },
});
```

### Example: Permission Check

```typescript
if (!user.isAdmin) {
  await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  return;
}
```

### Example: Error Handling

```typescript
try {
  // Command logic
} catch (error) {
  await interaction.reply({ content: 'An error occurred. Please try again later.', ephemeral: true });
}
```
