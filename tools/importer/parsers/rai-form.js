/* eslint-disable */
/* global WebImporter */

/**
 * Parser for rai-form block variant.
 * Base block: rai-form. Source: https://www.business.att.com/
 * UE Model fields: action (text)
 * Source selector: .rai-form.aem-GridColumn
 * Note: This parser is a fallback for standalone rai-form elements.
 * When co-located with columns-contact, the columns-contact parser handles both blocks.
 * This parser will only run if the element hasn't already been replaced.
 */
export default function parse(element, { document }) {
  // If the element has already been processed by columns-contact parser, skip
  if (!element.parentNode) return;

  // Extract form action URL
  const formEl = element.querySelector('form');
  const actionUrl = formEl ? formEl.getAttribute('action') || '' : '';

  const cells = [];

  // Row 1: action field
  const actionFrag = document.createDocumentFragment();
  actionFrag.appendChild(document.createComment(' field:action '));
  const actionP = document.createElement('p');
  actionP.textContent = actionUrl;
  actionFrag.appendChild(actionP);
  cells.push([actionFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'rai-form', cells });
  element.replaceWith(block);
}
