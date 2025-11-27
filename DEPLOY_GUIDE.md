# 🚀 راهنمای کامل نصب و استقرار سامانه Haamee

## 📦 محتویات پروژه

```
haamee-system/
├── haamee-backend/          # سرور Node.js
│   ├── server.js
│   ├── package.json
│   └── haamee.db           # دیتابیس (خودکار ساخته می‌شود)
│
└── haamee-frontend/         # اپلیکیشن React
    ├── src/
    │   └── App.js
    ├── package.json
    └── public/
```

---

## 🎯 روش 1: نصب روی کامپیوتر شخصی (برای تست)

### گام 1: نصب Node.js

1. به سایت https://nodejs.org برید
2. نسخه LTS رو دانلود و نصب کنید
3. بررسی نصب:
```bash
node --version
npm --version
```

### گام 2: نصب Backend

```bash
# رفتن به پوشه backend
cd haamee-backend

# نصب وابستگی‌ها
npm install

# اجرای سرور
npm start
```

✅ سرور روی `http://localhost:3001` اجرا می‌شود

### گام 3: نصب Frontend

```bash
# باز کردن ترمینال جدید
# رفتن به پوشه frontend
cd haamee-frontend

# نصب وابستگی‌ها
npm install

# اجرای اپلیکیشن
npm start
```

✅ برنامه روی `http://localhost:3000` باز می‌شود

### گام 4: ورود به سیستم

- نام کاربری: `admin`
- رمز عبور: `123456`

---

## 🌐 روش 2: استقرار روی سرور آنلاین (Production)

### گزینه A: استقرار با Heroku (رایگان برای شروع)

#### 1. ایجاد حساب Heroku

- برید به https://heroku.com
- ثبت‌نام کنید
- Heroku CLI رو نصب کنید

#### 2. آماده‌سازی پروژه

```bash
# ایجاد فایل Procfile در پوشه backend
echo "web: node server.js" > Procfile

# اضافه کردن به Git
git init
git add .
git commit -m "Initial commit"
```

#### 3. استقرار

```bash
# لاگین به Heroku
heroku login

# ایجاد اپلیکیشن
heroku create haamee-system

# Deploy کردن
git push heroku main

# باز کردن اپ
heroku open
```

✅ URL شما: `https://haamee-system.herokuapp.com`

---

### گزینه B: استقرار با Railway (ساده‌تر و رایگان)

#### 1. ثبت‌نام در Railway

- برید به https://railway.app
- با GitHub لاگین کنید

#### 2. استقرار Backend

1. کلیک روی "New Project"
2. انتخاب "Deploy from GitHub repo"
3. انتخاب ریپوی haamee-backend
4. Railway خودکار build و deploy می‌کنه

✅ URL خودکار ساخته می‌شود مثل: `https://haamee-backend-production.up.railway.app`

#### 3. استقرار Frontend

1. پروژه جدید بسازید
2. فایل `.env` رو توی frontend بسازید:
```
REACT_APP_API_URL=https://haamee-backend-production.up.railway.app/api
```
3. Deploy کنید

✅ سیستم کامل آنلاین است!

---

### گزینه C: استقرار با Vercel + MongoDB Atlas (حرفه‌ای)

#### Backend: MongoDB Atlas

1. برید به https://mongodb.com/cloud/atlas
2. حساب رایگان بسازید
3. یک Cluster بسازید
4. Connection String رو کپی کنید

#### تغییر کد Backend برای MongoDB:

```javascript
// نصب mongoose
npm install mongoose

// تغییر server.js
const mongoose = require('mongoose');

mongoose.connect('YOUR_MONGODB_CONNECTION_STRING', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ساخت Schema برای Persons
const personSchema = new mongoose.Schema({
  nationalCode: String,
  firstName: String,
  lastName: String,
  // ... بقیه فیلدها
});

const Person = mongoose.model('Person', personSchema);

// تغییر API
app.get('/api/persons', async (req, res) => {
  const persons = await Person.find();
  res.json(persons);
});
```

#### Deploy روی Vercel:

```bash
# نصب Vercel CLI
npm install -g vercel

# Deploy Backend
cd haamee-backend
vercel

# Deploy Frontend
cd haamee-frontend
vercel
```

---

## 🔧 تنظیمات پیشرفته

### 1. تغییر پورت Backend

در فایل `server.js`:
```javascript
const PORT = process.env.PORT || 5000; // تغییر از 3001 به 5000
```

### 2. اضافه کردن SSL (HTTPS)

```bash
# نصب Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

### 3. اضافه کردن Authentication واقعی

```javascript
// نصب JWT
npm install jsonwebtoken bcrypt

// اضافه کردن به server.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// تابع ورود
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // بررسی username/password
  const token = jwt.sign({ username }, 'SECRET_KEY', { expiresIn: '24h' });
  res.json({ token });
});
```

### 4. Backup خودکار دیتابیس

```bash
# Script برای backup روزانه
crontab -e

# اضافه کردن:
0 2 * * * cp /path/to/haamee.db /path/to/backup/haamee_$(date +\%Y\%m\%d).db
```

---

## 📱 دسترسی چند کاربره

### روی شبکه محلی (LAN):

1. پیدا کردن IP سرور:
```bash
# ویندوز
ipconfig

# لینوکس/مک
ifconfig
```

2. مثال IP: `192.168.1.100`

3. کاربران دیگر می‌توانند با این آدرس وصل شوند:
```
http://192.168.1.100:3001
```

### روی اینترنت:

1. از سرویس‌های بالا استفاده کنید (Heroku, Railway, Vercel)
2. یا Port Forwarding روی روتر خانگی تنظیم کنید
3. یا از ngrok استفاده کنید (موقت):

```bash
# نصب ngrok
npm install -g ngrok

# اجرا
ngrok http 3001
```

✅ URL عمومی دریافت می‌کنید مثل: `https://abc123.ngrok.io`

---

## 🔐 امنیت

### 1. تغییر رمز عبور پیش‌فرض

در کد Frontend، تابع `doLogin` رو تغییر بدید:

```javascript
if (user === 'admin' && pass === 'YOUR_STRONG_PASSWORD_HERE') {
  // ...
}
```

### 2. محدود کردن دسترسی

در `server.js`:

```javascript
// فقط اجازه دسترسی به IP خاص
app.use((req, res, next) => {
  const allowedIPs = ['192.168.1.100', '192.168.1.101'];
  if (!allowedIPs.includes(req.ip)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});
```

---

## 🐛 عیب‌یابی مشکلات رایج

### مشکل 1: Backend شروع نمی‌شود

```bash
# بررسی اینکه پورت 3001 آزاد باشه
netstat -ano | findstr :3001

# اگر پورت مشغول بود، Process رو Kill کنید
```

### مشکل 2: Frontend به Backend وصل نمی‌شه

- بررسی کنید CORS تنظیم شده باشه
- URL سرور رو در Frontend چک کنید
- Firewall رو بررسی کنید

### مشکل 3: دیتابیس ذخیره نمی‌شه

```bash
# بررسی مجوزهای فایل
chmod 666 haamee.db

# بررسی فضای دیسک
df -h
```

---

## 📊 آمار و مانیتورینگ

### نصب PM2 برای مدیریت بهتر:

```bash
# نصب PM2
npm install -g pm2

# اجرای Backend با PM2
pm2 start server.js --name haamee-backend

# مشاهده logs
pm2 logs

# راه‌اندازی خودکار در بوت
pm2 startup
pm2 save
```

---

## ✅ چک‌لیست تحویل

- [ ] Backend نصب و اجرا شد
- [ ] Frontend نصب و اجرا شد  
- [ ] دیتابیس کار می‌کنه
- [ ] 3 نفر می‌تونن همزمان لاگین کنن
- [ ] داده‌ها ذخیره می‌شن
- [ ] URL آنلاین فعال است
- [ ] رمز عبور تغییر کرد
- [ ] Backup تنظیم شد

---

## 📞 پشتیبانی

در صورت بروز مشکل:

1. Log های Backend رو چک کنید
2. Console مرورگر رو بررسی کنید
3. اتصال شبکه رو تست کنید
4. نسخه Node.js رو بررسی کنید (باید 14+ باشه)

---

## 🎉 تبریک!

سیستم Haamee شما آماده استفاده است! 💪

**لاگین:**
- URL: `[آدرس سرور شما]`
- نام کاربری: `admin`
- رمز عبور: `123456` (حتما تغییرش بدید!)

**موفق باشید!** 🚀
