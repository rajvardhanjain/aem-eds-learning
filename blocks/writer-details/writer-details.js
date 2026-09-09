import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Writer / photographer details block.
 * Content model: one row per contributor. Each row has two cells:
 *   1. the contributor avatar image
 *   2. the contributor name (first line) and role/title (following lines)
 * Renders a compact author card: circular avatar + name + role.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'writer-details-person';
    [...row.children].forEach((cell) => {
      if (cell.children.length === 1 && cell.querySelector('picture, img')) {
        cell.className = 'writer-details-avatar';
      } else {
        cell.className = 'writer-details-info';
        // First line = name, remaining lines = role/title.
        const lines = [...cell.children];
        if (lines[0]) lines[0].classList.add('writer-details-name');
        lines.slice(1).forEach((el) => el.classList.add('writer-details-role'));
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    // Only re-optimize same-origin (EDS-hosted) images. External absolute URLs
    // (e.g. migrated DAM assets) do not support EDS optimization query params,
    // so the authored <picture> is left untouched to avoid broken requests.
    const isExternal = /^https?:\/\//.test(img.getAttribute('src') || '')
      && new URL(img.src, window.location.href).origin !== window.location.origin;
    if (isExternal) return;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimized);
  });
}
