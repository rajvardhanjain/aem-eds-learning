/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: WKND "faqs" template — .accordion.panelcontainer > .cmp-accordion
 * with .cmp-accordion__item children (each: .cmp-accordion__title question +
 * .cmp-accordion__panel answer content).
 * Output: 2-column block, one row per Q&A: [question | answer].
 * Generated: 2026-09-08
 */
export default function parse(element, { document }) {
  // Each accordion item = one Q&A row
  const items = element.querySelectorAll('.cmp-accordion__item');

  const cells = [];

  items.forEach((item) => {
    // Question: the accordion title text
    const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__header, .cmp-accordion__button');
    const questionText = titleEl ? titleEl.textContent.trim() : '';
    if (!questionText) return;

    const question = document.createElement('p');
    question.textContent = questionText;

    // Answer: preserve the content elements (paragraphs, headings, lists, links)
    // from the panel. Prefer the inner rich-text container, fall back to the panel.
    const panel = item.querySelector('.cmp-accordion__panel');
    const answerCell = [];
    if (panel) {
      const source = panel.querySelector('.cmp-text') || panel;
      const contentNodes = source.querySelectorAll(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > ul, :scope > ol, :scope > table, :scope > blockquote');
      contentNodes.forEach((node) => {
        // Skip empty paragraphs/headings (e.g. non-breaking-space-only nodes)
        if (node.textContent.replace(/ /g, '').trim() === '' && !node.querySelector('img, a, iframe')) return;
        answerCell.push(node);
      });
      // Fallback: if no block-level content was found, use the panel's whole content
      if (answerCell.length === 0) {
        const clone = source.cloneNode(true);
        answerCell.push(clone);
      }
    }

    cells.push([question, answerCell]);
  });

  // Empty-block guard: nothing extractable
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
