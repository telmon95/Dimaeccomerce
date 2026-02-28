import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { ProductCard, Product } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { formatCurrency } from './lib/format';
import { supabase } from './lib/supabaseClient';
import AdminApp from './admin/AdminApp';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

const logo = new URL('../assets/logo.jpeg', import.meta.url).toString();
const aboutImage = new URL('../assets/about.jpeg', import.meta.url).toString();

type SupabaseProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number | string | null;
  image_url: string | null;
  category: string | null;
  benefits: string[] | null;
  is_special: boolean | null;
  is_active: boolean | null;
};

const mapProduct = (product: SupabaseProduct): Product => {
  const price =
    typeof product.price === 'number'
      ? product.price
      : parseFloat(product.price ?? '0');

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    price: Number.isFinite(price) ? price : 0,
    image: product.image_url ?? '',
    category: product.category ?? 'General',
    benefits: product.benefits ?? [],
  };
};

interface StorefrontProps {
  products: Product[];
  specials: Product[];
  isLoading: boolean;
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  selectedProduct: Product | null;
  onAddToCart: (product: Product) => void;
  onCheckout: () => void;
  onCloseCart: () => void;
  onCloseCheckout: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  onCloseDetails: () => void;
  onCheckoutComplete: () => void;
}

function Storefront({
  products,
  specials,
  isLoading,
  cart,
  isCartOpen,
  isCheckoutOpen,
  selectedProduct,
  onAddToCart,
  onCheckout,
  onCloseCart,
  onCloseCheckout,
  onRemoveItem,
  onUpdateQuantity,
  onViewDetails,
  onCloseDetails,
  onCheckoutComplete,
}: StorefrontProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#b89573] to-[#8f6f55] text-white py-14 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">Transform Your Bath Time</h2>
          <p className="text-base sm:text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto">
            Discover our premium collection of handcrafted bath salts made with natural ingredients
          </p>
        </div>
      </section>

      {/* Specials Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl mb-2">Specials</h2>
          <p className="text-muted-foreground">Limited-time picks we are loving right now</p>
        </div>
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white/80 p-10 text-center text-muted-foreground">
            Loading specials...
          </div>
        ) : specials.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white/80 p-10 text-center text-muted-foreground">
            Specials are coming soon. Check back for seasonal bundles and offers.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specials.map((product) => (
              <ProductCard
                key={`special-${product.id}`}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl mb-2">Our Collection</h2>
          <p className="text-muted-foreground">Choose from our carefully curated selection</p>
        </div>
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white/80 p-10 text-center text-muted-foreground">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white/80 p-10 text-center text-muted-foreground">
            Products are coming soon. Check back for new arrivals.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Dimakatso. All natural ingredients, handcrafted with care.</p>
          <p className="text-sm mt-2">Free shipping on orders over {formatCurrency(50)}</p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={onCloseDetails}
          onAddToCart={onAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={onCloseCart}
        items={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onCheckout={onCheckout}
      />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Checkout
          items={cart}
          onClose={onCloseCheckout}
          onComplete={onCheckoutComplete}
        />
      )}
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white">
      <section className="bg-gradient-to-r from-[#b89573] to-[#8f6f55] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-4">dimakatso_salts</h2>
          <p className="text-lg md:text-xl text-purple-100">
            Because rest is not a luxury — it’s medicine.
          </p>
          <p className="text-lg md:text-xl text-purple-100 mt-3">
            ✨ Soak. Breathe. Release. ✨
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Melt away stress and tension with dimakatso_salts — handcrafted bath salts designed to relax
              and soothe your mind, body, and soul. Infused with calming botanicals and gentle aromas, each
              soak turns your bath into a spa-like ritual of restoration.
            </p>
            <p>
              Whether you’re unwinding after a long day or pouring back into yourself, dimakatso_salts
              helps you pause, reset, and exhale.
            </p>
            <div className="bg-white/80 border border-border rounded-2xl p-6">
              <ul className="space-y-3 text-base text-foreground">
                <li>Healing begins in the soak.</li>
                <li>Your sacred moment of calm.</li>
                <li>Relax deeply. Soak intentionally.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <img
              src={aboutImage}
              alt="Dimakatso salts bath soak lifestyle"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface SiteHeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

function SiteHeader({ cartItemCount, onOpenCart, isAuthenticated, onLogout }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-30 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-border bg-white p-1">
            <img
              src={logo}
              alt="Dimakatso Salts and Oils logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl">Dimakatso</h1>
            <p className="text-xs text-muted-foreground">Salts and Oils</p>
          </div>
        </Link>
        
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <Button variant="ghost" asChild className="px-3">
            <Link to="/about">About</Link>
          </Button>
          {isAuthenticated ? (
            <Button variant="ghost" onClick={onLogout} className="px-3">
              Log out
            </Button>
          ) : (
            <Button variant="ghost" asChild className="px-3">
              <Link to="/login">Login</Link>
            </Button>
          )}
          <Button
            variant="outline"
            className="relative gap-2 px-3"
            onClick={onOpenCart}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [specials, setSpecials] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(data.session ? { user: { id: data.session.user.id } } : null);
      }
    };

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession ? { user: { id: newSession.user.id } } : null);
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        toast.error('Failed to load products. Please refresh.');
        if (isMounted) {
          setProducts([]);
          setSpecials([]);
          setIsLoading(false);
        }
        return;
      }

      const rows = (data ?? []) as SupabaseProduct[];
      const specialsData = rows.filter((item) => item.is_special);
      const collectionData = rows.filter((item) => !item.is_special);

      if (isMounted) {
        setSpecials(specialsData.map(mapProduct));
        setProducts(collectionData.map(mapProduct));
        setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    toast.info('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!session) {
      toast.info('Please log in or sign up to continue.');
      window.location.href = '/login';
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
    setCart([]);
    toast.success('Order placed successfully! Thank you for your purchase.');
  };

  const AdminGate = ({ children }: { children: React.ReactNode }) => {
    const [status, setStatus] = useState<'checking' | 'unauth' | 'forbidden' | 'ok'>('checking');

    useEffect(() => {
      let isMounted = true;

      const checkAdmin = async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          if (isMounted) setStatus('unauth');
          return;
        }

        const userId = sessionData.session.user.id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (isMounted) {
          setStatus(profile?.role === 'admin' ? 'ok' : 'forbidden');
        }
      };

      checkAdmin();

      return () => {
        isMounted = false;
      };
    }, []);

    if (status === 'checking') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white flex items-center justify-center">
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      );
    }

    if (status === 'unauth') {
      return <Navigate to="/login" replace />;
    }

    if (status === 'forbidden') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white/90 border border-border rounded-2xl p-8 text-center shadow-sm">
            <h1 className="text-xl mb-2">Admin access required</h1>
            <p className="text-muted-foreground mb-4">
              This account does not have permission to access the admin panel.
            </p>
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <SiteHeader
        cartItemCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        isAuthenticated={Boolean(session)}
        onLogout={async () => {
          await supabase.auth.signOut();
          toast.success('Logged out');
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Storefront
              products={products}
              specials={specials}
              isLoading={isLoading}
              cart={cart}
              isCartOpen={isCartOpen}
              isCheckoutOpen={isCheckoutOpen}
              selectedProduct={selectedProduct}
              onAddToCart={handleAddToCart}
              onCheckout={handleCheckout}
              onCloseCart={() => setIsCartOpen(false)}
              onCloseCheckout={() => setIsCheckoutOpen(false)}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onViewDetails={setSelectedProduct}
              onCloseDetails={() => setSelectedProduct(null)}
              onCheckoutComplete={handleCheckoutComplete}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin/*"
          element={
            <AdminGate>
              <AdminApp />
            </AdminGate>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
