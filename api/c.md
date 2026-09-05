# C and C++

The C ABI is the hub every non-native binding calls through. `wickra_benchmark_command` writes into a caller-provided buffer and returns the response length, so a caller asks for the length first.

```bash
# prebuilt header + library per platform:\n# github.com/wickra-lib/wickra-benchmark/releases
```

```c
#include "wickra_benchmark.h"

WickraBenchmark *b = wickra_benchmark_new();

int len = wickra_benchmark_command(b, cmd_json, NULL, 0);   /* ask for the size */
char *out = malloc((size_t)len + 1);
wickra_benchmark_command(b, cmd_json, out, (size_t)len + 1);

puts(out);
free(out);
wickra_benchmark_free(b);
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

- [C++ header](https://github.com/wickra-lib/wickra-benchmark/blob/main/bindings/c/include/wickra_benchmark.hpp)
- [Examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples/c)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
