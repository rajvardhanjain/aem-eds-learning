import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Teaser Block
 * Renders a promo/teaser card with image, headline, description, and CTA link.
 *
 * Document table structure (rows):
 *   Row 1: Image
 *   Row 2: Headline (heading element)
 *   Row 3: Description text
 *   Row 4: CTA link (anchor element)
 */
export default function decorate(block) {
  /* Build the teaser wrapper */
  const teaser = document.createElement('div');
  teaser.className = 'teaser-wrapper';

  const rows = [...block.children];

  /* Row 0 — Image */
  const imageRow = rows[0];
  if (imageRow) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'teaser-image';
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
        imageDiv.append(optimized);
      } else {
        imageDiv.append(picture);
      }
    }
    teaser.append(imageDiv);
  }

  /* Content wrapper — headline, description, CTA */
  const contentDiv = document.createElement('div');
  contentDiv.className = 'teaser-content';

  /* Row 1 — Headline */
  const headlineRow = rows[1];
  if (headlineRow) {
    const headlineDiv = document.createElement('div');
    headlineDiv.className = 'teaser-headline';
    headlineDiv.innerHTML = headlineRow.innerHTML;
    contentDiv.append(headlineDiv);
  }

  /* Row 2 — Description */
  const descRow = rows[2];
  if (descRow) {
    const descDiv = document.createElement('div');
    descDiv.className = 'teaser-description';
    descDiv.innerHTML = descRow.innerHTML;
    contentDiv.append(descDiv);
  }

  /* Row 3 — CTA link */
  const ctaRow = rows[3];
  if (ctaRow) {
    const ctaDiv = document.createElement('div');
    ctaDiv.className = 'teaser-cta';
    const anchor = ctaRow.querySelector('a');
    if (anchor) {
      anchor.classList.add('button', 'primary');
      ctaDiv.append(anchor);
    } else {
      ctaDiv.innerHTML = ctaRow.innerHTML;
    }
    contentDiv.append(ctaDiv);
  }

  teaser.append(contentDiv);

  /* Replace block content with structured teaser */
  block.replaceChildren(teaser);
}
