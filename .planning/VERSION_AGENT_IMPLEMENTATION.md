# How to Implement Version Management Agent

## Overview

Kamu punya 3 file yang sudah dibuat:

1. **VERSION_AGENT_PROMPT.md** - Command documentation & action specs
2. **VERSION_AGENT_SYSTEM_PROMPT.md** - Agent behavior & implementation details
3. **VERSION_AGENT_USAGE.md** - User guide with examples

## Step 1: Choose Your Agent Platform

### Option A: OpenCode Custom Slash Command

Jika kamu pakai OpenCode, buat slash command handler:

```bash
# .opencode/commands/manage-release.ts
import { defineCommand } from '@opencode/sdk';

export default defineCommand({
  name: 'manage-release',
  description: 'Manage versions, changelogs, and releases',
  async handler(args: string[], context) {
    // Parse args: bump-version, add-changelog, list-versions, etc
    const action = args[0];
    const options = parseOptions(args.slice(1));
    
    // Load system prompt
    const systemPrompt = await readFile('.planning/VERSION_AGENT_SYSTEM_PROMPT.md');
    
    // Delegate to agent
    const result = await context.createAgent({
      systemPrompt,
      task: `User requested: /${this.name} ${args.join(' ')}`,
      tools: ['bash', 'read', 'edit', 'write', 'glob', 'grep']
    });
    
    return result;
  }
});
```

### Option B: Standalone Node.js Script

```javascript
// scripts/manage-release.js
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const action = process.argv[2];
const options = parseArgs(process.argv.slice(3));

// Load system prompt
const systemPrompt = fs.readFileSync(
  path.join(__dirname, '..', '.planning', 'VERSION_AGENT_SYSTEM_PROMPT.md'),
  'utf-8'
);

// Call AI model with system prompt
const result = await callAI({
  model: 'gpt-4', // or Claude, etc
  systemPrompt,
  userMessage: `Execute: /manage-release ${action} ${stringifyOptions(options)}`,
  tools: ['bash', 'file_read', 'file_write']
});

console.log(result);
```

### Option C: Use with Any AI Assistant

Literally copy the system prompt (VERSION_AGENT_SYSTEM_PROMPT.md) and:

```
You: [Paste system prompt content here]

You: /manage-release bump-version --version 1.2.0 --type minor
```

The AI will understand what to do.

---

## Step 2: System Prompt Integration

The agent needs access to this system prompt:

**Minimal Integration:**
```
When user types `/manage-release <action>`, use this system prompt:
[Content of VERSION_AGENT_SYSTEM_PROMPT.md]

Then execute the action.
```

**Full Integration:**
```
1. Load VERSION_AGENT_SYSTEM_PROMPT.md
2. Append user command as context
3. Pass to AI with these tools: bash, read, edit, write, glob, grep
4. Execute returned commands
5. Show output to user
```

---

## Step 3: Grant Required Tools

The agent needs these capabilities:

```
✓ Bash - For git commands (git add, commit, tag, push)
✓ Read - For reading package.json, version files
✓ Edit - For modifying package.json
✓ Write - For creating new version files
✓ Glob - For finding version/*.md files
✓ Grep - For searching in files
```

---

## Step 4: Configuration (Optional)

Add config to your project:

```json
// .versionrc.json
{
  "versionFolder": "version",
  "fileFormat": "vX.Y.Z.md",
  "gitPrefix": "v",
  "gitMessage": "chore: release {version}",
  "mainBranch": "main",
  "changelogOutput": "CHANGELOG.md"
}
```

Then agent can read this config and adapt behavior.

---

## Step 5: Testing

Test the agent with:

```bash
# List versions
/manage-release list-versions

# Dry run bump (without commit)
/manage-release bump-version --version 1.2.0 --dry-run

# Actual bump
/manage-release bump-version --version 1.2.0 --type minor --title "Test"

# Add to changelog
/manage-release add-changelog --section Added --entry "Test feature"

# Push
/manage-release push-release --version 1.2.0
```

---

## Step 6: Feedback Loop

Monitor agent behavior:

- ✓ Does it validate inputs correctly?
- ✓ Does it check git status?
- ✓ Does it create proper commit messages?
- ✓ Does it handle errors gracefully?
- ✓ Does it show clear next steps?

If something's off, update the system prompt and retry.

---

## Implementation Checklist

- [ ] Save all 3 MD files to `.planning/` folder
- [ ] Choose agent platform (OpenCode / Node / etc)
- [ ] Integrate system prompt into agent
- [ ] Grant bash, read, edit, write, glob, grep tools
- [ ] Test with `list-versions` command
- [ ] Test with bump-version (dry-run first)
- [ ] Test with add-changelog
- [ ] Test with push-release
- [ ] Document custom commands in your README
- [ ] Add to team wiki/docs

---

## Quick Start (Fastest Way)

If you just want to start using immediately:

```
1. Copy VERSION_AGENT_SYSTEM_PROMPT.md content
2. Paste into any AI assistant (Claude, ChatGPT, etc)
3. Type: /manage-release bump-version --version 1.2.0

Done! The AI will handle everything.
```

---

## Customization Examples

### Change Version Naming
Modify prompt:
```
# Default: version/v1.2.0.md
# Change to: version/1.2.0/CHANGELOG.md
# Update: VERSION_AGENT_SYSTEM_PROMPT.md line ~80
```

### Change Git Message Format
Modify prompt:
```
# Default: chore: release v1.2.0
# Change to: Release v1.2.0
# Update: VERSION_AGENT_SYSTEM_PROMPT.md line ~120
```

### Add Slack Notifications
Extend system prompt:
```
"When release completes, also run:
  curl -X POST $SLACK_WEBHOOK -d '{
    text: \"Release v1.2.0 published\"
  }'"
```

---

## Troubleshooting Implementation

**Q: Agent doesn't understand commands**
A: Make sure full system prompt is loaded, not just the usage guide

**Q: Bash commands fail**
A: Ensure bash tool has proper working directory context

**Q: Git operations fail**
A: Check git is installed and repo is initialized

**Q: gh CLI commands fail**
A: Ensure `gh auth login` was run first

**Q: Agent creates wrong file format**
A: Update the template in system prompt if needed

---

## File Reference

| File | Purpose | Who Reads |
|------|---------|-----------|
| VERSION_AGENT_PROMPT.md | Command specs | Developers implementing |
| VERSION_AGENT_SYSTEM_PROMPT.md | **Agent behavior** | **The AI Agent (critical)** |
| VERSION_AGENT_USAGE.md | User guide | End users / developers |

The **VERSION_AGENT_SYSTEM_PROMPT.md** is the critical one - that's what the agent needs to function.

---

## Next Steps

1. Decide on implementation method (OpenCode vs Node vs manual)
2. Set up the agent with the system prompt
3. Test with simple commands first
4. Use in actual release workflow
5. Iterate based on feedback

Happy releasing! 🚀
