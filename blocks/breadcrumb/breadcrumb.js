/**
 * Breadcrumb Block
 *
 * Reads the current URL path and builds a semantic breadcrumb navigation.
 * Each path segment becomes a link, except the last segment (current page).
 *
 * Mental Model:
 *   URL: /en/products/shoes
 *   → Home > En > Products > Shoes (last item has no link)
 *
 * Official Docs:
 *   https://www.aem.live/developer/block-collection
 *   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
 */

/**
 * Converts a URL path segment into a human-readable label.
 * e.g. "my-product-page" → "My Product Page"
 *
 * @param {string} segment - raw URL segment
 * @returns {string} formatted label
 */
function formatLabel(segment) {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Builds an array of breadcrumb items from the current URL pathname.
 * Always starts with "Home" pointing to "/".
 *
 * @returns {Array<{label: string, href: string, current: boolean}>}
 */
function buildCrumbs() {
  const { pathname } = window.location;

  // Split on "/" and remove empty segments (handles leading/trailing slashes)
  const segments = pathname.split('/').filter((seg) => seg.length > 0);

  // Always include Home as the first crumb
  const crumbs = [{ label: 'Home', href: '/', current: false }];

  segments.forEach((seg, index) => {
    // Build the cumulative href for each segment
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;

    crumbs.push({
      label: formatLabel(seg),
      href,
      current: isLast,
    });
  });

  return crumbs;
}

/**
 * Decorate function — EDS block entry point.
 *
 * Best Practice: Replace the block's placeholder content entirely with
 * a semantic <nav><ol><li> structure for SEO and accessibility.
 *
 * @param {HTMLElement} block - the block element from the DOM
 */
export default function decorate(block) {
  const crumbs = buildCrumbs();

  // Build semantic breadcrumb nav
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');

  crumbs.forEach(({ label, href, current }) => {
    const li = document.createElement('li');

    if (current) {
      // Current page: no link, mark with aria-current for screen readers
      li.textContent = label;
      li.setAttribute('aria-current', 'page');
      li.classList.add('breadcrumb-current');
    } else {
      // Ancestor pages: render as clickable links
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.appendChild(a);
    }

    ol.appendChild(li);
  });

  nav.appendChild(ol);

  // Replace the block's original content with our breadcrumb nav
  block.replaceChildren(nav);
}
