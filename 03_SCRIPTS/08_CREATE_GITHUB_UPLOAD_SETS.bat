@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - CREATE GITHUB UPLOAD SETS

echo ============================================================
echo   DOC-FULL-NR - CREATE GITHUB UPLOAD SETS
echo ============================================================
echo.
echo This will split the project into 5 small GitHub upload sets.
echo.
echo IMPORTANT:
echo public\firebase-config.js must already exist.
echo If not, run 07_PREPARE_GITHUB_PAGES.bat first.
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create-github-upload-sets.ps1"

if errorlevel 1 (
  echo.
  echo ============================================================
  echo   FAILED
  echo ============================================================
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo   GITHUB UPLOAD SETS READY
echo ============================================================
echo.
echo Open:
echo GITHUB_UPLOAD_SETS
echo.
echo Upload in this exact order:
echo 1. 01_ROOT_CORE
echo 2. 02_SRC
echo 3. 03_SCRIPTS
echo 4. 04_PUBLIC_FIREBASE
echo 5. 05_GITHUB_ACTIONS_UPLOAD_LAST
echo.
echo Upload the CONTENTS inside each folder, not the folder itself.
echo.
start "" "%~dp0GITHUB_UPLOAD_SETS"
pause
