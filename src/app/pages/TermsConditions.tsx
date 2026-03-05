export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white">
      <section className="bg-gradient-to-r from-[#b89573] to-[#8f6f55] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl">Terms & Conditions</h1>
          <p className="text-sm sm:text-base text-purple-100 mt-2">
            Please read these terms before placing an order.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-6 text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Orders & Payments</h2>
          <p>
            Orders are confirmed once payment is received. Prices are subject to change without notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Delivery</h2>
          <p>
            Delivery timelines may vary depending on location and availability. We will communicate any
            delays where possible.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Returns</h2>
          <p>
            Due to the personal nature of bath and body products, returns are accepted only for damaged
            or incorrect items. Please contact us within 48 hours of delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Contact</h2>
          <p>
            For order support, contact us at dimakatsosaltsandoils@gmail.com or WhatsApp +27 76 711 9637.
          </p>
        </section>
      </main>
    </div>
  );
}
