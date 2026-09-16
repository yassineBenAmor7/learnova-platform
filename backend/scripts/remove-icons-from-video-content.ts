import { getPrismaClient, closePrismaClient } from '../src/prisma/prisma-client.factory';

const prisma = getPrismaClient();

// Comprehensive Unicode emoji / symbol regex matching icons and pictographs
const ICON_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{FE00}-\u{FE0F}]/gu;

async function removeIconsFromVideoContent() {
  console.log('🧹 SUPPRESSION DES ICÔNES ET ÉMOJIS DANS LE CONTENU TEXTUEL DES VIDÉOS...\n');

  const videos = await prisma.video.findMany({
    select: { id: true, content: true },
    where: { content: { not: null } },
  });

  console.log(`Total de vidéos à analyser : ${videos.length}`);

  let updatedCount = 0;

  for (const video of videos) {
    if (!video.content) continue;

    // Clean emojis and fix formatting (e.g., '### 🎯 Heading' -> '### Heading')
    let cleanedContent = video.content.replace(ICON_REGEX, '');
    
    // Clean potential double spaces left after icon removal in headings
    cleanedContent = cleanedContent.replace(/^(#{1,6})\s+/gm, '$1 ');
    cleanedContent = cleanedContent.replace(/^(#{1,6}\s+)\s+/gm, '$1');

    if (cleanedContent !== video.content) {
      await prisma.video.update({
        where: { id: video.id },
        data: { content: cleanedContent.trim() },
      });
      updatedCount++;
    }
  }

  console.log(`✅ Mise à jour terminée : ${updatedCount} vidéos nettoyées avec succès.`);

  // Validation
  const remaining = await prisma.video.findMany({
    select: { id: true, content: true },
  });

  let hasIcon = 0;
  for (const v of remaining) {
    if (v.content && ICON_REGEX.test(v.content)) {
      hasIcon++;
    }
  }

  console.log(`🔍 Contrôle final : ${hasIcon} vidéos contenant encore des icônes/émojis (doit être 0).`);
}

removeIconsFromVideoContent()
  .catch(console.error)
  .finally(() => closePrismaClient());
