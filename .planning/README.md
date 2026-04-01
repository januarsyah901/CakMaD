# 🚀 Version Management Agent - Summary

Ini dokumentasi lengkap untuk **Version Management Agent** kamu yang handle semua versioning, changelog, dan GitHub releases otomatis.

## 📁 Files Created

Semua file tersimpan di `.planning/`:

### 1. **VERSION_AGENT_SYSTEM_PROMPT.md** ⭐ (CRITICAL)
File paling penting - ini adalah "otak" dari agent.
- Berisi instruksi lengkap untuk AI
- Mendefinisikan semua commands: bump-version, add-changelog, push-release, dll
- Explain error handling, validation, user feedback
- **Ini yang harus di-load ke agent**

### 2. **VERSION_AGENT_PROMPT.md**
Dokumentasi command-command yang tersedia:
- Penjelasan setiap action (bump-version, add-changelog, list-versions, dll)
- Options dan parameters untuk setiap command
- Expected output untuk setiap command
- Full automation workflow

### 3. **VERSION_AGENT_USAGE.md**
User guide dengan contoh:
- Quick start
- Common workflows (bump version, add to changelog, full release)
- Command reference table
- Troubleshooting section
- Tips & best practices

### 4. **VERSION_AGENT_IMPLEMENTATION.md**
Panduan implementasi:
- Cara integrate agent ke project
- 3 opsi implementasi (OpenCode, Node.js, Manual)
- Step-by-step setup
- Configuration options
- Testing checklist

---

## 🎯 Quick Start (3 Langkah)

### Step 1: Setup
```bash
# Pastikan gh CLI installed dan authenticated
gh auth login
```

### Step 2: Use the Agent
```
/manage-release bump-version --version 1.2.0 --type minor --title "Polish & UX"
# Agent akan handle semua: git commit, tag, changelog creation
```

### Step 3: Push
```
/manage-release push-release --version 1.2.0 --create-github-release
# Agent akan push ke GitHub dan create release otomatis
```

---

## 📋 Available Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `bump-version` | Create new version + changelog | `/manage-release bump-version --version 1.2.0` |
| `add-changelog` | Add entry to version | `/manage-release add-changelog --section Added --entry "Feature X"` |
| `list-versions` | See all versions | `/manage-release list-versions` |
| `push-release` | Push + create GitHub release | `/manage-release push-release --version 1.2.0 --create-github-release` |
| `create-release` | GitHub release only | `/manage-release create-release --version 1.2.0` |
| `sync-version` | Update package.json | `/manage-release sync-version --from latest` |
| `generate-summary` | Merge all changelogs | `/manage-release generate-summary --output CHANGELOG.md` |

---

## 🔄 Typical Release Workflow

```
1. /manage-release bump-version --version 1.2.0 --type minor
   ↓ (Agent creates changelog, commits, tags)
   
2. Review changelog file: version/v1.2.0.md
   ↓
   
3. /manage-release push-release --version 1.2.0 --create-github-release
   ↓ (Agent pushes to main, tag, creates GitHub release)
   
4. Release live on GitHub! 🎉
```

---

## 📚 File Structure

After using the agent:
```
mdpdf/
├── package.json                    # version updated
├── version/
│   ├── v1.0.md
│   ├── v1.1.md
│   └── v1.2.0.md                   # ← NEW
├── CHANGELOG.md                    # (optional)
└── .planning/
    ├── VERSION_AGENT_SYSTEM_PROMPT.md     ⭐ Load this to agent
    ├── VERSION_AGENT_PROMPT.md            ← Command specs
    ├── VERSION_AGENT_USAGE.md             ← User guide
    └── VERSION_AGENT_IMPLEMENTATION.md    ← Setup guide
```

---

## ✨ Key Features

✅ **Automated versioning** - Bumps version automatically, follows semantic versioning (X.Y.Z)

✅ **Smart changelog creation** - Creates structured changelogs with Added/Fixed/Changed/Removed sections

✅ **Git automation** - Handles commits, tags, and pushes automatically

✅ **GitHub releases** - Auto-creates GitHub releases with changelog as notes

✅ **Validation** - Validates inputs, checks git status, prevents errors

✅ **Error handling** - Clear error messages and recovery steps

✅ **Flexible** - Add to existing changelogs, regenerate master changelog, sync versions

---

## 🛠️ Implementation Options

### Option 1: Use as-is with Any AI Assistant (Fastest)
```
1. Copy VERSION_AGENT_SYSTEM_PROMPT.md content
2. Paste into ChatGPT/Claude/your AI tool
3. Type: /manage-release bump-version --version 1.2.0
4. Done!
```

### Option 2: OpenCode Custom Command (If using OpenCode)
```typescript
// Create handler in .opencode/commands/manage-release.ts
// Load VERSION_AGENT_SYSTEM_PROMPT.md
// Delegate to AI agent with bash, read, edit, write tools
```

### Option 3: Node.js Script
```bash
#!/usr/bin/env node
// scripts/manage-release.js
// Load system prompt
// Call AI API (OpenAI/Anthropic)
// Execute returned commands
```

See **VERSION_AGENT_IMPLEMENTATION.md** untuk detail lengkap.

---

## 🎓 How It Works

```
User Input
    ↓
Parse command (/manage-release bump-version --version 1.2.0)
    ↓
Load System Prompt (VERSION_AGENT_SYSTEM_PROMPT.md)
    ↓
Send to AI with context
    ↓
AI understands the task:
  - Validate semantic version (1.2.0) ✓
  - Check git status ✓
  - Create changelog file
  - Update package.json
  - Git commit + tag
    ↓
Execute bash commands for git operations
    ↓
Return success message with next steps
    ↓
User runs: /manage-release push-release --version 1.2.0
    ↓
AI: push to main, push tag, create GitHub release
    ↓
Release live! 🎉
```

---

## 🔒 Safety Features

The agent includes:
- ✓ Git status validation (must be clean)
- ✓ Semantic version validation (X.Y.Z format)
- ✓ Tag existence check (prevents overwriting)
- ✓ Confirmation prompts before remote operations
- ✓ Atomic operations (commit before tag before push)
- ✓ Clear error messages with recovery steps

---

## 📖 Reading Guide

Depending on your role:

**Developers implementing the agent:**
1. Read VERSION_AGENT_IMPLEMENTATION.md first
2. Load VERSION_AGENT_SYSTEM_PROMPT.md into agent
3. Test with VERSION_AGENT_USAGE.md examples

**End users using the commands:**
1. Read VERSION_AGENT_USAGE.md for examples
2. Run commands like: `/manage-release bump-version --version 1.2.0`

**Maintenance/customization:**
1. Refer to VERSION_AGENT_PROMPT.md for command specs
2. Modify VERSION_AGENT_SYSTEM_PROMPT.md for behavior changes

---

## 💡 Example: Full Release

```bash
# 1. Bump version
/manage-release bump-version --version 1.2.0 --type minor --title "Polish & UX"

# Agent prompts:
# Added features? > Resizable panels, Focus mode, Word count
# Fixed bugs? > Export styling, Scroll lag
# Changed? > Toast notifications
# Notes? > Production ready

# Agent creates:
# ✓ version/v1.2.0.md with your changelog
# ✓ Updates package.json to 1.2.0
# ✓ Creates git commit: "chore: release v1.2.0"
# ✓ Creates git tag: v1.2.0

# 2. Push everything
/manage-release push-release --version 1.2.0 --create-github-release

# Agent:
# ✓ Pushes main branch
# ✓ Pushes tag
# ✓ Creates GitHub release with changelog

# 3. DONE! Release is live 🎉
# https://github.com/yourname/mdpdf/releases/tag/v1.2.0
```

---

## 🚦 Next Steps

1. **Read VERSION_AGENT_IMPLEMENTATION.md** to understand setup options
2. **Choose an implementation** (OpenCode / Node / Manual)
3. **Load VERSION_AGENT_SYSTEM_PROMPT.md** into your agent
4. **Test with simple commands** (`list-versions` first)
5. **Use in your workflow** (`bump-version` → `push-release`)

---

## ❓ Questions?

Refer to the relevant file:
- **How do I use this?** → VERSION_AGENT_USAGE.md
- **What commands are available?** → VERSION_AGENT_PROMPT.md
- **How do I set it up?** → VERSION_AGENT_IMPLEMENTATION.md
- **What should the agent do?** → VERSION_AGENT_SYSTEM_PROMPT.md

---

## 📝 License & Usage

These prompts are free to customize and modify for your project. Key points:
- Modify `version/` folder path if needed
- Adjust git branch name (currently `main`)
- Customize commit message format
- Adapt to your team's workflow

All files are in `.planning/` folder - add to version control.

---

## 🎉 You're All Set!

Kamu udah punya agent command yang lengkap untuk manage releases. Tinggal implement sesuai pilihan kamu, terus bisa langsung pakai untuk release otomatis.

**Happy releasing!** 🚀
