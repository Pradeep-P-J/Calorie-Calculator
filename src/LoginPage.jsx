// LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "./LoginPage.css"
const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // In a real app, these would not be hardcoded but handled by a secure authentication service
  const correctUsername = "cc";
  const correctPassword = "password";

  useEffect(() => {
    // Check for saved credentials in localStorage if remember me was checked
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUsername(userData.username);
        setRememberMe(true);
      } catch (error) {
        console.error("Error parsing saved user data");
        localStorage.removeItem("rememberedUser");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    // Simulate API call with delay
    try {
      // In a real app, this would be a fetch call to an authentication API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (username === correctUsername && password === correctPassword) {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({ username }));
        } else {
          localStorage.removeItem("rememberedUser");
        }
        
        setIsLoggedIn(true);
        navigate("/calorie-counter");
      } else {
        setErrorMessage("Invalid username or password.");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="login-container">
      <h1>Login to Your Account</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            aria-required="true"
            aria-invalid={errorMessage && !username ? "true" : "false"}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            aria-required="true"
            aria-invalid={errorMessage && !password ? "true" : "false"}
          />
        </div>
        
        <div className="form-options">
          <div className="remember-me">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
        </div>
        
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
        
        <button 
          type="submit" 
          className="login-button" 
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner">Loading...</span>
          ) : (
            <>Start Today &gt;</>
          )}
        </button>
      </form>
      
      <div className="signup-prompt">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
};

export default LoginPage;