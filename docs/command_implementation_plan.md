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

## Slash Commands To Implement

### 1. `/queue` Commands

#### a. `/queue add [attachment] [priority]`

- **Purpose:** Add a video clip to the processing queue.
- **Structure:**  
  - Name: `queue`
  - Subcommand: `add`
  - Options:
    - `attachment` (Attachment, required)
    - `priority` (String/Choice, optional)
- **Behavior:**
  1. Validate attachment (file type, size, duration).
  2. Store clip metadata in MongoDB.
  3. Add to queue collection.
  4. Respond with queue position or error.
- **Permissions:** All users.
- **Feedback:** Success/error message, queue position if successful.

#### b. `/queue status`

- **Purpose:** Show the current queue and user’s position.
- **Structure:**  
  - Name: `queue`
  - Subcommand: `status`
- **Behavior:**
  1. Fetch current queue from DB.
  2. Determine user’s position.
  3. Display queue summary.
- **Permissions:** All users.
- **Feedback:** Queue list, user’s position.

#### c. `/queue remove [clip_id]`

- **Purpose:** Remove a clip from the queue.
- **Structure:**  
  - Name: `queue`
  - Subcommand: `remove`
  - Options:
    - `clip_id` (String, required)
- **Behavior:**
  1. Validate ownership (user/admin).
  2. Remove clip from queue and DB.
  3. Respond with confirmation or error.
- **Permissions:** Owner or admin.
- **Feedback:** Success/error message.

#### d. `/queue clear`

- **Purpose:** Clear the entire queue (admin only).
- **Structure:**  
  - Name: `queue`
  - Subcommand: `clear`
- **Behavior:**
  1. Check admin permissions.
  2. Remove all clips from queue.
  3. Respond with confirmation.
- **Permissions:** Admin only.
- **Feedback:** Success/error message.

---

### 2. `/montage` Commands

#### a. `/montage create [options]`

- **Purpose:** Start montage creation from queued clips.
- **Structure:**  
  - Name: `montage`
  - Subcommand: `create`
  - Options: (e.g., quality, transitions, output settings)
- **Behavior:**
  1. Validate options and queue state.
  2. Trigger FFmpeg pipeline.
  3. Store montage record in DB.
  4. Respond with progress/status.
- **Permissions:** All users (optionally restrict to admins).
- **Feedback:** Montage started, progress updates, error if failed.

---

### 3. `/config` Commands

#### a. `/config set [option] [value]`

- **Purpose:** Set a configuration value (admin only).
- **Structure:**  
  - Name: `config`
  - Subcommand: `set`
  - Options:
    - `option` (String, required)
    - `value` (String, required)
- **Behavior:**
  1. Check admin permissions.
  2. Validate option/value.
  3. Update config in DB.
  4. Respond with confirmation or error.
- **Permissions:** Admin only.
- **Feedback:** Success/error message.

---

## General Implementation Notes

- **Validation:** Always validate user input and permissions.
- **Persistence:** Use MongoDB for queue, clips, montages, and configs.
- **Error Handling:** Provide clear, actionable error messages.
- **User Feedback:** Always reply to the user with status, errors, or results.
- **Testing:** Each command should have test cases for success, failure, and edge cases.

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
