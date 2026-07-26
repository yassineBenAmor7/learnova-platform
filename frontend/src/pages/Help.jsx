import React, { useState } from 'react';
import { Search, BookOpen, Video, MessageCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import './Help.css';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen size={24} />,
      articles: [
        { id: 1, title: 'How to create an account', content: 'Learn how to sign up for Learnova and start your learning journey.' },
        { id: 2, title: 'Navigating the dashboard', content: 'A complete guide to using your personal dashboard effectively.' },
        { id: 3, title: 'Finding and enrolling in courses', content: 'Discover how to browse available courses and enroll in your chosen programs.' },
      ]
    },
    {
      id: 'courses',
      title: 'Courses & Learning',
      icon: <Video size={24} />,
      articles: [
        { id: 4, title: 'Understanding learning paths', content: 'Learn how learning paths structure your educational journey.' },
        { id: 5, title: 'Watching video lessons', content: 'Tips for optimal video playback and learning retention.' },
        { id: 6, title: 'Completing sessions', content: 'How to mark sessions as complete and track your progress.' },
      ]
    },
    {
      id: 'assessments',
      title: 'Assessments & Certificates',
      icon: <MessageCircle size={24} />,
      articles: [
        { id: 7, title: 'Taking quizzes', content: 'Everything you need to know about quiz format and timing.' },
        { id: 8, title: 'Exam mode explained', content: 'Understanding the strict exam mode and its requirements.' },
        { id: 9, title: 'Earning certificates', content: 'How to qualify for and download your completion certificates.' },
        { id: 10, title: 'Verifying certificates', content: 'Learn how employers can verify your Learnova certificates.' },
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="help-container">
      <div className="help-header">
        <div className="help-header-content">
          <h1 className="help-title">Help Center</h1>
          <p className="help-subtitle">Find answers to your questions and get the most out of Learnova</p>
          
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="help-content">
        <div className="quick-links">
          <h2 className="section-title">Quick Links</h2>
          <div className="quick-links-grid">
            <a href="/contact" className="quick-link-card">
              <MessageCircle size={32} className="quick-link-icon" />
              <h3>Contact Support</h3>
              <p>Get personalized help from our team</p>
              <ArrowRight size={20} className="arrow-icon" />
            </a>
            <a href="/faq" className="quick-link-card">
              <BookOpen size={32} className="quick-link-icon" />
              <h3>FAQ</h3>
              <p>Frequently asked questions answered</p>
              <ArrowRight size={20} className="arrow-icon" />
            </a>
          </div>
        </div>

        <div className="help-categories">
          <h2 className="section-title">Browse by Category</h2>
          
          {filteredCategories.map(category => (
            <div key={category.id} className="category-card">
              <button
                className="category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="category-title-wrapper">
                  <span className="category-icon">{category.icon}</span>
                  <h3 className="category-title">{category.title}</h3>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp size={24} className="chevron-icon" />
                ) : (
                  <ChevronDown size={24} className="chevron-icon" />
                )}
              </button>
              
              {expandedCategory === category.id && (
                <div className="category-articles">
                  {category.articles.map(article => (
                    <div key={article.id} className="article-item">
                      <h4 className="article-title">{article.title}</h4>
                      <p className="article-content">{article.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
