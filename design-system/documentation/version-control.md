# Version Control Strategy

This document outlines the version control strategy for the VibeCaaS Design System.

## Overview

The VibeCaaS Design System uses a structured approach to version control that ensures:
- Clear tracking of changes
- Easy rollback if needed
- Predictable updates for consumers
- Transparent communication of breaking changes

## Versioning Scheme

We use **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

### Version Components

```
1.2.3
│ │ │
│ │ └─ PATCH: Bug fixes, minor tweaks (1.2.4)
│ └─── MINOR: New features, additions (1.3.0)
└───── MAJOR: Breaking changes (2.0.0)
```

### When to Increment

#### MAJOR Version (Breaking Changes)

Increment when making incompatible API changes:

**Examples**:
- Removing a component
- Renaming component props/parameters
- Changing default behavior significantly
- Removing design tokens
- Restructuring exports

```javascript
// Version 1.x
<Button type="primary" />

// Version 2.0 (BREAKING)
<Button variant="primary" />  // 'type' renamed to 'variant'
```

#### MINOR Version (New Features)

Increment when adding functionality in a backwards-compatible manner:

**Examples**:
- Adding new components
- Adding new props/parameters to existing components
- Adding new design tokens
- Adding new variants/sizes
- New utility functions

```javascript
// Version 1.5.0
<Button variant="primary" />

// Version 1.6.0 (NEW FEATURE)
<Button variant="primary" loading={true} />  // New 'loading' prop
```

#### PATCH Version (Bug Fixes)

Increment when making backwards-compatible bug fixes:

**Examples**:
- Fixing component bugs
- Correcting documentation
- Adjusting styles (non-breaking)
- Performance improvements
- Dependency updates

```javascript
// Version 1.5.2
<Button variant="primary" />  // Fixed: Focus outline now visible

// Version 1.5.3
<Button variant="primary" />  // Fixed: Loading spinner alignment
```

## Branch Strategy

### Main Branches

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (new features)
fix/* (bug fixes)
docs/* (documentation)
```

#### `main` Branch
- **Purpose**: Production-ready code
- **Protected**: Yes (requires PR and review)
- **Auto-deploy**: Yes (to npm, package managers)
- **Tags**: Version tags (v1.0.0, v1.1.0)

#### `develop` Branch
- **Purpose**: Integration branch for next release
- **Protected**: Yes (requires PR)
- **Auto-deploy**: Yes (to staging/beta)
- **Merges**: From feature/fix branches

### Feature Branches

```bash
# Creating a feature branch
git checkout develop
git checkout -b feature/add-tooltip-component

# Work on feature...

# Push and create PR to develop
git push origin feature/add-tooltip-component
```

**Naming Convention**:
- `feature/add-[component-name]`
- `feature/improve-[feature]`
- `fix/[component]-[issue]`
- `docs/update-[section]`
- `chore/[task]`

**Examples**:
- `feature/add-tooltip-component`
- `feature/improve-button-accessibility`
- `fix/input-focus-outline`
- `docs/update-getting-started`
- `chore/update-dependencies`

## Release Process

### 1. Development

```bash
# Create feature branch from develop
git checkout develop
git pull
git checkout -b feature/new-component

# Make changes, commit
git add .
git commit -m "feat(component): add new component"

# Push and create PR
git push origin feature/new-component
```

### 2. Code Review

- Automated tests must pass
- Code review required (2 approvers)
- Design review (for UI changes)
- Accessibility review
- Documentation updated

### 3. Merge to Develop

```bash
# After PR approval
git checkout develop
git merge feature/new-component
git push origin develop
```

### 4. Prepare Release

```bash
# Create release branch
git checkout develop
git checkout -b release/1.6.0

# Update version numbers
npm version minor  # or major/patch

# Update CHANGELOG.md
# Add release notes

# Commit changes
git commit -m "chore(release): prepare v1.6.0"
```

### 5. Release to Main

```bash
# Merge to main
git checkout main
git merge release/1.6.0

# Tag release
git tag -a v1.6.0 -m "Release version 1.6.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge main
git push origin develop

# Delete release branch
git branch -d release/1.6.0
```

### 6. Publish

```bash
# Publish to npm (web)
npm publish

# Publish to CocoaPods (iOS)
pod trunk push

# Publish to Maven (Android)
./gradlew publish
```

## Commit Message Convention

We use **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build config)

### Scopes

- Component names: `button`, `input`, `card`
- Platform: `web`, `ios`, `android`
- Infrastructure: `build`, `ci`, `docs`

### Examples

```bash
# New feature
git commit -m "feat(button): add loading state"

# Bug fix
git commit -m "fix(input): resolve focus outline visibility"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(button): rename type prop to variant

BREAKING CHANGE: Button 'type' prop renamed to 'variant' for consistency"
```

## Changelog Maintenance

### Automated Generation

```bash
# Generate changelog from commits
npm run changelog
```

### Manual Entries

Update `CHANGELOG.md` for each release:

```markdown
## [1.6.0] - 2025-11-15

### Added
- Tooltip component with multiple positions
- Loading state for Button component
- New semantic color tokens for warnings

### Changed
- Improved Input component accessibility
- Updated Card component shadow values

### Fixed
- Modal focus trap on iOS Safari
- Table sorting bug with null values

### Deprecated
- Button 'type' prop (use 'variant' instead)

### Removed
- (None)

### Security
- Updated dependencies to patch vulnerabilities
```

## Deprecation Policy

### Deprecation Process

1. **Announce**: Mark as deprecated in code and docs
2. **Provide alternatives**: Clear migration path
3. **Grace period**: Maintain for at least one major version
4. **Remove**: In next major version

### Marking as Deprecated

```javascript
// Web
/**
 * @deprecated Use 'variant' prop instead. Will be removed in v2.0.0
 */
export const type = variant;

// iOS
@available(*, deprecated, message: "Use 'variant' instead. Will be removed in v2.0.0")
let type: ButtonType

// Android
@Deprecated("Use 'variant' instead. Will be removed in v2.0.0")
val type: ButtonType
```

### Migration Guide

```markdown
# Migration Guide: v1.x to v2.0

## Button Component

### Changed: type → variant

**Before (v1.x)**:
```javascript
<Button type="primary" />
```

**After (v2.0)**:
```javascript
<Button variant="primary" />
```

**Why**: Better alignment with industry standards

**Timeline**: 
- Deprecated in v1.8.0
- Removed in v2.0.0
```

## Release Notes Template

```markdown
# Release v1.6.0

**Release Date**: 2025-11-15

## 🎉 New Features

- **Tooltip Component**: New component for contextual help
  - Multiple positions (top, right, bottom, left)
  - Auto-positioning when near edges
  - Keyboard accessible
  - [Documentation](./components/Tooltip.md)

- **Button Loading State**: Added loading prop to Button
  - Shows spinner while processing
  - Disables interaction
  - [Example](./components/Button.md#loading)

## 🔧 Improvements

- **Input Accessibility**: Enhanced keyboard navigation
- **Card Shadows**: Updated for better depth perception

## 🐛 Bug Fixes

- Fixed Modal focus trap on iOS Safari
- Fixed Table sorting with null values

## 📚 Documentation

- Updated getting started guide
- Added migration guide for v2.0 changes

## ⚠️ Deprecations

- `Button.type` prop deprecated (use `variant` instead)

## 📦 Dependencies

- Updated React to 18.2.0
- Updated Swift dependencies

## 🔗 Links

- [Changelog](./CHANGELOG.md)
- [Documentation](https://design.vibecaas.com)
- [Migration Guide](./MIGRATION.md)

---

**Install**:
```bash
npm install @vibecaas/design-system@1.6.0
```
```

## Hotfix Process

For critical bugs in production:

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# Fix bug
git add .
git commit -m "fix(component): critical bug description"

# Update version (patch)
npm version patch

# Merge to main
git checkout main
git merge hotfix/critical-bug
git tag -a v1.5.4 -m "Hotfix: critical bug"
git push origin main --tags

# Merge to develop
git checkout develop
git merge main
git push origin develop

# Delete hotfix branch
git branch -d hotfix/critical-bug

# Publish immediately
npm publish
```

## Best Practices

### Do ✓

- Follow semantic versioning strictly
- Write clear commit messages
- Update changelog for every release
- Provide migration guides for breaking changes
- Tag releases consistently
- Test thoroughly before releasing
- Communicate changes to users

### Don't ✗

- Skip version bumps
- Release breaking changes as minor/patch
- Forget to update documentation
- Release without testing
- Break backwards compatibility unnecessarily
- Ignore deprecation warnings

## Tools

### Version Management

```bash
# View current version
npm version

# Bump version (updates package.json and creates git tag)
npm version patch  # 1.5.3 → 1.5.4
npm version minor  # 1.5.4 → 1.6.0
npm version major  # 1.6.0 → 2.0.0

# View all tags
git tag -l

# View tag details
git show v1.5.0
```

### Changelog Generation

```bash
# Using conventional-changelog
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```

## Related Documentation

- [CHANGELOG.md](../CHANGELOG.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Release Checklist](./release-checklist.md)
