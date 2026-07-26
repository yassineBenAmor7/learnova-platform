import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronRight, BookOpen, User, CreditCard, Shield, HelpCircle } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const faqData = [
    {
      category: 'Getting Started',
      icon: <BookOpen size={20} />,
      questions: [
        {
          id: 1,
          question: 'How do I create an account on Learnova?',
          answer: 'Creating an account is simple. Click on the "Sign Up" button on the homepage, fill in your details including name, email, and password, and you\'re ready to start learning. You can also sign up using your social media accounts for quicker access.'
        },
        {
          id: 2,
          question: 'Is Learnova free to use?',
          answer: 'Learnova offers both free and premium courses. Many of our courses are available for free, while premium courses require a subscription or one-time purchase. You can browse our course catalog to see which courses are free and which are premium.'
        },
        {
          id: 3,
          question: 'What are the system requirements for using Learnova?',
          answer: 'Learnova is a web-based platform that works on any modern web browser including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend a stable internet connection and a device with at least 4GB of RAM. Mobile devices are also supported through our responsive design.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      icon: <User size={20} />,
      questions: [
        {
          id: 4,
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a link to reset your password. The link expires after 24 hours for security reasons.'
        },
        {
          id: 5,
          question: 'Can I change my email address?',
          answer: 'Yes, you can change your email address from your profile settings. Go to your profile page, click on "Edit Profile," and update your email address. You\'ll need to verify your new email address before the change takes effect.'
        },
        {
          id: 6,
          question: 'How do I delete my account?',
          answer: 'If you wish to delete your account, please contact our support team at support@learnova.com. Account deletion is permanent and cannot be undone. We recommend downloading your certificates and course data before requesting account deletion.'
        }
      ]
    },
    {
      category: 'Courses & Learning',
      icon: <BookOpen size={20} />,
      questions: [
        {
          id: 7,
          question: 'How do I enroll in a course?',
          answer: 'Browse our course catalog, find a course that interests you, and click on "Enroll Now." If the course is free, you\'ll have immediate access. For premium courses, you\'ll need to complete the payment process before accessing the content.'
        },
        {
          id: 8,
          question: 'Can I access courses offline?',
          answer: 'Currently, Learnova requires an internet connection to access course content. However, we\'re working on an offline mode feature that will allow you to download courses for offline viewing. Stay tuned for updates!'
        },
        {
          id: 9,
          question: 'What is a learning path?',
          answer: 'A learning path is a structured sequence of courses designed to help you master a specific skill or topic. Learning paths guide you through courses in a recommended order, ensuring you build knowledge progressively. Each learning path includes multiple courses and assessments.'
        },
        {
          id: 10,
          question: 'How long do I have access to a course?',
          answer: 'Once enrolled, you have lifetime access to free courses. For premium courses, access duration depends on your subscription plan. Monthly subscribers have access as long as their subscription is active, while lifetime purchasers have permanent access.'
        }
      ]
    },
    {
      category: 'Certificates & Assessments',
      icon: <CreditCard size={20} />,
      questions: [
        {
          id: 11,
          question: 'How do I earn a certificate?',
          answer: 'To earn a certificate, you must complete all sessions in a course and pass the final quiz with a minimum score of 70%. Once you meet these requirements, your certificate will be automatically generated and available in your Certificates section.'
        },
        {
          id: 12,
          question: 'Are Learnova certificates recognized by employers?',
          answer: 'Learnova certificates are recognized by many employers and educational institutions. Each certificate includes a unique QR code that employers can use to verify its authenticity. We continuously work with industry partners to ensure our certifications hold value in the job market.'
        },
        {
          id: 13,
          question: 'What is exam mode?',
          answer: 'Exam mode is a strict assessment environment designed for formal evaluations. In exam mode, you must stay in fullscreen, cannot switch tabs, and have a timer. This mode is used for official assessments and ensures the integrity of the evaluation process.'
        },
        {
          id: 14,
          question: 'How can I verify a certificate?',
          answer: 'Each Learnova certificate has a unique QR code and certificate number. Employers can verify certificates by visiting our verification page and entering the certificate number or scanning the QR code. This provides instant confirmation of the certificate\'s authenticity.'
        }
      ]
    },
    {
      category: 'Billing & Payments',
      icon: <CreditCard size={20} />,
      questions: [
        {
          id: 15,
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For enterprise customers, we also offer invoicing options. All payments are processed securely through our payment partners.'
        },
        {
          id: 16,
          question: 'Can I get a refund?',
          answer: 'We offer a 30-day money-back guarantee for all premium courses. If you\'re not satisfied with a course within 30 days of purchase, contact our support team for a full refund. Refunds are processed within 5-7 business days.'
        },
        {
          id: 17,
          question: 'Do you offer corporate plans?',
          answer: 'Yes, we offer corporate and team plans for organizations. These plans include bulk discounts, admin dashboards, team progress tracking, and custom learning paths. Contact our sales team for more information about corporate pricing.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      icon: <Shield size={20} />,
      questions: [
        {
          id: 18,
          question: 'How is my personal data protected?',
          answer: 'Learnova takes data security seriously. We use industry-standard encryption to protect your data, comply with GDPR regulations, and never sell your personal information. Our security practices are regularly audited by third-party security firms.'
        },
        {
          id: 19,
          question: 'Is my payment information secure?',
          answer: 'Absolutely. We never store your complete credit card information on our servers. All payment processing is handled by PCI-DSS compliant payment processors. We use tokenization to ensure your payment details remain secure.'
        },
        {
          id: 20,
          question: 'Can I control my privacy settings?',
          answer: 'Yes, you can control your privacy settings from your profile. You can choose what information is visible on your profile, manage cookie preferences, and control email notifications. We believe in giving you full control over your data.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: <HelpCircle size={20} />,
      questions: [
        {
          id: 21,
          question: 'What should I do if a video won\'t play?',
          answer: 'If you experience video playback issues, try the following: 1) Check your internet connection, 2) Clear your browser cache, 3) Try a different browser, 4) Disable any ad blockers. If the issue persists, contact our technical support team with details about the problem.'
        },
        {
          id: 22,
          question: 'How do I report a bug or technical issue?',
          answer: 'To report a bug, use our contact form or email support@learnova.com. Please include details about the issue, your browser type, and steps to reproduce the problem. Our technical team reviews all reports and prioritizes fixes based on severity.'
        },
        {
          id: 23,
          question: 'Is there a mobile app available?',
          answer: 'Currently, Learnova is available as a web application optimized for mobile browsers. We\'re developing native mobile apps for iOS and Android, which will be released soon. The mobile web version offers full functionality including course access and quiz completion.'
        }
      ]
    }
  ];

  const toggleQuestion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq-container">
      <div className="faq-header">
        <div className="faq-header-content">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">Find answers to common questions about Learnova</p>
          
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="faq-content">
        {filteredFAQ.map((category, categoryIndex) => (
          <div key={categoryIndex} className="faq-category">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h2 className="category-title">{category.category}</h2>
            </div>
            
            <div className="category-questions">
              {category.questions.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className={`faq-question ${expandedId === faq.id ? 'expanded' : ''}`}
                    onClick={() => toggleQuestion(faq.id)}
                  >
                    <span>{faq.question}</span>
                    {expandedId === faq.id ? (
                      <ChevronUp size={20} className="chevron-icon" />
                    ) : (
                      <ChevronDown size={20} className="chevron-icon" />
                    )}
                  </button>
                  
                  {expandedId === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredFAQ.length === 0 && (
          <div className="no-results">
            <HelpCircle size={48} className="no-results-icon" />
            <h3>No results found</h3>
            <p>We couldn't find any questions matching "{searchQuery}"</p>
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <div className="faq-footer">
        <div className="faq-footer-content">
          <h3>Still have questions?</h3>
          <p>Can't find the answer you're looking for? Our support team is here to help.</p>
          <a href="/contact" className="contact-link">
            Contact Support
            <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
