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
  { name: 'soil', hex: '#2B2118', text: '#FAF5EA' },
  { name: 'brown', hex: '#5A4330', text: '#FAF5EA' },
  { name: 'clay', hex: '#8B6B4A', text: '#FAF5EA' },
  { name: 'tan', hex: '#C9A87C', text: '#2B2118' },
  { name: 'beige', hex: '#F4ECDD', text: '#2B2118', border: true },
  { name: 'card', hex: '#FAF5EA', text: '#2B2118', border: true },
  { name: 'sand', hex: '#E6D8BD', text: '#2B2118', border: true },
  { name: 'moss', hex: '#3F5B34', text: '#FAF5EA' },
  { name: 'moss-hover', hex: '#5E7F4A', text: '#FAF5EA' },
  { name: 'sage', hex: '#A9BE8F', text: '#2B2118' },
  { name: 'sage-light', hex: '#DDE7CF', text: '#2B2118', border: true },
  { name: 'leaf', hex: '#C8D96A', text: '#2B2118' },
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
          Pixel-exact implementation of approved color swatches, Fraunces serif typography, Inter UI tokens, and interactive components.
        </p>
      </div>

      {/* 1. Brand Logo */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>1. Brand Logo Marks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--clay, #8B6B4A)' }}>Standard (Beige page background)</span>
            <LogoMark variant="dark" />
          </Card>
          <div style={{ backgroundColor: 'var(--soil, #2B2118)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '12px', color: 'rgba(230, 216, 189, 0.6)' }}>Light variant (Soil footer background)</span>
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
                  border: s.border ? '1px solid var(--sand, #E6D8BD)' : 'none',
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--soil, #2B2118)', textTransform: 'capitalize' }}>{s.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--clay, #8B6B4A)', fontFamily: 'monospace', marginTop: '2px' }}>{s.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>3. Typography Specimens</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--clay, #8B6B4A)', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>Headings: Fraunces (serif)</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', color: 'var(--soil, #2B2118)', fontWeight: 600, marginBottom: '0.5rem' }}>Aa Bb Gg</div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--soil, #2B2118)', fontWeight: 500 }}>
              "Bring Nature Home to your doorstep"
            </p>
          </Card>
          <Card style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--clay, #8B6B4A)', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>Body & UI: Inter (sans)</span>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '2.25rem', color: 'var(--soil, #2B2118)', fontWeight: 700, marginBottom: '0.5rem' }}>Aa Bb Gg</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--clay, #8B6B4A)', lineHeight: 1.625 }}>
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
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--soil, #2B2118)', display: 'block', marginBottom: '0.5rem' }}>Chip Variants</label>
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
