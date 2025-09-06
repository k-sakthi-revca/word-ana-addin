import * as React from "react";
import { useState } from "react";
import AuthService from "../services/authService";
import authStateManager from "../utils/authStateManager";
import { 
  Button, 
  Input,
  tokens, 
  makeStyles,
  Spinner
} from "@fluentui/react-components";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    height: "100vh",
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, #FF6B33 100%)`,
  },
  loginForm: {
    width: "400px",
    margin: "auto",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logoImage: {
    width: "80px",
    height: "80px",
    marginBottom: "15px",
  },
  loginHeading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "8px",
    color: tokens.colorNeutralForeground1,
  },
  loginSubhead: {
    fontSize: "14px",
    color: tokens.colorNeutralForeground3,
    marginBottom: "30px",
  },
  inputContainer: {
    position: "relative",
    marginBottom: "24px",
  },
  inputField: {
    width: "100%",
    padding: "12px 40px 12px 12px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "6px",
    fontSize: "14px",
    "::placeholder": {
      color: tokens.colorNeutralForeground4,
    },
    ":focus": {
      outline: "none",
      borderTopColor: tokens.colorBrandBackground,
      borderRightColor: tokens.colorBrandBackground,
      borderBottomColor: tokens.colorBrandBackground,
      borderLeftColor: tokens.colorBrandBackground,
      boxShadow: `0 0 0 3px ${tokens.colorBrandBackgroundAlpha30}`,
    },
  },
  inputIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: tokens.colorNeutralForeground4,
    cursor: "pointer",
  },
  errorText: {
    color: tokens.colorStatusDangerForeground1,
    fontSize: "14px",
    marginBottom: "16px",
  },
  loginButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: tokens.colorBrandBackground,
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
    ":disabled": {
      backgroundColor: tokens.colorNeutralBackgroundDisabled,
      cursor: "not-allowed",
    },
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
    color: tokens.colorNeutralForeground4,
    "::before, ::after": {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    "::before": {
      marginRight: "10px",
    },
    "::after": {
      marginLeft: "10px",
    },
  },
  footerText: {
    textAlign: "center",
    fontSize: "12px",
    color: tokens.colorNeutralForeground4,
    marginTop: "20px",
  },
});

const Login = ({ setIsAuthenticated, setIsSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const styles = useStyles();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError("");
    
    // Validate email format
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Call the AuthService login method
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        console.log("Login successful");
        setIsAuthenticated(true);
        // Broadcast authentication state to all tabs
        authStateManager.broadcastAuthState(true);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
      
      // If there's a network error, provide a more user-friendly message
      if (error.message.includes("Network Error")) {
        setError("Unable to connect to the server. Please check your internet connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    // Google sign-in implementation would go here
    console.log("Google sign-in would be implemented here");
    // Note: alert() is not supported in Office Add-ins
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.loginForm}>
        <div className={styles.logoContainer}>
          <img 
            className={styles.logoImage} 
            src="assets/Ana_logo.png" 
            alt="Ana Logo" 
          />
          <h1 className={styles.loginHeading}>OpenAna</h1>
          <p className={styles.loginSubhead}>Welcome back! Please enter your details</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className={styles.inputContainer}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="Email"
              contentBefore={<span>📧</span>}
            />
          </div>

          <div className={styles.inputContainer}>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your password"
              contentAfter={
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              }
            />
          </div>

          {error && <div className={styles.errorText}>{error}</div>}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="tiny" /> : "Login"}
          </button>
        </form>

        {/* <div className={styles.divider}>or</div>

        <Button 
          appearance="outline" 
          style={{ width: "100%" }}
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button> */}

        {/* <p className={styles.footerText}>
          Don't have an account?{" "}
          <span 
            style={{ color: tokens.colorBrandBackground, cursor: "pointer" }}
            onClick={() => setIsSignUp(true)}
          >
            Sign up
          </span>
        </p> */}
      </div>
    </div>
  );
};

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setIsSignUp: PropTypes.func,
};

export default Login;
