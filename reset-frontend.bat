@echo off
echo Nettoyage du frontend...

cd apps\frontend

REM Supprimer les fichiers de cache et build
if exist node_modules rmdir /s /q node_modules
if exist .nuxt rmdir /s /q .nuxt
if exist .output rmdir /s /q .output
if exist dist rmdir /s /q dist
if exist package-lock.json del /f package-lock.json

echo Installation des dependances avec les bonnes versions...

REM Installer les dépendances
call npm install

echo.
echo Frontend reinitialise avec succes!
echo.
echo Pour demarrer le frontend:
echo   cd apps\frontend
echo   npm run dev

cd ..\..
