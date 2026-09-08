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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item, .cmp-teaser--hero")).filter((el) => el.classList.contains("cmp-carousel__item"));
    const slideEls = slides.length ? slides : Array.from(element.querySelectorAll(".cmp-teaser--hero"));
    const cells = [];
    slideEls.forEach((slide) => {
      const image = slide.querySelector(".cmp-teaser__image img, .cmp-image img, img");
      const title = slide.querySelector(".cmp-teaser__title, h1, h2, h3");
      const description = slide.querySelector(".cmp-teaser__description, p");
      const cta = slide.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a");
      const contentCell = [];
      if (title) contentCell.push(title);
      if (description) contentCell.push(description);
      if (cta) contentCell.push(cta);
      if (image) {
        cells.push([image, contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const eyebrow = element.querySelector(".cmp-teaser__pretitle");
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const description = element.querySelector(".cmp-teaser__description, p:not(.cmp-teaser__pretitle)");
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a");
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([image || "", contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-image-list__item, li")).filter((el) => el.matches(".cmp-image-list__item") || el.tagName === "LI");
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector(".cmp-image-list__item-image img, .cmp-image img, img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link");
      const titleText = item.querySelector(".cmp-image-list__item-title");
      const description = item.querySelector(".cmp-image-list__item-description");
      const contentCell = [];
      if (titleText) {
        const heading = document.createElement("h3");
        if (titleLink) {
          const link = document.createElement("a");
          link.href = titleLink.getAttribute("href");
          link.textContent = titleText.textContent.trim();
          heading.append(link);
        } else {
          heading.textContent = titleText.textContent.trim();
        }
        contentCell.push(heading);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.push(p);
      }
      if (image) {
        cells.push([image, contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
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

  // tools/importer/import-home.js
  var parsers = {
    "carousel-hero": parse,
    "columns-featured": parse2,
    "cards-article": parse3
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND home page - hero carousel, featured article, article/adventure card grids",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".carousel.panelcontainer.cmp-carousel--hero"]
      },
      {
        name: "columns-featured",
        instances: [".teaser.cmp-teaser--featured"]
      },
      {
        name: "cards-article",
        instances: [".image-list.list"]
      }
    ],
    sections: [
      {
        id: "section-2-featured",
        name: "Featured Article",
        selector: [".teaser.cmp-teaser--featured"],
        style: "grey",
        blocks: ["columns-featured"],
        defaultContent: []
      }
    ]
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
  var import_home_default = {
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
  return __toCommonJS(import_home_exports);
})();
