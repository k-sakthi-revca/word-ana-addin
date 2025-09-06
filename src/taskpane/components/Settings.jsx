import * as React from "react";
import { useState, useEffect } from "react";
import { 
  makeStyles, 
  tokens,
  Button,
  Divider,
  Switch,
  Text,
  Label,
  RadioGroup,
  Radio,
  Avatar
} from "@fluentui/react-components";
import { 
  CheckmarkCircle16Filled,
  DismissCircle16Filled,
  SignOut24Regular
} from "@fluentui/react-icons";
import Header from "./Header";
import AuthService from "../services/authService";

// Create styles for the Settings component
const useStyles = makeStyles({
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: tokens.colorNeutralForeground1,
    marginBottom: "12px",
  },
  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    padding: "8px 0",
  },
  settingLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  settingControl: {
    minWidth: "200px",
  },
  userInfoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "8px",
    marginBottom: "24px",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  userName: {
    fontSize: "16px",
    fontWeight: "600",
    color: tokens.colorNeutralForeground1,
  },
  userEmail: {
    fontSize: "14px",
    color: tokens.colorNeutralForeground3,
  },
  logoutButton: {
    marginLeft: "auto",
    color: "#ef4444",
    ":hover": {
      backgroundColor: "#fee2e2",
    },
  },
  saveButton: {
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: "600",
    marginTop: "24px",
    height: "44px",
    borderRadius: "6px",
    fontSize: "16px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#ef4444",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(37, 99, 235, 0.2)",
    },
    ":active": {
      transform: "translateY(0)",
    },
  },
  notification: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
    zIndex: 1000,
  },
  successNotification: {
    backgroundColor: tokens.colorStatusSuccessBackground1,
    color: tokens.colorStatusSuccessForeground1,
  },
  errorNotification: {
    backgroundColor: tokens.colorStatusDangerBackground1,
    color: tokens.colorStatusDangerForeground1,
  },
  description: {
    fontSize: "14px",
    color: tokens.colorNeutralForeground3,
    marginBottom: "16px",
  },
});

const Settings = () => {
  const styles = useStyles();
  
  // Define settings state
  const [settings, setSettings] = useState({
    theme: "light",
  });
  
  // User info state
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  
  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" // or "error"
  });
  
  // Load settings and user info on component mount
  useEffect(() => {
    // Load settings
    const savedSettings = localStorage.getItem("anaSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
    
    // Load user info from AuthService
    const userData = AuthService.getCurrentUser();
    if (userData) {
      // Get user info from userData
      const email = userData.email || localStorage.getItem("anaUserEmail");
      
      // Generate a name if not available in userData
      let name = userData.name || userData.full_name;
      if (!name && email) {
        name = email.split('@')[0]
          .split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
      
      setUserInfo({
        name,
        email
      });
    } else {
      // Fallback to localStorage
      const userEmail = localStorage.getItem("anaUserEmail");
      if (userEmail) {
        const name = userEmail.split('@')[0]
          .split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        
        setUserInfo({
          name,
          email: userEmail
        });
      }
    }
  }, []);
  
  // Handle theme change
  const handleThemeChange = (e, data) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      theme: data.value
    }));
  };
  
  // Save settings
  const saveSettings = () => {
    try {
      localStorage.setItem("anaSettings", JSON.stringify(settings));
      showNotification("Settings saved successfully!", "success");
    } catch (error) {
      console.error("Failed to save settings:", error);
      showNotification("Failed to save settings. Please try again.", "error");
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      // Show notification first for better UX
      showNotification("Logging out...", "success");
      
      // Call the AuthService logout method
      await AuthService.logout();
      
      // Redirect to login page (in a real app, you might use a router)
      // For now, we'll just reload the page which should redirect to login
      // based on the App component logic
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      showNotification("Failed to logout. Please try again.", "error");
    }
  };
  
  // Show notification
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };
  
  return (
    <div>
      <div className={styles.container}>
        {/* User Information */}
        <div className={styles.userInfoContainer}>
          <Avatar 
            name={userInfo.name} 
            size={40} 
            color="colorful"
          />
          <div className={styles.userDetails}>
            <Text className={styles.userName}>{userInfo.name}</Text>
            <Text className={styles.userEmail}>{userInfo.email}</Text>
          </div>
          <Button 
            icon={<SignOut24Regular />}
            appearance="subtle"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
        
        {/* Theme Settings */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>Theme Settings</Text>
          <Divider />
          
          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <Label>Theme</Label>
            </div>
            <div className={styles.settingControl}>
              <RadioGroup
                value={settings.theme}
                onChange={handleThemeChange}
              >
                <Radio value="light" label="Light" />
                <Radio value="dark" label="Dark" />
                <Radio value="system" label="System Default" />
              </RadioGroup>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <Button className={styles.saveButton} onClick={saveSettings}>
          Save Settings
        </Button>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div className={`${styles.notification} ${notification.type === 'success' ? styles.successNotification : styles.errorNotification}`}>
          {notification.type === 'success' ? <CheckmarkCircle16Filled /> : <DismissCircle16Filled />}
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Settings;
