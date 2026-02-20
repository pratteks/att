import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Accordion — brand-specific decoration.
 *
 * AEM 6.5 Component Mapping:
 *   accordion (sling:resourceType = att/components/content/accordion)
 *     → items: title, content (richtext)
 *   Equivalent AEM 6.5 dialog fields:
 *     - title      → ./jcr:title (textfield)
 *     - content    → ./jcr:description (richtext)
 *     - expanded   → ./expanded (checkbox, default collapsed)
 *     - singleOpen → ./singleOpen (checkbox, parent-level)
 */
function decorateBattAccordion(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const isSingleOpen = block.classList.contains('single-open');
  const container = document.createElement('div');
  container.className = 'accordion-container';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const item = document.createElement('div');
    item.className = 'accordion-item';
    moveInstrumentation(row, item);

    // First cell = title
    const trigger = document.createElement('button');
    trigger.className = 'accordion-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.textContent = cells[0].textContent.trim();

    // Second cell = content
    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.setAttribute('role', 'region');

    const panelContent = document.createElement('div');
    panelContent.className = 'accordion-panel-content';
    while (cells[1].firstChild) {
      panelContent.appendChild(cells[1].firstChild);
    }
    panel.appendChild(panelContent);

    // Toggle behavior
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      if (isSingleOpen) {
        container.querySelectorAll('.accordion-item.active').forEach((openItem) => {
          openItem.classList.remove('active');
          openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        });
      }

      item.classList.toggle('active', !isActive);
      trigger.setAttribute('aria-expanded', String(!isActive));
    });

    item.appendChild(trigger);
    item.appendChild(panel);
    container.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(container);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattAccordion,
    },
  };
}
