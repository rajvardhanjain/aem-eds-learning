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

  // tools/importer/import-adventures-2.js
  var import_adventures_2_exports = {};
  __export(import_adventures_2_exports, {
    default: () => import_adventures_2_default
  });

  // tools/importer/parsers/hero-static.js
  function parse(element, { document }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const heading = element.querySelector('.cmp-teaser__title, h1, h2, [class*="title"]');
    const description = element.querySelector(".cmp-teaser__description p, .cmp-teaser__description, p");
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-static", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-filter.js
  function parse2(element, { document }) {
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
      const cardCells = [];
      const items = Array.from(panel.querySelectorAll(".cmp-image-list__item, li.cmp-image-list__item"));
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
          cardCells.push([image, contentCell.length ? contentCell : ""]);
        }
      });
      let panelCell;
      if (cardCells.length) {
        panelCell = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells: cardCells });
      } else {
        panelCell = panel;
      }
      cells.push([labelCell, panelCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-filter", cells });
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

  // tools/importer/import-adventures-2.js
  var parsers = {
    "hero-static": parse,
    "tabs-filter": parse2,
    "cards-article": parse3
  };
  var PAGE_TEMPLATE = {
    name: "adventures-2",
    description: "WKND Adventures landing - static hero, filterable adventure list (tabs) with nested card grids",
    urls: [
      "https://wknd.site/us/en/adventures.html"
    ],
    blocks: [
      {
        name: "hero-static",
        instances: [".teaser.cmp-teaser--hero"]
      },
      {
        name: "tabs-filter",
        instances: [".tabs.panelcontainer"]
      },
      {
        name: "cards-article",
        instances: [".image-list.list"]
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
  var import_adventures_2_default = {
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
      const order = { "hero-static": 0, "tabs-filter": 1, "cards-article": 2 };
      const sorted = [...pageBlocks].sort((a, b) => {
        var _a, _b;
        return ((_a = order[a.name]) != null ? _a : 9) - ((_b = order[b.name]) != null ? _b : 9);
      });
      sorted.forEach((block) => {
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
  return __toCommonJS(import_adventures_2_exports);
})();
