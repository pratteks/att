/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-offer block variant.
 * Base block: columns. Source: https://www.business.att.com/
 * UE Model fields: columns (number), rows (number) - Columns blocks are EXEMPT from field hints
 * Source selector: .offer.aem-GridColumn
 * Source structure: two-column layout - left has image, right has eyebrow, h2, bullet list, CTA
 */
export default function parse(element, { document }) {
  // Extract left column: image
  const img = element.querySelector('.order-img-top img, .imgOffer, .video-content-offer img');

  // Extract right column content
  const eyebrow = element.querySelector('[class*="eyebrow-xxl"]');
  const heading = element.querySelector('h2');
  const wysiwyg = element.querySelector('.wysiwyg-editor');
  const cta = element.querySelector('.cta-container a.btn-primary');

  // Build left column (image)
  const leftFrag = document.createDocumentFragment();
  if (img) leftFrag.appendChild(img);

  // Build right column (text content)
  const rightFrag = document.createDocumentFragment();

  if (eyebrow) {
    const eyebrowP = document.createElement('p');
    eyebrowP.textContent = eyebrow.textContent.trim();
    rightFrag.appendChild(eyebrowP);
  }

  if (heading) rightFrag.appendChild(heading);

  // Extract bullet list and clean up checkmark images
  if (wysiwyg) {
    const introP = wysiwyg.querySelector('p');
    if (introP) rightFrag.appendChild(introP);

    const list = wysiwyg.querySelector('ul');
    if (list) {
      // Clean checkmark images from list items, keep only text
      const cleanList = document.createElement('ul');
      list.querySelectorAll('li').forEach((li) => {
        const cleanLi = document.createElement('li');
        const span = li.querySelector('span');
        cleanLi.textContent = span ? span.textContent.trim() : li.textContent.trim();
        cleanList.appendChild(cleanLi);
      });
      rightFrag.appendChild(cleanList);
    }
  }

  if (cta) {
    const p = document.createElement('p');
    p.appendChild(cta);
    rightFrag.appendChild(p);
  }

  // Columns block: single row with 2 cells (left, right)
  const cells = [[leftFrag, rightFrag]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-offer', cells });
  element.replaceWith(block);
}
