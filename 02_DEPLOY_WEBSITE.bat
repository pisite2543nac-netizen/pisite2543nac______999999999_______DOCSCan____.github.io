@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - DEPLOY WEBSITE

call npm.cmd run build
if errorlevel 1 goto :error

node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only hosting
if errorlevel 1 goto :error

echo.
echo ============================================================
echo   WEBSITE DEPLOY SUCCESS
echo ============================================================
pause
exit /b 0

:error
echo.
echo [ERROR] Website deploy failed.
pause
exit /b 1
