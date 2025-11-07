import React, { useState } from "react";
import "./Contact.css";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // show toast
    setShowToast(true);

    // clear form
    setFormData({ name: "", email: "", message: "" });

    // hide toast after 3s
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <section className="contact-section" id="contact">
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="contact-heading">Get in Touch</h2>
        <p className="contact-subtext">
          Have a question, idea, or collaboration in mind?  
          Drop us a message — we’d love to connect with you.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              className="form-input message-box"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-button"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            ✅ Message sent successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
