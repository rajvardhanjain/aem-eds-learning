/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-details
 * Base block: columns
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html (.contentfragment.cmp-contentfragment--elements)
 * Generated: 2026-09-08
 *
 * Library convention (Columns): first row is the block name, subsequent rows
 * contain the same number of columns. Here the block renders an activity
 * spec/details list: each spec is a row of [label | value].
 *
 * DOM contract expected by blocks/columns-details/columns-details.js:
 *   - block.children are rows; each row's children are the columns.
 *   - a 2-column layout ([label | value]) yields columns-details-2-cols.
 *
 * Source structure (validated against source.html):
 *   .cmp-contentfragment__elements > .cmp-contentfragment__element
 *     > dt.cmp-contentfragment__element-title  (label)
 *     > dd.cmp-contentfragment__element-value  (value)
 */
export default function parse(element, { document }) {
  // Each spec item (validated against source.html)
  const items = Array.from(element.querySelectorAll('.cmp-contentfragment__element'));

  const cells = [];

  items.forEach((item) => {
    const labelEl = item.querySelector('.cmp-contentfragment__element-title, dt');
    const valueEl = item.querySelector('.cmp-contentfragment__element-value, dd');

    const label = labelEl ? labelEl.textContent.trim() : '';
    const value = valueEl ? valueEl.textContent.trim() : '';

    // Skip fully empty specs
    if (!label && !value) return;

    const labelCell = document.createElement('p');
    labelCell.textContent = label;

    const valueCell = document.createElement('p');
    valueCell.textContent = value;

    // One row per spec: [label | value]
    cells.push([labelCell, valueCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-details', cells });
  element.replaceWith(block);
}
