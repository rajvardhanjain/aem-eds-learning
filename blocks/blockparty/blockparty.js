import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Block Party Block
 *
 * A mosaic-style grid block for showcasing multiple content items.
 * Each row in the document table becomes a "party item" card.
 *
 * Document Table Structure:
 * | Image         |
 * | Title + Body  |
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  // Convert block rows to a semantic list
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'blockparty-item';

    while (row.firstElementChild) li.append(row.firstElementChild);

    // Classify each child div as image or body
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'blockparty-item-image';
      } else {
        div.className = 'blockparty-item-body';
      }
    });

    ul.append(li);
  });

  // Optimize all images for performance
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(ul);
}
