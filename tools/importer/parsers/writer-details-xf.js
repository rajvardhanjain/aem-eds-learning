/* eslint-disable */
/* global WebImporter */
/**
 * Parser for writer-details-xf.
 * Base block: writer-details (reuses blocks/writer-details/writer-details.js).
 * Source: https://wknd.site/us/en/about-us.html
 * Source element: .experiencefragment.cmp-experience-fragment--contributor
 *
 * Emits a "writer-details" block. The block is invoked once per contributor
 * card element, so this parser handles the single element passed in and emits
 * one two-cell row:
 *   cell 1: the contributor avatar image (picture/img)
 *   cell 2: name (first line) + role/title (remaining lines)
 *
 * The existing writer-details decorate() treats the first element of cell 2 as
 * the name and every following element as role/title, so the social icon
 * buttons are intentionally omitted (they would otherwise be flattened into
 * role lines and break the contract).
 */
export default function parse(element, { document }) {
  // Avatar image — validated against source: img.cmp-image__image inside .cmp-image
  const avatar = element.querySelector('.cmp-image__image, .cmp-image img, img');

  // Titles — source has two .cmp-title__text nodes: [0] name, [1] role/title.
  const titles = Array.from(element.querySelectorAll('.cmp-title__text, .cmp-title h1, .cmp-title h2, .cmp-title h3, .cmp-title h4, .cmp-title h5, .cmp-title h6'));
  const name = titles[0] || null;
  const roleLines = titles.slice(1);

  // Empty-block guard: without a name there is nothing meaningful to emit.
  if (!name && !avatar) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build cell 2: name first, then any role/title lines.
  const infoCell = [];
  if (name) infoCell.push(name);
  roleLines.forEach((line) => infoCell.push(line));

  const cells = [];
  cells.push([avatar || '', infoCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'writer-details-xf', cells });
  element.replaceWith(block);
}
