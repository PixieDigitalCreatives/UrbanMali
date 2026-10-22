import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { siteConfig, getWhatsAppUrl } from '../../data/siteConfig';
import { useCart } from '../../context/CartContext';
import { Home, Sparkles, Store, Phone, MessageSquare, ShoppingBag } from 'lucide-react';
import styles from './BottomTabBar.module.scss';

export const BottomTabBar = () => {
  const location = useLocation();
  const { totalCount } = useCart();
  const isShopRelated =
    location.pathname.startsWith('/shop') ||
    location.pathname === '/cart' ||
    location.pathname === '/checkout';

  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      {/* 1. Home */}
      <Link
        to="/"
        className={clsx(styles.tabLink, location.pathname === '/' && styles.isActive)}
      >
        <Home className={clsx('w-5 h-5', location.pathname === '/' ? 'stroke-[2.5px]' : 'stroke-[1.5px]')} />
        <span className={styles.label}>Home</span>
      </Link>

      {/* 2. Services or Shop */}
      {!isShopRelated ? (
        <Link
          to="/services"
          className={clsx(styles.tabLink, location.pathname.startsWith('/services') && styles.isActive)}
        >
          <Sparkles className={clsx('w-5 h-5', location.pathname.startsWith('/services') ? 'stroke-[2.5px]' : 'stroke-[1.5px]')} />
          <span className={styles.label}>Services</span>
        </Link>
      ) : (
        <Link
          to="/shop"
          className={clsx(styles.tabLink, location.pathname === '/shop' && styles.isActive)}
        >
          <Store className={clsx('w-5 h-5', location.pathname === '/shop' ? 'stroke-[2.5px]' : 'stroke-[1.5px]')} />
          <span className={styles.label}>Shop</span>
        </Link>
      )}

      {/* 3. Shop or Cart */}
      {!isShopRelated ? (
        <Link
          to="/shop"
          className={clsx(styles.tabLink, location.pathname.startsWith('/shop') && styles.isActive)}
        >
          <Store className={clsx('w-5 h-5', location.pathname.startsWith('/shop') ? 'stroke-[2.5px]' : 'stroke-[1.5px]')} />
          <span className={styles.label}>Shop</span>
        </Link>
      ) : (
        <Link
          to="/cart"
          className={clsx(styles.tabLink, location.pathname === '/cart' && styles.isActive)}
        >
          <ShoppingBag className={clsx('w-5 h-5', location.pathname === '/cart' ? 'stroke-[2.5px]' : 'stroke-[1.5px]')} />
          {totalCount > 0 && (
            <span className={styles.badge}>{totalCount}</span>
          )}
          <span className={styles.label}>Cart</span>
        </Link>
      )}

      {/* 4. Call */}
      <a
        href={`tel:${siteConfig.phone}`}
        className={styles.tabLink}
      >
        <Phone className="w-5 h-5 stroke-[1.5px]" />
        <span className={styles.label}>Call</span>
      </a>

      {/* 5. WhatsApp */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(styles.tabLink, styles.whatsappTab)}
      >
        <MessageSquare className="w-5 h-5 stroke-[2.2px]" />
        <span className={styles.label}>WhatsApp</span>
      </a>
    </nav>
  );
};

export default BottomTabBar;
