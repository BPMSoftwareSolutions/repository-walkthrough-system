import type {
  BrowserPresentationRequest,
  BrowserPresentationResolutionResult,
  ResolvedBrowserPresentation
} from "./browser-presentation.type.js";
import type { SemanticEdges } from "./semantic-edges.type.js";

export interface BrowserPresentationResolutionContext {
  readonly request: BrowserPresentationRequest;
  readonly edges: SemanticEdges;
}

export interface ResolvedBrowserPresentationAuthorityContext {
  readonly request: BrowserPresentationRequest;
  readonly authority: Readonly<Record<string, unknown>>;
  readonly edges: SemanticEdges;
}

export interface ExecutedBrowserPresentationResolutionContext {
  readonly request: BrowserPresentationRequest;
  readonly execution: Readonly<Record<string, unknown>>;
  readonly edges: SemanticEdges;
}

export type ResolveAuthorityResult = Readonly<Record<string, unknown>>;
export type ExecuteResolutionResult = Readonly<Record<string, unknown>>;
export type ProjectResolutionResult = BrowserPresentationResolutionResult;
export type BrowserPresentationResult = ResolvedBrowserPresentation;
