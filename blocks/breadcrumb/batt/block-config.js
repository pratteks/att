/**
 * BATT Breadcrumb — brand-specific decoration.
 *
 * Displays a breadcrumb navigation trail with links and separators.
 *
 * AEM 6.5 Component Mapping:
 *   breadcrumb (sling:resourceType = att/components/content/breadcrumb)
 *   Equivalent AEM 6.5 dialog fields:
 *     - links     → ./links (multifield: linkURL, linkText)
 *     - separator → ./separator (textfield, default ">")
 */
function decorateBattBreadcrumb(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const links = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const anchor = cell.querySelector('a');
      if (anchor) {
        links.push({ text: anchor.textContent.trim(), href: anchor.href });
      } else {
        const text = cell.textContent.trim();
        if (text) {
          links.push({ text, href: null });
        }
      }
    });
  });

  if (!links.length) return;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  links.forEach((link, index) => {
    const isLast = index === links.length - 1;

    if (index > 0) {
      const sep = document.createElement('li');
      sep.className = 'breadcrumb-separator';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '>';
      ol.appendChild(sep);
    }

    const li = document.createElement('li');

    if (isLast) {
      li.className = 'breadcrumb-current';
      li.setAttribute('aria-current', 'page');
      li.textContent = link.text;
    } else if (link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      li.appendChild(a);
    } else {
      li.textContent = link.text;
    }

    ol.appendChild(li);
  });

  nav.appendChild(ol);
  block.textContent = '';
  block.appendChild(nav);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattBreadcrumb,
    },
  };
}
