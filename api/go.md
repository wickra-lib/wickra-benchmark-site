# Go

cgo over the C ABI hub, published as a standalone module with the prebuilt native libraries staged per platform.

```bash
go get github.com/wickra-lib/wickra-benchmark-go
```

```go
package main

import (
    "encoding/json"
    "fmt"

    wickra "github.com/wickra-lib/wickra-benchmark-go"
)

func main() {
    b := wickra.New()
    defer b.Close()

    cmd, _ := json.Marshal(map[string]any{"cmd": "run_case", "case": theCase, "data": candles})
    out, err := b.Command(string(cmd))
    if err != nil {
        panic(err)
    }
    fmt.Println(wickra.Version(), out)
}
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

- [pkg.go.dev](https://pkg.go.dev/github.com/wickra-lib/wickra-benchmark-go)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
