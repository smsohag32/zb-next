import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
   products: Product[];
   columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
   const gridCols = {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
   };

   return (
      <div className={`grid ${gridCols[columns]} gap-4 lg:gap-6`}>
         {products.map((product, index) => (
            <ProductCard
               key={product.id}
               product={product}
               index={index}
            />
         ))}
      </div>
   );
}
