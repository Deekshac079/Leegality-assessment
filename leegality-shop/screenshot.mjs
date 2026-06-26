import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'C:/Users/DELL/AppData/Local/Temp/claude/C--Users-DELL-Documents-Leegality-assessment/71632a77-7c00-4b11-9920-1f0be136ecf7/scratchpad/pdf-match';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

// 1. Full detail page — matches PDF layout
await page.goto('http://localhost:5173/product/1', { waitUntil: 'networkidle' });
await page.waitForSelector('h1', { timeout: 10000 });
await page.waitForTimeout(800);
await page.locator('article').screenshot({ path: `${OUT}/1-article.png` });

// 2. Product with multiple images — pagination visible
await page.goto('http://localhost:5173/product/6', { waitUntil: 'networkidle' });
await page.waitForSelector('h1', { timeout: 10000 });
await page.waitForTimeout(800);
await page.locator('article').screenshot({ path: `${OUT}/2-with-image-pagination.png` });

// 3. Right panel scrolled — reviews visible
await page.evaluate(() => {
  const right = document.querySelector('.scrollbar-hide');
  if (right) right.scrollTop = 400;
});
await page.waitForTimeout(300);
await page.locator('article').screenshot({ path: `${OUT}/3-scrolled-reviews.png` });

// 4. Full page viewport shot
await page.goto('http://localhost:5173/product/1', { waitUntil: 'networkidle' });
await page.waitForSelector('h1', { timeout: 10000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/4-full-page.png` });

await browser.close();
console.log('Done:', OUT);
