import React, { useState } from 'react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { BottomTabBar } from './BottomTabBar';
import { Footer } from './Footer';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { products } from '../../data/products';
import { services } from '../../data/services';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Layout.module.scss';

export const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredServices = searchQuery.trim()
    ? services.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const location = useLocation();

  const isDetailOrFlowPage = 
    (location.pathname.startsWith('/services/') && location.pathname !== '/services') ||
    (location.pathname.startsWith('/shop/') && location.pathname !== '/shop') ||
    location.pathname.startsWith('/orders/') ||
    location.pathname === '/book' ||
    location.pathname === '/checkout';

  return (
    <div className={styles.root}>
      <div className={clsx(styles.headerContainer, isDetailOrFlowPage && styles.hideOnMobile)}>
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className={styles.main}>{children}</main>

      <Footer />

      {!isDetailOrFlowPage && <BottomTabBar />}

      {/* Global Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
        title="Search Plants & Services"
      >
        <div className={styles.searchModalContent}>
          <Input
            autoFocus
            placeholder="Search plants, pots, fertilizers, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery.trim() && (
            <div className={styles.searchResults}>
              {filteredServices.length > 0 && (
                <div>
                  <h4 className={styles.categoryTitle}>Services</h4>
                  <div className={styles.itemList}>
                    {filteredServices.map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={styles.serviceItem}
                      >
                        <span className={styles.serviceTitle}>{service.title}</span>
                        <span className={styles.servicePrice}>{service.priceDisplay}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div>
                  <h4 className={styles.categoryTitle}>Products</h4>
                  <div className={styles.itemList}>
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/shop/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={styles.productItem}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.productThumb}
                        />
                        <div className={styles.productInfo}>
                          <p className={styles.productName}>{product.name}</p>
                          <span className={styles.productPrice}>₹{product.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredServices.length === 0 && filteredProducts.length === 0 && (
                <div className={styles.noResults}>
                  No matching services or plants found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Layout;
