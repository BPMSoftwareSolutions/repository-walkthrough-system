export interface ObservedPresentationUnit {
  observedKind:
    | "markdown-heading"
    | "markdown-code-block"
    | "markdown-ascii-diagram"
    | "gherkin-feature"
    | "gherkin-scenario"
    | "semantic-root"
    | "semantic-decision"
    | "semantic-projection"
    | "contract-root"
    | "schema-root"
    | "typescript-exported-operation"
    | "typescript-collapsed-body";
  title: string;
  semanticIdentity: string;
  startLine: number;
  endLine: number;
  contentLength: number;
  sourceIdentity: Record<string, unknown>;
}
