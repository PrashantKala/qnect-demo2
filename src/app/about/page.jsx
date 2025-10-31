export default function AboutPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-7xl">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* COLUMN 1: ABOUT US */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-blue mb-6">About Us</h1>
          <p className="text-text-secondary leading-relaxed mb-4">
            In today's fast-paced world, connectivity and privacy are equally essential. At QNect, we bridge this gap with smart, secure and innovative solutions that make everyday life simpler and safer.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            QNect is a next generation technology company built on the idea that small innovations can solve big problems. Our premier service empowers vehicle owners to stay responsibly connected. Using our smart QR code system, car and bike owners can be contacted instantly in case of emergencies, wrong parking, or urgent assistance – without compromising their privacy.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Here's how it works: Our customers purchase a unique QNect QR code that they can place on their vehicle. When someone needs to contact the owner – say, due to an incorrectly parked vehicle or a roadside emergency – they can simply scan the QR code. The scan allows the person to call/message/alert the owner directly through our secure gateway, without displaying or revealing the owner's personal phone number. Every interaction occurs securely within our encrypted system, ensuring 100% data privacy and security.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Our goal is simple but powerful: to make cities smarter, communications more secure, and human interactions more thoughtful. With QNect, we are redefining how people interact in real-world situations where privacy is often compromised.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            But QNect isn't just a product – it's an evolving ecosystem. We are constantly innovating to add new features that enhance convenience for our users. Our upcoming QNect app will introduce advanced functionalities like:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4 ml-4">
            <li>Guaranteed discounts at registered vehicle detailing shops, vehicle repair shops, vehicle showrooms etc and loyalty benefits from partner brands and service stations.</li>
            <li>Smart parking solutions help users easily find and reserve parking spaces.</li>
            <li>Vehicle management tools that simplify ownership through reminders, reports and digital records.</li>
          </ul>
          <p className="text-text-secondary leading-relaxed mb-4">
            We consider QNect to be more than a utility – it's a lifestyle companion for modern, responsible vehicle owners.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Behind QNect is a team of young, passionate innovators who believe that technology should serve people, not exploit them. Every line of code we write and every feature we design revolves around one guiding principle – privacy with purpose. We are committed to transparency, trust and continuous improvement to ensure that every user feels safe, valued and connected.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            At QNect, our mission is to make communication simple, secure and seamless. Our vision is to build a smarter world where technology brings people closer together without compromising their individual boundaries.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Whether you're a daily commuter, a business owner managing a fleet, or someone who simply cares about responsible parking, QNect provides a smart way to stay connected. Together, we're not just building a product – we're building a movement for secure and intelligent connectivity.
          </p>
          <p className="text-text-secondary leading-relaxed font-bold">
            QNect – Smart Connect. stay safe.
          </p>
        </div>

        {/* COLUMN 2: OUR VISION */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* UPDATED: Classes now match the h1 for visual symmetry 
          */}
          <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-6">Our Vision</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            At QNect, our vision is to create a world where connection and privacy are in perfect balance. We believe communication should be seamless, secure and meaningful – empowering people to stay connected without compromising their personal boundaries.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            In a world that is becoming increasingly connected, privacy often becomes the price we pay for convenience. QNect is built on the belief that this compromise should not exist. Our vision is to redefine digital and physical communications by introducing technology that protects user data while enabling real-world interactions.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            We aspire to make QNect the global standard for secure and smart connectivity, starting with a simple yet powerful innovation – a secure QR-based communication system for vehicle owners. Through this, we aim to solve everyday challenges like wrong parking or emergencies in a way that fosters responsibility, empathy and trust.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            But our vision extends far beyond just QR codes. We envision a future where every QNect user becomes part of a connected ecosystem that enhances mobility, convenience, and security. From smart parking solutions and exclusive partner benefits to intelligent features that simplify daily life, we are shaping an experience that puts users in control of their data and decisions.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Our ultimate goal is to create a privacy-first digital network that strengthens community connections while protecting individual identities. We see QNect as a symbol of trust, innovation and responsible technology – a company that leads the way in changing the way people interact with the world around them.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            At QNect, we're not just imagining the future – we're engineering it, one secure connection at a time.
          </p>
        </div>
      </section>
    </main>
  );
}