import { X, ShoppingCart, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from './ProductCard';
import { formatCurrency } from '../lib/format';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl">{product.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <p className="text-3xl mb-4">{formatCurrency(product.price)}</p>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg mb-3">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={handleAddToCart} size="lg" className="gap-2 mt-auto">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
