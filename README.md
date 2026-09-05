<p align="center">
  <a href="https://benchmark.wickra.org"><img src="https://raw.githubusercontent.com/wickra-lib/.github/main/profile/wickra-banner.webp?v=514" alt="Wickra Benchmark — backtest and live are byte-identical" width="100%"></a>
</p>

[![Built on Wickra](https://img.shields.io/badge/built%20on-wickra-3b82f6)](https://github.com/wickra-lib/wickra)
[![Live demo](https://img.shields.io/badge/live%20demo-benchmark.wickra.org-3b82f6)](https://benchmark.wickra.org)
[![Docs](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-benchmark/docs.svg)](https://docs.wickra.org)
[![License: MIT OR Apache-2.0](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-benchmark/license.svg)](https://github.com/wickra-lib/wickra-benchmark#license)
[![Built with VitePress](https://img.shields.io/badge/built%20with-VitePress-5c73e7?logo=vite&logoColor=white)](https://vitepress.dev)

---

Source for the Wickra Benchmark marketing site (**[benchmark.wickra.org](https://benchmark.wickra.org)**):
hero, live in-browser WASM indicator demo, benchmarks, and per-language API
overviews. Built with [VitePress](https://vitepress.dev).

The structure mirrors [webpage](https://github.com/wickra-lib/webpage)
(wickra.org) and [wickra-docs](https://github.com/wickra-lib/wickra-docs)
(docs.wickra.org): shared header, footer, theme, badge pipeline, and workflows.
Wickra Benchmark is a streaming-native, event-driven backtester where a backtest and a live run over the same JSON spec are byte-identical. The library itself is
[`wickra-lib/wickra-benchmark`](https://github.com/wickra-lib/wickra-benchmark).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (also fails on dead internal links)
npm run preview  # preview the production build
```

The live demo loads the published [`wickra-wasm`](https://www.npmjs.com/package/wickra-wasm)
bundle from npm, so it runs the real Wickra indicators in the browser.

## Deploy

Static build via Cloudflare Pages:

- **Build command:** `npm run build`
- **Output directory:** `.vitepress/dist`
- **Node version:** 20

Custom domain `benchmark.wickra.org` is configured in the Cloudflare Pages dashboard.

## License

Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option.
