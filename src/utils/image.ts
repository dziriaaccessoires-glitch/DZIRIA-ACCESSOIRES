/**
 * Maps a full-resolution product image path (e.g. "images/foo.jpeg")
 * to its small, pre-generated WebP thumbnail (e.g. "images/thumbs/foo.webp").
 *
 * Use this everywhere a product photo is shown SMALL: grid cards, cart
 * lines, quick-order preview, promotions grid. Never use it for the
 * Lightbox / full-screen zoom view, which needs the full-resolution file.
 */
export function getThumbSrc(src: string): string {
  if (!src) return src;
  const match = src.match(/^(.*\/)?([^/]+)\.[a-zA-Z0-9]+$/);
  if (!match) return src;
  const [, dir = '', base] = match;
  return `${dir}thumbs/${base}.webp`;
}
