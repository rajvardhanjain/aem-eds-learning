/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-static
 * Base block: hero
 * Source: https://wknd.site/us/en/adventures.html (.teaser.cmp-teaser--hero)
 * Generated: 2026-09-08
 *
 * Library convention (authoritative): 1 column.
 *   Row 1: block name (added by createBlock)
 *   Row 2: Background image (optional)
 *   Row 3: Title (heading), Subheading (paragraph), optional CTA
 * This static hero variant has an image + heading + paragraph, no CTA.
 * hero-static's decorate() checks `:scope > div:first-child picture` to toggle
 * the `no-image` class, so the image must be the first content row.
 */
export default function parse(element, { document }) {
  // Background image. Source: .cmp-teaser__image .cmp-image img
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');

  // Heading. Source: <h2 class="cmp-teaser__title">
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, [class*="title"]');

  // Description paragraph. Source: .cmp-teaser__description > p
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description, p');

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);

  // Empty-block guard
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 1-column block: each row has exactly one cell.
  const cells = [];
  if (image) cells.push([image]);              // Row 2: background image
  if (contentCell.length) cells.push([contentCell]); // Row 3: heading + paragraph

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-static', cells });
  element.replaceWith(block);
}
