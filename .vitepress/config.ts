import { defineConfig } from 'vitepress'

// JSON-LD structured data (Organization + SoftwareApplication) so search
// engines and LLM crawlers can resolve the product's entity, ownership, and
// where it is published. Emitted once in the document <head> below.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://benchmark.wickra.org/#organization',
      name: 'Wickra',
      url: 'https://benchmark.wickra.org/',
      logo: 'https://benchmark.wickra.org/wickra-mark.svg',
      sameAs: [
        'https://github.com/wickra-lib/wickra-benchmark',
        'https://github.com/wickra-lib/wickra',
        'https://wickra.org/',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://benchmark.wickra.org/#software',
      name: 'Wickra Benchmark',
      url: 'https://benchmark.wickra.org/',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Windows, macOS, Linux, WebAssembly',
      programmingLanguage: ['Rust', 'Python', 'JavaScript', 'WebAssembly', 'C', 'C++', 'C#', 'Go', 'Java', 'R'],
      description: 'A curated, hash-pinned benchmark suite for quant backtests: recompute any (strategy, dataset, expected report) case and confirm it reproduces byte-for-byte, in ten languages.',
      license: 'https://github.com/wickra-lib/wickra-benchmark#license',
      publisher: { '@id': 'https://benchmark.wickra.org/#organization' },
    },
  ],
}

export default defineConfig({
  title: 'Wickra Benchmark',
  description: 'A curated, hash-pinned benchmark suite for quant backtests: recompute any (strategy, dataset, expected report) case and confirm it reproduces byte-for-byte, in ten languages.',
  lang: 'en-US',
  cleanUrls: true,

  // Served at the domain root (benchmark.wickra.org via Cloudflare Pages).
  base: '/',

  sitemap: { hostname: 'https://benchmark.wickra.org' },

  // README.md is repo documentation, not a site page — keep it out of the build.
  srcExclude: ['README.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/wickra-mark.svg' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Wickra Benchmark — backtest and live, byte-identical' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'A streaming-native, event-driven backtester on the Wickra core: a strategy is a JSON spec, not code, so a backtest and a live run over the same spec produce identical signals, in ten languages, byte-identical across every binding.',
      },
    ],
    ['meta', { property: 'og:image', content: 'https://benchmark.wickra.org/og-banner.webp' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://benchmark.wickra.org/og-banner.webp' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)],
  ],

  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/(?:index)?\.md$/, '')
    const canonical = `https://benchmark.wickra.org/${path}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
    )
  },

  themeConfig: {
    siteTitle: 'Wickra Benchmark',
    logo: { src: '/wickra-mark.svg', alt: 'Wickra Benchmark' },
    logoLink: 'https://wickra.org/',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Benchmarks', link: '/benchmarks' },
      {
        text: 'API',
        items: [
          { text: 'Rust', link: '/api/rust' },
          { text: 'Python', link: '/api/python' },
          { text: 'Node', link: '/api/node' },
          { text: 'WASM', link: '/api/wasm' },
          { text: 'C', link: '/api/c' },
          { text: 'C#', link: '/api/csharp' },
          { text: 'Go', link: '/api/go' },
          { text: 'Java', link: '/api/java' },
          { text: 'R', link: '/api/r' },
        ],
      },
      { text: 'GitHub', link: 'https://github.com/wickra-lib/wickra-benchmark' },
      {
        text: 'Links',
        items: [
          { text: 'crates.io', link: 'https://crates.io/crates/wickra-benchmark' },
          { text: 'PyPI', link: 'https://pypi.org/project/wickra-benchmark/' },
          { text: 'npm', link: 'https://www.npmjs.com/package/wickra-benchmark' },
          { text: 'NuGet', link: 'https://www.nuget.org/packages/Wickra.Benchmark' },
          { text: 'Maven Central', link: 'https://central.sonatype.com/artifact/org.wickra/wickra-benchmark' },
          { text: 'Go module', link: 'https://pkg.go.dev/github.com/wickra-lib/wickra-benchmark-go' },
          { text: 'r-universe', link: 'https://wickra-lib.r-universe.dev' },
        ],
      },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Release notes', link: 'https://github.com/wickra-lib/wickra-benchmark/releases' },
          { text: 'Changelog', link: 'https://github.com/wickra-lib/wickra-benchmark/blob/main/CHANGELOG.md' },
          { text: 'docs.rs', link: 'https://docs.rs/wickra-benchmark/latest/wickra_benchmark/' },
        ],
      },
      {
        text: 'Ecosystem',
        items: [
          { text: 'Wickra (core)', link: 'https://wickra.org' },
          { text: 'Docs', link: 'https://docs.wickra.org' },
          { text: 'Exchange', link: 'https://exchange.wickra.org' },
          { text: 'Backtest', link: 'https://benchmark.wickra.org' },
          { text: 'Terminal', link: 'https://terminal.wickra.org' },
          { text: 'Screener', link: 'https://screener.wickra.org' },
          { text: 'X-Ray', link: 'https://xray.wickra.org' },
          { text: 'Radar', link: 'https://radar.wickra.org' },
          { text: 'Copilot', link: 'https://copilot.wickra.org' },
          { text: 'Shazam', link: 'https://shazam.wickra.org' },
        ],
      },
    ],

    sidebar: {
      '/api/': [
        {
          text: 'Bindings',
          items: [
            { text: 'Rust', link: '/api/rust' },
            { text: 'Python', link: '/api/python' },
            { text: 'Node', link: '/api/node' },
            { text: 'WASM', link: '/api/wasm' },
            { text: 'C', link: '/api/c' },
            { text: 'C#', link: '/api/csharp' },
            { text: 'Go', link: '/api/go' },
            { text: 'Java', link: '/api/java' },
            { text: 'R', link: '/api/r' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/wickra-lib/wickra-benchmark' }],

    search: { provider: 'local' },

    outline: { level: [2, 3], label: 'On this page' },

    lastUpdated: { text: 'Updated', formatOptions: { dateStyle: 'medium' } },
  },

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: false,
  },
  // The wasm plugins the sibling site needs are absent here: this site has no
  // live demo, because wickra-benchmark-wasm is not published yet.
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
})
