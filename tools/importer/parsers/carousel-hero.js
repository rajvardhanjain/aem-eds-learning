/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero
 * Base block: carousel
 * Source: https://wknd.site/us/en.html (.carousel.panelcontainer.cmp-carousel--hero)
 * Generated: 2026-09-08
 *
 * Library structure: 2 columns, first row is block name.
 * Each subsequent row is one slide: [image | title, description, CTA].
 */
export default function parse(element, { document }) {
  // Each slide is a carousel item (validated against source.html)
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item, .cmp-teaser--hero'))
    // If both selectors match nested nodes, keep only the outermost item wrappers
    .filter((el) => el.classList.contains('cmp-carousel__item'));

  // Fallback: if the item wrapper class is absent, use the teaser directly
  const slideEls = slides.length
    ? slides
    : Array.from(element.querySelectorAll('.cmp-teaser--hero'));

  const cells = [];

  slideEls.forEach((slide) => {
    // Image (mandatory) - first cell
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image img, img');

    // Text content (optional) - second cell
    const title = slide.querySelector('.cmp-teaser__title, h1, h2, h3');
    const description = slide.querySelector('.cmp-teaser__description, p');
    const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a');

    const contentCell = [];
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    // Only add a row if the slide has an image (mandatory per library)
    if (image) {
      cells.push([image, contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
