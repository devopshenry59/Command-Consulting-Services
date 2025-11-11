import { q, getValue } from '../utils/dom.js';
import { buildMailtoLink } from '../utils/mailto.js';
import { normalizeEmailInput, attachEmailDatalist, attachPhoneFormatter } from '../utils/format.js';

const TO_EMAIL = 'lewis315@hotmail.com';

function collectFormData() {
  const firstName = getValue('#firstName');
  const lastName = getValue('#lastName');
  const title = getValue('#title');
  const company = getValue('#company');
  const email = getValue('#email');
  const phone = getValue('#phone');
  const message = getValue('#message');

  const fullName = `${firstName} ${lastName}`.trim();

  return { firstName, lastName, title, company, email, phone, message, fullName };
}

function onSubmit(e) {
  e.preventDefault();
  const { fullName, title, company, email, phone, message } = collectFormData();

  // Basic client-side validation
  const { valid, errors } = validate({ firstName: getValue('#firstName'), lastName: getValue('#lastName'), email, phone, message });
  clearErrors();
  if (!valid) {
    showErrors(errors);
    return;
  }

  const subject = `Website Inquiry – ${fullName || 'CCS Lead'}`;
  const bodyLines = [
    'Hello Command Consulting Services,',
    '',
    'A new lead has been submitted from the website.',
    '',
    `Name: ${fullName}`,
    `Title/Role: ${title || '—'}`,
    `Organization: ${company || '—'}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    '',
    'Inquiry / Message:',
    message || '—',
    '',
    '—',
    'This message was generated from the CCS web contact form.'
  ];

  const link = buildMailtoLink(TO_EMAIL, subject, bodyLines);
  // open user's mail client
  window.location.href = link;
}

function validate({ firstName, lastName, email, phone, message }) {
  const errors = {};
  if (!firstName) errors['#firstName'] = 'First name is required.';
  if (!lastName) errors['#lastName'] = 'Last name is required.';
  // very small email check
  const emailRx = /^\S+@\S+\.\S+$/;
  if (!email) errors['#email'] = 'Email is required.';
  else if (!emailRx.test(email)) errors['#email'] = 'Enter a valid email address.';
  // phone: require at least 7 digits (allow common separators)
  const digitCount = (phone || '').replace(/\D/g, '').length;
  if (!phone) errors['#phone'] = 'Phone is required.';
  else if (digitCount < 7) errors['#phone'] = 'Enter a valid phone number.';
  if (!message) errors['#message'] = 'Please add a message or details.';

  return { valid: Object.keys(errors).length === 0, errors };
}

function clearErrors() {
  const existing = Array.from(document.querySelectorAll('.error-message'));
  existing.forEach(el => el.remove());
  // remove aria-invalid
  ['#firstName', '#lastName', '#email', '#phone', '#message'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.removeAttribute('aria-invalid');
  });
}

function showErrors(errors) {
  Object.entries(errors).forEach(([selector, message]) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.setAttribute('aria-invalid', 'true');
    const msg = document.createElement('div');
    msg.className = 'error-message';
    msg.textContent = message;
    // insert after the input/textarea
    if (el.nextSibling) el.parentNode.insertBefore(msg, el.nextSibling);
    else el.parentNode.appendChild(msg);
    // remove error on input
    el.addEventListener('input', () => {
      if (msg && msg.parentNode) msg.parentNode.removeChild(msg);
      el.removeAttribute('aria-invalid');
    }, { once: true });
  });
}

export default {
  init() {
    const form = q('#contact-form');
    if (!form) return;
    form.addEventListener('submit', onSubmit);

    // Attach small UX helpers: phone format while typing, normalize email, and datalist suggestions
    const phoneEl = document.querySelector('#phone');
    const emailEl = document.querySelector('#email');
    if (phoneEl) {
      // attach the formatter which preserves caret and formats on each keypress/input
      attachPhoneFormatter(phoneEl);
    }

    if (emailEl) {
      // normalize on blur
      emailEl.addEventListener('blur', () => {
        emailEl.value = normalizeEmailInput(emailEl.value);
      });
      // attach datalist of common domains for browser autofill suggestions
      attachEmailDatalist(emailEl);
    }
  }
};
