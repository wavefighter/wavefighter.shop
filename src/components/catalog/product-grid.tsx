import { ProductCard } from '@/components/catalog/product-card';
import type { Brand, Product } from '@/lib/content';

/**
 * Mobile-first: one column, then two, then three. Never four — at a 1240px container a
 * four-up grid shrinks the product photograph below the size at which it can sell anything,
 * and on this site the photograph is the argument.
 *
 * `priorityCount` marks the above-the-fold cards for eager loading; everything below stays
 * lazy.
 */
export const ProductGrid = ({
  products,
  brandsById,
  priorityCount = 0,
}: {
  products: Product[];
  brandsById: Map<string, Brand>;
  priorityCount?: number;
}) => (
  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
    {products.map((product, index) => (
      <li key={product.id}>
        <ProductCard
          product={product}
          brand={product.brandId ? brandsById.get(product.brandId) : undefined}
          priority={index < priorityCount}
        />
      </li>
    ))}
  </ul>
);
