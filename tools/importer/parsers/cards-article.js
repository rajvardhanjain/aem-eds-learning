/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article
 * Base block: cards
 * Source: https://wknd.site/us/en.html (.image-list.list)
 * Generated: 2026-09-08
 *
 * Library structure: 2 columns, first row is block name.
 * Each subsequent row is one card: [image | title, description].
 */
export default function parse(element, { document }) {
  // Each card is a list item (validated against source.html)
  const items = Array.from(element.querySelectorAll('.cmp-image-list__item, li'))
    .filter((el) => el.matches('.cmp-image-list__item') || el.tagName === 'LI');

  const cells = [];

  items.forEach((item) => {
    // Image (mandatory) - first cell
    const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image img, img');

    // Title link (preserve the linked title)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');
    const description = item.querySelector('.cmp-image-list__item-description');

    const contentCell = [];

    // Build a heading that preserves the title link when present
    if (titleText) {
      const heading = document.createElement('h3');
      if (titleLink) {
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.textContent = titleText.textContent.trim();
        heading.append(link);
      } else {
        heading.textContent = titleText.textContent.trim();
      }
      contentCell.push(heading);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }

    // Only add a row if the card has an image (mandatory per library)
    if (image) {
      cells.push([image, contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
