/**
 * BATT Form — brand-specific decoration.
 *
 * Restructures block rows into a proper HTML form with labeled fields.
 *
 * AEM 6.5 Component Mapping:
 *   form (sling:resourceType = att/components/content/requestInfoForm)
 *   Equivalent AEM 6.5 dialog fields:
 *     - formTitle     → ./jcr:title (textfield)
 *     - description   → ./jcr:description (richtext)
 *     - fields        → ./fields (multifield: name, type, label, required, placeholder)
 *     - submitLabel   → ./submitLabel (textfield, default "Submit")
 *     - actionURL     → ./actionURL (textfield / pathfield)
 *     - privacyText   → ./privacyText (richtext)
 *     - optInCheckbox  → ./optInLabel (textfield)
 *     - successMsg     → ./thankYouMessage (richtext)
 *     - eloquaFormName → ./elqFormName (textfield, Eloqua integration)
 *     - campaignId     → ./campaignID (textfield, lead attribution)
 *     - redirectUrl    → ./redirectURL (pathfield, post-submit redirect)
 *     - solutionOfInterest → ./solutionOfInterest (select, pre-selected product)
 *
 *   Field validation from live site:
 *     - firstName: maxlength=40
 *     - lastName:  maxlength=40
 *     - email:     maxlength=255
 *     - phone:     maxlength=28
 *     - company:   maxlength=100
 */

function toKebab(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function guessFieldType(label, value) {
  const l = label.toLowerCase();
  if (l.includes('email')) return 'email';
  if (l.includes('phone') || l.includes('tel')) return 'tel';
  if (l.includes('comment') || l.includes('message') || l.includes('textarea')) return 'textarea';
  if (l.includes('checkbox') || l.includes('opt') || l.includes('agree') || l.includes('subscribe')) return 'checkbox';
  if (value && value.includes(',')) return 'select';
  return 'text';
}

function decorateBattForm(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const form = document.createElement('form');
  form.className = 'form-element';
  form.setAttribute('novalidate', '');

  let heading = null;
  let description = null;
  let privacyText = null;
  let submitLabel = 'Submit';

  // Parse rows: detect field definitions vs metadata
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      // Single cell = heading or description
      const [cell] = cells;
      const text = cell?.textContent?.trim();
      const h = cell?.querySelector('h1,h2,h3,h4,h5,h6');
      if (h) {
        heading = h;
      } else if (text) {
        description = cell;
      }
      return;
    }

    const [labelCell, valueCell] = cells;
    const label = labelCell.textContent.trim();
    const value = valueCell.textContent.trim();

    // Check for metadata rows
    if (label.toLowerCase() === 'submit') {
      submitLabel = value || 'Submit';
      return;
    }
    if (label.toLowerCase() === 'privacy') {
      privacyText = valueCell;
      return;
    }
    if (label.toLowerCase() === 'action') {
      form.setAttribute('action', value);
      return;
    }

    // Build form field
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field';

    const fieldLabel = document.createElement('label');
    fieldLabel.textContent = label;
    fieldLabel.setAttribute('for', `form-${toKebab(label)}`);
    fieldWrapper.appendChild(fieldLabel);

    const fieldType = guessFieldType(label, value);
    let input;

    if (fieldType === 'textarea') {
      input = document.createElement('textarea');
      input.placeholder = value || `Enter ${label.toLowerCase()}`;
    } else if (fieldType === 'select') {
      input = document.createElement('select');
      const options = value.split(',').map((o) => o.trim());
      options.forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
    } else if (fieldType === 'checkbox') {
      fieldWrapper.className = 'form-field form-field-checkbox';
      input = document.createElement('input');
      input.type = 'checkbox';
      fieldLabel.textContent = value || label;
    } else {
      input = document.createElement('input');
      input.type = fieldType;
      input.placeholder = value || label;
    }

    input.name = toKebab(label);
    input.id = `form-${toKebab(label)}`;
    fieldWrapper.appendChild(input);

    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = `${label} is required`;
    fieldWrapper.appendChild(error);

    form.appendChild(fieldWrapper);
  });

  // Build final structure
  if (heading) {
    heading.classList.add('form-heading');
    formContainer.appendChild(heading);
  }

  if (description) {
    description.classList.add('form-description');
    formContainer.appendChild(description);
  }

  // Submit button
  const submitWrapper = document.createElement('div');
  submitWrapper.className = 'form-submit';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'button';
  submitBtn.textContent = submitLabel;
  submitWrapper.appendChild(submitBtn);
  form.appendChild(submitWrapper);

  formContainer.appendChild(form);

  if (privacyText) {
    privacyText.classList.add('form-privacy');
    formContainer.appendChild(privacyText);
  }

  block.textContent = '';
  block.appendChild(formContainer);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattForm,
    },
  };
}
