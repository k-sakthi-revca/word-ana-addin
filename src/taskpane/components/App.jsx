import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { Spinner } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import AIAssistance from "./AIAssistant/index";
import Login from "./Login";
import Settings from "./Settings";
import AuthService from "../services/authService";
import authStateManager from "../utils/authStateManager";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App = (props) => {
  const { title } = props;
  const styles = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentTaskpane, setCurrentTaskpane] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  
  // The list items are static and won't change at runtime,
  // so this should be an ordinary const, not a part of state.
  const listItems = [
    {
      icon: <Ribbon24Regular />,
      primaryText: "Achieve more with Office integration",
    },
    {
      icon: <LockOpen24Regular />,
      primaryText: "Unlock features and functionality",
    },
    {
      icon: <DesignIdeas24Regular />,
      primaryText: "Create and visualize like a pro",
    },
  ];

  // Check for authentication and get taskpane ID on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      if (AuthService.isAuthenticated()) {
        // Get user data
        const userData = AuthService.getCurrentUser();
        console.log("User authenticated:", userData);
        setIsAuthenticated(true);
      }
      
      // Get taskpane ID from Office context
      if (Office && Office.context) {
        // In a real implementation, we would get the taskpaneId from Office context
        // For mock purposes, we'll extract it from the URL if available
        const urlParams = new URLSearchParams(window.location.search);
        let taskpaneId = urlParams.get("taskpaneId");
        
        // If no taskpaneId in URL, check if we can determine it from the ribbon button that was clicked
        if (!taskpaneId && Office.context.ribbon) {
          // This is a mock implementation - in a real add-in, you would use the Office JS API
          // to get information about which ribbon button was clicked
          console.log("Checking ribbon context...");
        }
        
        // If we still don't have a taskpaneId, use the default
        taskpaneId = taskpaneId || "default";
        console.log("Setting taskpaneId:", taskpaneId);
        setCurrentTaskpane(taskpaneId);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Add listener for authentication state changes
    const removeListener = authStateManager.addListener((isAuthenticated) => {
      console.log("Auth state changed:", isAuthenticated);
      setIsAuthenticated(isAuthenticated);
    });
    
    // Clean up listener on unmount
    return () => {
      removeListener();
    };
  }, []);

  // If still loading, show a simple loading state
  if (isLoading) {
    return <div style={{ minHeight:"100vh", display: "flex", justifyContent: "center", padding: "20px" }}>
      <Spinner size="extra-large" />
    </div>
  }

  // If not authenticated and not on the login taskpane, redirect to login
  if (!isAuthenticated && currentTaskpane !== "TaskpaneLogin") {
    return <Login setIsAuthenticated={setIsAuthenticated} setIsSignUp={setIsSignUp} />;
  }

  // Render the appropriate component based on the taskpane ID
  const renderTaskpane = () => {
    switch (currentTaskpane) {
      case "TaskpaneLogin":
        return <Login setIsAuthenticated={setIsAuthenticated} setIsSignUp={setIsSignUp} />;
           
      case "TaskpaneRewrite":
        return <AIAssistance initialTask="Rewrite" />;
      
      case "TaskpaneSummarize":
        return <AIAssistance initialTask="Summarize" />;
      
      case "TaskpaneInsert":
        return <AIAssistance initialTask="Insert" />;
      
      case "TaskpaneSettings":
        return <Settings />;
      
      default:
        return <AIAssistance />;
    }
  };

  return (
    <div className={styles.root}>
      {renderTaskpane()}
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
