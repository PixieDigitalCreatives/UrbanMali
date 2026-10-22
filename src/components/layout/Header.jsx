import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LogoMark } from '../ui/LogoMark';
import { siteConfig } from '../../data/siteConfig';
import { useCart } from '../../context/CartContext';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import styles from './Header.module.scss';

export function Header({ onOpenMobileMenu, onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { totalCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={clsx(styles.header, isScrolled && styles.isScrolled)}>
      <div className={styles.inner}>
        {/* Mobile Left: Hamburger (Crop 02) */}
        <div className={styles.mobileMenuTrigger}>
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className={styles.iconButton}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Brand Logo */}
        <div className={styles.logoWrapper}>
          <LogoMark variant="dark" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className={styles.nav}>
          {siteConfig.navLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              (link.href !== '/' && location.pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                to={link.href}
                className={clsx(styles.navLink, isActive && styles.isActive)}
              >
                {link.label}
                {isActive && <span className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className={styles.iconButton}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart with Item Count Badge */}
          <Link
            to="/cart"
            className={styles.iconButton}
            aria-label={`Shopping cart with ${totalCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className={styles.cartBadge}>{totalCount}</span>
          </Link>

          {/* Desktop "Book a Service" Button */}
          <Link to="/book" className={styles.bookButton}>
            Book a Service
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
