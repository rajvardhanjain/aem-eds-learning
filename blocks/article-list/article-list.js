import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Article List — dynamically lists articles from a query index.
 *
 * Content model (all rows optional):
 *   Row 1: index path   e.g. "/us/en/magazine/query-index.json"
 *   Row 2: limit         e.g. "4" (max number of articles to show)
 *
 * The list is driven by the live query index, so publishing a new article
 * makes it appear here with no code change.
 */

const DEFAULT_INDEX = '/us/en/magazine/query-index.json';

async function fetchArticles(indexPath) {
  try {
    const resp = await fetch(indexPath);
    if (!resp.ok) return [];
    const json = await resp.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (e) {
    return [];
  }
}

function buildCard(article) {
  const li = document.createElement('li');

  const path = article.path || '#';

  // image
  if (article.image) {
    const imgDiv = document.createElement('div');
    imgDiv.className = 'article-list-card-image';
    const link = document.createElement('a');
    link.href = path;
    const pic = createOptimizedPicture(article.image, article.title || '', false, [{ width: '750' }]);
    link.append(pic);
    imgDiv.append(link);
    li.append(imgDiv);
  }

  // body
  const body = document.createElement('div');
  body.className = 'article-list-card-body';

  const h3 = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = path;
  titleLink.textContent = article.title || path;
  h3.append(titleLink);
  body.append(h3);

  if (article.description) {
    const p = document.createElement('p');
    p.textContent = article.description;
    body.append(p);
  }

  li.append(body);
  return li;
}

export default async function decorate(block) {
  // read optional config from the block rows
  const rows = [...block.children];
  const indexPath = (rows[0]?.textContent || '').trim() || DEFAULT_INDEX;
  const limitText = (rows[1]?.textContent || '').trim();
  const limit = limitText ? parseInt(limitText, 10) : 0;

  block.textContent = '';

  let articles = await fetchArticles(indexPath);

  // newest first when a lastModified timestamp is present
  articles.sort((a, b) => Number(b.lastModified || 0) - Number(a.lastModified || 0));

  if (limit > 0) articles = articles.slice(0, limit);

  const ul = document.createElement('ul');
  if (articles.length === 0) {
    const li = document.createElement('li');
    li.className = 'article-list-empty';
    li.textContent = 'No articles found.';
    ul.append(li);
  } else {
    articles.forEach((article) => ul.append(buildCard(article)));
  }
  block.append(ul);
}
