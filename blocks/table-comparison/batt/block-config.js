import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Table Comparison — brand-specific decoration.
 *
 * Restructures the block rows into a proper <table> element.
 *
 * AEM 6.5 Component Mapping:
 *   tableBuilder (sling:resourceType = att/components/content/tableBuilder)
 *     → columns defined in dialog, rows as child nodes
 *   Equivalent AEM 6.5 dialog fields:
 *     - columnHeaders → ./columnHeaders (multifield of textfields)
 *     - rows          → ./rows (multifield of multifield cells)
 *     - highlightCol  → ./highlightColumn (numberfield, 0-based index)
 *     - stickyHeader  → ./stickyHeader (checkbox)
 *     - fullBorders   → ./fullBorders (checkbox)
 */
function decorateBattTableComparison(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const table = document.createElement('table');
  const hasHighlight = block.classList.contains('highlight-column');

  rows.forEach((row, rowIndex) => {
    const isHeader = rowIndex === 0;
    const section = isHeader ? document.createElement('thead') : null;
    const tr = document.createElement('tr');
    moveInstrumentation(row, tr);

    const cells = [...row.children];
    cells.forEach((cell, colIndex) => {
      const el = document.createElement(isHeader ? 'th' : 'td');
      el.innerHTML = cell.innerHTML;
      el.setAttribute('scope', isHeader ? 'col' : '');

      if (hasHighlight && colIndex > 0 && colIndex === cells.length - 1) {
        el.classList.add('highlight');
      }

      // Convert checkmark/cross text markers
      const text = el.textContent.trim().toLowerCase();
      if (text === '✓' || text === 'yes' || text === 'true') {
        el.innerHTML = '<span class="check-icon" aria-label="Included"></span>';
      } else if (text === '✗' || text === 'no' || text === 'false') {
        el.innerHTML = '<span class="cross-icon" aria-label="Not included"></span>';
      }

      tr.appendChild(el);
    });

    if (isHeader) {
      section.appendChild(tr);
      table.appendChild(section);
      if (!table.querySelector('tbody')) {
        table.appendChild(document.createElement('tbody'));
      }
    } else {
      let tbody = table.querySelector('tbody');
      if (!tbody) {
        tbody = document.createElement('tbody');
        table.appendChild(tbody);
      }
      tbody.appendChild(tr);
    }
  });

  block.textContent = '';
  block.appendChild(table);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattTableComparison,
    },
  };
}
