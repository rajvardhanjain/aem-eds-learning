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

  // tools/importer/import-magazine.js
  var import_magazine_exports = {};
  __export(import_magazine_exports, {
    default: () => import_magazine_default
  });

  // tools/importer/parsers/writer-details.js
  function parse(element, { document }) {
    const avatar = element.querySelector(".cmp-byline__image img, .cmp-image__image, img");
    const name = element.querySelector(".cmp-byline__name, h1, h2, h3");
    const roles = Array.from(
      element.querySelectorAll(".cmp-byline__occupations, .cmp-byline__role")
    );
    if (!name && !avatar) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const infoCell = [];
    if (name) infoCell.push(name);
    roles.forEach((role) => infoCell.push(role));
    const cells = [];
    cells.push([avatar || "", infoCell.length ? infoCell : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "writer-details", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/social-links.js
  function parse2(element, { document }) {
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

  // tools/importer/import-magazine.js
  var parsers = {
    "writer-details": parse,
    "social-links": parse2
  };
  var PAGE_TEMPLATE = {
    name: "magazine",
    description: "WKND magazine article - lead image, prose body, writer/photographer card, social share links",
    urls: [
      "https://wknd.site/us/en/magazine/arctic-surfing.html",
      "https://wknd.site/us/en/magazine/guide-la-skateparks.html",
      "https://wknd.site/us/en/magazine/san-diego-surf.html",
      "https://wknd.site/us/en/magazine/ski-touring.html",
      "https://wknd.site/us/en/magazine/western-australia.html"
    ],
    blocks: [
      {
        name: "writer-details",
        instances: [".byline"]
      },
      {
        name: "social-links",
        instances: [".sharing"]
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
  var import_magazine_default = {
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
  return __toCommonJS(import_magazine_exports);
})();
