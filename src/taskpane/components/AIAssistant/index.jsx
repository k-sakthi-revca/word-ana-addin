import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dropdown,
  Option,
  makeStyles,
} from "@fluentui/react-components";
import { 
  ddqApi, 
  explainDocApi, 
  summarizeApi, 
  insertionApi, 
  wordDataUtils 
} from "../../utils/mockApi";
import { useStyles } from "./styles";

// Import task components
import AskTask from "./AskTask";
import DDQTask from "./DDQTask";
import ExplainTask from "./ExplainTask";
import SummarizeTask from "./SummarizeTask";
import InsertTask from "./InsertTask";

const AIAssistance = ({ initialTask }) => {
  const styles = useStyles();

  // State
  const [task, setTask] = useState(initialTask || "Ask");
  const [prompt, setPrompt] = useState("");
  const [contextOption, setContextOption] = useState("selection");
  const [outputTarget, setOutputTarget] = useState("currentSheet");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ddqQuestions, setDdqQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [ddqAnswer, setDdqAnswer] = useState(null);
  const [sheetExplanation, setSheetExplanation] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);
  const [insertionResult, setInsertionResult] = useState(null);
  const [selectionData, setSelectionData] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  
  // Console log for debugging
  console.log("AIAssistance initialTask:", initialTask);

  // Initialize based on initialTask
  useEffect(() => {
    const initializeTask = async () => {
      if (initialTask) {
        console.log("Initializing task:", initialTask);
        setTask(initialTask);
        
        // Reset states when changing tasks
        setPrompt("");
        setOutput("");
        setSummaryResult(null);
        setSheetExplanation(null);
        setInsertionResult(null);
        setSelectedQuestion(null);
        setDdqAnswer(null);
        
        // Load initial data based on task type
        try {
          setIsLoading(true);
          
          if (initialTask === "DDQ") {
            // Load DDQ questions
            const result = await ddqApi.generateQuestions();
            setDdqQuestions(result.questions);
          } 
          else if (initialTask === "Rewrite") {
            // Get sheet data
            const data = await wordDataUtils.getCurrentSheetData();
            setSheetData(data);
          }
          else if (initialTask === "Summarize") {
            // Get selection data
            const data = await wordDataUtils.getCurrentSelection();
            setSelectionData(data);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error initializing task:", error);
          setIsLoading(false);
        }
      }
    };
    
    initializeTask();
  }, [initialTask]);

  const handleRun = async () => {
    try {
      setIsLoading(true);
      setOutput("");
      setSummaryResult(null);
      setSheetExplanation(null);
      setInsertionResult(null);
      
      // Handle different tasks
      switch (task) {
        case "Ask":
          // For Ask, we now handle this in the AskTask component
          // This is just a fallback in case the component's direct handler isn't used
          await new Promise(resolve => setTimeout(resolve, 1500));
          setOutput(
            "Please use the Ask Question button to interact with the AI assistant."
          );
          break;
          
        case "DDQ":
          // For DDQ, we handle this in the DDQ section with separate UI
          if (selectedQuestion) {
            const answer = await ddqApi.answerQuestion(selectedQuestion.id);
            setDdqAnswer(answer);
          } else {
            // Generate questions if none selected
            const result = await ddqApi.generateQuestions(prompt);
            setDdqQuestions(result.questions);
          }
          break;
          
        case "Explain":
          // Get sheet data if not already loaded
          if (!sheetData) {
            const data = await wordDataUtils.getCurrentSheetData();
            setSheetData(data);
          }
          
          // Get explanation
          const explanation = await explainDocApi.explainSheet(
            sheetData ? sheetData.sampleData : prompt
          );
          setSheetExplanation(explanation);
          break;
          
        case "Summarize":
          // Get selection data if not already loaded
          if (!selectionData) {
            const data = await wordDataUtils.getCurrentSelection();
            setSelectionData(data);
          }
          
          // Get summary
          const summary = await summarizeApi.summarizeSelection(
            selectionData ? JSON.stringify(selectionData.values) : prompt
          );
          setSummaryResult(summary);
          break;
          
        case "Insert":
          // Generate table or narrative based on prompt
          if (prompt.toLowerCase().includes("table")) {
            const tableResult = await insertionApi.generateTable(prompt);
            setInsertionResult({
              type: "table",
              data: tableResult
            });
          } else {
            const narrativeResult = await insertionApi.generateNarrative(prompt);
            setInsertionResult({
              type: "narrative",
              data: narrativeResult
            });
          }
          break;
          
        default:
          setOutput("Please select a task to perform.");
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error running task:", error);
      setOutput("An error occurred while processing your request.");
      setIsLoading(false);
    }
  };
  
  // Handle DDQ question selection
  const handleQuestionSelect = async (question) => {
    setSelectedQuestion(question);
    setIsLoading(true);
    
    try {
      const answer = await ddqApi.answerQuestion(question.id);
      setDdqAnswer(answer);
    } catch (error) {
      console.error("Error getting DDQ answer:", error);
    }
    
    setIsLoading(false);
  };
  
  // Reset DDQ question selection
  const handleBackToDDQ = () => {
    setSelectedQuestion(null);
    setDdqAnswer(null);
  };

  // Render the appropriate task component based on the selected task
  const renderTaskComponent = () => {
    switch (task) {
      case "Ask":
        return (
          <AskTask
            prompt={prompt}
            setPrompt={setPrompt}
            contextOption={contextOption}
            setContextOption={setContextOption}
            outputTarget={outputTarget}
            setOutputTarget={setOutputTarget}
            handleRun={handleRun}
            output={output}
            isLoading={isLoading}
          />
        );
      case "DDQ":
        return (
          <DDQTask
            prompt={prompt}
            setPrompt={setPrompt}
            handleRun={handleRun}
            isLoading={isLoading}
            ddqQuestions={ddqQuestions}
            selectedQuestion={selectedQuestion}
            ddqAnswer={ddqAnswer}
            handleQuestionSelect={handleQuestionSelect}
            handleBackToDDQ={handleBackToDDQ}
          />
        );
      case "Rewrite":
        return (
          <ExplainTask
            prompt={prompt}
            setPrompt={setPrompt}
            contextOption={contextOption}
            setContextOption={setContextOption}
            handleRun={handleRun}
            isLoading={isLoading}
            sheetExplanation={sheetExplanation}
          />
        );
      case "Summarize":
        return (
          <SummarizeTask
            prompt={prompt}
            setPrompt={setPrompt}
            contextOption={contextOption}
            setContextOption={setContextOption}
            outputTarget={outputTarget}
            setOutputTarget={setOutputTarget}
            handleRun={handleRun}
            isLoading={isLoading}
            summaryResult={summaryResult}
          />
        );
      case "Insert":
        return (
          <InsertTask
            prompt={prompt}
            setPrompt={setPrompt}
            contextOption={contextOption}
            setContextOption={setContextOption}
            outputTarget={outputTarget}
            setOutputTarget={setOutputTarget}
            handleRun={handleRun}
            isLoading={isLoading}
            insertionResult={insertionResult}
          />
        );
      default:
        return <div>Please select a valid task.</div>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Task Selector */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Task</div>
        <Dropdown
          className={styles.dropdown}
          value={task}
          selectedOptions={[task]}
          onOptionSelect={(e, data) => {
            setTask(data.optionValue);
            // Reset states when changing tasks
            setPrompt("");
            setOutput("");
            setSummaryResult(null);
            setSheetExplanation(null);
            setInsertionResult(null);
            setSelectedQuestion(null);
            setDdqAnswer(null);
          }}
        >
          <Option value="Ask">Ask a Question</Option>
          <Option value="DDQ">Due Diligence Questions</Option>
          <Option value="Explain">Explain Sheet</Option>
          <Option value="Summarize">Summarize Data</Option>
          <Option value="Insert">Insert Content</Option>
        </Dropdown>
      </div>

      {/* Render the appropriate task component */}
      {renderTaskComponent()}

      {/* Footer */}
      <div className={styles.footer}>
        Powered by OpenAna AI
      </div>
    </div>
  );
};

export default AIAssistance;
