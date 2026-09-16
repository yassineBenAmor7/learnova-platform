const { prisma, closePrismaClient } = require('./prisma-client');
const https = require('https');

function checkOembed(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve({ ok: true, status: 200, title: parsed.title, author: parsed.author_name });
          } catch {
            resolve({ ok: true, status: 200, title: 'Unknown', author: '' });
          }
        } else {
          resolve({ ok: false, status: res.statusCode });
        }
      });
    }).on('error', () => resolve({ ok: false, status: 500 }));
  });
}

async function audit() {
  console.log('🔍 AUDIT EXHAUSTIF DES 568 VIDÉOS ET DES GUIDES D\'ÉTUDE...\n');

  const videos = await prisma.video.findMany({
    include: {
      session: {
        include: {
          course: {
            select: { id: true, title: true, domain: true }
          }
        }
      }
    },
    orderBy: { id: 'asc' }
  });

  console.log(`Total vidéos dans la base : ${videos.length}`);

  const urlMap = new Map();
  for (const v of videos) {
    if (!urlMap.has(v.url)) urlMap.set(v.url, []);
    urlMap.get(v.url).push(v);
  }

  console.log(`URLs uniques utilisées : ${urlMap.size}`);

  let validOembed = 0;
  let brokenOembed = 0;
  const brokenList = [];

  for (const [url, list] of urlMap.entries()) {
    const m = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!m) {
      brokenOembed++;
      brokenList.push({ url, reason: 'Malformed ID', count: list.length });
      continue;
    }
    const id = m[1];
    const res = await checkOembed(id);
    if (res.ok) {
      validOembed++;
    } else {
      brokenOembed++;
      brokenList.push({ url, id, status: res.status, count: list.length });
    }
  }

  console.log('\n📊 RÉSULTAT DU CONTRÔLE D\'INTÉGRATION YOUTUBE (oEmbed):');
  console.log(`  - URLs uniques valides (HTTP 200) : ${validOembed} / ${urlMap.size}`);
  console.log(`  - URLs en erreur (404 / 400 / restreintes) : ${brokenOembed}`);

  // Textual content audit
  let emptyContent = 0;
  let shortContent = 0;
  let richContent = 0;
  let totalLength = 0;
  let emptyDescriptions = 0;

  for (const v of videos) {
    if (!v.description || v.description.trim() === '') emptyDescriptions++;
    if (!v.content || v.content.trim() === '') emptyContent++;
    else if (v.content.length < 300) shortContent++;
    else {
      richContent++;
      totalLength += v.content.length;
    }
  }

  const avgLength = Math.round(totalLength / richContent);

  console.log('\n📝 RÉSULTAT DU CONTRÔLE DU CONTENU TEXTUEL (Lecture Notes & Description):');
  console.log(`  - Vidéos avec description détaillée : ${videos.length - emptyDescriptions} / ${videos.length}`);
  console.log(`  - Vidéos avec guide d'étude riche (> 300 caractères) : ${richContent} / ${videos.length}`);
  console.log(`  - Vidéos avec contenu court (< 300 caractères) : ${shortContent}`);
  console.log(`  - Vidéos sans contenu : ${emptyContent}`);
  console.log(`  - Longueur moyenne des notes de cours : ${avgLength} caractères par vidéo`);

  // Sample check
  const sample = videos[0];
  console.log('\n👀 ÉCHANTILLON DE VIDÉO (ID: ' + sample.id + '):');
  console.log(`  Cours : ${sample.session.course.title} (${sample.session.course.domain})`);
  console.log(`  Session : ${sample.session.title}`);
  console.log(`  Titre vidéo : ${sample.title}`);
  console.log(`  URL : ${sample.url}`);
  console.log(`  Description : ${sample.description.substring(0, 100)}...`);
  console.log(`  Notes Markdown (${sample.content.length} caractères) :\n${sample.content.substring(0, 350)}...\n`);
}

audit().catch(console.error).finally(() => closePrismaClient());
