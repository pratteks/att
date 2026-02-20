import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Tabs — brand-specific decoration.
 *
 * AEM 6.5 Component Mapping:
 *   tabs (sling:resourceType = att/components/content/tabs)
 *     → tab items: tabTitle, tabContent
 *   Equivalent AEM 6.5 dialog fields:
 *     - tabTitle   → ./jcr:title (textfield)
 *     - tabContent → ./jcr:description (richtext with nested components)
 *     - tabIcon    → ./iconPath (pathfield, optional)
 *     - tabImage   → ./fileReference (pathfield, dam asset, optional)
 */
function decorateBattTabs(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Build tab list
  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  // Build tab panels
  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const tabId = `tab-${index}`;
    const panelId = `panel-${index}`;

    // Tab button
    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', tabId);
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.textContent = cells[0].textContent.trim();
    tabList.appendChild(tab);

    // Tab panel
    const panel = document.createElement('div');
    panel.className = `tabs-panel${index === 0 ? ' active' : ''}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', panelId);
    panel.setAttribute('aria-labelledby', tabId);
    moveInstrumentation(row, panel);

    // Move content from second cell onward
    for (let i = 1; i < cells.length; i += 1) {
      const cell = cells[i];
      if (cell.querySelector('picture')) {
        cell.className = 'tabs-panel-image';
      } else {
        cell.className = 'tabs-panel-content';
        cell.querySelectorAll('p a').forEach((link) => {
          link.classList.add('button');
          link.closest('p').classList.add('button-container');
        });
      }
      panel.appendChild(cell);
    }

    panels.appendChild(panel);
  });

  block.textContent = '';
  block.appendChild(tabList);
  block.appendChild(panels);

  // Tab switching
  tabList.querySelectorAll('.tabs-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabList.querySelectorAll('.tabs-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');

      const panelId = tab.getAttribute('aria-controls');
      panels.querySelectorAll('.tabs-panel').forEach((p) => p.classList.remove('active'));
      panels.querySelector(`#${panelId}`).classList.add('active');
    });
  });

  // Keyboard navigation
  tabList.addEventListener('keydown', (e) => {
    const tabs = [...tabList.querySelectorAll('.tabs-tab')];
    const currentIndex = tabs.indexOf(document.activeElement);
    let nextIndex;

    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else return;

    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  });
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattTabs,
    },
  };
}
