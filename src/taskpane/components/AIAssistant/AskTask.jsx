import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  Input,
  Spinner,
  Text,
  Textarea,
} from "@fluentui/react-components";
import { useStyles } from "./styles";
import { 
  insertNarrativeInCurrentSelection, 
  insertNarrativeInNewParagraph, 
  copyToClipboard 
} from "../../utils/wordInsertionUtils";
import ChatService from "../../services/chatService";
import AuthService from "../../services/authService";

const AskTask = ({ 
  prompt, 
  setPrompt, 
  contextOption, 
  setContextOption, 
  outputTarget, 
  setOutputTarget, 
  handleRun, 
  output, 
  isLoading 
}) => {
  const styles = useStyles();
  const [documentContent, setDocumentContent] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const responseTextareaRef = useRef(null);

  // Auto-scroll the response textarea when content changes
  useEffect(() => {
    if (responseTextareaRef.current && aiResponse) {
      responseTextareaRef.current.scrollTop = responseTextareaRef.current.scrollHeight;
    }
  }, [aiResponse]);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        // Get the current session ID
        const sessionId = ChatService.getCurrentSession();
        if (sessionId) {
          setCurrentSession(sessionId);
          
          // Load messages for the current session
          const messages = await ChatService.getMessages(sessionId);
          
          // Format messages for the AI model
          const formattedHistory = messages.map(msg => ({
            role: msg.type,
            content: msg.message
          }));
          
          setChatHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };
    
    loadChatHistory();
  }, []);

  // Function to get document content based on context option
  const getDocumentContent = async () => {
    try {
      setIsProcessing(true);
      
      // Get content based on selected context option
      await Word.run(async (context) => {
        let contentRange;
        
        if (contextOption === "selection") {
          contentRange = context.document.getSelection();
        } else if (contextOption === "currentSection") {
          // Get the current section
          const selection = context.document.getSelection();
          selection.expandTo(Word.SearchOptions.section);
          contentRange = selection;
        } else if (contextOption === "document") {
          contentRange = context.document.body;
        }
        
        contentRange.load("text");
        await context.sync();
        
        setDocumentContent(contentRange.text);
      });
      
      setIsProcessing(false);
    } catch (error) {
      console.error("Error getting document content:", error);
      setError("Failed to get document content. Please try again.");
      setIsProcessing(false);
    }
  };

  // Function to handle AI chat request
  const handleAskQuestion = async () => {
    if (!prompt.trim()) {
      setError("Please enter a question");
      return;
    }
    
    setError("");
    setIsProcessing(true);
    
    try {
      // Get document content first
      await getDocumentContent();
      
      // Get user data
      const userData = AuthService.getCurrentUser();
      const userId = userData?.user_id || "word_addin_user";
      
      // Create or get a chat session
      const sessionId = await ChatService.ensureSession(prompt);
      setCurrentSession(sessionId);
      
      // Stream the chat response
      let fullResponse = '';
      
      // Clear previous response before starting new stream
      setAiResponse('');
      
      // Set streaming state to true
      setIsStreaming(true);
      
      // Use the ChatService to stream the chat
      fullResponse = await ChatService.streamChat(
        userId,
        prompt,
        chatHistory,
        documentContent,
        (responseChunk) => {
          // Append each chunk to the existing response
          setAiResponse(prevResponse => prevResponse + responseChunk);
        }
      );
      
      // Set streaming state to false when done
      setIsStreaming(false);
      
      // Save the user message
      await ChatService.saveMessage(sessionId, prompt, 'user');
      
      // Save the assistant response
      await ChatService.saveMessage(sessionId, fullResponse, 'assistant');
      
      // Update chat history with new messages
      const newUserMessage = { role: 'user', content: prompt };
      const newAssistantMessage = { role: 'assistant', content: fullResponse };
      setChatHistory(prevHistory => [...prevHistory, newUserMessage, newAssistantMessage]);
      
      // Set the final response
      setAiResponse(fullResponse);
      
      // Clear the prompt input
      setPrompt("");
      
    } catch (error) {
      console.error("Error processing AI request:", error);
      setError("Failed to get a response from the AI. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle inserting the AI response into the document
  const handleInsertResponse = async () => {
    if (!aiResponse) return;
    
    try {
      setIsProcessing(true);
      
      let result;
      
      if (outputTarget === "cursorPosition") {
        result = await insertNarrativeInCurrentSelection(aiResponse);
      } else if (outputTarget === "newParagraph") {
        result = await insertNarrativeInNewParagraph(aiResponse);
      } else if (outputTarget === "clipboard") {
        result = await copyToClipboard(aiResponse);
      }
      
      if (!result.success) {
        throw new Error(result.error || "Failed to insert response");
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error("Error inserting response:", error);
      setError("Failed to insert response. Please try again.");
      setIsProcessing(false);
    }
  };

  // Function to start a new chat session
  const handleNewChat = () => {
    // Clear the current session
    ChatService.clearCurrentSession();
    
    // Reset state
    setCurrentSession(null);
    setChatHistory([]);
    setAiResponse("");
    setPrompt("");
    setError("");
    setDocumentContent("");
  };

  return (
    <>
      {/* Prompt Input */}
      <div className={styles.section}>
        <Input
          className={styles.inputField}
          placeholder="Ask a question about your document..."
          value={prompt}
          onChange={(e, data) => setPrompt(data.value)}
          appearance="outline"
        />
      </div>

      {/* Context Options */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Context Options</div>
        <RadioGroup
          className={styles.radioGroup}
          value={contextOption}
          onChange={(e, data) => setContextOption(data.value)}
        >
          <Radio className={styles.radio} value="selection" label="Use Selection" />
          <Radio className={styles.radio} value="currentSection" label="Use Current Section" />
          <Radio className={styles.radio} value="document" label="Use Entire Document" />
        </RadioGroup>
      </div>

      {/* Output Target */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Output Target</div>
        <RadioGroup
          className={styles.radioGroup}
          value={outputTarget}
          onChange={(e, data) => setOutputTarget(data.value)}
        >
          <Radio className={styles.radio} value="cursorPosition" label="Insert at cursor position" />
          <Radio className={styles.radio} value="newParagraph" label="Insert as new paragraph" />
          <Radio className={styles.radio} value="clipboard" label="Copy to clipboard" />
        </RadioGroup>
      </div>

      {/* Run Button */}
      <Button 
        className={styles.runButton} 
        onClick={handleAskQuestion} 
        disabled={isProcessing}
      >
        {isProcessing ? <Spinner size="tiny" /> : "Ask Question"}
      </Button>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* AI Response */}
      {(aiResponse || isStreaming) && (
        <>
          <div className={styles.sectionLabel}>
            AI Response
            {isStreaming && (
              <span style={{ marginLeft: '8px', color: '#ef4444', fontSize: '14px' }}>
                <Spinner size="tiny" style={{ marginRight: '4px' }} />
                Generating...
              </span>
            )}
          </div>
          <div className={styles.outputBox}>
            <div 
              ref={responseTextareaRef}
              style={{
                width: '100%',
                minHeight: '200px',
                maxHeight: '400px',
                padding: '16px',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '15px',
                lineHeight: '1.6',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
                fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              {aiResponse}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#6b7280' 
            }}>
              <span>
                {aiResponse.length} characters
              </span>
              {isStreaming && (
                <span style={{ color: '#ef4444' }}>
                  Receiving response...
                </span>
              )}
            </div>
          </div>
          
          {/* Insert Button */}
          <Button 
            className={styles.insertButton} 
            onClick={handleInsertResponse} 
            disabled={isProcessing || isStreaming}
          >
            {isProcessing ? <Spinner size="tiny" /> : `Insert Response (${outputTarget})`}
          </Button>
        </>
      )}
    </>
  );
};

export default AskTask;
