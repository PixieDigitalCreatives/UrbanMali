import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { submitQuoteRequest } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import styles from './QuoteModal.module.scss';

const PROPERTY_TYPES = ['Home', 'Society', 'Office', 'Corporate', 'Mall'];

export const QuoteModal = ({
  isOpen,
  onClose,
  serviceOrPlanTitle = 'General Inquiry',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [propertyType, setPropertyType] = useState('Home');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !consent) return;

    setLoading(true);
    try {
      const res = await submitQuoteRequest({
        name,
        phone,
        locality,
        propertyType,
        serviceOrPlan: serviceOrPlanTitle,
        notes,
      });

      showToast(res.message, 'success');
      onClose();
      setName('');
      setPhone('');
      setLocality('');
      setNotes('');
    } catch {
      showToast('Failed to submit quote request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request a Quote: ${serviceOrPlanTitle}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.description}>
          Share your property details and we'll connect with you on WhatsApp or phone call to review coverage and pricing.
        </p>

        <div>
          <label className={styles.label}>
            Property Type
          </label>
          <div className={styles.chipsContainer}>
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
          label="Your Name"
          placeholder="e.g. Rahul Sharma"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <label className={styles.label}>
            Phone Number <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.phoneGroup}>
            <span className={styles.prefix}>
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className={styles.phoneInput}
            />
          </div>
        </div>

        <Input
          label="Locality / Sector"
          placeholder="e.g. Sector 78, Noida or Gaur City"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
        />

        <div>
          <label className={styles.label}>
            Additional Requirements (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Approximate lawn area, number of pots, or specific requests..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textarea}
          />
        </div>

        <label className={styles.consentLabel}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className={styles.checkbox}
            required
          />
          <span>I agree to be contacted on WhatsApp or call regarding this service quote request.</span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={loading}
          disabled={!name.trim() || phone.length < 10 || !consent}
          className={styles.submitButton}
        >
          Submit Quote Request
        </Button>
      </form>
    </Modal>
  );
};
