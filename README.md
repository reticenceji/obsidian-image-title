# Image Title

Render image alt text as visible captions in Obsidian reading view.

The text in `[]` of `![alt text](image.png)` is displayed as a centered caption below or above the image. Position is configurable in settings.

## Features

- Displays image alt text (`[]`) as visible captions in reading view
- Configurable caption position: above or below the image
- Automatically strips Obsidian size parameters (`|600`, `|200x300`) from captions
- Skips images with empty alt text

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v18 (`node --version`).
- `npm i` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

Copy `main.js`, `styles.css`, `manifest.json` to `VaultFolder/.obsidian/plugins/image-title/`, then enable the plugin in **Settings → Community plugins**.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Title position | Below image | Where to show the caption relative to the image |

## Releasing new releases

- Update `version` in `manifest.json` and entry in `versions.json`.
- Create a GitHub release with the version number as tag (no `v` prefix).
- Attach `manifest.json`, `main.js`, `styles.css` as binary assets.

## API Documentation

See https://docs.obsidian.md
