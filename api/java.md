# Java

FFM (Panama) over the C ABI — no JNI shim. `Benchmark` is `AutoCloseable`, so try-with-resources releases the native handle.

```xml
<dependency>
  <groupId>org.wickra</groupId>
  <artifactId>wickra-benchmark</artifactId>
  <version>0.1.0</version>
</dependency>
```

```java
import org.wickra.benchmark.Benchmark;

try (Benchmark benchmark = new Benchmark()) {
    String response = benchmark.command(
        "{\"cmd\":\"run_case\",\"case\":" + caseJson + ",\"data\":" + candles + "}");
    System.out.println(Benchmark.version());
    System.out.println(response);
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

- [Maven Central](https://central.sonatype.com/artifact/org.wickra/wickra-benchmark)
- [Source & examples](https://github.com/wickra-lib/wickra-benchmark/tree/main/examples)
