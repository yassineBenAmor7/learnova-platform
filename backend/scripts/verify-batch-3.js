const https = require('https');

const BATCH_3 = [
  // Law
  'WwhP5_V6d3E', // Intro to Law
  '9qV9kO9eR4w', // Contract Law in 2 Minutes
  'GZ_iYxO8m_s', // Constitutional Law
  'U0h-U8_Wf4w', // Law & Justice
  'y7A5_P9tL-g', // Tort Law
  
  // Marketing & Sales
  '0c00Z8nN1t8', // Jordan Belfort Sales
  'K0rN9b8_o9w', // Sales Training
  '9s9f_L6K_4M', // Digital Marketing
  'B_8Q8X3r6K0', // SEO Tutorial
  'YyG9Y_l9k4w', // Content Marketing
  'q_m4P1s8K9Q', // Shopify Tutorial
  
  // Health & Nutrition
  '3ND3eH0p7bQ', // Nutrition Science
  '2i2qB4m4f8s', // Sleep Science Matthew Walker
  'bJ8V0f7m9kQ', // Exercise Physiology
  'W1w_B9e5K8M', // Mental Health
  'd4h9k4m1s8Q', // Injury Prevention

  // Cooking & Culinary
  '1_p4P1s8K9M', // French Mother Sauces
  'b8v_L4q9M2A', // Sourdough Bread
  'x0k4P1s8m7Q', // Woodworking Basics
  'q8P1s8m4k9A', // Wine Tasting Basics

  // Music & Arts
  'W9t_K1s8M4A', // Guitar Chords JustinGuitar
  'H14bBuluwB8', // TED
  'y_m8k4P1s7Q', // Film Scoring
  'z1P8a9s1k8g', // Watercolor
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
            resolve({ id, ok: false });
          }
        } else {
          resolve({ id, ok: false, status: res.statusCode });
        }
      });
    });
    req.on('error', () => resolve({ id, ok: false }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ id, ok: false }); });
  });
}

async function run() {
  const verified = [];
  for (const id of BATCH_3) {
    const res = await checkOEmbed(id);
    if (res.ok) {
      verified.push(res);
      console.log(`✅ [${res.author}] ${res.id}: "${res.title}"`);
    }
  }
  console.log('Verified:', verified.length);
}
run();
