import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const TS_EXT = /\.tsx?$/;
const SRC_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

function isRelative(specifier) {
  return specifier.startsWith("./") || specifier.startsWith("../");
}

function toFileUrl(absOrFileUrl) {
  if (absOrFileUrl.startsWith("file:")) {
    return pathToFileURL(fileURLToPath(absOrFileUrl)).href;
  }
  return pathToFileURL(absOrFileUrl).href;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    let abs = path.join(SRC_ROOT, specifier.slice(2));
    if (!path.extname(abs)) abs = `${abs}.ts`;
    return {
      url: pathToFileURL(abs).href,
      shortCircuit: true,
      format: abs.endsWith(".json") ? "json" : "module",
    };
  }

  if (specifier.startsWith("file:") || path.isAbsolute(specifier)) {
    if (TS_EXT.test(specifier)) {
      return {
        url: toFileUrl(specifier),
        shortCircuit: true,
        format: "module",
      };
    }
    return nextResolve(specifier, context);
  }

  let nextSpecifier = specifier;
  if (isRelative(specifier) && !/\.(tsx?|jsx?|json|mjs|cjs)$/.test(specifier)) {
    nextSpecifier = `${specifier}.ts`;
  }

  if (TS_EXT.test(nextSpecifier)) {
    const parentPath = context.parentURL
      ? fileURLToPath(context.parentURL)
      : path.join(process.cwd(), "noop.js");
    const abs = path.resolve(path.dirname(parentPath), nextSpecifier);
    return {
      url: pathToFileURL(abs).href,
      shortCircuit: true,
      format: "module",
    };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!TS_EXT.test(url)) {
    return nextLoad(url, context);
  }

  const filename = fileURLToPath(url);
  const source = readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: false,
    },
    fileName: filename,
  });

  return {
    format: "module",
    source: outputText,
    shortCircuit: true,
  };
}
