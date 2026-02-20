import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Icon List — brand-specific decoration.
 *
 * Displays a vertical or horizontal list of icon + text items.
 * Used for feature lists like "AT&T Guarantee" sections.
 *
 * AEM 6.5 Component Mapping:
 *   iconList (sling:resourceType = att/components/content/iconList)
 *     → items: icon, title, description
 *   Equivalent AEM 6.5 dialog fields:
 *     - icon        → ./iconPath (pathfield, dam asset or icon reference)
 *     - title       → ./jcr:title (textfield)
 *     - description → ./jcr:description (richtext)
 *     - layout      → ./layout (select: vertical | horizontal)
 */
function decorateBattIconList(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const isCheckmarks = block.classList.contains('checkmarks');
  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'icon-list-icon';
        iconWrapper.appendChild(picture);
        li.appendChild(iconWrapper);
      } else {
        const textWrapper = document.createElement('div');
        textWrapper.className = 'icon-list-text';
        while (cell.firstChild) textWrapper.appendChild(cell.firstChild);
        li.appendChild(textWrapper);
      }
    });

    // For checkmark mode without icons, add a checkmark
    if (isCheckmarks && !li.querySelector('.icon-list-icon')) {
      const check = document.createElement('div');
      check.className = 'icon-list-icon icon-list-check';
      check.innerHTML = '<span>✓</span>';
      li.prepend(check);
    }

    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattIconList,
    },
  };
}
