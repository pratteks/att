/**
 * BATT Link List — brand-specific decoration.
 *
 * Multi-column link navigation (e.g., "Looking for more?" section).
 *
 * AEM 6.5 Component Mapping:
 *   linkList (sling:resourceType = att/components/content/linkList)
 *   Also covers: footerLinkColumns, sitemapLinks
 *   Equivalent AEM 6.5 dialog fields:
 *     - heading   → ./jcr:title (textfield)
 *     - columns   → ./columns (multifield of lists)
 *       Each column:
 *         - links → ./links (multifield: linkURL, linkText)
 *     - layout   → ./layout (select: 2-col | 3-col | 4-col)
 */
function decorateBattLinkList(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const heading = cell.querySelector('h1,h2,h3,h4,h5,h6');
      const lists = cell.querySelectorAll('ul, ol');

      if (heading && !wrapper.querySelector('.link-list-heading')) {
        heading.classList.add('link-list-heading');
        wrapper.appendChild(heading);
      }

      if (lists.length > 0) {
        let columns = wrapper.querySelector('.link-list-columns');
        if (!columns) {
          columns = document.createElement('div');
          columns.className = 'link-list-columns';
          wrapper.appendChild(columns);
        }

        lists.forEach((list) => {
          const col = document.createElement('div');
          col.className = 'link-list-column';
          col.appendChild(list);
          columns.appendChild(col);
        });
      }
    });
  });

  block.textContent = '';
  block.appendChild(wrapper);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattLinkList,
    },
  };
}
