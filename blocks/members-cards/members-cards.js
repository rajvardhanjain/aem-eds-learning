import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * members-cards — a row of compact teaser cards (WKND "Members Only" promos).
 * Each block row is [image cell][body cell]; render as <ul><li> with the body
 * (title, description, CTA) above the image, matching the source layout.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];
    const imageCell = cells.find((c) => c.querySelector('picture, img'));
    const bodyCell = cells.find((c) => c !== imageCell);

    if (bodyCell) {
      bodyCell.classList.add('members-cards-card-body');
      li.append(bodyCell);
    }
    if (imageCell) {
      imageCell.classList.add('members-cards-card-image');
      li.append(imageCell);
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(ul);
}
