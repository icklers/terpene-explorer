# Release Workflow: Trunk-Based Development with GitHub Flow

This document outlines the release workflow for the project, combining principles of Trunk-Based Development and GitHub Flow, utilizing
Semantic Versioning, and automating builds and releases with GitHub Actions.

## 1. Branching Strategy

We will follow a **Trunk-Based Development** approach with **GitHub Flow** for managing changes.

- **`main` branch**: This is the main development branch and should always be deployable. All new features and bug fixes are merged into
  `main`.
- **Feature Branches**: For every new feature or bug fix, create a short-lived branch off `main`. Name branches descriptively (e.g.,
  `feat/add-terpene-search`, `fix/loading-indicator-bug`).

## 2. Commit Message Convention (Conventional Commits)

We will use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to enable automated semantic versioning and release note
generation. Each commit message MUST adhere to the following structure:

`<type>(<scope>): <description>`

- **`<type>`**: Mandatory. One of the following:
  - `feat`: A new feature.
  - `fix`: A bug fix.
  - `docs`: Documentation only changes.
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.).
  - `refactor`: A code change that neither fixes a bug nor adds a feature.
  - `perf`: A code change that improves performance.
  - `test`: Adding missing tests or correcting existing tests.
  - `build`: Changes that affect the build system or external dependencies (e.g., npm, webpack, gulp).
  - `ci`: Changes to our CI configuration files and scripts (e.g., GitHub Actions).
  - `chore`: Other changes that don't modify src or test files.
  - `revert`: Reverts a previous commit.
- **`<scope>` (optional)**: A noun describing the section of the codebase affected (e.g., `parser`, `ui`, `auth`, `data-service`).
- **`<description>`**: Mandatory. A short, imperative tense description of the change.

**Breaking Changes**: A commit that introduces a breaking change MUST include `BREAKING CHANGE:` in the footer or `!` after the type/scope.
This will trigger a major version bump.

## 3. Pull Request (PR) Process

- All changes MUST be submitted via a Pull Request to the `main` branch.
- PRs require at least one approving review from another developer.
- All GitHub Actions CI checks (unit tests, security scans, linting) MUST pass before a PR can be merged.
- Squash and merge commits are preferred to maintain a clean `main` branch history.

## 4. Semantic Versioning

We will adhere to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

- **`MAJOR` version (e.g., `1.0.0` -> `2.0.0`)**: Incremented when incompatible API changes are made (triggered by `BREAKING CHANGE:` in
  commit messages).
- **`MINOR` version (e.g., `1.0.0` -> `1.1.0`)**: Incremented when new functionality is added in a backward-compatible manner (triggered by
  `feat:` type commits).
- **`PATCH` version (e.g., `1.0.0` -> `1.0.1`)**: Incremented when backward-compatible bug fixes are made (triggered by `fix:` type
  commits).

## 5. Automated Releases with semantic-release

Releases are **fully automated** using [semantic-release](https://semantic-release.gitbook.io/). No manual intervention is required after
merging a PR to `main`.

### How It Works:

1. **Commit using Conventional Commits format** on your feature branch:
   - `feat:` for new features → Minor version bump (1.0.0 → 1.1.0)
   - `fix:` for bug fixes → Patch version bump (1.0.0 → 1.0.1)
   - `BREAKING CHANGE:` in commit body → Major version bump (1.0.0 → 2.0.0)
   - Other types (docs, chore, etc.) → No release

2. **Create Pull Request** to `main` branch:
   - CI validates commit messages automatically
   - PR comment shows expected version impact
   - All checks must pass before merge

3. **Merge PR** (after approval and CI passes):
   - semantic-release automatically:
     - Analyzes commits since last release
     - Determines version bump (major/minor/patch)
     - Updates `package.json` and `CHANGELOG.md`
     - Creates git tag (e.g., `v1.1.0`)
     - Creates GitHub release with artifacts
     - Triggers deployments

**No manual tag creation needed!** The entire process is automated.

### Release Timeline:

- PR merge → ~2-3 minutes → Release published
- Deployments trigger automatically after release

### Local Testing:

Before pushing, you can test what semantic-release would do:

```bash
# Dry-run (shows what would happen without making changes)
pnpm run release:dry

# Debug mode (verbose output)
pnpm run release:debug
```

### Emergency Manual Release:

If automation fails, you can trigger manually:

```bash
# Trigger release workflow manually from GitHub Actions UI
# Or use GitHub CLI:
gh workflow run release.yml
```

## 6. PR Builds (CI Validation)

Every Pull Request triggers GitHub Actions workflows to ensure code quality and stability.

### CI Workflow (`.github/workflows/ci.yml`)

1. **Type checking**: Validates TypeScript types
2. **Linting**: Enforces code style guidelines
3. **Code formatting**: Checks Prettier formatting
4. **Build**: Creates production build
5. **Artifact upload**: Stores build artifacts for release

### PR Validation Workflow (`.github/workflows/pr-validation.yml`)

1. **Commit message validation**: Ensures conventional commit format
2. **Version impact analysis**: Shows what version bump would result
3. **PR comment**: Posts analysis summary on the PR

All checks MUST pass before a PR can be merged to `main`.

## 7. Deployment

Deployments are automatically triggered after successful releases.

### Azure Static Web Apps

- Triggered by the release workflow via `workflow_call`
- Uses the `azure-swa-deploy-v2.yml` workflow
- Deploys the production build to Azure
- Environment: `production`

### Manual Deployment

If needed, you can trigger deployment manually:

```bash
# Via GitHub Actions UI or GitHub CLI
gh workflow run azure-swa-deploy-v2.yml -f release_tag=v1.2.0
```

## 8. Monitoring & Troubleshooting

### Success Metrics

- Release time: < 5 minutes (merge → deployed)
- Commit compliance: > 95% valid conventional commits
- Workflow success rate: > 99%

### Common Issues

**Release workflow fails**

- Check commit message format (must follow conventional commits)
- Verify GITHUB_TOKEN has proper permissions
- Review semantic-release logs in Actions

**No release created**

- Expected if only non-release commits (docs, chore, etc.)
- Use `feat:` or `fix:` types to trigger releases

**Deployment fails**

- Check Azure SWA API token is valid
- Verify build artifacts were created
- Review Azure SWA logs
