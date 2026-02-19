import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Classifies content elements within the hero text container.
 * Applies semantic CSS classes based on element type and position:
 * - hero-eyebrow: short paragraph before the first heading
 * - hero-description: paragraph after the first heading (no links)
 * - hero-checklist: unordered/ordered list
 * - hero-legal: paragraph wrapped in <em> or containing <sup>
 * - hero-cta-container: wrapper around all CTA button paragraphs
 * @param {Element} content - The hero-content container
 */
function classifyContent(content) {
  const elements = [...content.children];
  let foundHeading = false;
  let eyebrowFound = false;
  const ctaElements = [];

  elements.forEach((el) => {
    // Eyebrow: first short paragraph before any heading, without links or images
    if (!foundHeading && !eyebrowFound && el.matches('p') && !el.querySelector('a, picture')) {
      const text = el.textContent.trim();
      if (text) {
        el.classList.add('hero-eyebrow');
        eyebrowFound = true;
        return;
      }
    }

    // Headings
    if (el.matches('h1, h2, h3, h4, h5, h6')) {
      foundHeading = true;
      return;
    }

    // CTA buttons (paragraphs containing .button links)
    if (el.matches('.button-container') || el.querySelector('.button')) {
      ctaElements.push(el);
      return;
    }

    // Checklist (unordered or ordered list)
    if (el.matches('ul, ol')) {
      el.classList.add('hero-checklist');
      return;
    }

    // Legal text: paragraph whose sole child is <em>, or contains <sup>
    if (
      foundHeading
      && el.matches('p')
      && (
        (el.children.length === 1 && el.firstElementChild?.matches('em'))
        || el.querySelector('sup')
      )
    ) {
      el.classList.add('hero-legal');
      return;
    }

    // Description: paragraph after heading, without links
    if (foundHeading && el.matches('p') && !el.querySelector('a')) {
      el.classList.add('hero-description');
    }
  });

  // Wrap all CTA buttons in a single container
  if (ctaElements.length > 0) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'hero-cta-container';
    ctaElements[0].before(ctaContainer);
    ctaElements.forEach((cta) => ctaContainer.append(cta));
  }
}

/**
 * Extracts content from the inner column div, unwrapping single wrapper divs.
 * XWalk richtext fields may render with a wrapper div.
 * @param {Element} col - The column element
 * @returns {Element[]} - Array of child elements to move
 */
function extractChildren(col) {
  // If there's a single wrapper div containing the actual content, unwrap it
  if (col.children.length === 1 && col.firstElementChild.matches('div')) {
    return [...col.firstElementChild.children];
  }
  return [...col.children];
}

/**
 * Hero block decorator.
 *
 * Supports these variants (set via classes field in UE or block name):
 * - dark:  Dark theme (dark background, light text)
 * - split: Side-by-side layout (image left, content right)
 * - short: Reduced panel height
 * - zoom:  Zoom-on-hover effect for background image
 *
 * Content model (XWalk): image (reference) + text (richtext)
 * The richtext text field can contain: eyebrow paragraph, heading,
 * description paragraphs, checklists (ul/ol), CTA links, legal text (em).
 */
export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cols = [...row.children];

  // Separate the image column from the text column
  let pictureEl = null;
  let textCol = null;

  cols.forEach((col) => {
    const pic = col.querySelector('picture');
    if (pic && !textCol) {
      pictureEl = pic;
    } else {
      textCol = col;
    }
  });

  // Preserve AUE instrumentation from the original row
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-content';
  moveInstrumentation(row, contentWrapper);

  // Move text content into the content wrapper
  if (textCol) {
    const children = extractChildren(textCol);
    contentWrapper.append(...children);
  }

  // Classify semantic elements (eyebrow, description, checklist, legal, CTAs)
  classifyContent(contentWrapper);

  // Clear the block and rebuild with semantic structure
  block.textContent = '';

  const isSplit = block.classList.contains('split');

  if (isSplit) {
    // Split layout: image + content side by side
    const splitContainer = document.createElement('div');
    splitContainer.className = 'hero-split';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'hero-image';
    if (pictureEl) imageContainer.append(pictureEl);

    splitContainer.append(imageContainer, contentWrapper);
    block.append(splitContainer);
  } else {
    // Default layout: background image with content overlay
    if (pictureEl) {
      const bgContainer = document.createElement('div');
      bgContainer.className = 'hero-bg';
      bgContainer.append(pictureEl);
      block.append(bgContainer);
    }
    block.append(contentWrapper);
  }
}
