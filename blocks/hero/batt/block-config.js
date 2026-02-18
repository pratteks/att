import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Hero — brand-specific decoration.
 *
 * Restructures the block table DOM into a split-panel hero layout:
 *   .hero-content  (eyebrow + heading + description + CTAs)
 *   .hero-media    (background image)
 *
 * AEM 6.5 field mapping:
 *   eyebrow        → first <p> before heading → .hero-eyebrow
 *   heading        → h1-h6 → .hero-heading
 *   description    → <p> after heading → .hero-description
 *   CTA links      → <a> → .hero-cta-primary / .hero-cta-secondary
 *   legal text     → <p> after CTAs → .hero-legal
 *   desktopImage   → <picture> in col 2 → .hero-media
 *   panelLayout    → classes: content-left | content-right | content-center
 *   theme          → classes: light-bg-img | dark-bg-img | light | dark
 */
function decorateBattHero(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cols = [...(rows[0]?.children || [])];
  const contentCol = cols[0];
  const imageCol = cols[1];

  // Build content panel
  const content = document.createElement('div');
  content.className = 'hero-content';

  if (contentCol) {
    moveInstrumentation(contentCol, content);
    const children = [...contentCol.children];
    let eyebrowDone = false;
    let ctaSeen = false;

    children.forEach((el) => {
      const isHeading = /^H[1-6]$/.test(el.tagName);
      const hasLink = el.querySelector('a');

      if (!eyebrowDone && !isHeading && el.tagName === 'P' && !hasLink) {
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
  }

  // Build media panel
  const media = document.createElement('div');
  media.className = 'hero-media';

  if (imageCol) {
    moveInstrumentation(imageCol, media);
    const picture = imageCol.querySelector('picture');
    if (picture) {
      media.appendChild(picture);
    }
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
