/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-banner block variant.
 * Base block: carousel. Source: https://www.business.att.com/
 * UE Model fields (slide item): media_image (reference), media_imageAlt (text, collapsed), content_text (richtext)
 * Source selector: .micro-banner.aem-GridColumn
 * Source structure: .swiper-slide elements with heading (p>b), body text (p), legal text (p)
 * Text-only banner carousel - no images in slides
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));
  const cells = [];

  slides.forEach((slide) => {
    // Extract heading (bold text in heading-section)
    const headingEl = slide.querySelector('.heading-section p b, .heading-section p strong, h3, h4');
    // Extract body text
    const bodyEl = slide.querySelector('.body-text p, .body-text');
    // Extract legal/disclaimer text
    const legalEl = slide.querySelector('.legal-text p, .legal-text');

    // Build image cell with field hint (empty for text-only banner)
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:media_image '));

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));

    if (headingEl) {
      const h3 = document.createElement('h3');
      h3.textContent = headingEl.textContent.trim();
      textFrag.appendChild(h3);
    }
    if (bodyEl) {
      const p = document.createElement('p');
      p.textContent = bodyEl.textContent.trim();
      textFrag.appendChild(p);
    }
    if (legalEl) {
      const small = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = legalEl.textContent.trim();
      small.appendChild(em);
      textFrag.appendChild(small);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-banner', cells });
  element.replaceWith(block);
}
