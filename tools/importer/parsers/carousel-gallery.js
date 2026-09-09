/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-gallery
 * Base block: carousel
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html (.carousel.panelcontainer.cmp-carousel--mini)
 * Generated: 2026-09-08
 *
 * Library convention (Carousel): 2 columns, first row is the block name.
 * Each subsequent row is one slide:
 *   - cell 1: image (mandatory)
 *   - cell 2: optional text content (title/caption)
 *
 * DOM contract expected by blocks/carousel-gallery/carousel-gallery.js:
 *   - block.children are rows; each row becomes a slide.
 *   - first column of the row is the slide image, second column is slide content.
 *
 * Source is a "mini" lead-image gallery: each .cmp-carousel__item is one slide
 * containing a .cmp-image image. Slides here carry no visible title, so the
 * caption cell is emitted empty but kept to preserve the 2-column structure.
 */
export default function parse(element, { document }) {
  // Each slide is a carousel item (validated against source.html)
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));

  const cells = [];

  slides.forEach((slide) => {
    // Image (mandatory) - first cell
    const image = slide.querySelector('.cmp-image__image, .cmp-image img, img');

    // Text content (optional) - second cell.
    // Prefer an authored heading/caption; fall back to the image title attribute.
    const title = slide.querySelector('.cmp-image__title, figcaption, h1, h2, h3, h4, h5, h6');

    const contentCell = [];
    if (title) {
      contentCell.push(title);
    } else if (image && image.getAttribute('title')) {
      const caption = document.createElement('p');
      caption.textContent = image.getAttribute('title').trim();
      contentCell.push(caption);
    }

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-gallery', cells });
  element.replaceWith(block);
}
