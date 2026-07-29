# Image Title Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Obsidian plugin that renders image alt text (`[]`) as a visible caption in reading view, with configurable position above or below the image.

**Architecture:** `MarkdownPostProcessor` intercepts rendered HTML in reading view, finds `<img alt="...">` elements, strips size parameters, and wraps them in `<figure>` with a `<figcaption>`. A settings tab provides a dropdown to toggle caption position.

**Tech Stack:** TypeScript, Obsidian API, esbuild

---

### Task 1: Update manifest and rename plugin

**Files:**
- Modify: `manifest.json`
- Modify: `package.json`

- [ ] **Step 1: Update manifest.json with plugin metadata**

Replace the entire content of `manifest.json` with:

```json
{
  "id": "image-title",
  "name": "Image Title",
  "version": "1.0.0",
  "minAppVersion": "1.0.0",
  "description": "Render image alt text as visible captions in reading view.",
  "author": "Ji Gaoqiang",
  "isDesktopOnly": false
}
```

- [ ] **Step 2: Update package.json name and description**

In `package.json`, replace:
```json
"name": "obsidian-sample-plugin",
```
with:
```json
"name": "obsidian-image-title",
```

Replace:
```json
"description": "This is a sample plugin for Obsidian (https://obsidian.md)",
```
with:
```json
"description": "Render image alt text as visible captions in reading view.",
```

- [ ] **Step 3: Commit**

```bash
git add manifest.json package.json
git commit -m "chore: rename plugin to image-title"
```

---

### Task 2: Define settings interface, defaults, and setting tab

**Files:**
- Modify: `src/settings.ts`

- [ ] **Step 1: Replace settings.ts with actual settings code**

Replace the entire content of `src/settings.ts` with:

```typescript
import { App, PluginSettingTab, Setting } from 'obsidian';
import type ImageTitlePlugin from './main';

export interface ImageTitleSettings {
  titlePosition: 'above' | 'below';
}

export const DEFAULT_SETTINGS: ImageTitleSettings = {
  titlePosition: 'below',
};

export class ImageTitleSettingTab extends PluginSettingTab {
  plugin: ImageTitlePlugin;

  constructor(app: App, plugin: ImageTitlePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Title position')
      .setDesc('Where to show the image title relative to the image')
      .addDropdown((dropdown) =>
        dropdown
          .addOption('above', 'Above image')
          .addOption('below', 'Below image')
          .setValue(this.plugin.settings.titlePosition)
          .onChange(async (value: 'above' | 'below') => {
            this.plugin.settings.titlePosition = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/settings.ts
git commit -m "feat: add image title settings with position dropdown"
```

---

### Task 3: Replace main.ts with plugin logic

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Replace main.ts with actual plugin code**

Replace the entire content of `src/main.ts` with:

```typescript
import { Plugin } from 'obsidian';
import {
  DEFAULT_SETTINGS,
  ImageTitleSettingTab,
  type ImageTitleSettings,
} from './settings';

export default class ImageTitlePlugin extends Plugin {
  settings!: ImageTitleSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ImageTitleSettingTab(this.app, this));

    this.registerMarkdownPostProcessor((element) => {
      const images = element.querySelectorAll<HTMLImageElement>('img[alt]');
      for (const img of images) {
        const rawAlt = img.getAttribute('alt') ?? '';

        // Strip size parameters: |N or |NxN
        const cleanedAlt = rawAlt.replace(/\|\d+(?:x\d+)?$/, '').trim();
        if (!cleanedAlt) continue;

        const parent = img.parentElement;
        if (!parent) continue;

        // Avoid double-wrapping
        if (parent.classList.contains('image-title-figure')) continue;

        const figure = createEl('figure', { cls: 'image-title-figure' });
        const caption = createEl('figcaption', {
          cls: 'image-title-caption',
          text: cleanedAlt,
        });

        parent.insertBefore(figure, img);
        figure.appendChild(img);

        if (this.settings.titlePosition === 'above') {
          figure.insertBefore(caption, img);
        } else {
          figure.appendChild(caption);
        }
      }
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<ImageTitleSettings>,
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/main.ts
git commit -m "feat: implement image title post-processor"
```

---

### Task 4: Add caption CSS styles

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Replace styles.css with caption styles**

Replace the entire content of `styles.css` with:

```css
.image-title-figure {
  display: inline-block;
  margin: 0.5em 0;
}

.image-title-caption {
  text-align: center;
  font-size: 0.85em;
  color: var(--text-muted);
  margin: 0.3em 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: add image caption CSS styles"
```

---

### Task 5: Build and verify

**Files:**
- (none modified; verification only)

- [ ] **Step 1: Install dependencies**

```bash
npm install
```
Expected: installs successfully with no errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```
Expected: TypeScript compiles cleanly, esbuild produces `main.js` at project root.

- [ ] **Step 3: Verify output files exist**

```bash
ls -la main.js manifest.json styles.css
```
Expected: all three files exist and are non-empty.

- [ ] **Step 4: Verify it's not committed (build artifact)**

`main.js` is a build artifact and should not be committed. Verify `.gitignore` covers it, or skip committing this file.
