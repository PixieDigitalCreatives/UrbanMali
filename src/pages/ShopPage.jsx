import React, { useState } from 'react';
import { products, productCategories } from '../data/products';
import { ProductCard } from '../components/cards/ProductCard';
import { Chip } from '../components/ui/Chip';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Search, SlidersHorizontal, Sprout } from 'lucide-react';
import styles from './ShopPage.module.scss';

export const ShopPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedSunlight, setSelectedSunlight] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSun =
      selectedSunlight === 'All' || p.sunlight === selectedSunlight;
    return matchesSearch && matchesCat && matchesSun;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Plant Nursery & Shop
          </h1>
          <p className={styles.subtitle}>
            Healthy air-purifying foliage, balcony varieties, handcrafted pots, and enriched soil mixes.
          </p>
        </div>

        {/* Search Bar + Filter Button */}
        <div className={styles.searchFilterBar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search plants, pots, soil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            onClick={() => setFilterModalOpen(true)}
            className={styles.filterBtn}
            aria-label="Filter products"
          >
            <SlidersHorizontal style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Category Chips */}
        <div className={styles.chipScroll}>
          {productCategories.map((cat) => (
            <Chip
              key={cat}
              selected={selectedCategory === cat}
              variant="soft"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Chip>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <Sprout style={{ width: '32px', height: '32px' }} />
            </div>
            <h3 className={styles.emptyTitle}>No plants found</h3>
            <p className={styles.emptyDesc}>
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedSunlight('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet / Modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter & Sort Products"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          {/* Sunlight */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Sunlight Requirement
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['All', 'Low light', 'Moderate light', 'Bright direct'].map((sun) => (
                <Chip
                  key={sun}
                  selected={selectedSunlight === sun}
                  onClick={() => setSelectedSunlight(sun)}
                >
                  {sun}
                </Chip>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Sort By
            </label>
            <div className={styles.radioGroup}>
              {[
                { label: 'Popularity', val: 'popular' },
                { label: 'Price: Low to High', val: 'price-asc' },
                { label: 'Price: High to Low', val: 'price-desc' },
              ].map((opt) => (
                <label key={opt.val} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === opt.val}
                    onChange={() => setSortBy(opt.val)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setFilterModalOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </Modal>
    </div>
  );
};
