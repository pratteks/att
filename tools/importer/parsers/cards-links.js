/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-links block variant.
 * Base block: cards. Source: https://www.business.att.com/
 * UE Model fields (card item): image (reference), text (richtext)
 * Source selector: .link-farm.aem-GridColumn
 * Source structure: .link-farm-col elements, each with h3 category title and ul with li>a links
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll('.link-farm-col'));
  const cells = [];

  columns.forEach((col) => {
    // Extract category heading
    const heading = col.querySelector('h3, h4, [class*="heading"]');
    // Extract links list
    const links = Array.from(col.querySelectorAll('ul li a, a'));

    // No image for link cards - empty image cell with field hint
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (heading) textFrag.appendChild(heading);

    if (links.length > 0) {
      const ul = document.createElement('ul');
      links.forEach((link) => {
        // Skip if link is the heading itself
        if (heading && heading.contains(link)) return;
        const li = document.createElement('li');
        li.appendChild(link);
        ul.appendChild(li);
      });
      if (ul.childNodes.length > 0) textFrag.appendChild(ul);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-links', cells });
  element.replaceWith(block);
}
