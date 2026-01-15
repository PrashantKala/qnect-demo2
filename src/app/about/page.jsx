export default function AboutPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-blue mb-6">About QNect</h1>
        <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mx-auto">
          QNect is a smart communication and safety technology company created to solve one simple but powerful problem —
          <span className="font-semibold text-primary-blue"> how can someone reach you or help you in an emergency without knowing or sharing your personal mobile number?</span>
        </p>
      </section>

      {/* The Problem */}
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <p className="text-text-secondary leading-relaxed mb-4">
          In today's fast-moving cities, millions of people face everyday situations like wrong parking, blocked vehicles, misplaced property, or urgent emergencies where contacting the owner is critical. Unfortunately, the only options usually involve searching for a phone number, waiting helplessly, or risking damage to vehicles and property. At the same time, most people are understandably concerned about sharing their private phone numbers with strangers.
        </p>
        <p className="text-text-secondary leading-relaxed font-semibold text-primary-blue">
          QNect bridges this gap by combining privacy, safety, and instant connectivity through a secure QR-based platform.
        </p>
      </section>

      {/* How QNect Works */}
      <section className="bg-qnect-gradient text-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold mb-6">How QNect Works</h2>
        <p className="leading-relaxed mb-6 opacity-90">
          QNect provides every user with a unique, encrypted QR code that can be placed on cars, bikes, commercial vehicles, helmets, or any valuable item.
        </p>
        <p className="mb-4 opacity-90">When someone scans this QR code using their smartphone:</p>
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-3">
            <span className="text-accent-cyan font-bold">✓</span>
            <span>They can call the owner instantly through the QNect app</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-cyan font-bold">✓</span>
            <span>They can send secure messages through the QNect platform</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-cyan font-bold">✓</span>
            <span>Neither the caller nor the owner's phone number is revealed</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-cyan font-bold">✓</span>
            <span>No personal information is shared or exposed</span>
          </li>
        </ul>
        <p className="opacity-90 border-t border-white/20 pt-4 mt-4">
          In emergency situations, the same QR code allows the person scanning it to send instant alerts to the owner's pre-added emergency contacts, ensuring that help can reach the right people without delay.
        </p>
      </section>

      {/* Why QNect Exists */}
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-primary-blue mb-6">Why QNect Exists</h2>
        <p className="text-text-secondary leading-relaxed mb-4 font-semibold">
          We believe that privacy and safety should always go hand in hand.
        </p>
        <p className="text-text-secondary leading-relaxed mb-6">
          Traditional solutions force people to choose between sharing their personal number or having no way to be contacted when it truly matters. This often leads to frustration, conflict, unnecessary damage, and lost opportunities to help.
        </p>
        <p className="text-text-secondary mb-4">QNect was built to:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-secondary">
          <li className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="text-primary-blue font-bold text-xl">→</span>
            Reduce disputes and stress caused by wrong parking
          </li>
          <li className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="text-primary-blue font-bold text-xl">→</span>
            Prevent damage to vehicles and property
          </li>
          <li className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="text-primary-blue font-bold text-xl">→</span>
            Enable faster response in emergency situations
          </li>
          <li className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="text-primary-blue font-bold text-xl">→</span>
            Protect the privacy of every user at all times
          </li>
        </ul>
        <p className="text-text-secondary leading-relaxed mt-6 font-medium">
          Our goal is to make everyday urban interactions simpler, safer, and more respectful.
        </p>
      </section>

      {/* Where QNect Is Used */}
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-primary-blue mb-6">Where QNect Is Used</h2>
        <p className="text-text-secondary mb-4">QNect can be used on:</p>
        <ul className="space-y-2 text-text-secondary mb-6">
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
            Cars, bikes, and commercial vehicles
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
            Parking areas and public spaces
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
            Any place where quick, secure, and private contact is important
          </li>
        </ul>
        <p className="text-text-secondary leading-relaxed">
          Whether it's a blocked car, a delivery vehicle, or an urgent situation, QNect makes communication easy without compromising personal security.
        </p>
      </section>

      {/* Our Vision */}
      <section className="bg-qnect-gradient text-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
        <p className="leading-relaxed mb-6 text-lg opacity-90">
          Our vision is to create a nationwide secure contact network where anyone can help anyone — <span className="font-semibold">without compromising privacy.</span>
        </p>
        <p className="mb-4 opacity-90">QNect aims to become India's standard for:</p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-accent-cyan font-bold">•</span>
            <span>QR-based vehicle and asset communication</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-cyan font-bold">•</span>
            <span>Emergency alert and response systems</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-cyan font-bold">•</span>
            <span>Privacy-safe public contact</span>
          </li>
        </ul>
        <p className="opacity-90 leading-relaxed">
          We are building a future where lost items are returned faster, wrong parking no longer leads to damage or conflict, and people can reach each other quickly when it matters most — all while keeping their personal information safe.
        </p>
      </section>

      {/* Closing Statement */}
      <section className="text-center py-8">
        <p className="text-2xl font-bold text-primary-blue">
          QNect is not just a QR code. It is a smarter, safer way to connect.
        </p>
      </section>
    </main>
  );
}