---
title: Benchmarks
description: How fast wickra-benchmark recomputes and verifies a suite of cases, measured with criterion and reproducible on your own hardware.
---

# Benchmarks

These measure **reproducibility throughput** — how quickly a suite of cases can
be recomputed, canonicalized, hashed and compared. They are not a cross-engine
speed comparison: the product's value is byte-identical reproducibility, not raw
speed, and the engine underneath is
[wickra-backtest](https://github.com/wickra-lib/wickra-backtest), whose own
numbers live with it.

## What is being measured

`run_suite` — the whole product path, per case:

1. recompute the report from the case's strategy and its dataset, with the
   pinned engine,
2. canonicalize it (sorted keys, round-trippable floats),
3. take its blake3 digest,
4. compare both the report and the digest against the frozen expectation.

Each case runs a real EMA-cross strategy over a 128-bar series, so the numbers
reflect production work rather than a synthetic shape.

## Results

Measured on a Ryzen 9 9950X (Windows, 16 cores), parallel runner, criterion
median, against `wickra-backtest-core` 0.1.4.

| Suite size | `run_suite` (median) | Throughput |
|-----------:|---------------------:|-----------:|
| 10 cases   | 778 µs               | ~12,900 cases/s |
| 100 cases  | 4.26 ms              | ~23,500 cases/s |
| 1000 cases | 38.0 ms              | ~26,300 cases/s |

Throughput roughly doubles from 10 cases to 1000, then flattens.

Each case is an independent recompute-and-hash, so there is nothing to share
between them and no speed-up to be had from batching itself. What grows is how
well the work fills the cores: at ten cases rayon's own setup is a visible
fraction of a run that takes under a millisecond; by a thousand it is not, and
the curve levels off where the cores saturate rather than where the per-case cost
changes. That cost — a full backtest over 128 bars, canonicalization, and a
blake3 digest — is constant throughout.

## Parallel and sequential agree

The default runner fans cases out over rayon; `--no-default-features` selects a
sequential one. Both re-sort the results by `id` before tallying, so the
`SuiteReport` is byte-identical either way — the flag changes scheduling and
nothing else. That is asserted by the test suite, not assumed here.

## Reproduce it

```bash
cargo bench -p benchmark-bench                        # parallel (rayon) runner
cargo bench -p benchmark-bench --no-default-features  # sequential runner
```

## Reading these numbers

- **Machine and OS vary.** Treat the absolute figures as indicative and re-run
  locally for your hardware. The shape is the durable part: flat per-case cost,
  throughput rising with suite size until the cores fill.
- **The engine version moves the whole table.** Most of the per-case cost is
  `wickra-backtest-core`'s, so a bump there shifts these figures without anything
  in this repository changing — which is why the version each measurement was
  taken against is named above.
- **A nightly run** re-measures this on a schedule and uploads the criterion
  report as a CI artifact; CodSpeed measures the same benches under instruction
  counting and attributes a regression to the pull request that caused it.

Method and the raw criterion output are in
[BENCHMARKS.md](https://github.com/wickra-lib/wickra-benchmark/blob/main/BENCHMARKS.md).
