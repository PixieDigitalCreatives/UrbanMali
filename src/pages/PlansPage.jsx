import React, { useState } from 'react';
import { plans } from '../data/plans';
import { PlanCard } from '../components/cards/PlanCard';
import { QuoteModal } from '../components/common/QuoteModal';
import { Button } from '../components/ui/Button';
import { PageHero } from '../components/ui/PageHero';
import { heroSlides } from '../data/heroSlides';
import { Check, Info } from 'lucide-react';
import styles from './PlansPage.module.scss';

export const PlansPage = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activePlan, setActivePlan] = useState('Home Gardening Plan');

  const handleOpenQuote = (title) => {
    setActivePlan(title);
    setQuoteOpen(true);
  };

  return (
    <div className={styles.page}>
      <PageHero
        index="02"
        eyebrow="Plans"
        title="Plans for *regular* care"
        subtitle="Recurring weekly, bi-weekly, or monthly plant care tailored for private apartments, societies, and corporate courtyards."
        slides={heroSlides['/plans']}
      />
      <div className={styles.container}>

        {/* Plan Cards */}
        <div className={styles.plansGrid} data-reveal-group data-reveal-stagger="0.15">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onRequestQuote={handleOpenQuote}
            />
          ))}
        </div>

        {/* Plan Comparison Table */}
        <div className={styles.tableCard} data-reveal="up">
          <h2 className={styles.tableTitle}>
            Compare Recurring Care Features
          </h2>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Care Attribute</th>
                  <th className={styles.thCol}>Home Plan</th>
                  <th className={styles.thCol}>Society / Office Plan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tdAttr}>Visit Frequency</td>
                  <td className={styles.tdMuted}>Fortnightly or Monthly</td>
                  <td className={styles.tdMuted}>Custom (Weekly / Daily)</td>
                </tr>
                <tr>
                  <td className={styles.tdAttr}>Pruning & Aeration</td>
                  <td><Check className={styles.check} strokeWidth={2} /></td>
                  <td><Check className={styles.check} strokeWidth={2} /></td>
                </tr>
                <tr>
                  <td className={styles.tdAttr}>Organic Nutrition Supply</td>
                  <td><Check className={styles.check} strokeWidth={2} /></td>
                  <td><Check className={styles.check} strokeWidth={2} /></td>
                </tr>
                <tr>
                  <td className={styles.tdAttr}>Lawn Mowing & Hedge Sculpting</td>
                  <td className={styles.tdMuted}>Add-on request</td>
                  <td><Check className={styles.check} strokeWidth={2} /></td>
                </tr>
                <tr>
                  <td className={styles.tdAttr}>Supervisor Audit & Reports</td>
                  <td className={styles.tdMuted}>Quarterly tips</td>
                  <td><Check className={styles.check} strokeWidth={2} /></td>
                </tr>
                <tr>
                  <td className={styles.tdAttr}>Contract Terms</td>
                  <td className={styles.tdMuted}>Flexible monthly pause</td>
                  <td className={styles.tdMuted}>Annual agreement</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Regulatory note */}
          <div className={styles.tableNote}>
            <Info style={{ width: '16px', height: '16px', color: '#5F7268', flexShrink: 0, marginTop: '2px' }} />
            <p>
              Note: Plan pricing and terms are subject to on-site assessment. Taxes and cancellation policy are shared during proposal confirmation.
            </p>
          </div>
        </div>

        {/* Commercial Custom Consultation Card */}
        <div className={styles.commercialCard} data-reveal="scale">
          <div>
            <h3 className={styles.commercialTitle}>
              Managing a large commercial campus or residential RWA?
            </h3>
            <p className={styles.commercialSubtitle}>
              We arrange on-site inspections and tailored landscape maintenance proposals.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleOpenQuote('Commercial RWA & Campus Plan')}
            style={{ flexShrink: 0 }}
          >
            Request Commercial Proposal
          </Button>
        </div>
      </div>

      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        serviceOrPlanTitle={activePlan}
      />
    </div>
  );
};
