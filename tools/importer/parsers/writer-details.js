/* eslint-disable */
/* global WebImporter */
/**
 * Parser for writer-details.
 * Base: cards.
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html (.byline)
 * Generated: 2026-09-08
 *
 * Content model (matches blocks/writer-details/writer-details.js):
 *   One row per contributor with two cells:
 *     1. the contributor avatar image (single picture/img child)
 *     2. the contributor name (first line) followed by role/title line(s)
 */
export default function parse(element, { document }) {
  // Avatar image: .cmp-byline__image holds a .cmp-image > img
  const avatar = element.querySelector('.cmp-byline__image img, .cmp-image__image, img');

  // Name: primary heading of the byline
  const name = element.querySelector('.cmp-byline__name, h1, h2, h3');

  // Role / occupations: one or more lines describing the contributor
  const roles = Array.from(
    element.querySelectorAll('.cmp-byline__occupations, .cmp-byline__role'),
  );

  // Empty-block guard: without a name there is no meaningful contributor card.
  if (!name && !avatar) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Info cell: first element is the name, remaining elements are role/title.
  const infoCell = [];
  if (name) infoCell.push(name);
  roles.forEach((role) => infoCell.push(role));

  const cells = [];
  // Two-column row: [avatar | name + role]. Pad with '' if either side is missing.
  cells.push([avatar || '', infoCell.length ? infoCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'writer-details', cells });
  element.replaceWith(block);
}
