import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { createOrder } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import styles from './CheckoutPage.module.scss';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, totalCount } = useCart();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('201308');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [simulationState, setSimulationState] = useState('idle');
  const [failureReason, setFailureReason] = useState('');

  const deliveryFee = subtotal > 499 ? 0 : 50;
  const orderTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 10 || !address.trim() || pincode.length !== 6 || !termsAgreed) {
      showToast('Please fill all required delivery and contact details.', 'error');
      return;
    }

    if (paymentMethod === 'Cash on delivery') {
      try {
        const res = await createOrder({
          items,
          subtotal,
          deliveryFee,
          total: orderTotal,
          customerName: name,
          phone,
          email,
          address,
          pincode,
          paymentMethod: 'Cash on delivery',
          paymentStatus: 'pending',
        });
        showToast('Order confirmed successfully!', 'success');
        navigate(`/orders/${res.order.orderId}`);
      } catch (err) {
        showToast('Failed to place order. Please try again.', 'error');
      }
    } else {
      setSimulationState('idle');
      setPaymentModalOpen(true);
    }
  };

  const handleSimulatePayment = async (success) => {
    setSimulationState('processing');
    await new Promise((r) => setTimeout(r, 900));

    if (success) {
      try {
        const res = await createOrder({
          items,
          subtotal,
          deliveryFee,
          total: orderTotal,
          customerName: name,
          phone,
          email,
          address,
          pincode,
          paymentMethod,
          paymentStatus: 'success',
        });
        setPaymentModalOpen(false);
        showToast('Payment successful!', 'success');
        navigate(`/orders/${res.order.orderId}`);
      } catch (err) {
        setSimulationState('failed');
        setFailureReason('Order record creation failed. Please retry.');
      }
    } else {
      setSimulationState('failed');
      setFailureReason('Bank authorization declined or transaction cancelled by user.');
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--soil, #2B2118)' }}>
          No items in checkout
        </h2>
        <Link to="/shop" style={{ marginTop: '1rem' }}>
          <Button variant="primary" size="md">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button onClick={() => navigate(-1)} className={styles.backBtn} aria-label="Back">
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <h1 className={styles.title}>Checkout</h1>
        <div style={{ width: '32px' }} />
      </div>

      <div className={styles.container}>
        <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Contact Details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Contact Details
            </h2>
            <Input
              label="Full Name"
              placeholder="e.g. Ankit Verma"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #2B2118)', display: 'block', marginBottom: '0.375rem' }}>
                Phone Number <span style={{ color: 'var(--brick, #C25E3E)' }}>*</span>
              </label>
              <div className={styles.phoneGroup}>
                <span className={styles.countryCode}>
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
              label="Email (Optional)"
              type="email"
              placeholder="e.g. ankit@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Card 2: Delivery Address */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Delivery Address
            </h2>
            <Input
              label="Flat / House / Floor / Society"
              placeholder="e.g. Flat 604, Tower 3, Palm Meadows"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              label="Delivery Pincode"
              placeholder="e.g. 201308"
              maxLength={6}
              required
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          {/* Card 3: Payment Method Radios */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Payment Method
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingTop: '0.25rem' }}>
              {[
                { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: <Smartphone style={{ width: '20px', height: '20px', color: '#3F5B34' }} /> },
                { id: 'Cards', label: 'Credit or Debit Card', icon: <CreditCard style={{ width: '20px', height: '20px', color: '#3F5B34' }} /> },
                { id: 'Netbanking', label: 'Netbanking', icon: <Landmark style={{ width: '20px', height: '20px', color: '#3F5B34' }} /> },
                { id: 'Cash on delivery', label: 'Cash on Delivery (Pay at doorstep)', icon: <Banknote style={{ width: '20px', height: '20px', color: '#3F5B34' }} /> },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`${styles.paymentOption} ${paymentMethod === method.id ? styles.selected : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      style={{ accentColor: 'var(--moss, #3F5B34)', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--soil, #2B2118)' }}>{method.label}</span>
                  </div>
                  {method.icon}
                </label>
              ))}
            </div>
          </div>

          {/* Order Total Overview */}
          <div className={styles.card} style={{ gap: '0.5rem', fontSize: '0.875rem', color: 'var(--soil, #2B2118)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal ({totalCount} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--clay, #8B6B4A)' }}>
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', color: 'var(--soil, #2B2118)', paddingTop: '0.5rem', borderTop: '1px solid rgba(230, 216, 189, 0.6)' }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--moss, #3F5B34)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>₹{orderTotal}</span>
            </div>
          </div>

          {/* Consent Checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '12px', color: 'var(--clay, #8B6B4A)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              style={{ marginTop: '2px', accentColor: 'var(--moss, #3F5B34)', width: '16px', height: '16px' }}
              required
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" style={{ color: 'var(--moss, #3F5B34)', textDecoration: 'underline' }}>
                terms & conditions
              </Link>{' '}
              and privacy policy.
            </span>
          </label>

          {/* Moss "Pay securely" Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            style={{ height: '56px', fontWeight: 600, fontSize: '1rem' }}
            icon={<ShieldCheck style={{ width: '20px', height: '20px' }} />}
          >
            Pay Securely ₹{orderTotal}
          </Button>
        </form>
      </div>

      {/* DEMO PAYMENT SIMULATION SHEET */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Simulated Demo Payment"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(221, 231, 207, 0.6)', borderRadius: '12px', border: '1px solid rgba(63, 91, 52, 0.2)', fontSize: '12px', color: 'var(--soil, #2B2118)' }}>
            🔔 <strong>Frontend Prototype:</strong> No real money will be charged. Choose an outcome to test order handling.
          </div>

          <div style={{ padding: '0.5rem 0' }}>
            <span style={{ fontSize: '12px', color: 'var(--clay, #8B6B4A)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Payable Amount</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--soil, #2B2118)' }}>₹{orderTotal}</span>
            <span style={{ fontSize: '12px', color: 'var(--clay, #8B6B4A)', display: 'block', marginTop: '4px' }}>Method: {paymentMethod}</span>
          </div>

          {simulationState === 'processing' && (
            <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Loader2 style={{ width: '32px', height: '32px', color: '#3F5B34' }} className="animate-spin" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--soil, #2B2118)' }}>Processing bank authorization...</span>
            </div>
          )}

          {simulationState === 'failed' && (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(243, 213, 208, 0.8)', borderRadius: '12px', border: '1px solid rgba(194, 94, 62, 0.3)', fontSize: '12px', color: 'var(--brick, #C25E3E)', display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
              <AlertTriangle style={{ width: '20px', height: '20px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontWeight: 600 }}>Payment Simulation Failed</strong>
                <span>{failureReason}</span>
              </div>
            </div>
          )}

          {simulationState !== 'processing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleSimulatePayment(true)}
                icon={<CheckCircle2 style={{ width: '16px', height: '16px' }} />}
              >
                Simulate Successful Payment
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => handleSimulatePayment(false)}
              >
                Simulate Payment Failure
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
