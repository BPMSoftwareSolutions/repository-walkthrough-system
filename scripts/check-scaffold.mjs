import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function findFiles(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && [".git", "node_modules"].includes(entry.name)) continue;
    const path = join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await findFiles(path));
    else files.push(path);
  }
  return files;
}

const bodyPath = join(root, "capability-authority", "repository-walkthrough-system-body.v1.json");
let body;
try {
  body = JSON.parse(await readFile(bodyPath, "utf8"));
} catch (error) {
  errors.push(`Cannot read system body contract: ${error.message}`);
}

const requiredCapabilityDirectories = [
  "intent",
  "features",
  "architecture",
  "semantic-authority/observations",
  "semantic-authority/decisions",
  "semantic-authority/projections",
  "semantic-authority/ports",
  "semantic-authority/effects",
  "semantic-authority/execution-models",
  "semantic-authority/failure-policies",
  "semantic-authority/proof-requirements",
  "contracts",
  "projectors",
  "adapters",
  "runtime",
  "proof/fixtures",
  "proof/scenarios",
  "proof/assertions",
  "proof/conformance",
  "docs"
];

if (body) {
  const capabilityIds = new Set((body.capabilities ?? []).map(({ capabilityId }) => capabilityId));

  if (body.capabilities?.length !== 10) {
    errors.push(`Expected 10 capabilities, found ${body.capabilities?.length ?? 0}.`);
  }

  for (const capability of body.capabilities ?? []) {
    const base = join(root, capability.package);
    for (const directory of requiredCapabilityDirectories) {
      if (!await exists(join(base, directory))) {
        errors.push(`${capability.capabilityId}: missing ${directory}`);
      }
    }

    for (const file of ["README.md", "AGENTS.md", "package.json"]) {
      if (!await exists(join(base, file))) {
        errors.push(`${capability.capabilityId}: missing ${file}`);
      }
    }

    if (!await exists(join(root, capability.publicContract))) {
      errors.push(`${capability.capabilityId}: missing public contract ${capability.publicContract}`);
    }

    for (const dependency of capability.dependencies ?? []) {
      if (!capabilityIds.has(dependency)) {
        errors.push(`${capability.capabilityId}: unknown dependency ${dependency}`);
      }
      if (dependency === capability.capabilityId) {
        errors.push(`${capability.capabilityId}: capability cannot depend on itself`);
      }
    }

    const authorityPath = join(root, "capability-authority", `${capability.capabilityId}.capability.json`);
    if (!await exists(authorityPath)) {
      errors.push(`${capability.capabilityId}: missing capability authority`);
    } else {
      const authority = JSON.parse(await readFile(authorityPath, "utf8"));
      if (authority.publicContract !== capability.publicContract) {
        errors.push(`${capability.capabilityId}: body and capability authority public contracts differ`);
      }
    }

    const intentFolder = join(base, "intent");
    if (await exists(intentFolder)) {
      const intents = (await readdir(intentFolder)).filter((file) => file.endsWith(".intent-ir.v1.json"));
      if (intents.length !== 1) {
        errors.push(`${capability.capabilityId}: expected one Intent IR, found ${intents.length}`);
      } else {
        const intent = JSON.parse(await readFile(join(intentFolder, intents[0]), "utf8"));
        if (intent.capabilityId !== capability.capabilityId) {
          errors.push(`${capability.capabilityId}: Intent IR capabilityId mismatch`);
        }
      }
    }

    const featureFolder = join(base, "features");
    if (await exists(featureFolder)) {
      const features = (await readdir(featureFolder)).filter((file) => file.endsWith(".feature"));
      if (features.length !== 1) {
        errors.push(`${capability.capabilityId}: expected one feature, found ${features.length}`);
      } else {
        const feature = await readFile(join(featureFolder, features[0]), "utf8");
        if (!feature.includes("Scenario:")) {
          errors.push(`${capability.capabilityId}: feature has no scenarios`);
        }
      }
    }
  }
}

for (const path of await findFiles(root)) {
  const repositoryPath = relative(root, path).replaceAll("\\", "/");
  if (repositoryPath.startsWith("node_modules/") || !path.endsWith(".json")) continue;
  try {
    const value = JSON.parse(await readFile(path, "utf8"));
    if ((repositoryPath.startsWith("contracts/") || repositoryPath.includes("/contracts/"))
      && repositoryPath.endsWith(".schema.v1.json")) {
      if (value.$schema !== "https://json-schema.org/draft/2020-12/schema") {
        errors.push(`${repositoryPath}: contract does not declare JSON Schema 2020-12`);
      }
      if (!value.$id || !value.type) {
        errors.push(`${repositoryPath}: contract is missing $id or type`);
      }
    }
  } catch (error) {
    errors.push(`${repositoryPath}: invalid JSON (${error.message})`);
  }
}

if (errors.length) {
  console.error("Scaffold conformance failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Scaffold conformance passed for ${body.capabilities.length} capabilities.`);
  console.log("This result proves structure and JSON readability only, not behavior.");
}
