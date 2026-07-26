import { createHash } from "node:crypto";

export function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([key, child]) => [key, canonicalValue(child)])
    );
  }
  return value;
}

export function canonicalHash(value: unknown): string {
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(canonicalValue(value)))
    .digest("hex")}`;
}

export function valueAtPath(context: unknown, path: string): unknown {
  const normalized = path.replace(/^\$\./, "");
  return normalized.split(".").reduce<unknown>((value, key) => {
    if (value === null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, context);
}

function setAtPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split(".");
  let cursor = target;
  for (const segment of segments.slice(0, -1)) {
    const child = cursor[segment];
    if (child === null || typeof child !== "object" || Array.isArray(child)) {
      cursor[segment] = {};
    }
    cursor = cursor[segment] as Record<string, unknown>;
  }
  cursor[segments.at(-1)!] = value;
}

function interpolates(template: string, context: unknown): string {
  return template.replace(/\{([^}]+)\}/g, (_match, path: string) =>
    String(valueAtPath(context, path))
  );
}

export interface ProjectionAuthority {
  projectionId: string;
  fields: Record<string, string>;
}

export function projectsDeclaredFields(
  authority: ProjectionAuthority,
  context: unknown
): Record<string, unknown> {
  const projected: Record<string, unknown> = {};
  for (const [targetPath, source] of Object.entries(authority.fields)) {
    const value = source.startsWith("$.")
      ? valueAtPath(context, source)
      : source.includes("{")
        ? interpolates(source, context)
        : source;
    setAtPath(projected, targetPath, value);
  }
  return projected;
}

export function containsBoundaryMechanics(value: unknown): string[] {
  const serialized = JSON.stringify(value);
  const forbidden = [
    "css selector",
    "xpath",
    "dom node",
    "playwright",
    "scroll pixels",
    "viewport coordinates",
    "ffmpeg",
    "codec",
    "frame rate",
    "screenshot hash"
  ];
  return forbidden.filter((term) => serialized.toLowerCase().includes(term));
}
