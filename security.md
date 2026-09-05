# Security

## Reporting a vulnerability

Please report security problems **privately** — do not open a public issue for a
suspected vulnerability. Report through either channel:

- GitHub → the [wickra-benchmark repository](https://github.com/wickra-lib/wickra-benchmark)
  → the **Security** tab → **Report a vulnerability** (private advisory), or
- email **[support@wickra.org](mailto:support@wickra.org)**.

We aim to acknowledge within a few days, agree a disclosure timeline, and credit
reporters who wish to be named once a fix ships.

## Scope

Wickra Benchmark parses untrusted `StrategySpec` JSON and OHLCV/feed data, so its
parser and engine paths are the most security-relevant surface. Reports about
malformed input handling, resource exhaustion, or memory safety across the C ABI are
especially welcome.

The full policy — including supported versions — is in
[SECURITY.md](https://github.com/wickra-lib/wickra-benchmark/blob/main/SECURITY.md)
in the source repository.
