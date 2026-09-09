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

    // Heading hierarchy normalization (accessibility: no skipped heading levels).
    // WKND's source markup uses headings for non-structural labels, which breaks
    // the sequential heading order (h1 -> h4 byline, h5 "SHARE THIS STORY", and a
    // duplicate-of-title h3). Convert label headings to paragraphs and promote a
    // duplicate title so the document outline is monotonic. Rules are text-based
    // and safe across templates (only match these specific WKND patterns).
    const { document } = payload;
    const headings = [...element.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    const h1Text = (element.querySelector('h1')?.textContent || '').trim().toLowerCase();

    headings.forEach((h) => {
      const text = (h.textContent || '').trim();
      const isByline = /^by\s+\S/i.test(text); // e.g. "By Jacob Wester"
      const isShareLabel = /^share this story$/i.test(text);
      const isDuplicateTitle = h.tagName !== 'H1'
        && h1Text && text.toLowerCase() === h1Text;

      if (isByline || isShareLabel) {
        // Non-structural label: render as an emphasized paragraph, preserving text.
        const p = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = text;
        p.append(em);
        h.replaceWith(p);
      } else if (isDuplicateTitle) {
        // Redundant repeat of the page title: drop it (the h1 already conveys it).
        h.remove();
      }
    });
  }
}
