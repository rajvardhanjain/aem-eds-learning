/**
 * Embed Block
 *
 * Supports YouTube and Twitter/X embeds.
 * Uses IntersectionObserver for lazy loading — iframes only load when visible.
 *
 * Best practice: Never load iframes eagerly. Lazy loading improves page
 * performance by deferring network requests until the user actually scrolls
 * to the embed.
 *
 * Author table structure (Google Docs):
 * | Embed                              |
 * | https://www.youtube.com/watch?v=ID |
 */

/**
 * Extracts the YouTube video ID from a YouTube URL.
 * Handles both youtube.com/watch?v=ID and youtu.be/ID formats.
 * @param {string} url - The YouTube URL
 * @returns {string|null} The video ID or null if not a YouTube URL
 */
function getYouTubeId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Checks if a URL is a Twitter/X URL.
 * @param {string} url - The URL to check
 * @returns {boolean} True if it's a Twitter/X URL
 */
function isTwitterUrl(url) {
  return /twitter\.com|x\.com/.test(url);
}

/**
 * Creates a YouTube embed iframe wrapper.
 * The iframe is created with allow attributes for modern browser security.
 * @param {string} videoId - The YouTube video ID
 * @returns {HTMLElement} A div containing the responsive iframe
 */
function createYouTubeEmbed(videoId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'embed-youtube';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.title = 'YouTube video player';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';

  wrapper.append(iframe);
  return wrapper;
}

/**
 * Creates a Twitter/X embed.
 * Loads the Twitter widget script once and creates a blockquote for the tweet.
 * @param {string} url - The Twitter/X tweet URL
 * @returns {HTMLElement} A div containing the tweet blockquote
 */
function createTwitterEmbed(url) {
  const wrapper = document.createElement('div');
  wrapper.className = 'embed-twitter';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'twitter-tweet';

  const anchor = document.createElement('a');
  anchor.href = url;
  blockquote.append(anchor);
  wrapper.append(blockquote);

  // Load the Twitter widget script only once
  if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.append(script);
  } else if (window.twttr && window.twttr.widgets) {
    // If script already loaded, re-render widgets
    window.twttr.widgets.load(wrapper);
  }

  return wrapper;
}

/**
 * Loads the embed content into the block.
 * Called by IntersectionObserver when the block enters the viewport.
 * @param {HTMLElement} block - The embed block element
 * @param {string} url - The URL to embed
 */
function loadEmbed(block, url) {
  // Prevent double-loading
  if (block.classList.contains('embed-loaded')) return;
  block.classList.add('embed-loaded');

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    block.replaceChildren(createYouTubeEmbed(youtubeId));
    return;
  }

  if (isTwitterUrl(url)) {
    block.replaceChildren(createTwitterEmbed(url));
    return;
  }

  // Fallback: render as a generic iframe for unsupported URLs
  const wrapper = document.createElement('div');
  wrapper.className = 'embed-generic';
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.loading = 'lazy';
  wrapper.append(iframe);
  block.replaceChildren(wrapper);
}

/**
 * Main decorate function — EDS block contract.
 *
 * Reads the URL from the block's first cell, then sets up an
 * IntersectionObserver to lazy-load the embed only when it's
 * near the viewport (rootMargin: '200px' pre-loads slightly early).
 *
 * Anti-pattern: Don't load iframes synchronously inside decorate().
 * That would block rendering for all embeds, even ones below the fold.
 *
 * @param {HTMLElement} block - The embed block element decorated by EDS
 */
export default function decorate(block) {
  // Extract the URL from the first cell of the first row
  const link = block.querySelector('a');
  const url = link ? link.href : block.querySelector('div > div')?.textContent?.trim();

  if (!url) return;

  // Clear the raw authored content — we'll replace it when the user scrolls near
  block.textContent = '';
  block.classList.add('embed-placeholder');

  /**
   * IntersectionObserver: fires loadEmbed only when the block
   * is within 200px of the viewport. This defers iframe creation
   * until it's actually needed, improving Time To Interactive (TTI).
   */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadEmbed(block, url);
        observer.unobserve(block);
      }
    });
  }, { rootMargin: '200px' });

  observer.observe(block);
}
