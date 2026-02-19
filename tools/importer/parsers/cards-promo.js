/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo block variant.
 * Base block: cards. Source: https://www.business.att.com/
 * UE Model fields (card item): image (reference), text (richtext)
 * Source selector: .flex-cards.aem-GridColumn
 * Source structure: .card-wrapper elements with bg img, eyebrow div, h3, description, legal, CTA
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.card-wrapper'));
  const cells = [];

  cards.forEach((card) => {
    // Extract background image
    const img = card.querySelector('.flex-card > img, .card > img');

    // Extract eyebrow
    const eyebrow = card.querySelector('[class*="eyebrow-lg"]');
    // Extract title
    const title = card.querySelector('h3, [class*="heading-lg"]');
    // Extract description
    const desc = card.querySelector('.type-base');
    // Extract legal/disclaimer
    const legal = card.querySelector('.type-legal');
    // Extract CTA
    const cta = card.querySelector('.flexCardItemCta a, a.btn-primary, a.anchor4-button-link');

    // Build image cell with field hint
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (img) imageFrag.appendChild(img);

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (eyebrow) {
      const eyebrowP = document.createElement('p');
      eyebrowP.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(eyebrowP);
    }
    if (title) textFrag.appendChild(title);
    if (desc) textFrag.appendChild(desc);
    if (legal) textFrag.appendChild(legal);
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
