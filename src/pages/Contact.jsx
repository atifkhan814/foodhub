import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import './Contact.css';

function Contact() {
  return (
    <section className="contact-page">
      <div className="contact-container">
        <div className="contact-heading">
          <span className="contact-eyebrow">WE'RE HERE FOR YOU</span>
          <h1>Contact Us</h1>
          <p>
            Have a question or feedback? We'd love to hear from you.
            Get in touch with our FoodHub team.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Let's Talk</h2>
            <p className="contact-info-description">
              Whether you need help with an order or just want to say hello,
              we're happy to help.
            </p>

            <a
              className="contact-info-item"
              href="mailto:info@foodhub.com"
            >
              <span className="contact-icon">
                <Mail size={22} />
              </span>
              <span>
                <strong>Email Us</strong>
                <span>info@foodhub.com</span>
              </span>
            </a>

            <a
              className="contact-info-item"
              href="tel:+11234567890"
            >
              <span className="contact-icon">
                <Phone size={22} />
              </span>
              <span>
                <strong>Call Us</strong>
                <span>(123) 456-7890</span>
              </span>
            </a>

            <div className="contact-info-item">
              <span className="contact-icon">
                <Clock size={22} />
              </span>
              <span>
                <strong>Our Availability</strong>
                <span>We're here to help with your questions</span>
              </span>
            </div>

            <div className="contact-note">
              <MapPin size={20} />
              <p>Thank you for choosing FoodHub. We look forward to hearing from you!</p>
            </div>
          </div>

          <div className="contact-message">
            <h2>Get in Touch</h2>
            <p>Choose the easiest way to reach our team.</p>

            <a
              href="mailto:info@foodhub.com?subject=FoodHub%20Enquiry"
              className="contact-email-button"
            >
              Send Us an Email
              <Mail size={18} />
            </a>

            <a
              href="tel:+11234567890"
              className="contact-phone-button"
            >
              Call FoodHub
              <Phone size={18} />
            </a>

            <div className="contact-small-note">
              We appreciate your feedback and suggestions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;