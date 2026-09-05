# WebAssembly

The same core compiled to WASM, so a case can be recomputed in a browser with no backend and nothing uploaded. The surface matches the Node binding's method for method.

```bash
npm install wickra-benchmark-wasm
```

```javascript
import init, { Benchmark, version } from "wickra-benchmark-wasm";

await init();

const bench = new Benchmark();
const result = JSON.parse(
  bench.command(JSON.stringify({ cmd: "run_case", case: theCase, data })),
);
console.log(version(), result.passed, result.hash_match);
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

- [npm](https://www.npmjs.com/package/wickra-benchmark-wasm)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
