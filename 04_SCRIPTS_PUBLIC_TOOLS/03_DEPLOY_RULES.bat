@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - DEPLOY RULES

node.exe "node_modules\firebase-tools\lib\bin\firebase.js" deploy --project doc-full-nr --only firestore:rules,firestore:indexes
if errorlevel 1 (
  echo.
  echo [ERROR] Rules deploy failed.
  pause
  exit /b 1
)

echo.
echo RULES DEPLOY SUCCESS
pause
exit /b 0
