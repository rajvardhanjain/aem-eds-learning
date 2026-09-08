/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-adventures.js
  var import_adventures_exports = {};
  __export(import_adventures_exports, {
    default: () => import_adventures_default
  });

  // tools/importer/parsers/carousel-gallery.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".cmp-image__image, .cmp-image img, img");
      const title = slide.querySelector(".cmp-image__title, figcaption, h1, h2, h3, h4, h5, h6");
      const contentCell = [];
      if (title) {
        contentCell.push(title);
      } else if (image && image.getAttribute("title")) {
        const caption = document.createElement("p");
        caption.textContent = image.getAttribute("title").trim();
        contentCell.push(caption);
      }
      if (image) {
        cells.push([image, contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-details.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-contentfragment__element"));
    const cells = [];
    items.forEach((item) => {
      const labelEl = item.querySelector(".cmp-contentfragment__element-title, dt");
      const valueEl = item.querySelector(".cmp-contentfragment__element-value, dd");
      const label = labelEl ? labelEl.textContent.trim() : "";
      const value = valueEl ? valueEl.textContent.trim() : "";
      if (!label && !value) return;
      const labelCell = document.createElement("p");
      labelCell.textContent = label;
      const valueCell = document.createElement("p");
      valueCell.textContent = value;
      cells.push([labelCell, valueCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-details", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/social-links.js
  function parse3(element, { document }) {
    const cells = [];
    const platforms = [
      {
        label: "Facebook",
        // Facebook uses a JS share widget (.fb-share-button) with no real href.
        node: element.querySelector('.fb-share-button, a[href*="facebook.com"]')
      },
      {
        label: "Pinterest",
        node: element.querySelector('a[href*="pinterest."], a[href*="pinterest.com"]')
      },
      {
        label: "Twitter",
        node: element.querySelector('a[href*="twitter.com"], a[href*="x.com"], .twitter-share-button')
      },
      {
        label: "LinkedIn",
        node: element.querySelector('a[href*="linkedin.com"]')
      },
      {
        label: "Email",
        node: element.querySelector('a[href^="mailto:"]')
      }
    ];
    platforms.forEach(({ label, node }) => {
      if (!node) return;
      const href = node.tagName === "A" ? node.getAttribute("href") : null;
      const link = document.createElement("a");
      link.textContent = label;
      if (href) link.setAttribute("href", href);
      cells.push([link]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "social-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-content.js
  function parse4(element, { document }) {
    const tabLabels = Array.from(
      element.querySelectorAll(".cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li")
    );
    const panels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    if (!tabLabels.length || !panels.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panels.forEach((panel, i) => {
      const label = tabLabels[i];
      const labelText = label ? label.textContent.trim() : `Tab ${i + 1}`;
      const labelCell = document.createElement("p");
      labelCell.textContent = labelText;
      const source = panel.querySelector(".cmp-contentfragment__elements") || panel;
      const contentCell = [];
      source.querySelectorAll(":scope > *").forEach((node) => {
        if (node.querySelector(".aem-Grid") && !node.textContent.trim() && !node.querySelector("img")) {
          return;
        }
        contentCell.push(node);
      });
      const panelCell = contentCell.length ? contentCell : source;
      cells.push([labelCell, panelCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-content", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#toggleNav",
        // mobile nav toggle button (cleaned.html line 568)
        "#mobileNav",
        // mobile navigation overlay (cleaned.html line 574)
        "iframe"
        // Adobe ID syncing iframe (cleaned.html line 566)
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        // header experience fragment: sign-in, language nav, logo, main nav, search (line 5)
        "footer",
        // footer experience fragment (line 471)
        ".cmp-navigation--mobile",
        // any remaining mobile nav (line 574)
        "meta",
        // stray empty <meta> tags left inside image components
        "noscript"
      ]);
    }
  }

  // tools/importer/import-adventures.js
  var parsers = {
    "carousel-gallery": parse,
    "columns-details": parse2,
    "social-links": parse3,
    "tabs-content": parse4
  };
  var PAGE_TEMPLATE = {
    name: "adventures",
    description: "WKND adventure detail - lead image gallery, activity spec list, social share, tabbed content",
    urls: [
      "https://wknd.site/us/en/adventures/bali-surf-camp.html",
      "https://wknd.site/us/en/adventures/beervana-portland.html",
      "https://wknd.site/us/en/adventures/climbing-new-zealand.html",
      "https://wknd.site/us/en/adventures/colorado-rock-climbing.html",
      "https://wknd.site/us/en/adventures/cycling-southern-utah.html",
      "https://wknd.site/us/en/adventures/cycling-tuscany.html",
      "https://wknd.site/us/en/adventures/downhill-skiing-wyoming.html",
      "https://wknd.site/us/en/adventures/gastronomic-marais-tour.html",
      "https://wknd.site/us/en/adventures/napa-wine-tasting.html",
      "https://wknd.site/us/en/adventures/riverside-camping-australia.html",
      "https://wknd.site/us/en/adventures/ski-touring-mont-blanc.html",
      "https://wknd.site/us/en/adventures/surf-camp-costa-rica.html",
      "https://wknd.site/us/en/adventures/tahoe-skiing.html",
      "https://wknd.site/us/en/adventures/west-coast-cycling.html",
      "https://wknd.site/us/en/adventures/whistler-mountain-biking.html",
      "https://wknd.site/us/en/adventures/yosemite-backpacking.html"
    ],
    blocks: [
      {
        name: "carousel-gallery",
        instances: [".carousel.panelcontainer.cmp-carousel--mini"]
      },
      {
        name: "columns-details",
        instances: [".contentfragment.cmp-contentfragment--elements"]
      },
      {
        name: "social-links",
        instances: [".sharing"]
      },
      {
        name: "tabs-content",
        instances: [".tabs.panelcontainer"]
      }
    ],
    sections: []
  };
  var transformers = [
    transform
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventures_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_adventures_exports);
})();
