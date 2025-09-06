import * as React from "react";
import {
  Button,
  Radio,
  RadioGroup,
  Input,
  Spinner,
  Text,
  Toast,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import { useStyles } from "./styles";
import {
  insertNarrativeInCurrentSelection,
  insertNarrativeInNewParagraph,
  insertTableInCurrentSelection,
  insertTableInNewParagraph,
  copyToClipboard,
  formatTableForClipboard
} from "../../utils/wordInsertionUtils";

const InsertTask = ({
  prompt,
  setPrompt,
  contextOption,
  setContextOption,
  outputTarget,
  setOutputTarget,
  handleRun,
  isLoading,
  insertionResult
}) => {
  const styles = useStyles();
  const { dispatchToast } = useToastController();
  
  const showNotification = (message) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { position: "top-end" }
    );
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>Insert Content</div>
      
      <div className={styles.contextSection}>
        <RadioGroup
          className={styles.radioGroup}
          value={contextOption}
          onChange={(e, data) => setContextOption(data.value)}
        >
          <Radio className={styles.radio} value="narrative" label="Generate Narrative" />
          <Radio className={styles.radio} value="table" label="Generate Table" />
        </RadioGroup>
      </div>
      
      <Input
        className={styles.inputField}
        placeholder={
          contextOption === "narrative" 
            ? "Describe the narrative you want to generate..." 
            : "Describe the table you want to generate..."
        }
        value={prompt}
        onChange={(e, data) => setPrompt(data.value)}
        appearance="outline"
      />
      
      <div className={styles.outputSection}>
        <div className={styles.sectionLabel}>Output Options</div>
        <RadioGroup
          className={styles.radioGroup}
          value={outputTarget}
          onChange={(e, data) => setOutputTarget(data.value)}
        >
          <Radio className={styles.radio} value="currentSheet" label="Insert in current sheet" />
          <Radio className={styles.radio} value="newSheet" label="Insert into new sheet" />
          <Radio className={styles.radio} value="clipboard" label="Copy to clipboard" />
        </RadioGroup>
      </div>
      
      <Button 
        className={styles.runButton} 
        onClick={handleRun}
        disabled={isLoading}
      >
        {isLoading ? <Spinner size="tiny" /> : "Generate"}
      </Button>
      
      {insertionResult && (
        <div className={styles.insertionResult}>
          <div className={styles.insertionHeader}>
            <Text weight="semibold" size={500}>
              {insertionResult.type === "narrative" ? "Generated Narrative" : "Generated Table"}
            </Text>
          </div>
          
          <div className={styles.insertionBody}>
            {insertionResult.type === "narrative" ? (
              <div className={styles.narrativeResult}>
                <Text block>{insertionResult.data.narrative}</Text>
                <div className={styles.narrativeMeta}>
                  <Text size={200}>
                    Word count: {insertionResult.data.wordCount} • 
                    Confidence: {Math.round(insertionResult.data.confidence * 100)}%
                  </Text>
                </div>
                <div className={styles.alternativeStyles}>
                  <Text size={200}>
                    Alternative styles: {insertionResult.data.alternativeStyles.join(", ")}
                  </Text>
                </div>
              </div>
            ) : (
              <div className={styles.tableResult}>
                <table className={styles.generatedTable}>
                  <thead>
                    <tr>
                      {insertionResult.data.tableData.headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {insertionResult.data.tableData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      {insertionResult.data.tableData.totals.map((total, index) => (
                        <td key={index}>{total}</td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
                <div className={styles.tableMeta}>
                  <Text size={200}>
                    {insertionResult.data.tableData.summary} • 
                    {insertionResult.data.dimensions.rows} rows × 
                    {insertionResult.data.dimensions.columns} columns
                  </Text>
                </div>
              </div>
            )}
            
            <Button 
              className={styles.insertButton}
              onClick={async () => {
                try {
                  let result;
                  
                  // Handle different insertion targets based on content type
                  if (insertionResult.type === "narrative") {
                    const narrativeText = insertionResult.data.narrative;
                    
                    if (outputTarget === "currentSheet") {
                      result = await insertNarrativeInCurrentSelection(narrativeText);
                      if (result.success) {
                        showNotification("Narrative inserted into current sheet successfully");
                      }
                    } else if (outputTarget === "newSheet") {
                      result = await insertNarrativeInNewParagraph(narrativeText);
                      if (result.success) {
                        showNotification("Narrative inserted into new sheet successfully");
                      }
                    } else if (outputTarget === "clipboard") {
                      result = await copyToClipboard(narrativeText);
                      if (result.success) {
                        showNotification("Narrative copied to clipboard successfully");
                      }
                    }
                  } else if (insertionResult.type === "table") {
                    const tableData = insertionResult.data.tableData;
                    
                    if (outputTarget === "currentSheet") {
                      result = await insertTableInCurrentSelection(tableData);
                      if (result.success) {
                        showNotification("Table inserted into current sheet successfully");
                      }
                    } else if (outputTarget === "newSheet") {
                      result = await insertTableInNewParagraph(tableData);
                      if (result.success) {
                        showNotification("Table inserted into new sheet successfully");
                      }
                    } else if (outputTarget === "clipboard") {
                      const formattedTable = formatTableForClipboard(tableData);
                      result = await copyToClipboard(formattedTable);
                      if (result.success) {
                        showNotification("Table copied to clipboard successfully");
                      }
                    }
                  }
                  
                  if (!result || !result.success) {
                    showNotification("Failed to insert content. Please try again.");
                  }
                } catch (error) {
                  console.error("Error inserting content:", error);
                  showNotification("Failed to insert content: " + error.message);
                }
              }}
            >
              Insert into {outputTarget === "currentSheet" ? "Current Sheet" : 
                           outputTarget === "newSheet" ? "New Sheet" : "Clipboard"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertTask;
