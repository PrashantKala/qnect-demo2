export default function CareersPage() {
  
  // This creates the perfect mailto link
  const mailToLink = `mailto:hrconnect@qnect.in?subject=Application for Sales Representative (Delhi)&body=Please attach your resume and cover letter.`;

  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-6 text-center">Join Our Team</h1>
      {/* ... (rest of the intro text) ... */}
      <p className="text-center text-text-secondary mb-10 max-w-xl mx-auto">
        We're building the future of vehicle connectivity and safety. If you're passionate about technology, solving real-world problems, and making a difference, we want to hear from you.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">Our Culture 🤝</h2>
        <p className="text-text-secondary leading-relaxed">
          At QNect, we foster a collaborative, innovative, and fast-paced environment. We value creativity, ownership, and a user-first mindset. We believe in empowering our team members to learn, grow, and contribute directly to our success. We're a small team with big ambitions, working together to build something meaningful.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-primary-blue mb-6">Current Openings 💼</h2>
        <div className="space-y-8">

          {/* Sales Representative Job */}
          <div className="border-b border-border-color pb-6">
            <h3 className="text-xl font-semibold text-primary-blue">Sales Representative</h3>
            <p className="text-sm text-text-secondary">Location: Delhi | Job Type: Full-Time/Part Time (Flexible Timings)</p>

            <div className="mt-4 text-text-secondary space-y-3">
              <p><strong>About Us:</strong> At Qnect, we are committed to delivering top-quality products/services... (rest of text)</p>
              {/* ... All other job details ... */}
              <p><strong>What We Offer:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Performance-based commission on each sale with weekly/monthly payouts.</li>
                <li>Potential to earn 3 to 5 lakhs annually upon completion of internship and targets.</li>
                <li>You can earn around 30k-70k in the internship period itself.</li>
                <li>Opportunities for career growth (e.g., Marketing Trainee, Sales Manager).</li>
                <li>Supportive team environment.</li>
              </ul>
              <p className="font-semibold pt-4">How to Apply:</p>
              <p>Click "Apply Now" to open your email client, or send your CV to <a href="mailto:hrconnect@qnect.in" className="text-primary-blue hover:text-accent-cyan font-semibold">hrconnect@qnect.in</a>.</p>
            </div>
            
            {/* Fix #1: This link now opens the user's default mail client (like Gmail) */}
            <a 
              href={mailToLink}
              className="inline-block px-6 py-3 bg-transparent border-2 border-primary-blue text-primary-blue font-bold rounded-lg transition-all duration-300 hover:bg-primary-blue hover:text-white mt-6"
            >
              Apply Now &rarr;
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}