export function q(selector, base = document) {
  return base.querySelector(selector);
}

export function qAll(selector, base = document) {
  return Array.from(base.querySelectorAll(selector));
}

export function setText(selector, text) {
  const el = q(selector);
  if (el) el.textContent = text;
}

export function getValue(selector) {
  const el = q(selector);
  if (!el) return '';
  return (el.value || '').toString().trim();
}
