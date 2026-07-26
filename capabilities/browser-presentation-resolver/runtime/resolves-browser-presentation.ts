import type { BrowserPresentationResolutionContext } from "../types/browser-presentation-context.type.js";
import type { BrowserPresentationResolutionResult } from "../types/browser-presentation.type.js";
import { executesBrowserPresentationResolution } from "./executes-browser-presentation-resolution.js";
import { projectsResolvedBrowserPresentation } from "./projects-resolved-browser-presentation.js";
import { resolvesBrowserPresentationAuthority } from "./resolves-browser-presentation-authority.js";

export async function resolvesBrowserPresentation(
  context: BrowserPresentationResolutionContext
): Promise<BrowserPresentationResolutionResult> {
  const authority = await resolvesBrowserPresentationAuthority(context);
  const execution = await executesBrowserPresentationResolution({
    request: context.request,
    authority,
    edges: context.edges
  });
  return projectsResolvedBrowserPresentation({
    request: context.request,
    execution,
    edges: context.edges
  });
}
