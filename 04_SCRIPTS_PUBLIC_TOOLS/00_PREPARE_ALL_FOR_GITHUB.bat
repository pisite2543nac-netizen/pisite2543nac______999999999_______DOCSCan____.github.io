@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - PREPARE EVERYTHING FOR GITHUB

echo ============================================================
echo   DOC-FULL-NR - COMPLETE GITHUB BROWSER PREPARATION
echo ============================================================
echo.
echo Firebase Project: doc-full-nr
echo Admin Email: pisite.2543nac@gmail.com
echo.
echo This script will:
echo 1. Install packages if needed
echo 2. Login to Firebase
echo 3. Fetch the Firebase Web configuration
echo 4. Deploy Firestore Rules and Indexes
echo 5. Build the production website
echo 6. Create docs\ for GitHub Pages
echo 7. Split the FULL project into 5 safe upload sets
echo.

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found.
  pause
  exit /b 1
)

if not exist "node_modules\firebase-tools\lib\bin\firebase.js" (
  echo.
  echo [1/7] Installing packages...
  call npm.cmd install
  if errorlevel 1 goto :error
) else (
  echo [1/7] Packages already installed.
)

echo.
echo [2/7] Firebase login...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" login
if errorlevel 1 goto :error

echo.
echo [3/7] Fetching Firebase Web config for doc-full-nr...
node.exe "scripts\configure-doc-full-nr.mjs"
if errorlevel 1 goto :error

echo.
echo [4/7] Deploying Firestore Rules and Indexes...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only firestore:rules,firestore:indexes
if errorlevel 1 goto :error

echo.
echo [5/7] Building production website...
call npm.cmd run build
if errorlevel 1 goto :error

echo.
echo [6/7] Creating docs and GitHub upload sets...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create-browser-upload-sets.ps1"
if errorlevel 1 goto :error

echo.
echo [7/7] Opening upload-set folder...
start "" "%~dp0GITHUB_UPLOAD_SETS"

echo.
echo ============================================================
echo   EVERYTHING IS READY FOR GITHUB
echo ============================================================
echo.
echo Upload these folders IN ORDER:
echo.
echo 01_ROOT_CORE
echo 02_SRC_CORE
echo 03_SRC_PAGES
echo 04_SCRIPTS_PUBLIC_TOOLS
echo 05_DOCS_WEBSITE_UPLOAD_LAST
echo.
echo IMPORTANT:
echo Upload the CONTENTS inside each folder, not the numbered folder.
echo Commit each set before uploading the next set.
echo.
echo After all 5 sets:
echo GitHub Settings ^> Pages
echo Source = Deploy from a branch
echo Branch = main
echo Folder = /docs
echo.
pause
exit /b 0

:error
echo.
echo ============================================================
echo   PREPARATION FAILED
echo ============================================================
echo.
echo Send a screenshot of the error above.
echo.
pause
exit /b 1
