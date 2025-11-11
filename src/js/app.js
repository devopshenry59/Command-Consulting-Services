import { setText } from './utils/dom.js';
import contactForm from './components/contactForm.js';

const init = () => {
  // wire up DOMContentLoaded so this file is safe to import early
  document.addEventListener('DOMContentLoaded', () => {
    setText('#year', new Date().getFullYear());
    contactForm.init();
  });
};

export default { init };
