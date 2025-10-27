export default function CareersPage() {
  return (
    <main className="pt-12 pb-20 container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-blue mb-6 text-center">Join Our Team</h1>
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
              <p><strong>About Us:</strong> At Qnect, we are committed to delivering top-quality products/services and creating exceptional customer experiences. Our system ensures safe, fast, and anonymous communication between people on the go. We believe in smart, contactless, and secure interaction, and our product reflects the future of connected mobility. Join us in bringing smart solutions to everyday driving challenges.</p>
              <p>If you have a passion for sales, enjoy building relationships, and thrive in a fast-paced environment, we want to hear from you!</p>

              <p><strong>Key Responsibilities:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Proactively identify and pursue new sales opportunities.</li>
                <li>Greet and assist customers, understanding their needs to offer the right solutions.</li>
                <li>Achieve or exceed monthly and quarterly sales targets.</li>
                <li>Build strong customer relationships to encourage repeat business.</li>
              </ul>

              <p><strong>Qualifications:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>High School (Bachelor’s degree is a plus).</li>
                <li>Proven experience in sales or customer service preferred.</li>
                <li>Excellent communication and interpersonal skills.</li>
                <li>Self-motivated with a results-driven approach.</li>
              </ul>

              <p><strong>What We Offer:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Performance-based commission on each sale with weekly/monthly payouts.</li>
                <li>Potential to earn 3 to 5 lakhs annually upon completion of internship and targets.</li>
                <li>You can earn around 30k-70k in the internship period itself.</li>
                <li>Opportunities for career growth (e.g., Marketing Trainee, Sales Manager).</li>
                <li>Supportive team environment.</li>
              </ul>

              <p className="font-semibold pt-4">How to Apply:</p>
              <p>Click "Apply Now" below or send your CV to <a href="mailto:hrconnect@qnect.in" className="text-primary-blue hover:text-accent-cyan font-semibold">hrconnect@qnect.in</a>.</p>
            </div>
            <a href="mailto:hrconnect@qnect.in?subject=Application for Sales Representative" 
               className="inline-block px-6 py-3 bg-transparent border-2 border-primary-blue text-primary-blue font-bold rounded-lg transition-all duration-300 hover:bg-primary-blue hover:text-white mt-6">
              Apply Now &rarr;
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}