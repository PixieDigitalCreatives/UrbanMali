const path = require('node:path');
const { chromium } = require('playwright');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';
const ARTIFACT_DIR = path.resolve('public/images/playwright-artifacts');

(async () => {
  const fs = require('node:fs');
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  console.log(`\n========================================`);
  console.log(`🌿 STARTING URBANMAALI PLAYWRIGHT SUITE`);
  console.log(`🌐 Target: ${TARGET_URL}`);
  console.log(`========================================\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`⏳ ${name}... `);
      await fn();
      console.log(`✅ PASS`);
      passed++;
    } catch (err) {
      console.log(`❌ FAIL`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. Homepage & Title Test
    await test('Load Homepage and verify branding title', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(TARGET_URL);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      const title = await page.title();
      if (!title.includes('UrbanMaali') || !title.includes('Bring Nature Home')) {
        throw new Error(`Unexpected page title: "${title}"`);
      }
    });

    // 2. Pincode Verification in Hero
    await test('Check Pincode Availability in Hero (110001)', async () => {
      const pincodeInput = page.getByPlaceholder(/enter.*pincode/i).first();
      await pincodeInput.fill('110001');
      const checkBtn = page.getByRole('button', { name: /check/i }).first();
      await checkBtn.click();
      await page.waitForTimeout(800);
      const feedback = await page.locator('text=/serviceable|available|delhi/i').first();
      await feedback.waitFor({ timeout: 5000 });
    });

    // 3. Service Cards & Navigation
    await test('Navigate to Services Catalog & verify 6 services', async () => {
      await page.goto(`${TARGET_URL}/services`);
      const serviceCards = page.locator('a[href^="/services/"]');
      const count = await serviceCards.count();
      if (count < 6) {
        throw new Error(`Expected at least 6 services, found ${count}`);
      }
    });

    // 4. Service Detail Page
    await test('Open Garden Maintenance detail page and verify price & inclusions', async () => {
      await page.goto(`${TARGET_URL}/services/plant-maintenance`);
      await page.getByRole('heading', { name: /garden \/ plant maintenance/i }).waitFor();
      await page.locator('text=₹749').first().waitFor();
      await page.locator("text=/What's included/i").first().waitFor();
    });

    // 5. Shop & Product Detail Flow
    await test('Shop flow: Select Money Plant, choose size, and Add to Cart', async () => {
      await page.goto(`${TARGET_URL}/shop`);
      await page.getByText('Money Plant (Indoor)').first().click();
      await page.waitForURL('**/shop/money-plant');
      
      // Select Medium size chip
      const mediumChip = page.getByText(/medium/i).first();
      await mediumChip.click();

      // Click Add to Cart
      const addToCartBtn = page.getByRole('button', { name: /add to cart/i }).first();
      await addToCartBtn.click();
      
      // Verify Toast notification
      await page.locator('text=/added.*to cart/i').waitFor({ timeout: 5000 });
    });

    // 6. Cart Math & Quantity Stepper
    await test('Cart math: Verify quantity stepper and subtotal update', async () => {
      await page.goto(`${TARGET_URL}/cart`);
      await page.getByRole('heading', { name: 'Cart' }).waitFor();
      
      // Look for the first cart item row
      const firstItem = page.locator('.divide-y > div').first();
      await firstItem.waitFor();
      
      const priceTextBefore = await firstItem.locator('span.font-heading').innerText();
      const numBefore = parseInt(priceTextBefore.replace(/[^0-9]/g, ''), 10);

      // Increase quantity with plus button
      const plusBtn = firstItem.getByRole('button', { name: /increase quantity/i });
      await plusBtn.click();
      await page.waitForTimeout(600);

      // Verify updated total is greater
      const priceTextAfter = await firstItem.locator('span.font-heading').innerText();
      const numAfter = parseInt(priceTextAfter.replace(/[^0-9]/g, ''), 10);

      if (numAfter <= numBefore) {
        throw new Error(`Expected price to increase after clicking plus. Before: ${numBefore}, After: ${numAfter}`);
      }
    });

    // 7. Booking Flow (5 Steps)
    await test('Booking flow: Navigate to /book and select property type', async () => {
      await page.goto(`${TARGET_URL}/book`);
      await page.getByText(/step 1 of 5/i).waitFor();
      await page.getByRole('button', { name: /next step/i }).click();
      await page.getByText(/step 2 of 5/i).waitFor();
    });

    // 8. Capture Responsive Screenshots
    await test('Capture responsive audit screenshots (Desktop 1440px & Mobile 390px)', async () => {
      // Desktop
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(TARGET_URL);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e-desktop-home.png'), fullPage: false });

      // Mobile
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(TARGET_URL);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e-mobile-home.png'), fullPage: false });
    });

  } finally {
    await browser.close();
  }

  console.log(`\n========================================`);
  console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);
  
  if (failed > 0) {
    process.exit(1);
  }
})();
