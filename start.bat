@echo off
echo Starting Karmy Pet Shop...
echo.

echo [1/2] Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
echo.

echo [2/2] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
echo.

echo Starting Backend on :5000 ...
cd /d "%~dp0backend"
start "Karmy Backend :5000" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend on :3000 ...
cd /d "%~dp0frontend"
start "Karmy Frontend :3000" cmd /k "npm start"

echo.
echo Both servers launching. Check the two new windows.
pause
