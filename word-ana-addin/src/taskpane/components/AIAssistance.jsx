import * as React from "react";
import { useState } from "react";
import { 
  Button, 
  Field, 
  Textarea, 
  tokens, 
  makeStyles, 
  Select,
  Option,
  Input,
  Spinner
} from "@fluentui/react-components";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #ef4444 0%, #FF6B33 100%)",
    color: "white",
  },
  headerContent: {
    marginLeft: "15px",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "5px",
  },
  headerSubtitle: {
    opacity: 0.9,
  },
  mainContent: {
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  aiFeature: {
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  },
  featureTitle: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
  },
  featureIcon: {
    marginRight: "10px",
  },
  featureDescription: {
    marginBottom: "15px",
    color: "#6b7280",
  },
  inputField: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
    resize: "vertical",
    minHeight: "100px",
    ":focus": {
      outline: "none",
      borderColor: "#ef4444",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)",
    },
  },
  selectField: {
    width: "100%",
    padding: "10px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
    backgroundColor: "white",
  },
  outputSection: {
    marginTop: "20px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "6px",
    borderLeft: "4px solid #ef4444",
  },
  outputTitle: {
    marginBottom: "10px",
    color: "#ef4444",
  },
  outputContent: {
    background: "white",
    padding: "15px",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
    minHeight: "100px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  documentPreview: {
    marginTop: "20px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  },
  previewTitle: {
    marginBottom: "10px",
    color: "#ef4444",
    fontSize: "16px",
  },
  previewContent: {
    background: "white",
    padding: "15px",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
    minHeight: "100px",
    maxHeight: "200px",
    overflowY: "auto",
    fontFamily: "'Times New Roman', serif",
    fontSize: "12pt",
    lineHeight: "1.5",
  },
  buttonGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  footer: {
    padding: "20px",
    textAlign: "center",
    background: "#f9fafb",
    color: "#6b7280",
    fontSize: "14px",
    borderTop: "1px solid #e5e7eb",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  previewTabs: {
    display: "flex",
    gap: "10px",
  },
  previewTab: {
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  activeTab: {
    background: "#ef4444",
    color: "white",
  },
  inactiveTab: {
    background: "#e5e7eb",
    color: "#6b7280",
  },
});

const AIAssistance = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [textToEnhance, setTextToEnhance] = useState("");
  const [textToSummarize, setTextToSummarize] = useState("");
  const [contentType, setContentType] = useState("");
  const [tone, setTone] = useState("");
  const [enhancementType, setEnhancementType] = useState("improve");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [generatedContent, setGeneratedContent] = useState("");
  const [enhancedContent, setEnhancedContent] = useState("");
  const [summaryContent, setSummaryContent] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [previewMode, setPreviewMode] = useState("preview"); // preview or code

  const styles = useStyles();

  const simulateAPICall = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  };

  const handleGenerateContent = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    setActiveFeature("generate");
    
    await simulateAPICall();
    
    // Mock generated content
    const content = "Artificial intelligence is transforming how we create and interact with content. These advanced systems can now generate human-like text, provide insightful recommendations, and enhance existing content with unprecedented accuracy. By leveraging large language models, AI writing assistants help users overcome creative blocks, improve communication effectiveness, and save valuable time in the content creation process.";
    
    setGeneratedContent(content);
    setIsLoading(false);
  };

  const handleEnhanceContent = async () => {
    if (!textToEnhance) return;
    
    setIsLoading(true);
    setActiveFeature("enhance");
    
    await simulateAPICall();
    
    // Mock enhancement
    let enhancedText = textToEnhance;
    if (enhancementType === "improve") {
      enhancedText = textToEnhance + " This enhanced version demonstrates clearer communication and more effective presentation of ideas, ensuring your message resonates with your intended audience.";
    } else if (enhancementType === "expand") {
      enhancedText = textToEnhance + " When we consider the broader implications of this concept, we find that it intersects with numerous contemporary issues and challenges. Expanding upon this idea reveals connections to technological advancement, societal evolution, and economic factors that collectively shape our understanding of this topic.";
    }
    
    setEnhancedContent(enhancedText);
    setIsLoading(false);
  };

  const handleSummarizeContent = async () => {
    if (!textToSummarize) return;
    
    setIsLoading(true);
    setActiveFeature("summarize");
    
    await simulateAPICall();
    
    // Mock summary
    const summary = "This text discusses the importance of AI writing assistants in modern content creation. It highlights how these tools can generate human-like text, provide recommendations, and enhance existing content, ultimately saving time and improving communication effectiveness.";
    
    setSummaryContent(summary);
    setIsLoading(false);
  };

  const handleAnalyzeDocument = async () => {
    setIsLoading(true);
    setActiveFeature("analyze");
    
    await simulateAPICall();
    
    // Mock recommendations
    const mockRecommendations = [
      "Consider adding more transition words to improve flow",
      "The document could benefit from more specific examples",
      "Some sentences are quite long - try breaking them up for readability",
      "The introduction could be more engaging to capture reader attention"
    ];
    
    setRecommendations(mockRecommendations);
    setIsLoading(false);
  };

  const insertGeneratedContent = () => {
    if (generatedContent) {
      props.insertText(generatedContent);
    }
  };

  const insertEnhancedContent = () => {
    if (enhancedContent) {
      props.insertText(enhancedContent);
    }
  };

  const insertSummary = () => {
    if (summaryContent) {
      props.insertText(summaryContent);
    }
  };

  const regenerateContent = () => {
    setGeneratedContent("");
    handleGenerateContent();
  };

  const revertEnhancement = () => {
    setEnhancedContent(textToEnhance);
  };

  // Function to get current content based on active feature
  const getCurrentContent = () => {
    switch (activeFeature) {
      case "generate":
        return generatedContent;
      case "enhance":
        return enhancedContent;
      case "summarize":
        return summaryContent;
      default:
        return "";
    }
  };

  // Function to render content preview
  const renderContentPreview = () => {
    const content = getCurrentContent();
    if (!content) return null;

    return (
      <div className={styles.documentPreview}>
        <div className={styles.previewHeader}>
          <h4 className={styles.previewTitle}>Document Preview</h4>
          <div className={styles.previewTabs}>
            <div 
              className={`${styles.previewTab} ${previewMode === "preview" ? styles.activeTab : styles.inactiveTab}`}
              onClick={() => setPreviewMode("preview")}
            >
              Preview
            </div>
            <div 
              className={`${styles.previewTab} ${previewMode === "code" ? styles.activeTab : styles.inactiveTab}`}
              onClick={() => setPreviewMode("code")}
            >
              Code
            </div>
          </div>
        </div>
        
        {previewMode === "preview" ? (
          <div className={styles.previewContent}>
            {content}
          </div>
        ) : (
          <div className={styles.previewContent} style={{ fontFamily: 'monospace', fontSize: '11pt' }}>
            {content.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="assets/Ana_logo.png" alt="Ana Logo" width="60" height="60" />
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Ana Writing Assistant</h1>
          <p className={styles.headerSubtitle}>Enhance your document with Ana</p>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.aiFeature}>
          <h3 className={styles.featureTitle}>
            <span className={styles.featureIcon}>✨</span>
            Generate Content
          </h3>
          <p className={styles.featureDescription}>
            Create new content based on your topic and requirements.
          </p>
          <Input
            className={styles.inputField}
            style={{ minHeight: "auto" }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter topic or prompt..."
          />
          <Select
            className={styles.selectField}
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <Option value="">Select content type</Option>
            <Option value="paragraph">Paragraph</Option>
            <Option value="email">Email</Option>
            <Option value="report">Report Section</Option>
            <Option value="blog">Blog Post</Option>
          </Select>
          <Select
            className={styles.selectField}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <Option value="">Select tone</Option>
            <Option value="professional">Professional</Option>
            <Option value="casual">Casual</Option>
            <Option value="academic">Academic</Option>
            <Option value="creative">Creative</Option>
          </Select>
          <Button 
            appearance="primary" 
            onClick={handleGenerateContent}
            disabled={isLoading || !prompt}
          >
            Generate Content
          </Button>

          {generatedContent && activeFeature === "generate" && (
            <div className={styles.outputSection}>
              <h4 className={styles.outputTitle}>Generated Content</h4>
              <div className={styles.outputContent}>{generatedContent}</div>
              <div className={styles.buttonGroup}>
                <Button appearance="primary" onClick={insertGeneratedContent}>
                  Insert into Document
                </Button>
                <Button appearance="secondary" onClick={regenerateContent}>
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.aiFeature}>
          <h3 className={styles.featureTitle}>
            <span className={styles.featureIcon}>🪄</span>
            Enhance Content
          </h3>
          <p className={styles.featureDescription}>
            Improve your existing text for clarity, tone, and impact.
          </p>
          <Textarea
            className={styles.inputField}
            value={textToEnhance}
            onChange={(e) => setTextToEnhance(e.target.value)}
            placeholder="Paste text to enhance..."
          />
          <Select
            className={styles.selectField}
            value={enhancementType}
            onChange={(e) => setEnhancementType(e.target.value)}
          >
            <Option value="improve">Improve Writing</Option>
            <Option value="expand">Expand Content</Option>
            <Option value="shorten">Make More Concise</Option>
            <Option value="formal">Make More Formal</Option>
            <Option value="simple">Simplify Language</Option>
          </Select>
          <Button 
            appearance="primary" 
            onClick={handleEnhanceContent}
            disabled={isLoading || !textToEnhance}
          >
            Enhance Content
          </Button>

          {enhancedContent && activeFeature === "enhance" && (
            <div className={styles.outputSection}>
              <h4 className={styles.outputTitle}>Enhanced Content</h4>
              <div className={styles.outputContent}>{enhancedContent}</div>
              <div className={styles.buttonGroup}>
                <Button appearance="primary" onClick={insertEnhancedContent}>
                  Replace in Document
                </Button>
                <Button appearance="secondary" onClick={revertEnhancement}>
                  Revert to Original
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.aiFeature}>
          <h3 className={styles.featureTitle}>
            <span className={styles.featureIcon}>📝</span>
            Summarize Content
          </h3>
          <p className={styles.featureDescription}>
            Create a concise summary of your selected text.
          </p>
          <Textarea
            className={styles.inputField}
            value={textToSummarize}
            onChange={(e) => setTextToSummarize(e.target.value)}
            placeholder="Paste text to summarize..."
          />
          <Select
            className={styles.selectField}
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
          >
            <Option value="short">Short Summary (1-2 sentences)</Option>
            <Option value="medium">Medium Summary (paragraph)</Option>
            <Option value="bullet">Bullet Points</Option>
          </Select>
          <Button 
            appearance="primary" 
            onClick={handleSummarizeContent}
            disabled={isLoading || !textToSummarize}
          >
            Summarize
          </Button>

          {summaryContent && activeFeature === "summarize" && (
            <div className={styles.outputSection}>
              <h4 className={styles.outputTitle}>Summary</h4>
              <div className={styles.outputContent}>{summaryContent}</div>
              <div className={styles.buttonGroup}>
                <Button appearance="primary" onClick={insertSummary}>
                  Insert Summary
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.aiFeature}>
          <h3 className={styles.featureTitle}>
            <span className={styles.featureIcon}>🔍</span>
            Smart Recommendations
          </h3>
          <p className={styles.featureDescription}>
            Get suggestions to improve your document based on AI analysis.
          </p>
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <p>Analyze your document to get personalized recommendations for improvements.</p>
            <Button 
              appearance="primary" 
              onClick={handleAnalyzeDocument}
              disabled={isLoading}
            >
              Analyze Document
            </Button>
          </div>

          {recommendations.length > 0 && activeFeature === "analyze" && (
            <div className={styles.outputSection}>
              <h4 className={styles.outputTitle}>Recommendations</h4>
              <div className={styles.outputContent}>
                <ul>
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Section */}
      {/* {getCurrentContent() && renderContentPreview()} */}
      
      {isLoading && (
        <div className={styles.loadingContainer}>
          <Spinner label="Ana is working its magic..." labelPosition="below" />
        </div>
      )}
      
      <div className={styles.footer}>
        <p>Powered by Ana AI</p>
      </div>
    </div>
  );
};

AIAssistance.propTypes = {
  insertText: PropTypes.func.isRequired,
};

export default AIAssistance;