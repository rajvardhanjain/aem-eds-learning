/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import writerDetailsXfParser from './parsers/writer-details-xf.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'writer-details-xf': writerDetailsXfParser,
  'columns-featured': columnsFeaturedParser,
  'cards-article': cardsArticleParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
// This template spans two structurally-related pages: about-us (contributor
// profile cards) and the magazine landing (featured teaser + article grid).
// Selectors only match on their respective page; the other page simply warns.
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'WKND about-us (contributor profile cards) + magazine landing (featured teaser + article card grid)',
  urls: [
    'https://wknd.site/us/en/about-us.html',
    'https://wknd.site/us/en/magazine.html',
  ],
  blocks: [
    {
      name: 'writer-details-xf',
      instances: ['.experiencefragment.cmp-experience-fragment--contributor'],
    },
    {
      name: 'columns-featured',
      instances: ['.teaser.cmp-teaser--featured'],
    },
    {
      name: 'cards-article',
      instances: ['.image-list.list'],
    },
  ],
  sections: [],
};

// TRANSFORMER REGISTRY
const transformers = [
  wkndCleanupTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
