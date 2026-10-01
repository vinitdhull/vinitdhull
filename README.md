# Vinit Kumar Dhull — profile website

A responsive, static professional profile site built with plain HTML, CSS, and JavaScript. [vinitdhull.teckvini.com](https://vinitdhull.teckvini.com/) is reachable, but currently shows Hostinger's default page until the deployment workflow is configured and run.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173`.

## Automatic deployment

Pushing website changes to `main` builds `dist/` and deploys it to the configured Hostinger FTP directory. The workflow can also be started manually from **Actions → Build and deploy profile website → Run workflow**.

Add these repository secrets in **Settings → Secrets and variables → Actions** before running the deploy workflow:

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | Hostinger FTP hostname |
| `FTP_USERNAME` | FTP account username |
| `FTP_PASSWORD` | FTP account password |
| `FTP_SERVER_DIR` | FTP path to the `vinitdhull.teckvini.com` document root, with a trailing slash |

Find the subdomain document root in Hostinger hPanel under **Domains → Subdomains**. The workflow deliberately requires the exact path instead of assuming the subdomain shares a directory with the main site.

## Profile content

The biography, experience, education, and project summaries are based on the supplied resume and founder information. Public links for InstaGaana, IntFinder, and other projects were not present in the repository or resume, so they are not guessed. Personal identification details and home address from the resume are intentionally not published.
