import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getWhatsAppUrl } from '../data/siteConfig';
import { Sprout, MessageSquare, ArrowLeft } from 'lucide-react';
import styles from './ComingSoonPage.module.scss';

export const ComingSoonPage = () => {
  const location = useLocation();

  const pathPart = location.pathname.replace(/^\//, '').replace(/-/g, ' ');
  const pageTitle = pathPart
    ? pathPart.charAt(0).toUpperCase() + pathPart.slice(1)
    : 'Page';

  return (
    <div className={styles.page}>
      <div className={styles.iconWrap}>
        <Sprout style={{ width: '40px', height: '40px' }} />
      </div>

      <span className={styles.brandLabel}>
        The UrbanMaali
      </span>
      <h1 className={styles.title}>
        {pageTitle}
      </h1>
      <p className={styles.desc}>
        We're currently preparing and finalizing this section for our upcoming release.
        If you have immediate questions, feel free to connect with our gardening team directly.
      </p>

      <div className={styles.actions}>
        <Link to="/" style={{ width: '100%' }}>
          <Button variant="primary" size="md" fullWidth icon={<ArrowLeft style={{ width: '16px', height: '16px' }} />}>
            Back to Home
          </Button>
        </Link>
        <a
          href={getWhatsAppUrl(`Hi UrbanMaali, I'd like to ask about the ${pageTitle} section.`)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ width: '100%' }}
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
  );
};
