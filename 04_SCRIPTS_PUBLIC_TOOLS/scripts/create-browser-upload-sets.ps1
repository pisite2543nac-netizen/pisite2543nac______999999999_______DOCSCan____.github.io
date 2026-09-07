$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$setsRoot = Join-Path $root "GITHUB_UPLOAD_SETS"

Write-Host ""
Write-Host "============================================================"
Write-Host "  DOC-FULL-NR - CREATE SAFE GITHUB BROWSER UPLOAD SETS"
Write-Host "============================================================"
Write-Host ""

$required = @(
  "package.json",
  "vite.config.js",
  "index.html",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "src\App.jsx",
  "src\main.jsx",
  "public\firebase-config.js",
  "dist\index.html"
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
  Write-Host "Run 00_PREPARE_ALL_FOR_GITHUB.bat first."
  exit 1
}

# Recreate docs from production build.
$docs = Join-Path $root "docs"
if (Test-Path $docs) {
  Remove-Item $docs -Recurse -Force
}
New-Item -ItemType Directory -Path $docs | Out-Null
Copy-Item (Join-Path $root "dist\*") $docs -Recurse -Force

# Recreate upload sets.
if (Test-Path $setsRoot) {
  Remove-Item $setsRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $setsRoot | Out-Null

function New-Set($name) {
  $path = Join-Path $setsRoot $name
  New-Item -ItemType Directory -Path $path | Out-Null
  return $path
}

function Copy-Relative($relative, $destinationRoot) {
  $source = Join-Path $root $relative
  if (-not (Test-Path $source)) {
    return
  }

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

# 01 - Root/core: small visible root files only.
$set1 = New-Set "01_ROOT_CORE"
$rootFiles = @(
  "package.json",
  "vite.config.js",
  "index.html",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "README.md",
  "GITHUB_PAGES_README.md",
  "START_HERE.txt",
  "SUBJECTS_1_2569.csv",
  "GITIGNORE_REFERENCE.txt",
  "UPLOAD_SEQUENCE.txt"
)
foreach ($item in $rootFiles) {
  Copy-Relative $item $set1
}

# 02 - Source core/libs/components.
$set2 = New-Set "02_SRC_CORE"
$srcCoreItems = @(
  "src\App.jsx",
  "src\main.jsx",
  "src\styles.css",
  "src\lib",
  "src\components"
)
foreach ($item in $srcCoreItems) {
  Copy-Relative $item $set2
}

# 03 - Source pages.
$set3 = New-Set "03_SRC_PAGES"
Copy-Relative "src\pages" $set3

# 04 - Scripts, public config, and Windows helpers.
$set4 = New-Set "04_SCRIPTS_PUBLIC_TOOLS"
Copy-Relative "scripts" $set4
Copy-Relative "public" $set4

$batFiles = Get-ChildItem -Path $root -Filter "*.bat" -File
foreach ($file in $batFiles) {
  Copy-Relative $file.Name $set4
}

# 05 - Built website for GitHub Pages. UPLOAD LAST.
$set5 = New-Set "05_DOCS_WEBSITE_UPLOAD_LAST"
Copy-Relative "docs" $set5

# A visible manifest users can compare after upload.
$manifest = @()
$setNames = @(
  "01_ROOT_CORE",
  "02_SRC_CORE",
  "03_SRC_PAGES",
  "04_SCRIPTS_PUBLIC_TOOLS",
  "05_DOCS_WEBSITE_UPLOAD_LAST"
)

foreach ($name in $setNames) {
  $folder = Join-Path $setsRoot $name
  $files = Get-ChildItem $folder -Recurse -File
  $manifest += "[$name] $($files.Count) files"
  foreach ($file in $files) {
    $manifest += "  " + $file.FullName.Substring($folder.Length + 1)
  }
  $manifest += ""
}

$manifest | Set-Content -Path (Join-Path $setsRoot "UPLOAD_MANIFEST.txt") -Encoding UTF8

@"
DOC-FULL-NR GITHUB BROWSER UPLOAD ORDER
=======================================

IMPORTANT:
Upload the CONTENTS inside each numbered folder to the ROOT of the SAME GitHub repository.
Do NOT upload the numbered folder itself.

UPLOAD + COMMIT ONE SET AT A TIME:

1. 01_ROOT_CORE
2. 02_SRC_CORE
3. 03_SRC_PAGES
4. 04_SCRIPTS_PUBLIC_TOOLS
5. 05_DOCS_WEBSITE_UPLOAD_LAST

SET 5 MUST BE LAST.

After all 5 sets are committed:

GitHub:
Settings > Pages

Choose:
Build and deployment > Source = Deploy from a branch
Branch = main
Folder = /docs

Save.

Then wait for GitHub Pages to deploy.

Online app routes:
#/login
#/setup
#/admin

Example:
https://USERNAME.github.io/REPOSITORY/#/login

WHY THIS EDITION DOES NOT REQUIRE .github:
This package deploys the already-built website from /docs.
That avoids the hidden .github folder problem in Windows/browser uploads.

SECURITY:
Do NOT upload:
.env.local
node_modules
dist
serviceAccountKey.json
firebase-adminsdk*.json
Admin password
Private keys

public/firebase-config.js is Firebase Web client configuration for the browser.
"@ | Set-Content -Path (Join-Path $setsRoot "UPLOAD_ORDER_README.txt") -Encoding UTF8

Write-Host "Created:" -ForegroundColor Green
Write-Host $setsRoot
Write-Host ""
foreach ($name in $setNames) {
  $count = (Get-ChildItem (Join-Path $setsRoot $name) -Recurse -File).Count
  Write-Host ("  {0} - {1} files" -f $name, $count)
}
Write-Host ""
Write-Host "UPLOAD SET 5 LAST." -ForegroundColor Yellow
