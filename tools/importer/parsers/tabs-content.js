/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-content
 * Base block: tabs
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html (.tabs.panelcontainer)
 * Generated: 2026-09-08
 *
 * Library convention (Tabs): 2 columns, first row is the block name.
 * Each subsequent row is one tab: [label | panel content].
 *
 * DOM contract expected by blocks/tabs-content/tabs-content.js:
 *   - block.children are rows; each row's firstElementChild is the tab label
 *     (its innerHTML becomes the tab button, then the label element is removed).
 *   - the remaining content of the row becomes that tab's panel.
 *   => 2-column layout, one row per tab: [label | panel content].
 *
 * Source structure (validated against source.html):
 *   ol.cmp-tabs__tablist > li.cmp-tabs__tab   (labels: Overview / Itinerary / What to Bring)
 *   div.cmp-tabs__tabpanel                      (panels, in document order)
 * Each panel wraps a .cmp-contentfragment with prose (p / b), inline images
 * (.cmp-image) and lists (ul/li), which are preserved as-is.
 */
export default function parse(element, { document }) {
  // Tab labels (validated: ol.cmp-tabs__tablist > li.cmp-tabs__tab)
  const tabLabels = Array.from(
    element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li'),
  );

  // Tab panels, in document order
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

    // Panel cell: preserve the panel's prose content (headings, paragraphs,
    // inline images, lists). Prefer the content fragment body if present,
    // otherwise fall back to the whole panel.
    const source = panel.querySelector('.cmp-contentfragment__elements') || panel;

    // Collect meaningful content nodes, skipping empty AEM grid scaffolding divs.
    const contentCell = [];
    source.querySelectorAll(':scope > *').forEach((node) => {
      // Skip empty layout wrappers (aem-Grid scaffolding with no real content)
      if (
        node.querySelector('.aem-Grid')
        && !node.textContent.trim()
        && !node.querySelector('img')
      ) {
        return;
      }
      contentCell.push(node);
    });

    // Fallback: if nothing survived filtering, keep the raw source content.
    const panelCell = contentCell.length ? contentCell : source;

    // One row per tab: [label | panel content]
    cells.push([labelCell, panelCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-content', cells });
  element.replaceWith(block);
}
