export function enforcesLinearInspectionBodies(source: string): boolean {
  return !/\b(?:if|else|switch|case|for|while|do)\b|\?\s*[^:]+\s*:/.test(source);
}
