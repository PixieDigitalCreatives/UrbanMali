import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { services } from '../data/services';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Chip } from '../components/ui/Chip';
import { checkArea, submitBooking } from '../lib/api';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../lib/storage';
import { useToast } from '../context/ToastContext';
import { getWhatsAppUrl } from '../data/siteConfig';
import {
  ArrowLeft,
  ShoppingBag,
  HelpCircle,
  Check,
  Copy,
  MessageSquare,
} from 'lucide-react';
import styles from './BookingPage.module.scss';

const PROPERTY_TYPES = ['Home', 'Society', 'Office', 'Corporate', 'Mall'];
const POT_RANGES = ['1 to 10 pots', '11 to 20 pots', '21 to 40 pots', '40+ pots'];
const TIME_SLOTS = [
  '7:00 AM – 9:00 AM',
  '9:00 AM – 11:00 AM',
  '11:00 AM – 1:00 PM',
  '1:00 PM – 3:00 PM',
  '3:00 PM – 5:00 PM',
  '4:00 PM – 6:00 PM',
];

export const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const searchParams = new URLSearchParams(location.search);
  const initialServiceId = searchParams.get('service') || services[0].id;

  const savedDraft = getFromStorage(STORAGE_KEYS.BOOKING_DRAFT, null);

  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [selectedServiceId, setSelectedServiceId] = useState(
    savedDraft?.serviceId || initialServiceId
  );
  const [propertyType, setPropertyType] = useState(savedDraft?.propertyType || 'Home');
  const [address, setAddress] = useState(savedDraft?.address || '');
  const [pincode, setPincode] = useState(savedDraft?.pincode || '');
  const [pincodeValid, setPincodeValid] = useState(null);
  const [locality, setLocality] = useState(savedDraft?.locality || '');
  const [potRange, setPotRange] = useState(savedDraft?.potRange || '11 to 20 pots');
  const [selectedDate, setSelectedDate] = useState(
    savedDraft?.date || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState(
    savedDraft?.timeSlot || '9:00 AM – 11:00 AM'
  );
  const [name, setName] = useState(savedDraft?.name || '');
  const [phone, setPhone] = useState(savedDraft?.phone || '');
  const [email, setEmail] = useState(savedDraft?.email || '');
  const [notes, setNotes] = useState(savedDraft?.notes || '');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  useEffect(() => {
    if (!isSuccess) {
      saveToStorage(STORAGE_KEYS.BOOKING_DRAFT, {
        serviceId: selectedServiceId,
        serviceTitle: selectedService.title,
        propertyType,
        address,
        pincode,
        locality,
        potRange,
        date: selectedDate,
        timeSlot: selectedSlot,
        name,
        phone,
        email,
        notes,
      });
    }
  }, [
    selectedServiceId,
    selectedService.title,
    propertyType,
    address,
    pincode,
    locality,
    potRange,
    selectedDate,
    selectedSlot,
    name,
    phone,
    email,
    notes,
    isSuccess,
  ]);

  const handlePincodeVerify = async () => {
    if (pincode.length !== 6) return;
    setCheckLoading(true);
    try {
      const res = await checkArea(pincode);
      if (res.status === 'available') {
        setPincodeValid(true);
        if (res.locality) setLocality(res.locality);
        showToast('We serve this area!', 'success');
      } else {
        setPincodeValid(false);
        showToast(res.message, 'info');
      }
    } finally {
      setCheckLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 2 && (!address.trim() || pincode.length !== 6)) {
      showToast('Please enter your address and 6-digit pincode.', 'error');
      return;
    }
    if (step === 4 && (!name.trim() || phone.length < 10 || !consent)) {
      showToast('Please provide your name, valid phone number, and consent.', 'error');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        propertyType,
        address,
        pincode,
        locality,
        potRange,
        date: selectedDate,
        timeSlot: selectedSlot,
        name,
        phone,
        email,
        notes,
      };
      const res = await submitBooking(payload);
      setSuccessData(res.data);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast('Submission error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefId = (id) => {
    navigator.clipboard.writeText(id);
    showToast('Reference ID copied!', 'success');
  };

  // ═══════════════ SUCCESS VIEW ═══════════════
  if (isSuccess && successData) {
    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <Link to="/" className={styles.iconBtn}>
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
          </Link>
          <span className={styles.topBarTitle}>Booking Summary</span>
          <Link to="/cart" className={styles.iconBtn}>
            <ShoppingBag style={{ width: '20px', height: '20px' }} />
          </Link>
        </div>

        <div className={styles.successContainer}>
          <div className={styles.successWreath}>
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <circle cx="50" cy="50" r="44" stroke="#8DB8A2" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            </svg>
            <Check style={{ width: '40px', height: '40px', strokeWidth: 3 }} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--soil, #0E3529)', marginBottom: '0.25rem' }}>
            Request Received
          </h1>

          <div className={styles.refIdPill}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clay, #5F7268)', fontWeight: 500 }}>
              Reference ID:
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: 'var(--moss, #1F5E46)' }}>
              {successData.referenceId}
            </span>
            <button
              onClick={() => copyRefId(successData.referenceId || '')}
              style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--clay, #5F7268)', borderRadius: '9999px' }}
              aria-label="Copy reference ID"
            >
              <Copy style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--clay, #5F7268)', marginTop: '1rem', maxWidth: '28rem', lineHeight: 1.625 }}>
            We'll confirm availability, coverage, and price on WhatsApp or call. Please keep your phone handy!
          </p>

          {/* Summary Card */}
          <div className={styles.formCard} style={{ width: '100%', marginTop: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(231, 222, 198, 0.6)' }}>
              <img
                src={selectedService.image}
                alt={selectedService.title}
                style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 650, color: 'var(--soil, #0E3529)', fontSize: '0.95rem' }}>
                  {selectedService.title}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--moss, #1F5E46)', fontWeight: 600 }}>{selectedService.priceDisplay}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--clay, #5F7268)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Property</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{successData.propertyType}</span>
              </div>
              <div>
                <span style={{ color: 'var(--clay, #5F7268)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Pot Count</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{successData.potRange}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--clay, #5F7268)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Address</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{successData.address}, {successData.pincode}</span>
              </div>
              <div>
                <span style={{ color: 'var(--clay, #5F7268)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Preferred Date</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{successData.date}</span>
              </div>
              <div>
                <span style={{ color: 'var(--clay, #5F7268)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Time Slot</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{successData.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Chat on WhatsApp Button */}
          <div style={{ width: '100%', marginTop: '1.5rem' }}>
            <a
              href={getWhatsAppUrl(
                `Hi UrbanMaali, I have submitted a booking request. My Reference ID is: ${successData.referenceId}. Please confirm availability.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: '100%', display: 'block' }}
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<MessageSquare style={{ width: '20px', height: '20px' }} />}
                style={{ height: '56px', fontWeight: 600 }}
              >
                Chat on WhatsApp
              </Button>
            </a>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link to="/" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--moss, #1F5E46)', textDecoration: 'none' }}>
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════ 5-STEP BOOKING FLOW ═══════════════
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button
          onClick={() => (step > 1 ? handleBack() : navigate(-1))}
          className={styles.iconBtn}
          aria-label="Back"
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <span className={styles.topBarTitle}>Book a Service</span>
        <a
          href={getWhatsAppUrl("Hi UrbanMaali, I need help with my booking.")}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconBtn}
          aria-label="Help"
        >
          <HelpCircle style={{ width: '20px', height: '20px' }} />
        </a>
      </div>

      <div className={styles.container}>
        {/* Stepper */}
        <div className={styles.stepper}>
          <div className={styles.stepperLine} />
          {[1, 2, 3, 4, 5].map((s) => {
            const isDone = s < step;
            const isActive = s === step;
            return (
              <div
                key={s}
                className={`${styles.stepCircle} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}
              >
                {isDone ? <Check style={{ width: '16px', height: '16px', strokeWidth: 3 }} /> : s}
              </div>
            );
          })}
        </div>

        {/* Step Indicator Subtitle */}
        <div className={styles.stepHeader}>
          <span className={styles.stepMeta}>
            Step {step} of 5
          </span>
          <h2 className={styles.stepTitle}>
            {step === 1 && 'Choose Service'}
            {step === 2 && 'Property Details'}
            {step === 3 && 'Preferred Date & Time'}
            {step === 4 && 'Your Contact Details'}
            {step === 5 && 'Review & Submit Request'}
          </h2>
          <p className={styles.stepDesc}>
            {step === 1 && 'Select the gardening care that matches your current requirement.'}
            {step === 2 && 'Tell us about your property location and plant volume.'}
            {step === 3 && 'Pick a convenient slot for our local maali visit.'}
            {step === 4 && 'Provide your name and phone number for slot confirmation.'}
            {step === 5 && 'Verify your details before sending the service request.'}
          </p>
        </div>

        {/* STEP 1: SERVICE PICKER */}
        {step === 1 && (
          <div className={styles.serviceList}>
            {services.map((svc) => (
              <div
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                className={`${styles.serviceOption} ${selectedServiceId === svc.id ? styles.selected : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={svc.image} alt={svc.title} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 650, color: 'var(--soil, #0E3529)', fontSize: '0.95rem' }}>{svc.title}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--clay, #5F7268)' }}>{svc.duration}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--moss, #1F5E46)' }}>{svc.priceDisplay}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: PROPERTY DETAILS */}
        {step === 2 && (
          <div className={styles.formCard}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.5rem' }}>
                Property Type
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PROPERTY_TYPES.map((type) => (
                  <Chip
                    key={type}
                    selected={propertyType === type}
                    onClick={() => setPropertyType(type)}
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </div>

            <Input
              label="Address & Flat / House No."
              placeholder="e.g. Tower B-402, Green Valley Apartments"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.375rem' }}>
                Postal Pincode <span style={{ color: 'var(--brick, #C25E3E)' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card, #FBF8F1)', borderRadius: '12px', border: '1px solid var(--sand, #E7DEC6)', overflow: 'hidden' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 201308"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ''));
                    setPincodeValid(null);
                  }}
                  style={{ flex: 1, padding: '0.75rem 1rem', background: 'transparent', color: 'var(--soil, #0E3529)', fontSize: '0.875rem', border: 'none', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={handlePincodeVerify}
                  disabled={checkLoading || pincode.length !== 6}
                  style={{ height: '40px', padding: '0 1rem', backgroundColor: 'var(--moss, #1F5E46)', color: 'var(--beige, #F5F0E4)', fontSize: '12px', fontWeight: 600, borderRadius: '8px', marginRight: '4px', border: 'none', cursor: 'pointer' }}
                >
                  {checkLoading ? 'Checking...' : 'Check'}
                </button>
              </div>

              {pincodeValid === true && (
                <span style={{ fontSize: '12px', color: 'var(--moss, #1F5E46)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                  ✓ We serve this area
                </span>
              )}
              {pincodeValid === false && (
                <span style={{ fontSize: '12px', color: 'var(--clay, #5F7268)', fontWeight: 500, display: 'block', marginTop: '4px' }}>
                  Area pending coverage; we will verify during coordination.
                </span>
              )}
            </div>

            <Input
              label="Locality / Sector"
              placeholder="e.g. Sector 78, Noida"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            />

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.375rem' }}>
                Approximate Number of Pots
              </label>
              <select
                value={potRange}
                onChange={(e) => setPotRange(e.target.value)}
                style={{ width: '100%', height: '48px', padding: '0 1rem', borderRadius: '12px', backgroundColor: 'var(--card, #FBF8F1)', border: '1px solid var(--sand, #E7DEC6)', color: 'var(--soil, #0E3529)', fontSize: '0.875rem', outline: 'none' }}
              >
                {POT_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: PREFERRED DATE & TIME */}
        {step === 3 && (
          <div className={styles.formCard}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.5rem' }}>
                Select Preferred Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '100%', height: '48px', padding: '0 1rem', borderRadius: '12px', backgroundColor: 'var(--card, #FBF8F1)', border: '1px solid var(--sand, #E7DEC6)', color: 'var(--soil, #0E3529)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.5rem' }}>
                Select Time Slot (7:00 AM – 6:00 PM)
              </label>
              <div className={styles.timeSlotGrid}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`${styles.timeSlotBtn} ${selectedSlot === slot ? styles.selected : ''}`}
                  >
                    <span>{slot}</span>
                    {selectedSlot === slot && <Check style={{ width: '16px', height: '16px', color: '#F5F0E4' }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT DETAILS */}
        {step === 4 && (
          <div className={styles.formCard}>
            <Input
              label="Full Name"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.375rem' }}>
                WhatsApp / Phone Number <span style={{ color: 'var(--brick, #C25E3E)' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ height: '48px', padding: '0 0.75rem', backgroundColor: 'rgba(231, 222, 198, 0.4)', border: '1px solid var(--sand, #E7DEC6)', borderRight: 'none', borderRadius: '12px 0 0 12px', color: 'var(--soil, #0E3529)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{ flex: 1, height: '48px', padding: '0 1rem', borderRadius: '0 12px 12px 0', backgroundColor: 'var(--card, #FBF8F1)', border: '1px solid var(--sand, #E7DEC6)', color: 'var(--soil, #0E3529)', fontSize: '0.875rem', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. priya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.375rem' }}>
                Notes for Maali (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention specific plants, pest problems, or access gates..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '12px', backgroundColor: 'var(--card, #FBF8F1)', border: '1px solid var(--sand, #E7DEC6)', color: 'var(--soil, #0E3529)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', userSelect: 'none', fontSize: '12px', color: 'var(--clay, #5F7268)', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--moss, #1F5E46)' }}
                required
              />
              <span>I agree to be contacted on WhatsApp or phone call regarding this service request.</span>
            </label>
          </div>
        )}

        {/* STEP 5: REVIEW SUMMARY */}
        {step === 5 && (
          <div className={styles.formCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(231, 222, 198, 0.6)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clay, #5F7268)' }}>Request Overview</span>
              <button onClick={() => setStep(1)} style={{ fontSize: '12px', color: 'var(--moss, #1F5E46)', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Edit
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src={selectedService.image} alt={selectedService.title} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 650, color: 'var(--soil, #0E3529)', fontSize: '1rem' }}>{selectedService.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--moss, #1F5E46)', fontWeight: 700 }}>{selectedService.priceDisplay}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(231, 222, 198, 0.5)', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--clay, #5F7268)', fontSize: '12px', display: 'block' }}>Property</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{propertyType} ({potRange})</span>
              </div>
              <div>
                <span style={{ color: 'var(--clay, #5F7268)', fontSize: '12px', display: 'block' }}>Preferred Slot</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{selectedDate} — {selectedSlot}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--clay, #5F7268)', fontSize: '12px', display: 'block' }}>Address</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{address}, {pincode}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--clay, #5F7268)', fontSize: '12px', display: 'block' }}>Contact</span>
                <span style={{ fontWeight: 600, color: 'var(--soil, #0E3529)' }}>{name} (+91 {phone})</span>
              </div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(220, 232, 223, 0.5)', borderRadius: '12px', border: '1px solid rgba(31, 94, 70, 0.2)', fontSize: '12px', color: 'var(--soil, #0E3529)' }}>
              ℹ No payment is charged now. We confirm coverage, timing and final pricing with you on WhatsApp or call first.
            </div>
          </div>
        )}

        {/* Stepper Footer Action Buttons */}
        <div className={styles.stepActions}>
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              style={{ flex: 1, height: '52px' }}
            >
              Back
            </Button>
          )}

          {step < 5 ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNext}
              style={{ flex: 1, height: '52px' }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSubmitBooking}
              isLoading={isSubmitting}
              style={{ flex: 1, height: '52px' }}
            >
              Submit Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
