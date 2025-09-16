import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// URLs to scrape
const urls = [
  'https://www.earwaxclinic.co.uk/',
  'https://www.earwaxclinic.co.uk/about-ear-wax/',
  'https://www.earwaxclinic.co.uk/comprehensive-earwax-information/',
  'https://www.earwaxclinic.co.uk/treatments/',
  'https://www.earwaxclinic.co.uk/treatments/earwax-removal-service-provider-selection/',
  'https://www.earwaxclinic.co.uk/how-microsuction-works/',
  'https://www.earwaxclinic.co.uk/how-irrigation-works/',
  'https://www.earwaxclinic.co.uk/treatments/home-earwax-removal-kit/',
  'https://www.earwaxclinic.co.uk/ultimate-home-ear-wax-removal-guide/',
  'https://www.earwaxclinic.co.uk/ear-wax-removal-syringe-kit-faq/',
  'https://www.earwaxclinic.co.uk/home-syringe-kit-vs-professional-care/',
  'https://www.earwaxclinic.co.uk/do-ear-candles-work/',
  'https://www.earwaxclinic.co.uk/earwax-clinic-locations/',
  'https://www.earwaxclinic.co.uk/ear-wax-faq/',
  'https://www.earwaxclinic.co.uk/testimonials/',
  'https://www.earwaxclinic.co.uk/micro-suction-training/',
  'https://www.earwaxclinic.co.uk/professional-microsuction-training-earwax-removal/'
];

// Create output directory
const outputDir = './src/data/scraped-content';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to clean and extract content
function extractContent(dom) {
  const document = dom.window.document;

  // Extract title
  const titleElement = document.querySelector('title');
  const title = titleElement ? titleElement.textContent.trim() : '';

  // Extract meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  const description = metaDesc ? metaDesc.getAttribute('content').trim() : '';

  // Try different content selectors
  const contentSelectors = [
    '.jtpl-content',
    '.jtpl-section__inner',
    'main',
    '.content-area',
    '#content',
    '.main-content'
  ];

  let mainContent = null;
  for (const selector of contentSelectors) {
    mainContent = document.querySelector(selector);
    if (mainContent) break;
  }

  // If no specific content area found, try body but exclude nav/footer
  if (!mainContent) {
    mainContent = document.querySelector('body');
    if (mainContent) {
      // Remove navigation, header, footer elements
      const elementsToRemove = mainContent.querySelectorAll('nav, header, footer, .nav, .header, .footer, #nav, #header, #footer');
      elementsToRemove.forEach(el => el.remove());
    }
  }

  const rawContent = mainContent ? mainContent.innerHTML : '';
  const textContent = mainContent ? mainContent.textContent.trim() : '';

  return {
    title,
    description,
    rawContent,
    textContent
  };
}

// Function to create filename from URL
function createFilename(url) {
  const urlPath = new URL(url).pathname;
  let filename = urlPath === '/' ? 'home' : urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '_');
  return filename + '.json';
}

// Main scraping function
async function scrapeContent() {
  console.log(`Starting to scrape ${urls.length} URLs...`);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = createFilename(url);
    const filepath = path.join(outputDir, filename);

    try {
      console.log(`Scraping ${i + 1}/${urls.length}: ${url}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const content = extractContent(dom);

      const data = {
        url,
        scrapedAt: new Date().toISOString(),
        ...content
      };

      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      console.log(`✓ Saved: ${filename}`);

      // Delay between requests
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`✗ Error scraping ${url}:`, error.message);

      // Save error info
      const errorData = {
        url,
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
      fs.writeFileSync(filepath, JSON.stringify(errorData, null, 2));
    }
  }

  console.log('Scraping complete!');
}

// Run the scraper
scrapeContent().catch(console.error);