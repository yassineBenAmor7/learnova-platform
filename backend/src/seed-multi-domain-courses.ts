import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMultiDomainCourses() {
  console.log('🌱 Seeding multi-domain non-IT courses across all difficulty levels...');

  // Find admin user or first user to assign as creator
  const creator = await prisma.user.findFirst({
    where: { role: { name: 'ADMIN' } },
  }) || await prisma.user.findFirst();

  if (!creator) {
    console.error('❌ No user found to assign as creator. Please register a user first.');
    return;
  }

  const coursesToSeed = [
    {
      title: 'Digital Marketing & Growth Strategy',
      description: 'Master SEO, Content Marketing, Paid Performance Ads, and Customer Acquisition Funnels to drive exponential business growth.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'MARKETING',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      sessions: [
        {
          title: 'Session 1: Technical SEO & Organic Discovery',
          description: 'Learn website architecture, keyword research, page speed optimization, and search engine ranking factors.',
          orderNumber: 1,
          content: 'Technical SEO forms the foundation of organic visibility. In this session, you will learn how search engine crawlers index your content, how to optimize site architecture, and how to execute keyword mapping for high-intent traffic.',
          videos: [
            { title: 'Understanding Search Engine Crawling & Indexing', url: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', duration: 720, orderNumber: 1 },
            { title: 'Keyword Research & Search Intent Mapping', url: 'https://www.youtube.com/watch?v=xsVT_-47C11', duration: 950, orderNumber: 2 }
          ]
        },
        {
          title: 'Session 2: Content Marketing & Conversion Funnels',
          description: 'Build persuasive copy and content strategies that nurture leads from awareness to conversion.',
          orderNumber: 2,
          content: 'Content is the engine of digital marketing. Discover how to create lead magnets, landing pages, email sequence automation, and compelling value propositions that convert cold prospects into loyal customers.',
          videos: [
            { title: 'Building High-Converting Landing Pages', url: 'https://www.youtube.com/watch?v=1xN5c6N1kR0', duration: 840, orderNumber: 1 }
          ]
        },
        {
          title: 'Session 3: Performance Ads (Google Ads & Meta)',
          description: 'Execute targeted PPC campaigns on Google, Instagram, and LinkedIn with positive ROAS.',
          orderNumber: 3,
          content: 'Master audience targeting, bidding strategies, ad copy testing, and pixel tracking across Google Search and Meta Ads Manager to scale customer acquisition profitability.',
          videos: [
            { title: 'Meta Ads Manager Campaign Setup & Retargeting', url: 'https://www.youtube.com/watch?v=b4S0eC4L6eM', duration: 1100, orderNumber: 1 }
          ]
        }
      ],
      quiz: {
        title: 'Digital Marketing & Growth Mastery Assessment',
        description: 'Test your knowledge on SEO, performance marketing, and conversion optimization.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the main objective of Technical SEO?',
            options: [
              { text: 'To design colorful website banners', isCorrect: false },
              { text: 'To ensure search engines can efficiently crawl, index, and render site pages', isCorrect: true },
              { text: 'To purchase paid PPC ad placements', isCorrect: false },
              { text: 'To send automated email newsletters', isCorrect: false }
            ]
          },
          {
            text: 'What metric measures the revenue generated for every dollar spent on advertising?',
            options: [
              { text: 'CTR (Click-Through Rate)', isCorrect: false },
              { text: 'ROAS (Return on Ad Spend)', isCorrect: true },
              { text: 'Bounce Rate', isCorrect: false },
              { text: 'CPM (Cost Per Mille)', isCorrect: false }
            ]
          },
          {
            text: 'Which funnel stage focuses on prospects who are comparing solutions before purchasing?',
            options: [
              { text: 'Top of Funnel (TOFU - Awareness)', isCorrect: false },
              { text: 'Middle of Funnel (MOFU - Evaluation)', isCorrect: true },
              { text: 'Post-Purchase Advocacy', isCorrect: false },
              { text: 'Chugging Funnel', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Financial Analysis & Corporate Valuation',
      description: 'Analyze financial statements, model free cash flows (DCF), and perform corporate valuation for investment decisions.',
      level: CourseLevel.ADVANCED,
      domain: 'FINANCE_BUSINESS',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      sessions: [
        {
          title: 'Session 1: Financial Statement Analysis',
          description: 'Deconstruct Income Statements, Balance Sheets, and Cash Flow Statements to assess profitability and solvency.',
          orderNumber: 1,
          content: 'Deep dive into financial accounting. Evaluate operating margins, working capital dynamics, debt covenants, and cash flow quality across public and private enterprise filings.',
          videos: [
            { title: 'Interlinking the 3 Core Financial Statements', url: 'https://www.youtube.com/watch?v=WEDIj9JBTC8', duration: 1050, orderNumber: 1 }
          ]
        },
        {
          title: 'Session 2: DCF Valuation & Financial Modeling',
          description: 'Build Discounted Cash Flow models, project Unlevered Free Cash Flow, and calculate WACC.',
          orderNumber: 2,
          content: 'Learn step-by-step financial modeling in Excel. Calculate Weighted Average Cost of Capital (WACC), terminal value multiples, and sensitivity tables for corporate valuation.',
          videos: [
            { title: 'Building a 3-Statement DCF Model', url: 'https://www.youtube.com/watch?v=fdGWP49r1wI', duration: 1250, orderNumber: 1 }
          ]
        }
      ],
      quiz: {
        title: 'Advanced Financial Analysis & Valuation Exam',
        description: 'Comprehensive exam evaluating corporate valuation, WACC, and financial modeling mastery.',
        passingScore: 75,
        questions: [
          {
            text: 'What does WACC represent in corporate finance?',
            options: [
              { text: 'Worldwide Accounting Cost Standard', isCorrect: false },
              { text: 'Weighted Average Cost of Capital used as discount rate for future cash flows', isCorrect: true },
              { text: 'Working Capital Asset Cash Ratio', isCorrect: false },
              { text: 'Weekly Amortization Cost Factor', isCorrect: false }
            ]
          },
          {
            text: 'Which financial statement reports a company liquidity and solvency at a specific point in time?',
            options: [
              { text: 'Income Statement', isCorrect: false },
              { text: 'Balance Sheet', isCorrect: true },
              { text: 'Statement of Cash Flows', isCorrect: false },
              { text: 'Retained Earnings Ledger', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Agile Project Management & Scrum Framework',
      description: 'Master Scrum ceremonies, backlog prioritization, sprint planning, and team velocity optimization for operational excellence.',
      level: CourseLevel.ALL_LEVELS,
      domain: 'MANAGEMENT',
      thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      sessions: [
        {
          title: 'Session 1: Agile Values & The Scrum Framework',
          description: 'Understand the Agile Manifesto, Scrum roles (PO, Scrum Master, Developers), and core ceremonies.',
          orderNumber: 1,
          content: `# Agile Values & The Scrum Framework

## The Agile Manifesto
The Agile Manifesto was published in 2001 by 17 software developers who wanted to find better ways of developing software. It consists of 4 values and 12 principles.

### 4 Core Values
1. **Individuals and interactions over processes and tools** - The most important factor in a project's success is the people and how they work together
2. **Working software over comprehensive documentation** - Delivering working software is more valuable than extensive documentation
3. **Customer collaboration over contract negotiation** - Continuous collaboration with customers is better than rigid contracts
4. **Responding to change over following a plan** - Being flexible and adapting to change is more important than sticking to a predetermined plan

### 12 Principles of Agile
1. Our highest priority is to satisfy the customer through early and continuous delivery of valuable software
2. Welcome changing requirements, even late in development
3. Deliver working software frequently, from a couple of weeks to a couple of months
4. Business people and developers must work together daily throughout the project
5. Build projects around motivated individuals
6. The most efficient method of conveying information is face-to-face conversation
7. Working software is the primary measure of progress
8. Agile processes promote sustainable development
9. Continuous attention to technical excellence and good design
10. Simplicity—the art of maximizing the amount of work not done—is essential
11. The best architectures, requirements, and designs emerge from self-organizing teams
12. The team reflects on how to become more effective

## Scrum Roles
### Product Owner (PO)
- Responsible for maximizing the value of the product
- Manages the Product Backlog
- Decides what features to build and in what order
- Represents stakeholders and customers

### Scrum Master
- Servant-leader for the Scrum Team
- Facilitates Scrum events and ensures Scrum practices are followed
- Removes impediments that block the team
- Coaches the team on Agile practices

### Developers
- Cross-functional team members who create the product
- Self-organizing and self-managing
- Responsible for delivering working software
- Collaborate daily to achieve the Sprint Goal

## Scrum Events (Ceremonies)
1. **Sprint Planning** - Plan what will be delivered in the Sprint
2. **Daily Scrum** - 15-minute daily synchronization meeting
3. **Sprint Review** - Review and demo the work completed
4. **Sprint Retrospective** - Reflect on how to improve the process
5. **Sprint** - Time-boxed period (usually 2-4 weeks) for creating the increment`,
          videos: [
            { title: 'Scrum Guide Overview & Key Principles', url: 'https://www.youtube.com/watch?v=2Vt7Ik8Ublw', duration: 680, orderNumber: 1 }
          ]
        },
        {
          title: 'Session 2: Backlog Management & Sprint Planning',
          description: 'Write effective User Stories, apply Planning Poker story points, and run productive Sprint Planning meetings.',
          orderNumber: 2,
          content: `# Backlog Management & Sprint Planning

## Product Backlog
The Product Backlog is an ordered list of everything that might be needed in the product. It is the single source of truth for the product.

### Characteristics of a Good Product Backlog
- **DEEP**: Detailed appropriately, Estimated, Emergent, Prioritized
- **Refined regularly**: The PO and team refine backlog items together
- **Transparent**: Everyone understands what's in the backlog
- **Dynamic**: Items can be added, removed, or reprioritized

## User Stories
User Stories are short, simple descriptions of a feature from the perspective of the person who desires the new capability.

### User Story Template
**As a** [type of user], **I want** [some goal] **so that** [some reason].

### INVEST Criteria for Good User Stories
- **I**ndependent - Can be developed separately
- **N**egotiable - Not a rigid contract
- **V**aluable - Delivers value to the customer
- **E**stimable - Can be estimated by the team
- **S**mall - Can be completed in one Sprint
- **T**estable - Can be verified through testing

### Example User Stories
- As a user, I want to reset my password so that I can regain access to my account
- As an admin, I want to view user analytics so that I can make data-driven decisions
- As a developer, I want automated tests so that I can catch bugs early

## Story Points & Estimation
Story points are a relative measure of the effort required to implement a user story.

### Planning Poker
Planning Poker is a consensus-based estimation technique:
1. Each team member gets a set of cards (Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21...)
2. Product Owner reads a user story
3. Team discusses the story briefly
4. Each member selects a card representing their estimate
5. Cards are revealed simultaneously
6. Team discusses differences and re-estimates until consensus
7. The final estimate is recorded

### Why Story Points?
- Relative estimation is more accurate than time estimation
- Accounts for complexity, uncertainty, and effort
- Helps teams track velocity over time
- Reduces bias in estimation

## Sprint Planning
Sprint Planning initiates the Sprint by laying out the work to be performed for the Sprint.

### Sprint Planning Agenda
1. **Select items from the Product Backlog** - Based on team velocity and capacity
2. **Create Sprint Backlog** - The specific items for this Sprint
3. **Define Sprint Goal** - A concise statement of what the Sprint will achieve
4. **Plan how to accomplish the work** - Break down items into tasks

### Sprint Capacity Calculation
- Team velocity: Average story points completed in recent Sprints
- Team capacity: Available working days × team members
- Consider holidays, vacations, and other commitments

### Sprint Backlog
- Contains all items selected for the Sprint
- Includes a plan for delivering the Increment
- Owned by the Developers
- Can be modified during the Sprint if needed

## Daily Scrum
The Daily Scrum is a 15-minute time-boxed event for the Developers of the Scrum Team.

### Three Questions
1. What did I accomplish yesterday?
2. What will I do today?
3. Do I have any impediments?

### Purpose
- Inspect progress toward the Sprint Goal
- Adapt the Sprint Backlog as necessary
- Promote daily synchronization
- Identify and remove impediments`,
          videos: [
            { title: 'Writing User Stories & Story Point Estimation', url: 'https://www.youtube.com/watch?v=D-nUNSIn33E', duration: 820, orderNumber: 1 }
          ]
        }
      ],
      quizzes: [
        {
          title: 'Session 1: Agile & Scrum Framework Quiz',
          description: 'Test your understanding of Agile values, Scrum roles, and ceremonies.',
          passingScore: 70,
          isExamMode: false,
          questions: [
            {
              text: 'Who is responsible for prioritizing the Product Backlog in Scrum?',
              options: [
                { text: 'Scrum Master', isCorrect: false },
                { text: 'Product Owner', isCorrect: true },
                { text: 'Engineering Manager', isCorrect: false },
                { text: 'External Stakeholders', isCorrect: false }
              ]
            },
            {
              text: 'What is the recommended maximum duration for a Daily Standup meeting?',
              options: [
                { text: '15 minutes', isCorrect: true },
                { text: '45 minutes', isCorrect: false },
                { text: '60 minutes', isCorrect: false },
                { text: '30 minutes', isCorrect: false }
              ]
            },
            {
              text: 'Which Agile value states "Individuals and interactions over processes and tools"?',
              options: [
                { text: 'Working software over comprehensive documentation', isCorrect: false },
                { text: 'Customer collaboration over contract negotiation', isCorrect: false },
                { text: 'Individuals and interactions over processes and tools', isCorrect: true },
                { text: 'Responding to change over following a plan', isCorrect: false }
              ]
            }
          ]
        },
        {
          title: 'Session 2: Backlog Management Quiz',
          description: 'Validate your knowledge of User Stories, Story Points, and Sprint Planning.',
          passingScore: 70,
          isExamMode: false,
          questions: [
            {
              text: 'What does the "I" in INVEST criteria stand for?',
              options: [
                { text: 'Important', isCorrect: false },
                { text: 'Independent', isCorrect: true },
                { text: 'Innovative', isCorrect: false },
                { text: 'Immediate', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of Planning Poker?',
              options: [
                { text: 'To decide who will be the Product Owner', isCorrect: false },
                { text: 'To reach consensus on story point estimates', isCorrect: true },
                { text: 'To plan the Daily Scrum agenda', isCorrect: false },
                { text: 'To select items for the Sprint Review', isCorrect: false }
              ]
            },
            {
              text: 'What are the three questions asked in the Daily Scrum?',
              options: [
                { text: 'What, Why, How', isCorrect: false },
                { text: 'Who, What, When', isCorrect: false },
                { text: 'What did I do, What will I do, Any impediments', isCorrect: true },
                { text: 'Start, Stop, Continue', isCorrect: false }
              ]
            }
          ]
        },
        {
          title: 'Agile & Scrum Final Certification Exam',
          description: 'Comprehensive final exam covering all Agile and Scrum concepts. Passing this exam unlocks your certificate.',
          passingScore: 70,
          isExamMode: true,
          timeLimitMinutes: 60,
          questions: [
            {
              text: 'Which of the following is NOT a Scrum event?',
              options: [
                { text: 'Sprint Planning', isCorrect: false },
                { text: 'Daily Scrum', isCorrect: false },
                { text: 'Sprint Review', isCorrect: false },
                { text: 'Weekly Status Meeting', isCorrect: true }
              ]
            },
            {
              text: 'What is the primary responsibility of the Scrum Master?',
              options: [
                { text: 'To prioritize the Product Backlog', isCorrect: false },
                { text: 'To write code for the product', isCorrect: false },
                { text: 'To facilitate Scrum events and remove impediments', isCorrect: true },
                { text: 'To present the product to stakeholders', isCorrect: false }
              ]
            },
            {
              text: 'How long should a Sprint typically last?',
              options: [
                { text: '1 week', isCorrect: false },
                { text: '2-4 weeks', isCorrect: true },
                { text: '6-8 weeks', isCorrect: false },
                { text: '3 months', isCorrect: false }
              ]
            },
            {
              text: 'What is the Sprint Goal?',
              options: [
                { text: 'A detailed list of all tasks to be completed', isCorrect: false },
                { text: 'A concise statement of what the Sprint will achieve', isCorrect: true },
                { text: 'The total number of story points in the Sprint', isCorrect: false },
                { text: 'The date when the Sprint will end', isCorrect: false }
              ]
            },
            {
              text: 'What happens during the Sprint Retrospective?',
              options: [
                { text: 'The team demonstrates the work completed', isCorrect: false },
                { text: 'The team reflects on how to improve their process', isCorrect: true },
                { text: 'The Product Owner prioritizes backlog items', isCorrect: false },
                { text: 'The team estimates story points for the next Sprint', isCorrect: false }
              ]
            },
            {
              text: 'Who owns the Sprint Backlog?',
              options: [
                { text: 'Product Owner', isCorrect: false },
                { text: 'Scrum Master', isCorrect: false },
                { text: 'Developers', isCorrect: true },
                { text: 'Project Manager', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of the Sprint Review?',
              options: [
                { text: 'To estimate story points for the next Sprint', isCorrect: false },
                { text: 'To inspect and adapt the product backlog', isCorrect: false },
                { text: 'To review the work completed and get feedback', isCorrect: true },
                { text: 'To plan the Daily Scrum agenda', isCorrect: false }
              ]
            },
            {
              text: 'What is team velocity?',
              options: [
                { text: 'The number of team members in the Scrum Team', isCorrect: false },
                { text: 'The average number of story points completed per Sprint', isCorrect: true },
                { text: 'The total number of hours worked in a Sprint', isCorrect: false },
                { text: 'The number of bugs found during testing', isCorrect: false }
              ]
            },
            {
              text: 'What is the maximum recommended size of a Scrum Team?',
              options: [
                { text: '5 members', isCorrect: false },
                { text: '10 members', isCorrect: true },
                { text: '15 members', isCorrect: false },
                { text: '20 members', isCorrect: false }
              ]
            },
            {
              text: 'Which Agile value states "Working software over comprehensive documentation"?',
              options: [
                { text: 'Individuals and interactions over processes and tools', isCorrect: false },
                { text: 'Working software over comprehensive documentation', isCorrect: true },
                { text: 'Customer collaboration over contract negotiation', isCorrect: false },
                { text: 'Responding to change over following a plan', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of the Product Backlog refinement?',
              options: [
                { text: 'To delete all completed items', isCorrect: false },
                { text: 'To ensure backlog items are clear and ready for upcoming Sprints', isCorrect: true },
                { text: 'To estimate the total project cost', isCorrect: false },
                { text: 'To assign tasks to team members', isCorrect: false }
              ]
            },
            {
              text: 'Who should attend the Daily Scrum?',
              options: [
                { text: 'Only the Scrum Master', isCorrect: false },
                { text: 'Only the Product Owner', isCorrect: false },
                { text: 'The Developers of the Scrum Team', isCorrect: true },
                { text: 'All stakeholders', isCorrect: false }
              ]
            },
            {
              text: 'What is a User Story?',
              options: [
                { text: 'A technical specification document', isCorrect: false },
                { text: 'A short description of a feature from the user perspective', isCorrect: true },
                { text: 'A project timeline', isCorrect: false },
                { text: 'A bug report', isCorrect: false }
              ]
            },
            {
              text: 'What does "INVEST" stand for in User Story criteria?',
              options: [
                { text: 'Important, New, Valuable, Essential, Simple, Testable', isCorrect: false },
                { text: 'Independent, Negotiable, Valuable, Estimable, Small, Testable', isCorrect: true },
                { text: 'Integrated, Necessary, Verified, Essential, Structured, Timely', isCorrect: false },
                { text: 'Innovative, Natural, Verified, Efficient, Standard, Technical', isCorrect: false }
              ]
            },
            {
              text: 'What is the Definition of Done (DoD)?',
              options: [
                { text: 'A list of tasks for the next Sprint', isCorrect: false },
                { text: 'A shared understanding of what it means for work to be complete', isCorrect: true },
                { text: 'The project deadline', isCorrect: false },
                { text: 'The team meeting schedule', isCorrect: false }
              ]
            },
            {
              text: 'What is the Increment in Scrum?',
              options: [
                { text: 'The sum of all the Product Backlog items completed during a Sprint', isCorrect: true },
                { text: 'The number of team members added', isCorrect: false },
                { text: 'The budget increase for the project', isCorrect: false },
                { text: 'The time added to a Sprint', isCorrect: false }
              ]
            },
            {
              text: 'Who creates the Product Backlog?',
              options: [
                { text: 'The Scrum Master', isCorrect: false },
                { text: 'The Product Owner', isCorrect: true },
                { text: 'The Developers', isCorrect: false },
                { text: 'The Project Manager', isCorrect: false }
              ]
            },
            {
              text: 'What is the time-box for the Daily Scrum?',
              options: [
                { text: '5 minutes', isCorrect: false },
                { text: '15 minutes', isCorrect: true },
                { text: '30 minutes', isCorrect: false },
                { text: '60 minutes', isCorrect: false }
              ]
            },
            {
              text: 'What happens if a Sprint cannot be completed on time?',
              options: [
                { text: 'The Sprint is extended automatically', isCorrect: false },
                { text: 'The Sprint ends and the incomplete items go back to the Product Backlog', isCorrect: true },
                { text: 'The team works overtime to complete it', isCorrect: false },
                { text: 'The Product Owner cancels the project', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of the Sprint Backlog?',
              options: [
                { text: 'To store all project documentation', isCorrect: false },
                { text: 'To list the items selected for the Sprint and a plan to deliver them', isCorrect: true },
                { text: 'To track team vacations', isCorrect: false },
                { text: 'To record meeting minutes', isCorrect: false }
              ]
            },
            {
              text: 'Who can cancel a Sprint?',
              options: [
                { text: 'The Scrum Master', isCorrect: false },
                { text: 'The Product Owner', isCorrect: true },
                { text: 'The Developers', isCorrect: false },
                { text: 'The Project Manager', isCorrect: false }
              ]
            },
            {
              text: 'What is the primary focus of Agile methodology?',
              options: [
                { text: 'Following a strict plan', isCorrect: false },
                { text: 'Delivering value to customers through iterative development', isCorrect: true },
                { text: 'Creating extensive documentation', isCorrect: false },
                { text: 'Minimizing team communication', isCorrect: false }
              ]
            },
            {
              text: 'What is a Story Point?',
              options: [
                { text: 'A measure of time in hours', isCorrect: false },
                { text: 'A relative measure of effort for implementing a user story', isCorrect: true },
                { text: 'A monetary value', isCorrect: false },
                { text: 'A priority level', isCorrect: false }
              ]
            },
            {
              text: 'What is the Fibonacci sequence used for in Planning Poker?',
              options: [
                { text: 'To calculate project budget', isCorrect: false },
                { text: 'To provide a non-linear scale for estimating effort', isCorrect: true },
                { text: 'To determine team size', isCorrect: false },
                { text: 'To schedule meetings', isCorrect: false }
              ]
            },
            {
              text: 'What is the role of the Product Owner in Sprint Planning?',
              options: [
                { text: 'To write all the code', isCorrect: false },
                { text: 'To explain what Product Backlog items need to be done and why', isCorrect: true },
                { text: 'To facilitate the meeting', isCorrect: false },
                { text: 'To take meeting notes', isCorrect: false }
              ]
            },
            {
              text: 'What is a Spike in Agile?',
              options: [
                { text: 'A sudden increase in team size', isCorrect: false },
                { text: 'A time-boxed investigation to reduce uncertainty', isCorrect: true },
                { text: 'A type of user story', isCorrect: false },
                { text: 'A meeting format', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of the Definition of Ready (DoR)?',
              options: [
                { text: 'To define when a Sprint is complete', isCorrect: false },
                { text: 'To ensure backlog items are ready to be taken into a Sprint', isCorrect: true },
                { text: 'To set the project deadline', isCorrect: false },
                { text: 'To determine team composition', isCorrect: false }
              ]
            },
            {
              text: 'What is Kanban?',
              options: [
                { text: 'A type of user story', isCorrect: false },
                { text: 'A visual method for managing work as it moves through a process', isCorrect: true },
                { text: 'A meeting format', isCorrect: false },
                { text: 'A project management tool', isCorrect: false }
              ]
            },
            {
              text: 'What is the difference between Scrum and Kanban?',
              options: [
                { text: 'Scrum uses iterations, Kanban is continuous flow', isCorrect: true },
                { text: 'Kanban uses iterations, Scrum is continuous flow', isCorrect: false },
                { text: 'They are exactly the same', isCorrect: false },
                { text: 'Scrum has no roles, Kanban has many roles', isCorrect: false }
              ]
            },
            {
              text: 'What is a Minimum Viable Product (MVP)?',
              options: [
                { text: 'A complete product with all features', isCorrect: false },
                { text: 'A product with just enough features to satisfy early customers', isCorrect: true },
                { text: 'A prototype that is never released', isCorrect: false },
                { text: 'A marketing document', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of a retrospective?',
              options: [
                { text: 'To assign blame for mistakes', isCorrect: false },
                { text: 'To inspect and adapt the team process', isCorrect: true },
                { text: 'To plan the next Sprint', isCorrect: false },
                { text: 'To review the product', isCorrect: false }
              ]
            },
            {
              text: 'What is the "Three Amigos" technique?',
              options: [
                { text: 'A team building exercise', isCorrect: false },
                { text: 'A collaboration between business, development, and testing for user stories', isCorrect: true },
                { text: 'A meeting format for Daily Scrum', isCorrect: false },
                { text: 'A way to estimate story points', isCorrect: false }
              ]
            },
            {
              text: 'What is technical debt?',
              options: [
                { text: 'Money owed to developers', isCorrect: false },
                { text: 'The implied cost of additional rework caused by choosing an easy solution now instead of a better approach', isCorrect: true },
                { text: 'The project budget', isCorrect: false },
                { text: 'Team training costs', isCorrect: false }
              ]
            },
            {
              text: 'What is pair programming?',
              options: [
                { text: 'Two developers working at separate computers', isCorrect: false },
                { text: 'Two developers working together at one computer', isCorrect: true },
                { text: 'A meeting format', isCorrect: false },
                { text: 'A type of user story', isCorrect: false }
              ]
            },
            {
              text: 'What is Test-Driven Development (TDD)?',
              options: [
                { text: 'Writing tests after the code', isCorrect: false },
                { text: 'Writing tests before the code', isCorrect: true },
                { text: 'Not writing tests at all', isCorrect: false },
                { text: 'Writing tests only for bugs', isCorrect: false }
              ]
            },
            {
              text: 'What is Continuous Integration (CI)?',
              options: [
                { text: 'Integrating code once a year', isCorrect: false },
                { text: 'Frequently integrating code changes into a shared repository', isCorrect: true },
                { text: 'Never integrating code', isCorrect: false },
                { text: 'Integrating only at the end of a project', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of a burndown chart?',
              options: [
                { text: 'To track team attendance', isCorrect: false },
                { text: 'To show how much work is remaining in a Sprint', isCorrect: true },
                { text: 'To track project budget', isCorrect: false },
                { text: 'To record meeting notes', isCorrect: false }
              ]
            },
            {
              text: 'What is the difference between a Sprint Review and Sprint Retrospective?',
              options: [
                { text: 'They are the same meeting', isCorrect: false },
                { text: 'Review focuses on the product, Retrospective focuses on the process', isCorrect: true },
                { text: 'Review focuses on the process, Retrospective focuses on the product', isCorrect: false },
                { text: 'Only one of them is required', isCorrect: false }
              ]
            },
            {
              text: 'What is the role of the Scrum Master in conflict resolution?',
              options: [
                { text: 'To ignore conflicts', isCorrect: false },
                { text: 'To facilitate resolution and help the team self-organize', isCorrect: true },
                { text: 'To make all decisions for the team', isCorrect: false },
                { text: 'To escalate all conflicts to management', isCorrect: false }
              ]
            },
            {
              text: 'What is the purpose of a Sprint Backlog?',
              options: [
                { text: 'To store all project documentation', isCorrect: false },
                { text: 'To list items selected for the Sprint and a plan to deliver them', isCorrect: true },
                { text: 'To track team vacations', isCorrect: false },
                { text: 'To record meeting minutes', isCorrect: false }
              ]
            },
            {
              text: 'What is the Agile principle of "Sustainable Development"?',
              options: [
                { text: 'Working at a sustainable pace indefinitely', isCorrect: true },
                { text: 'Working overtime constantly', isCorrect: false },
                { text: 'Taking long breaks between Sprints', isCorrect: false },
                { text: 'Changing the team every Sprint', isCorrect: false }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'UI/UX Design Systems & Creative Brand Identity',
      description: 'Design intuitive digital experiences, conduct user research, build Figma design systems, and craft memorable brand identities.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'DESIGN_CREATIVE',
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      sessions: [
        {
          title: 'Session 1: User Research & Experience Mapping',
          description: 'Conduct user interviews, create empathy maps, build user personas, and map customer journeys.',
          orderNumber: 1,
          content: 'Great design starts with deep user empathy. Learn how to conduct qualitative research, identify user pain points, and define information architecture before sketching solutions.',
          videos: [
            { title: 'UX Research Methods & Persona Creation', url: 'https://www.youtube.com/watch?v=bAARmsRmLgE', duration: 780, orderNumber: 1 }
          ]
        },
        {
          title: 'Session 2: Building Component Systems in Figma',
          description: 'Create scalable auto-layout components, variant libraries, design tokens, and interactive prototypes.',
          orderNumber: 2,
          content: 'Design systems streamline collaboration between designers and frontend developers. Master Figma Auto-Layout 5.0, component properties, color variables, and responsive constraints.',
          videos: [
            { title: 'Figma Design System Architecture & Auto-Layout', url: 'https://www.youtube.com/watch?v=N64pZfD49J4', duration: 920, orderNumber: 1 }
          ]
        }
      ],
      quiz: {
        title: 'UI/UX Design & Figma Systems Certification',
        description: 'Test your UX research, visual design principles, and Figma component modeling knowledge.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the primary purpose of a Design System?',
            options: [
              { text: 'To render 3D video game graphics', isCorrect: false },
              { text: 'To ensure visual consistency and accelerate design & development workflows', isCorrect: true },
              { text: 'To write backend database queries', isCorrect: false },
              { text: 'To track web server analytics', isCorrect: false }
            ]
          },
          {
            text: 'Which UX deliverable visualizes the sequential steps a user takes to achieve a goal?',
            options: [
              { text: 'User Journey Map', isCorrect: true },
              { text: 'Color Palette Swatch', isCorrect: false },
              { text: 'Database Schema Diagram', isCorrect: false },
              { text: 'Server Access Log', isCorrect: false }
            ]
          }
        ]
      }
    }
  ];

  for (const cData of coursesToSeed) {
    // Check if course already exists
    const existing = await prisma.course.findFirst({
      where: { title: cData.title },
      include: {
        sessions: {
          include: {
            videos: true
          }
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    if (existing) {
      console.log(`🔄 Course "${cData.title}" already exists. Recreating with new structure...`);
      
      // Delete existing course with all related data in correct order
      // First delete progress, then enrollments
      await prisma.progress.deleteMany({
        where: { enrollment: { courseId: existing.id } }
      });
      await prisma.enrollment.deleteMany({
        where: { courseId: existing.id }
      });
      
      // Then delete quiz attempts, then quizzes with their questions and options
      await prisma.quizAttempt.deleteMany({
        where: { quiz: { courseId: existing.id } }
      });
      
      for (const quiz of existing.quizzes) {
        for (const question of quiz.questions) {
          await prisma.questionOption.deleteMany({
            where: { questionId: question.id }
          });
        }
        await prisma.question.deleteMany({
          where: { quizId: quiz.id }
        });
        await prisma.quiz.delete({
          where: { id: quiz.id }
        });
      }
      
      // Then delete session completions, video watches, sessions with their videos
      for (const session of existing.sessions) {
        await prisma.sessionCompletion.deleteMany({
          where: { sessionId: session.id }
        });
        await prisma.videoWatch.deleteMany({
          where: { video: { sessionId: session.id } }
        });
        await prisma.video.deleteMany({
          where: { sessionId: session.id }
        });
        await prisma.session.delete({
          where: { id: session.id }
        });
      }
      
      // Finally delete the course
      await prisma.course.delete({
        where: { id: existing.id }
      });
      
      console.log(`✅ Deleted old course "${cData.title}". Creating new version...`);
    }

    console.log(`🚀 Creating complete course: "${cData.title}" (${cData.domain} - ${cData.level})...`);
    const newCourse = await prisma.course.create({
      data: {
        title: cData.title,
        description: cData.description,
        level: cData.level,
        domain: cData.domain,
        thumbnail: cData.thumbnail,
        creatorId: creator.id,
      }
    });

    // Create Sessions and Videos
    for (const sData of cData.sessions) {
      const session = await prisma.session.create({
        data: {
          title: sData.title,
          description: sData.description,
          orderNumber: sData.orderNumber,
          content: sData.content,
          courseId: newCourse.id,
        }
      });

      for (const vData of sData.videos) {
        await prisma.video.create({
          data: {
            title: vData.title,
            url: vData.url,
            duration: vData.duration,
            orderNumber: vData.orderNumber,
            sessionId: session.id,
          }
        });
      }
    }

    // Create Quizzes and Questions (support multiple quizzes)
    if (cData.quizzes && cData.quizzes.length > 0) {
      for (const qData of cData.quizzes) {
        const quiz = await prisma.quiz.create({
          data: {
            title: qData.title,
            description: qData.description,
            passingScore: qData.passingScore,
            isExamMode: qData.isExamMode || false,
            timeLimitMinutes: qData.timeLimitMinutes,
            courseId: newCourse.id,
          }
        });

        for (const questionData of qData.questions) {
          const question = await prisma.question.create({
            data: {
              text: questionData.text,
              quizId: quiz.id,
            }
          });

          for (const oData of questionData.options) {
            await prisma.questionOption.create({
              data: {
                text: oData.text,
                isCorrect: oData.isCorrect,
                questionId: question.id,
              }
            });
          }
        }
      }
    }

    console.log(`✅ Successfully seeded "${cData.title}"!`);
  }

  console.log('🎉 Multi-domain seeding completed cleanly!');
}

seedMultiDomainCourses()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
