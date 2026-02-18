/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block variant.
 * Base block: hero. Source: https://www.business.att.com/
 * UE Model fields: eyebrow (text), text (richtext), image (reference), imageAlt (text, collapsed)
 * Skip: classes (multiselect), imageAlt (collapsed)
 * Hero is a simple block: 3 rows (eyebrow, image, text)
 */
export default function parse(element, { document }) {
  // Extract eyebrow text
  const eyebrowEl = element.querySelector('[class*="eyebrow-lg"], [class*="eyebrow-xxxl"], [class*="eyebrow-xxl"]');
  const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : '';

  // Extract background image (desktop)
  const bgImage = element.querySelector('.bg-hero-panel img, .bg-art img');
  // Extract mobile/inline image as fallback
  const inlineImage = element.querySelector('.hero-panel-image img');
  const image = bgImage || inlineImage;

  // Extract heading
  const heading = element.querySelector('h2, h1');

  // Extract description text
  const descEl = element.querySelector('.wysiwyg-editor, .type-base');

  // Extract disclaimer/legal text
  const legalEl = element.querySelector('.type-legal-wysiwyg-editor');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.cta-container a, a.btn-primary, a.btn-secondary'));

  // Extract checklist items (for guarantee hero variant)
  const checkList = element.querySelector('.chkmrk, ul.list');

  // Build cells following hero block library structure:
  // Row 1: eyebrow (text field)
  // Row 2: image (reference field)
  // Row 3: text (richtext field - heading, description, CTAs)
  const cells = [];

  // Row 1: Eyebrow
  const eyebrowFrag = document.createDocumentFragment();
  eyebrowFrag.appendChild(document.createComment(' field:eyebrow '));
  if (eyebrowText) {
    const eyebrowP = document.createElement('p');
    eyebrowP.textContent = eyebrowText;
    eyebrowFrag.appendChild(eyebrowP);
  }
  cells.push([eyebrowFrag]);

  // Row 2: Image
  const imageFrag = document.createDocumentFragment();
  imageFrag.appendChild(document.createComment(' field:image '));
  if (image) {
    imageFrag.appendChild(image);
  }
  cells.push([imageFrag]);

  // Row 3: Text (richtext - heading, description, bullets, disclaimer, CTAs)
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading);
  if (descEl) textFrag.appendChild(descEl);
  if (checkList) textFrag.appendChild(checkList);
  if (legalEl) textFrag.appendChild(legalEl);
  ctaLinks.forEach((cta) => {
    const p = document.createElement('p');
    p.appendChild(cta);
    textFrag.appendChild(p);
  });
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
