import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <div className="contact-header-content">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">We're here to help. Get in touch with our team.</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <div className="contact-info-card">
            <Mail size={32} className="contact-icon" />
            <h3>Email Us</h3>
            <p>support@learnova.com</p>
            <p className="contact-note">We'll respond within 24 hours</p>
          </div>

          <div className="contact-info-card">
            <Phone size={32} className="contact-icon" />
            <h3>Call Us</h3>
            <p>+216 73 000 000</p>
            <p className="contact-note">Mon-Fri, 9am-6pm</p>
          </div>

          <div className="contact-info-card">
            <MapPin size={32} className="contact-icon" />
            <h3>Visit Us</h3>
            <p>Avenue Yasser Arafet, Immeuble Le Boulevard</p>
            <p>Sahloul, Sousse, Tunisia</p>
          </div>

          <div className="contact-info-card">
            <Clock size={32} className="contact-icon" />
            <h3>Working Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p className="contact-note">Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-section">
          <div className="contact-form-card">
            <h2 className="form-title">Send us a message</h2>
            <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible.</p>

            {submitted ? (
              <div className="success-message">
                <CheckCircle size={48} className="success-icon" />
                <h3>Message Sent!</h3>
                <p>Thank you for contacting us. We'll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="How can we help you?"
                  />
                </div>

                <button type="submit" className="submit-button">
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
