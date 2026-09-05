# Python

Native PyO3 bindings over the Rust core. The `Benchmark` handle is stateless — the case, the suite and the data arrive with each command.

```bash
pip install wickra-benchmark
```

```python
import json
from wickra_benchmark import Benchmark

case = json.load(open("cases/sma-crossover-01.json"))
data = [...]  # the dataset's candles as dicts

bench = Benchmark()
result = json.loads(bench.command(json.dumps({
    "cmd": "run_case", "case": case, "data": data,
})))
print(result["id"], result["passed"], result["hash_match"])
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

- [PyPI](https://pypi.org/project/wickra-benchmark/)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
