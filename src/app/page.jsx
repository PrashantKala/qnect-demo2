import Link from 'next/link';
import Image from 'next/image';
// import { HeroSlider } from './components/HeroSlider'; // Import the slider

export default function HomePage() {
  return (
    <div>
      {/* Hero Section (Fix #3) */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-qnect-gradient"></div>

        {/* Optional Subtle Light Rays */}
        <div className="absolute inset-0 light-rays"></div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 md:px-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold glow-text">Cars can’t talk.</h1>
          <h2 className="text-5xl md:text-7xl font-bold text-accent-cyan glow-text mt-2">QNect can.</h2>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-100 leading-relaxed">
            The smart QR that gives your vehicle a voice. Instantly connect with owners for parking issues or emergencies — privately and securely.
          </p>

          <div className="mt-10">
            <Link href="/order-qr" className="gradient-border">
              Get Your QNect Now
            </Link>
          </div>
        </div>

        {/* Optional Blur Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
      </section>


      {/* How It Works Section (Fix #2 - Doc) */}
      <section id="how-it-works" className="py-20 container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary-blue">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-primary-blue mb-3">1. Get Your QR</h3>
            <p className="text-text-secondary">Get your personalized QNect QR code today! We’ll email you a high-quality PDF to print and display on your vehicle until your original sticker arrives at your doorstep.</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-primary-blue mb-3">2. Activate in App</h3>
            <p className="text-text-secondary">Download QNect app to activate and sync QR to your vehicle. Quick, encrypted, and fully private.</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-primary-blue mb-3">3. Get Connected</h3>
            <p className="text-text-secondary">If your car causes an issue, anyone can scan your QNect QR to contact you instantly—without ever seeing your phone number.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Fix #2 - Doc) */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-blue">Our Pricing</h2> {/* Title Updated */}
          <p className="text-lg text-text-secondary mt-4 mb-16">
            No subscriptions. No hidden fees. Just one price for a lifetime of convenience.
          </p>
          <div className="flex justify-center">
            <div
              className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl border-2 border-accent-cyan"
              style={{ boxShadow: "0 0 20px rgba(59, 218, 215, 0.3)" }}
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-blue text-white px-4 py-1 rounded-full text-sm font-semibold">Our Only Plan</span>
              <h3 className="text-3xl font-bold text-gray-400 mt-4">QNect Digital QR</h3>
              <p className="text-5xl font-bold my-4 text-primary-blue">
                ₹299 + GST
              </p>
              <ul className="text-text-secondary space-y-3 text-left my-8">
                <li>✓ <strong>Instant Soft Copy:</strong> Till original QNect OR is delivered to your doorstep.</li>
                <li>✓ <strong>Validity:</strong> Enjoy our services for Two year from the date of activation with easy recharge to continue enjoying hassle-free connections.</li>
                <li>✓ <strong>100% Privacy:</strong> With QNect, your number is never shared—so you can connect instantly without compromising your privacy.</li>
              </ul>
              <Link
                href="/order-qr"
                className="inline-block w-full px-10 py-4 bg-accent-cyan text-primary-blue text-lg font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90"
                style={{ boxShadow: "0 4px 15px rgba(59, 218, 215, 0.3)" }}
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section (Fix #2 - Doc) */}
      <section id="reviews" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-blue mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-left flex flex-col">
              <Image src="https://placehold.co/100x100/EBF8FF/1C2541?text=A.S." alt="Reviewer A. Sharma" width={80} height={80} className="rounded-full mb-4 self-center" />
              <p className="text-text-secondary flex-grow">"Got a call via the QNect app while in a meeting—my car was blocking someone. Problem solved in 2 minutes! Every car in Jaipur needs this."</p>
              <p className="font-bold text-primary-blue mt-4 text-center">- A. Sharma</p>
            </div>
            {/* Review 2 */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-left flex flex-col">
              <Image src="https://placehold.co/100x100/EBF8FF/1C2541?text=R.S." alt="Reviewer R. Singh" width={80} height={80} className="rounded-full mb-4 self-center" />
              <p className="text-text-secondary flex-grow">"I was worried about putting my phone number on my car. QNect is the perfect solution. So simple and totally private."</p>
              <p className="font-bold text-primary-blue mt-4 text-center">- R. Singh</p>
            </div>
            {/* Review 3 */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-left flex flex-col">
              <Image src="https://placehold.co/100x100/EBF8FF/1C2541?text=P.K." alt="Reviewer Priya K." width={80} height={80} className="rounded-full mb-4 self-center" />
              <p className="text-text-secondary flex-grow">"The best ₹299 I've spent. It's already saved me from one towing. The peace of mind is worth 10x the price."</p>
              <p className="font-bold text-primary-blue mt-4 text-center">- Priya K.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (First 3 FAQs) */}
<section id="faq" className="py-20 container mx-auto px-6">
  <h2 className="text-4xl font-bold text-primary-blue mb-16 text-center">
    Frequently Asked Questions
  </h2>

  <div className="space-y-16">
    {/* Row 1 - FAQ left, Image right */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-2xl font-bold text-primary-blue mb-3">
          How is my privacy protected?
        </h3>
        <p className="text-text-secondary text-lg leading-relaxed">
          With QNect, your phone number is never shared. When someone scans your
          QR code, they connect with you through our secure Web-to-App system.
          You receive the call in the app, keeping your number 100% private and
          protected.
        </p>
      </div>
      <img
        src="https://via.placeholder.com/500x350"
        alt="Privacy Protection"
        className="w-full rounded-xl shadow-md"
      />
    </div>

    {/* Row 2 - Image left, FAQ right */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <img
        src="https://via.placeholder.com/500x350"
        alt="Sell Car"
        className="w-full rounded-xl shadow-md order-1 md:order-none"
      />
      <div>
        <h3 className="text-2xl font-bold text-primary-blue mb-3">
          What if I sell my car?
        </h3>
        <p className="text-text-secondary text-lg leading-relaxed">
          Selling your car? Just deactivate your QR in the app. It’s unlinked
          instantly, and you can get a new QR for your new ride—easy and
          hassle-free.
        </p>
      </div>
    </div>

    {/* Row 3 - FAQ left, Image right */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-2xl font-bold text-primary-blue mb-3">
          Do I need to pay every year?
        </h3>
        <p className="text-text-secondary text-lg leading-relaxed">
          No! Get full QNect services free for 2 years when you purchase your QR
          for ₹299 + GST. After that, you can easily recharge to continue.
        </p>
      </div>
      <img
        src="https://via.placeholder.com/500x350"
        alt="Payment Info"
        className="w-full rounded-xl shadow-md"
      />
    </div>
  </div>

  <div className="text-center mt-16">
    <Link
      href="/faq"
      className="inline-block px-10 py-4 bg-primary-blue text-white text-lg font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      Have More Questions?
    </Link>
  </div>
</section>


      {/* Refer Section (No changes, but now in correct theme) */}
      <section id="refer" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-blue mb-6">Refer a Friend, Get Rewarded</h2>
          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
            Love QNect? Share it with your friends and family. Our referral program is coming soon!
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-primary-blue mb-4">Coming Soon</h3>
            <p className="text-text-secondary">We're building a system to reward you for spreading the word. Stay tuned for updates in the app!</p>
          </div>
        </div>
      </section>

      {/* Sticky App Scanner */}
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