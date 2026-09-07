@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - BUILD CHECK
call npm.cmd run build
echo.
pause
