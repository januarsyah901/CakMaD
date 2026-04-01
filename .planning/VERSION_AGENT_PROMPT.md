# Version Management Agent Command

## Deskripsi
Agent ini mengelola versioning, changelog, dan release automation untuk project mdpdf. Semua proses otomatis dari local - tidak perlu manual GUI GitHub.

---

## Command Format

```
/manage-release <action> [options]
```

---

## Actions Available

### 1. **bump-version**
Bump ke versi baru dan buat/update changelog.

**Usage:**
```
/manage-release bump-version --version 1.2.0 --type minor --title "Add Resizable Panels & Focus Mode"
```

**Options:**
- `--version` (required): Format `X.Y.Z` (semantic versioning)
- `--type` (optional): `major`, `minor`, `patch` (untuk referensi)
- `--title` (optional): Release title untuk GitHub

**Task yang dijalankan:**
1. ✅ Validasi semantic versioning
2. ✅ Check git status (harus clean)
3. ✅ Update `package.json` version field
4. ✅ Create `version/vX.Y.Z.md` changelog file
5. ✅ Prompt user untuk input Added/Fixed/Changed/Removed
6. ✅ Commit: `chore: release v1.2.0`
7. ✅ Create git tag: `v1.2.0`
8. ✅ Tampil output siap untuk push

**Output:**
```
✓ Version bumped to 1.2.0
✓ Changelog created: version/v1.2.0.md
✓ Git committed
✓ Git tag created: v1.2.0

Next step:
  git push origin main --tags
  gh release create v1.2.0 --title "v1.2.0" --notes-file version/v1.2.0.md
```

---

### 2. **add-changelog**
Tambah entries ke changelog versi terkini.

**Usage:**
```
/manage-release add-changelog --section Added --entry "New feature XYZ"
/manage-release add-changelog --section Fixed --entry "Bug in export modal"
```

**Options:**
- `--section` (required): `Added`, `Fixed`, `Changed`, `Removed`
- `--entry` (required): Deskripsi perubahan
- `--version` (optional): Target version (default: latest)

**Task:**
1. ✅ Find latest version file
2. ✅ Read file
3. ✅ Add entry to section
4. ✅ Update file
5. ✅ Show confirmation

---

### 3. **list-versions**
Tampilkan semua versions yang ada.

**Usage:**
```
/manage-release list-versions
```

**Output:**
```
📦 Available Versions:
  v1.1.0 - Planning (Polish & UX)
  v1.0.0 - Initial Release

Current version in package.json: 0.0.0
```

---

### 4. **create-release**
Create GitHub release dari changelog file yang ada.

**Usage:**
```
/manage-release create-release --version 1.2.0
```

**Options:**
- `--version` (required): Version untuk di-release
- `--draft` (optional): Create as draft (default: false)

**Task:**
1. ✅ Validasi version file exists
2. ✅ Check git tag exists
3. ✅ Use `gh release create` dengan notes dari file
4. ✅ Buka release page di browser (optional)

**Command yang dijalankan:**
```bash
gh release create v1.2.0 \
  --title "v1.2.0" \
  --notes-file version/v1.2.0.md \
  --draft=false
```

---

### 5. **push-release**
Otomatis push commit + tag + create release (Full workflow).

**Usage:**
```
/manage-release push-release --version 1.2.0 --create-github-release
```

**Options:**
- `--version` (required): Version untuk di-push
- `--create-github-release` (optional): Langsung buat GitHub release

**Task (Full Automation):**
1. ✅ Validate version exists locally
2. ✅ Check git tag exists
3. ✅ `git push origin main`
4. ✅ `git push origin v1.2.0` (push tag)
5. ✅ If `--create-github-release`, run create-release
6. ✅ Show completion summary

**Output:**
```
✓ Pushed to main branch
✓ Pushed tag v1.2.0
✓ GitHub Release created: https://github.com/user/mdpdf/releases/tag/v1.2.0

Release Notes:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# v1.2.0

## Added
- Resizable panels between editor and preview
- Focus mode (Ctrl+Shift+F)
...
```

---

### 6. **sync-version**
Update package.json version dari latest version file.

**Usage:**
```
/manage-release sync-version --from latest
```

**Task:**
1. ✅ Find latest version file
2. ✅ Extract version number
3. ✅ Update package.json
4. ✅ Show before/after

---

### 7. **generate-summary**
Generate consolidated changelog dari semua version files.

**Usage:**
```
/manage-release generate-summary --output CHANGELOG.md
```

**Task:**
1. ✅ Read all version files
2. ✅ Sort by version (descending)
3. ✅ Merge ke satu file
4. ✅ Create `CHANGELOG.md` di root

---

## Changelog File Format

Agent akan selalu generate file dengan format ini:

```markdown
# Version X.Y.Z - YYYY-MM-DD

## Added
- Feature 1
- Feature 2

## Fixed
- Bug 1
- Bug 2

## Changed
- Enhancement 1

## Removed
- Deprecated feature

## Notes
- Any important notes
```

---

## Example Full Workflow

```
# 1. Bump version
/manage-release bump-version --version 1.2.0 --title "Add Resizable Panels & Focus Mode"

# Agent will prompt:
# What's new in v1.2.0?
# Added features (comma-separated):
# - Resizable panels, Focus mode, Word count
# Fixed bugs (comma-separated):
# - Export modal styling
# Changed (comma-separated):
# - Improved scroll sync
# Removed (comma-separated):
# - Legacy export button

✓ Version bumped, tag created, ready to push

# 2. Push to GitHub with release
/manage-release push-release --version 1.2.0 --create-github-release

✓ Pushed to main + tags
✓ GitHub Release created
```

---

## Requirements

- `gh` CLI installed (GitHub CLI)
- Git repo initialized
- Signed into GitHub via `gh auth login`

---

## Implementation Notes for Agent

When implementing these commands:

1. **Always validate first**
   - Check git status is clean
   - Verify version format (X.Y.Z)
   - Check tag doesn't already exist

2. **Use semantic versioning**
   - MAJOR.MINOR.PATCH format
   - Validate input before proceeding

3. **Atomic operations**
   - Commit all changes before tagging
   - Show confirmation before pushing

4. **Error handling**
   - If push fails, don't create release
   - Rollback tag if release creation fails
   - Show clear error messages

5. **User feedback**
   - Show progress with ✓ checkmarks
   - Display next steps clearly
   - Show command output when relevant

---

## Git Integration

All commands respect these git operations:

- **Local only**: bump-version, add-changelog, list-versions, sync-version, generate-summary
- **Remote**: push-release, create-release

Workflow is always:
1. Commit local changes
2. Create tag
3. Push branch + tags
4. Create GitHub release (optional)

---

## Future Extensions

- Auto-changelog from commit messages (conventional-commits)
- Auto-version bump detection
- Slack/Discord notifications on release
- GitHub issue auto-closing on release
