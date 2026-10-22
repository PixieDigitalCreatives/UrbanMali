import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LogoMark } from '../ui/LogoMark';
import { siteConfig } from '../../data/siteConfig';
import { useCart } from '../../context/CartContext';
import { ArrowUpRight, Search, ShoppingBag } from 'lucide-react';
import styles from './Header.module.scss';

export function Header({ onOpenMobileMenu, onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();
  const { totalCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      // tuck the bar away while reading downwards, bring it back on the way up
      if (Math.abs(y - lastY.current) > 6) {
        setIsHidden(y > lastY.current && y > 420);
        lastY.current = y;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsHidden(false), [location.pathname]);

  return (
    <>
      <header className={clsx(styles.header, isScrolled && styles.isScrolled, isHidden && styles.isHidden)}>
        <div className={styles.inner}>
          {/* Brand Logo */}
          <div className={styles.logoWrapper}>
            <LogoMark variant="dark" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className={styles.nav} aria-label="Primary">
            {siteConfig.navLinks.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href !== '/' && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={clsx(styles.navLink, isActive && styles.isActive)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.navMask}>
                    <span className={styles.navText} data-text={link.label}>
                      {link.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className={styles.actions}>
            <button type="button" onClick={onOpenSearch} className={styles.iconButton} aria-label="Search">
              <Search strokeWidth={1.6} />
            </button>

            <Link to="/cart" className={styles.iconButton} aria-label={`Shopping cart with ${totalCount} items`}>
              <ShoppingBag strokeWidth={1.6} />
              <span className={clsx(styles.cartBadge, totalCount > 0 && styles.hasItems)}>{totalCount}</span>
            </Link>

            <Link to="/book" className={styles.bookButton} data-magnetic="0.25">
              <span>Book a Service</span>
              <span className={styles.bookIcon} aria-hidden="true">
                <ArrowUpRight strokeWidth={2} />
              </span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className={styles.menuButton}
              aria-label="Open menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div className={styles.spacer} aria-hidden="true" />
    </>
  );
}

export default Header;
