/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 *
 * Removes non-authorable site chrome and leftover artifacts so the import
 * contains only page-level authorable content.
 *
 * All selectors verified against migration-work/cleaned.html:
 *  - <header class="experiencefragment cmp-experiencefragment--header">  (line 5)
 *      wraps sign-in buttons, language navigation, logo, main nav, and search
 *  - <footer class="experiencefragment cmp-experiencefragment--footer">  (line 471)
 *  - <iframe id="destination_publishing_iframe_wkndsite_0"> (Adobe ID sync)  (line 566)
 *  - <div id="toggleNav">  (mobile nav toggle button)  (line 568)
 *  - <div id="mobileNav" class="cmp-navigation--mobile">  (mobile nav)  (line 574)
 *  - stray empty <meta> tags nested inside cmp-image blocks  (lines 183, 204, 227, 271, 334, 378)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Mobile nav overlay/toggle and tracking iframe can interfere with parsing;
    // remove before block parsers run. Selectors from captured DOM.
    WebImporter.DOMUtils.remove(element, [
      '#toggleNav', // mobile nav toggle button (cleaned.html line 568)
      '#mobileNav', // mobile navigation overlay (cleaned.html line 574)
      'iframe', // Adobe ID syncing iframe (cleaned.html line 566)
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Selectors from captured DOM.
    WebImporter.DOMUtils.remove(element, [
      'header', // header experience fragment: sign-in, language nav, logo, main nav, search (line 5)
      'footer', // footer experience fragment (line 471)
      '.cmp-navigation--mobile', // any remaining mobile nav (line 574)
      'meta', // stray empty <meta> tags left inside image components
      'noscript',
    ]);
  }
}
