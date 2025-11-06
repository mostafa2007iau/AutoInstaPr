# ساختار و توضیح Nodes در Workflow n8n

## فارسی

### 🔄 جریان کار کامل

```
┌──────────────────────────────────────────────────────────────────┐
│                    INSTAGRAM AUTOMATION WORKFLOW                │
│                          (n8n Workflow)                         │
└──────────────────────────────────────────────────────────────────┘

    START (دریافت درخواست از Google Sheets یا Webhook)
         │
         ▼
    ┌─────────────────────────────┐
    │   NODE 1: TRIGGER/WEBHOOK   │
    │                             │
    │  نوع: Webhook یا Timer      │
    │  ورودی: درخواست از شبکه     │
    │  خروجی: فعال شدن workflow  │
    └─────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │   NODE 2: GOOGLE SHEETS READ        │
    │                                     │
    │  نوع: Google Sheets Node            │
    │  ورودی: Spreadsheet ID              │
    │  خروجی:                             │
    │  - post_links: ["url1", "url2"]     │
    │  - comment_criteria: "#giveaway"    │
    │  - reply_messages: ["msg1", "msg2"]│
    │  - dm_messages: ["dm1", "dm2"]      │
    │  - must_follow: true/false          │
    │  - follow_message: "فارسی text"     │
    └─────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │   NODE 3: AUTH - LOGIN TO INSTAGRAM  │
    │                                      │
    │  نوع: HTTP Request Node              │
    │  URL: /api/auth/login/session        │
    │  Method: POST                        │
    │  ورودی:                              │
    │  {                                   │
    │    "instagram_username": "...",      │
    │    "session_string": "..."           │
    │  }                                   │
    │  خروجی:                              │
    │  {                                   │
    │    "msg": "Session saved",           │
    │    "session_id": "xyz"               │
    │  }                                   │
    └──────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────────┐
    │   NODE 4: SETUP AUTOMATION TASK          │
    │                                          │
    │  نوع: HTTP Request Node                  │
    │  URL: /api/automation/setup              │
    │  Method: POST                            │
    │  ورودی (از Sheets):                      │
    │  {                                       │
    │    "post_links": [...],                  │
    │    "comment_criteria": "...",            │
    │    "reply_messages": [...],              │
    │    "dm_messages": [...],                 │
    │    "must_follow": boolean,               │
    │    "follow_message": "..."               │
    │  }                                       │
    │  خروجی:                                  │
    │  {                                       │
    │    "task_id": 1,                         │
    │    "msg": "Task saved successfully"      │
    │  }                                       │
    └──────────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────────┐
    │   NODE 5: RUN AUTOMATION                 │
    │                                          │
    │  نوع: HTTP Request Node                  │
    │  URL: /api/automation/run                │
    │  Method: POST                            │
    │  ورودی:                                  │
    │  {                                       │
    │    "session_string": "from_sheets",      │
    │    "task_id": "from_node_4"              │
    │  }                                       │
    │  خروجی:                                  │
    │  {                                       │
    │    "replies_sent": 5,                    │
    │    "dms_sent": 3,                        │
    │    "errors": []                          │
    │  }                                       │
    └──────────────────────────────────────────┘
         │
         ▼
    ┌────────────────────────────────────────┐
    │   NODE 6: PROCESS RESULTS (Optional)   │
    │                                        │
    │  نوع: Set Node                          │
    │  ورودی: خروجی Node 5                    │
    │  کار: ذخیره متغیرها برای Step بعدی    │
    │  خروجی:                                 │
    │  {                                      │
    │    "success": true,                     │
    │    "summary": {                         │
    │      "replies": 5,                      │
    │      "dms": 3                           │
    │    }                                    │
    │  }                                      │
    └────────────────────────────────────────┘
         │
         ▼
    ┌────────────────────────────────────────┐
    │   NODE 7: SEND NOTIFICATION            │
    │                                        │
    │  نوع: Telegram / Email / Slack         │
    │  ورودی: نتایج اجرا شده                  │
    │  پیام:                                  │
    │  ✅ وظیفه اتوماسیون اجرا شد!            │
    │  📊 پیام‌های ریپلای: {{ replies }}     │
    │  💬 پیام‌های DM: {{ dms }}              │
    │  🎉 وضعیت: کامل                        │
    │  خروجی: پیام ارسال شد                   │
    └────────────────────────────────────────┘
         │
         ▼
      END (تمام)
```

---

## توضیح جزئی هر Node

### Node 1: Trigger/Webhook ⏱️

**مقصد:** شروع workflow
**نوع:** Webhook یا Timer
**نحوه کار:**
- Webhook: منتظر POST request در آدرس مشخص
- Timer: هر روز/هفته/ماه اجرا شود

**تنظیمات:**
```
Webhook URL: https://your-n8n.com/webhook/instagram-automation
Listen to: POST requests
```

---

### Node 2: Google Sheets Read 📊

**مقصد:** خواندن داده‌های پروژه از Sheets
**نوع:** Google Sheets
**ورودی:** Spreadsheet ID
**خروجی:** لیست rows از جدول

**تنظیمات:**
- Authentication: Google OAuth
- Spreadsheet: آیدی Sheets
- Sheet Name: "Automation Data"
- Range: A1:F100

**نمونه Sheets:**
| post_links | comment_criteria | reply_messages | dm_messages | must_follow | follow_message |
|---|---|---|---|---|---|
| ["url1"] | "#giveaway" | ["msg1","msg2"] | ["dm1"] | true | "فالو کنید" |

---

### Node 3: HTTP Request - Login 🔐

**مقصد:** ورود به اینستاگرام
**URL:** `http://backend:8000/api/auth/login/session`
**Method:** POST

**Body Mapping:**
```javascript
{
  "instagram_username": "{{ $node['Google Sheets'].json['username'] }}",
  "session_string": "{{ $env.INSTAGRAM_SESSION }}"
}
```

**Response Parser:**
```javascript
{{ $node['Auth'].json.session_id }}
```

---

### Node 4: HTTP Request - Setup Task 🛠️

**مقصد:** تنظیم وظیفه اتوماسیون
**URL:** `http://backend:8000/api/automation/setup`
**Method:** POST

**Body Mapping:**
```javascript
{
  "post_links": {{ JSON.parse($node['Google Sheets'].json.post_links) }},
  "comment_criteria": "{{ $node['Google Sheets'].json.comment_criteria }}",
  "reply_messages": {{ JSON.parse($node['Google Sheets'].json.reply_messages) }},
  "dm_messages": {{ JSON.parse($node['Google Sheets'].json.dm_messages) }},
  "must_follow": {{ $node['Google Sheets'].json.must_follow === 'TRUE' }},
  "follow_message": "{{ $node['Google Sheets'].json.follow_message }}"
}
```

**Extract Task ID:**
```javascript
{{ $node['Setup'].json.task_id }}
```

---

### Node 5: HTTP Request - Run Automation ▶️

**مقصد:** اجرای وظیفه اتوماسیون
**URL:** `http://backend:8000/api/automation/run`
**Method:** POST

**Body Mapping:**
```javascript
{
  "session_string": "{{ $env.INSTAGRAM_SESSION }}",
  "task_id": {{ $node['Setup'].json.task_id }}
}
```

**Results:**
```javascript
{
  "replies_sent": {{ $node['Run'].json.replies_sent }},
  "dms_sent": {{ $node['Run'].json.dms_sent }},
  "errors": {{ $node['Run'].json.errors }}
}
```

---

### Node 6: Set Variables (Optional) 📝

**مقصد:** پردازش و ذخیره نتایج
**نوع:** Set Node

**Variables:**
```javascript
// Variable 1: replies_count
{{ $node['Run'].json.replies_sent }}

// Variable 2: dms_count
{{ $node['Run'].json.dms_sent }}

// Variable 3: status
{{ $node['Run'].json.errors.length === 0 ? 'Success' : 'Completed with errors' }}
```

---

### Node 7: Send Notification 📢

**مقصد:** ارسال نتیجه نهایی
**نوع:** Telegram / Email / Slack
**پیام:**
```
✅ وظیفه اتوماسیون اجرا شد!

📊 آمار:
• پیام‌های ریپلای: {{ $node['Run'].json.replies_sent }}
• پیام‌های DM: {{ $node['Run'].json.dms_sent }}
• خطاها: {{ $node['Run'].json.errors.length }}

⏰ زمان: {{ new Date().toLocaleString('fa-IR') }}
```

---

## English

### 🔄 Complete Workflow Flow

```
START → WEBHOOK/TIMER → GOOGLE SHEETS → LOGIN → SETUP → RUN → PROCESS → NOTIFY → END
```

### Node-by-Node Explanation

**Node 1: Webhook Trigger**
- Purpose: Start the workflow
- Type: Webhook or Timer
- Input: POST request
- Output: Workflow activation

**Node 2: Google Sheets Read**
- Purpose: Fetch automation data
- Type: Google Sheets
- Input: Spreadsheet ID
- Output: Task configuration

**Node 3: Login**
- Purpose: Authenticate with Instagram
- Endpoint: /api/auth/login/session
- Method: POST
- Body: username, session_string

**Node 4: Setup Task**
- Purpose: Configure automation
- Endpoint: /api/automation/setup
- Method: POST
- Body: post_links, criteria, messages, etc.
- Output: task_id

**Node 5: Run Automation**
- Purpose: Execute the task
- Endpoint: /api/automation/run
- Method: POST
- Body: session_string, task_id
- Output: replies_sent, dms_sent

**Node 6: Process Results**
- Purpose: Store and format results
- Type: Set Node
- Variables: replies_count, dms_count, status

**Node 7: Send Notification**
- Purpose: Notify user
- Type: Telegram/Email/Slack
- Message: Formatted results

---

## خطاهای رایج و حل‌ها

### خطا: "Cannot read property of undefined"
**حل:** بررسی کنید که Google Sheets column names دقیق هستند

### خطا: "Invalid session string"
**حل:** session string خود را refresh کنید و دوباره تنظیم کنید

### خطا: "Task not found"
**حل:** task_id صحیح نیست یا گذشت زمان زیادی است

---
