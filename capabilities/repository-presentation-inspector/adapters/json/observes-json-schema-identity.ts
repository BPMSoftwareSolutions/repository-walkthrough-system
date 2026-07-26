import { observesJsonBody } from "./observes-json-body.js";

export function observesJsonSchemaIdentity(text: string) {
  const body = observesJsonBody(text);
  return {
    schemaDialect: body.$schema ?? null,
    schemaId: body.$id ?? null,
    title: body.title ?? null
  };
}
