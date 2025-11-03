import { QueryForm } from '../components/QueryForm';

export default function ContactPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6">
      <h1 className="text-4xl font-bold text-primary-blue mb-10 text-center">
        Get in Touch
      </h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        
        {/* Contact Info Card */}
        <div className="bg-qnect-gradient text-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <div className="space-y-4 text-lg">
            <p>
              <strong>General Inquiries:</strong><br/>
              <a 
                href="mailto:support@qnect.in" 
                className="text-white underline hover:text-cyan-200 transition-colors"
              >
                support@qnect.in
              </a>
            </p>
            <p>
              <strong>Careers:</strong><br/>
              <a 
                href="mailto:hrconnect@qnect.in" 
                className="text-white underline hover:text-cyan-200 transition-colors"
              >
                hrconnect@qnect.in
              </a>
            </p>
            <p>
              <strong>Address:</strong><br/>
              QNect Technologies, Jaipur, Rajasthan, India
            </p>
            <p className="pt-4 border-t border-white/30">
              <strong>Business Hours:</strong><br/>
              Monday - Friday, 10:00 AM - 6:00 PM IST
            </p>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="bg-qnect-gradient text-white p-8 rounded-lg shadow-md">
          <QueryForm formTitle="Send Us a Message" />
        </div>
      </div>
    </main>
  );
}
