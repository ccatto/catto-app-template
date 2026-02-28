# Publishing @catto/ui to npm

This guide covers how to publish @catto/ui to npm and the workflow for releasing updates.

---

## First-Time Setup

### 1. Create npm Account

1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email
4. Enable 2FA (required for publishing)

### 2. Login Locally

```bash
npm login
# Enter username, password, and 2FA code
```

### 3. Create npm Organization (for @catto scope)

Since the package is scoped as `@catto/ui`, you need an npm organization:

1. Go to https://www.npmjs.com/org/create
2. Create organization named `catto`
3. Free tier works for public packages

**Alternative:** Use your username scope instead (`@chriscatto/ui`)

### 4. Verify Package Name is Available

```bash
npm view @catto/ui
# Should return 404 if not yet published
```

---

## Pre-Publish Checklist

Before publishing any version, verify:

- [ ] All tests pass

  ```bash
  yarn workspace @catto/ui test:run
  ```

- [ ] Build succeeds

  ```bash
  yarn workspace @catto/ui build
  ```

- [ ] Version is updated in `package.json`

- [ ] `CHANGELOG.md` has entry for new version

- [ ] README is up to date (component count, test count, etc.)

---

## Publishing v1.0.0 (First Release)

### 1. Verify package.json

Ensure these fields are set:

```json
{
  "name": "@catto/ui",
  "version": "1.0.0",
  "description": "Production-ready React component library with Tailwind CSS v4",
  "author": "Chris Catto",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/chriscatto/catto-ui"
  },
  "homepage": "https://github.com/chriscatto/catto-ui#readme",
  "bugs": {
    "url": "https://github.com/chriscatto/catto-ui/issues"
  },
  "keywords": [
    "react",
    "components",
    "ui",
    "tailwind",
    "tailwindcss",
    "nextjs",
    "typescript",
    "dark-mode",
    "accessible"
  ]
}
```

### 2. Update CHANGELOG.md

Add a v1.0.0 entry:

```markdown
## [1.0.0] - 2026-02-11

### Added

- Initial public release
- 71 UI components
- 4 custom hooks
- 2 themes (RLeaguez, Neon Pulse)
- Full TypeScript support
- 1,208 unit tests
- Storybook documentation
```

### 3. Build the Package

```bash
cd packages/ui
yarn build
```

### 4. Publish

```bash
# For scoped packages, --access public is required
npm publish --access public
```

### 5. Verify Publication

```bash
# Check it's live on npm
npm view @catto/ui

# View on npmjs.com
# https://www.npmjs.com/package/@catto/ui
```

---

## Publishing Updates (v1.0.1, v1.1.0, etc.)

### Workflow

```
1. Create a branch for your changes
2. Make changes
3. Run tests
4. Update version (following semver)
5. Update CHANGELOG.md
6. Build
7. Commit and push
8. Publish
9. Create GitHub release (optional)
```

### Semver Guidelines

| Change Type                | Version Bump | Example       |
| -------------------------- | ------------ | ------------- |
| Bug fix, typo, patch       | PATCH        | 1.0.0 → 1.0.1 |
| New component, new feature | MINOR        | 1.0.0 → 1.1.0 |
| Breaking API change        | MAJOR        | 1.0.0 → 2.0.0 |

### Update Version

```bash
# Option 1: Manual edit package.json

# Option 2: npm version command
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### Example: Publishing a Bug Fix (v1.0.1)

```bash
# 1. Make your fix
# 2. Run tests
yarn workspace @catto/ui test:run

# 3. Update version
cd packages/ui
npm version patch

# 4. Update CHANGELOG.md
# Add entry for v1.0.1

# 5. Build
yarn build

# 6. Commit
git add .
git commit -m "chore: release v1.0.1"

# 7. Publish
npm publish --access public

# 8. Push
git push && git push --tags
```

### Example: Publishing a New Component (v1.1.0)

```bash
# 1. Add new component with tests and story
# 2. Export from index.ts
# 3. Update README (component count)

# 4. Run tests
yarn workspace @catto/ui test:run

# 5. Update version
cd packages/ui
npm version minor

# 6. Update CHANGELOG.md
# Add entry for v1.1.0 describing new component

# 7. Build
yarn build

# 8. Commit
git add .
git commit -m "feat: add NewComponentCatto, release v1.1.0"

# 9. Publish
npm publish --access public

# 10. Push
git push && git push --tags
```

---

## GitHub Repository Setup (Optional)

If you want a separate public repo for @catto/ui:

### Option A: Separate Repository

1. Create repo: `github.com/chriscatto/catto-ui`
2. Copy `packages/ui` contents to new repo
3. Update `repository` field in package.json
4. Publish from the new repo

### Option B: Publish from Monorepo (Current Setup)

Keep the package in the RLeaguez monorepo and publish from there. Many companies do this (Vercel, Shopify, etc.).

Pros:

- Single source of truth
- Easier to test changes with RLeaguez app
- Less repo management

Cons:

- Contributors need access to full monorepo
- Issues/PRs mixed with RLeaguez

---

## Troubleshooting

### "You must be logged in to publish"

```bash
npm login
# or
npm whoami  # Check if logged in
```

### "Package name too similar to existing package"

Choose a different name or use a scoped package (`@username/ui`).

### "You do not have permission to publish"

For scoped packages:

1. Ensure you created the npm org
2. Ensure you're a member with publish rights
3. Use `--access public` flag

### "Version already exists"

You can't republish the same version. Bump the version number.

```bash
npm version patch
```

### Build Errors Before Publish

```bash
# Clean and rebuild
rm -rf dist
yarn build
```

---

## Post-Publish Checklist

After publishing:

- [ ] Verify on npmjs.com: https://www.npmjs.com/package/@catto/ui
- [ ] Test install in a fresh project:
  ```bash
  mkdir test-install && cd test-install
  npm init -y
  npm install @catto/ui
  ```
- [ ] Create GitHub release with changelog (optional)
- [ ] Announce on social media (optional)
- [ ] Update RLeaguez to use published version (optional)

---

## Useful Commands Reference

```bash
# Check if logged in
npm whoami

# View package info
npm view @catto/ui

# View all versions
npm view @catto/ui versions

# Unpublish (within 72 hours only!)
npm unpublish @catto/ui@1.0.0

# Deprecate a version
npm deprecate @catto/ui@1.0.0 "Use 1.0.1 instead"

# Transfer ownership
npm owner add username @catto/ui

# See download stats
npm stats @catto/ui
# Or visit: https://www.npmjs.com/package/@catto/ui
```

---

## Resources

- [npm Docs: Publishing packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semver Specification](https://semver.org/)
- [Changesets](https://github.com/changesets/changesets) - Automated versioning tool
- [np](https://github.com/sindresorhus/np) - Better `npm publish`
