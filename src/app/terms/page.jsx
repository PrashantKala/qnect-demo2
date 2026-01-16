import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-6">QNect Terms and Conditions of Service</h1>
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-text-secondary">
        <p className="font-semibold">Effective Date: October 25, 2025</p>
        <p>Please read these Terms and Conditions ("Terms") carefully. By registering for, accessing, or using the "QR-Based Parking Contact System" (the "Service") provided by QNect (the "Enterprise," "we," "us," or "our"), you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">1. Acceptance of Terms</h2>
        <p>These Terms govern your use of the QNect website and the associated QR code service. You agree that you are legally capable of entering into a binding agreement and that you will use the Service in accordance with all applicable laws and regulations, including the Indian IT Act, 2000, and the Digital Personal Data Protection Act (DPDPA), 2023.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">2. The QNect Service</h2>
        <p>The Service is an IT-enabled platform designed to facilitate quick, privacy-preserving communication between a person inconvenienced by a parked vehicle (the "Scanner User") and the vehicle's owner (the "Registered User").</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Core Function:</strong> The service enables the Scanner User to call the Registered User via an intermediary phone number without revealing the direct personal phone number of either party.</li>
          <li><strong>Registration and Activation:</strong> The Service requires vehicle owners to securely sign up and undergo an Admin Approval Process to ensure the legitimacy and activation of their unique QR code.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">3. User Obligations and Responsibilities</h2>
        <h3 className="text-lg font-semibold text-text-primary mt-2">3.1. Obligations of Registered Users (Vehicle Owners)</h3>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Accurate Information:</strong> You must provide accurate, complete, and current information during registration, including your primary contact phone number, which will be used for call routing.</li>
          <li><strong>Display:</strong> You are solely responsible for printing and displaying the activated QR code clearly and securely on your registered vehicle.</li>
          <li><strong>Proper Use:</strong> You agree to use the Service in a responsible manner. You acknowledge that the purpose of the Service is to resolve urgent parking conflicts and facilitate contact during emergencies.</li>
          <li><strong>Privacy:</strong> You agree to respect the privacy of Scanner Users and use the communication channel solely for resolving the parking issue.</li>
        </ul>
        <h3 className="text-lg font-semibold text-text-primary mt-2">3.2. Obligations of Scanner Users</h3>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Appropriate Use:</strong> The Service must only be used to contact a Registered User regarding an actual, immediate, and urgent parking-related issue or obstruction.</li>
          <li><strong>Respectful Communication:</strong> You agree to be courteous and clear during any communication initiated through the Service. Misuse or harassment is strictly prohibited.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">4. Subscription, Validation, and Renewal</h2>
        <h3 className="text-lg font-semibold text-text-primary mt-2">4.1. Sticker Validation Period</h3>
        <p>The services provided through a single, unique QNECT QR code (the "Sticker") are valid for an initial period of **one (1) year** from the date the QR code is officially activated by the QNECT administrator.</p>
        <h3 className="text-lg font-semibold text-text-primary mt-2">4.2. Service Continuity and Renewal</h3>
        <p>To continue receiving the full range of services, including the critical call routing and number masking functionality, after the initial one-year validation period expires, the Registered User must renew their subscription or service plan. Failure to renew will result in the deactivation of the QR code in the system.</p>
        <h3 className="text-lg font-semibold text-text-primary mt-2">4.3. Pricing</h3>
        <p>The specific pricing, features, and renewal fees for continued service will be communicated to you via the QNECT website and/or email notification prior to the end of your validation period.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">5. Refund policy</h2>
        <p>Approved Refunds will be credited in 7 days</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">6. Privacy and Data Protection</h2>
        <p>QNect prioritizes data privacy and security, as detailed in our separate <Link href="/privacy" className="text-primary-blue hover:text-accent-cyan font-semibold">Privacy Policy</Link>. The Service is designed to maintain the anonymity of both parties by routing calls. We adhere strictly to the principles of the Digital Personal Data Protection Act (DPDPA), 2023.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">7. Termination of Service</h2>
        <p>We reserve the right to suspend or terminate your account and deactivate your QR code immediately, without prior notice or liability, if you breach these Terms. Reasons for termination may include, but are not limited to: providing false information, using the Service for harassment, or attempting to bypass the number masking feature.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">8. Limitation of Liability</h2>
        <p>QNect is a communication enabler and not a parking enforcement or management authority. The Enterprise and its employees shall not be liable for: any direct or indirect damages arising from the use or inability to use the Service; any delay or failure in the call routing mechanism; any disputes, confrontations, or legal issues arising between the Registered User and the Scanner User; or any damage, towing, or vandalism to the vehicle.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">9. Governing Law and Dispute Resolution</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of India. All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in **Delhi, India**.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">10. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">11. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at: <strong>hrconnect@qnect.in</strong></p>
        <p>Or give a call on: <strong>+91 9599751139</strong></p>

      </div>
    </main >
  );
}