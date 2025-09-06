import * as React from "react";
import { useState } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  Input,
  Spinner,
  Text,
} from "@fluentui/react-components";
import { useStyles } from "./styles";

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

  return (
    <>
      {/* Prompt Input */}
      <div className={styles.section}>
        <Input
          className={styles.inputField}
          placeholder="Ask a question about your data..."
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
          <Radio className={styles.radio} value="currentSheet" label="Use Current Sheet" />
          <Radio className={styles.radio} value="workbook" label="Use Workbook" />
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
          <Radio className={styles.radio} value="currentSheet" label="Insert in current sheet" />
          <Radio className={styles.radio} value="newSheet" label="Insert into new sheet" />
          <Radio className={styles.radio} value="clipboard" label="Copy to clipboard" />
        </RadioGroup>
      </div>

      {/* Run Button */}
      <Button className={styles.runButton} onClick={handleRun} disabled={isLoading}>
        {isLoading ? <Spinner size="tiny" /> : "Run"}
      </Button>

      {/* Output Box */}
      {output && <div className={styles.outputBox}>{output}</div>}

      {/* Links at the bottom of the output */}
      {output && (
        <div className={styles.linkContainer}>
          <a href="#" className={styles.link}>[1]</a>
          <a href="#" className={styles.link}>[2]</a>
        </div>
      )}
    </>
  );
};

export default AskTask;
