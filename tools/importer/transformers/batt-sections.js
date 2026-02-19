/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business (batt) sections.
 * Adds section breaks (<hr>) and section-metadata blocks from template sections.
 * Runs in afterTransform only, after block parsing.
 * Selectors from page-templates.json section definitions.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== H.after) return;

  const { document } = payload;
  const sections = payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  // Process sections in reverse order to preserve DOM positions
  const reversedSections = [...sections].reverse();

  reversedSections.forEach((section) => {
    // Try to find the first element matching this section's selector
    let sectionEl = null;
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

    for (const sel of selectors) {
      try {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      } catch (e) {
        // Invalid selector, skip
      }
    }

    if (!sectionEl) return;

    // Add section-metadata block if section has a style
    if (section.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: [['style', section.style]],
      });

      // Insert section-metadata after the last content element of this section
      sectionEl.after(sectionMetadata);
    }

    // Add <hr> section break before this section (if it's not the first section
    // and there is content before it)
    const sectionIndex = sections.indexOf(section);
    if (sectionIndex > 0) {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }
  });
}
