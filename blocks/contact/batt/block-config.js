import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Contact — brand-specific decoration.
 *
 * Two-column layout: contact info (left) + form/CTA (right).
 * Maps to the "Talk to an AT&T Business sales expert" section.
 *
 * AEM 6.5 Component Mapping:
 *   contactSection (sling:resourceType = att/components/content/contactSection)
 *   Also covers: requestInfoForm parent wrapper
 *   Equivalent AEM 6.5 dialog fields:
 *     - heading     → ./jcr:title (textfield)
 *     - description → ./jcr:description (richtext, includes phone link)
 *     - phoneNumber → ./phoneNumber (textfield, e.g. "888.740.4027")
 *     - hours       → ./businessHours (textfield)
 *     - formRef     → ./formPath (pathfield, reference to form component)
 */
function decorateBattContact(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const inner = document.createElement('div');
  inner.className = 'contact-inner';

  const info = document.createElement('div');
  info.className = 'contact-info';

  const formWrapper = document.createElement('div');
  formWrapper.className = 'contact-form-wrapper';

  let formFound = false;

  rows.forEach((row, index) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      // Check if cell has form-like content (inputs, labels)
      const hasFormElements = cell.querySelector('input, select, textarea, form');
      const hasMultipleFields = cells.length >= 2 && index > 0;

      if (hasFormElements || (hasMultipleFields && formFound)) {
        moveInstrumentation(cell, formWrapper);
        while (cell.firstChild) formWrapper.appendChild(cell.firstChild);
        formFound = true;
      } else if (cells.length >= 2 && index === 0) {
        // First row with 2 cells: info | form
        moveInstrumentation(cells[0], info);
        while (cells[0].firstChild) info.appendChild(cells[0].firstChild);
        if (cells[1]) {
          while (cells[1].firstChild) formWrapper.appendChild(cells[1].firstChild);
          formFound = true;
        }
      } else {
        while (cell.firstChild) info.appendChild(cell.firstChild);
      }
    });
  });

  // Classify info elements
  info.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
    h.classList.add('contact-heading');
  });

  info.querySelectorAll('a[href^="tel:"]').forEach((tel) => {
    tel.classList.add('contact-phone');
  });

  info.querySelectorAll('p').forEach((p) => {
    if (!p.querySelector('a[href^="tel:"]') && !p.classList.length) {
      p.classList.add('contact-description');
    }
  });

  block.textContent = '';
  inner.appendChild(info);
  if (formFound && formWrapper.children.length) {
    inner.appendChild(formWrapper);
  }
  block.appendChild(inner);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattContact,
    },
  };
}
