import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Contributor profile card (experience-fragment variant of writer-details).
 *
 * Unlike the horizontal magazine byline (blocks/writer-details), this variant
 * renders a vertically stacked, centered profile card used on the About Us page:
 * a circular avatar on top, the contributor name below it, then the role/title.
 * Cards are laid out in a responsive grid across the section.
 *
 * Content model: one row with two cells:
 *   1. the contributor avatar image
 *   2. the contributor name (first line) and role/title (following lines)
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'writer-details-xf-person';
    [...row.children].forEach((cell) => {
      if (cell.children.length === 1 && cell.querySelector('picture, img')) {
        cell.className = 'writer-details-xf-avatar';
      } else {
        cell.className = 'writer-details-xf-info';
        // First line = name, remaining lines = role/title.
        const lines = [...cell.children];
        if (lines[0]) lines[0].classList.add('writer-details-xf-name');
        lines.slice(1).forEach((el) => el.classList.add('writer-details-xf-role'));
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
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '328' }]);
    img.closest('picture').replaceWith(optimized);
  });
}
