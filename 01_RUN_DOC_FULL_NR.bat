@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - RUN

if not exist ".env.local" (
  echo [INFO] Firebase config is missing.
  echo Recreating config for doc-full-nr...
  node.exe "scripts\configure-doc-full-nr.mjs"
  if errorlevel 1 (
    echo [ERROR] Config creation failed.
    echo Run 00_INSTALL_DOC_FULL_NR.bat first.
    pause
    exit /b 1
  )
)

if not exist "node_modules" (
  echo Installing packages...
  call npm.cmd install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

start "DOC-FULL-NR DEV SERVER" cmd /k "cd /d ""%CD%"" && npm.cmd run dev"
timeout /t 4 /nobreak >nul
start "" "http://localhost:5174/login"
exit /b 0
