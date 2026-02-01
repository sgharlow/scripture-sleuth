const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generateIcon() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  const svgPath = path.join(assetsDir, 'subreddit-icon.svg');
  const pngPath = path.join(assetsDir, 'subreddit-icon.png');
  const png2xPath = path.join(assetsDir, 'subreddit-icon@2x.png');

  // Read SVG
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  const browser = await chromium.launch();

  // Generate 256x256 PNG
  const page256 = await browser.newPage();
  await page256.setViewportSize({ width: 256, height: 256 });
  await page256.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body { width: 256px; height: 256px; overflow: hidden; }
        svg { width: 256px; height: 256px; }
      </style>
    </head>
    <body>${svgContent}</body>
    </html>
  `);
  await page256.screenshot({ path: pngPath, omitBackground: false });

  const stats = fs.statSync(pngPath);
  console.log(`Icon saved to: ${pngPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);

  // Generate 512x512 PNG for retina
  const page512 = await browser.newPage();
  await page512.setViewportSize({ width: 512, height: 512 });
  await page512.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body { width: 512px; height: 512px; overflow: hidden; }
        svg { width: 512px; height: 512px; }
      </style>
    </head>
    <body>${svgContent.replace('width="256"', 'width="512"').replace('height="256"', 'height="512"')}</body>
    </html>
  `);
  await page512.screenshot({ path: png2xPath, omitBackground: false });

  const stats2x = fs.statSync(png2xPath);
  console.log(`Retina icon saved to: ${png2xPath}`);
  console.log(`File size: ${(stats2x.size / 1024).toFixed(2)} KB`);

  await browser.close();
}

generateIcon().catch(console.error);
