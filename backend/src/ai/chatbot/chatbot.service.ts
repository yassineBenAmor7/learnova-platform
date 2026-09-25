import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatQueryDto } from './dto/chat-query.dto';

export interface ChatAction {
  label: string;
  url: string;
  type: 'link' | 'course' | 'exam' | 'certificate';
}

export interface ChatbotResponse {
  answer: string;
  intent: 'course_query' | 'pedagogical_concept' | 'platform_navigation' | 'recommendation' | 'general';
  confidence: number;
  sources?: { courseTitle: string; sessionTitle?: string; videoTitle?: string; courseId: number }[];
  actions?: ChatAction[];
  suggestions?: string[];
}

interface PedagogicalTopic {
  title: string;
  definition: string;
  coreConcepts: string[];
  practicalApplication: string;
  relatedCourseIds: number[];
  suggestions: string[];
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  // Deep Pedagogical Knowledge Repository covering core Learnova curriculums
  private readonly pedagogicalKnowledge: Record<string, PedagogicalTopic> = {
    data: {
      title: 'Data (Les Données Numériques)',
      definition: '**Data** (les données) refers to distinct pieces of raw, unorganized facts, statistics, numbers, text, or signals collected for observation, reference, or automated computation. On its own, raw data is unprocessed input; when structured, contextualized, and organized by computational algorithms, it transforms into meaningful **Information**, which subsequently empowers **Knowledge** and strategic **Wisdom** (the DIKW Pyramid: *Data → Information → Knowledge → Wisdom*).',
      coreConcepts: [
        '**Structured Data**: Highly organized data with a strict, predefined schema, traditionally stored in rows and columns within relational databases (*SQL*, spreadsheets). Easily searchable, indexed, and aggregated.',
        '**Semi-Structured Data**: Flexible data containing self-describing organizational tags or markers without a rigid tabular schema (*JSON*, *XML*, *YAML*, NoSQL document stores).',
        '**Unstructured Data**: Free-form content representing over 80% of all digital information created worldwide (*video streams*, *audio recordings*, *natural language texts*, *PDF documents*, *sensor logs*).',
        '**The Data Lifecycle**: Generation & Ingestion → Storage (Data Lakes / Warehouses) → Cleaning & Transformation (ETL) → Statistical Analysis / AI Modeling → Visualization & Decision-Making.',
      ],
      practicalApplication: 'Data is the fundamental fuel of the modern digital economy. It powers search engines, financial transactions, personalized recommendations, business intelligence dashboards, and predictive artificial intelligence models.',
      relatedCourseIds: [3, 24, 4],
      suggestions: [
        'What is the difference between Data, Information, and Knowledge?',
        'What is the difference between Structured and Unstructured Data?',
        'Which courses teach Data Analytics and SQL on Learnova?',
      ],
    },
    data_science: {
      title: 'Data Science (Science des Données)',
      definition: '**Data Science** is the multidisciplinary field that utilizes scientific methods, processes, algorithms, and systems to extract actionable knowledge and predictive insights from noisy, structured, and unstructured data.',
      coreConcepts: [
        '**The Data Science Lifecycle**: Business understanding → Data acquisition & scraping → Exploratory Data Analysis (EDA) → Feature Engineering → Model training (Machine Learning) → Model evaluation & deployment.',
        '**Core Programming Ecosystem**: Python (*Pandas*, *NumPy*, *Scipy*, *Scikit-Learn*) and interactive Jupyter computational environments.',
        '**Predictive Analytics**: Building statistical models to forecast future trends, risk probabilities, and customer retention.',
      ],
      practicalApplication: 'Applied across healthcare diagnosis, algorithmic stock trading, customer churn prediction, and autonomous recommendation systems.',
      relatedCourseIds: [92, 24, 4],
      suggestions: [
        'What is the difference between Data Science and Data Analytics?',
        'How is Python used in Data Science?',
        'Show beginner-friendly courses',
      ],
    },
    data_analytics: {
      title: 'Data Analytics & Power BI',
      definition: '**Data Analytics** is the science of analyzing, cleaning, transforming, and modeling raw data to discover actionable insights, metrics, and inform executive business decisions.',
      coreConcepts: [
        '**ETL Pipelines**: Extracting raw data from databases, Transforming and cleaning anomalies, and Loading into data warehouses.',
        '**Exploratory Data Analysis (EDA)**: Statistical distributions, correlation analysis, and predictive variance.',
        '**Visual Dashboards (Power BI & DAX)**: Interactive KPIs, drill-through reports, and data storytelling for decision-makers.',
      ],
      practicalApplication: 'Empowers leadership across tech, finance, and marketing to make data-backed strategic investments rather than relying on intuition.',
      relatedCourseIds: [24, 92, 3],
      suggestions: [
        'What is DAX in Power BI?',
        'What is the difference between Data Analytics and Data Science?',
        'Show beginner-friendly courses',
      ],
    },
    database: {
      title: 'Databases & SQL (Bases de Données & SGBD)',
      definition: 'A **Database** (base de données) is a structured, electronically stored collection of data managed through a **DBMS** (Database Management System / SGBD). It guarantees data persistence, high-performance querying, relational integrity, and concurrent multi-user transactions.',
      coreConcepts: [
        '**Relational Databases (SQL)**: Data is structured into tables with fixed schemas, primary keys, and foreign keys. Strictly complies with **ACID** properties (Atomicity, Consistency, Isolation, Durability). Examples: *PostgreSQL*, *MySQL*, *SQLite*.',
        '**NoSQL Databases**: Designed for flexible schemas and distributed horizontal scaling. Includes Document stores (*MongoDB*), Key-Value caches (*Redis*), and Graph databases (*Neo4j*).',
        '**Structured Query Language (SQL)**: Declarative language used to execute queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP BY`) and manage database schemas (`DDL`).',
      ],
      practicalApplication: 'Databases serve as the fundamental backbone of modern software engineering, powering web backends, financial transactions, user authentication, and enterprise business intelligence pipelines.',
      relatedCourseIds: [3, 24],
      suggestions: [
        'What is the difference between SQL and NoSQL?',
        'How do indexes improve database query speed?',
        'Show beginner-friendly courses',
      ],
    },
    artificial_intelligence: {
      title: 'Artificial Intelligence & Machine Learning (IA & Apprentissage Automatique)',
      definition: '**Artificial Intelligence (AI)** is the engineering and computational science of building systems capable of performing tasks that traditionally require human cognitive intelligence — including pattern perception, reasoning, contextual learning, and decision-making.',
      coreConcepts: [
        '**Machine Learning (ML)**: Statistical algorithms that iteratively optimize mathematical models from training data without being explicitly hardcoded. Includes *Supervised Learning* (classification & regression), *Unsupervised Learning* (clustering), and *Reinforcement Learning*.',
        '**Deep Learning & Neural Networks**: Multi-layered artificial neural architectures inspired by the human brain, notably Convolutional Neural Networks (**CNNs**) for computer vision and **Transformers** for Large Language Models (LLMs).',
        '**Training & Inference**: Learning optimal model weights via backpropagation and gradient descent, followed by real-time prediction on unseen data.',
      ],
      practicalApplication: 'Used in natural language processing (ChatGPT, virtual tutors), computer vision, autonomous navigation, algorithmic trading, and personalized recommendation engines.',
      relatedCourseIds: [25, 4, 2],
      suggestions: [
        'What is the difference between AI, Machine Learning, and Deep Learning?',
        'What is a neural network in simple terms?',
        'Which programming language is best to start in AI?',
      ],
    },
    cloud_computing: {
      title: 'Cloud Computing & Infrastructure (AWS, Azure, GCP)',
      definition: '**Cloud Computing** is the on-demand delivery of IT computing resources (virtual servers, storage, databases, networking, and software) over the Internet with elastic scaling and pay-as-you-go pricing.',
      coreConcepts: [
        '**IaaS (Infrastructure as a Service)**: Raw virtual machines, storage, and networking (e.g., AWS EC2, S3, VPC).',
        '**PaaS (Platform as a Service)**: Managed application environments where the cloud provider manages OS and runtime (e.g., AWS Elastic Beanstalk, Heroku).',
        '**SaaS (Software as a Service)**: Ready-to-use cloud-hosted end-user applications.',
        '**High Availability & Disaster Recovery**: Multi-region redundancy, automated load balancing, and auto-scaling groups.',
      ],
      practicalApplication: 'Eliminates upfront hardware capital expenses, allowing startups and enterprises to deploy global, fault-tolerant applications in minutes.',
      relatedCourseIds: [7, 6],
      suggestions: [
        'What is the difference between AWS EC2 and AWS S3?',
        'How does Docker work with Cloud Computing?',
        'Show beginner-friendly courses',
      ],
    },
    cybersecurity: {
      title: 'Cybersecurity & Ethical Hacking',
      definition: '**Cybersecurity** is the continuous discipline of protecting computer networks, servers, mobile devices, and sensitive digital assets from unauthorized access, cyberattacks, data breaches, and extortion.',
      coreConcepts: [
        '**The CIA Triad**: *Confidentiality* (data is private via encryption and RBAC), *Integrity* (data is tamper-proof via cryptographic hashes), and *Availability* (systems remain operational via redundancy and DDoS defense).',
        '**Penetration Testing & Ethical Hacking**: Authorized simulated cyberattacks to proactively identify and patch security vulnerabilities before malicious actors exploit them.',
        '**OWASP Top 10**: The industry standard benchmark of critical web application security risks (SQL Injections, Broken Authentication, Cross-Site Scripting XSS).',
      ],
      practicalApplication: 'Critical for safeguarding banking systems, personal data compliance (GDPR), national infrastructure, and enterprise networks.',
      relatedCourseIds: [5, 108, 113],
      suggestions: [
        'What is the CIA Triad in security?',
        'What are the most common web vulnerabilities (OWASP)?',
        'How does encryption protect my passwords?',
      ],
    },
    python: {
      title: 'Python Programming Masterclass',
      definition: '**Python** is an interpreted, high-level, dynamically typed programming language celebrated for its exceptional code readability, clean syntax, and comprehensive standard library.',
      coreConcepts: [
        '**Readable Syntax**: Minimalist boilerplate code that emphasizes programmer productivity and clear expressive logic.',
        '**Multi-Paradigm Support**: Seamlessly supports Object-Oriented Programming (OOP), Procedural coding, and Functional programming paradigms.',
        '**Vast Ecosystem**: The undeniable reference language for Data Science (*Pandas*, *NumPy*), Artificial Intelligence (*PyTorch*, *TensorFlow*), and high-performance Web APIs (*FastAPI*, *Django*).',
      ],
      practicalApplication: 'From automation scripts and data analysis to building production-grade machine learning models and web backends.',
      relatedCourseIds: [2, 4],
      suggestions: [
        'Why is Python so popular in Artificial Intelligence?',
        'What are the best beginner exercises in Python?',
        'Show beginner-friendly courses',
      ],
    },
    web_development: {
      title: 'Full-Stack Web Development (React & Node.js)',
      definition: '**Web Development** spans client-side interface engineering (**Frontend**) and server-side logic, routing, and data persistence (**Backend**).',
      coreConcepts: [
        '**Frontend Engineering**: Crafted with HTML5, CSS3, JavaScript, and modern component frameworks like **React**. Manages reactive UI states, virtual DOM rendering, and responsive design.',
        '**Backend Architecture**: Server runtimes like **Node.js** and NestJS that handle business logic, JWT authentication, and RESTful API endpoints.',
        '**HTTP Protocols & REST APIs**: Stateless communication contracts passing JSON payloads between client and server.',
      ],
      practicalApplication: 'Powering every interactive platform on the web today, from social networks to SaaS products and e-learning platforms like Learnova.',
      relatedCourseIds: [8, 111, 20],
      suggestions: [
        'What is the difference between Frontend and Backend?',
        'What is a RESTful API and how does it work?',
        'How does React Virtual DOM boost performance?',
      ],
    },
    api: {
      title: 'APIs (Application Programming Interfaces) & REST Services',
      definition: 'An **API** (Application Programming Interface / Interface de Programmation d\'Application) is a formal computational contract, protocol, and set of definitions that enables distinct software applications to communicate and securely exchange data over network interfaces.',
      coreConcepts: [
        '**RESTful Architecture**: Uses standardized HTTP verbs: `GET` (retrieve resources), `POST` (create new resource), `PUT` / `PATCH` (update existing resource), and `DELETE` (remove resource).',
        '**Stateless Communication**: Every individual HTTP request contains all necessary authorization tokens (e.g. JWT) and parameters to be independently understood by the server.',
        '**JSON Payload Exchange**: The ubiquitous, lightweight, human-readable format used to send and receive structured data over the web.',
        '**HTTP Status Codes**: Standardized server response codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`).',
      ],
      practicalApplication: 'APIs form the digital glue connecting modern microservices, payment gateways (Stripe), mobile app backends, and third-party integrations across the web.',
      relatedCourseIds: [8, 111, 35],
      suggestions: [
        'What is the difference between REST and GraphQL APIs?',
        'How does JWT authentication work with APIs?',
        'Show beginner-friendly courses',
      ],
    },
    frontend: {
      title: 'Frontend Development (Interface Utilisateur & Web Client)',
      definition: '**Frontend Development** is the engineering of the visual, interactive, and responsive user-facing parts of web and mobile applications that users directly see and manipulate in their web browsers.',
      coreConcepts: [
        '**The Core Web Triad**: HTML5 for semantic page structure, CSS3 for responsive styling and layouts (Flexbox, Grid), and JavaScript for dynamic interactivity.',
        '**Reactive Component Frameworks**: Modern libraries such as **React** that decompose the user interface into reusable, state-managed components.',
        '**Responsive & Accessible Design**: Ensuring the interface performs flawlessly across mobile phones, tablets, and desktop workstations.',
      ],
      practicalApplication: 'Creates the user experiences behind e-commerce storefronts, web applications, dashboards, and platforms like Learnova.',
      relatedCourseIds: [8, 20, 105],
      suggestions: [
        'What is the difference between Frontend and Backend?',
        'How does the React Virtual DOM boost UI performance?',
        'Show beginner-friendly courses',
      ],
    },
    backend: {
      title: 'Backend Development (Serveurs, Logique Métier & Données)',
      definition: '**Backend Development** is the server-side architecture that powers digital platforms behind the scenes — orchestrating business logic, security authentication, API communication, and database transactions.',
      coreConcepts: [
        '**Server Execution Runtimes**: Node.js, Python (FastAPI/Django), Java (Spring Boot), Go, or C# (.NET).',
        '**Data Persistence**: Communicating with Relational Databases (*PostgreSQL*, *MySQL*) or NoSQL databases via Object-Relational Mappers (ORMs) like Prisma.',
        '**Security & Authentication**: Password hashing using bcrypt, stateless JSON Web Tokens (JWT), role-based authorization (RBAC), and protection against vulnerabilities (SQL Injection, CSRF).',
      ],
      practicalApplication: 'Processes user payments, secures identity credentials, computes complex algorithms, and serves reliable data to frontend clients.',
      relatedCourseIds: [8, 3, 111],
      suggestions: [
        'What is the difference between Frontend and Backend?',
        'What is an ORM in backend development?',
        'Show beginner-friendly courses',
      ],
    },
    algorithm: {
      title: 'Algorithms & Data Structures (Algorithmique & Structures de Données)',
      definition: 'An **Algorithm** is an unambiguous, finite sequence of computational steps or instructions designed to solve a well-defined mathematical or practical problem in finite time.',
      coreConcepts: [
        '**Big-O Notation**: Mathematical framework to analyze time and memory complexity as input size scales ($O(1)$, $O(\\log n)$, $O(n)$, $O(n \\log n)$, $O(n^2)$).',
        '**Core Data Structures**: Arrays, Linked Lists, Hash Tables, Stacks, Queues, Binary Trees, and Graphs.',
        '**Problem-Solving Paradigms**: Recursion, Divide & Conquer, Greedy algorithms, and Dynamic Programming.',
      ],
      practicalApplication: 'Drives search engine ranking algorithms, route optimization in GPS navigation, financial risk calculation, and high-frequency trading.',
      relatedCourseIds: [2, 35],
      suggestions: [
        'What is Big-O notation in computer science?',
        'What is the difference between an Array and a Linked List?',
        'Show beginner-friendly courses',
      ],
    },
    network: {
      title: 'Computer Networking & Protocols (Réseaux Informatiques)',
      definition: '**Computer Networking** is the interconnected infrastructure of physical and virtual computing devices that exchange data and share shared resources over standardized communication protocols.',
      coreConcepts: [
        '**The OSI & TCP/IP Stack**: The standard layered communication model defining data transmission from physical links up to application protocols (HTTP, HTTPS, SSH, FTP).',
        '**IP Addressing & Subnets**: IPv4 and IPv6 logical addressing systems routing packets across the global Internet.',
        '**DNS & Routing**: Translating human-friendly domain names into IP addresses, and routers determining the optimal packet transmission path.',
      ],
      practicalApplication: 'Enables global web connectivity, secure corporate VPNs, cloud communications, and low-latency streaming services.',
      relatedCourseIds: [5, 112],
      suggestions: [
        'What is the difference between TCP and UDP?',
        'How does DNS resolution work?',
        'Show beginner-friendly courses',
      ],
    },
    devops: {
      title: 'DevOps, Containers & Kubernetes',
      definition: '**DevOps** unites software development (Dev) and IT operations (Ops) through automated workflows, continuous integration, and containerized deployment.',
      coreConcepts: [
        '**Containers (Docker)**: Lightweight, isolated software packages that bundle code and all its system dependencies, ensuring deterministic execution across any environment.',
        '**Container Orchestration (Kubernetes)**: Automated scaling, self-healing, rolling updates, and cluster management for distributed container fleets.',
        '**CI/CD Pipelines**: Automated test execution and zero-downtime deployment pipelines upon every git push.',
      ],
      practicalApplication: 'Accelerates software release cycles from months to minutes while drastically reducing production bugs and server downtime.',
      relatedCourseIds: [6, 7],
      suggestions: [
        'What is the difference between a Virtual Machine and a Docker container?',
        'What is a CI/CD pipeline?',
        'Show beginner-friendly courses',
      ],
    },
    blockchain: {
      title: 'Blockchain & Smart Contracts',
      definition: '**Blockchain** is a cryptographically secured, decentralized, and immutable distributed ledger distributed across peer-to-peer computer networks.',
      coreConcepts: [
        '**Consensus Mechanisms**: Proof-of-Work (PoW) and Proof-of-Stake (PoS) algorithms ensuring network participants agree on ledger state without a central authority.',
        '**Smart Contracts**: Self-executing digital contracts with deterministic business rules permanently deployed on-chain (e.g., Solidity on Ethereum).',
        '**Immutability & Cryptographic Hashing**: Block chains linked via SHA-256 / Keccak hashes where modifying historical records is computationally infeasible.',
      ],
      practicalApplication: 'Enables trustless decentralized finance (DeFi), cryptographic asset ownership (NFTs), transparent supply chains, and tamper-proof verification registries.',
      relatedCourseIds: [106],
      suggestions: [
        'What is a Smart Contract?',
        'How does blockchain guarantee immutability?',
        'Show beginner-friendly courses',
      ],
    },
  };

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async processMessage(dto: ChatQueryDto, userId?: number): Promise<ChatbotResponse> {
    const rawMessage = dto.message.trim();
    const lowerMessage = rawMessage.toLowerCase();
    const normalized = this.normalizeQuery(lowerMessage);

    // Identify if the query is a Definitional / Conceptual question ("what is X", "c quoi X", "explain X")
    const isDefinitionalQuery =
      /\b(what is|what are|what does|explain|definition|tell me about|how does|how do|c quoi|c'est quoi|qu'est ce que|qu'est-ce que|explique|definition de)\b/i.test(
        lowerMessage,
      ) || /\b(what is|explain|definition)\b/i.test(normalized);

    // 1. Check Platform Navigation / Certification / Exam Mode Intents
    const platformAnswer = this.detectPlatformNavigation(lowerMessage, normalized);
    if (platformAnswer) {
      return platformAnswer;
    }

    // 2. Check Level-based Course Requests ("Show beginner-friendly courses", "cours débutant", etc.)
    const levelAnswer = await this.handleLevelCourseQuery(lowerMessage, normalized);
    if (levelAnswer) {
      return levelAnswer;
    }

    // 3. Check Deep Pedagogical Concept Match ("what is data", "c quoi database", "what is machine learning", etc.)
    const conceptAnswer = await this.handlePedagogicalConceptQuery(normalized, lowerMessage);
    if (conceptAnswer) {
      return conceptAnswer;
    }

    // 4. If query is a Definitional Query but not in hardcoded dictionary, build a smart pedagogical explanation
    if (isDefinitionalQuery) {
      const dynamicDefAnswer = await this.handleDynamicDefinitionalQuery(rawMessage, lowerMessage, normalized);
      if (dynamicDefAnswer) {
        return dynamicDefAnswer;
      }
    }

    // 5. Check Contextual Query if user is currently studying inside a Course or Session
    if (dto.courseId) {
      const courseAnswer = await this.handleCourseContextualQuery(dto.courseId, dto.sessionId, lowerMessage, rawMessage);
      if (courseAnswer) {
        return courseAnswer;
      }
    }

    // 6. Search Course Catalog ONLY if user didn't ask a pure definitional question
    if (!isDefinitionalQuery) {
      const catalogAnswer = await this.searchCourseCatalog(rawMessage, lowerMessage, normalized);
      if (catalogAnswer) {
        return catalogAnswer;
      }
    }

    // 7. Search Pedagogical Notes across Video Lectures (RAG fallback)
    const pedagogicalAnswer = await this.searchPedagogicalNotes(rawMessage, lowerMessage);
    if (pedagogicalAnswer) {
      return pedagogicalAnswer;
    }

    // 8. Intelligent Contextual Follow-up or Guided Menu (Never leave user stranded)
    return this.getHelpfulGuidedFallback(rawMessage);
  }

  /**
   * Normalizes multilingual inputs (French + English), common slang/phonetics, and tech typos
   */
  private normalizeQuery(lower: string): string {
    let text = lower
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[?.,!;:]/g, ' ');

    // Normalize common French question prefixes
    text = text.replace(/\b(c\s+quoi|c'est\s+quoi|cest\s+quoi|keske|qu'est\s+ce\s+que|qu'est-ce\s+que|quest\s+ce\s+que)\b/g, 'what is');
    text = text.replace(/\b(explique|expliquez|peux\s+tu\s+m'expliquer|peux\s+tu\s+mexpliquer|aide\s+moi\s+a\s+comprendre)\b/g, 'explain');
    text = text.replace(/\b(montre\s+moi|donne\s+moi|affiche|liste)\b/g, 'show');
    text = text.replace(/\b(cours|formations|formation)\b/g, 'courses');
    text = text.replace(/\b(debutant|débutant|debutants|débutants|commencer|initiation)\b/g, 'beginner');
    text = text.replace(/\b(intermediaire|intermédiaire)\b/g, 'intermediate');
    text = text.replace(/\b(avance|avancé|expert)\b/g, 'advanced');

    // Correct common technological typos and synonyms
    text = text.replace(/\b(la\s+data|les\s+donnees|les\s+données|donnees|données)\b/g, 'data');
    text = text.replace(/\b(databse|databse|bdd|base\s+de\s+donnees|base\s+de\s+donnee|db)\b/g, 'database');
    text = text.replace(/\b(ia|intelligence\s+artificielle)\b/g, 'artificial_intelligence');
    text = text.replace(/\b(ml|machine\s+learning)\b/g, 'machine_learning');
    text = text.replace(/\b(dl|deep\s+learning)\b/g, 'deep_learning');
    text = text.replace(/\b(pyton|phyton)\b/g, 'python');
    text = text.replace(/\b(cybersecurite|cybersecurité|securite|sécurité|hacking)\b/g, 'cybersecurity');
    text = text.replace(/\b(cloud\s+computing|aws\s+cloud|azure\s+cloud)\b/g, 'cloud');
    text = text.replace(/\b(full\s+stack|front\s+end|back\s+end|reactjs)\b/g, 'web_development');
    text = text.replace(/\b(k8s|conteneur|conteneurs)\b/g, 'devops');
    text = text.replace(/\b(powerbi|data\s+analysis)\b/g, 'data_analytics');
    text = text.replace(/\b(data\s+science|science\s+des\s+donnees)\b/g, 'data_science');
    text = text.replace(/\b(reseau|reseaux|networking)\b/g, 'network');
    text = text.replace(/\b(algo|algorithme)\b/g, 'algorithm');

    return text.trim();
  }

  /**
   * Handles level-based course discovery queries (e.g. "Show beginner-friendly courses")
   */
  private async handleLevelCourseQuery(lower: string, normalized: string): Promise<ChatbotResponse | null> {
    const isBeginner = /\b(beginner|debutant|starter|intro|friendly|first course)\b/.test(normalized);
    const isIntermediate = /\b(intermediate|intermediaire|medium)\b/.test(normalized);
    const isAdvanced = /\b(advanced|avance|expert|mastery)\b/.test(normalized);

    const isCourseIntent = /\b(course|courses|formation|show|recommend|trouve|chercher|suggestion)\b/.test(normalized);

    if (!isCourseIntent && !isBeginner && !isIntermediate && !isAdvanced) {
      return null;
    }

    let targetLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null = null;
    let levelLabel = '';

    if (isBeginner) {
      targetLevel = 'BEGINNER';
      levelLabel = 'Beginner-Friendly';
    } else if (isIntermediate) {
      targetLevel = 'INTERMEDIATE';
      levelLabel = 'Intermediate';
    } else if (isAdvanced) {
      targetLevel = 'ADVANCED';
      levelLabel = 'Advanced';
    }

    if (!targetLevel) return null;

    const courses = await this.prisma.client.course.findMany({
      where: { level: targetLevel },
      select: {
        id: true,
        title: true,
        description: true,
        domain: true,
        level: true,
        price: true,
        isPaid: true,
      },
      take: 4,
      orderBy: { id: 'asc' },
    });

    if (courses.length === 0) return null;

    const courseList = courses
      .map(c => `- **[${c.title}](/courses/${c.id})** (${c.domain.replace(/_/g, ' ')}) : ${c.description.substring(0, 115)}...`)
      .join('\n');

    return {
      answer: `Here are our top recommended **${levelLabel}** courses designed to get you started with practical skills and no friction:\n\n` +
        `${courseList}\n\n` +
        `All these courses feature structured video sessions, lecture study guides, and hands-on practice quizzes.`,
      intent: 'recommendation',
      confidence: 0.95,
      actions: courses.map(c => ({
        label: c.title.length > 28 ? c.title.substring(0, 25) + '...' : c.title,
        url: `/courses/${c.id}`,
        type: 'course',
      })),
      suggestions: [
        'How does certification work for these courses?',
        targetLevel === 'BEGINNER' ? 'Show intermediate courses' : 'Show beginner-friendly courses',
        'What are the rules of the exam mode?',
      ],
    };
  }

  /**
   * Handles core technical concepts with university-grade explanations and course links
   */
  private async handlePedagogicalConceptQuery(normalized: string, lower: string): Promise<ChatbotResponse | null> {
    let matchedKey: string | null = null;

    // Direct exact or prioritized topic matches
    if (/\b(data_science)\b/.test(normalized)) {
      matchedKey = 'data_science';
    } else if (/\b(data_analytics|power_bi)\b/.test(normalized)) {
      matchedKey = 'data_analytics';
    } else if (/\b(database|sql|nosql|postgres|mysql|mongodb)\b/.test(normalized)) {
      matchedKey = 'database';
    } else if (/\b(data)\b/.test(normalized)) {
      matchedKey = 'data';
    } else if (/\b(artificial_intelligence|machine_learning|deep_learning|ai|neural)\b/.test(normalized)) {
      matchedKey = 'artificial_intelligence';
    } else if (/\b(cloud|aws|azure|gcp)\b/.test(normalized)) {
      matchedKey = 'cloud_computing';
    } else if (/\b(cybersecurity|security|owasp|hacking|cipher)\b/.test(normalized)) {
      matchedKey = 'cybersecurity';
    } else if (/\b(python)\b/.test(normalized)) {
      matchedKey = 'python';
    } else if (/\b(api|rest|restful)\b/.test(normalized)) {
      matchedKey = 'api';
    } else if (/\b(frontend|front_end|react)\b/.test(normalized)) {
      matchedKey = 'frontend';
    } else if (/\b(backend|back_end|nodejs)\b/.test(normalized)) {
      matchedKey = 'backend';
    } else if (/\b(web_development|javascript|node)\b/.test(normalized)) {
      matchedKey = 'web_development';
    } else if (/\b(devops|docker|kubernetes)\b/.test(normalized)) {
      matchedKey = 'devops';
    } else if (/\b(algorithm|data_structures)\b/.test(normalized)) {
      matchedKey = 'algorithm';
    } else if (/\b(network|networking|tcp|ip|dns)\b/.test(normalized)) {
      matchedKey = 'network';
    } else if (/\b(blockchain|smart_contracts)\b/.test(normalized)) {
      matchedKey = 'blockchain';
    }

    if (!matchedKey) return null;

    const topic = this.pedagogicalKnowledge[matchedKey];
    if (!topic) return null;

    // Fetch related real courses from database
    const relatedCourses = await this.prisma.client.course.findMany({
      where: { id: { in: topic.relatedCourseIds } },
      select: { id: true, title: true, domain: true, level: true, description: true },
    });

    const coursesMarkdown = relatedCourses
      .map(c => `- **[${c.title}](/courses/${c.id})** (${c.level}) : ${c.description.substring(0, 95)}...`)
      .join('\n');

    const formattedAnswer =
      `### ${topic.title}\n\n` +
      `${topic.definition}\n\n` +
      `**Core Architectural Concepts:**\n` +
      topic.coreConcepts.map(c => `- ${c}`).join('\n') + `\n\n` +
      `**Real-World Application:**\n${topic.practicalApplication}\n\n` +
      (relatedCourses.length > 0 ? `**Recommended Courses on Learnova:**\n${coursesMarkdown}\n` : '');

    return {
      answer: formattedAnswer,
      intent: 'pedagogical_concept',
      confidence: 0.95,
      actions: relatedCourses.map(c => ({
        label: `Start "${c.title.length > 25 ? c.title.substring(0, 22) + '...' : c.title}"`,
        url: `/courses/${c.id}`,
        type: 'course',
      })),
      suggestions: topic.suggestions,
    };
  }

  /**
   * Dynamically constructs a pedagogical explanation for any term not in the hardcoded list
   */
  private async handleDynamicDefinitionalQuery(
    rawMessage: string,
    lowerMessage: string,
    normalized: string,
  ): Promise<ChatbotResponse | null> {
    // Strip prefixes like "what is", "explain", "c quoi"
    const cleaned = normalized
      .replace(/\b(what is|what are|explain|definition of|definition|tell me about|how does|how do|c quoi|c'est quoi|qu'est ce que|qu'est-ce que|about)\b/g, '')
      .replace(/\b(a|an|the|le|la|les|un|une|de|du|des)\b/g, '')
      .trim();

    if (!cleaned || cleaned.length < 2) return null;

    // Search matching course
    const matchingCourse = await this.prisma.client.course.findFirst({
      where: {
        OR: [
          { title: { contains: cleaned, mode: 'insensitive' } },
          { domain: { contains: cleaned, mode: 'insensitive' } },
          { description: { contains: cleaned, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, description: true, domain: true, level: true },
    });

    if (!matchingCourse) return null;

    const answer =
      `### Understanding ${matchingCourse.title}\n\n` +
      `In modern education and industry, **${matchingCourse.title}** represents an essential area of study within **${matchingCourse.domain.replace(/_/g, ' ')}**.\n\n` +
      `**Overview & Academic Scope:**\n` +
      `${matchingCourse.description}\n\n` +
      `**Practical Mastery:**\n` +
      `This curriculum covers theoretical foundations, structured methodologies, and hands-on case studies designed to build verified competence at the **${matchingCourse.level}** level.\n\n` +
      `**Related Course on Learnova:**\n` +
      `- **[${matchingCourse.title}](/courses/${matchingCourse.id})** (${matchingCourse.level}) : Explore the full video curriculum and study guides.`;

    return {
      answer,
      intent: 'pedagogical_concept',
      confidence: 0.9,
      actions: [
        { label: `Explore "${matchingCourse.title.substring(0, 24)}..."`, url: `/courses/${matchingCourse.id}`, type: 'course' },
        { label: 'Browse Catalog', url: '/courses', type: 'link' },
      ],
      suggestions: [
        'What are the prerequisites for this course?',
        'How can I get a verifiable certificate?',
        'Show beginner-friendly courses',
      ],
    };
  }

  /**
   * Platform rules, Certification with QR Code, Exam Mode with timer, Streaks and Badges
   */
  private detectPlatformNavigation(query: string, normalized: string): ChatbotResponse | null {
    // Certificats & QR Code
    if (
      query.includes('certificat') ||
      query.includes('certificate') ||
      query.includes('qr code') ||
      query.includes('attestation') ||
      query.includes('diplome') ||
      query.includes('how can i get a verifiable certificate')
    ) {
      return {
        answer: `On **Learnova**, obtaining an official certificate meets rigorous standards:\n\n` +
          `1. **Complete All Sessions**: You must validate all videos and study notes in the course curriculum.\n` +
          `2. **Pass the Final Certification Exam**: Achieve a minimum score of **70%** on the 40-question comprehensive assessment.\n` +
          `3. **Authenticity & QR Code**: Every certificate features a cryptographic identifier and an official **scannable QR code** that links directly to Learnova's public online verification registry.`,
        intent: 'platform_navigation',
        confidence: 0.98,
        actions: [
          { label: 'My Certificates', url: '/certificates', type: 'certificate' },
          { label: 'Explore Courses', url: '/courses', type: 'link' },
        ],
        suggestions: [
          'What are the rules of the exam mode?',
          'Show beginner-friendly courses',
          'How does the gamification system work?',
        ],
      };
    }

    // Mode Examen & Chronomètre
    if (
      query.includes('examen') ||
      query.includes('exam') ||
      query.includes('chronometre') ||
      query.includes('timer') ||
      query.includes('40 question') ||
      query.includes('seuil') ||
      query.includes('pass score')
    ) {
      return {
        answer: `Learnova's **Timed Exam Mode** simulates official professional certification conditions:\n\n` +
          `- **40-Question Final Assessment**: Rigorously covers the entire course curriculum.\n` +
          `- **Active Countdown Timer**: Prominently displayed during the exam to simulate real exam constraints.\n` +
          `- **70% Passing Threshold**: Requires at least 28 correct answers out of 40 to pass.\n` +
          `- **Instant Evaluation & Breakdown**: Complete performance report generated immediately upon submission.`,
        intent: 'platform_navigation',
        confidence: 0.98,
        actions: [
          { label: 'Browse Courses', url: '/courses', type: 'link' },
          { label: 'View Dashboard', url: '/dashboard', type: 'link' },
        ],
        suggestions: [
          'How can I get a verifiable certificate?',
          'Which courses are available in Artificial Intelligence?',
          'Show beginner-friendly courses',
        ],
      };
    }

    // Gamification, Streaks, Badges, Points (Use word boundary regex to avoid matching 'explain' on 'xp')
    if (
      /\b(point|points|badge|badges|streak|streaks|niveau|niveaux|level|levels|gamification|xp)\b/.test(
        normalized,
      ) ||
      /\b(point|points|badge|badges|streak|streaks|niveau|niveaux|level|levels|gamification|xp)\b/.test(
        query,
      )
    ) {
      return {
        answer: `Learnova's **Gamification System** promotes study consistency and active mastery:\n\n` +
          `- **Experience Points (XP)**: Earned for completing video lessons, reading study guides, and passing quizzes.\n` +
          `- **Daily Learning Streaks**: Encourages consecutive study days to maintain learning momentum.\n` +
          `- **35 Exclusive Badges**: Tiered from Bronze, Silver, Gold, Platinum to Diamond (e.g., *Bronze Scholar*, *Quiz Master*, *Fast Learner*).\n` +
          `- **Honor Seals**: Verified credential badges highlighted on your public profile.`,
        intent: 'platform_navigation',
        confidence: 0.98,
        actions: [
          { label: 'View Profile & Badges', url: '/profile', type: 'link' },
          { label: 'My Dashboard', url: '/dashboard', type: 'link' },
        ],
        suggestions: [
          'How to level up quickly?',
          'Show beginner-friendly courses',
          'What are the rules of the exam mode?',
        ],
      };
    }

    return null;
  }

  /**
   * Precision Catalog Search by Domain or Targeted Keyword
   */
  private async searchCourseCatalog(
    rawMessage: string,
    lowerMessage: string,
    normalized: string,
  ): Promise<ChatbotResponse | null> {
    // 1. Specific AI / Machine Learning query
    if (
      /\b(artificial intelligence|artificial_intelligence|ai courses|machine learning|deep learning)\b/.test(
        normalized,
      )
    ) {
      const aiCourses = await this.prisma.client.course.findMany({
        where: {
          id: { in: [25, 4, 2] },
        },
        select: { id: true, title: true, description: true, domain: true, level: true },
      });

      const list = aiCourses
        .map(c => `- **[${c.title}](/courses/${c.id})** (${c.level}, ${c.domain.replace('_', ' ')}) : ${c.description.substring(0, 110)}...`)
        .join('\n');

      return {
        answer: `Here are our flagship **Artificial Intelligence & Machine Learning** courses:\n\n` +
          `${list}\n\n` +
          `Would you like to start with foundations or dive directly into the deep learning masterclass?`,
        intent: 'course_query',
        confidence: 0.95,
        actions: aiCourses.map(c => ({
          label: c.title.length > 28 ? c.title.substring(0, 25) + '...' : c.title,
          url: `/courses/${c.id}`,
          type: 'course',
        })),
        suggestions: [
          'What is the difference between AI and Machine Learning?',
          'Show beginner-friendly courses',
          'How does certification work?',
        ],
      };
    }

    // 2. Generic Keyword Course Search across Title and Domain
    const keywords = this.extractSignificantKeywords(normalized);
    if (keywords.length === 0) return null;

    const matchedCourses = await this.prisma.client.course.findMany({
      where: {
        OR: keywords.map(kw => ({
          OR: [
            { title: { contains: kw, mode: 'insensitive' } },
            { domain: { contains: kw, mode: 'insensitive' } },
          ],
        })),
      },
      select: { id: true, title: true, description: true, domain: true, level: true },
      take: 4,
    });

    if (matchedCourses.length > 0) {
      const list = matchedCourses
        .map(c => `- **[${c.title}](/courses/${c.id})** (${c.level}, ${c.domain.replace('_', ' ')}) : ${c.description.substring(0, 100)}...`)
        .join('\n');

      return {
        answer: `I found **${matchedCourses.length} course(s)** matching your query in the Learnova catalog:\n\n` +
          `${list}\n\n` +
          `Click any course to explore the syllabus, lecture videos, and practice quizzes.`,
        intent: 'course_query',
        confidence: 0.88,
        actions: matchedCourses.map(c => ({
          label: c.title.length > 28 ? c.title.substring(0, 25) + '...' : c.title,
          url: `/courses/${c.id}`,
          type: 'course',
        })),
        suggestions: [
          'Show beginner-friendly courses',
          'How can I get a verifiable certificate?',
          'What are the rules of the exam mode?',
        ],
      };
    }

    return null;
  }

  /**
   * Search across video lecture notes and descriptions (RAG)
   */
  private async searchPedagogicalNotes(rawMessage: string, lowerMessage: string): Promise<ChatbotResponse | null> {
    const keywords = this.extractSignificantKeywords(lowerMessage);
    if (keywords.length === 0) return null;

    // Use OR instead of strict AND to avoid dropping viable lecture matches
    const matchingVideos = await this.prisma.client.video.findMany({
      where: {
        OR: keywords.slice(0, 3).map(kw => ({
          OR: [
            { content: { contains: kw, mode: 'insensitive' } },
            { title: { contains: kw, mode: 'insensitive' } },
          ],
        })),
      },
      include: {
        session: {
          include: {
            course: { select: { id: true, title: true, domain: true, level: true } },
          },
        },
      },
      take: 2,
    });

    if (matchingVideos.length > 0) {
      const bestMatch = matchingVideos[0];
      const excerpt = bestMatch.content ? this.extractRelevantExcerpt(bestMatch.content, lowerMessage) : bestMatch.description;

      return {
        answer: `Here is the explanation from our course **"${bestMatch.session.course.title}"** regarding your question:\n\n` +
          `**Module: ${bestMatch.session.title}**\n` +
          `**Lecture: ${bestMatch.title}**\n\n` +
          `${excerpt}\n\n` +
          `You can view the full video lesson and interactive notes directly on the platform.`,
        intent: 'pedagogical_concept',
        confidence: 0.88,
        sources: matchingVideos.map(v => ({
          courseTitle: v.session.course.title,
          sessionTitle: v.session.title,
          videoTitle: v.title,
          courseId: v.session.course.id,
        })),
        actions: [
          { label: `Open "${bestMatch.session.course.title}"`, url: `/courses/${bestMatch.session.course.id}/learn`, type: 'course' },
        ],
        suggestions: [
          'Show beginner-friendly courses',
          'How does the final certification exam work?',
        ],
      };
    }

    return null;
  }

  /**
   * Contextual query inside a specific course/session
   */
  private async handleCourseContextualQuery(
    courseId: number,
    sessionId: number | undefined,
    lowerMessage: string,
    rawMessage: string,
  ): Promise<ChatbotResponse | null> {
    const course = await this.prisma.client.course.findUnique({
      where: { id: courseId },
      include: {
        sessions: {
          include: {
            videos: { select: { id: true, title: true, content: true, description: true } },
          },
          orderBy: { orderNumber: 'asc' },
        },
      },
    });

    if (!course) return null;

    if (sessionId) {
      const activeSession = course.sessions.find(s => s.id === sessionId);
      if (activeSession) {
        for (const video of activeSession.videos) {
          if (video.content && this.calculateOverlap(lowerMessage, video.content.toLowerCase()) > 0.12) {
            const excerpt = this.extractRelevantExcerpt(video.content, lowerMessage);
            return {
              answer: `In session **"${activeSession.title}"** (Lecture: *${video.title}*) :\n\n${excerpt}\n\n` +
                `*This concept is part of your current study module.*`,
              intent: 'pedagogical_concept',
              confidence: 0.92,
              sources: [{
                courseTitle: course.title,
                sessionTitle: activeSession.title,
                videoTitle: video.title,
                courseId: course.id,
              }],
              actions: [
                { label: 'Resume Lecture', url: `/courses/${course.id}/learn?session=${activeSession.id}&video=${video.id}`, type: 'course' },
              ],
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Helpful Guided Menu when query is too ambiguous or short
   */
  private getHelpfulGuidedFallback(rawMessage: string): ChatbotResponse {
    return {
      answer: `I am your **AI Pedagogical Virtual Tutor** on Learnova.\n\n` +
        `Could you specify which technical concept or training you would like to explore? Here are the most popular topics asked by our learners:\n\n` +
        `- **Computer Science & AI**: Python, Data & Databases, Machine Learning, Cloud AWS, Cybersecurity.\n` +
        `- **Platform Assistance**: Timed Exam mode (40 questions, 70% pass), QR Code Certificates, Badges & Points.\n` +
        `- **Personalized Navigation**: Discovering beginner, intermediate, or advanced courses.`,
      intent: 'general',
      confidence: 0.8,
      suggestions: [
        'What is data?',
        'What is a Database & SQL?',
        'What is Artificial Intelligence?',
        'Show beginner-friendly courses',
      ],
      actions: [
        { label: 'Explore All 108 Courses', url: '/courses', type: 'link' },
        { label: 'My Dashboard', url: '/dashboard', type: 'link' },
      ],
    };
  }

  private extractSignificantKeywords(text: string): string[] {
    const stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'ce', 'cet', 'cette', 'ces',
      'de', 'du', 'au', 'aux', 'en', 'dans', 'sur', 'sous', 'avec', 'par',
      'pour', 'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'que', 'qui',
      'quoi', 'comment', 'pourquoi', 'quand', 'est', 'sont', 'suis', 'es',
      'avoir', 'faire', 'plateforme', 'bonjour', 'salut', 'merci', 'svp', 'aide',
      'peux', 'tu', 'je', 'nous', 'vous', 'the', 'a', 'an', 'and', 'or', 'in',
      'on', 'at', 'to', 'for', 'is', 'are', 'what', 'it', 'me', 'my', 'your',
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9àâäéèêëîïôöùûüç\s_-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }

  private calculateOverlap(query: string, text: string): number {
    const qTokens = this.extractSignificantKeywords(query);
    if (qTokens.length === 0) return 0;
    const matches = qTokens.filter(t => text.includes(t)).length;
    return matches / qTokens.length;
  }

  private extractRelevantExcerpt(content: string, query: string): string {
    const tokens = this.extractSignificantKeywords(query);
    const paragraphs = content.split(/\n\n+/);

    let bestPara = paragraphs[0] || '';
    let maxMatch = -1;

    for (const p of paragraphs) {
      const lower = p.toLowerCase();
      const count = tokens.filter(t => lower.includes(t)).length;
      if (count > maxMatch) {
        maxMatch = count;
        bestPara = p;
      }
    }

    const cleaned = bestPara.replace(/^###?\s+/gm, '').trim();
    return cleaned.length > 350 ? cleaned.substring(0, 347) + '...' : cleaned;
  }
}
