# Instagram Automation Tool
## ابزار اتوماسیون اینستاگرام

> یک ابزار رایگان و متن‌باز برای اتوماسیون پیام‌های اینستاگرام، مشابه ManyChat اما بدون نیاز به API رسمی.

---

## 📋 فهرست مطالب | Table of Contents

### فارسی
- [مشخصات](#مشخصات)
- [نصب داکر](#نصب-داکر)
- [نصب venv](#نصب-venv)
- [API مستندات](#api-مستندات)
- [اتصال n8n](#اتصال-n8n)

### English
- [Features](#features)
- [Docker Installation](#docker-installation)
- [venv Installation](#venv-installation)
- [API Documentation](#api-documentation)
- [n8n Integration](#n8n-integration)

---

## مشخصات

✅ **اتوماسیون کامل**: پاسخ خودکار به کامنت‌ها و پیام‌های مستقیم  
✅ **تشخیص فالو**: بررسی فالو بودن کاربر قبل از ارسال پیام  
✅ **پاسخ‌های رندوم**: انتخاب تصادفی از لیست پاسخ‌ها  
✅ **شروط سفارشی**: تعریف شروط مختلف برای هر پست  
✅ **رایگان و متن‌باز**: کد کامل در دسترس  
✅ **بدون API رسمی**: از InstaGrapi استفاده می‌کند  
✅ **اتصال n8n**: یکپارچگی کامل برای خودکارسازی‌های پیچیده‌تر  

## Features

✅ **Full Automation**: Automatic replies to comments and direct messages  
✅ **Follower Detection**: Check if user follows page before sending message  
✅ **Random Replies**: Randomly select from response list  
✅ **Custom Conditions**: Define different conditions for each post  
✅ **Free & Open Source**: Full code available  
✅ **No Official API**: Uses InstaGrapi  
✅ **n8n Integration**: Full integration for complex automations  

---

## 🐳 نصب داکر

### Docker Installation

```bash
# 1. ریپوزیتوری را کلون کنید
git clone https://github.com/yourusername/instagram-automation.git
cd instagram-automation

# 2. اسکریپت نصب را اجرا کنید
chmod +x install-docker.sh
./install-docker.sh

# 3. سؤالات پورت را پاسخ دهید
# نمونه:
# Do you want to use default ports? y
```

بعد از اتمام نصب:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### After Docker setup:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🐍 نصب venv

### venv Installation

```bash
# 1. پروژه را کلون کنید
git clone https://github.com/yourusername/instagram-automation.git
cd instagram-automation

# 2. اسکریپت نصب را اجرا کنید
chmod +x install-venv.sh
./install-venv.sh

# 3. Virtual Environment فعال می‌شود و بسته‌ها نصب می‌شوند
```

Backend را اجرا کنید:
```bash
source venv/bin/activate
python main.py
```

Frontend را اجرا کنید (در terminal جدید):
```bash
cd frontend
npm install
npm start
```

---

## 🔌 API مستندات

### API Documentation

#### 1. ورود - Authentication

**ورود با JWT (نام کاربری و رمز عبور)**
```
POST /api/auth/login/jwt
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**پاسخ / Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

**ورود با Session**
```
POST /api/auth/login/session
Content-Type: application/json

{
  "instagram_username": "your_instagram_username",
  "session_string": "your_session_string_here"
}
```

**پاسخ / Response:**
```json
{
  "msg": "Session saved",
  "session_id": "your_session_id"
}
```

---

#### 2. ایجاد وظیفه اتوماسیون - Create Automation Task

```
POST /api/automation/setup
Content-Type: application/json

{
  "post_links": [
    "https://instagram.com/p/ABC123DEF456/",
    "https://instagram.com/p/XYZ789UVW123/"
  ],
  "comment_criteria": "#giveaway,@mention,تاج",
  "reply_messages": [
    "سلام! تشکر برای شرکت! 🎉",
    "وای! آفرین بر شما! 👏"
  ],
  "dm_messages": [
    "سلام! به دنبال شما هستیم!",
    "شما برنده شدید! 🎁"
  ],
  "must_follow": true,
  "follow_message": "برای دریافت پیام، صفحه را فالو کنید."
}
```

**پاسخ / Response:**
```json
{
  "task_id": 1,
  "msg": "Task saved successfully"
}
```

---

#### 3. اجرای وظیفه - Run Automation

```
POST /api/automation/run
Content-Type: application/json

{
  "session_string": "your_session_string_here",
  "task_id": 1
}
```

**پاسخ / Response:**
```json
{
  "replies_sent": 5,
  "dms_sent": 3,
  "errors": []
}
```

---

## 📝 مثال استفاده در JavaScript

```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login/jwt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'your_username',
    password: 'your_password'
  })
});

const loginData = await loginResponse.json();
const token = loginData.access_token;

// Create Task
const taskResponse = await fetch('http://localhost:8000/api/automation/setup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    post_links: ['https://instagram.com/p/ABC123/'],
    comment_criteria: '#giveaway',
    reply_messages: ['پاسخ 1', 'پاسخ 2'],
    dm_messages: ['پیام 1', 'پیام 2'],
    must_follow: true,
    follow_message: 'لطفا فالو کنید'
  })
});

const taskData = await taskResponse.json();
console.log('Task ID:', taskData.task_id);

// Run Task
const runResponse = await fetch('http://localhost:8000/api/automation/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_string: 'your_session_string',
    task_id: taskData.task_id
  })
});

const result = await runResponse.json();
console.log('Result:', result);
```

---

## 💻 مثال استفاده در .NET

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;

class Program
{
    private static readonly HttpClient client = new HttpClient();

    static async Task Main()
    {
        // Login
        var loginPayload = new
        {
            username = "your_username",
            password = "your_password"
        };

        var loginContent = new StringContent(
            JsonSerializer.Serialize(loginPayload),
            Encoding.UTF8,
            "application/json"
        );

        var loginResponse = await client.PostAsync(
            "http://localhost:8000/api/auth/login/jwt",
            loginContent
        );

        var loginJson = await loginResponse.Content.ReadAsStringAsync();
        var loginData = JsonSerializer.Deserialize<JsonElement>(loginJson);
        var token = loginData.GetProperty("access_token").GetString();

        // Create Task
        var taskPayload = new
        {
            post_links = new[] { "https://instagram.com/p/ABC123/" },
            comment_criteria = "#giveaway",
            reply_messages = new[] { "پاسخ 1", "پاسخ 2" },
            dm_messages = new[] { "پیام 1", "پیام 2" },
            must_follow = true,
            follow_message = "لطفا فالو کنید"
        };

        var taskContent = new StringContent(
            JsonSerializer.Serialize(taskPayload),
            Encoding.UTF8,
            "application/json"
        );

        var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:8000/api/automation/setup")
        {
            Content = taskContent
        };
        request.Headers.Add("Authorization", $"Bearer {token}");

        var taskResponse = await client.SendAsync(request);
        var taskJson = await taskResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Task Response: " + taskJson);

        // Run Task
        var runPayload = new
        {
            session_string = "your_session_string",
            task_id = 1
        };

        var runContent = new StringContent(
            JsonSerializer.Serialize(runPayload),
            Encoding.UTF8,
            "application/json"
        );

        var runResponse = await client.PostAsync(
            "http://localhost:8000/api/automation/run",
            runContent
        );

        var resultJson = await runResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Run Result: " + resultJson);
    }
}
```

---

## 🔗 اتصال n8n | n8n Integration

### مرحله 1: تنظیم Node برای ورود

```
[Trigger] → [HTTP Request Node]
```

**HTTP Request Node Configuration:**
- **URL**: `http://your-backend:8000/api/auth/login/session`
- **Method**: `POST`
- **Body**:
```json
{
  "instagram_username": "your_username",
  "session_string": "your_session_string"
}
```

---

### مرحله 2: خواندن داده از Google Sheets

```
[Google Sheets Node] → [Read Data]
```

**Read columns:**
1. Post Links
2. Comment Criteria
3. Reply Messages (JSON)
4. DM Messages (JSON)
5. Must Follow (Boolean)

---

### مرحله 3: ایجاد وظیفه اتوماسیون

```
[HTTP Request Node] → [/api/automation/setup]
```

**Body Mapping:**
```json
{
  "post_links": "{{ $node['Google Sheets'].json['Post Links'] }}",
  "comment_criteria": "{{ $node['Google Sheets'].json['Comment Criteria'] }}",
  "reply_messages": "{{ JSON.parse($node['Google Sheets'].json['Reply Messages']) }}",
  "dm_messages": "{{ JSON.parse($node['Google Sheets'].json['DM Messages']) }}",
  "must_follow": "{{ $node['Google Sheets'].json['Must Follow'] }}",
  "follow_message": "برای دریافت پیام، صفحه را فالو کنید."
}
```

---

### مرحله 4: اجرای وظیفه

```
[HTTP Request Node] → [/api/automation/run]
```

**Body:**
```json
{
  "session_string": "{{ $node['HTTP Request'].json['session_string'] }}",
  "task_id": "{{ $node['HTTP Request'].json['task_id'] }}"
}
```

---

### مرحله 5: ارسال نتیجه

```
[Notification Node] → [Email/Telegram/Slack]
```

---

## 🏗️ ساختار پروژه

```
instagram-automation/
│
├── backend/
│   ├── main.py                 # FastAPI Application
│   ├── auth.py                 # Authentication Routes
│   ├── automation.py           # Automation Logic
│   ├── models.py               # Database Models
│   ├── requirements.txt        # Python Dependencies
│   ├── Dockerfile             # Docker Configuration
│   └── .env.example           # Environment Variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginComponent.js
│   │   │   └── AutomationDashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── install-docker.sh           # Docker Installation Script
├── install-venv.sh            # Python venv Installation Script
├── docker-compose.yml         # Docker Compose Configuration
└── README.md                  # This File
```

---

## 🚀 شروع سریع | Quick Start

### Docker (پیشنهادی)
```bash
git clone https://github.com/yourusername/instagram-automation.git
cd instagram-automation
chmod +x install-docker.sh
./install-docker.sh
```

سپس برنامه در http://localhost:3000 در دسترس خواهد بود.

### venv
```bash
git clone https://github.com/yourusername/instagram-automation.git
cd instagram-automation
chmod +x install-venv.sh
./install-venv.sh
```

Backend را اجرا کنید و Frontend را در Terminal جدید راه‌اندازی کنید.

---

## 📞 پشتیبانی | Support

اگر سؤالی داشتید یا مشکلی پیش آمد، لطفاً Issue برای ما بگذارید.

---

## 📄 لایسنس | License

این پروژه تحت لایسنس MIT منتشر شده است.

---

**نسخه: 1.0.0**  
**آخرین بروزرسانی: 2024**
