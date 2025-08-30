import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
import AIAssistance from "./AIAssistance";
import Login from "./Login";
import { makeStyles } from "@fluentui/react-components";
import { 
  Ribbon24Regular, 
  LockOpen24Regular, 
  DesignIdeas24Regular, 
  Sparkle24Regular 
} from "@fluentui/react-icons";
import { insertText } from "../taskpane";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App = (props) => {
  const { title } = props;
  const styles = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authenticated = localStorage.getItem("anaUserAuthenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

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
    {
      icon: <Sparkle24Regular />,
      primaryText: "AI-powered content creation and enhancement",
    },
  ];

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} setIsSignUp={setIsSignUp} />;
  }

  // Show main app if authenticated
  return (
    <div className={styles.root}>
      {/* <Header logo="assets/Ana_logo.png" title={title} message="Welcome" /> */}
      {/* <HeroList message="Discover what this add-in can do for you today!" items={listItems} /> */}
      <AIAssistance insertText={insertText} />
      {/* <TextInsertion insertText={insertText} /> */}
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;