/**
 * A basic HTML sanitizer that removes <script> and other dangerous tags/attributes.
 * Use this as a lightweight fallback when external libraries aren't available.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Remove dangerous tags and their content
  let sanitized = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
  sanitized = sanitized.replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, '');
  sanitized = sanitized.replace(/<object\b[^>]*>([\s\S]*?)<\/object>/gim, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>([\s\S]*?)<\/embed>/gim, '');

  // Remove dangerous event attributes (onmouseover, onclick, etc.)
  const onEventRegex = /\son[a-z]+\s*=\s*(['"])(.*?)\1/gim;
  sanitized = sanitized.replace(onEventRegex, '');

  // Remove javascript: pseudo-protocols
  const jsProtocolRegex = /href\s*=\s*(['"])javascript:.*?\1/gim;
  sanitized = sanitized.replace(jsProtocolRegex, 'href="#"');

  return sanitized;
}
