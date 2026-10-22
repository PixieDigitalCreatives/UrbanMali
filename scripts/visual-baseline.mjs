import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const BASELINE_DIR = path.resolve('tests/visual/baseline');

const VIEWPORTS = [
  { name: '360', width: 360, height: 780 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
];

fs.mkdirSync(BASELINE_DIR, { recursive: true });

const MOCK_CART_ITEMS = [
  {
    id: 'money-plant-Medium',
    productId: 'money-plant',
    name: 'Money Plant (Indoor)',
    subtitle: 'Epipremnum aureum — lush trailing foliage',
    price: 299,
    image: '/images/product-money-plant.jpg',
    size: 'Medium',
    quantity: 2,
  },
  {
    id: 'ceramic-planter-Medium',
    productId: 'ceramic-planter',
    name: 'Ceramic Planter (Fluted Tan)',
    subtitle: 'Minimalist glazed ceramic with drainage tray',
    price: 499,
    image: '/images/product-ceramic-planter.jpg',
    size: 'Medium',
    quantity: 1,
  },
];

const MOCK_ORDER = {
  orderId: 'UMO-2610-0001',
  items: MOCK_CART_ITEMS,
  subtotal: 1097,
  deliveryFee: 0,
  total: 1097,
  customerName: 'Priya Sharma',
  phone: '9876543210',
  email: 'priya@example.com',
  address: 'Flat 402, Green Glen Layout, Bellandur',
  pincode: '110001',
  paymentMethod: 'UPI',
  paymentStatus: 'paid',
  createdAt: '2026-10-17T12:00:00.000Z',
};

async function preparePage(page) {
  // Inject CSS to disable animations and freeze timers for pixel-deterministic screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-play-state: paused !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });

  // Wait for fonts and complete image rendering
  await page.evaluate(async () => {
    if (document.fonts) {
      await document.fonts.ready;
    }
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  });
  await page.waitForTimeout(150);
}

async function captureState(page, stateName, viewport, outDir = BASELINE_DIR) {
  await preparePage(page);
  const filename = `${stateName}-${viewport.name}.png`;
  const filePath = path.join(outDir, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`  ✓ Captured ${filename}`);
}

function getChromiumExecutablePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Local');
  const msPlaywright = path.join(localAppData, 'ms-playwright');
  if (fs.existsSync(msPlaywright)) {
    const folders = fs.readdirSync(msPlaywright).filter((f) => f.startsWith('chromium-'));
    // Sort descending to get newest
    folders.sort().reverse();
    for (const folder of folders) {
      const candidates = [
        path.join(msPlaywright, folder, 'chrome-win64', 'chrome.exe'),
        path.join(msPlaywright, folder, 'chrome-win', 'chrome.exe'),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          return cand;
        }
      }
    }
  }
  return undefined;
}

async function runCapture(outDir = BASELINE_DIR) {
  console.log(`\n========================================`);
  console.log(`📸 CAPTURING VISUAL SNAPSHOTS`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`📁 Destination: ${outDir}`);
  console.log(`========================================\n`);

  fs.mkdirSync(outDir, { recursive: true });

  const executablePath = getChromiumExecutablePath();
  if (executablePath) {
    console.log(`Using Chromium executable: ${executablePath}`);
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    });

    // Seed deterministic local storage
    await context.addInitScript(({ cart, order }) => {
      window.localStorage.setItem('cart_items', JSON.stringify(cart));
      window.localStorage.setItem('last_order', JSON.stringify(order));
      // Freeze Date & random seeds if needed
      const fixedTime = new Date('2026-10-17T12:00:00Z').getTime();
      Date.now = () => fixedTime;
    }, { cart: MOCK_CART_ITEMS, order: MOCK_ORDER });

    const page = await context.newPage();

    // 1. Home
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await captureState(page, 'home', vp, outDir);

    // 2. Services
    await page.goto(`${BASE_URL}/services`, { waitUntil: 'networkidle' });
    await captureState(page, 'services', vp, outDir);

    // 3. Service details (all 6 slugs)
    const serviceSlugs = [
      'plant-maintenance',
      'maintenance-addon',
      'nursery-delivery',
      'balcony-makeover',
      'irrigation-setup',
      'society-office-maintenance',
    ];
    for (const slug of serviceSlugs) {
      await page.goto(`${BASE_URL}/services/${slug}`, { waitUntil: 'networkidle' });
      await captureState(page, `service-${slug}`, vp, outDir);
    }

    // 4. Plans
    await page.goto(`${BASE_URL}/plans`, { waitUntil: 'networkidle' });
    await captureState(page, 'plans', vp, outDir);

    // 5. Area Check
    await page.goto(`${BASE_URL}/check-area`, { waitUntil: 'networkidle' });
    await captureState(page, 'check-area-default', vp, outDir);

    // Serviceable check
    try {
      const pinInput = page.locator('input').first();
      await pinInput.fill('201308');
      const verifyBtn = page.getByRole('button', { name: /verify pincode/i });
      if (await verifyBtn.isVisible({ timeout: 2000 })) {
        await verifyBtn.click();
        await page.waitForTimeout(300);
        await captureState(page, 'check-area-serviceable', vp, outDir);
      }
    } catch (e) {
      console.warn('Area check serviceable note:', e.message);
    }

    // Unserviceable check
    try {
      const pinInput = page.locator('input').first();
      await pinInput.fill('999999');
      const verifyBtn = page.getByRole('button', { name: /verify pincode/i });
      if (await verifyBtn.isVisible({ timeout: 2000 })) {
        await verifyBtn.click();
        await page.waitForTimeout(300);
        await captureState(page, 'check-area-unserviceable', vp, outDir);
      }
    } catch (e) {
      console.warn('Area check unserviceable note:', e.message);
    }

    // 6. Booking steps 1 to 5 + success
    await page.goto(`${BASE_URL}/book`, { waitUntil: 'networkidle' });
    await captureState(page, 'book-step-1', vp, outDir);

    try {
      // Step 1 -> Step 2
      const btn1 = page.locator('button:has-text("Continue"), button:has-text("Next")').last();
      if (await btn1.isVisible({ timeout: 2000 })) {
        await btn1.click();
        await page.waitForTimeout(200);
        await captureState(page, 'book-step-2', vp, outDir);

        // Fill Step 2 requirements
        const addr = page.locator('textarea, input[placeholder*="flat" i], input[placeholder*="address" i]').first();
        if (await addr.isVisible({ timeout: 1500 })) {
          await addr.fill('Flat 402, Green Glen Layout, Bellandur');
        }
        const pin = page.locator('input[placeholder*="pincode" i], input[maxLength="6"]').first();
        if (await pin.isVisible({ timeout: 1500 })) {
          await pin.fill('110001');
        }

        // Step 2 -> Step 3
        const btn2 = page.locator('button:has-text("Continue"), button:has-text("Next")').last();
        if (await btn2.isVisible({ timeout: 2000 })) {
          await btn2.click();
          await page.waitForTimeout(200);
          await captureState(page, 'book-step-3', vp, outDir);

          // Step 3 -> Step 4
          const btn3 = page.locator('button:has-text("Continue"), button:has-text("Next")').last();
          if (await btn3.isVisible({ timeout: 2000 })) {
            await btn3.click();
            await page.waitForTimeout(200);
            await captureState(page, 'book-step-4', vp, outDir);

            // Fill Step 4 Contact Details
            const nameField = page.locator('input[placeholder*="name" i]').first();
            if (await nameField.isVisible({ timeout: 1500 })) await nameField.fill('Priya Sharma');
            const phoneField = page.locator('input[placeholder*="phone" i], input[type="tel"]').first();
            if (await phoneField.isVisible({ timeout: 1500 })) await phoneField.fill('9876543210');

            // Step 4 -> Step 5
            const btn4 = page.locator('button:has-text("Review"), button:has-text("Continue"), button:has-text("Next")').last();
            if (await btn4.isVisible({ timeout: 2000 })) {
              await btn4.click();
              await page.waitForTimeout(200);
              await captureState(page, 'book-step-5', vp, outDir);

              // Step 5 -> Submit
              const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Request")').last();
              if (await confirmBtn.isVisible({ timeout: 2000 })) {
                await confirmBtn.click();
                await page.waitForTimeout(600);
                await captureState(page, 'book-success', vp, outDir);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Booking wizard traversal note:', e.message);
    }

    // 7. Shop
    await page.goto(`${BASE_URL}/shop`, { waitUntil: 'networkidle' });
    await captureState(page, 'shop', vp, outDir);

    // Filter active on shop
    try {
      const indoorChip = page.locator('button, [role="button"]').filter({ hasText: /^Indoor$/i }).first();
      if (await indoorChip.isVisible()) {
        await indoorChip.click();
        await page.waitForTimeout(200);
        await captureState(page, 'shop-filtered-indoor', vp, outDir);
      }
    } catch (e) {
      console.warn('Shop filter warning:', e.message);
    }

    // 8. Product details
    await page.goto(`${BASE_URL}/shop/money-plant`, { waitUntil: 'networkidle' });
    await captureState(page, 'product-money-plant', vp, outDir);

    await page.goto(`${BASE_URL}/shop/snake-plant`, { waitUntil: 'networkidle' });
    await captureState(page, 'product-snake-plant', vp, outDir);

    // 9. Cart with items
    await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
    await captureState(page, 'cart-with-items', vp, outDir);

    // 10. Empty Cart
    await page.evaluate(() => {
      window.localStorage.removeItem('cart_items');
      window.dispatchEvent(new Event('storage'));
    });
    await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
    await captureState(page, 'cart-empty', vp, outDir);

    // Restore cart items for checkout
    await page.evaluate((items) => {
      window.localStorage.setItem('cart_items', JSON.stringify(items));
      window.dispatchEvent(new Event('storage'));
    }, MOCK_CART_ITEMS);

    // 11. Checkout
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle' });
    await captureState(page, 'checkout', vp, outDir);

    // Form error state on checkout
    try {
      const checkoutSubmit = page.getByRole('button', { name: /proceed|place order|pay/i }).first();
      if (await checkoutSubmit.isVisible()) {
        await checkoutSubmit.click();
        await page.waitForTimeout(200);
        await captureState(page, 'checkout-error-state', vp, outDir);
      }
    } catch (e) {
      console.warn('Checkout error state warning:', e.message);
    }

    // Demo payment sheet
    try {
      // Fill checkout form
      const nameInp = page.locator('input[placeholder*="name" i]').first();
      if (await nameInp.isVisible()) await nameInp.fill('Priya Sharma');
      const phoneInp = page.locator('input[placeholder*="phone" i], input[type="tel"]').first();
      if (await phoneInp.isVisible()) await phoneInp.fill('9876543210');
      const addrInp = page.locator('textarea, input[placeholder*="address" i]').first();
      if (await addrInp.isVisible()) await addrInp.fill('Flat 402, Green Glen Layout, Bellandur');

      const payBtn = page.getByRole('button', { name: /proceed to pay|place order/i }).first();
      if (await payBtn.isVisible()) {
        await payBtn.click();
        await page.waitForTimeout(300);
        await captureState(page, 'checkout-payment-modal', vp, outDir);
      }
    } catch (e) {
      console.warn('Payment sheet warning:', e.message);
    }

    // 12. Order confirmation
    await page.goto(`${BASE_URL}/orders/UMO-2610-0001`, { waitUntil: 'networkidle' });
    await captureState(page, 'order-confirmation', vp, outDir);

    // 13. Coming soon
    await page.goto(`${BASE_URL}/portfolio`, { waitUntil: 'networkidle' });
    await captureState(page, 'coming-soon', vp, outDir);

    // 14. 404
    await page.goto(`${BASE_URL}/non-existent-page-404`, { waitUntil: 'networkidle' });
    await captureState(page, 'not-found-404', vp, outDir);

    // 15. Design system
    await page.goto(`${BASE_URL}/design-system`, { waitUntil: 'networkidle' });
    await captureState(page, 'design-system', vp, outDir);

    // 16. Mobile menu open (on mobile viewports)
    if (vp.width <= 768) {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
      try {
        const menuBtn = page.locator('button[aria-label*="menu" i], button:has(svg.lucide-menu)').first();
        if (await menuBtn.isVisible()) {
          await menuBtn.click();
          await page.waitForTimeout(300);
          await captureState(page, 'mobile-menu-open', vp, outDir);
        }
      } catch (e) {
        console.warn('Mobile menu warning:', e.message);
      }
    }

    // 17. Quote modal open
    await page.goto(`${BASE_URL}/plans`, { waitUntil: 'networkidle' });
    try {
      const quoteBtn = page.getByRole('button', { name: /custom quote|society/i }).first();
      if (await quoteBtn.isVisible()) {
        await quoteBtn.click();
        await page.waitForTimeout(300);
        await captureState(page, 'quote-modal-open', vp, outDir);
      }
    } catch (e) {
      console.warn('Quote modal warning:', e.message);
    }

    await context.close();
  }

  await browser.close();
  console.log(`\n🎉 Visual snapshots complete in ${outDir}\n`);
}

// When run directly as a script
if (process.argv[1]?.endsWith('visual-baseline.mjs')) {
  runCapture(BASELINE_DIR).catch((err) => {
    console.error('Visual baseline error:', err);
    process.exit(1);
  });
}

export { runCapture };
