export default function AboutPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">About QNect</h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">We're on a mission to solve the daily frustrations of urban parking with simple, secure technology.</p>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-md space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-3">The Problem</h2>
          <p className="text-text-secondary leading-relaxed">
            We've all been there: your car is blocked in, someone has double-parked, or you see a car with its lights on. In a dense city like Jaipur, these small issues create big frustrations. Leaving your phone number on a note is a privacy nightmare, and finding the owner is nearly impossible.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-3">Our Solution</h2>
          <p className="text-text-secondary leading-relaxed">
            QNect provides a unique QR code for your vehicle. Anyone can scan it, but they don't see your phone number. Instead, our system connects them to your app via a secure, anonymous internet call. You get the alert instantly, resolve the issue, and your personal information is never exposed.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-3">Our Values</h2>
          <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li><strong>Privacy First:</strong> Your phone number is the one thing we will never share.</li>
            <li><strong>Simplicity:</strong> No app is needed for the scanner. It just works.</li>
            <li><strong>Reliability:</strong> Instant Web-to-App calls mean you get the alert immediately, not a missed SMS.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-3">Our Story</h2>
          <p className="text-text-secondary leading-relaxed">
            QNect wasn't born in a boardroom; it was conceived on the busy streets of Jaipur. Our founders, Ayom Jatawat and Prashant Kala, faced the daily frustrations of blocked driveways and inaccessible vehicle owners. They designed QNect as a practical answer to a real-world problem, driven by a passion for using technology to improve everyday life in our cities.
          </p>
        </div>
      </section>
    </main>
  );
}