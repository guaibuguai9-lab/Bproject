@echo off
cd /d "%~dp0"

echo Stopping any existing dev server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000.*LISTENING') do taskkill /PID %%a /F 2>nul

echo.
echo Starting Pinduoduo 3D Portal...
echo.
cmd /c npm run dev
pause
