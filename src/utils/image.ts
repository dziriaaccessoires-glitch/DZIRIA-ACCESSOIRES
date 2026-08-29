/**
 * Returns the product image path unchanged.
 *
 * Thumbnails are not used on this site (the "thumbs" folder was removed).
 * This function is kept so existing components (ProductCard, CartDrawer,
 * QuickOrderModal, PromotionsSection) don't need to be touched — it now
 * simply passes the original image path straight through.
 */
export function getThumbSrc(src: string): string {
  return src;
}
