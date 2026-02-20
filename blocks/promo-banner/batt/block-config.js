import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Promo Banner — brand-specific decoration.
 *
 * AEM 6.5 Component Mapping:
 *   promoBanner (sling:resourceType = att/components/content/promoBanner)
 *   Also covers: ctaSection, bannerSection
 *   Equivalent AEM 6.5 dialog fields:
 *     - eyebrow     → ./eyebrow (textfield)
 *     - title       → ./jcr:title (textfield)
 *     - description → ./jcr:description (richtext)
 *     - image       → ./fileReference (pathfield, dam asset)
 *     - imageAlt    → ./alt (textfield)
 *     - ctaLink     → ./linkURL (pathfield)
 *     - ctaText     → ./linkText (textfield)
 *     - ctaLink2    → ./linkURL2 (pathfield)
 *     - ctaText2    → ./linkText2 (textfield)
 *     - bgColor     → ./backgroundColor (colorpicker / select)
 *     - layout      → ./layout (select: left | right | full-width)
 *     - legalText   → ./legalText (richtext, fine print below CTAs)
 */
function decorateBattPromoBanner(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const inner = document.createElement('div');
  inner.className = 'promo-banner-inner';

  const content = document.createElement('div');
  content.className = 'promo-banner-content';

  const media = document.createElement('div');
  media.className = 'promo-banner-media';

  let hasMedia = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture && !hasMedia) {
        moveInstrumentation(cell, media);
        media.appendChild(picture);
        hasMedia = true;
      } else {
        [...cell.children].forEach((child) => {
          const isHeading = /^H[1-6]$/.test(child.tagName);
          const hasLink = child.querySelector('a');

          if (!isHeading && !hasLink && child.tagName === 'P'
            && !content.querySelector('.promo-banner-eyebrow')
            && !content.querySelector('.promo-banner-heading')) {
            child.classList.add('promo-banner-eyebrow');
          } else if (isHeading) {
            child.classList.add('promo-banner-heading');
          } else if (hasLink) {
            const link = child.querySelector('a');
            link.classList.add('button');
            if (!content.querySelector('.promo-banner-cta-primary')) {
              link.classList.add('promo-banner-cta-primary');
            } else {
              link.classList.add('secondary', 'promo-banner-cta-secondary');
            }
            child.classList.add('button-container');
          } else if (child.tagName === 'UL' || child.tagName === 'OL') {
            child.classList.add('promo-banner-list');
          } else {
            child.classList.add('promo-banner-description');
          }
          content.appendChild(child);
        });

        if (!cell.children.length && cell.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = cell.textContent.trim();
          p.classList.add('promo-banner-description');
          content.appendChild(p);
        }
      }
    });
  });

  if (rows[0]?.children[0]) {
    moveInstrumentation(rows[0].children[0], content);
  }

  const isRight = block.classList.contains('content-right');

  block.textContent = '';

  if (isRight) {
    inner.appendChild(media);
    inner.appendChild(content);
  } else {
    inner.appendChild(content);
    if (hasMedia) inner.appendChild(media);
  }

  block.appendChild(inner);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattPromoBanner,
    },
  };
}
