import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/course.service';
import { aiService } from '../services/ai.service';
import { Search, Filter, ChevronLeft, ChevronRight, Sparkles, ArrowRight, X } from 'lucide-react';
import { getCourseThumbnail, handleThumbnailError } from '../utils/thumbnailHelper';
import { filterAndRankByPrefix } from '../utils/searchHelper';
import './Courses.css';

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const [filters, setFilters] = useState({
    level: 'all',
    domain: 'all',
    pricing: 'all',
    sessions: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, courses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const applyFilters = () => {
    let filtered = [...courses];

    // Apply level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(course => 
        (course.level || 'BEGINNER').toUpperCase() === filters.level.toUpperCase()
      );
    }

    // Apply domain filter
    if (filters.domain !== 'all') {
      filtered = filtered.filter(course => 
        (course.domain || 'IT_DATA').toUpperCase() === filters.domain.toUpperCase()
      );
    }

    // Apply pricing filter
    if (filters.pricing === 'free') {
      filtered = filtered.filter(course => !course.isPaid || course.price === 0);
    } else if (filters.pricing === 'paid') {
      filtered = filtered.filter(course => course.isPaid && course.price > 0);
    }

    // Apply sessions filter
    if (filters.sessions === 'with-sessions') {
      filtered = filtered.filter(course => course.sessions?.length > 0);
    } else if (filters.sessions === 'no-sessions') {
      filtered = filtered.filter(course => !course.sessions || course.sessions.length === 0);
    }

    // Apply intelligent prefix-first search (Exact title prefix -> Word prefix in title -> Domain prefix)
    if (searchTerm && searchTerm.trim()) {
      filtered = filterAndRankByPrefix(filtered, searchTerm, [
        course => course.title,
        course => course.domain,
        course => course.description
      ]);
    }

    setFilteredCourses(filtered);
  };

  const activeFilterCount = (filters.level !== 'all' ? 1 : 0) + 
                            (filters.domain !== 'all' ? 1 : 0) + 
                            (filters.pricing !== 'all' ? 1 : 0) + 
                            (filters.sessions !== 'all' ? 1 : 0);

  const DOMAIN_CONFIG = {
    IT_DATA: { label: 'IT & Data Analytics', className: 'domain-it' },
    MARKETING: { label: 'Marketing & Growth', className: 'domain-marketing' },
    FINANCE_BUSINESS: { label: 'Finance & Business', className: 'domain-finance' },
    MANAGEMENT: { label: 'Management & Agile', className: 'domain-management' },
    DESIGN_CREATIVE: { label: 'Design & UX/UI', className: 'domain-design' },
    LANGUAGE_COMMUNICATION: { label: 'Languages', className: 'domain-language' },
    HEALTH_WELLNESS: { label: 'Health & Wellness', className: 'domain-health' },
    PERSONAL_DEVELOPMENT: { label: 'Personal Development', className: 'domain-personal' },
    ACADEMIC_SCIENCES: { label: 'Academic Sciences', className: 'domain-academic' },
    MUSIC_ARTS: { label: 'Music & Arts', className: 'domain-music' },
    SALES_E_COMMERCE: { label: 'Sales & E-Commerce', className: 'domain-sales' },
    HUMANITIES_SOCIAL: { label: 'Humanities & Social', className: 'domain-humanities' },
    LAW_LEGAL: { label: 'Law & Legal', className: 'domain-law' },
    LIFESTYLE_HOBBIES: { label: 'Lifestyle & Hobbies', className: 'domain-lifestyle' },
  };

  const getDomainBadge = (domain) =>
    DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.IT_DATA;

  const countByDomain = (domain) =>
    courses.filter((c) => (c.domain || 'IT_DATA') === domain).length;

  // Pagination logic
  const effectiveItemsPerPage = itemsPerPage === 'all' ? (filteredCourses.length || 1) : itemsPerPage;
  const totalPages = Math.ceil(filteredCourses.length / effectiveItemsPerPage);
  const paginatedCourses = itemsPerPage === 'all' 
    ? filteredCourses 
    : filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageError = (courseId) => {
    setFailedImages(prev => new Set([...prev, courseId]));
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const [coursesRes, recsRes] = await Promise.allSettled([
        courseService.getAll(),
        aiService.getRecommendations(user?.id, 3),
      ]);

      if (coursesRes.status === 'fulfilled') {
        setCourses(coursesRes.value);
        setFilteredCourses(coursesRes.value);
      } else {
        throw coursesRes.reason;
      }

      if (recsRes.status === 'fulfilled') {
        setAiRecommendations(recsRes.value?.recommendations || []);
      }
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Hero Banner Section (Coursera/Udemy Style) */}
      <div className="courses-hero-banner">
        <div className="hero-badge">
          <span>Over 20+ Masterclasses & Professional Courses</span>
        </div>
        <h1 className="hero-title">Master In-Demand Skills & Accelerate Your Career</h1>
        <p className="hero-subtitle">
          Explore top-rated interactive courses across IT, Data Analytics, Marketing, Business, Leadership, and Design taught by industry experts.
        </p>
        <div className="hero-stats-row">
          <div className="hero-stat-badge">
            <span>Verified Certificates</span>
          </div>
          <div className="hero-stat-badge">
            <span>Gamification Points & Streaks</span>
          </div>
          <div className="hero-stat-badge">
            <span>Beginner to Executive Tiers</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations Highlight Bar */}
      {aiRecommendations && aiRecommendations.length > 0 && (
        <div className="courses-ai-bar">
          <div className="courses-ai-header">
            <div className="courses-ai-pill">
              <Sparkles size={14} className="ai-sparkle-spin" />
              <span>Learnova AI Matches</span>
            </div>
            <h3 className="courses-ai-title">Tailored For Your Learning Path</h3>
          </div>
          <div className="courses-ai-grid">
            {aiRecommendations.map((rec) => (
              <Link to={`/courses/${rec.courseId}`} key={rec.courseId} className="courses-ai-card">
                <div className="courses-ai-card-badge">
                  <Sparkles size={12} />
                  <span>{rec.matchPercentage}% Match</span>
                </div>
                <div className="courses-ai-card-content">
                  <span className="courses-ai-card-cat">{rec.category} • {rec.level}</span>
                  <h4 className="courses-ai-card-title">{rec.title}</h4>
                  <p className="courses-ai-card-reason">{rec.primaryReason}</p>
                </div>
                <div className="courses-ai-card-arrow">
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar Section (Left Search Input & Right Filter Dropdown) */}
      <div className="courses-search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search courses by title, keywords, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`search-input ${searchTerm ? 'search-input-has-clear' : ''}`}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <div className="filter-wrapper">
          <button 
            className={`btn ${activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'} filter-toggle-btn`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {activeFilterCount > 0 && <span className="active-filter-badge">{activeFilterCount}</span>}
          </button>
          {showFilters && (
            <div className="filter-dropdown">
              <div className="filter-dropdown-header">
                <h3>Filter Courses</h3>
                {activeFilterCount > 0 && (
                  <button 
                    className="clear-filters-link"
                    onClick={() => setFilters({ level: 'all', domain: 'all', pricing: 'all', sessions: 'all' })}
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="filter-group">
                <label>Domain / Category</label>
                <select
                  value={filters.domain}
                  onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                >
                  <option value="all">All Domains</option>
                  <option value="IT_DATA">IT & Data Analytics</option>
                  <option value="MARKETING">Marketing & Growth</option>
                  <option value="FINANCE_BUSINESS">Finance & Business</option>
                  <option value="MANAGEMENT">Management & Agile</option>
                  <option value="DESIGN_CREATIVE">Design & UX/UI</option>
                  <option value="LANGUAGE_COMMUNICATION">Languages</option>
                  <option value="HEALTH_WELLNESS">Health & Wellness</option>
                  <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
                  <option value="ACADEMIC_SCIENCES">Academic Sciences</option>
                  <option value="MUSIC_ARTS">Music & Creative Arts</option>
                  <option value="LIFESTYLE_HOBBIES">Lifestyle & Hobbies</option>
                  <option value="SALES_E_COMMERCE">Sales & E-Commerce</option>
                  <option value="HUMANITIES_SOCIAL">Humanities & Social Sciences</option>
                  <option value="LAW_LEGAL">Law & Legal Studies</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Pricing Model</label>
                <select
                  value={filters.pricing}
                  onChange={(e) => setFilters({ ...filters, pricing: e.target.value })}
                >
                  <option value="all">All Pricing Tiers</option>
                  <option value="free">Free Courses</option>
                  <option value="paid">Paid / Premium Courses</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Difficulty Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                >
                  <option value="all">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="ALL_LEVELS">All Levels</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sessions Structure</label>
                <select
                  value={filters.sessions}
                  onChange={(e) => setFilters({ ...filters, sessions: e.target.value })}
                >
                  <option value="all">All Courses</option>
                  <option value="with-sessions">Structured (With Sessions)</option>
                  <option value="no-sessions">Direct Access (No Sessions)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Domain Quick Filter Chips */}
      <div className="domain-chips">
        <button
          className={`chip ${filters.domain === 'all' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'all' })}
        >
          All Domains ({courses.length})
        </button>
        <button
          className={`chip ${filters.domain === 'IT_DATA' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'IT_DATA' })}
        >
          IT & Data ({countByDomain('IT_DATA')})
        </button>
        <button
          className={`chip ${filters.domain === 'MARKETING' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'MARKETING' })}
        >
          Marketing ({countByDomain('MARKETING')})
        </button>
        <button
          className={`chip ${filters.domain === 'FINANCE_BUSINESS' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'FINANCE_BUSINESS' })}
        >
          Finance & Business ({countByDomain('FINANCE_BUSINESS')})
        </button>
        <button
          className={`chip ${filters.domain === 'MANAGEMENT' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'MANAGEMENT' })}
        >
          Management ({countByDomain('MANAGEMENT')})
        </button>
        <button
          className={`chip ${filters.domain === 'DESIGN_CREATIVE' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'DESIGN_CREATIVE' })}
        >
          Design ({countByDomain('DESIGN_CREATIVE')})
        </button>
        <button
          className={`chip ${filters.domain === 'LANGUAGE_COMMUNICATION' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'LANGUAGE_COMMUNICATION' })}
        >
          Languages ({countByDomain('LANGUAGE_COMMUNICATION')})
        </button>
        <button
          className={`chip ${filters.domain === 'HEALTH_WELLNESS' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'HEALTH_WELLNESS' })}
        >
          Health ({countByDomain('HEALTH_WELLNESS')})
        </button>
        <button
          className={`chip ${filters.domain === 'PERSONAL_DEVELOPMENT' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'PERSONAL_DEVELOPMENT' })}
        >
          Personal Dev ({countByDomain('PERSONAL_DEVELOPMENT')})
        </button>
        <button
          className={`chip ${filters.domain === 'ACADEMIC_SCIENCES' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'ACADEMIC_SCIENCES' })}
        >
          Sciences ({countByDomain('ACADEMIC_SCIENCES')})
        </button>
        <button
          className={`chip ${filters.domain === 'MUSIC_ARTS' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'MUSIC_ARTS' })}
        >
          Music & Arts ({countByDomain('MUSIC_ARTS')})
        </button>
        <button
          className={`chip ${filters.domain === 'LIFESTYLE_HOBBIES' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'LIFESTYLE_HOBBIES' })}
        >
          Lifestyle ({countByDomain('LIFESTYLE_HOBBIES')})
        </button>
        <button
          className={`chip ${filters.domain === 'SALES_E_COMMERCE' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'SALES_E_COMMERCE' })}
        >
          E-Commerce ({countByDomain('SALES_E_COMMERCE')})
        </button>
        <button
          className={`chip ${filters.domain === 'HUMANITIES_SOCIAL' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'HUMANITIES_SOCIAL' })}
        >
          Humanities ({countByDomain('HUMANITIES_SOCIAL')})
        </button>
        <button
          className={`chip ${filters.domain === 'LAW_LEGAL' ? 'active' : ''}`}
          onClick={() => setFilters({ ...filters, domain: 'LAW_LEGAL' })}
        >
          Law ({countByDomain('LAW_LEGAL')})
        </button>
      </div>

      {/* Results Bar Counter & Per Page Selector */}
      <div className="courses-results-bar">
        <div className="results-count">
          Showing <strong>{filteredCourses.length > 0 ? (itemsPerPage === 'all' ? `1–${filteredCourses.length}` : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, filteredCourses.length)}`) : 0}</strong> of <strong>{filteredCourses.length}</strong> courses
        </div>

        <div className="per-page-selector">
          <span>Show per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setCurrentPage(1);
            }}
            className="per-page-select"
          >
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value="all">All courses ({courses.length})</option>
          </select>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="courses-grid">
        {paginatedCourses.length === 0 ? (
          <div className="no-courses">
            <p>{searchTerm || activeFilterCount > 0 ? 'No courses match your active search or filters' : 'No courses available at the moment'}</p>
            {activeFilterCount > 0 && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => { setFilters({ level: 'all', domain: 'all', pricing: 'all', sessions: 'all' }); setSearchTerm(''); }}
                style={{ marginTop: '12px' }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          paginatedCourses.map((course) => {
            const domainInfo = getDomainBadge(course.domain);
            return (
              <div key={course.id} className="course-card card card-interactive">
                <div className="course-image">
                  <img 
                    src={getCourseThumbnail(course)} 
                    alt={course.title} 
                    className="course-thumbnail" 
                    onError={(e) => handleThumbnailError(e, course.domain)}
                    loading="lazy"
                  />
                  <span className={`domain-tag ${domainInfo.className}`}>
                    {domainInfo.label}
                  </span>
                  <span className={`price-badge ${course.isPaid && course.price > 0 ? 'paid-price-badge' : 'free-price-badge'}`}>
                    {course.isPaid && course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                  </span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-footer">
                    <div className="course-meta-pills">
                      <span className={`course-level level-badge level-${(course.level || 'BEGINNER').toLowerCase()}`}>
                        {course.level === 'ADVANCED' && 'Advanced'}
                        {course.level === 'INTERMEDIATE' && 'Intermediate'}
                        {course.level === 'ALL_LEVELS' && 'All Levels'}
                        {(!course.level || course.level === 'BEGINNER') && 'Beginner'}
                      </span>
                      <span className="course-sessions-badge">
                        {course.sessions?.length || 0} sessions
                      </span>
                    </div>
                    
                    <Link to={`/courses/${course.id}`} className="btn btn-primary course-card-btn">
                      View Course →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && itemsPerPage !== 'all' && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;
