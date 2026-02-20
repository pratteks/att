# Design Tokens Reference

Design tokens extracted from **business.att.com** and **firstnet.com** for the multi-brand AEM Edge Delivery Services migration.

> **Extraction coverage:** Exhaustive crawl of both brands. batt: 11 pages (homepage, mobility, business-internet, cybersecurity, offers, small-business, bundles, 5G-for-business, networking, business-guarantee, collaboration). firstnet: 14 pages (homepage, plans, coverage, community, industry-solutions, devices, apps, help, faq, power-of-firstnet, firstnet-and-family, law-enforcement, healthcare, in-building-solutions). Additional batt and firstnet pages returned 404 or redirected; remaining pages use the same design system with no new brand-level tokens.

## How Brand Tokens Work

When a page includes `<meta name="brand" content="batt">`, the runtime (`scripts.js` > `loadBrandThemeCss()`) injects these stylesheets in order:

1. `/styles/{brand}/fonts.css` — `@font-face` declarations
2. `/styles/{brand}/tokens.css` — CSS custom property overrides
3. `/styles/{brand}/styles.css` — Compiled brand stylesheet

Brand tokens in `tokens.css` re-declare `:root` custom properties, overriding the global defaults from `styles/styles.css` via CSS cascade.

## Global Tokens (Base)

Defined in `styles/styles.css` under `:root`. These are the fallback values when no brand is active.

| Category | Token | Value |
|----------|-------|-------|
| Colors | `--background-color` | `white` |
| | `--light-color` | `#f8f8f8` |
| | `--dark-color` | `#505050` |
| | `--text-color` | `#131313` |
| | `--link-color` | `#3b63fb` |
| | `--link-hover-color` | `#1d3ecf` |
| Fonts | `--body-font-family` | `roboto, roboto-fallback, sans-serif` |
| | `--heading-font-family` | `roboto-condensed, roboto-condensed-fallback, sans-serif` |
| Body sizes | `--body-font-size-m` | `22px` (mobile) / `18px` (desktop) |
| | `--body-font-size-s` | `19px` / `16px` |
| | `--body-font-size-xs` | `17px` / `14px` |
| Heading sizes | `--heading-font-size-xxl` | `55px` / `45px` |
| | `--heading-font-size-xl` | `44px` / `36px` |
| | `--heading-font-size-l` | `34px` / `28px` |
| | `--heading-font-size-m` | `27px` / `22px` |
| | `--heading-font-size-s` | `24px` / `20px` |
| | `--heading-font-size-xs` | `22px` / `18px` |
| Layout | `--nav-height` | `64px` |

## Brand Token Comparison

### Colors

| Token | batt (business.att.com) | firstnet (firstnet.com) | Source |
|-------|------------------------|------------------------|--------|
| `--brand-primary` | `#00388F` (dark navy) | `#0568AE` (medium blue) | Primary CTA background |
| `--brand-primary-hover` | `#002A6B` | `#044F85` | CTA hover state |
| `--brand-secondary` | `#0568AE` | `#191919` | Secondary accent |
| `--brand-accent` | `#F2FAFD` (light blue tint) | `#009FDB` (bright blue) | Highlights |
| `--background-color` | `#FFF` | `#FFF` | Page background |
| `--light-color` | `#F2FAFD` (blue tint) | `#F5F5F5` (neutral grey) | Light sections |
| `--dark-color` | `#1D2329` | `#191919` | Dark headings |
| `--text-color` | `#333` | `#000` | Body text |
| `--text-color-secondary` | `#454B52` | `#333` | Subtle text |
| `--text-color-muted` | `#878C94` | `#878C94` | Placeholders |
| `--link-color` | `#0074B3` | `#0568AE` | Links |
| `--link-color-alt` | `#0057B8` | `#0057B8` | Interior page links |
| `--link-hover-color` | `#00588A` | `#044F85` | Link hover |
| `--error-color` | `#FF0000` | `#FF0000` | Validation / error red |
| `--footer-text-color` | `#444` | `#000` | Footer text |
| `--light-color-alt` | `#F3F4F6` (neutral grey) | `#F2F2F2` (neutral grey) | Alternate section bg |
| `--dark-color-alt` | `#000` | `#000` | Pure black section bg |
| `--text-color-emphasis` | `#191919` | — | Emphasized near-black text |
| `--text-color-subtle` | — | `#5A5A5A` | Subtle descriptions |
| `--text-color-disabled` | — | `#777` | Disabled / tertiary text |
| `--highlight-color` | `#BAEEFC` (lighter blue) | — | Promo section bg |
| `--overlay-bg` | — | `rgba(0,0,0,0.7)` | Modal overlay |
| `--overlay-bg-heavy` | — | `rgba(0,0,0,0.9)` | Mobile nav / heavy overlay |
| `--border-color` | — | `#E3E3E3` | General border / divider |

### Typography

| Token | batt | firstnet |
|-------|------|----------|
| `--body-font-family` | ATT Aleck Sans | ATT Aleck Sans |
| `--heading-font-family` | ATT Aleck Sans | Brooklyn |
| `--body-font-size-m` | `17px` | `16px` |
| `--body-font-size-s` | `14px` | `14px` |
| `--body-font-size-xs` | `12px` | `12px` |
| `--heading-font-size-xxl` | `38px` / `48px` | `36px` / `48px` |
| `--heading-font-size-xl` | `38px` / `38px` | `30px` / `36px` |
| `--heading-font-size-l` | `28px` / `32px` | `25px` / `28px` |
| `--heading-font-size-m` | `22px` / `26px` | `20px` / `24px` |
| `--heading-font-size-s` | `18px` / `22px` | `18px` / `20px` |
| `--heading-font-size-xs` | `16px` / `18px` | `16px` / `18px` |
| `--body-line-height` | `1.4` | `1.3` |
| `--heading-line-height` | `1.15` | `1.1` |
| `--heading-letter-spacing` | `-0.03em` | `-0.01em` |
| `--body-letter-spacing` | `normal` | `0.1px` |

### Buttons

| Token | batt | firstnet |
|-------|------|----------|
| `--button-font-weight` | `700` (bold) | `500` (medium) |
| `--button-font-size` | `14px` | `16px` |
| `--button-border-radius` | `28px` | `25px` |
| `--button-padding` | `12px 32px` | `10px 45px` |
| `--button-bg` | `#00388F` (dark navy) | `#0568AE` (medium blue) |
| `--button-color` | `#FFF` | `#FFF` |
| `--button-secondary-bg` | `#F2FAFD` (light blue) | `transparent` |
| `--button-secondary-color` | `#00388F` | `#FFF` |
| `--button-secondary-border` | `none` | `2px solid #FFF` |
| `--button-outline-border` | `2px solid #00388F` | — |
| `--button-disabled-bg` | `#DCDFE3` | — |
| `--button-disabled-color` | `#878C94` | — |
| `--button-nav-border` | `1px solid #0057B8` | — |
| `--button-nav-border-radius` | `35px` | — |
| `--button-lg-font-size` | — | `19px` |
| `--button-lg-border-radius` | — | `40px` |
| `--button-lg-padding` | — | `10px 36px` |
| `--button-form-border` | — | `2px solid #FFF` |
| `--button-form-border-radius` | — | `5px` |

### Forms

| Token | batt | firstnet |
|-------|------|----------|
| `--input-border` | `1px solid #878C94` | `1px solid #878C94` |
| `--input-border-radius` | `8px` | `2px` |
| `--input-padding` | `12px 16px` | `13px 16px` |
| `--input-font-size` | `14px` | `14px` |

### Cards & Components (FirstNet)

| Token | Value | Source |
|-------|-------|--------|
| `--card-border` | `1px solid #D2D2D2` | Carousel / card border |
| `--card-shadow` | `0 0 7px #D2D2D2` | Card box-shadow |
| `--card-header-bg` | `#009FDB` (brand-accent) | Pricing plan card header |
| `--card-detail-border` | `1px solid #E5DCDC` | Plan detail card border |

## Fonts

Both brands use **AT&T Aleck Sans** (proprietary). FirstNet additionally uses **Brooklyn** for headings.

### AT&T Aleck Sans

Used on both business.att.com and firstnet.com for body copy and UI elements.

| Weight | Name | File |
|--------|------|------|
| 300 | Light | `att-aleck-sans-light.woff2` |
| 400 | Regular | `att-aleck-sans-regular.woff2` |
| 500 | Medium | `att-aleck-sans-medium.woff2` |
| 700 | Bold | `att-aleck-sans-bold.woff2` |
| 400 italic | Italic | `att-aleck-sans-italic.woff2` |

Place files in: `fonts/att-aleck-sans/`

### Brooklyn (FirstNet only)

Display typeface used for headings on firstnet.com.

| Weight | Name | File |
|--------|------|------|
| 300 | Light | `brooklyn-light.woff2` |
| 400 | Book | `brooklyn-book.woff2` |
| 500 | Medium | `brooklyn-medium.woff2` |
| 700 | Bold | `brooklyn-bold.woff2` |
| 800 | Extra Bold | `brooklyn-extrabold.woff2` |

Place files in: `fonts/brooklyn/`

### Fallback Fonts

Each brand font file includes a size-adjusted fallback:

- `att-aleck-sans-fallback` — 97% size-adjust, falls back to Helvetica Neue > Helvetica > Arial
- `brooklyn-fallback` — 100% size-adjust, falls back to Arial

Until the proprietary `.woff2` files are added, pages render with these fallbacks.

## File Structure

```
styles/
  styles.css                    # Global base tokens
  fonts.css                     # Global font-face (Roboto)
  batt/
    tokens.css                  # AT&T Business token overrides
    _fonts.css                  # AT&T Aleck Sans @font-face source
    fonts.css                   # Compiled font output
    _styles.css                 # Brand style overrides source
    styles.css                  # Compiled style output
  firstnet/
    tokens.css                  # FirstNet token overrides
    _fonts.css                  # Brooklyn + Aleck Sans @font-face source
    fonts.css                   # Compiled font output
    _styles.css                 # Brand style overrides source
    styles.css                  # Compiled style output

fonts/
  roboto-regular.woff2          # Global fallback fonts (existing)
  roboto-bold.woff2
  roboto-medium.woff2
  roboto-condensed-bold.woff2
  att-aleck-sans/               # AT&T Aleck Sans (add .woff2 files here)
  brooklyn/                     # Brooklyn (add .woff2 files here)
```

## Block-Level Brand CSS Status

| Block | batt CSS | firstnet CSS | batt JS | firstnet JS |
|-------|----------|-------------|---------|-------------|
| **hero** | Active (full overrides) | Placeholder | Active (`decorateBattHero`) | Placeholder |
| cards | Placeholder | Placeholder | Placeholder | Placeholder |
| columns | Placeholder | Placeholder | Placeholder | Placeholder |
| header | Placeholder | Placeholder | Placeholder | Placeholder |
| footer | Placeholder | Placeholder | Placeholder | Placeholder |
| fragment | Placeholder | Placeholder | Placeholder | Placeholder |

## Adding Font Files

1. Obtain `.woff2` files from AT&T Brand Center
2. Place AT&T Aleck Sans files in `fonts/att-aleck-sans/`
3. Place Brooklyn files in `fonts/brooklyn/`
4. Run `npx gulp createBrandCSS` to recompile
5. Verify in preview with `<meta name="brand" content="batt">` or `firstnet`
