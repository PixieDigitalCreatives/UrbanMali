import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Heart, ShoppingBag } from 'lucide-react';
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
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link
      to={`/shop/${product.slug}`}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
        />

        <button
          onClick={handleLike}
          className={`${styles.likeButton} ${isLiked ? styles.isLiked : ''}`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`${styles.likeIcon} ${isLiked ? styles.likeIconFilled : ''}`} />
        </button>

        <div className={styles.badgePosition}>
          <Badge variant="illustrative">Illustrative image</Badge>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <div className={styles.headerRow}>
            <span className={styles.category}>
              {product.category}
            </span>
            <Badge variant="stock">In stock</Badge>
          </div>

          <h3 className={styles.title}>
            {product.name}
          </h3>
          <p className={styles.subtitle}>
            {product.subtitle}
          </p>
        </div>

        <div className={styles.footerRow}>
          <span className={styles.price}>
            ₹{product.price}
          </span>
          <button
            onClick={handleQuickAdd}
            className={styles.quickAddButton}
            aria-label="Add to cart"
          >
            <ShoppingBag className={styles.bagIcon} />
          </button>
        </div>
      </div>
    </Link>
  );
};
