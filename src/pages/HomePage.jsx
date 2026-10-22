import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PincodeField } from '../components/ui/PincodeField';
import { SectionHeading } from '../components/ui/SectionHeading';
import { RevealText } from '../components/ui/RevealText';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import { Marquee } from '../components/home/Marquee';
import { TrustStrip } from '../components/home/TrustStrip';
import { ServiceStack } from '../components/home/ServiceStack';
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
import { heroSlides } from '../data/heroSlides';
import { ArrowUpRight, MessageSquare, Plus } from 'lucide-react';
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
      {/* ═══════════════ HERO ═══════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroPanel}>
          <HeroCarousel slides={heroSlides['/']} />

          <div className={styles.heroInner}>
            <RevealText as="h1" className={styles.heroTitle} text={'Bring *nature*\nhome'} delay="0.1" />

            <p className={styles.heroLead} data-reveal="up" data-reveal-delay="0.4">
              {siteConfig.description}
            </p>

            <div className={styles.heroPincode} data-reveal="up" data-reveal-delay="0.5">
              <PincodeField buttonText="Check Availability" />
            </div>

            <div className={styles.heroActions} data-reveal="up" data-reveal-delay="0.6">
              <Link to="/book" className={styles.primaryCta} data-magnetic="0.3">
                <span>Book a Service</span>
                <span className={styles.ctaIcon} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className={styles.textCta}>
                <MessageSquare strokeWidth={1.6} />
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <Marquee
        items={['Balcony makeovers', 'Plant maintenance', 'Drip irrigation', 'Nursery delivery', 'Society & office care']}
      />

      {/* ═══════════════ MANIFESTO + TRUST ═══════════════ */}
      <section className={styles.manifesto} data-creeper="seam" data-creeper-side="right">
        <div className={styles.container}>
          <div className={styles.manifestoSplit}>
            <div className={styles.manifestoCopy}>
              <span className={styles.sectionEyebrow} data-reveal="up">
                <span className={styles.sectionIndex}>(01)</span> Why UrbanMaali
              </span>
              <RevealText
                as="p"
                mode="fill"
                className={styles.manifestoText}
                text="We pair every home with a *local maali* from your own neighbourhood, source plants from nurseries we trust, and keep booking *simple.*"
              />
              <p className={styles.manifestoLead} data-reveal="up">
                We map your pincode to trained local maalis stationed nearby. They arrive with basic gardening tools
                and organic enrichment kits at your requested time slot.
              </p>
              <Link to="/services" className={styles.manifestoLink} data-reveal="up">
                Explore services
                <span className={styles.ctaIconDark} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
            </div>

            <div className={styles.collage} aria-hidden="true">
              <div className={styles.collageMain} data-reveal="image">
                <img src="/images/product-plant-set.jpg" alt="" data-parallax="6" loading="lazy" />
              </div>
              <div className={styles.collageSquare} data-parallax="-16">
                <img src="/images/service-maintenance-addon.jpg" alt="" loading="lazy" />
              </div>
              <div className={styles.collageCircle} data-parallax="-30">
                <svg viewBox="0 0 200 200" className={styles.collageRing}>
                  <defs>
                    <path id="manifesto-ring" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
                  </defs>
                  <text>
                    <textPath href="#manifesto-ring">Rooted in your neighbourhood · Local maalis ·</textPath>
                  </text>
                </svg>
                <div className={styles.collageCircleImg}>
                  <img src="/images/product-money-plant.jpg" alt="" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
          <TrustStrip />
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section className={styles.services}>
        <div className={styles.container}>
          <SectionHeading
            index="02"
            eyebrow="Our services"
            title="Care for every *kind* of green space"
            subtitle="Plant care and green spaces for every need — from a few balcony pots to a whole society garden."
            linkText="View all services"
            linkHref="/services"
          />
          <ServiceStack services={services} />
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS (pinned) ═══════════════ */}
      <HowItWorksSection />

      {/* ═══════════════ PLANS ═══════════════ */}
      <section className={styles.plans} data-creeper="seam" data-creeper-side="left">
        <div className={styles.container}>
          <SectionHeading
            index="04"
            eyebrow="Plans for regular care"
            title="Hassle-free care, *on repeat*"
            subtitle="Recurring visits for homes, societies and workplaces — one trusted maali, one schedule, no chasing."
            linkText="View plans"
            linkHref="/plans"
          />
          <div className={styles.plansGrid} data-reveal-group data-reveal-stagger="0.15">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onRequestQuote={handleOpenQuote} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHO WE SERVE ═══════════════ */}
      <section className={styles.audience}>
        <div className={styles.container}>
          <SectionHeading
            index="05"
            eyebrow="Who we serve"
            title="From one balcony to *whole campuses*"
            subtitle="Dedicated gardening solutions tailored to spaces of any scale."
          />
          <WhoWeServeSection />
        </div>
      </section>

      {/* ═══════════════ PRODUCTS ═══════════════ */}
      <section className={styles.products} data-creeper="seam" data-creeper-side="right">
        <div className={styles.container}>
          <SectionHeading
            index="06"
            eyebrow="The nursery shelf"
            title="Curated plants & *essentials*"
            subtitle="Direct from nursery partners, delivered to your doorstep."
            linkText="View shop"
            linkHref="/shop"
          />
          <div className={styles.productsGrid} data-reveal-group>
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className={styles.productCell} data-reveal-item>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className={styles.faq} data-creeper="seeker" data-seekers="0,0.94,-16,260">
        <div className={`${styles.container} ${styles.faqGrid}`}>
          <div className={styles.faqIntro}>
            <span className={styles.sectionEyebrow} data-reveal="up">
              <span className={styles.sectionIndex}>(07)</span> Questions
            </span>
            <RevealText as="h2" className={styles.faqTitle} text="Frequently asked *questions*" />
            <p className={styles.faqLead} data-reveal="up">
              Everything you need to know about our services, local maalis, and bookings. Still unsure? Ask us directly.
            </p>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.faqCta}
              data-reveal="up"
            >
              <MessageSquare strokeWidth={1.6} /> Ask on WhatsApp
            </a>
          </div>

          <div className={styles.faqList} data-reveal-group>
            {homeFAQs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.question} className={`${styles.faqItem} ${isOpen ? styles.isOpen : ''}`} data-reveal-item>
                  <button
                    onClick={() => toggleFaq(index)}
                    className={styles.faqButton}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span className={styles.faqNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.faqQuestion}>{faq.question}</span>
                    <span className={styles.faqIcon} aria-hidden="true">
                      <Plus strokeWidth={1.6} />
                    </span>
                  </button>
                  <div id={`faq-panel-${index}`} className={styles.faqPanel} role="region">
                    <div className={styles.faqPanelInner}>
                      <p className={styles.faqAnswer}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ PARTNER ═══════════════ */}
      <section className={styles.partner} data-creeper="seeker" data-seekers="1,0.85,192,230">
        <div className={styles.container}>
          <div className={styles.partnerCard} data-reveal="scale">
            <div className={styles.partnerMedia}>
              <img src="/images/service-irrigation.jpg" alt="Seedlings growing in nursery trays" data-parallax="8" />
            </div>
            <div className={styles.partnerBody}>
              <span className={styles.sectionEyebrow}>
                <span className={styles.sectionIndex}>(08)</span> For maalis & nurseries
              </span>
              <h3 className={styles.partnerTitle}>
                Partner with <em>The UrbanMaali</em>
              </h3>
              <p className={styles.partnerText}>
                Are you an independent local maali or run a plant nursery in Delhi NCR? Join our growing partner network.
              </p>
              <Link to="/partner" className={styles.partnerLink}>
                Learn More & Partner
                <span className={styles.ctaIconDark} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        serviceOrPlanTitle={selectedPlanForQuote}
      />
    </div>
  );
};
