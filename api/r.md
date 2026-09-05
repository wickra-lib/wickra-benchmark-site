# R

Compiled C glue over the ABI, called with `.Call`. `configure` downloads the prebuilt library matching the package version and bundles it, so an ordinary install needs nothing extra.

```r
install.packages("wickrabenchmark", repos = "https://wickra-lib.r-universe.dev")
```

```r
library(wickrabenchmark)

bench <- wkbench_new()
response <- wkbench_command(bench, paste0(
  '{"cmd":"run_case","case":', case_json, ',"data":', candles_json, '}'
))

cat(wkbench_version(), "\n")
cat(response, "\n")
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

- [r-universe](https://wickra-lib.r-universe.dev/wickrabenchmark)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
