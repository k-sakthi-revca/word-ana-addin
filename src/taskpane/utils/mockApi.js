/* 
 * Mock API and data for Word Add-in ribbon items
 * This file provides mock implementations for the various ribbon functionalities
 */

// Mock user data
export const mockUserData = {
  id: "user123",
  name: "John Doe",
  email: "john.doe@example.com",
  apiKey: "mock-api-key-12345",
  organization: "Contoso Ltd.",
  plan: "Enterprise",
  usageCredits: 1000,
  lastLogin: "2023-06-15T10:30:00Z"
};

// Mock login API
export const loginApi = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!email || !password) throw new Error("Email and password are required");
    if (!email.includes("@")) throw new Error("Invalid email format");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    return {
      success: true,
      user: mockUserData,
      token: "mock-jwt-token-xyz"
    };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  validateToken: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!token) return { valid: false };
    return { valid: true, user: mockUserData };
  }
};

// Mock DDQ Assistant API
export const ddqApi = {
  sampleQuestions: [
    { id: "ddq1", category: "Financial", question: "What was the company's revenue for the past 3 fiscal years?", importance: "high" },
    { id: "ddq2", category: "Operations", question: "Describe the company's supply chain and key dependencies.", importance: "medium" },
    { id: "ddq3", category: "Legal", question: "Are there any pending litigation matters?", importance: "high" },
    { id: "ddq4", category: "Market", question: "Who are the company's main competitors?", importance: "medium" },
    { id: "ddq5", category: "Technology", question: "Describe the company's IT infrastructure and security protocols.", importance: "medium" }
  ],

  generateQuestions: async (context) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    let questions = [...ddqApi.sampleQuestions];
    if (context?.toLowerCase().includes("financ")) {
      questions = questions.filter(q => q.category === "Financial");
    } else if (context?.toLowerCase().includes("legal")) {
      questions = questions.filter(q => q.category === "Legal");
    }
    return { success: true, questions, context: context || "general" };
  },

  answerQuestion: async (questionId, data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockAnswers = {
      "ddq1": "The company reported revenues of $10.2M (FY2020), $12.5M (FY2021), and $15.8M (FY2022), showing consistent growth.",
      "ddq2": "The company relies on 3 primary manufacturers in Asia and distributes through a network of 12 regional warehouses.",
      "ddq3": "There is one ongoing patent infringement case and two minor contract disputes, total contingent liability ≈ $1.2M.",
      "ddq4": "Main competitors include XYZ Corp (35% share), ABC Inc (22%), and smaller regional players.",
      "ddq5": "Hybrid cloud (AWS + on-prem), SOC2 compliant, quarterly pentests, dedicated security team."
    };
    return {
      success: true,
      question: ddqApi.sampleQuestions.find(q => q.id === questionId) || { question: "Unknown question" },
      answer: mockAnswers[questionId] || "No data available.",
      confidence: questionId in mockAnswers ? 0.92 : 0.4,
      sources: ["Annual Report", "Management Interviews", "Market Analysis"]
    };
  }
};

// Mock Explain Document API
export const explainDocApi = {
  explainDocument: async (docText) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    let explanation = "This appears to be a general document with mixed content.";
    let insights = ["Consider improving section headings for clarity"];
    let quality = "medium";

    if (docText?.toLowerCase().includes("financial")) {
      explanation = "This document contains financial information, likely a report or analysis.";
      insights = [
        "Revenue trends are highlighted as positive",
        "Expenses are controlled relative to income",
        "Margins are improving year over year"
      ];
      quality = "high";
    } else if (docText?.toLowerCase().includes("project")) {
      explanation = "This appears to be a project report or task document.";
      insights = [
        "Some milestones are overdue",
        "Team A is handling the majority of work",
        "Dependencies are not clearly documented"
      ];
      quality = "medium";
    }

    return {
      success: true,
      explanation,
      structure: {
        paragraphs: 42,
        tables: 3,
        images: 2,
        headings: 5
      },
      insights,
      quality,
      recommendations: [
        "Add a table of contents for navigation",
        "Include references or citations",
        "Summarize findings at the beginning"
      ]
    };
  },

  explainParagraph: async (index, text) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      paragraphIndex: index,
      explanation: text?.length > 100
        ? "This paragraph is detailed and provides strong context."
        : "This paragraph is brief and may need more explanation.",
      keywords: ["project", "revenue", "compliance"].filter(k => text?.toLowerCase().includes(k))
    };
  }
};

// Mock Summarize Selection API
export const summarizeApi = {
  summarizeSelection: async (selectionText, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1800));
    let summary = "The selected text discusses general information.";
    let keyPoints = ["Contains a few key themes", "Moderate detail"];
    if (selectionText?.toLowerCase().includes("year") || selectionText?.toLowerCase().includes("quarter")) {
      summary = "The text seems to describe time-based performance.";
      keyPoints = ["Q3 performance is strong", "Year-over-year growth noted"];
    }
    return {
      success: true,
      summary,
      keyPoints,
      insightLevel: options.detailLevel || "medium"
    };
  },

  generateNarrative: async (data, style = "business") => {
    await new Promise(resolve => setTimeout(resolve, 2200));
    const narrativeStyles = {
      "business": "The report highlights steady progress with notable success in Q3. Growth exceeds industry benchmarks.",
      "academic": "Analysis reveals statistically significant upward trends across multiple sections, supporting robust conclusions.",
      "simple": "Things are looking good! Q3 was the best part of the year and overall growth is strong."
    };
    return {
      success: true,
      narrative: narrativeStyles[style] || narrativeStyles.business,
      wordCount: (narrativeStyles[style] || "").split(" ").length,
      confidence: 0.89,
      alternativeStyles: Object.keys(narrativeStyles).filter(s => s !== style)
    };
  }
};

// Mock Insert Narrative/Table API
export const insertionApi = {
  generateNarrative: async (data, options = {}) => {
    return summarizeApi.generateNarrative(data, options.style);
  },

  generateTable: async (data, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockTableData = {
      financial: {
        headers: ["Quarter", "Revenue ($M)", "Expenses ($M)", "Profit ($M)", "Margin (%)"],
        rows: [
          ["Q1 2023", 12.4, 9.8, 2.6, "21.0%"],
          ["Q2 2023", 14.2, 10.5, 3.7, "26.1%"],
          ["Q3 2023", 15.8, 11.2, 4.6, "29.1%"],
          ["Q4 2023", 13.5, 10.8, 2.7, "20.0%"]
        ],
        summary: "Annual totals",
        totals: ["2023", 55.9, 42.3, 13.6, "24.3%"]
      },
      project: {
        headers: ["Task", "Owner", "Status", "Due Date", "Completion"],
        rows: [
          ["Research", "John Smith", "Completed", "2023-03-15", "100%"],
          ["Design", "Alice Johnson", "Completed", "2023-04-10", "100%"],
          ["Development", "Team A", "In Progress", "2023-07-30", "65%"],
          ["Testing", "QA Team", "Not Started", "2023-08-15", "0%"]
        ],
        summary: "Project status",
        totals: ["Overall", "", "In Progress", "", "53%"]
      },
      default: {
        headers: ["Category", "Value 1", "Value 2", "Value 3", "Total"],
        rows: [
          ["A", 10, 15, 20, 45],
          ["B", 12, 18, 22, 52],
          ["C", 8, 12, 16, 36],
          ["D", 14, 21, 28, 63]
        ],
        summary: "Summary",
        totals: ["Total", 44, 66, 86, 196]
      }
    };
    let tableType = "default";
    if (data?.toLowerCase().includes("financ")) tableType = "financial";
    else if (data?.toLowerCase().includes("project")) tableType = "project";
    return {
      success: true,
      tableData: mockTableData[tableType],
      formatting: {
        headerStyle: "bold",
        totalsStyle: "bold",
        alternatingRows: true
      }
    };
  },

  insertTextAtLocation: async (text, location) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      insertedText: text,
      location,
      timestamp: new Date().toISOString()
    };
  }
};

// Mock Document Data Utils
export const wordDataUtils = {
  getCurrentSelection: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      text: "The company achieved strong revenue growth in Q3, driven by new product launches.",
      wordCount: 15,
      hasTables: false,
      hasImages: false
    };
  },

  getCurrentDocumentData: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      title: "Financial Report 2023",
      paragraphs: 42,
      tables: 3,
      images: 2,
      wordCount: 12500,
      sampleText: "Revenue for 2023 showed an upward trend, exceeding forecasts..."
    };
  },

  getDocumentStructure: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      name: "Financial_Report_2023.docx",
      sections: [
        { title: "Executive Summary", paragraphs: 4 },
        { title: "Financial Performance", paragraphs: 12 },
        { title: "Operations Overview", paragraphs: 10 },
        { title: "Future Outlook", paragraphs: 8 }
      ],
      hasTOC: false,
      definedHeadings: ["H1: Executive Summary", "H1: Financial Performance"],
      tables: 3,
      images: 2
    };
  }
};
