import React, { useState } from 'react';
import { services } from '../data/services';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
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
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Our Plant Care Services
          </h1>
          <p className={styles.subtitle}>
            From single-visit maintenance for balcony pots to custom landscaping contracts for gated communities and workspaces.
          </p>
        </div>

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
        <div className={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Final CTA Banner */}
        <div className={styles.ctaCard}>
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
                icon={<MessageSquare style={{ width: '16px', height: '16px', color: '#3F5B34' }} />}
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
