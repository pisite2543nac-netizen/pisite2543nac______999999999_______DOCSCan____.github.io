@echo off
setlocal
cd /d "%~dp0"
title DOC-FULL-NR - GITHUB PUSH

where git.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git was not found.
  echo Install Git for Windows first.
  pause
  exit /b 1
)

echo.
echo This project excludes .env.local and private keys via .gitignore.
echo.
set /p REPO_URL=Paste your EMPTY GitHub repository URL: 

if "%REPO_URL%"=="" (
  echo [ERROR] Repository URL is required.
  pause
  exit /b 1
)

if not exist ".git" (
  git init
)

git add .
git commit -m "Initial DOC-FULL-NR Smart Worksheet"

git branch -M main

git remote remove origin >nul 2>&1
git remote add origin "%REPO_URL%"

git push -u origin main

echo.
echo GITHUB PUSH FINISHED
pause
