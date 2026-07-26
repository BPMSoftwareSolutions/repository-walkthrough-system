import type {
  BrowserPresentationResolutionContext,
  ResolveAuthorityResult
} from "../types/browser-presentation-context.type.js";

export async function resolvesBrowserPresentationAuthority(
  context: BrowserPresentationResolutionContext
): Promise<ResolveAuthorityResult> {
  return context.edges.invokes<ResolveAuthorityResult>(
    "resolve-browser-presentation-authority",
    context.request
  );
}
