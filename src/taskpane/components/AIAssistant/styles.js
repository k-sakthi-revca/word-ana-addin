import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: { 
    maxWidth: "1000px", 
    margin: "0 auto", 
    background: "white", 
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)", 
    overflow: "visible", 
    position: "relative", 
    zIndex: 1, 
    padding: "16px 16px 24px 16px",
    borderRadius: "8px",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  sectionLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
  },
  dropdown: {
    width: "100%",
    height: "40px",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
    transition: "all 0.2s ease",
    ":hover": {
      borderTopColor: "#ef4444",
      borderRightColor: "#ef4444",
      borderBottomColor: "#ef4444",
      borderLeftColor: "#ef4444",
    },
  },
  inputField: {
    width: "100%",
    height: "70px",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
    fontSize: "15px",
    padding: "12px",
    transition: "all 0.2s ease",
    ":focus": {
      borderTopColor: "#ef4444",
      borderRightColor: "#ef4444",
      borderBottomColor: "#ef4444",
      borderLeftColor: "#ef4444",
      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
    },
  },
  radioGroup: {
    gap: "12px",
  },
  radio: {
    ":checked": {
      color: "#ef4444 !important",
    },
  },
  runButton: {
    marginTop: "16px",
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: "600",
    width: "100%",
    height: "44px",
    borderRadius: "6px",
    fontSize: "16px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#ef4444",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(37, 99, 235, 0.2)",
    },
    ":active": {
      transform: "translateY(0)",
    },
  },
  outputBox: {
    padding: "16px 0",
    fontSize: "15px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
    borderTop: "1px solid #e5e7eb",
    marginTop: "20px",
    color: "#333",
  },
  footer: {
    marginTop: "16px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "13px",
  },
  linkContainer: {
    marginTop: "8px",
  },
  link: {
    color: "#ef4444",
    marginRight: "8px",
    textDecoration: "none",
    fontWeight: "500",
    ":hover": {
      textDecoration: "underline",
    },
  },
  // Additional styles for new components
  contextSection: {
    marginBottom: "16px",
  },
  outputSection: {
    marginTop: "16px",
    marginBottom: "16px",
  },
  ddqQuestionList: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  ddqQuestion: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      borderTopColor: "#ef4444",
      borderRightColor: "#ef4444",
      borderBottomColor: "#ef4444",
      borderLeftColor: "#ef4444",
      backgroundColor: "#fef2f2",
    },
  },
  ddqQuestionText: {
    fontSize: "15px",
    fontWeight: "500",
    marginBottom: "4px",
  },
  ddqQuestionMeta: {
    fontSize: "13px",
    color: "#6b7280",
  },
  ddqQuestionHeader: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },
  ddqAnswer: {
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  ddqConfidence: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#6b7280",
  },
  explanationResult: {
    marginTop: "20px",
    padding: "16px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
  },
  explanationHeader: {
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e0e0e0",
  },
  explanationBody: {
    fontSize: "15px",
    lineHeight: "1.5",
  },
  insightsList: {
    marginTop: "8px",
    marginBottom: "16px",
    paddingLeft: "20px",
  },
  sheetStats: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  summaryResult: {
    marginTop: "20px",
    padding: "16px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
  },
  summaryHeader: {
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e0e0e0",
  },
  summaryBody: {
    fontSize: "15px",
    lineHeight: "1.5",
  },
  keyPointsList: {
    marginTop: "8px",
    marginBottom: "16px",
    paddingLeft: "20px",
  },
  statisticsSection: {
    marginTop: "16px",
    marginBottom: "16px",
  },
  statisticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
    marginTop: "8px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  chartRecommendation: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    textAlign: "center",
  },
  insertionResult: {
    marginTop: "20px",
    padding: "16px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
  },
  insertionHeader: {
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e0e0e0",
  },
  insertionBody: {
    fontSize: "15px",
    lineHeight: "1.5",
  },
  narrativeResult: {
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  narrativeMeta: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#6b7280",
  },
  alternativeStyles: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  tableResult: {
    marginBottom: "16px",
    overflowX: "auto",
  },
  generatedTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "12px",
    "& th, & td": {
      border: "1px solid #e0e0e0",
      padding: "8px 12px",
      textAlign: "left",
    },
    "& th": {
      backgroundColor: "#f9fafb",
      fontWeight: "600",
    },
    "& tr:nth-child(even)": {
      backgroundColor: "#f9fafb",
    },
    "& tfoot td": {
      fontWeight: "600",
      backgroundColor: "#f9fafb",
    },
  },
  tableMeta: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "16px",
  },
  insertButton: {
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: "600",
    width: "100%",
    height: "44px",
    borderRadius: "6px",
    fontSize: "16px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#ef4444",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(37, 99, 235, 0.2)",
    },
    ":active": {
      transform: "translateY(0)",
    },
  },
});
