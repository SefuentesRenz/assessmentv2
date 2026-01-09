@echo off
echo ============================================
echo  Starting Product Sales System with Docker
echo ============================================
echo.

echo STEP 1: Starting MySQL Database...
docker compose up -d
timeout /t 5

echo.
echo STEP 2: Setting up Backend...
cd backend
call npm install
call npx prisma generate
call npx prisma migrate deploy
call npm run dev

pause
