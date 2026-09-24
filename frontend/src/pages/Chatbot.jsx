import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, Sparkles, BookOpen, Award, CheckCircle, ExternalLink, HelpCircle, ArrowLeft } from 'lucide-react';
import { aiService } from '../services/ai.service';
import { useAuth } from '../context/AuthContext';
import './Chatbot.css';

const formatMarkdown = (text) => {
  if (!text) return '';
  let html = text;
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="chatpage-link">$1</a>');
  html = html.replace(/^[-*]\s+(.*?)$/gm, '<li class="chatpage-li">$1</li>');
  html = html.replace(/(<li class="chatpage-li">[\s\S]*?<\/li>)+/g, '<ul class="chatpage-ul">$1</ul>');
  const paragraphs = html.split(/\n\n+/);
  return paragraphs
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<ul') || trimmed.startsWith('<li')) return trimmed;
      return `<p class="chatpage-p">${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
};

function ChatbotPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am **Learnova's Intelligent AI Pedagogical Assistant**.\n\nAsk me questions about any course, request conceptual explanations, or get recommendations for your next learning step.",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        'Recommend a Data Science course',
        'What are the requirements to pass an exam?',
        'Explain the core principles of SQL',
        'How does the daily streak calculation work?',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const streamRef = useRef(null);
  const isFirstMount = useRef(true);

  const scrollToBottom = () => {
    if (streamRef.current) {
      streamRef.current.scrollTo({
        top: streamRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customText) => {
    const text = (customText || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await aiService.askChatbot(text);
      const botMessage = {
        id: Date.now() + 1,
        text: response.answer,
        sender: 'bot',
        timestamp: new Date(),
        actions: response.actions || [],
        suggestions: response.suggestions || [],
        sources: response.sources || [],
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, a temporary error occurred while communicating with the AI service. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (url) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
  };

  return (
    <div className="chatbot-page-root">
      <div className="chatbot-page-container">
        <div className="chatbot-page-sidebar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Retour</span>
          </button>

          <div className="sidebar-header">
            <div className="tutor-avatar">
              <Bot size={28} />
            </div>
            <h3>AI Virtual Tutor</h3>
            <p>24/7 pedagogical assistance powered by Learnova's real course content.</p>
          </div>

          <div className="prompt-topics">
            <h4>Common Topics</h4>
            <button
              className="topic-btn"
              onClick={() => handleSendMessage('What are the most popular courses in IT & Data?')}
            >
              <BookOpen size={16} />
              <span>IT & Data Courses</span>
            </button>
            <button
              className="topic-btn"
              onClick={() => handleSendMessage('How does QR Code certification work?')}
            >
              <Award size={16} />
              <span>Certificates & QR Code</span>
            </button>
            <button
              className="topic-btn"
              onClick={() => handleSendMessage('What are the rules of Timed Exam Mode?')}
            >
              <CheckCircle size={16} />
              <span>Exam Mode & 70% Pass</span>
            </button>
            <button
              className="topic-btn"
              onClick={() => handleSendMessage('How to level up and unlock badges?')}
            >
              <Sparkles size={16} />
              <span>Gamification & Streaks</span>
            </button>
          </div>
        </div>

        <div className="chatbot-page-main">
          <div className="chatpage-stream" ref={streamRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`chatpage-message ${m.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
            >
              <div className="chatpage-message-bubble">
                <div
                  className="chatpage-message-text"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(m.text) }}
                />

                {m.actions && m.actions.length > 0 && (
                  <div className="chatpage-actions">
                    {m.actions.map((act, idx) => (
                      <button
                        key={idx}
                        className="chatpage-action-btn"
                        onClick={() => handleActionClick(act.url)}
                      >
                        <span>{act.label}</span>
                        <ExternalLink size={14} />
                      </button>
                    ))}
                  </div>
                )}

                {m.sources && m.sources.length > 0 && (
                  <div className="chatpage-sources">
                    <span className="source-title">Related Documentation:</span>
                    {m.sources.map((s, idx) => (
                      <span key={idx} className="source-chip">
                        {s.courseTitle} {s.sessionTitle ? `— ${s.sessionTitle}` : ''}
                      </span>
                    ))}
                  </div>
                )}

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="chatpage-suggestions">
                    {m.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        className="chatpage-suggestion-btn"
                        onClick={() => handleSendMessage(sug)}
                      >
                        <Sparkles size={12} />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chatpage-message bot-msg">
              <div className="chatpage-message-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="chatpage-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about our courses or curriculum..."
            disabled={isTyping}
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping}>
            <Send size={18} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default ChatbotPage;
