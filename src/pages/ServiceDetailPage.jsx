import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { services } from '../data/services';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { QuoteModal } from '../components/common/QuoteModal';
import { getWhatsAppUrl } from '../data/siteConfig';
import { ArrowLeft, Clock, Check, MessageSquare, ShoppingBag, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './ServiceDetailPage.module.scss';

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const service = services.find((s) => s.slug === slug) || services[0];

  const handleBooking = () => {
    if (service.isQuoteOnly) {
      setQuoteOpen(true);
    } else {
      navigate(`/book?service=${service.id}`);
    }
  };

  return (
    <div className={styles.page}>
      {/* Mobile Top Navigation Bar */}
      <div className={styles.mobileTopNav}>
        <button
          onClick={() => navigate(-1)}
          className={styles.iconBtn}
          aria-label="Go back"
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <h1 className={styles.mobileTitle}>
          Service Details
        </h1>
        <Link
          to="/cart"
          className={styles.cartLink}
          aria-label="View cart"
        >
          <ShoppingBag style={{ width: '20px', height: '20px' }} />
          {totalCount > 0 && (
            <span className={styles.cartBadge}>
              {totalCount}
            </span>
          )}
        </Link>
      </div>

      {/* Main Container */}
      <div className={styles.container}>
        {/* Desktop Breadcrumb Navigation */}
        <div className={styles.breadcrumbs}>
          <Link to="/">Home</Link>
          <ChevronRight style={{ width: '14px', height: '14px', color: '#E6D8BD' }} />
          <Link to="/services">Services</Link>
          <ChevronRight style={{ width: '14px', height: '14px', color: '#E6D8BD' }} />
          <span className={styles.currentCrumb}>{service.title}</span>
        </div>

        <div className={styles.detailGrid}>
          {/* Left Column: Photo & Media Card */}
          <div className={styles.mediaCol}>
            <div className={styles.imageFrame}>
              <img
                src={service.image}
                alt={service.title}
              />
              <div className={styles.illustrativeBadge}>
                <Badge variant="illustrative">Illustrative image</Badge>
              </div>
            </div>

            {/* Trust feature pills */}
            <div className={styles.trustPills}>
              <div className={styles.trustPill}>
                <ShieldCheck style={{ width: '20px', height: '20px', color: '#3F5B34', flexShrink: 0 }} />
                <span>Verified Local Maalis</span>
              </div>
              <div className={styles.trustPill}>
                <Clock style={{ width: '20px', height: '20px', color: '#3F5B34', flexShrink: 0 }} />
                <span>Transparent Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Inclusions, and Booking Actions */}
          <div className={styles.infoCol}>
            <div>
              <h1 className={styles.mainHeading}>
                {service.title}
              </h1>
              <p className={styles.serviceSub}>
                {service.subtitle}
              </p>
            </div>

            {/* Price Row */}
            <div className={styles.priceCard}>
              <span className={styles.priceDisplay}>
                {service.priceDisplay}
              </span>
              {service.priceNote && (
                <span className={styles.priceBadge}>
                  {service.priceNote}
                </span>
              )}
            </div>

            {/* Duration Row */}
            <div className={styles.durationRow}>
              <div className={styles.durationIconWrap}>
                <Clock style={{ width: '16px', height: '16px' }} />
              </div>
              <div className={styles.durationMeta}>
                <span className={styles.durationLabel}>Duration</span>
                <span className={styles.durationValue}>{service.duration}</span>
              </div>
            </div>

            {/* What's Included */}
            <div className={styles.inclusionSection}>
              <h3 className={styles.sectionLabel}>
                What's included
              </h3>
              <ul className={styles.inclusionList}>
                {service.included.map((item, index) => (
                  <li key={index} className={styles.inclusionItem}>
                    <div className={styles.checkCircle}>
                      <Check style={{ width: '12px', height: '12px', strokeWidth: 3 }} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Not Included */}
            <div className={styles.notIncludedSection}>
              <h3 className={styles.notIncludedLabel}>
                What's not included
              </h3>
              <ul className={styles.inclusionList}>
                {service.notIncluded.map((item, index) => (
                  <li key={index} className={styles.notIncludedItem}>
                    <span className={styles.bulletDot} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Action Buttons */}
            <div className={styles.desktopActions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleBooking}
                style={{ height: '56px', fontSize: '1rem', fontWeight: 600, flex: 1 }}
              >
                {service.isQuoteOnly ? 'Request a quote' : 'Book this service'}
              </Button>
              <a
                href={getWhatsAppUrl(`Hi UrbanMaali, I'd like to ask about ${service.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  style={{ height: '56px', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
                  icon={<MessageSquare style={{ width: '20px', height: '20px', color: '#3F5B34' }} />}
                >
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className={styles.mobileBottomBar}>
        <Button
          variant="primary"
          size="pill"
          fullWidth
          onClick={handleBooking}
          style={{ flex: 1 }}
        >
          {service.isQuoteOnly ? 'Request a quote' : 'Book this service'}
        </Button>
        <a
          href={getWhatsAppUrl(`Hi UrbanMaali, I'd like to ask about ${service.title}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileWhatsappBtn}
          aria-label="Enquire on WhatsApp"
        >
          <MessageSquare style={{ width: '20px', height: '20px' }} />
        </a>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        serviceOrPlanTitle={service.title}
      />
    </div>
  );
};
