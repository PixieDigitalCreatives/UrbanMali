import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LogoMark } from '../ui/LogoMark';
import { siteConfig, getWhatsAppUrl } from '../../data/siteConfig';
import { X, Phone, MessageSquare, ArrowUpRight } from 'lucide-react';
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

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Menu">
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      <div className={styles.drawer} data-lenis-prevent>
        <div className={styles.header}>
          <LogoMark variant="light" />
          <button onClick={onClose} className={styles.closeButton} aria-label="Close menu">
            <X strokeWidth={1.6} />
          </button>
        </div>

        <nav className={styles.nav}>
          {[{ label: 'Home', href: '/' }, ...siteConfig.navLinks].map((link, i) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={onClose}
                className={clsx(styles.navLink, isActive && styles.isActive)}
                style={{ '--i': i }}
              >
                <span className={styles.navIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.navLabel}>{link.label}</span>
                <ArrowUpRight className={styles.chevron} strokeWidth={1.5} />
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Link to="/book" onClick={onClose} className={styles.bookButton}>
            Book a Service
          </Link>
          <div className={styles.row}>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
              <MessageSquare strokeWidth={1.6} />
              <span>WhatsApp</span>
            </a>
            <a href={`tel:${siteConfig.phone}`} className={styles.callButton}>
              <Phone strokeWidth={1.6} />
              <span>Call us</span>
            </a>
          </div>
          <p className={styles.meta}>{siteConfig.workingHours}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
