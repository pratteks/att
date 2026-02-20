import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Pricing — brand-specific decoration.
 *
 * AEM 6.5 Component Mapping:
 *   pricingCard (sling:resourceType = att/components/content/pricingCard)
 *   Equivalent AEM 6.5 dialog fields:
 *     - planName   → ./jcr:title (textfield)
 *     - price      → ./price (textfield, e.g. "$20")
 *     - pricePer   → ./pricePer (textfield, e.g. "/mo.")
 *     - priceNote  → ./priceNote (textfield, e.g. "per line for 36 mos")
 *     - features   → ./features (richtext, expected as <ul>)
 *     - ctaLink    → ./linkURL (pathfield)
 *     - ctaText    → ./linkText (textfield)
 *     - legalText  → ./legalText (textarea)
 *     - featured   → ./featured (checkbox, highlights the card)
 */
function decorateBattPricing(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'pricing-cards';

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'pricing-card';
    moveInstrumentation(row, card);

    const cells = [...row.children];

    // First cell = header (plan name + price)
    if (cells[0]) {
      const header = document.createElement('div');
      header.className = 'pricing-card-header';

      const headings = cells[0].querySelectorAll('h1,h2,h3,h4,h5,h6');
      headings.forEach((h) => {
        h.classList.add('pricing-card-name');
        header.appendChild(h);
      });

      // Look for price pattern ($XX)
      const priceText = cells[0].textContent;
      const priceMatch = priceText.match(/\$\s*(\d+)/);
      if (priceMatch) {
        const priceEl = document.createElement('div');
        priceEl.className = 'pricing-card-price';
        priceEl.innerHTML = `<span class="pricing-card-price-prefix">$</span>${priceMatch[1]}`;

        const perMatch = priceText.match(/\/\s*mo/i);
        if (perMatch) {
          priceEl.innerHTML += '<span class="pricing-card-price-suffix"> /mo.</span>';
        }
        header.appendChild(priceEl);
      }

      // Remaining paragraphs as price notes
      cells[0].querySelectorAll('p').forEach((p) => {
        if (!p.querySelector('h1,h2,h3,h4,h5,h6') && p.textContent.trim()) {
          p.classList.add('pricing-card-note');
          header.appendChild(p);
        }
      });

      card.appendChild(header);
    }

    // Second cell = features
    if (cells[1]) {
      const body = document.createElement('div');
      body.className = 'pricing-card-body';

      const featureList = cells[1].querySelector('ul, ol');
      if (featureList) {
        featureList.classList.add('pricing-card-features');
        body.appendChild(featureList);
      } else {
        while (cells[1].firstChild) body.appendChild(cells[1].firstChild);
      }

      card.appendChild(body);
    }

    // Third cell = CTA + legal
    if (cells[2]) {
      const ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'pricing-card-cta';

      const link = cells[2].querySelector('a');
      if (link) {
        link.classList.add('button');
        ctaWrapper.appendChild(link.closest('p') || link);
      }

      // Legal text
      cells[2].querySelectorAll('p').forEach((p) => {
        if (!p.querySelector('a') && p.textContent.trim()) {
          p.classList.add('pricing-card-legal');
          ctaWrapper.appendChild(p);
        }
      });

      card.appendChild(ctaWrapper);
    }

    cardsContainer.appendChild(card);
  });

  block.textContent = '';
  block.appendChild(cardsContainer);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattPricing,
    },
  };
}
