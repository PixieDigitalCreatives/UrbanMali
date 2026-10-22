import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFromStorage, STORAGE_KEYS } from '../lib/storage';
import { Button } from '../components/ui/Button';
import { getWhatsAppUrl } from '../data/siteConfig';
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  MessageSquare,
} from 'lucide-react';
import styles from './OrderConfirmationPage.module.scss';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const lastOrder = getFromStorage(STORAGE_KEYS.LAST_ORDER, null);

  const orderId = lastOrder?.orderId || id || 'UMO-2610-0001';
  const items = lastOrder?.items || [];
  const grandTotal = lastOrder?.total || 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Success Icon */}
        <div className={styles.iconWrap}>
          <CheckCircle2 style={{ width: '32px', height: '32px' }} />
        </div>

        <span className={styles.metaLabel}>
          Thank you for your order!
        </span>
        <h1 className={styles.heading}>
          Order Confirmed
        </h1>

        {/* Order Reference Badge */}
        <div className={styles.orderBadge}>
          Order ID: {orderId}
        </div>

        <p className={styles.subText}>
          We've received your order and our nursery partners are carefully packing your plants for safe transit.
        </p>

        {/* Live Delivery Status Tracker */}
        <div className={styles.card}>
          <h3 className={styles.cardSectionTitle}>
            Delivery Status
          </h3>
          <div className={styles.statusGrid}>
            <div className={styles.statusStep}>
              <div className={`${styles.statusIcon} ${styles.active}`}>
                <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--moss, #3F5B34)' }}>Confirmed</span>
            </div>
            <div className={styles.statusStep}>
              <div className={`${styles.statusIcon} ${styles.ready}`}>
                <Package style={{ width: '16px', height: '16px' }} />
              </div>
              <span style={{ color: 'var(--clay, #8B6B4A)' }}>Packed</span>
            </div>
            <div className={styles.statusStep}>
              <div className={`${styles.statusIcon} ${styles.pending}`}>
                <Truck style={{ width: '16px', height: '16px' }} />
              </div>
              <span style={{ color: 'var(--clay, #8B6B4A)' }}>On the way</span>
            </div>
            <div className={styles.statusStep}>
              <div className={`${styles.statusIcon} ${styles.pending}`}>
                <Home style={{ width: '16px', height: '16px' }} />
              </div>
              <span style={{ color: 'var(--clay, #8B6B4A)' }}>Delivered</span>
            </div>
          </div>
        </div>

        {/* Ordered Items Summary */}
        {items.length > 0 && (
          <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 className={styles.cardSectionTitle} style={{ paddingBottom: '0.5rem', borderBottom: '1px solid rgba(230, 216, 189, 0.5)' }}>
              Items Ordered
            </h3>
            {items.map((it) => (
              <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.375rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={it.image} alt={it.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--soil, #2B2118)', display: 'block' }}>{it.name}</span>
                    <span style={{ color: 'var(--clay, #8B6B4A)', fontSize: '12px' }}>{it.size} × {it.quantity}</span>
                  </div>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--soil, #2B2118)' }}>₹{it.price * it.quantity}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(230, 216, 189, 0.5)', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--soil, #2B2118)' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--moss, #3F5B34)', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>₹{grandTotal}</span>
            </div>
          </div>
        )}

        {/* WhatsApp Support CTA */}
        <div style={{ width: '100%', marginTop: '1.5rem' }}>
          <a
            href={getWhatsAppUrl(`Hi UrbanMaali, I need an update on my order ID ${orderId}.`)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: '100%', display: 'block' }}
          >
            <Button
              variant="outline"
              size="lg"
              fullWidth
              icon={<MessageSquare style={{ width: '20px', height: '20px', color: '#3F5B34' }} />}
            >
              Need Help? Chat on WhatsApp
            </Button>
          </a>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--moss, #3F5B34)', textDecoration: 'none' }}>
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
