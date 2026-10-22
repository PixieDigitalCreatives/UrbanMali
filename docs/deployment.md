# GitHub Actions Deployment Guide

This document explains how **The UrbanMaali** frontend is deployed automatically using GitHub Actions and GitHub Pages.

---

## 1. Automated Workflow Overview

The repository includes a GitHub Actions workflow located at [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

### Triggering Deployments
* **Automatic**: Pushes to `main` or `master` branches automatically trigger a build and deployment.
* **Manual**: Go to GitHub **Actions** tab &rarr; select **Deploy to GitHub Pages** &rarr; click **Run workflow**.

### Workflow Steps
1. **Checkout**: Checks out the latest code.
2. **Environment Setup**: Configures Node.js (v20) and caches npm dependencies.
3. **Install**: Runs clean install with `npm ci`.
4. **Build**: Executes `npm run build` using Vite. Output assets are bundled into `dist/`.
5. **Pages Artifact**: Bundles `dist/` using `@actions/upload-pages-artifact`.
6. **Deployment**: Deploys the artifact to GitHub Pages with official GitHub Pages API permissions (`@actions/deploy-pages`).

---

## 2. Enabling GitHub Pages in Repository Settings

To activate deployment on your repository:

1. Navigate to your repository on GitHub:
   `https://github.com/PixieDigitalCreatives/urbanMali`
2. Click **Settings** (top navigation bar).
3. Under the **Code and automation** section on the left sidebar, click **Pages**.
4. Under **Build and deployment**:
   * **Source**: Select **GitHub Actions** (recommended for Vite React builds).
5. Once selected, subsequent pushes to `main` will automatically build and publish your site at:
   `https://pixiedigitalcreatives.github.io/urbanMali/`

---

## 3. Base Path Configuration

Vite is preconfigured with relative asset resolution (`base: './'`) in [`vite.config.ts`](../vite.config.ts). This ensures:
- Works cleanly on subpath deployments like `https://<owner>.github.io/UrbanMali/`
- Works on custom apex domains (e.g., `https://urbanmaali.com`)
- Works locally with `npm run preview` or `npm run dev`

---

## 4. SPA Client-Side Routing Fallback

Because this project uses `react-router-dom` for client-side routing, direct visits to deep links (such as `/services`, `/shop`, `/plans`) are handled by [`public/404.html`](../public/404.html).
GitHub Pages automatically serves this page on unknown paths, redirecting the browser back into the React SPA with preserved URL state.

---

## 5. Local Testing Before Deployment

You can build and preview the production build locally at any time:

```bash
# 1. Install dependencies
npm install

# 2. Compile production bundle
npm run build

# 3. Preview production bundle locally
npm run preview
```
