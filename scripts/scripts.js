import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
} from './aem.js';

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Turn a "hero teaser" default-content pattern into a hero-static block.
 *
 * WKND authors some sections (e.g. the homepage "Climbing New Zealand" promo)
 * as loose default content: a heading, a description paragraph, a lone CTA
 * link, and a lone image paragraph. The source renders this as a full-bleed
 * image with an overlapping white card. We detect that exact shape — an image
 * that is the only child of its own paragraph, immediately preceded by a
 * heading + text + a lone-link CTA — and wrap it into a `hero-static` block
 * ([image] row + [heading, text, cta] row).
 *
 * This is intentionally narrow so it only fires on that authored pattern and
 * never disturbs other content.
 * @param {Element} main The container element
 */
function buildHeroTeaserAutoBlocks(main) {
  main.querySelectorAll(':scope > div > div.default-content-wrapper').forEach((wrapper) => {
    // lone-image paragraphs (an image that is the only content of its <p>)
    const imageParagraphs = [...wrapper.querySelectorAll(':scope > p')].filter((p) => {
      const pic = p.querySelector('picture, img');
      return pic && p.textContent.trim() === '' && !p.querySelector('a');
    });
    // Only treat this as a single full-bleed hero when there is exactly ONE such
    // image in the wrapper (e.g. the homepage "Climbing New Zealand" promo). A
    // wrapper with several lone images is a multi-card layout (e.g. the magazine
    // "Members Only" teasers) and must NOT be collapsed into one hero.
    if (imageParagraphs.length !== 1) return;
    const imgP = imageParagraphs[0];

    // the heading that starts this teaser is the nearest heading before the image
    let heading = imgP.previousElementSibling;
    while (heading && !/^H[1-6]$/.test(heading.tagName)) {
      heading = heading.previousElementSibling;
    }
    if (!heading) return;

    // collect the card content: the heading and every sibling up to (not
    // including) the image — that's the title, description and CTA.
    const cardNodes = [];
    let node = heading;
    while (node && node !== imgP) {
      const next = node.nextElementSibling;
      cardNodes.push(node);
      node = next;
    }

    const block = buildBlock('hero-static', [
      [{ elems: [imgP.querySelector('picture, img').cloneNode(true)] }],
      [{ elems: cardNodes.map((n) => n.cloneNode(true)) }],
    ]);
    // auto-generated variant: the card is anchored to the image bottom so it
    // stays flush regardless of its own height (these teasers carry a CTA, so a
    // fixed negative margin would let the card hang below the image).
    block.classList.add('hero-static-teaser');

    // insert the block where the heading was, then remove the original nodes.
    // decorateBlocks (called next in decorateMain) will decorate/load it.
    heading.parentElement.insertBefore(block, heading);
    cardNodes.forEach((n) => n.remove());
    imgP.remove();
  });
}

/**
 * Turn a repeating "teaser card" default-content pattern into a cards grid.
 *
 * WKND authors the magazine "Members Only" promos as loose default content: a
 * pair of {heading, description, "Read More", image} runs. The source renders
 * them as a row of compact cards (title, description, CTA, then image below).
 * We detect two-or-more lone-image paragraphs in one wrapper — each preceded by
 * a heading — and group each run into a card inside a `members-cards` block.
 *
 * Narrow by design: only fires when there are >= 2 such image runs, so it never
 * touches single-hero sections (handled by buildHeroTeaserAutoBlocks) or normal
 * prose.
 * @param {Element} main The container element
 */
function buildMembersCardsAutoBlocks(main) {
  main.querySelectorAll(':scope > div > div.default-content-wrapper').forEach((wrapper) => {
    const imageParagraphs = [...wrapper.querySelectorAll(':scope > p')].filter((p) => {
      const pic = p.querySelector('picture, img');
      return pic && p.textContent.trim() === '' && !p.querySelector('a');
    });
    if (imageParagraphs.length < 2) return;

    // Build one card per image: the image plus the heading + siblings that
    // precede it (back to the previous image, exclusive).
    const cards = [];
    let boundary = null; // the previous image paragraph
    imageParagraphs.forEach((imgP) => {
      // nearest heading before this image (but after the previous image)
      let heading = imgP.previousElementSibling;
      while (heading && heading !== boundary && !/^H[1-6]$/.test(heading.tagName)) {
        heading = heading.previousElementSibling;
      }
      if (!heading || heading === boundary) { boundary = imgP; return; }

      // collect heading .. just-before-image (title, description, CTA)
      const bodyNodes = [];
      let node = heading;
      while (node && node !== imgP) { bodyNodes.push(node); node = node.nextElementSibling; }

      cards.push({
        img: imgP.querySelector('picture, img'),
        body: bodyNodes,
        anchorEl: heading,
        imgP,
      });
      boundary = imgP;
    });
    if (cards.length < 2) return;

    // Build a cards-style block: one row per card, each row = [image][body].
    const rows = cards.map((c) => [
      { elems: [c.img.cloneNode(true)] },
      { elems: c.body.map((n) => n.cloneNode(true)) },
    ]);
    const block = buildBlock('members-cards', rows);

    // insert before the first card's heading, then remove original nodes
    const first = cards[0].anchorEl;
    first.parentElement.insertBefore(block, first);
    cards.forEach((c) => { c.body.forEach((n) => n.remove()); c.imgP.remove(); });
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    const strong = a.closest('strong');
    const em = a.closest('em');

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else if (em) {
      a.classList.add('secondary');
      em.replaceWith(a);
    } else {
      // a lone link on its own line is a call-to-action button (WKND convention)
      a.classList.add('primary');
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  // hero-teaser + members-cards autoblocks run after sections exist (they
  // target .default-content-wrapper) and before decorateBlocks so the new
  // blocks are decorated/loaded.
  buildHeroTeaserAutoBlocks(main);
  buildMembersCardsAutoBlocks(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('body > header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('body > footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  import('./consent-check.js');
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
