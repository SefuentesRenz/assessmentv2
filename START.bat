@echo off
echo ============================================
echo  Product Sales System - Quick Start Guide
echo ============================================
echo.
echo STEP 1: Start MySQL Database
echo ----------------------------
echo Run: docker compose up -d
echo.
echo STEP 2: Setup Backend
echo ----------------------------
echo Run: cd backend
echo      npm install
echo      npx prisma migrate dev --name init
echo      npx prisma generate
echo.
echo STEP 3: Start Backend Server
echo ----------------------------
echo Run: npm run dev
echo (Backend will run on http://localhost:4000)
echo.
echo STEP 4: Start Frontend (in NEW terminal)
echo ----------------------------
echo Run: cd ..
echo      npm run dev
echo (Frontend will run on http://localhost:5173)
echo.
echo ============================================
echo  Once running, open http://localhost:5173
echo ============================================
pause
