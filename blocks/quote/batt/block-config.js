/**
 * BATT Quote — brand-specific decoration.
 *
 * Displays a styled blockquote with optional attribution and image.
 * Supports testimonial, award, centered, and dark variants.
 *
 * AEM 6.5 Component Mapping:
 *   quote / testimonial
 *   (sling:resourceType = att/components/content/quote
 *    or att/components/content/testimonial)
 *   Equivalent AEM 6.5 dialog fields:
 *     - quoteText       → ./jcr:description (richtext)
 *     - attribution     → ./attribution (textfield)
 *     - attributionRole → ./attributionRole (textfield)
 *     - image           → ./fileReference (pathfield, optional author/logo image)
 */
function decorateBattQuote(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  let quoteContent = null;
  let attributionText = null;
  let picture = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic) {
        picture = pic;
      } else if (!quoteContent) {
        quoteContent = cell;
      } else if (!attributionText) {
        const text = cell.textContent.trim();
        if (text) {
          attributionText = text;
        }
      }
    });
  });

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-inner';

  if (picture) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'quote-image';
    imageWrapper.appendChild(picture);
    blockquote.appendChild(imageWrapper);
  }

  if (quoteContent) {
    const quoteTextDiv = document.createElement('div');
    quoteTextDiv.className = 'quote-text';
    while (quoteContent.firstChild) quoteTextDiv.appendChild(quoteContent.firstChild);
    blockquote.appendChild(quoteTextDiv);
  }

  if (attributionText) {
    const footer = document.createElement('footer');
    footer.className = 'quote-attribution';
    const cite = document.createElement('cite');
    cite.textContent = attributionText;
    footer.appendChild(cite);
    blockquote.appendChild(footer);
  }

  block.textContent = '';
  block.appendChild(blockquote);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattQuote,
    },
  };
}
