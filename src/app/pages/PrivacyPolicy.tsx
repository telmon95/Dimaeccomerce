export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white">
      <section className="bg-gradient-to-r from-[#b89573] to-[#8f6f55] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-purple-100 mt-2">
            POPIA‑aligned privacy notice for Dimakatso Salts & Oils.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-6 text-muted-foreground">
        <p>
          We respect your privacy and handle your personal information in line with the Protection of
          Personal Information Act (POPIA). This policy explains what data we collect, why we collect it,
          and how you can control it.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, email address, and contact details</li>
            <li>Shipping address and order details</li>
            <li>Account information for login and password reset</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Why we collect it</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and deliver your orders</li>
            <li>To communicate order updates</li>
            <li>To manage your account and preferences</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">How we protect your data</h2>
          <p>
            We use secure storage and access controls. Only authorized admins can view order records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg text-foreground">Your rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request access to your data</li>
            <li>Request corrections</li>
            <li>Request deletion of your account and data</li>
          </ul>
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
