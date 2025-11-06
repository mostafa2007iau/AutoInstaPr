import React, { useState } from 'react';

const AutomationDashboard = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [postLinks, setPostLinks] = useState(['']);
  const [commentCriteria, setCommentCriteria] = useState('');
  const [replyMessages, setReplyMessages] = useState(['']);
  const [dmMessages, setDmMessages] = useState(['']);
  const [mustFollow, setMustFollow] = useState(false);
  const [followMessage, setFollowMessage] = useState('برای دریافت پیام، صفحه را فالو کنید.');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleAddField = (field, value) => {
    if (field === 'postLinks') {
      setPostLinks([...postLinks, '']);
    } else if (field === 'replyMessages') {
      setReplyMessages([...replyMessages, '']);
    } else if (field === 'dmMessages') {
      setDmMessages([...dmMessages, '']);
    }
  };

  const handleRemoveField = (field, index) => {
    if (field === 'postLinks') {
      setPostLinks(postLinks.filter((_, i) => i !== index));
    } else if (field === 'replyMessages') {
      setReplyMessages(replyMessages.filter((_, i) => i !== index));
    } else if (field === 'dmMessages') {
      setDmMessages(dmMessages.filter((_, i) => i !== index));
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/automation/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_links: postLinks.filter(link => link.trim()),
          comment_criteria: commentCriteria,
          reply_messages: replyMessages.filter(msg => msg.trim()),
          dm_messages: dmMessages.filter(msg => msg.trim()),
          must_follow: mustFollow,
          follow_message: followMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ وظیفه با موفقیت ایجاد شد | Task created: ${data.task_id}`);
        // Reset form
        setPostLinks(['']);
        setCommentCriteria('');
        setReplyMessages(['']);
        setDmMessages(['']);
      } else {
        setMessage('❌ خطا در ایجاد وظیفه | Error creating task');
      }
    } catch (err) {
      setMessage('❌ خطا: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTask = async (taskId) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/automation/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_string: session,
          task_id: taskId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ وظیفه اجرا شد | Task completed: Replies: ${data.replies_sent}, DMs: ${data.dms_sent}`);
      } else {
        setMessage('❌ خطا در اجرای وظیفه | Error running task');
      }
    } catch (err) {
      setMessage('❌ خطا: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>📊 داشبورد اتوماسیون | Automation Dashboard</h2>
        <button onClick={onLogout} className="logout-btn">خروج | Logout</button>
      </header>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ایجاد وظیفه | Create Task
        </button>
        <button
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          مدیریت وظایف | Manage Tasks
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleCreateTask} className="create-task-form">
          <div className="form-section">
            <h3>1️⃣ لینک‌های پست | Post Links</h3>
            {postLinks.map((link, index) => (
              <div key={index} className="field-group">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => {
                    const newLinks = [...postLinks];
                    newLinks[index] = e.target.value;
                    setPostLinks(newLinks);
                  }}
                  placeholder="https://instagram.com/p/..."
                />
                {postLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('postLinks', index)}
                    className="remove-btn"
                  >
                    حذف | Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('postLinks')}
              className="add-btn"
            >
              + افزودن لینک | Add Link
            </button>
          </div>

          <div className="form-section">
            <h3>2️⃣ شروط کامنت | Comment Criteria</h3>
            <textarea
              value={commentCriteria}
              onChange={(e) => setCommentCriteria(e.target.value)}
              placeholder="مثال: #giveaway, @mention (جدا با کاما)"
              rows="3"
              required
            />
          </div>

          <div className="form-section">
            <h3>3️⃣ پیام‌های ریپلای | Reply Messages</h3>
            {replyMessages.map((msg, index) => (
              <div key={index} className="field-group">
                <textarea
                  value={msg}
                  onChange={(e) => {
                    const newMessages = [...replyMessages];
                    newMessages[index] = e.target.value;
                    setReplyMessages(newMessages);
                  }}
                  placeholder="پیام پاسخ"
                  rows="2"
                />
                {replyMessages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('replyMessages', index)}
                    className="remove-btn"
                  >
                    حذف | Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('replyMessages')}
              className="add-btn"
            >
              + افزودن پیام | Add Message
            </button>
          </div>

          <div className="form-section">
            <h3>4️⃣ پیام‌های DM | Direct Messages</h3>
            {dmMessages.map((msg, index) => (
              <div key={index} className="field-group">
                <textarea
                  value={msg}
                  onChange={(e) => {
                    const newMessages = [...dmMessages];
                    newMessages[index] = e.target.value;
                    setDmMessages(newMessages);
                  }}
                  placeholder="پیام مستقیم"
                  rows="2"
                />
                {dmMessages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('dmMessages', index)}
                    className="remove-btn"
                  >
                    حذف | Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('dmMessages')}
              className="add-btn"
            >
              + افزودن پیام | Add Message
            </button>
          </div>

          <div className="form-section">
            <h3>5️⃣ الزامی‌سازی فالو | Require Follow</h3>
            <label>
              <input
                type="checkbox"
                checked={mustFollow}
                onChange={(e) => setMustFollow(e.target.checked)}
              />
              آیا باید کاربر صفحه را فالو کند؟ | Must follow page?
            </label>
            {mustFollow && (
              <textarea
                value={followMessage}
                onChange={(e) => setFollowMessage(e.target.value)}
                placeholder="پیام برای کاربرانی که فالو نکردند"
                rows="2"
              />
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'در حال ایجاد...' : 'ایجاد وظیفه | Create Task'}
          </button>
        </form>
      )}

      {activeTab === 'manage' && (
        <div className="manage-tasks-section">
          <h3>وظایف فعال | Active Tasks</h3>
          <button onClick={() => handleRunTask(1)} disabled={loading}>
            {loading ? 'در حال اجرا...' : 'اجرای وظیفه | Run Task'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AutomationDashboard;
