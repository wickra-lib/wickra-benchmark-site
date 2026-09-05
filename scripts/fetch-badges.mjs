/*
 * Snapshot the repo-status badge SVGs into public/badges/ and write a manifest
 * (.vitepress/theme/badges.json) with each badge's intrinsic width/height.
 *
 * Why: the footer badge row is served from our own origin (Cloudflare) with
 * known dimensions, so the row paints with the page and never reflows instead
 * of popping in one badge at a time from the badge hosts.
 *
 * Run by .github/workflows/refresh-badges.yml on a schedule (commit-if-changed).
 * The site BUILD never calls it, so an upstream badge-host outage can never
 * break a deploy — the last committed snapshot is always used.
 *
 * Repo-status badges are sourced from the pre-rendered SVGs committed in the
 * wickra-lib/.github profile (always 200); the version badges come from
 * shields.io and are best-effort (wickra-benchmark is not published yet, so they
 * resolve once the first release lands). Fault-tolerant: a badge that can't be
 * fetched keeps its previous committed snapshot rather than dropping out.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const PROFILE = 'https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-benchmark'

// Source of truth for the footer badge row. Mirrors the wickra-benchmark README.
const badges = [
  { alt: 'CI', slug: 'ci', src: `${PROFILE}/ci.svg`, href: 'https://github.com/wickra-lib/wickra-benchmark/actions/workflows/ci.yml' },
  { alt: 'CodeQL', slug: 'codeql', src: `${PROFILE}/codeql.svg`, href: 'https://github.com/wickra-lib/wickra-benchmark/actions/workflows/codeql.yml' },
  { alt: 'codecov', slug: 'codecov', src: `${PROFILE}/codecov.svg`, href: 'https://codecov.io/gh/wickra-lib/wickra-benchmark' },
  { alt: 'GitHub release', slug: 'release', src: 'https://img.shields.io/github/v/release/wickra-lib/wickra-benchmark?logo=github&color=green', href: 'https://github.com/wickra-lib/wickra-benchmark/releases/latest' },
  { alt: 'crates.io', slug: 'crates', src: 'https://img.shields.io/crates/v/wickra-benchmark.svg?logo=rust&color=orange', href: 'https://crates.io/crates/wickra-benchmark' },
  { alt: 'PyPI', slug: 'pypi', src: 'https://img.shields.io/pypi/v/wickra-benchmark.svg?logo=pypi&color=blue', href: 'https://pypi.org/project/wickra-benchmark/' },
  { alt: 'npm', slug: 'npm', src: 'https://img.shields.io/npm/v/wickra-benchmark.svg?logo=npm&color=red', href: 'https://www.npmjs.com/package/wickra-benchmark' },
  { alt: 'NuGet', slug: 'nuget', src: 'https://img.shields.io/nuget/v/WickraBenchmark.svg?logo=nuget&color=blue', href: 'https://www.nuget.org/packages/WickraBenchmark' },
  { alt: 'Maven Central', slug: 'maven', src: 'https://img.shields.io/maven-central/v/org.wickra/wickra-benchmark.svg?logo=apachemaven&color=blue', href: 'https://central.sonatype.com/artifact/org.wickra/wickra-benchmark' },
  { alt: 'Go module', slug: 'go', src: 'https://img.shields.io/github/v/tag/wickra-lib/wickra-benchmark-go.svg?logo=go&logoColor=white&color=00ADD8&label=go', href: 'https://pkg.go.dev/github.com/wickra-lib/wickra-benchmark-go' },
  { alt: 'r-universe', slug: 'r-universe', src: 'https://wickra-lib.r-universe.dev/badges/wickra-benchmark', href: 'https://wickra-lib.r-universe.dev' },
  { alt: 'License: MIT OR Apache-2.0', slug: 'license', src: `${PROFILE}/license.svg`, href: 'https://github.com/wickra-lib/wickra-benchmark#license' },
  { alt: 'OpenSSF Scorecard', slug: 'scorecard', src: `${PROFILE}/scorecard.svg`, href: 'https://scorecard.dev/viewer/?uri=github.com/wickra-lib/wickra-benchmark' },
  { alt: 'OpenSSF Best Practices', slug: 'best-practices', src: `${PROFILE}/best-practices.svg`, href: 'https://www.bestpractices.dev/' },
  { alt: 'Build provenance', slug: 'provenance', src: `${PROFILE}/provenance.svg`, href: 'https://github.com/wickra-lib/wickra-benchmark/attestations' },
  { alt: 'Verified across 10 languages', slug: 'verified', src: `${PROFILE}/verified.svg`, href: 'https://github.com/wickra-lib/wickra-benchmark/tree/main/golden' },
]

const outDir = resolve(root, 'public/badges')
mkdirSync(outDir, { recursive: true })
const manifestPath = resolve(root, '.vitepress/theme/badges.json')
const prev = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf-8')) : []
const prevByAlt = new Map(prev.map((b) => [b.alt, b]))

function dimsOf(svg) {
  const w = svg.match(/<svg[^>]*?\bwidth="([\d.]+)"/)
  const h = svg.match(/<svg[^>]*?\bheight="([\d.]+)"/)
  return {
    width: w ? Math.round(parseFloat(w[1])) : null,
    height: h ? Math.round(parseFloat(h[1])) : null,
  }
}

// Resolve the release / go-tag versions ourselves with the workflow's
// authenticated token and point the badges at a static shields render, so they
// don't depend on shields' shared GitHub token pool.
const ghJson = async (path) => {
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: {
      'user-agent': 'wickra-badges',
      accept: 'application/vnd.github+json',
      ...(process.env.GH_TOKEN ? { authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  return res.json()
}
const escBadge = (s) => String(s).replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_')
for (const b of badges) {
  try {
    if (b.slug === 'release') {
      const v = (await ghJson('repos/wickra-lib/wickra-benchmark/releases/latest')).tag_name
      b.src = `https://img.shields.io/badge/release-${escBadge(v)}-green?logo=github`
    } else if (b.slug === 'go') {
      const v = (await ghJson('repos/wickra-lib/wickra-benchmark-go/tags'))[0]?.name
      if (!v) throw new Error('no tags')
      b.src = `https://img.shields.io/badge/go-${escBadge(v)}-00ADD8?logo=go&logoColor=white`
    }
  } catch (err) {
    console.warn(`fetch-badges: resolve ${b.slug} failed (${err.message}); keeping shields fallback`)
  }
}

const manifest = []
let failures = 0
for (const b of badges) {
  const file = `/badges/${b.slug}.svg`
  try {
    const res = await fetch(b.src, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const svg = await res.text()
    if (!svg.includes('<svg')) throw new Error('response is not an SVG')
    const valueText = ((svg.match(/<text[^>]*>([^<]*)<\/text>/g) || []).pop() || '')
      .replace(/<[^>]+>/g, '')
      .trim()
    const valueLower = valueText.toLowerCase()
    const errorMarkers = ['unable to select', 'token from pool', 'inaccessible', 'invalid', 'no response', 'not found']
    if (errorMarkers.some((m) => valueLower.includes(m))) {
      throw new Error(`badge value is an upstream error: "${valueText}"`)
    }
    if (['release', 'crates', 'pypi', 'npm', 'nuget', 'maven', 'go', 'r-universe'].includes(b.slug) && !/^v?\d/.test(valueText)) {
      throw new Error(`version badge value is not a version: "${valueText}"`)
    }
    const verTarget = resolve(outDir, `${b.slug}.svg`)
    if (['release', 'crates', 'pypi', 'npm', 'nuget', 'maven', 'go', 'r-universe'].includes(b.slug) && existsSync(verTarget)) {
      const toTuple = (t) => { const m = String(t).match(/(\d+)\.(\d+)\.(\d+)/); return m ? m.slice(1).map(Number) : null }
      const next = toTuple(valueText)
      const prevText = ((readFileSync(verTarget, 'utf-8').match(/<text[^>]*>([^<]*)<\/text>/g) || []).pop() || '').replace(/<[^>]+>/g, '').trim()
      const prevTuple = toTuple(prevText)
      if (next && prevTuple && (next[0] < prevTuple[0] || (next[0] === prevTuple[0] && (next[1] < prevTuple[1] || (next[1] === prevTuple[1] && next[2] < prevTuple[2]))))) {
        throw new Error(`version went backwards: "${valueText}" < committed "${prevTuple.join('.')}" (stale cache)`)
      }
    }
    writeFileSync(resolve(outDir, `${b.slug}.svg`), svg)
    const { width, height } = dimsOf(svg)
    manifest.push({ alt: b.alt, href: b.href, file, width, height })
    console.log(`fetch-badges: ${b.slug} ${width}x${height}`)
  } catch (err) {
    failures++
    const old = prevByAlt.get(b.alt)
    if (old) {
      manifest.push(old)
      console.warn(`fetch-badges: ${b.slug} failed (${err.message}); kept previous snapshot`)
    } else {
      console.warn(`fetch-badges: ${b.slug} failed (${err.message}); no previous snapshot, skipped`)
    }
  }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`fetch-badges: wrote ${manifest.length} badge(s), ${failures} failure(s)`)
