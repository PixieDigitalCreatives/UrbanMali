import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlobImage } from '../components/ui/BlobImage';
import { PincodeField } from '../components/ui/PincodeField';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TrustStrip } from '../components/home/TrustStrip';
import { ServiceCard } from '../components/cards/ServiceCard';
import { PlanCard } from '../components/cards/PlanCard';
import { ProductCard } from '../components/cards/ProductCard';
import { WhoWeServeSection } from '../components/home/WhoWeServeSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { QuoteModal } from '../components/common/QuoteModal';
import { services } from '../data/services';
import { plans } from '../data/plans';
import { products } from '../data/products';
import { homeFAQs } from '../data/faqs';
import { siteConfig, getWhatsAppUrl } from '../data/siteConfig';
import { MessageSquare, ChevronDown, Sprout } from 'lucide-react';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedPlanForQuote, setSelectedPlanForQuote] = useState('Home Gardening Plan');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleOpenQuote = (planTitle) => {
    setSelectedPlanForQuote(planTitle);
    setQuoteModalOpen(true);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={styles.page}>
      {/* ═══════════════ SECTION 1: HERO ═══════════════ */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {/* Left Column: H1, Subtitle, Pincode Container, CTAs */}
          <div className={styles.heroContent}>
            {/* H1 Heading (Fraunces editorial serif, 2 lines) */}
            <h1 className={styles.heroHeading}>
              Bring <br />
              <span>Nature Home</span>
            </h1>

            {/* Hero Subtitle */}
            <p className={styles.heroSubtitle}>
              {siteConfig.description}
            </p>

            {/* Pincode Container (Pill container with sage button) */}
            <div className={styles.heroPincode}>
              <PincodeField buttonText="Check Availability" />
            </div>

            {/* Primary Action Buttons */}
            <div className={styles.heroActions}>
              {/* Book a Service (Forest Green Pill) */}
              <Link to="/book" className={styles.heroActionBtn}>
                <Button
                  variant="primary"
                  size="pill"
                  fullWidth
                  className={styles.bookButton}
                >
                  Book a Service
                </Button>
              </Link>

              {/* Enquire on WhatsApp (Outline Pill with icon) */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroActionBtn}
              >
                <Button
                  variant="outline"
                  size="pill"
                  fullWidth
                  className={styles.whatsappButton}
                  icon={
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  }
                >
                  Enquire on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Organic Hero Artwork */}
          <div className={styles.heroImageCol}>
            <BlobImage
              src="/images/hero-art-complete.png"
              alt="Experienced UrbanMaali gardener inspecting and tending to healthy plants"
              className={styles.heroBlobImage}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 2: TRUST STRIP ═══════════════ */}
      <TrustStrip />

      {/* ═══════════════ SECTION 3: OUR SERVICES (6-column row on desktop) ═══════════════ */}
      <section className={styles.servicesSection}>
        <SectionHeading
          title="Our Services"
          subtitle="Plant care and green spaces for every need"
          linkText="View All >"
          linkHref="/services"
        />

        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* ═══════════════ SECTION 4: HOW IT WORKS (5 steps) ═══════════════ */}
      <section className={styles.howItWorksWrap}>
        <div className={styles.sectionContainer}>
          <SectionHeading
            title="How It Works"
            subtitle="Get expert plant care in a few simple steps."
          />
          <HowItWorksSection />
        </div>
      </section>

      {/* ═══════════════ SECTION 5: PLANS FOR REGULAR CARE (2 wide cards) ═══════════════ */}
      <section className={styles.plansSection}>
        <SectionHeading
          title="Plans for Regular Care"
          subtitle="Hassle-free plant care with recurring visits."
          linkText="View Plans >"
          linkHref="/plans"
        />

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onRequestQuote={handleOpenQuote}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════ SECTION 6: WHO WE SERVE (5 tiles) ═══════════════ */}
      <section className={styles.whoWeServeWrap}>
        <div className={styles.sectionContainer}>
          <SectionHeading
            title="Who We Serve"
            subtitle="Dedicated gardening solutions tailored to spaces of any scale."
          />
          <WhoWeServeSection />
        </div>
      </section>

      {/* ═══════════════ SECTION 7: FEATURED PRODUCTS ═══════════════ */}
      <section className={styles.productsSection}>
        <SectionHeading
          title="Curated Plants & Essentials"
          subtitle="Direct from nursery partners, delivered to your doorstep."
          linkText="View Shop >"
          linkHref="/shop"
        />

        <div className={styles.productsGrid}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ═══════════════ SECTION 8: FAQ ACCORDION ═══════════════ */}
      <section className={styles.faqSection}>
        <div className={styles.faqContainer}>
          <div className={styles.faqHeader}>
            <h2 className={styles.faqTitle}>
              Frequently Asked Questions
            </h2>
            <p className={styles.faqSubtitle}>
              Everything you need to know about our services, local maalis, and bookings.
            </p>
          </div>

          <div className={styles.faqList}>
            {homeFAQs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className={styles.faqItem}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={styles.faqButton}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.faqQuestion}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 9: PARTNER BANNER ═══════════════ */}
      <section className={styles.partnerSection}>
        <div className={styles.partnerBanner}>
          <div className={styles.partnerInfo}>
            <div className={styles.partnerIconBox}>
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-moss" />
            </div>
            <div>
              <h3 className={styles.partnerTitle}>
                Partner with The UrbanMaali
              </h3>
              <p className={styles.partnerText}>
                Are you an independent local maali or run a plant nursery in Delhi NCR? Join our growing partner network.
              </p>
            </div>
          </div>
          <Link to="/partner">
            <Button variant="outline" size="md">
              Learn More & Partner
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══════════════ SECTION 10: FINAL CTA BAND ═══════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaHeading}>
            Ready to bring nature to your doorstep?
          </h2>
          <p className={styles.ctaSubtitle}>
            Check your area availability and request a visit from an experienced local maali in just two minutes.
          </p>

          <div className={styles.ctaActions}>
            <Link to="/book" className={styles.heroActionBtn}>
              <Button
                variant="card"
                size="lg"
                fullWidth
                className={styles.ctaBookBtn}
              >
                Book a Service
              </Button>
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroActionBtn}
            >
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className={styles.ctaWhatsappBtn}
                icon={<MessageSquare style={{ width: '20px', height: '20px' }} />}
              >
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        serviceOrPlanTitle={selectedPlanForQuote}
      />
    </div>
  );
};
