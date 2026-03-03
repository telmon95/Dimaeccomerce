import { ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatCurrency } from '../lib/format';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  benefits: string[];
  scentOptions?: string[];
  sizeG?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedScent?: string) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [selectedScent, setSelectedScent] = useState<string | undefined>(
    product.scentOptions?.[0]
  );
  const hasScentOptions = useMemo(
    () => Boolean(product.scentOptions && product.scentOptions.length > 0),
    [product.scentOptions]
  );
  const priceLabel = product.scentOptions && product.scentOptions.length > 0
    ? `From ${formatCurrency(product.price)}`
    : formatCurrency(product.price);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-square overflow-hidden bg-gray-100" onClick={() => onViewDetails(product)}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>
      <CardHeader onClick={() => onViewDetails(product)}>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <CardTitle className="text-xl line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[3.5rem]">{product.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-2xl">{priceLabel}</span>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {hasScentOptions && (
            <Select value={selectedScent} onValueChange={setSelectedScent}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select scent" />
              </SelectTrigger>
              <SelectContent>
                {product.scentOptions?.map((scent) => (
                  <SelectItem key={scent} value={scent}>
                    {scent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => onAddToCart(product, selectedScent)} className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
