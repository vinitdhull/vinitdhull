# Vinit Kumar Dhull — profile website

A responsive, static professional profile site built with plain HTML, CSS, and JavaScript. The website files live at the repository root so Hostinger's GitHub deployment can serve `index.html` directly from the configured document root.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173`.

## Automatic deployment

Hostinger's GitHub integration deploys the repository root to the configured hosting directory. Ensure the integration is connected to this repository's `main` branch and targets the intended subdomain's document root (for example, `public_html`). The root `index.html`, `styles.css`, `main.js`, and `favicon.svg` are ready to serve directly. GitHub Actions validates the static build; it does not upload files over FTP.

## Profile content

The biography, experience, education, and project summaries are based on the supplied resume and founder information. Public links for InstaGaana, IntFinder, and other projects were not present in the repository or resume, so they are not guessed. Personal identification details and home address from the resume are intentionally not published.
