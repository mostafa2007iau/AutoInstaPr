import React, { useState } from 'react';
import './App.css';
import LoginComponent from './components/LoginComponent';
import AutomationDashboard from './components/AutomationDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSession, setUserSession] = useState(null);

  const handleLoginSuccess = (session) => {
    setUserSession(session);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserSession(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📱 Instagram Automation Tool</h1>
        <p>Similar to ManyChat - Free & Open Source</p>
      </header>
      
      {!isLoggedIn ? (
        <LoginComponent onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AutomationDashboard 
          session={userSession} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
