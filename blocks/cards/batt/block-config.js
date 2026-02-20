/**
 * BATT Cards — brand-specific decoration.
 *
 * Enhances the base cards block with AT&T Business styling:
 *   - Feature icon cards (icon + heading + description + CTA)
 *   - Image cards (photo + text)
 *   - Stat cards (large number + label)
 *
 * AEM 6.5 Component Mapping:
 *   cardList (sling:resourceType = att/components/content/cardList)
 *     → card items: image, title, description, linkURL, linkText
 *   Equivalent AEM 6.5 dialog fields:
 *     - image       → ./image (pathfield, dam asset reference)
 *     - title       → ./jcr:title (textfield)
 *     - description → ./jcr:description (textarea / richtext)
 *     - linkURL     → ./linkURL (pathfield)
 *     - linkText    → ./linkText (textfield)
 *     - cardStyle   → ./cardStyle (select: default | icon | stat | featured)
 *     - cardHeight  → ./cardHeight (select: auto | tall) — controls card-height-tall-* classes
 *     - hoverEffect → ./hoverEffect (checkbox) — enables zoom-on-hover / zoomable effect
 */
function decorateBattCards(block) {
  const items = block.querySelectorAll('li');
  if (!items.length) return;

  items.forEach((item) => {
    item.classList.add('cards-card');

    const body = item.querySelector('.cards-card-body');
    if (!body) return;

    // Classify content elements
    const headings = body.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((h) => h.classList.add('cards-card-heading'));

    const paragraphs = body.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const link = p.querySelector('a');
      if (link) {
        link.classList.add('button');
        p.classList.add('button-container', 'cards-card-cta');
      } else if (!p.classList.contains('cards-card-cta')) {
        p.classList.add('cards-card-description');
      }
    });

    // Check for icon-style cards (small image + text, no large photo)
    const imgDiv = item.querySelector('.cards-card-image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img && img.width <= 100 && img.height <= 100) {
        item.classList.add('cards-icon-card');
      }
    }
  });
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattCards,
    },
  };
}
