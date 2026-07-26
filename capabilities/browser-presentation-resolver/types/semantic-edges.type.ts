export interface SemanticEdges {
  invokes<TOutput>(authorityId: string, context: unknown): Promise<TOutput>;
  projects<TOutput>(projectionId: string, context: unknown): TOutput;
}
