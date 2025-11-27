#!/bin/bash

echo "🚀 نصب خودکار سامانه Haamee"
echo "================================"
echo ""

# بررسی نصب Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js نصب نیست!"
    echo "لطفا از https://nodejs.org دانلود و نصب کنید"
    exit 1
fi

echo "✅ Node.js نصب شده: $(node --version)"
echo ""

# نصب Backend
echo "📦 نصب Backend..."
cd haamee-backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend نصب شد"
else
    echo "❌ خطا در نصب Backend"
    exit 1
fi
echo ""

# نصب Frontend
echo "📦 نصب Frontend..."
cd ../haamee-frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend نصب شد"
else
    echo "❌ خطا در نصب Frontend"
    exit 1
fi
echo ""

echo "🎉 نصب کامل شد!"
echo ""
echo "برای اجرا:"
echo "  1. ترمینال اول: cd haamee-backend && npm start"
echo "  2. ترمینال دوم: cd haamee-frontend && npm start"
echo ""
echo "لاگین: admin / 123456"
echo ""
