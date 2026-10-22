import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { PincodeField } from '../components/ui/PincodeField';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sprout,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import styles from './CartPage.module.scss';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, subtotal, totalCount } = useCart();

  return (
    <div className={styles.page}>
      {/* Top Header */}
      <div className={styles.topBar}>
        <button
          onClick={() => navigate(-1)}
          className={styles.backBtn}
          aria-label="Back"
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <h1 className={styles.title}>Cart</h1>
        <div className={styles.cartIconWrap}>
          <ShoppingBag style={{ width: '20px', height: '20px' }} />
          {totalCount > 0 && (
            <span className={styles.cartCountBadge}>
              {totalCount}
            </span>
          )}
        </div>
      </div>

      <div className={styles.container}>
        {items.length > 0 ? (
          <div>
            {/* Cart Items List Container */}
            <div className={styles.itemsContainer}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  {/* 56px Square Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />

                  {/* Item Details */}
                  <div className={styles.itemMeta}>
                    <h3 className={styles.itemName}>
                      {item.name}
                    </h3>
                    <span className={styles.itemSize}>
                      {item.size}
                    </span>
                    <span className={styles.itemPrice}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className={styles.stepper}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.stepperBtn}
                      aria-label="Decrease quantity"
                    >
                      <Minus style={{ width: '16px', height: '16px' }} />
                    </button>
                    <span className={styles.stepperCount}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.stepperBtn}
                      aria-label="Increase quantity"
                    >
                      <Plus style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>

                  {/* Trash Icon */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className={styles.trashBtn}
                    aria-label="Remove item"
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Pincode Delivery Check */}
            <div className={styles.pincodeCard}>
              <label className={styles.pincodeLabel}>
                Apply pincode to check delivery
              </label>
              <PincodeField compact buttonText="Check" placeholder="Enter delivery pincode" />
            </div>

            {/* Order Summary & Math */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({totalCount} items)</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--soil, #0E3529)' }}>
                  ₹{subtotal}
                </span>
              </div>
              <div className={`${styles.summaryRow} ${styles.muted}`}>
                <span>Delivery Charges</span>
                <span style={{ fontWeight: 500, color: 'var(--moss, #1F5E46)' }}>Calculated at checkout</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total Amount</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--moss, #1F5E46)' }}>
                  ₹{subtotal}
                </span>
              </div>

              {/* Moss full-width Proceed to Checkout */}
              <div style={{ marginTop: '1rem' }}>
                <Link to="/checkout" style={{ width: '100%', display: 'block' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    style={{ height: '56px', fontWeight: 600, fontSize: '1rem' }}
                    icon={<ArrowRight style={{ width: '20px', height: '20px' }} />}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '12px', color: 'var(--clay, #5F7268)', marginTop: '0.5rem' }}>
                <ShieldCheck style={{ width: '16px', height: '16px', color: '#1F5E46' }} />
                <span>100% Safe transit guarantee & doorstep plant check</span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className={styles.emptyCard}>
            <div className={styles.emptyIconWrap}>
              <Sprout style={{ width: '32px', height: '32px' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--soil, #0E3529)' }}>
              Your cart is empty
            </h2>
            <p style={{ color: 'var(--clay, #5F7268)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
              Looks like you haven't added any healthy plants or care essentials yet.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="md">
                Browse the Shop
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
