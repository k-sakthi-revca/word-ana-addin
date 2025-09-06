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

const SummarizeTask = ({
  prompt,
  setPrompt,
  contextOption,
  setContextOption,
  outputTarget,
  setOutputTarget,
  handleRun,
  isLoading,
  summaryResult
}) => {
  const styles = useStyles();

  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>Summarize Data</div>
      
      <div className={styles.contextSection}>
        <RadioGroup
          className={styles.radioGroup}
          value={contextOption}
          onChange={(e, data) => setContextOption(data.value)}
        >
          <Radio className={styles.radio} value="selection" label="Use Current Selection" />
          <Radio className={styles.radio} value="table" label="Use Table" />
          <Radio className={styles.radio} value="custom" label="Custom Input" />
        </RadioGroup>
      </div>
      
      {contextOption === "custom" && (
        <Input
          className={styles.inputField}
          placeholder="Describe the data you want to summarize..."
          value={prompt}
          onChange={(e, data) => setPrompt(data.value)}
          appearance="outline"
        />
      )}
      
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
        {isLoading ? <Spinner size="tiny" /> : "Summarize"}
      </Button>
      
      {summaryResult && (
        <div className={styles.summaryResult}>
          <div className={styles.summaryHeader}>
            <Text weight="semibold" size={500}>Summary</Text>
          </div>
          
          <div className={styles.summaryBody}>
            <Text block>{summaryResult.summary}</Text>
            
            <Text weight="semibold" style={{ marginTop: "16px" }}>Key Points:</Text>
            <ul className={styles.keyPointsList}>
              {summaryResult.keyPoints.map((point, index) => (
                <li key={index}><Text>{point}</Text></li>
              ))}
            </ul>
            
            <div className={styles.statisticsSection}>
              <Text weight="semibold">Statistics:</Text>
              <div className={styles.statisticsGrid}>
                <div className={styles.statItem}>
                  <Text size={200}>Count</Text>
                  <Text weight="semibold">{summaryResult.statistics.count}</Text>
                </div>
                <div className={styles.statItem}>
                  <Text size={200}>Mean</Text>
                  <Text weight="semibold">{summaryResult.statistics.mean}</Text>
                </div>
                <div className={styles.statItem}>
                  <Text size={200}>Median</Text>
                  <Text weight="semibold">{summaryResult.statistics.median}</Text>
                </div>
                <div className={styles.statItem}>
                  <Text size={200}>Min</Text>
                  <Text weight="semibold">{summaryResult.statistics.min}</Text>
                </div>
                <div className={styles.statItem}>
                  <Text size={200}>Max</Text>
                  <Text weight="semibold">{summaryResult.statistics.max}</Text>
                </div>
              </div>
            </div>
            
            <div className={styles.chartRecommendation}>
              <Text size={200}>
                Recommended chart type: <Text weight="semibold">{summaryResult.chartRecommendation}</Text>
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarizeTask;
