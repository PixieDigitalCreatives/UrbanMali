import React, { useState } from 'react';
import { services } from '../data/services';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PageHero } from '../components/ui/PageHero';
import { Link } from 'react-router-dom';
import { getWhatsAppUrl } from '../data/siteConfig';
import { MessageSquare } from 'lucide-react';
import styles from './ServicesPage.module.scss';

const CATEGORIES = ['All', 'Homes', 'Societies & Offices', 'Nursery & Delivery'];

export const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Homes') {
      return (
        s.id === 'plant-maintenance' ||
        s.id === 'maintenance-addon' ||
        s.id === 'balcony-makeover' ||
        s.id === 'irrigation-setup'
      );
    }
    if (selectedCategory === 'Societies & Offices') {
      return s.id === 'society-office-maintenance' || s.id === 'irrigation-setup';
    }
    if (selectedCategory === 'Nursery & Delivery') {
      return s.id === 'nursery-delivery';
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <PageHero
        index="01"
        eyebrow="Services"
        title="Our plant care *services*"
        subtitle="From single-visit maintenance for balcony pots to custom landscaping contracts for gated communities and workspaces."
        slides={services.map((s) => s.image)}
      />
      <div className={styles.container}>

        {/* Filter Chips */}
        <div className={styles.filterChips}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Chip>
          ))}
        </div>

        {/* Services Grid (6 across on desktop, 3 on tablet, 2 on mobile) */}
        <div className={styles.servicesGrid} data-reveal-group>
          {filteredServices.map((service) => (
            <div key={service.id} data-reveal-item>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Final CTA Banner */}
        <div className={styles.ctaCard} data-reveal="scale">
          <h2 className={styles.ctaTitle}>
            Not sure which service fits your space?
          </h2>
          <p className={styles.ctaSubtitle}>
            Send us a few photos of your balcony or garden area on WhatsApp. Our gardening experts will recommend the right visit.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/book" className={styles.ctaBtnLink}>
              <Button variant="primary" size="md" fullWidth>
                Book a Service
              </Button>
            </Link>
            <a
              href={getWhatsAppUrl("Hi UrbanMaali, I'd like advice on choosing the right gardening service.")}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnLink}
            >
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={<MessageSquare style={{ width: '16px', height: '16px' }} />}
              >
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
