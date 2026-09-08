export default function decorate(block) {
  const rows = [...block.children];
  const imageDiv = rows[0];
  const titleDiv = rows[1];
  const colorDiv = rows[2];

  // EDS always adds both 'banner' and 'block' classes to every block element,
  // so we cannot use classList.length > 1 to detect a named variant.
  // Instead, check if any class OTHER than 'banner' and 'block' is present
  // (e.g. 'dark' in "Banner (dark)").
  const ignoredClasses = new Set(['banner', 'block']);
  const isVariant = [...block.classList].some((c) => !ignoredClasses.has(c));
  if (!isVariant) {
    const bgColor = colorDiv ? colorDiv.textContent.trim() : 'blue';
    block.style.backgroundColor = bgColor;
  }

  if (colorDiv) colorDiv.remove();

  if (imageDiv) imageDiv.className = 'banner-image';
  if (titleDiv) titleDiv.className = 'banner-title';
}
