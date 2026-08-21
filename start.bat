@echo off
setlocal
cd /d "%~dp0"

title AquaRegen - Smart Rainwater Harvesting and Groundwater Recharge Platform

echo ===============================================================================
echo   AQUAREGEN - SMART RAINWATER HARVESTING AND GROUNDWATER RECHARGE PLATFORM
echo ===============================================================================
echo   Tagline: Turn Rainfall Into Water Security.
echo ===============================================================================
echo.

REM 1. Detect Python
echo [1/5] Checking Python environment...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python detected:
    python --version
    set PY_CMD=python
    goto PYTHON_OK
)

py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python detected via py launcher:
    py --version
    set PY_CMD=py
    goto PYTHON_OK
)

echo [ERROR] Python 3.10+ is not found in your PATH.
echo Please install Python 3.10+ from https://python.org
pause
exit /b 1

:PYTHON_OK

REM 2. Detect Node and NPM
echo.
echo [2/5] Checking Node.js and NPM environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js version:
node -v
echo [OK] NPM version:
call npm -v

REM 3. Check .env configuration
echo.
echo [3/5] Checking environment configuration...
if not exist "backend\.env" (
    echo Creating backend\.env from template...
    copy "backend\.env.example" "backend\.env" >nul
    echo [NOTE] You can configure your MongoDB Atlas URI in backend\.env
) else (
    echo [OK] backend\.env found.
)

REM 4. Verify dependencies
echo.
echo [4/5] Verifying dependencies...
echo - Checking Python backend requirements...
%PY_CMD% -m pip install -r backend\requirements.txt --quiet

echo - Checking Frontend dependencies...
cd /d "%~dp0frontend"
call npm install --silent
cd /d "%~dp0"

REM 5. Launch both servers
echo.
echo [5/5] Launching AquaRegen Platform...
echo.
echo -----------------------------------------------------
echo   Backend API:  http://localhost:8000
echo   Swagger Docs: http://localhost:8000/docs
echo   Frontend UI:  http://localhost:5173
echo -----------------------------------------------------
echo.
echo Opening browser and starting servers...
echo.

REM Start FastAPI Backend in a separate window
start "AquaRegen Backend API" cmd /k "cd /d "%~dp0backend" && %PY_CMD% -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM Give backend 2 seconds to initialize
timeout /t 2 /nobreak >nul

REM Launch browser to frontend
start http://localhost:5173

REM Start Frontend Vite dev server in current window
cd /d "%~dp0frontend"
call npm run dev
