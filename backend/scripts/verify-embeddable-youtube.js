const https = require('https');

// Candidate real YouTube videos from top educational channels
const CANDIDATES = [
  // Programming & Web & Tech
  'rfscVS0vtbw', // freeCodeCamp Python
  'PkZNo7MFNFg', // freeCodeCamp JS
  'w7ejDZ8SWv8', // Traversy React
  'Oe421EPjeBE', // Traversy Node
  'HXV3zeQKqGY', // Mosh SQL
  'ztHopE5Wnpc', // freeCodeCamp Database Design
  'M576WGiDBdQ', // freeCodeCamp Solidity
  'X48VuDVv0do', // TechWorld with Nana Kubernetes
  'qz0aGYrrlhU', // Mosh HTML
  '1Rs2ND1ryYc', // freeCodeCamp CSS
  'yfoY53QXEnI', // Traversy CSS
  'xk4_1vDrzzo', // Bro Code Java
  'bMknfKXIFA8', // freeCodeCamp React
  '7S_tz1z_5bA', // freeCodeCamp SQL
  'fBNz5xF-Kx4', // Node.js Express tutorial
  'eWRfhZUzrAc', // Python project
  'aircAruvnKk', // 3Blue1Brown Neural Networks
  'IHZwWFHWa-w', // 3Blue1Brown Gradient Descent
  'i_LwzRVP7bg', // 3Blue1Brown Backpropagation
  'k1ae0e8r5gU', // Python OOP
  '8pDqJVdNa44', // Dr. Raj Ramesh AI in 5 min
  'zOjov-2OZ0E', // JavaScript Crash Course
  'BCg4U1Fz3Qo', // TypeScript Tutorial
  'SqcY0GlETPk', // JavaScript Async Await
  'dGcsHMXbSOA', // React State Management

  // Business, Management & Agile
  '9TycLR0TqFA', // Uzility Scrum 7 mins
  'u4ZoJKF_VuA', // Simon Sinek Start With Why
  'b0Nq6f4k5aY', // Leadership & Management TEDx
  '7F26y0C7lRg', // Pitching Y Combinator
  'O5Rb5R9Y9O8', // Startup Funding Stages
  '9Bq2CV0s8UA', // Cap Tables Stanford
  '3J5DxGHc8G0', // Venture Capital 101
  'pQQ-1AGXkQY', // Khan Academy Balance Sheets
  'G7kAU2e2J4Q', // Khan Academy Cash Flow
  '1UxA6JzoMQk', // Microeconomics CrashCourse
  'hePBZf3e4Zk', // Market Equilibrium CrashCourse
  'sB_mZ2x8p7g', // Financial Ratios Khan Academy
  'fd7167a57F0', // Financial Modeling Excel
  'x3uBvO4o65k', // Real Estate Investing

  // Marketing & Sales
  'xsVT_-47C11', // Digital Marketing Google
  'G3e8cT6yC6Y', // SEO for Beginners
  '2ePf9rue1Ao', // Copywriting Masterclass
  'X1bMxJGvOc4', // Inbound Content Marketing
  'B7f5rT1v0M8', // Meta Ads Architecture
  'P8W5qX4mC4k', // Amazon FBA Beginner Guide
  'v64gT85r8Wk', // Shopify Tutorial
  'x1P8a9s1k8g', // E-Commerce Supply Chain
  '9b7C5x3v21A', // Conversion Optimization
  'grEKPMAYn8c', // Sales Outreach

  // Design & Creative
  'c9Wg6Cb_YlU', // freeCodeCamp UI UX Design Tutorial
  'JwZX5EvJ24Y', // Figma Tutorial for Beginners
  'YqQx75OPUQU', // Typography Hierarchy
  '_2LLXnUdUIc', // Color Theory
  'FTFaQWZBqQ8', // Design Systems Figma
  'm8j4k1s7P9Q', // Wireframing & Usability
  'b7m4k1s8j9Q', // Illustrator Vector Art
  'k9f1s8m4j2Q', // After Effects Motion Graphics

  // Communication & Languages
  'dEDcc0aCjaA', // Julian Treasure How to Speak TED
  'iG9CE55wbtY', // Active Listening Julian Treasure
  'c0KYU2j0TM4', // Body Language Amy Cuddy
  'eIho2S0ZahI', // Overcoming Speech Anxiety
  '_ZpkJvhX-wM', // Storytelling Structures
  'f7j9k4Q8m1v', // Business English Email

  // Sciences & Health
  '8m6hHRlKwxY', // CrashCourse Biology Molecules
  'QnQe0xW_JY4', // CrashCourse Biology ATP & Respiration
  '0rHUDWjR5gg', // CrashCourse Astronomy
  'Yocja_N5s1I', // CrashCourse World History Agricultural Revolution
  'zhL5DCizj5c', // CrashCourse Industrial Revolution
  'alJaltUmrGo', // CrashCourse Imperialism
  'apNK_m9i1_A', // CrashCourse Physics Motion
  '7DjsD73MYLQ', // CrashCourse Chemistry Periodic Table
  'xyQY8a-ng6g', // Human Nutrition Khan Academy
  'OCSbzArwB10', // GothamChess How to Play Chess
];

function checkOEmbed(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve({ id, ok: true, title: parsed.title, author: parsed.author_name });
          } catch(e) {
            resolve({ id, ok: false, status: 200, error: 'JSON parse error' });
          }
        } else {
          resolve({ id, ok: false, status: res.statusCode });
        }
      });
    });
    req.on('error', err => resolve({ id, ok: false, error: err.message }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ id, ok: false, status: 408 }); });
  });
}

async function run() {
  console.log(`Testing ${CANDIDATES.length} candidate video IDs via YouTube oEmbed API...`);
  const verified = [];
  const failed = [];

  for (const id of CANDIDATES) {
    const res = await checkOEmbed(id);
    if (res.ok) {
      verified.push(res);
      console.log(`✅ [${res.author}] ${res.id}: "${res.title}"`);
    } else {
      failed.push(res);
      console.log(`❌ ${res.id} failed (${res.status})`);
    }
  }

  console.log(`\nVerified 100% embeddable: ${verified.length} / ${CANDIDATES.length}`);
  console.log(JSON.stringify(verified, null, 2));
}

run();
