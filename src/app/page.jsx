import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center text-center relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-blue leading-tight">
            Cars can't talk.
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-accent-cyan mt-2">
            But QNect can.
          </h2>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-text-secondary">
            The smart QR that gives your vehicle a voice. Instantly connect with owners for parking issues or emergencies—privately and securely.
          </p>
          <div className="mt-10">
            <Link href="/order-qr" className="inline-block px-10 py-4 bg-accent-cyan text-primary-blue text-lg font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90"
              style={{ boxShadow: "0 4px 15px theme('colors.accent-cyan / 30%')" }}>
              Get Your QNect Now
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary-blue">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-primary-blue mb-3">1. Get Your QR</h3>
            <p className="text-text-secondary">Order your unique QNect QR code. We'll email you a high-quality PDF to print and display on your vehicle.</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-primary-blue mb-3">2. Activate in App</h3>
            <p className="text-text-secondary">Download the QNect app and scan your QR to link it securely to your account. Your details are now 100% private.</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-primary-blue mb-3">3. Get Connected</h3>
            <p className="text-text-secondary">If your car is causing an issue, anyone can scan the QR to call you instantly via our app, without ever seeing your phone number.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Fix #12) */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-blue">Simple, One-Time Price</h2>
          <p className="text-lg text-text-secondary mt-4 mb-16"> {/* Added more bottom margin */}
            No subscriptions. No hidden fees. Just one price for a lifetime of convenience.
          </p>
          <div className="flex justify-center">
            {/* Increased width from max-w-sm to max-w-md */}
            <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl border-2 border-accent-cyan"
                 style={{ boxShadow: "0 0 20px theme('colors.accent-cyan / 30%')" }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-blue text-white px-4 py-1 rounded-full text-sm font-semibold">Our Only Plan</span>
              <h3 className="text-3xl font-bold text-gray-400 mt-4">QNect Digital QR</h3>
              <p className="text-5xl font-bold my-4 text-primary-blue">
                ₹399
              </p>
              <ul className="text-text-secondary space-y-2 text-left my-8">
                <li className="flex items-center gap-2">✓ <strong>Instant Soft Copy:</strong> PDF emailed to you.</li>
                <li className="flex items-center gap-2">✓ <strong>Lifetime Validity:</strong> Pay once, use forever.</li>
                <li className="flex items-center gap-2">✓ <strong>Unlimited Secure Calls:</strong> Via our Web-to-App tech.</li>
                <li className="flex items-center gap-2">✓ <strong>100% Privacy:</strong> Your number is never shared.</li>
              </ul>
              <Link href="/order-qr" className="inline-block w-full px-10 py-4 bg-accent-cyan text-primary-blue text-lg font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90"
                 style={{ boxShadow: "0 4px 15px theme('colors.accent-cyan / 30%')" }}>
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-100">
         <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-blue mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-left">
              <p className="text-text-secondary">"Got a call from the app while I was in a meeting. My car was blocking someone. Solved the issue in 2 minutes. This is a must-have in Jaipur!"</p>
              <p className="font-bold text-primary-blue mt-4">- A. Sharma</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-left">
              <p className="text-text-secondary">"I was worried about putting my phone number on my car. QNect is the perfect solution. So simple and totally private."</p>
              <p className="font-bold text-primary-blue mt-4">- R. Singh</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-left">
              <p className="text-text-secondary">"The best ₹399 I've spent. It's already saved me from one towing. The peace of mind is worth 10x the price."</p>
              <p className="font-bold text-primary-blue mt-4">- Priya K.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Fix #6) */}
      <section id="faq" className="pt-20 container mx-auto px-6">
        <h2 className="text-4xl font-bold text-primary-blue mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
             <h3 className="text-xl font-bold text-primary-blue mb-2">How is my privacy protected?</h3>
             <p className="text-text-secondary">Your phone number is never shared. When someone scans your QR, they call you through our secure Web-to-App system. You receive an app call, and your number stays 100% private.</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-primary-blue mb-2">What if I sell my car?</h3>
            <p className="text-text-secondary">In the app, you can simply deactivate your QR code. The code will no longer be linked to your account. You can then activate a new QR for your new car.</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-primary-blue mb-2">Do I need to pay every year?</h3>
            <p className="text-text-secondary">No. Our ₹399 plan is a one-time payment for lifetime validity. No subscriptions, no recurring fees.</p>
          </div>
        </div>
        {/* "Know More" Button */}
        <div className="text-center mt-12">
            <Link href="/faq" className="inline-block px-10 py-4 bg-primary-blue text-white text-lg font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                Have More Questions?
            </Link>
        </div>
      </section>
      
      {/* Refer Section (No changes) */}
      <section id="refer" className="py-20 bg-white">
        {/* ... (content is fine) ... */}
      </section>

      {/* Sticky App Scanner (Fix #5) */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white p-4 rounded-lg shadow-2xl border border-border-color text-center">
            <p className="font-bold text-primary-blue mb-2">Get the App</p>
            <div className="w-24 h-24 bg-gray-100 border-border-color border-2 rounded-lg mx-auto flex items-center justify-center text-gray-500 text-sm p-1">
                [App QR Code]
            </div>
            <p className="text-xs text-text-secondary mt-2">Scan to Download</p>
        </div>
      </div>

    </div>
  );
}