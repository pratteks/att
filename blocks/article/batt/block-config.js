/**
 * BATT Article — brand-specific decoration.
 *
 * Displays an article with metadata, optional TOC, and sharing links.
 * Used for blog posts and editorial content.
 *
 * AEM 6.5 Component Mapping:
 *   articleBody / blogArticle
 *   (sling:resourceType = att/components/content/articleBody
 *    or att/components/content/blogArticle)
 *   Equivalent AEM 6.5 dialog fields:
 *     - title           → ./jcr:title (textfield)
 *     - author          → ./author (textfield)
 *     - authorRole      → ./authorRole (textfield)
 *     - publishDate     → ./publishDate (datepicker)
 *     - readTime        → ./readTime (textfield, e.g. "6 min read")
 *     - heroImage       → ./fileReference (pathfield)
 *     - category        → ./category (select)
 *     - body            → ./jcr:description (richtext, the main article body)
 *     - relatedArticles → ./relatedArticles (multifield: path, title, category, date)
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function buildToc(bodyEl) {
  const headings = bodyEl.querySelectorAll('h2');
  if (!headings.length) return null;

  const tocNav = document.createElement('nav');
  tocNav.className = 'article-toc';

  const tocTitle = document.createElement('h3');
  tocTitle.textContent = 'Table of Contents';
  tocNav.appendChild(tocTitle);

  const ol = document.createElement('ol');

  headings.forEach((heading) => {
    const id = slugify(heading.textContent);
    heading.id = id;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = heading.textContent;
    li.appendChild(a);
    ol.appendChild(li);
  });

  tocNav.appendChild(ol);
  return tocNav;
}

function buildShareLinks() {
  const shareDiv = document.createElement('div');
  shareDiv.className = 'article-share';

  const platforms = [
    { label: 'X', symbol: 'X' },
    { label: 'Facebook', symbol: 'f' },
    { label: 'LinkedIn', symbol: 'in' },
    { label: 'Email', symbol: '@' },
  ];

  platforms.forEach((platform) => {
    const a = document.createElement('a');
    a.href = '#';
    a.setAttribute('aria-label', `Share on ${platform.label}`);
    a.textContent = platform.symbol;
    shareDiv.appendChild(a);
  });

  return shareDiv;
}

function parseMetadataRows(rows) {
  const metadata = {};
  const contentRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const [labelCell, valueCell] = cells;
      const label = labelCell.textContent.trim().toLowerCase();
      if (['author', 'readtime', 'read time', 'category', 'authorrole', 'author role'].includes(label)) {
        metadata[label.replace(/\s+/g, '')] = valueCell.textContent.trim();
        return;
      }
    }
    contentRows.push(row);
  });

  return { metadata, contentRows };
}

function decorateBattArticle(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const { metadata, contentRows } = parseMetadataRows(rows);
  const hasToc = block.classList.contains('with-toc');
  const hasShare = block.classList.contains('with-share');

  const fragment = document.createDocumentFragment();

  // Build article meta
  if (metadata.author || metadata.readtime || metadata.category) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'article-meta';

    if (metadata.category) {
      const cat = document.createElement('span');
      cat.className = 'article-category';
      cat.textContent = metadata.category;
      metaDiv.appendChild(cat);
    }

    if (metadata.author) {
      const authorSpan = document.createElement('span');
      authorSpan.className = 'article-author';
      authorSpan.textContent = metadata.author;
      if (metadata.authorrole) {
        authorSpan.textContent += `, ${metadata.authorrole}`;
      }
      metaDiv.appendChild(authorSpan);
    }

    if (metadata.readtime) {
      const readSpan = document.createElement('span');
      readSpan.className = 'article-read-time';
      readSpan.textContent = metadata.readtime;
      metaDiv.appendChild(readSpan);
    }

    fragment.appendChild(metaDiv);
  }

  // Build share links
  if (hasShare) {
    fragment.appendChild(buildShareLinks());
  }

  // Build article body
  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'article-body';

  contentRows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      while (cell.firstChild) bodyDiv.appendChild(cell.firstChild);
    });
  });

  // Build TOC from body headings
  if (hasToc) {
    const toc = buildToc(bodyDiv);
    if (toc) fragment.appendChild(toc);
  }

  fragment.appendChild(bodyDiv);

  block.textContent = '';
  block.appendChild(fragment);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattArticle,
    },
  };
}
