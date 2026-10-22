import React from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from '../ui/LogoMark';
import { siteConfig, getWhatsAppUrl } from '../../data/siteConfig';
import { Instagram, Facebook, Youtube, ArrowUpRight, ArrowUp } from 'lucide-react';
import styles from './Footer.module.scss';

const serviceLinks = [
  { label: 'Garden Maintenance', href: '/services/plant-maintenance' },
  { label: 'Balcony Makeover', href: '/services/balcony-makeover' },
  { label: 'Irrigation Setup', href: '/services/irrigation-setup' },
  { label: 'Society & Office Care', href: '/services/society-office-maintenance' },
];

const shopLinks = [
  { label: 'Indoor Plants', href: '/shop' },
  { label: 'Pots & Planters', href: '/shop' },
  { label: 'Organic Compost', href: '/shop' },
  { label: 'Care Plans', href: '/plans' },
];

export function Footer() {
  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Slim call to action */}
        <div className={styles.cta}>
          <h2 className={styles.ctaHeading}>
            Ready to bring <em>nature</em> home?
          </h2>
          <div className={styles.ctaActions}>
            <Link to="/book" className={styles.ctaButton} data-magnetic="0.25">
              Book a Service
              <span className={styles.ctaIcon} aria-hidden="true">
                <ArrowUpRight strokeWidth={2} />
              </span>
            </Link>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className={styles.ctaLink}>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <LogoMark variant="light" />
            <p className={styles.brandDesc}>
              Local maalis, nursery-fresh plants and simple booking for homes, societies and offices.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialButton} aria-label="Instagram">
                <Instagram strokeWidth={1.6} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialButton} aria-label="Facebook">
                <Facebook strokeWidth={1.6} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={styles.socialButton} aria-label="YouTube">
                <Youtube strokeWidth={1.6} />
              </a>
            </div>
          </div>

          <nav className={styles.navCol} aria-label="Services">
            <h4 className={styles.colTitle}>Services</h4>
            {serviceLinks.map((link) => (
              <Link key={link.label} to={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className={styles.navCol} aria-label="Shop and plans">
            <h4 className={styles.colTitle}>Shop & Plans</h4>
            {shopLinks.map((link) => (
              <Link key={link.label} to={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>Contact</h4>
            <a href={`tel:${siteConfig.phone}`} className={styles.footerLink}>
              {siteConfig.phoneDisplay}
            </a>
            <a href={`mailto:${siteConfig.email}`} className={styles.footerLink}>
              {siteConfig.email}
            </a>
            <address className={styles.address}>{siteConfig.address}</address>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} The UrbanMaali</p>
          <div className={styles.legalLinks}>
            {siteConfig.legalLinks.map((link) => (
              <Link key={link.label} to={link.href} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
            <Link to="/design-system" className={styles.legalLink}>
              Design System
            </Link>
          </div>
          <button type="button" onClick={toTop} className={styles.toTop} aria-label="Back to top">
            <ArrowUp strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
