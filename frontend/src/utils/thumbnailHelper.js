export const DEFAULT_DOMAIN_THUMBNAILS = {
  IT_DATA: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  FINANCE_BUSINESS: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  MANAGEMENT: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  MARKETING: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  SALES_E_COMMERCE: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=80',
  DESIGN_CREATIVE: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
  LANGUAGE_COMMUNICATION: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
  HEALTH_WELLNESS: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
  PERSONAL_DEVELOPMENT: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
  ACADEMIC_SCIENCES: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  MUSIC_ARTS: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
  HUMANITIES_SOCIAL: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80',
  LAW_LEGAL: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  LIFESTYLE_HOBBIES: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Returns a guaranteed valid thumbnail URL for any course.
 * If the course has no thumbnail or a broken placeholder, returns the domain default.
 */
export function getCourseThumbnail(course) {
  if (!course) return DEFAULT_DOMAIN_THUMBNAILS.IT_DATA;

  const url = course.thumbnail;
  if (!url || typeof url !== 'string' || url.trim() === '' || url.includes('example.com') || url.includes('placeholder')) {
    return DEFAULT_DOMAIN_THUMBNAILS[course.domain] || DEFAULT_DOMAIN_THUMBNAILS.IT_DATA;
  }

  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }

  return url;
}

/**
 * Image onError handler to smoothly fallback to the domain default without breaking the layout.
 */
export function handleThumbnailError(event, domain) {
  const fallback = DEFAULT_DOMAIN_THUMBNAILS[domain] || DEFAULT_DOMAIN_THUMBNAILS.IT_DATA;
  if (event?.target && event.target.src !== fallback) {
    event.target.src = fallback;
  }
}
