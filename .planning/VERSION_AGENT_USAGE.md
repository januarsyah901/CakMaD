# Version Management Agent - Usage Guide

## Quick Start

### Setup (First Time Only)

```bash
# Make sure you're authenticated with GitHub
gh auth login

# Verify gh is installed
gh --version
```

---

## Common Workflows

### Workflow 1: Simple Version Bump

```
# Step 1: Bump version
/manage-release bump-version --version 1.2.0 --type minor --title "Add Polish & UX Improvements"

# Agent will ask for details about Added/Fixed/Changed/Removed
# → You answer the prompts
# → changelog file created
# → git commit & tag created

# Step 2: Push when ready
/manage-release push-release --version 1.2.0
```

---

### Workflow 2: Add to Existing Changelog

```
# Quickly add entries to latest version

/manage-release add-changelog --section Added --entry "Resizable panels feature"
/manage-release add-changelog --section Fixed --entry "Export modal styling bug"
/manage-release add-changelog --section Changed --entry "Improved scroll sync performance"
```

---

### Workflow 3: Full Release (Bump + Push + GitHub)

```
# Step 1: Bump
/manage-release bump-version --version 1.2.0 --type minor --title "Release v1.2.0"

# Step 2: Full push with GitHub release
/manage-release push-release --version 1.2.0 --create-github-release
```

Output:
```
✓ Pushed to main branch
✓ Pushed tag v1.2.0
✓ GitHub Release created: https://github.com/yourname/mdpdf/releases/tag/v1.2.0
```

---

### Workflow 4: Check Current Versions

```
/manage-release list-versions

# Output:
# 📦 Available Versions:
#   v1.1.0 - Planning (Polish & UX)
#   v1.0.0 - Initial Release
#
# Current version in package.json: 0.0.0
```

---

### Workflow 5: Generate Master Changelog

```
/manage-release generate-summary --output CHANGELOG.md

# Creates or updates CHANGELOG.md with all versions
# Then commit it:
# git add CHANGELOG.md && git commit -m "docs: update changelog"
```

---

## Available Commands Reference

| Command | Purpose | When to Use |
|---------|---------|------------|
| `bump-version` | Create new version | Starting a release |
| `add-changelog` | Add entry to version | Quick updates during dev |
| `list-versions` | See all versions | Check what's released |
| `sync-version` | Update package.json | After manual changes |
| `push-release` | Push + GitHub release | Ready to go live |
| `create-release` | GitHub release only | Tag already pushed |
| `generate-summary` | Merge all changelogs | Create master CHANGELOG |

---

## Example: Releasing v1.2.0

### Scenario
You've been developing features for version 1.2.0 and now want to release them.

### Steps

**1. Create the release**
```
/manage-release bump-version --version 1.2.0 --type minor --title "Polish & UX Improvements"
```

Agent will ask:
```
What features were added? (comma-separated)
> Resizable panels, Focus mode, Word count display

What bugs were fixed? (comma-separated)
> Export modal styling, Scroll lag

What changed? (comma-separated)
> Improved toast notifications

What was removed? (comma-separated)
> (leave empty)

Any notes?
> Stable release for production
```

Result:
```
✓ Version bumped to 1.2.0
✓ Changelog created: version/v1.2.0.md
✓ Git committed: chore: release v1.2.0
✓ Git tag created: v1.2.0

Next step: /manage-release push-release --version 1.2.0 --create-github-release
```

**2. Push and create GitHub release**
```
/manage-release push-release --version 1.2.0 --create-github-release
```

Result:
```
✓ Pushed to main branch
✓ Pushed tag v1.2.0
✓ GitHub Release created

Release URL: https://github.com/yourname/mdpdf/releases/tag/v1.2.0

Changelog Preview:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Version 1.2.0 - 2026-04-01

## Added
- Resizable panels between editor and preview
- Focus mode (Ctrl+Shift+F for toggling)
- Live word and character count

## Fixed
- Export modal styling issues
- Scroll synchronization lag

## Changed
- Enhanced toast notification animations

## Notes
- Stable release for production
```

**3. Done!** Your release is live on GitHub.

---

## Troubleshooting

### "Git status has uncommitted changes"
```
# Clean up your working directory
git add .
git commit -m "work in progress"
# Then try bump-version again
```

### "Tag vX.Y.Z already exists"
```
# Tag was created before. Either:
# Option 1: Push it
/manage-release push-release --version X.Y.Z

# Option 2: Delete and recreate (be careful!)
git tag -d vX.Y.Z
# Then bump-version again
```

### "gh: command not found"
```
# Install GitHub CLI
# Mac:
brew install gh

# Linux:
sudo apt install gh

# Then authenticate:
gh auth login
```

### "Permission denied" on push
```
# Check your GitHub SSH/token setup
gh auth status
gh auth login  # Re-authenticate if needed
```

---

## File Structure After Release

After running these commands, your project will have:

```
mdpdf/
├── package.json                    # version updated to 1.2.0
├── version/
│   ├── v1.0.md                     # Old releases
│   ├── v1.1.md
│   └── v1.2.0.md                   # ← New release notes
├── CHANGELOG.md                    # (optional) Master changelog
└── .git/
    └── tags/v1.2.0                 # ← Git tag created
```

---

## Tips & Best Practices

### 1. Keep changelogs focused
- What matters to **users**, not developers
- ❌ Bad: "Refactored scroll sync logic"
- ✅ Good: "Improved scroll sync performance"

### 2. Always bump before pushing
```
bump-version → verify looks good → push-release
```

### 3. Use semantic versioning correctly
- `1.0.0` → Initial release
- `1.1.0` → New feature (minor version)
- `1.0.1` → Bug fix (patch version)
- `2.0.0` → Breaking change (major version)

### 4. Commit frequently during development
```
git commit -m "feat: add resizable panels"
git commit -m "fix: export modal styling"
```

Then when releasing:
```
/manage-release bump-version --version 1.2.0
# Agent will ask what changed - you reference your commits
```

### 5. Generate master changelog for easy reference
```
# After releasing a few versions
/manage-release generate-summary --output CHANGELOG.md
git add CHANGELOG.md && git commit -m "docs: update changelog"
```

---

## Integration with CI/CD (Future)

Eventually you can automate releases:

```bash
#!/bin/bash
# .github/workflows/release.yml
- name: Bump version and release
  run: |
    /manage-release bump-version --version ${{ env.NEW_VERSION }} --type minor
    /manage-release push-release --version ${{ env.NEW_VERSION }} --create-github-release
```

---

## Summary

The Version Management Agent handles all release automation:
- ✓ Version bumping
- ✓ Changelog creation
- ✓ Git tagging
- ✓ Pushing to GitHub
- ✓ Creating GitHub releases

You just describe what changed, and the agent handles the rest!
