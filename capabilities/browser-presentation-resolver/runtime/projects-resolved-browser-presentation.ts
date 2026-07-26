import type {
  ExecutedBrowserPresentationResolutionContext,
  ProjectResolutionResult
} from "../types/browser-presentation-context.type.js";

export function projectsResolvedBrowserPresentation(
  context: ExecutedBrowserPresentationResolutionContext
): ProjectResolutionResult {
  return context.edges.projects<ProjectResolutionResult>(
    "project-browser-presentation-resolution-result",
    context
  );
}
