---
layout: home
title: Wickra Benchmark — recompute a backtest and confirm it byte-for-byte
titleTemplate: false

hero:
  name: "Wickra Benchmark"
  text: "Recompute it. Don't trust it."
  tagline: "A curated, hash-pinned suite of (strategy, dataset, expected report) cases. Run one and it either reproduces the frozen report byte-for-byte, in ten languages, or the build goes red."
  image:
    src: /wickra-mark.svg
    alt: Wickra Benchmark
  actions:
    - theme: brand
      text: View on GitHub
      link: https://github.com/wickra-lib/wickra-benchmark
    - theme: alt
      text: What a case is
      link: https://github.com/wickra-lib/wickra-benchmark/blob/main/docs/CASES.md
    - theme: alt
      text: API
      link: /api/rust

features:
  - icon: 🔒
    title: Recompute, never trust
    details: "A case passes only when a fresh run reproduces the frozen report. A stale engine, a changed default, a numerical drift — each one turns the case red instead of going unnoticed."
  - icon: ⚖️
    title: Two independent checks
    details: "passed is byte-exact report equality; hash_match is canonical-hash equality. They are reported separately, so a case whose expected report and expected_hash disagree with each other is distinguishable from one the engine simply computes differently."
  - icon: 🎯
    title: The same bytes in 10 languages
    details: "Every binding returns the core's canonical string verbatim, so byte equality is the cross-language check. Rust, Python, Node.js, WASM, C, C++, C#, Go, Java and R replay one shared golden corpus and must agree exactly."
  - icon: 🧩
    title: A case is data
    details: "An embedded StrategySpec, a deterministic candle dataset, the expected BacktestReport, and the blake3 hash of its canonical form. No code, so a case crosses the C ABI and WASM unchanged."
  - icon: 📦
    title: Nothing leaves your machine
    details: "A CLI plus ten language bindings over one small deterministic core. There is no service, no upload, and no account — the whole suite is a repository you clone."
  - icon: 🌐
    title: Free reproducibility harness
    details: "Not a new backtest engine: the suite you check an engine against. Point it at wickra-backtest and it tells you whether that engine still computes what it computed before."
---

<script setup>
const installTabs = [
  { label: 'Python', lang: 'bash', code: 'pip install wickra-benchmark' },
  { label: 'Node',   lang: 'bash', code: 'npm install wickra-benchmark' },
  { label: 'Rust',   lang: 'bash', code: 'cargo add benchmark-core' },
  { label: 'WASM',   lang: 'bash', code: 'npm install wickra-benchmark-wasm' },
  { label: 'C',      lang: 'bash', code: '# prebuilt header + library from GitHub releases:\n# github.com/wickra-lib/wickra-benchmark/releases' },
  { label: 'C#',     lang: 'bash', code: 'dotnet add package Wickra.Benchmark' },
  { label: 'Go',     lang: 'bash', code: 'go get github.com/wickra-lib/wickra-benchmark-go' },
  { label: 'Java',   lang: 'xml',  code: '<!-- Maven Central -->\n<dependency>\n  <groupId>org.wickra</groupId>\n  <artifactId>wickra-benchmark</artifactId>\n  <version>0.1.0</version>\n</dependency>' },
  { label: 'R',      lang: 'r',    code: 'install.packages("wickrabenchmark", repos = "https://wickra-lib.r-universe.dev")' },
]
</script>

## The whole thing in one command

Every curated case, recomputed and checked against its frozen report and hash:

```bash
wickra-benchmark run-suite --suite cases/suite.json --data-root datasets
```

```text
id                     passed  hash_match  hash
breakout-channel-01    true    true        2b1ef11f989c
buy-and-hold-01        true    true        c1f6820a3de2
ema-trend-follow-01    true    true        97a97c31a400
rsi-mean-reversion-01  true    true        664558550a58
sma-crossover-01       true    true        8f5e84ff8862
5/5 passed
```

Exit code `0` means every case reproduced, `1` that at least one did not — so a
drifting engine turns a build red rather than going unnoticed.

## Install

<InstallTabs :tabs="installTabs" />

## What a case is

Four things frozen together, and a fifth recomputed from them:

| Field | What it holds |
|---|---|
| `strategy` | An embedded [`wickra-backtest`](https://github.com/wickra-lib/wickra-backtest) `StrategySpec`, as raw JSON. |
| `dataset_ref` | The deterministic candle CSV the case runs on. |
| `expected` | The `BacktestReport` the engine must produce, byte for byte. |
| `expected_hash` | The lowercase blake3 of that report's canonical form. |

Running the case recomputes the report from `strategy` plus the dataset and
returns two independent booleans: `passed` (the recomputed report equals
`expected`) and `hash_match` (its canonical hash equals `expected_hash`).

They are separate on purpose. Both false is an engine that computes something
different. Only `hash_match` false means the case's own two expectations
disagree — which happens when a case is hand-edited instead of blessed.

## Why byte-for-byte is possible at all

Because nothing is reimplemented. Every binding calls the same Rust core and
returns its canonical string verbatim — sorted keys, round-trippable floats — so
the response from R and the response from Rust are the same bytes, not merely
the same numbers to some tolerance.

That is not free, and the corpus keeps it deliberate: a case may name any
indicator the engine offers, and some of those call a transcendental from the
platform's math library. No mainstream libm rounds those correctly, and
implementations differ in the last bit. A case built on one would have to compare
to a relative tolerance instead. None currently does.

## Status

Pre-release. The machinery is complete and the corpus is not: five cases over
five deterministic datasets of 60–80 bars, which is enough to prove that a
recompute reproduces and not yet enough to call a benchmark suite. Growing it —
more regimes, longer series, more strategy families — is the work before 1.0.
