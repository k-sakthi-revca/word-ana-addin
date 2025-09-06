import * as React from "react";
import {
  Button,
  Input,
  Spinner,
  Text,
  Card,
  CardHeader,
  CardPreview,
  CardFooter,
} from "@fluentui/react-components";
import { useStyles } from "./styles";

const DDQTask = ({
  prompt,
  setPrompt,
  handleRun,
  isLoading,
  ddqQuestions,
  selectedQuestion,
  ddqAnswer,
  handleQuestionSelect,
  handleBackToDDQ
}) => {
  const styles = useStyles();

  if (selectedQuestion && ddqAnswer) {
    // Show selected question and answer
    return (
      <div className={styles.section}>
        <div className={styles.ddqQuestionHeader}>
          <Button 
            appearance="subtle" 
            onClick={handleBackToDDQ}
            style={{ marginBottom: "10px" }}
          >
            ← Back to questions
          </Button>
          <div className={styles.sectionLabel}>
            {selectedQuestion.category} - {selectedQuestion.importance === "high" ? "⭐ High Priority" : "Medium Priority"}
          </div>
        </div>
        
        <Card>
          <CardHeader header={<Text weight="semibold">{selectedQuestion.question}</Text>} />
          <CardPreview>
            <div className={styles.ddqAnswer}>
              <Text>{ddqAnswer.answer}</Text>
              <div className={styles.ddqConfidence}>
                Confidence: {Math.round(ddqAnswer.confidence * 100)}%
              </div>
            </div>
          </CardPreview>
          <CardFooter>
            <Text size={200}>Sources: {ddqAnswer.sources.join(", ")}</Text>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Show list of DDQ questions
  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>Due Diligence Questions</div>
      <Input
        className={styles.inputField}
        placeholder="Search or add context for DDQ generation..."
        value={prompt}
        onChange={(e, data) => setPrompt(data.value)}
        appearance="outline"
      />
      <Button 
        className={styles.runButton} 
        onClick={handleRun}
        disabled={isLoading}
      >
        {isLoading ? <Spinner size="tiny" /> : "Generate Questions"}
      </Button>
      
      {ddqQuestions.length > 0 && (
        <div className={styles.ddqQuestionList}>
          {ddqQuestions.map((question) => (
            <div 
              key={question.id} 
              className={styles.ddqQuestion}
              onClick={() => handleQuestionSelect(question)}
            >
              <div className={styles.ddqQuestionText}>
                {question.question}
              </div>
              <div className={styles.ddqQuestionMeta}>
                {question.category} • {question.importance === "high" ? "High Priority" : "Medium Priority"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DDQTask;
