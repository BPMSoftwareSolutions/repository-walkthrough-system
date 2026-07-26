const forbiddenCapabilityBodySyntax = [
  /\bif\s*\(/,
  /\bswitch\s*\(/,
  /\bfor\s*\(/,
  /\bwhile\s*\(/,
  /\?\?/,
  /\?\s*[^:]+:/
];

export function enforcesLinearCapabilityBodies(source: string): boolean {
  return forbiddenCapabilityBodySyntax.every((pattern) => !pattern.test(source));
}
