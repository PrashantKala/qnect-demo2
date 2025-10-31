export default function PrivacyPolicyPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-6">QNect Privacy Policy</h1>
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-text-secondary">
        <p className="font-semibold">Effective Date: October 25, 2025</p>
        <p className="font-semibold">Last Updated: October 25, 2025</p>
        <p>This Privacy Policy explains how QNECT (the "Enterprise" or "we"), operating the "QR-Based Parking Contact System," collects, uses, discloses, and protects your personal data. We are committed to protecting your privacy, especially by ensuring that your direct contact information is never revealed to the connecting party.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">1. Who This Policy Applies To</h2>
        <p>This policy applies to two main categories of users:</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Registered Users / Vehicle Owners:</strong> Individuals who sign up and display a QNECT QR code on their vehicle.</li>
          <li><strong>Scanner Users:</strong> Individuals who scan a QR code on a vehicle to initiate contact.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">2. Information We Collect</h2>
        <h3 className="text-lg font-semibold text-text-primary mt-2">2.1. Information Collected from Registered Users (Vehicle Owners)</h3>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Identity and Contact Data:</strong> Name, Email, Primary Contact Phone Number (used for receiving the bridged call).</li>
          <li><strong>Vehicle Data (Optional):</strong> Vehicle Registration Number.</li>
          <li><strong>Account Data:</strong> Login credentials, password (stored securely/encrypted), and unique QR code ID linked to your account.</li>
          <li><strong>Location Data (Minimal):</strong> General location may be inferred from IP address for security, but not actively tracked as a feature.</li>
          <li><strong>Communication Preferences:</strong> Preferences regarding notifications (email/SMS).</li>
        </ul>
        <h3 className="text-lg font-semibold text-text-primary mt-2">2.2. Information Collected from Scanner Users</h3>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Technical/Connection Data:</strong> IP address, device type, browser information, timestamp of the QR code scan, and the unique identifier of the QR code scanned.</li>
          <li><strong>Call Metadata (Anonymized):</strong> The system records anonymized data about the resulting call, such as the timestamp, duration of the call, and the unique identifiers involved. We do not record the content of the call.</li>
          <li><strong>No Direct Contact Data:</strong> We do not require or collect the Scanner User’s direct phone number or personal identity data for the purpose of initiating contact.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">3. How We Use Your Information</h2>
        <p>We use the collected information for the following core purposes, which are essential for operating the service:</p>
        {/* ... (Table would be complex, simplified to list) ... */}
        <ul className="list-disc list-inside ml-4">
          <li>Facilitating Contact & Call Routing</li>
          <li>User Authentication & Account Management</li>
          <li>QR Code Verification and Activation</li>
          <li>Ensuring Privacy</li>
          <li>System Monitoring and Analytics</li>
          <li>Security and Compliance</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">4. Commitment to Privacy and Anonymity</h2>
        <p>Our core function is built on privacy preservation.</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Number Masking:</strong> When a Scanner User calls the intermediary number, the system connects the call to the Registered User's actual phone number. Crucially, the system ensures that neither the Registered User sees the Scanner User's number nor the Scanner User sees the Registered User's number.</li>
          <li><strong>Data Minimization:</strong> We only collect the necessary personal data required to operate the contact service, aligning with data minimization principles.</li>
          <li><strong>Data Encryption:</strong> All user data is stored securely using encryption.</li>
        </ul>
        
        <h2 className="text-xl font-bold text-primary-blue pt-4">5. Disclosure of Your Information</h2>
        <p>We do not sell or rent your personal data to third parties. We only disclose your information in the following limited circumstances:</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>CPaaS Providers:</strong> We share necessary data (e.g., the target phone number for call routing) with our Communications Platform as a Service (CPaaS) provider to enable the number masking and call bridging functionality.</li>
          <li><strong>Legal Requirements:</strong> If required by law, court order, or governmental regulation.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">6. Data Security and Storage</h2>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Secure Transmission:</strong> Data transmission between your device and our servers is protected using Secure Socket Layer (SSL)/Transport Layer Security (TLS) encryption (HTTPS).</li>
          <li><strong>Access Control:</strong> Access to the Admin Portal and sensitive data is strictly controlled via Role-Based Access Control.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">7. Your Data Principal Rights (Under DPDPA, 2023)</h2>
        <p>As a data principal, you have the following rights concerning your personal data:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Right to Access</li>
          <li>Right to Correction/Grievance Redressal</li>
          <li>Right to Erasure (Withdrawal of Consent)</li>
          <li>Right to Nominate</li>
        </ul>

        <h2 className="text-xl font-bold text-primary-blue pt-4">8. Changes to this Privacy Policy</h2>
        <p>We reserve the right to modify this policy from time to time. Any changes will be posted on this page, and, if significant, we will notify Registered Users via email.</p>

        <h2 className="text-xl font-bold text-primary-blue pt-4">9. Contact Us / Grievance Redressal</h2>
        <p>If you have questions about this Privacy Policy, your data rights, or a complaint regarding the processing of your personal data, please contact our designated Grievance Officer:</p>
        <p><strong>Grievance Officer Name:</strong> Amit</p>
        <p><strong>Email:</strong> hrconnect@qnect.in</p>
        <p><strong>Address:</strong> Jaipur, Rajasthan.</p>
      </div>
    </main>
  );
}