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

## Release Checklist

- [ ] All models and tools listed.
- [ ] Dangerous actions require confirmation.
- [ ] Evals have thresholds and owners.
- [ ] Logs/traces exclude secrets.
- [ ] Incident owner and rollback path defined.
