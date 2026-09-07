@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - PREPARE GITHUB PAGES

echo ============================================================
echo   DOC-FULL-NR - PREPARE GITHUB PAGES
echo ============================================================
echo.

if not exist "node_modules\firebase-tools\lib\bin\firebase.js" (
  echo Installing packages...
  call npm.cmd install
  if errorlevel 1 goto :error
)

echo.
echo [1/3] Firebase login...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" login
if errorlevel 1 goto :error

echo.
echo [2/3] Creating Firebase Web config for GitHub Pages...
node.exe "scripts\configure-doc-full-nr.mjs"
if errorlevel 1 goto :error

echo.
echo [3/3] Building website...
call npm.cmd run build
if errorlevel 1 goto :error

if not exist "public\firebase-config.js" (
  echo [ERROR] public\firebase-config.js was not created.
  goto :error
)

echo.
echo ============================================================
echo   GITHUB PAGES READY
echo ============================================================
echo.
echo Upload/PUSH the CONTENTS of this folder to the ROOT
echo of your GitHub repository.
echo.
echo Required file now exists:
echo public\firebase-config.js
echo.
echo In GitHub:
echo Settings ^> Pages ^> Source ^> GitHub Actions
echo.
pause
exit /b 0

:error
echo.
echo ============================================================
echo   PREPARE FAILED
echo ============================================================
echo.
pause
exit /b 1
