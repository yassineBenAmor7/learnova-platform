import React from 'react';
import { FileText, Shield, Users, AlertCircle, Clock } from 'lucide-react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <div className="terms-header-content">
          <FileText size={48} className="terms-icon" />
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-subtitle">Last updated: July 2026</p>
        </div>
      </div>

      <div className="terms-content">
        <div className="terms-intro">
          <p>
            Welcome to Learnova. By using our platform, you agree to comply with and be bound by the following 
            terms and conditions of use. Please read these terms carefully before using Learnova.
          </p>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Shield size={24} className="section-icon" />
            <h2 className="section-title">1. Acceptance of Terms</h2>
          </div>
          <div className="section-content">
            <p>
              By accessing and using Learnova, you accept and agree to be bound by the terms and provisions 
              of this agreement. If you do not agree to abide by these terms, please do not use this service.
              Learnova reserves the right to modify these terms at any time without prior notice. Your continued 
              use of the platform following any changes constitutes acceptance of the new terms.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Users size={24} className="section-icon" />
            <h2 className="section-title">2. User Accounts</h2>
          </div>
          <div className="section-content">
            <h3>2.1 Account Creation</h3>
            <p>
              To access certain features of Learnova, you must create an account. You are responsible for 
              maintaining the confidentiality of your account credentials and for all activities that occur 
              under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
            
            <h3>2.2 Account Information</h3>
            <p>
              You must provide accurate, complete, and current information when creating an account. You agree 
              to update your information to keep it accurate, complete, and current. Learnova reserves the right 
              to suspend or terminate accounts with inaccurate or fraudulent information.
            </p>
            
            <h3>2.3 Account Security</h3>
            <p>
              You are responsible for maintaining the security of your account. Learnova cannot and will not be 
              liable for any loss or damage arising from your failure to comply with this security obligation.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <FileText size={24} className="section-icon" />
            <h2 className="section-title">3. Course Content and Usage</h2>
          </div>
          <div className="section-content">
            <h3>3.1 Course Access</h3>
            <p>
              Upon successful enrollment and payment (if applicable), you will have access to the course 
              materials for the duration specified in the course description. Access duration varies by course 
              type and subscription plan.
            </p>
            
            <h3>3.2 Intellectual Property</h3>
            <p>
              All course content, including but not limited to videos, text, graphics, logos, and software, 
              is the property of Learnova or its content partners and is protected by intellectual property 
              laws. You may not reproduce, distribute, modify, or create derivative works of any course content 
              without explicit written permission.
            </p>
            
            <h3>3.3 Fair Use</h3>
            <p>
              You may use course content for personal learning purposes only. Commercial use, redistribution, 
              or sharing of account credentials is strictly prohibited and may result in account termination 
              and legal action.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <AlertCircle size={24} className="section-icon" />
            <h2 className="section-title">4. Payment and Billing</h2>
          </div>
          <div className="section-content">
            <h3>4.1 Pricing</h3>
            <p>
              Course prices and subscription fees are listed on our platform and are subject to change without 
              notice. However, price changes will not affect courses or subscriptions you have already purchased 
              or subscribed to.
            </p>
            
            <h3>4.2 Payment Methods</h3>
            <p>
              We accept various payment methods including credit cards, PayPal, and bank transfers. All payments 
              are processed securely through our payment partners. By providing payment information, you represent 
              that you are authorized to use the payment method.
            </p>
            
            <h3>4.3 Refund Policy</h3>
            <p>
              We offer a 30-day money-back guarantee for premium courses. Refund requests must be made within 
              30 days of purchase and are subject to our review. Refunds are processed within 5-7 business days 
              to the original payment method.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Shield size={24} className="section-icon" />
            <h2 className="section-title">5. Certificates</h2>
          </div>
          <div className="section-content">
            <h3>5.1 Certificate Requirements</h3>
            <p>
              Certificates are awarded upon successful completion of course requirements, including completing 
              all sessions and passing the final assessment with a minimum score of 70%. Certificate issuance 
              is at the sole discretion of Learnova.
            </p>
            
            <h3>5.2 Certificate Validity</h3>
            <p>
              Learnova certificates verify that you have completed the specified course requirements. However, 
              they do not guarantee employment or professional certification. Employers and institutions may 
              verify certificates through our verification system.
            </p>
            
            <h3>5.3 Certificate Misuse</h3>
            <p>
              Misrepresentation of certificates, alteration of certificate documents, or use of fraudulent 
              certificates is prohibited and may result in legal action and permanent account termination.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Users size={24} className="section-icon" />
            <h2 className="section-title">6. User Conduct</h2>
          </div>
          <div className="section-content">
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any illegal or unauthorized purpose</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Post or transmit harmful, offensive, or inappropriate content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Engage in academic dishonesty during assessments</li>
              <li>Reverse engineer or attempt to extract source code from the platform</li>
            </ul>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Shield size={24} className="section-icon" />
            <h2 className="section-title">7. Privacy and Data Protection</h2>
          </div>
          <div className="section-content">
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
              of Learnova, to understand our practices regarding the collection and use of your personal 
              information. By using Learnova, you consent to our data practices as described in our Privacy Policy.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Clock size={24} className="section-icon" />
            <h2 className="section-title">8. Termination</h2>
          </div>
          <div className="section-content">
            <h3>8.1 Termination by User</h3>
            <p>
              You may terminate your account at any time by contacting our support team. Upon termination, 
              your access to course materials will cease, and you will not be entitled to any refunds for 
              partially completed courses.
            </p>
            
            <h3>8.2 Termination by Learnova</h3>
            <p>
              Learnova reserves the right to suspend or terminate your account at any time for violation of 
              these terms, fraudulent activity, or any other reason at our sole discretion. Upon termination, 
              you will lose access to all course materials and certificates.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <AlertCircle size={24} className="section-icon" />
            <h2 className="section-title">9. Disclaimer of Warranties</h2>
          </div>
          <div className="section-content">
            <p>
              Learnova is provided on an "as is" and "as available" basis. We make no warranties, expressed 
              or implied, and hereby disclaim all warranties including, without limitation, implied warranties 
              of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant 
              that the platform will be uninterrupted, secure, or error-free.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Shield size={24} className="section-icon" />
            <h2 className="section-title">10. Limitation of Liability</h2>
          </div>
          <div className="section-content">
            <p>
              In no event shall Learnova, its directors, employees, partners, or affiliates be liable for any 
              indirect, incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the 
              platform.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <FileText size={24} className="section-icon" />
            <h2 className="section-title">11. Governing Law</h2>
          </div>
          <div className="section-content">
            <p>
              These terms shall be governed by and construed in accordance with the laws of Tunisia, without 
              regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved 
              in the courts of Tunisia.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <div className="section-header">
            <Users size={24} className="section-icon" />
            <h2 className="section-title">12. Contact Information</h2>
          </div>
          <div className="section-content">
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> support@learnova.com</p>
              <p><strong>Address:</strong> Avenue Yasser Arafet, Immeuble Le Boulevard, Sahloul, Sousse, Tunisia</p>
              <p><strong>Phone:</strong> +216 73 000 000</p>
            </div>
          </div>
        </div>

        <div className="terms-footer">
          <p>
            By using Learnova, you acknowledge that you have read, understood, and agree to be bound by these 
            Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
