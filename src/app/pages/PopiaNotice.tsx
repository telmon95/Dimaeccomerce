export default function PopiaNotice() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white">
      <section className="bg-gradient-to-r from-[#b89573] to-[#8f6f55] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl">POPIA Compliance Notice</h1>
          <p className="text-sm sm:text-base text-purple-100 mt-2">
            Your personal information is handled in line with POPIA.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-6 text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-lg text-foreground">What we collect</h2>
          <p>
            We collect your name, email, contact number, and delivery address to fulfill orders and
            provide support.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Why we collect it</h2>
          <p>
            Your data is used to process orders, communicate order updates, and provide customer service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Your rights</h2>
          <p>
            You may request access, correction, or deletion of your personal information at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Contact</h2>
          <p>
            Email: dimakatsosaltsandoils@gmail.com
            <br />
            WhatsApp: +27 76 711 9637
          </p>
        </section>
      </main>
    </div>
  );
}
