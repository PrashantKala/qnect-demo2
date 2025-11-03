export default function CareersPage() {
  // Gmail compose link (opens Gmail compose in a new tab with prefilled To/Subject/Body)
  const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=hrconnect@qnect.in&su=Application for Sales Representative (Delhi)&body=Please attach your resume and cover letter.`;

  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-6 text-center">
        Join Our Team
      </h1>

      <p className="text-center text-text-secondary mb-10 max-w-xl mx-auto">
        We're building the future of vehicle connectivity and safety. If you're
        passionate about technology, solving real-world problems, and making a
        difference, we want to hear from you.
      </p>

      {/* Culture Section - gradient card */}
      <div className="bg-qnect-gradient text-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Culture </h2>
        <p className="text-white/80 leading-relaxed">
          At QNect, we foster a collaborative, innovative, and fast-paced
          environment. We value creativity, ownership, and a user-first mindset.
          We believe in empowering our team members to learn, grow, and
          contribute directly to our success. We're a small team with big
          ambitions, working together to build something meaningful.
        </p>
      </div>

      {/* Openings Section - gradient card */}
      <div className="bg-qnect-gradient text-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Current Openings </h2>

        <div className="space-y-8">
          {/* Sales Representative Job */}
          <div className="border-b border-white/20 pb-6">
            <h3 className="text-xl font-semibold">Sales Representative</h3>
            <p className="text-sm text-white/80">
              Location: Delhi | Job Type: Full-Time/Part Time (Flexible Timings)
            </p>

            <div className="mt-4 text-white/80 space-y-3">
              <p>
                <strong>About Us:</strong> At Qnect, we are committed to
                delivering top-quality products/services... (rest of text)
              </p>

              <p>
                <strong>What We Offer:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Performance-based commission on each sale with weekly/monthly payouts.</li>
                <li>Potential to earn 3 to 5 lakhs annually upon completion of internship and targets.</li>
                <li>You can earn around 30k–70k in the internship period itself.</li>
                <li>Opportunities for career growth (e.g., Marketing Trainee, Sales Manager).</li>
                <li>Supportive team environment.</li>
              </ul>

              <p className="font-semibold pt-4">How to Apply:</p>
              <p>
                Click "Apply Now" to open Gmail in a new tab, or send your CV to{' '}
                <a
                  href="mailto:hrconnect@qnect.in"
                  className="underline text-white hover:text-white/90 font-semibold"
                >
                  hrconnect@qnect.in
                </a>
                .
              </p>
            </div>

            {/* Apply Now button: gradient + white border, opens Gmail in new tab */}
            <div className="mt-6">
              <a
                href={gmailComposeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-qnect-gradient text-white font-bold rounded-lg border-2 border-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90"
              >
                Apply Now &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
