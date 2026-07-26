import type {
  ExecuteResolutionResult,
  ResolvedBrowserPresentationAuthorityContext
} from "../types/browser-presentation-context.type.js";

export async function executesBrowserPresentationResolution(
  context: ResolvedBrowserPresentationAuthorityContext
): Promise<ExecuteResolutionResult> {
  return context.edges.invokes<ExecuteResolutionResult>(
    "execute-resolved-browser-presentation-resolution",
    context
  );
}
