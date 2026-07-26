const sourceFields = [
  "contractType",
  "sourceId",
  "submittedReference",
  "provider",
  "repository",
  "requestedRevision",
  "resolvedRevision",
  "sourceLocation",
  "access",
  "presentationEntrypoint",
  "authority"
];

export function enforcesSourceContractCompleteness(result: unknown): boolean {
  const source = (result as any)?.source;
  return source === null || sourceFields.every((field) => Object.hasOwn(source, field));
}
