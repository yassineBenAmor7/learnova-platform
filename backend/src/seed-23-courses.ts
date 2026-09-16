import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function seed23Courses() {
  console.log('🌱 Starting database reset & seeding for exactly 26 Coursera-level courses...');

  // Find admin user or first user to assign as creator
  const creator = await prisma.user.findFirst({
    where: { role: { name: 'ADMIN' } },
  }) || await prisma.user.findFirst();

  if (!creator) {
    console.error('❌ No user found to assign as creator. Please register a user first.');
    return;
  }

  // Clear existing courses and related data
  console.log('🧹 Clearing existing course records to ensure clean state...');
  await prisma.progress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.quizAnswer.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.sessionCompletion.deleteMany({});
  await prisma.videoWatch.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.course.deleteMany({});
  console.log('✅ Clearing complete!');

  const coursesToSeed = [
    {
      title: 'Python Programming Masterclass',
      description: 'Go from beginner to advanced with Python 3. Learn OOP, functional programming, decorators, and data analysis packages.',
      level: CourseLevel.BEGINNER,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 29.99,
      sessions: [
        {
          title: 'Session 1: Python Fundamentals & Data Structures',
          description: 'Introduction to control flow, data types, lists, dictionaries, and functional program flow in Python.',
          orderNumber: 1,
          content: '### Core Python Syllabus\nWelcome to Python Programming. In this session, we lay the foundations of Python syntax, memory references, dynamic typing, and standard collections.',
          videos: [
            {
              title: 'Python Fundamentals Crash Course',
              url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
              duration: 1800,
              orderNumber: 1,
              description: 'An overview of Python setup, basic data types, and script execution flow.',
              content: '### Session Study Notes: Python Basics\n\n#### 1. Variable Assignment & Types\nPython is dynamically typed, meaning you do not need to declare types explicitly:\n```python\nx = 10        # Integer\ny = "Hello"   # String\n```\n\n#### 2. Lists vs. Tuples\n* **Lists**: Mutable collections defined with square brackets: `[1, 2, 3]`\n* **Tuples**: Immutable collections defined with parentheses: `(1, 2, 3)`'
            }
          ]
        },
        {
          title: 'Session 2: Object-Oriented Python & Advanced Decorators',
          description: 'Master classes, inheritance, polymorphism, decorators, and custom decorators.',
          orderNumber: 2,
          content: '### Object-Oriented Paradigms\nLearn how to model real-world problems using OOP principles and meta-programming decorators.',
          videos: [
            {
              title: 'Python OOP and Classes',
              url: 'https://www.youtube.com/watch?v=r7Dtus7N4pU',
              duration: 1200,
              orderNumber: 1,
              description: 'Step-by-step tutorial on OOP structure, self keywords, and magic methods.',
              content: '### OOP Reference Guide\n\n#### Magic Methods\nMagic methods allow you to overload operations:\n* `__init__`: Constructor method\n* `__str__`: User-friendly string representation\n\n```python\nclass Course:\n    def __init__(self, name):\n        self.name = name\n```'
            }
          ]
        }
      ],
      quiz: {
        title: 'Python Core Assessment',
        description: 'Test your understanding of Object-Oriented Python and decorators.',
        passingScore: 70,
        questions: [
          {
            text: 'Which keyword is used to define a function in Python?',
            options: [
              { text: 'func', isCorrect: false },
              { text: 'def', isCorrect: true },
              { text: 'define', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'SQL & Relational Databases for Beginners',
      description: 'Master SQL querying, relational database design, joins, aggregates, and subqueries using PostgreSQL.',
      level: CourseLevel.BEGINNER,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Database Design & Querying Basics',
          description: 'Learn the fundamentals of SELECT statements, WHERE clauses, and database normalization.',
          orderNumber: 1,
          content: '### SQL Querying Basics\nIn this session, you will learn standard relational schemas, Primary/Foreign keys, and basic querying techniques to filter and extract records.',
          videos: [
            {
              title: 'SQL Basics for Beginners',
              url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
              duration: 2500,
              orderNumber: 1,
              description: 'Basic database operations, select statements, and filtering structures.',
              content: '### SQL Basics Cheat Sheet\n\n#### Basic Query Structure\n```sql\nSELECT column1, column2\nFROM table_name\nWHERE condition;\n```'
            }
          ]
        },
        {
          title: 'Session 2: Joins & Advanced Data Aggregations',
          description: 'Learn to combine data across tables using Inner, Left, Right, and Full outer joins.',
          orderNumber: 2,
          content: '### SQL Joins Mastery\nMaster database normalization joins and grouping structures to analyze tabular relations.',
          videos: [
            {
              title: 'SQL Joins Explained',
              url: 'https://www.youtube.com/watch?v=9yeEl15Xe14',
              duration: 1500,
              orderNumber: 1,
              description: 'Comprehensive illustration of relational joins and grouping calculations.',
              content: '### SQL Joins Cheat Sheet\n\n* **INNER JOIN**: Returns records that have matching values in both tables.\n* **LEFT JOIN**: Returns all records from the left table, and the matched records from the right table.'
            }
          ]
        }
      ],
      quiz: {
        title: 'SQL Foundations Assessment',
        description: 'Verify your knowledge of SQL joins and query optimization.',
        passingScore: 75,
        questions: [
          {
            text: 'Which JOIN returns all records from the left table and matched records from the right table?',
            options: [
              { text: 'INNER JOIN', isCorrect: false },
              { text: 'LEFT JOIN', isCorrect: true },
              { text: 'RIGHT JOIN', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Machine Learning Foundations',
      description: 'Explore supervised and unsupervised learning algorithms, regression, classification, clustering, and deployment.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 89.99,
      sessions: [
        {
          title: 'Session 1: Supervised Learning & Regression',
          description: 'Understand linear and logistic regression models, cost functions, and gradient descent.',
          orderNumber: 1,
          content: '### Supervised Learning Core Concepts\nTrain models on labeled datasets. Learn regression formulas and gradient descent algorithms.',
          videos: [
            {
              title: 'Regression Fundamentals',
              url: 'https://www.youtube.com/watch?v=GwIo3gDZUtQ',
              duration: 2100,
              orderNumber: 1,
              description: 'Introduction to mathematical concepts behind model training.',
              content: '### Supervised Learning Notes\n\n* **Linear Regression Formula**: \(y = mx + b\)\n* **Cost Function**: Measures how incorrect the model is.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Machine Learning Assessment',
        description: 'Test your understanding of linear and logistic regression models.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the main objective of supervised learning?',
            options: [
              { text: 'To predict outputs using a model trained on labeled data', isCorrect: true },
              { text: 'To run security audits', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Cybersecurity Fundamentals & Network Security',
      description: 'Learn networks protocols, cryptography, firewalls, threats, and defensive security strategies.',
      level: CourseLevel.BEGINNER,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 49.99,
      sessions: [
        {
          title: 'Session 1: Cryptography & Network Threats',
          description: 'Identify common vectors of attack (malware, phishing) and symmetric/asymmetric encryption.',
          orderNumber: 1,
          content: '### Security & Encryption Systems\nUnderstand defensive network architectures, firewall layers, and key exchanges.',
          videos: [
            {
              title: 'Intro to Cryptography',
              url: 'https://www.youtube.com/watch?v=nzj7Wg46zgA',
              duration: 1600,
              orderNumber: 1,
              description: 'Introduction to secure messaging and encryption keys.',
              content: '### Security Study Guide\n\n* **Symmetric Encryption**: Uses the same key for encryption and decryption.\n* **Asymmetric Encryption**: Uses a public key to encrypt and private key to decrypt.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Cybersecurity Principles Quiz',
        description: 'Evaluate your knowledge of encryption and security threat models.',
        passingScore: 80,
        questions: [
          {
            text: 'In asymmetric encryption, which key is shared publicly?',
            options: [
              { text: 'Private Key', isCorrect: false },
              { text: 'Public Key', isCorrect: true }
            ]
          }
        ]
      }
    },
    {
      title: 'Docker & Kubernetes: DevOps Containers',
      description: 'Containerize applications using Docker and orchestrate them at scale with Kubernetes clusters.',
      level: CourseLevel.ADVANCED,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 79.99,
      sessions: [
        {
          title: 'Session 1: Docker Containers & Images',
          description: 'Write Dockerfiles, build images, and manage container volumes and networks.',
          orderNumber: 1,
          content: '### Docker Infrastructure\nLearn image layers, docker daemons, and compose configurations for environment consistency.',
          videos: [
            {
              title: 'Docker Containers Crash Course',
              url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI',
              duration: 2000,
              orderNumber: 1,
              description: 'Complete hands-on container setup.',
              content: '### Docker Command Cheat Sheet\n\n* `docker build -t app .` - Build image\n* `docker run -d -p 80:80 app` - Run container'
            }
          ]
        }
      ],
      quiz: {
        title: 'Docker Architecture Quiz',
        description: 'Test your understanding of containerization.',
        passingScore: 70,
        questions: [
          {
            text: 'Which file defines instructions for building a Docker image?',
            options: [
              { text: 'docker-compose.yml', isCorrect: false },
              { text: 'Dockerfile', isCorrect: true }
            ]
          }
        ]
      }
    },
    {
      title: 'Cloud Computing with AWS',
      description: 'Deploy web apps and manage servers using AWS EC2, S3, RDS, Lambda, and IAM security.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 99.99,
      sessions: [
        {
          title: 'Session 1: AWS Services overview: EC2 & S3',
          description: 'Deploy virtual servers with EC2 and setup secure object storage using Simple Storage Service (S3).',
          orderNumber: 1,
          content: '### AWS Architecture\nExplore AWS globally distributed data centers, region selection, compute EC2 profiles, and IAM access policies.',
          videos: [
            {
              title: 'AWS Cloud Fundamentals',
              url: 'https://www.youtube.com/watch?v=3hLmDS179YE',
              duration: 2400,
              orderNumber: 1,
              description: 'Overview of AWS compute, storage, and networking.',
              content: '### AWS Infrastructure Notes\n\n* **EC2**: Elastic Compute Cloud (virtual servers).\n* **S3**: Simple Storage Service (object storage).'
            }
          ]
        }
      ],
      quiz: {
        title: 'AWS Foundations Quiz',
        description: 'Assess your knowledge of core AWS infrastructure services.',
        passingScore: 70,
        questions: [
          {
            text: 'What AWS service represents virtual servers in the cloud?',
            options: [
              { text: 'S3', isCorrect: false },
              { text: 'EC2', isCorrect: true }
            ]
          }
        ]
      }
    },
    {
      title: 'Modern Web Development with React & Node.js',
      description: 'Build responsive single page applications using React and backend REST APIs with Node/Express.',
      level: CourseLevel.ALL_LEVELS,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 59.99,
      sessions: [
        {
          title: 'Session 1: HTML5 & CSS3 Essentials',
          description: 'Build structured layout pages using semantic elements and style them using flexbox and grid components.',
          orderNumber: 1,
          content: '### Web Layout Foundations\nLearn to build standard web layouts using HTML5 and style them with responsive CSS layout methods.',
          videos: [
            {
              title: 'HTML & CSS Layouts',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 3000,
              orderNumber: 1,
              description: 'Semantic tags and flexbox margins.',
              content: '### HTML & CSS Cheat Sheet\n\n* **Flexbox**: `display: flex;` - Maps layout axes.\n* **Grid**: `display: grid;` - Maps 2D coordinates.'
            }
          ]
        },
        {
          title: 'Session 2: JavaScript ES6+ Core Logic',
          description: 'Understand asynchronous JavaScript, promises, arrow functions, and array operations.',
          orderNumber: 2,
          content: '### JavaScript Core Syllabus\nLearn advanced asynchronous loop logic, API fetching, and DOM nodes.',
          videos: [
            {
              title: 'JavaScript Asynchronous Flow',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 3200,
              orderNumber: 1,
              description: 'Promises, Async/Await and fetch methods.',
              content: '### Asynchronous Cheat Sheet\n```javascript\nconst getData = async () => {\n  const res = await fetch(url);\n  return res.json();\n};\n```'
            }
          ]
        },
        {
          title: 'Session 3: React Functional Components',
          description: 'Learn component design parameters, component hooks, and component properties.',
          orderNumber: 3,
          content: '### React Core UI\nBuild modular frontend UI components and pass arguments using props.',
          videos: [
            {
              title: 'React Basics',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 2800,
              orderNumber: 1,
              description: 'Setting up first React project and building layouts.',
              content: '### React Elements\n* **Props**: Immutable data passed down from parent.\n* **State**: Local variables triggers rerender.'
            }
          ]
        },
        {
          title: 'Session 4: React State Hooks & Side Effects',
          description: 'Leverage useState and useEffect hooks to manage API responses and lifecycle changes.',
          orderNumber: 4,
          content: '### React Hooks Core\nMaster side effects tracking, dynamic layouts, and network integrations.',
          videos: [
            {
              title: 'React Hooks Deep Dive',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 3100,
              orderNumber: 1,
              description: 'Managing inputs and executing network fetches.',
              content: '### Side Effects Code\n```javascript\nuseEffect(() => {\n  document.title = "Loaded";\n}, []);\n```'
            }
          ]
        },
        {
          title: 'Session 5: Node.js & Express Basics',
          description: 'Design and start HTTP servers using Node.js and Express routers.',
          orderNumber: 5,
          content: '### Node.js Backend Basics\nSet up entry files, port listings, Express modules, and basic server endpoints.',
          videos: [
            {
              title: 'Express Server Setup',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 2400,
              orderNumber: 1,
              description: 'Initializing backend servers.',
              content: '### Express Code Setup\n```javascript\nconst express = require("express");\nconst app = express();\napp.listen(3000);\n```'
            }
          ]
        },
        {
          title: 'Session 6: REST API Design & Middleware',
          description: 'Implement secure RESTful routing structures, validation middleware, and HTTP response statuses.',
          orderNumber: 6,
          content: '### REST API Standards\nLearn CRUD resource design, request payload parsing, and standard HTTP codes.',
          videos: [
            {
              title: 'REST API Best Practices',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 2600,
              orderNumber: 1,
              description: 'Designing clear REST endpoints.',
              content: '### REST HTTP Verbs\n* **GET**: Retrieve records\n* **POST**: Create records\n* **PUT**: Update records\n* **DELETE**: Delete records'
            }
          ]
        },
        {
          title: 'Session 7: Database integration with Prisma ORM',
          description: 'Design database schemas, map migrations, and execute queries using Prisma client.',
          orderNumber: 7,
          content: '### Database Integrations\nConfigure database connections, write schema files, run migrations, and fetch database queries.',
          videos: [
            {
              title: 'Prisma Client Integrations',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 2800,
              orderNumber: 1,
              description: 'Working with databases using Prisma.',
              content: '### Prisma Schema Syntax\n```prisma\nmodel User {\n  id    Int    @id @default(autoincrement())\n  email String @unique\n}\n```'
            }
          ]
        },
        {
          title: 'Session 8: JWT Authentication & Deployments',
          description: 'Secure application endpoints with JSON Web Tokens and deploy systems to cloud environments.',
          orderNumber: 8,
          content: '### Authentication & Deployments\nImplement registration password hashing, token validation, secure headers, and cloud uploads.',
          videos: [
            {
              title: 'JWT Token Security',
              url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
              duration: 3500,
              orderNumber: 1,
              description: 'Creating and verifying JWT headers.',
              content: '### JWT Structure\n* **Header**: Alg and token type.\n* **Payload**: User claims.\n* **Signature**: Cryptographic validation hash.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Full Stack Web Assessment',
        description: 'Verify your knowledge of component design and Express routers.',
        passingScore: 70,
        questions: [
          {
            text: 'What hook is used to manage state inside functional components?',
            options: [
              { text: 'useState', isCorrect: true },
              { text: 'useRef', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Digital Marketing & Growth Strategy',
      description: 'Master SEO, Content Marketing, Paid Performance Ads, and Customer Acquisition Funnels to drive exponential business growth.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'MARKETING',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 39.99,
      sessions: [
        {
          title: 'Session 1: Technical SEO & Organic Discovery',
          description: 'Learn website architecture, keyword research, page speed optimization, and search engine ranking factors.',
          orderNumber: 1,
          content: '### Technical SEO Syllabus\nOptimize site speed, XML sitemaps, robots.txt, and metadata keywords for search engines.',
          videos: [
            {
              title: 'Search Engine Crawling & Indexing',
              url: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ',
              duration: 720,
              orderNumber: 1,
              description: 'How Google crawlers inspect and rank pages.',
              content: '### Technical SEO Guidelines\n\n* **Crawling**: Search engines scanning site directories.\n* **Sitemaps**: File mapping pages to help crawlers discover content.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Digital Marketing Assessment',
        description: 'Test your knowledge on SEO.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the main objective of Technical SEO?',
            options: [
              { text: 'To ensure search engines can efficiently crawl pages', isCorrect: true },
              { text: 'To build banners', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Search Engine Optimization (SEO) Masterclass',
      description: 'Increase organic web traffic using off-page SEO, high-authority backlinking, and technical search console audits.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'MARKETING',
      thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: On-Page Optimization & Semantic HTML',
          description: 'Optimize header tags, metadata, page speed, and schema markup for Google Search.',
          orderNumber: 1,
          content: '### On-Page SEO Checklist\nOptimize page headers, semantic elements, and structured JSON-LD data packages.',
          videos: [
            {
              title: 'On-Page SEO Best Practices',
              url: 'https://www.youtube.com/watch?v=d_Z_h6wG5r8',
              duration: 1100,
              orderNumber: 1,
              description: 'Strategic placement of headers and meta tags.',
              content: '### On-Page SEO Rules\n\n* `<title>` tag must contain targeted keywords.\n* `<h1>` must describe main page heading.'
            }
          ]
        }
      ],
      quiz: {
        title: 'SEO Core Assessment',
        description: 'Test your knowledge on metadata tags.',
        passingScore: 70,
        questions: [
          {
            text: 'Which HTML tag holds the main title of a web page displayed in search results?',
            options: [
              { text: '<h1>', isCorrect: false },
              { text: '<title>', isCorrect: true }
            ]
          }
        ]
      }
    },
    {
      title: 'Social Media Marketing & Brand Building',
      description: 'Design brand identities and organic/paid campaigns on Instagram, TikTok, LinkedIn, and YouTube.',
      level: CourseLevel.BEGINNER,
      domain: 'MARKETING',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Creative Storytelling & Content Calendars',
          description: 'Plan, produce, and schedule highly engaging content calendars for diverse platforms.',
          orderNumber: 1,
          content: '### Creative Social Content Calendar\nMap social campaigns, analyze audience personas, and create responsive visual branding layouts.',
          videos: [
            {
              title: 'Building a Brand on Social Media',
              url: 'https://www.youtube.com/watch?v=1xN5c6N1kR0',
              duration: 1200,
              orderNumber: 1,
              description: 'Brand narratives and campaign calendars.',
              content: '### Content Calendar Framework\n\n* **Schedules**: Post consistently to feed algorithms.\n* **Formats**: Optimize assets (vertical video vs landscape posts).'
            }
          ]
        }
      ],
      quiz: {
        title: 'Social Media Strategy Quiz',
        description: 'Test your knowledge of content schedules.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the primary benefit of consistent content scheduling?',
            options: [
              { text: 'It triggers algorithms to reward consistent visibility', isCorrect: true },
              { text: 'It creates scripts', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Copywriting & Persuasive Writing',
      description: 'Write high-converting landing pages, ads, and cold emails that drive sales and action.',
      level: CourseLevel.BEGINNER,
      domain: 'MARKETING',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 19.99,
      sessions: [
        {
          title: 'Session 1: Psychological Hooks & Headlines',
          description: 'Craft hooks using the AIDA framework (Attention, Interest, Desire, Action) that capture user attention.',
          orderNumber: 1,
          content: '### Persuasive Writing & Headlines\nLearn copy formulas, emotional words, call-to-actions (CTA), and landing page headlines.',
          videos: [
            {
              title: 'The AIDA Formula in Copywriting',
              url: 'https://www.youtube.com/watch?v=5r4Z6q5g3_Y',
              duration: 1400,
              orderNumber: 1,
              description: 'Persuasion hooks and structure.',
              content: '### AIDA Writing Steps\n\n1. **Attention**: Catch the reader\'s eye.\n2. **Interest**: Provide fascinating details.\n3. **Desire**: Describe life-changing benefits.\n4. **Action**: Tell them what to do next.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Copywriting Master Assessment',
        description: 'Evaluate your ability to formulate strong headers.',
        passingScore: 70,
        questions: [
          {
            text: 'What does the abbreviation AIDA stand for in marketing?',
            options: [
              { text: 'Attention, Interest, Desire, Action', isCorrect: true },
              { text: 'Action, Interest, Dynamic, Advise', isCorrect: false }
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
      isPaid: true,
      price: 129.99,
      sessions: [
        {
          title: 'Session 1: Financial Statement Analysis',
          description: 'Deconstruct Income Statements, Balance Sheets, and Cash Flow Statements to assess profitability and solvency.',
          orderNumber: 1,
          content: '### Financial Accounting Analysis\nAnalyze balance sheets, audit entries, calculate working capital, and track cash reserves.',
          videos: [
            {
              title: 'Interlinking the 3 Core Financial Statements',
              url: 'https://www.youtube.com/watch?v=WEDIj9JBTC8',
              duration: 1050,
              orderNumber: 1,
              description: 'How accounting statements link together.',
              content: '### Accounting Statement Balance Rules\n\n* **Income Statement**: Feeds Net Income into Retained Earnings.\n* **Retained Earnings**: Fits inside Equity on the Balance Sheet.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Financial Valuation Assessment',
        description: 'Comprehensive exam evaluating corporate valuation.',
        passingScore: 75,
        questions: [
          {
            text: 'Which financial statement reports a company solvency at a specific point in time?',
            options: [
              { text: 'Income Statement', isCorrect: false },
              { text: 'Balance Sheet', isCorrect: true }
            ]
          }
        ]
      }
    },
    {
      title: 'Accounting & Financial Statements',
      description: 'Learn double-entry bookkeeping, debit/credit logic, ledgers, journals, and the complete accounting cycle.',
      level: CourseLevel.BEGINNER,
      domain: 'FINANCE_BUSINESS',
      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Double-Entry Bookkeeping Logic',
          description: 'Understand the accounting equation (Assets = Liabilities + Equity) and record journal transactions.',
          orderNumber: 1,
          content: '### Double Entry Bookkeeping\nLearn debits and credits balancing, T-accounts, general ledger postings, and assets.',
          videos: [
            {
              title: 'Accounting Debits & Credits Explained',
              url: 'https://www.youtube.com/watch?v=yYX4m1S39gA',
              duration: 1900,
              orderNumber: 1,
              description: 'Introduction to accounting balance sheets.',
              content: '### Debit / Credit Rules\n\n* **Assets**: Increase with Debits, decrease with Credits.\n* **Liabilities**: Increase with Credits, decrease with Debits.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Accounting Basics Quiz',
        description: 'Verify your understanding of bookkeeping.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the fundamental accounting equation?',
            options: [
              { text: 'Assets = Liabilities + Equity', isCorrect: true },
              { text: 'Assets = Liabilities - Equity', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Introduction to Microeconomics & Markets',
      description: 'Analyze supply and demand, elasticities, price ceilings, and market structures (monopolies, oligopolies).',
      level: CourseLevel.BEGINNER,
      domain: 'FINANCE_BUSINESS',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Supply, Demand, & Equilibrium Price',
          description: 'Understand how market forces determine price and quantity, and calculate price elasticity of demand.',
          orderNumber: 1,
          content: '### Supply and Demand Economics\nLearn price charts, buyer/seller behaviors, equilibrium points, and elastic demand curves.',
          videos: [
            {
              title: 'Supply & Demand Principles',
              url: 'https://www.youtube.com/watch?v=g978g_Z5Gf0',
              duration: 1300,
              orderNumber: 1,
              description: 'Principles of supply and demand curves.',
              content: '### Economics Study Guide\n\n* **Supply Curve**: Slopes upward (sellers want to sell more at higher prices).\n* **Demand Curve**: Slopes downward (buyers want to buy less at higher prices).'
            }
          ]
        }
      ],
      quiz: {
        title: 'Microeconomics Assessment',
        description: 'Evaluate your understanding of supply and demand.',
        passingScore: 70,
        questions: [
          {
            text: 'If demand increases and supply remains constant, what happens to price?',
            options: [
              { text: 'Equilibrium price rises', isCorrect: true },
              { text: 'Equilibrium price falls', isCorrect: false }
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
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Agile Values & The Scrum Framework',
          description: 'Understand the Agile Manifesto, Scrum roles (PO, Scrum Master, Developers), and core ceremonies.',
          orderNumber: 1,
          content: '### Agile & Scrum Framework\nLearn backlog refinement, sprint review, standups, retro planning, and story points.',
          videos: [
            {
              title: 'Scrum Guide Overview & Key Principles',
              url: 'https://www.youtube.com/watch?v=2Vt7Ik8Ublw',
              duration: 680,
              orderNumber: 1,
              description: 'Quick walkthrough of Scrum guidelines.',
              content: '### Scrum Ceremonies Summary\n\n* **Sprint Planning**: Plan upcoming task workloads.\n* **Daily Scrum**: 15 min standup to sync progress.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Agile & Scrum Framework Quiz',
        description: 'Test your understanding of Scrum.',
        passingScore: 70,
        questions: [
          {
            text: 'Who is responsible for prioritizing the Product Backlog in Scrum?',
            options: [
              { text: 'Product Owner', isCorrect: true },
              { text: 'Scrum Master', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Product Management: Building Tech Products',
      description: 'Define product visions, write product requirements documents (PRDs), run user testing, and align roadmap releases.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'MANAGEMENT',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 94.99,
      sessions: [
        {
          title: 'Session 1: Customer Discovery & Writing PRDs',
          description: 'Write effective Product Requirement Documents (PRDs) and define critical MVP feature scopes.',
          orderNumber: 1,
          content: '### Product Discovery & PRDs\nLearn how to create roadmaps, write detailed feature tickets, and define success metrics.',
          videos: [
            {
              title: 'Product Management Fundamentals',
              url: 'https://www.youtube.com/watch?v=i5aVj4P1-5E',
              duration: 1800,
              orderNumber: 1,
              description: 'Introduction to product roles.',
              content: '### PRD Outline\n\n* **Objective**: What problem are we solving?\n* **Features**: Categorized requirements.\n* **Metrics**: Success criteria (e.g. sign-ups).'
            }
          ]
        }
      ],
      quiz: {
        title: 'Product Management Quiz',
        description: 'Test your understanding of MVP.',
        passingScore: 70,
        questions: [
          {
            text: 'What does MVP stand for in Product Management?',
            options: [
              { text: 'Minimum Viable Product', isCorrect: true },
              { text: 'Most Valuable Project', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Strategic Leadership & Team Management',
      description: 'Learn executive decision-making, team motivation, delegating tasks, and resolving organizational conflicts.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'MANAGEMENT',
      thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 49.99,
      sessions: [
        {
          title: 'Session 1: Delegating and Motivation Frameworks',
          description: 'Apply situational leadership models and build psychological safety across cross-functional teams.',
          orderNumber: 1,
          content: '### Executive Leadership Syllabus\nLearn goal delegation, coaching styles, team motivation theories, and feedback mechanisms.',
          videos: [
            {
              title: 'Situational Leadership Theories',
              url: 'https://www.youtube.com/watch?v=481sP6r9zGg',
              duration: 1200,
              orderNumber: 1,
              description: 'Adapting leadership to employee skill level.',
              content: '### Situational Leadership Model\n\n* **Directing**: Low skill, high commitment.\n* **Coaching**: Medium skill, low commitment.\n* **Supporting**: High skill, variable commitment.\n* **Delegating**: High skill, high commitment.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Leadership Principles Assessment',
        description: 'Test your understanding of psychological safety.',
        passingScore: 70,
        questions: [
          {
            text: 'What is psychological safety in a team context?',
            options: [
              { text: 'An environment where members feel safe to speak up without fear of punishment', isCorrect: true },
              { text: 'Physically secure doors', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'UI/UX Design Systems & Creative Brand Identity',
      description: 'Design intuitive digital experiences, conduct user research, build Figma design systems, and craft memorable brand identities.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'DESIGN_CREATIVE',
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 69.99,
      sessions: [
        {
          title: 'Session 1: User Research & Experience Mapping',
          description: 'Conduct user interviews, create empathy maps, build user personas, and map customer journeys.',
          orderNumber: 1,
          content: '### UX Research Foundations\nDefine personas, create journey maps, structure card sorting activities, and analyze heatmaps.',
          videos: [
            {
              title: 'UX Research Methods',
              url: 'https://www.youtube.com/watch?v=c9Wg6Ry_OMY',
              duration: 780,
              orderNumber: 1,
              description: 'Qualitative research methods for designer teams.',
              content: '### UX Deliverables Checklist\n\n* **Persona**: Fictional profiles of typical users.\n* **Journey Map**: Step-by-step layout of user experience.'
            }
          ]
        }
      ],
      quiz: {
        title: 'UI/UX Design Certification',
        description: 'Test your UX research knowledge.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the primary purpose of a Design System?',
            options: [
              { text: 'To ensure visual consistency and speed up workflow', isCorrect: true },
              { text: 'To run servers', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Figma Essentials for UI Designers',
      description: 'Master Figma vectors, auto-layouts, components, variables, interactive prototyping, and developer handoffs.',
      level: CourseLevel.BEGINNER,
      domain: 'DESIGN_CREATIVE',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Auto-Layout & Component Variants',
          description: 'Construct responsive layouts using Auto-Layout and publish reusable component libraries with variants.',
          orderNumber: 1,
          content: '### Figma Masterclass Syllabus\nLearn padding, constraints, responsive resizing, components, variables, and prototypes.',
          videos: [
            {
              title: 'Figma Auto-Layout Masterclass',
              url: 'https://www.youtube.com/watch?v=FTFaQW1ZWhg',
              duration: 1600,
              orderNumber: 1,
              description: 'Learn constraints and auto-layout configuration.',
              content: '### Figma Auto-Layout Notes\n\n* **Hug Contents**: Set frame to size of internal elements.\n* **Fill Container**: Stretch element to boundary limit.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Figma Fundamentals Assessment',
        description: 'Test your comprehension of auto-layout.',
        passingScore: 70,
        questions: [
          {
            text: 'Which feature in Figma allows content to resize automatically like HTML flex containers?',
            options: [
              { text: 'Pen Tool', isCorrect: false },
              { text: 'Auto-Layout', isCorrect: true }
            ]
          }
        ]
      }
    },
    {
      title: 'Graphic Design Fundamentals',
      description: 'Master typography, hierarchy, balance, color theory, grid systems, and visual communication.',
      level: CourseLevel.BEGINNER,
      domain: 'DESIGN_CREATIVE',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Color Harmony & Typographic Hierarchies',
          description: 'Leverage the color wheel for visual contrast and pair typefaces to establish structure.',
          orderNumber: 1,
          content: '### Graphic Design Principles\nLearn structural alignment, grid systems, white space hierarchy, and color palettes.',
          videos: [
            {
              title: 'Color Theory & Typography Basics',
              url: 'https://www.youtube.com/watch?v=dFSia1LMC4Y',
              duration: 1400,
              orderNumber: 1,
              description: 'Visual balance, grids, and pairing styles.',
              content: '### Visual Principles Summary\n\n* **Typography Hierarchy**: Uses size contrast to guide readers.\n* **Color Theory**: Complementary colors create high-contrast points.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Graphic Design Basics Quiz',
        description: 'Evaluate your grasp of typographic hierarchy.',
        passingScore: 70,
        questions: [
          {
            text: 'What design principle establishes the order of importance on a canvas?',
            options: [
              { text: 'Visual Hierarchy', isCorrect: true },
              { text: 'Arbitrary Margins', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Business English & Professional Communication',
      description: 'Write professional emails, deliver sales pitches, chair meetings, and master diplomatic negotiation vocabulary.',
      level: CourseLevel.BEGINNER,
      domain: 'LANGUAGE_COMMUNICATION',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Professional Email Structuring',
          description: 'Compose structured, clear corporate correspondences and professional project updates.',
          orderNumber: 1,
          content: '### Corporate English Syllabus\nLearn vocabulary for emails, updates, meeting coordination, and standard expressions.',
          videos: [
            {
              title: 'Writing Professional Emails',
              url: 'https://www.youtube.com/watch?v=uC0_T63e80s',
              duration: 1000,
              orderNumber: 1,
              description: 'Formulating clear emails with correct tone.',
              content: '### Email Etiquette Checklist\n\n* State purpose clearly in the first paragraph.\n* Keep paragraphs under 3 sentences for readability.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Business Writing Assessment',
        description: 'Evaluate your email tone.',
        passingScore: 70,
        questions: [
          {
            text: 'Which closing phrase is most appropriate for a professional business email?',
            options: [
              { text: 'Best regards,', isCorrect: true },
              { text: 'Cheers,', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'The Art of Public Speaking & Presentation',
      description: 'Overcome stage fright, command your voice, project body language, and structure slides that captivate any audience.',
      level: CourseLevel.BEGINNER,
      domain: 'LANGUAGE_COMMUNICATION',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Stage Presence & Vocal Modulation',
          description: 'Control speed, utilize intentional pauses, and coordinate positive body language gestures.',
          orderNumber: 1,
          content: '### Speech Delivery & Pacing\nLearn how to capture attention, project volume, manage body posture, and format presentation slides.',
          videos: [
            {
              title: 'Public Speaking Vocal Tips',
              url: 'https://www.youtube.com/watch?v=i5aVj4P1-5E',
              duration: 1100,
              orderNumber: 1,
              description: 'Overcoming voice shaking and posture rules.',
              content: '### Voice Control Rules\n\n* **Vary Volume**: Highlight important keywords.\n* **Pause**: Give audience time to think.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Presentation Skills Quiz',
        description: 'Test your understanding of pacing.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the purpose of a strategic pause in speech delivery?',
            options: [
              { text: 'To emphasize a point and allow the audience to digest it', isCorrect: true },
              { text: 'To show that the speaker is lost', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Data Analytics & Power BI',
      description: 'Comprehensive course on Data Analytics and Power BI including data preparation, modeling, DAX calculations, visualization, and business insights.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 119.99,
      sessions: [
        {
          title: 'Session 1: Introduction to Data Analytics & Power BI',
          description: 'Deconstruct BI foundations, workspace features, database links, and standard dashboard objects.',
          orderNumber: 1,
          content: '### BI & Data Analytics Foundations\nLearn key data terms, database connection methods, Power Query transformations, and desktop reports.',
          videos: [
            {
              title: 'Introduction to Power BI',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 1500,
              orderNumber: 1,
              description: 'Walkthrough of Power BI Desktop interface.',
              content: '### Power BI Components\n\n* **Power BI Desktop**: Report design tool.\n* **Power BI Service**: Cloud-based dashboard sharing platform.'
            }
          ]
        },
        {
          title: 'Session 2: Preparing Data with Excel & Power Query',
          description: 'Learn database import techniques, loading types, parameters, and query configurations.',
          orderNumber: 2,
          content: '### Data Import & Loading\nConnect databases, flat files, APIs, and direct folders to Power Query loader.',
          videos: [
            {
              title: 'Data Connections and Loading',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 1600,
              orderNumber: 1,
              description: 'Loading CSV and SQL tables to Power Query.',
              content: '### Data Loading Guides\n\n* **Import Mode**: Loads data directly to Power BI cache.\n* **DirectQuery**: Connects database live (query runs directly in backend).'
            }
          ]
        },
        {
          title: 'Session 3: Data Cleaning & Transformation',
          description: 'Handle duplicates, fill missing cells, split text columns, and clean datasets with Power Query.',
          orderNumber: 3,
          content: '### Cleaning Techniques\nMaster column pivots, string formatting, data type mappings, and column merges.',
          videos: [
            {
              title: 'Data Cleaning in Power Query',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 1700,
              orderNumber: 1,
              description: 'Removing null cells and splitting columns.',
              content: '### M Language Basics\nM is the underlying language of Power Query. M code is functional and tracks step-by-step transformations.'
            }
          ]
        },
        {
          title: 'Session 4: Data Modeling & Star Schema',
          description: 'Build robust entity relationship structures using facts, dimensions, and filter contexts.',
          orderNumber: 4,
          content: '### Relational Modeling\nUnderstand cardinality (one-to-many), cross filtering directions, active/inactive relationships, and star schemas.',
          videos: [
            {
              title: 'Star Schema Data Modeling',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 1900,
              orderNumber: 1,
              description: 'Structuring Fact tables and Dimension tables.',
              content: '### Star Schema Rules\n\n* **Fact Tables**: Contain metrics (amounts, quantities, dates).\n* **Dimension Tables**: Contain attributes (customer names, product locations).'
            }
          ]
        },
        {
          title: 'Session 5: DAX (Measures & Calculations)',
          description: 'Write complex DAX formulas using CALCULATE, iterators, and time-intelligence expressions.',
          orderNumber: 5,
          content: '### DAX Foundations\nLearn calculated columns vs measures, filter context modifications, and YTD analysis.',
          videos: [
            {
              title: 'DAX Basics and CALCULATE',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 2100,
              orderNumber: 1,
              description: 'Calculated measures and filter context changes.',
              content: '### DAX Code Cheat Sheet\n```dax\nTotal Sales = SUM(Sales[Amount])\nSales YTD = TOTALYTD([Total Sales], Dates[Date])\n```'
            }
          ]
        },
        {
          title: 'Session 6: Data Visualization & Reports',
          description: 'Design charts, grids, maps, cards, KPIs, and implement page navigation bookmarks.',
          orderNumber: 6,
          content: '### Visual Design Standards\nSelect appropriate chart layouts (line, bar, scatter) and set up drill-down interactions.',
          videos: [
            {
              title: 'Building Interactive Reports',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 1800,
              orderNumber: 1,
              description: 'Adding visual components and formatting.',
              content: '### Interactive Reporting Tools\n* **Slicers**: Filter data on the canvas.\n* **Bookmarks**: Save dashboard view states for custom stories.'
            }
          ]
        },
        {
          title: 'Session 7: Dashboards & Business Insights',
          description: 'Configure KPI alert rules, publish dashboards, and extract insights using Q&A AI.',
          orderNumber: 7,
          content: '### KPI Monitoring\nSet target ranges, configure progress bars, and embed executive summary indicators.',
          videos: [
            {
              title: 'KPI Dashboards in Power BI',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 2000,
              orderNumber: 1,
              description: 'Building performance indicator grids.',
              content: '### KPI Configuration\n* **Indicator**: Active value (e.g. Sales).\n* **Trend Axis**: Progress reference (e.g. Months).'
            }
          ]
        },
        {
          title: 'Session 8: Power BI Service & Sharing',
          description: 'Share reports securely, configure Row-Level Security (RLS), and schedule database refreshes.',
          orderNumber: 8,
          content: '### Service Sharing & Security\nManage cloud workspaces, assign member roles (Viewer, Contributor), set RLS filters, and deploy gateways.',
          videos: [
            {
              title: 'Publishing and Gateways',
              url: 'https://www.youtube.com/watch?v=3u7M15Gi0I4',
              duration: 2200,
              orderNumber: 1,
              description: 'Publishing report from desktop to cloud service.',
              content: '### Row-Level Security (RLS) Rules\nRLS filters rows displayed to users based on their active directory profiles or custom database roles.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Power BI Master Assessment',
        description: 'Verify your knowledge of DAX calculations and data modeling structures.',
        passingScore: 70,
        questions: [
          {
            text: 'Which tool is used to design and build dashboards locally on Windows?',
            options: [
              { text: 'Power BI Desktop', isCorrect: true },
              { text: 'Power BI Service Cloud', isCorrect: false }
            ]
          }
        ]
      }
    },
    // NEW FLAGSHIP COURSE 1: Artificial Intelligence & Deep Learning Masterclass (12 Sessions)
    {
      title: 'Artificial Intelligence & Deep Learning Masterclass',
      description: 'Comprehensive mathematical and practical guide to Neural Networks, PyTorch, CNNs, Transformers, and LLMs.',
      level: CourseLevel.ADVANCED,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 149.99,
      sessions: Array.from({ length: 12 }, (_, i) => ({
        title: `Session ${i + 1}: ${
          [
            'Linear Algebra & Mathematical Foundations of AI',
            'Deep Learning with PyTorch Framework',
            'Multi-Layer Perceptrons & Activation Functions',
            'Backpropagation Calculus & Loss Optimization',
            'Convolutional Neural Networks (CNNs) for Vision',
            'Recurrent Neural Networks (RNNs) & LSTMs',
            'Sequence-to-Sequence Models & Encoder-Decoder',
            'Self-Attention Mechanisms & Transformer Foundations',
            'Large Language Models (LLMs) & GPT Architecture',
            'Fine-Tuning Strategies & Prompt Engineering',
            'Model Quantization & Production API Deployment',
            'Ethical AI, Algorithmic Bias & Future Trends'
          ][i]
        }`,
        description: `Explore key theoretical concepts and practical applications of ${[
          'vectors, matrices, eigenvalues, and gradient math.',
          'tensor operations, autograd, and dataset loaders in PyTorch.',
          'forward propagation, hidden layers, and ReLU/Sigmoid activations.',
          'chain rule calculations, SGD, Adam, and loss functions.',
          'kernels, pooling layers, and image feature maps.',
          'gates, memory cells, and sequence dependencies.',
          'attention mechanisms and language translation pipelines.',
          'multi-head attention, positional encoding, and self-attention.',
          'tokenization, decoder layers, and text generation logic.',
          'LoRA, QLoRA, and task-specific prompt layouts.',
          'ONNX formats, quantization, and Docker hosting.',
          'responsible model usage, safety guidelines, and scaling limits.'
        ][i]}`,
        orderNumber: i + 1,
        content: `### Curriculum Details: Session ${i + 1}\nThis session covers mathematical and logical foundations. Be sure to review the code samples below.`,
        videos: [
          {
            title: `Deep Learning Video Tutorial: Part ${i + 1}`,
            url: 'https://www.youtube.com/watch?v=GwIo3gDZUtQ',
            duration: 1800 + i * 100,
            orderNumber: 1,
            description: `Visual walkthrough of ${['tensor math', 'autograd', 'neuron logic', 'backprop', 'convolutions', 'sequence loops', 'attention layers', 'transformers', 'token weights', 'fine tuning', 'deployments', 'safety checks'][i]}.`,
            content: `### Supplementary Study Notes - Session ${i + 1}\n\n#### Key Learnings\n* Learn to model variables using standard weights.\n* Understand numerical stability optimizations.\n\n#### Code Example\n\`\`\`python\nimport torch\nx = torch.tensor([1.0, 2.0], requires_grad=True)\ny = x.pow(2).sum()\ny.backward()\nprint(x.grad) # outputs tensor([2., 4.])\n\`\`\``
          }
        ]
      })),
      quiz: {
        title: 'Artificial Intelligence Final Exam',
        description: 'Verify your understanding of Neural Network layers and backpropagation calculus.',
        passingScore: 75,
        questions: [
          {
            text: 'What mathematical rule is the foundation of Backpropagation?',
            options: [
              { text: 'The Chain Rule', isCorrect: true },
              { text: 'The Quotient Rule', isCorrect: false }
            ]
          }
        ]
      }
    },
    // NEW FLAGSHIP COURSE 2: Startup Valuation, Venture Capital & Financial Modeling (12 Sessions)
    {
      title: 'Startup Valuation, Venture Capital & Financial Modeling',
      description: 'Master venture capital metrics, funding rounds, capitalization tables, and LBO startup valuation models.',
      level: CourseLevel.ADVANCED,
      domain: 'FINANCE_BUSINESS',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 199.99,
      sessions: Array.from({ length: 12 }, (_, i) => ({
        title: `Session ${i + 1}: ${
          [
            'Introduction to Venture Capital Ecosystem',
            'Funding Rounds: Pre-Seed to Series C',
            'Capitalization Tables & Dilution Mathematics',
            'Discounted Cash Flow (DCF) for High-Growth Startups',
            'Market Multiple Comparables (Comps) Valuation',
            'Precedent Transactions Valuation Method',
            'Leveraged Buyout (LBO) Model Architecture',
            'Term Sheets: Valuation, Liquidation & Control Clauses',
            'Financial Due Diligence Auditing in Startups',
            'SaaS Metrics & Unit Economics (LTV, CAC, Churn)',
            'Startup Exit Strategies: IPOs vs. Strategic Mergers',
            'Venture Capital Case Study & Valuation Pitches'
          ][i]
        }`,
        description: `Explore startup finance metrics including ${[
          'LP/GP structures and investment cycles.',
          'funding milestones, valuations, and target objectives.',
          'dilution tables, option pools, and convertible notes.',
          'free cash flow projections and WACC discount adjustments.',
          'P/E, EV/Revenue, and EV/EBITDA multiple calculations.',
          'historical transaction analysis and control premiums.',
          'debt structures, cash flow paydowns, and IRR analysis.',
          'liquidation preferences, drag-along rights, and protective clauses.',
          'quality of earnings reports and tax liabilities.',
          'LTV/CAC ratios, churn dynamics, and cohort curves.',
          'SEC registrations, underwriters, and synergy benefits.',
          'pitch deck financials and equity distributions.'
        ][i]}`,
        orderNumber: i + 1,
        content: `### VC Financial Curriculum: Session ${i + 1}\nMaster the spreadsheets, math, and clauses investors use to value startups.`,
        videos: [
          {
            title: `Startup Finance Masterclass: Video ${i + 1}`,
            url: 'https://www.youtube.com/watch?v=WEDIj9JBTC8',
            duration: 1600 + i * 50,
            orderNumber: 1,
            description: `Video explanation of ${['VC roles', 'milestones', 'dilution tables', 'DCF cash flows', 'multiples', 'precedent deals', 'debt payoff', 'term sheets', 'due diligence', 'SaaS metrics', 'exits', 'pitches'][i]}.`,
            content: `### Startup Finance Supplementary Reading - Session ${i + 1}\n\n#### Key Formulas\n* **LTV (Customer Lifetime Value)**: \\(\\frac{\\text{ARPU} \\times \\text{Gross Margin}}{\\text{Churn Rate}}\\)\n* **CAC (Customer Acquisition Cost)**: \\(\\frac{\\text{Total Marketing Cost}}{\\text{New Customers Acquired}}\\)\n\n#### Valuation Table Guidelines\n| Metric | Metric Goal | Description |\n|---|---|---|\n| LTV/CAC | > 3x | Measures efficiency of customer acquisition |\n| Month Churn | < 1% | Measures retention strength |`
          }
        ]
      })),
      quiz: {
        title: 'Venture Capital Valuation Final Exam',
        description: 'Verify your knowledge of dilution models and SaaS unit economics.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the healthy target ratio for SaaS Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC)?',
            options: [
              { text: 'LTV/CAC > 3x', isCorrect: true },
              { text: 'LTV/CAC = 1x', isCorrect: false }
            ]
          }
        ]
      }
    },
    // NEW FLAGSHIP COURSE 3: Professional Motion Design & Brand Identity (12 Sessions)
    {
      title: 'Professional Motion Design & Brand Identity',
      description: 'Learn brand visual systems, typography styles, vector asset creation, and 2D keyframe rendering in After Effects.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'DESIGN_CREATIVE',
      thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: Array.from({ length: 12 }, (_, i) => ({
        title: `Session ${i + 1}: ${
          [
            'Brand Identity Design Principles & Style Guides',
            'Typographic Systems & Layout Hierarchies',
            'Color Psychology & Brand Color Harmonies',
            'Vector Asset Creation in Adobe Illustrator',
            'After Effects Interface & Composition Setup',
            'Timeline Keyframing & Animation Basics',
            'Graph Editor: Spatial and Temporal Easing Curves',
            'Logo Animation & Creative Visual Transitions',
            'Kinetic Typography & Text Motion Design',
            'UI Transition Motion & App Micro-interactions',
            'Video Rendering Formats & Codec Compression',
            'Creative Portfolio Building & Freelancing Strategy'
          ][i]
        }`,
        description: `Explore creative design practices including ${[
          'brand style guides, logos, and print layouts.',
          'type scaling, serif/sans-serif pairings, and visual grids.',
          'complementary palettes and high contrast design scales.',
          'pen tool paths, anchors, and SVG exports.',
          'compositions, frame rates, and render queues.',
          'position, rotation, scale, and opacity controls.',
          'speed curves, value graphs, and elastic motion.',
          'morphing vectors and masked shape layers.',
          'textanimators, range selectors, and track mattes.',
          'easing curves, button states, and screen transitions.',
          'H.264 formats, mp4 wrappers, and bitrate settings.',
          'portfolio hosts, case studies, and gig pitches.'
        ][i]}`,
        orderNumber: i + 1,
        content: `### Motion Graphics Specialization: Session ${i + 1}\nLearn keyframe animations, typography hierarchies, and vector creations.`,
        videos: [
          {
            title: `Motion Graphics Video Tutorial: Episode ${i + 1}`,
            url: 'https://www.youtube.com/watch?v=FTFaQW1ZWhg',
            duration: 1400 + i * 40,
            orderNumber: 1,
            description: `Walkthrough of ${['brand guides', 'typography grids', 'color palettes', 'vector anchors', 'compositions', 'keyframes', 'easing graphs', 'logo morphs', 'text animators', 'UI states', 'codecs', 'freelancing'][i]}.`,
            content: `### Motion Graphics Reading Notes - Session ${i + 1}\n\n#### Key Concept: Principles of Animation\n* **Squash and Stretch**: Gives sense of weight and volume to assets.\n* **Timing and Spacing**: Pacing determines speed and weight references.\n\n#### Easing Values Table\n| Ease Type | Speed Curve | Description |\n|---|---|---|\n| Linear | Flat Line | Constant rate of change |\n| Ease-In | Sloping Upwards | Starts slow, accelerates at end |`
          }
        ]
      })),
      quiz: {
        title: 'Brand Identity & Motion Design Quiz',
        description: 'Test your understanding of After Effects keyframing and vector scaling.',
        passingScore: 70,
        questions: [
          {
            text: 'Which After Effects tool is used to customize the temporal easing curves of a keyframe?',
            options: [
              { text: 'The Graph Editor', isCorrect: true },
              { text: 'The Pen Tool', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Quantum Computing for Beginners',
      description: 'Explore the fundamental principles of quantum mechanics, qubits, superposition, entanglement, and quantum gates.',
      level: CourseLevel.BEGINNER,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: []
    },
    {
      title: 'Real Estate Investment Strategies',
      description: 'Learn property valuation, real estate finance, commercial vs residential acquisitions, and rental market calculations.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'FINANCE_BUSINESS',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 49.99,
      sessions: []
    },
    {
      title: 'Introduction to Photography & Lighting',
      description: 'Master exposure triangles, aperture, shutter speed, ISO settings, three-point studio lighting, and digital editing.',
      level: CourseLevel.BEGINNER,
      domain: 'DESIGN_CREATIVE',
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: []
    },
    {
      title: 'Nutrition, Health & Lifestyle Medicine Foundations',
      description: 'Understand micronutrients, macronutrients, disease prevention, and dietary strategies for optimal human longevity.',
      level: CourseLevel.BEGINNER,
      domain: 'HEALTH_WELLNESS',
      thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: Introduction to Human Macronutrients',
          description: 'Analyze proteins, carbohydrates, healthy fats, and their absorption pathways.',
          orderNumber: 1,
          content: '### Macronutrients Study Guide\nLearn how carbohydrates, proteins, and lipids fuel metabolic pathways.',
          videos: [
            {
              title: 'Introduction to Macronutrients',
              url: 'https://www.youtube.com/watch?v=GwIo3gDZUtQ',
              duration: 1500,
              orderNumber: 1,
              description: 'Basics of digestion and energy pathways.',
              content: '### Macronutrients Summary\n\n* **Carbohydrates**: Break down to glucose for rapid energy.\n* **Proteins**: Support cell maintenance and muscle tissue repair.\n* **Fats**: Essential for hormone synthesis and structural cell membranes.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Macronutrients Assessment',
        description: 'Test your understanding of basic macronutrients.',
        passingScore: 70,
        questions: [
          {
            text: 'Which macronutrient is primarily responsible for muscle tissue repair and cell maintenance?',
            options: [
              { text: 'Protein', isCorrect: true },
              { text: 'Carbohydrates', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'High Performance Productivity & Life Mastery',
      description: 'Master time-blocking, flow states, cognitive focus optimization, and habit formation science.',
      level: CourseLevel.BEGINNER,
      domain: 'PERSONAL_DEVELOPMENT',
      thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 19.99,
      sessions: [
        {
          title: 'Session 1: Atomic Habits & Focus Cycles',
          description: 'Leverage the habit loop (cue, craving, response, reward) to build consistent focus routines.',
          orderNumber: 1,
          content: '### Habits & Routines Guide\nAnalyze the neurological patterns behind habit triggers and construct clear task-blocking schedules.',
          videos: [
            {
              title: 'The Science of Atomic Habits',
              url: 'https://www.youtube.com/watch?v=i5aVj4P1-5E',
              duration: 1200,
              orderNumber: 1,
              description: 'How simple cues trigger automatic routines.',
              content: '### Habit Loop Summary\n1. **Cue**: Visual or context trigger.\n2. **Craving**: Motivating force behind response.\n3. **Response**: The actual habit performed.\n4. **Reward**: Goal state reinforcing neural loop.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Habit Formation Quiz',
        description: 'Test your knowledge on habit loops.',
        passingScore: 70,
        questions: [
          {
            text: 'What are the four components of a habit loop?',
            options: [
              { text: 'Cue, Craving, Response, Reward', isCorrect: true },
              { text: 'Trigger, Delay, Execution, Review', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Calculus & Linear Algebra for Scientists',
      description: 'Master limits, derivatives, integrals, matrix transformations, and eigenvectors for data physics.',
      level: CourseLevel.ADVANCED,
      domain: 'ACADEMIC_SCIENCES',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 79.99,
      sessions: [
        {
          title: 'Session 1: Matrix Transformations & Eigenvectors',
          description: 'Deconstruct linear coordinate changes and calculate eigenvalues.',
          orderNumber: 1,
          content: '### Linear Transformations\nUnderstand matrix operations, determinants, scaling factors, and spatial dimensions.',
          videos: [
            {
              title: 'Eigenvalues and Eigenvectors Explained',
              url: 'https://www.youtube.com/watch?v=GwIo3gDZUtQ',
              duration: 1800,
              orderNumber: 1,
              description: 'Visual scaling vectors that do not change direction.',
              content: '### Linear Equation Foundations\n\n* **Eigenvector Formula**: \\(Av = \\lambda v\\)\n* **Determinant**: Measures matrix area/volume scaling factor.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Linear Algebra Exam',
        description: 'Evaluate coordinate space modeling skills.',
        passingScore: 75,
        questions: [
          {
            text: 'In the formula Av = λv, what does the variable λ represent?',
            options: [
              { text: 'Eigenvalue scaling factor', isCorrect: true },
              { text: 'Eigenvector coordinate', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Music Production Masterclass: Ableton Live & Sound Design',
      description: 'Configure DAWs, design custom synthesizer waveforms, apply compression, EQ, and complete professional audio mixes.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'MUSIC_ARTS',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 99.99,
      sessions: [
        {
          title: 'Session 1: Synthesizer Oscillators & Filters',
          description: 'Configure sine, triangle, sawtooth waves, and apply low-pass filtering.',
          orderNumber: 1,
          content: '### Sound Design Foundations\nUnderstand frequency spectrums, sound envelopes (ADSR), and audio routing.',
          videos: [
            {
              title: 'Synthesizer Basics',
              url: 'https://www.youtube.com/watch?v=FTFaQW1ZWhg',
              duration: 1600,
              orderNumber: 1,
              description: 'Waveform design and filter sweeps.',
              content: '### ADSR Envelope Summary\n* **Attack**: Time taken for initial volume peak.\n* **Decay**: Time to drop to sustain level.\n* **Sustain**: Constant volume level while key is held.\n* **Release**: Time taken for sound to fade to silent.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Sound Design Basics Quiz',
        description: 'Test your understanding of ADSR envelopes.',
        passingScore: 70,
        questions: [
          {
            text: 'What does the letter A stand for in the ADSR envelope model?',
            options: [
              { text: 'Attack time', isCorrect: true },
              { text: 'Amplitude range', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Design Patterns & Clean Code Architectures',
      description: 'Master SOLID principles, OOP design patterns (Factory, Observer, Singleton), and clean architectural routing.',
      level: CourseLevel.ADVANCED,
      domain: 'IT_DATA',
      thumbnail: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 69.99,
      sessions: [
        {
          title: 'Session 1: SOLID Principles & The Single Responsibility Rule',
          description: 'Refactor monolithic modules to achieve loose coupling and single concerns.',
          orderNumber: 1,
          content: '### Clean Architecture Design\nLearn about interface segregation, dependency inversion, encapsulation, and code modularity.',
          videos: [
            {
              title: 'SOLID Principles Walkthrough',
              url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI',
              duration: 2000,
              orderNumber: 1,
              description: 'Refactoring class dependencies.',
              content: '### SOLID Definition\n* **S**: Single Responsibility Principle\n* **O**: Open/Closed Principle\n* **L**: Liskov Substitution Principle\n* **I**: Interface Segregation Principle\n* **D**: Dependency Inversion Principle'
            }
          ]
        }
      ],
      quiz: {
        title: 'Clean Architecture Assessment',
        description: 'Verify your software refactoring principles.',
        passingScore: 70,
        questions: [
          {
            text: 'What is the core target of the Dependency Inversion Principle?',
            options: [
              { text: 'High-level modules should depend on abstractions, not on concrete implementations', isCorrect: true },
              { text: 'Subclasses must duplicate parent methods', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'E-Commerce Empire: Building Shopify & Amazon Brands',
      description: 'Learn product research, sourcing agents, Shopify design, social ad funnels, and inventory shipping logistics.',
      level: CourseLevel.BEGINNER,
      domain: 'SALES_E_COMMERCE',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 59.99,
      sessions: [
        {
          title: 'Session 1: Winning Product Research Rules',
          description: 'Leverage analytics search tools to identify high-demand, low-competition physical products.',
          orderNumber: 1,
          content: '### Product Discovery Metrics\nVerify profit margins, shipping dimensions, search volume, and manufacturer prices.',
          videos: [
            {
              title: 'How to Find Winning Products',
              url: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ',
              duration: 1500,
              orderNumber: 1,
              description: 'Analyzing metrics on product listing tables.',
              content: '### Research Criteria\n* Margin target: > 3x cost of goods sold.\n* Weight profile: < 2kg (reduces air shipping costs).'
            }
          ]
        }
      ],
      quiz: {
        title: 'E-Commerce Research Quiz',
        description: 'Verify your metrics calculations.',
        passingScore: 70,
        questions: [
          {
            text: 'Why is a lighter product weight preferred for starting drop-shipping stores?',
            options: [
              { text: 'It reduces international air cargo shipping fees', isCorrect: true },
              { text: 'It avoids import taxes entirely', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Modern History & World Civilizations',
      description: 'Explore the major geopolitical shifts, revolutions, conflicts, and treaties that formed our modern world.',
      level: CourseLevel.BEGINNER,
      domain: 'HUMANITIES_SOCIAL',
      thumbnail: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80',
      isPaid: false,
      price: 0.00,
      sessions: [
        {
          title: 'Session 1: The Industrial Revolution & World Trade',
          description: 'Analyze mechanical engines, mass urbanization, and shifts in global economic trade routes.',
          orderNumber: 1,
          content: '### Industrial Revolution Foundations\nLearn how steam power altered production capacity, shifted populations, and influenced modern city structures.',
          videos: [
            {
              title: 'The Steam Age Overview',
              url: 'https://www.youtube.com/watch?v=uC0_T63e80s',
              duration: 1400,
              orderNumber: 1,
              description: 'Coal power and early urban rails.',
              content: '### Key Milestones\n* **1769**: James Watt patents advanced steam engine design.\n* **1830**: Opening of Liverpool and Manchester Railway triggers rail expansion.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Industrial History Assessment',
        description: 'Verify your timeline knowledge.',
        passingScore: 70,
        questions: [
          {
            text: 'Which resource was the primary fuel source of the initial Industrial Revolution?',
            options: [
              { text: 'Coal', isCorrect: true },
              { text: 'Electricity', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Contract Law & Intellectual Property Essentials',
      description: 'Learn legally binding agreement criteria, copyright rules, patents, trade secrets, and non-disclosure standards.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'LAW_LEGAL',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 89.99,
      sessions: [
        {
          title: 'Session 1: Contract Formation & Legally Binding Offers',
          description: 'Deconstruct contract elements: Offer, Acceptance, Consideration, and Intention to create legal relations.',
          orderNumber: 1,
          content: '### Contract Law Foundations\nIdentify when an offer becomes binding, what constitutes consideration, and contract breaches.',
          videos: [
            {
              title: 'Contract Elements Explained',
              url: 'https://www.youtube.com/watch?v=nzj7Wg46zgA',
              duration: 1500,
              orderNumber: 1,
              description: 'Analyzing offers vs invitations to treat.',
              content: '### Contract Elements\n1. **Offer**: Definite statement of terms.\n2. **Acceptance**: Unconditional agreement to terms.\n3. **Consideration**: Value exchanged between parties (e.g. price for services).\n4. **Intention**: Objective target to be bound.'
            }
          ]
        }
      ],
      quiz: {
        title: 'Contract Law Assessment',
        description: 'Verify your agreement validation definitions.',
        passingScore: 70,
        questions: [
          {
            text: 'What term defines the value exchanged between parties to make a contract legally binding?',
            options: [
              { text: 'Consideration', isCorrect: true },
              { text: 'Indemnity', isCorrect: false }
            ]
          }
        ]
      }
    },
    {
      title: 'Culinary Arts: Master French Cooking Techniques',
      description: 'Master French culinary foundations, knife skills, mother sauces, and advanced heat control methods.',
      level: CourseLevel.INTERMEDIATE,
      domain: 'LIFESTYLE_HOBBIES',
      thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      isPaid: true,
      price: 39.99,
      sessions: [
        {
          title: 'Session 1: French Mother Sauces & Knife Skills',
          description: 'Learn julienne cuts, dice profiles, and construct Béchamel, Velouté, and Espagnole sauces.',
          orderNumber: 1,
          content: '### Culinary Foundations\nMaster the essential knife grips, safety angles, and the five traditional French mother sauces.',
          videos: [
            {
              title: 'Introduction to French Mother Sauces',
              url: 'https://www.youtube.com/watch?v=uC0_T63e80s',
              duration: 1500,
              orderNumber: 1,
              description: 'Step-by-step tutorial on emulsification and roux bases.',
              content: '### Mother Sauces Cheat Sheet\n* **Béchamel**: Milk base thickened with white roux.\n* **Velouté**: Light stock base thickened with blond roux.\n* **Espagnole**: Brown stock base thickened with brown roux.\n* **Tomato**: Tomato base with aromatics.\n* **Hollandaise**: Warm egg yolk emulsion with clarified butter.'
            }
          ]
        }
      ],
      quiz: {
        title: 'French Culinary Foundations Quiz',
        description: 'Verify your knowledge of culinary cuts and roux ratios.',
        passingScore: 70,
        questions: [
          {
            text: 'Which mother sauce is prepared using a warm egg yolk emulsion and clarified butter?',
            options: [
              { text: 'Hollandaise', isCorrect: true },
              { text: 'Béchamel', isCorrect: false }
            ]
          }
        ]
      }
    }
  ];

  for (const cData of coursesToSeed) {
    console.log(`🚀 Creating complete course: "${cData.title}" (${cData.domain} - ${cData.level})...`);
    const newCourse = await prisma.course.create({
      data: {
        title: cData.title,
        description: cData.description,
        level: cData.level,
        domain: cData.domain,
        thumbnail: cData.thumbnail,
        creatorId: creator.id,
        isPaid: cData.isPaid,
        price: cData.price,
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
            description: vData.description,
            content: vData.content,
          }
        });
      }
    }

    // Create Quiz and Questions
    if (cData.quiz) {
      const quiz = await prisma.quiz.create({
        data: {
          title: cData.quiz.title,
          description: cData.quiz.description,
          passingScore: cData.quiz.passingScore,
          isExamMode: true,
          courseId: newCourse.id,
        }
      });

      for (const questionData of cData.quiz.questions) {
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

    console.log(`✅ Successfully seeded "${cData.title}"!`);
  }

  console.log('🎉 Seeding of exactly 38 courses completed cleanly!');
}

seed23Courses()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
