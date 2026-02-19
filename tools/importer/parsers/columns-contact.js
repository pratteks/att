/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-contact block variant.
 * Base block: columns. Source: https://www.business.att.com/
 * UE Model fields: columns (number), rows (number) - Columns blocks are EXEMPT from field hints
 * Source selector: .rai-form.aem-GridColumn
 * Source structure: two-column layout - left has heading, phone number, hours text; right has RAI form
 * This parser creates a columns block for the contact section layout.
 * The rai-form parser will also match this selector to create the form block.
 */
export default function parse(element, { document }) {
  // Extract left column: contact info
  const heading = element.querySelector('h2, [class*="heading-xxl"]');
  const phoneLink = element.querySelector('a[href^="tel:"]');
  const hoursText = element.querySelector('.description, .type-base, [class*="type-base"]');

  // Build left column (contact info)
  const leftFrag = document.createDocumentFragment();
  if (heading) leftFrag.appendChild(heading);
  if (phoneLink) {
    const p = document.createElement('p');
    p.appendChild(phoneLink);
    leftFrag.appendChild(p);
  }
  if (hoursText) leftFrag.appendChild(hoursText);

  // Build right column (placeholder for form - actual form handled by rai-form parser)
  const rightFrag = document.createDocumentFragment();
  const formPlaceholder = document.createElement('p');
  formPlaceholder.textContent = 'Contact form';
  rightFrag.appendChild(formPlaceholder);

  // Columns block: single row with 2 cells (left, right)
  const cells = [[leftFrag, rightFrag]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });

  // Instead of replacing the element (which would prevent rai-form parser from running),
  // insert the columns block before the element
  element.before(block);

  // Now create the rai-form block from the same element
  const formAction = element.querySelector('form');
  const actionUrl = formAction ? formAction.getAttribute('action') || '' : '';

  const raiCells = [];
  const actionFrag = document.createDocumentFragment();
  actionFrag.appendChild(document.createComment(' field:action '));
  const actionP = document.createElement('p');
  actionP.textContent = actionUrl;
  actionFrag.appendChild(actionP);
  raiCells.push([actionFrag]);

  const raiBlock = WebImporter.Blocks.createBlock(document, { name: 'rai-form', cells: raiCells });
  element.replaceWith(raiBlock);
}
