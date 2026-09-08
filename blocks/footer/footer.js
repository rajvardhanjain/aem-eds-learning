import { decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL = ['facebook', 'twitter', 'instagram'];

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment — /content first (localhost + aem up), then root (DA/EDS prod)
  let fragment = await loadFragment('/content/footer');
  if (!fragment || !fragment.firstElementChild) {
    fragment = await loadFragment('/footer');
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
