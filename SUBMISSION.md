# Submitting Bookdrop to the Obsidian community directory

Since May 2026, plugins are submitted through the developer dashboard at https://community.obsidian.md (not a pull request to obsidian-releases).

1. Push this repository to GitHub. `README.md`, `LICENSE`, and `manifest.json` must be in the root of the default branch.
2. Create a GitHub release whose tag exactly matches `version` in `manifest.json` (e.g. `0.3.0`, no `v`). Attach `main.js`, `manifest.json`, and `styles.css`.
3. Sign in at https://community.obsidian.md with your Obsidian account and link your GitHub account.
4. Choose "Add a plugin or theme" and select this repository.
5. Review is automated and results usually appear within minutes. Fix any reported issues, bump the version, and publish a new release.

For later updates: raise `version` in `manifest.json` (and add it to `versions.json`), build, and publish a new release with that tag.
