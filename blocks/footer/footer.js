import { decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL = ['facebook', 'twitter', 'instagram'];

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Pick the correct path up front to avoid a 404 in the console: the local
  // `aem up` preview serves under /content/, production (.aem.page/.live) does not.
  const underContent = window.location.pathname.startsWith('/content/');
  const primary = underContent ? '/content/footer' : '/footer';
  const fallback = underContent ? '/footer' : '/content/footer';
  let fragment = await loadFragment(primary);
  if (!fragment || !fragment.firstElementChild) {
    fragment = await loadFragment(fallback);
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // turn Facebook / Twitter / Instagram text links into icon links
  footer.querySelectorAll('a').forEach((a) => {
    const label = a.textContent.trim().toLowerCase();
    if (SOCIAL.includes(label)) {
      a.classList.add('footer-social-link');
      a.setAttribute('aria-label', a.textContent.trim());
      a.innerHTML = `<span class="icon icon-${label}"></span>`;
    }
  });

  decorateIcons(footer);
  block.append(footer);
}
