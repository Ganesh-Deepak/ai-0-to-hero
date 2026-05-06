# RAG Eval Starter

Use this starter to define retrieval and answer-quality checks before polishing a UI.

## Minimum Dataset

Create at least 30 rows:

```json
{"question":"...","expected_source_id":"doc-001#chunk-004","must_cite":true}
```

## Metrics

- Retrieval recall at 5
- Mean reciprocal rank
- Context precision
- Faithfulness
- Refusal accuracy for off-domain questions

## Release Gate

- Retrieval recall at 5 >= 0.8
- Faithfulness >= 0.95
- Off-domain refusal >= 0.95
- Every factual answer includes citations
