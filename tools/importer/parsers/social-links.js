/* eslint-disable */
/* global WebImporter */
/**
 * Parser for social-links.
 * Base: columns.
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html (.sharing)
 * Generated: 2026-09-08
 *
 * Content model (matches blocks/social-links/social-links.js):
 *   One row per social link. Each row has a single cell holding a link whose
 *   text is the platform name (e.g. "Facebook"). The platform href is preserved
 *   where present; source anchors are frequently empty, so labels are derived
 *   from the platform and hrefs are carried over only when available.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Ordered platform detection. Each entry finds a source node and yields a
  // labelled anchor. Source markup uses share widgets/empty anchors, so we
  // synthesize a labelled anchor and preserve the href where the source has one.
  const platforms = [
    {
      label: 'Facebook',
      // Facebook uses a JS share widget (.fb-share-button) with no real href.
      node: element.querySelector('.fb-share-button, a[href*="facebook.com"]'),
    },
    {
      label: 'Pinterest',
      node: element.querySelector('a[href*="pinterest."], a[href*="pinterest.com"]'),
    },
    {
      label: 'Twitter',
      node: element.querySelector('a[href*="twitter.com"], a[href*="x.com"], .twitter-share-button'),
    },
    {
      label: 'LinkedIn',
      node: element.querySelector('a[href*="linkedin.com"]'),
    },
    {
      label: 'Email',
      node: element.querySelector('a[href^="mailto:"]'),
    },
  ];

  platforms.forEach(({ label, node }) => {
    if (!node) return;

    // Preserve href only when the source node is an anchor with a real href.
    const href = node.tagName === 'A' ? node.getAttribute('href') : null;

    const link = document.createElement('a');
    link.textContent = label;
    if (href) link.setAttribute('href', href);

    // One-column row: a single cell holding the platform link.
    cells.push([link]);
  });

  // Empty-block guard: no recognizable social platforms in the source.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'social-links', cells });
  element.replaceWith(block);
}
