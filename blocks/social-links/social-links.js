/**
 * Social links block.
 * Content model: one row per social link. Each row has one or two cells:
 *   - a link (the platform URL), whose text is the platform name (e.g. "Facebook")
 *   - optionally a leading cell naming the platform / holding an icon
 * Renders a horizontal row of labelled social icon links. The platform name is
 * lowercased into a modifier class so global icon styling can target it.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'social-links-list';

  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const label = (link?.textContent || row.textContent || '').trim();
    const platform = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const li = document.createElement('li');
    li.className = 'social-links-item';
    if (platform) li.classList.add(`social-links-item--${platform}`);

    if (link) {
      link.className = 'social-links-link';
      link.setAttribute('aria-label', label || platform);
      if (link.getAttribute('href')?.startsWith('http')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
      li.append(link);
    } else {
      li.textContent = label;
    }
    ul.append(li);
  });

  block.replaceChildren(ul);
}
