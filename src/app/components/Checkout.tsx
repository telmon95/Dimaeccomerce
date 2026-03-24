import { useState } from 'react';
import { X, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { CartItem } from './CartDrawer';
import { formatCurrency } from '../lib/format';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface CheckoutProps {
  items: CartItem[];
  onClose: () => void;
  onComplete: () => void;
}

export function Checkout({ items, onClose, onComplete }: CheckoutProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 60;
  const grandTotal = total + shipping;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    const orderId = crypto.randomUUID();
    const orderPayloads = items.map((item) => ({
      order_id: orderId,
      user_id: userData.user?.id ?? null,
      customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      product_id: item.product.id,
      quantity: item.quantity,
      total_price: item.product.price * item.quantity,
      order_status: 'new',
      payment_status: 'pending',
      items: [
        {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          scent: item.selectedScent ?? null,
          quantity: item.quantity,
        },
      ],
      subtotal: total,
      shipping,
      total: grandTotal,
      status: 'pending',
    }));

    const { error } = await supabase.from('orders').insert(orderPayloads);
    if (error) {
      console.error(error);
      toast.error('Checkout failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      toast.error('Payment setup is missing. Please contact support.');
      setIsSubmitting(false);
      return;
    }

    const functionsUrl = supabaseUrl.replace('.supabase.co', '.functions.supabase.co');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        toast.error('Please log in again to continue.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${functionsUrl}/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          amount: grandTotal,
          orderId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          itemName: `Order ${orderId}`,
          returnUrl: `${window.location.origin}/`,
          cancelUrl: `${window.location.origin}/`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { url, data } = await response.json();
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      toast.error('Unable to start payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl">Checkout</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP</Label>
                    <Input
                      id="zip"
                      name="zip"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-4">Payment</h3>
              <div className="rounded-2xl border border-border bg-white/80 p-4 text-sm text-muted-foreground">
                You will be redirected to PayFast to complete payment securely.
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
              <CreditCard className="w-5 h-5" />
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-24">
            <h3 className="text-lg mb-4">Order Summary</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{item.product.name}</p>
                    <p className="text-sm mt-1">{formatCurrency(item.product.price * item.quantity)}</p>
                    {item.selectedScent && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Scent: {item.selectedScent}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
