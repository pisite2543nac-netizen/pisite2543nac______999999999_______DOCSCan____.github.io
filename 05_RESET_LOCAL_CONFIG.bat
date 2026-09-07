@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - RESET LOCAL CONFIG

del /q ".env.local" 2>nul
del /q ".firebaserc" 2>nul

echo.
echo Local Firebase config removed.
echo Run 00_INSTALL_DOC_FULL_NR.bat again to recreate it.
echo.
pause
