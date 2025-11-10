export function buildMailtoLink(to, subject, bodyLines) {
  const subjectEnc = encodeURIComponent(subject);
  const bodyEnc = encodeURIComponent((bodyLines || []).join('\n'));
  return `mailto:${to}?subject=${subjectEnc}&body=${bodyEnc}`;
}
