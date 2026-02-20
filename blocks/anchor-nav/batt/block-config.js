/**
 * BATT Anchor Nav — brand-specific decoration.
 *
 * Displays a horizontal navigation bar of in-page anchor links.
 * Supports sticky positioning and active-state tracking on scroll.
 *
 * AEM 6.5 Component Mapping:
 *   anchorNav / jumpLinks
 *   (sling:resourceType = att/components/content/anchorNav
 *    or att/components/content/jumpLinks)
 *   Equivalent AEM 6.5 dialog fields:
 *     - links  → ./links (multifield: linkText, anchorId)
 *     - sticky → ./sticky (checkbox, default false)
 */
function updateActiveLink(navLinks) {
  let currentActive = null;

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href')?.replace('#', '');
    if (!targetId) return;
    const section = document.getElementById(targetId);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        currentActive = link;
      }
    }
  });

  navLinks.forEach((link) => link.classList.remove('anchor-nav-active'));
  if (currentActive) {
    currentActive.classList.add('anchor-nav-active');
  }
}

function decorateBattAnchorNav(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const links = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const anchor = cell.querySelector('a');
      if (anchor) {
        links.push({ text: anchor.textContent.trim(), href: anchor.getAttribute('href') });
      }
    });
  });

  if (!links.length) return;

  const nav = document.createElement('nav');
  nav.className = 'anchor-nav-inner';
  nav.setAttribute('aria-label', 'Page navigation');

  const ul = document.createElement('ul');
  ul.className = 'anchor-nav-list';

  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  block.textContent = '';
  block.appendChild(nav);

  const isSticky = block.classList.contains('sticky');

  if (isSticky) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          block.classList.add('anchor-nav-stuck');
        } else {
          block.classList.remove('anchor-nav-stuck');
        }
      },
      { threshold: 0 },
    );

    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    block.parentElement.insertBefore(sentinel, block);
    observer.observe(sentinel);
  }

  const navLinks = [...ul.querySelectorAll('a')];
  window.addEventListener('scroll', () => updateActiveLink(navLinks), { passive: true });
  updateActiveLink(navLinks);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattAnchorNav,
    },
  };
}
