// Small formatting and helper utilities for form inputs

const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'aol.com',
  'icloud.com'
];

/**
 * Formats a phone number input string by grouping digits and adding separators.
 * 
 * Expected input: a string containing digits and optional formatting characters (spaces, dashes, etc.).
 * - If fewer than 3 digits are provided, returns the digits as-is.
 * - If 3 digits, returns as-is.
 * - If 4 digits, formats as "(XXX) Y".
 * - If 5 digits, formats as "(XXX) YY".
 * - If 6-10 digits, formats as "(XXX) YYY-ZZZZ" (for 7-9 digits, the last group will be shorter).
 * - If more than 10 digits (up to 15), formats as "(XXX) YYY-ZZZZ WWWWW".
 * - Non-digit characters are ignored; only the first 15 digits are used.
 * - If more than 15 digits are provided, excess digits are truncated.
 * 
 * @param {string} value - The phone number input to format.
 * @returns {string} The formatted phone number string.
 */
// export function formatPhoneInput(value) {
    
//   const digits = value.replace(/\D/g,'').slice(0, 15); // limit phone number to 15 digits
//   if (!value) return '';
// if (digits.length <= 3) return digits;
// if (digits.length === 3) {
//   // 3 digits: (XXX)
//   return `(${digits.slice(0,3)})${digits.slice(3,6)}`;
// }
// if (digits.length === 4) {
//   // 4 digits: (XXX) Y
//   return `(${digits.slice(0,3)}) ${digits.slice(3,4)}`;
// }
// if (digits.length <= 6) {
//      // 3-6 digits: (XXX) YYY
//      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}`;
//    }
//    if (digits.length <= 10) {
//      // 6-10 digits: (XXX) YYY-ZZZZ
//      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
//    }
//    // for longer numbers, group remaining
//   return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)} ${digits.slice(10)}`;
// }
export function formatPhoneInput(value) {
  if (!value) return ''; // Return empty string if no input is provided

  // Remove all non-digit characters and limit to 15 digits
  const digits = value.replace(/\D/g, '').slice(0, 15);

  // Format the phone number (e.g., (123) 456-7890 for US-style formatting)
  const formatted = digits.replace(
    /^(\d{1,3})(\d{1,3})?(\d{1,4})?$/,
    (_, p1, p2, p3) => {
      if (p3) return `(${p1}) ${p2}-${p3}`;
      if (p2) return `(${p1}) ${p2}`;
      return `(${p1}`;
    }
  );

  return formatted;
}


/**
 * Format the input element's phone value while preserving the caret/selection.
 * This counts digits to the left of the caret, reformats the whole value
 * using `formatPhoneInput`, then restores the caret to the logical place
 * relative to the digits (not raw characters).
 *
 * @param {HTMLInputElement} inputEl
 */
export function formatPhonePreserveCaret(inputEl) {
  if (!inputEl) return;

  // Save previous selection/caret
  const start = inputEl.selectionStart ?? 0;
  const end = inputEl.selectionEnd ?? start;

  const valueBefore = inputEl.value || '';

  // Count digits before caret and in selection
  const digitsBeforeCaret = (valueBefore.slice(0, start).match(/\d/g) || []).length;
  const digitsInSelection = (valueBefore.slice(start, end).match(/\d/g) || []).length;

  // Compute new formatted value
  const newFormatted = formatPhoneInput(valueBefore);

  // Replace the value
  inputEl.value = newFormatted;

  // Find caret position in newFormatted that corresponds to digitsBeforeCaret
  let digitCount = 0;
  let newCaretPos = newFormatted.length;
  for (let i = 0; i < newFormatted.length; i++) {
    if (/\d/.test(newFormatted[i])) digitCount++;
    if (digitCount === digitsBeforeCaret) {
      newCaretPos = i + 1; // place caret just after that digit
      break;
    }
  }

  // If there was a selection, restore selection length (in digits)
  if (digitsInSelection > 0) {
    const targetDigitCount = digitsBeforeCaret + digitsInSelection;
    digitCount = 0;
    let newSelEnd = newFormatted.length;
    for (let i = 0; i < newFormatted.length; i++) {
      if (/\d/.test(newFormatted[i])) digitCount++;
      if (digitCount === targetDigitCount) {
        newSelEnd = i + 1;
        break;
      }
    }
    inputEl.setSelectionRange(newCaretPos, newSelEnd);
  } else {
    inputEl.setSelectionRange(newCaretPos, newCaretPos);
  }
}

/**
 * Attach the phone formatter to an input element. Uses the `input` event and
 * preserves caret position via `formatPhonePreserveCaret`.
 *
 * @param {HTMLInputElement} inputEl
 */
export function attachPhoneFormatter(inputEl) {
  if (!inputEl) return;
  const handler = () => {
    // Use rAF to reduce conflicts with some IME/input methods
    requestAnimationFrame(() => formatPhonePreserveCaret(inputEl));
  };
  inputEl.addEventListener('input', handler);
  // Format initial value
  formatPhonePreserveCaret(inputEl);
  return () => inputEl.removeEventListener('input', handler);
}


export function normalizeEmailInput(value) {
  if (!value) return '';
  return value.trim().toLowerCase();
}

export function attachEmailDatalist(emailInput, id = 'email-domains-list') {
  if (!emailInput || !document) return null;
  // avoid creating multiple datalists
  let list = document.getElementById(id);
  if (!list) {
    list = document.createElement('datalist');
    list.id = id;
    COMMON_EMAIL_DOMAINS.forEach(domain => {
      const opt = document.createElement('option');
      opt.value = domain;
      list.appendChild(opt);
    });
    // append close to input to keep DOM tidy
    emailInput.parentNode.appendChild(list);
  }
  emailInput.setAttribute('list', id);
  return list;
}
