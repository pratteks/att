/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product block variant.
 * Base block: cards. Source: https://www.business.att.com/
 * UE Model fields (card item): image (reference), text (richtext)
 * Container block: each card = one row, columns = [image, text]
 * Source selector: .multi-tile-cards.aem-GridColumn
 * Source structure: .tile-card elements with .card-img img, h3, .tileSubheading, .price-comp, .cardlegal, .cta-container a
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.tile-card'));
  const cells = [];

  cards.forEach((card) => {
    // Extract card image (icon)
    const img = card.querySelector('.card-img img');

    // Extract text content: title, description, pricing, disclaimer, CTA
    const title = card.querySelector('h3, .js-heading-section');
    const desc = card.querySelector('.tileSubheading');
    const priceQty = card.querySelector('.price-amount-qty');
    const priceDesc = card.querySelector('.price-description');
    const priceDisclosure = card.querySelector('.price-disclosure');
    const legal = card.querySelector('.cardlegal');
    const cta = card.querySelector('.cta-container a');

    // Build image cell with field hint
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (img) imageFrag.appendChild(img);

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (title) textFrag.appendChild(title);
    if (desc) textFrag.appendChild(desc);

    // Build pricing text
    if (priceQty) {
      const priceP = document.createElement('p');
      if (priceDesc) priceP.textContent = priceDesc.textContent.trim() + ' ';
      const strong = document.createElement('strong');
      strong.textContent = '$' + priceQty.textContent.trim();
      priceP.appendChild(strong);
      if (priceDisclosure) {
        const small = document.createElement('small');
        small.textContent = ' ' + priceDisclosure.textContent.trim();
        priceP.appendChild(small);
      }
      textFrag.appendChild(priceP);
    }

    if (legal) textFrag.appendChild(legal);

    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
