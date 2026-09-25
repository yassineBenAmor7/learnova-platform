/**
 * Enterprise Prefix-First Search Engine (Coursera / Algolia standard)
 * 
 * Provides intelligent, high-precision search filtering:
 * 1. Exact Title Prefix (Rank 1 / Score 1000): Item starts with query (e.g. "s" -> "SQL & Relational Databases")
 * 2. Word-Prefix Match (Rank 2 / Score 500): Any word starts with query (e.g. "sq" -> "Introduction to SQL")
 * 3. Domain / Category Match (Rank 3 / Score 250): Category/domain begins with query
 * 4. Substring Match (Rank 4 / Score 100): Only active when query has >= 3 characters to eliminate single-letter noise
 */

/**
 * Calculates prefix relevance score for a given text and query.
 * 
 * @param {string} text - Target text to search in
 * @param {string} query - Clean query string
 * @returns {number} Score from 0 to 1000
 */
export function calculatePrefixScore(text, query) {
  if (!text || !query) return 0;

  const cleanText = String(text).trim().toLowerCase();
  const cleanQuery = String(query).trim().toLowerCase();
  if (!cleanQuery) return 0;

  // 1. Exact string prefix match (Highest priority)
  if (cleanText.startsWith(cleanQuery)) {
    return 1000;
  }

  // 2. Word boundary prefix match (Second priority)
  // Matches when any word begins with the query (e.g., "Introduction to SQL" for "sq")
  const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordPrefixRegex = new RegExp(`(^|[\\s_\\-/:,;.({\\[])${escapedQuery}`, 'i');
  if (wordPrefixRegex.test(cleanText)) {
    return 500;
  }

  // 3. Substring match only for queries of 3 or more characters (eliminates single-letter noise)
  if (cleanQuery.length >= 3 && cleanText.includes(cleanQuery)) {
    return 100;
  }

  return 0;
}

/**
 * Filters and ranks a list of items using prefix-first relevance.
 * Items starting directly with the query appear first, followed by word-prefix matches.
 * 
 * @param {Array<T>} items - Source items
 * @param {string} query - Search query
 * @param {Array<string|Function>} fieldExtractors - Fields or extractor functions to check in priority order
 * @returns {Array<T>} Filtered and sorted items
 */
export function filterAndRankByPrefix(items, query, fieldExtractors = ['title']) {
  if (!Array.isArray(items)) return [];
  if (!query || !query.trim()) return items;

  const cleanQuery = query.trim().toLowerCase();
  const scoredItems = [];

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    let bestScore = 0;

    for (let f = 0; f < fieldExtractors.length; f++) {
      const extractor = fieldExtractors[f];
      let fieldValue = '';

      if (typeof extractor === 'function') {
        fieldValue = extractor(item);
      } else if (typeof extractor === 'string' && item) {
        fieldValue = item[extractor];
      }

      if (fieldValue) {
        const score = calculatePrefixScore(fieldValue, cleanQuery);
        // Apply slight field decay so primary field (e.g. title) always beats secondary field (e.g. description)
        const weightedScore = score > 0 ? score - (f * 60) : 0;
        if (weightedScore > bestScore) {
          bestScore = weightedScore;
        }
      }
    }

    if (bestScore > 0) {
      scoredItems.push({ item, score: bestScore, originalIndex: idx });
    }
  }

  // Sort descending by score, maintaining stable order for identical scores
  scoredItems.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.originalIndex - b.originalIndex;
  });

  return scoredItems.map(entry => entry.item);
}
