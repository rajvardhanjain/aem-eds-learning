/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-filter
 * Base block: tabs
 * Source: https://wknd.site/us/en/adventures.html (.tabs.panelcontainer)
 * Generated: 2026-09-08
 *
 * Library convention: 2 columns, one row per tab [label | content].
 * Category filter tab bar (All / Climbing / Cycling / Skiing / Surfing / Travel).
 * Each tab has a panel that embeds a 16-item adventure card grid
 * (.image-list.list -> cmp-image-list).
 *
 * DOM contract expected by blocks/tabs-filter/tabs-filter.js:
 *   - block.children are rows; each row's firstElementChild is the tab label
 *     (its innerHTML becomes the tab button; the label element is then removed).
 *   - the remaining content in the row becomes that tab's panel.
 * => 2-column layout, one row per tab: [label | panel content].
 *
 * The panel content is emitted as a nested `cards-article` block table so the
 * cards-article decoration renders the adventure grid inside each panel.
 */
export default function parse(element, { document }) {
  // Tab labels (validated against source: ol.cmp-tabs__tablist > li.cmp-tabs__tab)
  const tabLabels = Array.from(
    element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li'),
  );

  // Tab panels, in document order (each contains one .image-list card grid)
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Empty-block guard
  if (!tabLabels.length || !panels.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  panels.forEach((panel, i) => {
    const label = tabLabels[i];
    const labelText = label ? label.textContent.trim() : `Tab ${i + 1}`;

    // Label cell: text carrying the tab label
    const labelCell = document.createElement('p');
    labelCell.textContent = labelText;

    // Build the nested cards-article block for this panel's card grid.
    const cardCells = [];
    const items = Array.from(panel.querySelectorAll('.cmp-image-list__item, li.cmp-image-list__item'));

    items.forEach((item) => {
      const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image img, img');
      const titleLink = item.querySelector('.cmp-image-list__item-title-link');
      const titleText = item.querySelector('.cmp-image-list__item-title');
      const description = item.querySelector('.cmp-image-list__item-description');

      const contentCell = [];
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

      if (image) {
        cardCells.push([image, contentCell.length ? contentCell : '']);
      }
    });

    // Panel cell contents: the nested cards-article block (if the panel has cards)
    let panelCell;
    if (cardCells.length) {
      panelCell = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells: cardCells });
    } else {
      // Fallback: keep the raw panel content
      panelCell = panel;
    }

    // One row per tab: [label | panel content]
    cells.push([labelCell, panelCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-filter', cells });
  element.replaceWith(block);
}
