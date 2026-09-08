import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the Hero block.
 * Expected block structure (from Google Doc table):
 * Row 1: Background image (picture element)
 * Row 2: Heading / title text
 *
 * The CSS positions the picture as a full-bleed background (position: absolute, z-index: -1)
 * and overlays the heading on top.
 *
 * @param {HTMLElement} block - The hero block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: background image
  const pictureRow = rows[0];
  // Row 1: heading content
  const headingRow = rows[1];

  // Optimize the picture element for performance
  const picture = pictureRow && pictureRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Replace with optimized picture — full-width hero, eager load (above the fold)
      picture.replaceWith(
        createOptimizedPicture(img.src, img.alt, true, [
          { media: '(min-width: 900px)', width: '1440' },
          { width: '750' },
        ]),
      );
    }
  }

  // Rebuild block: picture first (background), then heading
  const newPicture = pictureRow && pictureRow.querySelector('picture');
  block.innerHTML = '';

  if (newPicture) {
    block.append(newPicture);
  }

  if (headingRow) {
    // Promote inner div content directly into the block
    while (headingRow.firstElementChild) {
      block.append(headingRow.firstElementChild);
    }
  }
}
