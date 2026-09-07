$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "GITHUB_UPLOAD_SETS"

Write-Host ""
Write-Host "============================================================"
Write-Host "  DOC-FULL-NR - CREATE GITHUB UPLOAD SETS"
Write-Host "============================================================"
Write-Host ""
Write-Host "Project folder:"
Write-Host $root
Write-Host ""

$required = @(
  "package.json",
  "vite.config.js",
  "index.html",
  "src",
  "scripts",
  ".github\workflows\pages.yml",
  "public\firebase-config.js"
)

$missing = @()

foreach ($item in $required) {
  if (-not (Test-Path (Join-Path $root $item))) {
    $missing += $item
  }
}

if ($missing.Count -gt 0) {
  Write-Host "[ERROR] Required files are missing:" -ForegroundColor Red
  foreach ($item in $missing) {
    Write-Host "  - $item" -ForegroundColor Red
  }
  Write-Host ""
  Write-Host "If public\firebase-config.js is missing:"
  Write-Host "Run 07_PREPARE_GITHUB_PAGES.bat first."
  exit 1
}

if (Test-Path $out) {
  Remove-Item $out -Recurse -Force
}

New-Item -ItemType Directory -Path $out | Out-Null

function New-Set($name) {
  $path = Join-Path $out $name
  New-Item -ItemType Directory -Path $path | Out-Null
  return $path
}

function Copy-Relative($relative, $destinationRoot) {
  $source = Join-Path $root $relative
  $destination = Join-Path $destinationRoot $relative
  $parent = Split-Path -Parent $destination

  if ($parent -and -not (Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  if (Test-Path $source -PathType Container) {
    Copy-Item $source $destination -Recurse -Force
  } else {
    Copy-Item $source $destination -Force
  }
}

# ------------------------------------------------------------
# SET 1 - Root/core files
# ------------------------------------------------------------
$set1 = New-Set "01_ROOT_CORE"

$rootFiles = @(
  "package.json",
  "vite.config.js",
  "index.html",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  ".firebaserc",
  ".gitignore",
  "README.md",
  "GITHUB_PAGES_README.md",
  "START_HERE.txt",
  "SUBJECTS_1_2569.csv"
)

foreach ($item in $rootFiles) {
  if (Test-Path (Join-Path $root $item)) {
    Copy-Relative $item $set1
  }
}

# ------------------------------------------------------------
# SET 2 - React source code
# ------------------------------------------------------------
$set2 = New-Set "02_SRC"
Copy-Relative "src" $set2

# ------------------------------------------------------------
# SET 3 - Scripts + Windows helpers
# ------------------------------------------------------------
$set3 = New-Set "03_SCRIPTS"

Copy-Relative "scripts" $set3

$batFiles = Get-ChildItem -Path $root -Filter "*.bat" -File
foreach ($file in $batFiles) {
  Copy-Relative $file.Name $set3
}

# ------------------------------------------------------------
# SET 4 - Public Firebase config
# ------------------------------------------------------------
$set4 = New-Set "04_PUBLIC_FIREBASE"
Copy-Relative "public" $set4

# ------------------------------------------------------------
# SET 5 - GitHub Actions (UPLOAD LAST)
# ------------------------------------------------------------
$set5 = New-Set "05_GITHUB_ACTIONS_UPLOAD_LAST"
Copy-Relative ".github" $set5

# Add upload notes.
@"
UPLOAD ORDER
============

Upload the CONTENTS of each folder to the ROOT of your GitHub repository.

1. 01_ROOT_CORE
2. 02_SRC
3. 03_SCRIPTS
4. 04_PUBLIC_FIREBASE
5. 05_GITHUB_ACTIONS_UPLOAD_LAST

IMPORTANT:
- Upload set 5 LAST so GitHub Actions starts only after all required files exist.
- On GitHub, Settings > Pages > Source must be GitHub Actions.
- Do NOT upload node_modules, dist, .env.local, service-account JSON, or private keys.
- After set 5 is committed, open Actions and wait for "Deploy GitHub Pages" to turn green.
"@ | Set-Content -Path (Join-Path $out "UPLOAD_ORDER.txt") -Encoding UTF8

# Manifest
$manifest = Get-ChildItem $out -Recurse -File |
  ForEach-Object {
    $_.FullName.Substring($out.Length + 1)
  }

$manifest | Set-Content -Path (Join-Path $out "UPLOAD_MANIFEST.txt") -Encoding UTF8

# Count files in each set.
Write-Host "Created upload sets:" -ForegroundColor Green
Write-Host ""

$sets = @(
  "01_ROOT_CORE",
  "02_SRC",
  "03_SCRIPTS",
  "04_PUBLIC_FIREBASE",
  "05_GITHUB_ACTIONS_UPLOAD_LAST"
)

foreach ($name in $sets) {
  $folder = Join-Path $out $name
  $count = (Get-ChildItem $folder -Recurse -File).Count
  Write-Host ("  {0}  ({1} files)" -f $name, $count)
}

Write-Host ""
Write-Host "READY:" -ForegroundColor Green
Write-Host $out
Write-Host ""
Write-Host "Open GITHUB_UPLOAD_SETS and upload one set at a time."
