import { QueryForm } from '../components/QueryForm';

export default function FAQPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">How Is My Privacy Protected?</h3>
          <p className="text-text-secondary">With QNect, your phone number is never shared. When someone scans your QR code, they connect with you through our secure Web-to-App system. You receive the call in the app, keeping your number 100% private and protected.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">What if I sell my car?</h3>
          <p className="text-text-secondary">Selling your car? Just deactivate your QR in the app. It’s unlinked instantly, and you can get a new QR for your new ride—easy and hassle-free.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">Do I need to pay every year?</h3>
          <p className="text-text-secondary">No! Get full QNect services free for 2 years when you purchase your QR for ₹299 + GST. After that, you can easily recharge to continue.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">Does the person scanning need the app?</h3>
          <p className="text-text-secondary">Nope! That’s the magic. Anyone with a smartphone camera can scan your QR. It opens in their web browser, and with a single tap, they can call you—no app required.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">How do I get the QR sticker?</h3>
          <p className="text-text-secondary">You’ll receive a high-resolution PDF instantly via email. Print it at home or at any local print shop and stick it on your vehicle—perfect to use until your original sticker arrives at your doorstep.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">Will this work without an internet connection?</h3>
          <p className="text-text-secondary">You need internet on your phone to receive calls. The person scanning also needs internet (Wi-Fi or mobile data) to load the calling page.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">Can I have multiple QRs on one account?</h3>
       <p className="text-text-secondary">Yes! Add multiple QRs to a single account—perfect for families or businesses with more than one vehicle.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">What if my phone is off or has no internet?</h3>
          <p className="text-text-secondary">The scanner will be notified if you’re unreachable. Soon, they’ll also be able to leave a call-back request directly through the app.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-primary-blue mb-2">Is this service available outside Jaipur?</h3>
          <p className="text-text-secondary">Absolutely! QNect works anywhere in India. As long as both phones have internet, it works seamlessly.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
        _ <h3 className="text-xl font-bold text-primary-blue mb-2">What is a "Web-to-App" call?</h3>
          <p className="text-text-secondary">It’s a secure call that starts from a web browser (the scanner) and rings directly inside your app—your number stays private, all thanks to WebRTC technology.</p>
        </div>
      </div>

      {/* Ask a Query Form (Fix #6) */}
      <div className="bg-white p-8 rounded-lg shadow-lg mt-16">
        <QueryForm formTitle="Still have questions? Ask us directly!" />
      </div>
    </main>
  );
}