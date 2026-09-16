const https = require('https');

// Candidates for domains needing more verified videos
const CANDIDATES = [
  // Finance & Economics
  'p7HKvqRI_Bo', // Crash Course Economics #1
  '3ez10ADR_gM', // Crash Course Economics: Supply & Demand
  '1oCdpxq3B10', // Khan Academy Intro to Economics
  'G8A6G5Jv0Y4', // Financial Markets Yale
  'fTz0b62bSyg', // Accounting Basics Explained
  'm1aWJ_L-rC8', // Corporate Finance Overview
  'Yyhn8rVfCeg', // Stock Market for Beginners
  
  // Marketing & Sales
  'nU-IIXBWlS4', // Digital Marketing Course Simplilearn
  'sBn_2XqWJlo', // SEO Tutorial for Beginners
  'ZTaL_Z7Zc6c', // Copywriting Tutorial
  'q4P2q8B7C9k', // Social Media Marketing Strategy
  'u9R51aJ_x-E', // Sales Strategies for Beginners

  // Law & Legal
  'mXw-hEB263k', // CrashCourse US Government & Politics #1
  'lrk4oY7v5_o', // CrashCourse Structure of the Court System
  'k_7xN0k8P9Q', // Contract Law Overview
  'BAh8U3j6F-0', // Legal Systems & Criminal Law
  '0qF2pS4pA0k', // Intellectual Property Basics

  // Music & Arts
  'rgaTLrZGlk0', // Music Theory in 16 Minutes
  'v7n4m1k8P9Q', // Guitar Lesson
  'k9f1s8m4j2Q', // Acoustic Guitar
  '73h6c2x81_M', // Sound Design & Synth Basics
  'H14bBuluwB8', // How to Play Guitar - Stage 1
  'F1o_9hU8_3k', // Watercolor Techniques for Beginners

  // Health, Wellness & Psychology
  'vo4pMVb0R6M', // CrashCourse Psychology #1
  '14q21Pz8A74', // The Chemical Mind Crash Course Psych
  'hY4p1u7a2bM', // Sensation and Perception Psych
  'E0A83A92W98', // The Nervous System Crash Course
  'wWnfJ0-xXRE', // Fitness & Exercise Science

  // Sciences (Physics, Chemistry)
  'apNK_m9i1_A', // Crash Course Physics
  'IHZwWFHWa-w', // 3Blue1Brown
  'kKKM8Y-u7ds', // Crash Course Physics #2
  '7DjsD73MYLQ', // Crash Course Chemistry
  'bka20Q9SX6s', // Crash Course Chemistry #2
  'FSyAehMdpyI', // Periodic Table Crash Course
  'wW1L8GqC3_M', // Newton's Laws
  'ZM8ECpB9658', // Crash Course Physics: Motion

  // Lifestyle, Cooking, Baking, Woodworking
  'fJ8hU-sUuV8', // Gordon Ramsay Knife Skills
  'm9j4k1s8P7Q', // Sourdough Baking
  '1W3qU3mC6M4', // Woodworking Basics for Beginners
  'OCSbzArwB10', // GothamChess
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
            resolve({ id, ok: false, status: 200 });
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
  console.log(`Testing candidates...`);
  const verified = [];
  for (const id of CANDIDATES) {
    const res = await checkOEmbed(id);
    if (res.ok) {
      verified.push(res);
      console.log(`✅ [${res.author}] ${res.id}: "${res.title}"`);
    } else {
      console.log(`❌ ${res.id} (${res.status})`);
    }
  }
  console.log(`\nVerified: ${verified.length}`);
  console.log(JSON.stringify(verified, null, 2));
}

run();
