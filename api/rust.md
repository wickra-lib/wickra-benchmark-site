# Rust

The core itself. `run_case` and `run_suite` are the typed entry points; `Benchmark::command_json` is the same surface the other nine bindings forward verbatim.

```bash
cargo add benchmark-core
```

```rust
use benchmark_core::{run_case, BenchmarkCase, load_candles};
use std::path::Path;

let case = BenchmarkCase::from_json(&std::fs::read_to_string("cases/sma-crossover-01.json")?)?;
let data = load_candles(Path::new("datasets").join(&case.dataset_ref).as_path())?;

let result = run_case(&case, &data)?;
println!("{} passed={} hash_match={}", result.id, result.passed, result.hash_match);
```

## The command surface

Every binding exposes the same four commands and returns the core's canonical
JSON string verbatim. That is what makes byte equality the cross-language check.

| `cmd` | Payload | Response |
|---|---|---|
| `run_case` | `{case, data}` | a `CaseResult` — `passed`, `hash_match`, `hash`, `recomputed` |
| `run_suite` | `{suite, datasets}` | a `SuiteReport` — the results sorted by `id`, plus the tally |
| `list_cases` | `{suite}` | `{"ids": [...]}`, sorted |
| `version` | — | `{"version": ..., "engine_version": ...}` |

A domain error — a malformed case, an unknown command — comes back in-band as
`{"ok":false,"error":...}` rather than as an exception.

One committed example of every envelope lives in
[`golden/commands/`](https://github.com/wickra-lib/wickra-benchmark/tree/main/golden/commands),
with the exact response each must produce beside it in `golden/expected/`.

## More

- [docs.rs](https://docs.rs/benchmark-core)
- [crates.io](https://crates.io/crates/benchmark-core)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
