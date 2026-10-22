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
          <ChevronRight style={{ width: '14px', height: '14px', opacity: 0.4 }} />
          <Link to="/services">Services</Link>
          <ChevronRight style={{ width: '14px', height: '14px', opacity: 0.4 }} />
          <span className={styles.currentCrumb}>{service.title}</span>
        </div>

        <div className={styles.detailGrid}>
          {/* Left Column: Photo & Media Card */}
          <div className={styles.mediaCol}>
            <div className={styles.imageFrame} data-reveal="image" data-creeper="arch" data-creeper-span="0.6">
              <img
                src={service.image}
                alt={service.title}
                data-parallax="5"
              />
              <div className={styles.illustrativeBadge}>
                <Badge variant="illustrative">Illustrative image</Badge>
              </div>
            </div>

            {/* Trust feature pills */}
            <div className={styles.trustPills} data-reveal="up" data-reveal-delay="0.3">
              <div className={styles.trustPill}>
                <ShieldCheck strokeWidth={1.5} className={styles.trustIcon} />
                <span>Verified Local Maalis</span>
              </div>
              <div className={styles.trustPill}>
                <Clock strokeWidth={1.5} className={styles.trustIcon} />
                <span>Transparent Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Inclusions, and Booking Actions */}
          <div className={styles.infoCol} data-reveal-group data-reveal-stagger="0.08">
            <div data-reveal-item>
              <span className={styles.eyebrow}>Service</span>
              <h1 className={styles.mainHeading}>
                {service.title}
              </h1>
              <p className={styles.serviceSub}>
                {service.subtitle}
              </p>
            </div>

            {/* Price Row */}
            <div className={styles.priceCard} data-reveal-item>
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
            <div className={styles.durationRow} data-reveal-item>
              <div className={styles.durationIconWrap}>
                <Clock style={{ width: '16px', height: '16px' }} />
              </div>
              <div className={styles.durationMeta}>
                <span className={styles.durationLabel}>Duration</span>
                <span className={styles.durationValue}>{service.duration}</span>
              </div>
            </div>

            {/* What's Included */}
            <div className={styles.inclusionSection} data-reveal-item>
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
            <div className={styles.notIncludedSection} data-reveal-item>
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
            <div className={styles.desktopActions} data-reveal-item>
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
                  icon={<MessageSquare style={{ width: '20px', height: '20px' }} />}
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
