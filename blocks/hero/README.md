# Hero Block

Multi-brand hero block with brand-specific decoration and styling via the `multi-theme.js` block-config pattern.

## File Structure

```
blocks/hero/
  _hero.json              # Base hero model (generic)
  _batt-hero.json         # BATT hero model (AT&T Business)
  hero.js                 # Shared entry — delegates to renderBlock()
  hero.css                # Base hero CSS
  batt/
    _hero.css             # BATT CSS source (imports base + brand overrides)
    hero.css              # BATT CSS compiled (loaded at runtime)
    block-config.js       # BATT decoration logic
  firstnet/
    _hero.css             # FirstNet CSS source
    block-config.js       # FirstNet decoration logic
```

## How It Works

1. Author adds **BATT Hero** in Universal Editor (definition id: `batt-hero`, model: `batt-hero`)
2. Block renders with table name `Hero` → class `hero` → loads from `blocks/hero/`
3. `hero.js` calls `renderBlock()` from `multi-theme.js`
4. `multi-theme.js` loads `blocks/hero/batt/block-config.js` when `<meta name="brand" content="batt">`
5. `block-config.js` runs the BATT decoration (split-panel layout)
6. CSS loads from `blocks/hero/batt/hero.css` (brand-specific styles)

## AEM 6.5 Field Mapping

Source: `business.att.com` hero component.

| AEM 6.5 Field | AEM 6.5 Selector | EDS Model Field | Component | Notes |
|---|---|---|---|---|
| Eyebrow | `.eyebrow-lg-desktop` | `eyebrow` | text | "AT&T Business" |
| Heading | `h2` / `h1` | `text` (richtext) | richtext | Author uses h2 inside richtext |
| Description | `.wysiwyg-editor p` | `text` (richtext) | richtext | Paragraphs after the heading |
| CTA Primary | `.cta a` | `text` (richtext) | richtext | Link in richtext becomes button |
| CTA Secondary | `.cta a` (2nd) | `text` (richtext) | richtext | Second link becomes outline button |
| Desktop Image | `data-desktop` on `.bg-hero-panel` | `image` | reference | EDS auto-generates responsive breakpoints |
| Tablet Image | `data-tablet` | (same `image`) | — | Handled by `<picture>` sources |
| Mobile Image | `data-mobile` | (same `image`) | — | Handled by `<picture>` sources |
| Panel Layout | `data-comp-view="panelLeftContent"` | `classes` | multiselect | `content-left` / `content-right` / `content-center` |
| Theme | `.theme-light-bg-img` | `classes` | multiselect | `light-bg-img` / `dark-bg-img` / `light` / `dark` |

## Model Fields

| Field | Type | Label | Description |
|---|---|---|---|
| `eyebrow` | text | Eyebrow | Small text above heading |
| `text` | richtext | Text | Heading (h2), description paragraphs, CTA links |
| `image` | reference | Background Image | Hero image asset |
| `imageAlt` | text | Image Alt Text | Accessibility text |
| `classes` | multiselect | Style | Layout + theme variant classes |

## Style Variants

### Layout (choose one)

| Class | Description |
|---|---|
| `content-left` | Content on left, image on right (default) |
| `content-right` | Content on right, image on left |
| `content-center` | Content centered over full-width background image |

### Theme (choose one)

| Class | Description |
|---|---|
| `light-bg-img` | Light background, dark text, image as side panel (default) |
| `dark-bg-img` | Dark background, white text, image as side panel |
| `light` | Light grey background, dark text, no image |
| `dark` | Dark background, white text, no image |

## Decorated DOM Structure

After `block-config.js` runs, the block DOM becomes:

```html
<!-- content-left / content-right -->
<div class="hero content-left light-bg-img">
  <div class="hero-inner">
    <div class="hero-content">
      <p class="hero-eyebrow">AT&T Business</p>
      <h2 class="hero-heading">Give your team an edge</h2>
      <p class="hero-description">Since 1876, we've helped...</p>
      <p class="button-container">
        <a class="button hero-cta-primary" href="/link">Learn more</a>
      </p>
      <p class="button-container">
        <a class="button secondary hero-cta-secondary" href="/link2">Contact us</a>
      </p>
    </div>
    <div class="hero-media">
      <picture>...</picture>
    </div>
  </div>
</div>

<!-- content-center -->
<div class="hero content-center dark-bg-img">
  <div class="hero-background">
    <div class="hero-media">
      <picture>...</picture>
    </div>
  </div>
  <div class="hero-inner">
    <div class="hero-content hero-content-overlay">
      ...
    </div>
  </div>
</div>
```

## Responsive Behavior

| Breakpoint | Layout |
|---|---|
| < 900px | Stacked — content above image, full width |
| >= 900px | Side-by-side — 50/50 split, content and image panels |
| >= 1200px | Same split with increased content padding |

## Authoring Guide

1. In Universal Editor, add **BATT Hero** to a section
2. Fill in **Eyebrow** (e.g. "AT&T Business")
3. In the **Text** richtext field:
   - Type a heading and format it as **h2**
   - Add description paragraphs below
   - Add CTA links — the first link becomes the primary button, the second becomes a secondary (outline) button
4. Select a **Background Image** from the DAM
5. Add **Image Alt Text** for accessibility
6. Under **Style**, select one layout variant and one theme variant

## Adding a New Brand Hero

1. Create `blocks/hero/{brand}/` directory
2. Add `_hero.css` (import base + brand overrides)
3. Add `block-config.js` (export `getBlockConfigs` with `decorations.decorate`)
4. Add `blocks/hero/_brand-hero.json` with brand-specific model
5. Add the definition id to the section filter in `models/_section.json`
6. Run `npm run build:json` and `npm run scaffold:build`
