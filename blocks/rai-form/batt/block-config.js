function validateField(input) {
  const field = input.closest('.form-field');
  const error = field?.querySelector('.form-error');
  if (!error) return true;

  let message = '';
  const { value } = input;
  const { name } = input;

  if (input.required && !value.trim()) {
    message = 'This field is required.';
  } else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = 'Please enter a valid email address.';
  } else if (name === 'phone' && value && !/^[\d\s()+-]{7,}$/.test(value)) {
    message = 'Please enter a valid phone number.';
  }

  error.textContent = message;
  if (message) input.classList.add('invalid');
  else input.classList.remove('invalid');
  return !message;
}

function createField(name, label, type = 'text', required = true) {
  const div = document.createElement('div');
  div.classList.add('form-field');

  const lbl = document.createElement('label');
  lbl.setAttribute('for', `rai-${name}`);
  lbl.textContent = label;

  let input;
  if (type === 'textarea') {
    input = document.createElement('textarea');
    input.setAttribute('placeholder', 'Do not include any personal information such as a Social Security number (SSN), Employer Identification Number (EIN), driver\'s license or state ID number, financial account number(s), credit or debit card number(s), or any other sensitive information in this form.');
  } else {
    input = document.createElement('input');
    input.type = type;
  }
  input.id = `rai-${name}`;
  input.name = name;
  if (required) input.required = true;

  const error = document.createElement('div');
  error.classList.add('form-error');
  error.setAttribute('role', 'alert');

  input.addEventListener('blur', () => validateField(input));

  div.append(lbl, input, error);
  return div;
}

async function decorateRaiForm(block) {
  /* Read the action URL from the block content if present */
  const actionUrl = block.textContent.trim() || '#';
  block.textContent = '';

  const form = document.createElement('form');
  form.setAttribute('action', actionUrl);
  form.setAttribute('method', 'POST');
  form.noValidate = true;

  const fieldsGrid = document.createElement('div');
  fieldsGrid.classList.add('form-fields-grid');

  fieldsGrid.append(
    createField('firstName', 'First name'),
    createField('lastName', 'Last name'),
    createField('email', 'Email address', 'email'),
    createField('phone', 'Phone', 'tel'),
    createField('companyName', 'Company name'),
    createField('comment', 'Add comment', 'textarea', false),
  );

  const checkboxDiv = document.createElement('div');
  checkboxDiv.classList.add('form-checkbox');
  checkboxDiv.innerHTML = `
    <input type="checkbox" id="rai-optin" name="optin">
    <label for="rai-optin">Yes, please send me the latest news and offers for AT&T Business solutions.</label>
  `;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';

  const privacy = document.createElement('p');
  privacy.classList.add('form-privacy');
  privacy.innerHTML = 'We are committed to protecting your <a href="https://www.att.com/gen/privacy-policy?pid=2506">privacy</a>.';

  form.append(fieldsGrid, checkboxDiv, submitBtn, privacy);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) valid = false;
    });
    if (valid) {
      /* Submit form data */
      form.submit();
    }
  });

  block.append(form);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: async ({ block }) => decorateRaiForm(block),
    },
  };
}
