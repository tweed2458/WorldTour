@echo off
echo ============================================
echo  Nettoyage complet du frontend
echo ============================================
echo.

cd apps\frontend

echo [1/5] Suppression des caches npm...
call npm cache clean --force 2>nul

echo [2/5] Suppression des fichiers de cache et build...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist .nuxt rmdir /s /q .nuxt 2>nul
if exist .output rmdir /s /q .output 2>nul
if exist dist rmdir /s /q dist 2>nul
if exist package-lock.json del /f package-lock.json 2>nul
if exist .cache rmdir /s /q .cache 2>nul

echo [3/5] Suppression du dossier Nuxt global (si existe)...
if exist %USERPROFILE%\.nuxt rmdir /s /q %USERPROFILE%\.nuxt 2>nul

echo [4/5] Installation des dependances (cela peut prendre quelques minutes)...
call npm install --force

echo [5/5] Preparation de Nuxt...
call npm run postinstall

echo.
echo ============================================
echo  Frontend reinitialise avec succes!
echo ============================================
echo.
echo Pour demarrer le frontend:
echo   cd apps\frontend
echo   npm run dev
echo.

cd ..\..
