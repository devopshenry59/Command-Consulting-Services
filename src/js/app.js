import { setText } from './utils/dom.js';
import contactForm from './components/contactForm.js';
import { attachPhoneFormatter } from './utils/format.js';
const phone = document.querySelector('#phone'); // adjust selector
attachPhoneFormatter(phone);

const init = () => {
  // wire up DOMContentLoaded so this file is safe to import early
  document.addEventListener('DOMContentLoaded', () => {
    setText('#year', new Date().getFullYear());
    contactForm.init();
  });
};

export default { init };
