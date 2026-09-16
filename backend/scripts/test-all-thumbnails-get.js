const { prisma, closePrismaClient } = require('./prisma-client');

function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) return resolve({ ok: false, status: 0 });
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ ok: res.statusCode === 200, status: res.statusCode });
      res.resume(); // consume response
    });
    req.on('error', (err) => resolve({ ok: false, status: -1, error: err.message }));
    req.setTimeout(6000, () => {
      req.destroy();
      resolve({ ok: false, status: 408 });
    });
  });
}

async function main() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, domain: true, thumbnail: true },
    orderBy: { id: 'asc' }
  });

  console.log(`Checking ${courses.length} courses with full GET requests...`);
  const failed = [];

  for (const c of courses) {
    const res = await checkUrl(c.thumbnail);
    if (!res.ok) {
      failed.push({ id: c.id, title: c.title, domain: c.domain, thumbnail: c.thumbnail, status: res.status });
      console.log(`❌ Course ${c.id} ("${c.title}") failed with status ${res.status}: ${c.thumbnail}`);
    } else {
      console.log(`✅ Course ${c.id} ("${c.title}") OK`);
    }
  }

  console.log(`\nSummary: ${failed.length} failed out of ${courses.length}`);
  console.log(JSON.stringify(failed, null, 2));
}

main().catch(console.error).finally(() => closePrismaClient());
