export default function TermsPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-6">Terms & Conditions</h1>
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-text-secondary">
        <p>Welcome to QNect. By using our services, you agree to these terms. Please read them carefully.</p>
        
        <h2 className="text-xl font-bold text-primary-blue pt-4">1. Our Service</h2>
        <p>QNect provides a QR-based communication system to facilitate contact between a vehicle owner and another individual (scanner) without exchanging personal phone numbers. This is done via our secure Web-to-App calling technology.</p>
        
        <h2 className="text-xl font-bold text-primary-blue pt-4">2. User Accounts & Privacy</h2>
        <p>You must provide accurate information when registering an account. You are responsible for maintaining the confidentiality of your account and password.</p>
        <p>Our core commitment is to your privacy. We will not share, sell, or reveal your personal phone number to any scanner. All calls are routed anonymously. Please review our full Privacy Policy for more details.</p>
        
        <h2 className="text-xl font-bold text-primary-blue pt-4">3. User Responsibilities</h2>
        <p>You agree not to use the service for any illegal, harassing, or abusive purpose. You are solely responsible for your interactions with any individual you contact through the service.</p>
        <p>QNect is a facilitator of communication and is not responsible for the actions of any user or the resolution of any dispute.</p>
        
        <h2 className="text-xl font-bold text-primary-blue pt-4">4. Limitation of Liability</h2>
        <p>The QNect service is provided "as is." We do not guarantee 100% uptime or that the service will be free from errors. We are not liable for any damages (including towing fees, fines, or other penalties) that may occur as a result of a failed or missed connection.</p>
        
        <h2 className="text-xl font-bold text-primary-blue pt-4">5. Governing Law</h2>
        <p>These terms are governed by the laws of India. You agree to submit to the exclusive jurisdiction of the courts in Jaipur, Rajasthan, for any disputes.</p>
      </div>
    </main>
  );
}