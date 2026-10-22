import React from 'react';
import { LogoMark } from '../components/ui/LogoMark';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Chip } from '../components/ui/Chip';
import { Card } from '../components/ui/Card';
import {
  Sparkles,
  Search,
  ShoppingBag,
  MapPin,
  Clock,
  Mail,
  UserCheck,
  Send,
  Store,
  Grid,
} from 'lucide-react';
import styles from './DesignSystemPage.module.scss';

const SWATCHES = [
  { name: 'soil', hex: '#0E3529', text: '#FBF8F1' },
  { name: 'brown', hex: '#2E4A40', text: '#FBF8F1' },
  { name: 'clay', hex: '#5F7268', text: '#FBF8F1' },
  { name: 'tan', hex: '#CDB77E', text: '#0E3529' },
  { name: 'beige', hex: '#F5F0E4', text: '#0E3529', border: true },
  { name: 'card', hex: '#FBF8F1', text: '#0E3529', border: true },
  { name: 'sand', hex: '#E7DEC6', text: '#0E3529', border: true },
  { name: 'moss', hex: '#1F5E46', text: '#FBF8F1' },
  { name: 'moss-hover', hex: '#4A8B6E', text: '#FBF8F1' },
  { name: 'sage', hex: '#8DB8A2', text: '#0E3529' },
  { name: 'sage-light', hex: '#DCE8DF', text: '#0E3529', border: true },
  { name: 'gold', hex: '#B6994F', text: '#0E3529' },
];

export const DesignSystemPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.subTitle}>
          Visual QA & Crop 10 Specimen
        </span>
        <h1 className={styles.mainTitle}>
          The UrbanMaali Design System
        </h1>
        <p className={styles.desc}>
          Brand color swatches, Instrument Serif display typography, Manrope UI text, and interactive components.
        </p>
      </div>

      {/* 1. Brand Logo */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>1. Brand Logo Marks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--clay, #5F7268)' }}>Standard (Beige page background)</span>
            <LogoMark variant="dark" />
          </Card>
          <div style={{ backgroundColor: 'var(--soil, #0E3529)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '12px', color: 'rgba(231, 222, 198, 0.6)' }}>Light variant (Soil footer background)</span>
            <LogoMark variant="light" />
          </div>
        </div>
      </section>

      {/* 2. Swatches */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>2. Color Swatches (Crop 10)</h2>
        <div className={styles.swatchGrid}>
          {SWATCHES.map((s) => (
            <div
              key={s.name}
              className={styles.swatchCard}
            >
              <div
                className={styles.swatchCircle}
                style={{
                  backgroundColor: s.hex,
                  border: s.border ? '1px solid var(--sand, #E7DEC6)' : 'none',
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--soil, #0E3529)', textTransform: 'capitalize' }}>{s.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--clay, #5F7268)', fontFamily: 'monospace', marginTop: '2px' }}>{s.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>3. Typography Specimens</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--clay, #5F7268)', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>Headings: Instrument Serif (display)</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', color: 'var(--soil, #0E3529)', fontWeight: 600, marginBottom: '0.5rem' }}>Aa Bb Gg</div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--soil, #0E3529)', fontWeight: 500 }}>
              "Bring Nature Home to your doorstep"
            </p>
          </Card>
          <Card style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--clay, #5F7268)', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>Body & UI: Manrope (sans)</span>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '2.25rem', color: 'var(--soil, #0E3529)', fontWeight: 700, marginBottom: '0.5rem' }}>Aa Bb Gg</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--clay, #5F7268)', lineHeight: 1.625 }}>
              Your urban gardening partner for homes, societies, offices and more. Clean, accessible, and responsive.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>4. Button Variants & States</h2>
        <Card style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Button variant="primary" size="md">Primary Button</Button>
          <Button variant="outline" size="md">Outline Button</Button>
          <Button variant="ghost" size="md">Ghost Button</Button>
          <Button variant="primary" size="pill">Mobile Pill CTA</Button>
          <Button variant="primary" size="md" isLoading>Loading State</Button>
          <Button variant="primary" size="md" disabled>Disabled</Button>
        </Card>
      </section>

      {/* 5. Semantic Badges */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>5. Semantic Badges</h2>
        <Card style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="stock">In stock</Badge>
          <Badge variant="out">Out of stock</Badge>
          <Badge variant="soon">Coming soon</Badge>
          <Badge variant="request">Price on request</Badge>
          <Badge variant="illustrative">Illustrative image</Badge>
          <Badge variant="sage">Up to 20 pots</Badge>
        </Card>
      </section>

      {/* 6. Inputs & Chips */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>6. Inputs & Interactive Chips</h2>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input label="Default Input" placeholder="Enter your name" />
          <Input label="Input with Error" placeholder="Enter pincode" error="Please enter a valid 6-digit pincode" />
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--soil, #0E3529)', display: 'block', marginBottom: '0.5rem' }}>Chip Variants</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Chip selected={true}>Selected Solid (Home)</Chip>
              <Chip selected={false}>Default Chip (Society)</Chip>
              <Chip selected={true} variant="soft">Selected Soft (Indoor)</Chip>
              <Chip selected={false} variant="soft">Category (Balcony)</Chip>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
