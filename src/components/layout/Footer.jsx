import React from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from '../ui/LogoMark';
import { siteConfig, getWhatsAppUrl } from '../../data/siteConfig';
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <LogoMark variant="light" />
            <p className={styles.brandDesc}>
              Your urban gardening and plant-care partner for homes, societies, offices and more.
              Nursery partners, local experienced maalis, and simple transparent booking.
            </p>
            {/* Social Icons */}
            <div className={styles.socialLinks}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialButton}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialButton}
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialButton}
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 1: Services */}
          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/services/plant-maintenance" className={styles.footerLink}>
                  Garden Maintenance
                </Link>
              </li>
              <li>
                <Link to="/services/maintenance-addon" className={styles.footerLink}>
                  Maintenance Add-on
                </Link>
              </li>
              <li>
                <Link to="/services/nursery-delivery" className={styles.footerLink}>
                  Plant Nursery Delivery
                </Link>
              </li>
              <li>
                <Link to="/services/balcony-makeover" className={styles.footerLink}>
                  Balcony Makeover
                </Link>
              </li>
              <li>
                <Link to="/services/irrigation-setup" className={styles.footerLink}>
                  Irrigation Setup
                </Link>
              </li>
              <li>
                <Link to="/services/society-office-maintenance" className={styles.footerLink}>
                  Society & Office Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Shop & Plans */}
          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>Shop & Plans</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/shop" className={styles.footerLink}>
                  Indoor Plants
                </Link>
              </li>
              <li>
                <Link to="/shop" className={styles.footerLink}>
                  Balcony Varieties
                </Link>
              </li>
              <li>
                <Link to="/shop" className={styles.footerLink}>
                  Ceramic & Clay Pots
                </Link>
              </li>
              <li>
                <Link to="/shop" className={styles.footerLink}>
                  Organic Compost
                </Link>
              </li>
              <li>
                <Link to="/plans" className={styles.footerLink}>
                  Home Care Plans
                </Link>
              </li>
              <li>
                <Link to="/plans" className={styles.footerLink}>
                  Society Landscape Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>Contact</h4>
            <div className={styles.contactList}>
              <a href={`tel:${siteConfig.phone}`} className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <span>{siteConfig.phoneDisplay}</span>
              </a>
              <a href={`mailto:${siteConfig.email}`} className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <span>{siteConfig.email}</span>
              </a>
              <div className={styles.contactAddress}>
                <MapPin className={styles.contactIconAddress} />
                <span>{siteConfig.address}</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappPill}
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} The UrbanMaali. All rights reserved.</p>
          <div className={styles.legalLinks}>
            {siteConfig.legalLinks.map((link) => (
              <Link key={link.label} to={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
            <Link to="/design-system" className={styles.specLink}>
              Design System Spec
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
