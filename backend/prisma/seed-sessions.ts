import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Récupérer le cours Data Analytics & Power BI (ID 19)
  const course = await prisma.course.findUnique({
    where: { id: 19 },
    include: { sessions: true },
  });

  if (!course) {
    console.log('Course with ID 19 not found');
    return;
  }

  console.log(`Found course: ${course.title}`);
  console.log(`Updating ${course.sessions.length} sessions with professional descriptions...`);

  // Descriptions professionnelles et très détaillées pour chaque session (niveau Coursera/Udemy)
  const sessionDescriptions = [
    {
      title: 'Introduction to Data Analytics & Power BI',
      description: 'In this comprehensive introduction, you will embark on your journey into the world of data analytics and Power BI. We begin by exploring the fundamental concepts that underpin modern data analytics, including the data analytics lifecycle, the importance of data-driven decision making, and how organizations leverage analytics to gain competitive advantages. You will learn about the different types of analytics (descriptive, diagnostic, predictive, and prescriptive) and when to apply each approach. We will introduce Power BI as a leading business intelligence tool, discussing its components (Power BI Desktop, Power BI Service, Power BI Mobile, and Power BI Report Server) and how they work together to create a complete analytics solution. By the end of this session, you will have a solid understanding of the data analytics landscape and be prepared to dive deeper into Power BI\'s capabilities. You will also learn about the career opportunities in data analytics and the skills you will develop throughout this course.',
    },
    {
      title: 'Preparing Data with Excel & Power Query',
      description: 'Data preparation is often cited as the most time-consuming part of any analytics project, and this session will equip you with the skills to handle it efficiently. We will start by exploring the fundamentals of data preparation, including understanding data sources, data quality issues, and the importance of clean data. You will learn to use Excel for basic data preparation tasks, including importing data from various sources (CSV, Excel, databases, web), cleaning data using Excel\'s built-in tools, and preparing datasets for analysis. We will then transition to Power Query, a powerful data transformation and preparation engine built into Power BI and Excel. You will master the Power Query Editor interface, learn to connect to diverse data sources, and perform common transformations such as removing duplicates, handling missing values, splitting columns, merging tables, and unpivoting data. We will cover advanced techniques including custom functions, parameterization, and creating reusable data preparation workflows. By the end of this session, you will be able to transform raw, messy data into clean, analysis-ready datasets efficiently and reproducibly.',
    },
    {
      title: 'Data Cleaning & Transformation',
      description: 'Building on the foundations from the previous session, this deep dive into data cleaning and transformation will equip you with advanced techniques to handle complex data quality challenges. We will explore systematic approaches to data cleaning, including data profiling to understand your data, identifying and handling outliers, dealing with inconsistent formatting, and standardizing data values. You will learn advanced Power Query transformations including conditional columns, custom M code, handling complex data types, and working with nested structures. We will cover best practices for data quality, including data validation rules, data lineage tracking, and documentation of transformation steps. You will learn to handle common data issues such as duplicate records, missing values, inconsistent date formats, and text normalization. We will also explore techniques for handling large datasets efficiently, including query folding optimization and performance considerations. By the end of this session, you will have mastered the art of transforming even the messiest data into clean, reliable datasets ready for analysis, with a toolkit of techniques you can apply to any data challenge.',
    },
    {
      title: 'Data Modeling',
      description: 'Data modeling is the foundation of any robust Power BI solution, and this session will provide you with a deep understanding of modeling principles and best practices. We will start with the fundamentals, including understanding the purpose of data modeling, the difference between transactional and analytical data, and the importance of a well-structured data model. You will learn about schema patterns, including star schema and snowflake schema, and when to use each pattern. We will cover the concepts of fact tables and dimension tables, understanding their roles and how to design them effectively. You will master relationships in Power BI, including cardinality (one-to-one, one-to-many, many-to-many), cross-filter direction (single, both), and relationship types (active, inactive). We will explore advanced modeling topics including handling many-to-many relationships, role-playing dimensions, and degenerate dimensions. You will learn about data model optimization, including reducing cardinality, using integer keys, and organizing tables for performance. We will also cover the concept of data granularity and ensuring your model supports the level of analysis required. By the end of this session, you will be able to design and implement scalable, performant data models that serve as the foundation for powerful Power BI reports.',
    },
    {
      title: 'DAX (Measures & Calculations)',
      description: 'DAX (Data Analysis Expressions) is a powerful formula language that enables you to create sophisticated calculations and aggregations in Power BI. This session will take you from DAX fundamentals to advanced techniques used by professional data analysts. We will start with the basics, including understanding DAX syntax, the difference between calculated columns and measures, and the concept of evaluation context (row context vs filter context). You will learn essential DAX functions including aggregation functions (SUM, COUNT, AVERAGE, etc.), filter functions (FILTER, ALL, ALLEXCEPT, etc.), and relationship functions (RELATED, RELATEDTABLE, etc.). We will then dive into time intelligence, a critical aspect of business analytics, learning functions like TOTALYTD, SAMEPERIODLASTYEAR, DATEADD, and DATESBETWEEN to perform year-over-year comparisons, running totals, and period-over-period analysis. You will master advanced DAX concepts including variables, iterators (SUMX, AVERAGEX, etc.), and complex filter manipulation. We will cover performance optimization techniques including understanding query plans, using variables effectively, and avoiding common performance pitfalls. By the end of this session, you will be able to create sophisticated calculations that bring your data to life and provide deep insights.',
    },
    {
      title: 'Data Visualization & Reports',
      description: 'Effective data visualization is both an art and a science, and this session will equip you with the skills to create compelling, insightful visualizations in Power BI. We will begin with visualization principles, including understanding the purpose of visualization, choosing the right chart type for your data, and following best practices for clarity and effectiveness. You will learn to use Power BI\'s extensive visualization library, including basic charts (bar, column, line, pie), statistical charts (scatter, bubble, histogram), and specialized visualizations (treemap, map, gauge, funnel, card). We will cover customization techniques including formatting, conditional formatting, tooltips, and data labels. You will learn to create interactive reports using slicers, drill-down, drill-through, and cross-filtering. We will explore advanced visualization topics including small multiples, custom visuals from the marketplace, and creating composite visualizations. We will also cover accessibility considerations, ensuring your visualizations are usable by all audiences. By the end of this session, you will be able to transform data into compelling visual stories that communicate insights effectively and drive action.',
    },
    {
      title: 'Dashboards & Business Insights',
      description: 'Dashboards are the ultimate expression of business intelligence, providing at-a-glance views of key performance indicators and enabling data-driven decision making. This session will teach you how to design and build professional dashboards in Power BI. We will start with dashboard design principles, including understanding the difference between reports and dashboards, designing for your audience, and creating logical layouts. You will learn to create effective dashboards using Power BI Service, including pinning visuals, arranging tiles, and configuring mobile layouts. We will cover advanced dashboard features including Q&A natural language queries, AI-powered insights, and data alerts. You will learn to implement navigation using bookmarks and buttons, creating guided tours through your data. We will explore techniques for creating actionable dashboards that drive business decisions, including identifying key metrics, setting targets, and creating performance indicators. We will also cover dashboard governance, including managing access, version control, and documentation. By the end of this session, you will be able to create professional dashboards that provide actionable business insights and enable stakeholders to make data-driven decisions quickly and confidently.',
    },
    {
      title: 'Power BI Service & Sharing',
      description: 'Power BI is not just about creating reports and dashboards—it is about sharing insights with the right people at the right time. This session will equip you with the skills to publish, share, and collaborate using Power BI Service. We will begin with an overview of Power BI Service, including its features, licensing models, and how it complements Power BI Desktop. You will learn to publish reports from Power BI Desktop to Power BI Service, understanding the publishing process and managing report versions. We will cover workspaces in detail, including creating workspaces, adding members, assigning roles, and organizing content. You will learn to create and distribute apps, which are collections of dashboards and reports packaged for distribution to specific audiences. We will explore security features including row-level security (RLS) to control data access based on user roles, and object-level security to control access to specific reports or dashboards. You will learn to configure data refreshes, including scheduled refresh, on-demand refresh, and refresh from data sources. We will cover collaboration features including sharing reports, dashboards, and datasets, as well as using comments and annotations. We will also cover administration topics including monitoring usage, managing capacity, and implementing governance policies. By the end of this session, you will be able to effectively share your Power BI content with stakeholders while maintaining security and control.',
    },
  ];

  // Mettre à jour chaque session avec sa description professionnelle
  for (const session of course.sessions) {
    const descriptionData = sessionDescriptions.find(
      (desc) => desc.title === session.title
    );

    if (descriptionData) {
      await prisma.session.update({
        where: { id: session.id },
        data: { description: descriptionData.description },
      });
      console.log(`✓ Updated: ${session.title}`);
    } else {
      console.log(`⚠ No description found for: ${session.title}`);
    }
  }

  console.log('Session descriptions updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
