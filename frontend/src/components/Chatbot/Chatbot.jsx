import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Bot, ExternalLink, Sparkles } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import './Chatbot.css';

// Markdown-to-HTML parser for chatbot messages
const formatChatMarkdown = (text) => {
  if (!text) return '';
  let html = text;

  // Bold **text**
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="chatbot-inline-link">$1</a>');

  // Lists
  html = html.replace(/^[-*]\s+(.*?)$/gm, '<li class="chatbot-li">$1</li>');
  html = html.replace(/(<li class="chatbot-li">[\s\S]*?<\/li>)+/g, '<ul class="chatbot-ul">$1</ul>');

  // Paragraphs & Line breaks
  const paragraphs = html.split(/\n\n+/);
  return paragraphs
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<ul') || trimmed.startsWith('<li')) return trimmed;
      return `<p class="chatbot-p">${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
};

function Chatbot({ courseId = null, sessionId = null }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant pédagogique intelligent de Learnova. Comment puis-je vous aider dans votre apprentissage aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        'Quels cours sont disponibles en Data & IA ?',
        'Comment obtenir un certificat vérifiable ?',
        'Quelles sont les règles du mode examen ?',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputValue).trim();
    if (!queryText || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: queryText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await aiService.askChatbot(queryText, courseId, sessionId);

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
      console.error('Chatbot query error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Désolé, une anomalie temporaire est survenue lors de la communication avec le service d'assistance. Veuillez réessayer dans un instant.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (url) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
      setIsOpen(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <button
        className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Ouvrir l'Assistant IA"
        aria-label="Ouvrir l'Assistant IA"
      >
        <Bot size={24} />
      </button>

      {isOpen && (
        <div className="chatbot-container" role="dialog" aria-labelledby="chatbot-heading">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="chatbot-icon-badge">
                <Bot size={20} />
              </div>
              <div>
                <span id="chatbot-heading" className="chatbot-name">Assistant Pédagogique IA</span>
                <span className="chatbot-status">En ligne 24/7</span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              title="Fermer la discussion"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <div
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: formatChatMarkdown(message.text) }}
                  />

                  {/* Interactive Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="chatbot-actions-container">
                      {message.actions.map((act, idx) => (
                        <button
                          key={idx}
                          className="chatbot-action-btn"
                          onClick={() => handleActionClick(act.url)}
                        >
                          <span>{act.label}</span>
                          <ExternalLink size={14} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sources Citation */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="chatbot-sources-container">
                      <span className="sources-label">Sources associées :</span>
                      {message.sources.map((src, idx) => (
                        <span key={idx} className="source-tag">
                          {src.courseTitle} {src.sessionTitle ? `— ${src.sessionTitle}` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Suggestion Chips */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="chatbot-suggestions-container">
                      {message.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          className="chatbot-suggestion-chip"
                          onClick={() => handleSendMessage(sug)}
                        >
                          <Sparkles size={12} />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-content typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez une question sur nos formations..."
              disabled={isTyping}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Envoyer"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
