# AI Bill of Materials

## System

- Owner:
- Purpose:
- User population:
- Deployment URL:
- Repository:

## Models

| Provider | Model | Purpose | Data sent | Retention expectation |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Prompts

| Prompt | Location | Owner | Last reviewed |
| --- | --- | --- | --- |
|  |  |  |  |

## Tools And Integrations

| Tool | Scope | Side effects | Confirmation required | Audit log |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## MCP Servers And Skills

| Server or skill | Version / spec revision | Source (first-party, vendor, community) | Scopes | Reviewed by |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Data Sources

| Source | Sensitivity | Update cadence | Access control |
| --- | --- | --- | --- |
|  |  |  |  |

## Evals

| Eval | Dataset | Metric | Threshold | CI gate |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Risks And Mitigations

| Risk | Scenario | Mitigation | Residual risk |
| --- | --- | --- | --- |
| Prompt injection | Retrieved or user-supplied text attempts to override instructions. | Separate trusted instructions from untrusted context; require citations; restrict tools. |  |
| Tool misuse | Model calls a tool with unsafe arguments. | Validate schemas; require confirmation for side effects; log all calls. |  |
| Data leakage | Sensitive data appears in prompts, traces, or outputs. | Minimize data; redact logs; define retention; review access. |  |
| Lethal trifecta | One agent combines private data, untrusted content, and a way to send data out. | Remove at least one of the three; require approval for outbound actions. |  |
| Memory or context poisoning | Untrusted content is saved to memory and reused later. | Scope memory per user; validate writes; expire entries. |  |
| Untrusted skills or servers | A community MCP server or skill runs unexpected code. | Pin versions; review source; run with least privilege. |  |

## Release Checklist

- [ ] All models, tools, MCP servers, and skills listed with pinned versions.
- [ ] Risks mapped to the OWASP Top 10 for LLM Applications and for Agentic Applications.
- [ ] Dangerous actions require confirmation.
- [ ] Evals have thresholds and owners.
- [ ] Logs/traces exclude secrets.
- [ ] Incident owner and rollback path defined.
