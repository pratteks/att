/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-value block variant.
 * Base block: cards. Source: https://www.business.att.com/
 * UE Model fields (card item): image (reference), text (richtext)
 * Source selector: .generic-list-value-prop.aem-GridColumn
 * Source structure: .generic-list-icon-vp items with icon img, h4 title, .description, .type-legal, .primary-cta
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.generic-list-icon-vp'));
  const cells = [];

  cards.forEach((card) => {
    // Extract icon image
    const img = card.querySelector('span img, .height-xl-all img');

    // Extract title
    const title = card.querySelector('h4, .heading-md');
    // Extract description
    const desc = card.querySelector('.description');
    // Extract legal/disclaimer
    const legal = card.querySelector('.type-legal-wysiwyg-editor, .type-legal');
    // Extract CTA link
    const cta = card.querySelector('.primary-cta, a[class*="cta"]');

    // Build image cell with field hint
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (img) imageFrag.appendChild(img);

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-value', cells });
  element.replaceWith(block);
}
