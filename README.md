<p align="center">
  <a href="https://benchmark.wickra.org"><img src="https://raw.githubusercontent.com/wickra-lib/.github/main/profile/wickra-banner.webp?v=514-7" alt="Wickra Benchmark — a reproducible, golden-verified benchmark suite — recompute any (strategy, dataset, report) in ten languages and confirm it byte-for-byte" width="100%"></a>
</p>

[![Built on Wickra](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-benchmark-site/built-on.svg)](https://github.com/wickra-lib/wickra)
[![Docs](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-benchmark/docs.svg)](https://benchmark.wickra.org)
[![License: MIT OR Apache-2.0](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-benchmark/license.svg)](https://github.com/wickra-lib/wickra-benchmark#license)
[![Built with VitePress](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-benchmark-site/vitepress.svg)](https://vitepress.dev)

---

Source for the Wickra Benchmark site (**[benchmark.wickra.org](https://benchmark.wickra.org)**): hero, per-language API overviews and benchmarks.
Built with [VitePress](https://vitepress.dev).

The structure mirrors [webpage](https://github.com/wickra-lib/webpage)
(wickra.org) and [wickra-docs](https://github.com/wickra-lib/wickra-docs)
(docs.wickra.org): shared header, footer, theme, badge pipeline and workflows.
**Wickra Benchmark** — a reproducible, golden-verified benchmark suite — recompute any (strategy, dataset, report) in ten languages and confirm it byte-for-byte. The library itself is
[`wickra-lib/wickra-benchmark`](https://github.com/wickra-lib/wickra-benchmark); its README carries the install line and a quick start for every language.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (also fails on dead internal links)
npm run preview  # preview the production build
```

## What is kept current by workflow

- **The released version** — the version menu in the nav, the Maven snippet on the landing page and the Java API page — is pulled hourly from [wickra-benchmark's latest release](https://github.com/wickra-lib/wickra-benchmark/releases/latest) by `sync-from-benchmark.yml`.
- **The status badges** in the footer are snapshots refreshed hourly by `refresh-badges.yml`; the SVGs in `public/badges/` are generated, not edited.

Everything else — the copy, the API pages, the benchmark figures (from the repository's `BENCHMARKS.md`) — is edited here by hand.

## Deploy

Static build via Cloudflare Pages (Git integration, no deploy secret):

- **Build command:** `npm run build`
- **Output directory:** `.vitepress/dist`
- **Node version:** 22 (`.nvmrc`)

Custom domain `benchmark.wickra.org` is configured in the Cloudflare Pages dashboard.

## License

Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option.
