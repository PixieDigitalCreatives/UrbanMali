import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHero } from '../components/ui/PageHero';
import { getWhatsAppUrl } from '../data/siteConfig';
import { getHeroSlides, heroSlides } from '../data/heroSlides';
import { ArrowLeft, ArrowUpRight, MessageSquare } from 'lucide-react';
import styles from './ComingSoonPage.module.scss';

export const ComingSoonPage = () => {
  const location = useLocation();

  const pathPart = location.pathname.replace(/^\//, '').replace(/-/g, ' ');
  const pageTitle = pathPart
    ? pathPart.charAt(0).toUpperCase() + pathPart.slice(1)
    : 'Page';

  return (
    <div className={styles.page}>
      <PageHero
        title={`${pageTitle}\n*coming soon*`}
        subtitle="We're currently preparing and finalizing this section for our upcoming release. If you have immediate questions, feel free to connect with our gardening team directly."
        slides={getHeroSlides(location.pathname, heroSlides['/about'])}
      >
        <div className={styles.actions}>
          <Link to="/" className={styles.primary} data-magnetic="0.25">
            <ArrowLeft strokeWidth={1.8} />
            Back to Home
          </Link>
          <a
            href={getWhatsAppUrl(`Hi UrbanMaali, I'd like to ask about the ${pageTitle} section.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            <MessageSquare strokeWidth={1.6} />
            Chat on WhatsApp
            <ArrowUpRight strokeWidth={1.6} />
          </a>
        </div>
      </PageHero>
    </div>
  );
};
