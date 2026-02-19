# AT&T Business & FirstNet — AEM Edge Delivery Services

Multi-brand AEM Edge Delivery Services project migrating **business.att.com** and **firstnet.com** to EDS with Universal Editor (xwalk) authoring.

## Environments

- Preview (test): https://test--business-att--pratteks.aem.page/
- Preview (main): https://main--business-att--pratteks.aem.page/
- Live: https://main--business-att--pratteks.aem.live/

## Multi-Theme Architecture

This project uses a **multi-brand** architecture that serves both AT&T Business (`batt`) and FirstNet (`firstnet`) from a single codebase. The active brand is determined at runtime via a `<meta>` tag:

```html
<meta name="brand" content="batt">
```

### Brand Configuration

**File:** `brand-config.json`

```json
{
  "brands": ["batt", "firstnet"],
  "themes": []
}
```

### How Brand Loading Works

1. `scripts.js` reads `<meta name="brand">` and sets it as a class on `<body>`
2. `multi-theme.js` constructs brand-specific paths for CSS and JS:
   - Block CSS: `/blocks/{blockName}/{brand}/{blockName}.css`
   - Block JS config: `/blocks/{blockName}/{brand}/block-config.js`
3. `scripts.js` loads brand tokens and styles:
   - `/styles/{brand}/tokens.css` (if exists)
   - `/styles/{brand}/styles.css` (if exists)
   - `/styles/{brand}/fonts.css` (if exists)

### Folder Structure

```
styles/
  styles.css              # Global base styles + design tokens
  fonts.css               # Global @font-face declarations
  lazy-styles.css         # Post-LCP global styles
  batt/
    _styles.css           # Batt brand overrides (imports ../styles.css)
    _fonts.css            # Batt font declarations
    _lazy-styles.css      # Batt lazy styles
  firstnet/
    _styles.css           # FirstNet brand overrides (imports ../styles.css)
    _fonts.css            # FirstNet font declarations
    _lazy-styles.css      # FirstNet lazy styles

blocks/
  hero/
    hero.css              # Base hero CSS
    hero.js               # Shared entry (delegates to renderBlock)
    _hero.json            # Component model (definition + model + filters)
    batt/
      _hero.css           # Batt hero overrides
      hero.css            # Compiled output
      block-config.js     # Batt hero decoration logic
    firstnet/
      _hero.css           # FirstNet hero overrides
      block-config.js     # FirstNet hero config (placeholder)
  cards/
    cards.css
    batt/_cards.css, block-config.js
    firstnet/_cards.css, block-config.js
  columns/
    columns.css
    batt/_columns.css, block-config.js
    firstnet/_columns.css, block-config.js
  header/
    header.css
    batt/_header.css, block-config.js
    firstnet/_header.css, block-config.js
  footer/
    footer.css
    batt/_footer.css, block-config.js
    firstnet/_footer.css, block-config.js
  fragment/
    fragment.css
    batt/_fragment.css, block-config.js
    firstnet/_fragment.css, block-config.js
```

**Convention:** Files prefixed with `_` are source/override files. The build system (gulp + postcss-import) compiles them into output files (without the underscore) by resolving `@import` statements.

### Block Config Pattern

Each brand can provide a `block-config.js` that exports:

```javascript
export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: { decorate: myDecorateFunction },
  };
}
```

`multi-theme.js` loads both global and brand configs and merges them, with brand config taking precedence.

## Design Tokens

See [styles/DESIGN-TOKENS.md](styles/DESIGN-TOKENS.md) for the full design token reference, brand comparison, and font setup instructions.

## CSS Build Pipeline

### Gulp (`gulpfile.js`)

- **`createBrandCSS`**: Finds all `_*.css` files under brand directories, processes through PostCSS with `postcss-import`, writes compiled output (stripping `_` prefix)
- **`default` (watch)**: Watches `_*.css` partials and recompiles on change

### Theme Tools (`theme-tools/`)

- **`generate-css.js`**: Combines base + brand + theme CSS into compiled output
- **`initiate-brand.js`**: Scaffolds a new brand with all subdirectories and stubs
- **`remove-brand.js`**: Removes all directories for a brand

## Prerequisites

- Node.js 18.3.x or newer
- AEM Cloud Service release 2024.8 or newer (>= `17465`)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local Development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
2. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
3. Start CSS watch: `npx gulp` (recompiles brand CSS on changes)
