/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-story block variant.
 * Base block: carousel. Source: https://www.business.att.com/
 * UE Model fields (slide item): media_image (reference), media_imageAlt (text, collapsed), content_text (richtext)
 * Source selector: .story-stack.aem-GridColumn
 * Source structure: .ss-card elements with icon img, title, description text
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.ss-card'));
  const cells = [];

  cards.forEach((card) => {
    // Extract icon/image
    const img = card.querySelector('img');

    // Extract title
    const title = card.querySelector('h3, h4, [class*="heading"]');
    // Extract description
    const desc = card.querySelector('p, .body-text, [class*="type-base"]');

    // Build image cell with field hint
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:media_image '));
    if (img) imageFrag.appendChild(img);

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));
    if (title) textFrag.appendChild(title);
    if (desc && desc !== title) textFrag.appendChild(desc);

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-story', cells });
  element.replaceWith(block);
}
