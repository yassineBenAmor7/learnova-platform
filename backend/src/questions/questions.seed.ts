import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const questionsData = [
  // Introduction to Data Analytics & Power BI (3 questions)
  {
    text: "What is the primary purpose of data analytics?",
    options: [
      { text: "To store data", isCorrect: false },
      { text: "To analyze data for insights and decision-making", isCorrect: true },
      { text: "To visualize data only", isCorrect: false },
      { text: "To clean data", isCorrect: false },
    ],
    category: "Introduction to Data Analytics & Power BI",
  },
  {
    text: "Which of the following is NOT a key component of Power BI?",
    options: [
      { text: "Power BI Desktop", isCorrect: false },
      { text: "Power BI Service", isCorrect: false },
      { text: "Power BI Mobile", isCorrect: false },
      { text: "Power BI Database", isCorrect: true },
    ],
    category: "Introduction to Data Analytics & Power BI",
  },
  {
    text: "What is the difference between data and information?",
    options: [
      { text: "Data is processed, information is raw", isCorrect: false },
      { text: "Information is processed data that provides context", isCorrect: true },
      { text: "There is no difference", isCorrect: false },
      { text: "Data is always numerical", isCorrect: false },
    ],
    category: "Introduction to Data Analytics & Power BI",
  },

  // Preparing Data with Excel & Power Query (6 questions)
  {
    text: "What is Power Query primarily used for?",
    options: [
      { text: "Creating visualizations", isCorrect: false },
      { text: "Data transformation and preparation", isCorrect: true },
      { text: "Writing DAX formulas", isCorrect: false },
      { text: "Publishing reports", isCorrect: false },
    ],
    category: "Preparing Data with Excel & Power Query",
  },
  {
    text: "Which Power Query step removes duplicate rows?",
    options: [
      { text: "Remove Rows", isCorrect: false },
      { text: "Remove Duplicates", isCorrect: true },
      { text: "Filter Rows", isCorrect: false },
      { text: "Sort Rows", isCorrect: false },
    ],
    category: "Preparing Data with Excel & Power Query",
  },
  {
    text: "What is the M language in Power Query?",
    options: [
      { text: "A visualization language", isCorrect: false },
      { text: "A formula language for data transformation", isCorrect: true },
      { text: "A database query language", isCorrect: false },
      { text: "A programming language for UI", isCorrect: false },
    ],
    category: "Preparing Data with Excel & Power Query",
  },
  {
    text: "How do you merge two tables in Power Query?",
    options: [
      { text: "Use the Append function", isCorrect: false },
      { text: "Use the Merge Queries function", isCorrect: true },
      { text: "Use the Join function", isCorrect: false },
      { text: "Use the Combine function", isCorrect: false },
    ],
    category: "Preparing Data with Excel & Power Query",
  },
  {
    text: "What does the 'Group By' operation do in Power Query?",
    options: [
      { text: "Sorts data by a column", isCorrect: false },
      { text: "Aggregates data based on specified columns", isCorrect: true },
      { text: "Filters data", isCorrect: false },
      { text: "Splits data", isCorrect: false },
    ],
    category: "Preparing Data with Excel & Power Query",
  },
  {
    text: "Which function in Power Query is used to split a column?",
    options: [
      { text: "Split Column", isCorrect: true },
      { text: "Divide Column", isCorrect: false },
      { text: "Separate Column", isCorrect: false },
      { text: "Break Column", isCorrect: false },
    ],
    category: "Preparing Data with Excel & Power Query",
  },

  // Data Cleaning & Transformation (4 questions)
  {
    text: "What is data cleaning?",
    options: [
      { text: "Deleting all data", isCorrect: false },
      { text: "Removing errors and inconsistencies from data", isCorrect: true },
      { text: "Creating new data", isCorrect: false },
      { text: "Compressing data", isCorrect: false },
    ],
    category: "Data Cleaning & Transformation",
  },
  {
    text: "Which of the following is a common data quality issue?",
    options: [
      { text: "Consistent formatting", isCorrect: false },
      { text: "Missing values", isCorrect: true },
      { text: "Complete records", isCorrect: false },
      { text: "Valid data types", isCorrect: false },
    ],
    category: "_data Cleaning & Transformation",
  },
  {
    text: "How do you handle missing values in Power BI?",
    options: [
      { text: "Delete the entire dataset", isCorrect: false },
      { text: "Use functions like IFNULL or COALESCE", isCorrect: true },
      { text: "Ignore them completely", isCorrect: false },
      { text: "Replace with random values", isCorrect: false },
    ],
    category: "Data Cleaning & Transformation",
  },
  {
    text: "What is data transformation?",
    options: [
      { text: "Converting data from one format to another", isCorrect: true },
      { text: "Deleting data", isCorrect: false },
      { text: "Storing data", isCorrect: false },
      { text: "Visualizing data", isCorrect: false },
    ],
    category: "Data Cleaning & Transformation",
  },

  // Data Modeling (5 questions)
  {
    text: "What is a data model in Power BI?",
    options: [
      { text: "A visualization", isCorrect: false },
      { text: "A collection of tables and relationships", isCorrect: true },
      { text: "A DAX formula", isCorrect: false },
      { text: "A report layout", isCorrect: false },
    ],
    category: "Data Modeling",
  },
  {
    text: "What type of relationship connects two tables with a one-to-many connection?",
    options: [
      { text: "Many-to-many", isCorrect: false },
      { text: "One-to-one", isCorrect: false },
      { text: "One-to-many", isCorrect: true },
      { text: "No relationship", isCorrect: false },
    ],
    category: "Data Modeling",
  },
  {
    text: "What is a star schema in data modeling?",
    options: [
      { text: "A schema with only one table", isCorrect: false },
      { text: "A central fact table connected to dimension tables", isCorrect: true },
      { text: "A circular relationship", isCorrect: false },
      { text: "A schema with no relationships", isCorrect: false },
    ],
    category: "Data Modeling",
  },
  {
    text: "What is the purpose of a dimension table?",
    options: [
      { text: "To store numerical data", isCorrect: false },
      { text: "To provide descriptive attributes for analysis", isCorrect: true },
      { text: "To store calculations", isCorrect: false },
      { text: "To create visualizations", isCorrect: false },
    ],
    category: "Data Modeling",
  },
  {
    text: "What is a fact table?",
    options: [
      { text: "A table with descriptive data", isCorrect: false },
      { text: "A table containing quantitative data for analysis", isCorrect: true },
      { text: "A table with relationships", isCorrect: false },
      { text: "A table with DAX measures", isCorrect: false },
    ],
    category: "Data Modeling",
  },

  // DAX (Measures & Calculations) (5 questions)
  {
    text: "What does DAX stand for?",
    options: [
      { text: "Data Analysis Expressions", isCorrect: true },
      { text: "Data Analytics X", isCorrect: false },
      { text: "Database Analysis X", isCorrect: false },
      { text: "Data Analysis XML", isCorrect: false },
    ],
    category: "DAX (Measures & Calculations)",
  },
  {
    text: "What is the difference between a calculated column and a measure?",
    options: [
      { text: "There is no difference", isCorrect: false },
      { text: "Calculated columns are computed during data load, measures are computed at query time", isCorrect: true },
      { text: "Measures are computed during data load", isCorrect: false },
      { text: "Calculated columns use DAX, measures don't", isCorrect: false },
    ],
    category: "DAX (Measures & Calculations)",
  },
  {
    text: "Which DAX function is used to calculate a running total?",
    options: [
      { text: "SUM", isCorrect: false },
      { text: "CALCULATE", isCorrect: false },
      { text: "TOTALYTD", isCorrect: false },
      { text: "All of the above can be used", isCorrect: true },
    ],
    category: "DAX (Measures & Calculations)",
  },
  {
    text: "What is the purpose of the CALCULATE function?",
    options: [
      { text: "To sum values", isCorrect: false },
      { text: "To modify the filter context of an expression", isCorrect: true },
      { text: "To count rows", isCorrect: false },
      { text: "To create a table", isCorrect: false },
    ],
    category: "DAX (Measures & Calculations)",
  },
  {
    text: "Which function returns a table of all values in a column?",
    options: [
      { text: "VALUES", isCorrect: true },
      { text: "SUM", isCorrect: false },
      { text: "COUNT", isCorrect: false },
      { text: "FILTER", isCorrect: false },
    ],
    category: "DAX (Measures & Calculations)",
  },

  // Data Visualization & Reports (4 questions)
  {
    text: "Which visualization is best for showing trends over time?",
    options: [
      { text: "Pie chart", isCorrect: false },
      { text: "Line chart", isCorrect: true },
      { text: "Scatter plot", isCorrect: false },
      { text: "Tree map", isCorrect: false },
    ],
    category: "Data Visualization & Reports",
  },
  {
    text: "What is the purpose of a slicer in Power BI?",
    options: [
      { text: "To slice data into smaller pieces", isCorrect: false },
      { text: "To filter data across multiple visualizations", isCorrect: true },
      { text: "To create new data", isCorrect: false },
      { text: "To format visualizations", isCorrect: false },
    ],
    category: "Data Visualization & Reports",
  },
  {
    text: "Which visualization is best for showing parts of a whole?",
    options: [
      { text: "Bar chart", isCorrect: false },
      { text: "Pie chart", isCorrect: true },
      { text: "Line chart", isCorrect: false },
      { text: "Scatter plot", isCorrect: false },
    ],
    category: "Data Visualization & Reports",
  },
  {
    text: "What is a Power BI report?",
    options: [
      { text: "A single visualization", isCorrect: false },
      { text: "A collection of visualizations on one or more pages", isCorrect: true },
      { text: "A data source", isCorrect: false },
      { text: "A DAX formula", isCorrect: false },
    ],
    category: "Data Visualization & Reports",
  },

  // Dashboards & Business Insights (2 questions)
  {
    text: "What is the main difference between a report and a dashboard in Power BI?",
    options: [
      { text: "They are the same thing", isCorrect: false },
      { text: "Reports are for data exploration, dashboards are for monitoring KPIs", isCorrect: true },
      { text: "Dashboards have more visualizations", isCorrect: false },
      { text: "Reports are only in Power BI Service", isCorrect: false },
    ],
    category: "Dashboards & Business Insights",
  },
  {
    text: "What is a KPI in Power BI?",
    options: [
      { text: "Key Performance Indicator - a measurable value", isCorrect: true },
      { text: "Key Process Integration", isCorrect: false },
      { text: "Key Performance Index", isCorrect: false },
      { text: "Key Process Indicator", isCorrect: false },
    ],
    category: "Dashboards & Business Insights",
  },

  // Power BI Service & Sharing (1 question)
  {
    text: "How can you share a Power BI report with colleagues?",
    options: [
      { text: "Only by email", isCorrect: false },
      { text: "By publishing to Power BI Service and sharing with users", isCorrect: true },
      { text: "By exporting to Excel only", isCorrect: false },
      { text: "By printing the report", isCorrect: false },
    ],
    category: "Power BI Service & Sharing",
  },

  // Additional questions to reach 40 total
  {
    text: "What is the purpose of the Power BI Gateway?",
    options: [
      { text: "To create visualizations", isCorrect: false },
      { text: "To connect on-premises data sources to Power BI Service", isCorrect: true },
      { text: "To write DAX formulas", isCorrect: false },
      { text: "To format reports", isCorrect: false },
    ],
    category: "Power BI Service & Sharing",
  },
  {
    text: "Which Power BI feature allows real-time data monitoring?",
    options: [
      { text: "Power BI Desktop", isCorrect: false },
      { text: "Power BI Service with DirectQuery", isCorrect: true },
      { text: "Excel", isCorrect: false },
      { text: "Power Query", isCorrect: false },
    ],
    category: "Power BI Service & Sharing",
  },
  {
    text: "What is a workspace in Power BI?",
    options: [
      { text: "A single visualization", isCorrect: false },
      { text: "A container for organizing and collaborating on Power BI content", isCorrect: true },
      { text: "A data source", isCorrect: false },
      { text: "A DAX formula", isCorrect: false },
    ],
    category: "Power BI Service & Sharing",
  },
  {
    text: "How do you refresh data in Power BI Service?",
    options: [
      { text: "Manually only", isCorrect: false },
      { text: "Scheduled refresh or manual refresh", isCorrect: true },
      { text: "Automatic only", isCorrect: false },
      { text: "Cannot refresh in Service", isCorrect: false },
    ],
    category: "Power BI Service & Sharing",
  },
  {
    text: "What is the difference between Power BI Pro and Premium?",
    options: [
      { text: "No difference", isCorrect: false },
      { text: "Premium offers enhanced capacity and performance features", isCorrect: true },
      { text: "Pro is more expensive", isCorrect: false },
      { text: "Premium is for individuals only", isCorrect: false },
    ],
    category: "Power BI Service & Sharing",
  },
  {
    text: "What is row-level security (RLS) in Power BI?",
    options: [
      { text: "A visualization type", isCorrect: false },
      { text: "A security feature that restricts data access based on user roles", isCorrect: true },
      { text: "A DAX function", isCorrect: false },
      { text: "A data transformation", isCorrect: false },
    ],
    category: "Data Modeling",
  },
  {
    text: "Which DAX function is used to filter a table?",
    options: [
      { text: "SUM", isCorrect: false },
      { text: "FILTER", isCorrect: true },
      { text: "COUNT", isCorrect: false },
      { text: "AVERAGE", isCorrect: false },
    ],
    category: "DAX (Measures & Calculations)",
  },
  {
    text: "What is the purpose of the RELATED function in DAX?",
    options: [
      { text: "To sum values", isCorrect: false },
      { text: "To retrieve values from a related table", isCorrect: true },
      { text: "To count rows", isCorrect: false },
      { text: "To create a table", isCorrect: false },
    ],
    category: "DAX (Measures & Calculations)",
  },
  {
    text: "What is a measure in Power BI?",
    options: [
      { text: "A column in a table", isCorrect: false },
      { text: "A calculation based on data using DAX", isCorrect: true },
      { text: "A visualization", isCorrect: false },
      { text: "A data source", isCorrect: false },
    ],
    category: "DAX (Measures & Calculations)",
  },
  {
    text: "Which visualization type is best for comparing categories?",
    options: [
      { text: "Line chart", isCorrect: false },
      { text: "Bar chart", isCorrect: true },
      { text: "Pie chart", isCorrect: false },
      { text: "Scatter plot", isCorrect: false },
    ],
    category: "Data Visualization & Reports",
  },
];

async function seedQuestions(quizId: number) {
  console.log(`Seeding questions for quiz ID: ${quizId}`);
  
  for (const questionData of questionsData) {
    try {
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          quizId: quizId,
          options: {
            create: questionData.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
      console.log(`Created question: ${question.text.substring(0, 50)}...`);
    } catch (error) {
      console.error(`Error creating question: ${questionData.text}`, error);
    }
  }
  
  console.log('Seeding completed!');
}

// Run the seed function only if run directly
const isDirectRun = process.argv[1] && process.argv[1].includes('questions.seed');
if (isDirectRun) {
  const quizId = process.argv[2] ? parseInt(process.argv[2]) : 1;

  if (!quizId) {
    console.error('Please provide a quiz ID as argument');
    console.error('Usage: npx ts-node questions.seed.ts <quizId>');
    process.exit(1);
  }

  seedQuestions(quizId)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
