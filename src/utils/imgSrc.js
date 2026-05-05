/**
 * Detects the correct MIME type from a base64-encoded image string
 * and returns a valid data URI ready for use in <img src={...}>.
 */
const imgSrc = (base64) => {
  if (!base64) return null;
  if (typeof base64 !== 'string') return null;
  // Already a full data URI
  if (base64.startsWith('data:')) return base64;
  // Detect from magic bytes in base64 header
  if (base64.startsWith('/9j/'))     return `data:image/jpeg;base64,${base64}`;
  if (base64.startsWith('iVBORw0K')) return `data:image/png;base64,${base64}`;
  if (base64.startsWith('R0lGOD'))   return `data:image/gif;base64,${base64}`;
  if (base64.startsWith('UklGR'))    return `data:image/webp;base64,${base64}`;
  // Fallback
  return `data:image/jpeg;base64,${base64}`;
};

export default imgSrc;
