# Blocks

Multi-brand AEM Edge Delivery blocks for AT&T Business (BATT) and FirstNet, with AEM 6.5 component field mappings and Universal Editor authoring models.

## Architecture

All blocks follow a consistent multi-theme pattern:

```
blocks/{name}/
  {name}.js              # Entry point — delegates to renderBlock()
  {name}.css             # Base styles
  _{name}.json           # Universal Editor model (fields, variants, filters)
  batt/
    block-config.js      # BATT decoration logic + AEM 6.5 field mapping
    _{name}.css          # BATT CSS source (imports base + brand overrides)
    {name}.css           # BATT CSS compiled (loaded at runtime)
  firstnet/
    block-config.js      # FirstNet decoration (stub or implemented)
    _{name}.css          # FirstNet CSS source
    {name}.css           # FirstNet CSS compiled
```

**How it works:**

1. Author adds a block in Universal Editor
2. EDS renders the block table → loads `blocks/{name}/{name}.js`
3. `{name}.js` calls `renderBlock()` from `scripts/multi-theme.js`
4. `multi-theme.js` reads `<meta name="brand" content="batt">` and loads `batt/block-config.js`
5. `block-config.js` exports `getBlockConfigs()` → `{ decorations: { decorate: fn } }`
6. The brand-specific `decorate()` transforms the DOM
7. Brand CSS loads from `batt/{name}.css`

**Exceptions:** `columns` and `fragment` use inline decoration in their main JS files instead of the multi-theme system.

## Block Inventory

| Block | AEM 6.5 Component | Description |
|-------|-------------------|-------------|
| [accordion](#accordion) | `att/components/content/accordion` | Expandable panels with toggle behavior |
| [cards](#cards) | `att/components/content/cardList` | Grid of content cards with image + text |
| [carousel](#carousel) | `att/components/content/carousel` | Sliding content panels with navigation |
| [columns](#columns) | — | Multi-column layout container |
| [contact](#contact) | `att/components/content/contactSection` | Two-column contact info + form layout |
| [countdown-timer](#countdown-timer) | `att/components/content/countdownTimer` | Live countdown display |
| [form](#form) | `att/components/content/requestInfoForm` | Auto-built HTML form from row definitions |
| [fragment](#fragment) | — | Loads remote content fragments |
| [hero](#hero) | — | Split-panel hero with image + CTA |
| [icon-list](#icon-list) | `att/components/content/iconList` | Icon + text feature list |
| [link-list](#link-list) | `att/components/content/linkList` | Multi-column link navigation |
| [pricing](#pricing) | `att/components/content/pricingCard` | Plan comparison cards with pricing |
| [promo-banner](#promo-banner) | `att/components/content/promoBanner` | Promotional banner with content + media |
| [table-comparison](#table-comparison) | `att/components/content/tableBuilder` | Feature comparison table |
| [tabs](#tabs) | `att/components/content/tabs` | Tabbed content with ARIA keyboard nav |
| [video](#video) | `att/components/content/video` | YouTube/Vimeo embed with poster + modal |

## Block Details

### Accordion

Expandable accordion with toggle behavior. Supports single-open mode where only one panel can be open at a time.

**AEM 6.5 Mapping** (`att/components/content/accordion`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Title | `./jcr:title` | `title` | text |
| Content | `./jcr:description` | `text` | richtext |
| Expanded | `./expanded` | — | checkbox |
| Single Open | `./singleOpen` | — | checkbox |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `classes` | multiselect | Style |
| `title` (accordion-item) | text | Title |
| `text` (accordion-item) | richtext | Content |

**Style Variants:** `single-open`, `faq`, `bordered`

---

### Cards

Grid of content cards. Detects icon-style cards (images ≤ 100×100px) and classifies headings, descriptions, and CTAs.

**AEM 6.5 Mapping** (`att/components/content/cardList`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Image | `./image` | `image` | reference |
| Title | `./jcr:title` | `text` | richtext |
| Description | `./jcr:description` | `text` | richtext |
| Link URL | `./linkURL` | `text` | richtext |
| Link Text | `./linkText` | `text` | richtext |
| Card Style | `./cardStyle` | — | select |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `image` (card) | reference | Image |
| `text` (card) | richtext | Text |

---

### Carousel

Sliding content carousel with arrow navigation, dot indicators, and optional auto-play.

**AEM 6.5 Mapping** (`att/components/content/carousel`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Image | `./fileReference` | `image` | reference |
| Title | `./jcr:title` | `text` | richtext |
| Description | `./jcr:description` | `text` | richtext |
| CTA Link | `./linkURL` | `text` | richtext |
| Autoplay | `./autoplay` | `classes` | checkbox |
| Interval | `./interval` | — | number |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `classes` | multiselect | Style |
| `image` (carousel-slide) | reference | Image |
| `imageAlt` (carousel-slide) | text | Image Alt Text |
| `text` (carousel-slide) | richtext | Text |

**Style Variants:** `auto-play`, `single-slide`, `testimonials`

---

### Columns

Multi-column layout container. Adds `.columns-{N}-cols` class based on child count.

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `columns` | text | Columns |
| `rows` | text | Rows |

**Child filter:** Accepts `text`, `image`, `button`, `title`

---

### Contact

Two-column layout: contact info (heading, phone, hours) on the left, form/CTA on the right.

**AEM 6.5 Mapping** (`att/components/content/contactSection`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Heading | `./jcr:title` | `info` | richtext |
| Description | `./jcr:description` | `info` | richtext |
| Phone Number | `./phoneNumber` | `info` | richtext |
| Business Hours | `./businessHours` | `info` | richtext |
| Form Reference | `./formPath` | `formContent` | richtext |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `info` | richtext | Contact Info |
| `formContent` | richtext | Form Content |
| `classes` | multiselect | Style |

**Style Variants:** `with-form`, `phone-only`, `dark`

---

### Countdown Timer

Live countdown display with days, hours, minutes, seconds. Updates every second via `requestAnimationFrame`. Shows expired content when countdown reaches zero.

**AEM 6.5 Mapping** (`att/components/content/countdownTimer`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| End Date | `./endDate` | `endDate` | text (ISO) |
| Pre-Text | `./preText` | `preText` | text |
| Expired Text | `./expiredText` | `expiredText` | richtext |
| Show Days | `./showDays` | — | checkbox |
| Show Hours | `./showHours` | — | checkbox |
| Show Minutes | `./showMinutes` | — | checkbox |
| Show Seconds | `./showSeconds` | — | checkbox |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `endDate` | text | End Date |
| `preText` | text | Pre-Timer Text |
| `expiredText` | richtext | Expired Text |
| `classes` | multiselect | Style |

**Style Variants:** `compact`, `dark`, `inline`

---

### Form

Builds a complete HTML form from block rows. Auto-detects field types from label text (email, tel, textarea, checkbox, select).

**AEM 6.5 Mapping** (`att/components/content/requestInfoForm`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Form Title | `./jcr:title` | `formTitle` | text |
| Description | `./jcr:description` | `formDescription` | richtext |
| Fields | `./fields` | rows | multifield |
| Submit Label | `./submitLabel` | `submitLabel` | text |
| Action URL | `./actionURL` | `actionUrl` | text |
| Privacy Text | `./privacyText` | `privacyText` | richtext |
| Opt-In | `./optInLabel` | — | text |
| Success Message | `./thankYouMessage` | — | richtext |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `formTitle` | text | Form Title |
| `formDescription` | richtext | Description |
| `submitLabel` | text | Submit Button Text |
| `actionUrl` | text | Form Action URL |
| `privacyText` | richtext | Privacy Text |
| `classes` | multiselect | Style |

**Style Variants:** `contact`, `newsletter`, `lead-gen`, `dark`

---

### Fragment

Loads and renders remote content fragments by path. Fetches `.plain.html`, decorates sections, and injects into the block.

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `reference` | aem-content | Reference |

---

### Hero

Split-panel hero with content (eyebrow, heading, CTAs) and media (background image). See [`hero/README.md`](hero/README.md) for full documentation.

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `eyebrow` | text | Eyebrow |
| `text` | richtext | Text |
| `image` | reference | Background Image |
| `imageAlt` | text | Image Alt Text |
| `classes` | multiselect | Style |

**Style Variants:** `content-left`, `content-right`, `content-center`, `light-bg-img`, `dark-bg-img`, `light`, `dark`

---

### Icon List

Icon + text feature list displayed as a `<ul>`. Supports checkmark mode for items without icons.

**AEM 6.5 Mapping** (`att/components/content/iconList`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Icon | `./iconPath` | `icon` | reference |
| Title | `./jcr:title` | `text` | richtext |
| Description | `./jcr:description` | `text` | richtext |
| Layout | `./layout` | `classes` | select |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `classes` | multiselect | Style |
| `icon` (icon-list-item) | reference | Icon |
| `text` (icon-list-item) | richtext | Text |

**Style Variants:** `horizontal`, `large-icons`, `checkmarks`

---

### Link List

Multi-column link navigation. Each `<ul>` becomes a separate column in the grid.

**AEM 6.5 Mapping** (`att/components/content/linkList`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Heading | `./jcr:title` | `heading` | text |
| Columns | `./columns` | `text` | richtext |
| Layout | `./layout` | `classes` | select |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `heading` | text | Heading |
| `text` | richtext | Links |
| `classes` | multiselect | Style |

**Style Variants:** `two-col`, `three-col`, `dark`

---

### Pricing

Plan comparison cards with price parsing (`$XX/mo.`), feature lists, CTAs, and legal text.

**AEM 6.5 Mapping** (`att/components/content/pricingCard`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Plan Name | `./jcr:title` | `planName` | text |
| Price | `./price` | `price` | text |
| Price Per | `./pricePer` | `price` | text |
| Price Note | `./priceNote` | `priceNote` | text |
| Features | `./features` | `features` | richtext |
| CTA Link | `./linkURL` | `cta` | richtext |
| CTA Text | `./linkText` | `cta` | richtext |
| Legal Text | `./legalText` | `legalText` | text |
| Featured | `./featured` | `classes` | checkbox |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `classes` | multiselect | Style |
| `planName` (pricing-card) | text | Plan Name |
| `price` (pricing-card) | text | Price |
| `priceNote` (pricing-card) | text | Price Note |
| `features` (pricing-card) | richtext | Features |
| `cta` (pricing-card) | richtext | CTA |
| `legalText` (pricing-card) | text | Legal Text |

**Style Variants:** `featured`, `compact`, `two-col`

---

### Promo Banner

Promotional banner with content + media split layout. Classifies eyebrow, heading, description, primary/secondary CTAs, and icon lists.

**AEM 6.5 Mapping** (`att/components/content/promoBanner`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Eyebrow | `./eyebrow` | `eyebrow` | text |
| Title | `./jcr:title` | `text` | richtext |
| Description | `./jcr:description` | `text` | richtext |
| Image | `./fileReference` | `image` | reference |
| Image Alt | `./alt` | `imageAlt` | text |
| CTA Link | `./linkURL` | `text` | richtext |
| CTA Link 2 | `./linkURL2` | `text` | richtext |
| Background Color | `./backgroundColor` | `classes` | colorpicker |
| Layout | `./layout` | `classes` | select |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `eyebrow` | text | Eyebrow |
| `text` | richtext | Text |
| `image` | reference | Image |
| `imageAlt` | text | Image Alt Text |
| `classes` | multiselect | Style |

**Style Variants:** `content-left`, `content-right`, `full-width`, `dark`, `light`, `with-icon-list`

---

### Table Comparison

Feature comparison table built from block rows. First row becomes `<thead>`, with support for checkmark/cross icons and column highlighting.

**AEM 6.5 Mapping** (`att/components/content/tableBuilder`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Column Headers | `./columnHeaders` | `text` (first row) | multifield |
| Rows | `./rows` | `text` (subsequent rows) | multifield |
| Highlight Column | `./highlightColumn` | `classes` | number |
| Sticky Header | `./stickyHeader` | `classes` | checkbox |
| Full Borders | `./fullBorders` | `classes` | checkbox |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `text` | richtext | Table Content |
| `classes` | multiselect | Style |

**Style Variants:** `full-borders`, `striped`, `sticky-header`, `highlight-column`

---

### Tabs

Tabbed content interface with full ARIA support and keyboard navigation (ArrowLeft/Right).

**AEM 6.5 Mapping** (`att/components/content/tabs`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Tab Title | `./jcr:title` | `title` | text |
| Tab Content | `./jcr:description` | `text` | richtext |
| Tab Icon | `./iconPath` | — | pathfield |
| Tab Image | `./fileReference` | `image` | reference |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `classes` | multiselect | Style |
| `title` (tab-item) | text | Tab Label |
| `text` (tab-item) | richtext | Tab Content |
| `image` (tab-item) | reference | Image |

**Style Variants:** `pill`, `vertical`

---

### Video

YouTube/Vimeo embed with poster image, inline playback, and modal mode. Converts watch/share URLs to embed format.

**AEM 6.5 Mapping** (`att/components/content/video`):

| AEM 6.5 Field | JCR Path | EDS Field | Type |
|---------------|----------|-----------|------|
| Video URL | `./videoURL` | `videoUrl` | text |
| Poster Image | `./fileReference` | `posterImage` | reference |
| Poster Alt | `./alt` | `posterAlt` | text |
| Caption | `./caption` | `caption` | text |
| Autoplay | `./autoplay` | `classes` | checkbox |
| Open in Modal | `./openInModal` | `classes` | checkbox |

**UE Model Fields:**

| Field | Type | Label |
|-------|------|-------|
| `videoUrl` | text | Video URL |
| `posterImage` | reference | Poster Image |
| `posterAlt` | text | Poster Alt Text |
| `caption` | text | Caption |
| `classes` | multiselect | Style |

**Style Variants:** `modal`, `autoplay`, `inline`

## Section Styles

Blocks are placed inside sections. Available section styles:

| Style | Value | Description |
|-------|-------|-------------|
| Highlight | `highlight` | Highlighted section |
| Dark | `dark` | Dark background with light text |
| Light | `light` | Light background |
| Full Width | `full-width` | Edge-to-edge layout |

## Adding a New Brand

1. Create `blocks/{name}/{brand}/` directory
2. Add `_{name}.css` — import base CSS + brand overrides using design tokens
3. Add `block-config.js` — export `getBlockConfigs()` with `decorations.decorate`
4. Run `npx gulp createBrandCSS` to compile brand CSS
5. Run `npm run build:json` to rebuild component models

## Build Commands

```bash
npx gulp createBrandCSS    # Compile _*.css → *.css for all brands
npm run build:json          # Merge _*.json → component-*.json
npm run lint                # ESLint all JS files
```
