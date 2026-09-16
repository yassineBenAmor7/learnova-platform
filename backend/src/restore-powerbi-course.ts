import { PrismaClient } from '@prisma/client';
import { questionsData } from './questions/questions.seed';

const prisma = new PrismaClient();

const powerBICourseData = {
  title: "Data Analytics & Power BI",
  description: "Comprehensive course on Data Analytics and Power BI including data preparation, modeling, DAX calculations, visualization, and business insights.",
  creatorId: 1, // Replace with actual admin user ID
};

const quizData = {
  title: "Data Analytics & Power BI Assessment",
  description: "Final assessment for the Data Analytics & Power BI course covering all key concepts and practical applications.",
  courseId: 0, // Will be set after course creation
  isExamMode: true,
  timeLimitMinutes: 60,
  passingScore: 70,
  maxAttempts: 1,
};

const sessionQuizData = [
  {
    title: "Introduction to Data Analytics & Power BI Quiz",
    description: "Test your understanding of data analytics fundamentals and Power BI ecosystem.",
    sessionIndex: 0,
    questions: [
      {
        text: "What is the primary purpose of data analytics?",
        options: [
          { text: "To store data", isCorrect: false },
          { text: "To analyze data for insights and decision-making", isCorrect: true },
          { text: "To visualize data only", isCorrect: false },
          { text: "To clean data", isCorrect: false },
        ],
      },
      {
        text: "Which of the following is NOT a key component of Power BI?",
        options: [
          { text: "Power BI Desktop", isCorrect: false },
          { text: "Power BI Service", isCorrect: false },
          { text: "Power BI Mobile", isCorrect: false },
          { text: "Power BI Database", isCorrect: true },
        ],
      },
      {
        text: "What is the difference between data and information?",
        options: [
          { text: "Data is processed, information is raw", isCorrect: false },
          { text: "Information is processed data that provides context", isCorrect: true },
          { text: "There is no difference", isCorrect: false },
          { text: "Data is always numerical", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Preparing Data with Excel & Power Query Quiz",
    description: "Test your knowledge of data transformation using Power Query.",
    sessionIndex: 1,
    questions: [
      {
        text: "What is Power Query primarily used for?",
        options: [
          { text: "Creating visualizations", isCorrect: false },
          { text: "Data transformation and preparation", isCorrect: true },
          { text: "Writing DAX formulas", isCorrect: false },
          { text: "Publishing reports", isCorrect: false },
        ],
      },
      {
        text: "Which Power Query step removes duplicate rows?",
        options: [
          { text: "Remove Rows", isCorrect: false },
          { text: "Remove Duplicates", isCorrect: true },
          { text: "Filter Rows", isCorrect: false },
          { text: "Sort Rows", isCorrect: false },
        ],
      },
      {
        text: "How do you merge two tables in Power Query?",
        options: [
          { text: "Use the Append function", isCorrect: false },
          { text: "Use the Merge Queries function", isCorrect: true },
          { text: "Use the Join function", isCorrect: false },
          { text: "Use the Combine function", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Data Cleaning & Transformation Quiz",
    description: "Test your understanding of data quality and cleaning techniques.",
    sessionIndex: 2,
    questions: [
      {
        text: "What is data cleaning?",
        options: [
          { text: "Deleting all data", isCorrect: false },
          { text: "Removing errors and inconsistencies from data", isCorrect: true },
          { text: "Creating new data", isCorrect: false },
          { text: "Compressing data", isCorrect: false },
        ],
      },
      {
        text: "Which of the following is a common data quality issue?",
        options: [
          { text: "Consistent formatting", isCorrect: false },
          { text: "Missing values", isCorrect: true },
          { text: "Complete records", isCorrect: false },
          { text: "Valid data types", isCorrect: false },
        ],
      },
      {
        text: "How do you handle missing values in Power BI?",
        options: [
          { text: "Delete the entire dataset", isCorrect: false },
          { text: "Use functions like IFNULL or COALESCE", isCorrect: true },
          { text: "Ignore them completely", isCorrect: false },
          { text: "Replace with random values", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Data Modeling Quiz",
    description: "Test your knowledge of data models and relationships.",
    sessionIndex: 3,
    questions: [
      {
        text: "What is a data model in Power BI?",
        options: [
          { text: "A visualization", isCorrect: false },
          { text: "A collection of tables and relationships", isCorrect: true },
          { text: "A DAX formula", isCorrect: false },
          { text: "A report layout", isCorrect: false },
        ],
      },
      {
        text: "What type of relationship connects two tables with a one-to-many connection?",
        options: [
          { text: "Many-to-many", isCorrect: false },
          { text: "One-to-one", isCorrect: false },
          { text: "One-to-many", isCorrect: true },
          { text: "No relationship", isCorrect: false },
        ],
      },
      {
        text: "What is a star schema in data modeling?",
        options: [
          { text: "A schema with only one table", isCorrect: false },
          { text: "A central fact table connected to dimension tables", isCorrect: true },
          { text: "A circular relationship", isCorrect: false },
          { text: "A schema with no relationships", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "DAX (Measures & Calculations) Quiz",
    description: "Test your understanding of DAX formulas and calculations.",
    sessionIndex: 4,
    questions: [
      {
        text: "What does DAX stand for?",
        options: [
          { text: "Data Analysis Expressions", isCorrect: true },
          { text: "Data Analytics X", isCorrect: false },
          { text: "Database Analysis X", isCorrect: false },
          { text: "Data Analysis XML", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between a calculated column and a measure?",
        options: [
          { text: "There is no difference", isCorrect: false },
          { text: "Calculated columns are computed during data load, measures are computed at query time", isCorrect: true },
          { text: "Measures are computed during data load", isCorrect: false },
          { text: "Calculated columns use DAX, measures don't", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of the CALCULATE function?",
        options: [
          { text: "To sum values", isCorrect: false },
          { text: "To modify the filter context of an expression", isCorrect: true },
          { text: "To count rows", isCorrect: false },
          { text: "To create a table", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Data Visualization & Reports Quiz",
    description: "Test your knowledge of creating effective visualizations.",
    sessionIndex: 5,
    questions: [
      {
        text: "Which visualization is best for showing trends over time?",
        options: [
          { text: "Pie chart", isCorrect: false },
          { text: "Line chart", isCorrect: true },
          { text: "Scatter plot", isCorrect: false },
          { text: "Tree map", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of a slicer in Power BI?",
        options: [
          { text: "To slice data into smaller pieces", isCorrect: false },
          { text: "To filter data across multiple visualizations", isCorrect: true },
          { text: "To create new data", isCorrect: false },
          { text: "To format visualizations", isCorrect: false },
        ],
      },
      {
        text: "Which visualization is best for showing parts of a whole?",
        options: [
          { text: "Bar chart", isCorrect: false },
          { text: "Pie chart", isCorrect: true },
          { text: "Line chart", isCorrect: false },
          { text: "Scatter plot", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Dashboards & Business Insights Quiz",
    description: "Test your understanding of dashboards and KPIs.",
    sessionIndex: 6,
    questions: [
      {
        text: "What is the main difference between a report and a dashboard in Power BI?",
        options: [
          { text: "They are the same thing", isCorrect: false },
          { text: "Reports are for data exploration, dashboards are for monitoring KPIs", isCorrect: true },
          { text: "Dashboards have more visualizations", isCorrect: false },
          { text: "Reports are only in Power BI Service", isCorrect: false },
        ],
      },
      {
        text: "What is a KPI in Power BI?",
        options: [
          { text: "Key Performance Indicator - a measurable value", isCorrect: true },
          { text: "Key Process Integration", isCorrect: false },
          { text: "Key Performance Index", isCorrect: false },
          { text: "Key Process Indicator", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of a dashboard?",
        options: [
          { text: "To store data", isCorrect: false },
          { text: "To monitor key metrics and business insights", isCorrect: true },
          { text: "To create visualizations", isCorrect: false },
          { text: "To write DAX formulas", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Power BI Service & Sharing Quiz",
    description: "Test your knowledge of Power BI Service features.",
    sessionIndex: 7,
    questions: [
      {
        text: "How can you share a Power BI report with colleagues?",
        options: [
          { text: "Only by email", isCorrect: false },
          { text: "By publishing to Power BI Service and sharing with users", isCorrect: true },
          { text: "By exporting to Excel only", isCorrect: false },
          { text: "By printing the report", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of the Power BI Gateway?",
        options: [
          { text: "To create visualizations", isCorrect: false },
          { text: "To connect on-premises data sources to Power BI Service", isCorrect: true },
          { text: "To write DAX formulas", isCorrect: false },
          { text: "To format reports", isCorrect: false },
        ],
      },
      {
        text: "What is a workspace in Power BI?",
        options: [
          { text: "A single visualization", isCorrect: false },
          { text: "A container for organizing and collaborating on Power BI content", isCorrect: true },
          { text: "A data source", isCorrect: false },
          { text: "A DAX formula", isCorrect: false },
        ],
      },
    ],
  },
];

const sessionsData = [
  {
    title: "Introduction to Data Analytics & Power BI",
    description: "Overview of data analytics concepts and Power BI ecosystem",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Understand the fundamental concepts of data analytics
- Navigate the Power BI ecosystem and its components
- Differentiate between data, information, and insights
- Identify the role of Power BI in modern business intelligence

## Key Topics Covered

### 1. What is Data Analytics?
Data analytics is the science of examining raw data to draw conclusions about information. It involves applying algorithms and mechanical processes to derive insights and trends from data.

### 2. The Power BI Ecosystem
Power BI consists of several components:
- **Power BI Desktop**: For creating reports and visualizations
- **Power BI Service**: For sharing and collaborating on reports
- **Power BI Mobile**: For accessing reports on mobile devices
- **Power BI Gateway**: For connecting on-premises data sources

### 3. Data vs Information vs Insights
- **Data**: Raw facts and figures without context
- **Information**: Data processed to have meaning
- **Insights**: Actionable conclusions drawn from information

### 4. Getting Started with Power BI
- Installing Power BI Desktop
- Understanding the interface
- Connecting to data sources
- Creating your first visualization

## Resources
- Microsoft Power BI Documentation
- Sample datasets for practice
- Community forums and support`,
    orderNumber: 1,
  },
  {
    title: "Preparing Data with Excel & Power Query",
    description: "Data transformation and preparation using Excel and Power Query",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Use Power Query Editor for data transformation
- Clean and format data effectively
- Merge and append data from multiple sources
- Apply advanced data transformation techniques

## Key Topics Covered

### 1. Introduction to Power Query
Power Query is a data connectivity and transformation technology that enables you to discover, connect, combine, and refine data across a wide variety of sources.

### 2. Data Transformation Basics
- Removing columns and rows
- Changing data types
- Splitting columns
- Replacing values
- Filtering data

### 3. Advanced Transformations
- Grouping and aggregating data
- Pivoting and unpivoting
- Custom M functions
- Conditional columns

### 4. Merging and Appending Data
- Understanding join types (inner, left, right, full)
- Merging queries with different keys
- Appending data from similar sources
- Handling duplicate data

## Best Practices
- Always keep original data untouched
- Document your transformation steps
- Use query folding when possible
- Test transformations on sample data first

## Resources
- Power Query M language reference
- Transformation examples and templates`,
    orderNumber: 2,
  },
  {
    title: "Data Cleaning & Transformation",
    description: "Techniques for cleaning and transforming data for analysis",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Identify common data quality issues
- Handle missing and inconsistent data
- Standardize data formats
- Validate data integrity

## Key Topics Covered

### 1. Common Data Quality Issues
- Missing values (nulls, blanks)
- Duplicate records
- Inconsistent formatting
- Outliers and anomalies
- Incorrect data types

### 2. Handling Missing Values
- Identifying missing data patterns
- Strategies for handling missing values:
  - Deletion
  - Imputation (mean, median, mode)
  - Default values
  - Predictive filling

### 3. Data Standardization
- Date and time formats
- Number formats and decimal places
- Text case consistency
- Categorical value standardization
- Address and location formatting

### 4. Data Validation
- Setting data type constraints
- Implementing validation rules
- Creating data quality checks
- Monitoring data quality over time

## Tools and Techniques
- Power Query transformation functions
- DAX for data validation
- Custom validation rules
- Data profiling techniques

## Resources
- Data quality assessment frameworks
- Industry standards for data cleaning`,
    orderNumber: 3,
  },
  {
    title: "Data Modeling",
    description: "Building data models with relationships and schema design",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Design effective data models
- Create and manage relationships
- Understand star schema vs snowflake schema
- Optimize data model performance

## Key Topics Covered

### 1. Understanding Data Models
A data model is a conceptual representation of data objects and their relationships. It serves as the foundation for meaningful analysis and reporting.

### 2. Schema Design Patterns
- **Star Schema**: Central fact table connected to dimension tables
- **Snowflake Schema**: Normalized dimension tables
- **Flat Schema**: Single denormalized table
- Choosing the right pattern for your needs

### 3. Relationships in Power BI
- One-to-many relationships
- Many-to-many relationships
- Relationship cardinality
- Cross-filter direction
- Active vs inactive relationships

### 4. Dimension and Fact Tables
- **Dimension Tables**: Descriptive attributes (products, customers, time)
- **Fact Tables**: Quantitative data (sales, transactions, metrics)
- Role-playing dimensions
- Degenerate dimensions

### 5. Model Optimization
- Reducing model size
- Improving query performance
- Using calculated columns vs measures
- Managing memory usage

## Best Practices
- Keep models simple and intuitive
- Use meaningful naming conventions
- Document your model structure
- Regular performance testing

## Resources
- Data modeling best practices guide
- Performance optimization techniques`,
    orderNumber: 4,
  },
  {
    title: "DAX (Measures & Calculations)",
    description: "Creating measures and calculations using DAX language",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Write DAX formulas for calculations
- Create measures and calculated columns
- Use essential DAX functions
- Understand filter context in DAX

## Key Topics Covered

### 1. Introduction to DAX
DAX (Data Analysis Expressions) is a formula language used in Power BI for creating custom calculations. It's similar to Excel formulas but more powerful for data modeling.

### 2. Calculated Columns vs Measures
- **Calculated Columns**: Computed during data load, stored in model
- **Measures**: Computed at query time, dynamic calculations
- When to use each approach
- Performance implications

### 3. Essential DAX Functions
- **Aggregation**: SUM, AVERAGE, COUNT, MAX, MIN
- **Filtering**: FILTER, ALL, VALUES, DISTINCT
- **Time Intelligence**: TOTALYTD, SAMEPERIODLASTYEAR, DATEADD
- **Relationship**: RELATED, RELATEDTABLE
- **Conditional**: IF, SWITCH, IFS

### 4. The CALCULATE Function
- Modifying filter context
- Understanding context transition
- Common CALCULATE patterns
- Advanced filtering scenarios

### 5. Filter Context
- Row context vs filter context
- Context transition
- Using variables in DAX
- Debugging DAX formulas

## Common Patterns
- Running totals
- Year-over-year comparisons
- Percentage calculations
- Conditional aggregations

## Resources
- DAX reference documentation
- Formula examples library
- Performance optimization guide`,
    orderNumber: 5,
  },
  {
    title: "Data Visualization & Reports",
    description: "Creating effective visualizations and reports in Power BI",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Choose appropriate visualizations for your data
- Create professional and effective reports
- Apply formatting and design principles
- Use advanced visualization features

## Key Topics Covered

### 1. Choosing the Right Visualization
- **Line Charts**: Trends over time
- **Bar/Column Charts**: Comparing categories
- **Pie Charts**: Parts of a whole
- **Scatter Plots**: Correlations and distributions
- **Maps**: Geographic data
- **Tables/Matrixes**: Detailed data display

### 2. Visualization Best Practices
- Keep it simple and focused
- Use appropriate chart types
- Avoid chart junk
- Ensure accessibility
- Consider color blindness

### 3. Report Design Principles
- Consistent formatting
- Logical layout and flow
- Effective use of white space
- Clear titles and labels
- Professional color schemes

### 4. Advanced Features
- Drill-down and drill-through
- Tooltips and data labels
- Conditional formatting
- Custom visuals
- Bookmarks and buttons

### 5. Formatting Options
- Colors and themes
- Fonts and typography
- Borders and backgrounds
- Data labels and values
- Axis formatting

## Design Tips
- Tell a story with your data
- Highlight key insights
- Use consistent design language
- Test with your audience
- Iterate based on feedback

## Resources
- Visualization gallery
- Design inspiration examples
- Accessibility guidelines`,
    orderNumber: 6,
  },
  {
    title: "Dashboards & Business Insights",
    description: "Building interactive dashboards and deriving business insights",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Create interactive dashboards
- Define and track KPIs
- Derive actionable business insights
- Use dashboard features effectively

## Key Topics Covered

### 1. Dashboard vs Report
- **Dashboards**: High-level monitoring, single page
- **Reports**: Detailed analysis, multiple pages
- When to use each
- Best practices for both

### 2. Key Performance Indicators (KPIs)
- What makes a good KPI
- Selecting meaningful metrics
- Setting targets and benchmarks
- Visualizing KPIs effectively
- KPI cards and gauges

### 3. Dashboard Design
- Purpose-driven design
- Logical information hierarchy
- Effective use of screen real estate
- Mobile responsiveness
- Performance considerations

### 4. Interactive Features
- Slicers and filters
- Cross-filtering and highlighting
- Drill-down capabilities
- Tooltips and details
- Bookmarks and buttons

### 5. Business Insights
- Identifying trends and patterns
- Spotting anomalies and outliers
- Comparative analysis
- What-if analysis
- Predictive indicators

## Dashboard Types
- Executive dashboards
- Operational dashboards
- Analytical dashboards
- Strategic dashboards

## Best Practices
- Focus on actionable insights
- Keep it updated and relevant
- Use consistent refresh schedules
- Document KPI definitions
- Regular performance reviews

## Resources
- Dashboard design templates
- KPI library examples
- Business intelligence frameworks`,
    orderNumber: 7,
  },
  {
    title: "Power BI Service & Sharing",
    description: "Publishing, sharing, and collaborating in Power BI Service",
    content: `## Learning Objectives

By the end of this session, you will be able to:
- Publish reports to Power BI Service
- Share and collaborate on reports
- Manage workspaces and apps
- Configure security and permissions

## Key Topics Covered

### 1. Power BI Service Overview
- What is Power BI Service
- Power BI Pro vs Premium
- Service features and capabilities
- Licensing considerations

### 2. Publishing Reports
- Publishing from Power BI Desktop
- Updating published reports
- Managing data sources
- Scheduled refresh configuration
- Gateway setup for on-premises data

### 3. Workspaces and Apps
- Creating and managing workspaces
- Collaborating with team members
- Publishing apps for distribution
- App lifecycle management
- Version control considerations

### 4. Sharing and Collaboration
- Sharing reports with colleagues
- Using SharePoint integration
- Embedding in other applications
- Exporting and printing
- Commenting and annotations

### 5. Security and Governance
- Row-level security (RLS)
- Data protection policies
- Access control and permissions
- Audit logging and monitoring
- Compliance considerations

### 6. Advanced Features
- Real-time dashboards
- Power BI Mobile apps
- API integration
- Custom connectors
- AI and machine learning features

## Best Practices
- Follow organizational governance policies
- Use appropriate sharing methods
- Regular security audits
- Document access permissions
- Monitor usage and performance

## Resources
- Power BI Service documentation
- Security and compliance guides
- Administration best practices`,
    orderNumber: 8,
  },
];

const videosData = [
  // Session 1: Introduction
  {
    title: "What is Data Analytics?",
    url: "https://www.youtube.com/watch?v=4C5mKR9YHI8",
    duration: 600, // 10 minutes in seconds
    orderNumber: 1,
    sessionIndex: 0,
    description: "An introductory lecture on the definition, importance, types, and core lifecycle of Data Analytics.",
    content: `### What is Data Analytics?

Data analytics is the systematic process of inspecting, cleansing, transforming, and modeling raw data to discover actionable insights, draw conclusions, and support business decision-making.

#### The 4 Types of Data Analytics
* **Descriptive Analytics**: Tells you *what happened* in the past (e.g., historical sales reports).
* **Diagnostic Analytics**: Focuses on *why it happened* by identifying anomalies and dependencies (e.g., investigating why website traffic dropped last week).
* **Predictive Analytics**: Forecasts *what is likely to happen* using statistical models and forecasting algorithms (e.g., forecasting next quarter's inventory demand).
* **Prescriptive Analytics**: Recommends *what actions should be taken* to achieve a specific outcome (e.g., automated dynamic pricing algorithms).

#### The Data Analytics Lifecycle
1. **Requirement Gathering**: Define the business question and scope.
2. **Data Collection**: Acquire raw data from databases, APIs, CSVs, or web sources.
3. **Data Cleaning**: Remove duplicates, handle missing values, and standardize columns.
4. **Data Analysis**: Build queries, write calculations (like DAX), and identify patterns.
5. **Data Visualization**: Create charts and dashboards to convey insights.
6. **Decision Making**: Act on the findings to drive business value.`,
  },
  {
    title: "Power BI Overview",
    url: "https://www.youtube.com/watch?v=fOE-0hVqzsU",
    duration: 720, // 12 minutes
    orderNumber: 2,
    sessionIndex: 0,
    description: "Learn about the Power BI suite, including Desktop, Service, Gateway, and Mobile, and how they fit into the BI workflow.",
    content: `### The Power BI Ecosystem

Microsoft Power BI is a collection of software services, apps, and connectors that work together to turn unrelated sources of data into coherent, visually immersive, and interactive insights.

#### Key Components of Power BI
* **Power BI Desktop**: A free, local application used to connect to, transform, and model data, and design report visualizations. This is the primary authoring tool.
* **Power BI Service (SaaS)**: A cloud-based service used to collaborate with colleagues, publish dashboards, set up scheduled refreshes, and distribute apps.
* **Power BI Mobile**: Native mobile applications (iOS, Android) to view and interact with reports securely on mobile devices.
* **Power BI Gateway**: Bridges cloud services with on-premises data sources to enable automatic scheduled data updates.

#### Typical BI Workflow
1. **Connect & Transform** data in Power BI Desktop (Power Query).
2. **Model & Calculate** metrics using relationships and DAX formulas.
3. **Design Reports** with interactive dashboards.
4. **Publish** the report to Power BI Service.
5. **Share & Collaborate** with team members and configure refreshes.`,
  },
  {
    title: "Data vs Information",
    url: "https://www.youtube.com/watch?v=Cul8kXkY6YI",
    duration: 480, // 8 minutes
    orderNumber: 3,
    sessionIndex: 0,
    description: "Explore the crucial differences between raw data, contextual information, and actionable business insights.",
    content: `### Understanding Data, Information, and Insights

Many organizations fail to differentiate between raw data and meaningful insights. Let's break down this fundamental hierarchy (often called the DIKW Pyramid).

#### The Data Hierarchy
* **Data (Raw Facts)**: Unprocessed, contextualized numbers or text.
  * *Example*: \`23, 27, 21, 29\` (just numbers).
* **Information (Processed Data)**: Data that has been cleaned, formatted, and put into context so it has meaning.
  * *Example*: "Daily average temperatures in Celsius for August: 23°C, 27°C, 21°C, 29°C."
* **Knowledge (Context & Synthesis)**: Understanding how the information relates to other elements.
  * *Example*: "This year's August temperatures are 5°C higher than the historical average."
* **Insights (Actionable Conclusions)**: Actionable knowledge that drives business decisions.
  * *Example*: "Due to rising temperatures, we must increase our air-conditioning inventory by 25% before August."`,
  },
  
  // Session 2: Preparing Data
  {
    title: "Introduction to Power Query",
    url: "https://www.youtube.com/watch?v=1y79KyKyO8A",
    duration: 900, // 15 minutes
    orderNumber: 1,
    sessionIndex: 1,
    description: "Getting started with the Power Query Editor in Excel and Power BI for connecting to external data.",
    content: `### Introduction to Power Query (ETL)

Power Query is the dedicated engine in Power BI used for the **ETL** process: **Extract, Transform, and Load**. It acts as a staging area where you clean and prepare data before importing it into the data model.

#### Main Interfaces in Power Query
* **Navigator Dialog**: View and select tables from your selected data sources.
* **Query Editor**: The main workspace with tabs for Transforming, Adding Columns, and Viewing data quality.
* **Applied Steps Panel**: Keeps a historical record of every transformation you perform (acting as a macro recorder that can be replayed).
* **Formula Bar**: Displays the underlying **M Language** code generated by your visual actions.`,
  },
  {
    title: "Data Transformation Basics",
    url: "https://www.youtube.com/watch?v=HsGEqQ0I5Tk",
    duration: 840, // 14 minutes
    orderNumber: 2,
    sessionIndex: 1,
    description: "Learn the essential techniques of columns/rows manipulation, splitting, data types casting, and simple filters.",
    content: `### Core Transformations in Power Query

Transforming data is essential to ensure it conforms to database standards and is optimized for the reporting engine.

#### Essential Transformations
* **Promote Headers**: Elevates the first row of data to become column names.
* **Change Data Types**: Explicitly define columns as Text, Whole Number, Decimal, Date, or Boolean to save memory and avoid runtime calculation errors.
* **Split Columns**: Divide columns by a delimiter (comma, space, semicolon) or character count.
* **Remove Duplicates/Errors**: Keep only unique records to prevent relationship errors.
* **Filter Rows**: Remove irrelevant data early to reduce dataset size.`,
  },
  {
    title: "Merging and Appending Data",
    url: "https://www.youtube.com/watch?v=8iDzVW1tTJc",
    duration: 780, // 13 minutes
    orderNumber: 3,
    sessionIndex: 1,
    description: "Understand how to join tables (merging queries) and stack data (appending queries) like SQL joins and unions.",
    content: `### Merging vs Appending Queries

In Power Query, you will often need to combine multiple tables. There are two primary ways to do this: Merging and Appending.

#### 1. Merging Queries (Horizontal Join)
Merging combines two tables horizontally based on matching columns (keys), similar to a SQL JOIN.
* **Left Outer**: Keeps all rows from the first table and matching rows from the second.
* **Inner**: Keeps only matching rows from both tables.
* **Full Outer**: Keeps all rows from both tables.
* **Right Outer**: Keeps all rows from the second table and matching rows from the first.

#### 2. Appending Queries (Vertical Union)
Appending stacks tables vertically, similar to a SQL UNION.
* *Requirement*: The tables must have the same number of columns with matching column names and data types.`,
  },
  
  // Session 3: Data Cleaning
  {
    title: "Identifying Data Quality Issues",
    url: "https://www.youtube.com/watch?v=6W8uZ6N8aX0",
    duration: 660, // 11 minutes
    orderNumber: 1,
    sessionIndex: 2,
    description: "Learn to profile your datasets using column quality, column profile, and column distribution tools.",
    content: `### Data Profiling in Power Query

Before cleaning data, you need to assess its quality. Power Query provides built-in visual data profiling tools in the **View** tab.

#### Data Profiling Features
* **Column Quality**: Shows the percentage of data that is *Valid*, *Error*, or *Empty (Null)*.
* **Column Distribution**: Shows a histogram representing the frequency of unique and distinct values.
* **Column Profile**: Provides a detailed breakdown of column statistics (Min, Max, Average, Standard Deviation, Count of Nulls, etc.).`,
  },
  {
    title: "Handling Missing Values",
    url: "https://www.youtube.com/watch?v=5q8p7I9x1lE",
    duration: 720, // 12 minutes
    orderNumber: 2,
    sessionIndex: 2,
    description: "Master strategies for replacing null values, filling up/down, and conditional imputation.",
    content: `### Advanced Strategies for Missing Data

Missing data (Nulls) can distort calculation metrics. You must resolve nulls during the transformation stage.

#### Imputation Methods
* **Replace Values**: Replace \`null\` with a default value (e.g., replacing null sales with \`0\` or null category with \`"Unknown"\`).
* **Fill Down / Fill Up**: Copies the last non-null value downwards or upwards. Extremely useful for dealing with merged spreadsheet layouts.
* **Conditional Imputation**: Create a new calculated column that uses an \`IF/ELSE\` rule to determine the value when a column is empty.`,
  },
  
  // Session 4: Data Modeling
  {
    title: "Understanding Data Models",
    url: "https://www.youtube.com/watch?v=7mNyfX9h2AA",
    duration: 840, // 14 minutes
    orderNumber: 1,
    sessionIndex: 3,
    description: "Learn the core concepts of relational database models, tables, keys (primary vs foreign), and entity relationships.",
    content: `### Fundamentals of Data Modeling

Data modeling is the process of defining how tables relate to one another. A solid data model is key to fast DAX calculations and clean report visuals.

#### Core Relational Concepts
* **Primary Key (PK)**: A column that uniquely identifies a row in a table (e.g., \`CustomerID\` in the Customers table).
* **Foreign Key (FK)**: A column in one table that references the Primary Key of another table (e.g., \`CustomerID\` in the Orders table).
* **Cardinality**: Describes the nature of the relationship (e.g., one customer can place many orders: **1-to-Many**).`,
  },
  {
    title: "Star Schema Design",
    url: "https://www.youtube.com/watch?v=9f7bkXQf8YQ",
    duration: 900, // 15 minutes
    orderNumber: 2,
    sessionIndex: 3,
    description: "Why Star Schema is the gold standard for Power BI modeling. Fact tables vs Dimension tables.",
    content: `### The Star Schema Architecture

The Star Schema is the recommended layout for Power BI. It consists of a central table connected to radiating surrounding tables.

#### Table Types in a Star Schema
* **Fact Tables (The 'What')**: Store quantitative measurements, metrics, or transactional records (e.g., Sales, Inventory levels). They contain numbers to aggregate and foreign keys.
* **Dimension Tables (The 'Who, When, Where')**: Store descriptive attributes and context about the business entities (e.g., Customers, Products, Calendars, Locations).

#### Why use Star Schema?
* **Performance**: Highly optimized for filter propagation.
* **Simplicity**: Easier to read, write DAX formulas, and navigate.`,
  },
  {
    title: "Creating Relationships",
    url: "https://www.youtube.com/watch?v=3g7cW4x8y9k",
    duration: 780, // 13 minutes
    orderNumber: 3,
    sessionIndex: 3,
    description: "How to configure cardinality (1:1, 1:N, N:N) and cross-filter directions (Single vs Both) in Power BI Desktop.",
    content: `### Configuring Relationships in Power BI

Power BI automatically detects relationships, but manually validating them is critical to prevent incorrect cross-filtering.

#### Relationship Settings
* **Cardinality**:
  * **1-to-Many (\`1:*\`)**: Standard star schema connection.
  * **Many-to-Many (\`*:*\`)**: Used for complex mappings, but should be avoided when possible by using a bridge table.
* **Cross-Filter Direction**:
  * **Single**: Filters flow in one direction (usually from Dimension to Fact table).
  * **Both (Bi-directional)**: Filters flow both ways. *Warning*: Can cause performance issues and circular dependencies.`,
  },
  
  // Session 5: DAX
  {
    title: "Introduction to DAX",
    url: "https://www.youtube.com/watch?v=a4i4E-2q1iY",
    duration: 960, // 16 minutes
    orderNumber: 1,
    sessionIndex: 4,
    description: "Introduction to Data Analysis Expressions syntax, operators, and basic calculated columns vs measures.",
    content: `### Getting Started with DAX

DAX (Data Analysis Expressions) is the formula language used to create custom calculations in Power BI models.

#### Calculated Columns vs Measures
* **Calculated Columns**:
  * Evaluated at data load.
  * Stored in the model (consumes RAM).
  * Uses Row Context (calculates row-by-row).
  * *Example*: \`LineTotal = Sales[Quantity] * Sales[UnitPrice]\`
* **Measures**:
  * Evaluated at query/render time.
  * Not stored in RAM (calculated dynamically).
  * Uses Filter Context (respects slicers and visuals).
  * *Example*: \`TotalSales = SUM(Sales[LineTotal])\``,
  },
  {
    title: "CALCULATE Function",
    url: "https://www.youtube.com/watch?v=82l8cxQnPkQ",
    duration: 900, // 15 minutes
    orderNumber: 2,
    sessionIndex: 4,
    description: "Mastering CALCULATE, the most powerful function in DAX, to modify filter contexts.",
    content: `### The CALCULATE Function

\`CALCULATE\` is the engine of DAX. It is the only function that allows you to modify the existing filter context of a report visual.

#### CALCULATE Syntax
\`\`\`dax
CALCULATE(<expression>, <filter1>, <filter2>, ...)
\`\`\`

#### How It Works
1. Power BI evaluates the current visual's filter context.
2. \`CALCULATE\` overrides, updates, or appends new filters specified in the arguments.
3. It evaluates the expression under the new modified filter context.

*Example (Calculate sales only for Red products)*:
\`\`\`dax
RedSales = CALCULATE([TotalSales], Products[Color] = "Red")
\`\`\``,
  },
  {
    title: "Common DAX Functions",
    url: "https://www.youtube.com/watch?v=k2E1MPdPaNc",
    duration: 840, // 14 minutes
    orderNumber: 3,
    sessionIndex: 4,
    description: "Quick reference guide to SUM, CALCULATE, DIVIDE, RELATED, and Time Intelligence functions (YTD, Prior Year).",
    content: `### Essential DAX Function Reference

Here is a checklist of the most common DAX functions you will write in professional reports.

#### 1. Safe Division (\`DIVIDE\`)
Prevents division-by-zero errors by returning a blank or default value.
\`\`\`dax
MarginPct = DIVIDE([TotalProfit], [TotalSales], 0)
\`\`\`

#### 2. Cross-Table References (\`RELATED\`)
Fetches values from a dimension table into a fact table during row-context.
\`\`\`dax
ProductCost = RELATED(Product[StandardCost])
\`\`\`

#### 3. Time Intelligence (\`SAMEPERIODLASTYEAR\`)
Allows comparison of current sales to the same period in the prior calendar year.
\`\`\`dax
SalesLY = CALCULATE([TotalSales], SAMEPERIODLASTYEAR(Calendar[Date]))
\`\`\``,
  },
  
  // Session 6: Visualization
  {
    title: "Choosing the Right Visualization",
    url: "https://www.youtube.com/watch?v=5q8p7I9x1lE",
    duration: 720, // 12 minutes
    orderNumber: 1,
    sessionIndex: 5,
    description: "How to match data types to the perfect visual chart (bars, lines, scatters, maps, pies).",
    content: `### Chart Selection Guidelines

Selecting the wrong visual is the most common reason dashboards fail to deliver business insights.

#### Which Chart to Use?
* **Line Chart**: Best for showing trends over continuous time intervals.
* **Bar / Column Chart**: Best for comparing distinct categories (e.g., Sales by Region).
* **Scatter Plot**: Ideal for identifying relationships or correlations between two numeric variables.
* **Pie / Donut Chart**: Only use for simple compositions with 2-3 categories maximum.
* **Treemap**: Good for nesting categories to show hierarchies and sizes.`,
  },
  {
    title: "Creating Reports",
    url: "https://www.youtube.com/watch?v=6W8uZ6N8aX0",
    duration: 840, // 14 minutes
    orderNumber: 2,
    sessionIndex: 5,
    description: "Best practices for grid layout, color hierarchy, font selection, and designing interactive report pages.",
    content: `### Report Design Principles

A professional report should guide the user's eye naturally from the most critical summary KPIs to detailed transactional tables.

#### Core Design Rules
* **Grid Layout**: Align visuals cleanly using a 3-column or 4-column invisible grid.
* **Visual Hierarchy**: Place big-number KPI cards at the top left, key trends in the middle, and detailed lists at the bottom.
* **Contrast & Theme**: Use clean white or dark grey backgrounds with a single primary color and one accent color to highlight key insights.
* **Interactivity**: Add bookmarks to switch visual layouts without loading new pages.`,
  },
  
  // Session 7: Dashboards
  {
    title: "Building Dashboards",
    url: "https://www.youtube.com/watch?v=7mNyfX9h2AA",
    duration: 900, // 15 minutes
    orderNumber: 1,
    sessionIndex: 6,
    description: "How to pin tiles from reports to create high-level executive dashboards in Power BI Service.",
    content: `### Reports vs Dashboards in Power BI

Many users confuse reports with dashboards. Let's clarify their distinct roles in the Power BI Service.

#### Comparison Table
| Feature | Report | Dashboard |
| :--- | :--- | :--- |
| **Pages** | Multiple pages | Single page only |
| **Data Sources** | Single dataset | Multiple datasets |
| **Interactivity** | Slicing, filtering, drill-through | Pinning tiles, alerts, Q&A |
| **Platform** | Power BI Desktop & Service | Power BI Service only |`,
  },
  {
    title: "KPIs and Business Insights",
    url: "https://www.youtube.com/watch?v=9f7bkXQf8YQ",
    duration: 780, // 13 minutes
    orderNumber: 2,
    sessionIndex: 6,
    description: "Designing KPIs (Key Performance Indicators) with target values and visual status indicators.",
    content: `### KPI Metrics & Gauge Design

KPIs are measurable values that demonstrate how effectively a company is achieving key business objectives.

#### Designing a KPI Visual
* **Indicator**: The current value of the metric (e.g., Current Sales).
* **Trend Axis**: Visual sparkline showing the change over time.
* **Target**: The benchmark goal (e.g., Target Sales).
* **Status color**: Automated formatting showing red (underperforming) or green (target met).`,
  },
  
  // Session 8: Power BI Service
  {
    title: "Publishing to Power BI Service",
    url: "https://www.youtube.com/watch?v=3g7cW4x8y9k",
    duration: 840, // 14 minutes
    orderNumber: 1,
    sessionIndex: 7,
    description: "Step-by-step publishing of .pbix files, gateway installation, and scheduling data updates.",
    content: `### Publishing & Gateway Configuration

Once your report is built in Power BI Desktop, you must publish it to the cloud to make it accessible to stakeholders.

#### Step-by-Step Deployment
1. Click **Publish** in Power BI Desktop and select a workspace.
2. Log in to the Power BI Service cloud.
3. Set up a **Power BI Gateway** on the local server where raw CSVs/databases reside.
4. Configure **Scheduled Refresh** (up to 8 times daily for Pro licenses) to fetch fresh data automatically.`,
  },
  {
    title: "Sharing and Collaboration",
    url: "https://www.youtube.com/watch?v=a4i4E-2q1iY",
    duration: 720, // 12 minutes
    orderNumber: 2,
    sessionIndex: 7,
    description: "Managing workspace roles (Admin, Member, Contributor, Viewer), app distribution, and Row-Level Security (RLS).",
    content: `### Sharing Reports and Security

Distributing insights securely is the final step in the data analytics lifecycle.

#### Workspace Collaborator Roles
* **Admin**: Complete access to edit, delete, share, and manage user permissions.
* **Member**: Can add members, create/edit content, and publish apps.
* **Contributor**: Can create and edit content inside the workspace, but cannot publish apps or manage users.
* **Viewer**: Read-only access to view and interact with reports.

#### Row-Level Security (RLS)
Restricts data access for given users based on criteria (e.g., regional manager only views Sales for their region). Configured using DAX filters in Desktop and mapped to AD Groups in the Service.`,
  },
];

async function restorePowerBICourse() {
  console.log('Starting restoration of Power BI course...');
  
  try {
    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: { title: powerBICourseData.title },
    });

    if (existingCourse) {
      console.log(`Course "${powerBICourseData.title}" already exists with ID: ${existingCourse.id}`);
      console.log('Skipping restoration. If you want to recreate, delete the existing course first.');
      return;
    }

    // Create course
    console.log('Creating Power BI course...');
    const course = await prisma.course.create({
      data: powerBICourseData,
    });
    console.log(`Course created with ID: ${course.id}`);

    // Create sessions
    console.log('Creating sessions...');
    const createdSessions: any[] = [];
    for (const sessionData of sessionsData) {
      const session = await prisma.session.create({
        data: {
          ...sessionData,
          courseId: course.id,
        },
      });
      createdSessions.push(session);
      console.log(`Session created: ${session.title}`);
    }

    // Create videos
    console.log('Creating videos...');
    for (const videoData of videosData) {
      const session = createdSessions[videoData.sessionIndex];
      const video = await prisma.video.create({
        data: {
          title: videoData.title,
          url: videoData.url,
          duration: videoData.duration,
          orderNumber: videoData.orderNumber,
          sessionId: session.id,
          description: (videoData as any).description || null,
          content: (videoData as any).content || null,
        },
      });
      console.log(`Video created: ${video.title}`);
    }

    // Create quiz
    console.log('Creating quiz...');
    const quiz = await prisma.quiz.create({
      data: {
        ...quizData,
        courseId: course.id,
      },
    });
    console.log(`Quiz created with ID: ${quiz.id}`);

    // Create session quizzes
    console.log('Creating session quizzes...');
    for (const sessionQuiz of sessionQuizData) {
      const session = createdSessions[sessionQuiz.sessionIndex];
      const sessionQuizCreated = await prisma.quiz.create({
        data: {
          title: sessionQuiz.title,
          description: sessionQuiz.description,
          courseId: course.id,
          isExamMode: false,
          timeLimitMinutes: 10,
          passingScore: 70,
          maxAttempts: 3,
        },
      });
      console.log(`Session quiz created: ${sessionQuizCreated.title}`);

      // Add questions to session quiz
      for (const questionData of sessionQuiz.questions) {
        const question = await prisma.question.create({
          data: {
            text: questionData.text,
            quizId: sessionQuizCreated.id,
            options: {
              create: questionData.options.map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
            },
          },
        });
        console.log(`Session quiz question created: ${question.text.substring(0, 50)}...`);
      }
    }

    // Import questions from seed data for final quiz
    console.log('Creating 40 quiz questions for final assessment...');
    
    for (const questionData of questionsData) {
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          quizId: quiz.id,
          options: {
            create: questionData.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
      console.log(`Final quiz question created: ${question.text.substring(0, 50)}...`);
    }

    console.log('✅ Power BI course restoration completed successfully!');
    console.log(`Course ID: ${course.id}`);
    console.log(`Sessions created: ${createdSessions.length}`);
    console.log(`Videos created: ${videosData.length}`);
    console.log(`Final quiz created: ${quiz.id}`);
    console.log(`Session quizzes created: ${sessionQuizData.length}`);
    console.log(`Final quiz questions created: ${questionsData.length}`);

  } catch (error) {
    console.error('❌ Error during restoration:', error);
    throw error;
  }
}

restorePowerBICourse()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
