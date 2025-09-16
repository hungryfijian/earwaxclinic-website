import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const scrapedDir = './src/data/scraped-content';
const files = fs.readdirSync(scrapedDir);

// Function to clean HTML content
function cleanHTML(htmlContent) {
  if (!htmlContent) return '';

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Remove script tags and their content
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove style attributes
  const elementsWithStyle = document.querySelectorAll('[style]');
  elementsWithStyle.forEach(el => el.removeAttribute('style'));

  // Remove class attributes that are Jimdo-specific
  const elementsWithClass = document.querySelectorAll('[class]');
  elementsWithClass.forEach(el => {
    const className = el.getAttribute('class');
    if (className && className.includes('cc-') || className.includes('j-') || className.includes('jtpl-')) {
      el.removeAttribute('class');
    }
  });

  // Remove id attributes that are Jimdo-specific
  const elementsWithId = document.querySelectorAll('[id]');
  elementsWithId.forEach(el => {
    const id = el.getAttribute('id');
    if (id && (id.includes('cc-') || id.includes('j-'))) {
      el.removeAttribute('id');
    }
  });

  // Remove empty divs and spans
  const emptyElements = document.querySelectorAll('div:empty, span:empty');
  emptyElements.forEach(el => el.remove());

  // Remove spacer divs
  const spacers = document.querySelectorAll('div[class*="spacer"], div[style*="height"]');
  spacers.forEach(spacer => spacer.remove());

  // Convert relative URLs to absolute
  const links = document.querySelectorAll('a[href^="/"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('/')) {
      // Keep relative paths as they'll work in Astro
      // Just ensure they end with / for consistency
      if (!href.endsWith('/') && !href.includes('.') && href !== '/') {
        link.setAttribute('href', href + '/');
      }
    }
  });

  return document.body.innerHTML;
}

// Process each scraped file
files.forEach(file => {
  if (!file.endsWith('.json')) return;

  const filePath = path.join(scrapedDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`Processing: ${file}`);
  console.log(`Title: ${data.title}`);
  console.log(`Description: ${data.description}`);

  // Clean the HTML content
  const cleanedContent = cleanHTML(data.rawContent);

  // Save processed data
  const processedData = {
    ...data,
    cleanedContent
  };

  fs.writeFileSync(filePath, JSON.stringify(processedData, null, 2));
  console.log(`✓ Cleaned: ${file}\n`);
});

console.log('Content processing complete!');