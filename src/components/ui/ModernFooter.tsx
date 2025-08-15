'use client';
import { motion } from 'framer-motion';
import { Facebook, Heart, Instagram, Mail } from 'lucide-react';

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className="modern-footer">
      <motion.div
        className="modern-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Main Footer Content */}
        <div className="modern-footer-content">
          <motion.div className="modern-footer-section" variants={itemVariants}>
            <h3 className="modern-footer-title">
              <Heart className="footer-heart-icon" />
              Austin & Jordyn
            </h3>
            <p className="modern-footer-subtitle">
              Thank you for celebrating our love story with us
            </p>
          </motion.div>

          <motion.div className="modern-footer-section" variants={itemVariants}>
            <h4 className="modern-footer-heading">Stay Connected</h4>
            <div className="modern-footer-social">
              <a
                href="mailto:austin@theporadas.com"
                className="modern-social-link"
                aria-label="Email us"
              >
                <Mail size={20} />
                <span>Email</span>
              </a>
              <a href="#" className="modern-social-link" aria-label="Follow on Instagram">
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
              <a href="#" className="modern-social-link" aria-label="Follow on Facebook">
                <Facebook size={20} />
                <span>Facebook</span>
              </a>
            </div>
          </motion.div>

          <motion.div className="modern-footer-section" variants={itemVariants}>
            <h4 className="modern-footer-heading">Wedding Day</h4>
            <p className="modern-footer-date">October 21st, 2023</p>
            <p className="modern-footer-description">
              A celebration of love, laughter, and new beginnings
            </p>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div className="modern-footer-bottom" variants={itemVariants}>
          <div className="modern-footer-divider"></div>
          <p className="modern-footer-copyright">
            © {currentYear} Austin & Jordyn Porada. Made with{' '}
            <Heart className="inline-heart" size={16} /> for our family and friends.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default ModernFooter;
