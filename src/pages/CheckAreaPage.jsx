import React, { useState } from 'react';
import { checkArea, joinWaitlist } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { getWhatsAppUrl } from '../data/siteConfig';
import { MapPin, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import styles from './CheckAreaPage.module.scss';

export const CheckAreaPage = () => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Waitlist form states
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [waitlistLocality, setWaitlistLocality] = useState('');
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleCheck = async (e) => {
    e.preventDefault();
    if (pincode.length !== 6) return;
    setLoading(true);
    setWaitlistSubmitted(false);
    try {
      const res = await checkArea(pincode);
      setResult(res);
      if (res.locality) setWaitlistLocality(res.locality);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistName || !waitlistPhone) return;
    setWaitlistSubmitting(true);
    try {
      const res = await joinWaitlist({
        name: waitlistName,
        phone: waitlistPhone,
        pincode,
        locality: waitlistLocality,
      });
      showToast(res.message, 'success');
      setWaitlistSubmitted(true);
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <MapPin style={{ width: '28px', height: '28px' }} />
          </div>
          <h1 className={styles.title}>
            Check Service Availability
          </h1>
          <p className={styles.subtitle}>
            Enter your 6-digit postal pincode to see if local maalis are available in your sector.
          </p>
        </div>

        {/* Check Form */}
        <div className={styles.card}>
          <form onSubmit={handleCheck} className={styles.form}>
            <Input
              label="Enter Pincode"
              placeholder="e.g. 201308 or 201301"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ''));
                setResult(null);
              }}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              disabled={pincode.length !== 6}
            >
              Verify Pincode
            </Button>
          </form>

          {/* Result Card */}
          {result && (
            <div className={styles.resultArea}>
              {result.status === 'available' && (
                <div style={{ backgroundColor: 'rgba(221, 231, 207, 0.7)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(63, 91, 52, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--moss, #3F5B34)' }}>
                    <CheckCircle2 style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>We Serve Your Area!</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--soil, #2B2118)', lineHeight: 1.625 }}>
                    {result.message}
                  </p>
                  {result.locality && (
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(63, 91, 52, 0.9)' }}>
                      Covered Locality: {result.locality}
                    </span>
                  )}
                  <div style={{ marginTop: '0.5rem' }}>
                    <Link to="/book">
                      <Button variant="primary" size="md">
                        Proceed to Book a Service
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {result.status === 'coming_soon' && (
                <div style={{ backgroundColor: 'rgba(220, 230, 238, 0.8)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(62, 90, 115, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#3E5A73' }}>
                    <Clock style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>Coming to Your Area Soon!</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--soil, #2B2118)', lineHeight: 1.625 }}>
                    {result.message}
                  </p>

                  {!waitlistSubmitted ? (
                    <form onSubmit={handleJoinWaitlist} style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(230, 216, 189, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--soil, #2B2118)' }}>Join the priority notification list:</span>
                      <Input
                        placeholder="Your Name"
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                        required
                      />
                      <Input
                        placeholder="10-digit Phone Number"
                        value={waitlistPhone}
                        maxLength={10}
                        onChange={(e) => setWaitlistPhone(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={waitlistSubmitting}
                      >
                        Notify Me When Available
                      </Button>
                    </form>
                  ) : (
                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--card, #FAF5EA)', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--moss, #3F5B34)' }}>
                      ✓ You are registered on the priority waitlist!
                    </div>
                  )}
                </div>
              )}

              {result.status === 'not_served' && (
                <div style={{ backgroundColor: 'rgba(230, 216, 189, 0.4)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--sand, #E6D8BD)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--clay, #8B6B4A)' }}>
                    <AlertCircle style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--soil, #2B2118)' }}>Not Available Yet</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--clay, #8B6B4A)', lineHeight: 1.625 }}>
                    {result.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <a
                      href={getWhatsAppUrl(`Hi UrbanMaali, I live in pincode ${pincode}. Can I request custom gardening support?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<MessageSquare style={{ width: '16px', height: '16px', color: '#3F5B34' }} />}
                      >
                        Chat on WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
