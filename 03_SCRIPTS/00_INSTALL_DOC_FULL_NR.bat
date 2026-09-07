@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - COMPLETE FRESH INSTALL

echo ============================================================
echo   DOC-FULL-NR SMART WORKSHEET - COMPLETE FRESH INSTALL
echo ============================================================
echo.
echo Firebase Project: doc-full-nr
echo Admin Email: pisite.2543nac@gmail.com
echo Login ID: pisit2000
echo Local Port: 5174
echo.

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Install Node.js 22 LTS and reopen this file.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found.
  pause
  exit /b 1
)

echo Node.js:
node.exe --version

echo npm:
call npm.cmd --version

echo.
if not exist "node_modules\firebase-tools\lib\bin\firebase.js" (
  echo [1/6] Installing packages...
  call npm.cmd install
  if errorlevel 1 goto :error
) else (
  echo [1/6] Packages already installed.
)

echo.
echo [2/6] Firebase login...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" login
if errorlevel 1 goto :error

echo.
echo [3/6] Configuring Firebase Web App for doc-full-nr...
node.exe "scripts\configure-doc-full-nr.mjs"
if errorlevel 1 goto :error

echo.
echo [4/6] Deploying FIXED Firestore Rules and Indexes...
node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only firestore:rules,firestore:indexes
if errorlevel 1 goto :error

echo.
echo [5/6] Building website...
call npm.cmd run build
if errorlevel 1 goto :error

echo.
echo [6/6] Starting fresh website on port 5174...
start "DOC-FULL-NR DEV SERVER" cmd /k "cd /d ""%CD%"" && npm.cmd run dev"
timeout /t 4 /nobreak >nul
start "" "http://localhost:5174/setup"

echo.
echo ============================================================
echo   SETUP SUCCESS - DOC-FULL-NR
echo ============================================================
echo.
echo Open:
echo http://localhost:5174/setup
echo.
echo Set a NEW Admin password on the setup page.
echo.
echo Next time run:
echo 01_RUN_DOC_FULL_NR.bat
echo.
pause
exit /b 0

:error
echo.
echo ============================================================
echo   SETUP FAILED
echo ============================================================
echo.
echo Please send a screenshot of the error above.
echo.
pause
exit /b 1
