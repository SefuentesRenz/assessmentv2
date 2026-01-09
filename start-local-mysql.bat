@echo off
echo ============================================
echo  Starting Product Sales System (Local MySQL)
echo ============================================
echo.
echo Make sure MySQL is installed and running!
echo.

echo STEP 1: Setting up Backend...
cd backend
call npm install
call npx prisma generate
call npx prisma migrate deploy
echo.
echo STEP 2: Starting Backend Server...
start cmd /k "npm run dev"

echo.
echo STEP 3: Waiting 3 seconds...
timeout /t 3

echo.
echo STEP 4: Starting Frontend...
cd ..
npm run dev

pause
