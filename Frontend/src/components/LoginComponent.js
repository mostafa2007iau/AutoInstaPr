import React, { useState } from 'react';

const LoginComponent = ({ onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState('session');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleSessionLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instagram_username: username,
          session_string: session,
        }),
      });

      if (response.ok) {
        onLoginSuccess(session);
      } else {
        setError('فارسی: خطا در ورود | English: Login failed');
      }
    } catch (err) {
      setError('فارسی: خطا در اتصال | English: Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJWTLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login/jwt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.access_token);
      } else {
        setError('فارسی: نام کاربری یا رمز عبور اشتباه است | English: Invalid credentials');
      }
    } catch (err) {
      setError('فارسی: خطا در اتصال | English: Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>📲 ورود | Login</h2>

        <div className="login-methods">
          <label>
            <input
              type="radio"
              value="jwt"
              checked={loginMethod === 'jwt'}
              onChange={(e) => setLoginMethod(e.target.value)}
            />
            ورود با نام کاربری و رمز عبور | Username & Password
          </label>
          <label>
            <input
              type="radio"
              value="session"
              checked={loginMethod === 'session'}
              onChange={(e) => setLoginMethod(e.target.value)}
            />
            ورود با Session | Session Login
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loginMethod === 'jwt' ? (
          <form onSubmit={handleJWTLogin}>
            <div className="form-group">
              <label>نام کاربری | Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>رمز عبور | Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'در حال ورود...' : 'ورود | Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSessionLogin}>
            <div className="form-group">
              <label>نام کاربری اینستاگرام | Instagram Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Session String:</label>
              <textarea
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="Paste your Instagram session string here"
                rows="4"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'در حال ورود...' : 'ورود | Login'}
            </button>
          </form>
        )}

        <div className="help-text">
          <p>نیاز به کمک دارید؟ | Need help?</p>
          <p>برای دریافت Session String خود، از ابزار ورود مستقیم استفاده کنید یا مستندات را بخوانید.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
