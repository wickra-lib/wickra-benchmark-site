# C#

P/Invoke over the C ABI. `Benchmark` owns the native handle, so dispose it — `using` or `Dispose()`.

```bash
dotnet add package Wickra.Benchmark
```

```csharp
using System.Text.Json;
using Wickra.Benchmark;

using var bench = new Benchmark();

var response = bench.Command(JsonSerializer.Serialize(new
{
    cmd = "run_case",
    @case = theCase,
    data = candles,
}));

Console.WriteLine(response);
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

- [NuGet](https://www.nuget.org/packages/Wickra.Benchmark/)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
