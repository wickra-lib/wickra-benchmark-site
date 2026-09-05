# About Wickra Benchmark

Wickra Benchmark is not a backtest engine. It is the **suite you check one
against**: a curated, hash-pinned collection of `(strategy, dataset, expected
report)` cases that anyone can recompute and confirm byte-for-byte, in ten
languages.

## What it does

A **case** freezes four things together — an embedded
[`wickra-backtest`](https://github.com/wickra-lib/wickra-backtest) `StrategySpec`,
a deterministic candle dataset, the `BacktestReport` the engine must produce, and
the blake3 hash of that report's canonical form.

Running the case recomputes the report from the strategy and the data, then
reports two independent booleans:

- **`passed`** — the recomputed report is byte-exact equal to the frozen one.
- **`hash_match`** — its canonical hash equals the frozen `expected_hash`.

Both false means the engine computes something different. Only `hash_match` false
means the case's own two expectations disagree with each other — which is what
happens when a case is hand-edited instead of blessed.

## Why it exists

A backtest result is a claim. Screenshots, blog posts and pitch decks are full of
them, and none can be checked: the strategy is usually undisclosed, the data
undisclosed, and the engine a black box that may have changed since.

Reproducibility is the smaller, tractable half of that problem. If the strategy,
the data and the expected output are all published, then anyone can recompute
the result and find out whether it still holds. That is all this repository does,
and it does it strictly:

- **Recompute, never trust.** A case passes only when a fresh run reproduces the
  frozen report. A stale engine, a changed default, a numerical drift — each one
  turns the case red instead of going unnoticed.
- **Byte-for-byte, not to a tolerance.** Every binding returns the core's
  canonical string verbatim, so a difference of one bit in the last place is a
  failure, not a rounding detail someone has to judge.
- **Exit code 1 on failure.** A drifting engine turns a build red. That is the
  whole delivery mechanism.

## How ten languages agree

Nothing is reimplemented. The bindings do not each compute a report; they call
one Rust core and hand back its canonical output unchanged — sorted keys,
round-trippable floats, no whitespace. So the response from R and the response
from Rust are the same *bytes*, and byte equality is the cross-language check
rather than an approximation of one.

The cost is worth naming. A case may name any indicator the engine offers, and
some of those call a transcendental from the platform's math library. No
mainstream libm rounds those correctly, and implementations differ in the last
bit — a case built on one would have to compare to a relative tolerance instead.
None currently does, and that is a property of the corpus kept deliberately
rather than by accident.

## Status

Pre-release, and the honest split is this: the machinery is complete, the corpus
is not.

Complete: the runner, the canonical hashing, the CLI, ten language bindings over
one C ABI, a byte-exact golden corpus replayed in every language, fuzz targets,
property tests, and CI across ten languages on three operating systems.

Not complete: the case registry holds **five** cases over five deterministic
datasets of 60–80 bars. That is enough to prove a recompute reproduces. It is not
yet enough to call a benchmark suite — no regime variety, no long series, no
strategy family beyond crossovers and a breakout. Growing it is the work before
1.0.

## Part of Wickra

Built on the same deterministic core and ten-language binding surface as
[wickra](https://github.com/wickra-lib/wickra) (the indicator library),
[wickra-backtest](https://github.com/wickra-lib/wickra-backtest) (the engine this
suite recomputes with),
[wickra-proof](https://github.com/wickra-lib/wickra-proof) and
[wickra-verify](https://github.com/wickra-lib/wickra-verify).

## Licence

Dual-licensed under [MIT](https://github.com/wickra-lib/wickra-benchmark/blob/main/LICENSE-MIT)
or [Apache-2.0](https://github.com/wickra-lib/wickra-benchmark/blob/main/LICENSE-APACHE),
at your option.

## Disclaimer

Not a trading system, and not financial advice. A benchmark report is a
deterministic transform of its input data — reproducing one says the computation
is stable, and nothing at all about whether the strategy makes money. Past
results are not indicative of future performance.
