# Image Title Plugin — Design

## Overview

An Obsidian community plugin that renders the `[]` text in image markdown (`![]()`) as a visible title/caption in reading view. Title position (above or below the image) is configurable.

## Architecture

```
src/
  main.ts          # Plugin entry point: registers MarkdownPostProcessor, setting tab
  settings.ts      # Settings interface, defaults, setting tab UI
```

- **main.ts** — `onload` registers a `MarkdownPostProcessor` that post-processes rendered image DOM in reading mode.
- **settings.ts** — Defines `titlePosition: 'above' | 'below'` with a dropdown selector in the settings tab.
- **styles.css** — Default caption styles: centered, muted, small text with spacing.

## Data Flow

1. Obsidian renders markdown to HTML; `<img alt="...">` elements appear in the DOM.
2. `MarkdownPostProcessor` callback fires with the rendered container element.
3. Iterate `<img>` elements with non-empty `alt`; clean size params (`|N` or `|NxN`).
4. Wrap image in `<figure>`, insert `<figcaption>` above or below the image based on setting.

## Settings

| Setting | Type | Default | Options |
|---------|------|---------|---------|
| `titlePosition` | `'above' \| 'below'` | `'below'` | Above image, Below image |

## Post-Processor Logic

1. Find all `img[alt]` where alt is non-empty after trimming.
2. Strip size parameters: remove `|digits` or `|digitsxdigits` suffix from alt text.
3. Skip images where cleaned alt is empty.
4. Wrap image in `<figure class="image-title-figure">` (if not already wrapped).
5. Create `<figcaption class="image-title-caption">` with the cleaned alt text.
6. Insert caption before or after the `<img>` based on `titlePosition`.

## CSS (styles.css)

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

## Scope

- Reading view only (not Live Preview).
- Empty `[]` (after cleaning size params) produces no caption.
- Size parameters (`|600`, `|300x200`) are stripped from alt text and not treated as captions.

## Non-Goals

- Live Preview support.
- Custom per-image caption styling.
- Wiki-link style images (`![[image.png]]`).
- Network requests, external services.
