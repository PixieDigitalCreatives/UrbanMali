import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { PincodeField } from '../components/ui/PincodeField';
import { ProductCard } from '../components/cards/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getWhatsAppUrl } from '../data/siteConfig';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Sun,
  Droplets,
  Sparkles,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import styles from './ProductDetailPage.module.scss';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, totalCount } = useCart();
  const { showToast } = useToast();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0] || { size: 'Medium', price: product.price }
  );
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [careAccordionOpen, setCareAccordionOpen] = useState(true);
  const [deliveryAccordionOpen, setDeliveryAccordionOpen] = useState(false);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      image: product.image,
    });
    showToast(`Added ${quantity} ${product.name} to cart!`, 'success', 'View Cart', () => {
      navigate('/cart');
    });
  };

  return (
    <div className={styles.page}>
      {/* Mobile Top Bar */}
      <div className={styles.mobileTopNav}>
        <button
          onClick={() => navigate(-1)}
          className={styles.iconBtn}
          aria-label="Back"
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <h1 className={styles.mobileTitle}>Product Details</h1>
        <Link to="/cart" className={styles.cartLink} aria-label="Cart">
          <ShoppingBag style={{ width: '20px', height: '20px' }} />
          {totalCount > 0 && (
            <span className={styles.cartBadge}>
              {totalCount}
            </span>
          )}
        </Link>
      </div>

      <div className={styles.container}>
        {/* Desktop Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <Link to="/">Home</Link>
          <ChevronRight style={{ width: '14px', height: '14px', opacity: 0.4 }} />
          <Link to="/shop">Shop</Link>
          <ChevronRight style={{ width: '14px', height: '14px', opacity: 0.4 }} />
          <span className={styles.currentCrumb}>{product.name}</span>
        </div>

        <div className={styles.detailGrid}>
          {/* Left Column: Gallery */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImageFrame} data-reveal="image" data-creeper="climb" data-creeper-side="left" data-creeper-span="0.85">
              <img
                src={product.image}
                alt={product.name}
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`${styles.wishlistBtn} ${isLiked ? styles.liked : ''}`}
                aria-label="Wishlist"
              >
                <Heart style={{ width: '20px', height: '20px', fill: isLiked ? 'currentColor' : 'none' }} />
              </button>
              <div className={styles.illustrativeBadge}>
                <Badge variant="illustrative">Illustrative image</Badge>
              </div>
            </div>

            {/* 4 Thumbnails */}
            <div className={styles.thumbnailStrip} data-reveal="up" data-reveal-delay="0.3">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveThumb(idx)}
                  className={`${styles.thumbnailBtn} ${activeThumb === idx ? styles.activeThumb : ''}`}
                >
                  <img src={product.image} alt="Thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information, Selection & Actions */}
          <div className={styles.infoCol} data-reveal-group data-reveal-stagger="0.07">
            <div data-reveal-item>
              <div className={styles.categoryStockRow}>
                <span>{product.category}</span>
                <Badge variant="stock">In stock</Badge>
              </div>
              <h1 className={styles.productTitle}>
                {product.name}
              </h1>
              <p className={styles.productSubtitle}>
                {product.subtitle}
              </p>
            </div>

            {/* Price */}
            <div className={styles.priceRow} data-reveal-item>
              <span className={styles.priceText}>
                ₹{selectedVariant.price}
              </span>
              <span className={styles.taxText}>Inclusive of all taxes</span>
            </div>

            {/* Care Row */}
            <div className={styles.careGrid} data-reveal-item>
              <div className={styles.careItem}>
                <div className={styles.careIconWrap}>
                  <Sun style={{ width: '16px', height: '16px', color: '#0E3529' }} />
                </div>
                <span className={styles.careLabel}>{product.sunlight}</span>
              </div>
              <div className={styles.careItem}>
                <div className={styles.careIconWrap}>
                  <Droplets style={{ width: '16px', height: '16px', color: '#0E3529' }} />
                </div>
                <span className={styles.careLabel}>{product.watering}</span>
              </div>
              <div className={styles.careItem}>
                <div className={styles.careIconWrap}>
                  <Sparkles style={{ width: '16px', height: '16px', color: '#0E3529' }} />
                </div>
                <span className={styles.careLabel}>{product.careLevel}</span>
              </div>
            </div>

            {/* Size Selector */}
            {product.variants.length > 1 && (
              <div>
                <label className={styles.sectionLabel}>
                  Select Size
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.variants.map((v) => (
                    <Chip
                      key={v.size}
                      selected={selectedVariant.size === v.size}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.size} (₹{v.price})
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div>
              <label className={styles.sectionLabel}>
                Quantity
              </label>
              <div className={styles.stepperContainer}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.stepperBtn}
                  aria-label="Decrease quantity"
                >
                  <Minus style={{ width: '16px', height: '16px' }} />
                </button>
                <span className={styles.stepperCount}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={styles.stepperBtn}
                  aria-label="Increase quantity"
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className={styles.desktopActions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                icon={<ShoppingBag style={{ width: '20px', height: '20px' }} />}
                style={{ flex: 1, height: '56px' }}
              >
                Add to Cart
              </Button>
              <a
                href={getWhatsAppUrl(`Hi UrbanMaali, I'd like to ask about ${product.name} (${selectedVariant.size}).`)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={<MessageSquare style={{ width: '20px', height: '20px', color: '#1F5E46' }} />}
                  style={{ height: '56px' }}
                >
                  Enquire on WhatsApp
                </Button>
              </a>
            </div>

            {/* Pincode Delivery Check */}
            <div className={styles.pincodeSection}>
              <span className={styles.pincodeTitle}>Check Delivery Availability</span>
              <PincodeField compact buttonText="Check" placeholder="Enter pincode" />
            </div>

            {/* Accordions */}
            <div className={styles.accordionGroup}>
              <div className={styles.accordionItem}>
                <button
                  onClick={() => setCareAccordionOpen(!careAccordionOpen)}
                  className={styles.accordionHeader}
                >
                  <span>Plant Care Instructions</span>
                  <ChevronDown className={`${styles.accordionIcon} ${careAccordionOpen ? styles.open : ''}`} />
                </button>
                {careAccordionOpen && (
                  <div className={styles.accordionBody}>
                    Keep in indirect natural light. Allow the top 1–2 inches of soil to dry before watering. Feed with organic compost once every month.
                  </div>
                )}
              </div>

              <div className={styles.accordionItem}>
                <button
                  onClick={() => setDeliveryAccordionOpen(!deliveryAccordionOpen)}
                  className={styles.accordionHeader}
                >
                  <span>Delivery & Replacement Policy</span>
                  <ChevronDown className={`${styles.accordionIcon} ${deliveryAccordionOpen ? styles.open : ''}`} />
                </button>
                {deliveryAccordionOpen && (
                  <div className={styles.accordionBody}>
                    Hand-delivered in eco-friendly packaging within 24–48 hours across NCR. Transit damage replacement guaranteed within 48 hours.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle} data-reveal="up">
              You may also <em>like</em>
            </h2>
            <div className={styles.relatedGrid} data-reveal-group>
              {relatedProducts.map((rel) => (
                <div key={rel.id} data-reveal-item>
                  <ProductCard product={rel} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className={styles.mobileBottomBar}>
        <Button
          variant="primary"
          size="pill"
          fullWidth
          onClick={handleAddToCart}
          icon={<ShoppingBag style={{ width: '16px', height: '16px' }} />}
          style={{ height: '48px', fontSize: '0.875rem' }}
        >
          Add to Cart
        </Button>
        <a
          href={getWhatsAppUrl(`Hi UrbanMaali, I'd like to ask about ${product.name} (${selectedVariant.size}).`)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ width: '100%' }}
        >
          <Button
            variant="outline"
            size="pill"
            fullWidth
            icon={<MessageSquare style={{ width: '16px', height: '16px', color: '#1F5E46' }} />}
            style={{ height: '48px', fontSize: '0.875rem', borderColor: 'rgba(31, 94, 70, 0.6)', color: '#0E3529' }}
          >
            Enquire on WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
};
