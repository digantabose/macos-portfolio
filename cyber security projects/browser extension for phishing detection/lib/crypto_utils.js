/**
 * Hashes a string using the SHA-256 algorithm via the native Web Crypto API.
 * @param {string} message - The string to hash.
 * @returns {Promise<string>} The SHA-256 hash in hexadecimal format.
 */
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Normalizes a URL for privacy-preserving checks.
 * Strips queries, hashes, and schemas.
 * @param {string} urlString - The raw URL string.
 * @returns {string} The normalized hostname + path.
 */
export function normalizeUrl(urlString) {
  try {
    const url = new URL(urlString);
    // Remove protocol, trailing slash, queries, and hash parameters
    let path = url.pathname;
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return `${url.hostname}${path}`;
  } catch (e) {
    // If URL parsing fails, clean it manually
    let clean = urlString.replace(/^(https?:\/\/)?(www\.)?/, '');
    const queryIdx = clean.indexOf('?');
    if (queryIdx !== -1) clean = clean.substring(0, queryIdx);
    const hashIdx = clean.indexOf('#');
    if (hashIdx !== -1) clean = clean.substring(0, hashIdx);
    if (clean.endsWith('/')) clean = clean.slice(0, -1);
    return clean;
  }
}
