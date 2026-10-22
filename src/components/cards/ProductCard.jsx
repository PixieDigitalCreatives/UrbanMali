import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Heart, Plus } from 'lucide-react';
import styles from './ProductCard.module.scss';

export const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      size: product.variants?.[0]?.size || 'Medium',
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link to={`/shop/${product.slug}`} className={styles.card} data-cursor="View">
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />

        <button
          onClick={handleLike}
          className={`${styles.likeButton} ${isLiked ? styles.isLiked : ''}`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`${styles.likeIcon} ${isLiked ? styles.likeIconFilled : ''}`} strokeWidth={1.6} />
        </button>

        <div className={styles.badgePosition}>
          <Badge variant="illustrative">Illustrative image</Badge>
        </div>

        <button onClick={handleQuickAdd} className={styles.quickAddButton} aria-label="Add to cart">
          <Plus className={styles.bagIcon} strokeWidth={1.8} />
          <span className={styles.quickAddLabel}>Add</span>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <span className={styles.category}>{product.category}</span>
          <span className={styles.stock}>
            <span className={styles.stockDot} /> In stock
          </span>
        </div>

        <div className={styles.titleRow}>
          <h3 className={styles.title}>{product.name}</h3>
          <span className={styles.price}>₹{product.price}</span>
        </div>
        <p className={styles.subtitle}>{product.subtitle}</p>
      </div>
    </Link>
  );
};
