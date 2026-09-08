/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured
 * Base block: columns
 * Source: https://wknd.site/us/en.html (.teaser.cmp-teaser--featured)
 * Generated: 2026-09-08
 *
 * Library structure: multiple columns, first row is block name.
 * Content is a side-by-side layout -> one row, 2 columns:
 *   [image | eyebrow, heading, description, CTA]
 */
export default function parse(element, { document }) {
  // Image column (validated against source.html)
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');

  // Text content column
  const eyebrow = element.querySelector('.cmp-teaser__pretitle');
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  // Exclude the pretitle <p> so the fallback does not re-select the eyebrow
  const description = element.querySelector('.cmp-teaser__description, p:not(.cmp-teaser__pretitle)');
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a');

  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  // Empty-block guard
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // One row, 2 columns: image | text content
  cells.push([image || '', contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
