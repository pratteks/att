import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Hero — brand-specific decoration.
 *
 * Restructures the xwalk block table DOM into a split-panel hero layout:
 *   .hero-content  (eyebrow + heading + description + CTAs)
 *   .hero-media    (background image)
 *
 * xwalk row-per-field structure (each model field = one row):
 *   Row 0 (eyebrow)  → cell: plain text → .hero-eyebrow
 *   Row 1 (text)      → cell: richtext (h1-h6, paragraphs, links) → heading/desc/CTAs
 *   Row 2 (image)     → cell: <picture> → .hero-media
 *   Row 3 (imageAlt)  → cell: alt text string (consumed by img)
 *
 * panelLayout → classes: content-left | content-right | content-center | reverse
 * theme       → classes: light-bg-img | dark-bg-img | light | dark | with-video
 * spacing     → classes: compact | spacious | no-top-padding | full-bleed
 *
 * Additional AEM 6.5 dialog fields:
 *   - videoUrl  → ./videoURL (textfield, optional hero video)
 */
function decorateBattHero(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Collect all elements from all rows into flat lists by type
  let pictureEl = null;
  let pictureRow = null;
  const textElements = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture && !pictureEl) {
        pictureEl = picture;
        pictureRow = cell;
      } else {
        // Collect all child elements from text/richtext cells
        [...cell.children].forEach((child) => textElements.push(child));
        // If cell has only text content (no child elements), wrap it
        if (!cell.children.length && cell.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = cell.textContent.trim();
          textElements.push(p);
        }
      }
    });
  });

  // Build content panel — classify collected text elements
  const content = document.createElement('div');
  content.className = 'hero-content';

  let eyebrowDone = false;
  let ctaSeen = false;

  textElements.forEach((el) => {
    const isHeading = /^H[1-6]$/.test(el.tagName);
    const hasLink = el.querySelector('a');

    if (!eyebrowDone && !isHeading && !hasLink
      && (el.tagName === 'P' || el.tagName === 'DIV')
      && !el.querySelector('picture')) {
      el.classList.add('hero-eyebrow');
      content.appendChild(el);
      eyebrowDone = true;
    } else if (isHeading) {
      el.classList.add('hero-heading');
      content.appendChild(el);
      eyebrowDone = true;
    } else if (hasLink) {
      const link = el.querySelector('a');
      if (!content.querySelector('.hero-cta-primary')) {
        link.classList.add('button', 'hero-cta-primary');
      } else {
        link.classList.add('button', 'secondary', 'hero-cta-secondary');
      }
      el.classList.add('button-container');
      content.appendChild(el);
      ctaSeen = true;
    } else if (ctaSeen) {
      el.classList.add('hero-legal');
      content.appendChild(el);
    } else {
      el.classList.add('hero-description');
      content.appendChild(el);
    }
  });

  // Preserve instrumentation from the first row
  if (rows[0]?.children[0]) {
    moveInstrumentation(rows[0].children[0], content);
  }

  // Build media panel
  const media = document.createElement('div');
  media.className = 'hero-media';

  if (pictureEl) {
    if (pictureRow) moveInstrumentation(pictureRow, media);
    media.appendChild(pictureEl);
  }

  // Handle content-center variant: image becomes full background
  const isCentered = block.classList.contains('content-center');

  block.textContent = '';

  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  if (isCentered) {
    const bg = document.createElement('div');
    bg.className = 'hero-background';
    bg.appendChild(media);
    block.appendChild(bg);
    content.classList.add('hero-content-overlay');
    inner.appendChild(content);
  } else {
    inner.appendChild(content);
    inner.appendChild(media);
  }

  block.appendChild(inner);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattHero,
    },
  };
}
