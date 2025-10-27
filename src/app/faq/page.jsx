import { QueryForm } from '../components/QueryForm';

export default function FAQPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">1. How is my privacy protected?</h3>
          <p className="text-text-secondary">Your phone number is never shared. When someone scans your QR, they call you through our secure Web-to-App system. You receive an app call, and your number stays 100% private.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">2. What if I sell my car?</h3>
          <p className="text-text-secondary">In the app, you can simply deactivate your QR code. The code will no longer be linked to your account. You can then activate a new QR for your new car.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">3. Do I need to pay every year?</h3>
          <p className="text-text-secondary">No. Our ₹399 plan is a one-time payment for lifetime validity. No subscriptions, no recurring fees.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">4. Does the person scanning need the app?</h3>
          <p className="text-text-secondary">No. That's the magic. Anyone with a smartphone camera can scan the QR code. It will open their web browser, where they can press a single button to call you.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">5. How do I get the QR sticker?</h3>
          <p className="text-text-secondary">We provide a high-resolution digital PDF instantly to your email. You can print this on a regular sticker sheet at home or at any local print shop.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">6. Will this work without an internet connection?</h3>
          <p className="text-text-secondary">You (the owner) need an internet connection on your phone to receive the app call. The scanner also needs an internet connection (mobile data or Wi-Fi) to load the calling page.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">7. Can I have multiple QRs on one account?</h3>
          <p className="text-text-secondary">Yes! After you create your account, you can purchase and add multiple QR codes from your profile. This is perfect for families or businesses with more than one vehicle.</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">8. What if my phone is off or has no internet?</h3>
          <p className="text-text-secondary">If you are unreachable, the scanner will be notified. We plan to add a feature for them to leave a text-based "call-back request" in a future update.</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">9. Is this service available outside of Jaipur?</h3>
          <p className="text-text-secondary">Yes! QNect works anywhere in India. As long as you and the scanner have an internet connection, the system will work perfectly.</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">10. What is a "Web-to-App" call?</h3>
          <p className="text-text-secondary">It's a call that starts from a web browser (the scanner) and rings directly inside your mobile app (your phone), all using the internet (WebRTC). This is what allows us to connect you without sharing any phone numbers.</p>
        </div>
      </div>

      {/* Ask a Query Form (Fix #6) */}
      <div className="bg-white p-8 rounded-lg shadow-lg mt-16">
        <QueryForm formTitle="Still have questions? Ask us directly!" />
      </div>
    </main>
  );
}