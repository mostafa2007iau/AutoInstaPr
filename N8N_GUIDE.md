# راهنمای استفاده n8n | n8n Integration Guide

## فارسی

### 📌 مقدمه
این راهنما نحوه اتصال n8n با backend اتوماسیون اینستاگرام را توضیح می‌دهد. با استفاده از این راهنما می‌توانید workflow پیچیده‌تری برای خودکارسازی‌های اینستاگرام ایجاد کنید.

---

## مرحله 1️⃣: راه‌اندازی Environment Variables

ابتدا متغیرهای محیطی را تنظیم کنید:

```env
BACKEND_URL=http://localhost:8000
API_KEY=your_api_key
INSTAGRAM_SESSION=your_session_string
```

---

## مرحله 2️⃣: ایجاد Workflow n8n

### 2.1 - Node 1: Trigger/Webhook

```
┌─────────────────────────────────┐
│  Webhook Node                   │
│  ┌─────────────────────────────┐│
│  │ POST /instagram-automation  ││
│  │                             ││
│  │ Body:                       ││
│  │ {                           ││
│  │   "action": "setup"         ││
│  │ }                           ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### 2.2 - Node 2: Google Sheets (دریافت داده)

```
┌─────────────────────────────────────┐
│  Google Sheets Node                 │
│  ┌─────────────────────────────────┐│
│  │ Authentication: Google OAuth    ││
│  │ Spreadsheet: Your Sheet ID      ││
│  │ Read Rows                       ││
│  │                                 ││
│  │ Columns:                        ││
│  │ 1. Post Links                   ││
│  │ 2. Comment Criteria             ││
│  │ 3. Reply Messages               ││
│  │ 4. DM Messages                  ││
│  │ 5. Must Follow                  ││
│  │ 6. Follow Message               ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**تنظیمات:**

| Setting | Value |
|---------|-------|
| Google Account | Your Google Account |
| Spreadsheet ID | `{{ env.SHEETS_ID }}` |
| Sheet Name | Automation Data |
| Read Range | A:F |

---

### 2.3 - Node 3: HTTP Request - Login

```
┌──────────────────────────────────┐
│  HTTP Request Node               │
│  ┌──────────────────────────────┐│
│  │ URL:                         ││
│  │ http://localhost:8000/       ││
│  │ api/auth/login/session       ││
│  │                              ││
│  │ Method: POST                 ││
│  │                              ││
│  │ Body:                        ││
│  │ {                            ││
│  │   "instagram_username": ...  ││
│  │   "session_string": ...      ││
│  │ }                            ││
│  └──────────────────────────────┘│
└──────────────────────────────────┘
```

**تنظیمات:**
```
URL: {{ $env.BACKEND_URL }}/api/auth/login/session
Authentication: None
Method: POST
Body (JSON):
{
  "instagram_username": "{{ $node['Google Sheets'].json['instagram_username'] }}",
  "session_string": "{{ $env.INSTAGRAM_SESSION }}"
}
```

---

### 2.4 - Node 4: HTTP Request - Setup Task

```
┌────────────────────────────────────┐
│  HTTP Request Node (Setup)         │
│  ┌────────────────────────────────┐│
│  │ URL:                           ││
│  │ http://localhost:8000/         ││
│  │ api/automation/setup           ││
│  │                                ││
│  │ Method: POST                   ││
│  │                                ││
│  │ Headers:                       ││
│  │ Content-Type: application/json ││
│  │                                ││
│  │ Body:                          ││
│  │ { Task Configuration ... }     ││
│  └────────────────────────────────┘│
└────────────────────────────────────┘
```

**تنظیمات:**
```
URL: {{ $env.BACKEND_URL }}/api/automation/setup

Body (JSON):
{
  "post_links": {{ JSON.parse($node['Google Sheets'].json['post_links']) }},
  "comment_criteria": "{{ $node['Google Sheets'].json['comment_criteria'] }}",
  "reply_messages": {{ JSON.parse($node['Google Sheets'].json['reply_messages']) }},
  "dm_messages": {{ JSON.parse($node['Google Sheets'].json['dm_messages']) }},
  "must_follow": {{ $node['Google Sheets'].json['must_follow'] }},
  "follow_message": "{{ $node['Google Sheets'].json['follow_message'] }}"
}
```

---

### 2.5 - Node 5: HTTP Request - Run Automation

```
┌────────────────────────────────────┐
│  HTTP Request Node (Run)           │
│  ┌────────────────────────────────┐│
│  │ URL:                           ││
│  │ http://localhost:8000/         ││
│  │ api/automation/run             ││
│  │                                ││
│  │ Method: POST                   ││
│  │                                ││
│  │ Body:                          ││
│  │ {                              ││
│  │   "session_string": ...,       ││
│  │   "task_id": ...               ││
│  │ }                              ││
│  └────────────────────────────────┘│
└────────────────────────────────────┘
```

**تنظیمات:**
```
URL: {{ $env.BACKEND_URL }}/api/automation/run

Body (JSON):
{
  "session_string": "{{ $env.INSTAGRAM_SESSION }}",
  "task_id": {{ $node['HTTP Request - Setup'].json['task_id'] }}
}
```

---

### 2.6 - Node 6: Result Processing

```
┌──────────────────────────────────────┐
│  Set Node (Process Results)          │
│  ┌──────────────────────────────────┐│
│  │ Set Variables:                   ││
│  │                                  ││
│  │ replies_sent =                   ││
│  │ {{ $node['HTTP Request -        ││
│  │    Run'].json['replies_sent'] }} ││
│  │                                  ││
│  │ dms_sent =                       ││
│  │ {{ $node['HTTP Request -        ││
│  │    Run'].json['dms_sent'] }}     ││
│  │                                  ││
│  │ status = "completed"             ││
│  └──────────────────────────────────┘│
└──────────────────────────────────────┘
```

---

### 2.7 - Node 7: Notification

```
┌─────────────────────────────────┐
│  Telegram/Email Node            │
│  ┌─────────────────────────────┐│
│  │ Send Message:               ││
│  │                             ││
│  │ "وظیفه اتمام یافت!         ││
│  │  ✅ پیام‌های ریپلای:      ││
│  │  {{ $json['replies_sent'] }}││
│  │  ✅ پیام‌های DM:           ││
│  │  {{ $json['dms_sent'] }}"   ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

## مثال Workflow کامل

```
[Trigger: Webhook]
         ↓
[Google Sheets: Read Data]
         ↓
[HTTP: Login to Instagram]
         ↓
[HTTP: Setup Automation Task]
         ↓
[HTTP: Run Automation]
         ↓
[Set Variables: Process Results]
         ↓
[Notification: Send Result]
```

---

## 🔍 Debugging و Troubleshooting

### Problem 1: خطا در اتصال به Backend
**حل:** پورت backend را بررسی کنید (پیش‌فرض: 8000)
```bash
curl http://localhost:8000/health
```

### Problem 2: خطا در دریافت داده از Sheets
**حل:** Google OAuth token را تازه‌سازی کنید و صفحه را مجدد کنیم.

### Problem 3: خطا در اجرای وظیفه
**حل:** لاگ‌های Backend را بررسی کنید:
```bash
docker-compose logs backend
```

---

---

## English

### 📌 Introduction
This guide explains how to connect n8n with the Instagram Automation backend. Using this guide, you can create more complex workflows for Instagram automations.

---

## Step 1️⃣: Setup Environment Variables

First, set up the environment variables:

```env
BACKEND_URL=http://localhost:8000
API_KEY=your_api_key
INSTAGRAM_SESSION=your_session_string
```

---

## Step 2️⃣: Create n8n Workflow

### 2.1 - Node 1: Webhook Trigger

```
┌─────────────────────────────────┐
│  Webhook Node                   │
│  ┌─────────────────────────────┐│
│  │ POST /instagram-automation  ││
│  │                             ││
│  │ Listen on:                  ││
│  │ POST /instagram-automation  ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### 2.2 - Node 2: Google Sheets (Read Data)

```
┌─────────────────────────────────────┐
│  Google Sheets Node                 │
│  ┌─────────────────────────────────┐│
│  │ Columns to Read:                ││
│  │ 1. post_links                   ││
│  │ 2. comment_criteria             ││
│  │ 3. reply_messages               ││
│  │ 4. dm_messages                  ││
│  │ 5. must_follow                  ││
│  │ 6. follow_message               ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### 2.3 - Node 3: HTTP Request - Login

**URL:** `{{ $env.BACKEND_URL }}/api/auth/login/session`
**Method:** POST

**Body:**
```json
{
  "instagram_username": "{{ $node['Google Sheets'].json['username'] }}",
  "session_string": "{{ $env.INSTAGRAM_SESSION }}"
}
```

---

### 2.4 - Node 4: HTTP Request - Setup Task

**URL:** `{{ $env.BACKEND_URL }}/api/automation/setup`
**Method:** POST

**Body:**
```json
{
  "post_links": {{ JSON.parse($node['Google Sheets'].json['post_links']) }},
  "comment_criteria": "{{ $node['Google Sheets'].json['comment_criteria'] }}",
  "reply_messages": {{ JSON.parse($node['Google Sheets'].json['reply_messages']) }},
  "dm_messages": {{ JSON.parse($node['Google Sheets'].json['dm_messages']) }},
  "must_follow": {{ $node['Google Sheets'].json['must_follow'] }},
  "follow_message": "{{ $node['Google Sheets'].json['follow_message'] }}"
}
```

---

### 2.5 - Node 5: HTTP Request - Run Automation

**URL:** `{{ $env.BACKEND_URL }}/api/automation/run`
**Method:** POST

**Body:**
```json
{
  "session_string": "{{ $env.INSTAGRAM_SESSION }}",
  "task_id": {{ $node['HTTP Request - Setup'].json['task_id'] }}
}
```

---

### 2.6 - Node 6: Process Results

Set output variables:
```
replies_sent = {{ $node['HTTP Request - Run'].json['replies_sent'] }}
dms_sent = {{ $node['HTTP Request - Run'].json['dms_sent'] }}
status = "completed"
```

---

### 2.7 - Node 7: Send Notification

**Telegram/Email Message:**
```
"Task Completed!
✅ Replies Sent: {{ $json['replies_sent'] }}
✅ DMs Sent: {{ $json['dms_sent'] }}"
```

---

## Complete Workflow Flow

```
[Webhook Trigger]
       ↓
[Read Google Sheets]
       ↓
[Login to Instagram]
       ↓
[Setup Automation Task]
       ↓
[Run Automation]
       ↓
[Process Results]
       ↓
[Send Notification]
```

---

## 🔍 Debugging & Troubleshooting

### Issue 1: Cannot connect to Backend
**Solution:** Check backend port (default: 8000)
```bash
curl http://localhost:8000/health
```

### Issue 2: Error reading from Google Sheets
**Solution:** Refresh Google OAuth token

### Issue 3: Task execution failed
**Solution:** Check backend logs
```bash
docker-compose logs backend
```

---
