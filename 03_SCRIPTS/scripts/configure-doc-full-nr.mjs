import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectId = "doc-full-nr";
const cli = path.join(
  root,
  "node_modules",
  "firebase-tools",
  "lib",
  "bin",
  "firebase.js"
);

function run(args) {
  const result = spawnSync(
    process.execPath,
    [cli, ...args],
    {
      cwd: root,
      encoding: "utf8",
      windowsHide: false
    }
  );

  if (result.status !== 0) {
    throw new Error(
      (result.stderr || result.stdout || "Firebase CLI command failed").trim()
    );
  }

  return result.stdout.trim();
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {}

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first >= 0 && last > first) {
    return JSON.parse(text.slice(first, last + 1));
  }

  throw new Error("Could not parse Firebase CLI JSON output.");
}

console.log("Firebase Project:", projectId);

const appsResult = parseJson(
  run([
    "apps:list",
    "--project",
    projectId,
    "--json"
  ])
);

const apps =
  Array.isArray(appsResult.result)
    ? appsResult.result
    : appsResult.result?.apps
      || appsResult.apps
      || [];

let webApp = apps.find(
  (app) =>
    String(app.platform || app.platformName || "").toUpperCase() === "WEB"
);

if (!webApp) {
  console.log("No Firebase Web App found. Creating one...");

  const created = parseJson(
    run([
      "apps:create",
      "WEB",
      "DOC-FULL-NR Smart Worksheet Web",
      "--project",
      projectId,
      "--json"
    ])
  );

  webApp = created.result || created;
}

const appId =
  webApp.appId
  || webApp.firebaseAppId
  || webApp.name;

if (!appId) {
  throw new Error("Firebase Web App ID was not found.");
}

console.log("Web App ID:", appId);

const configResult = parseJson(
  run([
    "apps:sdkconfig",
    "WEB",
    appId,
    "--project",
    projectId,
    "--json"
  ])
);

const sdkConfig =
  configResult.result?.sdkConfig
  || configResult.result
  || configResult.sdkConfig
  || configResult;

const map = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID"
};

const lines = [];

for (const [key, envName] of Object.entries(map)) {
  if (sdkConfig[key]) {
    lines.push(`${envName}=${sdkConfig[key]}`);
  }
}

if (!lines.some((line) => line.startsWith("VITE_FIREBASE_PROJECT_ID="))) {
  lines.push(`VITE_FIREBASE_PROJECT_ID=${projectId}`);
}

fs.writeFileSync(
  path.join(root, ".env.local"),
  lines.join("\n") + "\n",
  "utf8"
);

fs.writeFileSync(
  path.join(root, ".firebaserc"),
  JSON.stringify(
    {
      projects: {
        default: projectId
      }
    },
    null,
    2
  ) + "\n",
  "utf8"
);

const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });

const publicConfig = {
  apiKey: sdkConfig.apiKey,
  authDomain: sdkConfig.authDomain,
  projectId: sdkConfig.projectId || projectId,
  storageBucket: sdkConfig.storageBucket,
  messagingSenderId: sdkConfig.messagingSenderId,
  appId: sdkConfig.appId
};

fs.writeFileSync(
  path.join(publicDir, "firebase-config.js"),
  "window.__FIREBASE_CONFIG__ = "
    + JSON.stringify(publicConfig, null, 2)
    + ";\n",
  "utf8"
);

console.log("OK: .env.local created for doc-full-nr");
console.log("OK: .firebaserc locked to doc-full-nr");
console.log("OK: public/firebase-config.js created for GitHub Pages");
