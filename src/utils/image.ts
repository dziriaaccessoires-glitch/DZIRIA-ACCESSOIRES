/**
 * Maps a full-resolution product image path (e.g. "images/foo.jpeg")
 * to its small pre-generated thumbnail in the "thumbs" subfolder
 * (e.g. "images/thumbs/foo.jpeg") — same filename, same extension,
 * just placed inside the "thumbs" folder.
 *
 * Use this everywhere a product photo is shown SMALL: grid cards, cart
 * lines, quick-order preview, promotions grid. Never use it for the
 * Lightbox / full-screen zoom view, which needs the full-resolution file.
 */
export function getThumbSrc(src: string): string {
  if (!src) return src;
  const match = src.match(/^(.*\/)?([^/]+)$/);
  if (!match) return src;
  const [, dir = '', filename] = match;
  return `${dir}thumbs/${filename}`;
}
