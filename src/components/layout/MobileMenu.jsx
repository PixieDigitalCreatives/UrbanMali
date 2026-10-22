import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LogoMark } from '../ui/LogoMark';
import { siteConfig, getWhatsAppUrl } from '../../data/siteConfig';
import { X, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import styles from './MobileMenu.module.scss';

export const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Beige Drawer */}
      <div className={styles.drawer}>
        <div>
          {/* Header */}
          <div className={styles.header}>
            <LogoMark variant="dark" />
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className={styles.nav}>
            {siteConfig.navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={onClose}
                  className={clsx(styles.navLink, isActive && styles.isActive)}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={styles.chevron} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <Link
            to="/book"
            onClick={onClose}
            className={styles.bookButton}
          >
            Book a Service
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href={`tel:${siteConfig.phone}`}
            className={styles.callButton}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {siteConfig.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
