# Version Management Agent - Documentation Index

> **Lengkap VERSION MANAGEMENT AGENT untuk mdpdf project**
> Otomatis handle versioning, changelog, git tags, dan GitHub releases.

## 📂 File Structure

```
.planning/
├── 📖 README.md                      ← START HERE! Overview & summary
├── 💻 VERSION_AGENT_SYSTEM_PROMPT.md ← CORE! Load this to your agent
├── 📋 VERSION_AGENT_PROMPT.md        ← Detailed command specs
├── 🎯 VERSION_AGENT_USAGE.md         ← User guide & examples
├── 🔧 VERSION_AGENT_IMPLEMENTATION.md ← Setup & integration guide
├── ⚡ QUICK_REFERENCE.txt            ← Cheat sheet
└── 📑 INDEX.md                       ← This file
```

---

## 🚀 Quick Navigation

### Untuk User (Ingin pake agent)
1. Baca: **QUICK_REFERENCE.txt** (5 min) - lihat commands
2. Baca: **VERSION_AGENT_USAGE.md** (15 min) - lihat examples
3. Langsung pakai: `/manage-release bump-version --version 1.2.0`

### Untuk Developer (Ingin setup agent)
1. Baca: **README.md** (10 min) - overview
2. Baca: **VERSION_AGENT_IMPLEMENTATION.md** (20 min) - setup options
3. Load: **VERSION_AGENT_SYSTEM_PROMPT.md** ke agent
4. Test dengan commands di QUICK_REFERENCE.txt

### Untuk Maintainer (Ingin customize)
1. Baca: **VERSION_AGENT_SYSTEM_PROMPT.md** - core logic
2. Modify sesuai kebutuhan
3. Test dengan examples di VERSION_AGENT_USAGE.md

---

## 📘 Detailed Guide

### [README.md](README.md)
**Overview lengkap dari semua dokumentasi**
- 🎯 Apa itu agent ini
- 📋 Command list
- 🔄 Workflow diagram
- 🔑 Key features
- 📍 File locations
- 📚 Reading guide

**Waktu: 10 menit | Untuk: Semua orang**

---

### [VERSION_AGENT_SYSTEM_PROMPT.md](VERSION_AGENT_SYSTEM_PROMPT.md)
**Core agent logic - YANG HARUS DI-LOAD KE AGENT**
- 🤖 System prompt untuk AI
- 📝 Command handling (bump-version, add-changelog, etc)
- ✅ Validation logic
- 🔒 Safety checks
- 📤 User communication guidelines

**Waktu: 20 menit | Untuk: Developer yang setup agent | PENTING!**

---

### [VERSION_AGENT_PROMPT.md](VERSION_AGENT_PROMPT.md)
**Dokumentasi lengkap setiap command**
- 1️⃣ bump-version - Create new version
- 2️⃣ add-changelog - Quick entry addition
- 3️⃣ list-versions - List all versions
- 4️⃣ create-release - GitHub release
- 5️⃣ push-release - Full push automation
- 6️⃣ sync-version - Update package.json
- 7️⃣ generate-summary - Master changelog

**Waktu: 15 menit | Untuk: Developer yang ingin understand commands**

---

### [VERSION_AGENT_USAGE.md](VERSION_AGENT_USAGE.md)
**Praktis guide dengan contoh-contoh**
- 🎯 Quick start
- 🔄 Workflow 1-5 (bump, add, release, etc)
- 💬 Command reference table
- 🐛 Troubleshooting
- 💡 Tips & best practices
- 📝 Full example walthrough

**Waktu: 20 menit | Untuk: End users yang mau pake | RECOMMENDED**

---

### [VERSION_AGENT_IMPLEMENTATION.md](VERSION_AGENT_IMPLEMENTATION.md)
**Setup & integration instructions**
- 🔧 How to implement (3 opsi)
- 📦 Integration steps
- ✅ Checklist
- 🧪 Testing
- ⚙️ Configuration
- 🔄 Workflow automation

**Waktu: 25 menit | Untuk: Developer yang setup di project**

---

### [QUICK_REFERENCE.txt](QUICK_REFERENCE.txt)
**Cheat sheet - lihat langsung tanpa baca panjang**
- ⚡ Commands 1-5
- 🔄 Typical workflow
- ✅ Validation checks
- 📁 File locations
- 🐛 Troubleshooting quick fixes
- 📚 Semantic versioning

**Waktu: 5 menit | Untuk: Quick lookup saat kerja**

---

## 🎯 Usage Examples

### Example 1: Simple Version Bump
```bash
/manage-release bump-version --version 1.2.0 --type minor --title "Polish & UX"
# → Agent creates changelog, commits, tags
```

### Example 2: Quick Add to Changelog
```bash
/manage-release add-changelog --section Added --entry "Resizable panels"
/manage-release add-changelog --section Fixed --entry "Export bug"
```

### Example 3: Full Release (Bump + Push + GitHub)
```bash
/manage-release bump-version --version 1.2.0 --type minor
/manage-release push-release --version 1.2.0 --create-github-release
# → Release live on GitHub!
```

---

## 🔑 Key Concepts

### Semantic Versioning (X.Y.Z)
- **Major** (1.x.x) - Breaking changes
- **Minor** (x.1.x) - New features
- **Patch** (x.x.1) - Bug fixes

### Workflow Flow
```
bump-version (local) → push-release (remote) → GitHub release (live)
```

### What Agent Does
- ✅ Validate all inputs
- ✅ Check git status
- ✅ Create/update files
- ✅ Git commit & tag
- ✅ Push to GitHub
- ✅ Create releases
- ✅ Handle errors

---

## ⚙️ Supported Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `bump-version` | Create new version | `--version 1.2.0 --type minor` |
| `add-changelog` | Add entry | `--section Added --entry "Feature"` |
| `list-versions` | See all versions | (no args) |
| `push-release` | Push + GitHub release | `--version 1.2.0 --create-github-release` |
| `create-release` | GitHub release only | `--version 1.2.0` |
| `sync-version` | Update package.json | `--from latest` |
| `generate-summary` | Master changelog | `--output CHANGELOG.md` |

---

## 🚀 Getting Started (3 Steps)

### Step 1: Setup
```bash
gh auth login  # Authenticate with GitHub
```

### Step 2: Test
```bash
/manage-release list-versions
```

### Step 3: Release
```bash
/manage-release bump-version --version 1.2.0 --type minor
/manage-release push-release --version 1.2.0 --create-github-release
```

Done! Release is live 🎉

---

## 📍 Implementation Options

### Option A: Use as-is (Fastest)
Copy VERSION_AGENT_SYSTEM_PROMPT.md → Paste into any AI → Start using

### Option B: OpenCode Custom Command
Create `.opencode/commands/manage-release.ts` → Load system prompt → Done

### Option C: Node.js Script
Create `scripts/manage-release.js` → Call AI API → Execute commands

See VERSION_AGENT_IMPLEMENTATION.md for details.

---

## ✅ Validation & Safety

Agent automatically checks:
- ✓ Git status is clean
- ✓ Version format (X.Y.Z)
- ✓ Files exist
- ✓ Tags don't duplicate
- ✓ gh CLI authenticated
- ✓ Clear error messages

---

## 🎓 Learning Path

**Beginner** (ingin pake)
1. QUICK_REFERENCE.txt (5 min)
2. VERSION_AGENT_USAGE.md (20 min)
3. Start using! ✅

**Intermediate** (ingin setup)
1. README.md (10 min)
2. VERSION_AGENT_IMPLEMENTATION.md (20 min)
3. Load system prompt (5 min)
4. Test ✅

**Advanced** (ingin customize)
1. VERSION_AGENT_SYSTEM_PROMPT.md (30 min)
2. VERSION_AGENT_PROMPT.md (20 min)
3. Modify & extend ✅

---

## 📞 Need Help?

- **How do I use this?** → VERSION_AGENT_USAGE.md
- **How do I set it up?** → VERSION_AGENT_IMPLEMENTATION.md
- **What commands exist?** → VERSION_AGENT_PROMPT.md or QUICK_REFERENCE.txt
- **What should agent do?** → VERSION_AGENT_SYSTEM_PROMPT.md
- **Overview of everything?** → README.md

---

## 📊 File Summary

| File | Size | Purpose | Audience |
|------|------|---------|----------|
| README.md | 8KB | Overview | Everyone |
| VERSION_AGENT_SYSTEM_PROMPT.md | 6KB | **Core logic** | Developers |
| VERSION_AGENT_PROMPT.md | 6KB | Command specs | Developers |
| VERSION_AGENT_USAGE.md | 7KB | User guide | Users |
| VERSION_AGENT_IMPLEMENTATION.md | 6KB | Setup guide | Developers |
| QUICK_REFERENCE.txt | 10KB | Cheat sheet | Everyone |
| INDEX.md | This file | Navigation | Everyone |

**Total: ~56KB of complete documentation**

---

## 🎉 What You Have

✅ Complete agent system prompt
✅ Command documentation
✅ User guide with examples
✅ Setup instructions
✅ Quick reference
✅ Troubleshooting guide
✅ Implementation options

**Everything you need to manage versions automatically!**

---

## 🚀 Next Steps

1. **Choose your path above** (Beginner/Intermediate/Advanced)
2. **Read relevant files**
3. **Implement or start using**
4. **Enjoy automated releases!** 🎉

---

**Happy releasing!** 🚀
