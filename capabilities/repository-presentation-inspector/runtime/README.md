# Runtime

Runtime bodies must read as a collapsed transcript:

```text
resolve -> execute -> project -> return
```

Do not author capability decisions, DTO stitching, iteration policy, fallback,
retry, or proof disposition here.

`application/inspects-repository-presentation.ts` and the three responsibility
bodies conform to this transcript. Generic decision evaluation, canonical
hashing, and declared ordering execution live outside those bodies.
