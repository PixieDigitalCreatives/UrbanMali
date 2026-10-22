import React from 'react';
import { Calendar, CheckCircle2, MapPin, Sparkles, UserCheck } from 'lucide-react';
import styles from './HowItWorksSection.module.scss';

const steps = [
  {
    number: 1,
    title: 'Choose a service',
    subtitle: 'Pick what you need',
    icon: <Sparkles />,
  },
  {
    number: 2,
    title: 'Share location',
    subtitle: 'and property details',
    icon: <MapPin />,
  },
  {
    number: 3,
    title: 'Pick date and time',
    subtitle: 'Choose a convenient slot',
    icon: <Calendar />,
  },
  {
    number: 4,
    title: 'We confirm coverage and price',
    subtitle: 'on WhatsApp or call',
    icon: <CheckCircle2 />,
  },
  {
    number: 5,
    title: 'Your maali visits and takes care',
    subtitle: 'of your plants',
    icon: <UserCheck />,
  },
];

export const HowItWorksSection = () => {
  return (
    <div className={styles.wrapper}>
      {/* Desktop Horizontal 5-Step Flow */}
      <div className={styles.desktopFlow}>
        <div className={styles.dottedConnector} aria-hidden="true" />
        <div className={styles.desktopGrid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.desktopItem}>
              <div className={styles.tile}>
                {step.icon}
              </div>
              <div className={styles.contentWrapper}>
                <div className={styles.numberCircle}>
                  {step.number}
                </div>
                <h3 className={styles.stepTitle}>
                  {step.title}
                </h3>
                <p className={styles.stepSubtitle}>
                  {step.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Timeline Flow */}
      <div className={styles.mobileFlow}>
        <div className={styles.dottedConnectorVertical} aria-hidden="true" />
        <div className={styles.mobileList}>
          {steps.map((step) => (
            <div key={step.number} className={styles.mobileItem}>
              <div className={styles.mobileIconWrapper}>
                <div className={styles.mobileTile}>
                  {step.icon}
                </div>
                <div className={styles.mobileNumberCircle}>
                  {step.number}
                </div>
              </div>
              <div className={styles.mobileContent}>
                <h3 className={styles.mobileTitle}>
                  {step.title}
                </h3>
                <p className={styles.mobileSubtitle}>
                  {step.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
