import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { runCapture } from './visual-baseline.mjs';

const BASELINE_DIR = path.resolve('tests/visual/baseline');
const CURRENT_DIR = path.resolve('tests/visual/current');
const DIFF_DIR = path.resolve('tests/visual/diff');
const REPORT_DIR = path.resolve('tests/visual/report');
const MAX_DIFF_THRESHOLD_PERCENT = 0.15; // Fail if diff > 0.15%

function readPng(filePath) {
  const fileData = fs.readFileSync(filePath);
  return PNG.sync.read(fileData);
}

function writePng(filePath, png) {
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
}

async function runDiff() {
  console.log(`\n========================================`);
  console.log(`🔍 STARTING VISUAL REGRESSION DIFF`);
  console.log(`⚖️  Threshold: ${MAX_DIFF_THRESHOLD_PERCENT}% max allowed difference`);
  console.log(`========================================\n`);

  fs.mkdirSync(CURRENT_DIR, { recursive: true });
  fs.mkdirSync(DIFF_DIR, { recursive: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  // If CURRENT_DIR is empty or if --capture flag is passed, capture current
  const shouldCapture = process.argv.includes('--capture') || fs.readdirSync(CURRENT_DIR).length === 0;
  if (shouldCapture) {
    console.log('Capturing current screenshots before comparing...');
    await runCapture(CURRENT_DIR);
  }

  const baselineFiles = fs.readdirSync(BASELINE_DIR).filter((f) => f.endsWith('.png'));
  if (baselineFiles.length === 0) {
    console.error(`❌ No baseline files found in ${BASELINE_DIR}. Run scripts/visual-baseline.mjs first!`);
    process.exit(1);
  }

  const results = [];
  let totalFailed = 0;
  let totalPassed = 0;

  for (const filename of baselineFiles) {
    const baselinePath = path.join(BASELINE_DIR, filename);
    const currentPath = path.join(CURRENT_DIR, filename);
    const diffPath = path.join(DIFF_DIR, filename);

    if (!fs.existsSync(currentPath)) {
      results.push({
        filename,
        diffPercent: 100,
        diffPixels: -1,
        totalPixels: -1,
        status: 'MISSING',
        error: 'Current screenshot does not exist',
      });
      totalFailed++;
      continue;
    }

    const baselinePng = readPng(baselinePath);
    const currentPng = readPng(currentPath);

    const maxWidth = Math.max(baselinePng.width, currentPng.width);
    const maxHeight = Math.max(baselinePng.height, currentPng.height);

    // Pad if dimensions differ
    let img1 = baselinePng;
    let img2 = currentPng;

    if (baselinePng.width !== currentPng.width || baselinePng.height !== currentPng.height) {
      // Create padded buffers
      img1 = new PNG({ width: maxWidth, height: maxHeight });
      PNG.bitblt(baselinePng, img1, 0, 0, baselinePng.width, baselinePng.height, 0, 0);

      img2 = new PNG({ width: maxWidth, height: maxHeight });
      PNG.bitblt(currentPng, img2, 0, 0, currentPng.width, currentPng.height, 0, 0);
    }

    const diffPng = new PNG({ width: maxWidth, height: maxHeight });
    const diffPixels = pixelmatch(
      img1.data,
      img2.data,
      diffPng.data,
      maxWidth,
      maxHeight,
      { threshold: 0.1, diffColor: [220, 38, 38] }
    );

    writePng(diffPath, diffPng);

    const totalPixels = maxWidth * maxHeight;
    const diffPercent = parseFloat(((diffPixels / totalPixels) * 100).toFixed(4));
    const passed = diffPercent <= MAX_DIFF_THRESHOLD_PERCENT;

    if (passed) {
      totalPassed++;
    } else {
      totalFailed++;
    }

    results.push({
      filename,
      diffPercent,
      diffPixels,
      totalPixels,
      status: passed ? 'PASS' : 'FAIL',
      baselinePath,
      currentPath,
      diffPath,
    });

    const statusIcon = passed ? '✅' : '❌';
    console.log(`${statusIcon} ${filename.padEnd(45)} Diff: ${diffPercent}% (${diffPixels}px) [${passed ? 'PASS' : 'FAIL'}]`);
  }

  // Generate HTML Report
  const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UrbanMaali Visual Parity Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; background: #FAF5EA; color: #2B2118; }
    h1 { margin-bottom: 8px; color: #3F5B34; font-family: Georgia, serif; }
    .summary { display: flex; gap: 16px; margin-bottom: 24px; }
    .metric { background: #FFFFFF; border: 1px solid #E6D8BD; border-radius: 12px; padding: 16px 24px; box-shadow: 0 4px 12px rgba(43,33,24,0.04); }
    .metric .val { font-size: 28px; font-weight: bold; }
    .metric .lbl { font-size: 13px; color: #8B6B4A; text-transform: uppercase; letter-spacing: 0.5px; }
    .pass { color: #3F5B34; }
    .fail { color: #A4432F; }
    table { width: 100%; border-collapse: collapse; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E6D8BD; margin-top: 16px; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #E6D8BD; font-size: 14px; }
    th { background: #F4ECDD; color: #5A4330; font-weight: 600; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 999px; font-weight: 600; font-size: 12px; }
    .badge-pass { background: #DDE7CF; color: #3F5B34; }
    .badge-fail { background: #F3D5D0; color: #A4432F; }
    .card-list { display: flex; flex-direction: column; gap: 24px; margin-top: 32px; }
    .diff-card { background: #FFFFFF; border: 1px solid #E6D8BD; border-radius: 16px; padding: 20px; box-shadow: 0 6px 18px rgba(43,33,24,0.06); }
    .diff-card h3 { margin-top: 0; display: flex; justify-content: space-between; align-items: center; }
    .images-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 12px; }
    .images-grid div { display: flex; flex-direction: column; align-items: center; }
    .images-grid img { width: 100%; border: 1px solid #E6D8BD; border-radius: 8px; background: #F4ECDD; }
    .img-label { font-size: 12px; font-weight: 600; color: #8B6B4A; margin-bottom: 6px; }
  </style>
</head>
<body>
  <h1>🌿 UrbanMaali Visual Parity Report</h1>
  <p>Baseline TSX+Tailwind vs Migrated JSX+SCSS. Tolerance: <strong>${MAX_DIFF_THRESHOLD_PERCENT}%</strong>.</p>
  
  <div class="summary">
    <div class="metric">
      <div class="val ${totalFailed === 0 ? 'pass' : 'fail'}">${totalFailed === 0 ? 'PASSED' : 'FAILED'}</div>
      <div class="lbl">Suite Status</div>
    </div>
    <div class="metric">
      <div class="val pass">${totalPassed}</div>
      <div class="lbl">Matches (≤ ${MAX_DIFF_THRESHOLD_PERCENT}%)</div>
    </div>
    <div class="metric">
      <div class="val ${totalFailed > 0 ? 'fail' : ''}">${totalFailed}</div>
      <div class="lbl">Mismatches</div>
    </div>
    <div class="metric">
      <div class="val">${results.length}</div>
      <div class="lbl">Total Screenshots</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Screenshot Name</th>
        <th>Diff %</th>
        <th>Diff Pixels</th>
        <th>Total Pixels</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${results
        .map(
          (r) => `
        <tr>
          <td><strong>${r.filename}</strong></td>
          <td style="font-weight: 600; color: ${r.diffPercent <= MAX_DIFF_THRESHOLD_PERCENT ? '#3F5B34' : '#A4432F'}">${r.diffPercent}%</td>
          <td>${r.diffPixels}</td>
          <td>${r.totalPixels}</td>
          <td><span class="badge ${r.status === 'PASS' ? 'badge-pass' : 'badge-fail'}">${r.status}</span></td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="card-list">
    <h2>Detailed Side-by-Side Comparisons</h2>
    ${results
      .filter((r) => r.diffPercent > 0)
      .slice(0, 40)
      .map(
        (r) => `
      <div class="diff-card">
        <h3>
          <span>${r.filename}</span>
          <span class="badge ${r.status === 'PASS' ? 'badge-pass' : 'badge-fail'}">${r.status} (${r.diffPercent}%)</span>
        </h3>
        <div class="images-grid">
          <div>
            <div class="img-label">BASELINE</div>
            <img src="../../tests/visual/baseline/${r.filename}" alt="Baseline">
          </div>
          <div>
            <div class="img-label">CURRENT</div>
            <img src="../../tests/visual/current/${r.filename}" alt="Current">
          </div>
          <div>
            <div class="img-label">DIFF</div>
            <img src="../../tests/visual/diff/${r.filename}" alt="Diff">
          </div>
        </div>
      </div>`
      )
      .join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(REPORT_DIR, 'index.html'), reportHtml);
  console.log(`\n📊 Side-by-side HTML report generated at ${path.join(REPORT_DIR, 'index.html')}`);

  if (totalFailed > 0) {
    console.error(`\n❌ PARITY GATE FAILED: ${totalFailed} screenshot(s) exceeded the ${MAX_DIFF_THRESHOLD_PERCENT}% tolerance.\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ PARITY GATE PASSED: All ${totalPassed} screenshots match within ${MAX_DIFF_THRESHOLD_PERCENT}% tolerance!\n`);
  }
}

if (process.argv[1]?.endsWith('visual-diff.mjs')) {
  runDiff().catch((err) => {
    console.error('Visual diff error:', err);
    process.exit(1);
  });
}

export { runDiff };
