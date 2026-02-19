/* eslint-disable */
/* global WebImporter */

/**
 * Parser for footer block.
 * Source selector: .footer-page-css-includes.aem-GridColumn
 * Note: Footer is typically handled as a fragment in EDS, not per-page content.
 * The cleanup transformer removes the footer element from the DOM.
 * This parser exists as a safety net in case the footer element survives cleanup.
 * It creates a minimal footer block with any remaining link content.
 */
export default function parse(element, { document }) {
  // If element is empty or already removed by cleanup, skip
  if (!element.parentNode || !element.textContent.trim()) return;

  // Extract any footer links that survived cleanup
  const links = Array.from(element.querySelectorAll('a'));
  const cells = [];

  if (links.length > 0) {
    const frag = document.createDocumentFragment();
    const ul = document.createElement('ul');
    links.forEach((link) => {
      const li = document.createElement('li');
      li.appendChild(link);
      ul.appendChild(li);
    });
    frag.appendChild(ul);
    cells.push([frag]);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'footer', cells });
    element.replaceWith(block);
  } else {
    // Remove empty footer element
    element.remove();
  }
}
