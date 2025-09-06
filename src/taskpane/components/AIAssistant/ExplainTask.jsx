import * as React from "react";
import {
  Button,
  Radio,
  RadioGroup,
  Input,
  Spinner,
  Text,
} from "@fluentui/react-components";
import { useStyles } from "./styles";

const ExplainTask = ({
  prompt,
  setPrompt,
  contextOption,
  setContextOption,
  handleRun,
  isLoading,
  sheetExplanation
}) => {
  const styles = useStyles();

  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>Explain Sheet</div>
      
      <div className={styles.contextSection}>
        <RadioGroup
          className={styles.radioGroup}
          value={contextOption}
          onChange={(e, data) => setContextOption(data.value)}
        >
          <Radio className={styles.radio} value="currentSheet" label="Explain Current Sheet" />
          <Radio className={styles.radio} value="selection" label="Explain Selection" />
          <Radio className={styles.radio} value="formula" label="Explain Formula" />
        </RadioGroup>
      </div>
      
      <Input
        className={styles.inputField}
        placeholder={contextOption === "formula" ? "Enter cell reference (e.g., A1)" : "Additional context (optional)..."}
        value={prompt}
        onChange={(e, data) => setPrompt(data.value)}
        appearance="outline"
      />
      
      <Button 
        className={styles.runButton} 
        onClick={handleRun}
        disabled={isLoading}
      >
        {isLoading ? <Spinner size="tiny" /> : "Explain"}
      </Button>
      
      {sheetExplanation && (
        <div className={styles.explanationResult}>
          <div className={styles.explanationHeader}>
            <Text weight="semibold" size={500}>Sheet Analysis</Text>
          </div>
          
          <div className={styles.explanationBody}>
            <Text weight="semibold">Overview:</Text>
            <Text block>{sheetExplanation.explanation}</Text>
            
            <Text weight="semibold" style={{ marginTop: "16px" }}>Key Insights:</Text>
            <ul className={styles.insightsList}>
              {sheetExplanation.insights.map((insight, index) => (
                <li key={index}><Text>{insight}</Text></li>
              ))}
            </ul>
            
            <Text weight="semibold" style={{ marginTop: "16px" }}>Recommendations:</Text>
            <ul className={styles.insightsList}>
              {sheetExplanation.recommendations.map((rec, index) => (
                <li key={index}><Text>{rec}</Text></li>
              ))}
            </ul>
            
            <div className={styles.sheetStats}>
              <Text size={200}>
                Sheet contains {sheetExplanation.structure.rowCount} rows, {sheetExplanation.structure.columnCount} columns, 
                and {sheetExplanation.structure.dataRegions} data regions. 
                {sheetExplanation.structure.hasFormulas ? " Contains formulas." : ""}
                {sheetExplanation.structure.hasCharts ? " Contains charts." : ""}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplainTask;
