# SRC Sports Academy Website

This repository contains a static HTML website for Pentecost University SRC Sports Academy.

## GitHub Pages Hosting

To host this site on GitHub Pages:

1. Push the repository to GitHub.
2. In the repository settings, enable **GitHub Pages**.
3. Set the source branch to `main` and the folder to `/ (root)`.
4. Save settings and visit the published URL.

## Deployment Automation

A GitHub Actions workflow is included at `.github/workflows/pages.yml`.
When you push to the `main` branch, this workflow will deploy the root folder to GitHub Pages automatically.

## Important paths

- `index.html` — main landing page
- `pages/` — subpages (`about.html`, `blog.html`, `book-online.html`, `events.html`, `new-activities.html`, `register.html`)
- `IMAGES/` — image and video assets
- `JS/script.js` — JavaScript file used by the pages

## Notes

- CSS is embedded in each HTML file for portability.
- The repo does not depend on a build step.
- If your branch is not `main`, update `.github/workflows/pages.yml` to use your branch name.
